
import { Activity, AlertCircle, FileText, Lock, LogOut, PlayCircle, Save, ShieldCheck, Terminal } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Log {
  id: number;
  action: string;
  timestamp: string;
  details: string;
}

interface AdminProps {
  onLogout: () => void;
  onRunTests: () => void;
}

const Admin: React.FC<AdminProps> = ({ onLogout, onRunTests }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [auditLogs, setAuditLogs] = useState<Log[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tests'>('dashboard');
  
  // Admin Settings State
  const [currentConfigPass, setCurrentConfigPass] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [settingMessage, setSettingMessage] = useState('');

  // Initialize default password and logs if not present
  useEffect(() => {
    const storedPass = localStorage.getItem('tuc_admin_pass');
    if (!storedPass) {
      localStorage.setItem('tuc_admin_pass', 'admin123');
    }
    
    const storedLogs = localStorage.getItem('tuc_audit_logs');
    if (storedLogs) {
      setAuditLogs(JSON.parse(storedLogs));
    }
  }, []);

  const logAction = (action: string, details: string) => {
    const newLog: Log = {
      id: Date.now(),
      action,
      timestamp: new Date().toLocaleString(),
      details
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    localStorage.setItem('tuc_audit_logs', JSON.stringify(updatedLogs));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = localStorage.getItem('tuc_admin_pass');
    if (password === storedPass) {
      setIsAuthenticated(true);
      setError('');
      logAction('LOGIN_SUCCESS', 'Admin logged in successfully.');
    } else {
      setError('Invalid password');
      logAction('LOGIN_FAILED', 'Failed login attempt.');
    }
  };

  const handleLogout = () => {
    logAction('LOGOUT', 'Admin logged out.');
    setIsAuthenticated(false);
    onLogout();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = localStorage.getItem('tuc_admin_pass');
    if (currentConfigPass !== storedPass) {
      setSettingMessage('Error: Current password incorrect.');
      return;
    }
    if (newPassword.length < 6) {
      setSettingMessage('Error: New password must be at least 6 chars.');
      return;
    }
    
    localStorage.setItem('tuc_admin_pass', newPassword);
    setSettingMessage('Success: Password updated.');
    logAction('PASSWORD_CHANGE', 'Admin password was updated.');
    setCurrentConfigPass('');
    setNewPassword('');
  };

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear the audit logs?')) {
        setAuditLogs([]);
        localStorage.removeItem('aucdt_audit_logs');
        logAction('LOGS_CLEARED', 'Audit logs were cleared.');
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-tuc-maroon rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-tuc-gold" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Admin Access
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please enter your secure key to proceed.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-tuc-maroon focus:border-tuc-maroon focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-tuc-maroon hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tuc-maroon transition-all duration-200"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ShieldCheck className="h-5 w-5 text-tuc-gold group-hover:text-white" />
                </span>
                Secure Login
              </button>
            </div>
            <div className="text-center">
                <button type="button" onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Return to Home
                </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
                <ShieldCheck className="h-8 w-8 text-tuc-green mr-3" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                
                <div className="ml-10 flex space-x-4">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'dashboard' ? 'bg-gray-900 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('tests')}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'tests' ? 'bg-gray-900 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                    >
                        System Self-Test
                    </button>
                </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {activeTab === 'dashboard' ? (
            <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Security Settings */}
                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center mb-4">
                            <Lock className="h-5 w-5 mr-2 text-tuc-gold" />
                            Security Settings
                        </h3>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                                <input 
                                    type="password" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-tuc-maroon focus:border-tuc-maroon sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={currentConfigPass}
                                    onChange={(e) => setCurrentConfigPass(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                <input 
                                    type="password" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-tuc-maroon focus:border-tuc-maroon sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            {settingMessage && (
                                <p className={`text-sm ${settingMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                                    {settingMessage}
                                </p>
                            )}
                            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-tuc-maroon hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tuc-maroon">
                                <Save className="h-4 w-4 mr-2" />
                                Update Password
                            </button>
                        </form>
                    </div>

                    {/* Stats / Info Placeholder */}
                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center mb-4">
                            <Activity className="h-5 w-5 mr-2 text-tuc-green" />
                            System Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">System Version</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">v1.0.2</span>
                            </div>
                            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total Logs</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{auditLogs.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Log */}
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                    Audit Logs
                                </h3>
                                <button onClick={clearLogs} className="text-xs text-red-600 hover:text-red-800 dark:text-red-400">Clear Logs</button>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Action
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Details
                                </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {auditLogs.slice(0, 50).map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {log.timestamp}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {log.action}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {log.details}
                                    </td>
                                </tr>
                                ))}
                                {auditLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            No logs recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            /* Test Tab Content */
            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Terminal size={20} /> System Diagnostics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
                    Run a comprehensive client-side integrity check. This process mimics the Playwright E2E suite by simulating user interactions (clicks, navigation, theme toggling) directly in the browser.
                </p>
                
                <div className="flex gap-4">
                    <button 
                        onClick={onRunTests}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <PlayCircle className="mr-2" size={20} />
                        Run Live Test Suite
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        onClick={() => alert("Playwright script located at tests/playwright_suite.js")}
                    >
                        <FileText className="mr-2" size={20} />
                        View Script Config
                    </button>
                </div>

                <div className="mt-8 bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
                    <div className="mb-2 text-gray-500"># Sample Playwright Config</div>
                    <pre>
{`const playwright = require('playwright');

(async () => {
  const browser = await playwright.launch();
  const page = await browser.newPage();
  await page.goto('https://tuc.edu.gh');
  // ... full suite implementation
})();`}
                    </pre>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default Admin;
