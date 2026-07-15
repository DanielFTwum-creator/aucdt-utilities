import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3038;
// OAuth: no client id/secret held server-side — the code->token exchange is
// relayed to WMS (Pattern 35). Only REDIRECT_URI is needed for the exchange.
const REDIRECT_URI         = process.env.VITE_GOOGLE_REDIRECT_URI   || 'https://ai-tools.techbridge.edu.gh/techbridge-assessment-platform/callback';
const WMS_OAUTH_EXCHANGE_URL = process.env.WMS_OAUTH_EXCHANGE_URL || 'https://wms.techbridge.edu.gh/api/oauth/google/exchange';

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

// --- Gemini custody: this app NEVER holds the Gemini key (fleet standard, ---
// --- Pattern 11). Feedback calls are relayed to the WMS proxy with the     ---
// --- GEMINI_PROXY_KEY service credential; only WMS adds the key.           ---
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';
const MODEL = 'gemini-2.5-flash';

if (!GEMINI_PROXY_KEY) {
  console.warn('[techbridge-assessment-platform] WARNING: GEMINI_PROXY_KEY not set — /api/feedback will return 503');
}

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// AI feedback generation, relayed through WMS. The SPA posts { prompt }.
app.post(['/api/feedback', '/techbridge-assessment-platform/api/feedback'], async (req, res) => {
  if (!GEMINI_PROXY_KEY) return res.status(503).json({ error: 'Gemini proxy not configured.' });
  const { prompt } = req.body as { prompt?: string };
  if (!prompt) return res.status(400).json({ error: 'prompt is required.' });
  try {
    const upstream = await fetch(`${WMS_GEMINI_URL}?model=${encodeURIComponent(MODEL)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
    });
    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error(`[techbridge-assessment-platform] WMS relay failed ${upstream.status}: ${errText.slice(0, 500)}`);
      return res.status(502).json({ error: 'Feedback generation failed.' });
    }
    const data = await upstream.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = (data.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? '').join('');
    if (!text) return res.status(502).json({ error: 'Empty response from the model.' });
    return res.json({ text });
  } catch (err) {
    console.error('[techbridge-assessment-platform] feedback error:', err);
    return res.status(500).json({ error: 'Feedback generation failed.' });
  }
});

app.get(['/callback', '/techbridge-assessment-platform/callback'], async (req, res) => {
  const { code, error } = req.query as Record<string, string>;
  if (error) return res.redirect(`/techbridge-assessment-platform/?error=${encodeURIComponent(error)}`);
  if (!code) return res.redirect('/techbridge-assessment-platform/?error=missing_code');
  try {
    // Relay the code->token exchange through WMS (Pattern 35); response is Google's token payload verbatim.
    const tokenResponse = await fetch(WMS_OAUTH_EXCHANGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
      body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
    });
    if (!tokenResponse.ok) { const err = await tokenResponse.json(); console.error('[techbridge-assessment-platform] Token exchange failed:', err); return res.redirect('/techbridge-assessment-platform/?error=token_exchange_failed'); }
    const tokens = await tokenResponse.json() as { id_token?: string };
    if (!tokens.id_token) return res.redirect('/techbridge-assessment-platform/?error=no_id_token');
    const userInfo = decodeJWT(tokens.id_token);
    const userJson = JSON.stringify({ id: userInfo.sub, name: userInfo.name, email: userInfo.email });
    res.cookie('techbridge-assessment-platform_user', Buffer.from(userJson).toString('base64'), { httpOnly: false, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/techbridge-assessment-platform/' });
    return res.redirect('/techbridge-assessment-platform/');
  } catch (err) { console.error('[techbridge-assessment-platform] OAuth error:', err); return res.redirect('/techbridge-assessment-platform/?error=internal_error'); }
});

app.get(['/api/health', '/techbridge-assessment-platform/api/health'], (_req, res) => { res.json({ ok: true, service: 'techbridge-assessment-platform', port: PORT }); });

const distDir = path.join(__dirname, 'dist');
app.use('/techbridge-assessment-platform', express.static(distDir, { maxAge: '1y', immutable: true, index: false }));
app.get(['/techbridge-assessment-platform', '/techbridge-assessment-platform/*path'], (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) return res.status(404).send('App not built');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => console.log(`[techbridge-assessment-platform] Server on http://localhost:${PORT}`));
