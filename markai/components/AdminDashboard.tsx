
import React from 'react';
import { AuditLogEntry, AppView, FeatureFlag, GeminiModel } from '../types';
import { useAdmin } from '../contexts/AdminContext';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';

const FeatureToggle: React.FC<{
  flag: FeatureFlag,
  label: string,
  description: string,
  isEnabled: boolean,
  onToggle: (flag: FeatureFlag) => void
}> = ({ flag, label, description, isEnabled, onToggle }) => (
  <div className="flex items-center justify-between p-4 border border-default rounded-lg bg-primary">
    <div>
      <h4 className="font-semibold text-primary">{label}</h4>
      <p className="text-sm text-secondary">{description}</p>
    </div>
    <label htmlFor={flag} className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" id={flag} className="sr-only" checked={isEnabled} onChange={() => onToggle(flag)} />
        <div className={`block w-14 h-8 rounded-full ${isEnabled ? 'bg-accent-primary' : 'bg-gray-600'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isEnabled ? 'translate-x-6' : ''}`}></div>
      </div>
    </label>
  </div>
);


interface AdminDashboardProps {
  onNavigate?: (view: AppView) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { auditLogs, geminiModel, setGeminiModel, onToggleFlag, adminLogout } = useAdmin();
  const { featureFlags } = useFeatureFlags();

  const formatAction = (action: AuditLogEntry['action']) => {
    switch(action) {
      case 'ADMIN_LOGIN_SUCCESS': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400">Login Success</span>;
      case 'ADMIN_LOGIN_FAIL': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400">Login Fail</span>;
      case 'ADMIN_LOGOUT': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400">Logout</span>;
      case 'ADMIN_FEATURE_FLAG_TOGGLED': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400">Feature Flag</span>;
      case 'ADMIN_MODEL_CHANGED': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-400">Model Change</span>;
      default: return action;
    }
  };

  return (
    <div role="main" aria-label="Admin Dashboard" className="max-w-7xl mx-auto bg-secondary p-6 sm:p-8 rounded-2xl shadow-lg border border-default space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <button
          onClick={adminLogout}
          aria-label="Logout from admin panel"
          className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-primary p-6 rounded-lg border border-default">
          <h2 className="text-xl font-semibold text-primary mb-2">Admin Tools</h2>
          <button
            onClick={() => onNavigate?.(AppView.TESTING_HOME)}
            aria-label="Navigate to Testing Dashboard"
            className="text-accent-primary hover:underline focus:outline-none focus:ring-2 focus:ring-accent-primary rounded"
          >
            Go to Testing Dashboard
          </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-primary mb-4">Feature Flags</h2>
          <div className="space-y-4">
            <FeatureToggle 
              flag={FeatureFlag.AI_CONTENT_GENERATION}
              label="AI Content Generation"
              description="Enables the core AI content creation tools."
              isEnabled={featureFlags[FeatureFlag.AI_CONTENT_GENERATION]}
              onToggle={onToggleFlag}
            />
             <FeatureToggle 
              flag={FeatureFlag.IMAGE_EDITING}
              label="AI Image Tools"
              description="Enables AI image editing and generation features."
              isEnabled={featureFlags[FeatureFlag.IMAGE_EDITING]}
              onToggle={onToggleFlag}
            />
            <FeatureToggle 
              flag={FeatureFlag.CAMPAIGN_SCHEDULING}
              label="Campaign Scheduling"
              description="Enables the calendar and post scheduling features."
              isEnabled={featureFlags[FeatureFlag.CAMPAIGN_SCHEDULING]}
              onToggle={onToggleFlag}
            />
            <FeatureToggle 
              flag={FeatureFlag.LIVE_AUDIO}
              label="Live AI Chat"
              description="Enables the real-time audio conversation feature."
              isEnabled={featureFlags[FeatureFlag.LIVE_AUDIO]}
              onToggle={onToggleFlag}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-primary mb-4">AI Model Configuration</h2>
          <div className="p-4 border border-default rounded-lg bg-primary">
            <label htmlFor="model-select" className="block font-semibold text-primary mb-2">Active Gemini Model</label>
            <p className="text-sm text-secondary mb-3">Select the AI model used for content generation.</p>
            <select
              id="model-select"
              value={geminiModel}
              onChange={(e) => setGeminiModel(e.target.value as GeminiModel)}
              className="w-full p-3 bg-secondary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition"
            >
              {Object.values(GeminiModel).map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <p className="text-xs text-secondary mt-2">
              Note: This model is used for all AI content generation. Different models may vary in cost, speed, and output quality.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-default pt-8">
        <h2 className="text-xl font-semibold text-primary mb-4">Activity Log</h2>
        <div className="overflow-x-auto rounded-lg border border-default">
          <table className="min-w-full divide-y divide-default" aria-label="Admin activity log">
            <thead className="bg-primary">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-secondary divide-y divide-default">
              {auditLogs.length > 0 ? auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-primary transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {formatAction(log.action)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary font-mono">{log.details || 'N/A'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-sm text-secondary">
                    No log entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
