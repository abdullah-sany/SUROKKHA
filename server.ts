import express from "express";
import path from "path";
import multer from "multer";
import { z } from "zod";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import Groq from "groq-sdk";
import { createServer as createViteServer } from "vite";
import fs from "fs";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  storage: multer.memoryStorage()
});

// Configure Gemini Primary Engine
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[GEMINI ENGINE] GEMINI_API_KEY environment variable is missing.");
  } else {
    ai = new GoogleGenAI({ apiKey });
    console.log("[GEMINI ENGINE] Google Gemini AI initialized successfully.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client", error);
}

// Configure Groq Clinical Health Engine (High-speed LPU Clinical Reasoning)
let groq: Groq | null = null;
const GROQ_CANDIDATE_MODELS = [
  process.env.GROQ_MODEL,
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant"
].filter(Boolean) as string[];

let activeGroqModel: string | null = null;

try {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (groqApiKey) {
    groq = new Groq({ apiKey: groqApiKey });
    console.log("[GROQ HEALTH ENGINE] Groq Clinical AI initialized successfully.");
  } else {
    console.log("[GROQ HEALTH ENGINE] GROQ_API_KEY not configured. Running in Gemini single-engine mode.");
  }
} catch (error) {
  console.error("Failed to initialize Groq Client", error);
}

// Dedicated helper to call Groq Clinical Health Engine with intelligent dynamic fallback
async function callGroqHealthEngine(params: {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  model?: string;
}): Promise<{ content: string; modelUsed: string }> {
  if (!groq) {
    throw new Error("Groq Clinical Engine is not configured (missing GROQ_API_KEY).");
  }
  const { systemPrompt, userPrompt, temperature = 0.1, model } = params;

  // Groq requires the word 'json' in messages when response_format is json_object
  const safeSystemPrompt = systemPrompt.toLowerCase().includes("json")
    ? systemPrompt
    : `${systemPrompt}\nReturn pure JSON only.`;

  const safeUserPrompt = userPrompt.toLowerCase().includes("json")
    ? userPrompt
    : `${userPrompt}\nReturn strictly valid JSON only.`;

  const modelsToTry = model
    ? [model]
    : activeGroqModel
    ? [activeGroqModel, ...GROQ_CANDIDATE_MODELS.filter(m => m !== activeGroqModel)]
    : GROQ_CANDIDATE_MODELS;

  let lastGroqError: any = null;

  for (const candidateModel of modelsToTry) {
    try {
      console.log(`[GROQ HEALTH ENGINE] Executing clinical inference with model: ${candidateModel}...`);
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: safeSystemPrompt },
          { role: "user", content: safeUserPrompt }
        ],
        model: candidateModel,
        temperature,
        response_format: { type: "json_object" }
      });

      const content = chatCompletion.choices[0]?.message?.content;
      if (content) {
        activeGroqModel = candidateModel;
        console.log(`[GROQ HEALTH ENGINE] Clinical inference completed successfully using ${candidateModel}.`);
        return { content, modelUsed: candidateModel };
      }
    } catch (err: any) {
      lastGroqError = err;
      console.warn(`[GROQ HEALTH ENGINE] Candidate model ${candidateModel} failed: ${err.message}. Trying next candidate...`);
    }
  }

  throw lastGroqError || new Error("All candidate models for Groq Clinical Health Engine failed.");
}

// Groq Clinical Symptom Triage Runner
async function analyzeSymptomsWithGroq(situationText: string, language: "bn" | "en") {
  const isBn = language === "bn";
  const systemPrompt = `You are SUROKKHA AI (সুরক্ষায় এআই) Clinical Health Engine, powered by high-speed specialized clinical triage protocols.
You help users understand:
- General urgency and safety level ("GREEN", "YELLOW", "ORANGE", "RED")
- Appropriate healthcare level & care guidance
- Suggested medical specialists with clear rationale
- Critical warning signs / red flags
- Emergency escalation requirements

STRICT CLINICAL RULES:
1. Never diagnose a specific disease as absolute certainty.
2. Never prescribe medication or dosages.
3. If warning signs suggest possible emergency (e.g. crushing chest pain, radiating arm/jaw pain, sudden facial drooping or arm weakness, severe shortness of breath, anaphylaxis, severe head injury), set safetyLevel to "RED" and emergencyEscalation.required to true with urgent emergency instructions (Call 999 or 16263 in Bangladesh, seek emergency medical care immediately).
4. Output MUST be valid JSON strictly matching the schema:
{
  "language": "${language}",
  "safetyLevel": "GREEN" | "YELLOW" | "ORANGE" | "RED",
  "summary": "Clear, empathetic clinical summary in ${isBn ? 'Bengali (বাংলা)' : 'English'}",
  "careGuidance": "Care level guidance and immediate self-care advice in ${isBn ? 'Bengali (বাংলা)' : 'English'}",
  "suggestedSpecialists": [
    { "name": "Specialist category name", "reason": "Specific clinical reason in ${isBn ? 'Bengali' : 'English'}" }
  ],
  "warningSigns": ["Red flag warning sign 1", "Red flag warning sign 2"],
  "emergencyEscalation": {
    "required": true,
    "message": "Emergency instructions in ${isBn ? 'Bengali' : 'English'}"
  },
  "importantNotes": ["Clinical precautions or doctor consultation notes in ${isBn ? 'Bengali' : 'English'}"]
}`;

  const userPrompt = `Patient situation description:
"${situationText}"

Respond in ${isBn ? "Bengali (বাংলা)" : "English"}. Return pure JSON only.`;

  const { content: rawJson, modelUsed } = await callGroqHealthEngine({ systemPrompt, userPrompt, temperature: 0.1 });
  const parsed = JSON.parse(rawJson);
  const validated = responseSchema.safeParse(parsed);
  const engineLabel = `Groq Health Engine (${modelUsed.replace('openai/', '')})`;
  if (!validated.success) {
    console.error("Groq symptom validation warning:", validated.error);
    return {
      language: parsed.language || language,
      safetyLevel: parsed.safetyLevel || "YELLOW",
      summary: parsed.summary || "",
      careGuidance: parsed.careGuidance || "",
      suggestedSpecialists: Array.isArray(parsed.suggestedSpecialists) ? parsed.suggestedSpecialists : [],
      warningSigns: Array.isArray(parsed.warningSigns) ? parsed.warningSigns : [],
      emergencyEscalation: parsed.emergencyEscalation || { required: false, message: "" },
      importantNotes: Array.isArray(parsed.importantNotes) ? parsed.importantNotes : [],
      engineUsed: engineLabel
    };
  }
  return {
    ...validated.data,
    engineUsed: engineLabel
  };
}

// Groq Clinical Pharmacovigilance & Drug Interaction Runner
async function checkDrugSafetyWithGroq(params: {
  medicines: string[];
  patientConditions: string[];
  language: "bn" | "en";
}) {
  const { medicines, patientConditions, language } = params;
  const isBn = language === "bn";
  const systemPrompt = `You are the Senior Clinical Pharmacologist and Patient Safety AI Engine for "SUROKKHA AI" (সুরক্ষায় এআই).
Perform a comprehensive Polypharmacy, Drug-Drug Interaction (DDI), and Patient Safety Analysis for the requested medications.

You must return strictly valid JSON matching this schema:
{
  "safetyScore": number between 0 and 100,
  "overallSafetyStatus": "SAFE" | "ATTENTION_NEEDED" | "HIGH_RISK",
  "keyTakeaway": "Concise high-level safety takeaway in ${isBn ? 'Bengali (বাংলা)' : 'English'}",
  "interactions": [
    {
      "medicinePair": ["Medicine 1", "Medicine 2"],
      "severity": "CRITICAL" | "MODERATE" | "MINOR" | "SAFE",
      "summary": "Clinical summary in ${isBn ? 'Bengali (বাংলা)' : 'English'}",
      "mechanism": "Pharmacological mechanism in ${isBn ? 'Bengali (বাংলা)' : 'English'}",
      "clinicalRecommendation": "Actionable advice (spacing, meal timing, monitoring) in ${isBn ? 'Bengali (বাংলা)' : 'English'}"
    }
  ],
  "foodAndDietaryWarnings": [
    {
      "medicine": "Medicine Name",
      "foodOrDrink": "Food or Drink (e.g. Milk/Dairy, Grapefruit, Alcohol, Caffeine)",
      "warning": "Explanation of interaction and dietary protocol in ${isBn ? 'Bengali (বাংলা)' : 'English'}"
    }
  ],
  "specialPrecautions": [
    {
      "condition": "Health Condition (e.g. Hypertension, Gastritis, Diabetes, CKD, Pregnancy, Liver Impairment)",
      "affectedMedicines": ["Medicine Name"],
      "guidance": "Clinical advice and precautions in ${isBn ? 'Bengali (বাংলা)' : 'English'}"
    }
  ],
  "disclaimer": "সতর্কতা: এটি সুরক্ষায় এআই (SUROKKHA AI) দ্বারা প্রস্তুতকৃত ক্লিনিক্যাল ড্রাগ ইন্টারঅ্যাকশন বিশ্লেষণ। ওষুধের কোনো ডোজ পরিবর্তন করার পূর্বে অবশ্যই আপনার রেজিস্টার্ড চিকিৎসক বা ফার্মাসিস্টের পরামর্শ গ্রহণ করুন।"
}`;

  const userPrompt = `Medications to evaluate:
${medicines.map((m, idx) => `${idx + 1}. ${m}`).join("\n")}

${patientConditions && patientConditions.length > 0 ? `Patient's Existing Health Conditions:\n${patientConditions.join(", ")}` : "No specific pre-existing conditions reported."}

Respond in ${isBn ? "Bengali (বাংলা)" : "English"}. Return pure JSON only.`;

  const { content: rawJson, modelUsed } = await callGroqHealthEngine({ systemPrompt, userPrompt, temperature: 0.1 });
  const parsed = JSON.parse(rawJson);
  const engineLabel = `Groq Health Engine (${modelUsed.replace('openai/', '')})`;
  return {
    ...parsed,
    engineUsed: engineLabel
  };
}

// Helper to validate and return supported Gemini models based on SDK guidelines
function getValidGeminiModel(name?: string): string {
  if (
    !name ||
    name.includes("1.5") ||
    name.includes("2.0") ||
    name.includes("3.5-flash") ||
    name.includes("2.5-flash")
  ) {
    return "gemini-3.8-flash";
  }
  return name;
}

// Helper to call Gemini with robust error handling, exponential backoff retry, and multi-model failover (carousel fallback)
async function callGeminiWithRetry(params: {
  model: string;
  contents: any;
  config?: any;
  retries?: number;
  delay?: number;
}): Promise<any> {
  const { model, contents, config, delay = 800 } = params;
  
  if (!ai) {
    throw new Error("Gemini AI client is not initialized.");
  }

  // Fast failover: If Groq is active, don't delay user with long retries
  const retries = params.retries ?? (groq ? 1 : 2);
  // Modern, valid Gemini active models from official SDK rules
  const supportedFallbackModels = [
    "gemini-3.8-flash",
    "gemini-3.1-pro-preview",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest"
  ];
  
  // Sanitize requested model
  const primaryModel = getValidGeminiModel(model);
  const modelOrder = Array.from(new Set([primaryModel, ...supportedFallbackModels]));
  
  let lastError: any = null;
  
  for (const activeModel of modelOrder) {
    let currentDelay = delay;
    console.log(`[GEMINI CALL] Attempting with model: ${activeModel}`);
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await ai.models.generateContent({
          model: activeModel,
          contents,
          config
        });
        console.log(`[GEMINI SUCCESS] Succeeded with model: ${activeModel}`);
        return response;
      } catch (error: any) {
        lastError = error;
        console.warn(`[GEMINI MODEL ERROR] ${activeModel} failed with: ${error?.message || error?.status || error}`);
        
        const isTransient = error.status === 503 || error.status === 429 || 
          error.message?.includes("UNAVAILABLE") || error.message?.includes("RESOURCE_EXHAUSTED") || 
          error.message?.includes("high demand") || error.message?.includes("quota") || error.status === "UNAVAILABLE";
          
        if (isTransient) {
          if (i < retries - 1) {
            console.warn(`[GEMINI RETRY] Model ${activeModel} failed (status: ${error.status}). Retrying in ${currentDelay}ms... (Attempt ${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, currentDelay));
            currentDelay *= 2; // Exponential backoff
          } else {
            console.warn(`[GEMINI FAILOVER] Model ${activeModel} exhausted all retries. Falling back to next model in cascade...`);
            break;
          }
        } else {
          // If model is not found (404) or invalid argument, immediately failover to next supported model
          break;
        }
      }
    }
  }
  
  // If we exhausted all models and all retries, throw the last seen error
  throw lastError || new Error("All AI models in cascade failed to respond.");
}

// Zod Schema for input validation
const analyzeSchema = z.object({
  situationText: z.string().min(1, "Please provide a description of your concern."),
  language: z.preprocess(
    (val) => (val === "bengali" || val === "bn" ? "bn" : "en"),
    z.enum(["en", "bn"])
  ).optional().default("en"),
  preferredEngine: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const lower = val.toLowerCase();
        if (lower === "groq") return "groq";
        if (lower === "gemini") return "gemini";
      }
      return "auto";
    },
    z.enum(["auto", "gemini", "groq"])
  ).optional().default("auto"),
});

const responseSchema = z.object({
  language: z.enum(["bn", "en"]),
  safetyLevel: z.enum(["GREEN", "YELLOW", "ORANGE", "RED"]),
  summary: z.string(),
  careGuidance: z.string(),
  suggestedSpecialists: z.array(z.object({
    name: z.string(),
    reason: z.string()
  })),
  warningSigns: z.array(z.string()),
  emergencyEscalation: z.object({
    required: z.boolean(),
    message: z.string()
  }),
  importantNotes: z.array(z.string())
});

app.post("/api/specialist-guide/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!ai && !groq) {
      return res.status(503).json({ error: "The AI service is temporarily unavailable. Please try again later." });
    }

    const parseResult = analyzeSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues[0]?.message || "Invalid input data" });
    }

    const { situationText, language, preferredEngine } = parseResult.data;

    // Fast-path: If user selected Groq or if Gemini is unavailable (text-only queries)
    if (!req.file && groq && (preferredEngine === "groq" || !ai)) {
      console.log(`[HEALTH ENGINE] Routing text triage directly to Groq Clinical Health Engine (preference: ${preferredEngine}).`);
      try {
        const groqResult = await analyzeSymptomsWithGroq(situationText, language);
        return res.json(groqResult);
      } catch (groqErr) {
        console.warn("[HEALTH ENGINE] Groq direct failed, attempting Gemini fallback...", groqErr);
        if (!ai) throw groqErr;
      }
    }

    const model = getValidGeminiModel(process.env.GEMINI_MODEL);

    const prompt = `
You are a cautious AI-powered healthcare navigation assistant for SUROKKHA AI.
You help users understand:
- General urgency
- Appropriate healthcare level
- Healthcare professional categories that may be relevant
- Important warning signs

STRICT RULES:
1. Never diagnose.
2. Never claim certainty.
3. Never prescribe medication.
4. Never provide medication dosage.
5. Never recommend starting or stopping medication.
6. Never claim an image confirms a disease.
7. Prefer cautious language.
8. If information is incomplete, acknowledge uncertainty.
9. If warning signs suggest possible emergency, prioritize emergency guidance.
10. Recommend healthcare professional categories only.
11. Do not invent medical facts.
12. Respond in the dominant language of the user (or the language specified).
13. Use clear, understandable language.
14. Return structured JSON only.

User Information:
"${situationText}"

Respond in ${language === 'bn' ? 'Bangla' : 'English'}.
`;

    const contents: any[] = [
      {
        role: "user",
        parts: [
          { text: prompt }
        ]
      }
    ];

    if (req.file) {
      contents[0].parts.push({
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype
        }
      });
    }

    const genAiSchema = {
      type: Type.OBJECT,
      properties: {
        language: { type: Type.STRING, enum: ["bn", "en"] },
        safetyLevel: { type: Type.STRING, enum: ["GREEN", "YELLOW", "ORANGE", "RED"] },
        summary: { type: Type.STRING },
        careGuidance: { type: Type.STRING },
        suggestedSpecialists: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["name", "reason"]
          }
        },
        warningSigns: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        emergencyEscalation: {
          type: Type.OBJECT,
          properties: {
            required: { type: Type.BOOLEAN },
            message: { type: Type.STRING }
          },
          required: ["required", "message"]
        },
        importantNotes: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: [
        "language",
        "safetyLevel",
        "summary",
        "careGuidance",
        "suggestedSpecialists",
        "warningSigns",
        "emergencyEscalation",
        "importantNotes"
      ]
    };

    try {
      const response = await callGeminiWithRetry({
        model,
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: genAiSchema
        }
      });

      if (!response.text) {
        throw new Error("Empty response from AI");
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response.text);
      } catch (e) {
        throw new Error("Failed to parse AI response as JSON");
      }

      const validatedResponse = responseSchema.safeParse(parsedResponse);
      if (!validatedResponse.success) {
        console.error("Schema validation failed", validatedResponse.error);
        throw new Error("AI produced an invalid structured response. Please try again.");
      }

      res.json({
        ...validatedResponse.data,
        engineUsed: "Google Gemini 3.8 Flash (Primary)"
      });
    } catch (geminiError: any) {
      // Seamless Failover to Groq Clinical Health Engine if text-only request
      if (!req.file && groq) {
        console.warn(`[DUAL ENGINE FAILOVER] Gemini unavailable (${geminiError?.message || geminiError}). Falling back to Groq Clinical Health Engine...`);
        const groqResult = await analyzeSymptomsWithGroq(situationText, language);
        return res.json(groqResult);
      }
      throw geminiError;
    }
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "The AI service encountered an error. Please try again later." });
  }
});

app.post("/api/specialist-guide/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: "The AI service is temporarily unavailable." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided." });
    }

    const audioPart = {
      inlineData: {
        mimeType: req.file.mimetype,
        data: req.file.buffer.toString("base64")
      }
    };

    const response = await callGeminiWithRetry({
      model: "gemini-3.5-transcribe",
      contents: { parts: [audioPart, { text: "Transcribe this audio. Return only the transcription, nothing else." }] }
    });

    res.json({ text: response.text?.trim() || "" });
  } catch (error: any) {
    console.error("Transcription Error:", error);
    res.status(500).json({ error: "Failed to transcribe audio." });
  }
});

// Drug Interaction & Safety Matrix Zod Schemas
const drugInteractionItemZodSchema = z.object({
  medicinePair: z.tuple([z.string(), z.string()]),
  severity: z.enum(["CRITICAL", "MODERATE", "MINOR", "SAFE"]),
  summary: z.string(),
  mechanism: z.string(),
  clinicalRecommendation: z.string(),
});

const foodDietaryWarningZodSchema = z.object({
  medicine: z.string(),
  foodOrDrink: z.string(),
  warning: z.string(),
});

const specialPrecautionZodSchema = z.object({
  condition: z.string(),
  affectedMedicines: z.array(z.string()),
  guidance: z.string(),
});

const drugSafetyMatrixZodSchema = z.object({
  safetyScore: z.number().min(0).max(100),
  overallSafetyStatus: z.enum(["SAFE", "ATTENTION_NEEDED", "HIGH_RISK"]),
  keyTakeaway: z.string(),
  interactions: z.array(drugInteractionItemZodSchema).default([]),
  foodAndDietaryWarnings: z.array(foodDietaryWarningZodSchema).default([]),
  specialPrecautions: z.array(specialPrecautionZodSchema).default([]),
});

// Prescription OCR & Analysis Zod Schema
const prescriptionResponseZodSchema = z.object({
  doctorInfo: z.object({
    name: z.string().nullable().optional(),
    specialty: z.string().nullable().optional(),
  }),
  patientInfo: z.object({
    name: z.string().nullable().optional(),
    age: z.string().nullable().optional(),
    date: z.string().nullable().optional(),
  }),
  detectedMedicines: z.array(
    z.object({
      rawTextFound: z.string().default(""),
      possibleName: z.string(),
      confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
      dosage: z.string().default(""),
      timing: z.string().default(""),
      duration: z.string().default(""),
      purpose: z.string().default(""),
    })
  ).default([]),
  suggestedTests: z.array(
    z.object({
      testName: z.string(),
      note: z.string().default(""),
    })
  ).default([]),
  hasUnreadableSections: z.boolean().default(false),
  overallAnalysis: z.string(),
  disclaimer: z.string(),
  drugSafetyMatrix: drugSafetyMatrixZodSchema.optional().nullable(),
});

app.post("/api/prescription/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: "The AI service is temporarily unavailable. Please try again later." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "অনুগ্রহ করে প্রেসক্রিপশনের একটি ছবি আপলোড করুন (Please upload an image of the prescription)." });
    }

    const additionalNotes = req.body?.notes || "";

    const prompt = `
You are an expert AI Medical Specialist and OCR Processor for "SUROKKHA AI" (সুরক্ষায় এআই), an intelligent healthcare ecosystem. Your primary task is to read, transcribe, and analyze doctor prescriptions (both handwritten and printed) from images.

### Objectives:
1. Extract all readable details: Doctor details, Patient details, Medicines, Dosage, Duration, Instructions, and Suggested Clinical Tests.
2. Translate complex medical terms and instructions into clear, empathetic Bengali (বাংলা).
3. Evaluate reading confidence. NEVER guess or hallucinate an unreadable medicine name.
4. Comprehensive Drug Interaction & Safety Matrix:
   - If medicines are detected, evaluate drug-drug interactions (DDI) across all detected medicines.
   - For every pairwise combination with clinical relevance, assign severity: "CRITICAL" (dangerous combo like high bleeding or arrhythmia risk), "MODERATE" (needs spacing or dose adjustment), "MINOR" (mild interaction), or "SAFE" (no known significant interaction).
   - Write clear summaries and clinical recommendations in Bengali (e.g. keeping 2 hours gap, taking with meals, monitoring for specific side effects).
   - Detail critical Food & Dietary warnings (e.g. avoiding calcium/milk with certain antibiotics, empty stomach protocols, avoiding grapefruit, tea/coffee or NSAID timing).
   - Detail Special Precautions for common conditions (e.g. Hypertension, Gastritis, Diabetes, Renal/Liver care, Pregnancy).
   - Assign an overall clinical Safety Score (0 to 100) and overallSafetyStatus ("SAFE", "ATTENTION_NEEDED", "HIGH_RISK").

### Strict Safety & Accuracy Rules:
- Medicine Names: Keep standard English spelling for medicine/drug names to avoid misinterpretation (e.g., "Tab. Napa Extra 500mg/65mg", "Cap. Seclo 20mg", "Tab. Monas 10mg", "Syp. Tofen").
- Ambiguity/Unclear Text: If any medicine or dosage is blurry or ambiguous, set "confidence" to "LOW", label the name as "অস্পষ্ট/Unclear", and provide an explicit warning in the purpose/note.
- Dosage Translation: Convert dosage shorthand into easy Bengali (e.g., "1+0+1 after food" -> "১+০+১ (সকালে ও রাতে, খাওয়ার পর)", "1+1+1" -> "১+১+১ (সকালে, দুপুরে ও রাতে)", "0+0+1 before sleep" -> "০+০+১ (রাতে শোবার আগে)", "1/2 tab" -> "আধা (১/২) ট্যাবলেট").
- Safety Disclaimer: Always attach the standard SUROKKHA AI medical disclaimer:
"সতর্কতা: এটি সুরক্ষায় এআই (SUROKKHA AI) দ্বারা প্রস্তুতকৃত একটি কম্পিউটার-জেনারেটেড রূপান্তর। ভুল ওষুধ সেবন রোধে ওষুধ কেনার আগে অবশ্যই রেজিস্টার্ড ফার্মাসিস্ট বা ডাক্তারের কাছে প্রেসক্রিপশনটি মিলিয়ে নিন।"

${additionalNotes ? `Additional Patient / User Notes: "${additionalNotes}"` : ""}

Output must be strictly valid JSON according to the schema.
`;

    const contents: any[] = [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: req.file.buffer.toString("base64"),
              mimeType: req.file.mimetype
            }
          }
        ]
      }
    ];

    const genAiSchema = {
      type: Type.OBJECT,
      properties: {
        doctorInfo: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, nullable: true },
            specialty: { type: Type.STRING, nullable: true }
          },
          required: ["name", "specialty"]
        },
        patientInfo: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, nullable: true },
            age: { type: Type.STRING, nullable: true },
            date: { type: Type.STRING, nullable: true }
          },
          required: ["name", "age", "date"]
        },
        detectedMedicines: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              rawTextFound: { type: Type.STRING },
              possibleName: { type: Type.STRING },
              confidence: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
              dosage: { type: Type.STRING },
              timing: { type: Type.STRING },
              duration: { type: Type.STRING },
              purpose: { type: Type.STRING }
            },
            required: ["rawTextFound", "possibleName", "confidence", "dosage", "timing", "duration", "purpose"]
          }
        },
        suggestedTests: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              testName: { type: Type.STRING },
              note: { type: Type.STRING }
            },
            required: ["testName", "note"]
          }
        },
        hasUnreadableSections: { type: Type.BOOLEAN },
        overallAnalysis: { type: Type.STRING },
        disclaimer: { type: Type.STRING },
        drugSafetyMatrix: {
          type: Type.OBJECT,
          properties: {
            safetyScore: { type: Type.NUMBER },
            overallSafetyStatus: { type: Type.STRING, enum: ["SAFE", "ATTENTION_NEEDED", "HIGH_RISK"] },
            keyTakeaway: { type: Type.STRING },
            interactions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medicinePair: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  severity: { type: Type.STRING, enum: ["CRITICAL", "MODERATE", "MINOR", "SAFE"] },
                  summary: { type: Type.STRING },
                  mechanism: { type: Type.STRING },
                  clinicalRecommendation: { type: Type.STRING }
                },
                required: ["medicinePair", "severity", "summary", "mechanism", "clinicalRecommendation"]
              }
            },
            foodAndDietaryWarnings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medicine: { type: Type.STRING },
                  foodOrDrink: { type: Type.STRING },
                  warning: { type: Type.STRING }
                },
                required: ["medicine", "foodOrDrink", "warning"]
              }
            },
            specialPrecautions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  affectedMedicines: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  guidance: { type: Type.STRING }
                },
                required: ["condition", "affectedMedicines", "guidance"]
              }
            }
          },
          required: ["safetyScore", "overallSafetyStatus", "keyTakeaway", "interactions", "foodAndDietaryWarnings", "specialPrecautions"]
        }
      },
      required: [
        "doctorInfo",
        "patientInfo",
        "detectedMedicines",
        "suggestedTests",
        "hasUnreadableSections",
        "overallAnalysis",
        "disclaimer"
      ]
    };

    const model = "gemini-3.8-flash";
    const response = await callGeminiWithRetry({
      model,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: genAiSchema
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI for prescription OCR");
    }

    let parsed;
    try {
      parsed = JSON.parse(response.text);
    } catch (err) {
      console.error("JSON parse error:", response.text);
      throw new Error("Failed to parse prescription OCR response as JSON");
    }

    const validated = prescriptionResponseZodSchema.safeParse(parsed);
    if (!validated.success) {
      console.error("Prescription schema validation error:", validated.error);
      // Ensure required fallback disclaimer
      return res.json({
        ...parsed,
        disclaimer: parsed.disclaimer || "সতর্কতা: এটি সুরক্ষায় এআই (SUROKKHA AI) দ্বারা প্রস্তুতকৃত একটি কম্পিউটার-জেনারেটেড রূপান্তর। ভুল ওষুধ সেবন রোধে ওষুধ কেনার আগে অবশ্যই রেজিস্টার্ড ফার্মাসিস্ট বা ডাক্তারের কাছে প্রেসক্রিপশনটি মিলিয়ে নিন।"
      });
    }

    res.json(validated.data);
  } catch (error: any) {
    console.error("Prescription Analysis Error:", error);
    res.status(500).json({ 
      error: isNaN(error?.message) && error?.message ? error.message : "প্রেসক্রিপশনটি প্রসেস করার সময় সমস্যা হয়েছে। অনুগ্রহ করে পরিষ্কার ছবি দিয়ে আবার চেষ্টা করুন।" 
    });
  }
});

// Dedicated Drug Safety & Drug-Drug Interaction Checker Schema & Route
const drugSafetyCheckInputZodSchema = z.object({
  medicines: z.array(z.string().min(1)).min(2, "কমপক্ষে ২টি ওষুধের নাম প্রদান করুন (Please enter at least 2 medicines)"),
  patientConditions: z.array(z.string()).optional().default([]),
  language: z.enum(["bn", "en"]).optional().default("bn"),
  preferredEngine: z.enum(["auto", "gemini", "groq"]).optional().default("auto")
});

app.post("/api/drug-safety/check", async (req, res) => {
  try {
    if (!ai && !groq) {
      return res.status(503).json({ error: "The AI service is temporarily unavailable. Please try again later." });
    }

    const validation = drugSafetyCheckInputZodSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: validation.error.issues[0]?.message || "Invalid input data" 
      });
    }

    const { medicines, patientConditions, language, preferredEngine } = validation.data;

    // Fast-path: If user requested Groq or if Gemini is not initialized
    if (groq && (preferredEngine === "groq" || !ai)) {
      console.log(`[HEALTH ENGINE] Processing Drug Safety Check directly via Groq Clinical Health Engine (preference: ${preferredEngine})...`);
      try {
        const groqData = await checkDrugSafetyWithGroq({ medicines, patientConditions, language });
        return res.json({
          medicinesAnalyzed: medicines,
          matrix: {
            safetyScore: groqData.safetyScore,
            overallSafetyStatus: groqData.overallSafetyStatus,
            keyTakeaway: groqData.keyTakeaway,
            interactions: groqData.interactions,
            foodAndDietaryWarnings: groqData.foodAndDietaryWarnings,
            specialPrecautions: groqData.specialPrecautions
          },
          disclaimer: groqData.disclaimer || "সতর্কতা: এটি সুরক্ষায় এআই (SUROKKHA AI) দ্বারা প্রস্তুতকৃত ক্লিনিক্যাল ড্রাগ ইন্টারঅ্যাকশন বিশ্লেষণ। ওষুধের কোনো ডোজ পরিবর্তন করার পূর্বে অবশ্যই আপনার রেজিস্টার্ড চিকিৎসক বা ফার্মাসিস্টের পরামর্শ গ্রহণ করুন।",
          engineUsed: groqData.engineUsed || "Groq Clinical Health Engine"
        });
      } catch (groqErr) {
        console.warn("[HEALTH ENGINE] Groq direct drug safety failed, falling back to Gemini...", groqErr);
        if (!ai) throw groqErr;
      }
    }

    const isBn = language === "bn";

    const prompt = `
You are a Senior Clinical Pharmacologist and Patient Safety AI for "SUROKKHA AI" (সুরক্ষায় এআই).
Perform a comprehensive Polypharmacy, Drug-Drug Interaction (DDI), and Clinical Safety Analysis for the following medications:

Medications list:
${medicines.map((m, idx) => `${idx + 1}. ${m}`).join("\n")}

${patientConditions && patientConditions.length > 0 ? `Patient's Existing Health Conditions:\n${patientConditions.join(", ")}` : "No specific pre-existing conditions reported."}

### Objectives:
1. Examine all pairwise combinations of the specified medicines.
2. Assign each pairwise interaction one of four clinical severities:
   - "CRITICAL": High hazard of severe adverse event (e.g. fatal bleeding, severe QT prolongation, severe toxicity, profound hypotension).
   - "MODERATE": Clinically significant interaction requiring dose adjustment, separate administration intervals (e.g. 2-4 hours apart), or clinical monitoring.
   - "MINOR": Mild or theoretical interaction with minimal clinical consequence.
   - "SAFE": No known adverse interaction; safe to take concurrently.
3. Write clear summaries, pharmacological mechanisms, and actionable patient recommendations in ${isBn ? "Bengali (বাংলা)" : "English"}.
4. Provide critical Food & Dietary Warnings for each medicine (e.g. dairy/calcium, grapefruit/citrus, caffeine, empty stomach requirements, alcohol).
5. Highlight Special Precautions for vulnerable conditions (Hypertension, Diabetes, Chronic Kidney Disease, Gastric Ulcer, Pregnancy, Liver impairment).
6. Calculate an overall clinical Safety Score between 0 and 100:
   - 80-100: "SAFE" (minimal or no adverse interactions)
   - 50-79: "ATTENTION_NEEDED" (spacing or doctor monitoring needed)
   - 0-49: "HIGH_RISK" (critical contraindication detected)

Provide a key takeaway summary and the standard SUROKKHA AI safety disclaimer.
Return strictly valid JSON adhering to the schema.
`;

    const genAiSafetySchema = {
      type: Type.OBJECT,
      properties: {
        safetyScore: { type: Type.NUMBER },
        overallSafetyStatus: { type: Type.STRING, enum: ["SAFE", "ATTENTION_NEEDED", "HIGH_RISK"] },
        keyTakeaway: { type: Type.STRING },
        interactions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              medicinePair: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              severity: { type: Type.STRING, enum: ["CRITICAL", "MODERATE", "MINOR", "SAFE"] },
              summary: { type: Type.STRING },
              mechanism: { type: Type.STRING },
              clinicalRecommendation: { type: Type.STRING }
            },
            required: ["medicinePair", "severity", "summary", "mechanism", "clinicalRecommendation"]
          }
        },
        foodAndDietaryWarnings: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              medicine: { type: Type.STRING },
              foodOrDrink: { type: Type.STRING },
              warning: { type: Type.STRING }
            },
            required: ["medicine", "foodOrDrink", "warning"]
          }
        },
        specialPrecautions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              condition: { type: Type.STRING },
              affectedMedicines: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              guidance: { type: Type.STRING }
            },
            required: ["condition", "affectedMedicines", "guidance"]
          }
        },
        disclaimer: { type: Type.STRING }
      },
      required: [
        "safetyScore",
        "overallSafetyStatus",
        "keyTakeaway",
        "interactions",
        "foodAndDietaryWarnings",
        "specialPrecautions",
        "disclaimer"
      ]
    };

    try {
      const response = await callGeminiWithRetry({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: genAiSafetySchema
        }
      });

      if (!response.text) {
        throw new Error("Empty response from AI for drug safety analysis");
      }

      const parsed = JSON.parse(response.text);
      res.json({
        medicinesAnalyzed: medicines,
        matrix: {
          safetyScore: parsed.safetyScore,
          overallSafetyStatus: parsed.overallSafetyStatus,
          keyTakeaway: parsed.keyTakeaway,
          interactions: parsed.interactions,
          foodAndDietaryWarnings: parsed.foodAndDietaryWarnings,
          specialPrecautions: parsed.specialPrecautions
        },
        disclaimer: parsed.disclaimer || "সতর্কতা: এটি সুরক্ষায় এআই (SUROKKHA AI) দ্বারা প্রস্তুতকৃত ক্লিনিক্যাল ড্রাগ ইন্টারঅ্যাকশন বিশ্লেষণ। ওষুধের কোনো ডোজ পরিবর্তন করার পূর্বে অবশ্যই আপনার রেজিস্টার্ড চিকিৎসক বা ফার্মাসিস্টের পরামর্শ গ্রহণ করুন।",
        engineUsed: "Google Gemini 3.8 Flash (Primary)"
      });
    } catch (geminiError: any) {
      if (groq) {
        console.warn(`[DUAL ENGINE FAILOVER] Gemini Drug Safety Check failed (${geminiError?.message || geminiError}). Falling back to Groq Clinical Health Engine...`);
        const groqData = await checkDrugSafetyWithGroq({ medicines, patientConditions, language });
        return res.json({
          medicinesAnalyzed: medicines,
          matrix: {
            safetyScore: groqData.safetyScore,
            overallSafetyStatus: groqData.overallSafetyStatus,
            keyTakeaway: groqData.keyTakeaway,
            interactions: groqData.interactions,
            foodAndDietaryWarnings: groqData.foodAndDietaryWarnings,
            specialPrecautions: groqData.specialPrecautions
          },
          disclaimer: groqData.disclaimer || "সতর্কতা: এটি সুরক্ষায় এআই (SUROKKHA AI) দ্বারা প্রস্তুতকৃত ক্লিনিক্যাল ড্রাগ ইন্টারঅ্যাকশন বিশ্লেষণ। ওষুধের কোনো ডোজ পরিবর্তন করার পূর্বে অবশ্যই আপনার রেজিস্টার্ড চিকিৎসক বা ফার্মাসিস্টের পরামর্শ গ্রহণ করুন।",
          engineUsed: groqData.engineUsed || "Groq Clinical Health Engine"
        });
      }
      throw geminiError;
    }
  } catch (error: any) {
    console.error("Drug Safety Check Error:", error);
    res.status(500).json({ 
      error: "ওষুধের পারস্পরিক প্রতিক্রিয়া বিশ্লেষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে কিছু সময় পর পুনরায় চেষ্টা করুন।" 
    });
  }
});

// Dual Clinical Health Engine Status
app.get("/api/health-engine/status", (req, res) => {
  res.json({
    geminiActive: !!ai,
    groqActive: !!groq,
    hybridEnabled: !!(ai && groq),
    primaryEngine: ai ? "Google Gemini 3.8 Flash (Multimodal Vision & Triage)" : null,
    secondaryEngine: groq ? `Groq Clinical Health Engine (${activeGroqModel ? activeGroqModel.replace('openai/', '') : 'Active LPU'})` : null,
    architecture: "SUROKKHA Dual Clinical Fault-Tolerant Engine"
  });
});

// Lab Report & Pathology Analyzer
const labParameterItemZodSchema = z.object({
  parameterName: z.string(),
  parameterNameBn: z.string(),
  value: z.string(),
  unit: z.string().default(""),
  standardRange: z.string().default(""),
  status: z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL_LOW", "CRITICAL_HIGH"]),
  riskLevel: z.enum(["NORMAL", "MILD", "MODERATE", "CRITICAL"]),
  interpretationBn: z.string(),
  actionableNoteBn: z.string().default(""),
});

const labReportResponseZodSchema = z.object({
  labName: z.string().nullable().optional(),
  reportDate: z.string().nullable().optional(),
  patientName: z.string().nullable().optional(),
  patientAgeGender: z.string().nullable().optional(),
  testCategory: z.string(),
  overallHealthStatus: z.enum(["OPTIMAL", "MILD_ANOMALY", "ATTENTION_NEEDED", "CRITICAL_ALERT"]),
  parameters: z.array(labParameterItemZodSchema).default([]),
  abnormalParametersCount: z.number().default(0),
  criticalFlagsCount: z.number().default(0),
  clinicalSummaryBn: z.string(),
  dietaryAndLifestyleTipsBn: z.array(z.string()).default([]),
  recommendedDoctorSpecialist: z.string(),
  urgencyLevel: z.enum(["ROUTINE", "PROMPT_CONSULTATION", "IMMEDIATE_EMERGENCY"]),
  suggestedNextTests: z.array(z.string()).default([]),
  disclaimer: z.string(),
});

app.post("/api/lab-report/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: "The AI service is temporarily unavailable. Please try again later." });
    }

    const demoCaseId = req.body?.demoCaseId;
    let contents: any[] = [];

    const promptInstructions = `
You are a Senior Clinical Pathologist and Diagnostic Laboratory AI for "SUROKKHA AI" (সুরক্ষায় এআই).
Your mission is to accurately parse, extract, analyze, and interpret pathology/blood laboratory reports into clear, empathetic, and actionable Bengali (বাংলা) for patients.

### Objectives:
1. Extract Laboratory Information (Diagnostic center name, test date, patient name, age/gender).
2. Identify the Test Category (e.g. Complete Blood Count / CBC, Lipid Profile, Glycemic / Diabetic Profile, Renal Function Test / RFT, Liver Function Test / LFT, Dengue Serology, Thyroid Profile, Urine R/E).
3. Extract each test parameter with:
   - Parameter Name in English (e.g., "Hemoglobin (Hb)", "Platelet Count", "Serum Creatinine", "HbA1c", "Total Cholesterol", "SGPT / ALT")
   - Parameter Name in clear Bengali (e.g., "হিমোগ্লোবিন", "প্লাটিলেট কাউন্ট", "সিরাম ক্রিয়েটিনিন", "এইচবিএ১সি (৩ মাসের গড় সুগার)")
   - Value found in the report (as string, e.g. "8.2", "45,000", "2.4")
   - Unit (e.g. "g/dL", "cu.mm", "mg/dL", "%", "mmol/L")
   - Standard Biological Reference Range (e.g. "12.0 - 16.0", "150,000 - 450,000", "0.6 - 1.2")
   - Status: "LOW", "NORMAL", "HIGH", "CRITICAL_LOW", or "CRITICAL_HIGH" based on standard biological reference intervals.
   - Risk Level: "NORMAL", "MILD", "MODERATE", or "CRITICAL".
   - Interpretation in empathetic Bengali: Explain plainly what this value means for the patient's body and symptoms.
   - Actionable patient note in Bengali: Dietary advice, hydration, or what precautions to observe.
4. Calculate 'abnormalParametersCount' and 'criticalFlagsCount'.
5. Overall Health Status:
   - "OPTIMAL": All key parameters within normal ranges.
   - "MILD_ANOMALY": 1-2 minor deviations without immediate clinical peril.
   - "ATTENTION_NEEDED": Multiple abnormal values requiring physician consultation.
   - "CRITICAL_ALERT": Severely high or low biomarkers (e.g., platelets < 50,000, creatinine > 3.0, Hb < 7.0, blood sugar > 20 mmol/L or < 3.0 mmol/L).
6. Comprehensive Clinical Summary in Bengali: What the overall report indicates and the story it tells.
7. Dietary & Lifestyle Tips in Bengali: Concrete, culturally relevant nutritional recommendations for Bangladeshi patients.
8. Recommended Doctor Specialist: The exact medical specialist to consult (e.g., হেমাটোলজিস্ট / রক্তরোগ বিশেষজ্ঞ, এন্ডোক্রাইনোলজিস্ট / ডায়াবেটিস বিশেষজ্ঞ, নেফ্রোলজিস্ট / কিডনি বিশেষজ্ঞ, কার্ডিওলজিস্ট / হৃদরোগ বিশেষজ্ঞ).
9. Urgency Level: "ROUTINE", "PROMPT_CONSULTATION", or "IMMEDIATE_EMERGENCY".
10. Suggested Next / Confirmatory Tests.
11. Standard SUROKKHA AI Disclaimer in Bengali.

Output must be strictly valid JSON according to the schema.
`;

    if (req.file) {
      contents = [
        {
          role: "user",
          parts: [
            { text: promptInstructions },
            {
              inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: req.file.mimetype
              }
            }
          ]
        }
      ];
    } else if (demoCaseId || req.body?.reportText) {
      // Demo case or manual text
      const textToAnalyze = req.body?.reportText || `Demo Case: ${demoCaseId}`;
      contents = [
        {
          role: "user",
          parts: [
            { text: `${promptInstructions}\n\nClinical Lab Data / Report Content to analyze:\n${textToAnalyze}` }
          ]
        }
      ];
    } else {
      return res.status(400).json({ error: "অনুগ্রহ করে রক্ত পরীক্ষা বা ল্যাব রিপোর্টের একটি ছবি আপলোড করুন।" });
    }

    const genAiLabSchema = {
      type: Type.OBJECT,
      properties: {
        labName: { type: Type.STRING, nullable: true },
        reportDate: { type: Type.STRING, nullable: true },
        patientName: { type: Type.STRING, nullable: true },
        patientAgeGender: { type: Type.STRING, nullable: true },
        testCategory: { type: Type.STRING },
        overallHealthStatus: { 
          type: Type.STRING, 
          enum: ["OPTIMAL", "MILD_ANOMALY", "ATTENTION_NEEDED", "CRITICAL_ALERT"] 
        },
        parameters: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              parameterName: { type: Type.STRING },
              parameterNameBn: { type: Type.STRING },
              value: { type: Type.STRING },
              unit: { type: Type.STRING },
              standardRange: { type: Type.STRING },
              status: { 
                type: Type.STRING, 
                enum: ["LOW", "NORMAL", "HIGH", "CRITICAL_LOW", "CRITICAL_HIGH"] 
              },
              riskLevel: { 
                type: Type.STRING, 
                enum: ["NORMAL", "MILD", "MODERATE", "CRITICAL"] 
              },
              interpretationBn: { type: Type.STRING },
              actionableNoteBn: { type: Type.STRING }
            },
            required: ["parameterName", "parameterNameBn", "value", "unit", "standardRange", "status", "riskLevel", "interpretationBn", "actionableNoteBn"]
          }
        },
        abnormalParametersCount: { type: Type.NUMBER },
        criticalFlagsCount: { type: Type.NUMBER },
        clinicalSummaryBn: { type: Type.STRING },
        dietaryAndLifestyleTipsBn: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        recommendedDoctorSpecialist: { type: Type.STRING },
        urgencyLevel: { 
          type: Type.STRING, 
          enum: ["ROUTINE", "PROMPT_CONSULTATION", "IMMEDIATE_EMERGENCY"] 
        },
        suggestedNextTests: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        disclaimer: { type: Type.STRING }
      },
      required: [
        "testCategory",
        "overallHealthStatus",
        "parameters",
        "abnormalParametersCount",
        "criticalFlagsCount",
        "clinicalSummaryBn",
        "dietaryAndLifestyleTipsBn",
        "recommendedDoctorSpecialist",
        "urgencyLevel",
        "suggestedNextTests",
        "disclaimer"
      ]
    };

    const response = await callGeminiWithRetry({
      model: "gemini-3.8-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: genAiLabSchema
      }
    });

    if (!response.text) {
      throw new Error("No response from AI model for lab report analysis");
    }

    const rawJson = JSON.parse(response.text);
    const parsedData = labReportResponseZodSchema.parse(rawJson);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Lab Report Analysis Error:", error);
    res.status(500).json({ 
      error: "ল্যাব রিপোর্ট বিশ্লেষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে ছবির স্পষ্টতা যাচাই করে পুনরায় চেষ্টা করুন।" 
    });
  }
});

const medicalSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  language: z.enum(["en", "bn"]).optional().default("en"),
  context: z.string().optional()
});

app.post("/api/medical-resources/search", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: "The AI service is temporarily unavailable." });
    }

    const parseResult = medicalSearchSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues[0]?.message || "Invalid search input" });
    }

    const { query, language, context } = parseResult.data;

    const prompt = `
You are an authoritative medical resource navigator grounded with Google Search for SUROKKHA AI (Bangladesh).
The user is seeking verified, authoritative health resources, medical guidelines, pharmaceutical info, doctor access, and portal links regarding:
"${query}"

${context ? `Clinical Context / Patient Concern: ${context}` : ""}

Please search Google for authoritative, verified medical organizations, pharmaceutical indexes, digital health platforms, and clinical guidelines:
- Bangladeshi Medical, Drug & Telemedicine Portals: Medex Bangladesh (medex.com.bd - medicine & generic directory), MedEasy (medeasy.health - online doctor video consultation & prescription), Daktarbhai (daktarbhai.com - doctor appointment booking & digital health records), DGHS Bangladesh (dghs.gov.bd), ICDDR,B (icddrb.org).
- International Public Health Bodies: World Health Organization (WHO - who.int), NHS UK (nhs.uk), CDC (cdc.gov), MedlinePlus (medlineplus.gov), Mayo Clinic (mayoclinic.org).

Instructions:
1. Provide a concise, helpful 2-3 paragraph synthesis in ${language === "bn" ? "Bangla (বাংলা)" : "English"} explaining key evidence-based information, recommended precautions, when to see a specialist, and reputable institutional guidelines.
2. Mention verifying medicines on Medex Bangladesh (medex.com.bd) or booking doctor appointments via MedEasy / Daktarbhai if relevant.
3. Keep the tone empathetic, professional, and clear.
`;

    let responseText = "";
    let links: Array<{ title: string; uri: string; domain: string }> = [];
    let webSearchQueries: string[] = [];

    try {
      const response = await callGeminiWithRetry({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      responseText = response.text || "";
      const groundingMeta = response.candidates?.[0]?.groundingMetadata as any;
      const groundingChunks = groundingMeta?.groundingChunks || [];
      webSearchQueries = groundingMeta?.webSearchQueries || [];

      const seenUrls = new Set<string>();
      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          const uri = chunk.web.uri;
          if (!seenUrls.has(uri)) {
            seenUrls.add(uri);
            let domain = "";
            try {
              domain = new URL(uri).hostname.replace(/^www\./, "");
            } catch {}
            links.push({
              title: chunk.web.title || domain || "Verified Health Resource",
              uri,
              domain
            });
          }
        }
      }
    } catch (geminiErr) {
      console.warn("[SEARCH GROUNDING] Search tool call failed, using clinical fallback engine:", geminiErr);
      if (groq) {
        try {
          const groqRes = await callGroqHealthEngine({
            systemPrompt: "You are an authoritative clinical guidance AI for SUROKKHA AI. Provide verified, evidence-based public health guidelines.",
            userPrompt: prompt,
            temperature: 0.2
          });
          try {
            const parsed = JSON.parse(groqRes.content);
            responseText = parsed.answer || parsed.content || parsed.summary || parsed.guidelines || groqRes.content;
          } catch {
            responseText = groqRes.content;
          }
        } catch (groqErr) {
          console.error("Groq fallback failed:", groqErr);
        }
      }
      
      if (!responseText) {
        responseText = language === "bn"
          ? `"${query}" সংক্রান্ত স্বাস্থ্য নির্দেশিকা ও নির্ভরযোগ্য চিকিৎসা তথ্যের জন্য বিশ্ব স্বাস্থ্য সংস্থা (WHO), স্বাস্থ্য অধিদপ্তর (DGHS Bangladesh) এবং আইসিডিডিআর,বি (icddrb.org)-এর নির্দেশিকা অনুসরণ করুন। যেকোনো তীব্র লক্ষণে অবিলম্বে বিশেষজ্ঞ চিকিৎসকের পরামর্শ গ্রহণ করুন।`
          : `For verified health information and clinical protocols regarding "${query}", please refer to official guidelines from the World Health Organization (WHO), DGHS Bangladesh, and NHS UK. Consult a licensed physician for specific diagnosis.`;
      }
    }

    // Curated fallback portals if search grounding produced few links
    if (links.length === 0) {
      const encodedQuery = encodeURIComponent(query);
      links.push(
        {
          title: "Medex Bangladesh — ড্রাগ, জেনেরিক ও ব্র্যান্ড ইনডেক্স",
          uri: `https://medex.com.bd/search?q=${encodedQuery}`,
          domain: "medex.com.bd"
        },
        {
          title: "MedEasy (মেডইজি) — অনলাইন ডাক্তার কনসালটেশন ও ডিজিটাল প্রেসক্রিপশন",
          uri: `https://medeasy.health`,
          domain: "medeasy.health"
        },
        {
          title: "Daktarbhai (ডাক্তারভাই) — ডাক্তার অ্যাপয়েন্টমেন্ট ও স্বাস্থ্য রেকর্ড",
          uri: `https://daktarbhai.com`,
          domain: "daktarbhai.com"
        },
        {
          title: "স্বাস্থ্য অধিদপ্তর বাংলাদেশ (DGHS) — অফিসিয়াল স্বাস্থ্য পোর্টাল",
          uri: `https://dghs.gov.bd`,
          domain: "dghs.gov.bd"
        },
        {
          title: "World Health Organization (WHO) — Health Topics & Guidelines",
          uri: `https://www.who.int/health-topics`,
          domain: "who.int"
        },
        {
          title: "ICDDR,B — সংক্রামক ও জনস্বাস্থ্য গবেষণা পোর্টাল",
          uri: `https://www.icddrb.org`,
          domain: "icddrb.org"
        },
        {
          title: "MedlinePlus (US National Library of Medicine) — Health Guides",
          uri: `https://medlineplus.gov/`,
          domain: "medlineplus.gov"
        }
      );
    }

    res.json({
      query,
      summary: responseText,
      links,
      searchQueries: webSearchQueries.length > 0 ? webSearchQueries : [query],
    });
  } catch (error: any) {
    console.error("Medical Resource Search Error:", error);
    res.status(500).json({ error: "Failed to search medical resources. Please try again." });
  }
});

// Create Vite server in middleware mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
