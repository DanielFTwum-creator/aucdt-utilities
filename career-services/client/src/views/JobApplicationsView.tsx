import React, { useEffect, useState } from 'react';
import {
  JobApplication,
  JobPosting,
  getJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getJobPostings,
} from '../services/api';

const empty: Omit<JobApplication, 'id' | 'created_at'> = {
  job_posting_id: '',
  applicant_name: '',
  applicant_email: '',
  resume_url: '',
  application_date: '',
  application_status: 'submitted',
  interview_date: '',
};

export default function JobApplicationsView() {
  const [rows, setRows] = useState<JobApplication[]>([]);
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [apps, posts] = await Promise.all([getJobApplications(), getJobPostings()]);
      setRows(apps);
      setPostings(posts);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Load failed');
    }
  };

  useEffect(() => { load(); }, []);

  const postingTitle = (id: string) => postings.find(p => p.id === id)?.job_title ?? id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editId) {
        await updateJobApplication(editId, form);
      } else {
        await createJobApplication(form);
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

  const handleEdit = (row: JobApplication) => {
    setEditId(row.id);
    setForm({
      job_posting_id: row.job_posting_id,
      applicant_name: row.applicant_name,
      applicant_email: row.applicant_email,
      resume_url: row.resume_url,
      application_date: row.application_date,
      application_status: row.application_status,
      interview_date: row.interview_date,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application?')) return;
    try {
      await deleteJobApplication(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const statusColor = (s: string) =>
    s === 'accepted' ? 'bg-green-100 text-green-700'
    : s === 'rejected' ? 'bg-red-100 text-red-700'
    : s === 'interviewed' ? 'bg-blue-100 text-blue-700'
    : 'bg-gray-100 text-gray-600';

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Posting</label>
          <select className="border rounded px-3 py-1.5 w-full text-sm" value={form.job_posting_id}
            onChange={e => setForm({ ...form, job_posting_id: e.target.value })} required>
            <option value="">Select posting...</option>
            {postings.map(p => <option key={p.id} value={p.id}>{p.job_title} — {p.company_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Name</label>
          <input className="border rounded px-3 py-1.5 w-full text-sm" value={form.applicant_name}
            onChange={e => setForm({ ...form, applicant_name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Email</label>
          <input type="email" className="border rounded px-3 py-1.5 w-full text-sm" value={form.applicant_email}
            onChange={e => setForm({ ...form, applicant_email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL</label>
          <input type="url" className="border rounded px-3 py-1.5 w-full text-sm" value={form.resume_url}
            onChange={e => setForm({ ...form, resume_url: e.target.value })}
            placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
          <input type="date" className="border rounded px-3 py-1.5 w-full text-sm" value={form.application_date}
            onChange={e => setForm({ ...form, application_date: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
          <input type="date" className="border rounded px-3 py-1.5 w-full text-sm" value={form.interview_date}
            onChange={e => setForm({ ...form, interview_date: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="border rounded px-3 py-1.5 w-full text-sm" value={form.application_status}
            onChange={e => setForm({ ...form, application_status: e.target.value })}>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="interviewed">Interviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" disabled={loading}
            className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 text-sm disabled:opacity-50">
            {loading ? 'Saving...' : editId ? 'Update Application' : 'Add Application'}
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
              <th className="px-4 py-3 text-left">Applicant</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Job</th>
              <th className="px-4 py-3 text-left">Applied</th>
              <th className="px-4 py-3 text-left">Interview</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.applicant_name}</td>
                <td className="px-4 py-3">{row.applicant_email}</td>
                <td className="px-4 py-3">{postingTitle(row.job_posting_id)}</td>
                <td className="px-4 py-3">{row.application_date}</td>
                <td className="px-4 py-3">{row.interview_date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(row.application_status)}`}>
                    {row.application_status}
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
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No applications found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
