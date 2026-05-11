const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4019;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'analytics_dashboard';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id VARCHAR(255) PRIMARY KEY, event_type VARCHAR(100),
        user_id VARCHAR(255), data JSON, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (event_type), INDEX idx_user (user_id), INDEX idx_time (timestamp)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS dashboards (
        id VARCHAR(255) PRIMARY KEY, dashboard_name VARCHAR(255),
        owner_id VARCHAR(255), config JSON, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_owner (owner_id)
      )
    `);
    conn.release();
    console.log('Analytics Dashboard DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'analytics-dashboard' }));
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
            'INSERT INTO analytics_events (id, event_type, user_id, data) VALUES (?, ?, ?, ?)',
            [eventId, data.type || '', data.user_id || '', JSON.stringify(data.data || {})]
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

    if (req.method === 'GET' && req.url.startsWith('/api/events')) {
      const conn = await pool.getConnection();
      const [events] = await conn.query('SELECT * FROM analytics_events ORDER BY timestamp DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(events));
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
  server.listen(PORT, () => console.log(`Analytics Dashboard API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
