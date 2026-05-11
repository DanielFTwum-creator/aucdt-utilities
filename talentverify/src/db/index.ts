import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'talentverify.db');
const db = new Database(dbPath);

export function initDatabase() {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Users (Recruiters, Admins, etc.)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'recruiter', 'hiring_manager', 'compliance_officer')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Candidates
  db.exec(`
    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: Add password_hash if not exists
  try {
    const userColumns = db.pragma('table_info(users)') as any[];
    if (!userColumns.find(c => c.name === 'password_hash')) {
      db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
    }

    const candidateColumns = db.pragma('table_info(candidates)') as any[];
    if (!candidateColumns.find(c => c.name === 'password_hash')) {
      db.exec('ALTER TABLE candidates ADD COLUMN password_hash TEXT');
    }
  } catch (e) {
    console.error('Migration failed:', e);
  }

  // Roles (Job Positions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Applications
  db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      candidate_id INTEGER NOT NULL,
      role_id INTEGER NOT NULL,
      status TEXT DEFAULT 'applied',
      ai_authorship_score REAL,
      talent_signal_score REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (candidate_id) REFERENCES candidates(id),
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );
  `);

  // Audit Logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Questionnaires (Templates linked to Roles)
  db.exec(`
    CREATE TABLE IF NOT EXISTS questionnaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );
  `);

  // Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionnaire_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('short_answer', 'long_answer', 'scenario', 'ranked_choice', 'video_response', 'file_upload')),
      min_words INTEGER,
      max_words INTEGER,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
    );
  `);

  // Answers
  db.exec(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      text_response TEXT,
      video_data BLOB,
      file_data BLOB,
      ai_score REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `);

  // Seed initial admin user if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  if (!adminExists) {
    // SHA256 hash of 'admin123'
    const adminHash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
    db.prepare('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)').run('admin@talentverify.com', adminHash, 'System Admin', 'admin');
  }

  console.log('Database initialized successfully');
}

export function getDb() {
  return db;
}
