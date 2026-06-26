import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

dotenv.config();

const PORT = Number(process.env.PORT) || 3002;
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/biochemai/callback';

// --- Gemini key custody: fetched from the WMS proxy, never stored here ---
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
    const local = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (local) return local;
    throw new Error('GEMINI_PROXY_KEY is not set (and no local key fallback).');
  }
  const r = await fetch(WMS_KEY_URL, { headers: { 'X-Gemini-Proxy-Key': proxyKey } });
  if (!r.ok) throw new Error(`WMS key fetch failed: ${r.status} ${await r.text()}`);
  cachedGeminiKey = (await r.json() as any).apiKey;
  keyFetchedAt = Date.now();
  return cachedGeminiKey!;
}

if (!process.env.GEMINI_PROXY_KEY) {
  console.warn('[BioChemAI] WARNING: GEMINI_PROXY_KEY not set — AI routes will use local fallback or fail');
}

interface GoogleTokenResponse {
  id_token: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}

function decodeJWT(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  const decoded = Buffer.from(parts[1], 'base64').toString('utf-8');
  return JSON.parse(decoded);
}

const MODEL = "gemini-2.5-flash";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Google OAuth callback — server-side exchange, sets cookie, redirects to /biochemai/
app.get(['/callback', '/biochemai/callback'], async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.redirect(`/biochemai/?error=${error}`);
  if (!code) return res.redirect(`/biochemai/?error=missing_code`);

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.json();
      console.error('[BioChemAI] Token exchange error:', err);
      return res.redirect(`/biochemai/?error=token_exchange_failed`);
    }

    const tokens = await tokenResponse.json() as GoogleTokenResponse;
    const userInfo = decodeJWT(tokens.id_token);

    const userJson = JSON.stringify({
      id: userInfo.sub,
      username: userInfo.name,
      email: userInfo.email,
    });

    // Cookie readable by JS so AuthContext can hydrate user state on page load
    res.cookie('biochemai_user', Buffer.from(userJson).toString('base64'), {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/biochemai/',
    });

    // Redirect without URL params — user data is in cookie
    res.redirect(`/biochemai/`);
  } catch (error) {
    console.error('[BioChemAI] OAuth callback error:', error);
    res.redirect(`/biochemai/?error=internal_error`);
  }
});

// POST /api/gemini/bio-chem
// Body: { prompt, systemInstruction }
// Returns: { text, sources }
app.post(["/api/gemini/bio-chem", "/biochemai/api/gemini/bio-chem"], async (req, res) => {
  const { prompt, systemInstruction } = req.body ?? {};
  if (!prompt || !systemInstruction) {
    return res.status(400).json({ error: "Missing prompt or systemInstruction" });
  }

  try {
    const key = await getGeminiKey();
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: MODEL, systemInstruction });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      tools: [{ googleSearch: {} } as any],
    });
    const response = await result.response;
    const text = response.text();

    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title || "Academic Reference",
      }));

    res.json({ text, sources });
  } catch (err: any) {
    console.error("[BioChemAI] bio-chem error:", err?.message);
    if (err?.message?.includes('API_KEY_INVALID') || err?.message?.includes('INVALID_ARGUMENT')) {
      invalidateGeminiKey();
    }
    res.status(500).json({ error: "Gemini call failed" });
  }
});

// POST /api/gemini/quiz
// Body: { topic, level, numQuestions, systemInstruction }
// Returns: { questions: QuizQuestion[] }
app.post(["/api/gemini/quiz", "/biochemai/api/gemini/quiz"], async (req, res) => {
  const { topic, level, numQuestions = 5, systemInstruction } = req.body ?? {};
  if (!topic || !level || !systemInstruction) {
    return res.status(400).json({ error: "Missing topic, level, or systemInstruction" });
  }

  try {
    const key = await getGeminiKey();
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            questions: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  questionText: { type: SchemaType.STRING },
                  options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                  correctAnswerIndex: { type: SchemaType.NUMBER },
                  explanation: { type: SchemaType.STRING },
                  imageSuggestion: { type: SchemaType.STRING },
                },
                required: ["questionText", "options", "correctAnswerIndex", "explanation", "imageSuggestion"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const result = await model.generateContent(
      `Generate a ${numQuestions}-question quiz on ${topic} for ${level}. Each question MUST include a helpful imageSuggestion.`
    );
    const response = await result.response;
    const parsed = JSON.parse(response.text());
    res.json(parsed);
  } catch (err: any) {
    console.error("[BioChemAI] quiz error:", err?.message);
    if (err?.message?.includes('API_KEY_INVALID') || err?.message?.includes('INVALID_ARGUMENT')) {
      invalidateGeminiKey();
    }
    res.status(500).json({ error: "Gemini call failed" });
  }
});

app.get(["/api/health", "/biochemai/api/health"], (_req, res) => res.json({ ok: true }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[BioChemAI] Gemini proxy listening on http://localhost:${PORT}`);
});
