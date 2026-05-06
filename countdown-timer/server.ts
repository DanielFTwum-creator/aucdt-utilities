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
    try {
      const browser = await chromium.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      const results = [];

      try {
        // Test 1: Timer Page Load
        await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
        const timerExists = await page.$('main[aria-label="Countdown Timer Page"]');
        const screenshot1 = await page.screenshot({ encoding: 'base64' });
        results.push({
          name: 'Timer Page Load',
          status: timerExists ? 'passed' : 'failed',
          screenshot: `data:image/png;base64,${screenshot1}`
        });

        // Test 2: Navigate to Admin
        await page.click('a[aria-label="Go to Admin Panel"]');
        await page.waitForSelector('form[aria-label="Admin Login Form"]');
        const screenshot2 = await page.screenshot({ encoding: 'base64' });
        results.push({
          name: 'Navigate to Admin Login',
          status: 'passed',
          screenshot: `data:image/png;base64,${screenshot2}`
        });

        // Test 3: Admin Login
        await page.type('input#password', 'admin123');
        await page.click('button[type="submit"]');
        
        // Wait for dashboard
        await page.waitForFunction(() => {
          const h1 = document.querySelector('h1');
          return h1 && h1.textContent === 'Admin Dashboard';
        }, { timeout: 5000 });
        
        const screenshot3 = await page.screenshot({ encoding: 'base64' });
        results.push({
          name: 'Admin Login',
          status: 'passed',
          screenshot: `data:image/png;base64,${screenshot3}`
        });

      } catch (err: any) {
        results.push({
          name: 'Test Execution Error',
          status: 'failed',
          message: err.message
        });
      } finally {
        await browser.close();
      }

      res.json({ success: true, results });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
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
    app.use(express.static('dist'));
    app.use('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
