import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const askCampAssistant = async (
  userQuery: string,
  contextData: string
): Promise<string> => {
  if (!API_KEY) {
    return "I'm sorry, I can't connect to the AI service right now (Missing API Key).";
  }

  try {
    // Instantiate client here to ensure fresh config/key usage if it were dynamic
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = "gemini-2.5-flash";
    const prompt = `
      You are a helpful assistant for the myVBCI Camper App.
      Your goal is to help campers with questions about camps, registration, and rooms.
      
      Here is the current context data about available camps and policies:
      ${contextData}

      User Question: ${userQuery}

      Answer politely and concisely. If you don't know, ask them to contact admin support.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the server. Please try again later.";
  }
};