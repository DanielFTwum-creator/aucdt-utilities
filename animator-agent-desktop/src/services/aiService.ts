export interface AISuggestion {
  trackName: string;
  action: 'add_key' | 'remove_key' | 'toggle_key';
  pos: number; // 0-100 relative to segment
  segmentIdx: number;
}

const MOCK_SUGGESTIONS: AISuggestion[] = [
  { trackName: 'VFX_Bloom', action: 'add_key', pos: 50, segmentIdx: 0 },
  { trackName: 'Light_Key', action: 'add_key', pos: 75, segmentIdx: 0 },
];

export async function getAnimationSuggestions(instruction: string, currentTracks: string[]): Promise<AISuggestion[]> {
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
    const base = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
    const res = await fetch(`${base}/api/gemini/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model: 'gemini-2.0-flash' }),
    });
    if (!res.ok) throw new Error(`Proxy ${res.status}`);
    const { text } = await res.json();
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return [];
  } catch (error) {
    console.error('[AIService] Gemini proxy error — using mock:', error);
    return MOCK_SUGGESTIONS;
  }
}
