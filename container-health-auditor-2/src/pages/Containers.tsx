import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { Search, Filter, RefreshCw, Server, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { clsx } from 'clsx';

import { useNavigate } from 'react-router-dom';

export function Containers() {
  const { containers, fetchContainers, isLoading } = useAppStore();
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  const filteredContainers = containers.filter(c => {
    const matchesSearch = c.container_name.toLowerCase().includes(filter.toLowerCase()) || 
                          c.pod_name.toLowerCase().includes(filter.toLowerCase()) ||
                          c.app_name.toLowerCase().includes(filter.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'healthy') return matchesSearch && c.health_score >= 80;
    if (statusFilter === 'warning') return matchesSearch && c.health_score >= 50 && c.health_score < 80;
    if (statusFilter === 'critical') return matchesSearch && c.health_score < 50;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Containers</h2>
          <p className="text-slate-500">Manage and monitor {containers.length} containers across the ecosystem.</p>
        </div>
        <button 
          onClick={() => fetchContainers()} 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <RefreshCw size={16} className={clsx(isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search containers, pods, or apps..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-slate-400" size={20} />
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Container</th>
                <th className="px-6 py-4 font-semibold text-slate-600">App / Namespace</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Health Score</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContainers.map((container) => (
                <tr key={container.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                        <Server size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{container.container_name}</p>
                        <p className="text-xs text-slate-500 font-mono">{container.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-900">{container.app_name}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                      {container.namespace}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Running
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={clsx(
                            "h-full rounded-full transition-all duration-500",
                            container.health_score >= 80 ? "bg-emerald-500" :
                            container.health_score >= 50 ? "bg-yellow-500" : "bg-red-500"
                          )}
                          style={{ width: `${container.health_score}%` }}
                        />
                      </div>
                      <span className={clsx(
                        "font-bold",
                        container.health_score >= 80 ? "text-emerald-600" :
                        container.health_score >= 50 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {container.health_score.toFixed(0)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/containers/${container.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredContainers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No containers found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
