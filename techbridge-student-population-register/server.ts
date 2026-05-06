import express from "express";
import { createServer as createViteServer } from "vite";
import playwright from '@playwright/test';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/run-tests", async (req, res) => {
    const results = [];
    let browser;
    try {
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      const baseUrl = `http://localhost:${PORT}`;

      // Test 1: Load Dashboard
      try {
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        const title = await page.title();
        const screenshot = await page.screenshot({ encoding: 'base64' });
        results.push({
          name: 'Load Dashboard',
          status: 'passed',
          message: `Page loaded successfully. Title: ${title}`,
          screenshot: `data:image/png;base64,${screenshot}`
        });
      } catch (e: any) {
        results.push({ name: 'Load Dashboard', status: 'failed', message: e.message });
      }

      // Test 2: Open Registration Modal
      try {
        await page.click('button[aria-label="Register Student"]');
        await page.waitForSelector('div[role="dialog"]', { timeout: 5000 });
        const screenshot = await page.screenshot({ encoding: 'base64' });
        results.push({
          name: 'Open Registration Modal',
          status: 'passed',
          message: 'Modal opened successfully.',
          screenshot: `data:image/png;base64,${screenshot}`
        });
        
        // Close modal
        await page.click('button[aria-label="Close modal"]');
        await page.waitForFunction(() => !document.querySelector('div[role="dialog"]'));
      } catch (e: any) {
        results.push({ name: 'Open Registration Modal', status: 'failed', message: e.message });
      }

      // Test 3: Navigate to Admin Portal
      try {
        await page.click('a[aria-label="Admin Portal"]');
        await page.waitForSelector('input[aria-label="Admin password"]', { timeout: 5000 });
        const screenshot = await page.screenshot({ encoding: 'base64' });
        results.push({
          name: 'Navigate to Admin Portal',
          status: 'passed',
          message: 'Admin login page loaded successfully.',
          screenshot: `data:image/png;base64,${screenshot}`
        });
      } catch (e: any) {
        results.push({ name: 'Navigate to Admin Portal', status: 'failed', message: e.message });
      }

    } catch (error: any) {
      console.error("Playwright error:", error);
      // If Playwright fails to launch (e.g., missing OS dependencies), return a graceful error
      return res.status(500).json({ 
        error: "Failed to initialize test environment. " + error.message,
        results: [
          { name: 'System Check', status: 'failed', message: 'Playwright launch failed: ' + error.message }
        ]
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    res.json({ results });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
