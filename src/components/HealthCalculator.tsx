import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  Droplets, 
  Info, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Heart, 
  Activity, 
  Plus, 
  Minus, 
  Sun, 
  Flame, 
  Calendar,
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type SubTool = 'bmi' | 'water';
type UnitSystem = 'metric' | 'imperial';
type Gender = 'male' | 'female' | 'other';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense';
type ClimateType = 'normal' | 'warm' | 'hot';
type PhysiologicalState = 'standard' | 'pregnant' | 'breastfeeding';

export default function HealthCalculator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Active sub-tool: 'bmi' or 'water'
  const [activeSubTool, setActiveSubTool] = useState<SubTool>('bmi');

  // ===================== BMI STATE =====================
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [useAsianCutoff, setUseAsianCutoff] = useState<boolean>(true);
  const [gender, setGender] = useState<Gender>('female');
  const [age, setAge] = useState<number>(28);

  // Metric inputs
  const [weightKg, setWeightKg] = useState<string>('68');
  const [heightCm, setHeightCm] = useState<string>('165');

  // Imperial inputs
  const [weightLbs, setWeightLbs] = useState<string>('150');
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('5');

  // ===================== WATER STATE =====================
  const [waterWeightKg, setWaterWeightKg] = useState<string>('65');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [climate, setClimate] = useState<ClimateType>('warm');
  const [physiologicalState, setPhysiologicalState] = useState<PhysiologicalState>('standard');

  // Daily Water Tracker state (persisted per day)
  const [glassesLogged, setGlassesLogged] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Load water tracker from localStorage on mount
  useEffect(() => {
    try {
      const todayKey = `surokkha_water_tracker_${new Date().toISOString().slice(0, 10)}`;
      const saved = localStorage.getItem(todayKey);
      if (saved !== null) {
        setGlassesLogged(parseInt(saved, 10) || 0);
      }
    } catch {
      // localStorage may fail in restricted iframes
    }
  }, []);

  const handleUpdateGlasses = (delta: number) => {
    const updated = Math.max(0, glassesLogged + delta);
    setGlassesLogged(updated);
    try {
      const todayKey = `surokkha_water_tracker_${new Date().toISOString().slice(0, 10)}`;
      localStorage.setItem(todayKey, updated.toString());
    } catch {
      // ignore
    }
  };

  // Synchronize weights between Metric and Imperial if user switches unitSystem
  const handleUnitSystemChange = (newSystem: UnitSystem) => {
    if (newSystem === unitSystem) return;
    if (newSystem === 'imperial') {
      const kg = parseFloat(weightKg);
      if (!isNaN(kg) && kg > 0) {
        setWeightLbs((kg * 2.20462).toFixed(1));
      }
      const cm = parseFloat(heightCm);
      if (!isNaN(cm) && cm > 0) {
        const totalInches = cm / 2.54;
        const ft = Math.floor(totalInches / 12);
        const inch = Math.round(totalInches % 12);
        setHeightFeet(ft.toString());
        setHeightInches(inch.toString());
      }
    } else {
      const lbs = parseFloat(weightLbs);
      if (!isNaN(lbs) && lbs > 0) {
        setWeightKg((lbs / 2.20462).toFixed(1));
      }
      const ft = parseFloat(heightFeet) || 0;
      const inch = parseFloat(heightInches) || 0;
      const totalInches = ft * 12 + inch;
      if (totalInches > 0) {
        setHeightCm(Math.round(totalInches * 2.54).toString());
      }
    }
    setUnitSystem(newSystem);
  };

  // ===================== BMI CALCULATIONS =====================
  const bmiCalculation = useMemo(() => {
    let weightInKg = 0;
    let heightInMeters = 0;

    if (unitSystem === 'metric') {
      weightInKg = parseFloat(weightKg) || 0;
      const cm = parseFloat(heightCm) || 0;
      heightInMeters = cm / 100;
    } else {
      const lbs = parseFloat(weightLbs) || 0;
      weightInKg = lbs / 2.20462;
      const ft = parseFloat(heightFeet) || 0;
      const inch = parseFloat(heightInches) || 0;
      const totalInches = ft * 12 + inch;
      heightInMeters = (totalInches * 2.54) / 100;
    }

    if (weightInKg <= 0 || heightInMeters <= 0) {
      return null;
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);

    // Cutoffs based on standard WHO vs South Asian population criteria
    // Asian WHO Cutoffs: Underweight < 18.5, Normal 18.5-22.9, Overweight 23-27.4, Obese >= 27.5
    // Global WHO Cutoffs: Underweight < 18.5, Normal 18.5-24.9, Overweight 25-29.9, Obese >= 30.0
    let category: 'underweight' | 'normal' | 'overweight' | 'obese1' | 'obese2' = 'normal';
    let minHealthyBmi = 18.5;
    let maxHealthyBmi = useAsianCutoff ? 22.9 : 24.9;

    if (useAsianCutoff) {
      if (bmi < 18.5) category = 'underweight';
      else if (bmi < 23.0) category = 'normal';
      else if (bmi < 27.5) category = 'overweight';
      else if (bmi < 32.5) category = 'obese1';
      else category = 'obese2';
    } else {
      if (bmi < 18.5) category = 'underweight';
      else if (bmi < 25.0) category = 'normal';
      else if (bmi < 30.0) category = 'overweight';
      else if (bmi < 35.0) category = 'obese1';
      else category = 'obese2';
    }

    // Healthy weight range for this height
    const minHealthyWeightKg = minHealthyBmi * (heightInMeters * heightInMeters);
    const maxHealthyWeightKg = maxHealthyBmi * (heightInMeters * heightInMeters);

    // Difference from healthy range
    let weightDiffKg = 0;
    let weightStatusNote = '';

    if (weightInKg < minHealthyWeightKg) {
      weightDiffKg = minHealthyWeightKg - weightInKg;
      weightStatusNote = isBn 
        ? `আদর্শ ওজনে পৌঁছাতে আপনার প্রায় ${weightDiffKg.toFixed(1)} কেজি ওজন বাড়ানো উচিত।`
        : `You should gain approximately ${weightDiffKg.toFixed(1)} kg to reach healthy weight.`;
    } else if (weightInKg > maxHealthyWeightKg) {
      weightDiffKg = weightInKg - maxHealthyWeightKg;
      weightStatusNote = isBn 
        ? `আদর্শ ওজনে পৌঁছাতে আপনার প্রায় ${weightDiffKg.toFixed(1)} কেজি ওজন কমানো সহায়ক হবে।`
        : `Losing approximately ${weightDiffKg.toFixed(1)} kg would bring you into the optimal range.`;
    } else {
      weightStatusNote = isBn
        ? 'চমৎকার! আপনার ওজন আপনার উচ্চতা অনুযায়ী নিখুঁত স্বাস্থ্যকর সীমার মধ্যে রয়েছে।'
        : 'Excellent! Your body weight is currently in the optimal healthy range.';
    }

    // Spectrum marker position (0% to 100%)
    // Range maps from BMI 14 to 38
    const minScale = 14;
    const maxScale = 38;
    const clampedBmi = Math.min(Math.max(bmi, minScale), maxScale);
    const spectrumPercent = ((clampedBmi - minScale) / (maxScale - minScale)) * 100;

    return {
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      minHealthyWeightKg: parseFloat(minHealthyWeightKg.toFixed(1)),
      maxHealthyWeightKg: parseFloat(maxHealthyWeightKg.toFixed(1)),
      weightDiffKg: parseFloat(weightDiffKg.toFixed(1)),
      weightStatusNote,
      spectrumPercent,
      weightInKg: parseFloat(weightInKg.toFixed(1)),
      heightInMeters: parseFloat(heightInMeters.toFixed(2))
    };
  }, [unitSystem, useAsianCutoff, weightKg, heightCm, weightLbs, heightFeet, heightInches, isBn]);

  // ===================== WATER INTAKE CALCULATIONS =====================
  const waterCalculation = useMemo(() => {
    const weight = parseFloat(waterWeightKg) || 0;
    if (weight <= 0) return null;

    // Baseline: 33 ml per kg of body weight
    let baseMl = weight * 33;

    // Activity multiplier
    let activityBonusMl = 0;
    if (activityLevel === 'light') activityBonusMl = 350;
    else if (activityLevel === 'moderate') activityBonusMl = 700;
    else if (activityLevel === 'intense') activityBonusMl = 1100;

    // Climate addition
    let climateBonusMl = 0;
    if (climate === 'warm') climateBonusMl = 450;
    else if (climate === 'hot') climateBonusMl = 850;

    // Physiological state addition
    let stateBonusMl = 0;
    if (physiologicalState === 'pregnant') stateBonusMl = 350;
    else if (physiologicalState === 'breastfeeding') stateBonusMl = 750;

    const totalWaterMl = Math.round(baseMl + activityBonusMl + climateBonusMl + stateBonusMl);
    const totalWaterLiters = parseFloat((totalWaterMl / 1000).toFixed(1));
    const glassSizeMl = 250;
    const totalGlasses = Math.ceil(totalWaterMl / glassSizeMl);

    // Progress percentage
    const progressPercent = Math.min(100, Math.round((glassesLogged / totalGlasses) * 100));

    return {
      totalWaterMl,
      totalWaterLiters,
      totalGlasses,
      progressPercent,
      baseMl: Math.round(baseMl),
      activityBonusMl,
      climateBonusMl,
      stateBonusMl
    };
  }, [waterWeightKg, activityLevel, climate, physiologicalState, glassesLogged]);

  // Copy shareable summary
  const handleCopySummary = () => {
    let text = '';
    if (activeSubTool === 'bmi' && bmiCalculation) {
      text = isBn
        ? `[সুরক্ষা এআই - বিএমআই রিপোর্ট]\nবিএমআই: ${bmiCalculation.bmi} (${getCategoryLabel(bmiCalculation.category, true)})\nউচ্চতা অনুযায়ী সুস্থ ওজনের সীমা: ${bmiCalculation.minHealthyWeightKg} - ${bmiCalculation.maxHealthyWeightKg} কেজি\n${bmiCalculation.weightStatusNote}`
        : `[Surokkha AI - BMI Report]\nBMI: ${bmiCalculation.bmi} (${getCategoryLabel(bmiCalculation.category, false)})\nHealthy Weight Range: ${bmiCalculation.minHealthyWeightKg} - ${bmiCalculation.maxHealthyWeightKg} kg\n${bmiCalculation.weightStatusNote}`;
    } else if (activeSubTool === 'water' && waterCalculation) {
      text = isBn
        ? `[সুরক্ষা এআই - দৈনিক পানি গ্রহণ নির্দেশনা]\nদৈনিক প্রয়োজনীয় পানি: ${waterCalculation.totalWaterLiters} লিটার (~${waterCalculation.totalGlasses} গ্লাস)\nআজ পান করা হয়েছে: ${glassesLogged}/${waterCalculation.totalGlasses} গ্লাস`
        : `[Surokkha AI - Daily Hydration Guide]\nRecommended Daily Water: ${waterCalculation.totalWaterLiters} Liters (~${waterCalculation.totalGlasses} glasses)\nLogged Today: ${glassesLogged}/${waterCalculation.totalGlasses} glasses`;
    }

    if (text && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Helper for category labels
  function getCategoryLabel(category: string, inBangla: boolean) {
    switch (category) {
      case 'underweight':
        return inBangla ? 'স্বাভাবিকের চেয়ে কম ওজন (Underweight)' : 'Underweight';
      case 'normal':
        return inBangla ? 'নিখুঁত ও স্বাস্থ্যকর ওজন (Normal)' : 'Normal Weight';
      case 'overweight':
        return inBangla ? 'অতিরিক্ত ওজন (Overweight)' : 'Overweight';
      case 'obese1':
        return inBangla ? 'স্থূলতা শ্রেণী-১ (Obese Class I)' : 'Obese (Class I)';
      case 'obese2':
        return inBangla ? 'উচ্চমাত্রার স্থূলতা (Severe Obesity)' : 'Severely Obese';
      default:
        return '';
    }
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case 'underweight':
        return 'text-sky-600 bg-sky-50 border-sky-200';
      case 'normal':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'overweight':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'obese1':
      case 'obese2':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Top Segmented Sub-Tool Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveSubTool('bmi')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              activeSubTool === 'bmi'
                ? 'bg-white text-teal-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale size={16} />
            <span>{isBn ? 'বিএমআই ক্যালকুলেটর' : 'BMI & Body Mass'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTool('water')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              activeSubTool === 'water'
                ? 'bg-white text-teal-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplets size={16} className="text-cyan-600" />
            <span>{isBn ? 'পানি ও হাইড্রেশন গাইড' : 'Water Intake Guide'}</span>
          </button>
        </div>

        {/* Quiet Meta Info */}
        <div className="flex items-center gap-2 text-xs text-slate-500 px-3">
          <Info size={14} className="text-teal-600 shrink-0" />
          <span>
            {activeSubTool === 'bmi'
              ? (isBn ? 'WHO এশিয়ান এবং গ্লোবাল কাটঅফ সমর্থিত' : 'WHO Asian & Global Criteria Supported')
              : (isBn ? 'ওজন, আবহাওয়া ও অ্যাক্টিভিটি ভিত্তিক নির্ভুল ক্যালকুলেশন' : 'Personalized Weight, Climate & Exertion Model')}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. BMI CALCULATOR SECTION                                */}
      {/* ======================================================== */}
      {activeSubTool === 'bmi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inputs Form */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isBn ? 'শারীরিক পরিমাপ প্রদান করুন' : 'Enter Body Measurements'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn ? 'সঠিক বিএমআই পেতে আপনার সঠিক ওজন ও উচ্চতা দিন' : 'Accurate metrics provide clinically valid body composition insights'}
                </p>
              </div>

              {/* Unit System Switcher */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleUnitSystemChange('metric')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    unitSystem === 'metric' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isBn ? 'কেজি / সেমি' : 'Metric (kg/cm)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitSystemChange('imperial')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    unitSystem === 'imperial' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isBn ? 'পাউন্ড / ফুট' : 'Imperial (lbs/ft)'}
                </button>
              </div>
            </div>

            {/* Demographic Toggles (Gender, Age) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? 'লিঙ্গ' : 'Biological Sex'}
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      gender === 'female' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isBn ? 'নারী' : 'Female'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      gender === 'male' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isBn ? 'পুরুষ' : 'Male'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? 'বয়স (বছর)' : 'Age (Years)'}
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-semibold"
                />
              </div>
            </div>

            {/* Height & Weight Inputs */}
            {unitSystem === 'metric' ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {isBn ? 'উচ্চতা (সেন্টিমিটার)' : 'Height (Centimeters)'}
                    </label>
                    <span className="text-xs text-slate-400 font-mono">
                      {heightCm ? `${(parseFloat(heightCm) / 100).toFixed(2)} m` : ''}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="60"
                      max="260"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="e.g. 165"
                      className="w-full px-3.5 py-2.5 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-semibold"
                    />
                    <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                      cm
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {isBn ? 'ওজন (কেজি)' : 'Weight (Kilograms)'}
                    </label>
                    <span className="text-xs text-slate-400 font-mono">
                      {weightKg ? `${(parseFloat(weightKg) * 2.20462).toFixed(1)} lbs` : ''}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="20"
                      max="300"
                      step="0.5"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      placeholder="e.g. 68"
                      className="w-full px-3.5 py-2.5 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-semibold"
                    />
                    <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                      kg
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isBn ? 'উচ্চতা (ফুট ও ইঞ্চি)' : 'Height (Feet & Inches)'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        min="2"
                        max="8"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value)}
                        placeholder="5"
                        className="w-full px-3.5 py-2.5 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-semibold"
                      />
                      <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                        ft
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value)}
                        placeholder="6"
                        className="w-full px-3.5 py-2.5 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-semibold"
                      />
                      <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                        in
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {isBn ? 'ওজন (পাউন্ড)' : 'Weight (Pounds)'}
                    </label>
                    <span className="text-xs text-slate-400 font-mono">
                      {weightLbs ? `${(parseFloat(weightLbs) / 2.20462).toFixed(1)} kg` : ''}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="40"
                      max="600"
                      step="1"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(e.target.value)}
                      placeholder="e.g. 150"
                      className="w-full px-3.5 py-2.5 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-semibold"
                    />
                    <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                      lbs
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* South Asian / Asian Population Criteria Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-start justify-between gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-600" />
                    {isBn ? 'দক্ষিণ এশীয় / বাংলাদেশী স্ট্যান্ডার্ড (WHO Asian Cutoff)' : 'WHO South Asian Population Criteria'}
                  </span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {isBn
                      ? 'বাঙালি ও দক্ষিণ এশীয়দের জন্য অতিরিক্ত মেদ ও হৃদরোগের ঝুঁকি কমাতে বিএমআই ২৩ থেকে ওভারওয়েট এবং ২৭.৫ থেকে ওবিজ হিসেবে গণ্য করা হয়।'
                      : 'Recommended for South Asians: cut-off for overweight begins at 23.0 and obesity at 27.5 due to higher risk of diabetes and CVD at lower BMI.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUseAsianCutoff(!useAsianCutoff)}
                  className={`shrink-0 w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    useAsianCutoff ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                  aria-label="Toggle Asian WHO Cutoff"
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-xs transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Results & Clinical Feedback */}
          <div className="lg:col-span-6 space-y-6">
            {bmiCalculation ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
                {/* Result Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {isBn ? 'আপনার বডি মাস ইনডেক্স' : 'Calculated Body Mass Index'}
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                        {bmiCalculation.bmi}
                      </span>
                      <span className="text-sm font-semibold text-slate-400">
                        kg/m²
                      </span>
                    </div>
                  </div>

                  {/* Category Stamp */}
                  <div className={`px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-bold ${getCategoryColor(bmiCalculation.category)}`}>
                    {getCategoryLabel(bmiCalculation.category, isBn)}
                  </div>
                </div>

                {/* BMI Visual Spectrum Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>{isBn ? 'কম ওজন (<১৮.৫)' : 'Underweight (<18.5)'}</span>
                    <span>
                      {useAsianCutoff 
                        ? (isBn ? 'স্বাভাবিক (১৮.৫ - ২২.৯)' : 'Normal (18.5 - 22.9)')
                        : (isBn ? 'স্বাভাবিক (১৮.৫ - ২৪.৯)' : 'Normal (18.5 - 24.9)')}
                    </span>
                    <span>
                      {useAsianCutoff
                        ? (isBn ? 'স্থূলতা (≥২৭.৫)' : 'Obese (≥27.5)')
                        : (isBn ? 'স্থূলতা (≥৩০.০)' : 'Obese (≥30.0)')}
                    </span>
                  </div>

                  {/* Multi-segmented colored spectrum */}
                  <div className="relative h-3 w-full rounded-full overflow-hidden flex bg-slate-100 shadow-inner">
                    <div className="h-full bg-sky-400 w-[20%]" title="Underweight" />
                    <div className="h-full bg-emerald-500 w-[30%]" title="Normal" />
                    <div className="h-full bg-amber-400 w-[25%]" title="Overweight" />
                    <div className="h-full bg-rose-500 w-[25%]" title="Obese" />
                  </div>

                  {/* Pointer Indicator */}
                  <div className="relative w-full h-4">
                    <div 
                      className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                      style={{ left: `${bmiCalculation.spectrumPercent}%` }}
                    >
                      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-slate-800" />
                      <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-1 rounded-sm mt-0.5">
                        {bmiCalculation.bmi}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Healthy Weight Range Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>{isBn ? 'উচ্চতা অনুযায়ী সুস্থ ওজনের সীমা:' : 'Optimal Healthy Weight Range:'}</span>
                    <span className="font-mono text-teal-700 text-sm">
                      {bmiCalculation.minHealthyWeightKg} kg – {bmiCalculation.maxHealthyWeightKg} kg
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {bmiCalculation.weightStatusNote}
                  </p>
                </div>

                {/* Evidence-Based Clinical Guidance */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Activity size={14} className="text-teal-600" />
                    {isBn ? 'স্বাস্থ্য পরামর্শ ও জীবনযাত্রার নির্দেশিকা' : 'Clinical Health Guidance'}
                  </h3>

                  <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                    {bmiCalculation.category === 'normal' ? (
                      <>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            {isBn
                              ? 'আপনার ওজন একদম আদর্শ সীমার মধ্যে রয়েছে। নিয়মিত সুষম খাদ্যাভ্যাস ও দৈনিক ৩০ মিনিট হাঁটার মাধ্যমে এই ওজন বজায় রাখুন।'
                              : 'Your current weight is optimal. Maintain this with a balanced diet rich in whole foods and 150 minutes of moderate activity per week.'}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            {isBn
                              ? 'পর্যাপ্ত প্রোটিন, শাকসবজি ও পর্যাপ্ত জলপান বজায় রেখে মেটাবলিক স্বাস্থ্য সতেজ রাখুন।'
                              : 'Maintain muscle mass with resistance training twice a week and routine hydration.'}
                          </span>
                        </li>
                      </>
                    ) : bmiCalculation.category === 'underweight' ? (
                      <>
                        <li className="flex items-start gap-2">
                          <AlertTriangle size={15} className="text-sky-600 shrink-0 mt-0.5" />
                          <span>
                            {isBn
                              ? 'কম ওজনের কারণে রোগ প্রতিরোধ ক্ষমতা ও হাড়ের ঘনত্বে ঘাটতি দেখা দিতে পারে। পুষ্টিকর ক্যালরিঘন খাবার (ডিম, দুধ, বাদাম, কলা) গ্রহণ করুন।'
                              : 'Being underweight can increase risks of immune deficiency, anemia, and reduced bone density. Focus on nutrient-dense, protein-rich foods.'}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle size={15} className="text-sky-600 shrink-0 mt-0.5" />
                          <span>
                            {isBn
                              ? 'কোনো অন্তর্নিহিত হরমোন বা হজমজনিত সমস্যা আছে কি না তা যাচাই করতে পুষ্টিবিদ বা ডাক্তারের পরামর্শ নিন।'
                              : 'Consider consulting a clinical nutritionist to rule out malabsorption or thyroid irregularities.'}
                          </span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            {isBn
                              ? 'উচ্চ বিএমআই রক্তচাপ, ডায়াবেটিস এবং ফ্যাটি লিভারের ঝুঁকি বৃদ্ধি করে। পরিশোধিত চিনি ও অতিরিক্ত লবণ পরিহার করুন।'
                              : 'Higher BMI increases cardiovascular load, insulin resistance, and hypertension risks. Reducing refined carbs and excess sodium is advised.'}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            {isBn
                              ? 'প্রতি সপ্তাহে অন্তত ১৫০ মিনিট মধ্যম গতির কার্ডিও (দ্রুত হাঁটা/সাঁতার) এবং নিয়ন্ত্রিত খাবারের মাধ্যমে ধীরে ধীরে ওজন কমানোর লক্ষ্য নির্ধারণ করুন।'
                              : 'Gradual weight reduction (0.5 to 1 kg per week) via caloric mindfulness and brisk walking produces the most sustainable health outcomes.'}
                          </span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {isCopied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                    <span>{isCopied ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'রিপোর্ট কপি করুন' : 'Copy Summary')}</span>
                  </button>

                  <div className="text-[11px] text-slate-400">
                    {isBn ? 'ক্লিনিক্যাল তথ্য শুধুমাত্র শিক্ষণীয় উদ্দেশ্যে' : 'Educational tool · Not medical advice'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                <Scale size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm">
                  {isBn ? 'আপনার ওজন ও উচ্চতা ইনপুট দিন।' : 'Enter valid weight and height to view BMI analysis.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. WATER INTAKE RECOMMENDATION SECTION                   */}
      {/* ======================================================== */}
      {activeSubTool === 'water' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Personalized Factors */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {isBn ? 'ব্যক্তিগত তথ্য ও হাইড্রেশন ফ্যাক্টর' : 'Personalized Hydration Factors'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn ? 'শারীরিক ওজন, পরিশ্রম ও আবহাওয়া অনুযায়ী আপনার দৈনিক পানির সঠিক চাহিদা নির্ধারণ করা হয়' : 'Calculates fluid requirements adjusted for body mass, metabolic burn, and climate'}
              </p>
            </div>

            {/* Weight Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isBn ? 'শারীরিক ওজন (কেজি)' : 'Body Weight (kg)'}
                </label>
                <span className="text-xs text-slate-400 font-mono">
                  {waterWeightKg ? `${(parseFloat(waterWeightKg) * 2.20462).toFixed(1)} lbs` : ''}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="20"
                  max="250"
                  step="0.5"
                  value={waterWeightKg}
                  onChange={(e) => setWaterWeightKg(e.target.value)}
                  placeholder="e.g. 65"
                  className="w-full px-3.5 py-2.5 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all font-semibold"
                />
                <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                  kg
                </span>
              </div>
            </div>

            {/* Physical Activity Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isBn ? 'দৈনিক শারীরিক পরিশ্রম / ব্যায়াম' : 'Physical Activity Level'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActivityLevel('sedentary')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activityLevel === 'sedentary'
                      ? 'border-cyan-500 bg-cyan-50/50 text-cyan-900 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="block text-xs font-bold">{isBn ? 'অলস / ডেস্কে কাজ' : 'Sedentary'}</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">{isBn ? 'খুব কম নড়াচড়া' : 'Desk work, minimal exercise'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivityLevel('light')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activityLevel === 'light'
                      ? 'border-cyan-500 bg-cyan-50/50 text-cyan-900 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="block text-xs font-bold">{isBn ? 'হালকা পরিশ্রম' : 'Light Active'}</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">{isBn ? '২০-৩০ মিনিট হাঁটা (+৩৫০ মিলি)' : '20-30m walk (+350 ml)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivityLevel('moderate')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activityLevel === 'moderate'
                      ? 'border-cyan-500 bg-cyan-50/50 text-cyan-900 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="block text-xs font-bold">{isBn ? 'মাঝারি পরিশ্রম' : 'Moderate'}</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">{isBn ? '৪৫-৬০ মিনিট ঘাম ঝরানো (+৭০০ মিলি)' : '45-60m workout (+700 ml)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivityLevel('intense')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activityLevel === 'intense'
                      ? 'border-cyan-500 bg-cyan-50/50 text-cyan-900 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="block text-xs font-bold">{isBn ? 'ভারী পরিশ্রম / অ্যাথলেট' : 'Intense'}</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">{isBn ? 'ভারী কাজ / কসরত (+১১০০ মিলি)' : 'Heavy labor/sports (+1100 ml)'}</span>
                </button>
              </div>
            </div>

            {/* Weather / Climate Condition */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isBn ? 'আবহাওয়া ও তাপমাত্রা' : 'Environment & Weather'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setClimate('normal')}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                    climate === 'normal'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                  }`}
                >
                  <span className="block text-xs">{isBn ? 'স্বাভাবিক / এসি' : 'Normal / AC'}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">20-25°C</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClimate('warm')}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                    climate === 'warm'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                  }`}
                >
                  <span className="block text-xs">{isBn ? 'গরম / আর্দ্র' : 'Warm / Humid'}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">+450 ml</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClimate('hot')}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                    climate === 'hot'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                  }`}
                >
                  <span className="block text-xs">{isBn ? 'তীব্র তাপপ্রবাহ' : 'Hot Sun'}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">+850 ml</span>
                </button>
              </div>
            </div>

            {/* Special Physiological Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isBn ? 'বিশেষ শারীরিক অবস্থা (প্রযোজ্য ক্ষেত্রে)' : 'Physiological Condition (Optional)'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPhysiologicalState('standard')}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    physiologicalState === 'standard'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-900 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {isBn ? 'সাধারণ' : 'Standard'}
                </button>

                <button
                  type="button"
                  onClick={() => setPhysiologicalState('pregnant')}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    physiologicalState === 'pregnant'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-900 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {isBn ? 'গর্ভবতী (+৩৫০ মিলি)' : 'Pregnant (+350ml)'}
                </button>

                <button
                  type="button"
                  onClick={() => setPhysiologicalState('breastfeeding')}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    physiologicalState === 'breastfeeding'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-900 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {isBn ? 'স্তন্যদানকারী (+৭৫০ মিলি)' : 'Nursing (+750ml)'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Hydration Recommendations & Daily Tracker */}
          <div className="lg:col-span-6 space-y-6">
            {waterCalculation ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
                {/* Result Hero Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-700 text-white shadow-md relative overflow-hidden">
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-100">
                        {isBn ? 'দৈনিক প্রয়োজনীয় পানি' : 'Recommended Daily Intake'}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                          {waterCalculation.totalWaterLiters}
                        </span>
                        <span className="text-lg font-bold text-cyan-100">
                          {isBn ? 'লিটার / দিন' : 'Liters / day'}
                        </span>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-cyan-100">
                        ≈ {waterCalculation.totalWaterMl.toLocaleString()} ml &nbsp;·&nbsp; ~{waterCalculation.totalGlasses} {isBn ? 'গ্লাস (প্রতি গ্লাস ২৫০ মিলি)' : 'standard glasses (250 ml)'}
                      </div>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                      <Droplets size={26} />
                    </div>
                  </div>
                </div>

                {/* Interactive Daily Glass Tracker */}
                <div className="p-5 bg-cyan-50/60 rounded-2xl border border-cyan-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-cyan-950 flex items-center gap-1.5">
                        <Calendar size={15} className="text-cyan-700" />
                        {isBn ? 'আজকের পানি পান ট্র্যাকার' : 'Today’s Water Intake Log'}
                      </h3>
                      <p className="text-xs text-cyan-800 mt-0.5">
                        {isBn ? 'প্রতি গ্লাস পানি পানের পর ক্লিক করে কাউন্ট বাড়ান' : 'Track your glasses throughout the day'}
                      </p>
                    </div>

                    <span className="text-sm font-extrabold text-cyan-900 font-mono">
                      {glassesLogged} / {waterCalculation.totalGlasses} {isBn ? 'গ্লাস' : 'glasses'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-cyan-200/70 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-600 rounded-full transition-all duration-300"
                        style={{ width: `${waterCalculation.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-semibold text-cyan-800">
                      <span>{waterCalculation.progressPercent}% {isBn ? 'সম্পন্ন' : 'completed'}</span>
                      <span>
                        {glassesLogged >= waterCalculation.totalGlasses 
                          ? (isBn ? '🎉 দৈনিক লক্ষ্য পূরণ হয়েছে!' : '🎉 Daily hydration goal achieved!')
                          : `${waterCalculation.totalGlasses - glassesLogged} ${isBn ? 'গ্লাস বাকি' : 'glasses remaining'}`}
                      </span>
                    </div>
                  </div>

                  {/* Log Actions (+ / -) */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateGlasses(-1)}
                      disabled={glassesLogged <= 0}
                      className="flex items-center gap-1 px-4 py-2 bg-white border border-cyan-200 text-cyan-800 font-bold rounded-xl text-xs hover:bg-cyan-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
                    >
                      <Minus size={14} />
                      <span>{isBn ? '১ গ্লাস কমান' : '-1 Glass'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateGlasses(1)}
                      className="flex items-center gap-1.5 px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
                    >
                      <Plus size={16} />
                      <span>{isBn ? '+১ গ্লাস যোগ করুন' : '+1 Glass (250 ml)'}</span>
                    </button>
                  </div>
                </div>

                {/* Scientific Hydration Schedule Timeline */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {isBn ? 'ক্লিনিক্যাল হাইড্রেশন সময়সূচি' : 'Recommended Hydration Schedule'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="font-bold text-slate-800 block">{isBn ? '🌅 ঘুম থেকে ওঠার পর' : '🌅 Upon Waking (7:00 AM)'}</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        {isBn ? '১-২ গ্লাস (৫০০ মিলি) - মেটাবলিজম চালু করতে' : '1-2 glasses (500 ml) to activate metabolism'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="font-bold text-slate-800 block">{isBn ? '☀️ দুপুরের খাবারের ৩০ মি. আগে' : '☀️ 30m Pre-Lunch (12:30 PM)'}</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        {isBn ? '১ গ্লাস (২৫০ মিলি) - হজম প্রক্রিয়া সহজ করতে' : '1 glass (250 ml) to prep digestive enzymes'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="font-bold text-slate-800 block">{isBn ? '🕒 বিকালের রিফ্রেশমেন্ট' : '🕒 Afternoon Energy (3:30 PM)'}</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        {isBn ? '১-২ গ্লাস - ক্লান্তি ও মাথাব্যথা রোধে' : '1-2 glasses to counteract dehydration fatigue'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="font-bold text-slate-800 block">{isBn ? '🌙 রাতের খাবারের আগে' : '🌙 Pre-Dinner (7:30 PM)'}</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        {isBn ? '১ গ্লাস - অতিরিক্ত খাওয়া রোধে' : '1 glass to assist nutrient transport'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clinical Red Flag Warning */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-[11px] text-amber-900 leading-relaxed space-y-1">
                  <span className="font-bold flex items-center gap-1 text-amber-950">
                    <AlertTriangle size={13} className="text-amber-700" />
                    {isBn ? 'চিকিৎসাগত সতর্কতা (Clinical Notice):' : 'Clinical Medical Caveat:'}
                  </span>
                  <p>
                    {isBn
                      ? 'আপনার যদি দীর্ঘস্থায়ী কিডনি রোগ (CKD), হার্ট ফেইলিউর বা লিভার সিরোসিস থাকে, তবে এই গণনা অনুসরণ করার আগে অবশ্যই আপনার ডাক্তারের নির্দেশিত ফ্লুইড রেস্ট্রিকশন মেনে চলুন।'
                      : 'Patients with Chronic Kidney Disease (CKD), Congestive Heart Failure, or advanced liver disease must strictly follow their nephrologist/cardiologist fluid restriction limits.'}
                  </p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {isCopied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                    <span>{isCopied ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'গাইড কপি করুন' : 'Copy Guide')}</span>
                  </button>

                  <div className="text-[11px] text-slate-400">
                    {isBn ? 'সুস্থ প্রাপ্তবয়স্কদের জন্য আদর্শ গাইড' : 'Calculated for healthy adult physiology'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                <Droplets size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm">
                  {isBn ? 'আপনার ওজন ইনপুট দিন।' : 'Enter valid body weight to view hydration guide.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
