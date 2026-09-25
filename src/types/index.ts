export type SafetyLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

export interface Specialist {
  name: string;
  reason: string;
}

export interface EmergencyEscalation {
  required: boolean;
  message: string;
}

export interface AnalysisResponse {
  language: "bn" | "en";
  safetyLevel: SafetyLevel;
  summary: string;
  careGuidance: string;
  suggestedSpecialists: Specialist[];
  warningSigns: string[];
  emergencyEscalation: EmergencyEscalation;
  importantNotes: string[];
  engineUsed?: string;
}

export interface MedicalResourceLink {
  title: string;
  uri: string;
  domain: string;
}

export interface MedicalResourceSearchResult {
  query: string;
  summary: string;
  links: MedicalResourceLink[];
  searchQueries: string[];
}

export interface RecentSearchItem {
  id: string;
  query: string;
  timestamp: number;
  result: AnalysisResponse;
}

export interface DoctorInfo {
  name: string | null;
  specialty: string | null;
}

export interface PatientInfo {
  name: string | null;
  age: string | null;
  date: string | null;
}

export interface DetectedMedicine {
  rawTextFound: string;
  possibleName: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  dosage: string;
  timing: string;
  duration: string;
  purpose: string;
}

export interface SuggestedTest {
  testName: string;
  note: string;
}

export type DrugInteractionSeverity = "CRITICAL" | "MODERATE" | "MINOR" | "SAFE";

export interface DrugInteractionItem {
  medicinePair: [string, string];
  severity: DrugInteractionSeverity;
  summary: string;
  mechanism: string;
  clinicalRecommendation: string;
}

export interface FoodDietaryWarning {
  medicine: string;
  foodOrDrink: string;
  warning: string;
}

export interface SpecialPrecaution {
  condition: string;
  affectedMedicines: string[];
  guidance: string;
}

export interface DrugSafetyMatrix {
  safetyScore: number; // 0 to 100
  overallSafetyStatus: "SAFE" | "ATTENTION_NEEDED" | "HIGH_RISK";
  keyTakeaway: string;
  interactions: DrugInteractionItem[];
  foodAndDietaryWarnings: FoodDietaryWarning[];
  specialPrecautions: SpecialPrecaution[];
}

export interface PrescriptionAnalysisResponse {
  doctorInfo: DoctorInfo;
  patientInfo: PatientInfo;
  detectedMedicines: DetectedMedicine[];
  suggestedTests: SuggestedTest[];
  hasUnreadableSections: boolean;
  overallAnalysis: string;
  disclaimer: string;
  drugSafetyMatrix?: DrugSafetyMatrix;
}

export interface DrugSafetyCheckRequest {
  medicines: string[];
  patientConditions?: string[];
  language?: "bn" | "en";
}

export interface DrugSafetyCheckResponse {
  medicinesAnalyzed: string[];
  matrix: DrugSafetyMatrix;
  disclaimer: string;
  engineUsed?: string;
}

export type LabParameterStatus = "LOW" | "NORMAL" | "HIGH" | "CRITICAL_LOW" | "CRITICAL_HIGH";
export type LabRiskLevel = "NORMAL" | "MILD" | "MODERATE" | "CRITICAL";

export interface LabParameterItem {
  parameterName: string;
  parameterNameBn: string;
  value: string;
  unit: string;
  standardRange: string;
  status: LabParameterStatus;
  riskLevel: LabRiskLevel;
  interpretationBn: string;
  actionableNoteBn: string;
}

export interface LabReportAnalysisResponse {
  labName?: string | null;
  reportDate?: string | null;
  patientName?: string | null;
  patientAgeGender?: string | null;
  testCategory: string;
  overallHealthStatus: "OPTIMAL" | "MILD_ANOMALY" | "ATTENTION_NEEDED" | "CRITICAL_ALERT";
  parameters: LabParameterItem[];
  abnormalParametersCount: number;
  criticalFlagsCount: number;
  clinicalSummaryBn: string;
  dietaryAndLifestyleTipsBn: string[];
  recommendedDoctorSpecialist: string;
  urgencyLevel: "ROUTINE" | "PROMPT_CONSULTATION" | "IMMEDIATE_EMERGENCY";
  suggestedNextTests: string[];
  disclaimer: string;
}

