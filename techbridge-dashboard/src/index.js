import { AuthGate } from './AuthGate';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4009;

app.use(cors());
app.use(express.json());

let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppass',
    database: process.env.DB_NAME || 'dashboard',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS widgets (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255),
      widget_type VARCHAR(50),
      config TEXT,
      position INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS metrics (
      id VARCHAR(255) PRIMARY KEY,
      widget_id VARCHAR(255),
      metric_name VARCHAR(255),
      metric_value DECIMAL(10,2),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (widget_id) REFERENCES widgets(id),
      INDEX idx_widget (widget_id),
      INDEX idx_time (timestamp)
    )
  `);
  conn.release();
  console.log('Dashboard DB initialized');
}

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'techbridge-dashboard' });
});

// --- Widgets CRUD ---
app.get('/api/widgets', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM widgets ORDER BY position ASC, created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/widgets/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM widgets WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/widgets', async (req, res) => {
  try {
    const { title, widget_type, config, position } = req.body;
    const id = `wgt_${uuidv4()}`;
    await pool.query(
      'INSERT INTO widgets (id, title, widget_type, config, position) VALUES (?, ?, ?, ?, ?)',
      [id, title, widget_type, config, position]
    );
    const [rows] = await pool.query('SELECT * FROM widgets WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/widgets/:id', async (req, res) => {
  try {
    const { title, widget_type, config, position } = req.body;
    const [result] = await pool.query(
      'UPDATE widgets SET title=?, widget_type=?, config=?, position=? WHERE id=?',
      [title, widget_type, config, position, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM widgets WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/widgets/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM widgets WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Metrics CRUD ---
app.get('/api/metrics', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM metrics ORDER BY timestamp DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/metrics/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM metrics WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/metrics', async (req, res) => {
  try {
    const { widget_id, metric_name, metric_value, timestamp } = req.body;
    const id = `mtr_${uuidv4()}`;
    await pool.query(
      'INSERT INTO metrics (id, widget_id, metric_name, metric_value, timestamp) VALUES (?, ?, ?, ?, ?)',
      [id, widget_id, metric_name, metric_value, timestamp || null]
    );
    const [rows] = await pool.query('SELECT * FROM metrics WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/metrics/:id', async (req, res) => {
  try {
    const { widget_id, metric_name, metric_value, timestamp } = req.body;
    const [result] = await pool.query(
      'UPDATE metrics SET widget_id=?, metric_name=?, metric_value=?, timestamp=? WHERE id=?',
      [widget_id, metric_name, metric_value, timestamp, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM metrics WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/metrics/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM metrics WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  await initDB();
  app.listen(PORT, () => console.log(`Techbridge Dashboard API running on port ${PORT}`));
}

start().catch(err => { console.error('Startup error:', err); process.exit(1); });
