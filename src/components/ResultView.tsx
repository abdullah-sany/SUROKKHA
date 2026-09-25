import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { AnalysisResponse, SafetyLevel } from '../types';
import { ShieldAlert, AlertTriangle, Info, UserRound, ArrowLeft, TriangleAlert, ShieldCheck, FileDown, Loader2, CheckCircle2, Volume2, VolumeX, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { generateAnalysisPDF } from '../utils/pdfExport';
import { ReportDocument } from './ReportDocument';
import MedicalResourceSearch from './MedicalResourceSearch';
import { voiceAssistant } from '../utils/voiceAssistant';

interface ResultViewProps {
  result: AnalysisResponse;
  onReset: () => void;
}

const getSafetyColor = (level: SafetyLevel) => {
  switch (level) {
    case 'GREEN': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'YELLOW': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'ORANGE': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'RED': return 'text-rose-600 bg-rose-50 border-rose-200';
    default: return 'text-slate-600 bg-slate-50 border-slate-200';
  }
};

const getSafetyIcon = (level: SafetyLevel) => {
  switch (level) {
    case 'GREEN': return <ShieldCheck size={28} className="text-emerald-600" />;
    case 'YELLOW': return <Info size={28} className="text-amber-600" />;
    case 'ORANGE': return <AlertTriangle size={28} className="text-orange-600" />;
    case 'RED': return <ShieldAlert size={28} className="text-rose-600" />;
    default: return <Info size={28} />;
  }
};

const getSafetyText = (level: SafetyLevel, isBn: boolean) => {
  switch (level) {
    case 'GREEN': return isBn ? 'সাধারণ নির্দেশনা' : 'General Guidance';
    case 'YELLOW': return isBn ? 'চিকিৎসা মনোযোগ প্রয়োজন হতে পারে' : 'Medical Attention May Be Appropriate';
    case 'ORANGE': return isBn ? 'জরুরী মনোযোগ' : 'Urgent Attention';
    case 'RED': return isBn ? 'জরুরী অবস্থা হতে পারে' : 'Potential Emergency';
    default: return isBn ? 'নির্দেশনা' : 'Guidance';
  }
};

export default function ResultView({ result, onReset }: ResultViewProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const reportId = useMemo(() => {
    return `SUR-${Math.floor(100000 + Math.random() * 900000)}`;
  }, []);

  const generatedDate = useMemo(() => {
    const now = new Date();
    return now.toLocaleString(isBn ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [isBn]);

  const handleToggleVoice = () => {
    if (isSpeaking) {
      voiceAssistant.stop();
      setIsSpeaking(false);
    } else {
      const summaryText = result.summary || '';
      const careText = result.careGuidance || '';
      const specialists = result.suggestedSpecialists.map(s => s.name).join(', ');
      const speechScript = isBn
        ? `স্বাস্থ্য নির্দেশনার ফলাফল: ${summaryText}। চিকিৎসা পরামর্শ: ${careText}। সম্ভাব্য বিশেষজ্ঞ ডাক্তার: ${specialists}।`
        : `Health guidance summary: ${summaryText}. Care recommendation: ${careText}. Suggested specialists: ${specialists}.`;

      setIsSpeaking(true);
      voiceAssistant.speak(
        speechScript,
        isBn ? 'bn' : 'en',
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  useEffect(() => {
    return () => {
      voiceAssistant.stop();
    };
  }, []);

  const handleDownloadPDF = async () => {
    if (!reportRef.current || isExporting) return;

    if ('vibrate' in navigator) navigator.vibrate(40);
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      const filename = `SUROKKHA_Specialist_Guide_${reportId}.pdf`;
      await generateAnalysisPDF(reportRef.current, filename);
      
      setDownloadSuccess(true);
      if ('vibrate' in navigator) navigator.vibrate([40, 60, 40]);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button 
          onClick={onReset}
          className="flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors py-1.5"
        >
          <ArrowLeft size={16} />
          <span>{isBn ? 'নতুন বিশ্লেষণ শুরু করুন' : 'Start New Analysis'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Voice Reading Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all ${
              isSpeaking
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
            }`}
            title={isBn ? 'ফলাফল বাংলায় শুনুন' : 'Listen to results in Bengali'}
          >
            {isSpeaking ? (
              <>
                <VolumeX size={16} />
                <span>{isBn ? 'থামুন' : 'Stop Audio'}</span>
              </>
            ) : (
              <>
                <Volume2 size={16} className="text-teal-600" />
                <span>{isBn ? '🔊 বাংলায় শুনুন' : 'Listen Guidance'}</span>
              </>
            )}
          </button>

          {/* Quick Doctor Call 16263 */}
          <a
            href="tel:16263"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs sm:text-sm font-bold transition-all"
            title={isBn ? '১৬২৬৩ স্বাস্থ্য বাতায়নে ফ্রি কল করুন' : 'Free Call to 16263 Shastho Batayan'}
          >
            <PhoneCall size={15} className="text-emerald-600" />
            <span>{isBn ? '১৬২৬৩ ডাক্তার' : '16263 Call'}</span>
          </a>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs border ${
              downloadSuccess
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50/40 active:scale-98'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
            title={isBn ? 'পিডিএফ রিপোর্ট ডাউনলোড করুন' : 'Download Structured PDF Report'}
          >
            {isExporting ? (
              <>
                <Loader2 size={15} className="animate-spin text-teal-600" />
                <span>{isBn ? 'পিডিএফ প্রস্তুত হচ্ছে...' : 'Generating...'}</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 size={15} className="text-white" />
                <span>{isBn ? 'ডাউনলোড সম্পন্ন!' : 'Downloaded!'}</span>
              </>
            ) : (
              <>
                <FileDown size={15} className="text-teal-600" />
                <span>{isBn ? 'রিপোর্ট PDF' : 'PDF Report'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Emergency Escalation */}
      {result.safetyLevel === 'RED' && result.emergencyEscalation.required && (
        <div className="bg-rose-600 text-white p-6 md:p-8 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPC9zdmc+')] opacity-50 pointer-events-none"></div>
          <TriangleAlert size={48} className="text-rose-200" />
          <h2 className="text-2xl font-bold tracking-tight">
            🚨 {isBn ? 'জরুরী অবস্থা হতে পারে' : 'POTENTIAL EMERGENCY'}
          </h2>
          <p className="text-lg text-rose-50 max-w-xl">
            {result.emergencyEscalation.message}
          </p>
          <a
            href={import.meta.env.VITE_EMERGENCY_APP_URL || "tel:999"}
            className="mt-4 px-8 py-3 bg-white text-rose-700 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:bg-rose-50 animate-emergency-pulse inline-flex items-center space-x-2"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <span>{isBn ? 'জরুরী সেবা কল করুন (৯৯৯)' : 'CALL EMERGENCY (999)'}</span>
          </a>
        </div>
      )}

      {/* Main Guidance Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Safety Header */}
        <div className={`p-6 border-b flex items-center justify-between flex-wrap gap-3 ${getSafetyColor(result.safetyLevel)}`}>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white/60 rounded-xl">
              {getSafetyIcon(result.safetyLevel)}
            </div>
            <div>
              <div className="text-sm font-bold tracking-widest opacity-80 mb-0.5">{result.safetyLevel}</div>
              <h3 className="text-lg md:text-xl font-bold">{getSafetyText(result.safetyLevel, isBn)}</h3>
            </div>
          </div>
          {result.engineUsed && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-xs text-slate-800 shadow-2xs border border-white/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{result.engineUsed}</span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Summary */}
          <section className="space-y-3">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              {isBn ? 'আমরা যা বুঝেছি' : 'What We Understood'}
            </h4>
            <p className="text-slate-700 leading-relaxed text-lg">{result.summary}</p>
          </section>

          <hr className="border-slate-100" />

          {/* Care Guidance */}
          <section className="space-y-3">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              {isBn ? 'কোথায় চিকিৎসা নেবেন' : 'Where To Seek Care'}
            </h4>
            <p className="text-slate-800 font-medium leading-relaxed text-lg">{result.careGuidance}</p>
          </section>

          {/* Specialist Guide */}
          {result.suggestedSpecialists.length > 0 && (
            <section className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                {isBn ? 'বিশেষজ্ঞ গাইড' : 'Specialist Guide'}
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {result.suggestedSpecialists.map((specialist, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-slate-100 bg-slate-50 hover:border-teal-200 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-teal-100 text-teal-700 rounded-lg shrink-0">
                        <UserRound size={20} />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900">{specialist.name}</h5>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{specialist.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Warning Signs */}
          {result.warningSigns.length > 0 && (
            <section className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                {isBn ? 'সতর্ক সংকেত' : 'Warning Signs'}
              </h4>
              <ul className="grid sm:grid-cols-2 gap-3">
                {result.warningSigns.map((sign, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-rose-700 bg-rose-50/50 p-3 rounded-lg border border-rose-100 text-sm font-medium">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        
        {/* Important Notes */}
        <div className="bg-slate-50 p-6 border-t border-slate-200">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Info size={14} />
              <span>{isBn ? 'জরুরী নোট' : 'Important Notes'}</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              {result.importantNotes.map((note, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-slate-300 mt-0.5">•</span>
                  <span>{note}</span>
                </li>
              ))}
              <li className="flex items-start space-x-2">
                <span className="text-slate-300 mt-0.5">•</span>
                <span>
                  {isBn 
                    ? 'এই তথ্য শুধুমাত্র সাধারণ নির্দেশনার জন্য এবং কোনো রোগ নির্ণয় করে না।'
                    : 'This guidance is informational and cannot diagnose a medical condition.'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Medical Resource Search Section (Google Search Grounding) */}
      <MedicalResourceSearch analysisResult={result} />

      {/* Record-Keeping PDF Download Card */}
      <div className="bg-gradient-to-r from-teal-50 to-slate-50 rounded-2xl border border-teal-200/80 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <FileDown size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              {isBn ? 'ব্যক্তিগত স্বাস্থ্য রেকর্ড সংরক্ষণ' : 'Keep a Personal Health Record'}
            </h4>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5 leading-relaxed max-w-xl">
              {isBn 
                ? 'আপনার স্বাস্থ্যসেবা নির্দেশিকা, ট্রায়াজ লেভেল ও বিশেষজ্ঞ পরামর্শ একটি সুসংগঠিত পিডিএফ ফাইলে ডাউনলোড করে সংরক্ষণ করুন বা চিকিৎসকের কাছে প্রদর্শন করুন।'
                : 'Download this structured summary report with safety triage level, care guidance, and suggested specialists for doctor visits and personal record-keeping.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className={`shrink-0 w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            downloadSuccess
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-teal-700 hover:bg-teal-800 text-white active:scale-98'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>{isBn ? 'পিডিএফ তৈরি হচ্ছে...' : 'Generating PDF...'}</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 size={16} />
              <span>{isBn ? 'ডাউনলোড সম্পন্ন!' : 'Downloaded!'}</span>
            </>
          ) : (
            <>
              <FileDown size={16} />
              <span>{isBn ? 'পিডিএফ রিপোর্ট ডাউনলোড' : 'Download PDF Record'}</span>
            </>
          )}
        </button>
      </div>

      {/* Hidden/Offscreen printable Report Document for high-fidelity PDF capture */}
      <div 
        className="fixed -left-[9999px] top-0 pointer-events-none opacity-0 select-none overflow-hidden" 
        aria-hidden="true"
      >
        <ReportDocument
          ref={reportRef}
          result={result}
          reportId={reportId}
          generatedDate={generatedDate}
          isBn={isBn}
        />
      </div>
    </motion.div>
  );
}
