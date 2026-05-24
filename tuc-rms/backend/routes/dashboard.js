const router = require('express').Router();
const db = require('../db');
const { auth, requireRole } = require('../middleware/auth');

router.get('/stats', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const [[students]]   = await db.execute('SELECT COUNT(*) as total FROM students');
    const [[active]]     = await db.execute("SELECT COUNT(*) as cnt FROM students WHERE status='active'");
    const [[courses]]    = await db.execute('SELECT COUNT(*) as total FROM courses');
    const [[programmes]] = await db.execute('SELECT COUNT(*) as total FROM programmes');
    const [[staff]]      = await db.execute("SELECT COUNT(*) as total FROM users WHERE is_active=1");
    const [[submitted]]  = await db.execute("SELECT COUNT(DISTINCT course_id) as cnt FROM results WHERE status='submitted'");
    const [[approved]]   = await db.execute("SELECT COUNT(DISTINCT course_id) as cnt FROM results WHERE status='approved'");
    const [[rejected]]   = await db.execute("SELECT COUNT(*) as cnt FROM results WHERE status='draft' AND submitted_at IS NOT NULL");
    res.json({
      total_students: students.total,
      active_students: active.cnt,
      total_courses: courses.total,
      total_programmes: programmes.total,
      total_staff: staff.total,
      results_submitted: submitted.cnt,
      results_approved: approved.cnt,
      results_rejected: rejected.cnt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
