import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import db from '../db/schema';

const router = Router();

function requireAdminOrPremium(req: AuthRequest, res: Response, next: () => void) {
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
  if (!adminEmails.includes(req.user!.email) && req.user!.tier !== 'premium') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}

router.get('/stats', requireAuth, requireAdminOrPremium, (_req: AuthRequest, res: Response) => {
  const totalUsers = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
  const premiumUsers = (db.prepare('SELECT COUNT(*) as c FROM users WHERE tier = ?').get('premium') as { c: number }).c;
  const totalSignals = (db.prepare('SELECT COUNT(*) as c FROM ai_signals').get() as { c: number }).c;
  const totalOrders = (db.prepare('SELECT COUNT(*) as c FROM paper_orders').get() as { c: number }).c;
  const totalAlerts = (db.prepare('SELECT COUNT(*) as c FROM alerts WHERE active = 1').get() as { c: number }).c;
  res.json({ totalUsers, premiumUsers, freeUsers: totalUsers - premiumUsers, totalSignals, totalOrders, totalAlerts });
});

router.get('/audit', requireAuth, requireAdminOrPremium, (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = 50;
  const offset = (page - 1) * limit;
  const logs = db.prepare(
    'SELECT al.id, al.action, al.details, al.ip, al.created_at, u.email FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT ? OFFSET ?'
  ).all(limit, offset);
  const total = (db.prepare('SELECT COUNT(*) as c FROM audit_logs').get() as { c: number }).c;
  res.json({ logs, total, page, pages: Math.ceil(total / limit) });
});

router.get('/users', requireAuth, requireAdminOrPremium, (_req: AuthRequest, res: Response) => {
  const users = db.prepare(
    'SELECT id, email, name, tier, created_at, last_login FROM users ORDER BY created_at DESC LIMIT 100'
  ).all();
  res.json(users);
});

export default router;
