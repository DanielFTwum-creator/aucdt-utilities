const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4024;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'applicant_dashboard';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS applicants (
        id VARCHAR(255) PRIMARY KEY, full_name VARCHAR(255),
        email VARCHAR(255), phone VARCHAR(20), program_applied VARCHAR(255),
        application_date DATETIME, status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status), INDEX idx_email (email)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(255) PRIMARY KEY, applicant_id VARCHAR(255),
        application_number VARCHAR(100), gpa DECIMAL(3,2),
        test_score INT, documents_submitted BOOLEAN,
        admission_decision VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (applicant_id) REFERENCES applicants(id),
        INDEX idx_applicant (applicant_id), INDEX idx_decision (admission_decision)
      )
    `);
    conn.release();
    console.log('Applicant Dashboard DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'applicant-dashboard' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/applicant') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const appId = `app_${Date.now()}`;
          await conn.query(
            'INSERT INTO applicants (id, full_name, email, phone, program_applied, status) VALUES (?, ?, ?, ?, ?, ?)',
            [appId, data.name || '', data.email || '', data.phone || '', data.program || '', 'submitted']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, applicant_id: appId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/applications')) {
      const conn = await pool.getConnection();
      const [apps] = await conn.query('SELECT * FROM applications ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(apps));
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
  server.listen(PORT, () => console.log(`Applicant Dashboard API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
