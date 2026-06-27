import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Gemini key custody via WMS proxy (PATTERNS.md #11) ──────────────────────
// The key is NEVER sent to the browser. The client calls /api/lyrics and this
// server resolves the key at runtime (WMS proxy, with a local dev fallback).
const WMS_KEY_URL = "https://wms.techbridge.edu.gh/api/gemini/key";
const KEY_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
let cachedGeminiKey: string | null = null;
let keyFetchedAt = 0;

function invalidateGeminiKey() { cachedGeminiKey = null; keyFetchedAt = 0; }

async function getGeminiKey(): Promise<string> {
  if (cachedGeminiKey && Date.now() - keyFetchedAt < KEY_TTL_MS) return cachedGeminiKey;
  const proxyKey = process.env.GEMINI_PROXY_KEY;
  if (!proxyKey) {
    // Local dev fallback only — production must set GEMINI_PROXY_KEY via WMS.
    const local = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (local) return local;
    throw new Error("GEMINI_PROXY_KEY is not set (and no local key fallback).");
  }
  const r = await fetch(WMS_KEY_URL, { headers: { "X-Gemini-Proxy-Key": proxyKey } });
  if (!r.ok) throw new Error(`WMS key fetch failed: ${r.status} ${await r.text()}`);
  cachedGeminiKey = ((await r.json()) as { apiKey: string }).apiKey;
  keyFetchedAt = Date.now();
  return cachedGeminiKey!;
}

if (!process.env.GEMINI_PROXY_KEY) {
  console.warn("[bridge-radio] WARNING: GEMINI_PROXY_KEY not set — /api/lyrics will use local fallback or return 503");
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3021;

  // AI lyrics — server-side so the Gemini key never reaches the browser.
  app.get("/api/lyrics", async (req, res) => {
    const track = (req.query.track as string || "").trim();
    const genre = (req.query.genre as string || "").trim();
    if (!track) return res.status(400).json({ error: "track parameter is required" });

    const geminiKey = await getGeminiKey().catch((err: any) => {
      console.error("[bridge-radio] Gemini key fetch failed:", err.message);
      return null;
    });
    if (!geminiKey) return res.status(503).json({ error: "AI service temporarily unavailable" });

    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find or generate poetic lyrics for a track titled "${track}" in the ${genre || "instrumental"} music genre. Format with line breaks. If no suitable lyrics can be found or imagined for this specific track title and mood, simply respond with "Lyrics not found".`,
      });
      const text = (response.text || "").trim();
      const found = text && text.toLowerCase() !== "lyrics not found";
      return res.json({ lyrics: found ? text : null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[bridge-radio] lyrics generation error:", msg);
      if (msg.includes("API_KEY_INVALID") || msg.includes("INVALID_ARGUMENT")) invalidateGeminiKey();
      return res.status(502).json({ error: "Lyrics generation failed" });
    }
  });

  // Proxy route to bypass CORS
  app.get("/api/proxy", async (req, res) => {
    let targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).send("URL parameter is required");
    }

    // Handle potential double-proxying or relative proxy URLs
    // If the URL starts with our proxy path, extract the actual target
    if (targetUrl.startsWith("/api/proxy") || targetUrl.includes("/api/proxy?url=")) {
      try {
        const urlObj = new URL(targetUrl, `http://${req.headers.host}`);
        const innerUrl = urlObj.searchParams.get("url");
        if (innerUrl) {
          targetUrl = innerUrl;
        }
      } catch (e) {
        console.error("Error parsing nested proxy URL:", e);
      }
    }

    // Ensure we have an absolute URL for fetch
    if (!targetUrl.startsWith("http")) {
      return res.status(400).send(`Invalid target URL: ${targetUrl}. Must be an absolute URL starting with http/https.`);
    }

    try {
      // Ensure the target URL is properly encoded before fetching
      const urlObj = new URL(targetUrl);
      // Manually encode ampersands in the pathname to prevent 404s on some servers
      urlObj.pathname = urlObj.pathname.replace(/&/g, '%26');
      const encodedTargetUrl = urlObj.toString();
      
      console.log(`Proxying request to: ${encodedTargetUrl}`);
      
      const response = await fetch(encodedTargetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://ai.techbridge.edu.gh/"
        }
      });
      
      const contentType = response.headers.get("content-type");
      console.log(`Proxy Response: ${response.status} ${response.statusText} | Content-Type: ${contentType} | URL: ${encodedTargetUrl}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "No error body");
        console.error(`Proxy fetch failed: ${response.status} ${response.statusText} for ${encodedTargetUrl}. Body: ${errorText.substring(0, 200)}`);
        return res.status(response.status).send(`Failed to fetch from target URL: ${response.statusText}. ${errorText.substring(0, 100)}`);
      }

      if (contentType) {
        res.setHeader("Content-Type", contentType);
      }
      
      // For binary files (like .ts segments), we should pipe the buffer
      if (targetUrl.endsWith(".ts") || (contentType && contentType.includes("video/"))) {
        const buffer = await (response as any).buffer?.() || await response.arrayBuffer();
        return res.send(Buffer.from(buffer));
      }

      let text = await response.text();
      
      // If it's an M3U8 file, rewrite relative URLs to absolute ones and proxy them
      if (targetUrl.endsWith(".m3u8") || text.includes("#EXTM3U")) {
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);
        text = text.split("\n").map(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#")) {
            const absoluteUrl = trimmed.startsWith("http") ? trimmed : baseUrl + trimmed;
            // Decode ampersands and spaces before encoding to prevent double encoding
            const decoded = absoluteUrl.replace(/%26/g, '&').replace(/%20/g, ' ');
            return `/api/proxy?url=${encodeURIComponent(decoded)}`;
          }
          return line;
        }).join("\n");
      }
      
      res.send(text);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).send(`Proxy error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
