import { AuthGate } from './AuthGate';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4049;

app.use(cors());
app.use(express.json());

let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppass',
    database: process.env.DB_NAME || 'scholarship_tracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS scholarships (
      id VARCHAR(255) PRIMARY KEY,
      scholarship_name VARCHAR(255),
      award_amount DECIMAL(10,2),
      eligibility_criteria TEXT,
      deadline_date DATE,
      provider VARCHAR(255),
      status VARCHAR(50) DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS scholarship_applications (
      id VARCHAR(255) PRIMARY KEY,
      scholarship_id VARCHAR(255),
      applicant_name VARCHAR(255),
      gpa DECIMAL(3,2),
      application_date DATE,
      approval_status VARCHAR(50) DEFAULT 'pending',
      amount_awarded DECIMAL(10,2),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (scholarship_id) REFERENCES scholarships(id)
    )
  `);
  conn.release();
  console.log('Scholarship Tracker DB initialized');
}

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'scholarship-tracker' });
});

// --- Scholarships CRUD ---
app.get('/api/scholarships', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM scholarships ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scholarships/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM scholarships WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scholarships', async (req, res) => {
  try {
    const { scholarship_name, award_amount, eligibility_criteria, deadline_date, provider, status } = req.body;
    const id = `schol_${uuidv4()}`;
    await pool.query(
      'INSERT INTO scholarships (id, scholarship_name, award_amount, eligibility_criteria, deadline_date, provider, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, scholarship_name, award_amount, eligibility_criteria, deadline_date, provider, status || 'open']
    );
    const [rows] = await pool.query('SELECT * FROM scholarships WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/scholarships/:id', async (req, res) => {
  try {
    const { scholarship_name, award_amount, eligibility_criteria, deadline_date, provider, status } = req.body;
    const [result] = await pool.query(
      'UPDATE scholarships SET scholarship_name=?, award_amount=?, eligibility_criteria=?, deadline_date=?, provider=?, status=? WHERE id=?',
      [scholarship_name, award_amount, eligibility_criteria, deadline_date, provider, status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM scholarships WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/scholarships/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM scholarships WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Scholarship Applications CRUD ---
app.get('/api/scholarship-applications', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM scholarship_applications ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scholarship-applications/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM scholarship_applications WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scholarship-applications', async (req, res) => {
  try {
    const { scholarship_id, applicant_name, gpa, application_date, approval_status, amount_awarded } = req.body;
    const id = `sapp_${uuidv4()}`;
    await pool.query(
      'INSERT INTO scholarship_applications (id, scholarship_id, applicant_name, gpa, application_date, approval_status, amount_awarded) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, scholarship_id, applicant_name, gpa, application_date, approval_status || 'pending', amount_awarded]
    );
    const [rows] = await pool.query('SELECT * FROM scholarship_applications WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/scholarship-applications/:id', async (req, res) => {
  try {
    const { scholarship_id, applicant_name, gpa, application_date, approval_status, amount_awarded } = req.body;
    const [result] = await pool.query(
      'UPDATE scholarship_applications SET scholarship_id=?, applicant_name=?, gpa=?, application_date=?, approval_status=?, amount_awarded=? WHERE id=?',
      [scholarship_id, applicant_name, gpa, application_date, approval_status, amount_awarded, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM scholarship_applications WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/scholarship-applications/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM scholarship_applications WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  await initDB();
  app.listen(PORT, () => console.log(`Scholarship Tracker API running on port ${PORT}`));
}

start().catch(err => { console.error('Startup error:', err); process.exit(1); });
