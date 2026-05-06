
import { GoogleGenAI, Type } from "@google/genai";
import { BRAND_GUIDELINES_PROMPT, SRS_TO_LATEX_PROMPT } from '../constants';
import type { AnalysisReport } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallCompliance: {
            type: Type.STRING,
            enum: ['COMPLIANT', 'NEEDS_REVIEW', 'NON_COMPLIANT'],
            description: 'Overall compliance status of the image.'
        },
        complianceDetails: {
            type: Type.ARRAY,
            description: 'A detailed breakdown of compliance by category.',
            items: {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING,
                        description: 'The brand guideline category (e.g., Logo Usage, Colour Palette).'
                    },
                    compliant: {
                        type: Type.BOOLEAN,
                        description: 'Whether the image is compliant in this category.'
                    },
                    reasoning: {
                        type: Type.STRING,
                        description: 'A detailed explanation for the compliance status in this category.'
                    }
                },
                 propertyOrdering: ["category", "compliant", "reasoning"],
            }
        },
        suggestions: {
            type: Type.STRING,
            description: 'Actionable suggestions to improve brand compliance.'
        }
    },
    propertyOrdering: ["overallCompliance", "complianceDetails", "suggestions"],
};

export const analyzeImageForBrandCompliance = async (imageBase64: string): Promise<AnalysisReport> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
        },
    };

    const textPart = {
        text: BRAND_GUIDELINES_PROMPT
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as AnalysisReport;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
};

export const convertSrsToLatex = async (srsText: string): Promise<string> => {
    const prompt = SRS_TO_LATEX_PROMPT.replace('[SRS_TEXT_PLACEHOLDER]', srsText);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.1, 
            }
        });

        const latexCode = response.text.trim();
        return latexCode.replace(/^```latex\n/, '').replace(/\n```$/, '');
    } catch (error) {
        console.error("Error calling Gemini API for LaTeX conversion:", error);
        throw new Error("Failed to convert SRS to LaTeX via Gemini API.");
    }
};