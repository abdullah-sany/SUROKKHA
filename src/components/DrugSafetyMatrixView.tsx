import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Info, 
  Utensils, 
  HeartPulse, 
  Copy, 
  Check, 
  Printer, 
  Share2,
  HelpCircle,
  Pill
} from 'lucide-react';
import { DrugSafetyMatrix, DrugInteractionSeverity } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DrugSafetyMatrixViewProps {
  matrix: DrugSafetyMatrix;
  medicinesList?: string[];
  title?: string;
  disclaimer?: string;
}

export default function DrugSafetyMatrixView({
  matrix,
  medicinesList,
  title,
  disclaimer
}: DrugSafetyMatrixViewProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [copied, setCopied] = useState(false);

  const getSeverityBadge = (severity: DrugInteractionSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">
            <AlertOctagon size={13} className="mr-1 text-rose-600" />
            {isBn ? 'মারাত্মক ঝুঁকি (CRITICAL)' : 'CRITICAL HAZARD'}
          </span>
        );
      case 'MODERATE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <AlertTriangle size={13} className="mr-1 text-amber-700" />
            {isBn ? 'সতর্কতা প্রয়োজন (MODERATE)' : 'MODERATE RISK'}
          </span>
        );
      case 'MINOR':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <Info size={13} className="mr-1 text-sky-600" />
            {isBn ? 'সামান্য প্রভাব (MINOR)' : 'MINOR INTERACTION'}
          </span>
        );
      case 'SAFE':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={13} className="mr-1 text-emerald-600" />
            {isBn ? 'নিরাপদ সমন্বয় (SAFE)' : 'SAFE COMBINATION'}
          </span>
        );
    }
  };

  const getStatusDisplay = () => {
    switch (matrix.overallSafetyStatus) {
      case 'HIGH_RISK':
        return {
          title: isBn ? 'উচ্চ ঝুঁকির ড্রাগ ইন্টারঅ্যাকশন শনাক্ত' : 'High Risk Drug Interaction Detected',
          badgeClass: 'bg-rose-600 text-white',
          borderClass: 'border-rose-300 bg-rose-50/50',
          scoreColor: 'text-rose-600',
          icon: <AlertOctagon size={28} className="text-rose-600" />
        };
      case 'ATTENTION_NEEDED':
        return {
          title: isBn ? 'বিশেষ সতর্কতা ও সময়ের ব্যবধান জরুরি' : 'Clinical Attention & Timing Spacing Needed',
          badgeClass: 'bg-amber-600 text-white',
          borderClass: 'border-amber-300 bg-amber-50/50',
          scoreColor: 'text-amber-600',
          icon: <AlertTriangle size={28} className="text-amber-600" />
        };
      case 'SAFE':
      default:
        return {
          title: isBn ? 'ওষুধগুলোর পারস্পরিক সমন্বয় নিরাপদ' : 'Medication Combination Clinically Safe',
          badgeClass: 'bg-emerald-600 text-white',
          borderClass: 'border-emerald-300 bg-emerald-50/50',
          scoreColor: 'text-emerald-600',
          icon: <ShieldCheck size={28} className="text-emerald-600" />
        };
    }
  };

  const status = getStatusDisplay();

  const handleCopySummary = () => {
    const lines = [
      `=== SUROKKHA AI: Drug Safety & Interaction Report ===`,
      `Safety Score: ${matrix.safetyScore}/100 (${matrix.overallSafetyStatus})`,
      `Takeaway: ${matrix.keyTakeaway}`,
      '',
      '--- Interactions ---',
      ...matrix.interactions.map(
        i => `[${i.severity}] ${i.medicinePair.join(' + ')}: ${i.summary} | Rec: ${i.clinicalRecommendation}`
      ),
      '',
      '--- Food & Dietary Warnings ---',
      ...matrix.foodAndDietaryWarnings.map(f => `${f.medicine} + ${f.foodOrDrink}: ${f.warning}`),
      '',
      '--- Special Precautions ---',
      ...matrix.specialPrecautions.map(p => `${p.condition} (${p.affectedMedicines.join(', ')}): ${p.guidance}`)
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner & Score Gauge */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${status.borderClass} shadow-xs bg-white`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-slate-100/90 shrink-0">
              {status.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isBn ? 'ক্লিনিক্যাল ড্রাগ সেফটি ম্যাট্রিক্স' : 'Clinical Drug Safety Matrix'}
                </span>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${status.badgeClass}`}>
                  {matrix.overallSafetyStatus}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {title || status.title}
              </h3>
            </div>
          </div>

          {/* Safety Gauge */}
          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                {isBn ? 'নিরাপত্তা স্কোর' : 'Safety Index'}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {matrix.safetyScore >= 80 ? (isBn ? 'উচ্চ নিরাপত্তা' : 'High Safety') : matrix.safetyScore >= 50 ? (isBn ? 'সতর্কতা প্রয়োজন' : 'Moderate Care') : (isBn ? 'ঝুঁকিপূর্ণ' : 'Hazardous')}
              </span>
            </div>
            <div className="flex items-baseline space-x-0.5">
              <span className={`text-3xl font-black ${status.scoreColor}`}>
                {matrix.safetyScore}
              </span>
              <span className="text-xs font-bold text-slate-400">/100</span>
            </div>
          </div>
        </div>

        {/* Key Clinical Takeaway */}
        <div className="mt-4 pt-1">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-900 mr-1.5">
              {isBn ? '💡 বিশেষজ্ঞ পর্যবেক্ষণ:' : '💡 Clinical Finding:'}
            </span>
            {matrix.keyTakeaway}
          </p>
        </div>

        {/* Medicines Analyzed Tags */}
        {medicinesList && medicinesList.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center">
              <Pill size={13} className="mr-1 text-teal-600" />
              {isBn ? 'বিশ্লেষিত ওষুধসমূহ:' : 'Analyzed Medicines:'}
            </span>
            {medicinesList.map((med, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200/70"
              >
                {med}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Drug-Drug Interactions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <HeartPulse size={16} className="text-teal-600" />
            <span>{isBn ? 'ওষুধগুলোর পারস্পরিক প্রতিক্রিয়া (Drug-Drug Interactions)' : 'Drug-Drug Interactions (DDI)'}</span>
          </h4>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {matrix.interactions.length} {isBn ? 'টি যুগল পরীক্ষা' : 'Pairs Evaluated'}
          </span>
        </div>

        {matrix.interactions.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center space-x-2">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>
              {isBn 
                ? 'এই ওষুধগুলোর মধ্যে কোনো প্রত্যক্ষ ক্ষতিকর প্রতিক্রিয়া বা ড্রাগ ইন্টারঅ্যাকশন পাওয়া যায়নি।' 
                : 'No adverse drug-drug interactions detected between these medications.'}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {matrix.interactions.map((interaction, idx) => {
              const isCrit = interaction.severity === 'CRITICAL';
              const isMod = interaction.severity === 'MODERATE';
              return (
                <div 
                  key={idx}
                  className={`p-4 sm:p-5 rounded-xl border transition-all ${
                    isCrit 
                      ? 'bg-rose-50/40 border-rose-200' 
                      : isMod 
                        ? 'bg-amber-50/30 border-amber-200' 
                        : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm sm:text-base">
                      <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-xs sm:text-sm">
                        {interaction.medicinePair[0]}
                      </span>
                      <span className="text-slate-400 font-normal">↔</span>
                      <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-xs sm:text-sm">
                        {interaction.medicinePair[1]}
                      </span>
                    </div>
                    <div>{getSeverityBadge(interaction.severity)}</div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-semibold text-slate-800">
                      {interaction.summary}
                    </p>

                    <div className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-100 space-y-1">
                      <div>
                        <span className="font-bold text-slate-700">{isBn ? 'কার্যপ্রণালী (Mechanism): ' : 'Pharmacology: '}</span>
                        <span>{interaction.mechanism}</span>
                      </div>
                      <div className="pt-1 border-t border-slate-100 text-teal-900">
                        <span className="font-bold">{isBn ? 'করণীয় নির্দেশনা: ' : 'Recommendation: '}</span>
                        <span>{interaction.clinicalRecommendation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Food & Dietary Warnings */}
      {matrix.foodAndDietaryWarnings && matrix.foodAndDietaryWarnings.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Utensils size={16} className="text-amber-600" />
            <span>{isBn ? 'খাদ্য ও পানীয় সংক্রান্ত নির্দেশনা (Food & Dietary Warnings)' : 'Food & Dietary Warnings'}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matrix.foodAndDietaryWarnings.map((foodWarn, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 bg-amber-100/90 px-2 py-0.5 rounded text-[11px]">
                    {foodWarn.medicine}
                  </span>
                  <span className="font-semibold text-amber-800">
                    ⚠️ {foodWarn.foodOrDrink}
                  </span>
                </div>
                <p className="text-amber-900 leading-relaxed font-medium">
                  {foodWarn.warning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Patient Condition Precautions */}
      {matrix.specialPrecautions && matrix.specialPrecautions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <HelpCircle size={16} className="text-sky-600" />
            <span>{isBn ? 'বিশেষ স্বাস্থ্য সতর্কতা ও কনট্রা-ইন্ডিকেশন (Special Precautions)' : 'Condition Precautions & Contraindications'}</span>
          </h4>

          <div className="space-y-2">
            {matrix.specialPrecautions.map((prec, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200/80 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-950 text-sm">
                    {prec.condition}
                  </span>
                  <div className="flex items-center space-x-1">
                    {prec.affectedMedicines.map((m, mIdx) => (
                      <span key={mIdx} className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sky-900 font-medium leading-relaxed">
                  {prec.guidance}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons & Disclaimer */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500 text-center sm:text-left leading-snug">
          {disclaimer || (isBn 
            ? 'সতর্কতা: এটি সুরক্ষায় এআই (SUROKKHA AI) দ্বারা প্রস্তুতকৃত একটি কম্পিউটার-জেনারেটেড ক্লিনিক্যাল ড্রাগ ইন্টারঅ্যাকশন বিশ্লেষণ। ওষুধের কোনো ডোজ পরিবর্তন করার পূর্বে অবশ্যই আপনার রেজিস্টার্ড চিকিৎসক বা ফার্মাসিস্টের পরামর্শ গ্রহণ করুন।' 
            : 'Caution: This is a computer-assisted clinical interaction screening by SUROKKHA AI. Never adjust medication schedules without consulting a registered physician or pharmacist.')}
        </p>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'রিপোর্ট কপি' : 'Copy Report')}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all"
          >
            <Printer size={14} />
            <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
