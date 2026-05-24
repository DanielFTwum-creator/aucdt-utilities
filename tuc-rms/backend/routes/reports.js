const router = require('express').Router();
const db = require('../db');
const { auth, requireRole } = require('../middleware/auth');

// Get student transcript (registrar/QA only)
router.get('/transcript/:studentId', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const [studentRows] = await db.execute(`
      SELECT s.*, p.name as programme, p.code as programme_code, p.programme_type,
             d.name as department
      FROM students s
      JOIN programmes p ON s.programme_id = p.id
      JOIN departments d ON p.department_id = d.id
      WHERE s.id = ? OR s.index_number = ?
    `, [req.params.studentId, req.params.studentId]);
    
    if (!studentRows[0]) return res.status(404).json({ message: 'Student not found' });
    const student = studentRows[0];
    
    // Get all results grouped by semester
    const [results] = await db.execute(`
      SELECT r.semester, r.academic_year, r.class_score, r.exam_score, r.total_score,
             r.grade, r.grade_point, r.remarks, r.status,
             c.course_code, c.course_name, c.credit_hours, c.level,
             u.full_name as lecturer_name
      FROM results r
      JOIN courses c ON r.course_id = c.id
      JOIN users u ON r.lecturer_id = u.id
      WHERE r.student_id = ? AND r.status IN ('submitted','approved')
      ORDER BY c.level, r.semester, c.course_code
    `, [student.id]);
    
    // Calculate GPA per semester and overall
    const semesters = {};
    for (const row of results) {
      const key = `${row.level}-${row.semester}`;
      if (!semesters[key]) {
        semesters[key] = { level: row.level, semester: row.semester, academic_year: row.academic_year, courses: [], totalCredits: 0, totalPoints: 0 };
      }
      semesters[key].courses.push(row);
      semesters[key].totalCredits += row.credit_hours;
      semesters[key].totalPoints += (row.grade_point * row.credit_hours);
    }
    
    // Calculate GPA per semester
    const semesterList = Object.values(semesters).map(sem => ({
      ...sem,
      gpa: sem.totalCredits > 0 ? (sem.totalPoints / sem.totalCredits).toFixed(2) : '0.00'
    }));
    
    // Overall CGPA
    const totalCredits = results.reduce((sum, r) => sum + r.credit_hours, 0);
    const totalPoints = results.reduce((sum, r) => sum + (r.grade_point * r.credit_hours), 0);
    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    
    await db.execute('INSERT INTO audit_log (user_id, action, table_name, record_id, details) VALUES (?,?,?,?,?)',
      [req.user.id, 'VIEW_TRANSCRIPT', 'students', student.id, `Transcript viewed for ${student.index_number}`]);
    
    res.json({ student, semesters: semesterList, cgpa, totalCredits, generated_by: req.user.full_name, generated_at: new Date() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get semester results sheet for a course (registrar/QA)
router.get('/results-sheet/:courseId', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const [courseRows] = await db.execute(`
      SELECT c.*, d.name as department_name, p.name as programme_name,
             u.full_name as lecturer_name
      FROM courses c
      JOIN departments d ON c.department_id = d.id
      LEFT JOIN programmes p ON c.programme_id = p.id
      LEFT JOIN lecturer_courses lc ON lc.course_id = c.id
      LEFT JOIN users u ON lc.lecturer_id = u.id
      WHERE c.id = ?
    `, [req.params.courseId]);
    
    if (!courseRows[0]) return res.status(404).json({ message: 'Course not found' });
    
    const [results] = await db.execute(`
      SELECT s.full_name, s.index_number, r.class_score, r.exam_score, r.total_score,
             r.grade, r.grade_point, r.remarks, r.status
      FROM results r
      JOIN students s ON r.student_id = s.id
      WHERE r.course_id = ?
      ORDER BY s.full_name
    `, [req.params.courseId]);
    
    const stats = {
      total: results.length,
      passed: results.filter(r => r.remarks === 'PASS').length,
      failed: results.filter(r => r.remarks === 'FAIL').length,
      average: results.length > 0 ? (results.reduce((s, r) => s + (r.total_score || 0), 0) / results.length).toFixed(1) : 0
    };
    
    res.json({ course: courseRows[0], results, stats });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get class/programme report (admin only)
router.get('/class-report', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const { programme_id, level, semester, academic_year } = req.query;
    
    let query = `
      SELECT s.full_name, s.index_number, p.name as programme, s.level, s.semester,
             COUNT(r.id) as courses_taken,
             AVG(r.total_score) as avg_score,
             SUM(CASE WHEN r.remarks='PASS' THEN 1 ELSE 0 END) as passed,
             SUM(CASE WHEN r.remarks='FAIL' THEN 1 ELSE 0 END) as failed,
             SUM(c.credit_hours * r.grade_point) / NULLIF(SUM(c.credit_hours), 0) as gpa
      FROM students s
      JOIN programmes p ON s.programme_id = p.id
      LEFT JOIN results r ON r.student_id = s.id AND r.status IN ('submitted','approved')
      LEFT JOIN courses c ON r.course_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (programme_id) { query += ' AND s.programme_id = ?'; params.push(programme_id); }
    if (level) { query += ' AND s.level = ?'; params.push(level); }
    
    query += ' GROUP BY s.id ORDER BY p.name, s.level, avg_score DESC';
    
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Audit log (registrar only)
router.get('/audit-log', auth, requireRole('registrar'), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT al.*, u.full_name, u.email, u.role
      FROM audit_log al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC LIMIT 200
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
