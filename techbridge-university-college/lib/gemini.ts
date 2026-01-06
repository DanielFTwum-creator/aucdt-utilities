
import { GoogleGenAI } from "@google/genai";
import { STUDENT_HANDBOOK_CONTEXT } from '../types.ts';

/**
 * Streams a response from the Gemini model using the provided parameters.
 * Follows the latest @google/genai guidelines.
 */
export const streamResponse = async (
  prompt: string, 
  history: { role: string; parts: { text: string }[] }[],
  image: string | null,
  onChunk: (text: string) => void
) => {
  try {
    // ALWAYS initialize the client with process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview'; // Upgraded for better academic reasoning
    
    const parts: any[] = [{ text: prompt }];
    
    if (image) {
      let base64Data = image;
      let mimeType = 'image/jpeg';
      if (image.includes('base64,')) {
        const matches = image.match(/^data:(.*);base64,(.*)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        }
      }
      parts.push({
        inlineData: { mimeType, data: base64Data }
      });
    }

    const response = await ai.models.generateContentStream({
      model,
      contents: [
        ...history, 
        { role: 'user', parts }
      ],
      config: {
        systemInstruction: STUDENT_HANDBOOK_CONTEXT,
        temperature: 0.7,
      }
    });

    let fullText = '';
    for await (const chunk of response) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.error("BridgeBot Connection Error:", error);
    onChunk("I am experiencing a momentary data bridge failure. Please refresh and try again.");
  }
};
