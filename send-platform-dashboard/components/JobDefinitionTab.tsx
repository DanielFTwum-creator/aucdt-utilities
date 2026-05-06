import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ReportJob } from '../types';

interface JobDefinitionTabProps {
  job: ReportJob;
}

const JobDefinitionTab: React.FC<JobDefinitionTabProps> = ({ job }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="text-amber-600 mt-0.5" size={18} />
        <div className="text-sm text-amber-800">
          <p className="font-semibold">Schema Validation Active</p>
          <p>Changes to the definition must comply with the registered JSON schema. Invalid configurations will be rejected.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description</label>
          <input 
            type="text" 
            defaultValue={job.description} 
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority (1-10)</label>
           <input 
             type="number" 
             min="1"
             max="10"
             defaultValue={job.priority} 
             className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
           />
        </div>
      </div>

      <div className="h-96 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden relative font-mono text-sm">
        <textarea 
          className="w-full h-full p-4 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none focus:outline-none"
          defaultValue={job.json_definition}
        />
      </div>
    </div>
  );
};

export default JobDefinitionTab;