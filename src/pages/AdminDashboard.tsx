import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Activity, 
  Clock, 
  User, 
  Database,
  Download,
  Camera
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import DiagnosticPanel from '../components/DiagnosticPanel';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout, auditLogs, addLog } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'diagnostics'>('overview');

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleExportLogs = (format: 'csv' | 'json') => {
    const data = format === 'json' 
      ? JSON.stringify(auditLogs, null, 2)
      : 'ID,Timestamp,Action,Actor,Resource\n' + auditLogs.map(l => `${l.id},${l.timestamp},${l.action},${l.actor},${l.resource}`).join('\n');
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString()}.${format}`;
    a.click();
    addLog('EXPORT_LOGS', format.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex">
      {/* Sidebar */}
      <aside className="w-64 bg-tuc-ink text-white flex flex-col">
        <div className="p-8 border-b border-white/10">
          <span className="font-serif text-xl font-bold">LFPW Admin</span>
        </div>
        
        <nav className="flex-grow py-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "w-full flex items-center space-x-4 px-8 py-4 transition-colors",
              activeTab === 'overview' ? "bg-tuc-gold text-brand-charcoal" : "text-brand-stone hover:text-white"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="label-caps text-[11px]">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={cn(
              "w-full flex items-center space-x-4 px-8 py-4 transition-colors",
              activeTab === 'logs' ? "bg-tuc-gold text-brand-charcoal" : "text-brand-stone hover:text-white"
            )}
          >
            <Clock className="w-5 h-5" />
            <span className="label-caps text-[11px]">Audit Logs</span>
          </button>
          <button 
            onClick={() => setActiveTab('diagnostics')}
            className={cn(
              "w-full flex items-center space-x-4 px-8 py-4 transition-colors",
              activeTab === 'diagnostics' ? "bg-tuc-gold text-brand-charcoal" : "text-brand-stone hover:text-white"
            )}
          >
            <Activity className="w-5 h-5" />
            <span className="label-caps text-[11px]">Diagnostics</span>
          </button>
        </nav>

        <div className="p-8 border-t border-white/10">
          <button 
            onClick={logout}
            className="flex items-center space-x-4 text-brand-stone hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="label-caps text-[11px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl editorial-heading mb-2">
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'logs' && 'Audit Trail'}
              {activeTab === 'diagnostics' && 'System Health'}
            </h1>
            <p className="text-brand-stone label-caps text-[10px]">LFPaperWorks Management Portal</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 border border-brand-linen rounded-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">System Live</span>
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-brand-linen">
              <div className="flex justify-between items-start mb-6">
                <Database className="w-6 h-6 text-tuc-gold" />
                <span className="text-xs font-bold text-green-500">+12%</span>
              </div>
              <p className="label-caps text-brand-stone mb-2">Total Orders</p>
              <p className="text-4xl font-serif">142</p>
            </div>
            <div className="bg-white p-8 border border-brand-linen">
              <div className="flex justify-between items-start mb-6">
                <User className="w-6 h-6 text-tuc-gold" />
                <span className="text-xs font-bold text-green-500">+5%</span>
              </div>
              <p className="label-caps text-brand-stone mb-2">Active Users</p>
              <p className="text-4xl font-serif">1,204</p>
            </div>
            <div className="bg-white p-8 border border-brand-linen">
              <div className="flex justify-between items-start mb-6">
                <FileText className="w-6 h-6 text-tuc-gold" />
                <span className="text-xs font-bold text-brand-stone">Stable</span>
              </div>
              <p className="label-caps text-brand-stone mb-2">Products</p>
              <p className="text-4xl font-serif">24</p>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white border border-brand-linen">
            <div className="p-6 border-b border-brand-linen flex justify-between items-center">
              <h3 className="label-caps">Security Events</h3>
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleExportLogs('csv')}
                  className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest hover:text-tuc-gold transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Export CSV</span>
                </button>
                <button 
                  onClick={() => handleExportLogs('json')}
                  className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest hover:text-tuc-gold transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-leaf border-b border-brand-linen">
                    <th className="px-6 py-4 label-caps text-[10px]">Timestamp</th>
                    <th className="px-6 py-4 label-caps text-[10px]">Action</th>
                    <th className="px-6 py-4 label-caps text-[10px]">Actor</th>
                    <th className="px-6 py-4 label-caps text-[10px]">Resource</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id} className="border-b border-brand-linen hover:bg-brand-leaf/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-brand-stone">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 text-[9px] font-bold rounded-sm",
                          log.action.includes('FAILED') ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        )}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">{log.actor}</td>
                      <td className="px-6 py-4 text-xs text-brand-stone italic">{log.resource}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <DiagnosticPanel />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
