const router = require('express').Router();
const db = require('../db');
const { auth, requireRole } = require('../middleware/auth');

// List students with search and filters
router.get('/', auth, async (req, res) => {
  try {
    const { programme_id, level, semester, search, limit = 200 } = req.query;
    let query = `
      SELECT s.id, s.full_name, s.index_number, s.level, s.semester, s.status,
             s.gender, s.email, s.phone, s.nationality,
             p.id as programme_id, p.name as programme, p.code as programme_code,
             p.programme_type, d.name as department, d.code as dept_code
      FROM students s
      JOIN programmes p ON s.programme_id = p.id
      JOIN departments d ON p.department_id = d.id
      WHERE 1=1
    `;
    const params = [];
    if (programme_id) { query += ' AND s.programme_id = ?'; params.push(programme_id); }
    if (level)        { query += ' AND s.level = ?';        params.push(level); }
    if (semester)     { query += ' AND s.semester = ?';     params.push(semester); }
    if (search) {
      query += ' AND (s.full_name LIKE ? OR s.index_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (req.user.role === 'lecturer') {
      query += ` AND s.programme_id IN (
        SELECT DISTINCT c.programme_id FROM lecturer_courses lc
        JOIN courses c ON lc.course_id = c.id WHERE lc.lecturer_id = ?
      )`;
      params.push(req.user.id);
    }
    const limitValue = parseInt(req.query.limit) || 100;

query += ` ORDER BY s.programme_id, s.level, s.full_name LIMIT ${limitValue}`;

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single student
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.*, p.name as programme, p.code as programme_code,
             p.programme_type, d.name as department
      FROM students s
      JOIN programmes p ON s.programme_id = p.id
      JOIN departments d ON p.department_id = d.id
      WHERE s.id = ? OR s.index_number = ?
    `, [req.params.id, req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Student not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create student — registrar only
router.post('/', auth, requireRole('registrar'), async (req, res) => {
  try {
    const { full_name, index_number, programme_id, level, semester,
            nationality, gender, date_of_birth, email, phone } = req.body;
    if (!full_name || !index_number || !programme_id || !level || !semester) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    const [result] = await db.execute(
      'INSERT INTO students (full_name, index_number, programme_id, level, semester, nationality, gender, date_of_birth, email, phone) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [full_name, index_number, programme_id, level, semester,
       nationality || 'Ghanaian', gender || null, date_of_birth || null, email || null, phone || null]
    );
    await db.execute(
      'INSERT INTO audit_log (user_id, action, table_name, record_id, details) VALUES (?,?,?,?,?)',
      [req.user.id, 'CREATE_STUDENT', 'students', result.insertId, `Added: ${full_name} (${index_number})`]
    );
    res.status(201).json({ message: 'Student added', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Index number already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student — registrar only
router.put('/:id', auth, requireRole('registrar'), async (req, res) => {
  try {
    const { full_name, programme_id, level, semester, nationality,
            gender, date_of_birth, email, phone, status } = req.body;
    await db.execute(
      'UPDATE students SET full_name=?, programme_id=?, level=?, semester=?, nationality=?, gender=?, date_of_birth=?, email=?, phone=?, status=? WHERE id=?',
      [full_name, programme_id, level, semester, nationality, gender, date_of_birth, email, phone, status, req.params.id]
    );
    res.json({ message: 'Student updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get programmes for dropdown
router.get('/meta/programmes', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.id, p.name, p.code, p.programme_type, p.duration_years,
             d.name as department, d.code as dept_code
      FROM programmes p JOIN departments d ON p.department_id = d.id
      ORDER BY d.name, p.name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ---- STUDENT REVIEWS ----

// List reviews for a student (or all reviews for admin)
router.get('/:id/reviews', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT sr.*, u.full_name as reviewer_name, u.role as reviewer_role
      FROM student_reviews sr
      JOIN users u ON sr.reviewed_by = u.id
      WHERE sr.student_id = ?
      ORDER BY sr.created_at DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a review for a student
router.post('/:id/reviews', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const { category, priority, description } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required' });
    }
    const studentId = req.params.id;
    const [studentCheck] = await db.execute('SELECT id, full_name, index_number FROM students WHERE id = ?', [studentId]);
    if (!studentCheck[0]) return res.status(404).json({ message: 'Student not found' });

    const [result] = await db.execute(
      'INSERT INTO student_reviews (student_id, reviewed_by, category, priority, description, status) VALUES (?,?,?,?,?,?)',
      [studentId, req.user.id, category || 'General', priority || 'Medium', description.trim(), 'Open']
    );
    await db.execute(
      'INSERT INTO audit_log (user_id, action, table_name, record_id, details) VALUES (?,?,?,?,?)',
      [req.user.id, 'CREATE_REVIEW', 'student_reviews', result.insertId,
       `Review opened for student ${studentCheck[0].index_number}: ${category || 'General'}`]
    );
    res.status(201).json({ message: 'Review created', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a review (change status, add resolution)
router.put('/:studentId/reviews/:reviewId', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const { status, resolution, priority } = req.body;
    const resolved_at = (status === 'Resolved' || status === 'Closed') ? new Date() : null;
    const updatePriority = priority || 'Medium';
    await db.execute(
      'UPDATE student_reviews SET status=?, resolution=?, priority=?, resolved_at=? WHERE id=? AND student_id=?',
      [status, resolution || null, updatePriority, resolved_at, req.params.reviewId, req.params.studentId]
    );
    res.json({ message: 'Review updated' });
  } catch (err) {
    console.error('Review update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all reviews across all students (admin dashboard)
router.get('/reviews/all', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const { status, priority } = req.query;
    let query = `
      SELECT sr.*, s.full_name as student_name, s.index_number,
             p.name as programme, u.full_name as reviewer_name
      FROM student_reviews sr
      JOIN students s ON sr.student_id = s.id
      JOIN programmes p ON s.programme_id = p.id
      JOIN users u ON sr.reviewed_by = u.id
      WHERE 1=1
    `;
    const params = [];
    if (status)   { query += ' AND sr.status = ?';   params.push(status); }
    if (priority) { query += ' AND sr.priority = ?'; params.push(priority); }
    query += ' ORDER BY FIELD(sr.priority,"Critical","High","Medium","Low"), sr.created_at DESC LIMIT 200';
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
