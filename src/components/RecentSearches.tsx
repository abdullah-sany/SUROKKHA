import React from 'react';
import { RecentSearchItem, SafetyLevel } from '../types';
import { History, Clock, ArrowRight, Trash2, X, ShieldCheck, Info, AlertTriangle, ShieldAlert, UserRound } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RecentSearchesProps {
  searches: RecentSearchItem[];
  onSelectSearch: (item: RecentSearchItem) => void;
  onRemoveSearch: (id: string) => void;
  onClearAll: () => void;
}

const getSafetyBadge = (level: SafetyLevel, isBn: boolean) => {
  switch (level) {
    case 'GREEN':
      return {
        label: isBn ? 'লেভেল: গ্রিন' : 'GREEN',
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <ShieldCheck size={12} className="text-emerald-600" />
      };
    case 'YELLOW':
      return {
        label: isBn ? 'লেভেল: ইয়েলো' : 'YELLOW',
        classes: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <Info size={12} className="text-amber-600" />
      };
    case 'ORANGE':
      return {
        label: isBn ? 'লেভেল: অরেঞ্জ' : 'ORANGE',
        classes: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <AlertTriangle size={12} className="text-orange-600" />
      };
    case 'RED':
      return {
        label: isBn ? 'লেভেল: রেড' : 'RED',
        classes: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
        icon: <ShieldAlert size={12} className="text-rose-600" />
      };
    default:
      return {
        label: level,
        classes: 'bg-slate-50 text-slate-700 border-slate-200',
        icon: <Info size={12} />
      };
  }
};

const formatTimeAgo = (timestamp: number, isBn: boolean): string => {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) {
    return isBn ? 'এইমাত্র' : 'Just now';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return isBn ? `${diffMin} মিনিট আগে` : `${diffMin}m ago`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return isBn ? `${diffHours} ঘণ্টা আগে` : `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return isBn ? `${diffDays} দিন আগে` : `${diffDays}d ago`;
};

export default function RecentSearches({
  searches,
  onSelectSearch,
  onRemoveSearch,
  onClearAll,
}: RecentSearchesProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (searches.length === 0) {
    return (
      <section className="w-full mt-10 p-6 bg-white/70 border border-slate-200/80 rounded-2xl shadow-xs text-center space-y-2">
        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-1">
          <History size={18} />
        </div>
        <h4 className="text-sm font-semibold text-slate-700">
          {isBn ? 'কোনো সাম্প্রতিক অনুসন্ধান নেই' : 'No Recent Searches'}
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          {isBn
            ? 'আপনার শেষ ৩টি স্বাস্থ্য সমস্যা অনুসন্ধান ও এআই ফলাফল দ্রুত রেফারেন্সের জন্য এখানে স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে।'
            : 'Your last 3 health concern queries and AI analysis results will automatically appear here for quick reference.'}
        </p>
      </section>
    );
  }

  return (
    <section className="w-full mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-400">
      {/* Card Header */}
      <div className="p-5 md:px-6 md:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
            <History size={16} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">
                {isBn ? 'সাম্প্রতিক অনুসন্ধান' : 'Recent Searches'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/80 text-slate-700">
                {searches.length}/3
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {isBn 
                ? 'দ্রুত রেফারেন্সের জন্য সংরক্ষিত শেষ ৩টি বিশ্লেষণ'
                : 'Last 3 analyses saved locally for quick reference'}
            </p>
          </div>
        </div>

        <button
          onClick={onClearAll}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
          title={isBn ? 'সব সাম্প্রতিক অনুসন্ধান মুছুন' : 'Clear all recent searches'}
        >
          <Trash2 size={13} />
          <span>{isBn ? 'সব মুছুন' : 'Clear All'}</span>
        </button>
      </div>

      {/* List of last 3 searches */}
      <div className="divide-y divide-slate-100">
        {searches.map((item) => {
          const badge = getSafetyBadge(item.result.safetyLevel, isBn);
          const firstSpecialist = item.result.suggestedSpecialists[0];

          return (
            <div
              key={item.id}
              className="p-5 hover:bg-slate-50/80 transition-colors group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              onClick={() => {
                if ('vibrate' in navigator) navigator.vibrate(30);
                onSelectSearch(item);
              }}
            >
              <div className="space-y-2 flex-1 pr-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${badge.classes}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>

                  {firstSpecialist && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                      <UserRound size={11} className="text-slate-500" />
                      <span>{firstSpecialist.name}</span>
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock size={11} />
                    <span>{formatTimeAgo(item.timestamp, isBn)}</span>
                  </span>
                </div>

                {/* Query Title */}
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                  "{item.query}"
                </h4>

                {/* Snippet */}
                {item.result.summary && (
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {item.result.summary}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSearch(item.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title={isBn ? 'এই অনুসন্ধানটি মুছুন' : 'Remove search'}
                >
                  <X size={15} />
                </button>

                <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white rounded-xl text-xs font-semibold transition-all shadow-2xs">
                  <span>{isBn ? 'ফলাফল দেখুন' : 'View Analysis'}</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
