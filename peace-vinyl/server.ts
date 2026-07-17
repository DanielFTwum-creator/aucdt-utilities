import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

// nginx proxies /peace-vinyl/ to this app WITHOUT stripping the prefix (verified
// against the live nginx location), and the SPA is built with an absolute base of
// /peace-vinyl/. Strip the prefix so the routes below (/callback,
// /api/auth/google/token) and the static assets — all defined at root — match the
// un-stripped path nginx forwards.
const BASE = '/peace-vinyl';
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.url === BASE) req.url = '/';
  else if (req.url.startsWith(BASE + '/')) req.url = req.url.slice(BASE.length);
  next();
});

// In production, serve the built SPA from dist.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
}

// --- Google OAuth via the WMS relay (Pattern 35): the code->token exchange is
// --- POSTed to WMS with the GEMINI_PROXY_KEY service credential, so this app never
// --- holds GOOGLE_CLIENT_SECRET. Only WMS holds it.
const WMS_OAUTH_EXCHANGE_URL = process.env.WMS_OAUTH_EXCHANGE_URL || 'https://wms.techbridge.edu.gh/api/oauth/google/exchange';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';

if (!GEMINI_PROXY_KEY) {
  console.warn('[peace-vinyl] WARNING: GEMINI_PROXY_KEY not set — Google login will return 503');
}

// Decode the payload of a Google id_token (JWT). The token comes straight from
// Google via the trusted WMS relay, so we only read it (no signature check).
function decodeJWT(token: string): Record<string, any> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

// OAuth callback — Google redirects here with code+state; hand them to the SPA.
app.get('/callback', (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  if (error) return res.redirect(`/peace-vinyl/?error=${encodeURIComponent(String(error))}`);
  res.redirect(`/peace-vinyl/?code=${code}&state=${state}`);
});

// Exchange the authorization code for the user, relayed through WMS.
app.post('/api/auth/google/token', async (req: Request, res: Response) => {
  const { code, redirectUri } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing authorization code' });
  if (!GEMINI_PROXY_KEY) return res.status(503).json({ error: 'OAuth not configured' });
  try {
    const tokenResponse = await fetch(WMS_OAUTH_EXCHANGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
      body: JSON.stringify({ code, redirectUri }),
    });
    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      console.error(`[peace-vinyl] Token exchange failed ${tokenResponse.status}: ${err.slice(0, 300)}`);
      return res.status(400).json({ error: 'Token exchange failed' });
    }
    const tokens = await tokenResponse.json() as { id_token?: string };
    if (!tokens.id_token) return res.status(400).json({ error: 'No id_token in exchange response' });
    const userInfo = decodeJWT(tokens.id_token);
    res.json({ user: { id: userInfo.sub, email: userInfo.email, name: userInfo.name } });
  } catch (error) {
    console.error('[peace-vinyl] OAuth exchange error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SPA fallback for all other routes.
app.get(/.*/, (_req: Request, res: Response) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) res.sendFile(indexPath);
  else res.status(404).json({ error: 'Not found. Run "pnpm build" first.' });
});

const PORT = process.env.PORT || 3026;
app.listen(Number(PORT), '127.0.0.1', () => {
  console.log(`[peace-vinyl] OAuth server (WMS relay) listening on http://127.0.0.1:${PORT}`);
});
