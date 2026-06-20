/**
 * English Safari — Gemini Service (Frontend)
 * @description Calls the backend proxy for AI story generation.
 * @pattern Follows biochemai: API key stays server-side, frontend calls /api/gemini/*.
 */

export interface StoryQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GeneratedStory {
  title: string;
  story: string;
  grammarFocus: string;
  question: StoryQuestion;
}

/**
 * Generates a culturally relevant Ghanaian story with a comprehension question.
 * Calls the backend proxy which holds the Gemini API key.
 */
export const generateStory = async (topic?: string): Promise<GeneratedStory> => {
  try {
    const res = await fetch('/english-safari/api/gemini/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
    return await res.json();
  } catch (error: any) {
    console.error("[EnglishSafari] Story generation failed:", error.message);
    throw new Error("Could not generate a story right now. Please try again!");
  }
};
