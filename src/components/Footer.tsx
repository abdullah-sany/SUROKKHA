import React from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 opacity-80">
          <Shield size={16} className="text-teal-600" />
          <span className="font-semibold text-slate-900 text-sm tracking-tight">SUROKKHA SPECIALIST AI</span>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">{isBn ? 'কীভাবে কাজ করে' : 'How It Works'}</a>
          <a href="#" className="hover:text-slate-900 transition-colors">{isBn ? 'নিরাপত্তা ও গোপনীয়তা' : 'Safety & Privacy'}</a>
          <a href="#" className="hover:text-slate-900 transition-colors">{isBn ? 'আমাদের সম্পর্কে' : 'About'}</a>
        </div>
        
        <div className="text-xs text-slate-400 font-medium">
          {isBn ? 'ভবিষ্যৎ সুরক্ষা এআই বিডি ইকোসিস্টেমের একটি অংশ।' : 'Part of the future SUROKKHA AI BD ecosystem.'}
        </div>
      </div>
    </footer>
  );
}
