import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4021;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'timetable_mgmt';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id VARCHAR(255) PRIMARY KEY, module_code VARCHAR(50),
        module_name VARCHAR(255), lecturer VARCHAR(255),
        day_of_week VARCHAR(20), start_time TIME, end_time TIME,
        room_number VARCHAR(50), capacity INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS schedule_conflicts (
        id VARCHAR(255) PRIMARY KEY, schedule_id_1 VARCHAR(255),
        schedule_id_2 VARCHAR(255), conflict_type VARCHAR(100),
        severity VARCHAR(50), resolved BOOLEAN DEFAULT false,
        resolved_at DATETIME
      )
    `);
    conn.release();
    console.log('Timetable Management DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'timetable-management' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/schedule') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const schedId = `sched_${Date.now()}`;
          await conn.query(
            'INSERT INTO schedules (id, module_code, module_name, lecturer, day_of_week, start_time, end_time, room_number, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [schedId, data.module_code || '', data.module_name || '', data.lecturer || '', data.day || '', data.start || '', data.end || '', data.room || '', data.capacity || 50]
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, schedule_id: schedId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/schedules')) {
      const conn = await pool.getConnection();
      const [schedules] = await conn.query('SELECT * FROM schedules ORDER BY day_of_week, start_time LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(schedules));
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
  server.listen(PORT, () => console.log(`Timetable Management API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
