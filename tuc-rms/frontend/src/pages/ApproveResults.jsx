import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ApproveResults() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState(null);
  const [detailResults, setDetailResults] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionModal, setActionModal] = useState(null);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/results/pending`);
      setPending(r.data);
    } catch {
      toast.error('Failed to load pending results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openDetail = async (row) => {
    setDetailModal(row);
    setDetailLoading(true);
    try {
      const r = await axios.get(`${API}/results/course/${row.course_id}`);
      setDetailResults(r.data);
    } catch {
      toast.error('Failed to load result details');
    } finally {
      setDetailLoading(false);
    }
  };

  const openAction = (row, action) => {
    setActionModal({ row, action });
    setComments('');
  };

  const handleAction = async () => {
    if (!actionModal) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/results/approve/${actionModal.row.course_id}`, {
        action: actionModal.action,
        comments
      });
      toast.success(`Results ${actionModal.action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setActionModal(null);
      setDetailModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filterStatus
    ? pending.filter(p => p.status === filterStatus)
    : pending;

  const statusBadge = (status) => {
    if (status === 'submitted') return <span className="badge badge-warning">Awaiting Approval</span>;
    if (status === 'approved')  return <span className="badge badge-success">Approved</span>;
    if (status === 'rejected')  return <span className="badge badge-danger">Rejected</span>;
    return <span className="badge badge-draft">{status}</span>;
  };

  const gradeColor = (grade) => {
    if (!grade) return 'var(--tuc-muted)';
    if (['A', 'B+'].includes(grade)) return '#16a34a';
    if (['B', 'C+'].includes(grade)) return '#2563eb';
    if (['C', 'D+', 'D'].includes(grade)) return '#d97706';
    return '#dc2626';
  };

  return (
    <div>
      <div className="page-header">
        <h1>Approve Results</h1>
        <p>Review and approve scores submitted by lecturers</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
          <select
            className="form-control"
            style={{ width: 180 }}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Submissions</option>
            <option value="submitted">Awaiting Approval</option>
            <option value="approved">Approved</option>
          </select>
          <span style={{ fontSize: 13, color: 'var(--tuc-muted)', marginLeft: 4 }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3>No pending submissions</h3>
            <p>All results have been processed. Check back when lecturers submit new scores.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Department</th>
                  <th>Level</th>
                  <th>Lecturer</th>
                  <th>Students</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{row.course_code}</div>
                      <div style={{ fontSize: 12, color: 'var(--tuc-muted)' }}>{row.course_name}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{row.department}</td>
                    <td>L{row.level} / S{row.semester}</td>
                    <td style={{ fontSize: 13 }}>{row.lecturer_name}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.result_count}</td>
                    <td style={{ fontSize: 12, color: 'var(--tuc-muted)' }}>
                      {row.submitted_at ? new Date(row.submitted_at).toLocaleDateString() : '-'}
                    </td>
                    <td>{statusBadge(row.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openDetail(row)}
                        >
                          View
                        </button>
                        {row.status === 'submitted' && user?.role === 'registrar' && (
                          <>
                            <button
                              className="btn btn-sm"
                              style={{ background: '#dcfce7', color: '#16a34a', border: 'none', fontWeight: 600 }}
                              onClick={() => openAction(row, 'approve')}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', fontWeight: 600 }}
                              onClick={() => openAction(row, 'reject')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {row.status === 'approved' && user?.role === 'qa_officer' && (
                          <button
                            className="btn btn-sm"
                            style={{ background: '#dcfce7', color: '#16a34a', border: 'none', fontWeight: 600 }}
                            onClick={() => openAction(row, 'approve')}
                          >
                            QA Sign-off
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetailModal(null)}>
          <div className="modal" style={{ maxWidth: 760 }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{detailModal.course_code}: {detailModal.course_name}</div>
                <div style={{ fontSize: 12, color: 'var(--tuc-muted)', marginTop: 2 }}>
                  {detailModal.lecturer_name} &mdash; {detailModal.department} &mdash; Level {detailModal.level}
                </div>
              </div>
              <button className="btn-icon" onClick={() => setDetailModal(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {detailLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}>
                <div className="spinner" />
              </div>
            ) : (
              <div className="table-wrapper" style={{ maxHeight: 420, overflowY: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Index No.</th>
                      <th>Full Name</th>
                      <th style={{ textAlign: 'center' }}>Class (30)</th>
                      <th style={{ textAlign: 'center' }}>Exam (70)</th>
                      <th style={{ textAlign: 'center' }}>Total</th>
                      <th style={{ textAlign: 'center' }}>Grade</th>
                      <th style={{ textAlign: 'center' }}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailResults.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: 24, color: 'var(--tuc-muted)' }}>
                          No scores recorded yet
                        </td>
                      </tr>
                    ) : detailResults.map((r, i) => (
                      <tr key={r.id}>
                        <td style={{ color: 'var(--tuc-muted)', fontSize: 12 }}>{i + 1}</td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--tuc-maroon)', fontSize: 12 }}>
                            {r.index_number}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{r.full_name}</td>
                        <td style={{ textAlign: 'center' }}>{r.class_score ?? '-'}</td>
                        <td style={{ textAlign: 'center' }}>{r.exam_score ?? '-'}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{r.total_score}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontWeight: 700, color: gradeColor(r.grade) }}>{r.grade}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${r.remarks === 'PASS' ? 'badge-success' : 'badge-danger'}`}>
                            {r.remarks}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--tuc-muted)' }}>
                {detailResults.length} student{detailResults.length !== 1 ? 's' : ''}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                {detailModal.status === 'submitted' && user?.role === 'registrar' && (
                  <>
                    <button
                      className="btn btn-sm"
                      style={{ background: '#dcfce7', color: '#16a34a', border: 'none', fontWeight: 600 }}
                      onClick={() => { setDetailModal(null); openAction(detailModal, 'approve'); }}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: '#fee2e2', color: '#dc2626', border: 'none', fontWeight: 600 }}
                      onClick={() => { setDetailModal(null); openAction(detailModal, 'reject'); }}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button className="btn btn-outline" onClick={() => setDetailModal(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action confirmation modal */}
      {actionModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setActionModal(null)}>
          <div className="modal" style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <span className="modal-title">
                {actionModal.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </span>
              <button className="btn-icon" onClick={() => setActionModal(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div style={{ marginBottom: 16, fontSize: 14, color: 'var(--tuc-text)', lineHeight: 1.6 }}>
              {actionModal.action === 'approve' ? (
                <>
                  You are approving results for <strong>{actionModal.row.course_code}: {actionModal.row.course_name}</strong>.
                  This action will be recorded in the audit log.
                </>
              ) : (
                <>
                  You are rejecting results for <strong>{actionModal.row.course_code}: {actionModal.row.course_name}</strong>.
                  The lecturer will be notified and asked to review and resubmit.
                </>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">
                Comments {actionModal.action === 'reject' ? '(required for rejection)' : '(optional)'}
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder={
                  actionModal.action === 'reject'
                    ? 'State the reason for rejection...'
                    : 'Add any notes for this approval...'
                }
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setActionModal(null)} disabled={submitting}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAction}
                disabled={submitting || (actionModal.action === 'reject' && !comments.trim())}
                style={actionModal.action === 'reject' ? { background: '#dc2626' } : {}}
              >
                {submitting ? 'Processing...' : actionModal.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
