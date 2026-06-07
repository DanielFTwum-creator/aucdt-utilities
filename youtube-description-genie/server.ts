import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Server-side relay to the central WMS Gemini proxy ──────────────────────
// The Gemini API key is NO LONGER in this app at all. The browser calls this
// server's /api/generate; the server forwards to WMS, presenting the service
// credential (X-Gemini-Proxy-Key) which lives ONLY in this server's env.
// Mirrors the OmniExtract pattern. No secret ever reaches the client bundle.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT          = Number(process.env.PORT) || 4173;
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const PROXY_KEY      = process.env.GEMINI_PROXY_KEY || '';

if (!PROXY_KEY) {
  console.warn('[ytdg] WARNING: GEMINI_PROXY_KEY not set — /api/generate will return 503');
}

const app = express();
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.type('text').send('healthy'));

// Generate-description proxy. Body is the raw Gemini generateContent request
// (contents + generationConfig) built client-side; we relay it to WMS verbatim.
app.post('/api/generate', async (req, res) => {
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
const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir, { index: false }));
app.get('*', (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) return res.status(404).send('App not built — run pnpm build');
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ytdg] listening on http://localhost:${PORT} — Gemini via WMS proxy`);
});
