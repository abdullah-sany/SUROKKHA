import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  X, 
  AlertCircle, 
  HeartPulse, 
  ShieldAlert, 
  FlaskConical, 
  RefreshCw, 
  CheckCircle2,
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DrugSafetyCheckResponse, DrugSafetyMatrix } from '../types';
import DrugSafetyMatrixView from './DrugSafetyMatrixView';

interface PresetCase {
  id: string;
  nameBn: string;
  nameEn: string;
  medicines: string[];
  conditions: string[];
  tag: string;
  tagColor: string;
}

export default function DrugSafetyChecker() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [inputMedicine, setInputMedicine] = useState('');
  const [medicines, setMedicines] = useState<string[]>([
    'Tab. Ciprofloxacin 500mg',
    'Suspension Antacid (Aluminium/Magnesium)'
  ]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['গ্যাস্ট্রিক / পেপটিক আলসার']);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DrugSafetyCheckResponse | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [preferredEngine, setPreferredEngine] = useState<'auto' | 'gemini' | 'groq'>('auto');

  // Common Health Conditions for Toggling
  const availableConditions = isBn
    ? [
        'উচ্চ রক্তচাপ (Hypertension)',
        'ডায়াবেটিস (Diabetes)',
        'কিডনি রোগ (Kidney Disease)',
        'গ্যাস্ট্রিক / পেপটিক আলসার',
        'গর্ভকালীন সময় (Pregnancy)',
        'লিভারের সমস্যা (Liver Disease)',
        'হৃদরোগ (Heart Disease)'
      ]
    : [
        'Hypertension',
        'Diabetes Mellitus',
        'Chronic Kidney Disease',
        'Gastric / Peptic Ulcer',
        'Pregnancy / Lactation',
        'Liver Disease',
        'Heart Disease'
      ];

  // Presets designed to impress judges at the Innovation Fair
  const presets: PresetCase[] = [
    {
      id: 'case-cipro-antacid',
      nameBn: 'সিপ্রোফ্লক্সাসিন + অ্যান্টাসিড (অ্যাবজরপশন বাধা)',
      nameEn: 'Ciprofloxacin + Antacid (Absorption Block)',
      medicines: ['Tab. Ciprofloxacin 500mg', 'Antacid Gel / Suspension'],
      conditions: ['গ্যাস্ট্রিক / পেপটিক আলসার'],
      tag: isBn ? 'টাইমিং প্রয়োজন' : 'Timing Critical',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'case-aspirin-warfarin',
      nameBn: 'অ্যাসপিরিন + ওয়ারফারিন (মারাত্মক রক্তক্ষরণ ঝুঁকি)',
      nameEn: 'Aspirin + Warfarin (Severe Bleeding Risk)',
      medicines: ['Tab. Aspirin 75mg', 'Tab. Warfarin 5mg'],
      conditions: ['হৃদরোগ (Heart Disease)', 'উচ্চ রক্তচাপ (Hypertension)'],
      tag: isBn ? '🚨 চরম ঝুঁকিপূর্ণ' : '🚨 Critical Hazard',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    {
      id: 'case-napa-paracetamol',
      nameBn: 'নাপা এক্সট্রা + এইস প্লাস (দ্বিগুণ প্যারাসিটামল বিষক্রিয়া)',
      nameEn: 'Napa Extra + Ace Plus (Double Dose Toxicity)',
      medicines: ['Tab. Napa Extra 500/65mg', 'Tab. Ace Plus 500/65mg'],
      conditions: [],
      tag: isBn ? 'ওভারডোজ সতর্কতা' : 'Duplicate Dose',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    {
      id: 'case-safe-trio',
      nameBn: 'মেটফরমিন + লোসার্টান + অ্যাটোরভাস্ট্যাটিন (নিরাপদ কম্বো)',
      nameEn: 'Metformin + Losartan + Atorvastatin (Standard Safe)',
      medicines: ['Tab. Metformin 500mg', 'Tab. Losartan Potassium 50mg', 'Tab. Atorvastatin 10mg'],
      conditions: ['ডায়াবেটিস (Diabetes)', 'উচ্চ রক্তচাপ (Hypertension)'],
      tag: isBn ? '✅ নিরাপদ কম্বিনেশন' : '✅ Standard Safe',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  ];

  const handleAddMedicine = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputMedicine.trim();
    if (!trimmed) return;

    if (!medicines.some(m => m.toLowerCase() === trimmed.toLowerCase())) {
      setMedicines([...medicines, trimmed]);
      setInputMedicine('');
      setError(null);
    }
  };

  const handleRemoveMedicine = (indexToRemove: number) => {
    setMedicines(medicines.filter((_, idx) => idx !== indexToRemove));
  };

  const handleToggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter(c => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  const handleApplyPreset = (preset: PresetCase) => {
    setMedicines(preset.medicines);
    setSelectedConditions(preset.conditions);
    setResult(null);
    setError(null);
  };

  const handleRunSafetyCheck = async () => {
    if (medicines.length < 2) {
      setError(
        isBn 
          ? 'পারস্পরিক প্রতিক্রিয়া পরীক্ষা করার জন্য কমপক্ষে ২টি ওষুধের নাম যোগ করুন।' 
          : 'Please add at least 2 medications to check for drug-drug interactions.'
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch('/api/drug-safety/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          medicines,
          patientConditions: selectedConditions,
          language: isBn ? 'bn' : 'en',
          preferredEngine
        })
      });

      clearInterval(stepInterval);

      let data: any = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const rawText = await response.text();
        try {
          data = JSON.parse(rawText);
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        throw new Error(data?.error || (isBn ? 'ড্রাগ সেফটি পরীক্ষা ব্যর্থ হয়েছে।' : 'Failed to check drug safety'));
      }

      if (!data) {
        throw new Error(isBn ? 'সার্ভার থেকে সঠিক ফলাফল পাওয়া যায়নি।' : 'Invalid response from server.');
      }

      setResult(data as DrugSafetyCheckResponse);
      // Smooth scroll to result
      setTimeout(() => {
        const el = document.getElementById('safety-matrix-result');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error(err);
      setError(err.message || (isBn ? 'ড্রাগ সেফটি পরীক্ষা ব্যর্থ হয়েছে।' : 'Failed to analyze drug interactions.'));
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Intro Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/70 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-teal-100 text-teal-800 border border-teal-200">
                  {isBn ? 'উদ্ভাবনী ফিচার' : 'Innovation Fair Highlight'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  AI Polypharmacy & Clinical Safety Engine
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {isBn 
                  ? 'ড্রাগ ইন্টারঅ্যাকশন ও সেফটি ম্যাট্রিক্স চেকার' 
                  : 'Clinical Drug-Drug Interaction & Safety Matrix'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isBn 
                  ? 'একাধিক ওষুধ একসাথে খেলে কোনো বিপদ বা পার্শ্বপ্রতিক্রিয়া হবে কিনা তা এআই ফার্মাকোলজিস্ট দিয়ে তৎক্ষণাৎ পরীক্ষা করুন।' 
                  : 'Check multiple medicines concurrently to detect adverse interactions, timing conflicts, and dietary warnings.'}
              </p>
            </div>
            
            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100 self-start sm:self-auto text-teal-700">
              <FlaskConical size={26} />
            </div>
          </div>

          {/* Quick Presets for Innovation Fair Demonstration */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles size={14} className="text-teal-600" />
                <span>{isBn ? 'ইনোভেশন ফেয়ার লাইভ ডেমো টেস্ট কেস (১-ক্লিক ট্রায়াল):' : 'Live Demo Cases (1-Click Test):'}</span>
              </label>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                {isBn ? 'পরীক্ষা করতে যেকোনোটিতে চাপুন' : 'Click to load scenario'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-teal-50/50 hover:border-teal-300 text-left transition-all group"
                >
                  <div className="pr-2">
                    <span className="text-xs font-bold text-slate-800 block group-hover:text-teal-800">
                      {isBn ? preset.nameBn : preset.nameEn}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {preset.medicines.join(' + ')}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${preset.tagColor}`}>
                    {preset.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Medicines Input & List */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {isBn ? 'ওষুধের তালিকা (ওষুধের নাম লিখুন অথবা ড্রপডাউন থেকে যোগ করুন):' : 'Medications to Check (Add 2 or more):'}
            </label>

            {/* Input Form */}
            <form onSubmit={handleAddMedicine} className="flex gap-2">
              <input
                type="text"
                value={inputMedicine}
                onChange={e => setInputMedicine(e.target.value)}
                placeholder={isBn ? 'যেমন: Tab. Napa Extra, Cap. Seclo, Tab. Aspirin...' : 'e.g., Tab. Napa Extra 500mg, Warfarin 5mg...'}
                className="flex-grow px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center space-x-1 shrink-0"
              >
                <Plus size={16} />
                <span>{isBn ? 'যোগ করুন' : 'Add'}</span>
              </button>
            </form>

            {/* Added Medicine Chips */}
            <div className="flex flex-wrap gap-2 pt-1 min-h-[38px]">
              {medicines.length === 0 ? (
                <span className="text-xs text-slate-400 italic">
                  {isBn ? 'কোনো ওষুধ যোগ করা হয়নি। উপরে লিখে "যোগ করুন" চাপুন।' : 'No medicines added yet.'}
                </span>
              ) : (
                medicines.map((med, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold"
                  >
                    <span>{med}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(idx)}
                      className="text-teal-600 hover:text-rose-600 p-0.5 rounded-full hover:bg-teal-100 transition-colors"
                      title="Remove"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Patient Pre-existing Conditions Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {isBn 
                ? 'রোগীর কোনো পূর্ববর্তী শারীরিক জটিলতা আছে কি? (ঐচ্ছিক):' 
                : 'Patient Pre-existing Conditions (Optional):'}
            </label>

            <div className="flex flex-wrap gap-1.5">
              {availableConditions.map((cond, idx) => {
                const isSelected = selectedConditions.includes(cond);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleCondition(cond)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {cond}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center space-x-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Engine Selector & Run Action Button */}
          <div className="pt-3 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2 px-1">
              <span className="text-xs text-slate-500 font-medium">
                {isBn ? 'বিশ্লেষণ ইঞ্জিন নির্বাচন:' : 'Pharmacovigilance Engine:'}
              </span>
              <div className="inline-flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPreferredEngine('auto')}
                  className={`px-3 py-1 rounded-full transition-all ${
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
                  className={`px-3 py-1 rounded-full transition-all flex items-center space-x-1 ${
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
                  className={`px-3 py-1 rounded-full transition-all ${
                    preferredEngine === 'gemini'
                      ? 'bg-blue-600 text-white shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-blue-700'
                  }`}
                  title="Google Gemini 3.8"
                >
                  Gemini
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunSafetyCheck}
              disabled={isLoading || medicines.length < 2}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base text-white shadow-md transition-all flex items-center justify-center space-x-2 ${
                isLoading || medicines.length < 2
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                  : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin text-white" />
                  <span>
                    {loadingStep === 1 && (isBn ? 'ওষুধসমূহের তালিকা বিশ্লেষণ হচ্ছে...' : 'Screening medication ingredients...')}
                    {loadingStep === 2 && (isBn ? 'ড্রাগ-ড্রাগ ইন্টারঅ্যাকশন ও সাইড-ইফেক্ট যাচাই...' : 'Computing interaction mechanisms...')}
                    {loadingStep >= 3 && (isBn ? 'নিরাপত্তা স্কোর ও বাংলা পরামর্শ সংকলন হচ্ছে...' : 'Formulating safety score & guidance...')}
                  </span>
                </>
              ) : (
                <>
                  <ShieldAlert size={18} />
                  <span>
                    {isBn 
                      ? 'ড্রাগ ইন্টারঅ্যাকশন ও সেফটি পরীক্ষা করুন' 
                      : 'Run Drug Interaction & Safety Analysis'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div id="safety-matrix-result" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 size={20} className="text-teal-600" />
                <span>{isBn ? 'বিশ্লেষণ ফলাফল' : 'Clinical Analysis Result'}</span>
              </h3>
              {result.engineUsed && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {result.engineUsed}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            >
              {isBn ? 'নতুন পরীক্ষা করুন' : 'New Check'}
            </button>
          </div>

          <DrugSafetyMatrixView
            matrix={result.matrix}
            medicinesList={result.medicinesAnalyzed}
            disclaimer={result.disclaimer}
          />
        </div>
      )}
    </div>
  );
}
