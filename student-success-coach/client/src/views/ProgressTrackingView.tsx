import { useState, useEffect } from 'react';
import {
  ProgressRecord,
  getProgressRecords,
  createProgressRecord,
  updateProgressRecord,
  deleteProgressRecord,
} from '../services/api';

const empty: Partial<ProgressRecord> = {
  student_id: '',
  coaching_session_id: '',
  gpa: 0,
  attendance_rate: 0,
  assignment_completion: 0,
  improvement_score: 0,
  notes: '',
};

export default function ProgressTrackingView() {
  const [items, setItems] = useState<ProgressRecord[]>([]);
  const [form, setForm] = useState<Partial<ProgressRecord>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setItems(await getProgressRecords());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startEdit(item: ProgressRecord) {
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
        await updateProgressRecord(editId, form);
      } else {
        await createProgressRecord(form);
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
    if (!confirm('Delete this record?')) return;
    try {
      await deleteProgressRecord(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Progress Tracking</h2>
        <button
          onClick={() => (showForm && !editId ? setShowForm(false) : startAdd())}
          className="bg-rose-800 text-white px-4 py-2 rounded hover:bg-rose-700 transition-colors"
        >
          {showForm && !editId ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4 bg-red-50 p-3 rounded">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">{editId ? 'Edit Record' : 'New Progress Record'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.student_id || ''} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coaching Session ID</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.coaching_session_id || ''} onChange={e => setForm(f => ({ ...f, coaching_session_id: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
              <input type="number" step="0.01" min="0" max="4" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.gpa || ''} onChange={e => setForm(f => ({ ...f, gpa: parseFloat(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Rate (%)</label>
              <input type="number" step="0.01" min="0" max="100" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.attendance_rate || ''} onChange={e => setForm(f => ({ ...f, attendance_rate: parseFloat(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Completion (%)</label>
              <input type="number" step="0.01" min="0" max="100" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.assignment_completion || ''} onChange={e => setForm(f => ({ ...f, assignment_completion: parseFloat(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Improvement Score</label>
              <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.improvement_score || ''} onChange={e => setForm(f => ({ ...f, improvement_score: parseInt(e.target.value) }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" rows={3} value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-rose-800 text-white px-6 py-2 rounded hover:bg-rose-700 transition-colors">
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
        <p className="text-gray-500">No progress records found. Add one to get started.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Student ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">GPA</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Attendance</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Assignment %</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Improvement</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Notes</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.student_id}</td>
                  <td className="px-4 py-3 text-gray-600">{item.gpa}</td>
                  <td className="px-4 py-3 text-gray-600">{item.attendance_rate}%</td>
                  <td className="px-4 py-3 text-gray-600">{item.assignment_completion}%</td>
                  <td className="px-4 py-3 text-gray-600">{item.improvement_score}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{item.notes}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => startEdit(item)} className="text-rose-700 hover:text-rose-900 font-medium">Edit</button>
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
