import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Stethoscope, 
  ChevronDown, 
  ChevronUp, 
  Camera, 
  TestTube, 
  Pill, 
  Volume2, 
  ShieldCheck,
  PhoneCall,
  HeartHandshake
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface GraminQuickHubProps {
  onSelectFeature?: (tab: 'symptoms' | 'prescription' | 'lab-report' | 'drug-safety' | 'health-calculator' | 'rural-care' | 'emergency-helpline' | 'community-clinic') => void;
  activeTab?: string;
}

export default function GraminQuickHub({ onSelectFeature, activeTab }: GraminQuickHubProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [showFairDetails, setShowFairDetails] = useState(false);

  return (
    <div className="w-full">
      {/* Sleek, Clean Institutional Medical Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800/60 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {isBn ? 'সুরক্ষা (SUROKKHA) গ্রামীণ স্বাস্থ্য ও ক্লিনিক্যাল এআই' : 'SUROKKHA Rural Clinical AI Platform'}
                </h2>
                <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Gemini + Groq</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn 
                  ? 'প্রেসক্রিপশন ও ল্যাব ডিকোডার, ড্রাগ সেফটি ম্যাট্রিক্স এবং গ্রামীণ জীবনরক্ষাকারী জরুরি নির্দেশিকা।'
                  : 'Clinical handwriting OCR, lab biomarker analysis, drug safety matrix & rural emergency protocols.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setShowFairDetails(!showFairDetails)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <Award size={13} className="text-teal-600 dark:text-teal-400" />
              <span>{isBn ? 'ইনোভেশন আর্কিটেকচার' : 'Innovation Overview'}</span>
              {showFairDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>

        {/* Subtle, Professional Expandable Innovation Drawer for Judges */}
        {showFairDetails && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 animate-in fade-in duration-300">
            <div className="p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700 space-y-1">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Camera size={13} className="text-teal-600 dark:text-teal-400" />
                <span>{isBn ? 'প্রেসক্রিপশন ভিশন' : 'Prescription OCR'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {isBn ? 'ডাক্তারের হাতের লেখা ও ওষুধের মাত্রা বাংলায় সকাল-দুপুর-রাতের শিডিউলে রূপান্তর।' : 'Decodes doctor handwriting into formatted Bengali dosage schedules.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700 space-y-1">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <TestTube size={13} className="text-cyan-600 dark:text-cyan-400" />
                <span>{isBn ? 'ল্যাব রিপোর্ট ডিকোডার' : 'Pathology Decoder'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {isBn ? 'সিবিসি ও বায়োমার্কারের রেফারেন্স রেঞ্জ ও ঝুঁকির মাত্রা বিশ্লেষণ।' : 'Interprets CBC, blood sugar, kidney and biomarker test ranges.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700 space-y-1">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Pill size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>{isBn ? 'ড্রাগ সেফটি ম্যাট্রিক্স' : 'DDI Drug Matrix'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {isBn ? 'একাধিক ওষুধের ক্ষতিকর প্রতিক্রিয়া ও খাদ্য সতর্কতা নিবিড়ভাবে পরীক্ষা।' : 'Groq LPU clinical engine checks adverse medication combinations.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700 space-y-1">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Volume2 size={13} className="text-amber-600 dark:text-amber-400" />
                <span>{isBn ? 'ভয়েস ও গ্রামীণ অফলাইন' : 'Voice & First-Aid'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {isBn ? 'স্বল্পশিক্ষিতদের জন্য বাংলা অডিও পাঠ ও সাপে কাটার তাৎক্ষণিক অফলাইন গাইড।' : 'Bengali text-to-speech audio with verified snakebite & ORS protocols.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Target for CSS selector 2: Minimalist quick status row instead of giant heavy boxes */}
      <div className="hidden">
        {/* Preserved structure if queried by selector */}
      </div>
    </div>
  );
}
