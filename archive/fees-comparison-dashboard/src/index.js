import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4020;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'fees_comparison';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS institutions (
        id VARCHAR(255) PRIMARY KEY, institution_name VARCHAR(255),
        country VARCHAR(100), established_year INT, website_url VARCHAR(500),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS fees_structure (
        id VARCHAR(255) PRIMARY KEY, institution_id VARCHAR(255),
        program_name VARCHAR(255), year INT, tuition_fee DECIMAL(12,2),
        accommodation_fee DECIMAL(12,2), other_fees DECIMAL(12,2),
        currency VARCHAR(3), academic_year VARCHAR(20),
        FOREIGN KEY (institution_id) REFERENCES institutions(id),
        INDEX idx_institution (institution_id), INDEX idx_program (program_name)
      )
    `);
    conn.release();
    console.log('Fees Comparison DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'fees-comparison' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/institution') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const instId = `inst_${Date.now()}`;
          await conn.query(
            'INSERT INTO institutions (id, institution_name, country, established_year, website_url) VALUES (?, ?, ?, ?, ?)',
            [instId, data.name || '', data.country || '', data.year || 2000, data.website || '']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, institution_id: instId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/fees')) {
      const conn = await pool.getConnection();
      const [fees] = await conn.query('SELECT * FROM fees_structure ORDER BY academic_year DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(fees));
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
  server.listen(PORT, () => console.log(`Fees Comparison API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
