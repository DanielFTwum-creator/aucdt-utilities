
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';
import { LLM_PROMPT } from '../constants';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Gemini API key is missing. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.NUMBER },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correct: { type: Type.NUMBER },
            diagram: { type: Type.STRING, nullable: true },
            bonus: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING }
                },
                nullable: true
            }
        },
        required: ["id", "question", "options", "correct"]
    }
};

export const generateQuestionsFromText = async (text: string): Promise<Question[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
    
    const fullPrompt = `${LLM_PROMPT}\n\n"${text}"`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });
    
    const responseText = response.text.trim();
    if (!responseText) {
         if (response.candidates?.[0]?.finishReason === 'SAFETY') {
            throw new Error("The request was blocked due to safety concerns. Please adjust the input text.");
         }
        throw new Error("The AI model returned an empty response. Please check the model configuration or your input.");
    }

    try {
        const parsedJson = JSON.parse(responseText);
        // Fix sequential IDs after generation
        return parsedJson.map((q: Question, index: number) => ({ ...q, id: index + 1 }));
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", responseText);
        throw new Error("The AI model returned an invalid JSON format.");
    }
};

import { generateSubjectInstruction } from "../utils/waecGenerator";

export const generateVariationsFromQuestions = async (existingQuestions: Question[], subject: string): Promise<Question[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    // Create a prompt that asks for variations of the existing questions
    const questionsText = existingQuestions.map(q => {
        let questionText = `Question ${q.id}: ${q.question}\n`;
        q.options.forEach((option, index) => {
            questionText += `${String.fromCharCode(65 + index)}. ${option}\n`;
        });
        if (q.bonus) {
            questionText += `Bonus: ${q.bonus.title} - ${q.bonus.content}\n`;
        }
        return questionText;
    }).join('\n\n');

    const variationPrompt = generateSubjectInstruction(subject).replace("\\${questionsText}", questionsText);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: variationPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });
    
    const responseText = response.text.trim();
    if (!responseText) {
         if (response.candidates?.[0]?.finishReason === 'SAFETY') {
            throw new Error("The request was blocked due to safety concerns. Please try again.");
         }
        throw new Error("The AI model returned an empty response. Please try again.");
    }

    try {
        const parsedJson = JSON.parse(responseText);
        // Fix sequential IDs after generation
        return parsedJson.map((q: Question, index: number) => ({ ...q, id: index + 1 }));
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", responseText);
        throw new Error("The AI model returned an invalid JSON format.");
    }
};


export const generateStarterQuestions = async (subject: string): Promise<Question[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    const starterPrompt = generateSubjectInstruction(subject);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: starterPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });
    
    const responseText = response.text.trim();
    if (!responseText) {
         if (response.candidates?.[0]?.finishReason === 'SAFETY') {
            throw new Error("The request was blocked due to safety concerns. Please try again.");
         }
        throw new Error("The AI model returned an empty response. Please try again.");
    }

    try {
        const parsedJson = JSON.parse(responseText);
        // Fix sequential IDs after generation
        return parsedJson.map((q: Question, index: number) => ({ ...q, id: index + 1 }));
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", responseText);
        throw new Error("The AI model returned an invalid JSON format.");
    }
};
