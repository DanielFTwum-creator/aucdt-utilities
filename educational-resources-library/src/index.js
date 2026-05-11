const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4044;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'resource_library';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id VARCHAR(255) PRIMARY KEY, resource_title VARCHAR(255),
        resource_type VARCHAR(100), subject VARCHAR(255),
        file_size INT, download_count INT,
        status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (resource_type), INDEX idx_subject (subject), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS resource_reviews (
        id VARCHAR(255) PRIMARY KEY, resource_id VARCHAR(255),
        reviewer_name VARCHAR(255), rating INT,
        review_text TEXT, helpfulness DECIMAL(3,2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resource_id) REFERENCES resources(id),
        INDEX idx_resource (resource_id), INDEX idx_rating (rating)
      )
    `);
    conn.release();
    console.log('Resource Library DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'resource-library' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/resource') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const resourceId = `res_${Date.now()}`;
          await conn.query(
            'INSERT INTO resources (id, resource_title, resource_type, subject, file_size, status) VALUES (?, ?, ?, ?, ?, ?)',
            [resourceId, data.title || '', data.type || '', data.subject || '', data.size || 0, 'published']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, resource_id: resourceId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/reviews')) {
      const conn = await pool.getConnection();
      const [reviews] = await conn.query('SELECT * FROM resource_reviews ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(reviews));
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
  server.listen(PORT, () => console.log(`Resource Library API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
