import { Type, Chat } from "@google/genai";
import { addLog } from "./auditLogService";
import { isSimulatorEnabled, getSimulatorResponse } from "./simulationService";
import type {
    UiComponent,
    SentimentAnalysisResult,
    EthicalAnalysisResult,
    PersonalizationResult,
    BrandingResult,
    AuthenticityResult
} from '../types';

// All Gemini calls are routed through the backend proxy (FR-SSO-011).
// No API key is present in the browser bundle.
const proxyBase = () => (import.meta.env.BASE_URL?.replace(/\/$/, '') || '');

async function callGeminiProxy(opts: {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  responseMimeType?: string;
  responseSchema?: object;
}): Promise<string> {
  const res = await fetch(`${proxyBase()}/api/gemini/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  });
  if (!res.ok) throw new Error(`Gemini proxy ${res.status}`);
  const { text } = await res.json();
  return text;
}

// Candidate image models to try in order of preference
const IMAGE_GENERATE_MODELS = ['imagen-3.0-generate-001', 'imagen-3.0-fast-generate-001'];
const IMAGE_EDIT_MODELS = ['imagen-3.0-capability-001'];

/**
 * Attempts to call an image API with fallback model support.
 * Tries each model in the list until one succeeds or all fail.
 */
const tryImageModels = async (models: string[], apiCall: (model: string) => Promise<any>): Promise<any> => {
  for (const model of models) {
    try {
      return await apiCall(model);
    } catch (error: any) {
      const errorStr = JSON.stringify(error).toLowerCase();
      // Check for model-specific errors that indicate we should try the next model
      if (errorStr.includes('not found') || 
          errorStr.includes('not supported') || 
          errorStr.includes('unsupported') ||
          errorStr.includes('invalid model')) {
        console.warn(`Image model ${model} failed, trying next model...`);
        continue;
      }
      // Re-throw non-model errors (quota, safety, key, etc.)
      throw error;
    }
  }
  throw new Error('All image models failed');
};


/**
 * Intercepts AI calls if simulator is enabled.
 */
const handleSimulator = async () => {
    if (await isSimulatorEnabled()) {
        const responseType = await getSimulatorResponse();
        if (responseType !== 'SUCCESS') {
            addLog(`Simulating API Error: ${responseType}`);
            throw new Error(responseType);
        }
    }
};

/**
 * Standardizes error responses from the Gemini API into user-friendly codes.
 */
const parseAiError = (error: any): string => {
  console.error("Gemini API Error Detail:", error);
  
  const errorString = JSON.stringify(error).toLowerCase();
  
  // High-priority: Quota/Rate Limits
  if (errorString.includes("quota") || errorString.includes("429") || errorString.includes("rate limit")) {
    return "QUOTA_EXCEEDED";
  }
  
  // Safety blocks
  if (errorString.includes("safety") || errorString.includes("blocked") || errorString.includes("finish_reason_safety")) {
    return "SAFETY_BLOCK";
  }

  // Invalid API Key
  if (errorString.includes("api_key_invalid") || errorString.includes("403") || errorString.includes("unauthorized")) {
    return "INVALID_KEY";
  }
  
  // Model Not Found (404)
  if (errorString.includes("not found") || errorString.includes("404")) {
    return "MODEL_NOT_FOUND";
  }
  
  return "GENERIC_ERROR";
};

/**
 * Wraps a promise in a timeout.
 */
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => 
            setTimeout(() => reject(new Error("GATEWAY_TIMEOUT")), timeoutMs)
        )
    ]);
};

export const generateText = async (prompt: string, systemInstruction?: string): Promise<string> => {
  try {
    await handleSimulator();
    addLog(`Initiating text generation: "${prompt.substring(0, 30)}..."`);
    return await withTimeout(callGeminiProxy({ prompt, systemInstruction, model: 'gemini-1.5-flash' }));
  } catch (error) {
    throw new Error(parseAiError(error));
  }
};

export const generateImage = async (prompt: string, base64Image?: string, mimeType?: string): Promise<string> => {
  try {
    await handleSimulator();
    addLog(`Initiating image generation: "${prompt.substring(0, 30)}..."`);

    const url = (import.meta.env.BASE_URL || '/') + 'api/generate-image';
    const response = await fetch(url.replace('//', '/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, base64Image, mimeType })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "GENERIC_ERROR");
    }
    
    if (data.result) {
      return data.result;
    }
    
    throw new Error("EMPTY_RESPONSE");
  } catch (error: any) {
    throw new Error(parseAiError(error));
  }
};


export const generateVideo = async (_prompt: string): Promise<string> => {
    // Video generation (VEO) requires server-side polling and is not yet proxied.
    // Route through the backend when a /api/gemini/video endpoint is added.
    throw new Error("VIDEO_NOT_AVAILABLE");
};


// Chat is not proxied — returns a stateless function that uses the text proxy per turn.
export const createChat = (): { sendMessage: (msg: string) => Promise<{ response: { text: () => string } }> } => {
  const history: string[] = [];
  const systemInstruction = 'You are an AI assistant for a creative writing tool. Help the user build an interactive story. Keep your responses concise and dramatic, ending with a choice for the user. Use British English throughout.';
  return {
    sendMessage: async (msg: string) => {
      history.push(`User: ${msg}`);
      const prompt = history.join('\n');
      const text = await callGeminiProxy({ prompt, systemInstruction, model: 'gemini-1.5-flash' });
      history.push(`Assistant: ${text}`);
      return { response: { text: () => text } };
    },
  };
};

export const generateUiFromPrompt = async (prompt: string): Promise<UiComponent> => {
    try {
        await handleSimulator();
        addLog(`Initiating UX/UI wireframe generation: "${prompt.substring(0, 30)}..."`);
        const text = await withTimeout(callGeminiProxy({
            prompt: `Based on the following user prompt, generate a JSON object representing a simple UI layout. Use a nested structure with 'type', 'props', and 'children' keys. Supported types are 'container', 'text', 'button', 'input', 'image'. Prompt: "${prompt}"`,
            model: 'gemini-1.5-flash',
            responseMimeType: 'application/json',
        }));
        return JSON.parse(text.trim()) as UiComponent;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
};

export const analyzeSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
    try {
        await handleSimulator();
        addLog(`Initiating sentiment analysis: "${text.substring(0, 30)}..."`);
        const result = await callGeminiProxy({
            prompt: `Analyse the sentiment of the following text. Use British English in your response. Respond with a JSON object containing 'sentiment' ("Positive", "Negative", or "Neutral"), 'confidence' (a number between 0 and 1), and a brief 'explanation'. Text: "${text}"`,
            model: 'gemini-1.5-flash',
            responseMimeType: 'application/json',
        });
        return JSON.parse(result.trim()) as SentimentAnalysisResult;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
};

export const analyzeEthics = async (prompt: string): Promise<EthicalAnalysisResult> => {
    try {
        await handleSimulator();
        addLog(`Initiating ethical risk assessment: "${prompt.substring(0, 30)}..."`);
        const result = await callGeminiProxy({
            prompt: `Analyse the following design or campaign idea for ethical concerns. Respond with a JSON object. The root object should have a 'summary' string and a 'concerns' array. Each item in 'concerns' should have 'issue' (a title), 'severity' ('Low', 'Medium', or 'High'), and a detailed 'explanation'. Idea: "${prompt}"`,
            systemInstruction: `You are an AI ethics expert specialising in Digital Media and Communication Design. Analyse the user's prompt for potential ethical issues such as bias, dark patterns, misinformation, or manipulative design. Provide a structured JSON response. Use British English throughout.`,
            model: 'gemini-1.5-flash',
            responseMimeType: 'application/json',
        });
        return JSON.parse(result.trim()) as EthicalAnalysisResult;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
}

export const personalizeContent = async (audience: string, product: string): Promise<PersonalizationResult> => {
    try {
        await handleSimulator();
        addLog(`Initiating personalization for audience: "${audience}"`);
        const result = await callGeminiProxy({
            prompt: `Generate 3 variations of marketing copy for a product called "${product}" tailored to the following audience: "${audience}". For each variation, provide the 'persona', the 'copy', and the 'rationale' for why it works for that persona. Use British English throughout. Respond with a JSON object containing a 'variants' array.`,
            model: 'gemini-1.5-flash',
            responseMimeType: 'application/json',
        });
        return JSON.parse(result.trim()) as PersonalizationResult;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
};

export const generateBrandingIdentity = async (brandName: string, values: string): Promise<BrandingResult> => {
    try {
        await handleSimulator();
        addLog(`Initiating brand identity generation for: "${brandName}"`);
        const result = await callGeminiProxy({
            prompt: `Develop a brand identity for "${brandName}" based on these core values: "${values}". Include a 'manifesto' (vision statement), a 'colourPalette' (array of 3 objects with 'hex', 'name', and 'reason'), and a 'logoConcept' (detailed text description). Use British English throughout. Respond with a JSON object.`,
            model: 'gemini-1.5-flash',
            responseMimeType: 'application/json',
        });
        return JSON.parse(result.trim()) as BrandingResult;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
};

export const analyzeAuthenticity = async (mediaClaim: string): Promise<AuthenticityResult> => {
    try {
        await handleSimulator();
        addLog(`Initiating authenticity analysis for claim: "${mediaClaim.substring(0, 30)}..."`);
        const result = await callGeminiProxy({
            prompt: `Perform a forensic authenticity analysis of the following media claim: "${mediaClaim}". Provide a 'score' (0 to 100, where 100 is likely authentic), an array of 'flags' (potential AI indicators or red flags), a detailed 'analysis', and a final 'verdict' ("Likely Authentic", "Potentially Synthetic", or "Highly Suspicious"). Use British English throughout. Respond with a JSON object.`,
            model: 'gemini-1.5-flash',
            responseMimeType: 'application/json',
        });
        return JSON.parse(result.trim()) as AuthenticityResult;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
};

