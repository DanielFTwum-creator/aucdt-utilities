import React, { useEffect, useState } from 'react';
import {
  getFeeds,
  createFeed,
  updateFeed,
  deleteFeed,
  type Feed,
} from '../services/api';

const empty: Partial<Feed> = {
  title: '',
  source: '',
  category: '',
  is_active: true,
};

export default function FeedsView() {
  const [items, setItems] = useState<Feed[]>([]);
  const [form, setForm] = useState<Partial<Feed>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getFeeds());
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
        await updateFeed(editId, form);
      } else {
        await createFeed(form);
      }
      setForm(empty);
      setEditId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleEdit = (item: Feed) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      source: item.source ?? '',
      category: item.category ?? '',
      is_active: item.is_active,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feed and all its articles?')) return;
    try {
      await deleteFeed(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-orange-900">Feeds</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow rounded p-4 grid grid-cols-2 gap-4">
        <div className="col-span-2 font-semibold text-orange-800">
          {editId ? 'Edit Feed' : 'Add Feed'}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
          <input
            required
            value={form.title ?? ''}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Source</label>
          <input
            value={form.source ?? ''}
            onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
            placeholder="e.g. BBC, Reuters"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
          <input
            value={form.category ?? ''}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            placeholder="e.g. Technology, Sports"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active ?? true}
            onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
            className="h-4 w-4 accent-orange-600"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-slate-600">Active</label>
        </div>
        <div className="col-span-2 flex gap-2">
          <button type="submit" className="bg-orange-800 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm">
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
            <thead className="bg-orange-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Source</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Active</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-slate-400">No feeds found</td>
                </tr>
              )}
              {items.map(item => (
                <tr key={item.id} className="border-t hover:bg-orange-50">
                  <td className="px-4 py-2 font-mono text-xs text-slate-500">{item.id}</td>
                  <td className="px-4 py-2 font-medium">{item.title}</td>
                  <td className="px-4 py-2">{item.source ?? '—'}</td>
                  <td className="px-4 py-2">{item.category ?? '—'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.is_active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => handleEdit(item)} className="text-orange-700 hover:text-orange-900 underline text-xs">Edit</button>
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
