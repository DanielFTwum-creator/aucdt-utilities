import React, { useEffect, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

interface Application {
  id: number;
  candidate_name: string;
  role_title: string;
  status: string;
  talent_signal_score: number;
}

const STAGES = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

export default function PipelineBoard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchApplications(); // Refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getColumns = () => {
    const columns: Record<string, Application[]> = {};
    STAGES.forEach(stage => columns[stage] = []);
    applications.forEach(app => {
      if (columns[app.status]) {
        columns[app.status].push(app);
      } else {
        // Fallback for unknown status
        if (!columns['applied']) columns['applied'] = [];
        columns['applied'].push(app);
      }
    });
    return columns;
  };

  const columns = getColumns();

  return (
    <div className="h-[calc(100vh-8rem)] overflow-x-auto">
      <div className="flex gap-6 h-full min-w-max pb-4">
        {STAGES.map(stage => (
          <div key={stage} className="w-80 flex flex-col bg-white/50 border border-gray-200 rounded-xl">
            <div className="p-4 font-semibold text-text-primary uppercase text-sm tracking-wider flex justify-between font-body">
              {stage}
              <span className="bg-gray-200 text-text-muted px-2 py-0.5 rounded-full text-xs font-body">
                {columns[stage]?.length || 0}
              </span>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {columns[stage]?.map(app => (
                <div key={app.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-text-primary font-body">{app.candidate_name}</div>
                    <button className="text-text-muted hover:text-text-primary">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-text-muted mb-3 font-body">{app.role_title}</div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold text-brand-primary font-body">
                      TSS: {app.talent_signal_score ? Math.round(app.talent_signal_score) : '-'}
                    </div>
                    
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="text-xs border-gray-200 rounded focus:ring-brand-primary font-body"
                    >
                      {STAGES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
