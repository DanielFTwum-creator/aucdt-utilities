const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4025;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'candidate_broadsheet';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id VARCHAR(255) PRIMARY KEY, candidate_number VARCHAR(100),
        full_name VARCHAR(255), exam_center VARCHAR(255),
        status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_candidate_number (candidate_number), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS results (
        id VARCHAR(255) PRIMARY KEY, candidate_id VARCHAR(255),
        subject VARCHAR(100), score INT, grade VARCHAR(2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES candidates(id),
        INDEX idx_candidate (candidate_id), INDEX idx_grade (grade)
      )
    `);
    conn.release();
    console.log('Candidate Broadsheet DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'candidate-broadsheet' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/candidate') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const candId = `cand_${Date.now()}`;
          await conn.query(
            'INSERT INTO candidates (id, candidate_number, full_name, exam_center, status) VALUES (?, ?, ?, ?, ?)',
            [candId, data.number || '', data.name || '', data.center || '', 'registered']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, candidate_id: candId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/results')) {
      const conn = await pool.getConnection();
      const [results] = await conn.query('SELECT * FROM results ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
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
  server.listen(PORT, () => console.log(`Candidate Broadsheet API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
