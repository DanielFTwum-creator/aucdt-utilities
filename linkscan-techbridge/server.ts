import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple Admin Auth Simulation (In-memory for now)
  const ADMIN_PASSWORD = "adminTUC%"; // In production this would be an env var
  const auditLogs: any[] = [];

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ token: "fake-jwt-token" });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.post("/api/admin/log", (req, res) => {
    const { action, details } = req.body;
    const log = { id: Date.now(), timestamp: new Date(), action, details };
    auditLogs.push(log);
    res.json(log);
  });

  app.get("/api/admin/logs", (req, res) => {
    res.json(auditLogs);
  });

  // Simulation & Diagnostics
  let simulationMode: 'NORMAL' | 'ERR_404' | 'ERR_500' = 'NORMAL';

  app.post("/api/admin/set-simulation", (req, res) => {
    const { mode } = req.body;
    simulationMode = mode;
    logAction('SIMULATION_MODE_CHANGED', { mode });
    res.json({ success: true, mode });
  });

  // API Route for Link Checking
  app.post("/api/check-link", async (req, res) => {
    const { url } = req.body;
    
    if (simulationMode === 'ERR_404') {
      return res.json({ status: 404, statusText: "Simulated Not Found" });
    }
    if (simulationMode === 'ERR_500') {
      return res.json({ status: 500, statusText: "Simulated Internal Error" });
    }

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      console.log(`[DEBUG] Checking link: ${url}`);
      const response = await axios.get(url, { 
        timeout: 5000,
        validateStatus: () => true, // Allow any status code
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        }
      });
      console.log(`[DEBUG] Response for ${url}: ${response.status}`);
      res.json({ status: response.status, statusText: response.statusText });
    } catch (error: any) {
      console.error(`[ERROR] Failed link check for ${url}:`, error.message);
      res.json({ status: error.response?.status || 0, statusText: error.message || "Error" });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
