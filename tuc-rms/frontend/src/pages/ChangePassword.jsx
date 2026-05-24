import { useState } from 'react';
import axios from 'axios';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ChangePassword() {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) return toast.error('Passwords do not match');
    if (form.new_password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.post(`${API}/auth/change-password`, { current_password: form.current_password, new_password: form.new_password });
      toast.success('Password changed successfully');
      setForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Change Password</h1>
        <p>Update your account security credentials</p>
      </div>
      <div className="card" style={{ maxWidth: 460 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Current Password *</label>
            <input className="form-control" type="password" value={form.current_password} onChange={e => setForm({...form, current_password: e.target.value})} required placeholder="Enter current password" />
          </div>
          <div className="form-group">
            <label className="form-label">New Password *</label>
            <input className="form-control" type="password" value={form.new_password} onChange={e => setForm({...form, new_password: e.target.value})} required placeholder="Minimum 6 characters" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password *</label>
            <input className="form-control" type="password" value={form.confirm_password} onChange={e => setForm({...form, confirm_password: e.target.value})} required placeholder="Repeat new password" />
          </div>
          <div className="info-box" style={{ marginBottom: 16 }}>After changing your password, you'll need to use the new password at next login.</div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
