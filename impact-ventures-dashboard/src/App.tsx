import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import {
  BarChart3,
  Target,
  ShieldCheck,
  Lightbulb,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Info,
  Maximize2,
  FileText,
  GraduationCap,
  Stethoscope,
  Sprout,
  Scale,
  Cpu,
  Truck,
  Globe,
  Wallet,
  Lock,
  LogOut,
  Activity,
  Settings,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { APP_DATA, STRATEGIC_OBSERVATIONS, type AppRanking } from './data';
import { cn } from './lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ── Admin types ──────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'admin123';
const ADMIN_SESSION_KEY = 'impact-ventures-admin';
const AUDIT_LOG_KEY = 'impact-ventures-audit-logs';

interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }

function getAuditLogs(): AuditEntry[] {
  try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; }
}
function appendAuditLog(action: string, details?: string) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}

// ── AdminLoginModal ──────────────────────────────────────────────────────────
const AdminLoginModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      appendAuditLog('ADMIN_LOGIN_SUCCESS');
      onSuccess();
    } else {
      appendAuditLog('ADMIN_LOGIN_FAIL', 'Invalid password attempt');
      setError('Invalid password.');
      setPwd('');
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="admin-login-title"
      className="fixed inset-0 z-[100] bg-brand-depth/90 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-brand-surface border border-white/10 rounded-sm p-10 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Lock size={18} className="text-brand-cyan" aria-hidden="true" />
          <h2 id="admin-login-title" className="text-sm font-mono font-bold uppercase tracking-[0.3em] text-white">Admin Access</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin-pwd" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-3">Password</label>
            <div className="relative">
              <input id="admin-pwd" type={showPwd ? 'text' : 'password'} value={pwd}
                onChange={e => { setPwd(e.target.value); setError(''); }}
                autoFocus required
                aria-describedby={error ? 'admin-pwd-error' : undefined}
                className="w-full bg-brand-depth border border-slate-800 focus:border-brand-cyan rounded-sm px-4 py-3 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-brand-cyan/30 pr-12" />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p id="admin-pwd-error" role="alert" className="mt-2 text-[11px] text-red-400 font-mono flex items-center gap-2"><AlertTriangle size={12} />{error}</p>}
          </div>
          <div className="flex gap-4 pt-2">
            <button type="submit"
              className="flex-1 bg-brand-cyan text-brand-depth font-bold py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all">
              Authenticate
            </button>
            <button type="button" onClick={onClose}
              className="px-6 border border-white/10 text-slate-400 font-bold py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ── AdminDashboard ───────────────────────────────────────────────────────────
const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'diagnostics'>('logs');
  const [storageTest, setStorageTest] = useState<'idle' | 'pass' | 'fail'>('idle');

  useEffect(() => {
    if (activeTab === 'logs') setLogs(getAuditLogs());
  }, [activeTab]);

  const handleLogout = () => {
    appendAuditLog('ADMIN_LOGOUT');
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    onClose();
  };

  const runStorageTest = () => {
    try {
      localStorage.setItem('__diag__', '1');
      localStorage.removeItem('__diag__');
      setStorageTest('pass');
      appendAuditLog('DIAGNOSTIC_RUN', 'localStorage: PASS');
    } catch {
      setStorageTest('fail');
      appendAuditLog('DIAGNOSTIC_RUN', 'localStorage: FAIL');
    }
  };

  return (
    <div role="main" aria-label="Admin Dashboard"
      className="fixed inset-0 z-[100] bg-brand-depth overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pt-4 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-brand-cyan" aria-hidden="true" />
            <h1 className="text-lg font-mono font-bold uppercase tracking-[0.3em] text-white">Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} aria-label="Logout from admin"
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-red-900/20 border border-red-800/40 text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-900/40 transition-all">
            <LogOut size={14} aria-hidden="true" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div role="tablist" aria-label="Admin sections" className="flex gap-1 bg-brand-surface/30 p-1 rounded-sm border border-white/5 w-fit">
          {(['logs', 'diagnostics'] as const).map(tab => (
            <button key={tab} role="tab" aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn('px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xs transition-all',
                activeTab === tab ? 'bg-brand-cyan text-brand-depth' : 'text-slate-500 hover:text-white')}>
              {tab === 'logs' ? 'Audit Log' : 'Diagnostics'}
            </button>
          ))}
        </div>

        {/* Audit Log Tab */}
        {activeTab === 'logs' && (
          <section aria-label="Audit log">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
              <Activity size={14} className="text-brand-cyan" aria-hidden="true" /> Activity Stream
            </h2>
            <div className="rounded-sm border border-white/5 overflow-hidden">
              <table className="w-full text-xs font-mono" aria-label="Admin activity log">
                <thead>
                  <tr className="bg-brand-surface/50 text-left">
                    <th scope="col" className="px-6 py-3 text-[9px] uppercase tracking-widest text-slate-600 font-bold">Timestamp</th>
                    <th scope="col" className="px-6 py-3 text-[9px] uppercase tracking-widest text-slate-600 font-bold">Action</th>
                    <th scope="col" className="px-6 py-3 text-[9px] uppercase tracking-widest text-slate-600 font-bold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-10 text-center text-slate-700">No log entries yet.</td></tr>
                  ) : logs.map(log => (
                    <tr key={log.id} className="hover:bg-brand-surface/30 transition-colors">
                      <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-3 text-brand-cyan">{log.action}</td>
                      <td className="px-6 py-3 text-slate-500">{log.details || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Diagnostics Tab */}
        {activeTab === 'diagnostics' && (
          <section aria-label="System diagnostics">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
              <Settings size={14} className="text-brand-cyan" aria-hidden="true" /> Runtime Diagnostics
            </h2>
            <div className="space-y-4">
              <div className="bg-brand-surface/30 border border-white/5 rounded-sm p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono font-bold text-white uppercase tracking-widest">LocalStorage Access</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-1">Verifies browser storage read/write</p>
                </div>
                <div className="flex items-center gap-4">
                  {storageTest !== 'idle' && (
                    <span role="status" className={cn('text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-sm border',
                      storageTest === 'pass' ? 'text-brand-mint border-brand-mint/30 bg-brand-mint/5' : 'text-red-400 border-red-400/30 bg-red-400/5')}>
                      {storageTest === 'pass' ? 'PASS' : 'FAIL'}
                    </span>
                  )}
                  <button onClick={runStorageTest}
                    className="px-5 py-2 bg-brand-depth border border-slate-700 text-brand-cyan text-[10px] font-bold uppercase tracking-widest rounded-sm hover:border-brand-cyan transition-all">
                    Run Test
                  </button>
                </div>
              </div>
              <div className="bg-brand-surface/30 border border-white/5 rounded-sm p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono font-bold text-white uppercase tracking-widest">Portfolio Count</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-1">Validates APP_DATA integrity</p>
                </div>
                <span role="status" className="text-[10px] font-mono font-bold text-brand-mint border border-brand-mint/30 bg-brand-mint/5 px-3 py-1 rounded-sm uppercase tracking-widest">
                  {APP_DATA.length} ASSETS
                </span>
              </div>
              <div className="bg-brand-surface/30 border border-white/5 rounded-sm p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono font-bold text-white uppercase tracking-widest">Gemini API Key</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-1">Checks environment variable availability</p>
                </div>
                <span role="status" className={cn('text-[10px] font-mono font-bold px-3 py-1 rounded-sm border uppercase tracking-widest',
                  process.env.GEMINI_API_KEY ? 'text-brand-mint border-brand-mint/30 bg-brand-mint/5' : 'text-red-400 border-red-400/30 bg-red-400/5')}>
                  {process.env.GEMINI_API_KEY ? 'CONFIGURED' : 'MISSING'}
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const CategoryIcon = ({ category, size = 16, className = "" }: { category: AppRanking['category'], size?: number, className?: string }) => {
  const iconMap: Record<AppRanking['category'], React.ElementType> = {
    FinTech: Wallet,
    HealthTech: Stethoscope,
    EdTech: GraduationCap,
    AgriTech: Sprout,
    LegalTech: Scale,
    Compliance: ShieldCheck,
    Logistics: Truck,
    Infrastructure: Cpu,
    Media: Globe
  };
  const Icon = iconMap[category];
  return <Icon size={size} className={className} />;
};

const TierBadge = ({ tier }: { tier: number }) => {
  const colors = [
    "border-brand-cyan text-brand-cyan bg-brand-cyan/5",
    "border-brand-mint text-brand-mint bg-brand-mint/5",
    "border-brand-amber text-brand-amber bg-brand-amber/5",
    "border-slate-500 text-slate-400 bg-slate-500/5",
  ];
  return (
    <span className={cn(
      "px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.15em] border rounded-sm whitespace-nowrap",
      colors[tier - 1]
    )}>
      T{tier} ACTIVE
    </span>
  );
};

const MetricIndicator = ({ value, label, colorClass = "bg-brand-cyan" }: { value: number, label: string, colorClass?: string }) => (
  <div className="w-full space-y-1.5">
    <div className="flex justify-between items-baseline">
      <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider transition-colors group-hover:text-slate-300">{label}</span>
      <span className="text-xs font-mono font-bold text-white transition-all">0{value}.00</span>
    </div>
    <div className="segmented-bar" aria-label={`${label}: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className={cn(
            "segmented-segment transition-all duration-700",
            i <= value ? colorClass : "bg-slate-800"
          )} 
        />
      ))}
    </div>
  </div>
);

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTier, setActiveTier] = useState<number | 'all'>('all');
  const [mRange, setMRange] = useState<[number, number]>([1, 5]);
  const [gRange, setGRange] = useState<[number, number]>([1, 5]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppRanking | null>(null);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [briefs, setBriefs] = useState<Record<number, { text: string; loading: boolean; error?: string }>>({});
  const [activeCategory, setActiveCategory] = useState<AppRanking['category'] | 'all'>('all');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Restore admin session and handle #/admin hash route
  useEffect(() => {
    const checkRoute = () => {
      if (window.location.hash === '#/admin') {
        if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
          setShowAdmin(true);
        } else {
          setShowAdminLogin(true);
        }
      }
    };
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  const handleAdminClose = useCallback(() => {
    setShowAdmin(false);
    window.location.hash = '';
  }, []);

  const compareApps = useMemo(() => {
    return APP_DATA.filter(app => compareIds.includes(app.rank));
  }, [compareIds]);

  const toggleCompare = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const handleGenerateBrief = async (app: AppRanking) => {
    if (briefs[app.rank]?.loading) return;

    setBriefs(prev => ({ 
      ...prev, 
      [app.rank]: { text: '', loading: true } 
    }));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a concise, professional strategic brief for an AI venture. 
          Venture Name: ${app.name}
          Category: ${app.category}
          Description: ${app.description}
          Monetisation Score: ${app.m}/5
          Social Good Score: ${app.g}/5
          Tier: ${app.tier}
          Strategic Rationale: ${app.why}
          
          The brief should be exactly 4 bullet points focusing on:
          1. Commercial Scalability
          2. Societal Impact
          3. Key Risks
          4. Strategic Recommendation`,
      });

      const text = response.text || "Failed to generate brief.";
      setBriefs(prev => ({ 
        ...prev, 
        [app.rank]: { text, loading: false } 
      }));
    } catch (error) {
      console.error("AI Generation Error:", error);
      setBriefs(prev => ({ 
        ...prev, 
        [app.rank]: { text: '', loading: false, error: "AI Service Unavailable" } 
      }));
    }
  };

  const filteredApps = useMemo(() => {
    return APP_DATA.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           app.why.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = activeTier === 'all' || app.tier === activeTier;
      const matchesCategory = activeCategory === 'all' || app.category === activeCategory;
      const matchesM = app.m >= mRange[0] && app.m <= mRange[1];
      const matchesG = app.g >= gRange[0] && app.g <= gRange[1];
      return matchesSearch && matchesTier && matchesCategory && matchesM && matchesG;
    });
  }, [searchTerm, activeTier, activeCategory, mRange, gRange]);

  const stats = useMemo(() => ({
    total: APP_DATA.length,
    highImpact: APP_DATA.filter(a => a.g >= 4).length,
    highRev: APP_DATA.filter(a => a.m >= 4).length,
  }), []);

  return (
    <>
    {showAdmin && <AdminDashboard onClose={handleAdminClose} />}
    {showAdminLogin && (
      <AdminLoginModal
        onClose={() => { setShowAdminLogin(false); window.location.hash = ''; }}
        onSuccess={() => { setShowAdminLogin(false); setShowAdmin(true); }}
      />
    )}
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-cyan focus:text-brand-depth focus:font-bold focus:rounded-sm">
      Skip to main content
    </a>
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12 relative overflow-hidden">
      <div className="noise-overlay" aria-hidden="true" />
      {/* Header Section */}
      <header role="banner" className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5 relative">
        <div className="absolute bottom-0 left-0 w-32 h-px bg-brand-cyan" />
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-cyan">
            <div className="w-1.5 h-1.5 bg-brand-cyan animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em]">IMPACT_ANALYSIS_NODE.2026</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.8]">
            <span className="text-white">IMPACT</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-400/20 to-slate-800/10 border-slate-700/50" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}>
              VENTURES
            </span>
          </h1>
          <p className="text-slate-500 max-w-lg text-xs font-mono uppercase tracking-widest leading-loose">
            Multivariate risk/reward engine balancing commercial liquidity against sovereign societal advancement vectors.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-brand-surface/30 px-6 py-4 border border-white/5 rounded-sm space-y-1 min-w-[160px]">
            <span className="block text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">PORTFOLIO.SIZE</span>
            <span className="text-3xl font-display font-bold text-white uppercase tracking-tighter">{stats.total} <span className="text-[10px] text-slate-700 font-mono tracking-normal">UNITS</span></span>
          </div>
          <div className="bg-brand-surface/30 px-6 py-4 border border-white/5 rounded-sm space-y-1 min-w-[160px]">
            <span className="block text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">IMPACT.CRITICAL</span>
            <span className="text-3xl font-display font-bold text-brand-mint uppercase tracking-tighter">{stats.highImpact} <span className="text-[10px] text-slate-700 font-mono tracking-normal">SIGMA</span></span>
          </div>
        </div>
      </header>

      {/* Matrix Section */}
      <section id="main-content" aria-label="Impact matrix and strategic intelligence" className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-brand-surface/20 border border-white/5 rounded-sm p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-12 h-1 bg-brand-cyan" />
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
              <Target size={14} className="text-brand-cyan" />
              MATRIX_INDEX_ALPHA <span className="text-slate-800 tracking-normal px-2 bg-white/5 rounded-xs">V2.94</span>
            </h2>
            <div className="flex gap-4 items-center text-[9px] font-mono font-bold text-slate-600">
              <div className="flex items-center gap-2 tracking-widest uppercase"><div className="w-1.5 h-1.5 bg-brand-cyan" /> Tier 1</div>
              <div className="flex items-center gap-2 tracking-widest uppercase"><div className="w-1.5 h-1.5 bg-brand-mint" /> Tier 2</div>
              <div className="flex items-center gap-2 tracking-widest uppercase"><div className="w-1.5 h-1.5 bg-brand-amber" /> Tier 3</div>
            </div>
          </div>
          <div className="h-[440px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <XAxis 
                  type="number" 
                  dataKey="m" 
                  name="Monetisation" 
                  domain={[1, 5]} 
                  stroke="rgba(148, 163, 184, 0.2)" 
                  fontSize={10} 
                  fontFamily="DM Mono"
                  fontWeight={500}
                  tickFormatter={(val) => `M${val}`}
                />
                <YAxis 
                  type="number" 
                  dataKey="g" 
                  name="AI-for-Good" 
                  domain={[1, 5]} 
                  stroke="rgba(148, 163, 184, 0.2)" 
                  fontSize={10} 
                  fontFamily="DM Mono"
                  fontWeight={500}
                  tickFormatter={(val) => `G${val}`}
                />
                <ZAxis type="number" range={[100, 400]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as AppRanking;
                      return (
                        <div className="bg-slate-900 border border-slate-600 p-4 rounded-lg shadow-2xl backdrop-blur-md">
                          <p className="text-sm font-mono font-bold text-brand-cyan mb-2">{data.name}</p>
                          <div className="flex justify-between gap-6">
                            <span className="text-xs font-bold text-slate-200 uppercase">Tier {data.tier}</span>
                            <span className="text-xs font-bold text-white">M:{data.m} G:{data.g}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={APP_DATA} animationBegin={500} animationDuration={1500} animationEasing="ease-out">
                  {APP_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.tier === 1 ? '#22d3ee' : entry.tier === 2 ? '#10b981' : entry.tier === 3 ? '#f59e0b' : '#94a3b8'} 
                      onClick={() => setSelectedApp(entry)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Observations Sidebar */}
        <div className="space-y-8">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
            <Lightbulb size={14} className="text-brand-amber" />
            SYNTHETIC_INTELLIGENCE
          </h2>
          <div className="space-y-4">
            {STRATEGIC_OBSERVATIONS.map((obs, i) => (
              <motion.div 
                key={obs.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-brand-surface/30 border border-white/5 p-6 rounded-sm space-y-4 group hover:border-brand-cyan/20 transition-all cursor-default"
              >
                <div className="flex justify-between items-start">
                   <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em]">{obs.title}</h3>
                   <div className="text-slate-800 font-mono text-[9px] uppercase tracking-widest pb-1 border-b border-white/5">PRIORITY_HI</div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-mono italic opacity-80 group-hover:opacity-100 transition-opacity">“{obs.observation}”</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {obs.items.map(item => (
                    <span key={item} className="text-[9px] font-mono font-bold px-2 py-1 bg-brand-depth text-slate-500 border border-white/5 uppercase tracking-tighter">
                      {item.split('-').join('_')}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main List Section */}
      <section aria-label="Venture registry" className="space-y-12 pt-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-4xl font-display font-bold text-white tracking-tight">Project Registry</h2>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span className="text-brand-cyan">●</span> 30 LIVE ASSETS
              <span className="mx-2">/</span>
              BALANCED SCORECARD
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="group relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-cyan transition-colors" size={16} />
              <input
                type="search"
                placeholder="SEARCH VENTURE ARCHIVE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search ventures"
                className="bg-brand-surface/40 backdrop-blur-md border border-slate-800 rounded-sm pl-12 pr-6 py-3 text-xs font-mono tracking-wider focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/20 transition-all w-80 placeholder:text-slate-700"
              />
            </div>
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              aria-expanded={showAdvancedFilters}
              aria-controls="advanced-filters"
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-sm border text-xs font-bold uppercase tracking-[0.15em] transition-all relative overflow-hidden group/btn",
                showAdvancedFilters ? "bg-brand-surface border-brand-cyan text-brand-cyan" : "bg-brand-surface/20 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
              )}
            >
              <div className="absolute inset-0 bg-brand-cyan/5 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
              <Filter size={14} className="relative z-10" />
              <span className="relative z-10">REFINE</span>
            </button>

            <div role="group" aria-label="Filter by tier" className="flex bg-brand-depth border border-slate-800 rounded-sm p-1 gap-1 relative h-10 items-center">
              {['all', 1, 2, 3, 4].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTier(t as any)}
                  aria-pressed={activeTier === t}
                  aria-label={t === 'all' ? 'Show all tiers' : `Filter tier ${t}`}
                  className={cn(
                    "px-4 h-full rounded-xs text-[10px] font-bold uppercase tracking-widest transition-all relative z-10",
                    activeTier === t ? "text-brand-depth" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {t === 'all' ? 'ALL' : `T${t}`}
                </button>
              ))}
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-y-1 bg-brand-cyan rounded-xs pointer-events-none"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                style={{ 
                  left: activeTier === 'all' ? 4 : typeof activeTier === 'number' ? (activeTier * 44) + 4 : 4,
                  width: activeTier === 'all' ? 44 : 40
                }}
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              id="advanced-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-brand-surface/40 backdrop-blur-xl border border-slate-800 rounded-sm p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {/* Monetisation Range */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-bold text-brand-cyan uppercase tracking-[0.2em]">ROI SCORE ARCHIVE</label>
                    <span className="text-xs font-mono text-white">M{mRange[0]}.00 — M{mRange[1]}.00</span>
                  </div>
                  <div className="px-2 space-y-4">
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] text-slate-500 font-mono w-12 tracking-tighter">LO_BOUND</span>
                      <input 
                        type="range" 
                        min="1" max="5" step="1" 
                        value={mRange[0]}
                        onChange={(e) => setMRange([Math.min(parseInt(e.target.value), mRange[1]), mRange[1]])}
                        className="flex-1 accent-brand-cyan h-1 bg-slate-800 rounded-none cursor-crosshair"
                      />
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] text-slate-500 font-mono w-12 tracking-tighter">HI_BOUND</span>
                      <input 
                        type="range" 
                        min="1" max="5" step="1" 
                        value={mRange[1]}
                        onChange={(e) => setMRange([mRange[0], Math.max(parseInt(e.target.value), mRange[0])])}
                        className="flex-1 accent-brand-cyan h-1 bg-slate-800 rounded-none cursor-crosshair"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Good Range */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-bold text-brand-mint uppercase tracking-[0.2em]">IMPACT CAPACITY</label>
                    <span className="text-xs font-mono text-white">G{gRange[0]}.00 — G{gRange[1]}.00</span>
                  </div>
                  <div className="px-2 space-y-4">
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] text-slate-500 font-mono w-12 tracking-tighter">LO_BOUND</span>
                      <input 
                        type="range" 
                        min="1" max="5" step="1" 
                        value={gRange[0]}
                        onChange={(e) => setGRange([Math.min(parseInt(e.target.value), gRange[1]), gRange[1]])}
                        className="flex-1 accent-brand-mint h-1 bg-slate-800 rounded-none cursor-crosshair"
                      />
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] text-slate-500 font-mono w-12 tracking-tighter">HI_BOUND</span>
                      <input 
                        type="range" 
                        min="1" max="5" step="1" 
                        value={gRange[1]}
                        onChange={(e) => setGRange([gRange[0], Math.max(parseInt(e.target.value), gRange[0])])}
                        className="flex-1 accent-brand-mint h-1 bg-slate-800 rounded-none cursor-crosshair"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-6">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] block">Vertical Index</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'LegalTech', 'Compliance', 'Logistics', 'Infrastructure', 'Media'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as any)}
                        className={cn(
                          "px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all border flex items-center gap-2",
                          activeCategory === cat 
                            ? "bg-brand-cyan border-brand-cyan text-brand-depth" 
                            : "bg-brand-surface border-slate-700 text-slate-500 hover:border-slate-500"
                        )}
                      >
                        {cat !== 'all' && <CategoryIcon category={cat as any} size={10} className={activeCategory === cat ? "text-brand-depth" : "text-brand-cyan"} />}
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800/60 flex justify-between items-center">
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Advanced multi-variant filtering system activated</p>
                <button 
                  onClick={() => {
                    setMRange([1, 5]);
                    setGRange([1, 5]);
                    setActiveTier('all');
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className="text-[10px] font-bold text-brand-amber uppercase hover:text-white transition-colors tracking-[0.2em] flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-brand-amber rounded-full" />
                  Reset all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,1.1fr,1fr] gap-6">
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app, i) => (
              <motion.div
                layout
                key={app.rank}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => setSelectedApp(app)}
                className="group relative bg-brand-surface border border-brand-cyan/10 hover:border-brand-cyan/30 flex flex-col cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(0,255,209,0.06)] overflow-hidden"
                style={{
                  padding: '20px 20px 20px 28px'
                }}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-cyan/20 group-hover:bg-brand-cyan transition-colors" />
                
                {/* Rank Ghost Watermark */}
                <span className="absolute -right-4 -top-8 text-[96px] font-display font-black text-white/5 pointer-events-none tracking-tighter">
                  #{app.rank.toString().padStart(2, '0')}
                </span>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                       <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-brand-mint uppercase tracking-[0.2em] opacity-80">EYEBROW // {app.category}</span>
                       </div>
                       <h3 className="text-2xl font-display font-bold text-white tracking-widest leading-none group-hover:text-brand-cyan transition-colors">
                        {app.name.split('-').join(' ')}
                       </h3>
                    </div>
                  </div>
                  
                  <p className="text-[11px] font-mono text-slate-400 line-clamp-3 mb-8 leading-relaxed pr-8">
                    {app.why}
                  </p>

                  <div className="mt-auto space-y-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <MetricIndicator value={app.m} label="ROI" />
                      <MetricIndicator value={app.g} label="GOOD" colorClass="bg-brand-mint" />
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/60">
                      <button 
                        onClick={(e) => toggleCompare(app.rank, e)}
                        className={cn(
                          "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-sm transition-all overflow-hidden relative group/compare",
                          compareIds.includes(app.rank) 
                            ? "bg-brand-cyan text-brand-depth" 
                            : "bg-brand-depth text-brand-amber border border-brand-amber/20 hover:border-brand-amber/50"
                        )}
                      >
                         <motion.div 
                          className="flex items-center gap-2"
                          animate={{ x: compareIds.includes(app.rank) ? 0 : -4 }}
                         >
                           <ChevronRight size={12} className={cn("transition-transform", compareIds.includes(app.rank) ? "rotate-90" : "")} />
                           <span>{compareIds.includes(app.rank) ? 'MAPPED' : 'COMPARE'}</span>
                         </motion.div>
                      </button>

                      <div className="absolute bottom-0 right-0 translate-y-1/2 group-hover:translate-y-0 transition-transform duration-500">
                        <TierBadge tier={app.tier} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* App Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              aria-hidden="true"
              className="fixed inset-0 bg-brand-depth/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Venture detail: ${selectedApp.name.split('-').join(' ')}`}
              layoutId={`modal-${selectedApp.rank}`}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed inset-x-4 md:inset-x-auto md:w-[640px] top-[15%] md:top-[12%] mx-auto bg-brand-surface border border-white/10 rounded-sm p-12 z-[60] shadow-[0_0_64px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-24 h-1 bg-brand-cyan" />
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-6xl font-display font-bold text-white/10 tracking-tighter leading-none">#{selectedApp.rank.toString().padStart(2, '0')}</span>
                    <TierBadge tier={selectedApp.tier} />
                  </div>
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={selectedApp.category} size={28} className="text-brand-cyan" />
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter leading-none">
                      {selectedApp.name.split('-').join(' ')}
                    </h2>
                  </div>
                </div>
                <button onClick={() => setSelectedApp(null)} aria-label="Close venture detail" className="p-2 hover:bg-white/5 rounded-sm transition-colors border border-transparent hover:border-white/10">
                  <Maximize2 size={24} className="text-slate-500 rotate-45" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12 border-y border-white/5 py-10">
                <MetricIndicator value={selectedApp.m} label="ROI_CAPACITY_INDEX" />
                <MetricIndicator value={selectedApp.g} label="SOCIAL_LIQUIDITY" colorClass="bg-brand-mint" />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-brand-cyan">
                  <div className="h-px flex-1 bg-white/5" />
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">STRATEGIC_SUMMARY</h4>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <p className="text-slate-400 text-sm font-mono leading-loose italic opacity-90">
                  “{selectedApp.why}”
                </p>

                {briefs[selectedApp.rank]?.text && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-brand-depth border border-brand-cyan/20 p-8 rounded-sm space-y-6"
                  >
                    <div className="flex items-center gap-3 text-brand-cyan">
                      <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em]">AI_SYNTHESIS_STREAM</span>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed font-mono space-y-4">
                      {briefs[selectedApp.rank].text.split('\n').filter(line => line.trim()).map((line, idx) => (
                        <div key={idx} className="flex gap-3 opacity-90">
                          <span className="text-brand-cyan font-bold transition-all group-hover:scale-125">»</span>
                          <span>{line.replace(/^[•\-\d\.]+\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {briefs[selectedApp.rank]?.error && (
                  <motion.div
                    role="alert"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-red-950/20 border border-red-800/40 p-6 rounded-sm flex items-start gap-3"
                  >
                    <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-red-400">AI_SYNTHESIS_ERROR</p>
                      <p className="text-xs font-mono text-red-300/90">{briefs[selectedApp.rank].error}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => handleGenerateBrief(selectedApp)}
                  disabled={briefs[selectedApp.rank]?.loading}
                  className={cn(
                    "flex-1 bg-brand-cyan text-brand-depth font-bold py-5 rounded-sm text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group",
                    briefs[selectedApp.rank]?.loading && "opacity-50 cursor-not-allowed animate-pulse"
                  )}
                >
                  <div className="w-1 h-1 bg-brand-depth rounded-full group-hover:scale-150 transition-transform" />
                  {briefs[selectedApp.rank]?.loading ? 'SYNTHESIZING_COMPUTE...' : briefs[selectedApp.rank]?.text ? 'REGENERATE_ANALYSIS' : 'GENERATE_BRIEF'}
                </button>
                <button onClick={() => setSelectedApp(null)} className="px-8 border border-white/10 text-slate-400 font-bold py-5 rounded-sm text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                  CLOSE_NODE
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="pt-24 pb-8 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-widest border-t border-slate-900">
        <div>Proprietary Asset Scoring System v2.0</div>
        <div className="flex gap-8">
          <span className="hover:text-slate-400 cursor-pointer">Methodology</span>
          <span className="hover:text-slate-400 cursor-pointer">Conflict Report</span>
          <span className="hover:text-slate-400 cursor-pointer">Archive 2025</span>
          <button
            type="button"
            onClick={() => { window.location.hash = '#/admin'; }}
            aria-label="Open admin dashboard"
            className="hover:text-slate-400 transition-colors"
          >
            Admin
          </button>
        </div>
      </footer>

      {/* Comparison Action Bar */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            role="toolbar"
            aria-label="Compare selected ventures"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[40] bg-brand-surface/80 backdrop-blur-xl border border-white/10 rounded-sm p-6 shadow-[0_0_32px_rgba(0,0,0,0.5)] flex items-center gap-10 min-w-[400px]"
          >
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {compareApps.map((app) => (
                  <div key={app.rank} className="w-10 h-10 rounded-sm bg-brand-depth border border-white/20 flex items-center justify-center text-xs font-mono font-bold text-brand-cyan shadow-lg">
                    {app.rank.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
              <div className="space-y-0.5">
                <span className="block text-xs font-display font-bold text-white tracking-widest uppercase">{compareIds.length} ASSETS_MAPPED</span>
                <span className="block text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em]">DELTA_READY_FOR_COMPUTE</span>
              </div>
            </div>
            
            <div className="h-10 w-px bg-white/5" />

            <div className="flex gap-6 items-center">
              <button
                onClick={() => setCompareIds([])}
                aria-label="Clear comparison selection"
                className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-colors"
              >
                CLEAR_STACK
              </button>
              <button
                onClick={() => setIsComparing(true)}
                aria-label={`Compare ${compareIds.length} selected ventures`}
                className="bg-brand-amber text-brand-depth font-bold py-3 px-8 rounded-sm text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_12px_rgba(245,166,35,0.3)]"
              >
                EXECUTE_COMPARE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Matrix Modal */}
      <AnimatePresence>
        {isComparing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-depth/95 backdrop-blur-md z-[100] p-4 md:p-12 overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="flex justify-between items-start border-b border-white/5 pb-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-brand-cyan">
                    <div className="w-2 h-2 bg-brand-cyan" />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.4em]">RELATIVE_VENTURE_MATRIX.0x4</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">COMPARISON <span className="text-slate-800 uppercase">STREAM</span></h2>
                </div>
                <button 
                  onClick={() => setIsComparing(false)}
                  className="bg-brand-surface border border-white/10 text-slate-500 p-4 rounded-sm hover:text-white hover:border-brand-cyan transition-all"
                >
                  <Maximize2 size={32} className="rotate-45" />
                </button>
              </div>

              <div className={cn(
                "grid gap-6 md:gap-8",
                compareApps.length === 1 ? "grid-cols-1" :
                compareApps.length === 2 ? "grid-cols-2" :
                compareApps.length === 3 ? "grid-cols-3" : "grid-cols-4"
              )}>
                {compareApps.map((app) => (
                  <motion.div 
                    key={app.rank}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-brand-surface border border-white/5 rounded-sm p-10 space-y-12 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-cyan/20" />
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-7xl font-display font-bold text-white/5 leading-none">#{app.rank.toString().padStart(2, '0')}</span>
                        <TierBadge tier={app.tier} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <CategoryIcon category={app.category} size={24} className="text-brand-cyan" />
                          <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tighter leading-tight">{app.name.split('-').join(' ')}</h3>
                        </div>
                        <p className="text-[10px] text-brand-cyan font-mono font-bold uppercase mt-2 tracking-[0.2em] opacity-60 italic whitespace-nowrap overflow-hidden text-ellipsis">{app.description}</p>
                      </div>
                    </div>

                    <div className="space-y-10">
                       <MetricIndicator value={app.m} label="ROI_EFFICIENCY" />
                       <MetricIndicator value={app.g} label="SOCIETAL_LIFT" colorClass="bg-brand-mint" />
                    </div>

                    <div className="space-y-4 pt-10 border-t border-white/5">
                       <div className="flex items-center gap-2 text-slate-600">
                        <Info size={14} />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">RATIONALE_CORE</span>
                       </div>
                       <p className="text-xs text-slate-400 leading-relaxed font-mono italic line-clamp-6 opacity-80">
                        “{app.why}”
                       </p>
                    </div>

                    <div className="space-y-4 pt-8">
                      {briefs[app.rank]?.text ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-brand-depth border border-brand-cyan/20 p-6 rounded-sm space-y-4 shadow-inner"
                        >
                          <div className="flex items-center gap-3 text-brand-cyan">
                            <div className="w-1 h-1 bg-brand-cyan rounded-full animate-pulse" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em]">AI_SYNTHESIS_STREAM</span>
                          </div>
                          <div className="text-[11px] text-slate-300 leading-relaxed font-mono space-y-3">
                            {briefs[app.rank].text.split('\n').filter(line => line.trim()).map((line, idx) => (
                              <div key={idx} className="flex gap-2 opacity-90">
                                <span className="text-brand-cyan font-bold transition-all group-hover:scale-125">»</span>
                                <span>{line.replace(/^[•\-\d\.]+\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ) : null}

                      <button 
                        onClick={() => handleGenerateBrief(app)}
                        disabled={briefs[app.rank]?.loading}
                        className={cn(
                          "w-full bg-brand-depth hover:bg-brand-surface text-white font-bold py-4 rounded-sm text-[10px] border border-white/10 uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group/ai",
                          briefs[app.rank]?.loading && "opacity-50 cursor-not-allowed animate-pulse"
                        )}
                      >
                        {briefs[app.rank]?.loading ? (
                          <>SYNTHESIZING_COMPUTE...</>
                        ) : (
                          <>
                            <div className="w-1 h-1 bg-brand-cyan rounded-full transition-transform group-hover/ai:scale-150" />
                            {briefs[app.rank]?.text ? "REGENERATE_ANALYSIS" : "INITIALIZE_AI_BRIEF"}
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center pt-16">
                <button 
                  onClick={() => setIsComparing(false)}
                  className="text-slate-600 hover:text-brand-amber font-mono text-[10px] uppercase tracking-[0.5em] transition-all pb-1 border-b border-transparent hover:border-brand-amber"
                >
                  RETURN_TO_COMMAND_DASHBOARD
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
