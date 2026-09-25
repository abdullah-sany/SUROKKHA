import React, { useState, useRef, useEffect } from 'react';
import { Mic, Image as ImageIcon, Send, X, AlertCircle, Loader2 } from 'lucide-react';
import { AnalysisResponse } from '../types';
import { useLanguage } from '../context/LanguageContext';
import ProgressStepIndicator from './ProgressStepIndicator';

interface AnalysisCardProps {
  onResult: (result: AnalysisResponse, queryText?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function AnalysisCard({ onResult, isLoading, setIsLoading }: AnalysisCardProps) {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPG, PNG, and WEBP images are supported.');
        return;
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      if ('vibrate' in navigator) navigator.vibrate(50);
    } catch (err) {
      console.error(err);
      setError('Voice input is not supported in this browser or permission denied. আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়।');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob);

      const res = await fetch('/api/specialist-guide/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to transcribe audio.');
      }

      const data = await res.json();
      setText(prev => prev ? prev + ' ' + data.text : data.text);
    } catch (err: any) {
      setError(err.message || 'Error transcribing audio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const [loadingStep, setLoadingStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);
  const [preferredEngine, setPreferredEngine] = useState<'auto' | 'gemini' | 'groq'>('auto');

  useEffect(() => {
    if (isLoading) {
      setProgressPercent(12);
      setLoadingStep(0);

      const startTime = Date.now();
      let lastStep = 0;

      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;

        let nextStep = 0;
        let nextPercent = 12;

        if (elapsed < 2.2) {
          nextStep = 0; // Analyzing...
          nextPercent = 12 + (elapsed / 2.2) * 26; // 12% to 38%
        } else if (elapsed < 5.0) {
          nextStep = 1; // Formulating...
          nextPercent = 38 + ((elapsed - 2.2) / 2.8) * 34; // 38% to 72%
        } else {
          nextStep = 2; // Preparing Result...
          nextPercent = 72 + Math.min(24, ((elapsed - 5.0) / 4.0) * 24); // 72% to 96%
        }

        if (nextStep !== lastStep) {
          lastStep = nextStep;
          if ('vibrate' in navigator) navigator.vibrate(25);
        }

        setLoadingStep(nextStep);
        setProgressPercent(nextPercent);
      }, 100);

      return () => clearInterval(interval);
    } else {
      setLoadingStep(0);
      setProgressPercent(12);
    }
  }, [isLoading]);

  const getLoadingText = () => {
    if (isBn) {
      const bnSteps = [
        "Analyzing... (বিশ্লেষণ করা হচ্ছে)",
        "Formulating... (পরামর্শ প্রণয়ন)",
        "Preparing Result... (ফলাফল প্রস্তুত)"
      ];
      return bnSteps[loadingStep] || bnSteps[0];
    }
    const enSteps = [
      "Analyzing...",
      "Formulating...",
      "Preparing Result..."
    ];
    return enSteps[loadingStep] || enSteps[0];
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError(isBn ? 'অনুগ্রহ করে আপনার সমস্যা সম্পর্কে বিস্তারিত লিখুন।' : 'Please provide a description of your concern.');
      return;
    }
    
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('situationText', text);
      // Let backend use selected UI language as primary instruction
      formData.append('language', language);
      formData.append('preferredEngine', preferredEngine);
      
      if (image) {
        formData.append('image', image);
      }

      const res = await fetch('/api/specialist-guide/analyze', {
        method: 'POST',
        body: formData,
      });

      let data: any = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const rawText = await res.text();
        try {
          data = JSON.parse(rawText);
        } catch {
          // Non-JSON response (e.g. gateway timeout or HTML error)
          data = null;
        }
      }
      
      if (!res.ok) {
        throw new Error(data?.error || (isBn ? 'বিশ্লেষণ করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Failed to analyze concern. Please try again.'));
      }

      if (!data) {
        throw new Error(isBn ? 'সার্ভার থেকে সঠিক ডেটা পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Invalid server response. Please try again.');
      }

      if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
      onResult(data, text.trim());
    } catch (err: any) {
      setError(err.message || (isBn ? 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'An unexpected error occurred. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          {isBn ? (
            <>
              <h3 className="text-xl font-bold text-slate-900">আপনার কী সমস্যা হচ্ছে?</h3>
              <p className="text-sm text-slate-500 mt-2">
                আপনার লক্ষণ বা স্বাস্থ্য সমস্যা সম্পর্কে যতখানি সম্ভব বিস্তারিতভাবে জানান।
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-slate-900">Tell Us What You're Experiencing</h3>
              <p className="text-sm text-slate-500 mt-2">
                Describe your symptoms or health concern in as much detail as you are comfortable sharing.
              </p>
            </>
          )}
        </div>

        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading || isRecording || isTranscribing}
            className="w-full h-32 md:h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 resize-none transition-all placeholder:text-slate-400"
            placeholder={isBn ? "উদাহরণ: আমি কয়েকদিন ধরে তীব্র ক্লান্তি ও মাথা ঘোরা অনুভব করছি।" : "Example: I have been feeling intense dizziness and fatigue for several days."}
          />

          {/* Quick Rural Symptom Examples Chips */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <span>💡 {isBn ? 'সাধারণ সমস্যা বা নমুনা লক্ষণ (ট্যাপ করুন):' : 'Common health symptoms (Tap to test):'}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                {
                  bn: 'সারাদিন শরীর দুর্বল, মাথা ঘোরে ও তীব্র ক্লান্তি লাগে',
                  en: 'Extreme fatigue, body weakness and lightheadedness'
                },
                {
                  bn: 'কয়েকদিন ধরে পেটে মোচড় দিয়ে ডায়রিয়া ও বমিভাব',
                  en: 'Frequent watery diarrhea, abdominal cramps and nausea'
                },
                {
                  bn: 'বুকের বাঁ পাশে চাপচাপ চিনচিন ব্যথা ও শ্বাসকষ্ট',
                  en: 'Chest pressure, shortness of breath, left side pain'
                },
                {
                  bn: 'মাঠে কাজ করার পর তীব্র তাপদাহে মাথা যন্ত্রণা ও গা গরম',
                  en: 'Heat exhaustion, severe headache after working under the sun'
                },
                {
                  bn: 'হঠাৎ এক হাত অবশ লাগছে ও কথা কিছুটা জড়িয়ে যাচ্ছে',
                  en: 'Sudden numbness in one arm and slightly slurred speech'
                }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText(isBn ? chip.bn : chip.en)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-[11px] sm:text-xs text-slate-600 border border-slate-200/80 transition-colors text-left"
                >
                  {isBn ? chip.bn : chip.en}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading || isTranscribing}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  isRecording 
                    ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                } disabled:opacity-50`}
              >
                <Mic size={16} />
                <span>{isRecording ? (isBn ? 'শোনা হচ্ছে... থামাতে ক্লিক করুন' : 'Listening... Click to stop') : (isBn ? 'ভয়েস ইনপুট' : 'Voice Input')}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || !!image}
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <ImageIcon size={16} />
                <span className="hidden sm:inline">{isBn ? 'ছবি যুক্ত করুন (ঐচ্ছিক)' : 'Add optional image'}</span>
                <span className="sm:hidden">{isBn ? 'ছবি' : 'Image'}</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
              />
            </div>
            
            {(isTranscribing) && (
              <div className="flex items-center space-x-2 text-sm text-teal-600 font-medium">
                <Loader2 size={16} className="animate-spin" />
                <span>{isBn ? 'ট্রান্সক্রাইব করা হচ্ছে...' : 'Transcribing...'}</span>
              </div>
            )}
          </div>

          {previewUrl && (
            <div className="relative inline-block mt-4">
              <img src={previewUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-slate-200" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-white rounded-full shadow-sm border border-slate-200 p-1 text-slate-500 hover:text-rose-500"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {isLoading && (
            <div className="pt-2">
              <ProgressStepIndicator
                currentStep={loadingStep}
                progressPercent={progressPercent}
                isBn={isBn}
              />
            </div>
          )}

          {error && (
            <div className="flex items-start space-x-2 text-rose-600 bg-rose-50 p-3 rounded-lg text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-5 md:p-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            {isBn 
              ? 'আপনার দেওয়া তথ্য নির্দেশনা তৈরির জন্য ব্যবহার করা হয় এবং এটি কোনো চিকিৎসা রেকর্ড হিসেবে সংরক্ষিত নয়।'
              : 'Your information is used to generate guidance and should not be treated as a medical record.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          {/* AI Engine Switcher */}
          <div className="inline-flex items-center p-1 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold">
            <span className="text-[11px] text-slate-500 px-2 font-medium hidden sm:inline">
              {isBn ? 'ইঞ্জিন:' : 'Engine:'}
            </span>
            <button
              type="button"
              onClick={() => setPreferredEngine('auto')}
              className={`px-2.5 py-1 rounded-full transition-all text-xs ${
                preferredEngine === 'auto'
                  ? 'bg-teal-600 text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={isBn ? "স্মার্ট অটো-ব্যালেন্স (ডুয়েল ইঞ্জিন)" : "Smart Auto Failover"}
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => setPreferredEngine('groq')}
              className={`px-2.5 py-1 rounded-full transition-all text-xs flex items-center space-x-1 ${
                preferredEngine === 'groq'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
              title="Groq LPU Ultra Fast Clinical Reasoning"
            >
              <span>⚡ Groq LPU</span>
            </button>
            <button
              type="button"
              onClick={() => setPreferredEngine('gemini')}
              className={`px-2.5 py-1 rounded-full transition-all text-xs ${
                preferredEngine === 'gemini'
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-blue-700'
              }`}
              title="Google Gemini 3.8 Multimodal"
            >
              Gemini
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || isRecording || isTranscribing || !text.trim()}
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2 text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{getLoadingText()}</span>
              </>
            ) : (
              <>
                <span>{isBn ? 'সমস্যা বিশ্লেষণ করুন' : 'ANALYZE CONCERN'}</span>
                <Send size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
