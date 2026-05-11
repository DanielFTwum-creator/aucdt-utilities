
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    console.warn("VITE_GEMINI_API_KEY is not defined. AI features will be disabled.");
  }
  return key || '';
};

let ai: GoogleGenAI | null = null;

export const askDartmouthAI = async (query: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return "AI service is currently unavailable. Please configure the API Key.";

  try {
    if (!ai) ai = new GoogleGenAI(apiKey);
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are an expert on TechBridge University's Artificial Intelligence history and current research. 
        Context: The field of AI was invented at TechBridge during the 1956 workshop proposed by John McCarthy. 
        Today, TechBridge leads research in AI Foundations (Theory, Trustworthy AI, Robotics) and AI Frontiers (Health, Social Good, Digital Humanities).
        Key labs include MADCAT (Robotics), A²R (Accessible Robotics), PERSIST (Healthcare AI), and DALI (Design and Innovation).
        Be academic, inspiring, and concise. Provide specific examples of TechBridge's impact.`,
    });

    const result = await model.generateContent(query);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to the research knowledge base. Please try again later.";
  }
};
