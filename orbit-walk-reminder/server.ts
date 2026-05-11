import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tuc-admin-2026";
const JWT_SECRET = process.env.JWT_SECRET || "tuc-super-secret-key-2026";
const LOG_FILE = path.join(process.cwd(), "logs", "audit.log");

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(LOG_FILE))) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

app.use(express.json());
app.use(cookieParser());
app.use("/api/admin/screenshots", express.static(path.join(process.cwd(), "logs")));

const auditLog = (admin: string, action: string, resource: string, ip: string) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    admin,
    action,
    resource,
    ip: ip || "unknown"
  };
  fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + "\n");
};

// API: Admin Login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });
    auditLog("system", "LOGIN_SUCCESS", "Admin Section", req.ip || "unknown");
    return res.json({ success: true });
  }
  auditLog("system", "LOGIN_FAILURE", "Admin Section", req.ip || "unknown");
  res.status(401).json({ error: "Invalid credentials" });
});

// API: Verify Session
app.get("/api/admin/verify", (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ authenticated: false });
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});

// API: Logout
app.post("/api/admin/logout", (req, res) => {
  res.clearCookie("admin_token");
  auditLog("admin", "LOGOUT", "Admin Section", req.ip || "unknown");
  res.json({ success: true });
});

// API: Get Audit Logs (Protected)
app.get("/api/admin/logs", (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    jwt.verify(token, JWT_SECRET);
    if (!fs.existsSync(LOG_FILE)) return res.json([]);
    const logs = fs.readFileSync(LOG_FILE, "utf-8")
      .split("\n")
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
      .reverse();
    res.json(logs);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// --- PHASE 3: TESTING & DIAGNOSTICS ---

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API: Internal Diagnostics (Protected)
app.get("/api/admin/diagnostics", (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    jwt.verify(token, JWT_SECRET);
    
    const stats = fs.existsSync(LOG_FILE) ? fs.statSync(LOG_FILE) : { size: 0 };
    
    res.json({
      database: "connected", // Simulation for local state
      fileSystem: "writable",
      logSize: `${(stats.size / 1024).toFixed(2)} KB`,
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version
    });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// API: Puppeteer Test Runner (Protected)
app.post("/api/admin/run-tests", async (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    jwt.verify(token, JWT_SECRET);
    
    // Lazy load puppeteer to save memory
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true
    });

    const page = await browser.newPage();
    const results: any[] = [];
    const appUrl = `http://localhost:${PORT}`;

    const addResult = (name: string, status: "pass" | "fail", message?: string) => {
      results.push({ name, status, message });
    };

    try {
      // Test 1: App Loads
      await page.goto(appUrl, { waitUntil: "networkidle0" });
      const title = await page.title();
      addResult("Page Load", title ? "pass" : "fail", `Title detected: ${title}`);

      // Test 2: Main Timer Exists
      const timer = await page.$('[role="timer"]');
      addResult("Timer Initialization", timer ? "pass" : "fail");

      // Test 3: Theme Switching (Dark to Light)
      await page.click('[aria-label="Light Theme"]');
      const dataTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      addResult("Theme Switch (Light)", dataTheme === "light" ? "pass" : "fail");

      // Test 4: Admin Gate
      await page.click('[aria-label="Admin Settings"]');
      const adminModal = await page.waitForSelector('[role="dialog"]');
      addResult("Admin Gate Interaction", adminModal ? "pass" : "fail");

      // Screenshot for verification
      const screenshotPath = path.join(process.cwd(), "logs", `test-${Date.now()}.png`);
      await page.screenshot({ path: screenshotPath });
      
      await browser.close();
      
      auditLog("admin", "RUN_TESTS", "Puppeteer Engine", req.ip || "unknown");
      res.json({ success: true, results, timestamp: new Date().toISOString() });
    } catch (innerErr: any) {
      addResult("Execution Error", "fail", innerErr.message);
      await browser.close();
      res.json({ success: false, results });
    }
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

async function startServer() {
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
    console.log(`[TUC] Orbit Walk Server Running on http://localhost:${PORT}`);
  });
}

startServer();
