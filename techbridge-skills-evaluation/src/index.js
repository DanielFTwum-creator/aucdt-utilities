const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4014;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'skills_evaluation';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS competencies (
        id VARCHAR(255) PRIMARY KEY, competency_name VARCHAR(255),
        competency_category VARCHAR(100), proficiency_levels INT DEFAULT 5,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS skill_assessments (
        id VARCHAR(255) PRIMARY KEY, student_id VARCHAR(255),
        competency_id VARCHAR(255), proficiency_level INT,
        assessment_score DECIMAL(5,2), feedback TEXT,
        assessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (competency_id) REFERENCES competencies(id),
        INDEX idx_student (student_id), INDEX idx_competency (competency_id)
      )
    `);
    conn.release();
    console.log('Skills Evaluation DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'skills-evaluation' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/assessment') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const assessId = `skill_${Date.now()}`;
          await conn.query(
            'INSERT INTO skill_assessments (id, student_id, competency_id, proficiency_level, assessment_score, feedback) VALUES (?, ?, ?, ?, ?, ?)',
            [assessId, data.student_id || '', data.competency_id || '', data.level || 3, data.score || 0, data.feedback || '']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, assessment_id: assessId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/competencies')) {
      const conn = await pool.getConnection();
      const [skills] = await conn.query('SELECT * FROM competencies LIMIT 50');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(skills));
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
  server.listen(PORT, () => console.log(`Skills Evaluation API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });
