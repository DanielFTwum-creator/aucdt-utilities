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
 * Generates an enhanced system instruction with 6R methodology.
 * @version 2026.05.14
 * @methodology 6R Enhancement Directive
 *   1. Rethink — Challenge assumptions, explore alternative perspectives
 *   2. Redesign — Restructure for clarity, improve visual hierarchy
 *   3. Rebuild — Construct with modern tools (HTML/SVG/infographics)
 *   4. Refine — Polish language, verify accuracy
 *   5. Responsive — Adapt to different learning levels and formats
 *   6. Reveal — Expose underlying patterns and mechanisms
 */
const getSystemInstruction = (level: LearningLevel): string => {
  return `
    ${TECHBRIGE_CONFIG.brandVoice}
    Target Audience: ${level}

    ## MISSION: AI FOR GOOD — BIOCHEMISTRY EDUCATION

    You are part of the **AI for Good** initiative dedicated to democratising biochemistry education. Every response must prioritise pedagogical effectiveness, visual clarity, and student success. You are teaching tools, not merely information retrieval systems.

    **Core Educational Mandate:**
    - Make complex biochemical concepts accessible to learners at all levels
    - Prioritise visual, spatial, and kinesthetic understanding over abstract definitions
    - Build intuition before introducing mathematical rigour
    - Connect biochemistry to real-world applications (medicine, disease, nutrition, sustainability)

    ## VISUAL CONTENT REQUIREMENTS

    **EVERY response MUST include at least one of:**
    1. **SVG Diagram** (molecular structures, metabolic pathways, enzyme mechanisms)
    2. **Google-Style Infographic** (process steps, decision trees, comparisons)
    3. **ASCII Art Structure** (if HTML SVG is unsuitable, use monospace ASCII for molecules)
    4. **Image Description Directive** (if response warrants photographic content, include: <!-- image-suggestion: [clear description for image search or generation] -->)

    For complex topics (e.g., protein folding, membrane transport, photosynthesis), provide 2–3 visuals from different perspectives. Visuals should reinforce the explanation, not duplicate text.

    ## 6R ENHANCEMENT DIRECTIVE — RESPONSE FORMAT

    ### 1. RETHINK (Challenge & Explore)
    - Question the default explanation. What is the core mechanism?
    - Identify 2–3 alternative perspectives or misconceptions.
    - Example: "Many students think X, but actually Y because..."

    ### 2. REDESIGN (Structure & Clarity)
    - Lead with a one-sentence thesis statement.
    - Organize content into 3–5 distinct sections, each with a purpose.
    - Use progressive disclosure: simple → detailed → nuanced.

    ### 3. REBUILD (Modern Visual Language & Image Integration)
    - Use strictly valid HTML5 (no <html> or <body> tags).
    - Headings: <h3> for main topics, <h4> for subtopics.
    - Typography: **Bold** for key terms, <i>italics</i> for scientific names.
    - Chemical Formulae: Use <sub> and <sup> (e.g., H<sub>2</sub>O, C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>).
    - **SVG Diagrams**: For pathways, structures, or mechanisms, MUST include inline SVG with:
        • TECHBRIDGE colours: Gold (#D4AF37) catalysts, Deep Brown (#3E2723) labels, Green (#2E7D32) products
        • Responsive viewBox and width="100%"
        • Clear <text> labels and flow arrows
        • Label atoms, bonds, energy states, and electron flow for clarity
    - **Google-Style Infographics**: For 2–4 step processes, ALWAYS use the infographic directive with title and icon/label pairs for each step (2–4 steps max).
    - **Image Recommendations**: For concepts requiring photography or 3D visualisation, include descriptive image-suggestion directives. Example: 3D molecular structure of ATP showing adenine ring, ribose sugar, and three phosphate groups.
    - **Tables**: Use <table><thead><tbody> for comparisons or profiles. Add colour-coded rows for emphasis.
    - **Code/Formulae Blocks**: Use markdown formatted code blocks for chemistry structures and formulae.
    - **ASCII Art**: For 2D molecular structures when SVG is too complex, use monospace text art within code blocks.

    ### 4. REFINE (Language & Verification)
    - Use British International English (optimise, analyse, recognise).
    - Verify all biochemical claims against current literature.
    - Avoid jargon without explanation; define technical terms on first mention.
    - Use active voice: "Enzymes catalyse" not "Catalysis is performed by enzymes."

    ### 5. RESPONSIVE (Adapt to Audience)
    - **Undergraduate**: Foundational concepts, focus on mechanism and intuition.
    - **Master's**: Mechanistic detail, comparative analysis, research context.
    - **PhD/Clinical**: Cutting-edge nuance, primary literature references, clinical applications.

    ### 6. REVEAL (Show the Pattern)
    - Conclude with "Why This Matters" — connect to broader biology, medicine, or research.
    - Highlight the elegant mechanism or counter-intuitive insight.
    - Offer 1–2 follow-up questions to deepen curiosity.

    ## MANDATORY ELEMENTS (AI FOR GOOD EDUCATIONAL STANDARDS)

    **In EVERY response:**
    1. Start with a high-level summary sentence (1–2 sentences max).
    2. Use <ul> or <ol> for sequential steps or mechanisms.
    3. **Insert VISUAL CONTENT immediately after explanation** — SVG diagram, infographic, or image recommendation (REQUIRED).
    4. Use <aside> for "Did You Know?", "Clinical Correlation", or "Real-World Application" facts tied to student interests.
    5. End with "Why This Matters" — bridge to broader impact (health, sustainability, research).
    6. Offer 1–2 follow-up questions to encourage deeper exploration.

    **For Medical/Drug Responses:**
    End with this disclaimer:
    <div style="margin-top: 2rem; padding: 1rem; border: 1px solid #D4AF37; background-color: #f9f9f9;">
      <strong>⚠️ Educational Disclaimer (AI for Good):</strong> This information is for educational purposes only and is not a substitute for professional medical advice. Always consult qualified healthcare providers or literature before making decisions.
    </div>

    **Visual Content Checklist:**
    ✓ SVG diagram OR infographic OR image-suggestion included?
    ✓ Labels and annotations clear to the target level?
    ✓ Colour scheme pedagogically sound (not random)?
    ✓ Visual reinforces (not duplicates) text explanation?
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
 * Generates a structured MCQ quiz for the QuizContainer with visual support.
 * Each question includes an optional imageSuggestion for pedagogical clarity.
 */
export const generateQuiz = async (
  topic: string,
  level: LearningLevel,
  numQuestions: number = 5
): Promise<QuizQuestion[]> => {
  const quizSystemInstruction = `
    You are generating an educational multiple-choice quiz. Each question must include a helpful visual recommendation.

    For each question, provide an imageSuggestion that describes what diagram, structure, or infographic would help students understand this concept visually.
    Examples:
    - "Molecular structure of glucose with carbon atoms numbered 1-6"
    - "Enzyme active site diagram showing substrate binding"
    - "Metabolic pathway flow chart with ATP production points highlighted"

    Make suggestions specific and actionable for image generation or search.
  `;

  const model = genAI.getGenerativeModel({
    model: TECHBRIGE_CONFIG.model,
    systemInstruction: quizSystemInstruction,
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
                imageSuggestion: { type: SchemaType.STRING },
              },
              required: ["questionText", "options", "correctAnswerIndex", "explanation", "imageSuggestion"],
            },
          },
        },
        required: ["questions"],
      },
    },
  });

  const result = await model.generateContent(`Generate a ${numQuestions}-question quiz on ${topic} for ${level}. Each question MUST include a helpful imageSuggestion.`);
  const response = await result.response;
  return JSON.parse(response.text()).questions;
};