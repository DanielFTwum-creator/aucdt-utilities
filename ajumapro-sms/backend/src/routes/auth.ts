import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { signToken, requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as
    | { id: number; email: string; password_hash: string; role: string }
    | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    // Log failed attempt
    db.prepare('INSERT INTO audit_logs (id, action, user, details) VALUES (?, ?, ?, ?)').run(
      Math.random().toString(36).slice(2, 9), 'AUTH_FAILED', email, 'Invalid credentials'
    );
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken(user.email, user.role);

  db.prepare('INSERT INTO audit_logs (id, action, user, details) VALUES (?, ?, ?, ?)').run(
    Math.random().toString(36).slice(2, 9), 'AUTH_SUCCESS', user.email, 'Login via secure portal'
  );

  res.json({ token, email: user.email, role: user.role });
});

// GET /api/auth/verify
router.get('/verify', requireAuth, (req: AuthRequest, res) => {
  res.json({ valid: true, user: req.user });
});

// POST /api/auth/logout
router.post('/logout', requireAuth, (req: AuthRequest, res) => {
  db.prepare('INSERT INTO audit_logs (id, action, user, details) VALUES (?, ?, ?, ?)').run(
    Math.random().toString(36).slice(2, 9), 'AUTH_LOGOUT', req.user!.email, 'User logged out'
  );
  res.json({ success: true });
});

export default router;
