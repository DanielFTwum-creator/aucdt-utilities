const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4018;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'lead_generation';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(255) PRIMARY KEY, full_name VARCHAR(255),
        email VARCHAR(255), phone VARCHAR(20), source VARCHAR(100),
        lead_score INT DEFAULT 0, status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status), INDEX idx_email (email)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS lead_interactions (
        id VARCHAR(255) PRIMARY KEY, lead_id VARCHAR(255),
        interaction_type VARCHAR(100), notes TEXT,
        interaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads(id),
        INDEX idx_lead (lead_id)
      )
    `);
    conn.release();
    console.log('Lead Generation DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'lead-generator' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/lead') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const leadId = `lead_${Date.now()}`;
          await conn.query(
            'INSERT INTO leads (id, full_name, email, phone, source, lead_score, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [leadId, data.name || '', data.email || '', data.phone || '', data.source || '', 0, 'new']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, lead_id: leadId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/leads')) {
      const conn = await pool.getConnection();
      const [leads] = await conn.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(leads));
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
  server.listen(PORT, () => console.log(`Lead Generator API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
