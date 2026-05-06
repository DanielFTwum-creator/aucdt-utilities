import { AuthGate } from './AuthGate';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 4053;

const app = express();
app.use(cors());
app.use(express.json());


// Serve admin UI from public directory
app.use(express.static(path.join(__dirname, '../public')));
let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppass',
    database: process.env.DB_NAME || 'accommodation_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS hostels (
      id VARCHAR(255) PRIMARY KEY,
      hostel_name VARCHAR(255),
      location VARCHAR(255),
      total_rooms INT,
      occupied_rooms INT,
      gender_type VARCHAR(50),
      warden_name VARCHAR(255),
      status VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS room_assignments (
      id VARCHAR(255) PRIMARY KEY,
      hostel_id VARCHAR(255),
      room_number VARCHAR(50),
      student_id VARCHAR(255),
      student_name VARCHAR(255),
      check_in_date DATE,
      check_out_date DATE,
      room_condition VARCHAR(50),
      assignment_status VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hostel_id) REFERENCES hostels(id)
    )
  `);
  conn.release();
  console.log('Accommodation Management DB initialized');
}

// Health

// Serve admin UI at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'accommodation-management' });
});

// --- Hostels CRUD ---
app.get('/api/hostels', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM hostels ORDER BY created_at DESC');
  res.json(rows);
});

app.post('/api/hostels', async (req, res) => {
  const { hostel_name, location, total_rooms, occupied_rooms, gender_type, warden_name, status } = req.body;
  const id = `hst_${uuidv4()}`;
  await pool.query(
    'INSERT INTO hostels (id, hostel_name, location, total_rooms, occupied_rooms, gender_type, warden_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, hostel_name, location, total_rooms || 0, occupied_rooms || 0, gender_type || 'mixed', warden_name, status || 'active']
  );
  res.status(201).json({ id });
});

app.put('/api/hostels/:id', async (req, res) => {
  const { hostel_name, location, total_rooms, occupied_rooms, gender_type, warden_name, status } = req.body;
  await pool.query(
    'UPDATE hostels SET hostel_name=?, location=?, total_rooms=?, occupied_rooms=?, gender_type=?, warden_name=?, status=? WHERE id=?',
    [hostel_name, location, total_rooms, occupied_rooms, gender_type, warden_name, status, req.params.id]
  );
  res.json({ updated: true });
});

app.delete('/api/hostels/:id', async (req, res) => {
  await pool.query('DELETE FROM room_assignments WHERE hostel_id=?', [req.params.id]);
  await pool.query('DELETE FROM hostels WHERE id=?', [req.params.id]);
  res.json({ deleted: true });
});

// --- Room Assignments CRUD ---
app.get('/api/room-assignments', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM room_assignments ORDER BY created_at DESC');
  res.json(rows);
});

app.post('/api/room-assignments', async (req, res) => {
  const { hostel_id, room_number, student_id, student_name, check_in_date, check_out_date, room_condition, assignment_status } = req.body;
  const id = `asgn_${uuidv4()}`;
  await pool.query(
    'INSERT INTO room_assignments (id, hostel_id, room_number, student_id, student_name, check_in_date, check_out_date, room_condition, assignment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, hostel_id, room_number, student_id, student_name, check_in_date || null, check_out_date || null, room_condition || 'good', assignment_status || 'active']
  );
  res.status(201).json({ id });
});

app.put('/api/room-assignments/:id', async (req, res) => {
  const { hostel_id, room_number, student_id, student_name, check_in_date, check_out_date, room_condition, assignment_status } = req.body;
  await pool.query(
    'UPDATE room_assignments SET hostel_id=?, room_number=?, student_id=?, student_name=?, check_in_date=?, check_out_date=?, room_condition=?, assignment_status=? WHERE id=?',
    [hostel_id, room_number, student_id, student_name, check_in_date || null, check_out_date || null, room_condition, assignment_status, req.params.id]
  );
  res.json({ updated: true });
});

app.delete('/api/room-assignments/:id', async (req, res) => {
  await pool.query('DELETE FROM room_assignments WHERE id=?', [req.params.id]);
  res.json({ deleted: true });
});

async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Accommodation Management API running on port ${PORT}`);
  });
}

start().catch(console.error);
