const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4013;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'eligibility';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS criteria (
        id VARCHAR(255) PRIMARY KEY, criterion_name VARCHAR(255),
        criterion_type VARCHAR(100), requirement TEXT,
        is_mandatory BOOLEAN DEFAULT true, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS eligibility_checks (
        id VARCHAR(255) PRIMARY KEY, student_id VARCHAR(255),
        program_id VARCHAR(255), eligibility_status VARCHAR(50),
        criteria_met INT, total_criteria INT, remarks TEXT,
        checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_student (student_id)
      )
    `);
    conn.release();
    console.log('Eligibility Checker DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'eligibility-checker' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/check') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const checkId = `elig_${Date.now()}`;
          const met = Math.floor(Math.random() * 5) + 1;
          const total = 5;
          await conn.query(
            'INSERT INTO eligibility_checks (id, student_id, program_id, eligibility_status, criteria_met, total_criteria) VALUES (?, ?, ?, ?, ?, ?)',
            [checkId, data.student_id || '', data.program_id || '', met >= 4 ? 'eligible' : 'ineligible', met, total]
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, check_id: checkId, eligible: met >= 4 }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/criteria')) {
      const conn = await pool.getConnection();
      const [criteria] = await conn.query('SELECT * FROM criteria LIMIT 50');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(criteria));
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
  server.listen(PORT, () => console.log(`Eligibility Checker API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
