import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4023;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'presentation_platform';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS presentations (
        id VARCHAR(255) PRIMARY KEY, title VARCHAR(255),
        creator_id VARCHAR(255), description TEXT,
        thumbnail_url VARCHAR(500), status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS slides (
        id VARCHAR(255) PRIMARY KEY, presentation_id VARCHAR(255),
        slide_number INT, slide_title VARCHAR(255),
        content TEXT, layout_type VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (presentation_id) REFERENCES presentations(id),
        INDEX idx_presentation (presentation_id)
      )
    `);
    conn.release();
    console.log('Presentation Platform DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'presentation-platform' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/presentation') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const presId = `pres_${Date.now()}`;
          await conn.query(
            'INSERT INTO presentations (id, title, creator_id, description, status) VALUES (?, ?, ?, ?, ?)',
            [presId, data.title || '', data.creator_id || '', data.description || '', 'draft']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, presentation_id: presId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/presentations')) {
      const conn = await pool.getConnection();
      const [presentations] = await conn.query('SELECT * FROM presentations ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(presentations));
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (e) {
    console.error('Request error:', e);
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function start() {
  await initDB();
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch(e => { res.writeHead(500); res.end('error'); });
  });
  server.listen(PORT, () => console.log(`Presentation Platform API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
