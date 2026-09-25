import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  PhoneCall, 
  HeartHandshake, 
  Sparkles, 
  Search, 
  Flame, 
  Droplet, 
  Sun, 
  Bug, 
  Zap, 
  LifeBuoy, 
  Activity,
  ArrowRight,
  HelpCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { voiceAssistant } from '../utils/voiceAssistant';

interface RuralCareItem {
  id: string;
  category: 'critical' | 'common' | 'environmental';
  icon: React.ReactNode;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  urgency: 'IMMEDIATE' | 'HIGH' | 'MODERATE';
  doListBn: string[];
  doListEn: string[];
  dontListBn: string[];
  dontListEn: string[];
  speechScriptBn: string;
  speechScriptEn: string;
  keyFactsBn: string;
  keyFactsEn: string;
  whereToGoBn: string;
  whereToGoEn: string;
}

const RURAL_CARE_DATA: RuralCareItem[] = [
  {
    id: 'snakebite',
    category: 'critical',
    icon: <AlertTriangle className="text-rose-600" size={24} />,
    titleBn: 'সাপে কাটা (রাসেলস ভাইপার, গোখরা, কেউটে)',
    titleEn: 'Snakebite Emergency (Russell\'s Viper, Cobra, Krait)',
    subtitleBn: 'দেরি না করে দ্রুত অ্যান্টিভেনম সমৃদ্ধ হাসপাতালে নিয়ে যান',
    subtitleEn: 'Rush immediately to upazila hospital for anti-venom',
    urgency: 'IMMEDIATE',
    doListBn: [
      'রোগীকে সম্পূর্ণ শান্ত রাখুন ও কোনো নড়াচড়া করতে দেবেন না (আতঙ্ক রক্তপ্রবাহ বাড়িয়ে দেয়)।',
      'দংশিত অঙ্গটি (হাত বা পা) সম্পূর্ণ সোজা ও স্থির রাখুন—বাঁশের চটা বা কাঠের টুকরো দিয়ে ব্যান্ডেজ/কাপড় দিয়ে আলতো বাঁধুন (স্প্লিন্ট করুন)।',
      'হাতে আংটি, ঘড়ি বা পায়ে নূপুর থাকলে ফোলা শুরু হওয়ার আগেই দ্রুত খুলে ফেলুন।',
      'দংশনের সঠিক সময়টি মনে রাখুন বা কাগজে লিখে রাখুন।',
      'যত দ্রুত সম্ভব অ্যান্টিভেনম সুবিধা আছে এমন উপজেলা স্বাস্থ্য কমপ্লেক্স বা জেলা সদর হাসপাতালে নিয়ে যান।'
    ],
    doListEn: [
      'Keep the victim calm and still; panic accelerates venom spread.',
      'Immobilize the bitten limb using a wooden splint and gentle cloth wrap.',
      'Remove rings, watches, or tight jewelry before swelling begins.',
      'Note the exact time of the bite.',
      'Transport immediately to the nearest Upazila Health Complex or District Hospital with Anti-venom.'
    ],
    dontListBn: [
      '❌ দংশিত স্থানে ব্লেড, ছুরি বা কাঁচ দিয়ে কাটবেন না বা রক্ত বের করার চেষ্টা করবেন না।',
      '❌ শক্ত করে রশি বা তার দিয়ে টাইট বাঁধন (টর্নিকেট) দেবেন না; এতে রক্ত চলাচল বন্ধ হয়ে অঙ্গ পচে যেতে পারে।',
      '❌ মুখ দিয়ে বিষ চোষার বা চুষে ফেলার চেষ্টা করবেন না।',
      '❌ ওঝা, সাপুড়ে বা কবিরাজের কাছে নিয়ে মূল্যবান সময় নষ্ট করবেন না (বাংলাদেশে ওঝার কারণে বহু সাপে কাটা রোগীর মৃত্যু হয়)।',
      '❌ কোনো ভেষজ পাতা, গোবর, চুন বা কার্বোলিক এসিড ক্ষতস্থানে লাগাবেন না।'
    ],
    dontListEn: [
      '❌ DO NOT cut the wound with blades or try to bleed the venom out.',
      '❌ DO NOT tie tight tourniquets (can cause gangrene and limb loss).',
      '❌ DO NOT try to suck the venom out with your mouth.',
      '❌ DO NOT waste golden time with traditional faith healers (Ojhas).',
      '❌ DO NOT apply cow dung, lime, carbolic acid, or herbs to the bite.'
    ],
    speechScriptBn: 'জরুরি সাপে কাটার নিয়ম: রোগীকে শান্ত রাখুন এবং নড়াচড়া করতে দেবেন না। দংশিত হাত বা পা কাঠের টুকরো দিয়ে সোজা করে রাখুন। শক্ত বাঁধন দেওয়া বা ব্লেড দিয়ে কাটা সম্পূর্ণ নিষেধ। ওঝার কাছে সময় নষ্ট না করে অবিলম্বে অ্যান্টিভেনমের জন্য নিকটস্থ উপজেলা সরকারি হাসপাতালে নিয়ে যান।',
    speechScriptEn: 'Snakebite emergency protocol: Keep patient calm. Immobilize bitten limb. Never cut wound or apply tight tourniquet. Never visit faith healers. Rush to the nearest Upazila Hospital immediately for anti-venom.',
    keyFactsBn: 'উপজেলা স্বাস্থ্য কমপ্লেক্স ও জেলা সদর হাসপাতালে সরকারি অ্যান্টিভেনম সম্পূর্ণ বিনামূল্যে পাওয়া যায়।',
    keyFactsEn: 'Government hospitals provide anti-venom free of charge.',
    whereToGoBn: 'নিকটস্থ উপজেলা স্বাস্থ্য কমপ্লেক্স (UHC) বা জেলা সদর হাসপাতাল (জরুরি বিভাগ)।',
    whereToGoEn: 'Nearest Upazila Health Complex or District Sadar Hospital.'
  },
  {
    id: 'diarrhea',
    category: 'common',
    icon: <Droplet className="text-teal-600" size={24} />,
    titleBn: 'ডায়রিয়া, পাতলা পায়খানা ও খাবার স্যালাইন',
    titleEn: 'Diarrhea, Dehydration & Oral Saline Guide',
    subtitleBn: 'শরীরের পানিশূন্যতা রোধ করাই ডায়রিয়ার প্রধান চিকিৎসা',
    subtitleEn: 'Preventing dehydration is the primary treatment for diarrhea',
    urgency: 'HIGH',
    doListBn: [
      'প্রতিবার পাতলা পায়খানার পর ১ গ্লাস (২৫০ মিলি) ওরস্যালাইন পান করুন। শিশুদের ক্ষেত্রে প্রতিবারে আধ গ্লাস।',
      'প্যাকেট স্যালাইন না থাকলে ঘরোয়া স্যালাইন বানান: ১/২ লিটার (আধ লিটার) ফুটানো ঠান্ডা পানিতে এক চিমটি লবণ (৩ আঙুলের ডগা) + ১ মুঠো গুড় বা চিনি ভালোভাবে মিশিয়ে নিন।',
      'স্যালাইন বানানোর পর ১২ ঘণ্টার বেশি রাখবেন না; ১২ ঘণ্টা পর নতুন করে স্যালাইন বানান।',
      'ডায়রিয়ার সময় স্বাভাবিক ভাত, নরম খিচুড়ি, ডাবের পানি ও চিড়ার পানি খেতে থাকুন (খাবার বন্ধ করবেন না)।',
      'শিশুদের ক্ষেত্রে চিকিৎসকের পরামর্শে ১০ থেকে ১৪ দিন জিংক সিরাপ বা ট্যাবলেট নিয়মিত খাওয়ান।'
    ],
    doListEn: [
      'Drink 1 glass (250 ml) of oral saline after every loose stool (half glass for young children).',
      'Homemade saline recipe: In half liter of clean water, mix 1 pinch of salt (tips of 3 fingers) + 1 fist of molasses or sugar.',
      'Discard prepared saline after 12 hours and prepare a fresh batch.',
      'Continue soft home-cooked meals, khichuri, coconut water, and plain fluids.',
      'Administer zinc syrup/tablets to children for 10-14 days as advised by health workers.'
    ],
    dontListBn: [
      '❌ প্যাকেট স্যালাইন তৈরির সময় কম বা বেশি পানি মেশাবেন না (নির্দিষ্ট আধ লিটার পানিতেই গুলাবেন)।',
      '❌ ডাক্তারের পরামর্শ ছাড়া নিজে নিজে কোনো অ্যান্টিবায়োটিক বা মেট্রোনিডাজল খাওয়া শুরু করবেন না।',
      '❌ ডায়রিয়া বন্ধ করার জন্য লোoperamide বা অ্যান্টি-ডায়রিয়াল ওষুধ যত্রতত্র সেবন করবেন না।',
      '❌ রোগীর খাবার বা বুকের দুধ বন্ধ করবেন না।'
    ],
    dontListEn: [
      '❌ DO NOT use incorrect water volume when preparing saline sachets.',
      '❌ DO NOT take unprescribed antibiotics or metronidazole without clinician guidance.',
      '❌ DO NOT give antimotility drugs to young children.',
      '❌ DO NOT withhold food or breast milk.'
    ],
    speechScriptBn: 'ডায়রিয়ায় সবচেয়ে জরুরি হলো ওরস্যালাইন। প্রতিবার পায়খানার পর এক গ্লাস স্যালাইন পান করুন। ঘরে বানাতে আধা লিটার পরিষ্কার পানিতে এক চিমটি লবণ এবং এক মুঠো গুড় বা চিনি মেশান। স্বাভাবিক খাবার ও ডাবের পানি চালিয়ে যান।',
    speechScriptEn: 'The core treatment for diarrhea is hydration. Drink one glass of saline after each loose stool. To prepare homemade saline, mix half liter water with one pinch of salt and one fistful of molasses.',
    keyFactsBn: 'খাবার স্যালাইন আবিষ্কারে বাংলাদেশ এবং আইসিডিডিআর,বি সারাবিশ্বে পথিকৃৎ। সঠিক স্যালাইন পানে ৯৯% ক্ষেত্রে ডায়রিয়া নিরাময় হয়।',
    keyFactsEn: 'Oral rehydration therapy prevents dehydration deaths in 99% of uncomplicated diarrheal episodes.',
    whereToGoBn: 'কমিউনিটি ক্লিনিক, ইউনিয়ন উপ-স্বাস্থ্য কেন্দ্র বা উপজেলা স্বাস্থ্য কমপ্লেক্স।',
    whereToGoEn: 'Community Clinic, Union Sub-center, or Upazila Health Complex.'
  },
  {
    id: 'heatstroke',
    category: 'environmental',
    icon: <Sun className="text-amber-600" size={24} />,
    titleBn: 'কৃষি মাঠে তীব্র গরম ও হিটস্ট্রোক',
    titleEn: 'Field Heatstroke & Severe Thermal Exhaustion',
    subtitleBn: 'ফসলের ক্ষেতে অতিরিক্ত গরমে শরীর নিস্তেজ ও অজ্ঞান হয়ে গেলে তাৎক্ষণিক করণীয়',
    subtitleEn: 'Emergency response when agricultural workers collapse from severe heat',
    urgency: 'IMMEDIATE',
    doListBn: [
      'আক্রান্ত ব্যক্তিকে অবিলম্বে রোদের মাঠ থেকে সরিয়ে গাছের নিচে বা বাতাসযুক্ত ঠান্ডা ছায়ায় নিয়ে যান।',
      'শরীরের অতিরিক্ত বা টাইট কাপড় খুলে দিন বা ঢিলেঢালা করে দিন।',
      'মাথায়, ঘাড়ে, বগলে ও কুঁচকিতে প্রচুর সাধারণ বা ঠান্ডা পানি ঢালুন এবং ভেজা গামছা দিয়ে শরীর মুছিয়ে দিন।',
      'হাতপাখা বা ফ্যান দিয়ে তীব্র বাতাস করতে থাকুন যাতে শরীরের তাপমাত্রা দ্রুত নেমে আসে।',
      'জ্ঞান থাকলে প্রচুর খাবার স্যালাইন, ডাবের পানি বা ঠান্ডা লেবুর শরবত পান করান।'
    ],
    doListEn: [
      'Immediately move victim to a shady, breezy location away from direct sunlight.',
      'Loosen or remove tight outer clothing.',
      'Pour cool water over the head, neck, armpits, and groin; sponge body with damp cloth.',
      'Fan vigorously to facilitate evaporative cooling and lower core body temperature.',
      'If conscious, give oral rehydration saline, coconut water, or cool fluids.'
    ],
    dontListBn: [
      '❌ রোগী অজ্ঞান বা অচেতন থাকলে কোনো অবস্থাতেই মুখে পানি বা পানীয় জোর করে খাওয়াবেন না (শ্বাসনালীতে পানি ঢুকে মৃত্যু হতে পারে)।',
      '❌ সরাসরি অত্যন্ত হিমশীতল বরফে পুরো শরীর ডুবিয়ে রাখবেন না (রক্তনালী সংকুচিত হয়ে জটিলতা হতে পারে)।',
      '❌ রোগীকে গরম বদ্ধ ঘরে রেখে সময় নষ্ট করবেন না।'
    ],
    dontListEn: [
      '❌ DO NOT force fluids into the mouth of an unconscious or drowsy individual.',
      '❌ DO NOT submerge in freezing ice blocks; use normal cool water and active fanning.',
      '❌ DO NOT confine the victim inside poorly ventilated rooms.'
    ],
    speechScriptBn: 'মাঠে কাজ করার সময় কেউ তীব্র গরমে অসুস্থ হলে দ্রুত ছায়াযুক্ত স্থানে নিয়ে যান। পরনের কাপড় ঢিলে করে মাথায় ও ঘাড়ে পানি ঢালুন এবং জোরে বাতাস করুন। রোগী অচেতন হলে মুখে কোনো পানি দেবেন না। দ্রুত হাসপাতালে নিন।',
    speechScriptEn: 'If a worker suffers heatstroke, move them to shade immediately. Loosen tight clothes, pour water over head and neck, and fan vigorously. Never force fluids into an unconscious mouth.',
    keyFactsBn: 'হিটস্ট্রোকে রোগীর শরীরের তাপমাত্রা ১০৪ ডিগ্রি ফারেনহাইটের উপরে উঠে যেতে পারে এবং ঘাম বন্ধ হয়ে ত্বক খসখসে লালচে হয়ে যেতে পারে।',
    keyFactsEn: 'Heatstroke is characterized by core temperature above 104°F (40°C), confusion, and hot dry skin.',
    whereToGoBn: 'উপজেলা স্বাস্থ্য কমপ্লেক্স বা যেকোনো নিকটস্থ স্বাস্থ্য কেন্দ্র।',
    whereToGoEn: 'Nearest hospital or clinic with IV fluid facility.'
  },
  {
    id: 'pesticide',
    category: 'environmental',
    icon: <Bug className="text-emerald-700" size={24} />,
    titleBn: 'ফসলে কীটনাশক বিষক্রিয়া ও স্প্রে দুর্ঘটনা',
    titleEn: 'Agricultural Pesticide Poisoning & Spray Accidents',
    subtitleBn: 'কীটনাশক ছিটানোর সময় ত্বক, চোখ বা পেটে গেলে জীবনরক্ষাকারী প্রাথমিক পদক্ষেপ',
    subtitleEn: 'First-aid when agro-chemicals touch skin, eyes, or are accidentally ingested',
    urgency: 'IMMEDIATE',
    doListBn: [
      'ত্বকে বা পোশাকে কীটনাশক লাগলে অবিলম্বে কাপড়চোপড় খুলে ফেলুন এবং প্রচুর সাবান-পানি দিয়ে পুরো শরীর ভালো করে ধুয়ে নিন।',
      'চোখে কীটনাশকের গুঁড়া বা ফোঁটা গেলে চোখ খোলা রেখে পরিষ্কার বহমান পানি দিয়ে টানা ১৫-২০ মিনিট ধুয়ে নিন।',
      'কীটনাশক পেটে গেলে রোগীকে দ্রুত পাশ ফিরিয়ে (রিকভারি পজিশনে) শোয়ান যাতে শ্বাসনালী খোলা থাকে।',
      'যে কীটনাশক স্প্রে করা হচ্ছিল তার বোতল, প্যাকেট বা লেবেলটি অবশ্যই সাথে করে হাসপাতালে নিয়ে যান (যাতে ডাক্তার সঠিক অ্যান্টিডোট দিতে পারেন)।'
    ],
    doListEn: [
      'Immediately strip off contaminated clothes and wash skin thoroughly with soap and copious water.',
      'If pesticide enters eyes, flush continuously with clean running water for 15-20 minutes.',
      'Place patient in the recovery position (on their side) to keep airways clear.',
      'Bring the exact pesticide container, label, or sachet to the hospital so doctors can select the precise antidote.'
    ],
    dontListBn: [
      '❌ রোগী অচেতন হলে জোর করে বমি করানোর চেষ্টা করবেন না (কীটনাশক ফুসফুসে ঢুকে মারাত্মক নিউমোনিয়া বা মৃত্যু ডেকে আনতে পারে)।',
      '❌ কোনো তেল, দুধ বা ভেষজ মিশ্রণ খাওয়াবেন না (অনেক রাসায়নিক তেলের সাথে আরো দ্রুত শোষিত হয়)।',
      '❌ খালি হাতে বা মুখে মাস্ক ছাড়া কখনো কীটনাশক স্প্রে করবেন না।'
    ],
    dontListEn: [
      '❌ DO NOT induce vomiting if patient is unconscious or ingested corrosive organophosphates.',
      '❌ DO NOT feed milk or oily substances which can accelerate poison absorption.',
      '❌ DO NOT spray pesticides without masks and protective clothes.'
    ],
    speechScriptBn: 'কীটনাশক বিষক্রিয়া হলে আক্রান্ত কাপড় দ্রুত খুলে সাবান পানি দিয়ে শরীর ধুয়ে ফেলুন। কীটনাশকের বোতল বা প্যাকেট সাথে নিয়ে অবিলম্বে রোগীকে উপজেলা হাসপাতালে নিয়ে যান। যাতে ডাক্তার সঠিক প্রতিষেধক ইনজেকশন দিতে পারেন।',
    speechScriptEn: 'For pesticide poisoning, wash skin immediately with soap and water. Bring the pesticide bottle or sachet to the hospital so physicians can administer the specific antidote.',
    keyFactsBn: 'বাংলাদেশে অর্গানোফসফেট বিষক্রিয়ার জন্য সরকারি হাসপাতালে এট্রোপিন (Atropine) ও প্রালিডক্সাইম (PAM) ইনজেকশন সংরক্ষিত থাকে।',
    keyFactsEn: 'Hospitals stock Atropine and Pralidoxime antidotes for organophosphate chemical exposures.',
    whereToGoBn: 'উপজেলা স্বাস্থ্য কমপ্লেক্স বা জেলা সদর হাসপাতাল (জরুরি বিভাগ)।',
    whereToGoEn: 'Emergency Department of nearest Upazila Health Complex.'
  },
  {
    id: 'burns',
    category: 'common',
    icon: <Flame className="text-orange-600" size={24} />,
    titleBn: 'চুলা বা আগুনে পোড়া ও গরম তরলের ছ্যাঁকা',
    titleEn: 'Burns & Scalds from Stoves or Hot Liquids',
    subtitleBn: 'রান্নাঘরের চুলা, গরম ভাত বা তেলের আগুনে পোড়া ক্ষতের সঠিক প্রাথমিক চিকিৎসা',
    subtitleEn: 'Immediate first-aid for domestic burns, hot boiling water, or cooking oil',
    urgency: 'HIGH',
    doListBn: [
      'পোড়ার সাথে সাথে আক্রান্ত স্থানে সাধারণ ট্যাপ বা টিউবওয়েলের স্বাভাবিক ঠান্ডা পানি কমপক্ষে ২০ মিনিট একটানা ঢালতে থাকুন।',
      'আক্রান্ত স্থানের আংটি, ঘড়ি বা ঢিলেঢালা পোশাক আলতোভাবে খুলে ফেলুন (ত্বকে আটকে গেলে টেনে খুলবেন না)।',
      'পানি ঢালার পর পরিষ্কার শুকনো সুতি কাপড় বা জীবাণুমুক্ত গজ দিয়ে ক্ষতটি আলতোভাবে ঢেকে দিন।',
      'বড় পোড়া বা শিশুর ক্ষেত্রে প্রচুর খাবার স্যালাইন ও পানি পান করিয়ে দ্রুত হাসপাতালে নিয়ে যান।'
    ],
    doListEn: [
      'Immediately pour cool running tap/tube-well water over the burn for at least 20 continuous minutes.',
      'Gently remove loose clothing and jewelry before edema develops (do not peel stuck fabric).',
      'Cover gently with a clean, dry cloth or sterile gauze after cooling.',
      'Provide oral hydration fluids and transport to a burn unit if extensive.'
    ],
    dontListBn: [
      '❌ পোড়া স্থানে টুথপেস্ট, রান্নার তেল, কাঁচা ডিম, ঘি, গোবর বা লবণ দেবেন না (এতে চরম ইনফেকশন ও দাগ হয়)।',
      '❌ বরফ বা বরফ-শীতল পানি ব্যবহার করবেন না (ত্বকের টিস্যুর স্থায়ী ক্ষতি হয়)।',
      '❌ ত্বকে ফোসকা পড়লে তা সুই বা নখ দিয়ে ফাটাবেন না (ফোসকার ভেতরের তরল ক্ষতকে রক্ষা করে)।'
    ],
    dontListEn: [
      '❌ DO NOT apply toothpaste, raw eggs, butter, cooking oil, or cow dung.',
      '❌ DO NOT use ice or freezing water which can cause thermal tissue necrosis.',
      '❌ DO NOT pop or prick blisters; the intact skin shield protects from infection.'
    ],
    speechScriptBn: 'আগুনে বা গরম পানিতে পুড়ে গেলে একটানা ২০ মিনিট স্বাভাবিক ঠান্ডা পানি ঢালুন। পোড়া স্থানে কখনো টুথপেস্ট, ডিম বা তেল লাগাবেন না। ফোসকা ফাটাবেন না। পরিষ্কার কাপড়ে ঢেকে হাসপাতালে নিন।',
    speechScriptEn: 'For burn injuries, pour running cool water continuously for 20 minutes. Never apply toothpaste, eggs, or oil. Never pop blisters. Cover loosely with clean cloth and seek medical attention.',
    keyFactsBn: 'পোড়ার প্রথম ২০ মিনিটে একটানা পানি ঢাললে ত্বকের ভেতরের টিস্যুর ক্ষয়ক্ষতি ৭৫% পর্যন্ত কমে যায়।',
    keyFactsEn: 'Continuous cooling within the first 20 minutes reduces tissue damage and deep burn scarring by up to 75%.',
    whereToGoBn: 'উপজেলা স্বাস্থ্য কমপ্লেক্স বা জাতীয় বার্ন ও প্লাস্টিক সার্জারি ইউনিট।',
    whereToGoEn: 'Upazila Health Complex or National Institute of Burn & Plastic Surgery.'
  },
  {
    id: 'drowning',
    category: 'critical',
    icon: <LifeBuoy className="text-sky-600" size={24} />,
    titleBn: 'পুকুর বা নদীতে পানিতে ডোবা ও কৃত্রিম শ্বাসপ্রশ্বাস',
    titleEn: 'Pond Drowning Rescue & Rural CPR Protocol',
    subtitleBn: 'গ্রামের শিশুদের পুকুরে ডোবার পর দ্রুত জীবন বাঁচানোর সঠিক বৈজ্ঞানিক পদ্ধতি',
    subtitleEn: 'Life-saving CPR resuscitation for childhood pond submersion in rural areas',
    urgency: 'IMMEDIATE',
    doListBn: [
      'পানিতে ডুবন্ত ব্যক্তিকে দ্রুত তুলে শক্ত ও সমতল স্থানে চিত করে শোয়ান।',
      'নাক ও মুখের ভেতর কোনো কাদা, শ্যাওলা বা বমি থাকলে আঙুল দিয়ে দ্রুত পরিষ্কার করে শ্বাসনালী উন্মুক্ত করুন।',
      'শ্বাসপ্রশ্বাস না থাকলে অবিলম্বে বুকের ঠিক মাঝখানে দুই হাত একের ওপর আরেক রেখে শক্তভাবে প্রতি মিনিটে ১০০ থেকে ১২০ বার চাপ দিন (বুকের উচ্চতার এক-তৃতীয়াংশ ডেবে যাবে এমন চাপে)।',
      'প্রতি ৩০ বার বুকে চাপ দেওয়ার পর রোগীর নাক চেপে ধরে মুখে মুখ লাগিয়ে ২টি গভীর ফুঁ (কৃত্রিম শ্বাস) দিন।',
      'জ্ঞান না ফেরা পর্যন্ত সিপিআর চালিয়ে যান এবং অ্যাম্বুলেন্স বা ইঞ্জিনচালিত নৌকায় দ্রুত হাসপাতালে নিন।'
    ],
    doListEn: [
      'Retrieve victim quickly and position flat on their back on firm ground.',
      'Clear mud, weeds, or vomitus from mouth to open airways.',
      'If not breathing, start chest compressions immediately at 100-120 compressions per minute.',
      'Deliver 2 rescue breaths after every 30 compressions by pinching the nose and sealing your mouth.',
      'Continue CPR uninterrupted until medical help arrives or normal breathing resumes.'
    ],
    dontListBn: [
      '❌ শিশুকে উল্টো করে ঝুলিয়ে পেটে চাপ দিয়ে পানি বের করার সনাতন ভুল চেষ্টা করবেন না (এতে ফুসফুসে পাকস্থলীর খাবার ঢুকে তৎক্ষণাৎ মৃত্যু হয়)।',
      '❌ ধানের বস্তা বা তেলের ড্রামের ওপর শিশুকে গড়াগড়ি করাবেন না (এটি ক্ষতিকর কুসংস্কার)।',
      '❌ সিপিআর শুরু করতে এক সেকেন্ডও দেরি করবেন না (মস্তিষ্কে অক্সিজেন না থাকলে ৪ মিনিটে মস্তিষ্কের ক্ষতি শুরু হয়)।'
    ],
    dontListEn: [
      '❌ DO NOT hold the child upside down to drain water from the belly (induces lethal aspiration).',
      '❌ DO NOT roll the victim over oil drums or grain sacks (harmful traditional superstition).',
      '❌ DO NOT delay CPR compressions; brain damage starts within 4 minutes of hypoxia.'
    ],
    speechScriptBn: 'পানিতে ডোবা ব্যক্তিকে সমতল জায়গায় শুইয়ে দিন। মুখ পরিষ্কার করে শ্বাস না থাকলে অবিলম্বে বুকের মাঝখানে মিনিটে ১০০ বার চাপ দিন। শিশুকে উল্টো ঝুলিয়ে পানি বের করার ভুল চেষ্টা করবেন না। সিপিআর চালিয়ে হাসপাতালে নিন।',
    speechScriptEn: 'Lay drowning victim on firm ground. Clear mouth. If not breathing, deliver chest compressions immediately. Never hang children upside down to drain water. Transport urgently to hospital.',
    keyFactsBn: 'বাংলাদেশে ১ থেকে ৫ বছর বয়সী শিশুদের মৃত্যুর অন্যতম প্রধান কারণ হলো বাড়ির কাছের পুকুরে ডুবে যাওয়া। সঠিক সিপিআর দিলে বহু শিশু বেঁচে যায়।',
    keyFactsEn: 'Drowning is a leading cause of child mortality in rural Bangladesh. Immediate bystander CPR triples survival.',
    whereToGoBn: 'নিকটস্থ উপজেলা স্বাস্থ্য কমপ্লেক্স বা যেকোনো ক্লিনিক।',
    whereToGoEn: 'Nearest emergency medical facility.'
  },
  {
    id: 'stroke',
    category: 'critical',
    icon: <Activity className="text-purple-600" size={24} />,
    titleBn: 'ব্রেইন স্ট্রোক চেনার নিয়ম (F.A.S.T)',
    titleEn: 'Brain Stroke Recognition (B.E. F.A.S.T)',
    subtitleBn: 'মুখ বাঁকা, হাত অবশ বা কথা জড়িয়ে গেলে প্রথম সাড়ে চার ঘণ্টার মধ্যে হাসপাতালে পৌঁছানোই জীবনরক্ষা',
    subtitleEn: 'Facial droop, arm weakness, slurred speech: act during the 4.5-hour golden window',
    urgency: 'IMMEDIATE',
    doListBn: [
      'এফ (Face/মুখ): রোগীকে হাসতে বলুন—মুখের একপাশ বাঁকা হয়ে যাচ্ছে কি না লক্ষ্য করুন।',
      'এ (Arms/হাত): দুই হাত সোজা করে ওপরে তুলতে বলুন—এক হাত নিচে নেমে যাচ্ছে বা অবশ কি না দেখুন।',
      'এস (Speech/কথা): একটি সাধারণ বাক্য বলতে বলুন—কথা জড়িয়ে যাচ্ছে বা পরিষ্কার বলতে পারছেন না কি না লক্ষ্য করুন।',
      'টি (Time/সময়): এই ৩টি লক্ষণের যেকোনো একটি দেখা দিলে এক মুহূর্তও দেরি না করে অবিলম্বে সিটি স্ক্যান সুবিধা আছে এমন হাসপাতালে নিয়ে যান।',
      'রোগীকে একপাশে কাত করে শুইয়ে রাখুন যাতে বমি হলে ফুসফুসে না ঢোকে।'
    ],
    doListEn: [
      'F (Face): Ask patient to smile. Look for facial drooping or uneven asymmetry.',
      'A (Arms): Ask patient to raise both arms. Does one arm drift downward or feel numb?',
      'S (Speech): Ask them to repeat a simple sentence. Is speech slurred or strange?',
      'T (Time): If any of these signs appear, rush immediately to a hospital with CT scan capability.',
      'Turn the patient to one side (recovery position) to avoid choking.'
    ],
    dontListBn: [
      '❌ রোগীকে কোনো খাবার, তরল পানি বা প্রেসারের ওষুধ জোর করে মুখে খাওয়াবেন না (গলা অবশ থাকলে শ্বাসনালীতে আটকে দম বন্ধ হতে পারে)।',
      '❌ সুই দিয়ে আঙুলের মাথা ফুটো করে রক্ত বের করার অপবৈজ্ঞানিক প্রচারণা বিশ্বাস করবেন না।',
      '❌ ঘুমিয়ে বা বিশ্রাম নিয়ে লক্ষণ ঠিক হওয়ার অপেক্ষায় বসে থাকবেন না।'
    ],
    dontListEn: [
      '❌ DO NOT feed any food, water, or hypertension pills by mouth (choking hazard).',
      '❌ DO NOT prick fingertips with needles (mythical pseudoscience).',
      '❌ DO NOT wait for symptoms to resolve on their own.'
    ],
    speechScriptBn: 'স্ট্রোক চেনার নিয়ম: মুখ বাঁকা হওয়া, হাত অবশ হওয়া এবং কথা জড়িয়ে যাওয়া। এই তিনটি লক্ষণের একটি দেখা দিলেই দ্রুত হাসপাতালে নিয়ে যান। রোগীকে কোনো ওষুধ বা খাবার জোর করে খাওয়াবেন না।',
    speechScriptEn: 'Recognize stroke symptoms: Facial droop, arm weakness, and slurred speech. If observed, transport to a CT-equipped hospital immediately within the 4.5-hour golden window.',
    keyFactsBn: 'স্ট্রোকের পর সাড়ে ৪ ঘণ্টার মধ্যে (গোল্ডেন আওয়ার) হাসপাতালে পৌঁছালে আধুনিক থ্রম্বোলাইসিস ইনজেকশনের মাধ্যমে মস্তিষ্কের অবশ অংশ সম্পূর্ণ ভালো করা সম্ভব।',
    keyFactsEn: 'Administering thrombolytic therapy within the 4.5-hour window can reverse ischemic stroke paralysis.',
    whereToGoBn: 'জেলা সদর হাসপাতাল, মেডিকেল কলেজ হাসপাতাল বা নিউরোলজি সেন্টার।',
    whereToGoEn: 'District Hospital, Medical College Hospital, or Neurology Center with CT scan.'
  }
];

export default function RuralCareGuide() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'critical' | 'common' | 'environmental'>('all');
  const [activeItem, setActiveItem] = useState<RuralCareItem>(RURAL_CARE_DATA[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  // Filter items
  const filteredItems = RURAL_CARE_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = 
      item.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyFactsBn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleToggleVoice = (item: RuralCareItem) => {
    if (isSpeaking && activeSpeechId === item.id) {
      voiceAssistant.stop();
      setIsSpeaking(false);
      setActiveSpeechId(null);
    } else {
      const textToSpeak = isBn ? item.speechScriptBn : item.speechScriptEn;
      setIsSpeaking(true);
      setActiveSpeechId(item.id);

      voiceAssistant.speak(
        textToSpeak,
        isBn ? 'bn' : 'en',
        () => {
          setIsSpeaking(true);
          setActiveSpeechId(item.id);
        },
        () => {
          setIsSpeaking(false);
          setActiveSpeechId(null);
        },
        () => {
          setIsSpeaking(false);
          setActiveSpeechId(null);
        }
      );
    }
  };

  useEffect(() => {
    return () => {
      voiceAssistant.stop();
    };
  }, []);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Top Banner: Rural Empathy & Life Saving Mission */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
            <HeartHandshake size={15} />
            <span>{isBn ? 'গ্রামীণ স্বাস্থ্য সুরক্ষা ও জরুরি ফার্স্ট-এইড' : 'Rural Emergency & First-Aid Guide'}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            {isBn ? 'সাপে কাটা, হিটস্ট্রোক ও গ্রামের জরুরি প্রাথমিক চিকিৎসা' : 'Life-Saving Rural Emergency Protocols'}
          </h2>
          
          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            {isBn
              ? 'গ্রামাঞ্চলে চিকিৎসক বা অ্যাম্বুলেন্স পৌঁছানোর পূর্বে সঠিক প্রাথমিক চিকিৎসা মানুষের জীবন রক্ষা করে। বৈজ্ঞানিক নিয়ম জানুন, ভুল কুসংস্কার পরিহার করুন এবং কথা শুনতে "ভয়েস চালু" বোতাম স্পর্শ করুন।'
              : 'Scientifically validated emergency guidelines tailored for rural communities. Debunks harmful superstitions with voice readout assistance for low-literacy users.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-medium text-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{isBn ? 'অফলাইন ও প্রত্যন্ত অঞ্চলের উপযোগী' : 'Offline Ready & Verified'}</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-medium text-amber-200">
              <Volume2 size={14} />
              <span>{isBn ? 'বাংলা অডিও পাঠ সুবিধা' : 'Bengali Voice Reading Included'}</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-400/30 text-xs font-semibold text-rose-200">
              <ShieldAlert size={14} />
              <span>{isBn ? 'কুসংস্কার বর্জন গাইড' : 'Anti-Superstition Alerts'}</span>
            </div>
          </div>
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
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? 'সকল সমস্যা (৭টি)' : 'All Emergencies (7)'}
            </button>
            <button
              onClick={() => setSelectedCategory('critical')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'critical'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? '🚨 চরম জরুরি (সাপে কাটা, স্ট্রোক)' : 'Critical Alert'}
            </button>
            <button
              onClick={() => setSelectedCategory('common')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'common'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? '💧 ডায়রিয়া ও পোড়া' : 'Diarrhea & Burns'}
            </button>
            <button
              onClick={() => setSelectedCategory('environmental')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'environmental'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? '🌾 মাঠ ও আবহাওয়া' : 'Agro & Heat'}
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'সমস্যা খুঁজুন (যেমন: সাপে কাটা, স্যালাইন)...' : 'Search emergency topics...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Quick Horizontal Selector Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {filteredItems.map((item) => {
            const isSelected = activeItem.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item);
                  if (isSpeaking && activeSpeechId !== item.id) {
                    voiceAssistant.stop();
                    setIsSpeaking(false);
                    setActiveSpeechId(null);
                  }
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs scale-102'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{item.icon}</span>
                <span>{isBn ? item.titleBn.split('(')[0] : item.titleEn.split('(')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Focus Detail Card for Active Emergency Item */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden transition-all">
        {/* Header of Active Item */}
        <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                {activeItem.icon}
              </div>
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide mb-1 ${
                  activeItem.urgency === 'IMMEDIATE' 
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {activeItem.urgency === 'IMMEDIATE' 
                    ? (isBn ? '⚠️ অবিলম্বে হাসপাতালে নিন' : 'IMMEDIATE ACTION') 
                    : (isBn ? 'জরুরি মনোযোগ প্রয়োজন' : 'HIGH PRIORITY')}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {isBn ? activeItem.titleBn : activeItem.titleEn}
                </h3>
              </div>
            </div>
            <p className="text-slate-600 text-sm pl-0 sm:pl-15">
              {isBn ? activeItem.subtitleBn : activeItem.subtitleEn}
            </p>
          </div>

          {/* Voice Reading & Emergency Call Button Bar */}
          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
            <button
              type="button"
              onClick={() => handleToggleVoice(activeItem)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all ${
                isSpeaking && activeSpeechId === activeItem.id
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
              title={isBn ? 'বাংলায় কথা শুনুন' : 'Listen in Bengali'}
            >
              {isSpeaking && activeSpeechId === activeItem.id ? (
                <>
                  <VolumeX size={18} />
                  <span>{isBn ? 'থামুন' : 'Stop Audio'}</span>
                </>
              ) : (
                <>
                  <Volume2 size={18} />
                  <span>{isBn ? '🔊 কথা শুনুন (ভয়েস গাইড)' : 'Listen Voice Guide'}</span>
                </>
              )}
            </button>

            <a
              href="tel:16263"
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs sm:text-sm font-bold transition-all"
            >
              <PhoneCall size={16} className="text-emerald-600" />
              <span>{isBn ? '১৬২৬৩ কল' : '16263 Help'}</span>
            </a>
          </div>
        </div>

        {/* Content Body: DOs vs DONTs side by side */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What to DO (সবুজ কার্ড - কী করবেন) */}
            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800">
                <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                <h4 className="font-bold text-base sm:text-lg">
                  {isBn ? '✅ কী করবেন (সঠিক বৈজ্ঞানিক নিয়ম)' : 'Recommended Actions'}
                </h4>
              </div>
              <ul className="space-y-3">
                {(isBn ? activeItem.doListBn : activeItem.doListEn).map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What NOT to DO (লাল কার্ড - কী করবেন না / কুসংস্কার বর্জন) */}
            <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center space-x-2 text-rose-800">
                <XCircle size={22} className="text-rose-600 shrink-0" />
                <h4 className="font-bold text-base sm:text-lg">
                  {isBn ? '❌ কী করবেন না (মারাত্মক ভুল ও কুসংস্কার)' : 'Strictly Avoid (Harmful Myths)'}
                </h4>
              </div>
              <ul className="space-y-3">
                {(isBn ? activeItem.dontListBn : activeItem.dontListEn).map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Facts & Referral Destination Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start space-x-3">
              <Sparkles className="text-teal-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {isBn ? 'জরুরি তথ্য ও সুবিধা' : 'Key Health Fact'}
                </h5>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  {isBn ? activeItem.keyFactsBn : activeItem.keyFactsEn}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start space-x-3">
              <MapPin className="text-rose-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {isBn ? 'কোথায় যাবেন' : 'Primary Destination'}
                </h5>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  {isBn ? activeItem.whereToGoBn : activeItem.whereToGoEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
