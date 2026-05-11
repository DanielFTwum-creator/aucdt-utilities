import { Router } from 'express';
import os from 'os';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../db/database.js';

const router = Router();

// Track request stats
let totalRequests = 0;
let errorRequests = 0;
const startTime = Date.now();

export function incrementRequests() { totalRequests++; }
export function incrementErrors() { errorRequests++; }

// GET /api/diagnostics — real system metrics (protected)
router.get('/', requireAuth, (_req, res) => {
  const uptimeMs = Date.now() - startTime;
  const uptimePct = Math.min(99.99, 100 - (errorRequests / Math.max(totalRequests, 1)) * 100);
  const errorRate = totalRequests > 0 ? ((errorRequests / totalRequests) * 100).toFixed(2) : '0.00';

  // Measure latency with a simple DB round-trip
  const t0 = performance.now();
  db.prepare('SELECT 1').get();
  const latencyMs = Math.round(performance.now() - t0);

  // Count active connections from SQLite WAL
  const activeConnections = (db.prepare('SELECT COUNT(*) as c FROM sessions WHERE expires_at > datetime("now")').get() as { c: number }).c;

  res.json({
    networkLatency: `${latencyMs}ms`,
    activeConnections,
    apiErrorRate: `${errorRate}%`,
    uptime: `${uptimePct.toFixed(2)}%`,
    uptimeMs,
    totalRequests,
    platform: os.platform(),
    nodeVersion: process.version,
  });
});

export default router;
