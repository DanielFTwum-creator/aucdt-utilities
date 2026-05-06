
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    // This check is for robust development, assuming the environment variable is set in production.
    console.warn("API_KEY environment variable is not set. The application might not work as expected.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const TOTAL_FRAMES = 12;
const MAX_FRAMES_PER_CALL = 4; // The API's limit

export const generateAnimationFrames = async (prompt: string): Promise<string[]> => {
    try {
        const fullPrompt = `Generate a sequence of animation frames for a short GIF. The frames should be a continuous progression of the action.
        Style: simple, clean, flat cartoon vector art.
        Background: consistent, simple, light-colored, and unchanging between frames.
        Action: "${prompt}"`;

        const numCalls = Math.ceil(TOTAL_FRAMES / MAX_FRAMES_PER_CALL);
        const apiCalls = [];

        for (let i = 0; i < numCalls; i++) {
            apiCalls.push(ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: fullPrompt,
                config: {
                    numberOfImages: MAX_FRAMES_PER_CALL,
                    outputMimeType: 'image/png',
                    aspectRatio: '1:1',
                },
            }));
        }

        const responses = await Promise.all(apiCalls);
        
        const allFrames = responses.flatMap(response => {
            if (!response.generatedImages || response.generatedImages.length === 0) {
                return [];
            }
            return response.generatedImages.map(img => {
                const base64ImageBytes: string = img.image.imageBytes;
                if (!base64ImageBytes) {
                    throw new Error("Received an empty image frame from the API.");
                }
                return `data:image/png;base64,${base64ImageBytes}`;
            });
        });

        if (allFrames.length < TOTAL_FRAMES) {
             throw new Error(`The API returned fewer frames (${allFrames.length}) than requested (${TOTAL_FRAMES}). Please try again.`);
        }

        return allFrames.slice(0, TOTAL_FRAMES);

    } catch (error) {
        console.error("Error generating animation frames:", error);
        if (error instanceof Error) {
            // Provide a more user-friendly message
            if (error.message.includes('API key')) {
                 throw new Error('The application is not configured correctly. Missing API Key.');
            }
            throw new Error(`Failed to generate animation: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the animation.");
    }
};
