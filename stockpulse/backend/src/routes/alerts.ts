import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import db from '../db/schema';

const router = Router();
const FREE_LIMIT = 5;
const PREMIUM_LIMIT = 100;

router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const rows = db.prepare(
    'SELECT id, ticker, alert_type, condition, target_value, active, triggered_at, created_at FROM alerts WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user!.id);
  res.json(rows);
});

router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { ticker, alert_type = 'price', condition = 'above', target_value } = req.body as {
    ticker: string; alert_type?: string; condition?: string; target_value: number;
  };
  if (!ticker || target_value === undefined) {
    res.status(400).json({ error: 'ticker and target_value are required' }); return;
  }

  const activeCount = (db.prepare(
    'SELECT COUNT(*) as c FROM alerts WHERE user_id = ? AND active = 1'
  ).get(req.user!.id) as { c: number }).c;
  const limit = req.user!.tier === 'premium' ? PREMIUM_LIMIT : FREE_LIMIT;
  if (activeCount >= limit) {
    res.status(403).json({
      error: `Alert limit reached (${limit} active alerts for ${req.user!.tier} tier)`,
      upgrade: req.user!.tier !== 'premium',
    });
    return;
  }

  const result = db.prepare(
    'INSERT INTO alerts (user_id, ticker, alert_type, condition, target_value) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user!.id, ticker.toUpperCase(), alert_type, condition, Number(target_value));
  res.status(201).json({ id: result.lastInsertRowid, ticker: ticker.toUpperCase(), alert_type, condition, target_value, active: 1 });
});

router.delete('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM alerts WHERE id = ? AND user_id = ?').run(Number(req.params.id), req.user!.id);
  if (result.changes === 0) { res.status(404).json({ error: 'Alert not found' }); return; }
  res.json({ deleted: true });
});

router.patch('/:id/deactivate', requireAuth, (req: AuthRequest, res: Response) => {
  db.prepare('UPDATE alerts SET active = 0 WHERE id = ? AND user_id = ?').run(Number(req.params.id), req.user!.id);
  res.json({ deactivated: true });
});

export default router;
