import React, { useEffect, useState } from 'react';
import {
  AlumniProfile,
  getAlumniProfiles,
  createAlumniProfile,
  updateAlumniProfile,
  deleteAlumniProfile,
} from '../services/api';

const empty: Omit<AlumniProfile, 'id' | 'created_at'> = {
  alumni_name: '',
  graduation_year: null,
  current_job_title: '',
  company: '',
  location: '',
  bio: '',
  profile_verified: false,
};

export default function AlumniProfilesView() {
  const [rows, setRows] = useState<AlumniProfile[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setRows(await getAlumniProfiles());
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
        await updateAlumniProfile(editId, form);
      } else {
        await createAlumniProfile(form);
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

  const handleEdit = (row: AlumniProfile) => {
    setEditId(row.id);
    setForm({
      alumni_name: row.alumni_name,
      graduation_year: row.graduation_year,
      current_job_title: row.current_job_title,
      company: row.company,
      location: row.location,
      bio: row.bio,
      profile_verified: row.profile_verified,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this profile?')) return;
    try {
      await deleteAlumniProfile(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Alumni Profiles</h2>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.alumni_name}
            onChange={e => setForm({ ...form, alumni_name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
          <input type="number" className="border rounded px-3 py-1.5 w-full text-sm"
            value={form.graduation_year ?? ''}
            onChange={e => setForm({ ...form, graduation_year: e.target.value ? parseInt(e.target.value) : null })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.current_job_title}
            onChange={e => setForm({ ...form, current_job_title: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })} />
        </div>
        <div className="flex items-center gap-2 mt-5">
          <input type="checkbox" id="verified" checked={form.profile_verified}
            onChange={e => setForm({ ...form, profile_verified: e.target.checked })} />
          <label htmlFor="verified" className="text-sm text-gray-700">Profile Verified</label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea className="border rounded px-3 py-1.5 w-full text-sm" rows={3} value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" disabled={loading}
            className="bg-indigo-800 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm disabled:opacity-50">
            {loading ? 'Saving...' : editId ? 'Update Profile' : 'Add Profile'}
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
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">Job Title</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Verified</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.alumni_name}</td>
                <td className="px-4 py-3">{row.graduation_year}</td>
                <td className="px-4 py-3">{row.current_job_title}</td>
                <td className="px-4 py-3">{row.company}</td>
                <td className="px-4 py-3">{row.location}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${row.profile_verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {row.profile_verified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(row)}
                    className="text-indigo-700 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(row.id)}
                    className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No profiles found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
