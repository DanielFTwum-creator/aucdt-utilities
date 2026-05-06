

// Fix: Import types from App.tsx where they are now defined.
import { GeneratedContent, Platform, GeminiModel } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

// This function centralizes error handling for API calls to our backend server.
const handleApiError = async (response: Response, context: string): Promise<Error> => {
  // If we get a JSON error response from our server, use that message
  if (response.headers.get('content-type')?.includes('application/json')) {
      try {
        const errorData = await response.json();
        return new Error(errorData.error || `An unexpected error occurred while ${context}.`);
      } catch (e) {
        // Fallback if JSON parsing fails
        return new Error(`An error occurred while parsing the error response from the server (HTTP ${response.status}).`);
      }
  }
  // Otherwise, handle it as a generic network/HTTP error
  return new Error(`A network error occurred (HTTP ${response.status}). Please ensure the local server is running and try again.`);
};


export const generateMarketingContent = async (
  prompt: string,
  brandVoice: string,
  platforms: Platform[],
  model: GeminiModel,
  emailVariantCount: number
): Promise<GeneratedContent[]> => {
    const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, brandVoice, platforms, model, emailVariantCount }),
    });

    if (!response.ok) {
        throw await handleApiError(response, "generating content");
    }
    return await response.json();
};

export const editImageWithPrompt = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string,
): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/edit-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64ImageData, mimeType, prompt }),
    });

    if (!response.ok) {
        throw await handleApiError(response, "editing the image");
    }
    const data = await response.json();
    return data.imageUrl; // The server will return { imageUrl: "data:..." }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/generate-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw await handleApiError(response, 'generating an image');
  }
  const data = await response.json();
  return data.imageUrl;
};