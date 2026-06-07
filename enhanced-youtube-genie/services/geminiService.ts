import type { FormData } from '../types';
import { DESCRIPTION_TEMPLATE } from '../constants';
import { generateViaProxy } from './geminiProxy';

// Gemini is called via this app's server-side relay (/api/generate) -> WMS proxy.
// No @google/genai client and no API key in this bundle.

const responseSchema = {
  type: 'OBJECT',
  properties: {
    description: {
      type: 'STRING',
      description: "The full, formatted YouTube description text, including intro, vibe, key moments, credits, hashtags, and lyrics."
    }
  },
  required: ['description']
};

export const generateDescription = async (formData: FormData): Promise<string> => {
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

  try {
    const jsonText = (await generateViaProxy(prompt, "gemini-2.5-flash", {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.8,
    })).trim();

    const parsed = JSON.parse(jsonText);
    if (parsed && typeof parsed.description === 'string') {
      return parsed.description;
    }
    throw new Error("Invalid response format from AI.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate description: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};
