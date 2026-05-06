import { GoogleGenAI, Type } from '@google/genai';
import { QuizSettings, Question } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set!");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const quizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            questionText: { type: Type.STRING, description: "The main text of the question. For math/science questions, use LaTeX syntax for formulas (e.g., 'What is the value of E in E = mc^2?')." },
            options: {
                type: Type.ARRAY,
                description: "An array of exactly 4 possible answers.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING, description: "The text for an answer option." },
                        isCorrect: { type: Type.BOOLEAN, description: "True if this is the correct answer." }
                    },
                    required: ["text", "isCorrect"]
                }
            },
            explanation: { type: Type.STRING, description: "A clear and concise explanation of why the correct answer is right." },
            katexContent: { type: Type.STRING, description: "A standalone LaTeX expression for complex formula rendering. Should be null if not needed." },
            chartData: {
                type: Type.OBJECT,
                description: "A Chart.js configuration object if visualization is needed. Should be null if not needed.",
                properties: {
                    type: { type: Type.STRING, description: "Chart.js type: 'bar', 'line', 'pie', 'doughnut', etc." },
                    data: {
                        type: Type.OBJECT,
                        description: "Chart.js data object (labels, datasets).",
                        properties: {
                            labels: {
                                type: Type.ARRAY,
                                description: "Array of labels for the chart.",
                                items: { type: Type.STRING }
                            }
                        }
                    },
                    options: {
                        type: Type.OBJECT,
                        description: "Chart.js options object.",
                        properties: {
                            responsive: {
                                type: Type.BOOLEAN,
                                description: "Whether the chart should resize with the container."
                            }
                        }
                    }
                },
            }
        },
        required: ["questionText", "options", "explanation"]
    }
};

export const generateQuiz = async (settings: QuizSettings): Promise<{ questions: Question[], prompt: string }> => {
    const { topic, level, numQuestions, difficulty, timeLimit } = settings;
    
    const prompt = `Generate a ${numQuestions}-question multiple-choice quiz about "${topic}".
The target audience is ${level} level, with a cultural and contextual focus on West Africa.
The difficulty should be ${difficulty}.
If a time limit is specified, tailor the question complexity to be answerable within a proportional slice of that time. Time Limit: ${timeLimit}.
Ensure each question has exactly 4 options and only one is correct.
For questions involving complex math, provide a LaTeX string in 'katexContent'.
For questions that can be enhanced with a chart, provide a Chart.js object in 'chartData'.
If 'katexContent' or 'chartData' are not applicable for a question, their value MUST be null.
The response must adhere to the provided JSON schema.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });

        const jsonText = response.text;
        const questions = JSON.parse(jsonText) as Question[];

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("AI returned an invalid or empty set of questions.");
        }

        return { questions, prompt };

    } catch (error) {
        console.error("Error generating quiz from Gemini API:", error);
        if (error instanceof Error) {
             throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the AI.");
    }
};