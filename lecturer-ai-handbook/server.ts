import express from "express";
import path from "path";
import dotenv from "dotenv";
import { requireWmsAuth } from "./src/server/wmsAuthMiddleware.ts";
// vite is a devDependency, imported dynamically in the dev-only branch below;
// a static import crashes the production server after pnpm install --prod.

dotenv.config();

// --- Gemini custody: this app NEVER holds the Gemini key (Pattern 11). Every model
// --- call is relayed to the WMS proxy with the GEMINI_PROXY_KEY service credential;
// --- only WMS adds the real key. @google/genai is gone. ---
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || "https://wms.techbridge.edu.gh/api/gemini/generate";
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || "";
const MODEL = "gemini-3.5-flash";
const BASE = "/lecturer";

if (!GEMINI_PROXY_KEY) {
  console.warn("[lecturer] WARNING: GEMINI_PROXY_KEY not set — /api/gemini/generate will return 503");
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

// Relay a raw generateContent body to WMS (which injects the real key) and return
// the concatenated text.
async function relayGenerate(body: Record<string, unknown>): Promise<string> {
  const r = await fetch(`${WMS_GEMINI_URL}?model=${MODEL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Gemini-Proxy-Key": GEMINI_PROXY_KEY },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`WMS relay failed: ${r.status} ${await r.text()}`);
  const data = (await r.json()) as GeminiResponse;
  return (data.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? "").join("");
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3042;

  app.use(express.json({ limit: "2mb" }));

  // nginx forwards the /lecturer prefix through to this server; normalise it for
  // ALL /api routes in one place (Pattern 25 — per-route dual registration has
  // missed routes twice, do not use it).
  app.use((req, _res, next) => {
    if (req.url.startsWith(`${BASE}/api/`)) req.url = req.url.slice(BASE.length);
    next();
  });

  // Fleet-standard health check (Pattern 25 stage 10)
  app.get("/api/health", (_req, res) =>
    res.json({ ok: true, service: "lecturer-ai-handbook", custody: GEMINI_PROXY_KEY ? "wms-relay" : "unconfigured" })
  );

  // Config probe (no secret revealed) — used by the header to show AI availability.
  app.get("/api/gemini/status", (_req, res) => res.json({ available: !!GEMINI_PROXY_KEY }));

  // AI generation — WMS-gated (all-TUC), relayed to WMS. Preserves the existing
  // client contract: { prompt, systemInstruction } -> { text }.
  app.post("/api/gemini/generate", requireWmsAuth, async (req, res) => {
    const { prompt, systemInstruction } = req.body ?? {};
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    if (!GEMINI_PROXY_KEY) return res.status(503).json({ error: "AI relay is not configured." });
    try {
      const text = await relayGenerate({
        contents: [{ role: "user", parts: [{ text: String(prompt) }] }],
        ...(systemInstruction ? { systemInstruction: { parts: [{ text: String(systemInstruction) }] } } : {}),
      });
      res.json({ text: text || "No response received from the model." });
    } catch (error: any) {
      console.error("[lecturer] WMS relay error:", error);
      res.status(502).json({ error: "The AI service is temporarily unavailable. Please try again." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Dual mounts: nginx forwards the /lecturer prefix through (Pattern 25).
    app.use(express.static(distPath));
    app.use(BASE, express.static(distPath));
    app.get(/.*/, (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[lecturer] listening on http://localhost:${PORT} (custody: ${GEMINI_PROXY_KEY ? "wms-relay" : "unconfigured"})`);
  });
}

startServer();
