import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3009;
const GOOGLE_CLIENT_ID     = process.env.VITE_GOOGLE_CLIENT_ID     || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET       || '';
const REDIRECT_URI         = process.env.VITE_GOOGLE_REDIRECT_URI   || 'https://ai-tools.techbridge.edu.gh/omniextract/callback';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('[OmniExtract] WARNING: VITE_GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set — OAuth will fail');
}

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// ── OAuth callback — handles both path variants Apache may forward ──
app.get(['/callback', '/omniextract/callback'], async (req, res) => {
  const { code, error } = req.query as Record<string, string>;

  if (error) {
    console.error('[OmniExtract] OAuth error from Google:', error);
    return res.redirect(`/omniextract/?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect('/omniextract/?error=missing_code');
  }

  try {
    // Exchange auth code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:     GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type:    'authorization_code',
        redirect_uri:  REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.json();
      console.error('[OmniExtract] Token exchange failed:', err);
      return res.redirect('/omniextract/?error=token_exchange_failed');
    }

    const tokens = await tokenResponse.json() as { id_token?: string; access_token?: string };

    // Decode user info from JWT — no extra round-trip needed
    if (!tokens.id_token) {
      console.error('[OmniExtract] No id_token in response');
      return res.redirect('/omniextract/?error=no_id_token');
    }

    const userInfo = decodeJWT(tokens.id_token);

    const userJson = JSON.stringify({
      id:    userInfo.sub,
      name:  userInfo.name,
      email: userInfo.email,
    });

    // Cookie readable by JS so AuthContext can hydrate user on page load
    res.cookie('omniextract_user', Buffer.from(userJson).toString('base64'), {
      httpOnly: false,
      secure:   true,
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
      path:     '/omniextract/',
    });

    return res.redirect('/omniextract/');
  } catch (err) {
    console.error('[OmniExtract] OAuth callback error:', err);
    return res.redirect('/omniextract/?error=internal_error');
  }
});

// ── Health check ──
app.get(['/api/health', '/omniextract/api/health'], (_req, res) => {
  res.json({ ok: true, service: 'omniextract', port: PORT });
});

// ── Serve SPA — index.html with strict no-cache ──
const distDir = path.join(__dirname, 'dist');

app.use('/omniextract', express.static(distDir, {
  maxAge: '1y',
  immutable: true,
  index: false, // We handle index.html manually to set no-cache
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  },
}));

app.get(['/omniextract', '/omniextract/*path'], (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('App not built — run pnpm build');
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[OmniExtract] Server listening on http://localhost:${PORT}`);
  console.log(`[OmniExtract] Redirect URI: ${REDIRECT_URI}`);
});
