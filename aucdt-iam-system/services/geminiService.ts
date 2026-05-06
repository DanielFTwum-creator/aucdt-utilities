import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

// --- Local Utilities ---
const logger = {
  info: (msg: string, data?: any) => console.info(`[AI Service] ${msg}`, data || ''),
  warn: (msg: string, data?: any) => console.warn(`[AI Service] ${msg}`, data || ''),
  error: (msg: string, data?: any) => console.error(`[AI Service] ${msg}`, data || ''),
};

const sanitizeInput = (str: string): string => {
  if (!str) return '';
  // Remove HTML tags and limit length
  return str.replace(/[<>{}]/g, '').trim().slice(0, 5000);
};

const validateResponse = (text: string, options: { minWords: number; maxWords: number }) => {
  if (!text) return { isValid: false, errors: ['Empty response'] };
  
  const wordCount = text.split(/\s+/).length;
  const errors: string[] = [];
  
  if (wordCount < options.minWords) errors.push(`Too short (${wordCount} words)`);
  if (wordCount > options.maxWords) errors.push(`Too long (${wordCount} words)`);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

interface SummaryConfig {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  retries?: number;
}

/**
 * Generates a professional technical summary from raw logbook notes.
 * Tailored for AUCDT Fashion Design Technology students.
 * 
 * @param notes - Raw industrial attachment logbook entries
 * @param config - Optional generation parameters
 * @returns Professionally formatted single-paragraph summary
 */
export const summarizeLogbookEntry = async (
  notes: string, 
  config: SummaryConfig = {}
): Promise<string> => {
  
  // 1. Validation & Sanitization
  if (!apiKey) {
    logger.warn("Gemini API Key is missing.");
    return "AI Summarization unavailable (Missing API Key).";
  }

  const sanitizedNotes = sanitizeInput(notes);
  if (!sanitizedNotes || sanitizedNotes.length < 5) {
    return "Please provide valid logbook notes (at least 5 characters) to summarize.";
  }

  const {
    model = 'gemini-2.5-flash',
    maxTokens = 300,
    temperature = 0.3, // Low temp for consistent, professional output
    retries = 3
  } = config;

  // 2. Structured Prompt Engineering
  const systemInstruction = `You are a technical writing specialist for Asanska University College of Design and Technology (AUCDT).

TASK: Transform student logbook notes into ONE professional paragraph suitable for an industrial attachment report.

CONTEXT: The student is in the Fashion Design Technology Department.

REQUIREMENTS:
- Length: 40-100 words (concise).
- Focus: Technical skills (CAD, pattern drafting, garment construction, fabric analysis), design processes, tools used.
- Style: Formal academic tone, past tense, third person (e.g., "The student...", or passive voice "Patterns were drafted...").
- Exclude: Dates, personal emotions, slang, or casual language.

OUTPUT: Return ONLY the paragraph text. No preamble or markdown formatting.`;

  const userPrompt = `Raw Logbook Notes:\n---\n${sanitizedNotes}\n---\n\nProfessional Summary:`;

  // 3. Retry Logic with Exponential Backoff
  let lastError: any = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info(`Generating summary (attempt ${attempt}/${retries})`);

      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature,
          maxOutputTokens: maxTokens,
          topP: 0.8,
          topK: 40,
        }
      });

      const summary = response.text?.trim();

      if (!summary) {
        throw new Error('Empty response from AI model');
      }

      // 4. Quality Checks
      const validation = validateResponse(summary, { minWords: 10, maxWords: 150 });
      
      if (!validation.isValid) {
        logger.warn('Summary quality check failed', validation.errors);
        // If it's just a length issue, we might accept it if it's the last retry, 
        // but for now we throw to trigger retry or failure.
        if (attempt < retries) throw new Error(`Quality check failed: ${validation.errors.join(', ')}`);
      }

      logger.info('Summary generated successfully');
      return summary;

    } catch (error) {
      lastError = error;
      logger.error(`Attempt ${attempt} failed`, error);

      if (attempt < retries) {
        // Exponential backoff: 2^attempt * 500ms
        const delay = Math.pow(2, attempt) * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return "Unable to generate summary at this time. Please check your connection and try again.";
};