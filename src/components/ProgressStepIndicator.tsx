import React from 'react';
import { Activity, Stethoscope, FileText, Check, Loader2, Sparkles } from 'lucide-react';

interface ProgressStepIndicatorProps {
  currentStep: number; // 0, 1, 2
  progressPercent: number; // 0 to 100
  isBn: boolean;
}

interface StepConfig {
  id: string;
  labelEn: string;
  labelBn: string;
  detailEn: string;
  detailBn: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    id: 'analyzing',
    labelEn: 'Analyzing...',
    labelBn: 'বিশ্লেষণ করা হচ্ছে...',
    detailEn: 'Evaluating symptoms & severity',
    detailBn: 'লক্ষণ ও তীব্রতা মূল্যায়ন করা হচ্ছে',
    icon: Activity,
  },
  {
    id: 'formulating',
    labelEn: 'Formulating...',
    labelBn: 'পরামর্শ প্রণয়ন...',
    detailEn: 'Determining triage & specialists',
    detailBn: 'ট্রায়াজ লেভেল ও বিশেষজ্ঞ নির্ধারণ',
    icon: Stethoscope,
  },
  {
    id: 'preparing',
    labelEn: 'Preparing Result...',
    labelBn: 'ফলাফল প্রস্তুত...',
    detailEn: 'Assembling clinical recommendations',
    detailBn: 'ক্লিনিক্যাল গাইডেন্স ও সতর্কতা সাজানো',
    icon: FileText,
  },
];

export default function ProgressStepIndicator({
  currentStep,
  progressPercent,
  isBn,
}: ProgressStepIndicatorProps) {
  const activeStepConfig = STEPS[Math.min(currentStep, STEPS.length - 1)];

  return (
    <div className="w-full bg-gradient-to-b from-teal-50/70 via-teal-50/40 to-slate-50 border border-teal-200/80 rounded-2xl p-4 md:p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Top Header: Live Engine Status & Progress % */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-600"></span>
          </span>
          <span className="text-xs font-bold text-teal-900 tracking-wide uppercase flex items-center space-x-1">
            <Sparkles size={12} className="text-teal-600 mr-0.5" />
            <span>{isBn ? 'এআই ক্লিনিক্যাল প্রসেসিং' : 'AI Clinical Navigation Engine'}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-teal-700 bg-white px-2 py-0.5 rounded-md border border-teal-200 shadow-2xs">
            {Math.round(progressPercent)}%
          </span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="relative w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(8, progressPercent))}%` }}
        />
      </div>

      {/* 3 Steps Indicator Row */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {STEPS.map((step, idx) => {
          const isDone = currentStep > idx;
          const isActive = currentStep === idx;
          const isUpcoming = currentStep < idx;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-white shadow-2xs border border-teal-300 scale-[1.02]'
                  : isDone
                  ? 'bg-teal-50/50 border border-teal-100'
                  : 'opacity-60'
              }`}
            >
              {/* Step Circle Icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center mb-1.5 transition-colors ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-teal-600 text-white shadow-xs animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? (
                  <Check size={14} className="stroke-[3]" />
                ) : isActive ? (
                  <Loader2 size={14} className="animate-spin text-white" />
                ) : (
                  <Icon size={13} />
                )}
              </div>

              {/* Step Label */}
              <div
                className={`text-xs font-bold leading-tight ${
                  isActive
                    ? 'text-teal-900'
                    : isDone
                    ? 'text-emerald-800'
                    : 'text-slate-500'
                }`}
              >
                {isBn ? step.labelBn : step.labelEn}
              </div>

              {/* Step Detail */}
              <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 hidden sm:block">
                {isBn ? step.detailBn : step.detailEn}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Phase Live Description */}
      <div className="bg-white/80 border border-teal-100 rounded-xl px-3 py-2 text-center text-xs text-teal-800 flex items-center justify-center space-x-1.5">
        <Loader2 size={13} className="animate-spin text-teal-600 shrink-0" />
        <span className="font-medium">
          {isBn
            ? `${activeStepConfig.labelBn} (${activeStepConfig.detailBn})`
            : `${activeStepConfig.labelEn} — ${activeStepConfig.detailEn}`}
        </span>
      </div>
    </div>
  );
}
