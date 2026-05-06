import React, { useEffect, useState } from 'react';
import {
  getArticles,
  getFeeds,
  createArticle,
  updateArticle,
  deleteArticle,
  type Article,
  type Feed,
} from '../services/api';

const empty: Partial<Article> = {
  feed_id: '',
  headline: '',
  summary: '',
  content: '',
  author: '',
  published_at: '',
  views: 0,
};

export default function ArticlesView() {
  const [items, setItems] = useState<Article[]>([]);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [form, setForm] = useState<Partial<Article>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [articles, fds] = await Promise.all([getArticles(), getFeeds()]);
      setItems(articles);
      setFeeds(fds);
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
        await updateArticle(editId, form);
      } else {
        await createArticle(form);
      }
      setForm(empty);
      setEditId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleEdit = (item: Article) => {
    setEditId(item.id);
    setForm({
      feed_id: item.feed_id,
      headline: item.headline,
      summary: item.summary ?? '',
      content: item.content ?? '',
      author: item.author ?? '',
      published_at: item.published_at ? item.published_at.slice(0, 16) : '',
      views: item.views,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await deleteArticle(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-orange-900">Articles</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow rounded p-4 grid grid-cols-2 gap-4">
        <div className="col-span-2 font-semibold text-orange-800">
          {editId ? 'Edit Article' : 'Add Article'}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Feed</label>
          <select
            required
            value={form.feed_id ?? ''}
            onChange={e => setForm(f => ({ ...f, feed_id: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select feed...</option>
            {feeds.map(fd => (
              <option key={fd.id} value={fd.id}>{fd.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Author</label>
          <input
            value={form.author ?? ''}
            onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Headline</label>
          <input
            required
            value={form.headline ?? ''}
            onChange={e => setForm(f => ({ ...f, headline: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Published At</label>
          <input
            type="datetime-local"
            value={form.published_at ?? ''}
            onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Views</label>
          <input
            type="number"
            min={0}
            value={form.views ?? 0}
            onChange={e => setForm(f => ({ ...f, views: Number(e.target.value) }))}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Summary</label>
          <textarea
            value={form.summary ?? ''}
            onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
            rows={2}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Content</label>
          <textarea
            value={form.content ?? ''}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            rows={4}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
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
                <th className="px-4 py-2 text-left">Headline</th>
                <th className="px-4 py-2 text-left">Feed</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Published</th>
                <th className="px-4 py-2 text-left">Views</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-slate-400">No articles found</td>
                </tr>
              )}
              {items.map(item => {
                const feed = feeds.find(f => f.id === item.feed_id);
                return (
                  <tr key={item.id} className="border-t hover:bg-orange-50">
                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{item.id}</td>
                    <td className="px-4 py-2 font-medium max-w-xs truncate">{item.headline}</td>
                    <td className="px-4 py-2">{feed ? feed.title : item.feed_id}</td>
                    <td className="px-4 py-2">{item.author ?? '—'}</td>
                    <td className="px-4 py-2 text-slate-500">{new Date(item.published_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{item.views}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-orange-700 hover:text-orange-900 underline text-xs">Edit</button>
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
