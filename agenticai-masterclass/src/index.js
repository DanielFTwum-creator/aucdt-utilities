import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4041;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'training_platform';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(255) PRIMARY KEY, course_name VARCHAR(255),
        instructor VARCHAR(255), duration_hours INT,
        difficulty_level VARCHAR(50), enrollment_count INT,
        status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_level (difficulty_level), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id VARCHAR(255) PRIMARY KEY, course_id VARCHAR(255),
        learner_name VARCHAR(255), progress_percent INT,
        completion_date DATE, certificate_issued BOOLEAN,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id),
        INDEX idx_course (course_id), INDEX idx_progress (progress_percent)
      )
    `);
    conn.release();
    console.log('Training Platform DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'training-platform' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/course') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const courseId = `crs_${Date.now()}`;
          await conn.query(
            'INSERT INTO courses (id, course_name, instructor, duration_hours, difficulty_level, enrollment_count, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [courseId, data.name || '', data.instructor || '', data.hours || 0, data.level || '', 0, 'published']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, course_id: courseId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/enrollments')) {
      const conn = await pool.getConnection();
      const [enr] = await conn.query('SELECT * FROM enrollments ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(enr));
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
  server.listen(PORT, () => console.log(`Training Platform API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
