/**
 * @version 2026.05.12
 * @description Unified BioChemAI Service for Techbridge University College
 * @methodology 6R (Readability, Reliability, Reusability, Resilience, Rigour, Refinement)
 */

import { 
  GoogleGenerativeAI, 
  SchemaType, 
  GenerateContentRequest
} from "@google/generative-ai";
import { LearningLevel, Source, QuizQuestion } from '../types';

// Authentication via Vite environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const TECHBRIGE_CONFIG = {
  brandVoice: `
    - Identity: Official BioChemAI assistant for Techbridge University College.
    - Language: British International English (strictly use 's' instead of 'z' for verbs like 'optimise').
    - Tone: Academic, clear, and authoritative.
  `,
  model: "gemini-2.5-flash" 
};

/**
 * Generates an enhanced system instruction to support rich HTML and SVG diagrams.
 * @version 2026.05.12
 * @methodology 6R (Refinement & Rigour)
 */
const getSystemInstruction = (level: LearningLevel): string => {
  return `
    ${TECHBRIGE_CONFIG.brandVoice}
    Target Audience: ${level}
    
    ### Formatting Standards
    - **Response Format**: Use strictly valid HTML5 fragments. Do not include <html> or <body> tags.
    - **Headings**: Use <h3> and <h4> for hierarchy.
    - **Typography**: **Bold** key biochemical terms and use <i>italics</i> for scientific names.
    - **Chemical Formulae**: Use <sub> and <sup> tags (e.g., H<sub>2</sub>O, C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>).

    ### Visual Representations (Mandatory for Complex Concepts)
    - **SVG Diagrams**: When explaining pathways (e.g., Krebs Cycle) or molecular structures, you MUST include an inline <svg> element.
    - **SVG Styling**:
        - Use TECHBRIGE colours: Gold (#D4AF37) for catalysts/enzymes, Deep Brown (#3E2723) for text/labels, and Green (#2E7D32) for products.
        - Ensure SVGs are responsive using viewBox and width="100%".
        - Include clear <text> labels and <path> arrows to indicate biochemical flow.
    - **Tables**: Use <table> with <thead> and <tbody> for comparative data or pharmacokinetic profiles.

    ### Teaching Approach
    - Start with a high-level HTML summary.
    - Use <ul> or <ol> for sequential biochemical steps.
    - Insert a visual SVG diagram immediately after the foundational explanation.
    - Use <aside> for "Did You Know?" facts or "Clinical Correlation" boxes.

    ### Mandatory Medical Disclaimer
    Always conclude any response regarding drugs or therapeutic compounds with this exact HTML block:
    <div style="margin-top: 2rem; padding: 1rem; border: 1px solid #D4AF37; background-color: #f9f9f9;">
      <strong>⚠️ Medical Disclaimer:</strong> This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
    </div>
  `;
};

/**
 * Generates a grounded biochemistry explanation using the Google Search tool.
 * Updated based on image_9bf2ba.png to use 'googleSearch'.
 */
export const generateBioChemResponse = async (
  prompt: string, 
  level: LearningLevel
): Promise<{ text: string; sources: Source[] }> => {
  if (!API_KEY) throw new Error("BioChemAI Auth Error: VITE_GEMINI_API_KEY is undefined.");

  try {
    const model = genAI.getGenerativeModel({
      model: TECHBRIGE_CONFIG.model,
      systemInstruction: getSystemInstruction(level),
    });

    const request: GenerateContentRequest = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      // FIX: Changed from googleSearchRetrieval to googleSearch as per image_9bf2ba.png
      tools: [{ googleSearch: {} } as any],
    };

    const result = await model.generateContent(request);
    const response = await result.response;
    const text = response.text();
    
    // Extracting sources from grounding metadata
    const sources: Source[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({ 
        uri: chunk.web.uri, 
        title: chunk.web.title || "Academic Reference" 
      }));

    return { text, sources };
  } catch (error: any) {
    console.error("6R Resilience Failure:", error.message);
    throw new Error("BioChemAI service is currently unable to process this request. Please verify tool configuration.");
  }
};

/**
 * Generates a structured MCQ quiz for the QuizContainer.
 */
export const generateQuiz = async (
  topic: string,
  level: LearningLevel,
  numQuestions: number = 5
): Promise<QuizQuestion[]> => {
  const model = genAI.getGenerativeModel({
    model: TECHBRIGE_CONFIG.model,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          questions: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                questionText: { type: SchemaType.STRING },
                options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                correctAnswerIndex: { type: SchemaType.NUMBER },
                explanation: { type: SchemaType.STRING },
              },
              required: ["questionText", "options", "correctAnswerIndex", "explanation"],
            },
          },
        },
        required: ["questions"],
      },
    },
  });

  const result = await model.generateContent(`Generate a ${numQuestions}-question quiz on ${topic} for ${level}.`);
  const response = await result.response;
  return JSON.parse(response.text()).questions;
};