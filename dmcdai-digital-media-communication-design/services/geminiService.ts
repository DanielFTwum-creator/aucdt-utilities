import { GoogleGenAI, Modality, Type, Chat, StyleReferenceImage } from "@google/genai";
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

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Default client — v1beta (chat, text, etc.)
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Imagen 3 is GA and served from v1
const imageAi = new GoogleGenAI({ apiKey: API_KEY, httpOptions: { apiVersion: 'v1' } });

// VEO video generation requires v1alpha
const videoAi = new GoogleGenAI({ apiKey: API_KEY, httpOptions: { apiVersion: 'v1alpha' } });

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
    const response = await withTimeout(ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        ...(systemInstruction && { systemInstruction }),
      }
    }));
    return response.text;
  } catch (error) {
    throw new Error(parseAiError(error));
  }
};

export const generateImage = async (prompt: string, base64Image?: string, mimeType?: string): Promise<string> => {
  try {
    await handleSimulator();
    addLog(`Initiating image generation: "${prompt.substring(0, 30)}..."`);

    let response;
    if (base64Image && mimeType) {
      // Image editing with reference
      response = await tryImageModels(IMAGE_EDIT_MODELS, async (model) => {
        const styleRef = new StyleReferenceImage();
        styleRef.referenceImage = { imageBytes: base64Image, mimeType };
        return await imageAi.models.editImage({
          model,
          prompt,
          referenceImages: [styleRef],
          config: { numberOfImages: 1 },
        });
      });
    } else {
      // Text-to-image generation
      response = await tryImageModels(IMAGE_GENERATE_MODELS, async (model) => {
        return await imageAi.models.generateImages({
          model,
          prompt,
          config: { numberOfImages: 1 },
        });
      });
    }

    // Extract the generated image
    const generatedImage = response.generatedImages?.[0];
    if (generatedImage?.image?.imageBytes) {
      return `data:image/png;base64,${generatedImage.image.imageBytes}`;
    }
    
    throw new Error("EMPTY_RESPONSE");
  } catch (error: any) {
    throw new Error(parseAiError(error));
  }
};


export const generateVideo = async (prompt: string) => {
    try {
        await handleSimulator();
        addLog(`Initiating video production: "${prompt.substring(0, 30)}..."`);
        let operation = await withTimeout(videoAi.models.generateVideos({
            model: 'veo-2.0-generate',
            prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        }));

        let attempts = 0;
        const maxAttempts = 12; // 2 minutes total wait
        while (!operation.done && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await withTimeout(videoAi.operations.getVideosOperation({ operation: operation }));
            attempts++;
        }

        if (!operation.done) {
            throw new Error("VIDEO_PROCESSING_TIMEOUT");
        }
        
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            const response = await fetch(`${downloadLink}&key=${API_KEY}`);
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }
        throw new Error("EMPTY_RESPONSE");
    } catch (error) {
        throw new Error(parseAiError(error));
    }
};


export const createChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-1.5-flash',
    config: {
      systemInstruction: 'You are an AI assistant for a creative writing tool. Help the user build an interactive story. Keep your responses concise and dramatic, ending with a choice for the user. Use British English throughout.',
    },
  });
};

export const generateUiFromPrompt = async (prompt: string): Promise<UiComponent> => {
    try {
        await handleSimulator();
        addLog(`Initiating UX/UI wireframe generation: "${prompt.substring(0, 30)}..."`);
        const response = await withTimeout(ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `Based on the following user prompt, generate a JSON object representing a simple UI layout. Use a nested structure with 'type', 'props', and 'children' keys. Supported types are 'container', 'text', 'button', 'input', 'image'. Prompt: "${prompt}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING },
                        props: { type: Type.OBJECT },
                        children: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING },
                                    props: { type: Type.OBJECT },
                                    content: { type: Type.STRING },
                                    children: {
                                        type: Type.ARRAY,
                                        items: { 
                                            type: Type.OBJECT,
                                            properties: {
                                                type: { type: Type.STRING },
                                                props: { type: Type.OBJECT },
                                                content: { type: Type.STRING },
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }));
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as UiComponent;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
};

export const analyzeSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
    try {
        await handleSimulator();
        addLog(`Initiating sentiment analysis: "${text.substring(0, 30)}..."`);
        const prompt = `Analyse the sentiment of the following text. Use British English in your response. Respond with a JSON object containing 'sentiment' ("Positive", "Negative", or "Neutral"), 'confidence' (a number between 0 and 1), and a brief 'explanation'. Text: "${text}"`;
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sentiment: { type: Type.STRING },
                        confidence: { type: Type.NUMBER },
                        explanation: { type: Type.STRING }
                    },
                    required: ["sentiment", "confidence", "explanation"]
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SentimentAnalysisResult;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
};

export const analyzeEthics = async (prompt: string): Promise<EthicalAnalysisResult> => {
    const systemInstruction = `You are an AI ethics expert specialising in Digital Media and Communication Design. Analyse the user's prompt for potential ethical issues such as bias, dark patterns, misinformation, or manipulative design. Provide a structured JSON response. Use British English throughout.`;
    const fullPrompt = `Analyse the following design or campaign idea for ethical concerns. Respond with a JSON object. The root object should have a 'summary' string and a 'concerns' array. Each item in 'concerns' should have 'issue' (a title), 'severity' ('Low', 'Medium', or 'High'), and a detailed 'explanation'. Idea: "${prompt}"`;

    try {
        await handleSimulator();
        addLog(`Initiating ethical risk assessment: "${prompt.substring(0, 30)}..."`);
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: fullPrompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        concerns: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    issue: { type: Type.STRING },
                                    severity: { type: Type.STRING },
                                    explanation: { type: Type.STRING }
                                },
                                required: ["issue", "severity", "explanation"]
                            }
                        }
                    },
                    required: ["summary", "concerns"]
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as EthicalAnalysisResult;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
}

export const personalizeContent = async (audience: string, product: string): Promise<PersonalizationResult> => {
    try {
        await handleSimulator();
        addLog(`Initiating personalization for audience: "${audience}"`);
        const prompt = `Generate 3 variations of marketing copy for a product called "${product}" tailored to the following audience: "${audience}". For each variation, provide the 'persona', the 'copy', and the 'rationale' for why it works for that persona. Use British English throughout. Respond with a JSON object containing a 'variants' array.`;
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        variants: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    persona: { type: Type.STRING },
                                    copy: { type: Type.STRING },
                                    rationale: { type: Type.STRING }
                                },
                                required: ["persona", "copy", "rationale"]
                            }
                        }
                    },
                    required: ["variants"]
                }
            }
        });
        return JSON.parse(response.text.trim()) as PersonalizationResult;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
};

export const generateBrandingIdentity = async (brandName: string, values: string): Promise<BrandingResult> => {
    try {
        await handleSimulator();
        addLog(`Initiating brand identity generation for: "${brandName}"`);
        const prompt = `Develop a brand identity for "${brandName}" based on these core values: "${values}". Include a 'manifesto' (vision statement), a 'colourPalette' (array of 3 objects with 'hex', 'name', and 'reason'), and a 'logoConcept' (detailed text description). Use British English throughout. Respond with a JSON object.`;
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        manifesto: { type: Type.STRING },
                        colorPalette: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    hex: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    reason: { type: Type.STRING }
                                },
                                required: ["hex", "name", "reason"]
                            }
                        },
                        logoConcept: { type: Type.STRING }
                    },
                    required: ["manifesto", "colorPalette", "logoConcept"]
                }
            }
        });
        return JSON.parse(response.text.trim()) as BrandingResult;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
};

export const analyzeAuthenticity = async (mediaClaim: string): Promise<AuthenticityResult> => {
    try {
        await handleSimulator();
        addLog(`Initiating authenticity analysis for claim: "${mediaClaim.substring(0, 30)}..."`);
        const prompt = `Perform a forensic authenticity analysis of the following media claim: "${mediaClaim}". Provide a 'score' (0 to 100, where 100 is likely authentic), an array of 'flags' (potential AI indicators or red flags), a detailed 'analysis', and a final 'verdict' ("Likely Authentic", "Potentially Synthetic", or "Highly Suspicious"). Use British English throughout. Respond with a JSON object.`;
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        flags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        analysis: { type: Type.STRING },
                        verdict: { type: Type.STRING }
                    },
                    required: ["score", "flags", "analysis", "verdict"]
                }
            }
        });
        return JSON.parse(response.text.trim()) as AuthenticityResult;
    } catch (error) {
        throw new Error(parseAiError(error));
    }
};

