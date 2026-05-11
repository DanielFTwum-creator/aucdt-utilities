import { AuthGate } from './AuthGate';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 4051;
const app = express();
app.use(cors());
app.use(express.json());


// Serve admin UI from public directory
app.use(express.static(path.join(__dirname, '../public')));
let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppass',
    database: process.env.DB_NAME || 'career_services',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();

  await conn.query(`
    CREATE TABLE IF NOT EXISTS job_postings (
      id VARCHAR(255) PRIMARY KEY,
      job_title VARCHAR(255),
      company_name VARCHAR(255),
      location VARCHAR(255),
      salary_range VARCHAR(100),
      job_description TEXT,
      posting_date DATE,
      deadline_date DATE,
      status VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id VARCHAR(255) PRIMARY KEY,
      job_posting_id VARCHAR(255),
      applicant_name VARCHAR(255),
      applicant_email VARCHAR(255),
      resume_url VARCHAR(500),
      application_date DATE,
      application_status VARCHAR(50),
      interview_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_posting_id) REFERENCES job_postings(id)
    )
  `);

  conn.release();
  console.log('Career Services DB initialized');
}


// Serve admin UI at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'career-services' }));

// --- job_postings CRUD ---

app.get('/api/job-postings', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM job_postings ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/job-postings', async (req, res) => {
  try {
    const id = `job_${uuidv4()}`;
    const { job_title, company_name, location, salary_range, job_description, posting_date, deadline_date, status } = req.body;
    await pool.query(
      'INSERT INTO job_postings (id, job_title, company_name, location, salary_range, job_description, posting_date, deadline_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, job_title, company_name, location, salary_range, job_description, posting_date, deadline_date, status || 'open']
    );
    const [[row]] = await pool.query('SELECT * FROM job_postings WHERE id = ?', [id]);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/job-postings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { job_title, company_name, location, salary_range, job_description, posting_date, deadline_date, status } = req.body;
    await pool.query(
      'UPDATE job_postings SET job_title=?, company_name=?, location=?, salary_range=?, job_description=?, posting_date=?, deadline_date=?, status=? WHERE id=?',
      [job_title, company_name, location, salary_range, job_description, posting_date, deadline_date, status, id]
    );
    const [[row]] = await pool.query('SELECT * FROM job_postings WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/job-postings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM job_applications WHERE job_posting_id = ?', [id]);
    const [result] = await pool.query('DELETE FROM job_postings WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- job_applications CRUD ---

app.get('/api/job-applications', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM job_applications ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/job-applications', async (req, res) => {
  try {
    const id = `app_${uuidv4()}`;
    const { job_posting_id, applicant_name, applicant_email, resume_url, application_date, application_status, interview_date } = req.body;
    await pool.query(
      'INSERT INTO job_applications (id, job_posting_id, applicant_name, applicant_email, resume_url, application_date, application_status, interview_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, job_posting_id, applicant_name, applicant_email, resume_url, application_date, application_status || 'submitted', interview_date]
    );
    const [[row]] = await pool.query('SELECT * FROM job_applications WHERE id = ?', [id]);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/job-applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { job_posting_id, applicant_name, applicant_email, resume_url, application_date, application_status, interview_date } = req.body;
    await pool.query(
      'UPDATE job_applications SET job_posting_id=?, applicant_name=?, applicant_email=?, resume_url=?, application_date=?, application_status=?, interview_date=? WHERE id=?',
      [job_posting_id, applicant_name, applicant_email, resume_url, application_date, application_status, interview_date, id]
    );
    const [[row]] = await pool.query('SELECT * FROM job_applications WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/job-applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM job_applications WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  await initDB();
  app.listen(PORT, () => console.log(`Career Services API running on port ${PORT}`));
}

start().catch(console.error);
