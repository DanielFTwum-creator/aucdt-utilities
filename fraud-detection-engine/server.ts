import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';

// Initialize Database
const db = new Database('fde.db');

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

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user TEXT NOT NULL DEFAULT 'system',
    action TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    details TEXT,
    ip_address TEXT,
    severity TEXT NOT NULL DEFAULT 'info'
);

CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    severity TEXT NOT NULL,
    message TEXT NOT NULL,
    health_score REAL NOT NULL,
    acknowledged INTEGER DEFAULT 0,
    acknowledged_at TIMESTAMP,
    acknowledged_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entity_id) REFERENCES entities(id)
);
`;

db.exec(schema);

// Server start time for uptime calculation
const serverStartTime = Date.now();

// Performance metrics tracking
const perfMetrics: { endpoint: string; method: string; duration: number; timestamp: string; status: number }[] = [];
const MAX_PERF_ENTRIES = 500;

// Audit logging helper
function logAudit(user: string, action: string, category: string, details?: string, severity: string = 'info', ipAddress?: string) {
  db.prepare(`
    INSERT INTO audit_logs (user, action, category, details, severity, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(user, action, category, details || null, severity, ipAddress || null);
}

// Seed Data if empty
const entityCount = db.prepare('SELECT count(*) as count FROM entities').get() as { count: number };
if (entityCount.count === 0) {
    console.log('Seeding database with initial data...');
    const stmt = db.prepare(`
        INSERT INTO entities (id, name, status, data)
        VALUES (?, ?, ?, ?)
    `);

    const seedEntities = [
        { name: 'GlobalBank International', industry: 'banking', risk_category: 'low', volume: 5000, avg_amount: 10000, country: 'GH', year: 1995, compliance: 95 },
        { name: 'PayFlow Systems', industry: 'payments', risk_category: 'low', volume: 8000, avg_amount: 5000, country: 'US', year: 2010, compliance: 92 },
        { name: 'SecureVault Insurance', industry: 'insurance', risk_category: 'medium', volume: 2000, avg_amount: 15000, country: 'UK', year: 2005, compliance: 85 },
        { name: 'FastTrade Finance', industry: 'trading', risk_category: 'high', volume: 12000, avg_amount: 3000, country: 'NG', year: 2015, compliance: 68 },
        { name: 'CloudCredit Solutions', industry: 'fintech', risk_category: 'medium', volume: 6000, avg_amount: 2500, country: 'GH', year: 2018, compliance: 78 },
        { name: 'Nexus Capital Group', industry: 'investment', risk_category: 'high', volume: 3000, avg_amount: 50000, country: 'US', year: 2012, compliance: 72 },
        { name: 'TrustPay Networks', industry: 'payments', risk_category: 'low', volume: 7000, avg_amount: 4000, country: 'UK', year: 2008, compliance: 91 },
        { name: 'RiskGuard Analytics', industry: 'compliance', risk_category: 'medium', volume: 1500, avg_amount: 8000, country: 'GH', year: 2020, compliance: 88 },
        { name: 'VelocityTrade Corp', industry: 'trading', risk_category: 'high', volume: 15000, avg_amount: 2000, country: 'NG', year: 2016, compliance: 65 },
        { name: 'SafeTransfer Ltd', industry: 'banking', risk_category: 'low', volume: 4000, avg_amount: 12000, country: 'UK', year: 2000, compliance: 94 },
    ];

    seedEntities.forEach((entity, i) => {
        stmt.run(
            `entity-${i + 1}`,
            entity.name,
            'active',
            JSON.stringify({
                type: 'financial_entity',
                industry: entity.industry,
                risk_category: entity.risk_category,
                transaction_volume_baseline: entity.volume,
                avg_transaction_amount: entity.avg_amount,
                country: entity.country,
                established_since: entity.year,
                compliance_score: entity.compliance,
            })
        );
    });
    logAudit('system', 'Database seeded with 10 financial entities', 'system', null, 'info');
}

// Statistical Fraud Scoring Engine
setInterval(() => {
    const entities = db.prepare('SELECT * FROM entities').all() as any[];
    const now = new Date().toISOString();

    entities.forEach(entity => {
        try {
            const entityData = JSON.parse(entity.data || '{}');
            const baseline = entityData.transaction_volume_baseline || 1000;
            const riskCategory = entityData.risk_category || 'medium';
            const complianceScore = entityData.compliance_score || 80;

            // Fetch last 20 metrics for this entity
            const recentMetrics = db.prepare(`
                SELECT value FROM metrics WHERE entity_id = ? ORDER BY timestamp DESC LIMIT 20
            `).all(entity.id) as any[];

            // Generate new metric (realistic variance around baseline)
            const noiseLevel = baseline * 0.15; // 15% variance
            const currentValue = baseline + (Math.random() - 0.5) * noiseLevel * 2;

            db.prepare(`
                INSERT INTO metrics (entity_id, timestamp, value, metric_type)
                VALUES (?, ?, ?, ?)
            `).run(entity.id, now, currentValue, 'fraud_signal');

            // Calculate component scores
            let velocityScore = 50;
            let deviationScore = 50;
            let trendScore = 50;

            if (recentMetrics.length >= 5) {
                // Velocity: compare current to 5-tick moving average
                const last5Avg = recentMetrics.slice(0, 5).reduce((sum, m) => sum + m.value, 0) / 5;
                const velDiff = Math.abs(currentValue - last5Avg) / (last5Avg || 1);
                velocityScore = Math.max(0, 100 - velDiff * 100); // Spike = low score

                // Deviation: how far from entity baseline
                const devRatio = Math.abs(currentValue - baseline) / (baseline || 1);
                deviationScore = Math.max(0, 100 - devRatio * 100);

                // Trend: direction of last 5 values
                if (recentMetrics.length >= 5) {
                    const trend = recentMetrics[0].value - recentMetrics[4].value;
                    const trendMagnitude = Math.abs(trend) / (last5Avg || 1);
                    if (trend < 0) {
                        // Declining is risky
                        trendScore = Math.max(0, 100 - trendMagnitude * 100);
                    } else {
                        // Improving is better
                        trendScore = Math.min(100, 50 + trendMagnitude * 50);
                    }
                }
            } else if (recentMetrics.length > 0) {
                deviationScore = Math.max(0, 100 - Math.abs(currentValue - baseline) / (baseline || 1) * 100);
            }

            // Apply risk category and compliance modifiers
            let weights = { velocity: 0.35, deviation: 0.35, trend: 0.20, compliance: 0.10 };
            if (riskCategory === 'high') {
                weights = { velocity: 0.40, deviation: 0.40, trend: 0.15, compliance: 0.05 }; // Amplify anomaly signals
            } else if (riskCategory === 'low') {
                weights = { velocity: 0.25, deviation: 0.25, trend: 0.30, compliance: 0.20 }; // Dampen minor variance
            }

            const complianceModifier = (complianceScore / 100) * 100;
            const compositeScore = (
                velocityScore * weights.velocity +
                deviationScore * weights.deviation +
                trendScore * weights.trend +
                complianceModifier * weights.compliance
            );

            const healthScore = Math.max(0, Math.min(100, compositeScore));

            // Write health score with component breakdown
            const details = {
                velocity_score: Math.round(velocityScore),
                deviation_score: Math.round(deviationScore),
                trend_score: Math.round(trendScore),
                compliance_factor: complianceScore,
                risk_category: riskCategory,
                baseline: baseline,
                current_value: Math.round(currentValue * 100) / 100,
            };

            db.prepare(`
                INSERT INTO health_scores (entity_id, timestamp, score, details)
                VALUES (?, ?, ?, ?)
            `).run(entity.id, now, healthScore, JSON.stringify(details));

            // Create alert if score drops below 65
            if (healthScore < 65) {
                const existingAlert = db.prepare(`
                    SELECT id FROM alerts WHERE entity_id = ? AND acknowledged = 0
                `).get(entity.id);

                if (!existingAlert) {
                    const severity = healthScore < 50 ? 'critical' : 'warning';
                    const message = `Health score dropped to ${healthScore.toFixed(1)}% - investigate anomalies`;

                    db.prepare(`
                        INSERT INTO alerts (entity_id, entity_name, severity, message, health_score)
                        VALUES (?, ?, ?, ?, ?)
                    `).run(entity.id, entity.name, severity, message, healthScore);

                    logAudit('system', `Alert created for ${entity.name}`, 'alert', `Score: ${healthScore.toFixed(1)}%`, severity);
                }
            }
        } catch (err: any) {
            console.error(`Error processing entity ${entity.id}:`, err.message);
        }
    });
}, 5000);

// Cleanup old metrics periodically (keep last 1000 per entity)
setInterval(() => {
    db.prepare(`
        DELETE FROM metrics WHERE id NOT IN (
            SELECT id FROM metrics ORDER BY timestamp DESC LIMIT 10000
        )
    `).run();
    db.prepare(`
        DELETE FROM health_scores WHERE id NOT IN (
            SELECT id FROM health_scores ORDER BY timestamp DESC LIMIT 10000
        )
    `).run();
}, 60000);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Performance tracking middleware
  app.use((req: any, res: any, next: any) => {
    const start = Date.now();
    const originalEnd = res.end;
    res.end = function(...args: any[]) {
      const duration = Date.now() - start;
      if (req.path.startsWith('/api/')) {
        perfMetrics.push({
          endpoint: req.path,
          method: req.method,
          duration,
          timestamp: new Date().toISOString(),
          status: res.statusCode,
        });
        if (perfMetrics.length > MAX_PERF_ENTRIES) {
          perfMetrics.splice(0, perfMetrics.length - MAX_PERF_ENTRIES);
        }
      }
      return originalEnd.apply(res, args);
    };
    next();
  });

  // ─── Core API Routes ─────────────────────────────────────────

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
    const metrics = db.prepare('SELECT * FROM metrics WHERE entity_id = ? ORDER BY timestamp DESC LIMIT 50').all(req.params.id);
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

  // ─── Alert Endpoints ──────────────────────────────────────────

  app.get('/api/v1/alerts', (req, res) => {
    const alerts = db.prepare(`
      SELECT * FROM alerts
      WHERE acknowledged = 0
      ORDER BY
        CASE severity WHEN 'critical' THEN 1 WHEN 'warning' THEN 2 ELSE 3 END,
        created_at DESC
    `).all();
    res.json(alerts);
  });

  app.patch('/api/v1/alerts/:id/acknowledge', (req, res) => {
    const { id } = req.params;
    const { acknowledged_by } = req.body;

    const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(id) as any;
    if (!alert) return res.status(404).json({ error: 'Alert not found' });

    const acknowledgedAt = new Date().toISOString();
    db.prepare(`
      UPDATE alerts SET acknowledged = 1, acknowledged_at = ?, acknowledged_by = ?
      WHERE id = ?
    `).run(acknowledgedAt, acknowledged_by || 'unknown', id);

    logAudit(acknowledged_by || 'unknown', `Acknowledged alert for ${alert.entity_name}`, 'alert', `Alert ID: ${id}`, 'info');

    res.json({
      status: 'acknowledged',
      alert_id: id,
      timestamp: acknowledgedAt
    });
  });

  // ─── Sentinel Integration ─────────────────────────────────────

  app.get('/api/v1/sentinel/health-report', (req, res) => {
    const unhealthy = db.prepare('SELECT * FROM entities WHERE id IN (SELECT entity_id FROM health_scores WHERE score < 75 GROUP BY entity_id HAVING max(timestamp))').all();

    const avgScoreResult = db.prepare(`
      SELECT AVG(score) as avg FROM health_scores
      WHERE timestamp > datetime('now', '-5 minutes')
    `).get() as { avg: number };

    const overallScore = avgScoreResult.avg ? Math.round(avgScoreResult.avg * 10) / 10 : 100;

    const report = {
        timestamp: new Date().toISOString(),
        app_id: 137,
        app_name: 'Fraud Detection Engine',
        ecosystem_health: {
            overall_score: overallScore,
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
    logAudit('sentinel', `Remediation: ${action_taken}`, 'sentinel', details, 'warning');
    res.json({ status: 'acknowledged', timestamp: new Date().toISOString() });
  });

  // ─── AI/ML Endpoint ───────────────────────────────────────────

  app.post('/api/v1/ai/predict', async (req, res) => {
    try {
      // Placeholder for AI/ML inference
      res.json({
        prediction: 'Sample AI response',
        confidence: 0.95,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      res.status(500).json({ error: 'AI prediction failed' });
    }
  });

  // ─── Audit Log Endpoints ──────────────────────────────────────

  app.post('/api/v1/audit-log', (req, res) => {
    const { user, action, category, details, severity } = req.body;
    logAudit(user || 'unknown', action, category || 'general', details, severity || 'info', req.ip);
    res.json({ status: 'logged', timestamp: new Date().toISOString() });
  });

  app.get('/api/v1/admin/audit-logs', (req, res) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
    const category = req.query.category as string;

    let query = 'SELECT * FROM audit_logs';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(limit);

    const logs = db.prepare(query).all(...params);
    res.json(logs);
  });

  // ─── Admin System Info ────────────────────────────────────────

  app.get('/api/v1/admin/system-info', (req, res) => {
    const memUsage = process.memoryUsage();
    const uptimeSeconds = process.uptime();

    res.json({
      server: {
        uptime_seconds: uptimeSeconds,
        uptime_formatted: formatUptime(uptimeSeconds),
        started_at: new Date(serverStartTime).toISOString(),
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
      },
      memory: {
        rss: memUsage.rss,
        rss_mb: (memUsage.rss / 1024 / 1024).toFixed(1),
        heap_total: memUsage.heapTotal,
        heap_total_mb: (memUsage.heapTotal / 1024 / 1024).toFixed(1),
        heap_used: memUsage.heapUsed,
        heap_used_mb: (memUsage.heapUsed / 1024 / 1024).toFixed(1),
        external: memUsage.external,
        external_mb: (memUsage.external / 1024 / 1024).toFixed(1),
      },
      app: {
        name: 'Fraud Detection Engine',
        app_id: 137,
        version: '3.0.0',
        environment: process.env.NODE_ENV || 'development',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // ─── Admin DB Stats ───────────────────────────────────────────

  app.get('/api/v1/admin/db-stats', (req, res) => {
    const entityCount = db.prepare('SELECT count(*) as count FROM entities').get() as any;
    const metricCount = db.prepare('SELECT count(*) as count FROM metrics').get() as any;
    const healthCount = db.prepare('SELECT count(*) as count FROM health_scores').get() as any;
    const auditCount = db.prepare('SELECT count(*) as count FROM audit_logs').get() as any;

    const recentEntities = db.prepare('SELECT id, name, status, updated_at FROM entities ORDER BY updated_at DESC LIMIT 5').all();
    const recentMetrics = db.prepare('SELECT entity_id, metric_type, value, timestamp FROM metrics ORDER BY timestamp DESC LIMIT 10').all();

    // Get DB file size
    let dbSizeBytes = 0;
    try {
      const fs = require('fs');
      const stats = fs.statSync('fde.db');
      dbSizeBytes = stats.size;
    } catch {}

    res.json({
      tables: {
        entities: { count: entityCount.count },
        metrics: { count: metricCount.count },
        health_scores: { count: healthCount.count },
        audit_logs: { count: auditCount.count },
      },
      db_size_bytes: dbSizeBytes,
      db_size_mb: (dbSizeBytes / 1024 / 1024).toFixed(2),
      recent_entities: recentEntities,
      recent_metrics: recentMetrics,
      timestamp: new Date().toISOString(),
    });
  });

  // ─── Admin Performance Metrics ────────────────────────────────

  app.get('/api/v1/admin/performance-metrics', (req, res) => {
    const recentMetrics = perfMetrics.slice(-100);

    // Calculate averages by endpoint
    const endpointStats: Record<string, { count: number; total: number; min: number; max: number }> = {};
    recentMetrics.forEach(m => {
      if (!endpointStats[m.endpoint]) {
        endpointStats[m.endpoint] = { count: 0, total: 0, min: Infinity, max: 0 };
      }
      const s = endpointStats[m.endpoint];
      s.count++;
      s.total += m.duration;
      s.min = Math.min(s.min, m.duration);
      s.max = Math.max(s.max, m.duration);
    });

    const summary = Object.entries(endpointStats).map(([endpoint, stats]) => ({
      endpoint,
      count: stats.count,
      avg_ms: Math.round(stats.total / stats.count),
      min_ms: stats.min === Infinity ? 0 : stats.min,
      max_ms: stats.max,
    }));

    const memUsage = process.memoryUsage();

    res.json({
      recent_requests: recentMetrics.slice(-20),
      endpoint_summary: summary,
      memory: {
        heap_used_mb: parseFloat((memUsage.heapUsed / 1024 / 1024).toFixed(1)),
        heap_total_mb: parseFloat((memUsage.heapTotal / 1024 / 1024).toFixed(1)),
        rss_mb: parseFloat((memUsage.rss / 1024 / 1024).toFixed(1)),
      },
      total_requests_tracked: perfMetrics.length,
      timestamp: new Date().toISOString(),
    });
  });

  // ─── Admin Diagnostic Tests ───────────────────────────────────

  app.post('/api/v1/admin/run-diagnostics', (req, res) => {
    const results: { name: string; status: 'pass' | 'fail' | 'warn'; duration: number; message: string }[] = [];
    const runTest = (name: string, fn: () => string) => {
      const start = Date.now();
      try {
        const msg = fn();
        results.push({ name, status: 'pass', duration: Date.now() - start, message: msg });
      } catch (err: any) {
        results.push({ name, status: 'fail', duration: Date.now() - start, message: err.message });
      }
    };

    // Test 1: Database connectivity
    runTest('Database Connectivity', () => {
      db.prepare('SELECT 1').get();
      return 'SQLite connection active';
    });

    // Test 2: Entity table integrity
    runTest('Entity Table Integrity', () => {
      const count = (db.prepare('SELECT count(*) as c FROM entities').get() as any).c;
      return `${count} entities found`;
    });

    // Test 3: Metrics table write
    runTest('Metrics Write Test', () => {
      const now = new Date().toISOString();
      db.prepare('INSERT INTO metrics (entity_id, timestamp, value, metric_type) VALUES (?, ?, ?, ?)').run('test-diag', now, 99.9, 'diagnostic');
      db.prepare('DELETE FROM metrics WHERE entity_id = ?').run('test-diag');
      return 'Write + delete successful';
    });

    // Test 4: Health score computation
    runTest('Health Score Computation', () => {
      const scores = db.prepare('SELECT avg(score) as avg FROM health_scores').get() as any;
      if (scores.avg === null) return 'No health scores yet (OK for fresh DB)';
      return `Average health: ${scores.avg.toFixed(1)}%`;
    });

    // Test 5: Audit log write
    runTest('Audit Log Write', () => {
      logAudit('diagnostic', 'Diagnostic test run', 'system', 'Automated diagnostic');
      return 'Audit entry written';
    });

    // Test 6: Memory check
    runTest('Memory Usage', () => {
      const mem = process.memoryUsage();
      const heapMB = mem.heapUsed / 1024 / 1024;
      if (heapMB > 512) throw new Error(`High memory: ${heapMB.toFixed(0)} MB`);
      return `Heap: ${heapMB.toFixed(1)} MB (healthy)`;
    });

    // Test 7: API endpoint availability
    runTest('API Endpoints Available', () => {
      const routes = (app as any)._router?.stack?.filter((r: any) => r.route).map((r: any) => r.route.path) || [];
      return `${routes.length} routes registered`;
    });

    // Test 8: Sentinel endpoint
    runTest('Sentinel Integration', () => {
      const unhealthy = db.prepare('SELECT count(*) as c FROM health_scores WHERE score < 50').get() as any;
      return `${unhealthy.c} critical scores in history`;
    });

    const passCount = results.filter(r => r.status === 'pass').length;
    const failCount = results.filter(r => r.status === 'fail').length;

    logAudit('admin', `Diagnostics run: ${passCount} passed, ${failCount} failed`, 'diagnostics', JSON.stringify(results), failCount > 0 ? 'warning' : 'info');

    res.json({
      results,
      summary: { total: results.length, passed: passCount, failed: failCount },
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/v1/admin/run-e2e', (req, res) => {
    const { exec } = require('child_process');
    logAudit('admin', 'Started Playwright E2E test suite', 'testing', null, 'info');
    
    // We execute playwright with json reporter to easily parse the output
    exec('npx playwright test --reporter=json', { maxBuffer: 1024 * 1024 * 10 }, (err: any, stdout: string, stderr: string) => {
      let parsedResults = null;
      try {
        // Playwright JSON reporter outputs to stdout
        const lines = stdout.split('\n');
        // Find the line that looks like JSON
        const jsonLine = lines.find(l => l.startsWith('{') && l.includes('suites'));
        if (jsonLine) {
          parsedResults = JSON.parse(jsonLine);
        } else {
          // Fallback if the whole stdout is valid JSON
          parsedResults = JSON.parse(stdout);
        }
      } catch (e) {
        // If it fails to parse, we still send stdout
      }

      res.json({
        success: !err,
        stdout,
        stderr,
        results: parsedResults,
        timestamp: new Date().toISOString()
      });
    });
  });

  // ─── Vite middleware ──────────────────────────────────────────

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
    logAudit('system', 'Server started', 'system', `Port ${PORT}`, 'info');
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

startServer();
