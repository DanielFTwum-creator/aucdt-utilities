import { GoogleGenAI } from "@google/genai";
import { Venture, Brief } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const MODEL_NAME = "gemini-3-flash-preview";

function buildPrompt(venture: Venture): string {
  return `You are a senior venture analyst at a top-tier deep-tech fund.

Analyse the following AI venture and produce a structured strategic brief.

VENTURE DATA:
Name: ${venture.name}
Sector: ${venture.sector}
Stage: ${venture.stage}
Team Size: ${venture.teamSize}
Problem: ${venture.problemStatement}
Solution: ${venture.solutionSummary}
Key Risks: ${venture.keyRisks.join(', ')}
Key Opportunities: ${venture.keyOpportunities.join(', ')}
G Score (Social Good): ${venture.gScore}/100
M Score (Monetisation): ${venture.mScore}/100
Projected ROI: ${venture.roiProjection}×

Respond ONLY in this JSON structure (no markdown, no preamble):
{
  "headline": "<10-word punchy headline>",
  "executiveSummary": "<3-sentence summary>",
  "riskAssessment": "<2-sentence risk evaluation>",
  "strategicRecommendation": "<2-sentence recommendation>",
  "confidenceScore": <0.0 to 1.0>
}
`;
}

export async function generateBrief(venture: Venture): Promise<Brief> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('CONFIG_ERROR: GEMINI_API_KEY is missing.');
  }

  const prompt = buildPrompt(venture);
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      temperature: 0.4,
      maxOutputTokens: 600,
      responseMimeType: "application/json",
    },
  });

  const raw = response.text;
  if (!raw) {
    throw new Error('Gemini service returned an empty or malformed response.');
  }

  try {
    const parsed = JSON.parse(raw);
    return { 
      ventureId: venture.id, 
      generatedAt: new Date().toISOString(), 
      ...parsed 
    };
  } catch (e) {
    console.error("Failed to parse Gemini response:", raw);
    throw new Error("Malformed JSON response from strategic engine.");
  }
}

export async function summarizeRisks(ventureName: string, risks: string[]): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('CONFIG_ERROR: GEMINI_API_KEY is missing.');
  }

  const prompt = `Condense these venture risks into a single, punchy, high-impact sentence for a senior investor. 
Venture: ${ventureName}
Risks: ${risks.join(', ')}

Respond ONLY with the sentence. No preamble.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      temperature: 0.7,
      maxOutputTokens: 100,
    },
  });

  return response.text?.trim() || "Risk synthesis unavailable.";
}

export async function summarizeOpportunities(ventureName: string, opportunities: string[]): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('CONFIG_ERROR: GEMINI_API_KEY is missing.');
  }

  const prompt = `Condense these venture opportunities into a single, punchy, high-impact sentence for a senior investor. 
Venture: ${ventureName}
Opportunities: ${opportunities.join(', ')}

Respond ONLY with the sentence. No preamble.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      temperature: 0.7,
      maxOutputTokens: 100,
    },
  });

  return response.text?.trim() || "Opportunity synthesis unavailable.";
}
