import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// --- Gemini custody: this app NEVER holds the Gemini key (fleet standard, ---
// --- Pattern 11). Every generateContent call is relayed to the WMS proxy  ---
// --- with the GEMINI_PROXY_KEY service credential; only WMS adds the key. ---
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';
const MODEL = 'gemini-2.5-pro';

if (!GEMINI_PROXY_KEY) {
  console.warn('[Patois Lyricist] WARNING: GEMINI_PROXY_KEY not set — AI routes will return 503');
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
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
    console.error(`[Patois Lyricist] WMS relay failed ${upstream.status}: ${errText.slice(0, 500)}`);
    throw new RelayError(`WMS relay returned ${upstream.status}`, 502);
  }
  return await upstream.json() as GeminiResponse;
}

function extractText(response: GeminiResponse): string {
  return (response.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? '').join('');
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3004;

  app.use(express.json({ limit: '5mb' }));
  app.use(cookieParser());

  // client_id/secret now live only in WMS (the OAuth relay); this app keeps neither.
  const REDIRECT_URI = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/patois/auth/google/callback';

  // Derive base path safely — fall back to /patois if the URI isn't a valid absolute URL
  let basePath = '/patois';
  try {
    basePath = new URL(REDIRECT_URI).pathname.replace(/\/auth\/google\/callback$/, '');
  } catch {
    console.warn('[Patois Lyricist] Could not parse VITE_GOOGLE_REDIRECT_URI — defaulting basePath to /patois');
  }

  // Google OAuth callback — server-side exchange
  app.get(['/auth/google/callback', `${basePath}/auth/google/callback`], async (req, res) => {
    const { code, error } = req.query;
    if (error) return res.redirect(`${basePath}/?error=${error}`);
    if (!code) return res.redirect(`${basePath}/?error=missing_code`);

    try {
      // Token exchange via the central WMS relay — this app holds NO Google client secret.
      // WMS holds the shared client_id/secret and returns Google's token response verbatim.
      const WMS_OAUTH_URL = process.env.WMS_OAUTH_URL || 'https://wms.techbridge.edu.gh/api/oauth/google/exchange';
      const tokenResponse = await fetch(WMS_OAUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gemini-Proxy-Key': process.env.GEMINI_PROXY_KEY || '',
        },
        body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
      });

      if (!tokenResponse.ok) {
        const err = await tokenResponse.json();
        console.error('[Patois Lyricist] Token exchange error:', err);
        return res.redirect(`${basePath}/?error=token_exchange_failed`);
      }

      const tokens = await tokenResponse.json() as GoogleTokenResponse;
      const userInfo = decodeJWT(tokens.id_token);

      const userData = {
        id: userInfo.sub,
        username: userInfo.name,
        email: userInfo.email,
      };
      const userJson = JSON.stringify(userData);

      res.cookie('patois_user', Buffer.from(userJson).toString('base64'), {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: basePath || '/',
      });

      // Pass user data in URL as fallback if cookie doesn't work
      const encodedUser = Buffer.from(userJson).toString('base64');
      res.redirect(`${basePath}/?user=${encodeURIComponent(encodedUser)}`);
    } catch (error) {
      console.error('[Patois Lyricist] OAuth callback error:', error);
      res.redirect(`${basePath}/?error=internal_error`);
    }
  });

  // OAuth logout
  app.post(['/api/auth/logout', `${basePath}/api/auth/logout`], (_req, res) => {
    res.clearCookie('patois_user', { path: basePath || '/' });
    res.json({ success: true, message: 'Logged out' });
  });

  // Gemini Generation Proxy
  app.post(['/api/gemini/generate', `${basePath}/api/gemini/generate`], async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      if (!prompt || !systemInstruction) {
        return res.status(400).json({ error: "Missing prompt or systemInstruction" });
      }

      const response = await callGemini({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0.95,
          topP: 0.9,
          thinkingConfig: { thinkingBudget: 12000 },
        },
      });

      res.json({ text: extractText(response) });
    } catch (error: any) {
      console.error("[Patois Lyricist] Gemini Relay Error:", error);
      const status = error instanceof RelayError ? error.status : 500;
      res.status(status).json({ error: "Failed to generate lyrics" });
    }
  });

  // Health check
  app.get(["/api/health", `${basePath}/api/health`], (_req, res) => {
    res.json({ status: "operational", timestamp: new Date().toISOString() });
  });

  // Production-only static serving fallback
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(basePath, express.static(distPath));
      app.get(new RegExp(`^${basePath}(/.*)?$`), (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Patois Lyricist] Server running on http://localhost:${PORT}`);
  });
}

startServer();
