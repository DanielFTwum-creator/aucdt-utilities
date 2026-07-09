import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireWmsAuth } from './src/server/wmsAuthMiddleware.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3034;

const app = express();
app.use(express.json({ limit: '15mb' })); // image analysis posts base64 JPEGs

// --- Gemini custody: this app NEVER holds the Gemini key (fleet standard, ---
// --- Pattern 11). The SPA posts raw generateContent bodies here and this  ---
// --- route relays them to WMS with the GEMINI_PROXY_KEY credential.       ---
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';

if (!GEMINI_PROXY_KEY) {
  console.warn('[brand-guideline-checker] WARNING: GEMINI_PROXY_KEY not set — /api/gemini/generate will return 503');
}

// WMS SSO guarded (all TUC, @techbridge.edu.gh) — the SPA attaches the Bearer token.
app.post(['/api/gemini/generate', '/brand-guideline-checker/api/gemini/generate'], requireWmsAuth, async (req, res) => {
  if (!GEMINI_PROXY_KEY) return res.status(503).json({ error: 'Gemini proxy not configured.' });
  const { model, body } = req.body as { model?: string; body?: unknown };
  if (!body) return res.status(400).json({ error: 'body is required.' });
  try {
    const upstream = await fetch(`${WMS_GEMINI_URL}?model=${encodeURIComponent(model || 'gemini-2.5-flash')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    if (!upstream.ok) {
      console.error(`[brand-guideline-checker] WMS relay failed ${upstream.status}: ${text.slice(0, 500)}`);
      return res.status(502).json({ error: 'AI request failed.' });
    }
    res.type('application/json').send(text);
  } catch (err) {
    console.error('[brand-guideline-checker] relay error:', err);
    return res.status(500).json({ error: 'AI request failed.' });
  }
});

app.get(['/api/health', '/brand-guideline-checker/api/health'], (_req, res) => { res.json({ ok: true, service: 'brand-guideline-checker', port: PORT }); });

const distDir = path.join(__dirname, 'dist');
app.use('/brand-guideline-checker', express.static(distDir, { maxAge: '1y', immutable: true, index: false }));
app.get(['/brand-guideline-checker', '/brand-guideline-checker/*path'], (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) return res.status(404).send('App not built');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => console.log(`[brand-guideline-checker] Server on http://localhost:${PORT}`));
