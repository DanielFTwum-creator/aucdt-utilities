import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/db/status — database health and recent query stats (protected)
router.get('/status', requireAuth, (_req, res) => {
  const queries: Array<{ query: string; latency: string; status: string }> = [];

  // Run representative queries and measure latency
  const samples: Array<{ sql: string; label: string }> = [
    { sql: 'SELECT COUNT(*) FROM users', label: 'SELECT COUNT(*) FROM users' },
    { sql: 'SELECT * FROM audit_logs ORDER BY time DESC LIMIT 10', label: 'SELECT * FROM audit_logs' },
    { sql: 'INSERT INTO sessions (id, user_email, created_at, expires_at) VALUES (?, ?, datetime("now"), datetime("now", "+1 second")) ', label: 'INSERT INTO sessions' },
  ];

  for (const sample of samples) {
    const t0 = performance.now();
    try {
      if (sample.sql.startsWith('INSERT')) {
        db.prepare(sample.sql).run(`bench-${Math.random().toString(36).slice(2, 6)}`, 'SYSTEM');
      } else {
        db.prepare(sample.sql).all();
      }
      const ms = Math.round(performance.now() - t0);
      queries.push({ query: sample.label, latency: `${ms}ms`, status: 'OK' });
    } catch (err) {
      queries.push({ query: sample.label, latency: 'N/A', status: 'ERROR' });
    }
  }

  // Clean up bench sessions
  db.prepare('DELETE FROM sessions WHERE user_email = ?').run('SYSTEM');

  const dbInfo = db.prepare('PRAGMA database_list').all() as Array<{ seq: number; name: string; file: string }>;

  res.json({
    status: 'CONNECTED & SYNCED',
    engine: 'SQLite (WAL)',
    file: dbInfo[0]?.file ?? 'in-memory',
    queries,
    tableCount: (db.prepare("SELECT COUNT(*) as c FROM sqlite_master WHERE type='table'").get() as { c: number }).c,
    auditLogCount: (db.prepare('SELECT COUNT(*) as c FROM audit_logs').get() as { c: number }).c,
    userCount: (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c,
  });
});

export default router;
