import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Initialize Database
const db = new Database('cha.db');

// Initialize Schema
const schema = `
CREATE TABLE IF NOT EXISTS containers (
    id TEXT PRIMARY KEY,
    app_id INTEGER NOT NULL,
    app_name TEXT NOT NULL,
    container_name TEXT NOT NULL,
    pod_name TEXT NOT NULL,
    namespace TEXT NOT NULL,
    node_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT
);

CREATE TABLE IF NOT EXISTS container_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    container_id TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    cpu_usage_percent REAL,
    memory_usage_bytes INTEGER,
    memory_usage_percent REAL,
    network_rx_bytes INTEGER,
    network_tx_bytes INTEGER,
    disk_read_bytes INTEGER,
    disk_write_bytes INTEGER,
    restart_count INTEGER,
    FOREIGN KEY (container_id) REFERENCES containers(id)
);

CREATE TABLE IF NOT EXISTS health_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    container_id TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    score REAL NOT NULL,
    cpu_health REAL,
    memory_health REAL,
    restart_health REAL,
    error_health REAL,
    response_time_health REAL,
    uptime_health REAL,
    FOREIGN KEY (container_id) REFERENCES containers(id)
);

CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    container_id TEXT NOT NULL,
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    state TEXT DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (container_id) REFERENCES containers(id)
);
`;

db.exec(schema);

// Seed Data if empty
const containerCount = db.prepare('SELECT count(*) as count FROM containers').get() as { count: number };
if (containerCount.count === 0) {
    console.log('Seeding database with 109 containers...');
    const apps = Array.from({ length: 109 }, (_, i) => `app-${i + 1}`);
    const namespaces = ['default', 'kube-system', 'monitoring', 'payment', 'auth'];
    
    const stmt = db.prepare(`
        INSERT INTO containers (id, app_id, app_name, container_name, pod_name, namespace, node_name, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let appId = 1;
    for (const app of apps) {
        // Most apps have 1 container, some have more
        const replicas = Math.random() > 0.8 ? 2 : 1;
        for (let i = 0; i < replicas; i++) {
            const id = `${app}-${Math.random().toString(36).substr(2, 9)}`;
            stmt.run(
                id,
                appId,
                app,
                `${app}-container`,
                `${app}-pod-${Math.random().toString(36).substr(2, 5)}`,
                namespaces[Math.floor(Math.random() * namespaces.length)],
                `node-${Math.floor(Math.random() * 5) + 1}`,
                'Running'
            );
        }
        appId++;
    }
}

// Simulation Loop (Background Worker)
setInterval(() => {
    const containers = db.prepare('SELECT * FROM containers').all() as any[];
    const insertMetric = db.prepare(`
        INSERT INTO container_metrics (container_id, timestamp, cpu_usage_percent, memory_usage_bytes, memory_usage_percent, restart_count)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertScore = db.prepare(`
        INSERT INTO health_scores (container_id, timestamp, score, cpu_health, memory_health, restart_health)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    containers.forEach(container => {
        // Simulate Metrics
        // Random walk for CPU
        const cpu = Math.max(0, Math.min(100, Math.random() * 100)); 
        const memPercent = Math.max(0, Math.min(100, Math.random() * 100));
        const memBytes = memPercent * 1024 * 1024 * 10; // Dummy calculation
        const restarts = Math.random() > 0.98 ? 1 : 0; // Occasional restarts

        insertMetric.run(container.id, now, cpu, memBytes, memPercent, restarts);

        // Calculate Health Score (Simple version of SRS algorithm)
        // CPU Health (20%)
        let cpuHealth = 100;
        if (cpu > 80) cpuHealth = 100 - ((cpu - 80) * 5);
        
        // Memory Health (25%)
        let memHealth = 100;
        if (memPercent > 80) memHealth = 100 - ((memPercent - 80) * 5);

        // Restart Health (20%)
        let restartHealth = restarts > 0 ? 0 : 100;

        // Base score + weighted factors
        const score = (cpuHealth * 0.2) + (memHealth * 0.25) + (restartHealth * 0.2) + 35; 
        
        insertScore.run(container.id, now, Math.max(0, Math.min(100, score)), cpuHealth, memHealth, restartHealth);
    });

}, 5000); // Run every 5 seconds for demo purposes (SRS says 30s)


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.get('/api/v1/containers', (req, res) => {
    const containers = db.prepare('SELECT * FROM containers').all();
    // Attach latest health score and prediction
    const result = containers.map((c: any) => {
        const score = db.prepare('SELECT score FROM health_scores WHERE container_id = ? ORDER BY timestamp DESC LIMIT 1').get(c.id) as any;
        const currentScore = score ? score.score : 100;
        
        // Mock Prediction
        let prediction = { probability: 0, time_to_failure: null };
        if (currentScore < 50) {
            prediction = { probability: 85, time_to_failure: Math.floor(Math.random() * 60) };
        } else if (currentScore < 70) {
            prediction = { probability: 45, time_to_failure: Math.floor(Math.random() * 120) + 60 };
        }

        return { ...c, health_score: currentScore, prediction };
    });
    res.json(result);
  });

  app.get('/api/v1/containers/:id', (req, res) => {
    const container = db.prepare('SELECT * FROM containers WHERE id = ?').get(req.params.id);
    if (!container) return res.status(404).json({ error: 'Container not found' });
    res.json(container);
  });

  app.get('/api/v1/containers/:id/metrics', (req, res) => {
    const metrics = db.prepare('SELECT * FROM container_metrics WHERE container_id = ? ORDER BY timestamp DESC LIMIT 50').all(req.params.id);
    res.json(metrics);
  });
  
  app.get('/api/v1/dashboard/overview', (req, res) => {
      const totalContainers = db.prepare('SELECT count(*) as count FROM containers').get() as any;
      const avgScore = db.prepare('SELECT avg(score) as score FROM (SELECT score FROM health_scores GROUP BY container_id HAVING max(timestamp))').get() as any;
      
      res.json({
          total_containers: totalContainers.count,
          average_health: avgScore.score || 100,
          active_alerts: 0 // Placeholder
      });
  });

  // Sentinel Integration Endpoints
  app.get('/api/v1/sentinel/health-report', (req, res) => {
    const unhealthy = db.prepare('SELECT * FROM containers WHERE id IN (SELECT container_id FROM health_scores WHERE score < 75 GROUP BY container_id HAVING max(timestamp))').all();
    const alerts = db.prepare('SELECT * FROM alerts WHERE state != "RESOLVED"').all();
    
    const report = {
        timestamp: new Date().toISOString(),
        ecosystem_health: {
            overall_score: 87.5, // Mocked
            total_containers: 109,
            unhealthy_containers: unhealthy.length,
        },
        unhealthy_containers: unhealthy,
        active_alerts: alerts
    };
    res.json(report);
  });

  app.post('/api/v1/sentinel/remediation', (req, res) => {
    const { alert_id, action_taken, details } = req.body;
    console.log(`[SENTINEL] Remediation Action: ${action_taken} for Alert ${alert_id}`);
    
    // Log remediation to DB (mock table or just console for now)
    // In a real app, we would update the alert status
    if (alert_id) {
        db.prepare('UPDATE alerts SET state = "IN_PROGRESS", resolved_by = "Sentinel" WHERE id = ?').run(alert_id);
    }

    res.json({ status: 'acknowledged', timestamp: new Date().toISOString() });
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
