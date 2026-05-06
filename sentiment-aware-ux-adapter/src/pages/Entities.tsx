import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { Database, Activity } from 'lucide-react';

export function Entities() {
  const { entities, fetchEntities, isLoading } = useAppStore();

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Entities</h2>
        <p className="text-slate-500">Manage all entities in the system</p>
      </div>

      <div className="grid gap-4">
        {entities.map(entity => (
          <div key={entity.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Database className="text-blue-600" size={24} />
              <div>
                <h3 className="font-bold text-slate-900">{entity.name}</h3>
                <p className="text-sm text-slate-500">ID: {entity.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                entity.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
              }`}>
                {entity.status}
              </span>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{entity.health_score.toFixed(1)}%</p>
                <p className="text-xs text-slate-500">Health Score</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
