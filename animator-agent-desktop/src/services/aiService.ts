import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface AISuggestion {
  trackName: string;
  action: 'add_key' | 'remove_key' | 'toggle_key';
  pos: number; // 0-100 relative to segment
  segmentIdx: number;
}

export async function getAnimationSuggestions(instruction: string, currentTracks: string[]): Promise<AISuggestion[]> {
  if (!genAI) {
    console.warn('[AIService] Gemini API Key not found. Returning mock response.');
    return [
      { trackName: 'VFX_Bloom', action: 'add_key', pos: 50, segmentIdx: 0 },
      { trackName: 'Light_Key', action: 'add_key', pos: 75, segmentIdx: 0 }
    ];
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
    You are an AI Animation Assistant for Techbridge University College.
    The user is working on an animation with the following tracks: ${currentTracks.join(', ')}.
    
    Instruction: "${instruction}"
    
    Based on this instruction, suggest 1-3 keyframe modifications.
    Return ONLY a JSON array of suggestions with the following structure:
    [
      { "trackName": "string", "action": "add_key" | "remove_key" | "toggle_key", "pos": number (0-100), "segmentIdx": number }
    ]
    
    Rules:
    - pos must be between 0 and 100.
    - segmentIdx is usually 0 for this project.
    - trackName must be one of the available tracks.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from potential markdown blocks
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('[AIService] Gemini error:', error);
    return [];
  }
}
