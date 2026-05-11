import { AuthGate } from './AuthGate';
const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
const PORT = process.env.PORT || 4056;

app.use(cors());
app.use(express.json());

let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppass',
    database: process.env.DB_NAME || 'mentorship_program',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS mentors (
      id VARCHAR(255) PRIMARY KEY,
      mentor_name VARCHAR(255),
      expertise_area VARCHAR(255),
      years_experience INT,
      bio TEXT,
      availability VARCHAR(50),
      max_mentees INT,
      current_mentees INT DEFAULT 0,
      rating DECIMAL(3,2),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS mentees (
      id VARCHAR(255) PRIMARY KEY,
      mentor_id VARCHAR(255),
      mentee_name VARCHAR(255),
      learning_goals TEXT,
      matching_date DATE,
      progress_score INT DEFAULT 0,
      meeting_frequency VARCHAR(50),
      program_status VARCHAR(50) DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (mentor_id) REFERENCES mentors(id)
    )
  `);
  conn.release();
  console.log('Mentorship Program DB initialized');
}

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'mentorship-program' });
});

// ─── Mentors CRUD ─────────────────────────────────────────────────────────────

app.get('/api/mentors', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM mentors ORDER BY created_at DESC');
  res.json(rows);
});

app.get('/api/mentors/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM mentors WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Mentor not found' });
  res.json(rows[0]);
});

app.post('/api/mentors', async (req, res) => {
  const { mentor_name, expertise_area, years_experience, bio, availability, max_mentees, current_mentees, rating } = req.body;
  if (!mentor_name || !expertise_area) {
    return res.status(400).json({ error: 'mentor_name and expertise_area are required' });
  }
  const id = 'mntr_' + uuidv4().replace(/-/g, '').slice(0, 16);
  await pool.query(
    `INSERT INTO mentors (id, mentor_name, expertise_area, years_experience, bio, availability, max_mentees, current_mentees, rating)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, mentor_name, expertise_area, years_experience ?? null, bio ?? null, availability ?? null, max_mentees ?? null, current_mentees ?? 0, rating ?? null]
  );
  const [rows] = await pool.query('SELECT * FROM mentors WHERE id = ?', [id]);
  res.status(201).json(rows[0]);
});

app.put('/api/mentors/:id', async (req, res) => {
  const { mentor_name, expertise_area, years_experience, bio, availability, max_mentees, current_mentees, rating } = req.body;
  const [existing] = await pool.query('SELECT id FROM mentors WHERE id = ?', [req.params.id]);
  if (!existing.length) return res.status(404).json({ error: 'Mentor not found' });
  await pool.query(
    `UPDATE mentors SET
      mentor_name = COALESCE(?, mentor_name),
      expertise_area = COALESCE(?, expertise_area),
      years_experience = COALESCE(?, years_experience),
      bio = COALESCE(?, bio),
      availability = COALESCE(?, availability),
      max_mentees = COALESCE(?, max_mentees),
      current_mentees = COALESCE(?, current_mentees),
      rating = COALESCE(?, rating)
    WHERE id = ?`,
    [mentor_name ?? null, expertise_area ?? null, years_experience ?? null, bio ?? null, availability ?? null, max_mentees ?? null, current_mentees ?? null, rating ?? null, req.params.id]
  );
  const [rows] = await pool.query('SELECT * FROM mentors WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/mentors/:id', async (req, res) => {
  const [existing] = await pool.query('SELECT id FROM mentors WHERE id = ?', [req.params.id]);
  if (!existing.length) return res.status(404).json({ error: 'Mentor not found' });
  await pool.query('DELETE FROM mentees WHERE mentor_id = ?', [req.params.id]);
  await pool.query('DELETE FROM mentors WHERE id = ?', [req.params.id]);
  res.json({ message: 'Mentor deleted' });
});

// ─── Mentees CRUD ─────────────────────────────────────────────────────────────

app.get('/api/mentees', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM mentees ORDER BY created_at DESC');
  res.json(rows);
});

app.get('/api/mentees/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM mentees WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Mentee not found' });
  res.json(rows[0]);
});

app.post('/api/mentees', async (req, res) => {
  const { mentor_id, mentee_name, learning_goals, matching_date, progress_score, meeting_frequency, program_status } = req.body;
  if (!mentor_id || !mentee_name) {
    return res.status(400).json({ error: 'mentor_id and mentee_name are required' });
  }
  const [mentorCheck] = await pool.query('SELECT id FROM mentors WHERE id = ?', [mentor_id]);
  if (!mentorCheck.length) return res.status(400).json({ error: 'mentor_id does not exist' });
  const id = 'mnte_' + uuidv4().replace(/-/g, '').slice(0, 16);
  await pool.query(
    `INSERT INTO mentees (id, mentor_id, mentee_name, learning_goals, matching_date, progress_score, meeting_frequency, program_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, mentor_id, mentee_name, learning_goals ?? null, matching_date ?? null, progress_score ?? 0, meeting_frequency ?? null, program_status ?? 'active']
  );
  const [rows] = await pool.query('SELECT * FROM mentees WHERE id = ?', [id]);
  res.status(201).json(rows[0]);
});

app.put('/api/mentees/:id', async (req, res) => {
  const { mentor_id, mentee_name, learning_goals, matching_date, progress_score, meeting_frequency, program_status } = req.body;
  const [existing] = await pool.query('SELECT id FROM mentees WHERE id = ?', [req.params.id]);
  if (!existing.length) return res.status(404).json({ error: 'Mentee not found' });
  await pool.query(
    `UPDATE mentees SET
      mentor_id = COALESCE(?, mentor_id),
      mentee_name = COALESCE(?, mentee_name),
      learning_goals = COALESCE(?, learning_goals),
      matching_date = COALESCE(?, matching_date),
      progress_score = COALESCE(?, progress_score),
      meeting_frequency = COALESCE(?, meeting_frequency),
      program_status = COALESCE(?, program_status)
    WHERE id = ?`,
    [mentor_id ?? null, mentee_name ?? null, learning_goals ?? null, matching_date ?? null, progress_score ?? null, meeting_frequency ?? null, program_status ?? null, req.params.id]
  );
  const [rows] = await pool.query('SELECT * FROM mentees WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/mentees/:id', async (req, res) => {
  const [existing] = await pool.query('SELECT id FROM mentees WHERE id = ?', [req.params.id]);
  if (!existing.length) return res.status(404).json({ error: 'Mentee not found' });
  await pool.query('DELETE FROM mentees WHERE id = ?', [req.params.id]);
  res.json({ message: 'Mentee deleted' });
});

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Mentorship Program API running on port ${PORT}`));
  })
  .catch((e) => {
    console.error('Startup error:', e);
    process.exit(1);
  });
