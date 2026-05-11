import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import db from '../db/schema';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

function makeToken(user: { id: number; email: string; tier: string }) {
  const options: jwt.SignOptions = { expiresIn: JWT_EXPIRE as jwt.SignOptions['expiresIn'] };
  return jwt.sign({ id: user.id, email: user.email, tier: user.tier }, JWT_SECRET as jwt.Secret, options);
}

function logAudit(userId: number | null, action: string, details: string, ip: string) {
  db.prepare(
    'INSERT INTO audit_logs (user_id, action, details, ip) VALUES (?, ?, ?, ?)'
  ).run(userId, action, details, ip);
}

router.post('/register', (req: Request, res: Response) => {
  const { email, password, name } = req.body as { email: string; password: string; name: string };
  if (!email || !password || !name) {
    res.status(400).json({ error: 'Email, password, and name are required' });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }

  const hash = bcrypt.hashSync(password, 12);
  const result = db.prepare(
    'INSERT INTO users (email, password_hash, name, tier) VALUES (?, ?, ?, ?)'
  ).run(normalizedEmail, hash, name.trim(), 'free');

  const userId = result.lastInsertRowid as number;

  db.prepare(
    'INSERT INTO paper_accounts (user_id, cash_balance) VALUES (?, ?)'
  ).run(userId, 100000.00);

  const defaultWatchlist = ['SOXL', 'SOXS'];
  defaultWatchlist.forEach(ticker => {
    db.prepare('INSERT OR IGNORE INTO watchlists (user_id, ticker) VALUES (?, ?)').run(userId, ticker);
  });

  const token = makeToken({ id: userId, email: email.toLowerCase().trim(), tier: 'free' });
  logAudit(userId, 'REGISTER', `New user: ${email}`, req.ip || 'unknown');
  res.status(201).json({ token, user: { id: userId, email, name, tier: 'free' } });
});

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = db.prepare(
    'SELECT id, email, password_hash, name, tier FROM users WHERE email = ?'
  ).get(email.toLowerCase().trim()) as
    | { id: number; email: string; password_hash: string; name: string; tier: string }
    | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    logAudit(null, 'LOGIN_FAIL', `Failed login: ${email}`, req.ip || 'unknown');
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  db.prepare('UPDATE users SET last_login = datetime(\'now\') WHERE id = ?').run(user.id);
  const token = makeToken({ id: user.id, email: user.email, tier: user.tier });
  logAudit(user.id, 'LOGIN', `Login from ${req.ip}`, req.ip || 'unknown');
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, tier: user.tier } });
});

router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  const user = db.prepare(
    'SELECT id, email, name, tier, tier_expires_at, created_at, last_login FROM users WHERE id = ?'
  ).get(req.user!.id);
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }
  res.json(user);
});

router.post('/upgrade', requireAuth, (req: AuthRequest, res: Response) => {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(
    'UPDATE users SET tier = ?, tier_expires_at = ? WHERE id = ?'
  ).run('premium', expires, req.user!.id);
  logAudit(req.user!.id, 'UPGRADE', 'Upgraded to premium', req.ip || 'unknown');
  const token = makeToken({ id: req.user!.id, email: req.user!.email, tier: 'premium' });
  res.json({ message: 'Upgraded to premium', token, tier: 'premium', expiresAt: expires });
});

router.post('/cancel', requireAuth, (req: AuthRequest, res: Response) => {
  db.prepare('UPDATE users SET tier = ?, tier_expires_at = NULL WHERE id = ?').run('free', req.user!.id);
  logAudit(req.user!.id, 'CANCEL_SUBSCRIPTION', 'Downgraded to free', req.ip || 'unknown');
  const token = makeToken({ id: req.user!.id, email: req.user!.email, tier: 'free' });
  res.json({ message: 'Subscription cancelled', token, tier: 'free' });
});

export default router;
