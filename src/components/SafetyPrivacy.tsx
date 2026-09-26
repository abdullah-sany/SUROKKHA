import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldAlert, Lock, EyeOff, FileText, CheckCircle2, AlertTriangle, PhoneCall, HeartPulse } from 'lucide-react';

export default function SafetyPrivacy() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const privacyFeatures = [
    {
      icon: EyeOff,
      titleEn: 'Zero-Storage Privacy Architecture',
      titleBn: 'কোনো মেডিকেল রেকর্ড সংরক্ষণ করা হয় না',
      descEn: 'Your symptom descriptions, audio inputs, and uploaded photos are processed ephemerally in volatile memory. We never save medical histories or sell query data to third parties.',
      descBn: 'আপনার লক্ষণ, ভয়েস ও আপলোডকৃত ছবি তাৎক্ষণিক মেমরিতে প্রসেস হয়। কোনো ব্যক্তিগত স্বাস্থ্য রেকর্ড আমরা সংরক্ষণ বা তৃতীয় পক্ষের কাছে বিক্রি করি না।',
    },
    {
      icon: Lock,
      titleEn: 'Encrypted Transport & Anonymity',
      titleBn: 'এনক্রিপ্টেড ও সম্পূর্ণ বেনামী ব্যবহার',
      descEn: 'All interactions are secured with TLS 1.3 protocol encryption. No mandatory user registration, national ID, or credit card information is required to access guidance.',
      descBn: 'সমস্ত ডাটা আধুনিক টিএলএস প্রোটোকলে এনক্রিপ্ট করা। দিকনির্দেশনা পেতে কোনো বাধ্যতামূলক রেজিস্ট্রেশন বা ব্যক্তিগত পরিচয়পত্র প্রদান করতে হয় না।',
    },
    {
      icon: HeartPulse,
      titleEn: 'Autonomous Clinical Urgency Triage',
      titleBn: 'স্বয়ংক্রিয় বিপদচিহ্ন শনাক্তকরণ',
      descEn: 'The system is tuned to immediately detect high-urgency red flags (chest pain, stroke signs, breathing failure) and guide users towards acute hospital care without delay.',
      descBn: 'বুকে তীব্র ব্যথা, স্ট্রোক বা শ্বাসকষ্টের মতো বিপজ্জনক লক্ষণ ধরা পড়লে প্ল্যাটফর্মটি তাৎক্ষণিকভাবে জরুরি হাসপাতালে যাওয়ার পরামর্শ দেয়।',
    },
  ];

  return (
    <section id="safety-privacy" className="w-full scroll-mt-24 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <Lock size={13} className="text-emerald-600 dark:text-emerald-400" />
          <span>{isBn ? 'নিরাপত্তা ও বিশ্বাসযোগ্যতা' : 'Trust & Data Ethics'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {isBn ? 'সুরক্ষা ও তথ্য গোপনীয়তা' : 'Safety, Privacy & Clinical Ethics'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          {isBn
            ? 'স্বাস্থ্য সংক্রান্ত তথ্য অত্যন্ত স্পর্শকাতর। আপনার গোপনীয়তা রক্ষা এবং রোগীর নিরাপত্তাই আমাদের সর্বোচ্চ অগ্রাধিকার।'
            : 'Your health concerns are personal. We uphold the highest ethical standards in clinical safety and data confidentiality.'}
        </p>
      </div>

      {/* Prominent Medical Disclaimer Banner */}
      <div className="bg-amber-50/80 dark:bg-amber-950/30 border-2 border-amber-200/90 dark:border-amber-900/60 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2">
              <span>{isBn ? 'গুরুত্বপূর্ণ স্বাস্থ্য ও আইনি ডিসক্লেইমার' : 'Essential Medical & Clinical Disclaimer'}</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 uppercase">
                {isBn ? 'নির্দেশনামূলক' : 'Advisory Only'}
              </span>
            </h3>
            <p className="text-xs md:text-sm text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
              {isBn
                ? 'সুরক্ষা এআই কোনো নিবন্ধিত চিকিৎসক নয় এবং এটি কোনো চূড়ান্ত মেডিকেল ডায়াগনসিস বা প্রেসক্রিপশন প্রদান করে না। এটি একটি প্রাথমিক ট্রায়াজ সহায়িকা যা আপনাকে উপযুক্ত বিশেষজ্ঞ বিভাগের সন্ধান দিতে সাহায্য করে। যেকোনো শারীরিক অসুস্থতায় অবিলম্বে একজন নিবন্ধিত চিকিৎসকের পরামর্শ নিন।'
                : 'Surokkha AI is an intelligent clinical navigation guide and not a registered physician. It does not provide definitive medical diagnoses, treatment plans, or drug prescriptions. Always seek the advice of a qualified, registered medical doctor regarding any acute or chronic medical condition.'}
            </p>
          </div>
        </div>

        {/* Emergency Alert Hotline Callout */}
        <div className="mt-4 pt-4 border-t border-amber-200/70 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-amber-950 dark:text-amber-200 font-medium">
            <PhoneCall size={14} className="text-amber-700 dark:text-amber-400" />
            <span>
              {isBn
                ? 'জীবন সংশয়কারী জরুরি অবস্থায় সরাসরি কল করুন:'
                : 'In life-threatening medical emergencies, immediately dial:'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="tel:999"
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors flex items-center space-x-1 shadow-2xs"
            >
              <span>999</span>
              <span className="text-[10px] font-normal opacity-90">({isBn ? 'জাতীয় জরুরি সেবা' : 'Emergency'})</span>
            </a>
            <a
              href="tel:16263"
              className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg transition-colors flex items-center space-x-1 shadow-2xs"
            >
              <span>16263</span>
              <span className="text-[10px] font-normal opacity-90">({isBn ? 'স্বাস্থ্য বাতায়ন' : 'Health Helpline'})</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {privacyFeatures.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isBn ? feature.titleBn : feature.titleEn}
                </h4>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isBn ? feature.descBn : feature.descEn}
                </p>
              </div>

              <div className="flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <CheckCircle2 size={14} className="mr-1.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isBn ? 'সার্বক্ষণিক সুরক্ষা নীতি' : 'Verified Security Policy'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
