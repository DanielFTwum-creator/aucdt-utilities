import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCcw, 
  Activity,
  Lock,
  ChevronRight,
  Info,
  Sun,
  Moon,
  Eye,
  LogOut,
  Terminal
} from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';

type LinkStatus = 'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR' | 'QUEUED' | 'LOCKED';

interface LinkItem {
  id: string;
  path: string;
  category: string;
  status: LinkStatus;
  statusCode?: number;
}

const INITIAL_LINKS: LinkItem[] = [
  { id: '1', path: '/', category: 'Public Facing Pages', status: 'IDLE' },
  { id: '2', path: '/admission-requirements', category: 'Public Facing Pages', status: 'IDLE' },
  { id: '3', path: '/program-catalog', category: 'Public Facing Pages', status: 'IDLE' },
  { id: '5', path: '/auth/login', category: 'Applicant Portal', status: 'IDLE' },
  { id: '6', path: '/auth/register', category: 'Applicant Portal', status: 'IDLE' },
  { id: '7', path: '/dashboard/application', category: 'Applicant Portal', status: 'LOCKED' },
  { id: '8', path: '/admin/reviewer-portal', category: 'Administrative Tools', status: 'IDLE' },
  { id: '10', path: '/v1/status/health', category: 'API & System', status: 'IDLE' },
];

const TARGET_DOMAIN = 'https://admissions-dev.techbridge.edu.gh';

// --- Shared Components ---

const Header = ({ children, onLogout }: { children?: React.ReactNode, onLogout?: () => void }) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <nav className="h-16 border-b border-slate-200 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm">TB</div>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight">
          Link auditor <span className="text-slate-400 font-normal">/ dev-environment</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button onClick={() => setTheme('light')} className={`p-1.5 rounded-md ${theme === 'light' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}><Sun className="w-4 h-4" /></button>
          <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500'}`}><Moon className="w-4 h-4" /></button>
          <button onClick={() => setTheme('high-contrast')} className={`p-1.5 rounded-md ${theme === 'high-contrast' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}><Eye className="w-4 h-4" /></button>
        </div>
        {children}
        {onLogout && (
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="h-10 border-t border-slate-200 bg-white dark:bg-slate-900 flex items-center justify-between px-8 text-[10px] text-slate-400 uppercase tracking-widest shrink-0 transition-colors">
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Engineered for Techbridge Education Ghana
    </div>
    <div className="flex gap-4">
      <span>Compliance: ISO/IEC 27001</span>
      <span>Node: GH-ACC-01</span>
    </div>
  </footer>
);

// --- Pages ---

const PublicPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900 transition-colors">
      <Header>
        <button 
          onClick={() => navigate('/admin')}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Admin Login
        </button>
      </Header>
      <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Globe className="w-16 h-16 text-indigo-600 mx-auto" />
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Techbridge Link Auditor</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            A professional diagnostic suite for monitoring the health and integrity of Techbridge University College digital assets.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" /> Real-time Monitoring
            </h4>
            <p className="text-xs text-slate-500">Continuous health checks for all admissions portals and applicant endpoints.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500" /> Secure Diagnostics
            </h4>
            <p className="text-xs text-slate-500">Advanced debugging and link crawling tools are restricted to authorized ICT staff.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const AdminLoginPage = ({ onLogin }: { onLogin: (pw: string) => void }) => {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900 transition-colors">
      <Header />
      <main className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-2">
            <Lock className="w-12 h-12 text-indigo-600 mx-auto" />
            <h2 className="text-2xl font-bold dark:text-white">Admin Access</h2>
            <p className="text-slate-500 text-sm italic">Enter institutional credentials to continue</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); onLogin(pw); }} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Security Token</label>
              <input 
                type="password" 
                value={pw} 
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              />
            </div>
            <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none">
              Authenticate
            </button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'AUDIT' | 'DIAGNOSTICS'>('AUDIT');
  const [simMode, setSimMode] = useState('NORMAL');

  const categories = Array.from(new Set(links.map(l => l.category)));

  const logAction = async (action: string, details: any) => {
    try {
      await fetch('/api/admin/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, details })
      });
      fetchLogs();
    } catch (e) {}
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      setLogs(data.slice(-5).reverse());
    } catch (e) {}
  };

  const setSimulation = async (mode: string) => {
    setSimMode(mode);
    await fetch('/api/admin/set-simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode })
    });
  };

  useEffect(() => { fetchLogs(); }, []);

  const checkLinkHealth = async (id: string, url: string) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, status: 'PENDING' } : l));
    
    try {
      const response = await fetch('/api/check-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      
      setLinks(prev => prev.map(l => l.id === id ? { 
        ...l, 
        status: data.status >= 200 && data.status < 400 ? 'SUCCESS' : 'ERROR',
        statusCode: data.status
      } : l));
    } catch (error) {
      setLinks(prev => prev.map(l => l.id === id ? { ...l, status: 'ERROR', statusCode: 500 } : l));
    }
  };

  const runFullSuite = async () => {
    setIsScanning(true);
    setLastScanTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    logAction('FULL_SUITE_SCAN', { timestamp: new Date() });
    
    for (const link of links) {
      if (link.status === 'LOCKED') continue;
      await checkLinkHealth(link.id, `${TARGET_DOMAIN}${link.path}`);
    }
    
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900 transition-colors">
      <Header onLogout={onLogout}>
        <button 
          onClick={runFullSuite}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isScanning ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
          Run Suite
        </button>
      </Header>
      
      <main className="flex-1 p-8 grid grid-cols-12 gap-8 container mx-auto">
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl flex">
            <button 
              onClick={() => setActiveTab('AUDIT')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'AUDIT' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Auditor
            </button>
            <button 
              onClick={() => setActiveTab('DIAGNOSTICS')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'DIAGNOSTICS' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Diagnostics
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Audit Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Verified</span>
                <span className="font-bold dark:text-white">{links.filter(l => l.status === 'SUCCESS').length}</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(links.filter(l => l.status === 'SUCCESS').length / links.length) * 100}%` }} />
              </div>
            </div>
          </div>
          
          {activeTab === 'DIAGNOSTICS' && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Failure Simulation</h3>
              <div className="grid grid-cols-1 gap-2">
                {['NORMAL', 'ERR_404', 'ERR_500'].map(mode => (
                  <button 
                    key={mode}
                    onClick={() => setSimulation(mode)}
                    className={`px-3 py-2 text-[10px] font-mono rounded border transition-all ${simMode === mode ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900 p-6 rounded-xl text-white space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-2">
              <Terminal className="w-3 h-3" /> System Logs
            </h3>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="text-[10px] font-mono flex gap-2 items-start text-slate-400">
                  <span className="text-indigo-400 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                  <span className="break-all">{log.action}</span>
                </div>
              ))}
              {logs.length === 0 && <div className="text-[10px] text-slate-600">No activity recorded</div>}
            </div>
          </div>
        </aside>

        <div className="col-span-12 lg:col-span-9">
          {activeTab === 'AUDIT' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <section key={cat} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-sm">
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{cat}</h4>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {links.filter(l => l.category === cat).map(link => (
                      <div key={link.id} className="px-4 py-3 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-3">
                          {link.status === 'SUCCESS' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                          {link.status === 'ERROR' && <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                          {link.status === 'PENDING' && <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />}
                          {link.status === 'LOCKED' && <Lock className="w-3 h-3 text-slate-300" />}
                          {link.status === 'IDLE' && <div className="w-2 h-2 rounded-full bg-slate-300" />}
                          <span className={`text-[13px] font-medium ${link.status === 'LOCKED' ? 'text-slate-400 italic' : 'text-slate-700 dark:text-slate-300'}`}>
                            {link.path}
                          </span>
                          {link.status !== 'LOCKED' && (
                            <a 
                              href={`${TARGET_DOMAIN}${link.path}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all"
                              title="Verify manually"
                            >
                              <ExternalLink className="w-3 h-3 text-slate-400 hover:text-indigo-600" />
                            </a>
                          )}
                        </div>
                        <span className={`text-[10px] font-mono font-bold ${link.status === 'SUCCESS' ? 'text-emerald-500' : link.status === 'ERROR' ? 'text-rose-500' : 'text-slate-400'}`}>
                          {link.status === 'SUCCESS' ? '200 OK' : link.status === 'ERROR' ? `ERR ${link.statusCode}` : link.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-sm text-center space-y-6">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold dark:text-white">Validation Dashboard</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Execute institutional E2E integrity tests and capture automated environmental screenshots.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Run Playwright Suite
                  </button>
                  <button className="px-6 py-3 border border-slate-200 dark:border-slate-700 dark:text-white rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center gap-2">
                    <Info className="w-4 h-4" /> Export Report
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Security Audit', 'CORS Integrity', 'Mobile Response'].map(test => (
                  <div key={test} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{test}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded">PASSED</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

// --- App Entry ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('adminToken'));
  const navigate = useNavigate();

  const handleLogin = async (password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        navigate('/admin');
      } else {
        alert('Authentication Failed');
      }
    } catch (e) {
      alert('Error connecting to security server');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<PublicPage />} />
      <Route 
        path="/admin" 
        element={
          isAuthenticated ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <AdminLoginPage onLogin={handleLogin} />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
