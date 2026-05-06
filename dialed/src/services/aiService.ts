import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!aiInstance && apiKey) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function getColorCritique(score: number, targetHsb: any, playerHsb: any) {
  const ai = getAI();
  if (!ai) {
    return "Your color memory is truly unique.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a sassy, high-end editorial color critic. 
      A user just tried to remember a color. 
      Target HSB: ${JSON.stringify(targetHsb)}
      User HSB: ${JSON.stringify(playerHsb)}
      Score: ${score}/10.
      
      Give a one-sentence, witty, and judgmental critique. 
      Do not mention HSB values.
      Keep it under 15 words.`,
    });

    return response.text || "I've seen better colors on a test pattern.";
  } catch (error) {
    console.error("AI Critique Error:", error);
    return "The colors are speechless.";
  }
}
