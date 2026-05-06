import React, { useEffect, useState } from 'react';
import {
  getMentees,
  getMentors,
  createMentee,
  updateMentee,
  deleteMentee,
  type Mentee,
  type Mentor,
} from '../services/api';

const empty: Partial<Mentee> = {
  mentor_id: '',
  mentee_name: '',
  learning_goals: '',
  matching_date: '',
  progress_score: 0,
  meeting_frequency: '',
  program_status: 'active',
};

export default function MenteesView() {
  const [items, setItems] = useState<Mentee[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [form, setForm] = useState<Partial<Mentee>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [mentees, mntrs] = await Promise.all([getMentees(), getMentors()]);
      setItems(mentees);
      setMentors(mntrs);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await updateMentee(editId, form);
      } else {
        await createMentee(form);
      }
      setForm(empty);
      setEditId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleEdit = (item: Mentee) => {
    setEditId(item.id);
    setForm({
      mentor_id: item.mentor_id,
      mentee_name: item.mentee_name,
      learning_goals: item.learning_goals ?? '',
      matching_date: item.matching_date ?? '',
      progress_score: item.progress_score,
      meeting_frequency: item.meeting_frequency ?? '',
      program_status: item.program_status,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mentee?')) return;
    try {
      await deleteMentee(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-violet-900">Mentees</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow rounded p-4 grid grid-cols-2 gap-4">
        <div className="col-span-2 font-semibold text-violet-800">
          {editId ? 'Edit Mentee' : 'Add Mentee'}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Mentor</label>
          <select
            required
            value={form.mentor_id ?? ''}
            onChange={e => setForm(f => ({ ...f, mentor_id: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Select mentor...</option>
            {mentors.map(m => (
              <option key={m.id} value={m.id}>{m.mentor_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Mentee Name</label>
          <input
            required
            value={form.mentee_name ?? ''}
            onChange={e => setForm(f => ({ ...f, mentee_name: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Matching Date</label>
          <input
            type="date"
            value={form.matching_date ?? ''}
            onChange={e => setForm(f => ({ ...f, matching_date: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Progress Score (0-100)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.progress_score ?? 0}
            onChange={e => setForm(f => ({ ...f, progress_score: Number(e.target.value) }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Meeting Frequency</label>
          <input
            value={form.meeting_frequency ?? ''}
            onChange={e => setForm(f => ({ ...f, meeting_frequency: e.target.value }))}
            placeholder="e.g. weekly, biweekly"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Program Status</label>
          <select
            value={form.program_status ?? 'active'}
            onChange={e => setForm(f => ({ ...f, program_status: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Learning Goals</label>
          <textarea
            value={form.learning_goals ?? ''}
            onChange={e => setForm(f => ({ ...f, learning_goals: e.target.value }))}
            rows={2}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="col-span-2 flex gap-2">
          <button type="submit" className="bg-violet-800 text-white px-4 py-2 rounded hover:bg-violet-700 text-sm">
            {editId ? 'Update' : 'Create'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => { setEditId(null); setForm(empty); }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white shadow rounded">
            <thead className="bg-violet-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Mentor</th>
                <th className="px-4 py-2 text-left">Progress</th>
                <th className="px-4 py-2 text-left">Frequency</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-slate-400">No mentees found</td>
                </tr>
              )}
              {items.map(item => {
                const mentor = mentors.find(m => m.id === item.mentor_id);
                return (
                  <tr key={item.id} className="border-t hover:bg-violet-50">
                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{item.id}</td>
                    <td className="px-4 py-2 font-medium">{item.mentee_name}</td>
                    <td className="px-4 py-2">{mentor ? mentor.mentor_name : item.mentor_id}</td>
                    <td className="px-4 py-2">{item.progress_score}%</td>
                    <td className="px-4 py-2">{item.meeting_frequency ?? '—'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        item.program_status === 'active' ? 'bg-green-100 text-green-700' :
                        item.program_status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        item.program_status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.program_status}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-violet-700 hover:text-violet-900 underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 underline text-xs">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
