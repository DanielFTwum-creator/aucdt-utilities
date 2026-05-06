import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Play, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { listJobs, listExecutions, getAdminMetrics, AdminMetrics } from '../services/jobApi';
import StatusBadge from '../components/StatusBadge';
import { ReportJob, ExecutionInstance } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ReportJob[]>([]);
  const [executions, setExecutions] = useState<ExecutionInstance[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      listJobs(0, 10),
      listExecutions(0, 5),
      getAdminMetrics(),
    ]).then(([jobsRes, execsRes, metricsRes]) => {
      if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.jobs);
      if (execsRes.status === 'fulfilled') setExecutions(execsRes.value.executions);
      if (metricsRes.status === 'fulfilled') setMetrics(metricsRes.value);
    }).finally(() => setLoading(false));
  }, []);

  const activeJobs  = metrics?.totalJobs ?? jobs.filter(j => j.status === 'ACTIVE').length;
  const failedCount = metrics?.executions.failed ?? executions.filter(e => e.status === 'FAILED').length;
  const totalExecs  = metrics?.executions.total ?? executions.length;

  const chartData = [
    { name: 'Mon', success: 40, failed: 2 },
    { name: 'Tue', success: 30, failed: 1 },
    { name: 'Wed', success: 20, failed: 3 },
    { name: 'Thu', success: 27, failed: 0 },
    { name: 'Fri', success: 18, failed: 1 },
    { name: 'Sat', success: 23, failed: 0 },
    { name: 'Sun', success: 34, failed: 2 },
  ];

  if (loading) {
    return <div className="py-24 text-center text-gray-400 text-sm">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Jobs</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{activeJobs}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Play size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">All report jobs in system</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Executions</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalExecs}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {metrics ? `${metrics.executions.completed} completed` : 'All time'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Failed Executions</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{failedCount}</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-red-600">
              <XCircle size={24} />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">{failedCount > 0 ? 'Requires attention' : 'All clear'}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Running Now</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{metrics?.executions.running ?? 0}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Active executions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Execution Trends (7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="success" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Success" />
                <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Upcoming Schedule</h3>
          <div className="space-y-4">
            {jobs.filter(j => j.schedule?.is_active).slice(0, 5).map(job => (
              <div key={job.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.name}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    {job.schedule?.next_run_at && (
                      <span className="text-xs text-gray-500">
                        Next: {new Date(job.schedule.next_run_at).toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                      {job.schedule?.cron_expression}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {jobs.filter(j => j.schedule?.is_active).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No active schedules</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/schedules')}
            className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
          >
            View Full Calendar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Recent Executions</h3>
          <button
            type="button"
            onClick={() => navigate('/executions')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All
          </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Job</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Started At</th>
              <th className="px-6 py-3 font-medium">Duration</th>
              <th className="px-6 py-3 font-medium">Output</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {executions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                  No executions yet
                </td>
              </tr>
            ) : executions.map(exec => {
              const job = jobs.find(j => j.id === exec.job_id);
              return (
                <tr key={exec.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{job?.name || `Job #${exec.job_id}`}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={exec.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(exec.started_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {exec.duration_ms ? `${(exec.duration_ms / 1000).toFixed(1)}s` : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                    {exec.output_path || exec.error_message || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
