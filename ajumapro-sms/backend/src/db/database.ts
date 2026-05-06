import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/ajumapro.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDb(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      time TEXT NOT NULL DEFAULT (datetime('now')),
      action TEXT NOT NULL,
      user TEXT NOT NULL,
      details TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    );
  `);

  // Seed default admin user if not exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@ajumapro.com');
  if (!existing) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)').run(
      'admin@ajumapro.com', hash, 'admin'
    );
  }

  // Seed initial audit log if empty
  const count = (db.prepare('SELECT COUNT(*) as c FROM audit_logs').get() as { c: number }).c;
  if (count === 0) {
    db.prepare('INSERT INTO audit_logs (id, action, user, details) VALUES (?, ?, ?, ?)').run(
      'init-1', 'SYSTEM_INIT', 'SYSTEM', 'Phase 1 Foundation Setup Complete'
    );
    db.prepare('INSERT INTO audit_logs (id, action, user, details) VALUES (?, ?, ?, ?)').run(
      'init-2', 'DB_INIT', 'SYSTEM', 'SQLite database initialised with WAL mode'
    );
    db.prepare('INSERT INTO audit_logs (id, action, user, details) VALUES (?, ?, ?, ?)').run(
      'init-3', 'USER_SEED', 'SYSTEM', 'Default admin account provisioned'
    );
  }
}
