import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import toast from 'react-hot-toast'

const roleColors = { registrar: 'badge-danger', qa_officer: 'badge-info', lecturer: 'badge-gold', hod: 'badge-success' };
const roleLabels = { registrar: 'Registrar', qa_officer: 'QA Officer', lecturer: 'Lecturer', hod: 'Head of Dept' };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'lecturer', department: '', staff_id: '', is_active: true });
  const [resetModal, setResetModal] = useState(null);

  const load = () => {
    setLoading(true);
    axios.get(`${API}/users`).then(r => setUsers(r.data)).catch(() => toast.error('Failed to load users')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ full_name: '', email: '', password: 'TUC@2026', role: 'lecturer', department: '', staff_id: '', is_active: true });
    setModal('add');
  };

  const openEdit = (u) => {
    setSelected(u);
    setForm({ full_name: u.full_name, email: u.email, password: '', role: u.role, department: u.department || '', staff_id: u.staff_id || '', is_active: u.is_active });
    setModal('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'add') {
        await axios.post(`${API}/users`, form);
        toast.success('User created successfully');
      } else {
        await axios.put(`${API}/users/${selected.id}`, form);
        toast.success('User updated');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleReset = async () => {
    try {
      const r = await axios.post(`${API}/users/${resetModal.id}/reset-password`);
      toast.success(r.data.message);
      setResetModal(null);
    } catch (err) {
      toast.error('Reset failed');
    }
  };

  const depts = ['DMCD', 'FDT', 'JDT', 'PDE', 'Administration'];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>User Management</h1>
          <p>Manage staff accounts - Registrar, QA Officers, and Lecturers</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add User</button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Staff ID</th><th>Full Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ color: 'var(--tuc-muted)', fontSize: 12 }}>{i + 1}</td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{u.staff_id || '—'}</span></td>
                    <td style={{ fontWeight: 500 }}>{u.full_name}</td>
                    <td style={{ fontSize: 12, color: 'var(--tuc-muted)' }}>{u.email}</td>
                    <td><span className={`badge ${roleColors[u.role] || 'badge-draft'}`}>{roleLabels[u.role] || u.role}</span></td>
                    <td>{u.department || '—'}</td>
                    <td><span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(u)}>Edit</button>
                        <button className="btn btn-sm" onClick={() => setResetModal(u)} style={{ background: '#f3f4f6', color: '#666', border: 'none' }}>Reset Pwd</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{modal === 'add' ? 'Add New User' : 'Edit User'}</span>
              <button className="btn-icon" onClick={() => setModal(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Staff ID</label>
                  <input className="form-control" value={form.staff_id} onChange={e => setForm({...form, staff_id: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-control" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              {modal === 'add' && (
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input className="form-control" type="text" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className="form-control" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required>
                    <option value="lecturer">Lecturer</option>
                    <option value="hod">Head of Department</option>
                    <option value="qa_officer">QA Officer</option>
                    <option value="registrar">Registrar</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-control" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                    <option value="">Select Dept</option>
                    {depts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              {modal === 'edit' && (
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={form.is_active ? '1' : '0'} onChange={e => setForm({...form, is_active: e.target.value === '1'})}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modal === 'add' ? 'Create User' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {resetModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setResetModal(null)}>
          <div className="modal" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <span className="modal-title">Reset Password</span>
              <button className="btn-icon" onClick={() => setResetModal(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--tuc-muted)', marginBottom: 16 }}>
              Reset password for <strong>{resetModal.full_name}</strong> to the default: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>TUC@2026</code>
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setResetModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReset}>Reset Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
