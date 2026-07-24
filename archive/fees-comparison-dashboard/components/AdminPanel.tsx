import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const AdminPanel: React.FC = () => {
  const { isAuthenticated, login, logout, updatePassword, auditLogs } = useAuth();
  const { undergraduateData, updateFee } = useData();
  const { theme } = useTheme();
  
  const [passwordInput, setPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'logs' | 'data' | 'settings' | 'health'>('logs');

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border transition-all ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
            }`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Admin Portal</h2>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Secure authentication required to access this area.</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (!login(passwordInput)) setError('Incorrect password. Please try again.');
            else setError('');
          }}>
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 opacity-70">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-700 focus:ring-blue-500 focus:border-transparent' 
                    : 'bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-transparent'
                }`}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2 flex items-center"><span className="mr-1">⚠</span> {error}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 transform active:scale-95">
              Authenticate
            </button>
          </form>
          <p className="text-center text-xs mt-6 opacity-50">Authorized Personnel Only</p>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className={`rounded-3xl shadow-xl border overflow-hidden flex flex-col min-h-[800px] ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      {/* Admin Header */}
      <div className={`px-8 py-6 border-b flex justify-between items-center ${
         theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">A</div>
          <div>
            <h2 className="text-xl font-bold">Administrator</h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>● System Active</p>
          </div>
        </div>
        <button onClick={logout} className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
           theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'
        }`}>
          Sign Out
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar Nav */}
        <div className={`md:w-64 border-r flex flex-col ${
           theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'
        }`}>
          <nav className="p-4 space-y-2">
            {[
              { id: 'logs', label: 'Audit Logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'data', label: 'Data Management', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
              { id: 'settings', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
              { id: 'health', label: 'System Health', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-gray-500 hover:bg-gray-200/50 dark:hover:bg-gray-800'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 bg-opacity-50">
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="font-bold text-xl">System Audit Trail</h3>
                 <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Total Events: {auditLogs.length}</span>
              </div>
              <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className={`text-xs uppercase font-bold tracking-wider ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                      <tr>
                        <th className="px-6 py-4">Timestamp</th>
                        <th className="px-6 py-4">Event Type</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Initiator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {auditLogs.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No events recorded in this session.</td></tr>
                      ) : (
                        auditLogs.map(log => (
                          <tr key={log.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`}>
                            <td className="px-6 py-4 font-mono text-xs opacity-70">{new Date(log.timestamp).toLocaleTimeString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                log.action.includes('LOGIN') ? 'bg-green-100 text-green-800' : 
                                log.action.includes('UPDATE') ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{log.details}</td>
                            <td className="px-6 py-4 font-medium">{log.actor}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <h3 className="font-bold text-xl mb-6">Modify Undergraduate Fees</h3>
              <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="max-h-[600px] overflow-y-auto">
                   {undergraduateData.map((item, idx) => (
                    <div key={idx} className={`p-4 flex items-center justify-between border-b last:border-0 ${theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{item.name}</span>
                        <span className={`text-xs mt-1 inline-block w-fit px-2 py-0.5 rounded ${item.type === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Freshman Fees</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₵</span>
                          <input
                            type="number"
                            value={item.fees}
                            onChange={(e) => updateFee('undergraduate', idx, 'fees', Number(e.target.value))}
                            className={`w-32 pl-7 pr-3 py-2 text-sm rounded-lg border font-mono ${
                              theme === 'dark' 
                                ? 'bg-gray-800 border-gray-600 focus:ring-blue-500' 
                                : 'bg-white border-gray-300 focus:ring-blue-500'
                            } outline-none focus:ring-2 transition-all`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-xl">
              <h3 className="font-bold text-xl mb-6">Credential Management</h3>
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">New Admin Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                    placeholder="Enter new secure password"
                  />
                  <p className="text-xs text-gray-500 mt-2">Password will be active immediately for this session.</p>
                </div>
                <button
                  onClick={() => {
                    if(newPassword) {
                      updatePassword(newPassword);
                      setNewPassword('');
                      alert('Security credentials updated successfully.');
                    }
                  }}
                  disabled={!newPassword}
                  className={`px-6 py-3 rounded-xl font-semibold text-white transition-all ${
                    newPassword 
                      ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Update Credentials
                </button>
              </div>
            </div>
          )}

           {activeTab === 'health' && (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                 <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                   <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                 </div>
                 <h3 className="text-lg font-medium">System Diagnostics</h3>
                 <p className="text-gray-500 max-w-xs">Run self-test suite to verify application integrity and performance.</p>
                 {/* Placeholder for Phase 3 TestRunner component */}
                 <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium">Launch Diagnostics (Preview)</button>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;