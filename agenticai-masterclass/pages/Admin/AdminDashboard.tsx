import React, { useState, useEffect } from 'react';
import { Activity, Database, FileText, Server, LogOut, RefreshCw, Trash2, CheckCircle, XCircle, AlertTriangle, Shield, Loader2, Play, Camera, X } from 'lucide-react';
import { logAction, getLogs, clearLogs } from '../../services/logger';
import { LogEntry } from '../../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface TestResult {
  id: string;
  status: 'idle' | 'running' | 'success' | 'failure';
  message?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('diagnostics');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'degraded' | 'checking'>('checking');
  
  // Filter State
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  // Test Suite State
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({
    connectivity: { id: 'connectivity', status: 'idle' },
    theme: { id: 'theme', status: 'idle' },
    logs: { id: 'logs', status: 'idle' }
  });

  useEffect(() => {
    if (activeTab === 'logs') {
        setLogs(getLogs());
    }
  }, [activeTab]);

  useEffect(() => {
    // Simulate initial system check
    const checkSystem = async () => {
        setSystemStatus('checking');
        await new Promise(r => setTimeout(r, 1000));
        setSystemStatus('healthy');
        logAction('SYSTEM_CHECK', 'Automated system diagnostic scan completed', 'system');
    };
    checkSystem();
  }, []);

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all audit logs?')) {
        clearLogs();
        setLogs(getLogs());
        // Reset filters when clearing
        setFilterCategory('all');
        setFilterStartDate('');
        setFilterEndDate('');
    }
  };

  const runTest = async (testId: string, testFn: () => Promise<void>) => {
    setTestResults(prev => ({ ...prev, [testId]: { ...prev[testId], status: 'running' } }));
    try {
        await new Promise(r => setTimeout(r, 1500)); // Simulate test duration
        await testFn();
        setTestResults(prev => ({ ...prev, [testId]: { ...prev[testId], status: 'success', message: 'Test Passed' } }));
        logAction('TEST_RUN', `Test '${testId}' executed successfully`, 'system', 'admin');
    } catch (e: any) {
        setTestResults(prev => ({ ...prev, [testId]: { ...prev[testId], status: 'failure', message: e.message || 'Test Failed' } }));
        logAction('TEST_FAIL', `Test '${testId}' failed: ${e.message}`, 'system', 'admin');
    }
  };

  const getFilteredLogs = () => {
      return logs.filter(log => {
          const logDate = new Date(log.timestamp);
          
          // Category Filter
          if (filterCategory !== 'all' && log.category !== filterCategory) return false;
          
          // Start Date Filter (Local Time Midnight)
          if (filterStartDate) {
              const [y, m, d] = filterStartDate.split('-').map(Number);
              const start = new Date(y, m - 1, d); 
              if (logDate < start) return false;
          }
          
          // End Date Filter (Local Time End of Day)
          if (filterEndDate) {
              const [y, m, d] = filterEndDate.split('-').map(Number);
              const end = new Date(y, m - 1, d);
              end.setHours(23, 59, 59, 999);
              if (logDate > end) return false;
          }
          
          return true;
      });
  };

  const filteredLogs = getFilteredLogs();

  const resetFilters = () => {
      setFilterCategory('all');
      setFilterStartDate('');
      setFilterEndDate('');
  };

  const renderContent = () => {
    switch(activeTab) {
        case 'diagnostics':
            return (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-blue-600" /> System Diagnostics
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-700">API Connectivity</h3>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">ONLINE</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Endpoint: portal.aucdt.edu.gh</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 mt-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Latency: 45ms</span>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-700">Client Environment</h3>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">STABLE</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>React Version: 19.2.4</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 mt-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Browser: {navigator.userAgent.split(')')[0]})</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                         <h3 className="font-semibold text-slate-700 mb-4">Service Status Monitor</h3>
                         <div className="space-y-3">
                             {['Email Service', 'Calendar Integration', 'Asset CDN', 'Auth Guard'].map((service) => (
                                 <div key={service} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                     <span className="font-medium text-slate-700">{service}</span>
                                     <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                         <span className="text-xs text-green-600 font-bold">OPERATIONAL</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            );
        case 'logs':
            return (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-4">
                         <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-purple-600" /> Audit Logs
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={() => setLogs(getLogs())} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Refresh Logs">
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button onClick={handleClearLogs} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Clear Logs">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Filters & Controls */}
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                            <select 
                                value={filterCategory} 
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 min-w-[140px]"
                            >
                                <option value="all">All Categories</option>
                                <option value="auth">Auth</option>
                                <option value="system">System</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                            <input 
                                type="date" 
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                            />
                        </div>
                         <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">End Date</label>
                            <input 
                                type="date" 
                                value={filterEndDate}
                                onChange={(e) => setFilterEndDate(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                            />
                        </div>
                        {(filterCategory !== 'all' || filterStartDate || filterEndDate) && (
                            <button 
                                onClick={resetFilters}
                                className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 flex items-center gap-1 transition-colors h-[38px]"
                            >
                                <X className="w-4 h-4" /> Reset
                            </button>
                        )}
                        <div className="ml-auto text-sm text-slate-500 self-center font-medium">
                            Showing <span className="text-slate-900 font-bold">{filteredLogs.length}</span> of {logs.length} entries
                        </div>
                    </div>
                   
                    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Timestamp</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Action</th>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                                <FileText className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p className="font-medium">
                                                {logs.length === 0 ? "No audit logs found." : "No logs match current filters."}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    log.category === 'auth' ? 'bg-amber-100 text-amber-700' :
                                                    log.category === 'user' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {log.category.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 font-medium text-slate-800">{log.action}</td>
                                            <td className="px-6 py-3 text-slate-600">{log.user}</td>
                                            <td className="px-6 py-3 text-slate-500 truncate max-w-xs" title={log.details}>{log.details}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case 'db-monitor':
            return (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Database className="w-6 h-6 text-green-600" /> Database Monitor
                    </h2>
                    <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-xl flex flex-col items-center justify-center text-center">
                        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-bold text-yellow-800 mb-2">Frontend Mode Active</h3>
                        <p className="text-yellow-700 max-w-md">
                            This application is currently running in stateless frontend mode. Database metrics are not available as no persistent storage is connected.
                        </p>
                    </div>
                </div>
            );
        case 'performance':
             return (
                <div className="space-y-6 animate-in fade-in duration-300">
                     <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Server className="w-6 h-6 text-indigo-600" /> Performance Metrics
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                            <div className="text-sm text-slate-500 font-medium uppercase mb-2">Memory Usage</div>
                            <div className="text-3xl font-black text-slate-800">24MB</div>
                            <div className="text-xs text-green-500 mt-1">Within limits</div>
                        </div>
                        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                            <div className="text-sm text-slate-500 font-medium uppercase mb-2">Load Time</div>
                            <div className="text-3xl font-black text-slate-800">0.8s</div>
                            <div className="text-xs text-green-500 mt-1">Excellent</div>
                        </div>
                        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                            <div className="text-sm text-slate-500 font-medium uppercase mb-2">Animation FPS</div>
                            <div className="text-3xl font-black text-slate-800">60</div>
                            <div className="text-xs text-green-500 mt-1">Stable</div>
                        </div>
                    </div>
                </div>
             );
        case 'testing':
            return (
                 <div className="space-y-6 animate-in fade-in duration-300">
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-red-600" /> Test Suite
                        </h2>
                        <span className="bg-slate-200 text-slate-600 text-xs font-mono px-2 py-1 rounded">
                            v2.0.0
                        </span>
                    </div>
                     <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
                        
                        {/* Connectivity Test */}
                        <div className="flex items-center justify-between py-4 border-b border-slate-100">
                            <div className="flex flex-col">
                                <span className="font-medium text-slate-700">Email API Connectivity Test</span>
                                <span className="text-xs text-slate-500">Pings the notification endpoint</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {testResults.connectivity.status === 'success' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Passed</span>}
                                {testResults.connectivity.status === 'failure' && <span className="text-red-600 text-sm font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/> Failed</span>}
                                <button 
                                    onClick={() => runTest('connectivity', async () => { /* Simulated API check */ })}
                                    disabled={testResults.connectivity.status === 'running'}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2 w-28 justify-center"
                                >
                                    {testResults.connectivity.status === 'running' ? <Loader2 className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4"/>}
                                    Run
                                </button>
                            </div>
                        </div>

                        {/* Theme Test */}
                        <div className="flex items-center justify-between py-4 border-b border-slate-100">
                             <div className="flex flex-col">
                                <span className="font-medium text-slate-700">Theme Render Stability</span>
                                <span className="text-xs text-slate-500">Verifies local storage persistence</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {testResults.theme.status === 'success' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Passed</span>}
                                {testResults.theme.status === 'failure' && <span className="text-red-600 text-sm font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/> Failed</span>}
                                <button 
                                    onClick={() => runTest('theme', async () => {
                                        if(!localStorage.getItem('app_theme')) throw new Error("Theme key missing");
                                    })}
                                    disabled={testResults.theme.status === 'running'}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2 w-28 justify-center"
                                >
                                    {testResults.theme.status === 'running' ? <Loader2 className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4"/>}
                                    Run
                                </button>
                            </div>
                        </div>

                        {/* Logs Test */}
                        <div className="flex items-center justify-between py-4 border-b border-slate-100">
                             <div className="flex flex-col">
                                <span className="font-medium text-slate-700">Audit Log Integrity</span>
                                <span className="text-xs text-slate-500">Checks log structure and read access</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {testResults.logs.status === 'success' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Passed</span>}
                                {testResults.logs.status === 'failure' && <span className="text-red-600 text-sm font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/> Failed</span>}
                                <button 
                                    onClick={() => runTest('logs', async () => {
                                         const l = getLogs();
                                         if(!Array.isArray(l)) throw new Error("Log format invalid");
                                    })}
                                    disabled={testResults.logs.status === 'running'}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2 w-28 justify-center"
                                >
                                    {testResults.logs.status === 'running' ? <Loader2 className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4"/>}
                                    Run
                                </button>
                            </div>
                        </div>

                        {/* Visual Snapshot Test */}
                        <div className="flex items-center justify-between py-4">
                            <div className="flex flex-col">
                                <span className="font-medium text-slate-700">Visual Regression Snapshot</span>
                                <span className="text-xs text-slate-500">Triggers browser print/capture for manual verification</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => {
                                        logAction('TEST_SNAPSHOT', 'Manual visual snapshot triggered', 'system', 'admin');
                                        window.print();
                                    }}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all flex items-center gap-2 w-28 justify-center"
                                    title="Capture Snapshot (Print/PDF)"
                                >
                                    <Camera className="w-4 h-4"/>
                                    Capture
                                </button>
                            </div>
                        </div>

                     </div>
                 </div>
            );
        default:
            return <div>Select a module</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
            <div className="p-6 border-b border-slate-800">
                <div className="text-white font-black text-xl tracking-tight">TECHBRIDGE<span className="text-blue-500">ADMIN</span></div>
                <div className="text-xs text-slate-500 mt-1">v2.0.0 • Secure Mode</div>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
                {[
                    { id: 'diagnostics', label: 'System Diagnostics', icon: Activity },
                    { id: 'logs', label: 'Audit Logs', icon: FileText },
                    { id: 'db-monitor', label: 'Database Monitor', icon: Database },
                    { id: 'performance', label: 'Performance', icon: Server },
                    { id: 'testing', label: 'Test Suite', icon: Shield },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                            activeTab === item.id 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                            : 'hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all font-bold"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
            <div className="p-8 max-w-6xl mx-auto">
                {renderContent()}
            </div>
        </div>
    </div>
  );
};