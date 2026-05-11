import React, { useState, useEffect } from 'react';
import { auditLogger } from '../utils/audit';
import { runSystemDiagnostics } from '../utils/diagnostics';
import { AuditLogEntry, TestResult } from '../types';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'logs' | 'diagnostics'>('logs');
  
  // Data
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const unsubscribe = auditLogger.subscribe(() => {
      setLogs([...auditLogger.getLogs()]);
    });
    return unsubscribe;
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
      auditLogger.log('Admin Login', 'Success');
      setError('');
    } else {
      setError('Invalid password');
      auditLogger.log('Admin Login Failed', 'Invalid password attempt');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    auditLogger.log('Admin Logout', 'Manual logout');
  };

  const handleRunTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    auditLogger.log('System Diagnostics', 'Test Suite Initiated');
    
    try {
      const results = await runSystemDiagnostics();
      setTestResults(results);
      const passed = results.every(r => r.status === 'pass');
      auditLogger.log('System Diagnostics', passed ? 'All Tests Passed' : 'Tests Failed');
    } catch (e) {
      auditLogger.log('System Diagnostics', 'Error Executing Tests');
    } finally {
      setIsTesting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg p-8 shadow-2xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 id="admin-login-title" className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500" aria-label="Close Admin Panel">✕</button>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="pwd" className="block text-sm font-medium text-gray-400 mb-1">Password (default: admin)</label>
              <input
                id="pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Enter password..."
                autoFocus
              />
            </div>
            {error && <p role="alert" className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded transition-colors"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-labelledby="admin-dash-title">
      <div className="w-full max-w-4xl h-[80vh] flex flex-col bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-4">
            <h2 id="admin-dash-title" className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-green-500">●</span> System Administrator
            </h2>
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button 
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${activeTab === 'logs' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Audit Logs
              </button>
              <button 
                onClick={() => setActiveTab('diagnostics')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${activeTab === 'diagnostics' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Diagnostics
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-900/50 text-red-200 border border-red-900 rounded hover:bg-red-900"
            >
              Logout
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white px-2">✕</button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-950">
          
          {/* TAB: LOGS */}
          {activeTab === 'logs' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-500">Security Audit Log</h3>
                <button 
                  onClick={() => auditLogger.clear()}
                  className="text-xs text-orange-500 hover:text-orange-400"
                >
                  Clear History
                </button>
              </div>
              <div className="space-y-2 font-mono text-sm">
                {logs.length === 0 && <p className="text-gray-600 italic">No logs recorded.</p>}
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-4 p-3 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-gray-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className={`font-bold ${log.action.includes('Failed') ? 'text-red-400' : 'text-blue-400'}`}>
                      {log.action}
                    </span>
                    <span className="text-gray-300">{log.details}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TAB: DIAGNOSTICS */}
          {activeTab === 'diagnostics' && (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Self-Test Suite</h3>
                  <p className="text-sm text-gray-500">Run client-side validation logic.</p>
                </div>
                <button
                  onClick={handleRunTests}
                  disabled={isTesting}
                  className={`px-6 py-2 rounded font-bold text-white transition-all ${
                    isTesting ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                  }`}
                >
                  {isTesting ? 'Running Checks...' : 'Run Diagnostics'}
                </button>
              </div>

              <div className="flex-1 space-y-3">
                {testResults.length === 0 && !isTesting && (
                  <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-800 rounded-lg text-gray-600">
                    Press "Run Diagnostics" to start system check.
                  </div>
                )}

                {testResults.map((result) => (
                  <div 
                    key={result.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      result.status === 'pass' 
                        ? 'bg-green-900/10 border-green-900/30' 
                        : 'bg-red-900/10 border-red-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${
                        result.status === 'pass' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                      }`}>
                        {result.status === 'pass' ? '✓' : '✕'}
                      </div>
                      <div>
                        <h4 className={`font-bold ${result.status === 'pass' ? 'text-green-400' : 'text-red-400'}`}>
                          {result.name}
                        </h4>
                        <p className="text-xs text-gray-400">{result.message}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-600">
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-gray-900 rounded border border-gray-800">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Automated E2E Testing</h4>
                <p className="text-xs text-gray-500 mb-2">
                  To run the full Playwright suite (headless browser interactions & screenshots), run the following command in your terminal:
                </p>
                <code className="block p-2 bg-black rounded text-green-500 font-mono text-xs">
                  node tests/playwright/e2e.js
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};