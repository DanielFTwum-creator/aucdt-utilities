// AI activity generator for PlayGrow mini-games. Calls the app's server-side
// relay (/api/generate) which forwards to the central WMS Gemini proxy. No
// Gemini API key is present in this bundle.

export interface Activity {
  title: string;
  intro: string;
  steps: string[];
  question: string;
  funFact: string;
}

const activitySchema = {
  type: 'OBJECT',
  properties: {
    title:    { type: 'STRING', description: 'A short, playful name for the activity.' },
    intro:    { type: 'STRING', description: 'One friendly sentence introducing the activity to a young child.' },
    steps:    { type: 'ARRAY', items: { type: 'STRING' }, description: '2-4 very simple, safe steps a child can follow with a grown-up.' },
    question: { type: 'STRING', description: 'One playful question that invites the child to respond.' },
    funFact:  { type: 'STRING', description: 'One short, age-appropriate fun fact related to the activity.' },
  },
  required: ['title', 'intro', 'steps', 'question', 'funFact'],
};

/**
 * Generate a short, age-appropriate activity for a mini-game in a developmental
 * zone (e.g. Language, Cognitive). Returns structured, child-safe content.
 */
export async function generateActivity(
  zoneTitle: string,
  gameTitle: string,
  gameDescription: string
): Promise<Activity> {
  const prompt = `
You are a warm, encouraging early-childhood educator creating a tiny play activity
for a child aged 3-7 in the "${zoneTitle}" developmental zone.

Mini-game: "${gameTitle}" — ${gameDescription}

Create ONE short, safe, screen-free-friendly activity the child can do, ideally with
a grown-up nearby. Keep language simple and joyful. No external materials beyond
common household items. Absolutely nothing unsafe. Respond as JSON matching the schema.
`.trim();

  // Mount-aware API base: the app is served under /playgrow/, so the relay must
  // be called at /playgrow/api/generate (a root-absolute /api/generate 404s).
  const apiBase = (() => {
    if (typeof window === 'undefined') return '';
    const seg = window.location.pathname.split('/').filter(Boolean)[0];
    return seg ? `/${seg}` : '';
  })();

  const res = await fetch(`${apiBase}/api/generate?model=gemini-2.5-flash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: activitySchema,
        temperature: 0.9,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Activity service returned ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const jsonText: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!jsonText) throw new Error('Empty response from the activity service.');

  const parsed = JSON.parse(jsonText.trim());
  if (!parsed?.title || !Array.isArray(parsed?.steps)) {
    throw new Error('Invalid activity format from AI.');
  }
  return parsed as Activity;
}
