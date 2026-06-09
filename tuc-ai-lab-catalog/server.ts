import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import crypto from "crypto";
import { spawn } from "child_process";
import express from "express";
// NOTE: vite is a devDependency and is imported dynamically inside the
// dev-only branch below. A static top-level import crashes the production
// server (ERR_MODULE_NOT_FOUND) after `pnpm install --prod` removes vite.
import fs from "fs";
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Production detection. NODE_ENV=production is the authoritative signal (set by the
// deploy/PM2). The directory heuristics are fallbacks: in production the deploy may
// place server.ts at the web root ALONGSIDE the built assets (not inside a 'dist'
// folder), so relying only on those heuristics wrongly enters dev mode and crashes
// trying to import the (pruned) 'vite' devDependency. NODE_ENV avoids that.
const isBuilt = process.env.NODE_ENV === 'production'
  || __dirname.endsWith('dist')
  || !fs.existsSync(path.join(__dirname, 'server.ts'));
const baseDir = __dirname;

function decodeJWT(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  const decoded = Buffer.from(parts[1], 'base64').toString('utf-8');
  return JSON.parse(decoded);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3003;

  app.use(express.json({ limit: "25mb" })); // audio base64 for dictation exceeds the 100kb default
  app.use(cookieParser());

  const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  // OAuth callback handler - Google redirects here with code + state
  // Server-side exchange to avoid WAF blocks on URL parameters
  app.get(['/callback', '/ai-lab/callback'], async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`/ai-lab/?error=${error}`);
    }

    if (!code) {
      return res.redirect(`/ai-lab/?error=missing_code`);
    }

    try {
      const redirectUri = `${process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/ai-lab/callback'}`;

      // Exchange code for tokens server-side
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
        return res.redirect(`/ai-lab/?error=token_exchange_failed`);
      }

      const tokens = await tokenResponse.json() as GoogleTokenResponse;
      const { id_token } = tokens;

      const userInfo = decodeJWT(id_token);

      // Cookie is readable by JS so AuthContext can hydrate user state on page load
      const userJson = JSON.stringify({
        id: userInfo.sub,
        email: userInfo.email,
        username: userInfo.name,
      });

      res.cookie('ai_lab_user', Buffer.from(userJson).toString('base64'), {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect to dashboard WITHOUT parameters
      res.redirect(`/ai-lab/`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`/ai-lab/?error=internal_error`);
    }
  });

  // Legacy callback path for backwards compatibility
  app.get(['/auth/google/callback', '/ai-lab/auth/google/callback'], async (req, res) => {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`/ai-lab/?error=${error}`);
    }

    if (!code) {
      return res.redirect(`/ai-lab/?error=missing_code`);
    }

    try {
      const redirectUri = `${process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/ai-lab/auth/google/callback'}`;

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
        return res.redirect(`/ai-lab/?error=token_exchange_failed`);
      }

      const tokens = await tokenResponse.json() as GoogleTokenResponse;
      const { id_token } = tokens;

      const userInfo = decodeJWT(id_token);

      const userJson = JSON.stringify({
        id: userInfo.sub,
        email: userInfo.email,
        username: userInfo.name,
      });

      res.cookie('ai_lab_user', Buffer.from(userJson).toString('base64'), {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`/ai-lab/`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`/ai-lab/?error=internal_error`);
    }
  });

  // OAuth token exchange endpoint
  app.post(['/api/auth/google/token', '/ai-lab/api/auth/google/token'], async (req, res) => {
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
        const error = await tokenResponse.json();
        console.error('Token exchange error:', error);
        return res.status(400).json({ error: 'Token exchange failed' });
      }

      const tokens = await tokenResponse.json() as GoogleTokenResponse;
      const { id_token } = tokens;

      const userInfo = decodeJWT(id_token);

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

  // Serve callback page and static files BEFORE vite middleware (so they're found first)
  app.use(express.static(path.join(__dirname, "public")));
  app.use("/public", express.static(path.join(__dirname, "public")));

  // Serve pre-generated screenshots
  app.get(["/api/health", "/ai-lab/api/health"], (_req, res) => res.json({ ok: true }));

  // Dictation transcription + polish. Calls Gemini server-side (GEMINI_API_KEY never
  // reaches the client) and returns { rawTranscription, polishedNote }. Restores the
  // dictation-app processing path (previously a phantom 404 endpoint).
  app.post(["/api/dictation/process", "/ai-lab/api/dictation/process"], async (req, res) => {
    // Three modes (chunked dictation, TUC-ICT):
    //   { base64Audio, polish:false } -> transcribe one segment only (fast, no polish)
    //   { base64Audio }               -> transcribe + polish a whole short recording
    //   { text }                      -> polish-only: stitch segment transcripts into a final note
    const { mimeType, base64Audio, text, polish } = (req.body || {}) as
      { mimeType?: string; base64Audio?: string; text?: string; polish?: boolean };

    const KEY = process.env.GEMINI_API_KEY;
    if (!KEY) return res.status(503).json({ error: "Transcription is not configured." });

    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`;
    const callGemini = async (parts: any[]): Promise<string> => {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts }] }),
      });
      if (!r.ok) throw new Error(`Gemini ${r.status}: ${await r.text()}`);
      const data: any = await r.json();
      return (data?.candidates?.[0]?.content?.parts || []).map((p: any) => p.text || "").join("").trim();
    };
    const polishPrompt = (t: string) =>
      `Polish the following dictation into clean, well-structured Markdown notes (use headings and bullet points where helpful). Fix grammar and punctuation, preserve meaning, UK English. Output only Markdown.\n\n${t}`;

    try {
      // Polish-only mode (final stitch of segment transcripts).
      if (typeof text === "string" && text.trim()) {
        const polishedNote = (await callGemini([{ text: polishPrompt(text) }])) || text;
        return res.json({ rawTranscription: text.trim(), polishedNote });
      }

      if (!base64Audio) return res.status(400).json({ error: "Missing audio" });

      const rawTranscription = await callGemini([
        { text: "Transcribe this audio verbatim in clean UK English. Output only the transcript text, with no preamble or commentary." },
        { inline_data: { mime_type: mimeType || "audio/webm", data: base64Audio } },
      ]);
      if (!rawTranscription) return res.json({ rawTranscription: "", polishedNote: "" });

      // Segment mode: transcript only (polish happens once at the end).
      if (polish === false) return res.json({ rawTranscription, polishedNote: "" });

      let polishedNote = rawTranscription;
      try {
        polishedNote = (await callGemini([{ text: polishPrompt(rawTranscription) }])) || rawTranscription;
      } catch (e) {
        console.error("[dictation] polish failed:", (e as Error).message);
      }
      res.json({ rawTranscription, polishedNote });
    } catch (e) {
      console.error("[dictation] process failed:", (e as Error).message);
      res.status(502).json({ error: "Failed to process audio." });
    }
  });

  // Transcode a recording (webm/opus or mp4) to MP3 server-side via ffmpeg.
  // Browsers can't encode MP3 from MediaRecorder, so the dictation app uploads its
  // native capture here and gets a real .mp3 back. Temp files (not pipes) so both
  // webm and mp4 — the latter needs a seekable moov atom — transcode reliably.
  app.post(["/api/dictation/transcode", "/ai-lab/api/dictation/transcode"], async (req, res) => {
    const { base64Audio, mimeType } = (req.body || {}) as { base64Audio?: string; mimeType?: string };
    if (!base64Audio) return res.status(400).json({ error: "Missing audio" });

    const inExt = (mimeType || "").includes("mp4") ? "mp4" : "webm";
    const id = crypto.randomBytes(8).toString("hex");
    const inPath = path.join(os.tmpdir(), `dictation_${id}.${inExt}`);
    const outPath = path.join(os.tmpdir(), `dictation_${id}.mp3`);

    try {
      fs.writeFileSync(inPath, Buffer.from(base64Audio, "base64"));
      await new Promise<void>((resolve, reject) => {
        const ff = spawn("ffmpeg", ["-y", "-i", inPath, "-vn", "-codec:a", "libmp3lame", "-b:a", "192k", outPath]);
        let err = "";
        ff.stderr.on("data", (d) => { err += d.toString(); });
        ff.on("error", reject); // ffmpeg binary missing
        ff.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}: ${err.slice(-400)}`))));
      });
      const mp3 = fs.readFileSync(outPath);
      res.set("Content-Type", "audio/mpeg");
      res.set("Content-Disposition", 'attachment; filename="dictation.mp3"');
      res.send(mp3);
    } catch (e) {
      console.error("[dictation] transcode failed:", (e as Error).message);
      res.status(502).json({ error: "Failed to transcode audio." });
    } finally {
      try { fs.unlinkSync(inPath); } catch { /* ignore */ }
      try { fs.unlinkSync(outPath); } catch { /* ignore */ }
    }
  });

  app.get(["/api/screenshot", "/ai-lab/api/screenshot"], (req, res) => {
    const slug = req.query.slug as string;

    if (!slug) {
      return res.status(400).json({ error: "Missing slug parameter" });
    }

    const filepath = path.join(__dirname, "public", "screenshots", `${slug}.jpg`);

    // Check if screenshot exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        error: "Screenshot not found",
        message: `No screenshot for slug: ${slug}. Run 'pnpm run generate-screenshots' to generate.`
      });
    }

    res.sendFile(filepath);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve from the current directory if we're already in 'dist'
    // otherwise serve from a 'dist' subdirectory.
    const distPath = isBuilt ? baseDir : path.join(baseDir, 'dist');
    console.log(`[Server] Serving static files from: ${distPath}`);

    app.use(express.static(distPath));
    app.get(/.*/, (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application files not found. Ensure 'dist' contains 'index.html'.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
