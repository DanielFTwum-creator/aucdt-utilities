import React, { useEffect, useState } from 'react';
import {
  getMentors,
  createMentor,
  updateMentor,
  deleteMentor,
  type Mentor,
} from '../services/api';

const empty: Partial<Mentor> = {
  mentor_name: '',
  expertise_area: '',
  years_experience: undefined,
  bio: '',
  availability: '',
  max_mentees: undefined,
  current_mentees: 0,
  rating: undefined,
};

export default function MentorsView() {
  const [items, setItems] = useState<Mentor[]>([]);
  const [form, setForm] = useState<Partial<Mentor>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getMentors());
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
        await updateMentor(editId, form);
      } else {
        await createMentor(form);
      }
      setForm(empty);
      setEditId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleEdit = (item: Mentor) => {
    setEditId(item.id);
    setForm({
      mentor_name: item.mentor_name,
      expertise_area: item.expertise_area,
      years_experience: item.years_experience ?? undefined,
      bio: item.bio ?? '',
      availability: item.availability ?? '',
      max_mentees: item.max_mentees ?? undefined,
      current_mentees: item.current_mentees,
      rating: item.rating ?? undefined,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mentor and all their mentees?')) return;
    try {
      await deleteMentor(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-violet-900">Mentors</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow rounded p-4 grid grid-cols-2 gap-4">
        <div className="col-span-2 font-semibold text-violet-800">
          {editId ? 'Edit Mentor' : 'Add Mentor'}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Mentor Name</label>
          <input
            required
            value={form.mentor_name ?? ''}
            onChange={e => setForm(f => ({ ...f, mentor_name: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Expertise Area</label>
          <input
            required
            value={form.expertise_area ?? ''}
            onChange={e => setForm(f => ({ ...f, expertise_area: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Years Experience</label>
          <input
            type="number"
            min={0}
            value={form.years_experience ?? ''}
            onChange={e => setForm(f => ({ ...f, years_experience: e.target.value ? Number(e.target.value) : undefined }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Availability</label>
          <input
            value={form.availability ?? ''}
            onChange={e => setForm(f => ({ ...f, availability: e.target.value }))}
            placeholder="e.g. weekdays, weekends"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Max Mentees</label>
          <input
            type="number"
            min={0}
            value={form.max_mentees ?? ''}
            onChange={e => setForm(f => ({ ...f, max_mentees: e.target.value ? Number(e.target.value) : undefined }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Rating (0-5)</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.01}
            value={form.rating ?? ''}
            onChange={e => setForm(f => ({ ...f, rating: e.target.value ? Number(e.target.value) : undefined }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Bio</label>
          <textarea
            value={form.bio ?? ''}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
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
                <th className="px-4 py-2 text-left">Expertise</th>
                <th className="px-4 py-2 text-left">Exp (yrs)</th>
                <th className="px-4 py-2 text-left">Availability</th>
                <th className="px-4 py-2 text-left">Mentees</th>
                <th className="px-4 py-2 text-left">Rating</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-slate-400">No mentors found</td>
                </tr>
              )}
              {items.map(item => (
                <tr key={item.id} className="border-t hover:bg-violet-50">
                  <td className="px-4 py-2 font-mono text-xs text-slate-500">{item.id}</td>
                  <td className="px-4 py-2 font-medium">{item.mentor_name}</td>
                  <td className="px-4 py-2">{item.expertise_area}</td>
                  <td className="px-4 py-2">{item.years_experience ?? '—'}</td>
                  <td className="px-4 py-2">{item.availability ?? '—'}</td>
                  <td className="px-4 py-2">{item.current_mentees}/{item.max_mentees ?? '∞'}</td>
                  <td className="px-4 py-2">{item.rating ?? '—'}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => handleEdit(item)} className="text-violet-700 hover:text-violet-900 underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 underline text-xs">Delete</button>
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
