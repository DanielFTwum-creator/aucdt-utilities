import { GoogleGenAI } from "@google/genai";
import { Suggestion } from "../types";

const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey: apiKey || "" });
};

export const getRentalSuggestions = async (query: string, location: { latitude: number, longitude: number } | null): Promise<{ suggestions: Suggestion[], rawResponse: string }> => {
  const ai = getAiClient();
  if (!process.env.API_KEY) {
      throw new Error("Gemini API key is not configured.");
  }

  const model = 'gemini-2.5-flash';
  
  const toolConfig = location ? {
      retrievalConfig: {
        latLng: location
      }
  } : undefined;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Based on my current location, what are some good suggestions for: "${query}". I'm looking for ideas for a trip in Ghana. Keep the response concise and friendly.`,
      config: {
          tools: [{googleMaps: {}}],
          toolConfig,
      }
    });

    const rawResponse = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    
    let suggestions: Suggestion[] = [];
    if (groundingMetadata?.groundingChunks?.length) {
        suggestions = groundingMetadata.groundingChunks
            .map((chunk: any) => ({
                title: chunk.maps?.title || 'Suggestion',
                description: chunk.maps?.placeAnswerSources?.reviewSnippets?.[0] || 'View on map for details.',
                mapUrl: chunk.maps?.uri
            }))
            .filter((s: Suggestion) => s.mapUrl);
    }
    
    return { suggestions, rawResponse };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("The configured Gemini API key is invalid. Please check your configuration.");
        }
        throw new Error(`An issue occurred while getting suggestions: ${error.message}`);
    }
    throw new Error("An unknown error occurred while getting suggestions.");
  }
};
