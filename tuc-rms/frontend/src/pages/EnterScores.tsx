import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function EnterScores() {
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await axios.get(`${API}/courses/${courseId}/students`);
        setCourse(r.data.course);
        setStudents(r.data.students);
        const init = {};
        r.data.students.forEach(s => {
          init[s.id] = {
            class_score: s.class_score !== null && s.class_score !== undefined ? String(s.class_score) : '',
            exam_score: s.exam_score !== null && s.exam_score !== undefined ? String(s.exam_score) : ''
          };
        });
        setScores(init);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load students');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const setScore = (studentId, field, value) => {
    setScores(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value }
    }));
  };

  const validateScores = () => {
    for (const [sid, val] of Object.entries(scores)) {
      const cs = val.class_score !== '' ? parseFloat(val.class_score) : null;
      const es = val.exam_score !== '' ? parseFloat(val.exam_score) : null;
      if (cs !== null && (isNaN(cs) || cs < 0 || cs > 40)) {
        const s = students.find(st => st.id === parseInt(sid));
        toast.error(`${s?.full_name}: Class score must be between 0 and 30`);
        return false;
      }
      if (es !== null && (isNaN(es) || es < 0 || es > 60)) {
        const s = students.find(st => st.id === parseInt(sid));
        toast.error(`${s?.full_name}: Exam score must be between 0 and 60`);
        return false;
      }
    }
    return true;
  };

  const buildPayload = () =>
    students.map(s => ({
      student_id: s.id,
      class_score: scores[s.id]?.class_score !== '' ? parseFloat(scores[s.id]?.class_score) : null,
      exam_score: scores[s.id]?.exam_score !== '' ? parseFloat(scores[s.id]?.exam_score) : null
    }));

  const handleSave = async () => {
    if (!validateScores()) return;
    setSaving(true);
    try {
      const r = await axios.post(`${API}/results/enter-scores`, {
        course_id: parseInt(courseId),
        scores: buildPayload()
      });
      if (r.data.errors?.length) {
        toast.error(`Saved with issues: ${r.data.errors.slice(0, 2).join(', ')}`);
      } else {
        toast.success(`Scores saved — ${r.data.inserted} added, ${r.data.updated} updated`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save scores');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateScores()) return;
    if (!window.confirm('Submit these scores for approval? You will not be able to edit them until they are returned.')) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/results/enter-scores`, {
        course_id: parseInt(courseId),
        scores: buildPayload()
      });
      await axios.post(`${API}/results/submit/${courseId}`);
      toast.success('Scores submitted for approval');
      navigate('/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const calcTotal = (cs, es) => {
    const c = cs !== '' ? parseFloat(cs) : 0;
    const e = es !== '' ? parseFloat(es) : 0;
    if (isNaN(c) && isNaN(e)) return '';
    const total = (isNaN(c) ? 0 : c) + (isNaN(e) ? 0 : e);
    return total.toFixed(1);
  };

  const calcGrade = (total) => {
    const t = parseFloat(total);
    if (isNaN(t)) return '';
    if (t >= 80) return 'A';
    if (t >= 70) return 'B+';
    if (t >= 60) return 'B';
    if (t >= 55) return 'C+';
    if (t >= 50) return 'C';
    if (t >= 45) return 'D+';
    if (t >= 40) return 'D';
    return 'F';
  };

  const gradeColor = (g) => {
    if (!g) return 'var(--tuc-muted)';
    if (['A', 'B+'].includes(g)) return '#16a34a';
    if (['B', 'C+'].includes(g)) return '#2563eb';
    if (['C', 'D+', 'D'].includes(g)) return '#d97706';
    return '#dc2626';
  };

  const allApproved = students.every(s => s.result_status === 'approved');
  const anySubmitted = students.some(s => s.result_status === 'submitted');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>
            {course?.course_code}: {course?.course_name}
          </h1>
          <p>
            Level {course?.level} &mdash; Semester {course?.semester}
            {course?.programme_name && ` — ${course.programme_name}`}
          </p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/courses')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Courses
        </button>
      </div>

      {(allApproved || anySubmitted) && (
        <div style={{
          marginBottom: 16, padding: '10px 16px', borderRadius: 8, fontSize: 13,
          background: anySubmitted && !allApproved ? '#fef3c7' : '#dcfce7',
          color: anySubmitted && !allApproved ? '#92400e' : '#166534',
          border: `1px solid ${anySubmitted && !allApproved ? '#fde68a' : '#bbf7d0'}`
        }}>
          {allApproved
            ? 'These results have been approved and are locked from further editing.'
            : 'Scores have been submitted and are awaiting approval. Editing is disabled until returned.'}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--tuc-muted)' }}>
            {students.length} student{students.length !== 1 ? 's' : ''} enrolled
            <span style={{ marginLeft: 16, fontSize: 12 }}>Class score: max 30 &nbsp;|&nbsp; Exam score: max 70</span>
          </div>
          {!allApproved && !anySubmitted && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          )}
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: 36 }}>#</th>
                <th>Index No.</th>
                <th>Full Name</th>
                <th style={{ textAlign: 'center', width: 120 }}>Class Score (30)</th>
                <th style={{ textAlign: 'center', width: 120 }}>Exam Score (70)</th>
                <th style={{ textAlign: 'center', width: 90 }}>Total</th>
                <th style={{ textAlign: 'center', width: 70 }}>Grade</th>
                <th style={{ textAlign: 'center', width: 80 }}>Remarks</th>
                <th style={{ textAlign: 'center', width: 80 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => {
                const sc = scores[s.id] || { class_score: '', exam_score: '' };
                const total = calcTotal(sc.class_score, sc.exam_score);
                const grade = calcGrade(total);
                const locked = s.result_status === 'approved' || s.result_status === 'submitted';
                return (
                  <tr key={s.id} style={{ background: locked ? '#fafafa' : 'transparent' }}>
                    <td style={{ color: 'var(--tuc-muted)', fontSize: 12 }}>{i + 1}</td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--tuc-maroon)', fontSize: 12 }}>
                        {s.index_number}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{s.full_name}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        step="0.5"
                        className="form-control"
                        value={sc.class_score}
                        onChange={e => setScore(s.id, 'class_score', e.target.value)}
                        disabled={locked}
                        style={{
                          width: 80, textAlign: 'center', margin: '0 auto', display: 'block',
                          opacity: locked ? 0.6 : 1
                        }}
                        placeholder="0 to 30"
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="0"
                        max="70"
                        step="0.5"
                        className="form-control"
                        value={sc.exam_score}
                        onChange={e => setScore(s.id, 'exam_score', e.target.value)}
                        disabled={locked}
                        style={{
                          width: 80, textAlign: 'center', margin: '0 auto', display: 'block',
                          opacity: locked ? 0.6 : 1
                        }}
                        placeholder="0 to 70"
                      />
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 14 }}>
                      {total || '-'}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: gradeColor(grade) }}>
                      {grade || '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {total !== '' ? (
                        <span className={`badge ${parseFloat(total) >= 40 ? 'badge-success' : 'badge-danger'}`}>
                          {parseFloat(total) >= 40 ? 'PASS' : 'FAIL'}
                        </span>
                      ) : '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {s.result_status === 'approved' && <span className="badge badge-success">Approved</span>}
                      {s.result_status === 'submitted' && <span className="badge badge-warning">Submitted</span>}
                      {s.result_status === 'draft' && <span className="badge badge-draft">Draft</span>}
                      {!s.result_status && <span style={{ color: 'var(--tuc-muted)', fontSize: 12 }}>-</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!allApproved && !anySubmitted && students.length > 0 && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--tuc-border)' }}>
            <button className="btn btn-outline" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
