import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4012;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'assessment_platform';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id VARCHAR(255) PRIMARY KEY, assessment_name VARCHAR(255),
        assessment_type VARCHAR(100), max_score INT,
        created_by VARCHAR(255), created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS assessment_results (
        id VARCHAR(255) PRIMARY KEY, assessment_id VARCHAR(255),
        student_id VARCHAR(255), score INT, percentage DECIMAL(5,2),
        status ENUM('passed', 'failed', 'pending') DEFAULT 'pending',
        taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assessment_id) REFERENCES assessments(id),
        INDEX idx_assessment (assessment_id), INDEX idx_student (student_id)
      )
    `);
    conn.release();
    console.log('Assessment Platform DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'assessment-platform' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/assessment') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const assId = `ass_${Date.now()}`;
          await conn.query(
            'INSERT INTO assessments (id, assessment_name, assessment_type, max_score, created_by) VALUES (?, ?, ?, ?, ?)',
            [assId, data.name || '', data.type || '', data.max_score || 100, data.created_by || '']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, assessment_id: assId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/submit-result') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const resultId = `res_${Date.now()}`;
          const pct = ((data.score / data.max_score) * 100).toFixed(2);
          await conn.query(
            'INSERT INTO assessment_results (id, assessment_id, student_id, score, percentage, status) VALUES (?, ?, ?, ?, ?, ?)',
            [resultId, data.assessment_id || '', data.student_id || '', data.score || 0, pct, data.score >= 50 ? 'passed' : 'failed']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, result_id: resultId, passed: data.score >= 50 }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/results')) {
      const conn = await pool.getConnection();
      const [results] = await conn.query('SELECT * FROM assessment_results ORDER BY taken_at DESC LIMIT 100');
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
  server.listen(PORT, () => console.log(`Assessment Platform API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
