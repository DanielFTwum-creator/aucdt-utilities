import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4017;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'brainiac_challenge';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS challenges (
        id VARCHAR(255) PRIMARY KEY, challenge_name VARCHAR(255),
        difficulty VARCHAR(50), category VARCHAR(100), points INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS challenge_submissions (
        id VARCHAR(255) PRIMARY KEY, challenge_id VARCHAR(255),
        student_id VARCHAR(255), score INT, is_correct BOOLEAN,
        time_taken INT, submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id),
        INDEX idx_student (student_id), INDEX idx_challenge (challenge_id)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id VARCHAR(255) PRIMARY KEY, student_id VARCHAR(255),
        total_points INT, challenges_completed INT, ranking INT,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_student (student_id)
      )
    `);
    conn.release();
    console.log('Brainiac Challenge DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'brainiac-challenge' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/submit') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const subId = `sub_${Date.now()}`;
          await conn.query(
            'INSERT INTO challenge_submissions (id, challenge_id, student_id, score, is_correct, time_taken) VALUES (?, ?, ?, ?, ?, ?)',
            [subId, data.challenge_id || '', data.student_id || '', data.score || 0, data.is_correct || false, data.time_taken || 0]
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, submission_id: subId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/leaderboard')) {
      const conn = await pool.getConnection();
      const [leaders] = await conn.query('SELECT * FROM leaderboard ORDER BY total_points DESC, ranking ASC LIMIT 50');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(leaders));
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
  server.listen(PORT, () => console.log(`Brainiac Challenge API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
