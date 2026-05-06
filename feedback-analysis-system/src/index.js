const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4043;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'feedback_system';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS surveys (
        id VARCHAR(255) PRIMARY KEY, survey_title VARCHAR(255),
        survey_type VARCHAR(100), target_audience VARCHAR(255),
        status VARCHAR(50), response_count INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (survey_type), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id VARCHAR(255) PRIMARY KEY, survey_id VARCHAR(255),
        respondent_id VARCHAR(255), response_data JSON,
        sentiment_score DECIMAL(3,2), submitted_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (survey_id) REFERENCES surveys(id),
        INDEX idx_survey (survey_id), INDEX idx_date (submitted_date)
      )
    `);
    conn.release();
    console.log('Feedback System DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'feedback-system' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/survey') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const surveyId = `srv_${Date.now()}`;
          await conn.query(
            'INSERT INTO surveys (id, survey_title, survey_type, target_audience, status) VALUES (?, ?, ?, ?, ?)',
            [surveyId, data.title || '', data.type || '', data.audience || '', 'active']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, survey_id: surveyId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/responses')) {
      const conn = await pool.getConnection();
      const [responses] = await conn.query('SELECT * FROM responses ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responses));
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
  server.listen(PORT, () => console.log(`Feedback System API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
