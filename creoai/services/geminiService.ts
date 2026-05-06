import { GoogleGenAI, Modality } from "@google/genai";

type AspectRatio = "1:1" | "9:16" | "16:9" | "4:3" | "3:4";


/**
 * Generates an image using gemini-2.5-flash-image as a fallback.
 * @param {string} prompt - The text prompt to generate the image from.
 * @param {AspectRatio} aspectRatio - The desired aspect ratio for the generated image.
 * @returns {Promise<string>} A promise that resolves to a base64 encoded data URL of the generated image.
 */
const generateWithNanoBanana = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  console.log("Falling back to gemini-2.5-flash-image (nanobanana)...");
  // A new AI instance is created here as the primary one might be configured differently.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // Add aspect ratio instruction to the prompt as it's not a config option for this model
    const augmentedPrompt = `${prompt}. The image must have a ${aspectRatio} aspect ratio.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: augmentedPrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType; // e.g., 'image/png'
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("Fallback generation failed: no image data in response.");
  } catch (fallbackError) {
    console.error("Error during fallback image generation:", fallbackError);
    throw new Error("Primary and fallback image generation failed. Please check your API key and connection.");
  }
};


/**
 * Generates an image using the Google Gemini API based on a given prompt.
 * It first tries Imagen and falls back to gemini-2.5-flash-image on billing errors.
 * @param {string} prompt - The text prompt to generate the image from.
 * @param {AspectRatio} aspectRatio - The desired aspect ratio for the generated image.
 * @returns {Promise<string>} A promise that resolves to a base64 encoded data URL of the generated JPEG image.
 * @throws {Error} Throws an error if the image generation fails, or if the API returns no images.
 */
export const generateFlyerImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Image generation failed, no images returned.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini (Imagen):", error);
    
    const errorString = String(error);

    if (errorString.includes('billed users')) {
      console.warn("Imagen failed due to a billing issue. Attempting fallback to gemini-2.5-flash-image.");
      return generateWithNanoBanana(prompt, aspectRatio);
    }
    
    if (errorString.includes('API key not valid')) {
       throw new Error("The provided API Key is invalid. Please check your environment variables.");
    }

    throw new Error("Failed to generate flyer image. Please check the console for details.");
  }
};


/**
 * Generates a video using the Google Gemini API (Veo) based on a prompt.
 * @param {string} prompt - The text prompt to generate the video from.
 * @returns {Promise<string>} A promise that resolves to a local object URL for the generated MP4 video.
 * @throws {Error} Throws an error if the video generation fails.
 */
export const generateFlyerVideo = async (prompt: string): Promise<string> => {
  // A new AI instance is created right before the call to ensure the latest API key from the dialog is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    console.log("Starting video generation with Veo...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16' // Matches our flyer aspect ratio
      }
    });

    console.log("Polling for video generation status...");
    while (!operation.done) {
      // Wait for 10 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      // FIX: The 'GenerateVideosOperation' type does not have a 'state' property.
      // Log the entire operation object for debugging.
      console.log('Current operation:', operation);
    }

    if (operation.response?.generatedVideos && operation.response.generatedVideos.length > 0) {
      const downloadLink = operation.response.generatedVideos[0].video?.uri;
      if (!downloadLink) {
        throw new Error("Video generation succeeded, but no download link was provided.");
      }
      
      console.log("Fetching video from download link...");
      // The API key must be appended to the download URL
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!response.ok) {
        throw new Error(`Failed to download video file: ${response.statusText}`);
      }
      
      const videoBlob = await response.blob();
      const objectUrl = URL.createObjectURL(videoBlob);
      console.log("Video generation complete. Object URL created.");
      return objectUrl;

    } else {
      console.error("Video generation operation finished but no video was returned.", operation);
      throw new Error("Video generation failed. The operation completed but did not return a video.");
    }

  } catch (error) {
    console.error("Error generating video with Gemini (Veo):", error);
    const errorString = String(error);

    if (errorString.includes('API key not valid')) {
       throw new Error("The provided API Key is invalid. Please check your environment variables or select a new key.");
    }
    
    if (errorString.includes('Requested entity was not found')) {
       throw new Error("Requested entity was not found. Your API Key may be invalid or expired. Please select a new one.");
    }

    throw new Error(`Failed to generate flyer video: ${errorString}`);
  }
};
