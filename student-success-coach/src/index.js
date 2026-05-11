import { AuthGate } from './AuthGate';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4048;

app.use(cors());
app.use(express.json());

let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppass',
    database: process.env.DB_NAME || 'student_success_coach',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS coaching_sessions (
      id VARCHAR(255) PRIMARY KEY,
      student_id VARCHAR(255),
      coach_name VARCHAR(255),
      session_date DATE,
      session_topic VARCHAR(255),
      duration_minutes INT,
      focus_area VARCHAR(100),
      status VARCHAR(50) DEFAULT 'scheduled',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS progress_tracking (
      id VARCHAR(255) PRIMARY KEY,
      student_id VARCHAR(255),
      coaching_session_id VARCHAR(255),
      gpa DECIMAL(3,2),
      attendance_rate DECIMAL(5,2),
      assignment_completion DECIMAL(5,2),
      improvement_score INT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (coaching_session_id) REFERENCES coaching_sessions(id)
    )
  `);
  conn.release();
  console.log('Student Success Coach DB initialized');
}

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'student-success-coach' });
});

// --- Coaching Sessions CRUD ---
app.get('/api/coaching-sessions', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM coaching_sessions ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/coaching-sessions/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM coaching_sessions WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/coaching-sessions', async (req, res) => {
  try {
    const { student_id, coach_name, session_date, session_topic, duration_minutes, focus_area, status } = req.body;
    const id = `sess_${uuidv4()}`;
    await pool.query(
      'INSERT INTO coaching_sessions (id, student_id, coach_name, session_date, session_topic, duration_minutes, focus_area, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, student_id, coach_name, session_date, session_topic, duration_minutes, focus_area, status || 'scheduled']
    );
    const [rows] = await pool.query('SELECT * FROM coaching_sessions WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/coaching-sessions/:id', async (req, res) => {
  try {
    const { student_id, coach_name, session_date, session_topic, duration_minutes, focus_area, status } = req.body;
    const [result] = await pool.query(
      'UPDATE coaching_sessions SET student_id=?, coach_name=?, session_date=?, session_topic=?, duration_minutes=?, focus_area=?, status=? WHERE id=?',
      [student_id, coach_name, session_date, session_topic, duration_minutes, focus_area, status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM coaching_sessions WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/coaching-sessions/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM coaching_sessions WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Progress Tracking CRUD ---
app.get('/api/progress-tracking', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM progress_tracking ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/progress-tracking/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM progress_tracking WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress-tracking', async (req, res) => {
  try {
    const { student_id, coaching_session_id, gpa, attendance_rate, assignment_completion, improvement_score, notes } = req.body;
    const id = `prog_${uuidv4()}`;
    await pool.query(
      'INSERT INTO progress_tracking (id, student_id, coaching_session_id, gpa, attendance_rate, assignment_completion, improvement_score, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, student_id, coaching_session_id, gpa, attendance_rate, assignment_completion, improvement_score, notes]
    );
    const [rows] = await pool.query('SELECT * FROM progress_tracking WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/progress-tracking/:id', async (req, res) => {
  try {
    const { student_id, coaching_session_id, gpa, attendance_rate, assignment_completion, improvement_score, notes } = req.body;
    const [result] = await pool.query(
      'UPDATE progress_tracking SET student_id=?, coaching_session_id=?, gpa=?, attendance_rate=?, assignment_completion=?, improvement_score=?, notes=? WHERE id=?',
      [student_id, coaching_session_id, gpa, attendance_rate, assignment_completion, improvement_score, notes, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM progress_tracking WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/progress-tracking/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM progress_tracking WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  await initDB();
  app.listen(PORT, () => console.log(`Student Success Coach API running on port ${PORT}`));
}

start().catch(err => { console.error('Startup error:', err); process.exit(1); });
