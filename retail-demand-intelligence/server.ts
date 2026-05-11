import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { GoogleGenerativeAI } from '@google/genai';

// Initialize Database
const db = new Database('rdi.db');

// Initialize Schema
const schema = `
CREATE TABLE IF NOT EXISTS entities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    value REAL NOT NULL,
    metric_type TEXT NOT NULL,
    FOREIGN KEY (entity_id) REFERENCES entities(id)
);

CREATE TABLE IF NOT EXISTS health_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    score REAL NOT NULL,
    details TEXT,
    FOREIGN KEY (entity_id) REFERENCES entities(id)
);
`;

db.exec(schema);

// Seed Data if empty
const entityCount = db.prepare('SELECT count(*) as count FROM entities').get() as { count: number };
if (entityCount.count === 0) {
    console.log('Seeding database with initial data...');
    const stmt = db.prepare(`
        INSERT INTO entities (id, name, status, data)
        VALUES (?, ?, ?, ?)
    `);

    for (let i = 1; i <= 10; i++) {
        stmt.run(
            `entity-${i}`,
            `Entity ${i}`,
            'active',
            JSON.stringify({ type: 'sample', index: i })
        );
    }
}

// Background Simulation Loop
setInterval(() => {
    const entities = db.prepare('SELECT * FROM entities').all() as any[];
    const insertMetric = db.prepare(`
        INSERT INTO metrics (entity_id, timestamp, value, metric_type)
        VALUES (?, ?, ?, ?)
    `);
    const insertScore = db.prepare(`
        INSERT INTO health_scores (entity_id, timestamp, score, details)
        VALUES (?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    entities.forEach(entity => {
        // Simulate Metrics
        const value = Math.random() * 100;
        insertMetric.run(entity.id, now, value, 'performance');

        // Calculate Health Score
        const score = Math.max(0, Math.min(100, 70 + (Math.random() * 30)));
        insertScore.run(entity.id, now, score, JSON.stringify({ computed: true }));
    });
}, 5000);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.get('/api/v1/entities', (req, res) => {
    const entities = db.prepare('SELECT * FROM entities').all();
    const result = entities.map((e: any) => {
        const score = db.prepare('SELECT score FROM health_scores WHERE entity_id = ? ORDER BY timestamp DESC LIMIT 1').get(e.id) as any;
        return { ...e, health_score: score ? score.score : 100 };
    });
    res.json(result);
  });

  app.get('/api/v1/entities/:id', (req, res) => {
    const entity = db.prepare('SELECT * FROM entities WHERE id = ?').get(req.params.id);
    if (!entity) return res.status(404).json({ error: 'Entity not found' });
    res.json(entity);
  });

  app.get('/api/v1/entities/:id/metrics', (req, res) => {
    const metrics = db.prepare('SELECT * FROM entities/:id/metrics WHERE entity_id = ? ORDER BY timestamp DESC LIMIT 50').all(req.params.id);
    res.json(metrics);
  });

  app.get('/api/v1/dashboard/overview', (req, res) => {
      const totalEntities = db.prepare('SELECT count(*) as count FROM entities').get() as any;
      const avgScore = db.prepare('SELECT avg(score) as score FROM (SELECT score FROM health_scores GROUP BY entity_id HAVING max(timestamp))').get() as any;

      res.json({
          total_entities: totalEntities.count,
          average_health: avgScore.score || 100,
          active_count: totalEntities.count
      });
  });

  // Sentinel Integration Endpoints
  app.get('/api/v1/sentinel/health-report', (req, res) => {
    const unhealthy = db.prepare('SELECT * FROM entities WHERE id IN (SELECT entity_id FROM health_scores WHERE score < 75 GROUP BY entity_id HAVING max(timestamp))').all();

    const report = {
        timestamp: new Date().toISOString(),
        app_id: 154,
        app_name: 'Retail Demand Intelligence',
        ecosystem_health: {
            overall_score: 87.5,
            total_entities: 10,
            unhealthy_count: unhealthy.length,
        },
        unhealthy_entities: unhealthy
    };
    res.json(report);
  });

  app.post('/api/v1/sentinel/remediation', (req, res) => {
    const { action_taken, details } = req.body;
    console.log(`[SENTINEL] Remediation Action: ${action_taken}`);
    res.json({ status: 'acknowledged', timestamp: new Date().toISOString() });
  });

  // AI/ML Endpoint (for AI-enabled apps)
  app.post('/api/v1/ai/predict', async (req, res) => {
    try {
      // Placeholder for AI/ML inference
      // In production, integrate with Google GenAI or custom models
      res.json({
        prediction: 'Sample AI response',
        confidence: 0.95,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      res.status(500).json({ error: 'AI prediction failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
