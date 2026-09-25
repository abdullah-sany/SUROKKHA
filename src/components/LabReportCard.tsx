import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Camera, 
  X, 
  Activity, 
  FlaskConical, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight,
  Droplets,
  Heart,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LabReportAnalysisResponse } from '../types';

interface LabReportCardProps {
  onResult: (result: LabReportAnalysisResponse, imageUrl?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface DemoLabCase {
  id: string;
  nameBn: string;
  nameEn: string;
  categoryBn: string;
  badge: string;
  badgeColor: string;
  reportText: string;
}

export default function LabReportCard({
  onResult,
  isLoading,
  setIsLoading
}: LabReportCardProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-configured real-world Innovation Fair Pathology Cases for instant 1-click evaluation
  const demoCases: DemoLabCase[] = [
    {
      id: 'dengue-cbc',
      nameBn: 'ডেঙ্গু ও প্লাটিলেট সংকট (CBC & Platelets)',
      nameEn: 'Dengue & Critical Platelet Drop (CBC)',
      categoryBn: 'হেমাটোলজি ও ডেঙ্গু প্রোফাইল',
      badge: isBn ? '🚨 চরম ঝুঁকিপূর্ণ' : 'Critical Hazard',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      reportText: `
DIAGNOSTIC LAB: Popular Diagnostic Centre Ltd, Dhanmondi
PATIENT: Tanvir Ahmed, 32Y / Male, Date: 22-Sep-2026
TEST: Complete Blood Count (CBC) with Dengue Panel
- Hemoglobin (Hb): 15.8 g/dL (Normal Range: 13.0 - 17.0)
- Total WBC Count: 2,600 /cu.mm (Normal Range: 4,000 - 11,000) [LOW]
- Platelet Count: 38,000 /cu.mm (Normal Range: 150,000 - 450,000) [CRITICAL LOW]
- Hematocrit (PCV): 48.5 % (Normal Range: 40.0 - 50.0) [ELEVATED CONCENTRATION]
- Dengue NS1 Antigen: POSITIVE
Clinical Notes: Acute viral illness with bleeding tendencies. High hazard of plasma leakage.
      `
    },
    {
      id: 'diabetes-hba1c',
      nameBn: 'অনিয়ন্ত্রিত ডায়াবেটিস ও সুগার (HbA1c & FBS)',
      nameEn: 'Uncontrolled Diabetes (HbA1c & Fasting Glucose)',
      categoryBn: 'গ্লাইসেমিক প্রোফাইল',
      badge: isBn ? '⚠️ উচ্চ ঝুঁকি' : 'Attention Needed',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      reportText: `
DIAGNOSTIC LAB: Ibn Sina Medical Diagnostic, Dhaka
PATIENT: Mrs. Rokeya Begum, 54Y / Female, Date: 20-Sep-2026
TEST: Diabetic & Glycemic Assessment
- Fasting Blood Sugar (FBS): 11.6 mmol/L (Normal Range: 4.0 - 5.6) [HIGH]
- 2 Hours Post-Prandial Glucose: 17.2 mmol/L (Normal Range: < 7.8) [HIGH]
- Glycated Hemoglobin (HbA1c): 9.4 % (Normal Range: 4.0 - 5.6, Diabetic Target < 7.0) [CRITICAL HIGH]
- Urine Routine: Glucose +++, Ketones Negative
Clinical Notes: Severe uncontrolled hyperglycemia. Microvascular complication risks.
      `
    },
    {
      id: 'kidney-rft',
      nameBn: 'কিডনি জটিলতা ও ক্রিয়েটিনিন (RFT & Creatinine)',
      nameEn: 'Renal Function & Creatinine (RFT)',
      categoryBn: 'কিডনি ও রেনাল প্রোফাইল',
      badge: isBn ? '🚨 কিডনি সতর্কতা' : 'Renal Impairment',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      reportText: `
DIAGNOSTIC LAB: LabAid Diagnostic Center, Gulshan
PATIENT: Md. Kamal Hossain, 62Y / Male, Date: 19-Sep-2026
TEST: Renal Function Test (RFT) & Electrolytes
- Serum Creatinine: 2.6 mg/dL (Normal Range: 0.7 - 1.3) [CRITICAL HIGH]
- Blood Urea: 84 mg/dL (Normal Range: 15 - 45) [HIGH]
- eGFR: 26 mL/min/1.73m² (Normal Range: > 90) [SEVERELY DECREASED]
- Serum Potassium: 5.4 mmol/L (Normal Range: 3.5 - 5.0) [MILDLY ELEVATED]
Clinical Notes: Stage 4 Chronic Kidney Disease marker or acute on chronic kidney injury.
      `
    },
    {
      id: 'lipid-cholesterol',
      nameBn: 'উচ্চ কোলেস্টেরল ও হৃদরোগ ঝুঁকি (Lipid Profile)',
      nameEn: 'High Cholesterol & Cardiovascular Risk (Lipids)',
      categoryBn: 'লিপিড ও কার্ডিয়াক মার্কার',
      badge: isBn ? '⚠️ কোলেস্টেরল অ্যালার্ট' : 'Dyslipidemia',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      reportText: `
DIAGNOSTIC LAB: Square Hospital Pathology Lab, Dhaka
PATIENT: Farhana Yasmin, 46Y / Female, Date: 21-Sep-2026
TEST: Comprehensive Lipid Profile (Fasting 12 Hours)
- Total Cholesterol: 278 mg/dL (Desirable: < 200) [HIGH]
- LDL Cholesterol (Bad Cholesterol): 184 mg/dL (Optimal: < 100) [HIGH]
- HDL Cholesterol (Good Cholesterol): 35 mg/dL (Protective: > 50) [LOW]
- Serum Triglycerides: 315 mg/dL (Normal: < 150) [HIGH]
Clinical Notes: Mixed dyslipidemia with increased atherogenic cardiovascular disease hazard.
      `
    },
    {
      id: 'normal-checkup',
      nameBn: 'সম্পূর্ণ স্বাভাবিক স্বাস্থ্য চেকআপ (Optimal Normal)',
      nameEn: 'Optimal Health Checkup (All Normal)',
      categoryBn: 'জেনারেল ওয়েলনেস',
      badge: isBn ? '✅ স্বাস্থ্যকর রিপোর্ট' : 'All Normal',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      reportText: `
DIAGNOSTIC LAB: United Hospital Pathology, Dhaka
PATIENT: Shuvo Rahman, 28Y / Male, Date: 23-Sep-2026
TEST: General Executive Health Screening
- Hemoglobin (Hb): 14.6 g/dL (Normal: 13.0 - 17.0) [NORMAL]
- Fasting Blood Sugar: 5.1 mmol/L (Normal: 4.0 - 5.6) [NORMAL]
- Serum Creatinine: 0.9 mg/dL (Normal: 0.7 - 1.2) [NORMAL]
- Total Cholesterol: 165 mg/dL (Desirable: < 200) [NORMAL]
- Platelet Count: 260,000 /cu.mm (Normal: 150,000 - 450,000) [NORMAL]
Clinical Notes: All evaluated biomarkers within normal biological reference parameters.
      `
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError(isBn ? 'অনুগ্রহ করে একটি ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।' : 'Please select an image file (JPG, PNG, WEBP).');
        return;
      }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        setError(isBn ? 'অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন।' : 'Please select an image file.');
        return;
      }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError(null);
  };

  const startAnalysisProgress = () => {
    setLoadingStep(1);
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1200);
    return interval;
  };

  const handleAnalyzeUpload = async () => {
    if (!selectedFile) {
      setError(isBn ? 'অনুগ্রহ করে ল্যাব রিপোর্টের একটি ছবি আপলোড করুন।' : 'Please upload an image of the lab report.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const interval = startAnalysisProgress();

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/lab-report/analyze', {
        method: 'POST',
        body: formData
      });

      clearInterval(interval);

      let resultData: any = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        resultData = await response.json();
      } else {
        const rawText = await response.text();
        try {
          resultData = JSON.parse(rawText);
        } catch {
          resultData = null;
        }
      }

      if (!response.ok) {
        throw new Error(resultData?.error || (isBn ? 'ল্যাব রিপোর্ট বিশ্লেষণ ব্যর্থ হয়েছে।' : 'Failed to analyze lab report'));
      }

      if (!resultData) {
        throw new Error(isBn ? 'সার্ভার থেকে সঠিক ফলাফল পাওয়া যায়নি।' : 'Invalid response from server.');
      }

      onResult(resultData as LabReportAnalysisResponse, imagePreview || undefined);
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setError(err.message || (isBn ? 'ল্যাব রিপোর্ট বিশ্লেষণ ব্যর্থ হয়েছে।' : 'Failed to analyze lab report.'));
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  const handleAnalyzeDemoCase = async (demoCase: DemoLabCase) => {
    setIsLoading(true);
    setError(null);
    const interval = startAnalysisProgress();

    try {
      const response = await fetch('/api/lab-report/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          demoCaseId: demoCase.id,
          reportText: demoCase.reportText
        })
      });

      clearInterval(interval);

      let resultData: any = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        resultData = await response.json();
      } else {
        const rawText = await response.text();
        try {
          resultData = JSON.parse(rawText);
        } catch {
          resultData = null;
        }
      }

      if (!response.ok) {
        throw new Error(resultData?.error || (isBn ? 'ডেমো রিপোর্ট বিশ্লেষণ ব্যর্থ হয়েছে।' : 'Failed to analyze demo report'));
      }

      if (!resultData) {
        throw new Error(isBn ? 'সার্ভার থেকে সঠিক ফলাফল পাওয়া যায়নি।' : 'Invalid response from server.');
      }

      onResult(resultData as LabReportAnalysisResponse);
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setError(err.message || (isBn ? 'ডেমো রিপোর্ট বিশ্লেষণ ব্যর্থ হয়েছে।' : 'Failed to analyze demo report.'));
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/70 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-teal-100 text-teal-800 border border-teal-200">
                  {isBn ? 'স্মার্ট ল্যাব এআই' : 'Smart Lab AI'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Pathology & Biomarker Intelligence
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {isBn ? 'ল্যাব ও রক্ত পরীক্ষা ডিকোডার' : 'Lab Report & Pathology Decoder'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isBn 
                  ? 'সিবিসি, রক্তের সুগার, লিপিড প্রোফাইল বা কিডনি টেস্ট রিপোর্টের ছবি আপলোড করুন; এআই তৎক্ষণাৎ প্রতিটি মান সহজ বাংলায় বুঝিয়ে দেবে।' 
                  : 'Upload any blood test or pathology report image. AI instantly decodes biomarkers, ranges, and clinical meaning in simple language.'}
              </p>
            </div>

            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100 self-start sm:self-auto text-teal-700">
              <FlaskConical size={26} />
            </div>
          </div>

          {/* Quick Demo Cases for Innovation Fair Judges */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles size={14} className="text-teal-600" />
                <span>{isBn ? 'ইনোভেশন ফেয়ার লাইভ ডেমো ল্যাব রিপোর্ট (১-ক্লিক ট্রায়াল):' : 'Innovation Fair Demo Reports (1-Click Test):'}</span>
              </label>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                {isBn ? 'তাত্ক্ষণিক ফলাফল দেখতে চাপুন' : 'Click to analyze immediately'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoCases.map(demo => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleAnalyzeDemoCase(demo)}
                  disabled={isLoading}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-teal-50/50 hover:border-teal-300 text-left transition-all group disabled:opacity-50"
                >
                  <div className="pr-2">
                    <span className="text-xs font-bold text-slate-800 block group-hover:text-teal-800">
                      {isBn ? demo.nameBn : demo.nameEn}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {demo.categoryBn}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${demo.badgeColor}`}>
                    {demo.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {isBn ? 'অথবা আপনার নিজের টেস্ট রিপোর্টের ছবি আপলোড করুন:' : 'Or Upload Your Lab Test Report Image:'}
            </label>

            {!imagePreview ? (
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 sm:p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-teal-50/20 transition-all flex flex-col items-center justify-center space-y-3"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="p-4 rounded-full bg-teal-50 text-teal-600 border border-teal-100">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {isBn ? 'রিপোর্টের ছবি এখানে ড্রপ করুন অথবা ব্রাউজ করুন' : 'Drop lab report here or click to browse'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {isBn ? 'JPEG, PNG, WEBP ছবি সমর্থিত' : 'Supports JPG, PNG, WEBP files'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-900/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={imagePreview}
                    alt="Lab Preview"
                    className="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-2xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block truncate max-w-[200px] sm:max-w-xs">
                      {selectedFile?.name || 'Lab Report Image'}
                    </span>
                    <span className="text-[11px] text-teal-700 font-semibold">
                      {isBn ? 'ছবি প্রস্তুত আছে' : 'Image ready for analysis'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleClearImage}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center space-x-1"
                  >
                    <X size={14} />
                    <span>{isBn ? 'ছবি পরিবর্তন' : 'Change'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center space-x-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button for Uploaded Image */}
          {imagePreview && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAnalyzeUpload}
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-md shadow-teal-600/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin text-white" />
                    <span>
                      {loadingStep === 1 && (isBn ? 'রিপোর্টের টেস্ট ও বায়োমার্কার স্ক্যান হচ্ছে...' : 'Scanning pathology biomarkers...')}
                      {loadingStep === 2 && (isBn ? 'রেফারেন্স রেঞ্জ ও স্বাভাবিকতা বিশ্লেষণ হচ্ছে...' : 'Comparing against biological ranges...')}
                      {loadingStep >= 3 && (isBn ? 'ক্লিনিক্যাল সারসংক্ষেপ ও বাংলা পরামর্শ সংকলন...' : 'Formulating clinical interpretation...')}
                    </span>
                  </>
                ) : (
                  <>
                    <FlaskConical size={18} />
                    <span>{isBn ? 'রিপোর্ট বিশ্লেষণ করুন (Analyze Report)' : 'Analyze Lab Report'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
