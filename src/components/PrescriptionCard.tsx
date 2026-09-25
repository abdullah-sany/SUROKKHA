import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, FileText, AlertCircle, Loader2, X, Sparkles, Check, Stethoscope, Image as ImageIcon } from 'lucide-react';
import { PrescriptionAnalysisResponse } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PrescriptionCardProps {
  onResult: (result: PrescriptionAnalysisResponse, imageUrl?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function PrescriptionCard({ onResult, isLoading, setIsLoading }: PrescriptionCardProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Loading animation states
  const [loadingStep, setLoadingStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);

  const steps = [
    {
      labelEn: 'Scanning Prescription OCR...',
      labelBn: 'হাতের লেখা ও প্রেসক্রিপশন স্ক্যানিং...',
      detailEn: 'Transcribing doctor handwriting & layout',
      detailBn: 'ডাক্তারের হাতের লেখা ও টেক্সট পাঠ করা হচ্ছে',
    },
    {
      labelEn: 'Standardizing Medicines...',
      labelBn: 'ওষুধ ও ডোজ যাচাই...',
      detailEn: 'Cross-checking standard drug names & timings',
      detailBn: 'প্রমিত ওষুধের নাম, মাত্রা ও গ্রহণের সময় যাচাই',
    },
    {
      labelEn: 'Translating & Safety Review...',
      labelBn: 'বাংলা অনুবাদ ও নিরাপত্তা পর্যালোচনা...',
      detailEn: 'Generating Bengali explanations & safety notices',
      detailBn: 'সহজ বাংলায় নির্দেশিকা ও সতর্কতা প্রস্তুত করা হচ্ছে',
    },
  ];

  useEffect(() => {
    if (isLoading) {
      setProgressPercent(15);
      setLoadingStep(0);
      const startTime = Date.now();
      let lastStep = 0;

      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        let nextStep = 0;
        let nextPercent = 15;

        if (elapsed < 2.5) {
          nextStep = 0;
          nextPercent = 15 + (elapsed / 2.5) * 30; // 15% to 45%
        } else if (elapsed < 5.5) {
          nextStep = 1;
          nextPercent = 45 + ((elapsed - 2.5) / 3.0) * 30; // 45% to 75%
        } else {
          nextStep = 2;
          nextPercent = 75 + Math.min(22, ((elapsed - 5.5) / 4.0) * 22); // 75% to 97%
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
      setProgressPercent(15);
    }
  }, [isLoading]);

  const handleFile = (file: File) => {
    setError(null);
    if (file.size > 12 * 1024 * 1024) {
      setError(isBn ? 'ছবির সাইজ ১২ মেগাবাইটের কম হতে হবে।' : 'Image must be under 12MB.');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(isBn ? 'শুধুমাত্র JPG, PNG অথবা WEBP ফরম্যাট সমর্থিত।' : 'Only JPG, PNG, and WEBP are supported.');
      return;
    }
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Helper to test with a realistic sample prescription
  const handleLoadSample = async () => {
    setError(null);
    try {
      // Create a canvas-based realistic demo prescription image
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 1000);

      // Header Banner
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(40, 40, 720, 8);

      // Doctor Details
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('Dr. K. M. Rahman, MBBS, FCPS (Medicine)', 50, 85);
      ctx.font = '15px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Associate Professor, Internal Medicine | Reg: A-45892', 50, 110);
      ctx.fillText('Popular Medical Center & Hospital, Dhanmondi, Dhaka', 50, 130);

      // Divider line
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(50, 150);
      ctx.lineTo(750, 150);
      ctx.stroke();

      // Patient Info
      ctx.fillStyle = '#334155';
      ctx.font = '15px sans-serif';
      ctx.fillText('Patient Name: Mohammad Rafiqul Islam', 50, 180);
      ctx.fillText('Age: 48 Yrs    Sex: Male', 450, 180);
      ctx.fillText('Date: 14/09/2026', 640, 180);

      ctx.beginPath();
      ctx.moveTo(50, 200);
      ctx.lineTo(750, 200);
      ctx.stroke();

      // Rx Symbol
      ctx.fillStyle = '#0f766e';
      ctx.font = 'bold 36px serif';
      ctx.fillText('Rx', 50, 255);

      // Handwritten / printed medicines
      ctx.font = 'bold 20px serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('1. Tab. Napa Extra (Paracetamol 500mg + Caffeine 65mg)', 70, 310);
      ctx.font = '17px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('    1 + 0 + 1  ----  খাওয়ার পর (after food) ---- ৫ দিন (5 days)', 70, 340);

      ctx.font = 'bold 20px serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('2. Cap. Seclo 20mg (Omeprazole)', 70, 395);
      ctx.font = '17px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('    1 + 0 + 1  ----  খাওয়ার ২০ মিনিট আগে (before food) ---- ১৪ দিন', 70, 425);

      ctx.font = 'bold 20px serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('3. Tab. Monas 10mg (Montelukast)', 70, 480);
      ctx.font = '17px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('    0 + 0 + 1  ----  রাতে শোবার আগে (at night) ---- ১ মাস', 70, 510);

      ctx.font = 'bold 20px serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('4. Syp. Tofen (Ketotifen 1mg/5ml)', 70, 565);
      ctx.font = '17px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('    ২ চামচ করে দিনে ২ বার (খাওয়ার পর) ---- ৭ দিন', 70, 595);

      // Investigations Box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(50, 660, 700, 160);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(50, 660, 700, 160);

      ctx.fillStyle = '#0f766e';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Suggested Clinical Investigations (পরীক্ষা):', 70, 695);
      ctx.fillStyle = '#1e293b';
      ctx.font = '15px sans-serif';
      ctx.fillText('• CBC with ESR (রক্তের সাধারণ পরীক্ষা)', 85, 730);
      ctx.fillText('• Serum Creatinine (কিডনির কার্যকারিতা পরীক্ষা)', 85, 760);
      ctx.fillText('• Chest X-ray P/A view (বুকের এক্স-রে)', 85, 790);

      // Signature
      ctx.font = 'italic 18px cursive, serif';
      ctx.fillStyle = '#1e3a8a';
      ctx.fillText('Dr. Rahman', 600, 890);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Doctor\'s Signature', 600, 915);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], 'sample_doctor_prescription.png', { type: 'image/png' });
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      }, 'image/png');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError(isBn ? 'অনুগ্রহ করে প্রেসক্রিপশনের একটি ছবি আপলোড করুন।' : 'Please upload or capture a prescription image.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', image);
      if (notes.trim()) {
        formData.append('notes', notes.trim());
      }

      const res = await fetch('/api/prescription/analyze', {
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
          data = null;
        }
      }

      if (!res.ok) {
        throw new Error(data?.error || (isBn ? 'প্রেসক্রিপশন বিশ্লেষণ ব্যর্থ হয়েছে। অনুগ্রহ করে পরিষ্কার ছবি দিয়ে আবার চেষ্টা করুন।' : 'Failed to analyze prescription. Please try again.'));
      }

      if (!data) {
        throw new Error(isBn ? 'সার্ভার থেকে সঠিক তথ্য পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Invalid server response. Please try again.');
      }

      onResult(data as PrescriptionAnalysisResponse, previewUrl || undefined);
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isBn ? 'সার্ভার ত্রুটি হয়েছে। আবার চেষ্টা করুন।' : 'An error occurred. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200/80 p-5 sm:p-8 space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles size={13} className="text-teal-600" />
            <span>{isBn ? 'প্রেসক্রিপশন রিডার ও অনুবাদক' : 'Doctor Prescription OCR & Translator'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isBn ? 'ডাক্তারের প্রেসক্রিপশন স্ক্যান করুন' : 'Scan & Understand Doctor Prescriptions'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isBn
              ? 'ডাক্তারের হাতের লেখা, ওষুধের নাম, খাওয়ার নিয়ম ও পরীক্ষার বিস্তারিত বাংলায় সহজভাবে জেনে নিন।'
              : 'Transcribe handwritten or printed prescriptions into clear, structured Bengali instructions.'}
          </p>
        </div>

        {/* Quick Sample Button */}
        {!image && !isLoading && (
          <button
            type="button"
            onClick={handleLoadSample}
            className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 transition-colors flex items-center space-x-1"
          >
            <FileText size={13} />
            <span>{isBn ? 'নমুনা প্রেসক্রিপশন' : 'Try Sample'}</span>
          </button>
        )}
      </div>

      {/* Upload Dropzone */}
      {!previewUrl ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-teal-200 hover:border-teal-400 bg-teal-50/20 hover:bg-teal-50/40 rounded-2xl p-6 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
            <Upload size={28} />
          </div>

          <div className="space-y-1 max-w-sm">
            <p className="text-sm sm:text-base font-bold text-slate-800">
              {isBn ? 'প্রেসক্রিপশনের ছবি আপলোড করুন' : 'Click or drag & drop prescription image'}
            </p>
            <p className="text-xs text-slate-500">
              {isBn ? 'ক্যামেরা দিয়ে ছবি তুলুন অথবা গ্যালারি থেকে JPG, PNG ফাইল নির্বাচন করুন (সর্বোচ্চ ১২ MB)' : 'Take a photo or choose JPG, PNG, WEBP (Max 12MB)'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <ImageIcon size={15} />
              <span>{isBn ? 'ফাইল বেছে নিন' : 'Choose File'}</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Camera size={15} />
              <span>{isBn ? 'ক্যামেরা চালু করুন' : 'Take Photo'}</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        /* Image Preview Box */
        <div className="space-y-4">
          <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 flex items-center justify-center max-h-96">
            <img
              src={previewUrl}
              alt="Prescription Preview"
              className="max-h-96 w-auto object-contain"
            />
            {!isLoading && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors shadow-md"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            )}
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
              <Stethoscope size={13} className="text-teal-400" />
              <span>{isBn ? 'প্রেসক্রিপশন লোড করা হয়েছে' : 'Prescription ready for scan'}</span>
            </div>
          </div>

          {/* Optional Patient Context / Notes */}
          {!isLoading && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>{isBn ? 'অতিরিক্ত মন্তব্য বা লক্ষণ (ঐচ্ছিক)' : 'Additional Patient Notes (Optional)'}</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {isBn ? 'যেমন: কয় দিন ধরে খাচ্ছেন' : 'e.g., Duration of fever'}
                </span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isBn ? 'যেমন: কোনো ওষুধে অ্যালার্জি আছে কিনা বা কয় দিন ধরে খাচ্ছেন...' : 'e.g., Any known drug allergies or treatment history...'}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
              />
            </div>
          )}
        </div>
      )}

      {/* Progress Step Indicator during OCR */}
      {isLoading && (
        <div className="w-full bg-gradient-to-b from-teal-50/80 via-teal-50/40 to-slate-50 border border-teal-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-600"></span>
              </span>
              <span className="text-xs font-bold text-teal-900 tracking-wide uppercase flex items-center space-x-1">
                <Sparkles size={12} className="text-teal-600 mr-0.5" />
                <span>{isBn ? 'প্রেসক্রিপশন এআই ওসিআর প্রসেসিং' : 'SUROKKHA Prescription AI Engine'}</span>
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-teal-700 bg-white px-2 py-0.5 rounded-md border border-teal-200 shadow-2xs">
              {Math.round(progressPercent)}%
            </span>
          </div>

          <div className="relative w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(10, progressPercent))}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {steps.map((s, idx) => {
              const isDone = loadingStep > idx;
              const isActive = loadingStep === idx;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                    isActive ? 'bg-white shadow-2xs border border-teal-300' : isDone ? 'bg-teal-50/50' : 'opacity-60'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 text-xs ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isActive
                        ? 'bg-teal-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? <Check size={13} className="stroke-[3]" /> : isActive ? <Loader2 size={13} className="animate-spin" /> : idx + 1}
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 leading-tight">
                    {isBn ? s.labelBn : s.labelEn}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white/80 border border-teal-100 rounded-xl px-3 py-2 text-center text-xs text-teal-800 flex items-center justify-center space-x-1.5">
            <Loader2 size={13} className="animate-spin text-teal-600 shrink-0" />
            <span className="font-medium">
              {isBn ? steps[loadingStep]?.detailBn : steps[loadingStep]?.detailEn}
            </span>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="flex items-start space-x-2 text-rose-600 bg-rose-50 p-3.5 rounded-xl text-xs sm:text-sm border border-rose-200">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        disabled={isLoading || !image}
        onClick={handleSubmit}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all shadow-xs ${
          isLoading || !image
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-700/10 hover:shadow-md'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>{isBn ? 'প্রেসক্রিপশন বিশ্লেষণ হচ্ছে...' : 'Transcribing Prescription...'}</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>{isBn ? 'প্রেসক্রিপশন বিশ্লেষণ ও অনুবাদ করুন' : 'Transcribe & Translate Prescription'}</span>
          </>
        )}
      </button>

      {/* Ephemeral Privacy Note */}
      <div className="text-center text-[11px] text-slate-500">
        {isBn
          ? '🔒 প্রেসক্রিপশনের ছবি শুধুমাত্র সাময়িক মেমরিতে প্রক্রিয়াজাত হয় এবং কোনো ব্যক্তিগত তথ্য সংরক্ষণ করা হয় না।'
          : '🔒 Prescription images are processed ephemerally in secure memory and never permanently stored.'}
      </div>
    </div>
  );
}
