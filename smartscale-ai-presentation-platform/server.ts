import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3036;
// OAuth: no client id/secret held server-side — the code->token exchange is
// relayed to WMS (Pattern 35). Only REDIRECT_URI is needed for the exchange.
const REDIRECT_URI         = process.env.VITE_GOOGLE_REDIRECT_URI   || 'https://ai-tools.techbridge.edu.gh/smartscale-ai-presentation-platform/callback';
const WMS_OAUTH_EXCHANGE_URL = process.env.WMS_OAUTH_EXCHANGE_URL || 'https://wms.techbridge.edu.gh/api/oauth/google/exchange';

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

const app = express();
app.use(express.json({ limit: '5mb' }));

// --- Gemini custody: this app NEVER holds the Gemini key (fleet standard, ---
// --- Pattern 11). The SPA posts raw generateContent bodies here and this  ---
// --- route relays them to WMS with the GEMINI_PROXY_KEY credential.       ---
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';

if (!GEMINI_PROXY_KEY) {
  console.warn('[smartscale-ai-presentation-platform] WARNING: GEMINI_PROXY_KEY not set — /api/gemini/generate will return 503');
}

app.post(['/api/gemini/generate', '/smartscale-ai-presentation-platform/api/gemini/generate'], async (req, res) => {
  if (!GEMINI_PROXY_KEY) return res.status(503).json({ error: 'Gemini proxy not configured.' });
  const { model, body } = req.body as { model?: string; body?: unknown };
  if (!body) return res.status(400).json({ error: 'body is required.' });
  try {
    const upstream = await fetch(`${WMS_GEMINI_URL}?model=${encodeURIComponent(model || 'gemini-2.5-flash')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    if (!upstream.ok) {
      console.error(`[smartscale-ai-presentation-platform] WMS relay failed ${upstream.status}: ${text.slice(0, 500)}`);
      return res.status(502).json({ error: 'AI request failed.' });
    }
    res.type('application/json').send(text);
  } catch (err) {
    console.error('[smartscale-ai-presentation-platform] relay error:', err);
    return res.status(500).json({ error: 'AI request failed.' });
  }
});
app.use(cookieParser());

app.get(['/callback', '/smartscale-ai-presentation-platform/callback'], async (req, res) => {
  const { code, error } = req.query as Record<string, string>;
  if (error) return res.redirect(`/smartscale-ai-presentation-platform/?error=${encodeURIComponent(error)}`);
  if (!code) return res.redirect('/smartscale-ai-presentation-platform/?error=missing_code');
  try {
    // Relay the code->token exchange through WMS (Pattern 35); response is Google's token payload verbatim.
    const tokenResponse = await fetch(WMS_OAUTH_EXCHANGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
      body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
    });
    if (!tokenResponse.ok) { const err = await tokenResponse.json(); console.error('[smartscale-ai-presentation-platform] Token exchange failed:', err); return res.redirect('/smartscale-ai-presentation-platform/?error=token_exchange_failed'); }
    const tokens = await tokenResponse.json() as { id_token?: string };
    if (!tokens.id_token) return res.redirect('/smartscale-ai-presentation-platform/?error=no_id_token');
    const userInfo = decodeJWT(tokens.id_token);
    const userJson = JSON.stringify({ id: userInfo.sub, name: userInfo.name, email: userInfo.email });
    res.cookie('smartscale-ai-presentation-platform_user', Buffer.from(userJson).toString('base64'), { httpOnly: false, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/smartscale-ai-presentation-platform/' });
    return res.redirect('/smartscale-ai-presentation-platform/');
  } catch (err) { console.error('[smartscale-ai-presentation-platform] OAuth error:', err); return res.redirect('/smartscale-ai-presentation-platform/?error=internal_error'); }
});

app.get(['/api/health', '/smartscale-ai-presentation-platform/api/health'], (_req, res) => { res.json({ ok: true, service: 'smartscale-ai-presentation-platform', port: PORT }); });

const distDir = path.join(__dirname, 'dist');
app.use('/smartscale-ai-presentation-platform', express.static(distDir, { maxAge: '1y', immutable: true, index: false }));
app.get(['/smartscale-ai-presentation-platform', '/smartscale-ai-presentation-platform/*path'], (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) return res.status(404).send('App not built');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => console.log(`[smartscale-ai-presentation-platform] Server on http://localhost:${PORT}`));
