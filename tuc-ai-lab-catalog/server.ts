import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isBuilt = __dirname.endsWith('dist') || !fs.existsSync(path.join(__dirname, 'server.ts'));
const baseDir = __dirname;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve callback page and static files BEFORE vite middleware (so they're found first)
  app.use(express.static(path.join(__dirname, "public")));
  app.use("/public", express.static(path.join(__dirname, "public")));

  // Serve pre-generated screenshots
  app.get("/api/screenshot", (req, res) => {
    const slug = req.query.slug as string;

    if (!slug) {
      return res.status(400).json({ error: "Missing slug parameter" });
    }

    const filepath = path.join(__dirname, "public", "screenshots", `${slug}.jpg`);

    // Check if screenshot exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        error: "Screenshot not found",
        message: `No screenshot for slug: ${slug}. Run 'pnpm run generate-screenshots' to generate.`
      });
    }

    res.sendFile(filepath);
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
