import type { FormData } from '../types';
import { DESCRIPTION_TEMPLATE } from '../constants';

// Gemini is called via this app's own server-side relay (/api/generate), which
// forwards to the central WMS Gemini proxy. The API key is NOT in this bundle —
// it lives only on the WMS server. No @google/genai client here.

// Gemini REST equivalent of the former responseSchema (Type.OBJECT { description }).
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

  // Raw Gemini generateContent body — the WMS proxy forwards this verbatim.
  const requestBody = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.8,
    },
  };

  try {
    const res = await fetch('/api/generate?model=gemini-2.5-flash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Proxy returned ${res.status}: ${errText}`);
    }

    // Gemini generateContent response shape: candidates[0].content.parts[0].text
    const data = await res.json();
    const jsonText: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) {
      throw new Error('Invalid response format from AI.');
    }

    const parsed = JSON.parse(jsonText.trim());
    if (parsed && typeof parsed.description === 'string') {
      return parsed.description;
    }
    throw new Error('Invalid response format from AI.');
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate description: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};
