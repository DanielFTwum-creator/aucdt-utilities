import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4057;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'research_portal';

let pool;

async function initDB() {
  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS research_papers (
      id VARCHAR(255) PRIMARY KEY,
      paper_title VARCHAR(500),
      author_names TEXT,
      publication_date DATE,
      research_area VARCHAR(255),
      abstract TEXT,
      document_url VARCHAR(500),
      citation_count INT,
      approval_status VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS citations (
      id VARCHAR(255) PRIMARY KEY,
      paper_id VARCHAR(255),
      citing_paper_title VARCHAR(500),
      citation_date DATE,
      citation_impact VARCHAR(50),
      journal_name VARCHAR(255),
      citation_format VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (paper_id) REFERENCES research_papers(id)
    )
  `);
  conn.release();
  console.log('Research Portal DB initialized');
}

async function handleRequest(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', service: 'research-portal' }));
  } else if (req.url === '/api/paper' && req.method === 'POST') {
    const paperId = `ppr_${Date.now()}`;
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO research_papers (id, paper_title, research_area, approval_status) VALUES (?, ?, ?, ?)', 
      [paperId, 'Research Paper Title', 'Computer Science', 'submitted']);
    conn.release();
    res.writeHead(201);
    res.end(JSON.stringify({ id: paperId }));
  } else if (req.url === '/api/citations' && req.method === 'GET') {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM citations ORDER BY created_at DESC LIMIT 100');
    conn.release();
    res.writeHead(200);
    res.end(JSON.stringify(rows));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
}

async function start() {
  await initDB();
  http.createServer(handleRequest).listen(PORT, () => {
    console.log(`Research Portal running on port ${PORT}`);
  });
}

start().catch(console.error);
