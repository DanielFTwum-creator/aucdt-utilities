import React, { useEffect, useState } from 'react';
import {
  JobPosting,
  getJobPostings,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
} from '../services/api';

const empty: Omit<JobPosting, 'id' | 'created_at'> = {
  job_title: '',
  company_name: '',
  location: '',
  salary_range: '',
  job_description: '',
  posting_date: '',
  deadline_date: '',
  status: 'open',
};

export default function JobPostingsView() {
  const [rows, setRows] = useState<JobPosting[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setRows(await getJobPostings());
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
        await updateJobPosting(editId, form);
      } else {
        await createJobPosting(form);
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

  const handleEdit = (row: JobPosting) => {
    setEditId(row.id);
    setForm({
      job_title: row.job_title,
      company_name: row.company_name,
      location: row.location,
      salary_range: row.salary_range,
      job_description: row.job_description,
      posting_date: row.posting_date,
      deadline_date: row.deadline_date,
      status: row.status,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job posting? All associated applications will also be deleted.')) return;
    try {
      await deleteJobPosting(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const statusColor = (s: string) =>
    s === 'open' ? 'bg-green-100 text-green-700'
    : s === 'closed' ? 'bg-red-100 text-red-700'
    : 'bg-gray-100 text-gray-600';

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Job Postings</h2>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.job_title}
            onChange={e => setForm({ ...form, job_title: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.company_name}
            onChange={e => setForm({ ...form, company_name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.salary_range}
            onChange={e => setForm({ ...form, salary_range: e.target.value })}
            placeholder="e.g. GHS 3000 - 5000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Posting Date</label>
          <input type="date" className="border rounded px-3 py-1.5 w-full text-sm" value={form.posting_date}
            onChange={e => setForm({ ...form, posting_date: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Date</label>
          <input type="date" className="border rounded px-3 py-1.5 w-full text-sm" value={form.deadline_date}
            onChange={e => setForm({ ...form, deadline_date: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="border rounded px-3 py-1.5 w-full text-sm" value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
          <textarea className="border rounded px-3 py-1.5 w-full text-sm" rows={3} value={form.job_description}
            onChange={e => setForm({ ...form, job_description: e.target.value })} />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" disabled={loading}
            className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 text-sm disabled:opacity-50">
            {loading ? 'Saving...' : editId ? 'Update Posting' : 'Add Posting'}
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
              <th className="px-4 py-3 text-left">Job Title</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Salary</th>
              <th className="px-4 py-3 text-left">Deadline</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.job_title}</td>
                <td className="px-4 py-3">{row.company_name}</td>
                <td className="px-4 py-3">{row.location}</td>
                <td className="px-4 py-3">{row.salary_range}</td>
                <td className="px-4 py-3">{row.deadline_date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(row)}
                    className="text-green-700 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(row.id)}
                    className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No job postings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
