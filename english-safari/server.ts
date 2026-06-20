/**
 * English Safari — Backend Gemini Proxy
 * @description Proxies Gemini API calls so the API key never reaches the browser.
 * @pattern  Follows biochemai/dmcdai server-side proxy architecture.
 */

import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config({ path: ".env.local" });

const PORT = Number(process.env.PORT) || 3010;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("[EnglishSafari] FATAL: GEMINI_API_KEY not set in .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash";

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
