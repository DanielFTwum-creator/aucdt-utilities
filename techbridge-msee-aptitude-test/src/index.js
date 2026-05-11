import { AuthGate } from './AuthGate';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppass',
    database: process.env.DB_NAME || 'msee_aptitude',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id VARCHAR(255) PRIMARY KEY,
      test_section VARCHAR(100) NOT NULL,
      question_text TEXT NOT NULL,
      difficulty ENUM('easy','medium','hard') DEFAULT 'medium',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS answers (
      id VARCHAR(255) PRIMARY KEY,
      question_id VARCHAR(255) NOT NULL,
      student_id VARCHAR(255) NOT NULL,
      answer_text TEXT,
      is_correct BOOLEAN DEFAULT FALSE,
      score DECIMAL(5,2) DEFAULT 0,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    )
  `);
  conn.release();
  console.log('MSEE Aptitude DB initialized');
}

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'aucdt-msee-aptitude-test' });
});

// --- Questions CRUD ---
app.get('/api/questions', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM questions ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/questions/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM questions WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const { test_section, question_text, difficulty } = req.body;
    const id = `qst_${uuidv4()}`;
    await pool.query(
      'INSERT INTO questions (id, test_section, question_text, difficulty) VALUES (?, ?, ?, ?)',
      [id, test_section, question_text, difficulty || 'medium']
    );
    const [rows] = await pool.query('SELECT * FROM questions WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/questions/:id', async (req, res) => {
  try {
    const { test_section, question_text, difficulty } = req.body;
    const [result] = await pool.query(
      'UPDATE questions SET test_section=?, question_text=?, difficulty=? WHERE id=?',
      [test_section, question_text, difficulty, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM questions WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/questions/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM questions WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Answers CRUD ---
app.get('/api/answers', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM answers ORDER BY submitted_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/answers/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM answers WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/answers', async (req, res) => {
  try {
    const { question_id, student_id, answer_text, is_correct, score } = req.body;
    const id = `ans_${uuidv4()}`;
    await pool.query(
      'INSERT INTO answers (id, question_id, student_id, answer_text, is_correct, score) VALUES (?, ?, ?, ?, ?, ?)',
      [id, question_id, student_id, answer_text, is_correct || false, score || 0]
    );
    const [rows] = await pool.query('SELECT * FROM answers WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/answers/:id', async (req, res) => {
  try {
    const { question_id, student_id, answer_text, is_correct, score } = req.body;
    const [result] = await pool.query(
      'UPDATE answers SET question_id=?, student_id=?, answer_text=?, is_correct=?, score=? WHERE id=?',
      [question_id, student_id, answer_text, is_correct, score, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM answers WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/answers/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM answers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  await initDB();
  app.listen(PORT, () => console.log(`MSEE Aptitude Test API running on port ${PORT}`));
}

start().catch(err => { console.error('Startup error:', err); process.exit(1); });
