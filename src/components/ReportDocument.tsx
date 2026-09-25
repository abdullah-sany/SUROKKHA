import React, { forwardRef } from 'react';
import { AnalysisResponse, SafetyLevel } from '../types';
import { Shield, ShieldAlert, AlertTriangle, ShieldCheck, Info, UserRound } from 'lucide-react';

interface ReportDocumentProps {
  result: AnalysisResponse;
  reportId: string;
  generatedDate: string;
  isBn: boolean;
}

const getSafetyDetails = (level: SafetyLevel, isBn: boolean) => {
  switch (level) {
    case 'GREEN':
      return {
        title: isBn ? 'লেভেল: গ্রিন — সাধারণ নির্দেশনা' : 'LEVEL: GREEN — GENERAL GUIDANCE',
        desc: isBn 
          ? 'লক্ষণগুলি আপাতত সাধারণ মনে হচ্ছে। স্ব-যত্ন ও রুটিন চেকআপ বজায় রাখুন।'
          : 'Symptoms appear non-urgent. Routine primary care or self-monitoring is advised.',
        bg: 'bg-emerald-50',
        border: 'border-emerald-300',
        text: 'text-emerald-800',
        badge: 'bg-emerald-600 text-white',
      };
    case 'YELLOW':
      return {
        title: isBn ? 'লেভেল: ইয়েলো — চিকিৎসা মনোযোগ প্রয়োজন হতে পারে' : 'LEVEL: YELLOW — MEDICAL ATTENTION APPROPRIATE',
        desc: isBn 
          ? 'একজন যোগ্য চিকিৎসকের সাথে সাধারণ পরামর্শ বা মূল্যায়নের প্রস্তুতি নিন।'
          : 'Schedule a timely consultation with an appropriate healthcare professional.',
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-900',
        badge: 'bg-amber-600 text-white',
      };
    case 'ORANGE':
      return {
        title: isBn ? 'লেভেল: অরেঞ্জ — জরুরী মনোযোগ প্রয়োজন' : 'LEVEL: ORANGE — URGENT ATTENTION RECOMMENDED',
        desc: isBn 
          ? 'বিলম্ব না করে দ্রুততম সময়ে নিকটস্থ স্বাস্থ্যকেন্দ্রে সেবা গ্রহণ করুন।'
          : 'Prompt medical evaluation is strongly recommended to prevent potential complications.',
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        text: 'text-orange-900',
        badge: 'bg-orange-600 text-white',
      };
    case 'RED':
      return {
        title: isBn ? 'লেভেল: রেড — জরুরী অবস্থা হতে পারে' : 'LEVEL: RED — POTENTIAL MEDICAL EMERGENCY',
        desc: isBn 
          ? 'অবিলম্বে জরুরী চিকিৎসা সহায়তা নিন বা নিকটস্থ হাসপাতালের ইমার্জেন্সিতে যান।'
          : 'Immediate emergency medical intervention or emergency room evaluation is critical.',
        bg: 'bg-rose-50',
        border: 'border-rose-300',
        text: 'text-rose-900',
        badge: 'bg-rose-600 text-white',
      };
    default:
      return {
        title: 'GUIDANCE RECORD',
        desc: '',
        bg: 'bg-slate-50',
        border: 'border-slate-300',
        text: 'text-slate-800',
        badge: 'bg-slate-700 text-white',
      };
  }
};

export const ReportDocument = forwardRef<HTMLDivElement, ReportDocumentProps>(
  ({ result, reportId, generatedDate, isBn }, ref) => {
    const safety = getSafetyDetails(result.safetyLevel, isBn);

    return (
      <div
        ref={ref}
        id="surokkha-report-pdf-target"
        style={{ width: '800px', minHeight: '1130px' }}
        className="bg-white text-slate-900 font-sans p-10 flex flex-col justify-between box-border border border-slate-200"
      >
        {/* Document Header */}
        <div>
          <div className="flex items-start justify-between border-b-2 border-teal-600 pb-5 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
                <Shield size={28} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">SUROKKHA AI</h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 rounded">
                    Module 2
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">
                  Healthcare Navigation & Specialist Guide • স্বাস্থ্যসেবা গাইড
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                {isBn ? 'রেকর্ড আইডি' : 'RECORD ID'}
              </div>
              <div className="text-sm font-mono font-bold text-teal-800">{reportId}</div>
              <div className="text-[11px] text-slate-500 mt-1">{generatedDate}</div>
            </div>
          </div>

          {/* Document Title & Context Notice */}
          <div className="mb-6 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-5 py-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {isBn ? 'স্বাস্থ্য বিষয়ক পর্যবেক্ষণ ও রেফারেল রেকর্ড' : 'Clinical Guidance & Healthcare Navigation Record'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn 
                  ? 'ব্যক্তিগত সংরক্ষণ এবং চিকিৎসককে স্বাস্থ্য সমস্যা প্রদর্শনের জন্য প্রস্তুতকৃত'
                  : 'Prepared for personal health record-keeping and clinical consultation planning'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md bg-white border border-slate-300 text-slate-700">
                {isBn ? 'ভাষা: বাংলা' : 'Language: English'}
              </span>
            </div>
          </div>

          {/* Safety Triage Banner */}
          <div className={`rounded-xl p-5 border-2 ${safety.border} ${safety.bg} mb-6`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 text-xs font-black tracking-wider uppercase rounded ${safety.badge}`}>
                    {result.safetyLevel}
                  </span>
                  <h3 className={`text-base font-bold tracking-tight ${safety.text}`}>
                    {safety.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-700 font-medium mt-1">
                  {safety.desc}
                </p>
              </div>
              <div className="shrink-0 ml-4">
                {result.safetyLevel === 'GREEN' && <ShieldCheck size={32} className="text-emerald-600" />}
                {result.safetyLevel === 'YELLOW' && <Info size={32} className="text-amber-600" />}
                {result.safetyLevel === 'ORANGE' && <AlertTriangle size={32} className="text-orange-600" />}
                {result.safetyLevel === 'RED' && <ShieldAlert size={32} className="text-rose-600" />}
              </div>
            </div>

            {result.emergencyEscalation.required && (
              <div className="mt-4 p-3 bg-rose-600 text-white rounded-lg text-xs font-semibold leading-relaxed">
                🚨 {isBn ? 'জরুরী নির্দেশনা: ' : 'EMERGENCY PROTOCOL: '}
                {result.emergencyEscalation.message}
              </div>
            )}
          </div>

          {/* Section 1: Understood Concern */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600 inline-block"></span>
              <span>{isBn ? 'বর্ণিত স্বাস্থ্য সমস্যা ও লক্ষণ' : 'Reported Symptoms & Concern Understood'}</span>
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 leading-relaxed">
              {result.summary}
            </div>
          </div>

          {/* Section 2: Care Guidance */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600 inline-block"></span>
              <span>{isBn ? 'চিকিৎসা গ্রহণের স্থান ও পরামর্শ' : 'Recommended Setting & Level of Care'}</span>
            </h4>
            <div className="bg-teal-50/50 border border-teal-200 rounded-xl p-4 text-sm font-medium text-slate-900 leading-relaxed">
              {result.careGuidance}
            </div>
          </div>

          {/* Section 3: Suggested Specialists */}
          {result.suggestedSpecialists.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600 inline-block"></span>
                <span>{isBn ? 'প্রস্তাবিত বিশেষজ্ঞ চিকিৎসক' : 'Suggested Healthcare Specialist Categories'}</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {result.suggestedSpecialists.map((spec, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1.5 rounded-md bg-teal-100 text-teal-800 shrink-0 mt-0.5">
                        <UserRound size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 leading-tight">{spec.name}</div>
                        <div className="text-xs text-slate-600 mt-1 leading-snug">{spec.reason}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Warning Signs */}
          {result.warningSigns.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
                <span>{isBn ? 'সতর্ক সংকেত (যেসব লক্ষণে অবিলম্বে সেবা নেওয়া প্রয়োজন)' : 'Critical Warning Signs to Monitor'}</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {result.warningSigns.map((sign, i) => (
                  <div key={i} className="flex items-start space-x-2 bg-rose-50/60 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-900 font-medium leading-snug">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5 text-rose-600" />
                    <span>{sign}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Clinical Notes */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 mb-4">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Info size={13} className="text-slate-500" />
              <span>{isBn ? 'জরুরী জ্ঞাতব্য' : 'Important Clinical & Record Notes'}</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-600">
              {result.importantNotes.map((note, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
              <li className="flex items-start space-x-1.5 font-semibold text-slate-700">
                <span className="text-slate-400 font-bold">•</span>
                <span>
                  {isBn
                    ? 'এই রেকর্ডটি কৃত্রিম বুদ্ধিমত্তা চালিত প্রাথমিক তথ্য ও গাইডেন্সের উদ্দেশ্যে প্রস্তুতকৃত এবং কোনো ডাক্তারী ব্যবস্থাপত্র বা রোগ নির্ণয় নয়।'
                    : 'This document is an AI-assisted informational navigation record and does NOT constitute a formal medical diagnosis or prescription.'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Document Footer */}
        <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-2">
            <Shield size={14} className="text-teal-700" />
            <span className="font-semibold text-slate-700">SUROKKHA AI BD ECOSYSTEM</span>
            <span>•</span>
            <span>Personal Record Keeping Document</span>
          </div>
          <div className="font-mono text-slate-400">
            Page 1 of 1 • Ref: {reportId}
          </div>
        </div>
      </div>
    );
  }
);

ReportDocument.displayName = 'ReportDocument';
