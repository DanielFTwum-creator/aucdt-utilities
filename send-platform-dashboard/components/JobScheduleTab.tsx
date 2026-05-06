import React from 'react';
import { Layers } from 'lucide-react';
import { ReportJob } from '../types';

interface JobScheduleTabProps {
  job: ReportJob;
}

const JobScheduleTab: React.FC<JobScheduleTabProps> = ({ job }) => {
  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cron Expression</label>
          <div className="flex">
            <input 
              type="text" 
              defaultValue={job.schedule?.cron_expression} 
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 text-sm font-mono dark:bg-gray-700 dark:text-white"
            />
            <button className="bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 px-3 rounded-r-lg text-gray-600 dark:text-gray-200 text-sm hover:bg-gray-200 dark:hover:bg-gray-500">
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Runs at 08:00 AM on day 1 of the month</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:text-white">
            <option>{job.schedule?.timezone}</option>
            <option>UTC</option>
            <option>America/New_York</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-4 h-4 mr-2" alt="Google Calendar" />
            Google Calendar Integration
        </h4>
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">Sync this schedule to the "SEND Reports" calendar.</p>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">Sync Now</button>
        </div>
        <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center">
            <Layers size={12} className="mr-1" /> Last synced: 2 minutes ago
        </div>
      </div>
    </div>
  );
};

export default JobScheduleTab;