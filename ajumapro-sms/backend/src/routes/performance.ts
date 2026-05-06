import { Router } from 'express';
import os from 'os';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/performance — real CPU/memory/IO stats (protected)
router.get('/', requireAuth, (_req, res) => {
  const memTotal = os.totalmem();
  const memFree  = os.freemem();
  const memUsed  = memTotal - memFree;
  const memPct   = Math.round((memUsed / memTotal) * 100);

  // CPU load average (1-min), normalised to 0-100 by CPU count
  const cpuLoad = os.loadavg()[0];
  const cpuCount = os.cpus().length;
  const cpuPct = Math.min(100, Math.round((cpuLoad / cpuCount) * 100));

  // Process heap usage
  const heapMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

  const formatMB = (b: number) => `${Math.round(b / 1024 / 1024)} MB`;
  const formatGB = (b: number) => `${(b / 1024 / 1024 / 1024).toFixed(1)} GB`;

  res.json({
    cpu: {
      pct: cpuPct,
      label: `${cpuPct}%`,
      cores: cpuCount,
      model: os.cpus()[0]?.model ?? 'Unknown',
    },
    memory: {
      pct: memPct,
      label: `${formatMB(memUsed)} / ${formatGB(memTotal)}`,
      usedBytes: memUsed,
      totalBytes: memTotal,
    },
    heap: {
      pct: Math.min(100, Math.round((heapMB / 512) * 100)),
      label: `${heapMB} MB heap`,
    },
    uptime: process.uptime(),
    os: {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
    },
  });
});

export default router;
