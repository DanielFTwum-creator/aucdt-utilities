const router = require('express').Router();
const db = require('../db');
const { auth, requireRole } = require('../middleware/auth');

// Get all courses (with filters)
router.get('/', auth, async (req, res) => {
  try {
    const { department_id, level, semester, programme_id } = req.query;
    let query = `
      SELECT c.*, d.name as department_name, p.name as programme_name
      FROM courses c
      JOIN departments d ON c.department_id = d.id
      LEFT JOIN programmes p ON c.programme_id = p.id
      WHERE 1=1
    `;
    const params = [];
    if (department_id) { query += ' AND c.department_id = ?'; params.push(department_id); }
    if (level)         { query += ' AND c.level = ?';         params.push(level); }
    if (semester)      { query += ' AND c.semester = ?';      params.push(semester); }
    if (programme_id)  { query += ' AND c.programme_id = ?';  params.push(programme_id); }
    query += ' ORDER BY c.level, c.semester, c.course_code';
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get departments for dropdowns
router.get('/departments', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM departments ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get programmes for dropdowns
router.get('/programmes', auth, async (req, res) => {
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

// Create course — registrar only
router.post('/', auth, requireRole('registrar'), async (req, res) => {
  try {
    const { course_code, course_name, credit_hours, department_id, level, semester, programme_id } = req.body;
    if (!course_code || !course_name || !department_id || !level || !semester) {
      return res.status(400).json({ message: 'Course code, name, department, level and semester are required' });
    }
    const [result] = await db.execute(
      'INSERT INTO courses (course_code, course_name, credit_hours, department_id, level, semester, programme_id) VALUES (?,?,?,?,?,?,?)',
      [course_code.toUpperCase().trim(), course_name.trim(), credit_hours || 3, department_id, level, semester, programme_id || null]
    );
    await db.execute(
      'INSERT INTO audit_log (user_id, action, table_name, record_id, details) VALUES (?,?,?,?,?)',
      [req.user.id, 'CREATE_COURSE', 'courses', result.insertId, `Created course: ${course_code} - ${course_name}`]
    );
    res.status(201).json({ message: 'Course created successfully', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Course code already exists' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course — registrar only
router.put('/:id', auth, requireRole('registrar'), async (req, res) => {
  try {
    const { course_code, course_name, credit_hours, department_id, level, semester, programme_id } = req.body;
    await db.execute(
      'UPDATE courses SET course_code=?, course_name=?, credit_hours=?, department_id=?, level=?, semester=?, programme_id=? WHERE id=?',
      [course_code, course_name, credit_hours, department_id, level, semester, programme_id || null, req.params.id]
    );
    await db.execute(
      'INSERT INTO audit_log (user_id, action, table_name, record_id, details) VALUES (?,?,?,?,?)',
      [req.user.id, 'UPDATE_COURSE', 'courses', req.params.id, `Updated course: ${course_code}`]
    );
    res.json({ message: 'Course updated' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Course code already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course — registrar only
router.delete('/:id', auth, requireRole('registrar'), async (req, res) => {
  try {
    const [check] = await db.execute('SELECT COUNT(*) as cnt FROM results WHERE course_id = ?', [req.params.id]);
    if (check[0].cnt > 0) {
      return res.status(400).json({ message: 'Cannot delete a course that has results recorded' });
    }
    await db.execute('DELETE FROM lecturer_courses WHERE course_id = ?', [req.params.id]);
    await db.execute('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get students enrolled in a course
router.get('/:courseId/students', auth, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    if (req.user.role === 'lecturer') {
      const [check] = await db.execute(
        'SELECT id FROM lecturer_courses WHERE lecturer_id = ? AND course_id = ?',
        [req.user.id, courseId]
      );
      if (!check[0]) return res.status(403).json({ message: 'You are not assigned to this course' });
    }
    const [courseRows] = await db.execute(`
      SELECT c.*, p.name as programme_name FROM courses c
      LEFT JOIN programmes p ON c.programme_id = p.id WHERE c.id = ?
    `, [courseId]);
    if (!courseRows[0]) return res.status(404).json({ message: 'Course not found' });
    const course = courseRows[0];
    const [students] = await db.execute(`
      SELECT s.id, s.full_name, s.index_number, s.level, s.semester,
             r.id as result_id, r.class_score, r.exam_score, r.total_score,
             r.grade, r.grade_point, r.remarks, r.status as result_status
      FROM students s
      LEFT JOIN results r ON r.student_id = s.id AND r.course_id = ?
      WHERE s.programme_id = ? AND s.level = ? AND s.status = 'active'
      ORDER BY s.full_name
    `, [courseId, course.programme_id, course.level]);
    res.json({ course, students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
