import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const PRIORITY_COLORS = {
  Critical: { background: '#fee2e2', color: '#dc2626' },
  High:     { background: '#fef3c7', color: '#d97706' },
  Medium:   { background: '#dbeafe', color: '#2563eb' },
  Low:      { background: '#f3f4f6', color: '#6b7280' }
};

const STATUS_COLORS = {
  Open:        { background: '#fee2e2', color: '#dc2626' },
  'In Progress': { background: '#fef3c7', color: '#d97706' },
  Resolved:    { background: '#dcfce7', color: '#16a34a' },
  Closed:      { background: '#f3f4f6', color: '#6b7280' }
};

const EMPTY_STUDENT = {
  full_name: '', index_number: '', programme_id: '', level: '100',
  semester: '1', nationality: 'Ghanaian', gender: '', email: '', phone: ''
};

const EMPTY_REVIEW = {
  category: 'General', priority: 'Medium', description: ''
};

export default function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProg, setFilterProg] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  // Student form modal
  const [studentModal, setStudentModal] = useState(null); // null | 'add' | 'edit'
  const [selected, setSelected] = useState(null);
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT);

  // Review modal
  const [reviewModal, setReviewModal] = useState(null); // null | student object
  const [reviewForm, setReviewForm] = useState(EMPTY_REVIEW);
  const [reviewSaving, setReviewSaving] = useState(false);

  // Review list modal
  const [reviewListModal, setReviewListModal] = useState(null); // null | student object
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewForm, setEditReviewForm] = useState({});

  const load = async () => {
    setLoading(true);
    const params = {};
    if (filterProg)  params.programme_id = filterProg;
    if (filterLevel) params.level = filterLevel;
    if (search)      params.search = search;
    try {
      const [s, p] = await Promise.all([
        axios.get(`${API}/students`, { params }),
        axios.get(`${API}/students/meta/programmes`)
      ]);
      setStudents(s.data);
      setProgrammes(p.data);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterProg, filterLevel]);

  const handleSearch = (e) => { e.preventDefault(); load(); };

  const openAdd = () => {
    setStudentForm(EMPTY_STUDENT);
    setSelected(null);
    setStudentModal('add');
  };

  const openEdit = (s) => {
    setSelected(s);
    setStudentForm({
      full_name: s.full_name, index_number: s.index_number,
      programme_id: s.programme_id || '', level: s.level,
      semester: s.semester, nationality: s.nationality || 'Ghanaian',
      gender: s.gender || '', email: s.email || '', phone: s.phone || ''
    });
    setStudentModal('edit');
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (studentModal === 'add') {
        await axios.post(`${API}/students`, studentForm);
        toast.success('Student added successfully');
      } else {
        await axios.put(`${API}/students/${selected.id}`, { ...studentForm, status: selected.status });
        toast.success('Student updated');
      }
      setStudentModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  // Open review creation modal
  const openReview = (student) => {
    setReviewModal(student);
    setReviewForm(EMPTY_REVIEW);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.description.trim()) {
      toast.error('Description is required');
      return;
    }
    setReviewSaving(true);
    try {
      await axios.post(`${API}/students/${reviewModal.id}/reviews`, reviewForm);
      toast.success(`Review opened for ${reviewModal.full_name}`);
      setReviewModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create review');
    } finally {
      setReviewSaving(false);
    }
  };

  // Open reviews list modal
  const openReviewList = async (student) => {
    setReviewListModal(student);
    setReviewsLoading(true);
    try {
      const r = await axios.get(`${API}/students/${student.id}/reviews`);
      setReviews(r.data);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const startEditReview = (review) => {
    setEditingReview(review.id);
    setEditReviewForm({ status: review.status, resolution: review.resolution || '', priority: review.priority });
  };

  const saveReviewEdit = async (review) => {
    try {
      await axios.put(`${API}/students/${reviewListModal.id}/reviews/${review.id}`, editReviewForm);
      toast.success('Review updated');
      setEditingReview(null);
      const r = await axios.get(`${API}/students/${reviewListModal.id}/reviews`);
      setReviews(r.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const progTypeColor = { degree: 'badge-info', diploma: 'badge-gold', certificate: 'badge-warning' };

  const sf = (k, v) => setStudentForm(prev => ({ ...prev, [k]: v }));
  const rf = (k, v) => setReviewForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Students</h1>
          <p>Manage all enrolled students across all programmes</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Student
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <div className="search-bar">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="form-control" placeholder="Search by name or index number..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260, paddingLeft: 34 }} />
            </div>
            <button className="btn btn-outline" type="submit">Search</button>
          </form>
          <select className="form-control" style={{ width: 200 }} value={filterProg} onChange={e => setFilterProg(e.target.value)}>
            <option value="">All Programmes</option>
            {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="form-control" style={{ width: 130 }} value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
            <option value="">All Levels</option>
            {[100, 200, 300, 400].map(l => <option key={l} value={l}>Level {l}</option>)}
          </select>
          <span style={{ fontSize: 13, color: 'var(--tuc-muted)', alignSelf: 'center' }}>
            {students.length} student{students.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Index No.</th>
                  <th>Full Name</th>
                  <th>Programme</th>
                  <th>Type</th>
                  <th>Level</th>
                  <th>Sem</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--tuc-muted)' }}>No students found</td></tr>
                ) : students.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--tuc-muted)', fontSize: 12 }}>{i + 1}</td>
                    <td><span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--tuc-maroon)' }}>{s.index_number}</span></td>
                    <td style={{ fontWeight: 500 }}>{s.full_name}</td>
                    <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.programme}</td>
                    <td><span className={`badge ${progTypeColor[s.programme_type] || 'badge-draft'}`}>{s.programme_type}</span></td>
                    <td>L{s.level}</td>
                    <td>S{s.semester}</td>
                    <td>
                      <span className={`badge ${s.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{s.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                        <button
                          className="btn btn-sm"
                          style={{ background: 'rgba(107,0,32,0.08)', color: 'var(--tuc-maroon)', border: '1.5px solid var(--tuc-maroon)' }}
                          onClick={() => openReview(s)}
                        >
                          Review
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: '1.5px solid #2563eb' }}
                          onClick={() => openReviewList(s)}
                        >
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student add/edit modal */}
      {studentModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setStudentModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{studentModal === 'add' ? 'Add New Student' : 'Edit Student'}</span>
              <button className="btn-icon" onClick={() => setStudentModal(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleStudentSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" value={studentForm.full_name} onChange={e => sf('full_name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Index Number *</label>
                  <input className="form-control" value={studentForm.index_number} onChange={e => sf('index_number', e.target.value)} required disabled={studentModal === 'edit'} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Programme *</label>
                <select className="form-control" value={studentForm.programme_id} onChange={e => sf('programme_id', e.target.value)} required>
                  <option value="">Select Programme</option>
                  {programmes.map(p => <option key={p.id} value={p.id}>{p.name} ({p.programme_type})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Level *</label>
                  <select className="form-control" value={studentForm.level} onChange={e => sf('level', e.target.value)} required>
                    {[100, 200, 300, 400].map(l => <option key={l} value={l}>Level {l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Semester *</label>
                  <select className="form-control" value={studentForm.semester} onChange={e => sf('semester', e.target.value)} required>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-control" value={studentForm.gender} onChange={e => sf('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nationality</label>
                  <input className="form-control" value={studentForm.nationality} onChange={e => sf('nationality', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" value={studentForm.email} onChange={e => sf('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={studentForm.phone} onChange={e => sf('phone', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setStudentModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{studentModal === 'add' ? 'Add Student' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review creation modal */}
      {reviewModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setReviewModal(null)}>
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Open Student Review</div>
                <div style={{ fontSize: 12, color: 'var(--tuc-muted)', marginTop: 2 }}>
                  {reviewModal.full_name}
                  <span style={{ fontFamily: 'monospace', color: 'var(--tuc-maroon)', marginLeft: 8 }}>{reviewModal.index_number}</span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setReviewModal(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={reviewForm.category} onChange={e => rf('category', e.target.value)}>
                    {['Academic Standing', 'Enrollment Issue', 'Grade Dispute', 'Documents', 'General'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-control" value={reviewForm.priority} onChange={e => rf('priority', e.target.value)}>
                    {['Low', 'Medium', 'High', 'Critical'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={reviewForm.description}
                  onChange={e => rf('description', e.target.value)}
                  placeholder="Describe the issue clearly..."
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setReviewModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={reviewSaving}>
                  {reviewSaving ? 'Saving...' : 'Open Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review history modal */}
      {reviewListModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setReviewListModal(null)}>
          <div className="modal" style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Review History</div>
                <div style={{ fontSize: 12, color: 'var(--tuc-muted)', marginTop: 2 }}>
                  {reviewListModal.full_name}
                  <span style={{ fontFamily: 'monospace', color: 'var(--tuc-maroon)', marginLeft: 8 }}>{reviewListModal.index_number}</span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => { setReviewListModal(null); setEditingReview(null); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {reviewsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}><div className="spinner" /></div>
            ) : reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--tuc-muted)', fontSize: 13 }}>
                No reviews on record for this student.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 480, overflowY: 'auto' }}>
                {reviews.map(review => (
                  <div key={review.id} style={{ border: '1px solid var(--tuc-border)', borderRadius: 10, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12, ...PRIORITY_COLORS[review.priority] }}>
                          {review.priority}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12, ...STATUS_COLORS[review.status] }}>
                          {review.status}
                        </span>
                        <span className="badge badge-draft" style={{ fontSize: 11 }}>{review.category}</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--tuc-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, marginBottom: 6, color: 'var(--tuc-text)' }}>{review.description}</p>
                    {review.resolution && (
                      <p style={{ fontSize: 12, color: 'var(--tuc-muted)', fontStyle: 'italic', marginBottom: 6 }}>
                        Resolution: {review.resolution}
                      </p>
                    )}
                    <div style={{ fontSize: 11, color: 'var(--tuc-muted)', marginBottom: 8 }}>
                      Opened by {review.reviewer_name}
                    </div>

                    {editingReview === review.id ? (
                      <div style={{ borderTop: '1px solid var(--tuc-border)', paddingTop: 10, marginTop: 6 }}>
                        <div className="form-row" style={{ marginBottom: 8 }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Status</label>
                            <select className="form-control" value={editReviewForm.status} onChange={e => setEditReviewForm(p => ({ ...p, status: e.target.value }))}>
                              {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Priority</label>
                            <select className="form-control" value={editReviewForm.priority} onChange={e => setEditReviewForm(p => ({ ...p, priority: e.target.value }))}>
                              {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 8 }}>
                          <label className="form-label">Resolution Notes</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            value={editReviewForm.resolution}
                            onChange={e => setEditReviewForm(p => ({ ...p, resolution: e.target.value }))}
                            style={{ resize: 'vertical' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-primary btn-sm" onClick={() => saveReviewEdit(review)}>Save</button>
                          <button className="btn btn-outline btn-sm" onClick={() => setEditingReview(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      review.status !== 'Closed' && (
                        <button className="btn btn-outline btn-sm" onClick={() => startEditReview(review)}>Update</button>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button className="btn btn-outline btn-sm" onClick={() => { setReviewListModal(null); openReview(reviewListModal); }}>
                New Review
              </button>
              <button className="btn btn-outline" onClick={() => { setReviewListModal(null); setEditingReview(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
