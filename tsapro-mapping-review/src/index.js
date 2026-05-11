import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4011;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'tsapro_mapping';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS mappings (
        id VARCHAR(255) PRIMARY KEY, source_timetable VARCHAR(255),
        target_timetable VARCHAR(255), mapping_status VARCHAR(50),
        reviewed_by VARCHAR(255), review_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS mapping_conflicts (
        id VARCHAR(255) PRIMARY KEY, mapping_id VARCHAR(255),
        conflict_type VARCHAR(100), conflict_detail TEXT,
        resolution_status VARCHAR(50), resolved_at DATETIME,
        FOREIGN KEY (mapping_id) REFERENCES mappings(id),
        INDEX idx_mapping (mapping_id)
      )
    `);
    conn.release();
    console.log('TSAPro Mapping DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'tsapro-mapping' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/mapping') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const mapId = `map_${Date.now()}`;
          await conn.query(
            'INSERT INTO mappings (id, source_timetable, target_timetable, mapping_status) VALUES (?, ?, ?, ?)',
            [mapId, data.source || '', data.target || '', data.status || 'pending']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, mapping_id: mapId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/mappings')) {
      const conn = await pool.getConnection();
      const [mappings] = await conn.query('SELECT * FROM mappings ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(mappings));
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
  server.listen(PORT, () => console.log(`TSAPro Mapping Review API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
