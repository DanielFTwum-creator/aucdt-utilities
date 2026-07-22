import { Router } from 'express';
import db from './db.js';

const router = Router();

// GET /api/patients
router.get('/patients', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
    res.json(rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/patients
router.post('/patients', async (req, res) => {
  try {
    const { patient_code, full_name, patient_type, gender, age, class_or_dept, emergency_contact_name, emergency_contact_phone, allergies, chronic_conditions } = req.body;
    const [result]: any = await db.execute(
      'INSERT INTO patients (patient_code, full_name, patient_type, gender, age, class_or_dept, emergency_contact_name, emergency_contact_phone, allergies, chronic_conditions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [patient_code, full_name, patient_type, gender, age, class_or_dept, emergency_contact_name, emergency_contact_phone, allergies, chronic_conditions]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/visits
router.get('/visits', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.*, p.full_name as patient_name, p.patient_code
      FROM visits v
      LEFT JOIN patients p ON v.patient_id = p.id
      ORDER BY v.created_at DESC
    `);
    res.json(rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/visits
router.post('/visits', async (req, res) => {
  try {
    const { patient_id, temperature, blood_pressure, pulse_rate, symptoms, presenting_conditions, severity, treatment, medication_dispensed_id, medication_dispensed_qty, disposition, observed_bed_no, observation_end_time, notes, treated_by } = req.body;
    const [result]: any = await db.execute(
      'INSERT INTO visits (patient_id, temperature, blood_pressure, pulse_rate, symptoms, presenting_conditions, severity, treatment, medication_dispensed_id, medication_dispensed_qty, disposition, observed_bed_no, observation_end_time, notes, treated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [patient_id, temperature, blood_pressure, pulse_rate, symptoms, presenting_conditions, severity, treatment, medication_dispensed_id, medication_dispensed_qty, disposition, observed_bed_no, observation_end_time, notes, treated_by]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/medications
router.get('/medications', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM medications ORDER BY name ASC');
    res.json(rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/medications/:id
router.put('/medications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity_on_hand } = req.body;
    await db.execute('UPDATE medications SET quantity_on_hand = ? WHERE id = ?', [quantity_on_hand, id]);
    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/referrals
router.get('/referrals', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM referrals ORDER BY created_at DESC');
    res.json(rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/referrals
router.post('/referrals', async (req, res) => {
  try {
    const { visit_id, patient_name, patient_id, referral_hospital, reason, status } = req.body;
    const [result]: any = await db.execute(
      'INSERT INTO referrals (visit_id, patient_name, patient_id, referral_hospital, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [visit_id, patient_name, patient_id, referral_hospital, reason, status || 'Pending']
    );
    res.status(201).json({ id: result.insertId });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/referrals/:id
router.put('/referrals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, outcome_notes } = req.body;
    await db.execute('UPDATE referrals SET status = ?, outcome_notes = ? WHERE id = ?', [status, outcome_notes, id]);
    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/facility-logs
router.get('/facility-logs', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM facility_logs ORDER BY created_at DESC');
    res.json(rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/facility-logs
router.post('/facility-logs', async (req, res) => {
  try {
    const { equipment_name, status, reported_issue, reported_by } = req.body;
    const [result]: any = await db.execute(
      'INSERT INTO facility_logs (equipment_name, status, reported_issue, reported_by) VALUES (?, ?, ?, ?)',
      [equipment_name, status, reported_issue, reported_by]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/audit-logs
router.get('/audit-logs', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
    res.json(rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/audit-logs
router.post('/audit-logs', async (req, res) => {
  try {
    const { action, category, actor, details } = req.body;
    const [result]: any = await db.execute(
      'INSERT INTO audit_logs (action, category, actor, details) VALUES (?, ?, ?, ?)',
      [action, category, actor, details]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/stats
router.get('/stats', async (req, res) => {
  try {
    const [patients]: any = await db.query('SELECT COUNT(*) as count FROM patients');
    const [visits]: any = await db.query('SELECT COUNT(*) as count FROM visits WHERE DATE(created_at) = CURDATE()');
    const [lowStock]: any = await db.query('SELECT COUNT(*) as count FROM medications WHERE quantity_on_hand <= reorder_threshold');
    
    res.json({
      totalPatients: patients[0].count,
      visitsToday: visits[0].count,
      lowStockMedications: lowStock[0].count
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
