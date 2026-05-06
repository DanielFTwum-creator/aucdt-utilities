import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4031;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'ai_code_reviewer';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS code_reviews (
        id VARCHAR(255) PRIMARY KEY, repository_name VARCHAR(255),
        branch_name VARCHAR(255), reviewer_ai VARCHAR(100),
        review_score INT, review_status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_repo (repository_name), INDEX idx_status (review_status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS review_findings (
        id VARCHAR(255) PRIMARY KEY, review_id VARCHAR(255),
        finding_type VARCHAR(100), severity VARCHAR(50),
        line_number INT, recommendation TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (review_id) REFERENCES code_reviews(id),
        INDEX idx_review (review_id), INDEX idx_severity (severity)
      )
    `);
    conn.release();
    console.log('AI Code Reviewer DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'ai-code-reviewer' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/review') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const reviewId = `rev_${Date.now()}`;
          await conn.query(
            'INSERT INTO code_reviews (id, repository_name, branch_name, reviewer_ai, review_score, review_status) VALUES (?, ?, ?, ?, ?, ?)',
            [reviewId, data.repo || '', data.branch || '', 'claude-haiku', 0, 'pending']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, review_id: reviewId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/findings')) {
      const conn = await pool.getConnection();
      const [findings] = await conn.query('SELECT * FROM review_findings ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(findings));
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
  server.listen(PORT, () => console.log(`AI Code Reviewer API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
