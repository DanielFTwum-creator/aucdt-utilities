import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('[GLUCOSE-API] FATAL: GEMINI_API_KEY not set in environment');
  process.exit(1);
}
const client = new GoogleGenAI({ apiKey });

// -------------------------------------------------------------
// SQLite Database Setup
// -------------------------------------------------------------
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'glucose.db');
const db = new DatabaseSync(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_config (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT
  );

  CREATE TABLE IF NOT EXISTS profile (
    key TEXT PRIMARY KEY,
    patientName TEXT,
    doctorName TEXT,
    doctorPhone TEXT,
    doctorCountry TEXT,
    updatedAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS readings (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    fasting TEXT,
    post_breakfast TEXT,
    pre_lunch TEXT,
    post_lunch TEXT,
    pre_dinner TEXT,
    post_dinner TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );
`);

// Seed test data if database readings table is empty
const countResult = db.prepare("SELECT COUNT(*) as count FROM readings").get() as { count: number };
if (countResult.count === 0) {
  console.log('[GLUCOSE-DB] Database is empty, seeding test data...');
  const seedData = [
    { date: "2026-01-30", fasting: "", post_breakfast: "", pre_lunch: "6.8", post_lunch: "10.5", pre_dinner: "", post_dinner: "" },
    { date: "2026-01-31", fasting: "6.2", post_breakfast: "", pre_lunch: "", post_lunch: "", pre_dinner: "7.1", post_dinner: "8.2" },
    { date: "2026-02-01", fasting: "6.2", post_breakfast: "", pre_lunch: "9.2", post_lunch: "6.2", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-02", fasting: "8.8", post_breakfast: "7.4", pre_lunch: "", post_lunch: "", pre_dinner: "6.7", post_dinner: "" },
    { date: "2026-02-03", fasting: "6.0", post_breakfast: "", pre_lunch: "", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-04", fasting: "5.2", post_breakfast: "", pre_lunch: "", post_lunch: "", pre_dinner: "", post_dinner: "7.9" },
    { date: "2026-02-05", fasting: "7.1", post_breakfast: "", pre_lunch: "9.1", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-06", fasting: "7.1", post_breakfast: "", pre_lunch: "6.3", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-07", fasting: "7.5", post_breakfast: "7.9", pre_lunch: "", post_lunch: "", pre_dinner: "", post_dinner: "9.2" },
    { date: "2026-02-08", fasting: "7.2", post_breakfast: "", pre_lunch: "", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-09", fasting: "8.8", post_breakfast: "9.7", pre_lunch: "", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-10", fasting: "7.6", post_breakfast: "", pre_lunch: "8.8", post_lunch: "", pre_dinner: "6.5", post_dinner: "" },
    { date: "2026-02-12", fasting: "6.0", post_breakfast: "", pre_lunch: "7.1", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-13", fasting: "7.1", post_breakfast: "", pre_lunch: "9.8", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-14", fasting: "6.5", post_breakfast: "", pre_lunch: "9.7", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-15", fasting: "6.0", post_breakfast: "", pre_lunch: "", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-16", fasting: "7.8", post_breakfast: "9.8", pre_lunch: "", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-17", fasting: "6.3", post_breakfast: "", pre_lunch: "", post_lunch: "", pre_dinner: "6.4", post_dinner: "" },
    { date: "2026-02-18", fasting: "6.9", post_breakfast: "", pre_lunch: "5.7", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-19", fasting: "5.9", post_breakfast: "", pre_lunch: "6.8", post_lunch: "", pre_dinner: "", post_dinner: "" },
    { date: "2026-02-21", fasting: "", post_breakfast: "", pre_lunch: "", post_lunch: "", pre_dinner: "6.5", post_dinner: "" },
  ];

  const stmt = db.prepare(`
    INSERT INTO readings (id, date, fasting, post_breakfast, pre_lunch, post_lunch, pre_dinner, post_dinner, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = Date.now();
  for (const r of seedData) {
    const id = `read-${r.date.replace(/[\/\-]/g, '')}`;
    stmt.run(id, r.date, r.fasting, r.post_breakfast, r.pre_lunch, r.post_lunch, r.pre_dinner, r.post_dinner, now, now);
  }
}

// -------------------------------------------------------------
// Interfaces & Types
// -------------------------------------------------------------
interface ScanRequest {
  imageData: string;
  mimeType: string;
}

interface ReadingData {
  date: string;
  fasting: string;
  post_breakfast: string;
  pre_lunch: string;
  post_lunch: string;
  pre_dinner: string;
  post_dinner: string;
}

// -------------------------------------------------------------
// Admin Config API
// -------------------------------------------------------------
app.get(['/api/config/:key', '/glucose/api/config/:key'], (req, res) => {
  try {
    const { key } = req.params;
    const row = db.prepare("SELECT value FROM admin_config WHERE key = ?").get(key) as { value: string } | undefined;
    res.json({ value: row ? row.value : null });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/config/:key', '/glucose/api/config/:key'], (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    db.prepare("INSERT OR REPLACE INTO admin_config (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Audit Logs API
// -------------------------------------------------------------
app.get(['/api/audit-logs', '/glucose/api/audit-logs'], (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC").all();
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/audit-logs', '/glucose/api/audit-logs'], (req, res) => {
  try {
    const { action, details } = req.body;
    const id = `log-${Date.now()}`;
    const timestamp = new Date().toISOString();
    db.prepare("INSERT INTO audit_logs (id, timestamp, action, details) VALUES (?, ?, ?, ?)").run(id, timestamp, action, details || '');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Glucose Readings API
// -------------------------------------------------------------
app.get(['/api/readings', '/glucose/api/readings'], (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM readings ORDER BY date ASC, id ASC").all();
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/readings', '/glucose/api/readings'], (req, res) => {
  try {
    const { id, date, fasting, post_breakfast, pre_lunch, post_lunch, pre_dinner, post_dinner, createdAt, updatedAt } = req.body;
    const now = Date.now();
    db.prepare(`
      INSERT OR REPLACE INTO readings (id, date, fasting, post_breakfast, pre_lunch, post_lunch, pre_dinner, post_dinner, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, date, fasting || '', post_breakfast || '', pre_lunch || '', post_lunch || '', pre_dinner || '', post_dinner || '',
      createdAt || now, updatedAt || now
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete(['/api/readings/:id', '/glucose/api/readings/:id'], (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("DELETE FROM readings WHERE id = ?").run(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/readings/batch', '/glucose/api/readings/batch'], (req, res) => {
  try {
    const { readings } = req.body;
    if (!Array.isArray(readings)) {
      return res.status(400).json({ error: 'readings must be an array' });
    }
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO readings (id, date, fasting, post_breakfast, pre_lunch, post_lunch, pre_dinner, post_dinner, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const now = Date.now();
    db.exec("BEGIN TRANSACTION");
    try {
      for (const r of readings) {
        stmt.run(
          r.id, r.date, r.fasting || '', r.post_breakfast || '', r.pre_lunch || '', r.post_lunch || '', r.pre_dinner || '', r.post_dinner || '',
          r.createdAt || now, r.updatedAt || now
        );
      }
      db.exec("COMMIT");
    } catch (txErr) {
      db.exec("ROLLBACK");
      throw txErr;
    }
    res.json({ success: true, count: readings.length });
  } catch (err: any) {
    console.error('[BATCH-ERROR] Failed to save batch readings:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Patient Profile API
// -------------------------------------------------------------
app.get(['/api/profile', '/glucose/api/profile'], (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM profile WHERE key = 'main'").get();
    res.json(row || null);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/profile', '/glucose/api/profile'], (req, res) => {
  try {
    const { patientName, doctorName, doctorPhone, doctorCountry } = req.body;
    const now = Date.now();
    db.prepare(`
      INSERT OR REPLACE INTO profile (key, patientName, doctorName, doctorPhone, doctorCountry, updatedAt)
      VALUES ('main', ?, ?, ?, ?, ?)
    `).run(patientName || '', doctorName || '', doctorPhone || '', doctorCountry || '', now);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Medical Patterns Analyzer API
// -------------------------------------------------------------
app.get(['/api/patterns', '/glucose/api/patterns'], (req, res) => {
  try {
    const readings = db.prepare("SELECT * FROM readings").all() as any[];
    const patterns = [];

    // Dawn Phenomenon: fasting > 7.0 consistently (more than 3 readings)
    const highFasting = readings.filter(r => r.fasting && parseFloat(r.fasting) > 7.0);
    if (highFasting.length > 3) {
      patterns.push({
        type: "Dawn Phenomenon",
        description: `Elevated fasting glucose detected (${highFasting.length} times). Consider reviewing morning insulin or overnight carb intake.`,
        severity: "high"
      });
    }

    // Pre-Lunch Hyperglycemia: pre_lunch > 7.0 consistently
    const highPreLunch = readings.filter(r => r.pre_lunch && parseFloat(r.pre_lunch) > 7.0);
    if (highPreLunch.length > 3) {
      patterns.push({
        type: "Pre-Lunch Hyperglycemia",
        description: `Elevated pre-lunch glucose detected (${highPreLunch.length} times). Consider adjusting breakfast insulin or carbs.`,
        severity: "high"
      });
    }

    // Post-Lunch Hyperglycemia: post_lunch > 8.9 consistently
    const highPostLunch = readings.filter(r => r.post_lunch && parseFloat(r.post_lunch) > 8.9);
    if (highPostLunch.length > 3) {
      patterns.push({
        type: "Post-Prandial Spike (Lunch)",
        description: `Elevated 2hr post-lunch glucose detected (${highPostLunch.length} times). Consider post-meal walks or portion sizes.`,
        severity: "medium"
      });
    }

    res.json(patterns);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// CSV Import & Export API
// -------------------------------------------------------------
app.get(['/api/export', '/glucose/api/export'], (req, res) => {
  try {
    const readings = db.prepare("SELECT * FROM readings ORDER BY date ASC, id ASC").all() as any[];
    const headers = "Date,Fasting,2h Post-Breakfast,Pre-Lunch,2h Post-Lunch,Pre-Dinner,2h Post-Dinner,Created At,Updated At\n";
    const rows = readings.map(r => {
      const createdAtStr = new Date(r.createdAt).toISOString();
      const updatedAtStr = new Date(r.updatedAt).toISOString();
      return `${r.date},${r.fasting || ''},${r.post_breakfast || ''},${r.pre_lunch || ''},${r.post_lunch || ''},${r.pre_dinner || ''},${r.post_dinner || ''},${createdAtStr},${updatedAtStr}`;
    }).join("\n");

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="glucose-readings.csv"');
    res.send(headers + rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post(['/api/import-csv', '/glucose/api/import-csv'], express.text({ type: 'text/csv', limit: '10mb' }), (req, res) => {
  try {
    const csvData = req.body;
    if (typeof csvData !== 'string' || !csvData.trim()) {
      return res.status(400).json({ error: 'No CSV data provided' });
    }

    const lines = csvData.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV file must contain a header and at least one data row' });
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const dateIdx = headers.indexOf('date');
    const fastingIdx = headers.findIndex(h => h.includes('fasting'));
    const postBreakfastIdx = headers.findIndex(h => h.includes('post-breakfast') || h.includes('post_breakfast'));
    const preLunchIdx = headers.findIndex(h => h.includes('pre-lunch') || h.includes('pre_lunch'));
    const postLunchIdx = headers.findIndex(h => h.includes('post-lunch') || h.includes('post_lunch'));
    const preDinnerIdx = headers.findIndex(h => h.includes('pre-dinner') || h.includes('pre_dinner'));
    const postDinnerIdx = headers.findIndex(h => h.includes('post-dinner') || h.includes('post_dinner'));

    if (dateIdx === -1) {
      return res.status(400).json({ error: 'CSV must contain a "Date" column' });
    }

    const parsedReadings = [];
    const now = Date.now();

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      if (cols.length < headers.length) continue;

      const dateVal = cols[dateIdx];
      if (!dateVal) continue;

      const fastingVal = fastingIdx !== -1 ? cols[fastingIdx] : '';
      const postBreakfastVal = postBreakfastIdx !== -1 ? cols[postBreakfastIdx] : '';
      const preLunchVal = preLunchIdx !== -1 ? cols[preLunchIdx] : '';
      const postLunchVal = postLunchIdx !== -1 ? cols[postLunchVal] : '';
      const preDinnerVal = preDinnerIdx !== -1 ? cols[preDinnerIdx] : '';
      const postDinnerVal = postDinnerIdx !== -1 ? cols[postDinnerVal] : '';

      const id = `read-${dateVal.replace(/[\/\-]/g, '')}`;

      parsedReadings.push({
        id,
        date: dateVal,
        fasting: fastingVal,
        post_breakfast: postBreakfastVal,
        pre_lunch: preLunchVal,
        post_lunch: postLunchVal,
        pre_dinner: preDinnerVal,
        post_dinner: postDinnerVal,
        createdAt: now,
        updatedAt: now
      });
    }

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO readings (id, date, fasting, post_breakfast, pre_lunch, post_lunch, pre_dinner, post_dinner, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.exec("BEGIN TRANSACTION");
    try {
      for (const r of parsedReadings) {
        stmt.run(r.id, r.date, r.fasting, r.post_breakfast, r.pre_lunch, r.post_lunch, r.pre_dinner, r.post_dinner, r.createdAt, r.updatedAt);
      }
      db.exec("COMMIT");
    } catch (txErr) {
      db.exec("ROLLBACK");
      throw txErr;
    }

    // Audit log entry
    const logId = `log-${Date.now()}`;
    const logTimestamp = new Date().toISOString();
    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, action, details)
      VALUES (?, ?, ?, ?)
    `).run(logId, logTimestamp, 'CSV Import', `Imported ${parsedReadings.length} readings via CSV`);

    res.json({ success: true, count: parsedReadings.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Gemini Vision OCR API
// -------------------------------------------------------------
app.post(['/api/scan-glucose', '/glucose/api/scan-glucose'], async (req, res) => {
  console.log('[SCAN-API] Received POST request');
  console.log('[SCAN-API] Content-Type:', req.get('content-type'));
  console.log('[SCAN-API] Body size:', JSON.stringify(req.body).length, 'bytes');

  try {
    const { imageData, mimeType } = req.body as ScanRequest;

    if (!imageData || !mimeType) {
      console.error('[SCAN-API] Missing required fields');
      return res.status(400).json({ error: 'Missing imageData or mimeType' });
    }

    console.log('[SCAN-API] Processing image, size:', imageData.length, 'chars');

    const responseStream = await client.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: `Role: You are a highly accurate clinical data entry assistant.
Request: Extract all handwritten blood glucose reading logs from the attached photo.
Result: A valid JSON array of objects.
Requirements:
- Each object must map to a row containing these keys: date, fasting, post_breakfast, pre_lunch, post_lunch, pre_dinner, post_dinner.
- Format the date appropriately to MM/DD/YYYY if possible.
- The values are blood glucose measurements in mmol/L. Keep decimals exactly as written.
Rules:
- Leave fields empty (as an empty string "") if there is no reading recorded in that cell.
- Ignore blank rows completely. Only return rows with at least one reading.
Restrictions:
- ONLY output the JSON array. Make sure the output precisely matches the JSON response schema.`,
          },
          {
            inlineData: {
              data: imageData,
              mimeType: mimeType,
            },
          },
        ],
      },
      config: {
        temperature: 0,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              fasting: { type: Type.STRING },
              post_breakfast: { type: Type.STRING },
              pre_lunch: { type: Type.STRING },
              post_lunch: { type: Type.STRING },
              pre_dinner: { type: Type.STRING },
              post_dinner: { type: Type.STRING },
            },
            required: ['date'],
          },
        },
      },
    });

    let text = '';
    for await (const chunk of responseStream) {
      if (chunk.text) {
        text += chunk.text;
      }
    }

    console.log('[SCAN-API] Response received, length:', text.length);

    if (!text.trim()) {
      return res.status(400).json({ error: 'No data extracted from image' });
    }

    const cleanText = text.replace(/```json\n?/gi, '').replace(/```/g, '').trim();
    const readings: ReadingData[] = JSON.parse(cleanText);

    if (!readings || readings.length === 0) {
      return res.status(400).json({ error: 'No readings found in image' });
    }

    console.log('[SCAN-API] Extracted', readings.length, 'readings');
    res.json({ success: true, readings });
  } catch (error) {
    console.error('[SCAN-API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('[SCAN-API] Stack:', errorStack);
    res.status(500).json({
      error: 'Failed to process image',
      details: errorMessage,
    });
  }
});

// -------------------------------------------------------------
// Health Check Endpoint
// -------------------------------------------------------------
app.get(['/api/health', '/glucose/api/health'], (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
const PORT = Number(process.env.PORT) || 3006;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[GLUCOSE-API] Server running on http://0.0.0.0:${PORT}`);
  console.log(`[GLUCOSE-API] Gemini API key configured: ${!!apiKey}`);
});
