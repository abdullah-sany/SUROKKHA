import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Info, 
  Stethoscope, 
  Utensils, 
  ArrowLeft, 
  Printer, 
  Copy, 
  Check, 
  Activity, 
  Calendar, 
  User, 
  Building2, 
  ChevronRight,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { LabReportAnalysisResponse, LabParameterItem, LabParameterStatus, LabRiskLevel } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LabReportResultViewProps {
  data: LabReportAnalysisResponse;
  onReset: () => void;
  uploadedImageUrl?: string;
}

export default function LabReportResultView({
  data,
  onReset,
  uploadedImageUrl
}: LabReportResultViewProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'ABNORMAL' | 'NORMAL'>('ALL');

  const getStatusBadge = (status: LabParameterStatus, riskLevel: LabRiskLevel) => {
    switch (status) {
      case 'CRITICAL_HIGH':
      case 'CRITICAL_LOW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
            <AlertOctagon size={12} className="mr-1 text-rose-600" />
            {status === 'CRITICAL_HIGH' 
              ? (isBn ? 'মারাত্মক বেশি (CRITICAL)' : 'CRITICAL HIGH') 
              : (isBn ? 'মারাত্মক কম (CRITICAL)' : 'CRITICAL LOW')}
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle size={12} className="mr-1 text-amber-700" />
            {isBn ? 'স্বাভাবিকের চেয়ে বেশি (HIGH)' : 'ABOVE NORMAL'}
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
            <AlertTriangle size={12} className="mr-1 text-indigo-700" />
            {isBn ? 'স্বাভাবিকের চেয়ে কম (LOW)' : 'BELOW NORMAL'}
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={12} className="mr-1 text-emerald-600" />
            {isBn ? 'স্বাভাবিক (NORMAL)' : 'NORMAL'}
          </span>
        );
    }
  };

  const getOverallStatusDisplay = () => {
    switch (data.overallHealthStatus) {
      case 'CRITICAL_ALERT':
        return {
          title: isBn ? 'জরুরি চিকিৎসা পর্যবেক্ষণ প্রয়োজন' : 'Critical Medical Attention Required',
          badgeClass: 'bg-rose-600 text-white',
          borderClass: 'border-rose-300 bg-rose-50/60',
          textColor: 'text-rose-800',
          icon: <AlertOctagon size={28} className="text-rose-600" />
        };
      case 'ATTENTION_NEEDED':
        return {
          title: isBn ? 'চিকিৎসকের সাথে পরামর্শ আবশ্যক' : 'Physician Consultation Strongly Advised',
          badgeClass: 'bg-amber-600 text-white',
          borderClass: 'border-amber-300 bg-amber-50/60',
          textColor: 'text-amber-800',
          icon: <AlertTriangle size={28} className="text-amber-600" />
        };
      case 'MILD_ANOMALY':
        return {
          title: isBn ? 'সামান্য বিচ্যুতি শনাক্ত (নিয়ন্ত্রণে রাখা সম্ভব)' : 'Mild Deviation Detected (Manageable)',
          badgeClass: 'bg-sky-600 text-white',
          borderClass: 'border-sky-300 bg-sky-50/60',
          textColor: 'text-sky-800',
          icon: <Info size={28} className="text-sky-600" />
        };
      case 'OPTIMAL':
      default:
        return {
          title: isBn ? 'সকল প্যারামিটার স্বাভাবিক ও স্বাস্থ্যকর' : 'All Test Parameters Optimal',
          badgeClass: 'bg-emerald-600 text-white',
          borderClass: 'border-emerald-300 bg-emerald-50/60',
          textColor: 'text-emerald-800',
          icon: <CheckCircle2 size={28} className="text-emerald-600" />
        };
    }
  };

  const overall = getOverallStatusDisplay();

  const filteredParameters = data.parameters.filter(param => {
    if (filter === 'ABNORMAL') return param.status !== 'NORMAL';
    if (filter === 'NORMAL') return param.status === 'NORMAL';
    return true;
  });

  const handleCopySummary = () => {
    const lines = [
      `=== SUROKKHA AI - ল্যাব ও রক্ত পরীক্ষা সারসংক্ষেপ ===`,
      `টেস্ট ক্যাটাগরি: ${data.testCategory}`,
      `সামগ্রিক অবস্থা: ${overall.title}`,
      `ডায়াগনস্টিক সেন্টার: ${data.labName || 'N/A'}`,
      `রোগী: ${data.patientName || 'N/A'} (${data.patientAgeGender || ''})`,
      `অস্বাভাবিক বায়োমার্কার: ${data.abnormalParametersCount} টি (ক্রিটিক্যাল: ${data.criticalFlagsCount})`,
      '',
      '--- বায়োমার্কার ফলাফল ---',
      ...data.parameters.map(
        p => `[${p.status}] ${p.parameterName} (${p.parameterNameBn}): ${p.value} ${p.unit} (স্ট্যান্ডার্ড: ${p.standardRange}) -> ${p.interpretationBn}`
      ),
      '',
      `ক্লিনিক্যাল সারসংক্ষেপ: ${data.clinicalSummaryBn}`,
      `পরামর্শযোগ্য বিশেষজ্ঞ: ${data.recommendedDoctorSpecialist}`,
      '',
      '--- স্বাস্থ্য ও খাদ্যাভ্যাস পরামর্শ ---',
      ...data.dietaryAndLifestyleTipsBn.map(tip => `• ${tip}`),
      '',
      `সতর্কতা: ${data.disclaimer}`
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Top Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-teal-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{isBn ? 'অন্য রিপোর্ট স্ক্যান করুন' : 'Scan Another Report'}</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'সারসংক্ষেপ কপি' : 'Copy Summary')}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer size={14} />
            <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className={`rounded-3xl border ${overall.borderClass} p-5 sm:p-7 shadow-xs bg-white space-y-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-slate-100/90 shrink-0">
              {overall.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {isBn ? 'প্যাথলজি ও রক্ত পরীক্ষা রিপোর্ট' : 'Pathology & Blood Report'}
                </span>
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${overall.badgeClass}`}>
                  {data.overallHealthStatus}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {data.testCategory}
              </h2>
              <p className={`text-xs sm:text-sm font-semibold mt-0.5 ${overall.textColor}`}>
                {overall.title}
              </p>
            </div>
          </div>

          {/* Biomarker Stats Counter */}
          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 self-stretch sm:self-auto justify-around sm:justify-start">
            <div className="text-center px-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                {isBn ? 'মোট বায়োমার্কার' : 'Parameters'}
              </span>
              <span className="text-lg font-black text-slate-800">
                {data.parameters.length}
              </span>
            </div>
            <div className="h-6 w-[1px] bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-[10px] font-bold uppercase text-amber-600 block">
                {isBn ? 'অস্বাভাবিক' : 'Abnormal'}
              </span>
              <span className="text-lg font-black text-amber-700">
                {data.abnormalParametersCount}
              </span>
            </div>
            {data.criticalFlagsCount > 0 && (
              <>
                <div className="h-6 w-[1px] bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-[10px] font-bold uppercase text-rose-600 block animate-pulse">
                    {isBn ? 'ক্রিটিক্যাল' : 'Critical'}
                  </span>
                  <span className="text-lg font-black text-rose-600">
                    {data.criticalFlagsCount}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Lab & Patient Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          {data.labName && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
              <Building2 size={15} className="text-teal-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">{isBn ? 'ল্যাবরেটরি' : 'Lab'}</span>
                <span className="font-bold text-slate-700 truncate block">{data.labName}</span>
              </div>
            </div>
          )}

          {data.patientName && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
              <User size={15} className="text-teal-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">{isBn ? 'রোগী' : 'Patient'}</span>
                <span className="font-bold text-slate-700 truncate block">{data.patientName}</span>
              </div>
            </div>
          )}

          {data.patientAgeGender && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
              <Activity size={15} className="text-teal-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">{isBn ? 'বয়স ও লিঙ্গ' : 'Age/Sex'}</span>
                <span className="font-bold text-slate-700 truncate block">{data.patientAgeGender}</span>
              </div>
            </div>
          )}

          {data.reportDate && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
              <Calendar size={15} className="text-teal-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">{isBn ? 'তারিখ' : 'Date'}</span>
                <span className="font-bold text-slate-700 truncate block">{data.reportDate}</span>
              </div>
            </div>
          )}
        </div>

        {/* Narrative Clinical Summary */}
        <div className="pt-2">
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center space-x-1.5">
              <Sparkles size={14} className="text-teal-600" />
              <span>{isBn ? 'ক্লিনিক্যাল প্যাথলজিস্ট পর্যালোচনা (বাংলা ব্যাখ্যা):' : 'Clinical Summary & Narrative:'}</span>
            </span>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {data.clinicalSummaryBn}
            </p>
          </div>
        </div>
      </div>

      {/* Specialist & Urgency Callout */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-teal-50 text-teal-700 shrink-0">
            <Stethoscope size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {isBn ? 'পরামর্শযোগ্য বিশেষজ্ঞ চিকিৎসক:' : 'Recommended Specialist:'}
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-900 block">
              {data.recommendedDoctorSpecialist}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-slate-500">{isBn ? 'জরুরিতা:' : 'Urgency:'}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            data.urgencyLevel === 'IMMEDIATE_EMERGENCY'
              ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
              : data.urgencyLevel === 'PROMPT_CONSULTATION'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}>
            {data.urgencyLevel === 'IMMEDIATE_EMERGENCY'
              ? (isBn ? '🚨 তাৎক্ষণিক জরুরি চিকিৎসা' : 'Immediate Emergency')
              : data.urgencyLevel === 'PROMPT_CONSULTATION'
                ? (isBn ? '⚠️ ১-৩ দিনের মধ্যে পরামর্শ নিন' : 'Prompt Consultation')
                : (isBn ? '✅ রুটিন চেকআপ' : 'Routine')}
          </span>
        </div>
      </div>

      {/* Biomarker Parameters Analysis Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Activity size={18} className="text-teal-600" />
              <span>{isBn ? 'বায়োমার্কার বিস্তারিত ফলাফল ও বিশ্লেষণ' : 'Detailed Biomarker Parameters'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isBn 
                ? 'প্রতিটি প্যারামিটারের মান, স্ট্যান্ডার্ড রেঞ্জ এবং সহজ বাংলায় এর ক্লিনিক্যাল অর্থ নিচে দেওয়া হলো।' 
                : 'Each biomarker reading compared against standard biological reference intervals.'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'সকল' : 'All'} ({data.parameters.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('ABNORMAL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === 'ABNORMAL' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'অস্বাভাবিক' : 'Abnormal'} ({data.abnormalParametersCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('NORMAL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === 'NORMAL' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'স্বাভাবিক' : 'Normal'}
            </button>
          </div>
        </div>

        {/* Parameter Cards */}
        <div className="grid grid-cols-1 gap-3.5">
          {filteredParameters.map((param, idx) => {
            const isAbnormal = param.status !== 'NORMAL';
            const isCrit = param.status === 'CRITICAL_HIGH' || param.status === 'CRITICAL_LOW';

            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCrit
                    ? 'bg-rose-50/50 border-rose-200'
                    : isAbnormal
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {param.parameterName}
                      </span>
                      {param.parameterNameBn && (
                        <span className="text-xs text-slate-500">
                          ({param.parameterNameBn})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">{isBn ? 'রেফারেন্স রেঞ্জ' : 'Reference'}</span>
                      <span className="text-xs font-semibold text-slate-600">
                        {param.standardRange} {param.unit}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className={`text-base font-black ${
                        isCrit ? 'text-rose-600' : isAbnormal ? 'text-amber-700' : 'text-emerald-700'
                      }`}>
                        {param.value}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{param.unit}</span>
                    </div>

                    {getStatusBadge(param.status, param.riskLevel)}
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 mr-1.5">
                      {isBn ? '🔍 অর্থ ও প্রভাব:' : '🔍 Meaning:'}
                    </span>
                    {param.interpretationBn}
                  </div>

                  {param.actionableNoteBn && (
                    <div className="text-xs text-teal-900 bg-teal-50/60 p-2.5 rounded-xl border border-teal-100 flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-teal-600 shrink-0 mt-0.5" />
                      <span>{param.actionableNoteBn}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Culturally Tailored Dietary & Lifestyle Tips */}
      {data.dietaryAndLifestyleTipsBn && data.dietaryAndLifestyleTipsBn.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Utensils size={18} className="text-amber-600" />
            <span>{isBn ? 'খাদ্যাভ্যাস ও জীবনযাত্রা সংক্রান্ত ক্লিনিক্যাল পরামর্শ' : 'Dietary & Lifestyle Guidance'}</span>
          </h3>
          <p className="text-xs text-slate-500">
            {isBn 
              ? 'আপনার রক্ত পরীক্ষার অস্বাভাবিক মানগুলো স্বাভাবিক করতে নিচের পুষ্টি ও জীবনযাত্রার পরিবর্তনগুলো মেনে চলুন:' 
              : 'Actionable nutrition and lifestyle modifications to help optimize your biomarkers:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {data.dietaryAndLifestyleTipsBn.map((tip, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs sm:text-sm font-medium text-amber-950 flex items-start space-x-2.5"
              >
                <span className="text-amber-600 font-bold text-sm leading-none">•</span>
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Follow-up Tests */}
      {data.suggestedNextTests && data.suggestedNextTests.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isBn ? 'প্রয়োজনীয় পরবর্তী পরীক্ষা (Follow-up Tests):' : 'Suggested Follow-up Tests:'}
          </h4>
          <div className="flex flex-wrap gap-2 pt-1">
            {data.suggestedNextTests.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
              >
                🔬 {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Medical Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed text-center sm:text-left">
        {data.disclaimer}
      </div>
    </div>
  );
}
