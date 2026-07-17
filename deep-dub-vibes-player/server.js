import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

// nginx proxies /deep-dub-vibes-player/ to this app WITHOUT stripping the prefix,
// and the SPA is built with an absolute base of /deep-dub-vibes-player/. Strip the
// prefix so the routes below (/callback, /api/auth/google/token) and the static
// assets — all defined at root — match the un-stripped path nginx forwards. Without
// this, /deep-dub-vibes-player/callback and /…/api/… fall through to the SPA
// catch-all (breaking the OAuth exchange).
const BASE = '/deep-dub-vibes-player';
app.use((req, _res, next) => {
  if (req.url === BASE) req.url = '/';
  else if (req.url.startsWith(BASE + '/')) req.url = req.url.slice(BASE.length);
  next();
});

// In production, serve from dist
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
}

const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('Error: VITE_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env.local');
  process.exit(1);
}

// OAuth callback handler - receives code + state from Google redirect
app.get('/callback', (req, res) => {
  const { code, state, error } = req.query;
  if (error) {
    return res.redirect(`/deep-dub-vibes-player/?error=${error}`);
  }
  res.redirect(`/deep-dub-vibes-player/?code=${code}&state=${state}`);
});

app.post('/api/auth/google/token', async (req, res) => {
  const { code, redirectUri } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token exchange error:', error);
      return res.status(400).json({ error: 'Token exchange failed' });
    }

    const tokens = await tokenResponse.json();
    const { id_token, access_token } = tokens;

    // Decode ID token to get user info (JWT)
    const userInfo = decodeJWT(id_token);

    // Return user info to client
    res.json({
      user: {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
      },
      tokens: {
        idToken: id_token,
        accessToken: access_token,
      },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve the React app for all other routes (SPA fallback)
app.get(/.*/, (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Not found. Run "pnpm build" first.' });
  }
});

function decodeJWT(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');

  const decoded = Buffer.from(parts[1], 'base64').toString('utf-8');
  return JSON.parse(decoded);
}

const PORT = process.env.PORT || 3009;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`OAuth server listening on http://127.0.0.1:${PORT}`);
  console.log(`API endpoint: http://127.0.0.1:${PORT}/api/auth/google/token`);
});
