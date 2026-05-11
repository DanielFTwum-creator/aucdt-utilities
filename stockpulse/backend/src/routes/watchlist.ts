import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import db from '../db/schema';

const router = Router();

const FREE_LIMIT = 5;
const PREMIUM_LIMIT = 50;

router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const rows = db.prepare(
    'SELECT id, ticker, added_at FROM watchlists WHERE user_id = ? ORDER BY added_at DESC'
  ).all(req.user!.id);
  res.json(rows);
});

router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { ticker } = req.body as { ticker: string };
  if (!ticker) { res.status(400).json({ error: 'ticker is required' }); return; }

  const count = (db.prepare('SELECT COUNT(*) as c FROM watchlists WHERE user_id = ?').get(req.user!.id) as { c: number }).c;
  const limit = req.user!.tier === 'premium' ? PREMIUM_LIMIT : FREE_LIMIT;
  if (count >= limit) {
    res.status(403).json({
      error: `Watchlist limit reached (${limit} items for ${req.user!.tier} tier)`,
      upgrade: req.user!.tier !== 'premium',
    });
    return;
  }

  try {
    db.prepare('INSERT OR IGNORE INTO watchlists (user_id, ticker) VALUES (?, ?)').run(req.user!.id, ticker.toUpperCase());
    res.status(201).json({ ticker: ticker.toUpperCase(), added: true });
  } catch {
    res.status(409).json({ error: 'Ticker already in watchlist' });
  }
});

router.delete('/:ticker', requireAuth, (req: AuthRequest, res: Response) => {
  const ticker = String(req.params.ticker).toUpperCase();
  db.prepare('DELETE FROM watchlists WHERE user_id = ? AND ticker = ?').run(req.user!.id, ticker);
  res.json({ removed: true });
});

export default router;
