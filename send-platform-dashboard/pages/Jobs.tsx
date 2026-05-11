import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Play, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { listJobs, patchJobStatus, runJob } from '../services/jobApi';
import StatusBadge from '../components/StatusBadge';
import { ReportJob } from '../types';

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ReportJob[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [running, setRunning] = useState<number | null>(null);
  const PAGE_SIZE = 20;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { jobs: data, total: t } = await listJobs(page, PAGE_SIZE);
      setJobs(data);
      setTotal(t);
    } catch (e: any) {
      setError(e.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleRun = async (id: number) => {
    setRunning(id);
    try {
      await runJob(id);
      fetchJobs();
    } catch (e: any) {
      alert(`Run failed: ${e.message}`);
    } finally {
      setRunning(null);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Archive job "${name}"?`)) return;
    try {
      await patchJobStatus(id, 'DELETED');
      fetchJobs();
    } catch (e: any) {
      alert(`Failed: ${e.message}`);
    }
  };

  const filtered = jobs.filter(j =>
    j.name.toLowerCase().includes(search.toLowerCase()) ||
    j.uuid.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Jobs</h1>
          <p className="text-gray-500 mt-1">Manage report definitions and configuration.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchJobs}
            className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/jobs/new')}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            New Job
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search jobs by name or UUID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button type="button" className="flex items-center px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>

        {/* States */}
        {loading && (
          <div className="py-16 text-center text-gray-400 text-sm">Loading jobs…</div>
        )}
        {error && !loading && (
          <div className="py-16 text-center text-red-500 text-sm">{error}</div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Job Name</th>
                  <th className="px-6 py-4 font-semibold">Format</th>
                  <th className="px-6 py-4 font-semibold">Schedule</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Last Update</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                      No jobs found. Create your first report job to get started.
                    </td>
                  </tr>
                ) : filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{job.name}</span>
                        <span className="text-xs text-gray-500 font-mono mt-0.5">{job.uuid.substring(0, 8)}…</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-semibold text-gray-700">
                        {job.output_format}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {job.schedule ? (
                        <div className="flex items-center text-sm text-gray-600">
                          <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-xs mr-2">
                            {job.schedule.cron_expression}
                          </code>
                          <span className="text-xs text-gray-400">{job.schedule.timezone}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No schedule</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(job.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleRun(job.id)}
                          disabled={running === job.id}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded disabled:opacity-40"
                          title="Run Now"
                        >
                          <Play size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(job.id, job.name)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {total === 0 ? 'No results' : `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)} of ${total}`}
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
