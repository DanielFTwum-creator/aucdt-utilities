import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import fs from "fs";
import fetch from "node-fetch";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const gemini = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
if (!gemini) console.warn('[email-drafter] GEMINI_API_KEY not set; /api/gemini/draft will return 500');

interface GoogleTokenResponse {
  id_token: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function decodeJWT(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  const decoded = Buffer.from(parts[1], 'base64').toString('utf-8');
  return JSON.parse(decoded);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3007;

  app.use(express.json());
  app.use(cookieParser());

  const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/email-drafter/callback';

  // Google OAuth callback — server-side exchange, sets cookie, redirects to root
  app.get(['/callback', '/email-drafter/callback'], async (req, res) => {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`/email-drafter/?error=${error}`);
    }
    if (!code) {
      return res.redirect(`/email-drafter/?error=missing_code`);
    }

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
        return res.redirect(`/email-drafter/?error=token_exchange_failed`);
      }

      const tokens = await tokenResponse.json() as GoogleTokenResponse;
      const userInfo = decodeJWT(tokens.id_token);

      const userJson = JSON.stringify({
        id: userInfo.sub,
        email: userInfo.email,
        username: userInfo.name,
      });

      // Cookie readable by JS so AuthContext can hydrate user state on page load
      res.cookie('email_drafter_user', Buffer.from(userJson).toString('base64'), {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/email-drafter/',
      });

      // Also pass user data in URL as fallback if cookie doesn't work
      const encodedUser = Buffer.from(userJson).toString('base64');
      res.redirect(`/email-drafter/?user=${encodedUser}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`/email-drafter/?error=internal_error`);
    }
  });

  // Fallback frontend-initiated token exchange
  app.post(['/api/auth/google/token', '/email-drafter/api/auth/google/token'], async (req, res) => {
    const { code, redirectUri } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error('Missing Google OAuth credentials');
      return res.status(500).json({ error: 'OAuth not configured' });
    }

    try {
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
        const err = await tokenResponse.json();
        console.error('Token exchange error:', err);
        return res.status(400).json({ error: 'Token exchange failed' });
      }

      const tokens = await tokenResponse.json() as GoogleTokenResponse;
      const userInfo = decodeJWT(tokens.id_token);

      res.json({
        user: {
          id: userInfo.sub,
          email: userInfo.email,
          username: userInfo.name,
        },
      });
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Gemini proxy — drafts an email from {to, cc, bcc, subject, body, attachments}
  app.post(['/api/gemini/draft', '/email-drafter/api/gemini/draft'], async (req, res) => {
    if (!gemini) return res.status(500).json({ error: 'Gemini not configured' });
    const { to = [], cc = [], bcc = [], subject = '', body = '', attachments = [] } = req.body ?? {};

    const recipients = [
      to.length > 0 ? `To: ${to.join(', ')}` : '',
      cc.length > 0 ? `CC: ${cc.join(', ')}` : '',
      bcc.length > 0 ? `BCC: ${bcc.join(', ')} (Private)` : '',
    ].filter(Boolean).join('\n');

    const prompt = `
    You are a professional email writing assistant.
    Based on the following information, write a clear, concise, and professional email.
    If the original body seems like a list of notes or bullet points, flesh it out into a proper email format.
    If images are attached, describe them contextually in the email body where it makes sense.

    --- EMAIL DETAILS ---
    ${recipients}
    Subject: ${subject}

    --- BODY / NOTES ---
    ${body}
    ---
    `;

    const imageParts = (attachments as Array<{ base64: string; type: string }>).map(a => ({
      inlineData: { data: a.base64, mimeType: a.type },
    }));

    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }, ...imageParts] },
      });
      res.json({ text: response.text });
    } catch (err: any) {
      console.error('[email-drafter] Gemini error:', err?.message);
      res.status(500).json({ error: 'Gemini call failed', details: err?.message });
    }
  });

  app.get(['/api/health', '/email-drafter/api/health'], (_req, res) => res.json({ ok: true }));

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Email Drafter backend running on http://localhost:${PORT}`);
  });
}

startServer();
