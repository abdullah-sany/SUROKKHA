import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const faqs = [
  {
    question: "Does this AI provide medical diagnoses?",
    questionBn: "এই এআই কি রোগ নির্ণয় করে?",
    answer: "No. The AI Specialist Guide provides informational healthcare navigation only. It is designed to help you understand the apparent urgency of your concern and point you toward the right type of healthcare professional. It cannot diagnose conditions or prescribe treatments.",
    answerBn: "না। এআই স্পেশালিস্ট গাইড শুধুমাত্র তথ্যমূলক স্বাস্থ্যসেবা নেভিগেশন প্রদান করে। এটি আপনার সমস্যার ধরন বুঝতে এবং সঠিক বিশেষজ্ঞের কাছে দিকনির্দেশনা দিতে সাহায্য করে। এটি রোগ নির্ণয় বা চিকিৎসার পরামর্শ দিতে পারে না।"
  },
  {
    question: "Is my personal health data saved?",
    questionBn: "আমার ব্যক্তিগত স্বাস্থ্য তথ্য কি সেভ করা হয়?",
    answer: "Your privacy is our priority. The health descriptions and images you provide are used solely in real-time to generate guidance and are not stored in any persistent database as a medical record.",
    answerBn: "আপনার গোপনীয়তা আমাদের অগ্রাধিকার। আপনার দেওয়া তথ্য শুধুমাত্র তাৎক্ষণিক নির্দেশনা তৈরির জন্য ব্যবহৃত হয় এবং কোনো মেডিকেল রেকর্ড হিসেবে সংরক্ষণ করা হয় না।"
  },
  {
    question: "What should I do in an emergency?",
    questionBn: "জরুরী অবস্থায় আমার কী করা উচিত?",
    answer: "If you are experiencing a life-threatening medical emergency, do not rely on this tool. Please seek immediate emergency medical assistance or visit the nearest hospital.",
    answerBn: "আপনার যদি জীবন-ঝুঁকিপূর্ণ কোনো সমস্যা হয়, তবে এই টুলের উপর নির্ভর করবেন না। অনুগ্রহ করে অবিলম্বে জরুরি চিকিৎসা সহায়তা নিন বা নিকটস্থ হাসপাতালে যান।"
  },
  {
    question: "How does the Lab Report & Pathology Decoder work?",
    questionBn: "স্মার্ট ল্যাব ও রক্ত পরীক্ষা ডিকোডার কীভাবে কাজ করে?",
    answer: "You can upload a photo of any diagnostic test or blood report (such as CBC, HbA1c, lipid panel, creatinine, or Dengue markers). The AI decodes each biological parameter, compares it with clinical reference ranges, explains the findings in simple Bengali, highlights abnormal or critical biomarkers, and provides dietary guidance along with the appropriate specialist to visit.",
    answerBn: "যেকোনো রক্ত পরীক্ষা বা ডায়াগনস্টিক রিপোর্ট (যেমন সিবিসি, এইচবিএ১সি, লিপিড প্রোফাইল, ক্রিয়েটিনিন বা ডেঙ্গু মার্কার)-এর ছবি আপলোড করলে এআই প্রতিটি টেস্টের ফলাফল ও রেফারেন্স রেঞ্জ বিশ্লেষণ করে। অস্বাভাবিক বা ঝুঁকিপূর্ণ মানগুলো চিহ্নিত করে সহজ বাংলায় এর অর্থ, খাদ্যাভ্যাস পরামর্শ এবং কোন বিশেষজ্ঞ ডাক্তারের পরামর্শ প্রয়োজন তা নির্ধারণ করে দেয়।"
  },
  {
    question: "How does the Drug Interaction & Safety Matrix work?",
    questionBn: "ড্রাগ ইন্টারঅ্যাকশন ও সেফটি ম্যাট্রিক্স কীভাবে কাজ করে?",
    answer: "Our clinical AI cross-analyzes all medications concurrently to detect adverse drug-drug interactions (DDI), harmful combinations (such as blood thinners with NSAIDs), absorption conflicts (like antibiotics with antacids), and dietary warnings (such as dairy or empty-stomach requirements), computing an evidence-based clinical safety score from 0 to 100.",
    answerBn: "আমাদের ক্লিনিক্যাল এআই প্রেসক্রিপশনের বা ইনপুটকৃত একাধিক ওষুধ একসাথে বিশ্লেষণ করে ড্রাগ-ড্রাগ ইন্টারঅ্যাকশন (DDI), রক্তক্ষরণ বা বিষক্রিয়ার মতো বিপজ্জনক কম্বিনেশন, শোষণজনিত সংঘাত (যেমন অ্যান্টিবায়োটিক ও অ্যান্টাসিডের ব্যবধান) এবং খাদ্য ও পানীয় সংক্রান্ত সতর্কতা শনাক্ত করে ০ থেকে ১০০ পর্যন্ত একটি ক্লিনিক্যাল সেফটি স্কোর প্রদান করে।"
  },
  {
    question: "Can this replace my doctor?",
    questionBn: "এটি কি আমার ডাক্তারের বিকল্প হতে পারে?",
    answer: "Absolutely not. This tool is a starting point to help you make informed decisions about seeking care. It should never replace professional medical evaluation, advice, or treatment.",
    answerBn: "একেবারেই না। এই টুলটি শুধুমাত্র আপনাকে স্বাস্থ্যসেবা খোঁজার বিষয়ে সিদ্ধান্ত নিতে সাহায্য করার একটি প্রাথমিক মাধ্যম। এটি কখনই পেশাদার চিকিৎসা মূল্যায়নের বিকল্প হতে পারে না।"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <section id="faq" className="w-full mt-20 pt-10 border-t border-slate-200 scroll-mt-24">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-slate-900">
          {isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্ন' : 'Frequently Asked Questions'}
        </h3>
        <p className="text-slate-500 mt-2">
          {isBn ? 'এআই স্পেশালিস্ট গাইড কীভাবে কাজ করে সে সম্পর্কে আরও জানুন' : 'Learn more about how the AI Specialist Guide works'}
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className={`border border-slate-200 rounded-2xl overflow-hidden transition-colors duration-200 ${isOpen ? 'bg-white shadow-sm border-teal-200' : 'bg-slate-50 hover:bg-white'}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
              >
                <div className="text-left pr-4">
                  <h4 className="font-semibold text-slate-900 leading-tight">
                    {isBn ? faq.questionBn : faq.question}
                  </h4>
                </div>
                <div className={`p-2 rounded-full transition-colors shrink-0 ${isOpen ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>
              
              {isOpen && (
                <div className="px-6 pb-5 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                    {isBn ? faq.answerBn : faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
