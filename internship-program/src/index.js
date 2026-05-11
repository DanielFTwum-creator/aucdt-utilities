import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4058;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'apppass';
const DB_NAME = process.env.DB_NAME || 'internship_program';

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
    CREATE TABLE IF NOT EXISTS internships (
      id VARCHAR(255) PRIMARY KEY,
      internship_title VARCHAR(255),
      company_name VARCHAR(255),
      location VARCHAR(255),
      start_date DATE,
      end_date DATE,
      duration_weeks INT,
      stipend DECIMAL(10,2),
      requirements TEXT,
      status VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS intern_positions (
      id VARCHAR(255) PRIMARY KEY,
      internship_id VARCHAR(255),
      intern_name VARCHAR(255),
      university VARCHAR(255),
      position_start_date DATE,
      position_end_date DATE,
      department VARCHAR(100),
      supervisor_name VARCHAR(255),
      performance_rating DECIMAL(3,2),
      position_status VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (internship_id) REFERENCES internships(id)
    )
  `);
  conn.release();
  console.log('Internship Program DB initialized');
}

async function handleRequest(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', service: 'internship-program' }));
  } else if (req.url === '/api/internship' && req.method === 'POST') {
    const internshipId = `int_${Date.now()}`;
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO internships (id, internship_title, company_name, status) VALUES (?, ?, ?, ?)', 
      [internshipId, 'Software Engineer Intern', 'TechCorp', 'active']);
    conn.release();
    res.writeHead(201);
    res.end(JSON.stringify({ id: internshipId }));
  } else if (req.url === '/api/positions' && req.method === 'GET') {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM intern_positions ORDER BY created_at DESC LIMIT 100');
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
    console.log(`Internship Program running on port ${PORT}`);
  });
}

start().catch(console.error);
