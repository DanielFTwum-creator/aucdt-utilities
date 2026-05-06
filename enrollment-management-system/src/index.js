const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4029;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'enrollment_mgmt';

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
        id VARCHAR(255) PRIMARY KEY, matric_number VARCHAR(100),
        full_name VARCHAR(255), program VARCHAR(100),
        admission_status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_matric (matric_number), INDEX idx_status (admission_status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS enrollment_records (
        id VARCHAR(255) PRIMARY KEY, student_id VARCHAR(255),
        academic_year VARCHAR(20), semester VARCHAR(20),
        courses_enrolled INT, gpa DECIMAL(3,2),
        enrollment_status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        INDEX idx_student (student_id), INDEX idx_year (academic_year)
      )
    `);
    conn.release();
    console.log('Enrollment Management DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'enrollment-management' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/enroll') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const enrollId = `enr_${Date.now()}`;
          const studId = `std_${Date.now()}`;
          await conn.query(
            'INSERT INTO students (id, matric_number, full_name, program, admission_status) VALUES (?, ?, ?, ?, ?)',
            [studId, data.matric || '', data.name || '', data.program || '', 'active']
          );
          await conn.query(
            'INSERT INTO enrollment_records (id, student_id, academic_year, semester, courses_enrolled, enrollment_status) VALUES (?, ?, ?, ?, ?, ?)',
            [enrollId, studId, new Date().getFullYear().toString(), '1', 0, 'active']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, enrollment_id: enrollId, student_id: studId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/enrollments')) {
      const conn = await pool.getConnection();
      const [enrollments] = await conn.query('SELECT * FROM enrollment_records ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(enrollments));
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
  server.listen(PORT, () => console.log(`Enrollment Management API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
