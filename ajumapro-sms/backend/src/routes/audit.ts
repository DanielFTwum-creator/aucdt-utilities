import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/audit — paginated audit logs (protected)
router.get('/', requireAuth, (_req, res) => {
  const logs = db.prepare(
    'SELECT id, time, action, user, details FROM audit_logs ORDER BY time DESC LIMIT 100'
  ).all();
  res.json({ logs });
});

// POST /api/audit — create a log entry (protected)
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const { action, details } = req.body as { action?: string; details?: string };
  if (!action || !details) {
    res.status(400).json({ error: 'action and details required' });
    return;
  }

  const id = Math.random().toString(36).slice(2, 9);
  db.prepare('INSERT INTO audit_logs (id, action, user, details) VALUES (?, ?, ?, ?)').run(
    id, action, req.user!.email, details
  );

  res.status(201).json({ id });
});

export default router;
