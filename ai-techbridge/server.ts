import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3031;

const WMS_KEY_URL = 'https://wms.techbridge.edu.gh/api/gemini/key';
const KEY_TTL_MS = 6 * 60 * 60 * 1000;
let cachedGeminiKey: string | null = null;
let keyFetchedAt = 0;

function invalidateGeminiKey() { cachedGeminiKey = null; keyFetchedAt = 0; }

async function getGeminiKey(): Promise<string> {
  if (cachedGeminiKey && Date.now() - keyFetchedAt < KEY_TTL_MS) return cachedGeminiKey;
  const proxyKey = process.env.GEMINI_PROXY_KEY;
  if (!proxyKey) {
    const local = process.env.GEMINI_API_KEY;
    if (local) return local;
    throw new Error('GEMINI_PROXY_KEY not set and no local fallback.');
  }
  const r = await fetch(WMS_KEY_URL, { headers: { 'X-Gemini-Proxy-Key': proxyKey } });
  if (!r.ok) throw new Error(`WMS key fetch failed: ${r.status} ${await r.text()}`);
  cachedGeminiKey = ((await r.json()) as any).apiKey;
  keyFetchedAt = Date.now();
  return cachedGeminiKey!;
}
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/ai-techbridge/callback';

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get(['/callback', '/ai-techbridge/callback'], async (req, res) => {
  const { code, error } = req.query as Record<string, string>;
  if (error) return res.redirect(`/ai-techbridge/?error=${encodeURIComponent(error)}`);
  if (!code) return res.redirect('/ai-techbridge/?error=missing_code');
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
      const e = await tokenResponse.json();
      console.error('[ai-techbridge] token failed:', e);
      return res.redirect('/ai-techbridge/?error=token_exchange_failed');
    }
    const tokens = (await tokenResponse.json()) as { id_token?: string };
    if (!tokens.id_token) return res.redirect('/ai-techbridge/?error=no_id_token');
    const userInfo = decodeJWT(tokens.id_token);
    res.cookie(
      'ai-techbridge_user',
      Buffer.from(
        JSON.stringify({
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
        })
      ).toString('base64'),
      {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/ai-techbridge/',
      }
    );
    return res.redirect('/ai-techbridge/');
  } catch (err) {
    console.error('[ai-techbridge] OAuth error:', err);
    return res.redirect('/ai-techbridge/?error=internal_error');
  }
});

// Gemini text proxy — keeps the API key server-side
app.post(['/api/gemini/generate', '/ai-techbridge/api/gemini/generate'], async (req, res) => {
  try {
    const { query, systemInstruction, model = 'gemini-1.5-flash' } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing query' });

    const apiKey = await getGeminiKey();
    const { GoogleGenAI } = await import('@google/genai');
    const genAI = new GoogleGenAI({ apiKey });
    const result = await genAI.models.generateContent({
      model,
      contents: query,
      config: systemInstruction ? { systemInstruction } : undefined,
    });
    res.json({ text: result.text });
  } catch (error: any) {
    console.error('[ai-techbridge] Gemini proxy error:', error);
    if (error?.message?.includes('API_KEY_INVALID') || error?.status === 401) invalidateGeminiKey();
    res.status(500).json({ error: 'AI generation failed' });
  }
});

app.get(['/api/health', '/ai-techbridge/api/health'], (_req, res) => {
  res.json({ ok: true, service: 'ai-techbridge', port: PORT });
});

const distDir = path.join(__dirname, 'dist');
app.use('/ai-techbridge', express.static(distDir, { maxAge: '1y', immutable: true, index: false }));
app.get(['/ai-techbridge', '/ai-techbridge/*path'], (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) return res.status(404).send('App not built');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => console.log(`[ai-techbridge] Server on http://localhost:${PORT}`));
