import { useState, useEffect } from 'react';
import {
  CoachingSession,
  getCoachingSessions,
  createCoachingSession,
  updateCoachingSession,
  deleteCoachingSession,
} from '../services/api';

const empty: Partial<CoachingSession> = {
  student_id: '',
  coach_name: '',
  session_date: '',
  session_topic: '',
  duration_minutes: 60,
  focus_area: '',
  status: 'scheduled',
};

export default function CoachingSessionsView() {
  const [items, setItems] = useState<CoachingSession[]>([]);
  const [form, setForm] = useState<Partial<CoachingSession>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setItems(await getCoachingSessions());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startEdit(item: CoachingSession) {
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
        await updateCoachingSession(editId, form);
      } else {
        await createCoachingSession(form);
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
    if (!confirm('Delete this session?')) return;
    try {
      await deleteCoachingSession(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Coaching Sessions</h2>
        <button
          onClick={() => (showForm && !editId ? setShowForm(false) : startAdd())}
          className="bg-rose-800 text-white px-4 py-2 rounded hover:bg-rose-700 transition-colors"
        >
          {showForm && !editId ? 'Cancel' : '+ Add Session'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4 bg-red-50 p-3 rounded">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">{editId ? 'Edit Session' : 'New Session'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.student_id || ''} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coach Name</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.coach_name || ''} onChange={e => setForm(f => ({ ...f, coach_name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Date</label>
              <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.session_date || ''} onChange={e => setForm(f => ({ ...f, session_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Topic</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.session_topic || ''} onChange={e => setForm(f => ({ ...f, session_topic: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.duration_minutes || ''} onChange={e => setForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Focus Area</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.focus_area || ''} onChange={e => setForm(f => ({ ...f, focus_area: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.status || 'scheduled'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
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
        <p className="text-gray-500">No coaching sessions found. Add one to get started.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Student ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Coach</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Topic</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Duration</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{item.student_id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.coach_name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.session_date ? item.session_date.slice(0, 10) : '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{item.session_topic}</td>
                  <td className="px-4 py-3 text-gray-600">{item.duration_minutes} min</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.status === 'completed' ? 'bg-green-100 text-green-700' : item.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.status}
                    </span>
                  </td>
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
