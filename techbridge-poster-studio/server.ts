
import express from "express";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { chromium } from 'playwright';
import { getPosterHtml } from './src/lib/poster-utils';
import { getPosterDimensions } from './src/constants';
import dotenv from 'dotenv';

import fs from "fs";
if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || '';
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
  const REDIRECT_URI = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/poster/callback';

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  // CORS headers for mobile app
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  // OAuth callback handler
  app.get(['/callback', '/poster/callback'], async (req, res) => {
    const { code, error } = req.query as Record<string, string>;
    if (error) return res.redirect(`/poster/?error=${encodeURIComponent(error)}`);
    if (!code) return res.redirect('/poster/?error=missing_code');
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
        const e = await tokenResponse.json();
        console.error('[techbridge-poster-studio] token failed:', e);
        return res.redirect('/poster/?error=token_exchange_failed');
      }
      const tokens = (await tokenResponse.json()) as { id_token?: string };
      if (!tokens.id_token) return res.redirect('/poster/?error=no_id_token');
      const userInfo = decodeJWT(tokens.id_token);
      res.cookie(
        'techbridge-poster-studio_user',
        Buffer.from(
          JSON.stringify({
            id: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
          })
        ).toString('base64'),
        {
          httpOnly: false,
          secure: true,
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: '/poster/',
        }
      );
      return res.redirect('/poster/');
    } catch (err) {
      console.error('[techbridge-poster-studio] OAuth error:', err);
      return res.redirect('/poster/?error=internal_error');
    }
  });

  app.post("/api/generate", async (req, res) => {
    const { format, data } = req.body;
    let browser;
    try {
      const dims = getPosterDimensions(data.aspectRatio);

      browser = await chromium.launch();
      const page = await browser.newPage({
        viewport: { width: dims.width, height: dims.height },
        deviceScaleFactor: 2
      });
      await page.setContent(getPosterHtml(data), { waitUntil: 'networkidle' });
      
      // Wait for all images to actually load
      try {
        await page.waitForFunction(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs.every(img => img.complete && img.naturalWidth > 0);
        }, { timeout: 5000 });
      } catch (e) {
        console.warn("Some images timed out while loading in Playwright:", e);
      }
      
      await page.waitForTimeout(1000); 
      
      const outputDir = "/mnt/user-data/outputs";
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      if (format === 'png') {
        const buffer = await page.locator(".poster-container").screenshot();
        fs.writeFileSync(path.join(outputDir, "techbridge-poster.png"), buffer);
        res.setHeader('Content-Type', 'image/png');
        res.send(buffer);
      } else {
        const buffer = await page.pdf({ 
          width: dims.width, 
          height: dims.height, 
          printBackground: true 
        });
        fs.writeFileSync(path.join(outputDir, "techbridge-poster.pdf"), buffer);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(buffer);
      }
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ error: (error as Error).message });
    } finally {
      if (browser) await browser.close();
    }
  });

  // Keep existing save-files route for compatibility
  app.post("/api/save-files", (req, res) => {
    const { pngData, pdfData } = req.body;
    const outputDir = "/mnt/user-data/outputs";
    try {
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      if (pngData) {
        const pngBuffer = Buffer.from(pngData.split(",")[1], 'base64');
        fs.writeFileSync(path.join(outputDir, "techbridge-poster.png"), pngBuffer);
      }
      if (pdfData) {
        const pdfBuffer = Buffer.from(pdfData.split(",")[1], 'base64');
        fs.writeFileSync(path.join(outputDir, "techbridge-poster.pdf"), pdfBuffer);
      }
      res.json({ success: true });
    } catch (e) { res.status(500).send(e); }
  });

  if (NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[${new Date().toISOString()}] Server running on port ${PORT} (${NODE_ENV})`);
  });
}

startServer();
