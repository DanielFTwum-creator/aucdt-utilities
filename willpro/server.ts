import express from "express";
import fetch from "node-fetch";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

interface GoogleTokenResponse {
  id_token: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}

function decodeJWT(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  const decoded = Buffer.from(parts[1], 'base64').toString('utf-8');
  return JSON.parse(decoded);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3015;

  app.use(express.json());
  app.use(cookieParser());

  const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/willpro/callback';

  app.get(['/callback', '/willpro/callback'], async (req, res) => {
    const { code, error } = req.query;

    if (error) return res.redirect(`/willpro/?error=${error}`);
    if (!code) return res.redirect(`/willpro/?error=missing_code`);

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
        const err = await tokenResponse.json();
        console.error('Token exchange error:', err);
        return res.redirect(`/willpro/?error=token_exchange_failed`);
      }

      const tokens = await tokenResponse.json() as GoogleTokenResponse;
      const userInfo = decodeJWT(tokens.id_token);

      const userJson = JSON.stringify({
        id: userInfo.sub,
        username: userInfo.name,
        email: userInfo.email,
        role: 'staff',
      });

      // Cookie readable by JS so AuthContext can hydrate user state on page load
      res.cookie('willpro_user', Buffer.from(userJson).toString('base64'), {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/willpro/',
      });

      // Also pass user data in URL as fallback if cookie doesn't work
      const encodedUser = Buffer.from(userJson).toString('base64');
      res.redirect(`/willpro/?user=${encodedUser}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`/willpro/?error=internal_error`);
    }
  });

  app.get(['/api/health', '/willpro/api/health'], (_req, res) => res.json({ ok: true }));

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`willpro backend running on http://localhost:${PORT}`);
  });
}

startServer();
