import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { GoogleGenAI } from "@google/genai";

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

const WMS_KEY_URL = 'https://wms.techbridge.edu.gh/api/gemini/key';
const KEY_TTL_MS  = 6 * 60 * 60 * 1000; // 6 hours
let cachedGeminiKey: string | null = null;
let keyFetchedAt = 0;

function invalidateGeminiKey() { cachedGeminiKey = null; keyFetchedAt = 0; }

async function getGeminiKey(): Promise<string> {
  if (cachedGeminiKey && Date.now() - keyFetchedAt < KEY_TTL_MS) return cachedGeminiKey;
  const proxyKey = process.env.GEMINI_PROXY_KEY;
  if (!proxyKey) {
    // Local dev fallback only — production must set GEMINI_PROXY_KEY via WMS.
    const local = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (local) return local;
    throw new Error('GEMINI_PROXY_KEY is not set (and no local key fallback).');
  }
  const r = await fetch(WMS_KEY_URL, { headers: { 'X-Gemini-Proxy-Key': proxyKey } });
  if (!r.ok) throw new Error(`WMS key fetch failed: ${r.status} ${await r.text()}`);
  cachedGeminiKey = ((await r.json()) as any).apiKey;
  keyFetchedAt = Date.now();
  return cachedGeminiKey!;
}

if (!process.env.GEMINI_PROXY_KEY) {
  console.warn('[Patois Lyricist] WARNING: GEMINI_PROXY_KEY not set — AI routes will use local fallback or fail');
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3004;

  app.use(express.json({ limit: '5mb' }));
  app.use(cookieParser());

  const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
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

      const apiKey = await getGeminiKey();
      const genAI = new GoogleGenAI({ apiKey });

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.95,
          topP: 0.9,
          thinkingConfig: { thinkingBudget: 12000 },
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("[Patois Lyricist] Gemini Proxy Error:", error);
      
      // If it's a key error, invalidate it so the next request re-fetches
      if (error?.message?.includes('API_KEY_INVALID') || error?.status === 401 || error?.status === 400 || error?.message?.includes('API key not valid')) {
          invalidateGeminiKey();
      }

      res.status(500).json({ error: "Failed to generate lyrics" });
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
