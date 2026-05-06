const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4015;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'academic_performance';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(255) PRIMARY KEY, full_name VARCHAR(255),
        student_id VARCHAR(100) UNIQUE, program VARCHAR(255),
        enrollment_date DATE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS grades (
        id VARCHAR(255) PRIMARY KEY, student_id VARCHAR(255),
        course_code VARCHAR(50), course_name VARCHAR(255),
        grade VARCHAR(5), points DECIMAL(3,1), semester VARCHAR(20),
        achieved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        INDEX idx_student (student_id), INDEX idx_course (course_code)
      )
    `);
    conn.release();
    console.log('Academic Performance DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'academic-performance' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/grades') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const gradeId = `grade_${Date.now()}`;
          const points = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0 }[data.grade] || 0;
          await conn.query(
            'INSERT INTO grades (id, student_id, course_code, course_name, grade, points, semester) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [gradeId, data.student_id || '', data.course_code || '', data.course_name || '', data.grade || 'F', points, data.semester || '']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, grade_id: gradeId, gpa: points }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/transcript')) {
      const conn = await pool.getConnection();
      const [grades] = await conn.query('SELECT * FROM grades ORDER BY achieved_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(grades));
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
  server.listen(PORT, () => console.log(`Academic Performance API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
