import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4001;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'brand_checker';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const conn = await pool.getConnection();
    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS guidelines (
        id VARCHAR(255) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        rule_name VARCHAR(255) NOT NULL,
        description TEXT,
        severity ENUM('warning', 'error', 'info') DEFAULT 'warning',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS audits (
        id VARCHAR(255) PRIMARY KEY,
        guideline_id VARCHAR(255) NOT NULL,
        content_url VARCHAR(500),
        status ENUM('pass', 'fail', 'pending') DEFAULT 'pending',
        score INT DEFAULT 0,
        audit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (guideline_id) REFERENCES guidelines(id)
      )
    `);

    conn.release();
    console.log('Brand Checker DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'brand-checker' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/audit') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const auditId = `audit_${Date.now()}`;
          await conn.query(
            'INSERT INTO audits (id, guideline_id, content_url, status) VALUES (?, ?, ?, ?)',
            [auditId, data.guideline_id || 'default', data.url || '', 'pending']
          );
          const [audit] = await conn.query('SELECT * FROM audits WHERE id = ?', [auditId]);
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, audit: audit[0] }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/audits')) {
      const conn = await pool.getConnection();
      const [audits] = await conn.query('SELECT * FROM audits ORDER BY audit_date DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(audits));
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
    handleRequest(req, res).catch(e => {
      res.writeHead(500);
      res.end('error');
    });
  });

  server.listen(PORT, () => console.log(`Brand Checker API on ${PORT}`));
}

start().catch(e => {
  console.error('Startup error:', e);
  process.exit(1);
});
