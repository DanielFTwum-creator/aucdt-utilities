import { useState, useEffect } from 'react';
import {
  ScholarshipApplication,
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../services/api';

const empty: Partial<ScholarshipApplication> = {
  scholarship_id: '',
  applicant_name: '',
  gpa: 0,
  application_date: '',
  approval_status: 'pending',
  amount_awarded: 0,
};

export default function ScholarshipApplicationsView() {
  const [items, setItems] = useState<ScholarshipApplication[]>([]);
  const [form, setForm] = useState<Partial<ScholarshipApplication>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setItems(await getApplications());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startEdit(item: ScholarshipApplication) {
    setForm({ ...item });
    setEditId(item.id);
    setShowForm(true);
  }

  function startAdd() {
    setForm({ ...empty });
    setEditId(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await updateApplication(editId, form);
      } else {
        await createApplication(form);
      }
      setShowForm(false);
      setForm({ ...empty });
      setEditId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this application?')) return;
    try {
      await deleteApplication(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Scholarship Applications</h2>
        <button
          onClick={() => (showForm && !editId ? setShowForm(false) : startAdd())}
          className="bg-yellow-800 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
        >
          {showForm && !editId ? 'Cancel' : '+ Add Application'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4 bg-red-50 p-3 rounded">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">{editId ? 'Edit Application' : 'New Application'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship ID</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={form.scholarship_id || ''} onChange={e => setForm(f => ({ ...f, scholarship_id: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Name</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={form.applicant_name || ''} onChange={e => setForm(f => ({ ...f, applicant_name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
              <input type="number" step="0.01" min="0" max="4" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={form.gpa || ''} onChange={e => setForm(f => ({ ...f, gpa: parseFloat(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
              <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={form.application_date || ''} onChange={e => setForm(f => ({ ...f, application_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={form.approval_status || 'pending'} onChange={e => setForm(f => ({ ...f, approval_status: e.target.value }))}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Awarded</label>
              <input type="number" step="0.01" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={form.amount_awarded || ''} onChange={e => setForm(f => ({ ...f, amount_awarded: parseFloat(e.target.value) }))} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-yellow-800 text-white px-6 py-2 rounded hover:bg-yellow-700 transition-colors">
              {editId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No applications found. Add one to get started.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Applicant</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Scholarship ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">GPA</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Amount Awarded</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.applicant_name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{item.scholarship_id}</td>
                  <td className="px-4 py-3 text-gray-600">{item.gpa}</td>
                  <td className="px-4 py-3 text-gray-600">{item.application_date ? item.application_date.slice(0, 10) : '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.approval_status === 'approved' ? 'bg-green-100 text-green-700' : item.approval_status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.approval_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">GHS {item.amount_awarded ? Number(item.amount_awarded).toFixed(2) : '0.00'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => startEdit(item)} className="text-yellow-700 hover:text-yellow-900 font-medium">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
