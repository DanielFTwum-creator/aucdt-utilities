import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3034;
const GOOGLE_CLIENT_ID     = process.env.VITE_GOOGLE_CLIENT_ID     || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET       || '';
const REDIRECT_URI         = process.env.VITE_GOOGLE_REDIRECT_URI   || 'https://ai-tools.techbridge.edu.gh/brand-guideline-checker/callback';

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

const app = express();
app.use(express.json({ limit: '15mb' })); // image analysis posts base64 JPEGs

// --- Gemini custody: this app NEVER holds the Gemini key (fleet standard, ---
// --- Pattern 11). The SPA posts raw generateContent bodies here and this  ---
// --- route relays them to WMS with the GEMINI_PROXY_KEY credential.       ---
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';

if (!GEMINI_PROXY_KEY) {
  console.warn('[brand-guideline-checker] WARNING: GEMINI_PROXY_KEY not set — /api/gemini/generate will return 503');
}

app.post(['/api/gemini/generate', '/brand-guideline-checker/api/gemini/generate'], async (req, res) => {
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
      console.error(`[brand-guideline-checker] WMS relay failed ${upstream.status}: ${text.slice(0, 500)}`);
      return res.status(502).json({ error: 'AI request failed.' });
    }
    res.type('application/json').send(text);
  } catch (err) {
    console.error('[brand-guideline-checker] relay error:', err);
    return res.status(500).json({ error: 'AI request failed.' });
  }
});
app.use(cookieParser());

app.get(['/callback', '/brand-guideline-checker/callback'], async (req, res) => {
  const { code, error } = req.query as Record<string, string>;
  if (error) return res.redirect(`/brand-guideline-checker/?error=${encodeURIComponent(error)}`);
  if (!code) return res.redirect('/brand-guideline-checker/?error=missing_code');
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, code, grant_type: 'authorization_code', redirect_uri: REDIRECT_URI }),
    });
    if (!tokenResponse.ok) { const err = await tokenResponse.json(); console.error('[brand-guideline-checker] Token exchange failed:', err); return res.redirect('/brand-guideline-checker/?error=token_exchange_failed'); }
    const tokens = await tokenResponse.json() as { id_token?: string };
    if (!tokens.id_token) return res.redirect('/brand-guideline-checker/?error=no_id_token');
    const userInfo = decodeJWT(tokens.id_token);
    const userJson = JSON.stringify({ id: userInfo.sub, name: userInfo.name, email: userInfo.email });
    res.cookie('brand-guideline-checker_user', Buffer.from(userJson).toString('base64'), { httpOnly: false, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/brand-guideline-checker/' });
    return res.redirect('/brand-guideline-checker/');
  } catch (err) { console.error('[brand-guideline-checker] OAuth error:', err); return res.redirect('/brand-guideline-checker/?error=internal_error'); }
});

app.get(['/api/health', '/brand-guideline-checker/api/health'], (_req, res) => { res.json({ ok: true, service: 'brand-guideline-checker', port: PORT }); });

const distDir = path.join(__dirname, 'dist');
app.use('/brand-guideline-checker', express.static(distDir, { maxAge: '1y', immutable: true, index: false }));
app.get(['/brand-guideline-checker', '/brand-guideline-checker/*path'], (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) return res.status(404).send('App not built');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => console.log(`[brand-guideline-checker] Server on http://localhost:${PORT}`));
