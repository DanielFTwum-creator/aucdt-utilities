const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { auth, requireRole } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, full_name, email, role, department, staff_id, is_active, created_at FROM users ORDER BY role, full_name'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get lecturers list
router.get('/lecturers', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, full_name, email, department, staff_id FROM users WHERE role = 'lecturer' AND is_active = 1 ORDER BY full_name"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user (registrar only)
router.post('/', auth, requireRole('registrar'), async (req, res) => {
  try {
    const { full_name, email, password, role, department, staff_id } = req.body;
    if (!full_name || !email || !password || !role) return res.status(400).json({ message: 'Required fields missing' });
    
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, password_hash, role, department, staff_id) VALUES (?,?,?,?,?,?)',
      [full_name, email, hash, role, department, staff_id]
    );
    
    await db.execute('INSERT INTO audit_log (user_id, action, table_name, record_id, details) VALUES (?,?,?,?,?)',
      [req.user.id, 'CREATE_USER', 'users', result.insertId, `Created user: ${email}`]);
    
    res.status(201).json({ message: 'User created', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email or Staff ID already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', auth, requireRole('registrar'), async (req, res) => {
  try {
    const { full_name, email, role, department, staff_id, is_active } = req.body;
    await db.execute(
      'UPDATE users SET full_name=?, email=?, role=?, department=?, staff_id=?, is_active=? WHERE id=?',
      [full_name, email, role, department, staff_id, is_active, req.params.id]
    );
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password (registrar only)
router.post('/:id/reset-password', auth, requireRole('registrar'), async (req, res) => {
  try {
    const newPass = req.body.new_password || 'TUC@2026';
    const hash = await bcrypt.hash(newPass, 10);
    await db.execute('UPDATE users SET password_hash=? WHERE id=?', [hash, req.params.id]);
    res.json({ message: 'Password reset to: ' + newPass });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get lecturer's assigned courses
router.get('/:id/courses', auth, async (req, res) => {
  try {
    const lecturerId = req.params.id;
    // Lecturers can only see their own courses
    if (req.user.role === 'lecturer' && req.user.id != lecturerId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const [rows] = await db.execute(`
      SELECT lc.id, c.id as course_id, c.course_code, c.course_name, c.credit_hours, 
             c.level, c.semester, d.name as department_name, p.name as programme_name,
             lc.academic_year
      FROM lecturer_courses lc
      JOIN courses c ON lc.course_id = c.id
      JOIN departments d ON c.department_id = d.id
      LEFT JOIN programmes p ON c.programme_id = p.id
      WHERE lc.lecturer_id = ?
      ORDER BY c.level, c.semester, c.course_code
    `, [lecturerId]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign course to lecturer
router.post('/assign-course', auth, requireRole('registrar'), async (req, res) => {
  try {
    const { lecturer_id, course_id, academic_year, semester } = req.body;
    await db.execute(
      'INSERT INTO lecturer_courses (lecturer_id, course_id, academic_year, semester) VALUES (?,?,?,?)',
      [lecturer_id, course_id, academic_year || '2025/2026', semester]
    );
    res.status(201).json({ message: 'Course assigned to lecturer' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Course already assigned to this lecturer' });
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
