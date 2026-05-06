import React from 'react';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { mockJobs } from '../services/mockData';

const Schedules: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
        <p className="text-gray-500 mt-1">Overview of all active cron schedules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockJobs.filter(j => j.schedule).map(job => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
             <div className={`absolute top-0 left-0 w-1 h-full ${job.schedule?.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
             
             <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-gray-900 text-lg">{job.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">{job.uuid.substring(0, 13)}...</p>
               </div>
               <span className={`px-2 py-1 rounded text-xs font-semibold ${job.schedule?.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                 {job.schedule?.is_active ? 'ACTIVE' : 'DISABLED'}
               </span>
             </div>

             <div className="space-y-3">
               <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                  <Clock size={18} className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Cron Pattern</p>
                    <code className="text-sm font-mono text-indigo-600 font-bold">{job.schedule?.cron_expression}</code>
                  </div>
               </div>

               <div className="flex items-center text-gray-700 p-2">
                  <CalendarIcon size={18} className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Next Run</p>
                    <p className="text-sm font-medium">
                      {new Date(job.schedule?.next_run_at || '').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
               </div>
             </div>

             <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
               <button className="text-blue-600 text-sm font-medium hover:text-blue-800">Edit Schedule</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedules;