import { GoogleGenAI } from "@google/genai";
import { TriptychVariation, AspectRatio, ImageResolution } from "../types";

// Initialize the Gemini API client
// API Key is expected to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GeneratePosterParams {
  variation: TriptychVariation;
  aspectRatio: AspectRatio;
  resolution: ImageResolution;
}

export const generatePosterImage = async ({
  variation,
  aspectRatio,
  resolution,
}: GeneratePosterParams): Promise<string> => {
  try {
    // Construct a rich prompt that enforces the poster quality and combines all attributes
    const finalPrompt = `
      Create a photorealistic, ultra-detailed poster visualization.
      SUBJECT: ${variation.prompt}
      
      STYLE DETAILS: ${variation.style}
      
      CAMERA & ANGLE: ${variation.camera}
      
      LIGHTING SETUP: ${variation.lighting}
      
      ATMOSPHERE & MOOD: ${variation.mood}
      
      QUALITY: 8k resolution, architectural photography, unreal engine 5 render, vivid colors, sharp focus, museum quality print.
    `.trim();

    // Use gemini-3-pro-image-preview for high resolution (2K/4K) support
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution,
        },
      },
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};