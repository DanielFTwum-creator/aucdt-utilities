
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image based on a text prompt using the Gemini API.
 * @param userPrompt The user-provided description of the scene.
 * @returns A promise that resolves to the base64 encoded image string.
 */
export const generateImage = async (userPrompt: string): Promise<string> => {
    try {
        const fullPrompt = `Vibrant, dynamic cartoon illustration of Ananse the spider, 
combining African folklore aesthetics with modern animation techniques. 
The scene should feature:
- Rich, saturated colors with dramatic lighting
- Expressive character poses and facial expressions
- Detailed background elements that tell a story
- Visual humor and whimsical details
Style: A mix of traditional African art and contemporary cartoon animation.
Scene: ${userPrompt}
Important: Include at least three surprising visual elements that make the image more engaging and memorable.`;

        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("API did not return any images.");
        }

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return base64ImageBytes;

    } catch (error) {
        console.error("Error generating image with Gemini API:", error);
        if (error instanceof Error) {
            const message = error.message || JSON.stringify(error);
            throw new Error(`Failed to generate image: ${message}`);
        }
        throw new Error("An unknown error occurred during image generation.");
    }
};

/**
 * Generates a sequence of image frames for a short animation by creating a keyframe first.
 * @param userPrompt The user-provided description of the scene.
 * @param onProgress A callback function to report progress (0 to 1).
 * @returns A promise that resolves to an array of base64 encoded image strings.
 */
export const generateAnimationFrames = async (
    userPrompt: string, 
    onProgress: (progress: number) => void
): Promise<string[]> => {
    try {
        onProgress(0);
        const allFrames: string[] = [];

        // Step 1: Generate the first frame, which acts as our keyframe.
        // This ensures a high-quality, accurate start to the animation.
        const firstFrameImage = await generateImage(userPrompt);
        allFrames.push(firstFrameImage);
        onProgress(1 / 15);

        // A small delay before generating prompts can help avoid rate limit issues.
        await new Promise(resolve => setTimeout(resolve, 1100));

        // Step 2: Generate prompts for the remaining 14 frames based on the initial scene.
        const framePromptsResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The first frame of an animation is described as: "${userPrompt}". 
            Act as a professional animator. Create a sequence of fourteen subsequent, detailed visual prompts for a short, fluid animation that continues from this first frame. 
            Each prompt must describe a very small, incremental movement from the last to ensure the final animation is smooth and not jerky. 
            Maintain a consistent style, character, and background throughout all frames.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        frames: {
                            type: Type.ARRAY,
                            description: "An array of fourteen strings, where each string is a detailed prompt for a single animation frame.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["frames"]
                },
            },
        });

        const { frames: subsequentPrompts } = JSON.parse(framePromptsResponse.text.trim());

        if (!subsequentPrompts || !Array.isArray(subsequentPrompts) || subsequentPrompts.length === 0) {
            throw new Error("Failed to generate valid animation frame prompts for subsequent frames.");
        }
        
        const totalFramesToGenerate = subsequentPrompts.length;

        // Step 3: Generate an image for each subsequent prompt sequentially.
        for (let i = 0; i < totalFramesToGenerate; i++) {
            const framePrompt = subsequentPrompts[i];
            const fullPrompt = `Vibrant, dynamic cartoon illustration of Ananse the spider, in a consistent style for an animation sequence. Style: A mix of traditional African art and contemporary cartoon animation, with rich, saturated colors and expressive characters. Scene: ${framePrompt}`;
            
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: fullPrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '16:9',
                },
            });

            if (!response.generatedImages || response.generatedImages.length === 0) {
                throw new Error(`API did not return an image for frame ${i + 2}.`);
            }
            allFrames.push(response.generatedImages[0].image.imageBytes);
            
            // Update progress: The first frame is 1/15, the rest are 14/15 of the work.
            onProgress((i + 2) / 15);

            // Add a delay between requests to respect API rate limits
            if (i < totalFramesToGenerate - 1) {
                await new Promise(resolve => setTimeout(resolve, 1100)); // ~55 RPM
            }
        }

        return allFrames;

    } catch (error) {
        console.error("Error generating animation frames with Gemini API:", error);
        if (error instanceof Error) {
            const message = error.message || JSON.stringify(error);
            throw new Error(`Failed to generate animation: ${message}`);
        }
        throw new Error("An unknown error occurred during animation generation.");
    }
};


/**
 * Generates a two-person dialog based on a scene description.
 * @param scene The scene description.
 * @param char1 Name of the first character.
 * @param char2 Name of the second character.
 * @returns A promise that resolves to an array of dialog lines.
 */
export const generateDialog = async (scene: string, char1: string, char2: string): Promise<{ character: string, line: string }[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a 4-6 line dialog between ${char1} and ${char2} that:
- Advances the story naturally
- Reveals character personalities
- Includes humor or surprise
- Matches the scene tone
Scene: "${scene}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            character: {
                                type: Type.STRING,
                                description: `The character speaking (${char1} or ${char2}).`,
                            },
                            line: {
                                type: Type.STRING,
                                description: "The character's line of dialog with personality.",
                            },
                        },
                        required: ["character", "line"],
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating dialog with Gemini API:", error);
        if (error instanceof Error) {
            const message = error.message || JSON.stringify(error);
            throw new Error(`Failed to generate dialog: ${message}`);
        }
        throw new Error("An unknown error occurred during dialog generation.");
    }
};


/**
 * Generates the next scene description to continue the story.
 * @param currentScene The description of the current scene.
 * @returns A promise that resolves to the new scene description.
 */
export const generateNextScene = async (currentScene: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Previous scene:\n${currentScene}`,
            config: {
                systemInstruction: `Create the next scene that:
1. Introduces a surprising but logical development
2. Increases tension or humor
3. Reveals new character aspects
4. Ends with a hook for the next scene
Format strictly as:
Ananse: [character action/expression]
Visual: [vivid description]
Action: [dynamic story event]`,
            }
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error generating next scene with Gemini API:", error);
        if (error instanceof Error) {
            const message = error.message || JSON.stringify(error);
            throw new Error(`Failed to generate next scene: ${message}`);
        }
        throw new Error("An unknown error occurred during next scene generation.");
    }
};
