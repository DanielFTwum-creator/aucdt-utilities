import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3027;

const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/clipai/callback';

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get(['/callback', '/clipai/callback'], async (req, res) => {
  const { code, error } = req.query as Record<string, string>;

  if (error) return res.redirect(`/clipai/?error=${encodeURIComponent(error)}`);
  if (!code) return res.redirect('/clipai/?error=missing_code');

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
      console.error('[clipai] token failed:', e);
      return res.redirect('/clipai/?error=token_exchange_failed');
    }

    const tokens = (await tokenResponse.json()) as { id_token?: string };
    if (!tokens.id_token) return res.redirect('/clipai/?error=no_id_token');

    const userInfo = decodeJWT(tokens.id_token);

    res.cookie(
      'clipai_user',
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
        path: '/clipai/',
      }
    );

    return res.redirect('/clipai/');
  } catch (err) {
    console.error('[clipai] OAuth error:', err);
    return res.redirect('/clipai/?error=internal_error');
  }
});

app.get(['/api/health', '/clipai/api/health'], (_req, res) => {
  res.json({ ok: true, service: 'clipai', port: PORT });
});

const distDir = path.join(__dirname, 'dist');
app.use('/clipai', express.static(distDir, { maxAge: '1y', immutable: true, index: false }));

app.get(['/clipai', '/clipai/*'], (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) return res.status(404).send('App not built');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => console.log(`[clipai] Server on http://localhost:${PORT}`));
