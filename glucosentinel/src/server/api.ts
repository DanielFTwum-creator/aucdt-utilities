import { Router } from "express";
import { db } from "./db";
import { logAudit, getAuditLogs } from "./audit";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import fs from "fs";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ... existing audit routes ...

router.post("/audit", (req, res) => {
  const { action, details, user } = req.body;
  logAudit(action, details, user);
  res.json({ success: true });
});

router.get("/audit", (req, res) => {
  const logs = getAuditLogs();
  res.json(logs);
});

// EXPORT DATA (CSV)
router.get("/export", (req, res) => {
  const readings = db.prepare("SELECT * FROM glucose_readings ORDER BY date DESC").all() as any[];
  
  const header = "Date,Time Slot,Value (mmol/L),Meal,Medication,Activity,Mood,Notes\n";
  const rows = readings.map(r => 
    `${r.date},${r.time_slot},${r.value},"${r.meal_description || ''}",${r.medication_taken ? 'Yes' : 'No'},${r.activity_logged ? 'Yes' : 'No'},"${r.emotional_state || ''}","${r.notes || ''}"`
  ).join("\n");

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="glucose-readings.csv"');
  res.send(header + rows);
});

// IMPORT DATA (JSON for simplicity in this demo, or CSV parsing)
router.post("/import", (req, res) => {
  const { readings } = req.body; // Expecting array of reading objects
  
  if (!Array.isArray(readings)) {
    return res.status(400).json({ error: "Invalid format" });
  }

  const insert = db.prepare(`
    INSERT INTO glucose_readings (
      patient_id, date, time_slot, value, meal_description, medication_taken, activity_logged, emotional_state, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const importTx = db.transaction((data) => {
    for (const r of data) {
      insert.run(1, r.date, r.time_slot, r.value, r.meal_description, r.medication_taken, r.activity_logged, r.emotional_state, r.notes);
    }
  });

  try {
    importTx(readings);
    logAudit("IMPORT_DATA", `Imported ${readings.length} readings`, "admin");
    res.json({ success: true, count: readings.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// IMAGE ANALYSIS (Gemini)
router.post("/analyze-image", upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image provided" });

  try {
    const base64Image = req.file.buffer.toString("base64");
    const model = "gemini-2.5-flash"; // Using Flash for speed/vision

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: "user",
          parts: [
            { text: "Analyse this image. If it shows a glucose meter, extract the numeric value (mmol/L). If it shows food, estimate the carb count. Return ONLY a JSON object: { type: 'meter' | 'food' | 'unknown', value: number | null, unit: string | null, description: string }." },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Image
              }
            }
          ]
        }
      ]
    });

    const text = response.text();
    // Clean up markdown code blocks if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    res.json(data);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

router.get("/readings", (req, res) => {
  const readings = db.prepare("SELECT * FROM glucose_readings ORDER BY date ASC, id ASC").all();
  res.json(readings);
});

router.post("/readings", (req, res) => {
  const { date, time_slot, value, meal_description, medication_taken, activity_logged, emotional_state, notes } = req.body;
  
  const insert = db.prepare(`
    INSERT INTO glucose_readings (
      patient_id, date, time_slot, value, meal_description, medication_taken, activity_logged, emotional_state, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = insert.run(1, date, time_slot, value, meal_description, medication_taken, activity_logged, emotional_state, notes);
  res.json({ id: info.lastInsertRowid });
});

router.get("/patterns", (req, res) => {
  const readings = db.prepare("SELECT * FROM glucose_readings ORDER BY date ASC").all() as any[];
  
  const patterns = [];
  
  // Dawn Phenomenon (simplified: fasting > 7.0 consistently)
  const fastingReadings = readings.filter(r => r.time_slot === "Fasting");
  const highFasting = fastingReadings.filter(r => r.value > 7.0);
  if (highFasting.length > 3) {
    patterns.push({
      type: "Dawn Phenomenon",
      description: "Frequent elevated fasting readings detected.",
      severity: "high"
    });
  }

  // Pre-Lunch Hyperglycemia
  const preLunchReadings = readings.filter(r => r.time_slot === "Pre-Lunch");
  const highPreLunch = preLunchReadings.filter(r => r.value > 7.0);
  if (highPreLunch.length > 3) {
    patterns.push({
      type: "Pre-Lunch Hyperglycaemia",
      description: "Consistent pattern of elevated pre-lunch readings.",
      severity: "high"
    });
  }

  res.json(patterns);
});

// Get patient settings
router.get("/settings", (req, res) => {
  const patient = db.prepare("SELECT * FROM patients WHERE id = 1").get();
  res.json(patient);
});

// Update patient settings
router.put("/settings", (req, res) => {
  const { target_fasting_min, target_fasting_max } = req.body;
  
  const update = db.prepare(`
    UPDATE patients 
    SET target_fasting_min = ?, target_fasting_max = ?
    WHERE id = 1
  `);
  
  update.run(target_fasting_min, target_fasting_max);
  res.json({ success: true });
});

import { exec } from "child_process";
import path from "path";

// ... existing imports

router.post("/test/run", (req, res) => {
  const testScript = path.join(process.cwd(), "tests", "e2e.test.js");
  
  exec(`node ${testScript}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Test execution error: ${error}`);
      return res.status(500).json({ 
        success: false, 
        output: stdout, 
        error: stderr || error.message 
      });
    }
    res.json({ success: true, output: stdout });
  });
});

export default router;
