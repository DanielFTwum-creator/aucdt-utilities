import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3025;
const GOOGLE_CLIENT_ID     = process.env.VITE_GOOGLE_CLIENT_ID     || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET       || '';
const REDIRECT_URI         = process.env.VITE_GOOGLE_REDIRECT_URI   || 'https://ai-tools.techbridge.edu.gh/playgrow/callback';
// Gemini via the central WMS proxy — this app holds NO Gemini key. The relay
// presents the X-Gemini-Proxy-Key service credential (server env only).
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get(['/callback', '/playgrow/callback'], async (req, res) => {
  const { code, error } = req.query as Record<string, string>;
  if (error) return res.redirect(`/playgrow/?error=${encodeURIComponent(error)}`);
  if (!code) return res.redirect('/playgrow/?error=missing_code');
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, code, grant_type: 'authorization_code', redirect_uri: REDIRECT_URI }),
    });
    if (!tokenResponse.ok) { const err = await tokenResponse.json(); console.error('[playgrow] Token exchange failed:', err); return res.redirect('/playgrow/?error=token_exchange_failed'); }
    const tokens = await tokenResponse.json() as { id_token?: string };
    if (!tokens.id_token) return res.redirect('/playgrow/?error=no_id_token');
    const userInfo = decodeJWT(tokens.id_token);
    const userJson = JSON.stringify({ id: userInfo.sub, name: userInfo.name, email: userInfo.email });
    res.cookie('playgrow_user', Buffer.from(userJson).toString('base64'), { httpOnly: false, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/playgrow/' });
    return res.redirect('/playgrow/');
  } catch (err) { console.error('[playgrow] OAuth error:', err); return res.redirect('/playgrow/?error=internal_error'); }
});

app.get(['/api/health', '/playgrow/api/health'], (_req, res) => { res.json({ ok: true, service: 'playgrow', port: PORT }); });

// Gemini relay — forwards the raw generateContent body to the WMS proxy. Keeps
// the key server-side; the browser calls /api/generate, never Gemini directly.
app.post(['/api/generate', '/playgrow/api/generate'], async (req, res) => {
  if (!GEMINI_PROXY_KEY) return res.status(503).json({ error: 'GEMINI_PROXY_KEY not configured on the server.' });
  try {
    const model = typeof req.query.model === 'string' ? req.query.model : '';
    const upstream = await fetch(`${WMS_GEMINI_URL}${model ? `?model=${encodeURIComponent(model)}` : ''}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
      body: JSON.stringify(req.body),
    });
    const text = await upstream.text();
    res.status(upstream.status).type('application/json').send(text);
  } catch (err) {
    console.error('[playgrow] relay to WMS failed:', err);
    res.status(502).json({ error: 'Upstream Gemini proxy call failed.' });
  }
});

const distDir = path.join(__dirname, 'dist');
app.use('/playgrow', express.static(distDir, { maxAge: '1y', immutable: true, index: false }));
app.get(['/playgrow', '/playgrow/*path'], (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) return res.status(404).send('App not built');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => console.log(`[playgrow] Server on http://localhost:${PORT}`));
