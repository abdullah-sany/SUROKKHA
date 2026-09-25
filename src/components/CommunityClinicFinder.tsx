import React, { useState } from 'react';
import { 
  Building2, 
  Pill, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  HelpCircle, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FreeMedicineItem {
  id: string;
  genericName: string;
  nameBn: string;
  category: 'fever' | 'gastric' | 'diarrhea' | 'maternal' | 'infection' | 'wound';
  categoryLabelBn: string;
  categoryLabelEn: string;
  indicationBn: string;
  indicationEn: string;
  doseFormBn: string;
  doseFormEn: string;
  freeSupply: boolean;
  notesBn: string;
  notesEn: string;
}

const FREE_MEDICINES: FreeMedicineItem[] = [
  {
    id: 'paracetamol',
    genericName: 'Paracetamol 500mg',
    nameBn: 'প্যারাসিটামল ৫০০ মি.গ্রা. ট্যাবলেট ও সিরাপ',
    category: 'fever',
    categoryLabelBn: 'জ্বর ও ব্যথানাশক',
    categoryLabelEn: 'Fever & Pain Relief',
    indicationBn: 'সাধারণ জ্বর, মাথাব্যথা, শরীর ব্যথা ও সর্দির কারণে সৃষ্ট গা ব্যথায় ব্যবহৃত হয়।',
    indicationEn: 'Indicated for fever, headache, body aches, and viral cold discomfort.',
    doseFormBn: 'ট্যাবলেট ও শিশুদের ড্রপ/সিরাপ',
    doseFormEn: 'Tablet & Pediatric Suspension',
    freeSupply: true,
    notesBn: 'ক্লিনিকের সিএইচসিপি বা স্বাস্থ্যকর্মীর পরামর্শ অনুযায়ী ভরা পেটে সেবন করতে হবে।',
    notesEn: 'Take after meals according to CHCP or health worker advice.'
  },
  {
    id: 'antacid',
    genericName: 'Antacid (Dried Aluminum & Magnesium Hydroxide)',
    nameBn: 'অ্যান্টাসিড ট্যাবলেট ও সাসপেনশন',
    category: 'gastric',
    categoryLabelBn: 'গ্যাস্ট্রিক ও বুকজ্বালা',
    categoryLabelEn: 'Acid Reflux & Gastritis',
    indicationBn: 'অতিরিক্ত পেটের গ্যাস, বুকজ্বালা, অম্ল ও পেটের অস্বস্তির তাৎক্ষণিক উপশম।',
    indicationEn: 'Relief of gastric hyperacidity, heartburn, acid indigestion, and sour stomach.',
    doseFormBn: 'চিবিয়ে খাওয়ার ট্যাবলেট / তরল মিশ্রণ',
    doseFormEn: 'Chewable Tablet / Oral Suspension',
    freeSupply: true,
    notesBn: 'খাবারের ১ ঘণ্টা পর চিবিয়ে পানি দিয়ে খেতে হয়।',
    notesEn: 'Chew thoroughly 1 hour after meals.'
  },
  {
    id: 'ors',
    genericName: 'Oral Rehydration Salts (ORS)',
    nameBn: 'খাবার স্যালাইন (ওআরএস প্যাকেট)',
    category: 'diarrhea',
    categoryLabelBn: 'ডায়রিয়া ও পানিশূন্যতা',
    categoryLabelEn: 'Dehydration & Diarrhea',
    indicationBn: 'পাতলা পায়খানা, বমি, অতিরিক্ত ঘাম ও ডায়রিয়াজনিত পানিশূন্যতা রোধ ও চিকিৎসা।',
    indicationEn: 'Prevention and management of dehydration caused by acute diarrhea or heat.',
    doseFormBn: 'আধা লিটার পানির জন্য নির্দিষ্ট পাউডার প্যাকেট',
    doseFormEn: 'Powder Sachet for 500ml water',
    freeSupply: true,
    notesBn: 'সবসময় বিশুদ্ধ আধা লিটার পানিতে মেশাতে হবে এবং ১২ ঘণ্টার মধ্যে ব্যবহার করতে হবে।',
    notesEn: 'Dissolve in exact 500ml pure water; discard after 12 hours.'
  },
  {
    id: 'metronidazole',
    genericName: 'Metronidazole 400mg',
    nameBn: 'মেট্রোনিডাজল ট্যাবলেট ও সাসপেনশন',
    category: 'diarrhea',
    categoryLabelBn: 'ডায়রিয়া ও আমাশয়',
    categoryLabelEn: 'Amebiasis & Intestinal Infection',
    indicationBn: 'রক্ত আমাশয়, পেটের ক্ষতিকর ব্যাকটেরিয়া সংক্রমণ ও কৃমিঘটিত আমাশয় দূর করতে।',
    indicationEn: 'Treatment of amebic dysentery and specific intestinal bacterial infections.',
    doseFormBn: 'ট্যাবলেট ও সিরাপ',
    doseFormEn: 'Tablet & Suspension',
    freeSupply: true,
    notesBn: 'কোর্স সম্পূর্ণ করতে হবে, নিজে নিজে ওষুধ বন্ধ করবেন না।',
    notesEn: 'Complete the prescribed clinical course without premature termination.'
  },
  {
    id: 'iron-folic',
    genericName: 'Iron & Folic Acid Tablet',
    nameBn: 'আয়রন ও ফলিক এসিড (আইএফএ) ট্যাবলেট',
    category: 'maternal',
    categoryLabelBn: 'গর্ভবতী মা ও রক্তস্বল্পতা',
    categoryLabelEn: 'Maternal Anemia Prevention',
    indicationBn: 'গর্ভবতী ও স্তন্যদায়ী মায়েদের রক্তস্বল্পতা দূরীকরণ এবং অনাগত শিশুর স্নায়ুর বিকাশ।',
    indicationEn: 'Prevents maternal anemia and supports fetal neural tube development during pregnancy.',
    doseFormBn: 'ট্যাবলেট (লাল/বাদামী রঙের)',
    doseFormEn: 'Coated Tablet',
    freeSupply: true,
    notesBn: 'গর্ভাবস্থার প্রথম ৩ মাস পর থেকে প্রসব পর্যন্ত প্রতিদিন বিনামূল্যে দেওয়া হয়।',
    notesEn: 'Distributed free to all pregnant women from 2nd trimester through postpartum.'
  },
  {
    id: 'calcium',
    genericName: 'Calcium 500mg + Vitamin D',
    nameBn: 'ক্যালসিয়াম ট্যাবলেট',
    category: 'maternal',
    categoryLabelBn: 'গর্ভবতী মা ও হাড়ের শক্তি',
    categoryLabelEn: 'Bone Health & Maternal Care',
    indicationBn: 'গর্ভবতী মায়ের প্রি-এক্লাম্পসিয়া প্রতিরোধ, দাঁত ও হাড়ের ক্ষয়রোধ এবং শিশুর হাড় গঠনে।',
    indicationEn: 'Prevents pre-eclampsia in pregnancy and supports strong maternal and fetal bones.',
    doseFormBn: 'ট্যাবলেট',
    doseFormEn: 'Film-coated Tablet',
    freeSupply: true,
    notesBn: 'আয়রন ও ক্যালসিয়াম একই সাথে না খেয়ে অন্তত ২ ঘণ্টার ব্যবধানে খাওয়া উচিত।',
    notesEn: 'Do not ingest Iron and Calcium together; maintain at least a 2-hour interval.'
  },
  {
    id: 'zinc',
    genericName: 'Zinc Sulfate 20mg',
    nameBn: 'জিংক ট্যাবলেট / সিরাপ',
    category: 'maternal',
    categoryLabelBn: 'শিশু স্বাস্থ্য ও ডায়রিয়া পরবর্তী যত্ন',
    categoryLabelEn: 'Pediatric Diarrhea Recovery',
    indicationBn: 'শিশুদের ডায়রিয়ার তীব্রতা হ্রাস, রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি ও অন্ত্রের দ্রুত সুস্থতা।',
    indicationEn: 'Accelerates pediatric mucosal recovery and boosts immunity following acute diarrhea.',
    doseFormBn: 'ডিসপারসিবল ট্যাবলেট (পানিতে গুলে খাওয়ার) / সিরাপ',
    doseFormEn: 'Dispersible Tablet / Syrup',
    freeSupply: true,
    notesBn: 'ডায়রিয়া শুরুর পর টানা ১০-১৪ দিন শিশুর বয়স অনুযায়ী খাওয়াতে হয়।',
    notesEn: 'Administer daily for 10-14 days to prevent subsequent diarrheal episodes.'
  },
  {
    id: 'chlorpheniramine',
    genericName: 'Chlorpheniramine Maleate 4mg (Histacin)',
    nameBn: 'ক্লোরফেনিরামিন (হিস্টাসিন) ট্যাবলেট',
    category: 'fever',
    categoryLabelBn: 'অ্যালার্জি, হাঁচি ও চুলকানি',
    categoryLabelEn: 'Allergy, Sneezing & Itch',
    indicationBn: 'নাক দিয়ে পানি পড়া, বারবার হাঁচি, শরীরের চুলকানি ও অ্যালার্জি প্রতিরোধে।',
    indicationEn: 'Symptomatic relief of allergic rhinitis, watery eyes, sneezing, and pruritus.',
    doseFormBn: 'ছোট হলুদ ট্যাবলেট',
    doseFormEn: 'Tablet',
    freeSupply: true,
    notesBn: 'এটি খেলে হালকা ঘুম ঘুম ভাব বা ঝিমুনি আসতে পারে।',
    notesEn: 'May cause mild drowsiness; avoid driving or operating farm machinery after use.'
  },
  {
    id: 'albendazole',
    genericName: 'Albendazole 400mg',
    nameBn: 'অ্যালবেন্ডাজল (কৃমিনাশক) ট্যাবলেট',
    category: 'infection',
    categoryLabelBn: 'কৃমি নিয়ন্ত্রণ',
    categoryLabelEn: 'Deworming & Parasite Control',
    indicationBn: 'গোলকৃমি, সুতাকৃমি, বক্রকৃমি ইত্যাদি পেটের পরজীবী ধ্বংস করতে।',
    indicationEn: 'Broad-spectrum antihelminthic for roundworm, hookworm, and pinworm clearance.',
    doseFormBn: 'চিবিয়ে খাওয়ার ট্যাবলেট',
    doseFormEn: 'Chewable Tablet',
    freeSupply: true,
    notesBn: 'প্রতি ৬ মাস পর পর পরিবারের সবাইকে একসাথে কৃমিনাশক সেবন করা উচিত।',
    notesEn: 'Recommended every 6 months for family members aged 2 years and above.'
  },
  {
    id: 'amoxicillin',
    genericName: 'Amoxicillin Dry Syrup / Drops',
    nameBn: 'অ্যামোক্সিসিলিন পেডিয়াট্রিক সাসপেনশন',
    category: 'infection',
    categoryLabelBn: 'প্রাথমিক অ্যান্টিবায়োটিক',
    categoryLabelEn: 'Pediatric Antibiotic Care',
    indicationBn: 'শিশুদের টনসিল সংক্রমণ, কান পাকা ও প্রাথমিক শ্বাসতন্ত্রের জীবাণু সংক্রমণে।',
    indicationEn: 'Treatment of pediatric middle ear infections, tonsillitis, and mild respiratory infections.',
    doseFormBn: 'ফুটানো ঠান্ডা পানিতে তৈরি ড্রাই সিরাপ',
    doseFormEn: 'Dry Powder for Oral Suspension',
    freeSupply: true,
    notesBn: 'শুধুমাত্র সিএইচসিপি বা স্বাস্থ্যকর্মীর নির্দিষ্ট প্রেসক্রিপশনে সম্পূর্ণ কোর্স শেষ করতে হবে।',
    notesEn: 'Strictly complete the 5-7 day course as prescribed by healthcare staff.'
  },
  {
    id: 'povidone-iodine',
    genericName: 'Povidone Iodine 10% Solution & Ointment',
    nameBn: 'পোভিডন আয়োডিন অ্যান্টিসেপটিক লোশন ও মলম',
    category: 'wound',
    categoryLabelBn: 'ক্ষত, কাটাছেঁড়া ও ড্রেসিং',
    categoryLabelEn: 'Wound Dressing & Antiseptic',
    indicationBn: 'জমিতে বা বাড়িতে হাত-পা কেটে গেলে জীবাণুমুক্ত করা ও ক্ষত ড্রেসিং।',
    indicationEn: 'Antiseptic solution for agricultural cuts, abrasions, lacerations, and minor burns.',
    doseFormBn: 'তরল লোশন / টিউব মলম',
    doseFormEn: 'Topical Solution / Ointment',
    freeSupply: true,
    notesBn: 'কাটা ক্ষত আগে পরিষ্কার পানি দিয়ে ধুয়ে তারপর আয়োডিন লাগাতে হয়।',
    notesEn: 'Clean dirt with pure water first before applying antiseptic dressing.'
  },
  {
    id: 'eye-drop',
    genericName: 'Chloramphenicol 0.5% Eye Drops',
    nameBn: 'ক্লোরামফেনিকল আই ড্রপ',
    category: 'infection',
    categoryLabelBn: 'চোখের সংক্রমণ ও চোখ ওঠা',
    categoryLabelEn: 'Eye Infection & Conjunctivitis',
    indicationBn: 'চোখ লাল হওয়া, পিঁচুটি জমা, চোখ দিয়ে পানি পড়া ও চোখ ওঠার প্রাথমিক চিকিৎসায়।',
    indicationEn: 'Bacterial conjunctivitis, pink eye, and superficial ocular bacterial irritation.',
    doseFormBn: 'জীবাণুমুক্ত চোখের ড্রপ বোতল',
    doseFormEn: 'Sterile Ophthalmic Drops',
    freeSupply: true,
    notesBn: 'ড্রপ ব্যবহারের সময় ড্রপারের ডগা হাত বা চোখের পাতায় ছোঁয়াবেন না।',
    notesEn: 'Do not touch the dropper tip with fingers or eyelids to maintain sterility.'
  }
];

export default function CommunityClinicFinder() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMedicines = FREE_MEDICINES.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.indicationBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabelBn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
            <Building2 size={15} />
            <span>{isBn ? '১৪,০০০+ গ্রামীণ কমিউনিটি ক্লিনিক সেবা' : '14,000+ Rural Community Clinics'}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            {isBn ? 'কমিউনিটি ক্লিনিক ও সরকারি বিনামূল্যে প্রাপ্ত ৩৩+ ওষুধের তালিকা' : 'Community Clinic Free Medicine Directory'}
          </h2>
          
          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            {isBn
              ? 'আপনার বাড়ির কাছের কমিউনিটি ক্লিনিকে বাংলাদেশ সরকার সাধারণ মানুষের জন্য ৩৩ ধরনের প্রয়োজনীয় প্রাথমিক ওষুধ সম্পূর্ণ বিনামূল্যে সরবরাহ করে। আপনার অধিকার জানুন ও সঠিক ওষুধ সংগ্রহ করুন।'
              : 'The Government of Bangladesh provides ~33 essential primary medicines free of charge at grassroots Community Clinics across every village and union.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs font-semibold text-emerald-200">
              <Clock size={14} />
              <span>{isBn ? 'ক্লিনিক সময়: সকাল ৯:০০ - বিকাল ৩:০০' : 'Clinic Hours: 9:00 AM - 3:00 PM'}</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs font-semibold text-amber-200">
              <Pill size={14} />
              <span>{isBn ? '১০০% সরকারি বিনামূল্যে সরবরাহ' : '100% Free Public Supply'}</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs font-semibold text-teal-200">
              <Users size={14} />
              <span>{isBn ? 'সিএইচসিপি ও স্বাস্থ্য সহকারী উপস্থিত' : 'CHCP & Health Assistant on Duty'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Community Clinic Info Card: When to go & What to expect */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            {isBn ? 'কখন খোলা থাকে?' : 'Operational Schedule'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isBn 
              ? 'শুক্রবার ও সরকারি ছুটির দিন ব্যতীত প্রতিদিন সকাল ৯টা থেকে বিকাল ৩টা পর্যন্ত সব কমিউনিটি ক্লিনিক খোলা থাকে।'
              : 'Open everyday from 9:00 AM to 3:00 PM, except Fridays and official government public holidays.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            {isBn ? 'কারা সেবা দেন?' : 'Healthcare Personnel'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isBn 
              ? 'কমিউনিটি হেলথ কেয়ার প্রোভাইডার (CHCP), স্বাস্থ্য সহকারী (HA) এবং পরিবার কল্যাণ সহকারী (FWA) নিয়মিত পরামর্শ ও ওষুধ দেন।'
              : 'Community Health Care Providers (CHCP), Health Assistants (HA), and Family Welfare Assistants (FWA).'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <AlertTriangle size={20} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            {isBn ? 'কখন উপজেলা হাসপাতালে যাবেন?' : 'When to Escalate to UHC?'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isBn 
              ? 'সাপে কাটা, তীব্র শ্বাসকষ্ট, রক্তের বমি, বুকব্যথা, জটিল প্রসব বা তীব্র বিষক্রিয়ায় সময় নষ্ট না করে সরাসরি উপজেলা স্বাস্থ্য কমপ্লেক্সে যাবেন।'
              : 'For snakebites, severe dyspnea, hematemesis, acute chest pain, or poisoning, proceed directly to Upazila Health Complex.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? 'সব প্রয়োজনীয় ওষুধ' : 'All Free Medicines'}
            </button>
            <button
              onClick={() => setSelectedCategory('fever')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'fever'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? 'জ্বর, ব্যথা ও সর্দি' : 'Fever & Pain'}
            </button>
            <button
              onClick={() => setSelectedCategory('diarrhea')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'diarrhea'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? 'স্যালাইন ও পেটের রোগ' : 'Diarrhea & Saline'}
            </button>
            <button
              onClick={() => setSelectedCategory('maternal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'maternal'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? 'মা ও শিশুর পুষ্টি' : 'Maternal & Child'}
            </button>
            <button
              onClick={() => setSelectedCategory('wound')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'wound'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? 'কাটাছেঁড়া ও ড্রেসিং' : 'Wound Care'}
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'ওষুধ বা সমস্যার নাম দিয়ে খুঁজুন...' : 'Search medicine or symptom...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid of Free Medicines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMedicines.map((med) => (
          <div 
            key={med.id}
            className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-300 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {isBn ? med.categoryLabelBn : med.categoryLabelEn}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                  {isBn ? '১০০% বিনামূল্যে' : 'FREE GOVT SUPPLY'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                  {isBn ? med.nameBn : med.genericName}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {med.genericName}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">{isBn ? 'কাজ:' : 'Indication:'}</span>{' '}
                  {isBn ? med.indicationBn : med.indicationEn}
                </div>
                <div className="text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-800">{isBn ? 'ধরণ:' : 'Form:'}</span>{' '}
                  {isBn ? med.doseFormBn : med.doseFormEn}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-start space-x-1.5 text-xs text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{isBn ? med.notesBn : med.notesEn}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Advice & Village Health Card Reminder */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-teal-400">
          <ShieldCheck size={22} />
          <h3 className="font-bold text-lg text-white">
            {isBn ? 'কমিউনিটি ক্লিনিকের ওষুধ নেওয়ার সময় প্রয়োজনীয় পরামর্শ:' : 'Tips When Collecting Community Clinic Medicines:'}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start space-x-2">
            <span className="text-teal-400 font-bold">•</span>
            <span>{isBn ? 'ক্লিনিকে যাওয়ার সময় আপনার জাতীয় পরিচয়পত্র (NID) অথবা জন্মনিবন্ধন কার্ড সাথে রাখুন।' : 'Bring your National ID (NID) or Birth Certificate card.'}</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-teal-400 font-bold">•</span>
            <span>{isBn ? 'গর্ভবতী মায়েরা গর্ভকালীন এএনসি (ANC) স্বাস্থ্য কার্ডটি অবশ্যই সাথে নেবেন।' : 'Pregnant mothers must bring their Antenatal Care (ANC) yellow card.'}</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-teal-400 font-bold">•</span>
            <span>{isBn ? 'ওষুধ পাওয়ার পর খাওয়ার সঠিক নিয়ম ও সময় স্বাস্থ্যকর্মীর কাছ থেকে ভালো করে বুঝে নিন।' : 'Ask health workers to explain dosage, timing, and meal instructions clearly.'}</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-teal-400 font-bold">•</span>
            <span>{isBn ? 'ক্লিনিকের সব ওষুধ সরকারি সম্পত্তি এবং সম্পূর্ণ বিনামূল্যে বিতরণ করা আইনত বাধ্যতামূলক।' : 'All medicines are 100% free of cost under Government of Bangladesh public health laws.'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
