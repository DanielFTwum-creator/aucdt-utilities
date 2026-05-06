import { AuthGate } from './AuthGate';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4008;

app.use(cors());
app.use(express.json());

let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppass',
    database: process.env.DB_NAME || 'newsfeed',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS feeds (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255),
      source VARCHAR(255),
      category VARCHAR(100),
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id VARCHAR(255) PRIMARY KEY,
      feed_id VARCHAR(255),
      headline VARCHAR(500),
      summary TEXT,
      content TEXT,
      author VARCHAR(255),
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      views INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (feed_id) REFERENCES feeds(id),
      INDEX idx_feed (feed_id),
      INDEX idx_published (published_at)
    )
  `);
  conn.release();
  console.log('NEWSFEED DB initialized');
}

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'newsfeed' });
});

// ─── Feeds CRUD ───────────────────────────────────────────────────────────────

app.get('/api/feeds', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM feeds ORDER BY created_at DESC');
  res.json(rows);
});

app.get('/api/feeds/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM feeds WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Feed not found' });
  res.json(rows[0]);
});

app.post('/api/feeds', async (req, res) => {
  const { title, source, category, is_active } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }
  const id = 'feed_' + uuidv4().replace(/-/g, '').slice(0, 16);
  await pool.query(
    'INSERT INTO feeds (id, title, source, category, is_active) VALUES (?, ?, ?, ?, ?)',
    [id, title, source ?? null, category ?? null, is_active !== undefined ? is_active : true]
  );
  const [rows] = await pool.query('SELECT * FROM feeds WHERE id = ?', [id]);
  res.status(201).json(rows[0]);
});

app.put('/api/feeds/:id', async (req, res) => {
  const { title, source, category, is_active } = req.body;
  const [existing] = await pool.query('SELECT id FROM feeds WHERE id = ?', [req.params.id]);
  if (!existing.length) return res.status(404).json({ error: 'Feed not found' });
  await pool.query(
    `UPDATE feeds SET
      title = COALESCE(?, title),
      source = COALESCE(?, source),
      category = COALESCE(?, category),
      is_active = CASE WHEN ? IS NOT NULL THEN ? ELSE is_active END
    WHERE id = ?`,
    [title ?? null, source ?? null, category ?? null, is_active !== undefined ? 1 : null, is_active !== undefined ? is_active : null, req.params.id]
  );
  const [rows] = await pool.query('SELECT * FROM feeds WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/feeds/:id', async (req, res) => {
  const [existing] = await pool.query('SELECT id FROM feeds WHERE id = ?', [req.params.id]);
  if (!existing.length) return res.status(404).json({ error: 'Feed not found' });
  await pool.query('DELETE FROM articles WHERE feed_id = ?', [req.params.id]);
  await pool.query('DELETE FROM feeds WHERE id = ?', [req.params.id]);
  res.json({ message: 'Feed deleted' });
});

// ─── Articles CRUD ────────────────────────────────────────────────────────────

app.get('/api/articles', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM articles ORDER BY published_at DESC');
  res.json(rows);
});

app.get('/api/articles/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Article not found' });
  res.json(rows[0]);
});

app.post('/api/articles', async (req, res) => {
  const { feed_id, headline, summary, content, author, published_at, views } = req.body;
  if (!feed_id || !headline) {
    return res.status(400).json({ error: 'feed_id and headline are required' });
  }
  const [feedCheck] = await pool.query('SELECT id FROM feeds WHERE id = ?', [feed_id]);
  if (!feedCheck.length) return res.status(400).json({ error: 'feed_id does not exist' });
  const id = 'art_' + uuidv4().replace(/-/g, '').slice(0, 16);
  await pool.query(
    'INSERT INTO articles (id, feed_id, headline, summary, content, author, published_at, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, feed_id, headline, summary ?? null, content ?? null, author ?? null, published_at ?? null, views ?? 0]
  );
  const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
  res.status(201).json(rows[0]);
});

app.put('/api/articles/:id', async (req, res) => {
  const { feed_id, headline, summary, content, author, published_at, views } = req.body;
  const [existing] = await pool.query('SELECT id FROM articles WHERE id = ?', [req.params.id]);
  if (!existing.length) return res.status(404).json({ error: 'Article not found' });
  await pool.query(
    `UPDATE articles SET
      feed_id = COALESCE(?, feed_id),
      headline = COALESCE(?, headline),
      summary = COALESCE(?, summary),
      content = COALESCE(?, content),
      author = COALESCE(?, author),
      published_at = COALESCE(?, published_at),
      views = COALESCE(?, views)
    WHERE id = ?`,
    [feed_id ?? null, headline ?? null, summary ?? null, content ?? null, author ?? null, published_at ?? null, views ?? null, req.params.id]
  );
  const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/articles/:id', async (req, res) => {
  const [existing] = await pool.query('SELECT id FROM articles WHERE id = ?', [req.params.id]);
  if (!existing.length) return res.status(404).json({ error: 'Article not found' });
  await pool.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
  res.json({ message: 'Article deleted' });
});

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`NEWSFEED API running on port ${PORT}`));
  })
  .catch((e) => {
    console.error('Startup error:', e);
    process.exit(1);
  });
