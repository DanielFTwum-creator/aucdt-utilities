/**
 * Enhanced Gemini Service with PHI Anonymization
 *
 * Features:
 * - Automatic PHI stripping before AI submission
 * - Enriched patient context (age, gender, medical history)
 * - Structured JSON output with ICD-10 codes
 * - Retry logic with exponential backoff
 * - Detailed audit logging
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Patient } from '../types';
import {
  anonymizePHI,
  createSanitizedContext,
  generateAnonymizationAuditMessage,
  AnonymizationResult
} from './anonymizationService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ClinicalAnalysisResult {
  possibleDiagnoses: {
    name: string;
    icd10: string;
    probability: string;
    confidence: number; // 0-100
    reasoning?: string;
  }[];
  treatmentSuggestions: string[];
  urgentFlags: string[];
  anonymizationInfo?: AnonymizationResult;
}

export const geminiService = {
  /**
   * Enhanced Clinical Intelligence with PHI Anonymization
   *
   * @param complaint - Chief complaint or symptoms
   * @param patient - Patient object (for context and anonymization)
   * @param addAuditLog - Callback to add audit log entries
   */
  async getClinicalAssistance(
    complaint: string,
    patient: Patient,
    addAuditLog?: (action: string, details: string) => void
  ): Promise<ClinicalAnalysisResult> {
    if (!process.env.API_KEY) {
      console.warn("API Key missing. AI features disabled.");
      if (addAuditLog) {
        addAuditLog('AI_SERVICE_ERROR', 'Gemini API key not configured');
      }
      return {
        possibleDiagnoses: [{
          name: "Configuration Error",
          icd10: "N/A",
          probability: "N/A",
          confidence: 0
        }],
        treatmentSuggestions: ["Configure GEMINI_API_KEY in environment"],
        urgentFlags: ["System Configuration Required"]
      };
    }

    try {
      // Step 1: Anonymize the complaint text
      const anonymizationResult = anonymizePHI(complaint, patient);

      if (addAuditLog) {
        const auditMessage = generateAnonymizationAuditMessage(anonymizationResult);
        addAuditLog('PHI_ANONYMIZATION', auditMessage);
      }

      // Step 2: Create sanitized patient context
      const patientContext = createSanitizedContext(patient);

      // Step 3: Build enhanced clinical prompt
      const clinicalPrompt = buildClinicalPrompt(
        anonymizationResult.anonymizedText,
        patientContext
      );

      if (addAuditLog) {
        addAuditLog('AI_CLINICAL_QUERY', `Analyzing symptoms for patient age ${calculateAge(patient.dob)}`);
      }

      // Step 4: Call Gemini with retry logic
      const response = await retryWithBackoff(async () => {
        return await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: clinicalPrompt,
          config: {
            systemInstruction: getSystemInstruction(),
            temperature: 0.3, // Balanced: consistent but not too rigid
            maxOutputTokens: 2000,
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingBudget: 15000 }, // Deep clinical reasoning
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                possibleDiagnoses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      icd10: { type: Type.STRING },
                      probability: {
                        type: Type.STRING,
                        description: "High, Moderate, Low"
                      },
                      confidence: {
                        type: Type.NUMBER,
                        description: "Confidence score 0-100"
                      },
                      reasoning: {
                        type: Type.STRING,
                        description: "Brief clinical reasoning"
                      }
                    },
                    required: ['name', 'icd10', 'probability', 'confidence']
                  }
                },
                treatmentSuggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                urgentFlags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Red flags requiring immediate attention"
                }
              },
              required: ['possibleDiagnoses', 'treatmentSuggestions', 'urgentFlags']
            }
          }
        });
      }, 3); // 3 retry attempts

      if (!response.text) {
        throw new Error("Empty response from Gemini API");
      }

      const result = JSON.parse(response.text);

      if (addAuditLog) {
        const diagnosisCount = result.possibleDiagnoses?.length || 0;
        addAuditLog('AI_ANALYSIS_COMPLETE', `Generated ${diagnosisCount} differential diagnoses`);
      }

      // Attach anonymization info for transparency
      return {
        ...result,
        anonymizationInfo: anonymizationResult
      };

    } catch (error: any) {
      console.error(`Gemini Clinical Analysis Failed:`, error);

      if (addAuditLog) {
        addAuditLog('AI_SERVICE_ERROR', `Gemini API error: ${error.message}`);
      }

      return {
        possibleDiagnoses: [{
          name: "Analysis Unavailable",
          icd10: "N/A",
          probability: "Unknown",
          confidence: 0,
          reasoning: "AI service temporarily unavailable"
        }],
        treatmentSuggestions: [
          "Unable to contact clinical intelligence engine",
          "Please verify symptoms manually using clinical guidelines",
          "Check API key configuration and network connectivity"
        ],
        urgentFlags: [`API Error: ${error.message}`]
      };
    }
  },

  /**
   * Patient-Friendly Summarization
   */
  async summarizeForPatient(clinicalNote: string): Promise<string> {
    if (!process.env.API_KEY) {
      return "Patient summary unavailable (API not configured)";
    }

    try {
      const response = await retryWithBackoff(async () => {
        return await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Act as a compassionate healthcare educator.
          Summarize the following clinical encounter note for the patient.

          Focus on:
          1. What was found during the visit
          2. What they need to do next (medications, follow-ups)
          3. Warning signs to watch for

          Use simple, clear language suitable for patients with no medical background.
          Avoid medical jargon. Be reassuring but accurate.

          Clinical Note: ${clinicalNote}`,
          config: {
            temperature: 0.7, // More creative for patient-friendly language
            maxOutputTokens: 500
          }
        });
      }, 2);

      return response.text || "Unable to generate summary";
    } catch (error: any) {
      console.error("Patient Summarization Error:", error);
      return "Unable to generate patient summary at this time. Please consult your healthcare provider.";
    }
  }
};

/**
 * Build enhanced clinical prompt with context
 */
function buildClinicalPrompt(
  anonymizedComplaint: string,
  patientContext: string
): string {
  return `
CLINICAL INTELLIGENCE REQUEST

PATIENT CONTEXT:
${patientContext}

CHIEF COMPLAINT / SYMPTOMS:
${anonymizedComplaint}

INSTRUCTIONS:
Analyse the symptoms in the context of the patient's age, gender, and medical history.
Provide differential diagnoses ranked by probability with ICD-10 codes.
Include confidence scores (0-100) and brief clinical reasoning.
Flag any urgent symptoms requiring immediate medical attention.
Consider common conditions first, then rare conditions if symptoms are unusual.

NOTE: This is clinical decision support. Final diagnosis remains with the healthcare provider.
`.trim();
}

/**
 * System instruction for Gemini
 */
function getSystemInstruction(): string {
  return `You are the Rophe Clinical Intelligence Engine, an advanced AI diagnostic assistant
for healthcare providers at a specialist care facility in Ghana.

Your role:
- Analyse patient symptoms and medical history
- Suggest differential diagnoses with ICD-10 codes
- Provide evidence-based treatment recommendations
- Flag urgent symptoms requiring immediate intervention
- Consider local disease prevalence in West Africa

Clinical Guidelines:
- Prioritize life-threatening conditions first
- Consider age, gender, and medical history
- Use ICD-10-CM codes (2025 edition)
- Be specific with diagnostic reasoning
- Flag "red flag" symptoms clearly
- Consider drug allergies in treatment suggestions

Constraints:
- You are advisory only - physicians make final decisions
- Do not diagnose from images (text-based analysis only)
- Acknowledge uncertainty when present
- Recommend urgent care when appropriate

Regional Context (Ghana):
- Consider endemic diseases: malaria, typhoid, hepatitis B
- Account for tropical climate conditions
- Consider limited diagnostic resources in recommendations`;
}

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Don't retry on authentication errors
      if (error.message?.includes('API key') || error.message?.includes('401')) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries - 1) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = initialDelay * Math.pow(2, attempt);
      console.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
