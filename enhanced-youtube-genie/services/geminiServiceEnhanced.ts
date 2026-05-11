import { GoogleGenAI, Type } from "@google/genai";
import type { FormData } from '../types';
import { DESCRIPTION_TEMPLATE } from '../constants';

// Enhanced error types for better error handling
export class APIError extends Error {
  constructor(message: string, public code?: string, public statusCode?: number) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Check for API key availability
const getAPIKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new APIError(
      'API key is not configured. Please set up your Gemini API key in the environment variables.',
      'MISSING_API_KEY'
    );
  }
  return apiKey;
};

// Initialize AI client with error handling
const initializeAI = () => {
  try {
    const apiKey = getAPIKey();
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    throw error;
  }
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "The full, formatted YouTube description text, including intro, vibe, key moments, credits, hashtags, and lyrics."
    }
  },
  required: ['description']
};

// Enhanced input validation
const validateInput = (formData: FormData): void => {
  const requiredFields = ['songTitle', 'artistName', 'youtubeHandle', 'genres', 'vibeKeywords', 'lyrics'];
  const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]?.trim());
  
  if (missingFields.length > 0) {
    throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate lyrics length
  if (formData.lyrics.trim().length < 50) {
    throw new ValidationError('Lyrics must be at least 50 characters long for meaningful description generation.');
  }

  if (formData.lyrics.trim().length > 10000) {
    throw new ValidationError('Lyrics are too long. Please limit to 10,000 characters.');
  }

  // Validate YouTube handle format
  if (!formData.youtubeHandle.startsWith('@')) {
    throw new ValidationError('YouTube handle must start with @');
  }
};

// Enhanced error message mapping
const mapErrorToUserMessage = (error: any): string => {
  // Handle our custom error types
  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof RateLimitError) {
    return 'You\'ve reached the rate limit. Please wait a moment before trying again.';
  }

  if (error instanceof APIError) {
    if (error.code === 'MISSING_API_KEY') {
      return 'The service is not properly configured. Please contact support.';
    }
    return error.message;
  }

  // Handle Google AI API errors
  if (error?.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('api key not valid') || message.includes('invalid_argument')) {
      return 'There\'s an issue with the API configuration. Please try again later or contact support.';
    }
    
    if (message.includes('quota exceeded') || message.includes('rate limit')) {
      return 'The service is currently experiencing high demand. Please try again in a few minutes.';
    }
    
    if (message.includes('model not found')) {
      return 'The AI model is temporarily unavailable. Please try again later.';
    }
    
    if (message.includes('content filtered') || message.includes('safety')) {
      return 'Your content couldn\'t be processed due to safety guidelines. Please review your lyrics and try again.';
    }
    
    if (message.includes('timeout') || message.includes('deadline')) {
      return 'The request timed out. Please try again with shorter content or check your connection.';
    }
  }

  // Generic fallback
  return 'Something went wrong while generating your description. Please try again, and if the problem persists, contact support.';
};

export const generateDescription = async (formData: FormData): Promise<string> => {
  try {
    // Validate input first
    validateInput(formData);

    // Initialize AI client
    const ai = initializeAI();

    // Create enhanced prompt with better structure
    const prompt = `
      You are an expert music marketer who creates compelling YouTube video descriptions.
      Based on the JSON data provided below, generate a complete YouTube description.

      **TASK:**
      1. Create a single string output for the YouTube description.
      2. Follow the structure, symbols (➤, 🎤, 🌑, 💥, 🔥, ▶️, 🔔, 🌎), and tone of the EXAMPLE provided below.
      3. Analyse the provided lyrics to create a "Key Moments" section with 5-6 descriptive entries. Infer plausible timestamps based on a typical 3-5 minute song structure.
      4. Generate a list of 20-25 relevant and niche hashtags based on all provided information.
      5. Format the final output as a single block of text, ready to be copied and pasted into YouTube. Ensure the "Credits" and "Subscribe" line are formatted correctly using the user's data.

      **USER INPUT DATA:**
      ${JSON.stringify(formData, null, 2)}

      **EXAMPLE OF DESIRED OUTPUT FORMAT AND STRUCTURE:**
      ${DESCRIPTION_TEMPLATE}
    `;

    // Make API call with enhanced error handling
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
        maxOutputTokens: 2048,
      },
    });

    // Validate response
    if (!response || !response.text) {
      throw new APIError('Empty response from AI service');
    }

    const jsonText = response.text.trim();
    
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      throw new APIError('Invalid response format from AI service');
    }
    
    if (!parsed || typeof parsed.description !== 'string' || !parsed.description.trim()) {
      throw new APIError('AI service returned invalid description format');
    }

    return parsed.description;

  } catch (error) {
    console.error("Error in generateDescription:", error);
    
    // Re-throw with user-friendly message
    const userMessage = mapErrorToUserMessage(error);
    throw new Error(userMessage);
  }
};

// Utility function to check API availability
export const checkAPIAvailability = async (): Promise<boolean> => {
  try {
    const ai = initializeAI();
    // Make a minimal test request
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: "Test",
      config: {
        maxOutputTokens: 10,
      },
    });
    return !!response;
  } catch (error) {
    return false;
  }
};

