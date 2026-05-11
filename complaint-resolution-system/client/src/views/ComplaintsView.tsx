import React, { useEffect, useState } from 'react';
import {
  Complaint,
  getComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from '../services/api';

const empty: Omit<Complaint, 'id' | 'created_at'> = {
  complainant_name: '',
  contact_email: '',
  complaint_category: '',
  complaint_description: '',
  severity_level: 'medium',
  complaint_date: '',
  status: 'open',
};

export default function ComplaintsView() {
  const [rows, setRows] = useState<Complaint[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setRows(await getComplaints());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Load failed');
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editId) {
        await updateComplaint(editId, form);
      } else {
        await createComplaint(form);
      }
      setForm(empty);
      setEditId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row: Complaint) => {
    setEditId(row.id);
    setForm({
      complainant_name: row.complainant_name,
      contact_email: row.contact_email,
      complaint_category: row.complaint_category,
      complaint_description: row.complaint_description,
      severity_level: row.severity_level,
      complaint_date: row.complaint_date,
      status: row.status,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this complaint? All associated resolutions will also be deleted.')) return;
    try {
      await deleteComplaint(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const severityColor = (s: string) =>
    s === 'high' ? 'bg-red-100 text-red-700'
    : s === 'medium' ? 'bg-yellow-100 text-yellow-700'
    : 'bg-green-100 text-green-700';

  const statusColor = (s: string) =>
    s === 'resolved' ? 'bg-green-100 text-green-700'
    : s === 'open' ? 'bg-red-100 text-red-700'
    : 'bg-yellow-100 text-yellow-700';

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Complaints</h2>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Complainant Name</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.complainant_name}
            onChange={e => setForm({ ...form, complainant_name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
          <input type="email" className="border rounded px-3 py-1.5 w-full text-sm" value={form.contact_email}
            onChange={e => setForm({ ...form, contact_email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.complaint_category}
            onChange={e => setForm({ ...form, complaint_category: e.target.value })}
            placeholder="e.g. Academic, Financial, Facilities" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Date</label>
          <input type="date" className="border rounded px-3 py-1.5 w-full text-sm" value={form.complaint_date}
            onChange={e => setForm({ ...form, complaint_date: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Severity Level</label>
          <select className="border rounded px-3 py-1.5 w-full text-sm" value={form.severity_level}
            onChange={e => setForm({ ...form, severity_level: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="border rounded px-3 py-1.5 w-full text-sm" value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea className="border rounded px-3 py-1.5 w-full text-sm" rows={3}
            value={form.complaint_description}
            onChange={e => setForm({ ...form, complaint_description: e.target.value })} />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" disabled={loading}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 text-sm disabled:opacity-50">
            {loading ? 'Saving...' : editId ? 'Update Complaint' : 'Add Complaint'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm(empty); }}
              className="border px-4 py-2 rounded text-sm hover:bg-gray-50">Cancel</button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Complainant</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Severity</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.complainant_name}</td>
                <td className="px-4 py-3">{row.contact_email}</td>
                <td className="px-4 py-3">{row.complaint_category}</td>
                <td className="px-4 py-3">{row.complaint_date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${severityColor(row.severity_level)}`}>
                    {row.severity_level}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(row)}
                    className="text-red-700 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(row.id)}
                    className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No complaints found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
