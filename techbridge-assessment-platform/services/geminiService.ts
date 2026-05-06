
import { GoogleGenAI } from "@google/genai";
import { Results } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateFeedback = async (results: Results): Promise<string> => {
  if (!API_KEY) {
    return "AI feedback is not configured because the API key is missing.\n\nBased on your results, focus on reviewing the topics where you made mistakes. Great effort!";
  }

  const incorrectAnswers = results.questions
    .map((q, i) => ({ ...q, userAnswer: results.answers[i] }))
    .filter(q => q.userAnswer !== q.answer);

  const prompt = `A student took an assessment titled "${results.assessmentId} - ${results.assessmentTitle}". They scored ${results.score} out of ${results.total}. 
Here are the questions they got wrong and the answers they chose:
${incorrectAnswers.map(q => `- Question: "${q.question}", Their Answer: "${q.userAnswer}", Correct Answer: "${q.answer}"`).join('\n')}

Provide encouraging, personalised feedback in British English. Explain why some of their incorrect answers might have been wrong and offer brief, constructive advice for improvement. Keep it concise and supportive. Start with "Well done on completing the assessment!".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI feedback:", error);
    return "There was an issue generating your feedback. Please try again later. Well done on completing the assessment!";
  }
};
