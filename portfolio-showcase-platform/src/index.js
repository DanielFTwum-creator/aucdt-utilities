const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4045;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'portfolio_system';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS portfolios (
        id VARCHAR(255) PRIMARY KEY, owner_name VARCHAR(255),
        owner_type VARCHAR(50), profile_url VARCHAR(500),
        bio TEXT, verified BOOLEAN,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_owner (owner_name), INDEX idx_verified (verified)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS portfolio_items (
        id VARCHAR(255) PRIMARY KEY, portfolio_id VARCHAR(255),
        item_title VARCHAR(255), item_description TEXT,
        item_media_url VARCHAR(500), category VARCHAR(100),
        views_count INT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios(id),
        INDEX idx_portfolio (portfolio_id), INDEX idx_category (category)
      )
    `);
    conn.release();
    console.log('Portfolio System DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'portfolio-system' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/portfolio') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const portfolioId = `port_${Date.now()}`;
          await conn.query(
            'INSERT INTO portfolios (id, owner_name, owner_type, bio, verified) VALUES (?, ?, ?, ?, ?)',
            [portfolioId, data.owner || '', data.type || '', data.bio || '', false]
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, portfolio_id: portfolioId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/items')) {
      const conn = await pool.getConnection();
      const [items] = await conn.query('SELECT * FROM portfolio_items ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(items));
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
  server.listen(PORT, () => console.log(`Portfolio System API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
