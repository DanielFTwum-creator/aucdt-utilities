import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Application {
  id: number;
  candidate_name: string;
  role_title: string;
  ai_authorship_score: number;
  talent_signal_score: number;
  created_at: string;
  status: string;
}

export default function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getScoreColor = (score: number) => {
    if (score < 40) return 'bg-green-100 text-green-800';
    if (score < 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6 font-display">Candidate Applications</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider font-body">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider font-body">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider font-body">AI Signal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider font-body">TSS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider font-body">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider font-body">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider font-body">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold font-body">
                      {app.candidate_name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-text-primary font-body">{app.candidate_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted font-body">
                  {app.role_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full font-body ${getScoreColor(app.ai_authorship_score)}`}>
                    {Math.round(app.ai_authorship_score)}% AI Signal
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-brand-primary font-body">
                    {app.talent_signal_score ? Math.round(app.talent_signal_score) : '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 font-body">
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted font-body">
                  {new Date(app.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/applications/${app.id}`} className="text-brand-primary hover:text-brand-primary/80 font-body">
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && !loading && (
          <div className="p-12 text-center text-text-muted font-body">
            No applications received yet.
          </div>
        )}
      </div>
    </div>
  );
}
