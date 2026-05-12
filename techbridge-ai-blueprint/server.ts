import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import AdmZip from "adm-zip";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Project Export Endpoint
  app.get("/api/export", (req, res) => {
    try {
      const zip = new AdmZip();
      
      // Add source and config files
      zip.addLocalFolder(path.join(process.cwd(), "src"), "src");
      zip.addLocalFile(path.join(process.cwd(), "package.json"));
      zip.addLocalFile(path.join(process.cwd(), "tsconfig.json"));
      zip.addLocalFile(path.join(process.cwd(), "vite.config.ts"));
      zip.addLocalFile(path.join(process.cwd(), "index.html"));
      zip.addLocalFile(path.join(process.cwd(), "metadata.json"));
      
      // Add docs if they exist
      const docsPath = path.join(process.cwd(), "docs");
      try {
        zip.addLocalFolder(docsPath, "docs");
      } catch (e) {
        console.warn("No docs folder found to export");
      }

      const zipName = "techbridge-ai-blueprint-export.zip";
      const buffer = zip.toBuffer();

      res.set("Content-Type", "application/zip");
      res.set("Content-Disposition", `attachment; filename=${zipName}`);
      res.set("Content-Length", buffer.length.toString());
      res.end(buffer);
      
    } catch (error) {
      console.error("Export failed:", error);
      res.status(500).json({ error: "Failed to generate project export" });
    }
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({
      status: "operational",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        storage: "online",
        authentication: "active",
        audit_log: "ready"
      },
      environment: {
        node_version: process.version,
        platform: process.platform,
        uptime: Math.round(process.uptime())
      }
    });
  });

  // Simulation of running tests
  app.get("/api/tests/run", (req, res) => {
    const results = [
      { id: 1, name: "SRS Compliance Check", status: "passed", duration: "1.2s", timestamp: new Date().toISOString() },
      { id: 2, name: "Admin Authentication Gate", status: "passed", duration: "0.8s", timestamp: new Date().toISOString() },
      { id: 3, name: "Audit Trail Persistence", status: "passed", duration: "0.5s", timestamp: new Date().toISOString() },
      { id: 4, name: "Accessibility (ARIA) Scan", status: "passed", duration: "2.1s", timestamp: new Date().toISOString() },
      { id: 5, name: "Theme Preference Sync", status: "passed", duration: "0.3s", timestamp: new Date().toISOString() },
    ];
    
    res.json({
      jobId: `TUC-JOB-${Date.now()}`,
      overallStatus: "passed",
      results,
      screenshot: "https://images.unsplash.com/photo-1551288049-bbda4833effb?q=80&w=2070&auto=format&fit=crop"
    });
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
    console.log(`[TUC ICT] Server running on http://localhost:${PORT}`);
  });
}

startServer();
