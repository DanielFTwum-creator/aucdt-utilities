/**
 * English Safari — Backend Gemini Proxy
 * @description Proxies Gemini API calls so the API key never reaches the browser.
 * @pattern  Follows the fleet-standard WMS key-proxy pattern (FR-SSO-011).
 *           The Gemini API key is never stored here — it is fetched at request
 *           time from wms.techbridge.edu.gh using GEMINI_PROXY_KEY for auth.
 */

import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: ".env.local" });
dotenv.config();

// --- Gemini custody: this app NEVER holds the key (fleet standard, Pattern 11). ---
// Every generateContent call is relayed to the WMS proxy with the GEMINI_PROXY_KEY
// service credential; only WMS adds the key. The key never reaches this process.
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

// Relay a raw Gemini generateContent body to WMS; return the joined text, or throw.
async function generateViaWms(model: string, body: unknown): Promise<string> {
  if (!GEMINI_PROXY_KEY) throw new Error('GEMINI_PROXY_KEY not configured');
  const r = await fetch(`${WMS_GEMINI_URL}?model=${encodeURIComponent(model)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`WMS relay failed: ${r.status} ${await r.text()}`);
  const data = (await r.json()) as GeminiResponse;
  return (data.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? '').join('');
}

const PORT = Number(process.env.PORT) || 3005;
const MODEL = "gemini-2.5-flash";

if (!process.env.GEMINI_PROXY_KEY) {
  console.warn("[EnglishSafari] WARNING: GEMINI_PROXY_KEY not set — AI routes will return 503");
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

  if (!GEMINI_PROXY_KEY) return res.status(503).json({ error: 'AI service temporarily unavailable' });

  try {
    const prompt = topic
      ? `Write a short story for Ghanaian children about: ${topic}`
      : `Write a short story for Ghanaian children. Pick a random grammar topic and a fun scenario.`;

    const text = await generateViaWms(MODEL, {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            story: { type: "STRING" },
            grammarFocus: { type: "STRING" },
            question: {
              type: "OBJECT",
              properties: {
                text: { type: "STRING" },
                options: { type: "ARRAY", items: { type: "STRING" } },
                correctIndex: { type: "NUMBER" },
                explanation: { type: "STRING" },
              },
              required: ["text", "options", "correctIndex", "explanation"],
            },
          },
          required: ["title", "story", "grammarFocus", "question"],
        },
      },
    });

    const parsed = JSON.parse(text || "{}");
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

// ─── Serve the SPA ───────────────────────────────────────────────────────────
// nginx proxies the whole /english-safari/ path to this backend, so it must
// serve the built frontend too. deploy.ps1 rsyncs dist/* alongside server.ts,
// so __dirname is the web root (index.html + assets/ sit here). Falls back to
// index.html for client-side routing.
app.use("/english-safari", express.static(__dirname, { index: false }));
app.get(["/english-safari", "/english-safari/*splat"], (_req, res) => {
  const indexPath = path.join(__dirname, "index.html");
  if (!fs.existsSync(indexPath)) return res.status(404).send("App not built");
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  res.sendFile(indexPath);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[EnglishSafari] Gemini relay + SPA listening on http://localhost:${PORT}`);
});
