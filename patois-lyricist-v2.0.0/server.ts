import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { requireWmsAuth } from "./src/server/wmsAuthMiddleware.ts";

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

// --- Gemini custody: this app NEVER holds the Gemini key (fleet standard, ---
// --- Pattern 11). Every generateContent call is relayed to the WMS proxy  ---
// --- with the GEMINI_PROXY_KEY service credential; only WMS adds the key. ---
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';
const MODEL = 'gemini-2.5-pro';

if (!GEMINI_PROXY_KEY) {
  console.warn('[Patois Lyricist] WARNING: GEMINI_PROXY_KEY not set — AI routes will return 503');
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

class RelayError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'RelayError';
  }
}

// Relay a raw Gemini generateContent body to WMS and return the parsed REST response.
async function callGemini(body: unknown): Promise<GeminiResponse> {
  if (!GEMINI_PROXY_KEY) throw new RelayError('GEMINI_PROXY_KEY not configured', 503);
  const upstream = await fetch(`${WMS_GEMINI_URL}?model=${encodeURIComponent(MODEL)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
    body: JSON.stringify(body),
  });
  if (!upstream.ok) {
    const errText = await upstream.text();
    console.error(`[Patois Lyricist] WMS relay failed ${upstream.status}: ${errText.slice(0, 500)}`);
    throw new RelayError(`WMS relay returned ${upstream.status}`, 502);
  }
  return await upstream.json() as GeminiResponse;
}

function extractText(response: GeminiResponse): string {
  return (response.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? '').join('');
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3004;

  app.use(express.json({ limit: '5mb' }));

  // Served under the /patois sub-path (Apache/.htaccess proxies /patois/api/ here).
  // Sign-in is delegated entirely to WMS SSO — the app no longer runs its own
  // Google OAuth callback; the client exchanges the code with WMS directly.
  const basePath = process.env.APP_BASE_PATH || '/patois';

  // Gemini Generation Proxy — WMS SSO guarded (all TUC, @techbridge.edu.gh).
  app.post(['/api/gemini/generate', `${basePath}/api/gemini/generate`], requireWmsAuth, async (req, res) => {
    try {
      const { prompt, systemInstruction, temperature } = req.body;
      if (!prompt || !systemInstruction) {
        return res.status(400).json({ error: "Missing prompt or systemInstruction" });
      }

      // Honour a client-supplied temperature (the two-pass critique lowers it
      // for the revise pass); clamp to a sane range and default to 0.95.
      const temp = typeof temperature === "number" && temperature >= 0 && temperature <= 2
        ? temperature
        : 0.95;

      const response = await callGemini({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: temp,
          topP: 0.9,
          thinkingConfig: { thinkingBudget: 12000 },
        },
      });

      res.json({ text: extractText(response) });
    } catch (error: any) {
      console.error("[Patois Lyricist] Gemini Relay Error:", error);
      const status = error instanceof RelayError ? error.status : 500;
      res.status(status).json({ error: "Failed to generate lyrics" });
    }
  });

  // Health check
  app.get(["/api/health", `${basePath}/api/health`], (_req, res) => {
    res.json({ status: "operational", timestamp: new Date().toISOString() });
  });

  // Production-only static serving fallback
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(basePath, express.static(distPath));
      app.get(new RegExp(`^${basePath}(/.*)?$`), (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Patois Lyricist] Server running on http://localhost:${PORT}`);
  });
}

startServer();
