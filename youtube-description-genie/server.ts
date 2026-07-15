import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

function decodeJWT(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  const decoded = Buffer.from(parts[1], 'base64').toString('utf-8');
  return JSON.parse(decoded);
}

interface GoogleTokenResponse {
  id_token: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}

// ── Server-side relay to the central WMS Gemini proxy ──────────────────────
// The Gemini API key is NO LONGER in this app at all. The browser calls this
// server's /api/generate; the server forwards to WMS, presenting the service
// credential (X-Gemini-Proxy-Key) which lives ONLY in this server's env.
// Mirrors the OmniExtract pattern. No secret ever reaches the client bundle.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT          = Number(process.env.PORT) || 4173;
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const WMS_OAUTH_EXCHANGE_URL = process.env.WMS_OAUTH_EXCHANGE_URL || 'https://wms.techbridge.edu.gh/api/oauth/google/exchange';
const PROXY_KEY      = process.env.GEMINI_PROXY_KEY || '';

if (!PROXY_KEY) {
  console.warn('[ytdg] WARNING: GEMINI_PROXY_KEY not set — /api/generate will return 503');
}

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/health', (_req, res) => res.type('text').send('healthy'));

// OAuth: no client id/secret held server-side — the code->token exchange is
// relayed to WMS (Pattern 35). Only REDIRECT_URI is needed for the exchange.
const REDIRECT_URI = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/youtube-genie/auth/google/callback';
const basePath = new URL(REDIRECT_URI).pathname.replace(/\/auth\/google\/callback$/, '') || '/youtube-genie';

// Google OAuth callback — server-side exchange
app.get(['/auth/google/callback', `${basePath}/auth/google/callback`], async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.redirect(`${basePath}/?error=${error}`);
  if (!code) return res.redirect(`${basePath}/?error=missing_code`);

  try {
    // Relay the code->token exchange through WMS (Pattern 35); the response is
    // Google's token payload verbatim, so the decode below is unchanged. No secret held.
    const tokenResponse = await fetch(WMS_OAUTH_EXCHANGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': PROXY_KEY },
      body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.json();
      console.error('[ytdg] Token exchange error:', err);
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

    res.cookie('youtubegenie_user', Buffer.from(userJson).toString('base64'), {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: basePath || '/',
    });

    // Pass user data in URL as fallback if cookie doesn't work
    const encodedUser = Buffer.from(userJson).toString('base64');
    res.redirect(`${basePath}/?user=${encodedUser}`);
  } catch (error) {
    console.error('[ytdg] OAuth callback error:', error);
    res.redirect(`${basePath}/?error=internal_error`);
  }
});

// OAuth logout
app.post(['/api/auth/logout', `${basePath}/api/auth/logout`], (_req, res) => {
  res.clearCookie('youtubegenie_user', { path: basePath || '/' });
  res.json({ success: true, message: 'Logged out' });
});

// Generate-description proxy. Body is the raw Gemini generateContent request
// (contents + generationConfig) built client-side; we relay it to WMS verbatim.
app.post(['/api/generate', `${basePath}/api/generate`], async (req, res) => {
  if (!PROXY_KEY) {
    return res.status(503).json({ error: 'GEMINI_PROXY_KEY not configured on the server.' });
  }
  try {
    const upstream = await fetch(WMS_GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gemini-Proxy-Key': PROXY_KEY,
      },
      body: JSON.stringify(req.body),
    });
    const text = await upstream.text();
    res.status(upstream.status).type('application/json').send(text);
  } catch (err) {
    console.error('[ytdg] relay to WMS failed:', err);
    res.status(502).json({ error: 'Upstream Gemini proxy call failed.' });
  }
});

// ── Serve the SPA (replaces `serve -s dist`) ──
// base path matches vite.config.ts base: '/youtube-genie/'
// Static assets served at /youtube-genie/assets/... -> dist/assets/...
// Falls back to index.html for all unmatched sub-paths (client-side routing).
//
// Path detection: in local dev, Vite puts the build in dist/ (sibling of server.ts).
// In production, deploy.ps1 copies dist/* directly into $RemotePath alongside server.ts,
// so __dirname itself is the web root. We check which layout is present at runtime.
const distDirCandidate = path.join(__dirname, 'dist');
const distDir = fs.existsSync(path.join(distDirCandidate, 'index.html'))
  ? distDirCandidate  // local: pnpm build → dist/index.html
  : __dirname;        // production: deploy.ps1 → index.html beside server.ts
const indexPath = path.join(distDir, 'index.html');
app.use('/youtube-genie', express.static(distDir, { index: false }));
app.get(['/youtube-genie', '/youtube-genie/*'], (_req, res) => {
  if (!fs.existsSync(indexPath)) return res.status(404).send('App not built — run pnpm build');
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(indexPath);
});
app.get('/', (_req, res) => res.redirect('/youtube-genie/'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ytdg] listening on http://localhost:${PORT} — Gemini via WMS proxy`);
});
