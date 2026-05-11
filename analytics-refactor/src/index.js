const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4006;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'analytics';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS metrics (
        id VARCHAR(255) PRIMARY KEY, metric_name VARCHAR(255),
        metric_value DECIMAL(15,2), dimension_1 VARCHAR(255),
        dimension_2 VARCHAR(255), recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id VARCHAR(255) PRIMARY KEY, report_name VARCHAR(255),
        metrics_summary TEXT, generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    conn.release();
    console.log('Analytics DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'analytics' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/metric') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const metricId = `metric_${Date.now()}`;
          await conn.query(
            'INSERT INTO metrics (id, metric_name, metric_value, dimension_1, dimension_2) VALUES (?, ?, ?, ?, ?)',
            [metricId, data.name || '', data.value || 0, data.dim1 || '', data.dim2 || '']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, metric_id: metricId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/metrics')) {
      const conn = await pool.getConnection();
      const [metrics] = await conn.query('SELECT * FROM metrics ORDER BY recorded_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(metrics));
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
  server.listen(PORT, () => console.log(`Analytics API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
