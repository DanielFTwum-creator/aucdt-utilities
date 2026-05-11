const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4022;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'counselor_pro';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS counselors (
        id VARCHAR(255) PRIMARY KEY, full_name VARCHAR(255),
        specialization VARCHAR(255), license_number VARCHAR(100),
        availability_status VARCHAR(50), email VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY, student_id VARCHAR(255),
        counselor_id VARCHAR(255), session_date DATETIME,
        duration_minutes INT, session_notes TEXT,
        outcome VARCHAR(255), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (counselor_id) REFERENCES counselors(id),
        INDEX idx_counselor (counselor_id), INDEX idx_student (student_id)
      )
    `);
    conn.release();
    console.log('Counselor Pro DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'counselor-pro' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/session') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const sessionId = `sess_${Date.now()}`;
          await conn.query(
            'INSERT INTO sessions (id, student_id, counselor_id, session_date, duration_minutes, session_notes, outcome) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [sessionId, data.student_id || '', data.counselor_id || '', data.date || '', data.duration || 60, data.notes || '', data.outcome || '']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, session_id: sessionId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/sessions')) {
      const conn = await pool.getConnection();
      const [sessions] = await conn.query('SELECT * FROM sessions ORDER BY session_date DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sessions));
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
  server.listen(PORT, () => console.log(`Counselor Pro API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
