import { GoogleGenAI } from "@google/genai";
import { flyerData } from '../constants';

// The API key is assumed to be set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the Google Gemini API based on a given prompt.
 * @param {string} prompt - The text prompt to generate the image from.
 * @returns {Promise<string>} A promise that resolves to a base64 encoded data URL of the generated JPEG image.
 * @throws {Error} Throws an error if the image generation fails, or if the API returns no images.
 */
export const generateFlyerImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: flyerData.aspect_ratio as "1:1" | "9:16" | "16:9" | "4:3" | "3:4",
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Image generation failed, no images returned.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error("The provided API Key is invalid. Please check your environment variables.");
    }
    throw new Error("Failed to generate flyer image. Please check the console for details.");
  }
};