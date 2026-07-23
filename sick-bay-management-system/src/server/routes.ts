import { Router, type Request, type Response, type NextFunction } from 'express';
import db from './db.js';
import { verifyWmsToken } from './wmsAuth.js';

const router = Router();

/* ── Auth gate ─────────────────────────────────────────────────────────────
   Every data route requires a valid WMS access token. verifyWmsToken hits
   WMS /api/me (the same call the SPA already trusts), so the clinical API is
   not open to the public internet. Fails closed. */
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Auth/health paths are handled by app-level routes (e.g. the WMS OAuth relay
  // registered after this router). Let them fall through instead of 401-ing the
  // sign-in flow, which carries no bearer token yet.
  if (req.path.startsWith('/auth') || req.path.startsWith('/health')) return next('router');
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    (req as any).wmsUser = await verifyWmsToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}
router.use(requireAuth);

/* ── Admin gate ─────────────────────────────────────────────────────────────
   Administering the pharmacy and facility logs is limited to the clinic
   administrator accounts (primary + backup), by institutional email. The email
   comes from the WMS-verified token attached by requireAuth. Overridable via
   SICKBAY_ADMIN_EMAILS in .env; the default is the two designated accounts. */
const ADMIN_EMAILS = (process.env.SICKBAY_ADMIN_EMAILS || 'clinic@techbridge.edu.gh,daniel.twum@techbridge.edu.gh')
  .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const email = (req as any).wmsUser?.email?.toLowerCase();
  if (email && ADMIN_EMAILS.includes(email)) return next();
  return res.status(403).json({ error: 'Administrator access required' });
}

/* ── Mapping helpers (DB snake_case ⇄ frontend camelCase types) ───────────── */
const toArr = (v: any): string[] => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : (v ? [String(v)] : []); }
  catch { return v ? [String(v)] : []; }
};
const jsonArr = (v: any) => JSON.stringify(Array.isArray(v) ? v : []);
const iso = (v: any) => (v instanceof Date ? v.toISOString() : v ?? null);
const day = (v: any) => (v instanceof Date ? v.toISOString().slice(0, 10) : v ? String(v).slice(0, 10) : '');

const mapPatient = (r: any) => ({
  id: r.patient_code,
  name: r.full_name,
  type: r.patient_type,
  gender: r.gender || 'Male',
  age: r.age ?? 0,
  classOrDept: r.class_or_dept || '',
  emergencyContactName: r.emergency_contact_name || '',
  emergencyContactPhone: r.emergency_contact_phone || '',
  allergies: toArr(r.allergies),
  chronicConditions: toArr(r.chronic_conditions),
});

const mapVisit = (r: any) => ({
  id: String(r.id),
  patientId: r.patient_code || '',
  patientName: r.full_name || '',
  patientType: r.patient_type || 'Student',
  classOrDept: r.p_class || '',
  gender: r.p_gender || 'Male',
  dateTime: iso(r.created_at),
  temperature: r.temperature != null ? Number(r.temperature) : 0,
  bloodPressure: r.blood_pressure || '',
  pulseRate: r.pulse_rate ?? 0,
  symptoms: r.symptoms || '',
  presentingConditions: toArr(r.presenting_conditions),
  severity: r.severity,
  treatment: r.treatment || '',
  medicationDispensedId: r.medication_dispensed_id != null ? String(r.medication_dispensed_id) : undefined,
  medicationDispensedQty: r.medication_dispensed_qty ?? undefined,
  disposition: r.disposition,
  observedBedNo: r.observed_bed_no || undefined,
  observationEndTime: r.observation_end_time ? iso(r.observation_end_time) : undefined,
  notes: r.notes || '',
  treatedBy: r.treated_by || '',
});

const mapMed = (r: any) => ({
  id: String(r.id),
  name: r.name,
  category: r.category,
  quantityOnHand: r.quantity_on_hand ?? 0,
  unit: r.unit || '',
  reorderThreshold: r.reorder_threshold ?? 0,
  batchNumber: r.batch_number || '',
  expiryDate: day(r.expiry_date),
  overStockThreshold: r.over_stock_threshold ?? 0,
});

const mapReferral = (r: any) => ({
  id: String(r.id),
  visitId: r.visit_id != null ? String(r.visit_id) : '',
  patientName: r.patient_name || '',
  patientId: r.patient_code || '',
  dateTime: iso(r.created_at),
  referralHospital: r.referral_hospital || '',
  reason: r.reason || '',
  status: r.status,
  outcomeNotes: r.outcome_notes || undefined,
});

const mapFacility = (r: any) => ({
  id: String(r.id),
  dateTime: iso(r.created_at),
  equipmentName: r.equipment_name || '',
  status: r.status,
  reportedIssue: r.reported_issue || undefined,
  reportedBy: r.reported_by || '',
  resolutionDays: r.resolution_days ?? undefined,
  isResolved: !!r.is_resolved,
});

const mapDaily = (r: any) => ({
  id: String(r.id),
  patientId: r.patient_code || '',
  patientName: r.full_name || '',
  classOrDept: r.p_class || '',
  dateTime: iso(r.created_at),
  temperature: r.temperature != null ? Number(r.temperature) : 0,
  symptoms: toArr(r.symptoms),
  status: r.status,
  notes: r.notes || undefined,
});

const mapAudit = (r: any) => ({
  id: String(r.id),
  dateTime: iso(r.created_at),
  action: r.action,
  category: r.category,
  actor: r.actor,
  details: r.details,
});

/** Resolve a frontend patient id (patient_code) to the patients.id INT PK. */
async function patientPk(code: string | undefined | null): Promise<number | null> {
  if (!code) return null;
  const [rows]: any = await db.query('SELECT id FROM patients WHERE patient_code = ?', [code]);
  return rows[0]?.id ?? null;
}

/* ── Patients ──────────────────────────────────────────────────────────── */
router.get('/patients', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients ORDER BY full_name ASC');
    res.json((rows as any[]).map(mapPatient));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

router.post('/patients', async (req, res) => {
  try {
    const p = req.body;
    await db.execute(
      `INSERT INTO patients
        (patient_code, full_name, patient_type, gender, age, class_or_dept,
         emergency_contact_name, emergency_contact_phone, allergies, chronic_conditions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.name, p.type, p.gender, p.age, p.classOrDept,
       p.emergencyContactName, p.emergencyContactPhone, jsonArr(p.allergies), jsonArr(p.chronicConditions)]
    );
    res.status(201).json(p);
  } catch (error: any) {
    if (error?.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A patient with this ID already exists' });
    console.error(error); res.status(500).json({ error: 'Database error' });
  }
});

/* ── Visits ────────────────────────────────────────────────────────────── */
const VISIT_SELECT = `
  SELECT v.*, p.patient_code, p.full_name, p.patient_type,
         p.class_or_dept AS p_class, p.gender AS p_gender
  FROM visits v LEFT JOIN patients p ON v.patient_id = p.id`;

router.get('/visits', async (_req, res) => {
  try {
    const [rows] = await db.query(`${VISIT_SELECT} ORDER BY v.created_at DESC`);
    res.json((rows as any[]).map(mapVisit));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

// Atomic: insert the visit, deduct dispensed medication stock, and raise a
// referral when the disposition is a hospital transfer — the three things the
// front end used to do locally in one handler.
router.post('/visits', async (req, res) => {
  const b = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const pk = await (async () => {
      const [r]: any = await conn.query('SELECT id FROM patients WHERE patient_code = ?', [b.patientId]);
      return r[0]?.id ?? null;
    })();
    const medId = b.medicationDispensedId ? Number(b.medicationDispensedId) : null;
    const [ins]: any = await conn.execute(
      `INSERT INTO visits
        (patient_id, temperature, blood_pressure, pulse_rate, symptoms, presenting_conditions,
         severity, treatment, medication_dispensed_id, medication_dispensed_qty, disposition,
         observed_bed_no, observation_end_time, notes, treated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [pk, b.temperature, b.bloodPressure, b.pulseRate, b.symptoms, jsonArr(b.presentingConditions),
       b.severity, b.treatment, medId, b.medicationDispensedQty ?? null, b.disposition,
       b.observedBedNo ?? null, null, b.notes ?? '', b.treatedBy ?? '']
    );
    const visitId = ins.insertId;
    if (medId && b.medicationDispensedQty) {
      await conn.execute(
        'UPDATE medications SET quantity_on_hand = GREATEST(0, quantity_on_hand - ?) WHERE id = ?',
        [b.medicationDispensedQty, medId]
      );
    }
    if (b.disposition === 'Referral to Hospital' && b.referralHospital) {
      await conn.execute(
        'INSERT INTO referrals (visit_id, patient_name, patient_id, referral_hospital, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
        [visitId, b.patientName, pk, b.referralHospital, b.referralReason || 'Referred for clinical assessment', 'Pending']
      );
    }
    await conn.commit();
    res.status(201).json({ id: String(visitId) });
  } catch (error) {
    await conn.rollback();
    console.error(error); res.status(500).json({ error: 'Database error' });
  } finally { conn.release(); }
});

// Discharge a patient from the observation bed.
router.put('/visits/:id/discharge', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const [rows]: any = await db.query('SELECT notes FROM visits WHERE id = ?', [id]);
    const prev = rows[0]?.notes || '';
    const merged = prev ? `${prev} | Checkout notes: ${notes}` : notes;
    await db.execute(
      "UPDATE visits SET observation_end_time = NOW(), notes = ?, disposition = 'Back to Class' WHERE id = ?",
      [merged, id]
    );
    res.json({ success: true });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

/* ── Medications ───────────────────────────────────────────────────────── */
router.get('/medications', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM medications ORDER BY name ASC');
    res.json((rows as any[]).map(mapMed));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

router.post('/medications', requireAdmin, async (req, res) => {
  try {
    const m = req.body;
    const [ins]: any = await db.execute(
      `INSERT INTO medications
        (name, category, quantity_on_hand, unit, reorder_threshold, batch_number, expiry_date, over_stock_threshold)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [m.name, m.category, m.quantityOnHand, m.unit, m.reorderThreshold, m.batchNumber, m.expiryDate || null, m.overStockThreshold]
    );
    res.status(201).json({ ...m, id: String(ins.insertId) });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

// Full update — covers edits, restock, discard and quantity adjustments (the
// front end always sends the whole updated medication object).
router.put('/medications/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const m = req.body;
    await db.execute(
      `UPDATE medications SET
        name = ?, category = ?, quantity_on_hand = ?, unit = ?, reorder_threshold = ?,
        batch_number = ?, expiry_date = ?, over_stock_threshold = ?
       WHERE id = ?`,
      [m.name, m.category, m.quantityOnHand, m.unit, m.reorderThreshold, m.batchNumber, m.expiryDate || null, m.overStockThreshold, id]
    );
    res.json({ success: true });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

router.delete('/medications/:id', requireAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM medications WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

/* ── Referrals ─────────────────────────────────────────────────────────── */
router.get('/referrals', async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, p.patient_code FROM referrals r
       LEFT JOIN patients p ON r.patient_id = p.id ORDER BY r.created_at DESC`
    );
    res.json((rows as any[]).map(mapReferral));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

router.post('/referrals', async (req, res) => {
  try {
    const b = req.body;
    const visitPk = /^\d+$/.test(String(b.visitId)) ? Number(b.visitId) : null;
    const pk = await patientPk(b.patientId);
    const [ins]: any = await db.execute(
      'INSERT INTO referrals (visit_id, patient_name, patient_id, referral_hospital, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [visitPk, b.patientName, pk, b.referralHospital, b.reason, b.status || 'Pending']
    );
    res.status(201).json({ id: String(ins.insertId) });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

router.put('/referrals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, outcomeNotes } = req.body;
    await db.execute('UPDATE referrals SET status = ?, outcome_notes = ? WHERE id = ?', [status, outcomeNotes ?? null, id]);
    res.json({ success: true });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

/* ── Facility logs ─────────────────────────────────────────────────────── */
router.get('/facility-logs', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM facility_logs ORDER BY created_at DESC');
    res.json((rows as any[]).map(mapFacility));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

router.post('/facility-logs', requireAdmin, async (req, res) => {
  try {
    const b = req.body;
    const [ins]: any = await db.execute(
      'INSERT INTO facility_logs (equipment_name, status, reported_issue, reported_by) VALUES (?, ?, ?, ?)',
      [b.equipmentName, b.status, b.reportedIssue ?? null, b.reportedBy]
    );
    res.status(201).json({ id: String(ins.insertId) });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

router.put('/facility-logs/:id/resolve', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionDays } = req.body;
    await db.execute(
      "UPDATE facility_logs SET is_resolved = TRUE, status = 'Functional', resolution_days = ? WHERE id = ?",
      [resolutionDays, id]
    );
    res.json({ success: true });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

/* ── Daily health checks ───────────────────────────────────────────────── */
router.get('/daily-checks', async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.*, p.patient_code, p.full_name, p.class_or_dept AS p_class
       FROM daily_health_checks d LEFT JOIN patients p ON d.patient_id = p.id
       ORDER BY d.created_at DESC`
    );
    res.json((rows as any[]).map(mapDaily));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

router.post('/daily-checks', async (req, res) => {
  try {
    const b = req.body;
    const pk = await patientPk(b.patientId);
    const [ins]: any = await db.execute(
      'INSERT INTO daily_health_checks (patient_id, temperature, symptoms, status, notes) VALUES (?, ?, ?, ?, ?)',
      [pk, b.temperature, jsonArr(b.symptoms), b.status, b.notes ?? null]
    );
    res.status(201).json({ id: String(ins.insertId) });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

/* ── Audit logs ────────────────────────────────────────────────────────── */
router.get('/audit-logs', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200');
    res.json((rows as any[]).map(mapAudit));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

router.post('/audit-logs', async (req, res) => {
  try {
    const { action, category, actor, details } = req.body;
    const [ins]: any = await db.execute(
      'INSERT INTO audit_logs (action, category, actor, details) VALUES (?, ?, ?, ?)',
      [action, category, actor, details]
    );
    res.status(201).json({ id: String(ins.insertId) });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

/* ── Stats ─────────────────────────────────────────────────────────────── */
router.get('/stats', async (_req, res) => {
  try {
    const [patients]: any = await db.query('SELECT COUNT(*) as count FROM patients');
    const [visits]: any = await db.query('SELECT COUNT(*) as count FROM visits WHERE DATE(created_at) = CURDATE()');
    const [lowStock]: any = await db.query('SELECT COUNT(*) as count FROM medications WHERE quantity_on_hand <= reorder_threshold');
    res.json({
      totalPatients: patients[0].count,
      visitsToday: visits[0].count,
      lowStockMedications: lowStock[0].count,
    });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Database error' }); }
});

export default router;
