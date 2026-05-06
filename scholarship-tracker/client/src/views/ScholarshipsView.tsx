import { useState, useEffect } from 'react';
import {
  Scholarship,
  getScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} from '../services/api';

const empty: Partial<Scholarship> = {
  scholarship_name: '',
  award_amount: 0,
  eligibility_criteria: '',
  deadline_date: '',
  provider: '',
  status: 'open',
};

export default function ScholarshipsView() {
  const [items, setItems] = useState<Scholarship[]>([]);
  const [form, setForm] = useState<Partial<Scholarship>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setItems(await getScholarships());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startEdit(item: Scholarship) {
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
        await updateScholarship(editId, form);
      } else {
        await createScholarship(form);
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
    if (!confirm('Delete this scholarship?')) return;
    try {
      await deleteScholarship(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Scholarships</h2>
        <button
          onClick={() => (showForm && !editId ? setShowForm(false) : startAdd())}
          className="bg-yellow-800 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
        >
          {showForm && !editId ? 'Cancel' : '+ Add Scholarship'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4 bg-red-50 p-3 rounded">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">{editId ? 'Edit Scholarship' : 'New Scholarship'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Name</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={form.scholarship_name || ''} onChange={e => setForm(f => ({ ...f, scholarship_name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={form.provider || ''} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Award Amount</label>
              <input type="number" step="0.01" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={form.award_amount || ''} onChange={e => setForm(f => ({ ...f, award_amount: parseFloat(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Date</label>
              <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={form.deadline_date || ''} onChange={e => setForm(f => ({ ...f, deadline_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" value={form.status || 'open'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
              <textarea className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" rows={3} value={form.eligibility_criteria || ''} onChange={e => setForm(f => ({ ...f, eligibility_criteria: e.target.value }))} />
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
        <p className="text-gray-500">No scholarships found. Add one to get started.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Provider</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Deadline</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.scholarship_name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.provider}</td>
                  <td className="px-4 py-3 text-gray-600">GHS {Number(item.award_amount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{item.deadline_date ? item.deadline_date.slice(0, 10) : '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.status === 'open' ? 'bg-green-100 text-green-700' : item.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.status}
                    </span>
                  </td>
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
