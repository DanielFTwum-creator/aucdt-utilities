import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3020;
const GOOGLE_CLIENT_ID     = process.env.VITE_GOOGLE_CLIENT_ID     || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET       || '';
const REDIRECT_URI         = process.env.VITE_GOOGLE_REDIRECT_URI   || 'https://ai-tools.techbridge.edu.gh/smartscale-ai-presentation-platform/callback';

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get(['/callback', '/smartscale-ai-presentation-platform/callback'], async (req, res) => {
  const { code, error } = req.query as Record<string, string>;
  if (error) return res.redirect(`/smartscale-ai-presentation-platform/?error=${encodeURIComponent(error)}`);
  if (!code) return res.redirect('/smartscale-ai-presentation-platform/?error=missing_code');
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, code, grant_type: 'authorization_code', redirect_uri: REDIRECT_URI }),
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
