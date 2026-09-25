import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PrescriptionAnalysisResponse, DrugSafetyMatrix } from '../types';
import { useLanguage } from '../context/LanguageContext';
import DrugSafetyMatrixView from './DrugSafetyMatrixView';
import { 
  ArrowLeft, 
  Stethoscope, 
  UserRound, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Pill, 
  FlaskConical, 
  Copy, 
  Check, 
  Printer, 
  FileDown, 
  ShieldAlert, 
  ExternalLink,
  Info,
  Clock,
  HelpCircle,
  Eye,
  ShieldCheck,
  RefreshCw,
  Volume2,
  VolumeX,
  PhoneCall
} from 'lucide-react';
import { voiceAssistant } from '../utils/voiceAssistant';

interface PrescriptionResultViewProps {
  data: PrescriptionAnalysisResponse;
  imageUrl?: string;
  onReset: () => void;
}

export default function PrescriptionResultView({ data, imageUrl, onReset }: PrescriptionResultViewProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [copied, setCopied] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [runtimeMatrix, setRuntimeMatrix] = useState<DrugSafetyMatrix | null>(data.drugSafetyMatrix || null);
  const [isCheckingMatrix, setIsCheckingMatrix] = useState(false);

  const handleToggleVoice = () => {
    if (isSpeaking) {
      voiceAssistant.stop();
      setIsSpeaking(false);
    } else {
      let script = isBn
        ? `প্রেসক্রিপশনের বিবরণ: ${data.overallAnalysis}। `
        : `Prescription summary: ${data.overallAnalysis}. `;

      if (data.detectedMedicines.length > 0) {
        script += isBn ? 'নির্দেশিত ওষুধসমূহ: ' : 'Prescribed medicines: ';
        data.detectedMedicines.forEach((m, idx) => {
          script += isBn
            ? `${idx + 1}. ${m.possibleName}, মাত্রা: ${m.dosage}, খাওয়ার নিয়ম: ${m.timing}। `
            : `${idx + 1}. ${m.possibleName}, dosage: ${m.dosage}, timing: ${m.timing}. `;
        });
      }

      setIsSpeaking(true);
      voiceAssistant.speak(
        script,
        isBn ? 'bn' : 'en',
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  const hasLowConfidence = data.detectedMedicines.some(m => m.confidence === 'LOW');
  const needsPharmacistAlert = data.hasUnreadableSections || hasLowConfidence;

  // On demand interaction check if not initially included or user re-runs
  const handleRunInteractionCheck = async () => {
    if (data.detectedMedicines.length < 2) return;
    setIsCheckingMatrix(true);
    try {
      const medNames = data.detectedMedicines.map(m => m.possibleName);
      const res = await fetch('/api/drug-safety/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicines: medNames,
          language: isBn ? 'bn' : 'en'
        })
      });
      if (res.ok) {
        const json = await res.json();
        setRuntimeMatrix(json.matrix);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingMatrix(false);
    }
  };

  const handleCopySummary = () => {
    let summaryText = `📋 সুরক্ষায় এআই (SUROKKHA AI) - প্রেসক্রিপশন সারসংক্ষেপ\n\n`;
    if (data.doctorInfo.name) {
      summaryText += `👨‍⚕️ ডাক্তার: ${data.doctorInfo.name} (${data.doctorInfo.specialty || 'চিকিৎসক'})\n`;
    }
    if (data.patientInfo.name) {
      summaryText += `👤 রোগী: ${data.patientInfo.name} | বয়স: ${data.patientInfo.age || 'অনির্দিষ্ট'} | তারিখ: ${data.patientInfo.date || 'অনির্দিষ্ট'}\n\n`;
    }
    summaryText += `📝 সারসংক্ষেপ:\n${data.overallAnalysis}\n\n`;
    summaryText += `💊 নির্দেশিত ওষুধসমূহ:\n`;
    data.detectedMedicines.forEach((m, idx) => {
      summaryText += `${idx + 1}. ${m.possibleName}\n   - মাত্রা (Dosage): ${m.dosage}\n   - গ্রহণের সময় ও মেয়াদ: ${m.timing} | ${m.duration}\n   - কাজ: ${m.purpose}\n   - পাঠ নির্ভুলতা: ${m.confidence === 'HIGH' ? 'স্পষ্ট (High)' : m.confidence === 'MEDIUM' ? 'মাঝারি (Medium)' : 'অস্পষ্ট (Low - যাচাই করুন)'}\n\n`;
    });
    if (data.suggestedTests.length > 0) {
      summaryText += `🔬 ক্লিনিক্যাল পরীক্ষা (Tests):\n`;
      data.suggestedTests.forEach((t, idx) => {
        summaryText += `${idx + 1}. ${t.testName}: ${t.note}\n`;
      });
      summaryText += `\n`;
    }
    summaryText += `⚠️ ${data.disclaimer}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 w-full max-w-3xl"
    >
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{isBn ? 'অন্য প্রেসক্রিপশন স্ক্যান করুন' : 'Scan Another Prescription'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Voice Reading Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-2xs ${
              isSpeaking
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
            }`}
            title={isBn ? 'প্রেসক্রিপশন বাংলায় শুনুন' : 'Listen to prescription in Bengali'}
          >
            {isSpeaking ? (
              <>
                <VolumeX size={14} />
                <span>{isBn ? 'থামুন' : 'Stop'}</span>
              </>
            ) : (
              <>
                <Volume2 size={14} className="text-teal-600" />
                <span>{isBn ? '🔊 বাংলায় শুনুন' : 'Listen'}</span>
              </>
            )}
          </button>

          {imageUrl && (
            <button
              onClick={() => setShowImageModal(true)}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
              title="View original prescription image"
            >
              <Eye size={14} />
              <span>{isBn ? 'মূল ছবি' : 'Original Photo'}</span>
            </button>
          )}

          <button
            onClick={handleCopySummary}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-2 rounded-xl transition-colors"
          >
            {copied ? <Check size={14} className="text-teal-600" /> : <Copy size={14} />}
            <span>{copied ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'সারসংক্ষেপ কপি' : 'Copy')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
          >
            <Printer size={14} />
            <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Prescription Header: Doctor & Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Doctor Info Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Stethoscope size={22} />
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
              {isBn ? 'চিকিৎসক বিবরণী' : 'Doctor Details'}
            </div>
            <div className="text-base font-bold text-slate-900 leading-snug">
              {data.doctorInfo.name || (isBn ? 'ডাক্তারের নাম উল্লেখিত নেই' : 'Doctor Name Not Specified')}
            </div>
            <div className="text-xs text-slate-500">
              {data.doctorInfo.specialty || (isBn ? 'বিশেষজ্ঞ বিভাগ / জেনারেল ফিজিশিয়ান' : 'Specialist Department')}
            </div>
          </div>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <UserRound size={22} />
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isBn ? 'রোগীর বিবরণী' : 'Patient Information'}
            </div>
            <div className="text-base font-bold text-slate-900 leading-snug">
              {data.patientInfo.name || (isBn ? 'রোগীর নাম অস্পষ্ট' : 'Patient Name Unclear')}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {data.patientInfo.age && (
                <span>{isBn ? `বয়স: ${data.patientInfo.age}` : `Age: ${data.patientInfo.age}`}</span>
              )}
              {data.patientInfo.date && (
                <span className="flex items-center space-x-1">
                  <Calendar size={12} className="inline mr-0.5" />
                  <span>{data.patientInfo.date}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unreadable or Low-Confidence Alert Banner */}
      {needsPharmacistAlert && (
        <div className="bg-rose-50 border-2 border-rose-200/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-3 text-rose-900">
          <AlertTriangle size={22} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <div className="font-bold flex items-center gap-2">
              <span>{isBn ? 'গুরুত্বপূর্ণ সতর্কতা: কিছু ওষুধ বা হাতের লেখা অস্পষ্ট' : 'Caution: Unclear Prescription Handwriting'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900 uppercase">
                {isBn ? 'যাচাই আবশ্যক' : 'Verify Needed'}
              </span>
            </div>
            <p className="text-rose-800/90 leading-relaxed">
              {isBn
                ? 'প্রেসক্রিপশনের কিছু লেখা বা ওষুধের নাম অস্পষ্ট থাকায় এআই শতভাগ নিশ্চিত হতে পারেনি। ওষুধ কেনার আগে অবশ্যই একজন রেজিস্টার্ড ফার্মাসিস্ট বা সংশ্লিষ্ট চিকিৎসকের সাথে প্রেসক্রিপশনটি সরাসরি মিলিয়ে নিন।'
                : 'Certain medicine names or dosages appear ambiguous or blurred. Do not consume unverified medications without cross-checking with a registered pharmacist or prescribing doctor.'}
            </p>
          </div>
        </div>
      )}

      {/* Overall Analysis Summary */}
      <div className="bg-gradient-to-br from-teal-50/70 via-slate-50 to-white border border-teal-200/70 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm">
          <Info size={18} className="text-teal-600" />
          <span>{isBn ? 'প্রেসক্রিপশনের বাংলা সারসংক্ষেপ' : 'Clinical Summary & Treatment Overview'}</span>
        </div>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          {data.overallAnalysis}
        </p>
      </div>

      {/* Detected Medicines List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base sm:text-lg">
            <Pill size={20} className="text-teal-600" />
            <span>{isBn ? 'নির্দেশিত ওষুধসমূহ (Detected Medicines)' : 'Detected Medicines & Instructions'}</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {data.detectedMedicines.length} {isBn ? 'টি ওষুধ' : 'Items'}
          </span>
        </div>

        <div className="space-y-3">
          {data.detectedMedicines.map((med, index) => {
            const isHigh = med.confidence === 'HIGH';
            const isMed = med.confidence === 'MEDIUM';
            const isLow = med.confidence === 'LOW';

            return (
              <div
                key={index}
                className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all space-y-3.5 ${
                  isLow 
                    ? 'border-rose-300 bg-rose-50/10' 
                    : isMed 
                    ? 'border-amber-200' 
                    : 'border-slate-200 hover:border-teal-300'
                }`}
              >
                {/* Medicine Title & Confidence Pill */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        {med.possibleName}
                      </h4>
                    </div>
                    {med.rawTextFound && (
                      <div className="text-xs text-slate-500 mt-1 pl-7 flex items-center space-x-1">
                        <span className="font-medium text-slate-400">{isBn ? 'মূল প্রেসক্রিপশনে লেখা:' : 'Found text:'}</span>
                        <span className="font-mono text-slate-600 italic">"{med.rawTextFound}"</span>
                      </div>
                    )}
                  </div>

                  {/* Confidence Pill */}
                  <div className="self-start sm:self-center">
                    {isHigh && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        <span>{isBn ? 'স্পষ্ট পাঠ (High)' : 'High Confidence'}</span>
                      </span>
                    )}
                    {isMed && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle size={12} className="text-amber-600" />
                        <span>{isBn ? 'মাঝারি পাঠ (Medium)' : 'Moderate'}</span>
                      </span>
                    )}
                    {isLow && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                        <AlertTriangle size={12} className="text-rose-600" />
                        <span>{isBn ? 'অস্পষ্ট/Unclear (যাচাই করুন)' : 'Low Confidence'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Dosage, Timing, Duration Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/80 rounded-xl p-3 text-xs sm:text-sm">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                      {isBn ? 'ডোজ / সেবন মাত্রা' : 'Dosage'}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {med.dosage || (isBn ? 'অনির্দিষ্ট' : 'Not specified')}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                      {isBn ? 'খাওয়ার নিয়ম ও সময়' : 'Timing & Instructions'}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {med.timing || (isBn ? 'অনির্দিষ্ট' : 'Not specified')}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                      {isBn ? 'মেয়াদ / কতদিন খাবেন' : 'Duration'}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {med.duration || (isBn ? 'অনির্দিষ্ট' : 'As advised')}
                    </span>
                  </div>
                </div>

                {/* Purpose in Bengali */}
                <div className="text-xs sm:text-sm text-slate-600 flex items-start space-x-1.5 pt-1">
                  <span className="font-bold text-teal-700 shrink-0">
                    {isBn ? 'ওষুধটির উদ্দেশ্য:' : 'Purpose:'}
                  </span>
                  <span>{med.purpose}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drug Interaction & Safety Matrix Section */}
      {runtimeMatrix ? (
        <DrugSafetyMatrixView
          matrix={runtimeMatrix}
          medicinesList={data.detectedMedicines.map(m => m.possibleName)}
          title={isBn ? 'প্রেসক্রিপশন ড্রাগ ইন্টারঅ্যাকশন ও সেফটি ম্যাট্রিক্স' : 'Prescription Drug Interaction & Safety Matrix'}
        />
      ) : data.detectedMedicines.length >= 2 ? (
        <div className="bg-white border border-teal-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {isBn ? 'ড্রাগ ইন্টারঅ্যাকশন ও সেফটি ম্যাট্রিক্স চালু করুন' : 'Run Drug-Drug Interaction Screening'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isBn 
                    ? 'প্রেসক্রিপশনের ওষুধগুলোর মধ্যে কোনো ক্ষতিকর প্রতিক্রিয়া বা টাইমিং বিরোধ আছে কিনা তা ১-ক্লিকে পরীক্ষা করুন।' 
                    : 'Check the detected medications for adverse drug-drug interactions, side effects, and food warnings.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunInteractionCheck}
              disabled={isCheckingMatrix}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all shadow-xs shrink-0 disabled:bg-slate-300"
            >
              {isCheckingMatrix ? (
                <>
                  <RefreshCw size={15} className="animate-spin text-white" />
                  <span>{isBn ? 'ম্যাট্রিক্স তৈরি হচ্ছে...' : 'Computing Matrix...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>{isBn ? 'ইন্টারঅ্যাকশন পরীক্ষা করুন' : 'Evaluate Interactions'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : null}

      {/* Suggested Clinical Tests Section */}
      {data.suggestedTests && data.suggestedTests.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
            <FlaskConical size={19} className="text-teal-600" />
            <span>{isBn ? 'পরামর্শকৃত ল্যাব / ক্লিনিক্যাল পরীক্ষা (Suggested Tests)' : 'Suggested Clinical Tests'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.suggestedTests.map((test, idx) => (
              <div
                key={idx}
                className="border border-slate-200 bg-slate-50/60 rounded-xl p-3.5 space-y-1"
              >
                <div className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                  <span>{test.testName}</span>
                </div>
                <p className="text-xs text-slate-600 pl-3">
                  {test.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Standard SUROKKHA AI Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-3 text-amber-950">
        <ShieldAlert size={20} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
          <div className="font-bold text-amber-900">
            {isBn ? 'সুরক্ষায় এআই (SUROKKHA AI) নিরাপত্তা ডিসক্লেইমার' : 'SUROKKHA AI Official Safety Disclaimer'}
          </div>
          <p className="text-amber-900/90">
            {data.disclaimer}
          </p>
        </div>
      </div>

      {/* Emergency Hotline & Help Link */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            {isBn ? 'জরুরি প্রয়োজনে বা পার্শ্বপ্রতিক্রিয়ায়' : 'Immediate Emergency Care'}
          </div>
          <div className="text-sm font-bold text-white">
            {isBn ? 'কোনো গুরুতর পার্শ্বপ্রতিক্রিয়া বা জটিলতায় অবিলম্বে সহায়তা নিন' : 'For acute complications or drug reactions, contact emergency care'}
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <a
            href="tel:999"
            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <span>999</span>
            <span className="text-[11px] font-normal opacity-90">({isBn ? 'জাতীয় জরুরি সেবা' : 'Emergency'})</span>
          </a>
          <a
            href="tel:16263"
            className="px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <span>16263</span>
            <span className="text-[11px] font-normal opacity-90">({isBn ? 'স্বাস্থ্য বাতায়ন' : 'Health Line'})</span>
          </a>
        </div>
      </div>

      {/* Original Image Modal */}
      {showImageModal && imageUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800">
                {isBn ? 'মূল প্রেসক্রিপশনের ছবি' : 'Original Prescription Image'}
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-slate-100">
              <img
                src={imageUrl}
                alt="Original Prescription"
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
