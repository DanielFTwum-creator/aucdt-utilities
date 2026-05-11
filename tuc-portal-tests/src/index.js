import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4037;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'test_management';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS test_suites (
        id VARCHAR(255) PRIMARY KEY, suite_name VARCHAR(255),
        project_name VARCHAR(255), test_count INT,
        status VARCHAR(50), last_run DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_project (project_name), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS test_cases (
        id VARCHAR(255) PRIMARY KEY, suite_id VARCHAR(255),
        test_name VARCHAR(255), test_type VARCHAR(100),
        status VARCHAR(50), execution_time_ms INT,
        failure_reason TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (suite_id) REFERENCES test_suites(id),
        INDEX idx_suite (suite_id), INDEX idx_status (status)
      )
    `);
    conn.release();
    console.log('Test Management DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'test-management' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/suite') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const suiteId = `ts_${Date.now()}`;
          await conn.query(
            'INSERT INTO test_suites (id, suite_name, project_name, test_count, status) VALUES (?, ?, ?, ?, ?)',
            [suiteId, data.name || '', data.project || '', data.count || 0, 'pending']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, suite_id: suiteId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/tests')) {
      const conn = await pool.getConnection();
      const [tests] = await conn.query('SELECT * FROM test_cases ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(tests));
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
  server.listen(PORT, () => console.log(`Test Management API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
