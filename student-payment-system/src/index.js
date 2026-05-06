import { AuthGate } from './AuthGate';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4059;

app.use(cors());
app.use(express.json());

let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppass',
    database: process.env.DB_NAME || 'student_payment',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id VARCHAR(255) PRIMARY KEY,
      student_id VARCHAR(255),
      student_name VARCHAR(255),
      amount DECIMAL(10,2),
      payment_date DATE,
      semester VARCHAR(50),
      payment_method VARCHAR(100),
      transaction_id VARCHAR(255),
      status VARCHAR(50) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id VARCHAR(255) PRIMARY KEY,
      payment_id VARCHAR(255),
      invoice_number VARCHAR(50),
      student_id VARCHAR(255),
      invoice_date DATE,
      due_date DATE,
      total_amount DECIMAL(10,2),
      amount_paid DECIMAL(10,2) DEFAULT 0,
      balance_due DECIMAL(10,2),
      invoice_status VARCHAR(50) DEFAULT 'unpaid',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (payment_id) REFERENCES payments(id)
    )
  `);
  conn.release();
  console.log('Student Payment DB initialized');
}

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'student-payment-system' });
});

// --- Payments CRUD ---
app.get('/api/payments', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payments ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/payments/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const { student_id, student_name, amount, payment_date, semester, payment_method, transaction_id, status } = req.body;
    const id = `pay_${uuidv4()}`;
    await pool.query(
      'INSERT INTO payments (id, student_id, student_name, amount, payment_date, semester, payment_method, transaction_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, student_id, student_name, amount, payment_date, semester, payment_method, transaction_id, status || 'pending']
    );
    const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/payments/:id', async (req, res) => {
  try {
    const { student_id, student_name, amount, payment_date, semester, payment_method, transaction_id, status } = req.body;
    const [result] = await pool.query(
      'UPDATE payments SET student_id=?, student_name=?, amount=?, payment_date=?, semester=?, payment_method=?, transaction_id=?, status=? WHERE id=?',
      [student_id, student_name, amount, payment_date, semester, payment_method, transaction_id, status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/payments/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM payments WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Invoices CRUD ---
app.get('/api/invoices', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM invoices ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/invoices/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const { payment_id, invoice_number, student_id, invoice_date, due_date, total_amount, amount_paid, balance_due, invoice_status } = req.body;
    const id = `inv_${uuidv4()}`;
    await pool.query(
      'INSERT INTO invoices (id, payment_id, invoice_number, student_id, invoice_date, due_date, total_amount, amount_paid, balance_due, invoice_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, payment_id, invoice_number, student_id, invoice_date, due_date, total_amount, amount_paid || 0, balance_due, invoice_status || 'unpaid']
    );
    const [rows] = await pool.query('SELECT * FROM invoices WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/invoices/:id', async (req, res) => {
  try {
    const { payment_id, invoice_number, student_id, invoice_date, due_date, total_amount, amount_paid, balance_due, invoice_status } = req.body;
    const [result] = await pool.query(
      'UPDATE invoices SET payment_id=?, invoice_number=?, student_id=?, invoice_date=?, due_date=?, total_amount=?, amount_paid=?, balance_due=?, invoice_status=? WHERE id=?',
      [payment_id, invoice_number, student_id, invoice_date, due_date, total_amount, amount_paid, balance_due, invoice_status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/invoices/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM invoices WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  await initDB();
  app.listen(PORT, () => console.log(`Student Payment System API running on port ${PORT}`));
}

start().catch(err => { console.error('Startup error:', err); process.exit(1); });
