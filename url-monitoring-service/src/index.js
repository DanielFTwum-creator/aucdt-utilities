const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4035;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'url_monitoring';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS monitored_urls (
        id VARCHAR(255) PRIMARY KEY, url VARCHAR(500),
        service_name VARCHAR(255), check_interval_seconds INT,
        status VARCHAR(50), last_check DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status), INDEX idx_service (service_name)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS monitoring_alerts (
        id VARCHAR(255) PRIMARY KEY, url_id VARCHAR(255),
        alert_type VARCHAR(100), response_code INT,
        response_time_ms INT, alert_message TEXT,
        severity VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (url_id) REFERENCES monitored_urls(id),
        INDEX idx_url (url_id), INDEX idx_severity (severity)
      )
    `);
    conn.release();
    console.log('URL Monitoring DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'url-monitoring' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/monitor') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const monitorId = `mon_${Date.now()}`;
          await conn.query(
            'INSERT INTO monitored_urls (id, url, service_name, check_interval_seconds, status, last_check) VALUES (?, ?, ?, ?, ?, ?)',
            [monitorId, data.url || '', data.service || '', data.interval || 300, 'active', new Date().toISOString()]
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, monitor_id: monitorId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/alerts')) {
      const conn = await pool.getConnection();
      const [alerts] = await conn.query('SELECT * FROM monitoring_alerts ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(alerts));
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
  server.listen(PORT, () => console.log(`URL Monitoring API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
