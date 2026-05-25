import express from "express";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email transporter — uses Gmail app password from .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ""),
  },
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(compression());
  app.use(express.json());

  // API: Contact form — sends inquiry email to Steve
  app.post("/api/contact", async (req, res) => {
    const { schoolName, district, contactName, email, phone, gradeLevels, preferredDates, programType } = req.body;

    const programLabels: Record<string, string> = {
      seminar: "In-Service Seminar (1 Day)",
      intensive: "Multi-Day Staff Residency",
      custom: "Custom Professional Development",
    };

    try {
      await transporter.sendMail({
        from: `"DfS Website" <${process.env.GMAIL_USER}>`,
        to: "sbferrar10@gmail.com",
        replyTo: email,
        subject: `New Inquiry: ${schoolName || "Unknown School"} — Drumming for SEL`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#1a5c2a;padding:24px;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:22px">New Residency Inquiry</h1>
              <p style="color:#cce8d4;margin:6px 0 0">Drumming for SEL Success Website</p>
            </div>
            <div style="padding:32px;background:#f9f9f9">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#555;width:40%"><strong>School / Org</strong></td><td style="padding:10px 0;border-bottom:1px solid #eee">${schoolName}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#555"><strong>District</strong></td><td style="padding:10px 0;border-bottom:1px solid #eee">${district || "—"}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#555"><strong>Contact Name</strong></td><td style="padding:10px 0;border-bottom:1px solid #eee">${contactName}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#555"><strong>Email</strong></td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#555"><strong>Phone</strong></td><td style="padding:10px 0;border-bottom:1px solid #eee">${phone || "—"}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#555"><strong>Grade Levels</strong></td><td style="padding:10px 0;border-bottom:1px solid #eee">${gradeLevels || "—"}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#555"><strong>Preferred Dates</strong></td><td style="padding:10px 0;border-bottom:1px solid #eee">${preferredDates || "—"}</td></tr>
                <tr><td style="padding:10px 0;color:#555"><strong>Training Type</strong></td><td style="padding:10px 0">${programLabels[programType] || programType}</td></tr>
              </table>
            </div>
            <div style="padding:16px 32px;background:#eee;text-align:center;font-size:12px;color:#999">
              Sent from the Drumming for SEL website contact form
            </div>
          </div>
        `,
      });
      res.json({ success: true });
    } catch (err) {
      console.error("Email error:", err);
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  });

  // API: Run Playwright Tests
  app.post("/api/admin/run-tests", (req, res) => {
    console.log("Starting Playwright tests...");
    
    // We'll run the tests and capture output
    // Using --reporter=json to get structured results
    exec("npx playwright test --reporter=json", (error, stdout, stderr) => {
      let results = {};
      try {
        results = JSON.parse(stdout);
      } catch (e) {
        results = { error: "Failed to parse test results", raw: stdout || stderr };
      }
      
      res.json({
        success: !error,
        results,
        timestamp: new Date().toISOString()
      });
    });
  });

  // API: Get Test Screenshots (if any)
  app.get("/api/admin/test-screenshots", (req, res) => {
    const screenshotDir = path.join(process.cwd(), "test-results");
    if (!fs.existsSync(screenshotDir)) {
      return res.json({ screenshots: [] });
    }
    
    // Logic to list screenshots could go here
    res.json({ screenshots: [] });
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
