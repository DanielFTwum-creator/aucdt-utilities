import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4036;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'workshop_portal';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS workshops (
        id VARCHAR(255) PRIMARY KEY, title VARCHAR(255),
        facilitator VARCHAR(255), date_start DATE, date_end DATE,
        location VARCHAR(255), capacity INT, registered_count INT,
        status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status), INDEX idx_date (date_start)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id VARCHAR(255) PRIMARY KEY, workshop_id VARCHAR(255),
        participant_name VARCHAR(255), email VARCHAR(255),
        phone VARCHAR(20), registration_date DATETIME,
        completion_status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workshop_id) REFERENCES workshops(id),
        INDEX idx_workshop (workshop_id), INDEX idx_status (completion_status)
      )
    `);
    conn.release();
    console.log('Workshop Portal DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'workshop-portal' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/workshop') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const workshopId = `ws_${Date.now()}`;
          await conn.query(
            'INSERT INTO workshops (id, title, facilitator, date_start, date_end, location, capacity, registered_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [workshopId, data.title || '', data.facilitator || '', data.start || '', data.end || '', data.location || '', data.capacity || 0, 0, 'scheduled']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, workshop_id: workshopId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/registrations')) {
      const conn = await pool.getConnection();
      const [regs] = await conn.query('SELECT * FROM registrations ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(regs));
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
  server.listen(PORT, () => console.log(`Workshop Portal API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
