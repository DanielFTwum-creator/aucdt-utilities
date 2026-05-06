import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateChatResponse = async (
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  message: string
) => {
  if (!ai) throw new Error("Gemini API Key not configured");

  // The new SDK handles history differently in chats.create, but for a stateless
  // function we might need to reconstruct it or just use a new chat each time 
  // if we are managing state externally.
  // However, ai.chats.create returns a stateful chat object.
  // To support the existing UI which passes history, we should ideally use that history.
  // The SDK's Chat object has a `history` property we can populate.

  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction:
        "You are 'Sash', an AI fashion consultant for SashMade, an Afro-Chic textile studio. You are knowledgeable about African textile patterns (Kente, Ankara, Adinkra, etc.), their cultural significance, and modern styling. You are helpful, creative, and respectful of cultural heritage. Keep responses concise and engaging.",
    },
    history: history, 
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};

export const analyzeFabricPattern = async (file: File) => {
  if (!ai) throw new Error("Gemini API Key not configured");

  // Convert file to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = reject;
  });

  const prompt = `Analyze this fabric pattern. Return a JSON object with the following fields:
  - patternName: string
  - culturalOrigin: string
  - historicalSignificance: string
  - suggestedStyling: string
  - estimatedValueRange: string
  - colorPalette: array of 6 hex codes
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ],
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  // Clean up markdown code blocks if present
  const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(jsonString);
};
