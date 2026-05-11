import React from 'react';
import { Share2, MoreHorizontal, Plus } from 'lucide-react';
import { DeliveryTarget } from '../types';

interface JobDeliveryTabProps {
  targets: DeliveryTarget[];
  onAddTarget: () => void;
}

const JobDeliveryTab: React.FC<JobDeliveryTabProps> = ({ targets, onAddTarget }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {targets.map(target => (
        <div key={target.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg ${
              target.channel === 'EMAIL' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200' : 
              target.channel === 'SHAREPOINT' ? 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-200' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Share2 size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{target.channel}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {JSON.stringify(target.config).substring(0, 50)}...
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">Active</span>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      ))}
      
      <button 
        onClick={onAddTarget}
        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all font-medium flex items-center justify-center"
      >
        <Plus size={18} className="mr-2" />
        Add Delivery Target
      </button>
    </div>
  );
};

export default JobDeliveryTab;