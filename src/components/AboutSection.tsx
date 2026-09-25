import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Compass, 
  Target, 
  HeartHandshake, 
  Users, 
  Sparkles, 
  Building2, 
  Globe2, 
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Pill,
  FileText,
  TestTube,
  PhoneCall,
  Heart,
  Award,
  AlertTriangle,
  Volume2,
  Stethoscope,
  Scale
} from 'lucide-react';

export default function AboutSection() {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [activeTab, setActiveTab] = useState<'comparison' | 'judge-personal'>('comparison');

  return (
    <section id="about" className="w-full scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider">
          <Compass size={13} className="text-teal-600" />
          <span>{isBn ? 'আমাদের লক্ষ্য ও পরিচিতি' : 'Our Story & Purpose'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          {isBn ? 'সুরক্ষা এআই সম্পর্কে' : 'About Surokkha AI'}
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          {isBn
            ? 'সঠিক সময়ে সঠিক ডাক্তারের কাছে পৌঁছানোর পথকে সহজ ও সুলভ করতে আমাদের এই উদ্যোগ।'
            : 'Bridging the critical gap between symptom onset and specialized clinical care with compassionate, intelligent AI.'}
        </p>
      </div>

      {/* Main Mission Card */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-700/60 border border-teal-500/40 text-teal-200 text-xs font-medium">
            <Sparkles size={13} className="text-teal-300" />
            <span>{isBn ? 'স্বাস্থ্যসেবায় নতুন দিগন্ত' : 'Empowering Everyday Healthcare'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white max-w-2xl leading-snug">
            {isBn
              ? 'অপ্রয়োজনীয় ভোগান্তি দূর করে রোগীকে দ্রুততম সময়ে উপযুক্ত বিশেষজ্ঞের কাছে পৌঁছে দেওয়া।'
              : 'Eliminating diagnostic confusion to connect every patient with the right specialist at the right time.'}
          </h3>

          <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-2xl">
            {isBn
              ? 'বাংলাদেশে লক্ষ লক্ষ মানুষ সামান্য উপসর্গ দেখে দ্বিধায় পড়েন যে কোন ডাক্তারের কাছে যাবেন—মেডিসিন, নিউরোলজি, নাকি অর্থোপেডিকস? এই বিভ্রান্তির কারণে চিকিৎসা শুরু হতে বিলম্ব ঘটে এবং আর্থিক অপচয় হয়। সুরক্ষা এআই লক্ষণগুলো বিচার করে তাৎক্ষণিক ক্লিনিক্যাল ট্রায়াজ দিকনির্দেশনা প্রদান করে।'
              : 'Millions of patients face overwhelming uncertainty when symptoms first appear: Is this an emergency? Which specialist should I book? This hesitation often leads to delayed treatment, misdirected appointments, and mounting medical costs. Surokkha AI was created to provide instant, clear, and culturally attuned clinical triage guidance.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-teal-700/50">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">24/7</div>
              <div className="text-xs text-slate-300 mt-0.5">{isBn ? 'তাৎক্ষণিক সহায়তা' : 'Instant Guidance'}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">100%</div>
              <div className="text-xs text-slate-300 mt-0.5">{isBn ? 'গোপনীয় ও সুরক্ষিত' : 'Private & Ephemeral'}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">EN / বাং</div>
              <div className="text-xs text-slate-300 mt-0.5">{isBn ? 'দ্বিভাষিক সমর্থন' : 'Bilingual Support'}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">4-Tier</div>
              <div className="text-xs text-slate-300 mt-0.5">{isBn ? 'সেফটি ট্রায়াজ' : 'Safety Triage'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Values Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Target size={20} />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {isBn ? 'আমাদের ভিশন (Vision)' : 'Our Vision'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {isBn
              ? 'প্রযুক্তি এবং কৃত্রিম বুদ্ধিমত্তার দায়িত্বশীল ব্যবহারের মাধ্যমে স্বাস্থ্যসেবার প্রাথমিক দিকনির্দেশনা প্রতিটি মানুষের হাতের নাগালে পৌঁছে দেওয়া।'
              : 'A world where no individual delays life-saving medical care due to lack of health literacy or confusion over medical departments.'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <HeartHandshake size={20} />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {isBn ? 'আমাদের মূল্যবোধ (Values)' : 'Core Values'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {isBn
              ? 'রোগীর নিরাপত্তা সর্বদা সবার আগে। স্বচ্ছতা, স্পষ্ট মেডিকেল ডিসক্লেইমার এবং তথ্যের সর্বোচ্চ গোপনীয়তা আমাদের অঙ্গীকার।'
              : 'Patient safety is non-negotiable. We maintain total clinical transparency, unyielding privacy, and strict algorithmic accountability.'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Globe2 size={20} />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {isBn ? 'স্থানীয় পরিপ্রেক্ষিত (Local Impact)' : 'Ecosystem Impact'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {isBn
              ? 'বাংলা ও ইংরেজিতে সহজ ইন্টারফেস, বাংলাদেশের হাসপাতাল ও ইমার্জেন্সি ব্যবস্থার সাথে দ্রুত সমন্বয়ের সুযোগ।'
              : 'Designed with deep contextual relevance for Bangladesh and regional healthcare infrastructures, empowering informed consultations.'}
          </p>
        </div>
      </div>

      {/* Target Element: div:nth-of-type(4) - Upgraded Comparison & Personal Life Value */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-9 border border-slate-800 shadow-xl space-y-7 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Award size={13} className="text-teal-400" />
              <span>{isBn ? 'ইনোভেশন ফেয়ার স্পেশাল মূল্যায়ন' : 'Innovation Fair Clinical Showcase'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {isBn 
                ? 'কেন সাধারণ ChatGPT / Gemini / Grok নয় — সুরক্ষা এআই কেন এক অনন্য উদ্ভাবন?' 
                : 'Why Surokkha AI vs. Generic Chatbots (ChatGPT / Gemini / Grok)?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {isBn 
                ? 'এটি কোনো সাধারণ টেক্সট চ্যাটবট বা এআই র‍্যাপার নয়। এটি বাংলাদেশের জাতীয় স্বাস্থ্য ব্যবস্থা, গ্রামীণ বাস্তবতা ও ক্লিনিক্যাল নিরাপত্তার সমন্বয়ে গড়ে ওঠা একটি বিশেষায়িত ডিজিটাল হেলথ অবকাঠামো।'
                : 'Not an ungrounded chatbot wrapper. Surokkha AI is a specialized clinical triage & pharmacovigilance platform built for real-world patient safety.'}
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold self-start md:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isBn ? 'ডুয়েল ইঞ্জিন: Gemini 3.8 + Groq LPU' : 'Dual Clinical Engine Active'}</span>
          </div>
        </div>

        {/* Interactive Segmented Switcher for Judges */}
        <div className="flex justify-center relative z-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-inner flex-wrap justify-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'comparison'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Scale size={16} />
              <span>{isBn ? '১. চ্যাটবট বনাম সুরক্ষা এআই (ক্লিনিক্যাল পার্থক্য)' : '1. Chatbots vs Surokkha AI'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('judge-personal')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'judge-personal'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Heart size={16} />
              <span>{isBn ? '২. বিজ্ঞ বিচারকের নিজের ও পরিবারের ব্যক্তিগত জীবনে উপকারিতা' : '2. Direct Benefits for Judge & Family'}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Detailed Comparison vs Generic Chatbots */}
        {activeTab === 'comparison' && (
          <div className="space-y-4 animate-in fade-in duration-300 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Hallucination vs Clinical Triage */}
              <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-teal-400 font-bold text-sm flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-900 text-teal-300 flex items-center justify-center text-xs font-black">১</span>
                    <span>{isBn ? 'আনস্ট্রাকচার্ড টেক্সট বনাম কালার-কোডেড ট্রায়াজ' : 'Unstructured Text vs. Clinical Triage'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {isBn ? 'ট্রায়াজ প্রটোকল' : 'Triage Standard'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/50 text-slate-300">
                    <span className="font-bold text-rose-400 flex items-center gap-1 mb-0.5">
                      <XCircle size={13} />
                      {isBn ? 'সাধারণ চ্যাটবট (ChatGPT / Gemini / Grok):' : 'Generic Chatbots:'}
                    </span>
                    {isBn 
                      ? 'অপ্রয়োজনীয় ৫০-১০০ লাইনের দীর্ঘ ইংরেজি/বাংলা প্যারাগ্রাফ দেয়, যার মধ্যে রোগীর জরুরি বিপদসংকেত হারিয়ে যায়। কোনো স্পষ্ট ইমার্জেন্সি লেভেল বা তাৎক্ষণিক করণীয় থাকে না।'
                      : 'Outputs long generic walls of text where life-threatening red-flag warning signs get buried.'}
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-slate-200">
                    <span className="font-bold text-teal-300 flex items-center gap-1 mb-0.5">
                      <CheckCircle2 size={13} />
                      {isBn ? 'সুরক্ষা এআই (SUROKKHA AI):' : 'Surokkha AI Advantage:'}
                    </span>
                    {isBn 
                      ? 'আন্তর্জাতিক ইমার্জেন্সি ট্রায়াজ স্ট্যান্ডার্ড অনুযায়ী ৪-স্তরের কালার মিটার (সবুজ/হলুদ/কমলা/লাল), নির্দিষ্ট বিশেষজ্ঞ ডাক্তারের নাম এবং তাৎক্ষণিক ১৬২৬৩ ও ৯৯৯ কল বোতাম প্রদান করে।'
                      : 'Structured 4-tier safety meter (Green/Yellow/Orange/Red), pinpoint specialist designation, and 1-tap emergency hotline escalation.'}
                  </div>
                </div>
              </div>

              {/* Card 2: Handwritten Prescription OCR */}
              <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-teal-400 font-bold text-sm flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-900 text-teal-300 flex items-center justify-center text-xs font-black">২</span>
                    <span>{isBn ? 'হাতের লেখা প্রেসক্রিপশন ভিশন ও বাংলা শিডিউল' : 'Handwritten Prescription Vision'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {isBn ? 'কম্পিউটার ভিশন' : 'Vision OCR'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/50 text-slate-300">
                    <span className="font-bold text-rose-400 flex items-center gap-1 mb-0.5">
                      <XCircle size={13} />
                      {isBn ? 'সাধারণ চ্যাটবট (ChatGPT / Gemini / Grok):' : 'Generic Chatbots:'}
                    </span>
                    {isBn 
                      ? 'ডাক্তারের জটিল হাতের লেখা প্রেসক্রিপশনের ছবি দিলে বাংলাদেশের স্থানীয় ব্র্যান্ড নাম (নাপা, সেকলো, মোনাস, ম্যাক্সপ্রো) চিনতে ভুল করে এবং বিপজ্জনক বিভ্রান্তিকর ডোজ দেয়।'
                      : 'Fails to reliably resolve messy handwriting and local Bangladeshi pharmaceutical brand formulations.'}
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-slate-200">
                    <span className="font-bold text-teal-300 flex items-center gap-1 mb-0.5">
                      <CheckCircle2 size={13} />
                      {isBn ? 'সুরক্ষা এআই (SUROKKHA AI):' : 'Surokkha AI Advantage:'}
                    </span>
                    {isBn 
                      ? 'ডিজিডিএ (DGDA) ড্রাগ ডাটাবেজ ম্যাচিং করে ডাক্তারের হাতের লেখা থেকে সকাল-দুপুর-রাতের (১+০+১) স্পষ্ট বাংলা শিডিউল, খাওয়ার সময় (আগে/পরে) ও অস্পষ্ট লেখা থাকলে ফার্মাসিস্ট সতর্কতা দেয়।'
                      : 'Standardizes messy handwriting into formatted Bengali morning-noon-night dosage schedules with meal timing and confidence warnings.'}
                  </div>
                </div>
              </div>

              {/* Card 3: Drug-Drug Interaction (DDI) Matrix */}
              <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-teal-400 font-bold text-sm flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-900 text-teal-300 flex items-center justify-center text-xs font-black">৩</span>
                    <span>{isBn ? 'ক্লিনিক্যাল ড্রাগ ইন্টারঅ্যাকশন (DDI) ম্যাট্রিক্স' : 'Clinical Drug Safety Matrix'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {isBn ? 'ফার্মাকোভিজিল্যান্স' : 'Pharmacovigilance'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/50 text-slate-300">
                    <span className="font-bold text-rose-400 flex items-center gap-1 mb-0.5">
                      <XCircle size={13} />
                      {isBn ? 'সাধারণ চ্যাটবট (ChatGPT / Gemini / Grok):' : 'Generic Chatbots:'}
                    </span>
                    {isBn 
                      ? 'একাধিক ওষুধের মধ্যে রাসায়নিক সংঘাত বা সেফটি স্কোর বের করার কোনো বিশেষায়িত ক্লিনিক্যাল ম্যাট্রিক্স ইঞ্জিন নেই। সাধারণ পরামর্শ দেয় যা বিপজ্জনক হতে পারে।'
                      : 'Lacks systematic pairwise biochemical interaction scoring and food timing contraindication screening.'}
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-slate-200">
                    <span className="font-bold text-teal-300 flex items-center gap-1 mb-0.5">
                      <CheckCircle2 size={13} />
                      {isBn ? 'সুরক্ষা এআই (SUROKKHA AI):' : 'Surokkha AI Advantage:'}
                    </span>
                    {isBn 
                      ? 'গ্রক এলপিইউ (Groq LPU) ক্লিনিক্যাল ইঞ্জিন দিয়ে ০-১০০ সেফটি স্কোর, ড্রাগ পেয়ার সেভিয়ারিটি রেটিং (CRITICAL/MODERATE/SAFE) এবং দুধ/খাবারের নির্দিষ্ট টাইম-গ্যাপ অ্যালার্ট দেয়।'
                      : 'Dedicated Groq LPU engine delivers 0-100 safety score, pairwise interaction matrix, and dietary timing contraindications.'}
                  </div>
                </div>
              </div>

              {/* Card 4: National Emergency & Rural Reality */}
              <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-teal-400 font-bold text-sm flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-900 text-teal-300 flex items-center justify-center text-xs font-black">৪</span>
                    <span>{isBn ? 'জাতীয় জরুরি সেবা ও গ্রামীণ অফলাইন ফার্স্ট-এইড' : 'Govt Helplines & Rural First-Aid'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {isBn ? 'জাতীয় ইন্টিগ্রেশন' : 'National Hotlines'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/50 text-slate-300">
                    <span className="font-bold text-rose-400 flex items-center gap-1 mb-0.5">
                      <XCircle size={13} />
                      {isBn ? 'সাধারণ চ্যাটবট (ChatGPT / Gemini / Grok):' : 'Generic Chatbots:'}
                    </span>
                    {isBn 
                      ? 'বাংলাদেশের বাস্তবতার সাথে কোনো যোগসূত্র নেই। চ্যাটবট জানে না গ্রামে সাপে কাটলে কোন হাসপাতালে অ্যান্টিভেনম থাকে বা কমিউনিটি ক্লিনিকে কোন ওষুধ ফ্রি পাওয়া যায়।'
                      : 'Completely disconnected from local healthcare reality and emergency dispatch channels.'}
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-slate-200">
                    <span className="font-bold text-teal-300 flex items-center gap-1 mb-0.5">
                      <CheckCircle2 size={13} />
                      {isBn ? 'সুরক্ষা এআই (SUROKKHA AI):' : 'Surokkha AI Advantage:'}
                    </span>
                    {isBn 
                      ? '১৬২৬৩ ফ্রি সরকারি ডাক্তার ও ৯৯৯ অ্যাম্বুলেন্সে সরাসরি কল, সাপে কাটা ও হিটস্ট্রোকের অফলাইন গাইড এবং কমিউনিটি ক্লিনিকের ৩৩+ ফ্রি ওষুধের পূর্ণাঙ্গ তালিকা রয়েছে।'
                      : 'Direct 1-tap 16263 free doctor dialing, rural snakebite protocols, and inventory of 33+ free community clinic medicines.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom summary bar */}
            <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <Volume2 className="text-teal-400 shrink-0" size={16} />
                <span>{isBn ? 'অতিরিক্ত সুবিধা: নিরক্ষর ও প্রবীণদের জন্য বাংলা ভয়েস সিন্থেসিস (Speech Audio) সমন্বিত।' : 'Bonus: Native Bengali speech synthesis allows low-literacy villagers to listen to care guidance.'}</span>
              </span>
              <span className="font-bold text-teal-400 shrink-0 hidden sm:inline">100% Focused on Bangladesh</span>
            </div>
          </div>
        )}

        {/* TAB 2: Direct Practical Benefits for the Judge's Personal & Family Life */}
        {activeTab === 'judge-personal' && (
          <div className="space-y-4 animate-in fade-in duration-300 relative z-10">
            <div className="bg-gradient-to-r from-rose-950/50 via-slate-800/70 to-slate-800/70 border border-rose-800/40 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <div className="flex items-center space-x-2 text-rose-300 font-bold mb-1">
                <Heart size={16} className="text-rose-400" />
                <span>{isBn ? 'মাননীয় বিচারকের ব্যক্তিগত জীবন ও পরিবারের নিরাপত্তা:' : 'Practical Impact on the Judge & Family:'}</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm">
                {isBn
                  ? 'ইনোভেশন ফেয়ারের একজন বিজ্ঞ বিচারক হিসেবে আপনি প্রযুক্তি ও সমাজের সেতুবন্ধন বিচার করছেন। কিন্তু একজন দায়িত্ববান সন্তান ও পরিবারের অভিভাবক হিসেবে আপনার প্রাত্যহিক জীবনেও এই প্ল্যাটফর্মটি কীভাবে সরাসরি সুরক্ষা দেবে, নিচে তার বাস্তব উদাহরণ তুলে ধরা হলো:'
                  : 'Beyond an innovation exhibition, how Surokkha AI safeguards the Judge\'s own household, elderly parents, and daily family medical safety:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Point 1: Elderly Parents */}
              <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-900/60 text-rose-300 flex items-center justify-center font-bold text-sm shrink-0">
                    ১
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {isBn ? 'বয়োজ্যেষ্ঠ বাবা-মায়ের ওষুধের ক্ষতিকর সংমিশ্রণ রোধ' : 'Elderly Parents Polypharmacy Protection'}
                    </h4>
                    <span className="text-[11px] text-teal-400 font-semibold">{isBn ? 'জীবনরক্ষাকারী স্ক্রিনিং' : 'Life-saving drug screening'}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isBn
                    ? 'আপনার পরিবারে বৃদ্ধ বাবা বা মা হয়তো ডায়াবেটিস, উচ্চ রক্তচাপ, হার্ট বা ব্যথার জন্য একাধিক ডাক্তারের ৫-৭টি ওষুধ একযোগে খাচ্ছেন। ভিন্ন ভিন্ন ডাক্তার একে অপরের ওষুধ সম্পর্কে জানেন না। সুরক্ষা এআই নিমেষেই জানিয়ে দেয়—কোন দুটি ওষুধ একসাথে খেলে কিডনি বা লিভারের মারাত্মক ক্ষতি হতে পারে, যা চ্যাটজিপিটি কখনোই নিশ্চিত করতে পারে না।'
                    : 'When aging parents consult multiple doctors for diabetes, heart, and hypertension, polypharmacy risks multiply. Surokkha AI screens all medicines in seconds to detect fatal interactions before harm occurs.'}
                </p>
              </div>

              {/* Point 2: Pharmacy Errors */}
              <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-900/60 text-teal-300 flex items-center justify-center font-bold text-sm shrink-0">
                    ২
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {isBn ? 'ফার্মেসিতে ভুল ওষুধ ও ডোজ পাওয়ার ঝুঁকি শূন্য করা' : 'Preventing Pharmacy Dispensation Errors'}
                    </h4>
                    <span className="text-[11px] text-teal-400 font-semibold">{isBn ? 'হাতের লেখা স্পষ্টিকরণ' : 'Zero handwriting ambiguity'}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isBn
                    ? 'প্রেসক্রিপশনে ডাক্তারের অস্পষ্ট হাতের লেখা না বুঝে ফার্মেসি বিক্রেতারা প্রায়ই ভুল ওষুধ বা ভুল পাওয়ার দিয়ে ফেলে। সুরক্ষা এআই দিয়ে ছবি তুললেই ওষুধের সঠিক জেনেরিক নাম ও খাওয়ার নির্দিষ্ট নিয়ম (১+০+১, খালি পেটে না ভরা পেটে) পরিষ্কার বাংলায় চোখের সামনে চলে আসে।'
                    : 'Messy doctor handwriting often leads pharmacy attendants to dispense the wrong medicine or dosage. Surokkha AI snaps the photo and displays exact generic names and meal timings clearly.'}
                </p>
              </div>

              {/* Point 3: Midnight Emergencies */}
              <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-900/60 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
                    ৩
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {isBn ? 'গভীর রাতে পরিবারের হঠাৎ অসুস্থতায় প্যানিক রোধ' : 'Late-Night Family Health Emergency Guidance'}
                    </h4>
                    <span className="text-[11px] text-amber-400 font-semibold">{isBn ? 'তাৎক্ষণিক সিদ্ধান্ত' : 'Instant triage decision'}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isBn
                    ? 'রাত ২টায় শিশু বা পরিবারের কারও তীব্র জ্বর, বুকব্যথা বা ল্যাব রিপোর্ট হাতে পেলে আপনি চরম দুশ্চিন্তায় পড়েন—এখনই হাসপাতালে ছুটতে হবে, নাকি ঘরে প্রাথমিক ব্যবস্থা নিয়ে সকালে ডাক্তার দেখানো যাবে? সুরক্ষা এআই সঠিক ট্রায়াজ লেভেল ও ১৬২৬৩ ফ্রি সরকারি ডাক্তারের সাথে তাৎক্ষণিক যোগাযোগ করিয়ে দেয়।'
                    : 'When a child spikes high fever or a lab report arrives at 2 AM, Surokkha AI delivers instant triage clarity: whether to rush to emergency or connect with 16263 free govt doctor.'}
                </p>
              </div>

              {/* Point 4: Doctor Consultation Slip */}
              <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-900/60 text-cyan-300 flex items-center justify-center font-bold text-sm shrink-0">
                    ৪
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {isBn ? 'চেম্বারে ডাক্তারের সাথে মূল্যবান ৫ মিনিটের সেরা ব্যবহার' : 'Ready-to-Show Clinical Consultation Sheet'}
                    </h4>
                    <span className="text-[11px] text-cyan-400 font-semibold">{isBn ? '১-ক্লিক ডক্টর সামারি' : '1-Page Doctor PDF'}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isBn
                    ? 'চেম্বারে বিশেষজ্ঞ ডাক্তারের সাথে আপনি বা আপনার পরিবার মাত্র ৫ মিনিট সময় পান। অল্প সময়ে রোগের পূর্বের ইতিহাস ও ওষুধ গুছিয়ে বলা কঠিন। সুরক্ষা এআই এক ক্লিকে ১ পাতার গোছানো ডক্টর সামারি শিট ও ডাউনলোডযোগ্য পিডিএফ প্রস্তুত করে, যা ডাক্তারের টেবিলে দিলে ডাক্তার এক পলকেই রোগীর পুরো অবস্থা বুঝে নিখুঁত চিকিৎসা দিতে পারেন।'
                    : 'Specialist appointments last only 3-5 minutes. Surokkha AI prepares a structured 1-page PDF summary sheet that physicians can review in 30 seconds for precise clinical care.'}
                </p>
              </div>
            </div>

            {/* Point 5: Rural Roots */}
            <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5">
                <Building2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="font-bold text-emerald-300 text-sm block mb-0.5">
                    {isBn ? '৫. নিজের গ্রামের বাড়ি ও দূরবর্তী আত্মীয়দের জীবনরক্ষা' : '5. Lifeline for Rural Relatives & Hometown'}
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {isBn 
                      ? 'শহরে বসেও আপনার গ্রামের বাড়িতে থাকা স্বজনদের সাপে কাটা, হিটস্ট্রোক বা ডায়রিয়ার মতো সংকটে ওঝা-কবিরাজের ভুল চিকিৎসা এড়িয়ে সরকারি ফ্রি ১৬২৬৩ ডাক্তার ও কমিউনিটি ক্লিনিকের ৩৩+ ফ্রি ওষুধের সঠিক তথ্য দিয়ে জীবন বাঁচানো সম্ভব।'
                      : 'Protect relatives living in rural ancestral villages from harmful faith healing by guiding them to official anti-venom centers and 14,000+ community clinics.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
