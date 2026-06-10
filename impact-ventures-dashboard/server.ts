import express from 'express';
// vite is a devDependency, imported dynamically in the dev-only branch below;
// a static import crashes the production server after pnpm install --prod.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OAUTH_CLIENT_ID     = process.env.VITE_GOOGLE_CLIENT_ID     || '';
const OAUTH_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET       || '';
const OAUTH_REDIRECT_URI  = process.env.VITE_GOOGLE_REDIRECT_URI   || 'https://ai-tools.techbridge.edu.gh/impact-ventures-dashboard/callback';

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3012;

  app.use(express.json());
  app.use(cookieParser());

  // OAuth callback handler
  app.get(['/callback', '/impact-ventures-dashboard/callback'], async (req, res) => {
    const { code, error } = req.query;
    if (error) return res.redirect(`/impact-ventures-dashboard/?error=${encodeURIComponent(error)}`);
    if (!code) return res.redirect('/impact-ventures-dashboard/?error=missing_code');
    try {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: OAUTH_CLIENT_ID, client_secret: OAUTH_CLIENT_SECRET, code, grant_type: 'authorization_code', redirect_uri: OAUTH_REDIRECT_URI }),
      });
      if (!tokenResponse.ok) { const e = await tokenResponse.json(); console.error('[impact-ventures-dashboard] token exchange failed:', e); return res.redirect('/impact-ventures-dashboard/?error=token_exchange_failed'); }
      const tokens = await tokenResponse.json();
      if (!tokens.id_token) return res.redirect('/impact-ventures-dashboard/?error=no_id_token');
      const userInfo = decodeJWT(tokens.id_token);
      const userJson = JSON.stringify({ id: userInfo.sub, name: userInfo.name, email: userInfo.email });
      res.cookie('impact_ventures_dashboard_user', Buffer.from(userJson).toString('base64'), { httpOnly: false, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/impact-ventures-dashboard/' });
      return res.redirect('/impact-ventures-dashboard/');
    } catch (err) { console.error('[impact-ventures-dashboard] OAuth error:', err); return res.redirect('/impact-ventures-dashboard/?error=internal_error'); }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use(async (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      const url = req.originalUrl;
      try {
        const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const transformed = await vite.transformIndexHtml(url, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get(/.*/, (req, res) => {
      if (!req.path.startsWith('/api/')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        res.status(404).send('Not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
