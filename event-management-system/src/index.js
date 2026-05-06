const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4046;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'event_management';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(255) PRIMARY KEY, event_name VARCHAR(255),
        event_type VARCHAR(100), event_date DATE,
        location VARCHAR(255), capacity INT,
        registered_attendees INT, status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (event_type), INDEX idx_date (event_date), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id VARCHAR(255) PRIMARY KEY, event_id VARCHAR(255),
        attendee_name VARCHAR(255), email VARCHAR(255),
        registration_date DATETIME, attendance_status VARCHAR(50),
        feedback_score INT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id),
        INDEX idx_event (event_id), INDEX idx_attendance (attendance_status)
      )
    `);
    conn.release();
    console.log('Event Management DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'event-management' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/event') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const eventId = `evt_${Date.now()}`;
          await conn.query(
            'INSERT INTO events (id, event_name, event_type, event_date, location, capacity, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [eventId, data.name || '', data.type || '', data.date || '', data.location || '', data.capacity || 0, 'scheduled']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, event_id: eventId }));
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
  server.listen(PORT, () => console.log(`Event Management API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
