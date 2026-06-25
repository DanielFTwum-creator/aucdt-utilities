import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3333;

const WMS_KEY_URL = 'https://wms.techbridge.edu.gh/api/gemini/key';
const KEY_TTL_MS = 6 * 60 * 60 * 1000;
let cachedGeminiKey: string | null = null;
let keyFetchedAt = 0;

function invalidateGeminiKey() { cachedGeminiKey = null; keyFetchedAt = 0; }

async function getGeminiKey(): Promise<string> {
  if (cachedGeminiKey && Date.now() - keyFetchedAt < KEY_TTL_MS) return cachedGeminiKey;
  const proxyKey = process.env.GEMINI_PROXY_KEY;
  if (!proxyKey) {
    const local = process.env.GEMINI_API_KEY;
    if (local) return local;
    throw new Error('GEMINI_PROXY_KEY not set and no local fallback.');
  }
  const r = await fetch(WMS_KEY_URL, { headers: { 'X-Gemini-Proxy-Key': proxyKey } });
  if (!r.ok) throw new Error(`WMS key fetch failed: ${r.status} ${await r.text()}`);
  cachedGeminiKey = ((await r.json()) as any).apiKey;
  keyFetchedAt = Date.now();
  return cachedGeminiKey!;
}

const app = express();
app.use(express.json({ limit: '2mb' }));

// Gemini text proxy — keeps the API key server-side
app.post(['/api/gemini/generate', '/animator/api/gemini/generate'], async (req, res) => {
  try {
    const { prompt, systemInstruction, model = 'gemini-2.0-flash' } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const apiKey = await getGeminiKey();
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const genModel = genAI.getGenerativeModel({
      model,
      ...(systemInstruction && { systemInstruction }),
    });
    const result = await genModel.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (error: any) {
    console.error('[animator] Gemini proxy error:', error);
    if (error?.message?.includes('API_KEY_INVALID') || error?.status === 401) invalidateGeminiKey();
    res.status(500).json({ error: 'AI generation failed' });
  }
});

app.get(['/api/health', '/animator/api/health'], (_req, res) => {
  res.json({ ok: true, service: 'animator-agent-desktop', port: PORT });
});

// Static serving in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    app.use('/animator', express.static(distPath, { maxAge: '1y', immutable: true, index: false }));
    app.get(['/animator', '/animator/*path'], (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

app.listen(PORT, '0.0.0.0', () => console.log(`[animator] Server on http://localhost:${PORT}`));
