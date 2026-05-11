import express from "express";
import { createServer as createViteServer } from "vite";
import playwright from '@playwright/test';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Playwright Test Runner
  app.post("/api/tests/run", async (req, res) => {
    const { testId } = req.body;
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    
    console.log(`Running test ${testId} on ${appUrl}`);
    
    let browser;
    try {
      browser = await chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      
      const results = [];
      let screenshot = "";

      if (testId === "critical-path") {
        // Test 1: Home Page Load
        await page.goto(appUrl, { waitUntil: "networkidle0" });
        const title = await page.title();
        results.push({ name: "Home Page Load", status: "passed", detail: `Loaded page with title: ${title}` });

        // Test 2: Check for Category Cards
        const cards = await page.$$('[role="listitem"]');
        results.push({ name: "Category Cards", status: cards.length >= 4 ? "passed" : "failed", detail: `Found ${cards.length} category cards.` });

        // Test 3: Navigation to Docs
        await page.click('a[aria-label="View Google Docs shortcuts"]');
        await page.waitForSelector("h1");
        const headerText = await page.$eval("h1", el => el.textContent);
        results.push({ name: "Navigation to Docs", status: headerText?.includes("Google Docs") ? "passed" : "failed", detail: `Navigated to ${headerText}` });

        // Take screenshot of the result
        const screenshotBuffer = await page.screenshot({ encoding: "base64" });
        screenshot = `data:image/png;base64,${screenshotBuffer}`;
      } else if (testId === "admin-auth") {
        // Test Admin Login
        await page.goto(`${appUrl}/admin`, { waitUntil: "networkidle0" });
        await page.type("#password", "admin123");
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: "networkidle0" });
        
        const currentUrl = page.url();
        results.push({ 
          name: "Admin Authentication", 
          status: currentUrl.includes("/admin/dashboard") ? "passed" : "failed", 
          detail: `Redirected to: ${currentUrl}` 
        });

        const screenshotBuffer = await page.screenshot({ encoding: "base64" });
        screenshot = `data:image/png;base64,${screenshotBuffer}`;
      }

      res.json({ success: true, results, screenshot });
    } catch (error: any) {
      console.error("Playwright error:", error);
      res.status(500).json({ success: false, error: error.message });
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
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
