const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4047;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'notification_service';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(255) PRIMARY KEY, recipient_id VARCHAR(255),
        notification_type VARCHAR(100), title VARCHAR(255),
        message TEXT, priority VARCHAR(50),
        read_status BOOLEAN, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_recipient (recipient_id), INDEX idx_type (notification_type), INDEX idx_priority (priority)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS notification_channels (
        id VARCHAR(255) PRIMARY KEY, notification_id VARCHAR(255),
        channel_type VARCHAR(100), delivery_status VARCHAR(50),
        delivery_timestamp DATETIME, response_status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (notification_id) REFERENCES notifications(id),
        INDEX idx_notification (notification_id), INDEX idx_channel (channel_type), INDEX idx_status (delivery_status)
      )
    `);
    conn.release();
    console.log('Notification Service DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'notification-service' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/notify') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const notifyId = `not_${Date.now()}`;
          await conn.query(
            'INSERT INTO notifications (id, recipient_id, notification_type, title, message, priority) VALUES (?, ?, ?, ?, ?, ?)',
            [notifyId, data.recipient || '', data.type || '', data.title || '', data.message || '', data.priority || 'normal']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, notification_id: notifyId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/notifications')) {
      const conn = await pool.getConnection();
      const [notifs] = await conn.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(notifs));
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
  server.listen(PORT, () => console.log(`Notification Service API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
