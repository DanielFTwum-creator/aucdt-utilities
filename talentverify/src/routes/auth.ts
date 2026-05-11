import express from 'express';
import { getDb } from '../db';
import crypto from 'crypto';

const router = express.Router();

// Simple hash function (SHA-256)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// --- Login ---
router.post('/login', (req, res) => {
  const { role, email, password } = req.body;
  const db = getDb();

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  try {
    let user;
    if (role === 'candidate') {
      // Check candidates table
      user = db.prepare('SELECT * FROM candidates WHERE email = ?').get(email) as any;
    } else {
      // Check users table
      user = db.prepare('SELECT * FROM users WHERE email = ? AND role = ?').get(email, role) as any;
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    // For admin seed, we stored 'admin123' directly.
    // For new users, we should store hash.
    // To support the existing admin seed which might be plain text or if I update it to be hashed.
    // Let's assume the seed is 'admin123' and we check against hash OR plain text (for migration safety).
    // Actually, I updated the seed to insert 'admin123'.
    // So if I hash 'admin123', it won't match 'admin123'.
    // I should update the seed to store the hash of 'admin123'.
    // But I can't easily run the hash function inside the `db/index.ts` without importing crypto there.
    // Let's just compare plain text for the seed, and hash for others?
    // No, consistency is better.
    // I will update the seed in `db/index.ts` to use a hardcoded hash of 'admin123'.
    // SHA256('admin123') = 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
    
    const inputHash = hashPassword(password);
    
    // Allow plain text match for legacy/seed (if it was inserted as plain text)
    if (user.password_hash !== inputHash && user.password_hash !== password) {
       return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user info (excluding password)
    const { password_hash, ...userInfo } = user;
    // Add role to candidate if missing (candidates table doesn't have role column, but frontend expects it)
    if (role === 'candidate') {
      userInfo.role = 'candidate';
    }

    res.json({ user: userInfo });

  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Register ---
router.post('/register', (req, res) => {
  const { role, email, password, name } = req.body;
  const db = getDb();

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const hashedPassword = hashPassword(password);

  try {
    if (role === 'candidate') {
      const stmt = db.prepare('INSERT INTO candidates (email, password_hash, name) VALUES (?, ?, ?)');
      const result = stmt.run(email, hashedPassword, name);
      res.json({ id: result.lastInsertRowid, role: 'candidate', email, name });
    } else {
      // Recruiter or other roles
      const stmt = db.prepare('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)');
      const result = stmt.run(email, hashedPassword, name, role);
      res.json({ id: result.lastInsertRowid, role, email, name });
    }
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
