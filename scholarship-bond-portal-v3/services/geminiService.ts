
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const evaluateCodeResponse = async (questionContent: string, candidateResponse: string, idealAnswer: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Evaluate the following coding response. 
    Question: ${questionContent}
    Ideal Answer Context: ${idealAnswer}
    Candidate Response: ${candidateResponse}
    
    Provide a score from 0-100 and a brief justification.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          justification: { type: Type.STRING }
        },
        required: ["score", "justification"]
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { score: 0, justification: 'Error parsing AI response.' };
  }
};

export const generateQuestionRecommendation = async (topic: string, difficulty: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a technical interview question for the topic "${topic}" at ${difficulty} difficulty.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          type: { type: Type.STRING, description: "MCQ or CODE_CHALLENGE" },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING }
        },
        required: ["content", "type"]
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
};
