import express from 'express';
// vite is a devDependency, imported dynamically inside the dev-only branch
// below. A static top-level import crashes the production server
// (ERR_MODULE_NOT_FOUND) after `pnpm install --prod` removes vite.
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import session from 'express-session';
import cookieParser from 'cookie-parser';

dotenv.config();

const OAUTH_CLIENT_ID     = process.env.VITE_GOOGLE_CLIENT_ID     || '';
const OAUTH_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET       || '';
const OAUTH_REDIRECT_URI  = process.env.VITE_GOOGLE_REDIRECT_URI   || 'https://ai-tools.techbridge.edu.gh/groove-streamer/callback';

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3004;

  app.use(express.json());
  app.use(cookieParser());
  app.use(session({
    secret: process.env.SESSION_SECRET || 'super-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
    }
  }));

  // OAuth callback handler
  app.get(['/callback', '/groove-streamer/callback'], async (req: any, res: any) => {
    const { code, error } = req.query as Record<string, string>;
    if (error) return res.redirect(`/groove-streamer/?error=${encodeURIComponent(error)}`);
    if (!code) return res.redirect('/groove-streamer/?error=missing_code');
    try {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: OAUTH_CLIENT_ID, client_secret: OAUTH_CLIENT_SECRET, code, grant_type: 'authorization_code', redirect_uri: OAUTH_REDIRECT_URI }),
      });
      if (!tokenResponse.ok) { const e = await tokenResponse.json(); console.error('[groove-streamer] token exchange failed:', e); return res.redirect('/groove-streamer/?error=token_exchange_failed'); }
      const tokens = await tokenResponse.json() as { id_token?: string };
      if (!tokens.id_token) return res.redirect('/groove-streamer/?error=no_id_token');
      const userInfo = decodeJWT(tokens.id_token);
      const userJson = JSON.stringify({ id: userInfo.sub, name: userInfo.name, email: userInfo.email });
      res.cookie('groove_streamer_user', Buffer.from(userJson).toString('base64'), { httpOnly: false, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/groove-streamer/' });
      return res.redirect('/groove-streamer/');
    } catch (err) { console.error('[groove-streamer] OAuth error:', err); return res.redirect('/groove-streamer/?error=internal_error'); }
  });

  // API routes
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  });

  app.get('/api/auth/url', (req, res) => {
    const redirectUri = process.env.APP_URL 
      ? `${process.env.APP_URL}/auth/callback`
      : `${req.protocol}://${req.get('host')}/auth/callback`;
    console.log('DEBUG: Sending redirect URI:', redirectUri);
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );
    
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive.file'],
    });
    res.json({ url: authUrl });
  });

  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const { code } = req.query;
    const redirectUri = process.env.APP_URL 
      ? `${process.env.APP_URL}/auth/callback`
      : `${req.protocol}://${req.get('host')}/auth/callback`;
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    try {
      const { tokens } = await client.getToken(code as string);
      client.setCredentials(tokens);
      
      (req as any).session.tokens = tokens;
      
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      res.status(500).send('Authentication failed');
    }
  });

  app.post('/api/drive/upload', async (req, res) => {
    const { base64, mimeType, bpm } = req.body;
    const tokens = (req as any).session.tokens;
    if (!tokens) return res.status(401).json({ success: false, message: 'Not authenticated' });
    
    const redirectUri = process.env.APP_URL 
      ? `${process.env.APP_URL}/auth/callback`
      : `${req.protocol}://${req.get('host')}/auth/callback`;

    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );
    client.setCredentials(tokens);
    
    const drive = google.drive({ version: 'v3', auth: client });
    
    try {
      const buffer = Buffer.from(base64, 'base64');
      const fileMetadata = {
        name: `groove_${bpm}_bpm_${Date.now()}.wav`,
        mimeType: mimeType,
      };
      const media = {
        mimeType: mimeType,
        body: buffer,
      };
      
      const file = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
      });
      
      res.json({ success: true, fileId: file.data.id });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Upload failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer as createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
