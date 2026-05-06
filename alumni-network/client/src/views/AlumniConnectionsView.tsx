import React, { useEffect, useState } from 'react';
import {
  AlumniConnection,
  AlumniProfile,
  getAlumniConnections,
  createAlumniConnection,
  updateAlumniConnection,
  deleteAlumniConnection,
  getAlumniProfiles,
} from '../services/api';

const empty: Omit<AlumniConnection, 'id' | 'created_at'> = {
  alumni_id_1: '',
  alumni_id_2: '',
  connection_date: '',
  connection_strength: '',
  shared_interests: '',
};

export default function AlumniConnectionsView() {
  const [rows, setRows] = useState<AlumniConnection[]>([]);
  const [profiles, setProfiles] = useState<AlumniProfile[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [conns, profs] = await Promise.all([getAlumniConnections(), getAlumniProfiles()]);
      setRows(conns);
      setProfiles(profs);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Load failed');
    }
  };

  useEffect(() => { load(); }, []);

  const profileName = (id: string) => profiles.find(p => p.id === id)?.alumni_name ?? id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editId) {
        await updateAlumniConnection(editId, form);
      } else {
        await createAlumniConnection(form);
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

  const handleEdit = (row: AlumniConnection) => {
    setEditId(row.id);
    setForm({
      alumni_id_1: row.alumni_id_1,
      alumni_id_2: row.alumni_id_2,
      connection_date: row.connection_date,
      connection_strength: row.connection_strength,
      shared_interests: row.shared_interests,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this connection?')) return;
    try {
      await deleteAlumniConnection(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Alumni Connections</h2>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alumni 1</label>
          <select className="border rounded px-3 py-1.5 w-full text-sm" value={form.alumni_id_1}
            onChange={e => setForm({ ...form, alumni_id_1: e.target.value })} required>
            <option value="">Select alumni...</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.alumni_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alumni 2</label>
          <select className="border rounded px-3 py-1.5 w-full text-sm" value={form.alumni_id_2}
            onChange={e => setForm({ ...form, alumni_id_2: e.target.value })} required>
            <option value="">Select alumni...</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.alumni_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Connection Date</label>
          <input type="date" className="border rounded px-3 py-1.5 w-full text-sm" value={form.connection_date}
            onChange={e => setForm({ ...form, connection_date: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Connection Strength</label>
          <select className="border rounded px-3 py-1.5 w-full text-sm" value={form.connection_strength}
            onChange={e => setForm({ ...form, connection_strength: e.target.value })}>
            <option value="">Select...</option>
            <option value="weak">Weak</option>
            <option value="moderate">Moderate</option>
            <option value="strong">Strong</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Shared Interests</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.shared_interests}
            onChange={e => setForm({ ...form, shared_interests: e.target.value })}
            placeholder="e.g. Technology, Sports, Music" />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" disabled={loading}
            className="bg-indigo-800 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm disabled:opacity-50">
            {loading ? 'Saving...' : editId ? 'Update Connection' : 'Add Connection'}
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
              <th className="px-4 py-3 text-left">Alumni 1</th>
              <th className="px-4 py-3 text-left">Alumni 2</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Strength</th>
              <th className="px-4 py-3 text-left">Shared Interests</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{profileName(row.alumni_id_1)}</td>
                <td className="px-4 py-3">{profileName(row.alumni_id_2)}</td>
                <td className="px-4 py-3">{row.connection_date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    row.connection_strength === 'strong' ? 'bg-green-100 text-green-700'
                    : row.connection_strength === 'moderate' ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                  }`}>{row.connection_strength}</span>
                </td>
                <td className="px-4 py-3">{row.shared_interests}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(row)}
                    className="text-indigo-700 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(row.id)}
                    className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No connections found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
