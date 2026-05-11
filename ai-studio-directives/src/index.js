const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4039;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'ai_directives';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS directives (
        id VARCHAR(255) PRIMARY KEY, directive_name VARCHAR(255),
        prompt_text TEXT, category VARCHAR(100),
        usage_count INT, effectiveness_score DECIMAL(3,2),
        status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS executions (
        id VARCHAR(255) PRIMARY KEY, directive_id VARCHAR(255),
        execution_date DATETIME, input_tokens INT,
        output_tokens INT, model_used VARCHAR(100),
        result_quality VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (directive_id) REFERENCES directives(id),
        INDEX idx_directive (directive_id), INDEX idx_quality (result_quality)
      )
    `);
    conn.release();
    console.log('AI Directives DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'ai-directives' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/directive') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const directiveId = `dir_${Date.now()}`;
          await conn.query(
            'INSERT INTO directives (id, directive_name, prompt_text, category, usage_count, status) VALUES (?, ?, ?, ?, ?, ?)',
            [directiveId, data.name || '', data.prompt || '', data.category || '', 0, 'active']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, directive_id: directiveId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/executions')) {
      const conn = await pool.getConnection();
      const [execs] = await conn.query('SELECT * FROM executions ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(execs));
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
  server.listen(PORT, () => console.log(`AI Directives API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
