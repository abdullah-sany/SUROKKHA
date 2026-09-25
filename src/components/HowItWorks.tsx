import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquareText, Cpu, Stethoscope, FileCheck, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const steps = [
    {
      step: '01',
      icon: MessageSquareText,
      titleEn: 'Describe Symptoms',
      titleBn: 'লক্ষণ বিস্তারিত জানান',
      descEn: 'Type your health concern, speak via voice dictation, or upload visual symptoms (such as skin rashes or swelling) in Bangla or English.',
      descBn: 'আপনার কী সমস্যা হচ্ছে তা লিখে, মুখে বলে (ভয়েস ইনপুট) অথবা দৃশ্যমান লক্ষণ (যেমন র‍্যাশ বা ফোলা) এর ছবি আপলোড করে জানান।',
      tagEn: 'Text, Voice & Image',
      tagBn: 'টেক্সট, ভয়েস ও ছবি',
    },
    {
      step: '02',
      icon: Cpu,
      titleEn: 'Clinical AI Triage',
      titleBn: 'ক্লিনিক্যাল ট্রায়াজ বিশ্লেষণ',
      descEn: 'Our intelligence engine evaluates your symptoms against clinical triage protocols, assigning a transparent safety urgency rating from Green to Red.',
      descBn: 'আমাদের এআই ইঞ্জিন আন্তর্জাতিক ট্রায়াজ প্রোটোকল মেনে সমস্যার তীব্রতা বিশ্লেষণ করে গ্রিন থেকে রেড পর্যন্ত চার স্তরের সেফটি রেটিং প্রদান করে।',
      tagEn: 'Urgency Classification',
      tagBn: 'ঝুঁকি ও সতর্কতা লেভেল',
    },
    {
      step: '03',
      icon: Stethoscope,
      titleEn: 'Specialist Matching',
      titleBn: 'সঠিক বিশেষজ্ঞ ডাক্তার বাছাই',
      descEn: 'Get guided to the exact medical department (e.g., Cardiology, Neurology, ENT, Orthopedics) along with key questions to ask your clinician.',
      descBn: 'কোন বিভাগের বিশেষজ্ঞ ডাক্তারের কাছে যাওয়া দরকার (যেমন কার্ডিওলজি, নিউরোলজি, অর্থোপেডিকস) তা স্পষ্টভাবে জেনে নিন।',
      tagEn: 'Precision Navigation',
      tagBn: 'বিশেষজ্ঞ দিকনির্দেশনা',
    },
    {
      step: '04',
      icon: FileCheck,
      titleEn: 'Summary & Action Plan',
      titleBn: 'ক্লিনিক্যাল রিপোর্ট ও পদক্ষেপ',
      descEn: 'Download a clean consultation summary PDF to show your doctor, view localized care resources, or access immediate emergency assistance.',
      descBn: 'ডাক্তারকে দেখানোর জন্য সাজানো পিডিএফ রিপোর্ট ডাউনলোড করুন এবং প্রাথমিক সতর্কতা ও জরুরি সহায়তা নিন।',
      tagEn: 'PDF Export & Care Access',
      tagBn: 'পিডিএফ ও পরবর্তী সেবা',
    },
  ];

  return (
    <section id="how-it-works" className="w-full scroll-mt-24 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={13} className="text-teal-600" />
          <span>{isBn ? 'সহজ চার ধাপের প্রক্রিয়া' : 'Step-by-Step Guidance'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          {isBn ? 'সুরক্ষা এআই কীভাবে কাজ করে?' : 'How Surokkha AI Works'}
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          {isBn
            ? 'কোন ডাক্তারের কাছে যাবেন তা নিয়ে দ্বিধায় আছেন? মাত্র কয়েকটি সহজ ধাপে সঠিক স্বাস্থ্য দিকনির্দেশনা পান।'
            : 'Unsure which doctor or department to visit? Navigate your healthcare journey with confidence in four simple steps.'}
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="group relative bg-white border border-slate-200 hover:border-teal-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center shadow-2xs">
                    <Icon size={22} />
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-300 group-hover:text-teal-500/80 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div>
                  <div className="inline-block px-2.5 py-0.5 mb-2 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold tracking-wide">
                    {isBn ? item.tagBn : item.tagEn}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                    {isBn ? item.titleBn : item.titleEn}
                  </h3>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {isBn ? item.descBn : item.descEn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-600 group-hover:text-teal-700">
                <ShieldCheck size={14} className="mr-1 text-teal-500" />
                <span>{isBn ? 'রোগী কেন্দ্রিক সুরক্ষা' : 'Evidence-guided triage'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
