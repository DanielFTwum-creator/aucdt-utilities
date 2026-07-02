import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import fs from "fs";

// Local dev keeps vars in .env.local; deploy.ps1 ships it to the server as .env.
if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

const PORT = Number(process.env.PORT) || 3002;
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/biochemai/callback';

// --- Gemini custody: this app NEVER holds the Gemini key (fleet standard, ---
// --- Pattern 11). Every generateContent call is relayed to the WMS proxy  ---
// --- with the GEMINI_PROXY_KEY service credential; only WMS adds the key. ---
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';
const MODEL = "gemini-2.5-flash";

if (!GEMINI_PROXY_KEY) {
  console.warn('[BioChemAI] WARNING: GEMINI_PROXY_KEY not set — AI routes will return 503');
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    groundingMetadata?: { groundingChunks?: Array<{ web?: { uri: string; title?: string } }> };
  }>;
}

class RelayError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'RelayError';
  }
}

// Relay a raw Gemini generateContent body to WMS and return the parsed REST response.
async function callGemini(body: unknown): Promise<GeminiResponse> {
  if (!GEMINI_PROXY_KEY) throw new RelayError('GEMINI_PROXY_KEY not configured', 503);
  const upstream = await fetch(`${WMS_GEMINI_URL}?model=${encodeURIComponent(MODEL)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
    body: JSON.stringify(body),
  });
  if (!upstream.ok) {
    const errText = await upstream.text();
    console.error(`[BioChemAI] WMS relay failed ${upstream.status}: ${errText.slice(0, 500)}`);
    throw new RelayError(`WMS relay returned ${upstream.status}`, 502);
  }
  return await upstream.json() as GeminiResponse;
}

function extractText(response: GeminiResponse): string {
  return (response.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? '').join('');
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
    const response = await callGemini({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }],
    });
    const text = extractText(response);

    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter(chunk => chunk.web)
      .map(chunk => ({
        uri: chunk.web!.uri,
        title: chunk.web!.title || "Academic Reference",
      }));

    res.json({ text, sources });
  } catch (err: any) {
    console.error("[BioChemAI] bio-chem error:", err?.message);
    res.status(err instanceof RelayError ? err.status : 500).json({ error: "Gemini call failed" });
  }
});

const quizSchema = {
  type: "OBJECT",
  properties: {
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          questionText: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          correctAnswerIndex: { type: "NUMBER" },
          explanation: { type: "STRING" },
          imageSuggestion: { type: "STRING" },
        },
        required: ["questionText", "options", "correctAnswerIndex", "explanation", "imageSuggestion"],
      },
    },
  },
  required: ["questions"],
};

// POST /api/gemini/quiz
// Body: { topic, level, numQuestions, systemInstruction }
// Returns: { questions: QuizQuestion[] }
app.post(["/api/gemini/quiz", "/biochemai/api/gemini/quiz"], async (req, res) => {
  const { topic, level, numQuestions = 5, systemInstruction } = req.body ?? {};
  if (!topic || !level || !systemInstruction) {
    return res.status(400).json({ error: "Missing topic, level, or systemInstruction" });
  }

  try {
    const response = await callGemini({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{
        role: "user",
        parts: [{ text: `Generate a ${numQuestions}-question quiz on ${topic} for ${level}. Each question MUST include a helpful imageSuggestion.` }],
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });
    const text = extractText(response);
    if (!text) {
      console.error("[BioChemAI] quiz: empty response from relay:", JSON.stringify(response).slice(0, 300));
      return res.status(502).json({ error: "Gemini call failed" });
    }
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err: any) {
    console.error("[BioChemAI] quiz error:", err?.message);
    res.status(err instanceof RelayError ? err.status : 500).json({ error: "Gemini call failed" });
  }
});

app.get(["/api/health", "/biochemai/api/health"], (_req, res) => res.json({ ok: true }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[BioChemAI] Gemini relay (WMS custody) listening on http://localhost:${PORT}`);
});
