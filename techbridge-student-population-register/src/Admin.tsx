import React, { useState } from 'react';
import { useAudit } from './AuditContext';
import { useTheme } from './ThemeContext';
import { Shield, LogOut, Settings, Activity, Eye, Moon, Sun, Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';

interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  message: string;
  screenshot?: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { logs, logAction } = useAudit();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testError, setTestError] = useState<string | null>(null);

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    setTestError(null);
    logAction('Test Execution', 'Started Puppeteer self-test suite', 'Admin');
    
    try {
      const response = await fetch('/api/run-tests', { method: 'POST' });
      const data = await response.json();
      
      if (data.error) {
        setTestError(data.error);
        logAction('Test Execution Failed', data.error, 'System');
      }
      
      if (data.results) {
        setTestResults(data.results);
        const passed = data.results.filter((r: any) => r.status === 'passed').length;
        logAction('Test Execution Completed', `${passed}/${data.results.length} tests passed`, 'System');
      }
    } catch (err: any) {
      setTestError(err.message || 'Failed to connect to test server');
      logAction('Test Execution Error', err.message, 'System');
    } finally {
      setIsTesting(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
      logAction('Admin Login', 'Successful authentication', 'Admin');
    } else {
      setError('Invalid password');
      logAction('Failed Login', 'Attempted login with incorrect password', 'Unknown');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    logAction('Admin Logout', 'User logged out', 'Admin');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-bg text-theme-fg font-sans p-4">
        <div className="w-full max-w-md bg-theme-bg border-4 border-theme-border p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 text-theme-fg" />
          </div>
          <h1 className="text-3xl font-serif font-black text-center mb-2 uppercase">Admin Portal</h1>
          <p className="text-center text-theme-muted-fg mb-8 text-sm font-bold tracking-widest uppercase">Restricted Access</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-theme-muted-fg mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-theme-border bg-transparent focus:outline-none py-2 text-lg text-theme-fg"
                placeholder="Enter admin password"
                aria-label="Admin password"
              />
              {error && <p className="text-red-500 text-sm mt-2 font-bold" role="alert">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-theme-accent text-theme-accent-fg py-3 font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              aria-label="Login to admin portal"
            >
              Authenticate
            </button>
          </form>
          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-xs font-bold uppercase tracking-widest text-theme-muted-fg hover:text-theme-fg"
            >
              Return to Public Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-fg font-sans">
      <header className="border-b-4 border-theme-border p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-serif font-black uppercase">System Administration</h1>
            <p className="text-xs font-bold tracking-widest text-theme-muted-fg uppercase">Diagnostics & Settings</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link 
            to="/admin" 
            className={`text-sm font-bold uppercase tracking-widest px-4 py-2 border-b-2 ${location.pathname === '/admin' ? 'border-theme-fg text-theme-fg' : 'border-transparent text-theme-muted-fg hover:text-theme-fg'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/refresh" 
            className={`text-sm font-bold uppercase tracking-widest px-4 py-2 border-b-2 ${location.pathname === '/admin/refresh' ? 'border-theme-fg text-theme-fg' : 'border-transparent text-theme-muted-fg hover:text-theme-fg'}`}
          >
            Refresh
          </Link>
          <Link 
            to="/admin/testing" 
            className={`text-sm font-bold uppercase tracking-widest px-4 py-2 border-b-2 ${location.pathname === '/admin/testing' ? 'border-theme-fg text-theme-fg' : 'border-transparent text-theme-muted-fg hover:text-theme-fg'}`}
          >
            Testing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="text-sm font-bold uppercase tracking-widest border-2 border-theme-border px-4 py-2 hover:bg-theme-muted transition-colors"
          >
            Public View
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest bg-theme-accent text-theme-accent-fg px-4 py-2 hover:opacity-90 transition-opacity"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/" element={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Settings Panel */}
              <div className="lg:col-span-1 space-y-8">
                <section className="border-2 border-theme-border p-6">
                  <div className="flex items-center gap-2 mb-6 border-b-2 border-theme-border pb-2">
                    <Settings className="w-5 h-5" />
                    <h2 className="text-lg font-serif font-bold uppercase tracking-wide">Accessibility & Theme</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-theme-muted-fg">Select Theme</p>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => { setTheme('light'); logAction('Theme Changed', 'Switched to Light Theme', 'Admin'); }}
                        className={`flex items-center gap-3 p-3 border-2 ${theme === 'light' ? 'border-theme-fg bg-theme-muted' : 'border-theme-border'} hover:bg-theme-muted transition-colors text-left`}
                        aria-pressed={theme === 'light'}
                      >
                        <Sun className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-wider text-sm">Light (Editorial)</span>
                      </button>
                      <button 
                        onClick={() => { setTheme('dark'); logAction('Theme Changed', 'Switched to Dark Theme', 'Admin'); }}
                        className={`flex items-center gap-3 p-3 border-2 ${theme === 'dark' ? 'border-theme-fg bg-theme-muted' : 'border-theme-border'} hover:bg-theme-muted transition-colors text-left`}
                        aria-pressed={theme === 'dark'}
                      >
                        <Moon className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-wider text-sm">Dark Mode</span>
                      </button>
                      <button 
                        onClick={() => { setTheme('hc'); logAction('Theme Changed', 'Switched to High Contrast Theme', 'Admin'); }}
                        className={`flex items-center gap-3 p-3 border-2 ${theme === 'hc' ? 'border-theme-fg bg-theme-muted' : 'border-theme-border'} hover:bg-theme-muted transition-colors text-left`}
                        aria-pressed={theme === 'hc'}
                      >
                        <Eye className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-wider text-sm">High Contrast</span>
                      </button>
                    </div>
                  </div>
                </section>

                <section className="border-2 border-theme-border p-6">
                  <div className="flex items-center gap-2 mb-6 border-b-2 border-theme-border pb-2">
                    <Activity className="w-5 h-5" />
                    <h2 className="text-lg font-serif font-bold uppercase tracking-wide">System Diagnostics</h2>
                  </div>
                  <ul className="space-y-4 text-sm font-mono">
                    <li className="flex justify-between border-b border-theme-border pb-2">
                      <span className="text-theme-muted-fg">React Version</span>
                      <span className="font-bold">19.2.4</span>
                    </li>
                    <li className="flex justify-between border-b border-theme-border pb-2">
                      <span className="text-theme-muted-fg">Tailwind</span>
                      <span className="font-bold">v4.1.14</span>
                    </li>
                    <li className="flex justify-between border-b border-theme-border pb-2">
                      <span className="text-theme-muted-fg">Environment</span>
                      <span className="font-bold">Production</span>
                    </li>
                    <li className="flex justify-between border-b border-theme-border pb-2">
                      <span className="text-theme-muted-fg">Audit Logs</span>
                      <span className="font-bold">{logs.length} entries</span>
                    </li>
                  </ul>
                </section>
              </div>

              {/* Audit Logs */}
              <div className="lg:col-span-2">
                <section className="border-2 border-theme-border h-full flex flex-col">
                  <div className="p-6 border-b-2 border-theme-border bg-theme-muted">
                    <h2 className="text-xl font-serif font-bold uppercase tracking-wide">Comprehensive Audit Log</h2>
                    <p className="text-xs font-bold tracking-widest text-theme-muted-fg uppercase mt-1">System & User Actions</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-0 max-h-[600px]">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-theme-bg border-b-2 border-theme-border">
                        <tr>
                          <th className="py-3 px-4 font-serif font-bold text-xs uppercase tracking-widest text-theme-muted-fg">Timestamp</th>
                          <th className="py-3 px-4 font-serif font-bold text-xs uppercase tracking-widest text-theme-muted-fg">User</th>
                          <th className="py-3 px-4 font-serif font-bold text-xs uppercase tracking-widest text-theme-muted-fg">Action</th>
                          <th className="py-3 px-4 font-serif font-bold text-xs uppercase tracking-widest text-theme-muted-fg">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.length > 0 ? (
                          logs.map((log) => (
                            <tr key={log.id} className="border-b border-theme-border hover:bg-theme-muted transition-colors">
                              <td className="py-3 px-4 text-xs font-mono text-theme-muted-fg whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="py-3 px-4 text-sm font-bold">{log.user}</td>
                              <td className="py-3 px-4 text-sm font-medium">{log.action}</td>
                              <td className="py-3 px-4 text-sm text-theme-muted-fg">{log.details}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-theme-muted-fg font-serif italic">
                              No audit logs available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          } />
          
          <Route path="/refresh" element={
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b-4 border-theme-border pb-6">
                <div>
                  <h2 className="text-3xl font-serif font-black uppercase tracking-wide flex items-center gap-3">
                    <RefreshCw className="w-8 h-8" />
                    Project Refresh Status
                  </h2>
                  <p className="text-sm font-bold tracking-widest text-theme-muted-fg uppercase mt-2">Sequential Refinement Monitoring</p>
                </div>
                <div className="bg-theme-muted px-6 py-3 border-2 border-theme-border font-bold text-xs uppercase tracking-widest">
                   Phase 2: Security & UX Active
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 1, name: 'Foundation Setup', status: 'completed', desc: 'React 19.2.4 Verified • IEEE SRS v3.0.0 Baseline • Project Sync Complete.' },
                  { id: 2, name: 'Core Implementation', status: 'active', desc: 'Harding Admin Security • Refresh Monitoring • WCAG Accessibility Audit.' },
                  { id: 3, name: 'Testing Framework', status: 'pending', desc: 'E2E Puppeteer Suite Validation • Audit Persistence • Link Integrity Audit.' },
                  { id: 4, name: 'Documentation & Diagrams', status: 'pending', desc: 'Architecture SVGs • Comprehensive Guides • Institutional Collateral.' },
                  { id: 5, name: 'Final Alignment', status: 'pending', desc: '100% SRS Sync • Artifact Collation • Final Institutional Handover.' }
                ].map((phase) => (
                  <div key={phase.id} className={`border-2 p-6 flex gap-6 items-start transition-all ${phase.status === 'completed' ? 'border-emerald-500 bg-emerald-500/5' : phase.status === 'active' ? 'border-theme-fg shadow-lg' : 'border-theme-border opacity-50'}`}>
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black ${
                      phase.status === 'completed' ? 'bg-emerald-500 text-white' : 
                      phase.status === 'active' ? 'bg-theme-fg text-theme-bg' : 
                      'bg-theme-muted text-theme-muted-fg'
                    }`}>
                      {phase.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : phase.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-black uppercase tracking-tight ${phase.status === 'pending' ? 'text-theme-muted-fg' : 'text-theme-fg'}`}>
                          PHASE {phase.id}: {phase.name}
                        </h3>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                          phase.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                          phase.status === 'active' ? 'bg-theme-fg/10 text-theme-fg' :
                          'bg-theme-muted text-theme-muted-fg'
                        }`}>
                          {phase.status}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${phase.status === 'pending' ? 'text-theme-muted-fg' : 'text-theme-fg opacity-70'}`}>
                        {phase.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          } />
          <Route path="/testing" element={
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b-4 border-theme-border pb-6">
                <div>
                  <h2 className="text-3xl font-serif font-black uppercase tracking-wide">Puppeteer Self-Test</h2>
                  <p className="text-sm font-bold tracking-widest text-theme-muted-fg uppercase mt-2">Automated UI & Journey Verification</p>
                </div>
                <button 
                  onClick={runTests}
                  disabled={isTesting}
                  className="flex items-center gap-2 bg-theme-accent text-theme-accent-fg px-6 py-3 font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isTesting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  {isTesting ? 'Running Tests...' : 'Execute Test Suite'}
                </button>
              </div>

              {testError && (
                <div className="bg-red-500/10 border-l-4 border-red-500 p-4 text-red-500 font-mono text-sm">
                  <strong>Test Execution Error:</strong> {testError}
                </div>
              )}

              {testResults.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-bold uppercase tracking-wide">Test Results</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {testResults.map((result, idx) => (
                      <div key={idx} className="border-2 border-theme-border p-6 bg-theme-bg">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {result.status === 'passed' ? (
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-500" />
                            )}
                            <h4 className="text-lg font-bold uppercase tracking-wide">{result.name}</h4>
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest ${result.status === 'passed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {result.status}
                          </span>
                        </div>
                        <p className="text-sm text-theme-muted-fg font-mono mb-4">{result.message}</p>
                        
                        {result.screenshot && (
                          <div className="mt-4 border-2 border-theme-border p-2 bg-theme-muted">
                            <p className="text-xs font-bold uppercase tracking-widest text-theme-muted-fg mb-2">Screenshot Capture</p>
                            <img src={result.screenshot} alt={`Screenshot for ${result.name}`} className="w-full h-auto border border-theme-border" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!isTesting && testResults.length === 0 && !testError && (
                <div className="text-center py-16 border-2 border-dashed border-theme-border text-theme-muted-fg">
                  <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-serif italic text-lg">Ready to execute automated test suite.</p>
                  <p className="text-sm mt-2">Click "Execute Test Suite" to begin.</p>
                </div>
              )}
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}
