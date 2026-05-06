import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { AuditLogEntry } from '../../types';
import AuditLog from '../AuditLog';

interface AdminPanelProps {
  log: AuditLogEntry[];
  addLogEntry: (action: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ log, addLogEntry }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    addLogEntry(`Admin user '${user}' logged out.`);
    logout();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
          <p className="text-gray-600 dark:text-gray-400">Welcome, {user}.</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="px-5 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Log out from the admin panel"
        >
          Logout
        </button>
      </div>
      <AuditLog log={log} />
    </div>
  );
};

export default AdminPanel;