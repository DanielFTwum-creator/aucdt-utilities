// Set local browsers path to avoid /root permission issues
import { fileURLToPath } from "url";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if we are at the project root or inside the built 'dist' folder
const isBuilt = __dirname.endsWith('dist') || !fs.existsSync(path.join(__dirname, 'server.ts'));
const baseDir = __dirname;
const browsersBase = path.join(baseDir, "playwright-browsers");

// Always prefer local playwright browsers
process.env.PLAYWRIGHT_BROWSERS_PATH = browsersBase;

import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { chromium } from "playwright";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure directories exist
  const screenshotsDir = path.join(__dirname, "public", "screenshots");
  const cacheDir = path.join(__dirname, ".cache");
  [screenshotsDir, cacheDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // API routes FIRST
  app.use("/public", express.static(path.join(__dirname, "public")));

  app.get("/api/screenshot", async (req, res) => {
    const targetUrl = req.query.url as string;
    const slug = req.query.slug as string;

    if (!targetUrl || !slug) {
      return res.status(400).send("Missing url or slug parameters");
    }

    const filename = `${slug}.jpg`;
    const filepath = path.join(screenshotsDir, filename);

    // Check if cached version exists (older than 24h?)
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      const isOld = Date.now() - stats.mtimeMs > 24 * 60 * 60 * 1000;
      if (!isOld) {
        return res.sendFile(filepath);
      }
    }

    let browser;
    try {
      console.log(`[Playwright] Capturing screenshot for: ${targetUrl}`);
      
      // Dynamically find the chromium executable in the local folder
      const browsersBase = path.join(__dirname, "playwright-browsers");
      let executablePath: string | undefined = undefined;

      if (fs.existsSync(browsersBase)) {
        const dirs = fs.readdirSync(browsersBase);
        // Look for chromium-headless-shell or chromium directories
        const shellDir = dirs.find(d => d.startsWith('chromium_headless_shell-'));
        const chromeDir = dirs.find(d => d.startsWith('chromium-'));
        
        if (shellDir) {
           executablePath = path.join(browsersBase, shellDir, "chrome-headless-shell-linux64", "chrome-headless-shell");
        } else if (chromeDir) {
           executablePath = path.join(browsersBase, chromeDir, "chrome-linux64", "chrome");
        }
      }

      if (executablePath && !fs.existsSync(executablePath)) {
        console.warn(`[Playwright] Computed path ${executablePath} does not exist, falling back to system default.`);
        executablePath = undefined;
      }
      
      browser = await chromium.launch({ 
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      const context = await browser.newContext({
        viewport: { width: 1024, height: 768 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      });
      const page = await context.newPage();
      
      // Navigate and wait
      await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
      
      // Wait for fonts and settle animations
      await page.waitForTimeout(3000); 
      
      // Attempt to wait for any visible content if it's dynamic
      try {
        await page.waitForSelector('body', { timeout: 5000 });
      } catch (e) {
        console.warn("[Playwright] Timeout waiting for body, taking screenshot anyway.");
      }      
      // Hide common popups
      await page.evaluate(() => {
        const style = document.createElement('style');
        style.innerHTML = `
          [id*="cookie"], [class*="cookie"], 
          [id*="modal"], [class*="modal"],
          [id*="banner"], [class*="banner"],
          [id*="popup"], [class*="popup"] { display: none !important; }
        `;
        document.head.appendChild(style);
      });
      
      await page.screenshot({ 
        path: filepath, 
        type: "jpeg", 
        quality: 90,
        fullPage: false
      });

      console.log(`[Playwright] Captured: ${filepath}`);
      res.sendFile(filepath);
    } catch (error: any) {
      console.error("[Playwright Error]:", error?.message || error);
      // Fallback: If local screenshot fails, redirect to thum.io
      res.redirect(`https://image.thum.io/get/width/800/crop/800/noanimate/${targetUrl}`);
    } finally {
      if (browser) await browser.close();
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
    // In production, serve from the current directory if we're already in 'dist'
    // otherwise serve from a 'dist' subdirectory.
    const distPath = isBuilt ? baseDir : path.join(baseDir, 'dist');
    console.log(`[Server] Serving static files from: ${distPath}`);
    
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
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
