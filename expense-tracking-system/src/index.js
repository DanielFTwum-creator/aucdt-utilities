const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4028;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'expense_tracker';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(255) PRIMARY KEY, category VARCHAR(100),
        amount DECIMAL(10,2), description VARCHAR(255),
        expense_date DATE, status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS expense_reports (
        id VARCHAR(255) PRIMARY KEY, period VARCHAR(50),
        total_amount DECIMAL(12,2), total_items INT,
        approved_amount DECIMAL(12,2), approval_status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_period (period), INDEX idx_status (approval_status)
      )
    `);
    conn.release();
    console.log('Expense Tracker DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'expense-tracker' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/expense') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const expId = `exp_${Date.now()}`;
          await conn.query(
            'INSERT INTO expenses (id, category, amount, description, expense_date, status) VALUES (?, ?, ?, ?, ?, ?)',
            [expId, data.category || '', data.amount || 0, data.desc || '', data.date || new Date().toISOString().split('T')[0], 'pending']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, expense_id: expId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/reports')) {
      const conn = await pool.getConnection();
      const [reports] = await conn.query('SELECT * FROM expense_reports ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(reports));
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
  server.listen(PORT, () => console.log(`Expense Tracker API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
