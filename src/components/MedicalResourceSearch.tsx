import React, { useState, useEffect, useCallback } from 'react';
import { AnalysisResponse, MedicalResourceSearchResult, MedicalResourceLink } from '../types';
import { Search, Globe, ExternalLink, ShieldCheck, Loader2, Sparkles, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MedicalResourceSearchProps {
  analysisResult: AnalysisResponse;
}

// Map well-known medical domains to friendly organization names & colors
const getDomainBadge = (domain: string) => {
  const d = domain.toLowerCase();
  if (d.includes('medex.com.bd') || d.includes('medex')) {
    return { name: 'Medex Bangladesh (মেডেক্স ওষুধ ও জেনেরিক ইনডেক্স)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  }
  if (d.includes('medeasy.health') || d.includes('medeasy')) {
    return { name: 'MedEasy (মেডইজি ডিজিটাল টেলিমেডিসিন ও প্রেসক্রিপশন)', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' };
  }
  if (d.includes('daktarbhai.com') || d.includes('daktarbhai')) {
    return { name: 'Daktarbhai (ডাক্তারভাই অ্যাপয়েন্টমেন্ট ও হেলথ রেকর্ড)', color: 'bg-blue-100 text-blue-800 border-blue-300' };
  }
  if (d.includes('dghs.gov.bd')) {
    return { name: 'স্বাস্থ্য অধিদপ্তর (DGHS Bangladesh)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  }
  if (d.includes('icddrb.org')) {
    return { name: 'ICDDR,B (আইসিডিডিআর,বি)', color: 'bg-teal-100 text-teal-800 border-teal-200' };
  }
  if (d.includes('who.int')) {
    return { name: 'World Health Organization (WHO)', color: 'bg-blue-100 text-blue-800 border-blue-200' };
  }
  if (d.includes('nhs.uk')) {
    return { name: 'NHS UK', color: 'bg-sky-100 text-sky-800 border-sky-200' };
  }
  if (d.includes('cdc.gov')) {
    return { name: 'CDC (রোগ নিয়ন্ত্রণ কেন্দ্র)', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
  }
  if (d.includes('mayoclinic.org')) {
    return { name: 'Mayo Clinic', color: 'bg-purple-100 text-purple-800 border-purple-200' };
  }
  if (d.includes('medlineplus.gov')) {
    return { name: 'MedlinePlus (NIH)', color: 'bg-rose-100 text-rose-800 border-rose-200' };
  }
  return { name: domain || 'Verified Medical Portal', color: 'bg-slate-100 text-slate-700 border-slate-200' };
};

export default function MedicalResourceSearch({ analysisResult }: MedicalResourceSearchProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Compute default search query based on analysis summary and first specialist
  const defaultQuery = React.useMemo(() => {
    const specialistPart = analysisResult.suggestedSpecialists[0]?.name || '';
    if (analysisResult.summary) {
      // Pick the first key phrase or combination
      const cleanSummary = analysisResult.summary.split('.')[0]?.slice(0, 60) || '';
      return specialistPart ? `${cleanSummary} (${specialistPart})` : cleanSummary;
    }
    return specialistPart || 'Healthcare Guidelines';
  }, [analysisResult]);

  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const [data, setData] = useState<MedicalResourceSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/medical-resources/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSearch.trim(),
          language,
          context: analysisResult.summary
        })
      });

      if (!response.ok) {
        throw new Error(isBn ? 'রিসোর্স খুঁজে পেতে ব্যর্থ হয়েছে' : 'Failed to retrieve medical resources');
      }

      const resultData: MedicalResourceSearchResult = await response.json();
      setData(resultData);
    } catch (err: any) {
      console.error('Error fetching medical resources:', err);
      setError(err.message || (isBn ? 'একটি সমস্যা দেখা দিয়েছে।' : 'Failed to search verified medical portals.'));
    } finally {
      setIsLoading(false);
    }
  }, [analysisResult.summary, language, isBn]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchResources(defaultQuery);
  }, [fetchResources, defaultQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResources(searchQuery);
  };

  // Quick suggestion chips
  const suggestionChips = React.useMemo(() => {
    const chips: string[] = [];
    if (analysisResult.suggestedSpecialists.length > 0) {
      analysisResult.suggestedSpecialists.forEach(s => {
        if (!chips.includes(s.name)) chips.push(s.name);
      });
    }
    if (analysisResult.warningSigns.length > 0) {
      const firstWarning = analysisResult.warningSigns[0].slice(0, 30);
      if (!chips.includes(firstWarning)) chips.push(firstWarning);
    }
    chips.push(isBn ? 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) গাইডলাইন' : 'WHO Health Guidelines');
    return chips;
  }, [analysisResult, isBn]);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header with Google Search Grounded Badge */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-teal-50/20 to-sky-50/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Globe size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {isBn ? 'যাচাইকৃত স্বাস্থ্য তথ্য ও রেফারেন্স পোর্টাল' : 'Medical Resource Search'}
                </h3>
                <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  <Sparkles size={11} />
                  <span>Google Search Grounded</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn 
                  ? 'আপনার স্বাস্থ্য বিশ্লেষণের প্রেক্ষিতে বিশ্বস্ত স্বাস্থ্য সংস্থা ও ক্লিনিক্যাল পোর্টালের তথ্য'
                  : 'Live verified health portals and guidelines retrieved via Google Search'}
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchResources(searchQuery)}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
            title={isBn ? 'পুনরায় অনুসন্ধান করুন' : 'Refresh resources'}
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSubmit} className="mt-5 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'লক্ষণ, বিশেষজ্ঞ বা রোগ লিখে অনুসন্ধান করুন...' : 'Search clinical guidelines, specialists, or symptoms...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-800 placeholder-slate-400 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            <span>{isBn ? 'অনুসন্ধান' : 'Search'}</span>
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        {suggestionChips.length > 0 && (
          <div className="mt-3 flex items-center flex-wrap gap-1.5 text-xs">
            <span className="text-slate-400 font-medium mr-1">
              {isBn ? 'পরামর্শ:' : 'Suggestions:'}
            </span>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(chip);
                  fetchResources(chip);
                }}
                className="px-2.5 py-1 bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 hover:text-teal-800 border border-slate-200 rounded-lg transition-colors text-xs font-medium"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 space-y-6">
        {isLoading && !data && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 size={32} className="animate-spin text-teal-600" />
            <p className="text-sm font-medium text-slate-600">
              {isBn 
                ? 'গুগল সার্চের মাধ্যমে বিশ্বস্ত স্বাস্থ্য পোর্টাল অনুসন্ধান করা হচ্ছে...' 
                : 'Searching Google for verified health portals and clinical guidelines...'}
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-2.5">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">{isBn ? 'অনুসন্ধানে সমস্যা হয়েছে' : 'Search error'}</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              <button
                onClick={() => fetchResources(searchQuery)}
                className="mt-2 text-xs font-bold underline hover:no-underline text-rose-800"
              >
                {isBn ? 'আবার চেষ্টা করুন' : 'Retry Search'}
              </button>
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* AI Synthesized Evidence Overview */}
            {data.summary && (
              <div className="p-5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2">
                <div className="flex items-center space-x-2 text-sky-900 font-bold text-sm">
                  <BookOpen size={16} className="text-sky-700" />
                  <span>{isBn ? 'যাচাইকৃত তথ্য ও চিকিৎসা গাইডলাইন সারসংক্ষেপ' : 'Synthesized Evidence & Guidelines'}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {data.summary}
                </p>
              </div>
            )}

            {/* Verified Health Portals Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                  <ShieldCheck size={16} className="text-teal-600" />
                  <span>{isBn ? 'সংশ্লিষ্ট স্বাস্থ্য পোর্টাল ও রেফারেন্স লিঙ্ক' : 'Verified Health Portals & References'}</span>
                </h4>
                <span className="text-xs text-slate-400">
                  {data.links.length} {isBn ? 'টি লিঙ্ক' : 'sources found'}
                </span>
              </div>

              {data.links.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  {isBn ? 'কোনো সরাসরি লিঙ্ক পাওয়া যায়নি।' : 'No direct portal links found for this query.'}
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {data.links.map((link: MedicalResourceLink, idx: number) => {
                    const badge = getDomainBadge(link.domain);
                    return (
                      <a
                        key={idx}
                        href={link.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-sm transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md border ${badge.color}`}>
                              {badge.name}
                            </span>
                            <ExternalLink size={14} className="text-slate-400 group-hover:text-teal-600 transition-colors" />
                          </div>
                          <h5 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                            {link.title}
                          </h5>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                          <span className="font-mono text-[11px] truncate max-w-[200px]">
                            {link.domain || 'Verified Resource'}
                          </span>
                          <span className="text-teal-600 font-semibold group-hover:underline text-[11px]">
                            {isBn ? 'দেখুন' : 'Visit Portal'} →
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Medex Bangladesh, MedEasy, Daktarbhai & DGHS Quick Hub */}
            <div className="pt-5 border-t border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{isBn ? 'মেডেক্স, মেডইজি ও ডাক্তারভাই — ডিজিটাল হেলথ ও ওষুধ রেফারেন্স' : 'Medex, MedEasy & Daktarbhai — Digital Health & Drug Directory'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn 
                      ? 'ওষুধের জেনেরিক ও ব্র্যান্ড ইনডেক্স, অনলাইন ডাক্তার কনসালটেশন ও অ্যাপয়েন্টমেন্ট সেবা' 
                      : 'Search brand names, generics on Medex, or connect with doctors on MedEasy & Daktarbhai'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <a
                  href="https://medex.com.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-400 transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      M
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                        {isBn ? 'Medex Bangladesh' : 'Medex Bangladesh'}
                      </h6>
                      <p className="text-[11px] text-slate-500">medex.com.bd • ড্রাগ সার্চ</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://medeasy.health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-cyan-200 bg-cyan-50/40 hover:bg-cyan-50 hover:border-cyan-400 transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      ME
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900 group-hover:text-cyan-800">
                        {isBn ? 'মেডইজি (MedEasy)' : 'MedEasy Health'}
                      </h6>
                      <p className="text-[11px] text-slate-500">medeasy.health • ভিডিও ডাক্তার</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-cyan-600 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://daktarbhai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      DB
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900 group-hover:text-blue-800">
                        {isBn ? 'ডাক্তারভাই (Daktarbhai)' : 'Daktarbhai'}
                      </h6>
                      <p className="text-[11px] text-slate-500">daktarbhai.com • অ্যাপয়েন্টমেন্ট</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://dghs.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/30 transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      D
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-900 group-hover:text-sky-800">
                        {isBn ? 'স্বাস্থ্য অধিদপ্তর (DGHS)' : 'DGHS Bangladesh'}
                      </h6>
                      <p className="text-[11px] text-slate-500">dghs.gov.bd • গাইডলাইন</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-sky-600 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Google Search Queries Grounding Meta */}
            {data.searchQueries && data.searchQueries.length > 0 && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-400">
                  {isBn ? 'গুগল সার্চ কুয়েরি:' : 'Google Search Grounding Queries:'}
                </span>
                {data.searchQueries.map((q, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    "{q}"
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety Notice Footer */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>
          {isBn 
            ? 'সকল এক্সটার্নাল পোর্টাল লিঙ্ক শুধুমাত্র তথ্য ও সাধারণ সচেতনতার উদ্দেশ্যে প্রদত্ত।' 
            : 'External health portal links are provided for informational & reference purposes only.'}
        </span>
        <span className="font-medium text-slate-400">Google Grounded AI</span>
      </div>
    </section>
  );
}
