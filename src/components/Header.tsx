import React, { useState } from 'react';
import { 
  Shield, 
  Menu, 
  X, 
  FileText, 
  Activity, 
  FlaskConical, 
  TestTube, 
  Scale, 
  PhoneCall, 
  HeartHandshake, 
  Building2 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type AppTabType = 
  | 'symptoms' 
  | 'prescription' 
  | 'drug-safety' 
  | 'lab-report' 
  | 'health-calculator'
  | 'rural-care'
  | 'emergency-helpline'
  | 'community-clinic';

interface HeaderProps {
  onNavigate?: (sectionId: string) => void;
  activeTab?: AppTabType;
  onSelectTab?: (tab: AppTabType) => void;
}

export default function Header({ onNavigate, activeTab = 'symptoms', onSelectTab }: HeaderProps) {
  const { language, setLanguage } = useLanguage();
  const isBn = language === 'bn';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleTabSwitch = (tab: AppTabType) => {
    setMobileMenuOpen(false);
    if (onSelectTab) {
      onSelectTab(tab);
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2.5 cursor-pointer select-none"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Shield size={22} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
              SUROKKHA <span className="text-teal-600">AI</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {isBn ? 'গ্রামীণ স্বাস্থ্য সুরক্ষা ও ক্লিনিক্যাল এআই' : 'Rural Health & Clinical AI'}
            </span>
          </div>
        </div>

        {/* Clean Minimal Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-600">
          <a 
            href="#how-it-works" 
            onClick={(e) => handleNavClick(e, 'how-it-works')}
            className="text-xs font-semibold hover:text-teal-600 transition-colors"
          >
            {isBn ? 'কীভাবে কাজ করে' : 'How It Works'}
          </a>
          <a 
            href="#safety-privacy" 
            onClick={(e) => handleNavClick(e, 'safety-privacy')}
            className="text-xs font-semibold hover:text-teal-600 transition-colors"
          >
            {isBn ? 'নিরাপত্তা' : 'Safety'}
          </a>
          <a 
            href="#about" 
            onClick={(e) => handleNavClick(e, 'about')}
            className="text-xs font-semibold hover:text-teal-600 transition-colors"
          >
            {isBn ? 'আমাদের সম্পর্কে' : 'About'}
          </a>
        </nav>

        {/* Right Action: Clean Language Switcher + Dual Engine Badge */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gemini + Groq LPU</span>
          </div>

          <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
            <button 
              onClick={() => setLanguage('en')} 
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${!isBn ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}>
              EN
            </button>
            <button 
              onClick={() => setLanguage('bn')} 
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${isBn ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}>
              বাং
            </button>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            {isBn ? 'সেবাসমূহ নির্বাচন করুন' : 'Select Feature Tab'}
          </div>
          <div className="grid grid-cols-2 gap-1.5 pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => handleTabSwitch('symptoms')}
              className={`flex items-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'symptoms' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Activity size={14} />
              <span>{isBn ? 'লক্ষণ নির্দেশক' : 'Symptoms'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('prescription')}
              className={`flex items-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'prescription' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <FileText size={14} />
              <span>{isBn ? 'প্রেসক্রিপশন' : 'Prescription'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('lab-report')}
              className={`flex items-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'lab-report' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <TestTube size={14} />
              <span>{isBn ? 'ল্যাব ডিকোডার' : 'Lab Decoder'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('drug-safety')}
              className={`flex items-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'drug-safety' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <FlaskConical size={14} />
              <span>{isBn ? 'ড্রাগ সেফটি' : 'Drug Safety'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('rural-care')}
              className={`flex items-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'rural-care' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800'
              }`}
            >
              <HeartHandshake size={14} />
              <span>{isBn ? 'সাপে কাটা ও ফার্স্ট-এইড' : 'Rural First-Aid'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('emergency-helpline')}
              className={`flex items-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'emergency-helpline' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-800'
              }`}
            >
              <PhoneCall size={14} />
              <span>{isBn ? '১৬২৬৩ হেল্পলাইন' : '16263 Helpline'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('community-clinic')}
              className={`flex items-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'community-clinic' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800'
              }`}
            >
              <Building2 size={14} />
              <span>{isBn ? 'কমিউনিটি ক্লিনিক' : 'Community Clinic'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('health-calculator')}
              className={`flex items-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'health-calculator' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Scale size={14} />
              <span>{isBn ? 'ক্যালকুলেটর' : 'Calculator'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between px-3 py-2 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs font-semibold text-emerald-800">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{isBn ? 'ডুয়েল ইঞ্জিন আর্কিটেকচার' : 'Dual AI Engine Active'}</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              Gemini + Groq
            </span>
          </div>

          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <a 
              href="#how-it-works" 
              onClick={(e) => handleNavClick(e, 'how-it-works')}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-teal-700 transition-colors"
            >
              {isBn ? 'কীভাবে কাজ করে' : 'How It Works'}
            </a>
            <a 
              href="#safety-privacy" 
              onClick={(e) => handleNavClick(e, 'safety-privacy')}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-teal-700 transition-colors"
            >
              {isBn ? 'নিরাপত্তা ও গোপনীয়তা' : 'Safety & Privacy'}
            </a>
            <a 
              href="#about" 
              onClick={(e) => handleNavClick(e, 'about')}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-teal-700 transition-colors"
            >
              {isBn ? 'আমাদের সম্পর্কে' : 'About'}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
