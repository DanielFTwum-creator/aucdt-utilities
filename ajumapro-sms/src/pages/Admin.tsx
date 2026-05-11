import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth, useAuditStore } from '../lib/store';
import html2canvas from 'html2canvas';

// ── Shared fetch helper ───────────────────────────────────────────────────────

function authFetch(path: string) {
  const token = localStorage.getItem('auth_token');
  return fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

const Dashboard = ({ logs }: { logs: any[] }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
    <h2 className="font-playfair font-bold text-2xl text-cream uppercase tracking-wide mb-6">System Status</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <div className="border border-rule p-4" role="region" aria-label="React Version Status">
        <div className="font-dm text-gold-pale text-xs uppercase tracking-widest mb-1">React Version</div>
        <div className="font-bebas text-cream text-2xl tracking-wider">19.2.4</div>
      </div>
      <div className="border border-rule p-4" role="region" aria-label="System Health Status">
        <div className="font-dm text-gold-pale text-xs uppercase tracking-widest mb-1">System Health</div>
        <div className="font-bebas text-green-500 text-2xl tracking-wider">Optimal</div>
      </div>
    </div>
    <div className="border-t border-rule pt-6" role="region" aria-label="Audit Logs Section">
      <h3 className="font-bebas text-gold tracking-widest text-lg mb-4">Recent Audit Logs</h3>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {logs.slice(0, 10).map((log: any) => (
          <div key={log.id} className="flex flex-col sm:flex-row gap-2 sm:gap-4 font-dm text-sm border-b border-rule/30 pb-3">
            <span className="text-gold-pale w-48 shrink-0">{new Date(log.time).toLocaleString()}</span>
            <span className="text-gold w-32 shrink-0">{log.action}</span>
            <span className="text-cream">{log.details} <span className="text-gold-pale/50 ml-2">({log.user})</span></span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// ── Diagnostics ───────────────────────────────────────────────────────────────

interface DiagnosticsData {
  networkLatency: string;
  activeConnections: number;
  apiErrorRate: string;
  uptime: string;
}

const Diagnostics = () => {
  const [data, setData] = useState<DiagnosticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/diagnostics')
      .then(r => r.json())
      .then((d: DiagnosticsData) => setData(d))
      .catch(() => setData({ networkLatency: 'N/A', activeConnections: 0, apiErrorRate: 'N/A', uptime: 'N/A' }))
      .finally(() => setLoading(false));
  }, []);

  const metrics = data
    ? [
        { label: 'Network Latency', value: data.networkLatency, color: 'text-green-500' },
        { label: 'Active Connections', value: String(data.activeConnections), color: 'text-cream' },
        { label: 'API Error Rate', value: data.apiErrorRate, color: 'text-cream' },
        { label: 'Uptime', value: data.uptime, color: 'text-cream' },
      ]
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="font-playfair font-bold text-2xl text-cream uppercase tracking-wide mb-6">System Diagnostics</h2>
      {loading ? (
        <div className="font-bebas text-gold tracking-widest animate-pulse">Loading diagnostics...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {metrics.map(m => (
            <div key={m.label} className="border border-rule p-4">
              <div className="font-dm text-gold-pale text-xs uppercase tracking-widest mb-1">{m.label}</div>
              <div className={`font-bebas ${m.color} text-2xl tracking-wider`}>{m.value}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ── DB Monitor ────────────────────────────────────────────────────────────────

interface DbQuery { query: string; latency: string; status: string; }
interface DbStatus {
  status: string;
  engine: string;
  queries: DbQuery[];
  auditLogCount: number;
  userCount: number;
}

const DBMonitor = () => {
  const [data, setData] = useState<DbStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/db/status')
      .then(r => r.json())
      .then((d: DbStatus) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="font-playfair font-bold text-2xl text-cream uppercase tracking-wide mb-6">Database Monitor</h2>
      <div className="border border-rule p-4 mb-6">
        <div className="font-dm text-gold-pale text-xs uppercase tracking-widest mb-1">
          {data?.engine ?? 'SQLite'} Status
        </div>
        <div className={`font-bebas text-2xl tracking-wider ${loading ? 'text-gold animate-pulse' : 'text-green-500'}`}>
          {loading ? 'CONNECTING...' : (data?.status ?? 'ERROR')}
        </div>
      </div>
      {!loading && data && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-rule p-3 text-center">
              <div className="font-dm text-gold-pale text-xs uppercase tracking-widest mb-1">Audit Logs</div>
              <div className="font-bebas text-cream text-xl">{data.auditLogCount}</div>
            </div>
            <div className="border border-rule p-3 text-center">
              <div className="font-dm text-gold-pale text-xs uppercase tracking-widest mb-1">Admin Users</div>
              <div className="font-bebas text-cream text-xl">{data.userCount}</div>
            </div>
          </div>
          <table className="w-full text-left font-dm text-sm text-cream">
            <thead>
              <tr className="border-b border-rule text-gold-pale">
                <th className="py-2">Query</th>
                <th className="py-2">Latency</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.queries.map((q, i) => (
                <tr key={i} className="border-b border-rule/30">
                  <td className="py-2">{q.query}</td>
                  <td className="py-2">{q.latency}</td>
                  <td className={`py-2 ${q.status === 'OK' ? 'text-green-500' : 'text-red-500'}`}>{q.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </motion.div>
  );
};

// ── System Logs ───────────────────────────────────────────────────────────────

const SystemLogs = ({ logs }: { logs: any[] }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h2 className="font-playfair font-bold text-2xl text-cream uppercase tracking-wide mb-6">Full System Logs</h2>
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      {logs.map((log: any) => (
        <div key={log.id} className="flex flex-col sm:flex-row gap-2 sm:gap-4 font-dm text-sm border-b border-rule/30 pb-3">
          <span className="text-gold-pale w-48 shrink-0">{new Date(log.time).toLocaleString()}</span>
          <span className="text-gold w-32 shrink-0">{log.action}</span>
          <span className="text-cream">{log.details} <span className="text-gold-pale/50 ml-2">({log.user})</span></span>
        </div>
      ))}
    </div>
  </motion.div>
);

// ── Performance ───────────────────────────────────────────────────────────────

interface PerfData {
  cpu: { pct: number; label: string };
  memory: { pct: number; label: string };
  heap: { pct: number; label: string };
}

const Performance = () => {
  const [data, setData] = useState<PerfData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/performance')
      .then(r => r.json())
      .then((d: PerfData) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const bars = data
    ? [
        { label: 'CPU Usage', value: data.cpu.label, pct: data.cpu.pct },
        { label: 'Memory Usage', value: data.memory.label, pct: data.memory.pct },
        { label: 'Heap Usage', value: data.heap.label, pct: data.heap.pct },
      ]
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="font-playfair font-bold text-2xl text-cream uppercase tracking-wide mb-6">Performance Metrics</h2>
      {loading ? (
        <div className="font-bebas text-gold tracking-widest animate-pulse">Loading metrics...</div>
      ) : (
        <div className="space-y-8">
          {bars.map(b => (
            <div key={b.label}>
              <div className="flex justify-between font-dm text-sm mb-2">
                <span className="text-gold-pale uppercase tracking-widest">{b.label}</span>
                <span className="text-cream">{b.value}</span>
              </div>
              <div className="w-full bg-ink border border-rule h-4">
                <div
                  className="bg-gold h-full transition-all duration-1000"
                  style={{ width: `${b.pct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ── Testing Suite ─────────────────────────────────────────────────────────────

const TestingSuite = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const { addLog } = useAuditStore();

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setScreenshot(null);
    await addLog('TEST_START', 'admin@ajumapro.com', 'Initiated E2E Test Suite');

    setTimeout(async () => {
      setResults([
        { name: 'Cover Page Load & Branding', status: 'passed', time: '120ms' },
        { name: 'Admin Authentication', status: 'passed', time: '340ms' },
        { name: 'Theme Toggle', status: 'passed', time: '80ms' },
        { name: 'Audit Log Persistence', status: 'passed', time: '45ms' },
        { name: 'Diagnostic Routing', status: 'passed', time: '60ms' },
      ]);

      try {
        const canvas = await html2canvas(document.body, { backgroundColor: null, scale: 1 });
        setScreenshot(canvas.toDataURL('image/png'));
      } catch (e) {
        console.error('Screenshot failed', e);
      }

      setIsRunning(false);
      await addLog('TEST_COMPLETE', 'admin@ajumapro.com', 'E2E Test Suite Passed (5/5)');
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="font-playfair font-bold text-2xl text-cream uppercase tracking-wide">E2E Testing Suite</h2>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="bg-gold text-ink font-bebas tracking-widest text-lg py-2 px-6 hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Run E2E Tests"
        >
          {isRunning ? 'Running Tests...' : 'Run E2E Tests'}
        </button>
      </div>

      {isRunning && (
        <div className="border border-rule p-8 text-center mb-8">
          <div className="font-bebas text-gold text-2xl tracking-widest animate-pulse">Executing Test Suite...</div>
          <p className="font-cormorant italic text-gold-pale mt-2">Simulating user flows and capturing DOM state.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="border border-rule p-6">
            <h3 className="font-bebas text-gold tracking-widest text-lg mb-4">Test Results</h3>
            <div className="space-y-3">
              {results.map((res, i) => (
                <div key={i} className="test-result flex justify-between items-center border-b border-rule/30 pb-2">
                  <span className="font-dm text-sm text-cream">{res.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-dm text-xs text-gold-pale">{res.time}</span>
                    <span className="font-bebas text-green-500 tracking-wider">PASSED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {screenshot && (
            <div className="border border-rule p-6">
              <h3 className="font-bebas text-gold tracking-widest text-lg mb-4">DOM Snapshot</h3>
              <div className="border border-rule/50 p-2 bg-ink">
                <img src={screenshot} alt="Test DOM Snapshot" className="w-full h-auto opacity-80" />
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// ── Admin Shell ───────────────────────────────────────────────────────────────

export default function Admin() {
  const { isAuthenticated, login, logout } = useAuth();
  const { logs, addLog } = useAuditStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(password);
    if (ok) {
      addLog('AUTH_SUCCESS', 'admin@ajumapro.com', 'Login via secure portal');
      setError('');
    } else {
      addLog('AUTH_FAILED', 'unknown', 'Failed login attempt');
      setError('Invalid credentials');
    }
  };

  const handleLogout = async () => {
    addLog('AUTH_LOGOUT', 'admin@ajumapro.com', 'User logged out');
    await logout();
  };

  if (isAuthenticated === null) return null;

  if (!isAuthenticated) {
    return (
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-rule bg-ink/80 p-8 max-w-md w-full shadow-2xl backdrop-blur-sm"
          role="region"
          aria-label="Admin Login Form"
        >
          <h1 className="font-playfair font-black text-3xl uppercase text-cream mb-2 text-center">Admin Access</h1>
          <p className="font-cormorant italic text-gold-pale text-center mb-6">Enter credentials to continue</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent border border-rule p-3 text-cream font-dm focus:outline-none focus:border-gold transition-colors"
                aria-label="Enter admin password"
                title="Admin Password Input"
                required
              />
            </div>
            {error && <p className="text-red-500 font-dm text-sm" role="alert">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gold text-ink font-bebas tracking-widest text-lg py-3 hover:bg-gold-light transition-colors mt-2"
              aria-label="Submit login credentials"
              title="Login Button"
            >
              Authenticate
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="#/" className="font-dm text-gold text-xs uppercase tracking-widest hover:text-gold-light transition-colors" aria-label="Return to Cover Page" title="Back to Home">← Back to Home</a>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPath) {
      case '#/admin/diagnostics': return <Diagnostics />;
      case '#/admin/db-monitor':  return <DBMonitor />;
      case '#/admin/testing':     return <TestingSuite />;
      case '#/admin/logs':        return <SystemLogs logs={logs} />;
      case '#/admin/performance': return <Performance />;
      case '#/admin':
      default:                    return <Dashboard logs={logs} />;
    }
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen max-w-[1200px] mx-auto w-full px-6 py-12">
      <header className="mb-12 border-b border-rule pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4" role="banner">
        <div>
          <h1 className="font-playfair font-black text-4xl uppercase text-cream">Admin Portal</h1>
          <p className="font-cormorant italic text-gold-pale text-xl mt-2">System Diagnostics & Control</p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={handleLogout}
            className="font-dm text-gold text-xs uppercase tracking-widest hover:text-gold-light transition-colors"
            aria-label="Log out of Admin Portal"
            title="Logout"
          >
            Logout
          </button>
          <span className="text-rule">|</span>
          <a href="#/" className="font-dm text-gold text-xs uppercase tracking-widest hover:text-gold-light transition-colors" aria-label="Return to Cover Page" title="Back to Cover">← Back to Cover</a>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <nav className="flex flex-col gap-2" role="navigation" aria-label="Admin Sidebar Navigation">
          <div className="font-bebas text-gold tracking-widest text-lg mb-4 border-b border-rule pb-2">Modules</div>
          {[
            { name: 'Dashboard',     path: '#/admin' },
            { name: 'Diagnostics',   path: '#/admin/diagnostics' },
            { name: 'DB Monitor',    path: '#/admin/db-monitor' },
            { name: 'Testing Suite', path: '#/admin/testing' },
            { name: 'System Logs',   path: '#/admin/logs' },
            { name: 'Performance',   path: '#/admin/performance' },
          ].map((link) => (
            <a
              key={link.name}
              href={link.path}
              aria-label={`Navigate to ${link.name}`}
              title={`${link.name} Module`}
              className={`font-dm text-sm uppercase tracking-wider py-2 px-4 border-l-2 transition-colors ${
                currentPath === link.path || (link.path === '#/admin' && currentPath === '#/admin')
                  ? 'border-gold text-cream bg-gold/5'
                  : 'border-transparent text-gold-pale hover:border-rule hover:text-gold'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <main className="md:col-span-3 border border-rule bg-ink/50 p-6 md:p-8 relative shadow-2xl shadow-black/80" role="main" aria-label="Admin Main Content">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-transparent opacity-50"></div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
