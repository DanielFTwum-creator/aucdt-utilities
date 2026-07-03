import { BRAND_GUIDELINES_PROMPT, SRS_TO_LATEX_PROMPT } from '../constants';
import type { AnalysisReport } from '../types';

// All Gemini calls run server-side via the WMS relay (Pattern 11); this bundle
// holds no key and no SDK. Raw generateContent bodies (REST shapes, string type
// names) are posted to the app backend, which relays them to WMS.
const API_BASE = window.location.pathname.startsWith('/brand-guideline-checker')
    ? '/brand-guideline-checker/api'
    : '/api';

interface GeminiResponse {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

const callGemini = async (body: unknown): Promise<string> => {
    const response = await fetch(`${API_BASE}/gemini/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gemini-2.5-flash', body }),
    });
    if (!response.ok) throw new Error(`AI request failed: ${response.status}`);
    const data = (await response.json()) as GeminiResponse;
    return (data.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? '').join('');
};

const responseSchema = {
    type: 'OBJECT',
    properties: {
        overallCompliance: {
            type: 'STRING',
            enum: ['COMPLIANT', 'NEEDS_REVIEW', 'NON_COMPLIANT'],
            description: 'Overall compliance status of the image.'
        },
        complianceDetails: {
            type: 'ARRAY',
            description: 'A detailed breakdown of compliance by category.',
            items: {
                type: 'OBJECT',
                properties: {
                    category: {
                        type: 'STRING',
                        description: 'The brand guideline category (e.g., Logo Usage, Colour Palette).'
                    },
                    compliant: {
                        type: 'BOOLEAN',
                        description: 'Whether the image is compliant in this category.'
                    },
                    reasoning: {
                        type: 'STRING',
                        description: 'A detailed explanation for the compliance status in this category.'
                    }
                },
                propertyOrdering: ["category", "compliant", "reasoning"],
            }
        },
        suggestions: {
            type: 'STRING',
            description: 'Actionable suggestions to improve brand compliance.'
        }
    },
    propertyOrdering: ["overallCompliance", "complianceDetails", "suggestions"],
};

export const analyzeImageForBrandCompliance = async (imageBase64: string): Promise<AnalysisReport> => {
    try {
        const text = await callGemini({
            contents: [{
                role: 'user',
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                    { text: BRAND_GUIDELINES_PROMPT },
                ],
            }],
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });
        return JSON.parse(text.trim()) as AnalysisReport;
    } catch (error) {
        console.error('Error calling Gemini relay:', error);
        throw new Error('Failed to get analysis from the AI service.');
    }
};

export const convertSrsToLatex = async (srsText: string): Promise<string> => {
    const prompt = SRS_TO_LATEX_PROMPT.replace('[SRS_TEXT_PLACEHOLDER]', srsText);

    try {
        const text = await callGemini({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1 },
        });
        return text.trim().replace(/^```latex\n/, '').replace(/\n```$/, '');
    } catch (error) {
        console.error('Error calling Gemini relay for LaTeX conversion:', error);
        throw new Error('Failed to convert SRS to LaTeX via the AI service.');
    }
};
