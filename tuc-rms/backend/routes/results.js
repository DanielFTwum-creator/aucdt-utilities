const router = require('express').Router();
const db = require('../db');
const { auth, requireRole } = require('../middleware/auth');

// Enter / update scores
router.post('/enter-scores', auth, async (req, res) => {
  try {
    const { course_id, scores } = req.body;
    if (!course_id || !Array.isArray(scores)) {
      return res.status(400).json({ message: 'course_id and scores array required' });
    }
    if (req.user.role === 'lecturer') {
      const [check] = await db.execute(
        'SELECT id FROM lecturer_courses WHERE lecturer_id = ? AND course_id = ?',
        [req.user.id, course_id]
      );
      if (!check[0]) return res.status(403).json({ message: 'Not assigned to this course' });
    }
    const [courseRows] = await db.execute('SELECT semester FROM courses WHERE id = ?', [course_id]);
    if (!courseRows[0]) return res.status(404).json({ message: 'Course not found' });
    const semester = courseRows[0].semester;

    const errors = [];
    let inserted = 0;
    let updated = 0;

    for (const score of scores) {
      const { student_id, class_score, exam_score } = score;
      if (class_score !== null && class_score !== undefined && (class_score < 0 || class_score > 40)) {
        errors.push(`Student ${student_id}: class score must be 0–40`);
        continue;
      }
      if (exam_score !== null && exam_score !== undefined && (exam_score < 0 || exam_score > 60)) {
        errors.push(`Student ${student_id}: exam score must be 0–60`);
        continue;
      }
      try {
        const [existing] = await db.execute(
          'SELECT id, status FROM results WHERE student_id = ? AND course_id = ?',
          [student_id, course_id]
        );
        if (existing[0]) {
          if (existing[0].status === 'approved') {
            errors.push(`Student ${student_id}: result already approved`);
            continue;
          }
          await db.execute(
            'UPDATE results SET class_score=?, exam_score=?, lecturer_id=? WHERE id=?',
            [class_score ?? null, exam_score ?? null, req.user.id, existing[0].id]
          );
          updated++;
        } else {
          await db.execute(
            'INSERT INTO results (student_id, course_id, lecturer_id, semester, class_score, exam_score) VALUES (?,?,?,?,?,?)',
            [student_id, course_id, req.user.id, semester, class_score ?? null, exam_score ?? null]
          );
          inserted++;
        }
      } catch (innerErr) {
        errors.push(`Student ${student_id}: ${innerErr.message}`);
      }
    }
    await db.execute(
      'INSERT INTO audit_log (user_id, action, table_name, details) VALUES (?,?,?,?)',
      [req.user.id, 'ENTER_SCORES', 'results', `Course ${course_id}: ${inserted} inserted, ${updated} updated`]
    );
    res.json({ message: 'Scores saved', inserted, updated, errors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit scores for approval
router.post('/submit/:courseId', auth, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    if (req.user.role === 'lecturer') {
      const [check] = await db.execute(
        'SELECT id FROM lecturer_courses WHERE lecturer_id = ? AND course_id = ?',
        [req.user.id, courseId]
      );
      if (!check[0]) return res.status(403).json({ message: 'Not assigned to this course' });
    }
    await db.execute(
      "UPDATE results SET status='submitted', submitted_at=NOW() WHERE course_id=? AND status='draft'",
      [courseId]
    );
    const [registrars] = await db.execute("SELECT id FROM users WHERE role='registrar' AND is_active=1");
    const [courseRow] = await db.execute('SELECT course_name, course_code FROM courses WHERE id=?', [courseId]);
    for (const reg of registrars) {
      await db.execute(
        'INSERT INTO notifications (user_id, title, message) VALUES (?,?,?)',
        [reg.id, 'Scores Submitted for Approval',
         `${req.user.full_name} submitted scores for ${courseRow[0]?.course_code}: ${courseRow[0]?.course_name}`]
      );
    }
    res.json({ message: 'Scores submitted for approval' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve or reject scores
router.post('/approve/:courseId', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const { action, comments } = req.body;
    const courseId = req.params.courseId;
    if (action === 'approve') {
      if (req.user.role === 'registrar') {
        await db.execute(
          "UPDATE results SET status='approved', registrar_approved_at=NOW() WHERE course_id=? AND status='submitted'",
          [courseId]
        );
      } else {
        await db.execute(
          "UPDATE results SET qa_approved_at=NOW() WHERE course_id=? AND status='approved'",
          [courseId]
        );
      }
    } else {
      await db.execute(
        "UPDATE results SET status='draft' WHERE course_id=? AND status='submitted'",
        [courseId]
      );
      const [lecturers] = await db.execute(
        'SELECT DISTINCT lc.lecturer_id FROM lecturer_courses lc WHERE lc.course_id=?', [courseId]
      );
      for (const l of lecturers) {
        await db.execute(
          'INSERT INTO notifications (user_id, title, message) VALUES (?,?,?)',
          [l.lecturer_id, 'Scores Rejected',
           `Submitted scores were rejected. Reason: ${comments || 'Please review and resubmit.'}`]
        );
      }
    }
    await db.execute(
      'INSERT INTO audit_log (user_id, action, table_name, details) VALUES (?,?,?,?)',
      [req.user.id, `${action.toUpperCase()}_SCORES`, 'results',
       `Course ${courseId} ${action}d by ${req.user.email}${comments ? '. Comments: ' + comments : ''}`]
    );
    res.json({ message: `Results ${action}d successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get results for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    if (req.user.role === 'lecturer') {
      const [check] = await db.execute(
        'SELECT id FROM lecturer_courses WHERE lecturer_id=? AND course_id=?',
        [req.user.id, courseId]
      );
      if (!check[0]) return res.status(403).json({ message: 'Access denied' });
    }
    const [rows] = await db.execute(`
      SELECT r.*, s.full_name, s.index_number, c.course_code, c.course_name, u.full_name as lecturer_name
      FROM results r
      JOIN students s ON r.student_id = s.id
      JOIN courses c ON r.course_id = c.id
      JOIN users u ON r.lecturer_id = u.id
      WHERE r.course_id = ?
      ORDER BY s.full_name
    `, [courseId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending submissions
router.get('/pending', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT c.id as course_id, c.course_code, c.course_name, c.level, c.semester,
             d.name as department, p.name as programme,
             u.full_name as lecturer_name,
             COUNT(r.id) as result_count,
             r.status, r.submitted_at
      FROM results r
      JOIN courses c ON r.course_id = c.id
      JOIN departments d ON c.department_id = d.id
      LEFT JOIN programmes p ON c.programme_id = p.id
      JOIN users u ON r.lecturer_id = u.id
      WHERE r.status IN ('submitted','approved')
      GROUP BY c.id, r.status, r.submitted_at, u.id
      ORDER BY r.submitted_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/notifications/:id/read', auth, async (req, res) => {
  try {
    await db.execute('UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/notifications/read-all', auth, async (req, res) => {
  try {
    await db.execute('UPDATE notifications SET is_read=1 WHERE user_id=?', [req.user.id]);
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// Transcript — used by Transcripts.jsx page
router.get('/transcript/:studentId', auth, requireRole('registrar', 'qa_officer'), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.*, c.course_code, c.course_name, c.credit_hours, c.level, c.semester,
             d.name as department
      FROM results r
      JOIN courses c ON r.course_id = c.id
      JOIN departments d ON c.department_id = d.id
      WHERE r.student_id = ? AND r.status = 'approved'
      ORDER BY c.level, c.semester, c.course_code
    `, [req.params.studentId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
