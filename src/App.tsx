/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  FileText, 
  FlaskConical, 
  TestTube, 
  Sparkles, 
  Scale, 
  HeartHandshake, 
  PhoneCall, 
  Building2 
} from 'lucide-react';
import Header, { AppTabType } from './components/Header';
import AnalysisCard from './components/AnalysisCard';
import ResultView from './components/ResultView';
import PrescriptionCard from './components/PrescriptionCard';
import PrescriptionResultView from './components/PrescriptionResultView';
import LabReportCard from './components/LabReportCard';
import LabReportResultView from './components/LabReportResultView';
import DrugSafetyChecker from './components/DrugSafetyChecker';
import HealthCalculator from './components/HealthCalculator';
import RuralCareGuide from './components/RuralCareGuide';
import EmergencyHelplineHub from './components/EmergencyHelplineHub';
import CommunityClinicFinder from './components/CommunityClinicFinder';
import GraminQuickHub from './components/GraminQuickHub';
import HowItWorks from './components/HowItWorks';
import SafetyPrivacy from './components/SafetyPrivacy';
import AboutSection from './components/AboutSection';
import FAQ from './components/FAQ';
import RecentSearches from './components/RecentSearches';
import { AnalysisResponse, PrescriptionAnalysisResponse, LabReportAnalysisResponse, RecentSearchItem } from './types';
import { useLanguage } from './context/LanguageContext';
import { useRecentSearches } from './hooks/useRecentSearches';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTabType>('symptoms');
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [prescriptionResult, setPrescriptionResult] = useState<PrescriptionAnalysisResponse | null>(null);
  const [prescriptionImageUrl, setPrescriptionImageUrl] = useState<string | undefined>(undefined);
  const [labResult, setLabResult] = useState<LabReportAnalysisResponse | null>(null);
  const [labImageUrl, setLabImageUrl] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [isPrescriptionLoading, setIsPrescriptionLoading] = useState(false);
  const [isLabLoading, setIsLabLoading] = useState(false);

  const { language } = useLanguage();
  const isBn = language === 'bn';

  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches();

  const handleAnalysisResult = (analysisResult: AnalysisResponse, queryText?: string) => {
    setResult(analysisResult);
    const query = queryText || analysisResult.summary?.slice(0, 80) || (isBn ? 'স্বাস্থ্য সমস্যা বিশ্লেষণ' : 'Health Concern Analysis');
    addRecentSearch(query, analysisResult);
  };

  const handlePrescriptionResult = (pResult: PrescriptionAnalysisResponse, imgUrl?: string) => {
    setPrescriptionResult(pResult);
    setPrescriptionImageUrl(imgUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLabResult = (lResult: LabReportAnalysisResponse, imgUrl?: string) => {
    setLabResult(lResult);
    setLabImageUrl(imgUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecentSearch = (item: RecentSearchItem) => {
    setActiveTab('symptoms');
    setPrescriptionResult(null);
    setLabResult(null);
    setResult(item.result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (sectionId: string) => {
    if (result || prescriptionResult || labResult) {
      setResult(null);
      setPrescriptionResult(null);
      setLabResult(null);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleTabChange = (tab: AppTabType) => {
    setActiveTab(tab);
    setResult(null);
    setPrescriptionResult(null);
    setLabResult(null);
  };

  const isAnyResult = Boolean(result || prescriptionResult || labResult);
  const isAnyLoading = isLoading || isPrescriptionLoading || isLabLoading;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-100 dark:selection:bg-teal-900 selection:text-teal-900 dark:selection:text-teal-100 relative overflow-hidden transition-colors duration-200">
      {/* Subtle abstract background element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-100/40 dark:bg-cyan-950/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-teal-100/40 dark:bg-teal-950/30 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="relative z-10 flex-grow flex flex-col w-full h-full">
        <Header 
          onNavigate={handleNavigate} 
          activeTab={activeTab} 
          onSelectTab={handleTabChange} 
        />
        
        <main className="flex-grow flex flex-col items-center justify-start w-full px-4 sm:px-6 py-6 md:py-10">
          <div className="w-full max-w-4xl space-y-8">
            {!isAnyResult && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                {/* Innovation Fair Prestige & Rural Quick Hub */}
                <GraminQuickHub 
                  onSelectFeature={handleTabChange}
                  activeTab={activeTab}
                />

                {/* Feature Mode Switcher Bar */}
                <div className="w-full flex justify-center">
                  <div className="inline-flex p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex-wrap justify-center gap-1 max-w-full">
                    <button
                      type="button"
                      onClick={() => handleTabChange('symptoms')}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        activeTab === 'symptoms'
                          ? 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 shadow-xs border border-slate-200/80 dark:border-slate-700 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Activity size={15} className={activeTab === 'symptoms' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'} />
                      <span>{isBn ? 'লক্ষণ নির্দেশক' : 'Symptom Guide'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabChange('prescription')}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        activeTab === 'prescription'
                          ? 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 shadow-xs border border-slate-200/80 dark:border-slate-700 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <FileText size={15} className={activeTab === 'prescription' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'} />
                      <span>{isBn ? 'প্রেসক্রিপশন' : 'Prescription'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabChange('lab-report')}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        activeTab === 'lab-report'
                          ? 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 shadow-xs border border-slate-200/80 dark:border-slate-700 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <TestTube size={15} className={activeTab === 'lab-report' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'} />
                      <span>{isBn ? 'ল্যাব ডিকোডার' : 'Lab Decoder'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabChange('drug-safety')}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        activeTab === 'drug-safety'
                          ? 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 shadow-xs border border-slate-200/80 dark:border-slate-700 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <FlaskConical size={15} className={activeTab === 'drug-safety' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'} />
                      <span>{isBn ? 'ড্রাগ সেফটি' : 'Drug Safety'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabChange('rural-care')}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        activeTab === 'rural-care'
                          ? 'bg-white dark:bg-slate-800 text-rose-800 dark:text-rose-300 shadow-xs border border-rose-200/80 dark:border-rose-900/60 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <HeartHandshake size={15} className={activeTab === 'rural-care' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'} />
                      <span>{isBn ? 'জরুরি ফার্স্ট-এইড' : 'Rural First-Aid'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabChange('emergency-helpline')}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        activeTab === 'emergency-helpline'
                          ? 'bg-white dark:bg-slate-800 text-teal-900 dark:text-teal-300 shadow-xs border border-teal-200/80 dark:border-teal-900/60 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-teal-800 dark:hover:text-teal-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <PhoneCall size={15} className={activeTab === 'emergency-helpline' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'} />
                      <span>{isBn ? '১৬২৬৩ হেল্পলাইন' : '16263 Hotlines'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabChange('community-clinic')}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        activeTab === 'community-clinic'
                          ? 'bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-xs border border-emerald-200/80 dark:border-emerald-900/60 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Building2 size={15} className={activeTab === 'community-clinic' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'} />
                      <span>{isBn ? 'কমিউনিটি ক্লিনিক' : 'Community Clinic'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabChange('health-calculator')}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        activeTab === 'health-calculator'
                          ? 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 shadow-xs border border-slate-200/80 dark:border-slate-700 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Scale size={15} className={activeTab === 'health-calculator' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'} />
                      <span>{isBn ? 'ক্যালকুলেটর' : 'Calculator'}</span>
                    </button>
                  </div>
                </div>
                
                {/* Hero Titles for Non-Rural tabs (Rural tabs have their own rich headers) */}
                {activeTab === 'symptoms' ? (
                  <div className="text-center space-y-3 pt-2">
                    {isBn ? (
                      <>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                          আপনার সমস্যাটি বলুন বা লিখুন।<br />সঠিক ডাক্তারের পরামর্শ ও দিকনির্দেশনা পান।
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                          বাংলায় ভয়েসে বলুন বা লিখে জানান। ডুয়েল এআই ইঞ্জিন (Gemini + Groq LPU) তাৎক্ষণিক ক্লিনিক্যাল ট্রায়াজ বিশ্লেষণ সম্পন্ন করবে।
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                          Understand Your Concern.<br />
                          Know Where to Seek Care.
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                          Describe what you are experiencing via voice or text and receive dual AI-powered clinical triage guidance.
                        </p>
                      </>
                    )}
                  </div>
                ) : activeTab === 'prescription' ? (
                  <div className="text-center space-y-3 pt-2">
                    {isBn ? (
                      <>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                          ডাক্তারের প্রেসক্রিপশন পড়ুন সহজে।<br />ওষুধ ও নির্দেশনার নিখুঁত বাংলা রূপান্তর।
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                          প্রেসক্রিপশনের ছবি আপলোড করুন। এআই নির্ভুলভাবে ডাক্তারের হাতের লেখা, ওষুধের মাত্রা (ডোজ), খাওয়ার নিয়ম এবং ল্যাব টেস্ট বাংলায় বিশ্লেষণ করবে।
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                          Decode Doctor Prescriptions.<br />
                          Clear Bengali Drug & Dosage Translation.
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                          Upload or snap a prescription photo. Surokkha AI extracts doctor details, standardizes medicine names, decodes dosages, and translates instructions into empathetic Bengali.
                        </p>
                      </>
                    )}
                  </div>
                ) : activeTab === 'lab-report' ? (
                  <div className="text-center space-y-3 pt-2">
                    {isBn ? (
                      <>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                          স্মার্ট ল্যাব ও রক্ত পরীক্ষা ডিকোডার।<br />জটিল মেডিকেল রিপোর্টের সহজ বাংলা বিশ্লেষণ।
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                          সিবিসি, সুগার, লিপিড প্রোফাইল বা কিডনি টেস্টের মান আপলোড করুন। এআই প্রতিটি বায়োমার্কারের রেফারেন্স রেঞ্জ, ঝুঁকির মাত্রা ও পরবর্তী পদক্ষেপ সহজ বাংলায় বুঝিয়ে দেবে।
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                          Smart Pathology & Lab Report AI.<br />
                          Clinical Biomarker Insights in Plain Language.
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                          Scan blood test or pathology sheets to decode biological ranges, abnormal markers, risk levels, and dietary advice.
                        </p>
                      </>
                    )}
                  </div>
                ) : activeTab === 'drug-safety' ? (
                  <div className="text-center space-y-3 pt-2">
                    {isBn ? (
                      <>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                          ড্রাগ ইন্টারঅ্যাকশন ও সেফটি ম্যাট্রিক্স।<br />ওষুধের ক্ষতিকর প্রতিক্রিয়া থেকে সুরক্ষিত থাকুন।
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                          একাধিক ওষুধ একসাথে সেবনের বিপদ, টাইমিং ব্যবধান, খাদ্য সতর্কতা ও কন্ট্রা-ইন্ডিকেশন তাৎক্ষণিক ক্লিনিক্যাল এআই দিয়ে যাচাই করুন।
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                          Drug Interaction & Safety Matrix.<br />
                          AI Screening for Safe Medication Combinations.
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                          Screen multiple medicines for adverse drug-drug interactions (DDI), absorption conflicts, timing requirements, and dietary contraindications.
                        </p>
                      </>
                    )}
                  </div>
                ) : activeTab === 'health-calculator' ? (
                  <div className="text-center space-y-3 pt-2">
                    {isBn ? (
                      <>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                          স্মার্ট স্বাস্থ্য ও হাইড্রেশন ক্যালকুলেটর।<br />ক্লিনিক্যাল বিএমআই ও ব্যক্তিগত পানির গাইড।
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                          WHO এশিয়ান স্ট্যান্ডার্ড অনুযায়ী আপনার আদর্শ ওজন ও বিএমআই জানুন এবং শারীরিক ওজন, দৈনিক পরিশ্রম ও আবহাওয়ার ওপর ভিত্তি করে আপনার প্রয়োজনীয় পানির সঠিক পরিমাণ হিসাব করুন।
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                          Precision Health & Hydration Calculators.<br />
                          Clinical BMI & Daily Water Intake Guidance.
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                          Calculate body mass index with South Asian WHO cutoffs and determine personalized daily hydration requirements tailored to weight, climate, and physical exertion.
                        </p>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            )}
            
            {/* View Render Area */}
            {labResult ? (
              <LabReportResultView
                data={labResult}
                uploadedImageUrl={labImageUrl}
                onReset={() => setLabResult(null)}
              />
            ) : prescriptionResult ? (
              <PrescriptionResultView 
                data={prescriptionResult} 
                imageUrl={prescriptionImageUrl} 
                onReset={() => setPrescriptionResult(null)} 
              />
            ) : result ? (
              <ResultView 
                result={result} 
                onReset={() => setResult(null)} 
              />
            ) : (
              <>
                {activeTab === 'symptoms' ? (
                  <AnalysisCard 
                    onResult={handleAnalysisResult} 
                    isLoading={isLoading} 
                    setIsLoading={setIsLoading} 
                  />
                ) : activeTab === 'prescription' ? (
                  <PrescriptionCard 
                    onResult={handlePrescriptionResult} 
                    isLoading={isPrescriptionLoading} 
                    setIsLoading={setIsPrescriptionLoading} 
                  />
                ) : activeTab === 'lab-report' ? (
                  <LabReportCard
                    onResult={handleLabResult}
                    isLoading={isLabLoading}
                    setIsLoading={setIsLabLoading}
                  />
                ) : activeTab === 'drug-safety' ? (
                  <DrugSafetyChecker />
                ) : activeTab === 'rural-care' ? (
                  <RuralCareGuide />
                ) : activeTab === 'emergency-helpline' ? (
                  <EmergencyHelplineHub />
                ) : activeTab === 'community-clinic' ? (
                  <CommunityClinicFinder />
                ) : (
                  <HealthCalculator />
                )}

                <HowItWorks />
                <SafetyPrivacy />
                <AboutSection />
                <FAQ />
                {activeTab === 'symptoms' && (
                  <RecentSearches
                    searches={recentSearches}
                    onSelectSearch={handleSelectRecentSearch}
                    onRemoveSearch={removeRecentSearch}
                    onClearAll={clearRecentSearches}
                  />
                )}
              </>
            )}
          </div>
        </main>

        {/* Sticky Privacy Reminder Banner */}
        {isAnyLoading && (
          <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-xs text-slate-200 px-4 py-3 shadow-2xl z-50 animate-in slide-in-from-bottom-full duration-500 border-t border-slate-800">
            <div className="max-w-3xl mx-auto flex items-center justify-center gap-3 text-center sm:text-left">
              <ShieldCheck size={20} className="text-teal-400 shrink-0 hidden sm:block" />
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                <span className="font-semibold text-white">
                  {isBn ? 'গোপনীয়তা সতর্কতা:' : 'Privacy Reminder:'}
                </span>{' '}
                {isBn 
                  ? 'আপনার প্রেসক্রিপশন ও ল্যাব টেস্টের তথ্য সুরক্ষিতভাবে রিয়েল-টাইমে প্রসেস করা হয় এবং কখনই স্থায়ীভাবে সংরক্ষণ করা হয় না।' 
                  : 'Your prescription and pathology data are processed ephemerally and never permanently stored.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
