import React, { useState } from 'react';
import { 
  PhoneCall, 
  ShieldCheck, 
  Clock, 
  HeartHandshake, 
  Sparkles, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Headphones,
  Stethoscope,
  Siren,
  Baby,
  Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HelplineItem {
  id: string;
  number: string;
  nameBn: string;
  nameEn: string;
  departmentBn: string;
  departmentEn: string;
  tagBn: string;
  tagEn: string;
  isFree: boolean;
  is24x7: boolean;
  purposeBn: string[];
  purposeEn: string[];
  tipsBn: string;
  tipsEn: string;
  colorTheme: 'teal' | 'emerald' | 'rose' | 'amber' | 'sky';
}

const HELPLINES: HelplineItem[] = [
  {
    id: '16263',
    number: '16263',
    nameBn: 'স্বাস্থ্য বাতায়ন (১৬২৬৩)',
    nameEn: 'Shastho Batayan (16263)',
    departmentBn: 'স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয়, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
    departmentEn: 'Ministry of Health and Family Welfare, Govt of Bangladesh',
    tagBn: '২৪ ঘণ্টা ফ্রি সরকারি ডাক্তার সেবা',
    tagEn: '24/7 Free Govt Doctor Consultation',
    isFree: true,
    is24x7: true,
    colorTheme: 'teal',
    purposeBn: [
      '২৪ ঘণ্টা সরাসরি রেজিস্টার্ড এমবিবিএস ডাক্তারের সাথে কথা বলে চিকিৎসা পরামর্শ গ্রহণ।',
      'নিকটস্থ সরকারি উপজেলা হাসপাতাল বা জেলা সদর হাসপাতালে অ্যাম্বুলেন্সের সন্ধান।',
      'সরকারি স্বাস্থ্যসেবা, টিকাদান ও কমিউনিটি ক্লিনিক সংক্রান্ত যেকোনো অভিযোগ বা তথ্য।',
      'জরুরি প্রাথমিক চিকিৎসার নিয়মাবলী জেনে নেওয়া।'
    ],
    purposeEn: [
      'Round-the-clock free teleconsultation with registered MBBS doctors.',
      'Locator for nearest government hospital and official ambulance dispatch.',
      'Public health program information, vaccinations, and community clinic inquiries.',
      'Immediate medical guidance during home emergencies.'
    ],
    tipsBn: 'কল করার পূর্বে রোগীর বয়স, ওজন এবং কী কী লক্ষণ দেখা যাচ্ছে তা মনে রাখুন। প্রেসক্রিপশন থাকলে তা হাতে রাখুন।',
    tipsEn: 'Keep patient age, weight, symptoms, and current medicine strips ready before placing the call.'
  },
  {
    id: '999',
    number: '999',
    nameBn: 'জাতীয় জরুরি সেবা (৯৯৯)',
    nameEn: 'National Emergency Service (999)',
    departmentBn: 'বাংলাদেশ পুলিশ ও ফায়ার সার্ভিস নিয়ন্ত্রণ কক্ষ',
    departmentEn: 'Bangladesh Police & Fire Service Operations Control Room',
    tagBn: 'তাৎক্ষণিক অ্যাম্বুলেন্স ও পুলিশ সহায়তা',
    tagEn: 'Urgent Ambulance, Fire & Police Dispatch',
    isFree: true,
    is24x7: true,
    colorTheme: 'rose',
    purposeBn: [
      'মুমূর্ষু রোগীর জন্য তাৎক্ষণিক সরকারি/বেসরকারি অ্যাম্বুলেন্স দ্রুততম সময়ে পাঠানো।',
      'সড়ক দুর্ঘটনা, বড় ধরনের আঘাত বা পানিতে ডোবার ক্ষেত্রে জরুরি উদ্ধার।',
      'মারামারি, সহিংসতা বা জরুরি নিরাপত্তাজনিত ঘটনায় পুলিশ সহায়তা।',
      'আগুনে পোড়া বা অগ্নিকাণ্ডে ফায়ার সার্ভিসের দ্রুত টিম প্রেরণ।'
    ],
    purposeEn: [
      'Urgent dispatch of nearest available ambulance for critical emergencies.',
      'Emergency rescue for road traffic accidents, trauma, or mass casualties.',
      'Police emergency response during physical harm or violent assault.',
      'Fire service rescue team deployment for domestic or field fires.'
    ],
    tipsBn: 'আপনার সঠিক ইউনিয়ন, গ্রাম ও ল্যান্ডমার্ক (যেমন: অমুক স্কুলের পাশে/বাজারের মোড়ে) স্পষ্টভাবে বলুন যাতে অ্যাম্বুলেন্স দ্রুত পৌঁছাতে পারে।',
    tipsEn: 'Clearly state your village, union, and distinctive landmark (e.g. near school or bazaar) for rapid ambulance arrival.'
  },
  {
    id: '333',
    number: '333',
    nameBn: 'জাতীয় কল সেন্টার (৩৩৩)',
    nameEn: 'National Citizen Helpline (333)',
    departmentBn: 'এটুআই (a2i), তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ',
    departmentEn: 'Aspire to Innovate (a2i), ICT Division Bangladesh',
    tagBn: 'গ্রামীণ ডিজিটাল টেলিমেডিসিন ও তথ্য',
    tagEn: 'Rural Digital Telemedicine & Citizen Aid',
    isFree: false,
    is24x7: true,
    colorTheme: 'sky',
    purposeBn: [
      '৩৩৩ প্রেস করে ৪ ডায়াল করলে সরাসরি ডাক্তারের সাথে স্বাস্থ্য পরামর্শ।',
      'করোনা, ডেঙ্গু, ডায়রিয়া বা মৌসুমি প্রাদুর্ভাবের জরুরি চিকিৎসা পরামর্শ।',
      'সরকারি সামাজিক নিরাপত্তা ও গ্রামীণ বয়স্ক/বিধবা ভাতার তথ্য।',
      'কৃষি ও স্থানীয় ইউনিয়ন পরিষদের সেবা সংক্রান্ত সহায়তা।'
    ],
    purposeEn: [
      'Direct doctor consultations by pressing option 4 on IVR menu.',
      'Guidance regarding seasonal epidemics, dengue, and fever management.',
      'Information on social safety nets and government allowance programs.',
      'Assistance with agricultural guidance and Union Parishad citizen services.'
    ],
    tipsBn: '৩৩৩-এ কল করার পর ভয়েস নির্দেশনায় ডাক্তার সেবার জন্য ৪ বোতামটি চাপুন।',
    tipsEn: 'After dialing 333, follow IVR audio prompts and press 4 to connect with medical clinicians.'
  },
  {
    id: '1098',
    number: '1098',
    nameBn: 'চাইল্ড হেল্পলাইন (১০৯৮)',
    nameEn: 'Child Helpline (1098)',
    departmentBn: 'সমাজসেবা অধিদপ্তর, সমাজকল্যাণ মন্ত্রণালয়',
    departmentEn: 'Department of Social Services, Ministry of Social Welfare',
    tagBn: 'শিশুদের জরুরি স্বাস্থ্য ও সুরক্ষা',
    tagEn: 'Child Health, Nutrition & Protection',
    isFree: true,
    is24x7: true,
    colorTheme: 'emerald',
    purposeBn: [
      'গ্রামের শিশুদের অপুষ্টি, গুরুতর অসুস্থতা বা চিকিৎসার অর্থাভাব সংক্রান্ত সহায়তা।',
      'প্রতিবন্ধী শিশুদের জন্য সরকারি থেরাপি ও পুনর্বাসন সেবা।',
      'নিপীড়িত বা ঝুঁকিতে থাকা শিশুদের জরুরি উদ্ধার ও আইনি সুরক্ষা।'
    ],
    purposeEn: [
      'Assistance for malnourished or severely sick rural children in distress.',
      'Connecting children with disabilities to government therapy centers.',
      'Emergency rescue and protection for children facing neglect or abuse.'
    ],
    tipsBn: 'শিশুর সঠিক বয়স ও বর্তমান শারীরিক অবস্থার বিবরণ গুছিয়ে বলুন।',
    tipsEn: 'Report the child\'s estimated age and specific nutritional or physical distress clearly.'
  },
  {
    id: '109',
    number: '109',
    nameBn: 'নারী ও শিশু সুরক্ষা হেল্পলাইন (১০৯)',
    nameEn: 'Women & Children Helpline (109)',
    departmentBn: 'মহিলা ও শিশু বিষয়ক মন্ত্রণালয়',
    departmentEn: 'Ministry of Women and Children Affairs',
    tagBn: 'মা ও নবজাতকের জরুরি সহায়তা',
    tagEn: 'Maternal, Neonatal & Women\'s Health Support',
    isFree: true,
    is24x7: true,
    colorTheme: 'amber',
    purposeBn: [
      'গর্ভবতী মা ও প্রসূতি মায়েদের যেকোনো জরুরি শারীরিক সংকট ও চিকিৎসা পরামর্শ।',
      'নবজাতকের শ্বাসকষ্ট, জন্ডিস বা জ্বর সংক্রান্ত জরুরি দিকনির্দেশনা।',
      'গ্রামীণ নারীর মানসিক ও পারিবারিক নির্যাতন প্রতিরোধে সার্বক্ষণিক ওয়ান-স্টপ ক্রাইসিস সেল (OCC) সহায়তা।'
    ],
    purposeEn: [
      'Emergency support during pregnancy complications and childbirth crises.',
      'Neonatal distress, infant jaundice, and pediatric home care guidance.',
      'One-Stop Crisis Center (OCC) hospital linkages for women in distress.'
    ],
    tipsBn: 'প্রসূতি কার্ড বা গর্ভকালীন চেকআপের কাগজ সাথে রাখলে ডাক্তারের পরামর্শ পাওয়া সহজ হয়।',
    tipsEn: 'Keep the Antenatal Care (ANC) mother card ready when describing pregnancy symptoms.'
  },
  {
    id: '10655',
    number: '10655',
    nameBn: 'আইইডিসিআর কন্ট্রোল রুম (১০৬৫৫)',
    nameEn: 'IEDCR Epidemic Control Room (10655)',
    departmentBn: 'রোগতত্ত্ব, রোগ নিয়ন্ত্রণ ও গবেষণা ইনস্টিটিউট (IEDCR)',
    departmentEn: 'Institute of Epidemiology, Disease Control and Research',
    tagBn: 'ডেঙ্গু, নিপাহ ও মহামারী নিয়ন্ত্রণ',
    tagEn: 'Dengue, Nipah Virus & Epidemic Tracker',
    isFree: true,
    is24x7: true,
    colorTheme: 'teal',
    purposeBn: [
      'খেজুরের কাঁচা রস খেয়ে জ্বর বা নিপাহ ভাইরাসের উপসর্গ দেখা দিলে বিশেষ পরামর্শ।',
      'গ্রাম বা ইউনিয়নে ডায়রিয়া, কলেরা বা ডেঙ্গুর ব্যাপক প্রাদুর্ভাব দেখা দিলে রিপোর্ট করা।',
      'অজ্ঞাত জ্বর বা সংক্রামক রোগের নমুনা পরীক্ষার সহায়তা।'
    ],
    purposeEn: [
      'Urgent guidance for raw date palm sap ingestion or suspected Nipah virus fever.',
      'Reporting village outbreaks of waterborne cholera or vector-borne dengue.',
      'Assistance with disease surveillance testing and containment.'
    ],
    tipsBn: 'আপনার গ্রামে একসাথে একাধিক ব্যক্তি আক্রান্ত হলে তা বিস্তারিত জানান।',
    tipsEn: 'Report promptly if multiple households in your locality exhibit identical acute symptoms.'
  }
];

export default function EmergencyHelplineHub() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [activeHelpline, setActiveHelpline] = useState<HelplineItem>(HELPLINES[0]);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
            <Headphones size={15} />
            <span>{isBn ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত জরুরি স্বাস্থ্যসেবা' : 'Official Govt Healthcare Helplines'}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            {isBn ? 'জরুরি গ্রামীণ হেল্পলাইন ও ১৬২৬৩ স্বাস্থ্য বাতায়ন' : 'Emergency Rural Helplines & Govt Telemedicine'}
          </h2>
          
          <p className="text-teal-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            {isBn
              ? 'ঘরে বসেই যেকোনো ফোন থেকে সম্পূর্ণ বিনামূল্যে ২৪ ঘণ্টা সরকারি এমবিবিএস ডাক্তারের পরামর্শ পান। এক ক্লিকেই সরাসরি ডায়াল করুন এবং কোনো সংকটে অ্যাম্বুলেন্স বা জরুরি টিম ডাকুন।'
              : 'Direct one-tap dialing to official Bangladesh 24/7 free medical helplines. Connect with qualified physicians, ambulance fleets, and maternal healthcare specialists.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-semibold text-emerald-200">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>{isBn ? '২৪ ঘণ্টা চালু ও সম্পূর্ণ ফ্রি' : '24/7 Toll-Free Access'}</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-semibold text-amber-200">
              <Stethoscope size={14} className="text-amber-400" />
              <span>{isBn ? 'এমবিবিএস ডাক্তার দ্বারা পরিচালিত' : 'MBBS Clinicians On Duty'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Helpline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {HELPLINES.map((item) => {
          const isSelected = activeHelpline.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveHelpline(item)}
              className={`bg-white rounded-3xl border transition-all cursor-pointer p-6 flex flex-col justify-between shadow-2xs hover:shadow-md ${
                isSelected 
                  ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-md' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    <PhoneCall className="text-teal-600" size={24} />
                    <span>{item.number}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {item.is24x7 && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                        {isBn ? '২৪ ঘণ্টা' : '24/7'}
                      </span>
                    )}
                    {item.isFree && (
                      <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-sky-200">
                        {isBn ? 'টোল ফ্রি' : 'FREE'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Dept */}
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                    {isBn ? item.nameBn : item.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {isBn ? item.departmentBn : item.departmentEn}
                  </p>
                </div>

                {/* Key tag */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-teal-800">
                  {isBn ? item.tagBn : item.tagEn}
                </div>

                {/* Bullets */}
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {(isBn ? item.purposeBn : item.purposeEn).slice(0, 2).map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-teal-600 font-bold shrink-0 mt-0.5">✓</span>
                      <span className="line-clamp-2">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call Button */}
              <div className="pt-5 mt-4 border-t border-slate-100">
                <a
                  href={`tel:${item.number}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-sm shadow-xs transition-all"
                >
                  <PhoneCall size={16} />
                  <span>{isBn ? `সরাসরি কল করুন (${item.number})` : `Call ${item.number} Now`}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Helpline Deep Guidance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full mb-2">
              <Stethoscope size={14} />
              <span>{isBn ? 'নির্বাচিত হেল্পলাইন গাইডেন্স' : 'Selected Hotline In-Depth Protocol'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isBn ? activeHelpline.nameBn : activeHelpline.nameEn}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isBn ? activeHelpline.departmentBn : activeHelpline.departmentEn}
            </p>
          </div>

          <a
            href={`tel:${activeHelpline.number}`}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all shrink-0"
          >
            <PhoneCall size={18} />
            <span>{isBn ? `এখনই ডায়াল করুন: ${activeHelpline.number}` : `Dial ${activeHelpline.number}`}</span>
          </a>
        </div>

        {/* 2-Column Details: Services & How to prepare */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="text-teal-600" size={18} />
              <span>{isBn ? 'যেসব কারণে এই নম্বরে সহায়তা পাবেন:' : 'Available Medical Services:'}</span>
            </h4>
            <ul className="space-y-2.5">
              {(isBn ? activeHelpline.purposeBn : activeHelpline.purposeEn).map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-amber-900">
              <Info size={18} className="text-amber-700" />
              <h4 className="font-bold text-sm sm:text-base">
                {isBn ? '💡 ডাক্তারের সাথে কথা বলার আগে করণীয়:' : 'Preparation Checklist Before Calling:'}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {isBn ? activeHelpline.tipsBn : activeHelpline.tipsEn}
            </p>
            <div className="text-xs text-amber-800 pt-2 border-t border-amber-200/60 font-semibold">
              {isBn 
                ? '★ মনে রাখবেন: যেকোনো নেটওয়ার্কের সাধারণ বা বাটন ফোন থেকেও কোনো ব্যালেন্স ছাড়া ১৬২৬৩ ডায়াল করা যায়।'
                : '★ Note: 16263 can be called from any mobile operator or basic keypad handset without mobile balance.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
