import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Play, Clock, FileJson, Share2 } from 'lucide-react';
import { mockJobs, mockDeliveryTargets } from '../services/mockData';
import StatusBadge from '../components/StatusBadge';
import JobDefinitionTab from '../components/JobDefinitionTab';
import JobScheduleTab from '../components/JobScheduleTab';
import JobDeliveryTab from '../components/JobDeliveryTab';

const JobDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find(j => j.id === Number(id));
  const [activeTab, setActiveTab] = useState<'definition' | 'schedule' | 'delivery'>('definition');
  
  if (!job) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Job not found</div>;

  const handleTrigger = () => {
    // In a real app, this would call the API
    alert(`[SIMULATION] Job "${job.name}" has been triggered manually.\nExecution ID: exec-${Date.now()}`);
  };

  const handleSave = () => {
    // In a real app, this would PUT to the API
    alert(`[SIMULATION] Configuration for "${job.name}" saved successfully.\nSchema Validation: PASSED`);
  };

  const handleAddTarget = () => {
    alert(`[SIMULATION] Open "Add Delivery Target" Modal.\n(Feature pending backend integration)`);
  };

  const targets = mockDeliveryTargets.filter(t => t.job_id === job.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/jobs')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.name}</h1>
              <StatusBadge status={job.status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono text-xs">{job.uuid}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleTrigger}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
          >
            <Play size={16} className="mr-2" />
            Trigger Now
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 flex px-6">
          <button 
            onClick={() => setActiveTab('definition')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors flex items-center ${
              activeTab === 'definition' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <FileJson size={16} className="mr-2" />
            JSON Definition
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors flex items-center ${
              activeTab === 'schedule' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Clock size={16} className="mr-2" />
            Schedule
          </button>
          <button 
            onClick={() => setActiveTab('delivery')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors flex items-center ${
              activeTab === 'delivery' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Share2 size={16} className="mr-2" />
            Delivery Targets
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'definition' && <JobDefinitionTab job={job} />}
          {activeTab === 'schedule' && <JobScheduleTab job={job} />}
          {activeTab === 'delivery' && <JobDeliveryTab targets={targets} onAddTarget={handleAddTarget} />}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;