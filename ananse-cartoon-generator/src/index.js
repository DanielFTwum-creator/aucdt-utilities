import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4040;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'content_generation';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS generation_requests (
        id VARCHAR(255) PRIMARY KEY, request_type VARCHAR(100),
        description TEXT, prompt TEXT,
        status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (request_type), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS generated_content (
        id VARCHAR(255) PRIMARY KEY, request_id VARCHAR(255),
        content_url VARCHAR(500), content_type VARCHAR(100),
        generation_time_ms INT, quality_score DECIMAL(3,2),
        approval_status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES generation_requests(id),
        INDEX idx_request (request_id), INDEX idx_approval (approval_status)
      )
    `);
    conn.release();
    console.log('Content Generation DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'content-generation' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/request') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const requestId = `req_${Date.now()}`;
          await conn.query(
            'INSERT INTO generation_requests (id, request_type, description, prompt, status) VALUES (?, ?, ?, ?, ?)',
            [requestId, data.type || '', data.desc || '', data.prompt || '', 'pending']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, request_id: requestId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/content')) {
      const conn = await pool.getConnection();
      const [content] = await conn.query('SELECT * FROM generated_content ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(content));
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
  server.listen(PORT, () => console.log(`Content Generation API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
