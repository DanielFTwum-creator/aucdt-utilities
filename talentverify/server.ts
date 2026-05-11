import express from "express";
import { createServer as createViteServer } from "vite";
import { initDatabase } from "./src/db";
import { getSystemDiagnostics } from "./src/services/diagnostics";
import apiRoutes from "./src/routes/api";
import authRoutes from "./src/routes/auth";
import adminRoutes from "./src/routes/admin";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json()); // Enable JSON body parsing

  // Initialize Database
  initDatabase();

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes); // Mount admin routes at /api/admin
  app.use("/api", apiRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
