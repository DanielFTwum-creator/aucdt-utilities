/**
 * English Safari — Backend Gemini Proxy
 * @description Proxies Gemini API calls so the API key never reaches the browser.
 * @pattern  Follows the fleet-standard WMS key-proxy pattern (FR-SSO-011).
 *           The Gemini API key is never stored here — it is fetched at request
 *           time from wms.techbridge.edu.gh using GEMINI_PROXY_KEY for auth.
 */

import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config({ path: ".env.local" });
dotenv.config();

// --- Gemini key custody: fetched from the WMS proxy, never stored here (FR-SSO-011) ---
// WMS is the single rotation point. Cached in memory with a 6-hour TTL.
const WMS_KEY_URL = 'https://wms.techbridge.edu.gh/api/gemini/key';
const KEY_TTL_MS  = 6 * 60 * 60 * 1000;
let cachedGeminiKey: string | null = null;
let keyFetchedAt = 0;

function invalidateGeminiKey() { cachedGeminiKey = null; keyFetchedAt = 0; }

async function getGeminiKey(): Promise<string> {
  if (cachedGeminiKey && Date.now() - keyFetchedAt < KEY_TTL_MS) return cachedGeminiKey;
  const proxyKey = process.env.GEMINI_PROXY_KEY;
  if (!proxyKey) {
    // Local dev fallback only — production must set GEMINI_PROXY_KEY.
    const local = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (local) return local;
    throw new Error('GEMINI_PROXY_KEY is not set (and no local key fallback).');
  }
  const r = await fetch(WMS_KEY_URL, { headers: { 'X-Gemini-Proxy-Key': proxyKey } });
  if (!r.ok) throw new Error(`WMS key fetch failed: ${r.status} ${await r.text()}`);
  cachedGeminiKey = (await r.json()).apiKey;
  keyFetchedAt = Date.now();
  return cachedGeminiKey!;
}

const PORT = Number(process.env.PORT) || 3005;
const MODEL = "gemini-2.5-flash";

if (!process.env.GEMINI_PROXY_KEY) {
  console.warn("[EnglishSafari] WARNING: GEMINI_PROXY_KEY not set — AI routes will use local fallback or fail");
}

const app = express();
app.use(express.json({ limit: "1mb" }));

// ─── Story Generation ────────────────────────────────────────────────────────
// POST /api/gemini/story
// Body: { topic?: string }
// Returns: { title, story, grammarFocus, question }
app.post(["/api/gemini/story", "/english-safari/api/gemini/story"], async (req, res) => {
  const { topic } = req.body ?? {};

  const systemInstruction = `
    You are a friendly English teacher for Ghanaian primary school children (ages 6-10).
    Your mission is to create short, fun, culturally relevant stories that help children
    practise English grammar and reading comprehension.

    ## STORY REQUIREMENTS
    - Write a SHORT story (2-3 paragraphs, 80-120 words max).
    - Use simple, age-appropriate English.
    - Set stories in Ghana: use local names (Ama, Kofi, Kwame, Abena, Yaa, Kwesi),
      local foods (jollof rice, banku, kelewele, kenkey), local places (Accra, Kumasi,
      Cape Coast, the market, the farm), and local culture (kente, festivals, family).
    - Focus on practising ONE grammar concept per story (e.g., present tense "has/have",
      future tense "will have", past tense "had", pronouns, prepositions).
    - Make the story warm, positive, and encouraging.

    ## OUTPUT FORMAT
    Return ONLY valid JSON with this exact structure:
    {
      "title": "Story title",
      "story": "The full story text...",
      "grammarFocus": "The grammar concept being practised",
      "question": {
        "text": "A reading comprehension question about the story",
        "options": ["Option A", "Option B", "Option C"],
        "correctIndex": 0,
        "explanation": "Why this answer is correct"
      }
    }
  `;

  try {
    const geminiKey = await getGeminiKey().catch((err: any) => {
      console.error('[EnglishSafari] Key fetch failed:', err.message);
      return null;
    });
    if (!geminiKey) return res.status(503).json({ error: 'AI service temporarily unavailable' });

    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const prompt = topic
      ? `Write a short story for Ghanaian children about: ${topic}`
      : `Write a short story for Ghanaian children. Pick a random grammar topic and a fun scenario.`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            story: { type: Type.STRING },
            grammarFocus: { type: Type.STRING },
            question: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
              },
              required: ["text", "options", "correctIndex", "explanation"],
            },
          },
          required: ["title", "story", "grammarFocus", "question"],
        },
      },
    });

    const parsed = JSON.parse(response.text ?? "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("[EnglishSafari] story error:", err?.message);
    if (String(err?.message).includes('API_KEY_INVALID') || String(err?.message).includes('API key expired')) {
      invalidateGeminiKey();
    }
    res.status(500).json({ error: "Story generation failed" });
  }
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get(["/api/health", "/english-safari/api/health"], (_req, res) =>
  res.json({ ok: true, service: "english-safari" })
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[EnglishSafari] Gemini proxy listening on http://localhost:${PORT}`);
});
