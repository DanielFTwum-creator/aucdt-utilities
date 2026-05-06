const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4038;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'brand_guidelines';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS brand_assets (
        id VARCHAR(255) PRIMARY KEY, asset_name VARCHAR(255),
        asset_type VARCHAR(100), version VARCHAR(50),
        file_path VARCHAR(500), approval_status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (asset_type), INDEX idx_status (approval_status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS design_standards (
        id VARCHAR(255) PRIMARY KEY, standard_name VARCHAR(255),
        category VARCHAR(100), description TEXT,
        value VARCHAR(255), status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category), INDEX idx_status (status)
      )
    `);
    conn.release();
    console.log('Brand Guidelines DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'brand-guidelines' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/asset') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const assetId = `ba_${Date.now()}`;
          await conn.query(
            'INSERT INTO brand_assets (id, asset_name, asset_type, version, file_path, approval_status) VALUES (?, ?, ?, ?, ?, ?)',
            [assetId, data.name || '', data.type || '', data.version || '1.0', data.path || '', 'pending']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, asset_id: assetId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/standards')) {
      const conn = await pool.getConnection();
      const [standards] = await conn.query('SELECT * FROM design_standards ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(standards));
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
  server.listen(PORT, () => console.log(`Brand Guidelines API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
