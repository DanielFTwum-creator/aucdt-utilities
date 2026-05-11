import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4042;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'design_system';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS components (
        id VARCHAR(255) PRIMARY KEY, component_name VARCHAR(255),
        component_type VARCHAR(100), status VARCHAR(50),
        version VARCHAR(20), usage_count INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (component_type), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS design_tokens (
        id VARCHAR(255) PRIMARY KEY, token_name VARCHAR(255),
        token_type VARCHAR(100), value VARCHAR(255),
        category VARCHAR(100), deprecation_status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category), INDEX idx_deprecation (deprecation_status)
      )
    `);
    conn.release();
    console.log('Design System DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'design-system' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/component') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const compId = `comp_${Date.now()}`;
          await conn.query(
            'INSERT INTO components (id, component_name, component_type, status, version) VALUES (?, ?, ?, ?, ?)',
            [compId, data.name || '', data.type || '', 'published', data.version || '1.0.0']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, component_id: compId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/tokens')) {
      const conn = await pool.getConnection();
      const [tokens] = await conn.query('SELECT * FROM design_tokens ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(tokens));
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
  server.listen(PORT, () => console.log(`Design System API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
