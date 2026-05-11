import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeProvider';

interface AuditLog {
  timestamp: string;
  action: string;
}

interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  message?: string;
  screenshot?: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { theme, setTheme } = useTheme();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'testing'>('dashboard');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [systemTime, setSystemTime] = useState(new Date());

  const [targetDate, setTargetDate] = useState(() => {
    const saved = localStorage.getItem('timer-target');
    if (saved) return saved;
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    return defaultDate.toISOString().slice(0, 16);
  });

  const handleSaveTarget = () => {
    localStorage.setItem('timer-target', targetDate);
    addLog(`Timer target updated to ${targetDate}`);
  };

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    const savedLogs = localStorage.getItem('audit-logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    } else {
      addLog('Admin system initialized');
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (action: string) => {
    const newLog = { timestamp: new Date().toISOString(), action };
    setLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 50);
      localStorage.setItem('audit-logs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth', 'true');
      addLog('Admin logged in successfully');
      setError('');
    } else {
      setError('Invalid password');
      addLog('Failed login attempt');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-auth');
    addLog('Admin logged out');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'high-contrast') => {
    setTheme(newTheme);
    addLog(`Theme changed to ${newTheme}`);
  };

  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem('audit-logs');
    addLog('Audit logs cleared');
  };

  const runTests = async () => {
    setIsTesting(true);
    addLog('Started Puppeteer self-test suite');
    try {
      const res = await fetch('/api/run-tests', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTestResults(data.results);
        addLog('Puppeteer self-test suite completed successfully');
      } else {
        addLog(`Puppeteer tests failed: ${data.error}`);
      }
    } catch (err: any) {
      addLog(`Puppeteer tests error: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4 transition-colors duration-300">
        <form 
          onSubmit={handleLogin} 
          className="bg-bg-secondary text-text-secondary p-8 rounded-xl shadow-xl max-w-md w-full hc-border"
          aria-label="Admin Login Form"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm" role="alert">
              {error}
            </div>
          )}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-bg-primary text-text-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter password (admin123)"
              aria-required="true"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-accent text-white p-3 rounded font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-opacity"
            aria-label="Login to Admin Panel"
          >
            Login
          </button>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm underline opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent p-1 rounded">
              Return to Timer
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-500/30 hc-border">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="underline opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent p-2 rounded">
              View Timer
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="mb-8 flex gap-4 border-b border-gray-500/30 hc-border pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-accent text-white' : 'hover:bg-black/10'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('testing')}
            className={`px-4 py-2 rounded font-medium transition-colors ${activeTab === 'testing' ? 'bg-accent text-white' : 'hover:bg-black/10'}`}
          >
            Puppeteer Self-Test
          </button>
        </div>

        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Timer Settings */}
            <section className="bg-bg-secondary text-text-secondary p-6 rounded-xl shadow-md hc-border md:col-span-2" aria-labelledby="timer-settings-title">
              <h2 id="timer-settings-title" className="text-xl font-semibold mb-4">Timer Settings</h2>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label htmlFor="target-date" className="block text-sm font-medium mb-2 opacity-80">Target Date & Time</label>
                  <input
                    id="target-date"
                    type="datetime-local"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full p-3 rounded bg-bg-primary text-text-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <button
                  onClick={handleSaveTarget}
                  className="w-full md:w-auto bg-accent text-white px-6 py-3 rounded font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-opacity"
                >
                  Save Target
                </button>
              </div>
            </section>

            {/* Settings / Themes */}
            <section className="bg-bg-secondary text-text-secondary p-6 rounded-xl shadow-md hc-border" aria-labelledby="theme-settings-title">
              <h2 id="theme-settings-title" className="text-xl font-semibold mb-4">Theme Settings</h2>
              <div className="flex flex-col gap-3">
                {(['light', 'dark', 'high-contrast'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`p-3 rounded text-left border ${theme === t ? 'border-accent bg-accent/10' : 'border-gray-600 hover:border-gray-400'} focus:outline-none focus:ring-2 focus:ring-accent capitalize transition-colors`}
                    aria-pressed={theme === t}
                    aria-label={`Set theme to ${t}`}
                  >
                    {t.replace('-', ' ')} Theme
                  </button>
                ))}
              </div>
            </section>

            {/* Diagnostics */}
            <section className="bg-bg-secondary text-text-secondary p-6 rounded-xl shadow-md hc-border" aria-labelledby="diagnostics-title">
              <h2 id="diagnostics-title" className="text-xl font-semibold mb-4">System Diagnostics</h2>
              <ul className="space-y-2 text-sm font-mono">
                <li className="flex justify-between border-b border-gray-600/50 pb-2">
                  <span className="opacity-70">React Version:</span>
                  <span>19.2.4</span>
                </li>
                <li className="flex justify-between border-b border-gray-600/50 pb-2">
                  <span className="opacity-70">User Agent:</span>
                  <span className="truncate max-w-[200px]" title={navigator.userAgent}>{navigator.userAgent}</span>
                </li>
                <li className="flex justify-between border-b border-gray-600/50 pb-2">
                  <span className="opacity-70">Screen Resolution:</span>
                  <span>{window.innerWidth}x{window.innerHeight}</span>
                </li>
                <li className="flex justify-between border-b border-gray-600/50 pb-2">
                  <span className="opacity-70">Current Theme:</span>
                  <span className="capitalize">{theme}</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span className="opacity-70">System Time:</span>
                  <span>{systemTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </li>
              </ul>
            </section>

            {/* Audit Logs */}
            <section className="md:col-span-2 bg-bg-secondary text-text-secondary p-6 rounded-xl shadow-md hc-border" aria-labelledby="audit-logs-title">
              <div className="flex justify-between items-center mb-4">
                <h2 id="audit-logs-title" className="text-xl font-semibold">Audit Logs</h2>
                <button 
                  onClick={clearLogs}
                  className="text-xs underline opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent p-1 rounded"
                  aria-label="Clear audit logs"
                >
                  Clear Logs
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left" aria-label="Audit Logs Table">
                  <thead className="text-xs uppercase bg-black/10 border-b border-gray-600/50">
                    <tr>
                      <th scope="col" className="px-4 py-3">Timestamp</th>
                      <th scope="col" className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={i} className="border-b border-gray-600/20 hover:bg-black/5">
                        <td className="px-4 py-3 font-mono text-xs opacity-70">
                          {new Date(log.timestamp).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </td>
                        <td className="px-4 py-3">{log.action}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center opacity-50">No logs available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : (
          <section className="bg-bg-secondary text-text-secondary p-6 rounded-xl shadow-md hc-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Automated Testing Suite</h2>
              <button
                onClick={runTests}
                disabled={isTesting}
                className="bg-accent text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {isTesting ? 'Running Tests...' : 'Run Puppeteer Tests'}
              </button>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-8">
                {testResults.map((result, idx) => (
                  <div key={idx} className="border border-gray-600/50 rounded-lg p-4 hc-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-3 h-3 rounded-full ${result.status === 'passed' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <h3 className="text-lg font-medium">{result.name}</h3>
                      <span className={`text-sm ml-auto capitalize font-bold ${result.status === 'passed' ? 'text-green-500' : 'text-red-500'}`}>
                        {result.status}
                      </span>
                    </div>
                    {result.message && <p className="text-red-400 text-sm mb-4">{result.message}</p>}
                    {result.screenshot && (
                      <div className="mt-4">
                        <p className="text-sm opacity-70 mb-2">Screenshot Capture:</p>
                        <img src={result.screenshot} alt={`Screenshot of ${result.name}`} className="max-w-full h-auto rounded border border-gray-600/30" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {testResults.length === 0 && !isTesting && (
              <div className="text-center opacity-50 py-12">
                Click "Run Puppeteer Tests" to execute the test suite.
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
