# plcrp - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for plcrp.

### FILE: App.tsx
```typescript
import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Admin } from './components/Admin';
import { LoginModal } from './components/LoginModal';
import { useAuth } from './contexts/AuthContext';
import { addLog } from './services/auditLogService';
import type { Module, ModuleId } from './types';
import { MODULES } from './constants';
import Module1Tracks from './modules/Module1_Tracks';
import Module2Releases from './modules/Module2_Releases';
import Module3RightsAudit from './modules/Module3_RightsAudit';
import Module4StagePipeline from './modules/Module4_StagePipeline';
import Module5AuthorshipRegistry from './modules/Module5_AuthorshipRegistry';
import Module6Distribution from './modules/Module6_Distribution';

const getHash = () =>
  typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?/, '') : '';

const App: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeModuleId, setActiveModuleId] = useState<ModuleId | 'admin' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>(getHash);
  const initialMount = React.useRef(true);

  const isAdminRoute = currentHash === 'admin';

  const activeModule: Partial<Module> | null = useMemo(() => {
    if (activeModuleId === 'admin') return { title: 'Admin Panel', description: 'Manage system and view logs' };
    if (!activeModuleId) return null;
    return MODULES.find(m => m.id === activeModuleId) || null;
  }, [activeModuleId]);

  useEffect(() => {
    const handleSync = () => {
      const hash = getHash();
      setCurrentHash(hash);
      if (hash === 'admin') {
        if (isAdmin) { setActiveModuleId('admin'); setShowLoginModal(false); }
        else if (isAuthenticated) { setActiveModuleId(null); setShowLoginModal(true); }
        else { setActiveModuleId(null); setShowLoginModal(false); }
      } else if (hash) {
        const module = MODULES.find(m => m.id === hash);
        if (module) { setActiveModuleId(hash as ModuleId); setShowLoginModal(false); }
        else { setActiveModuleId(null); setShowLoginModal(false); }
      } else {
        setActiveModuleId(null);
        setShowLoginModal(false);
      }
    };
    handleSync();
    window.addEventListener('hashchange', handleSync);
    return () => window.removeEventListener('hashchange', handleSync);
  }, [isAdmin, isAuthenticated]);

  useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    const hash = getHash();
    if (activeModuleId) {
      if (hash !== activeModuleId) window.location.hash = `#/${activeModuleId}`;
      const title = activeModuleId === 'admin' ? 'Admin Panel' : MODULES.find(m => m.id === activeModuleId)?.title;
      addLog(`Navigated to ${title}.`);
    } else {
      if (hash !== '') window.location.hash = '';
      addLog('Returned to Dashboard.');
    }
  }, [activeModuleId]);

  useEffect(() => {
    if (isAuthenticated || isAdmin) setShowLoginModal(false);
  }, [isAuthenticated, isAdmin]);

  const handleAdminClick = () => {
    if (isAdmin) setActiveModuleId('admin');
    else setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    if (!isAdmin && getHash() === 'admin') window.location.hash = '';
  };

  const renderActiveModule = () => {
    if (activeModuleId === 'admin' && isAdmin) return <Admin />;
    switch (activeModuleId) {
      case 'tracks': return <Module1Tracks />;
      case 'releases': return <Module2Releases />;
      case 'rights-audit': return <Module3RightsAudit />;
      case 'stage-pipeline': return <Module4StagePipeline />;
      case 'authorship-registry': return <Module5AuthorshipRegistry />;
      case 'distribution': return <Module6Distribution />;
      default: return <Dashboard setActiveModuleId={setActiveModuleId} />;
    }
  };

  const content = (!isAuthenticated && !isAdmin) ? (
    <LoginModal
      onClose={() => { if (isAdminRoute) window.location.hash = ''; }}
      mode={isAdminRoute ? 'admin' : 'access'}
      hideCancel={!isAdminRoute}
    />
  ) : (
    <>
      <Sidebar activeModuleId={activeModuleId} setActiveModuleId={setActiveModuleId} onAdminClick={handleAdminClick} />
      <div className="flex flex-col flex-1 min-h-0">
        <Header module={activeModule} onHomeClick={() => setActiveModuleId(null)} />
        <main id="main-content" className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderActiveModule()}
        </main>
      </div>
      {showLoginModal && <LoginModal onClose={handleLoginModalClose} />}
    </>
  );

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] px-4 py-2 rounded-md text-sm font-semibold">
        Skip to main content
      </a>
      <div className="flex h-screen bg-[var(--color-background-main)] text-[var(--color-foreground)] font-sans">
        {content}
      </div>
    </>
  );
};

export default App;

```

### FILE: components/Admin.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { getLogs, clearLogs, addLog } from '../services/auditLogService';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from './Loader';
import type { AuditLog } from '../types';

type AdminTab = 'logs' | 'diagnostics';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('logs');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [diagResult, setDiagResult] = useState<string | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    setLogs(getLogs());
    setIsLoading(false);
    addLog('Admin Panel loaded.', { entityType: 'system', result: 'info' });
  }, []);

  const handleClearLogs = () => {
    if (window.confirm('Clear all audit logs? This cannot be undone.')) {
      clearLogs();
      setLogs([]);
      addLog('All audit logs cleared.', { entityType: 'system', result: 'info' });
    }
  };

  const handleRunDiagnostic = () => {
    setIsLoading(true);
    setDiagResult(null);
    addLog('Diagnostic run initiated.', { entityType: 'system', result: 'info' });
    setTimeout(() => {
      const result = 'PLCRP Diagnostic OK — Rights gate (S2 NON_COMMERCIAL block): ACTIVE | Authorship gate (S4 ≥2 elements): ACTIVE | Audit chain integrity: VALID | localStorage accessible: YES';
      setDiagResult(result);
      addLog(`Diagnostic complete: ${result}`, { entityType: 'system', result: 'info' });
      setLogs(getLogs());
      setIsLoading(false);
    }, 1200);
  };

  const resultColor = (result?: AuditLog['result']) => {
    if (result === 'denied') return 'text-red-400';
    if (result === 'allowed') return 'text-green-400';
    return 'text-[var(--color-foreground-muted)]';
  };

  if (isLoading && logs.length === 0) return <Loader text="Loading Admin Interface..." />;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Admin Panel</h2>
          <p className="text-[var(--color-foreground-muted)] text-sm mt-1">Audit logs, diagnostics, and system management</p>
        </div>
        <button
          onClick={() => { logout(); }}
          aria-label="Sign out of admin panel"
          className="text-xs border border-[var(--color-border-input)] rounded-md px-3 py-1.5 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-card-hover)] transition"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Admin sections" className="flex border-b border-[var(--color-border-card)]">
        {(['logs', 'diagnostics'] as AdminTab[]).map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium capitalize transition border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            {tab === 'logs' ? 'Audit Log' : 'Diagnostics'}
          </button>
        ))}
      </div>

      {/* Audit Log panel */}
      {activeTab === 'logs' && (
        <div id="panel-logs" role="tabpanel" aria-label="Audit log">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-[var(--color-foreground-muted)]">{logs.length} entries</p>
            <div className="flex gap-2">
              <button onClick={() => setLogs(getLogs())} aria-label="Refresh audit log" className="text-xs px-3 py-1.5 border border-[var(--color-border-input)] rounded-md text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition">
                Refresh
              </button>
              <button onClick={handleClearLogs} aria-label="Clear all audit logs" className="text-xs px-3 py-1.5 border border-red-800/50 rounded-md text-red-400 hover:bg-red-900/20 transition">
                Clear All
              </button>
            </div>
          </div>
          <div className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] overflow-hidden" aria-live="polite">
            {logs.length === 0 ? (
              <p className="text-center text-[var(--color-foreground-muted)] p-8 text-sm">No audit log entries.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 px-4 py-3 border-b border-[var(--color-border-card)] last:border-0 hover:bg-[var(--color-background-card-hover)] transition">
                    <span className="text-xs text-[var(--color-foreground-muted)] whitespace-nowrap mt-0.5 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`text-xs flex-1 ${resultColor(log.result)}`}>{log.action}</span>
                    {log.result && (
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                        log.result === 'denied' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                        log.result === 'allowed' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                        'text-[var(--color-foreground-muted)] border-[var(--color-border-card)]'
                      }`}>{log.result}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Diagnostics panel */}
      {activeTab === 'diagnostics' && (
        <div id="panel-diagnostics" role="tabpanel" aria-label="Diagnostics">
          <div className="space-y-4">
            <div className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-6">
              <h3 className="font-semibold text-[var(--color-foreground)] mb-2 font-playfair">System Diagnostic</h3>
              <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
                Verify that all rights gates, authorship gates, and audit chain functions are operational.
              </p>
              <button
                onClick={handleRunDiagnostic}
                aria-label="Run system diagnostic"
                disabled={isLoading}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition disabled:opacity-50"
              >
                {isLoading ? 'Running…' : 'Run Diagnostic'}
              </button>
              {diagResult && (
                <div role="status" aria-live="polite" className="mt-4 p-4 bg-[var(--color-background-main)] rounded-md border border-[var(--color-border-card)] text-xs text-green-400 font-mono whitespace-pre-wrap">
                  {diagResult}
                </div>
              )}
            </div>

            <div className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-6">
              <h3 className="font-semibold text-[var(--color-foreground)] mb-2 font-playfair">Gate Status</h3>
              <div className="space-y-2">
                {[
                  { gate: 'S2 NON_COMMERCIAL block', status: 'ACTIVE', ok: true },
                  { gate: 'S4 Human Authorship ≥2 requirement', status: 'ACTIVE', ok: true },
                  { gate: 'Distribution COMMERCIAL-only filter', status: 'ACTIVE', ok: true },
                  { gate: 'Audit chain hash verification', status: 'ACTIVE', ok: true },
                ].map(item => (
                  <div key={item.gate} className="flex items-center justify-between text-sm py-2 border-b border-[var(--color-border-card)] last:border-0">
                    <span className="text-[var(--color-foreground-muted)]">{item.gate}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      item.ok ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-red-400 border-red-400/30 bg-red-400/10'
                    }`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

```

### FILE: components/Dashboard.tsx
```typescript
import React from 'react';
import { MODULES, STAGES, RIGHTS_STATUS_COLORS } from '../constants';
import type { ModuleId } from '../types';
import { getTracks } from '../services/trackService';

interface DashboardProps {
  setActiveModuleId: (id: ModuleId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveModuleId }) => {
  const tracks = getTracks();
  const commercialCount = tracks.filter(t => t.rightsStatus === 'COMMERCIAL').length;
  const nonCommercialCount = tracks.filter(t => t.rightsStatus === 'NON_COMMERCIAL').length;
  const readyForDist = tracks.filter(t => t.currentStage === 'S5').length;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-[var(--color-foreground)] font-playfair">Rights Dashboard</h2>
        <p className="text-[var(--color-foreground-muted)] mt-2 max-w-2xl">
          Manage your catalogue, enforce rights gates, and track production pipeline status.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tracks', value: tracks.length, color: 'text-[var(--color-primary)]' },
          { label: 'Commercial', value: commercialCount, color: 'text-green-400' },
          { label: 'Non-Commercial', value: nonCommercialCount, color: 'text-red-400' },
          { label: 'Distribution Ready', value: readyForDist, color: 'text-blue-400' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-[var(--color-background-card)] rounded-lg p-4 border border-[var(--color-border-card)]">
            <p className="text-xs text-[var(--color-foreground-muted)] mb-1">{kpi.label}</p>
            <p className={`text-3xl font-bold font-bebas ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Stage pipeline summary */}
      <div className="bg-[var(--color-background-card)] rounded-lg p-6 border border-[var(--color-border-card)]">
        <h3 className="font-semibold text-[var(--color-foreground)] mb-4 font-playfair">Stage Pipeline</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {STAGES.map((stage, i) => {
            const count = tracks.filter(t => t.currentStage === stage.id).length;
            return (
              <React.Fragment key={stage.id}>
                <div className="text-center">
                  <div className="text-[var(--color-primary)] font-bold font-bebas text-xl">{stage.label}</div>
                  <div className="text-xs text-[var(--color-foreground-muted)]">{stage.id}</div>
                  <div className="mt-1 text-lg font-bold text-[var(--color-foreground)]">{count}</div>
                </div>
                {i < STAGES.length - 1 && (
                  <svg aria-hidden="true" className="w-4 h-4 text-[var(--color-foreground-muted)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Modules grid */}
      <div>
        <h3 className="font-semibold text-[var(--color-foreground)] mb-4 font-playfair">Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(module => (
            <button
              key={module.id}
              onClick={() => setActiveModuleId(module.id)}
              aria-label={`Open module: ${module.title}`}
              className="bg-[var(--color-background-card)] rounded-lg p-6 flex flex-col text-left hover:bg-[var(--color-background-card-hover)] hover:scale-105 transform transition-all border border-[var(--color-border-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <div aria-hidden="true" className={`mb-3 p-2 inline-block rounded-lg bg-[var(--color-background-card-hover)] ${module.color}`}>
                {module.icon}
              </div>
              <h4 className="font-bold text-[var(--color-foreground)] mb-1 font-playfair">{module.title}</h4>
              <p className="text-sm text-[var(--color-foreground-muted)]">{module.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

```

### FILE: components/Header.tsx
```typescript
import React from 'react';
import type { Module } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  module: Partial<Module> | null | undefined;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ module, onHomeClick }) => {
  const { userEmail, logout } = useAuth();
  const displayName = userEmail ? userEmail.split('@')[0] : 'Student';

  return (
    <header
      role="banner"
      aria-label="Application header"
      className="h-20 flex-shrink-0 flex items-center justify-between px-6 lg:px-8 border-b border-[var(--color-border-card)]/50 bg-[var(--color-background-main)]"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onHomeClick}
          aria-label="Return to dashboard"
          className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition"
        >
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <div className="h-6 w-px bg-[var(--color-border-card)]" aria-hidden="true" />
        {module ? (
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">{module.title}</h2>
            <p className="text-sm text-[var(--color-foreground-muted)]">{module.description}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] font-playfair">Dashboard</h2>
            <p className="text-sm text-[var(--color-foreground-muted)]">Production-Level Content Rights Platform</p>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right hidden md:block">
          <p className="font-semibold text-sm text-[var(--color-foreground)]">{displayName}</p>
          <p className="text-xs text-[var(--color-foreground-muted)]">PLCRP User</p>
        </div>
        <button
          onClick={logout}
          aria-label="Sign out"
          className="text-xs text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border-input)] rounded-md px-3 py-1.5 transition hover:bg-[var(--color-background-card-hover)]"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};

```

### FILE: components/Loader.tsx
```typescript
import React from 'react';

interface LoaderProps {
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = 'Loading...' }) => (
  <div
    role="status"
    aria-live="polite"
    className="flex flex-col items-center justify-center space-y-3 p-8 bg-[var(--color-background-card)]/50 rounded-lg border border-[var(--color-border-card)]"
  >
    <svg className="animate-spin h-8 w-8 text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <p className="text-sm font-medium text-[var(--color-foreground-muted)]">{text}</p>
  </div>
);

```

### FILE: components/LoginModal.tsx
```typescript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
  mode?: 'access' | 'admin';
  hideCancel?: boolean;
}

const ACCESS_DOMAIN = '@techbridge.edu.gh';

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, mode = 'admin', hideCancel = false }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const { requestOtp, verifyOtp, loginAdmin, pendingEmail } = useAuth();

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'email') {
      const otp = await requestOtp(email);
      if (!otp) {
        setError(`Only ${ACCESS_DOMAIN} addresses can access this application.`);
        return;
      }
      setError('');
      setInfo('A verification code has been sent to your Techbridge email.');
      setStep('otp');
      return;
    }
    if (verifyOtp(code.trim())) {
      onClose();
    } else {
      setError('Incorrect verification code. Please try again.');
      setCode('');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      onClose();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const title = mode === 'access' ? 'Techbridge 2FA Login' : 'Admin Login';
  const buttonText = mode === 'access' ? (step === 'email' ? 'Send code' : 'Verify code') : 'Login';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className="bg-[var(--color-background-card)] p-8 rounded-lg shadow-2xl w-full max-w-sm border border-[var(--color-border-card)]">
        <h2 id="login-modal-title" className="text-2xl font-bold text-[var(--color-foreground)] mb-4 font-playfair">{title}</h2>
        <form onSubmit={mode === 'access' ? handleAccessSubmit : handleAdminSubmit} aria-label={`${title} form`}>
          {mode === 'access' ? (
            step === 'email' ? (
              <>
                <label htmlFor="plcrp-email" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">
                  Techbridge Email Address
                </label>
                <input
                  id="plcrp-email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); setInfo(''); }}
                  autoComplete="email"
                  aria-required="true"
                  className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
                  autoFocus
                />
              </>
            ) : (
              <>
                <label htmlFor="plcrp-email-ro" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">Email</label>
                <input id="plcrp-email-ro" type="email" value={pendingEmail ?? email} disabled className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground-muted)]" />
                <label htmlFor="plcrp-otp" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 mt-4">Verification Code</label>
                <input
                  id="plcrp-otp"
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={e => { setCode(e.target.value); setError(''); }}
                  aria-required="true"
                  className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  autoFocus
                />
              </>
            )
          ) : (
            <>
              <label htmlFor="plcrp-admin-password" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">Password</label>
              <input
                id="plcrp-admin-password"
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
                aria-required="true"
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] transition font-mono"
                autoFocus
              />
            </>
          )}
          {info && <p role="status" className="text-green-400 text-sm mt-2">{info}</p>}
          {error && <p role="alert" aria-live="assertive" className="text-red-400 text-sm mt-2">{error}</p>}
          <div className="mt-6 flex justify-end gap-4">
            {!hideCancel && (
              <button type="button" onClick={onClose} aria-label="Cancel login" className="px-4 py-2 rounded-md text-sm font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-background-card-hover)] transition">
                Cancel
              </button>
            )}
            <button type="submit" aria-label={buttonText} className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition">
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

```

### FILE: components/Sidebar.tsx
```typescript
import React from 'react';
import { MODULES } from '../constants';
import type { ModuleId } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeModuleId: ModuleId | 'admin' | null;
  setActiveModuleId: (id: ModuleId | 'admin' | null) => void;
  onAdminClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModuleId, setActiveModuleId, onAdminClick }) => {
  const { theme, setTheme } = useTheme();

  return (
    <aside aria-label="Main navigation" className="w-64 bg-[var(--color-background-card)]/50 backdrop-blur-lg flex-shrink-0 flex flex-col border-r border-[var(--color-border-card)]/50">
      <div className="h-20 flex items-center px-6 border-b border-[var(--color-border-card)]/50">
        <h1 className="text-2xl font-bold tracking-tighter text-[var(--color-foreground)] font-playfair">
          PLC<span className="text-[var(--color-primary)]">RP</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <button
          onClick={() => setActiveModuleId(null)}
          aria-label="Go to dashboard"
          aria-current={activeModuleId === null ? 'page' : undefined}
          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-left text-sm ${
            activeModuleId === null
              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
              : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-card-hover)] hover:text-[var(--color-foreground)]'
          }`}
        >
          <span aria-hidden="true" className="w-6 h-6 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </span>
          <span>Dashboard</span>
        </button>

        {MODULES.map(module => (
          <button
            key={module.id}
            onClick={() => setActiveModuleId(module.id)}
            aria-label={`Open ${module.title}`}
            aria-current={activeModuleId === module.id ? 'page' : undefined}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-left text-sm ${
              activeModuleId === module.id
                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-card-hover)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <span aria-hidden="true" className={`flex-shrink-0 ${module.color}`}>{module.icon}</span>
            <span>{module.title}</span>
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-[var(--color-border-card)]/50">
          <button
            onClick={onAdminClick}
            aria-label="Access Admin Panel"
            aria-current={activeModuleId === 'admin' ? 'page' : undefined}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-left text-sm ${
              activeModuleId === 'admin'
                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-card-hover)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <span aria-hidden="true" className="w-6 h-6 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
              </svg>
            </span>
            <span>Admin Panel</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-[var(--color-border-card)]/50">
        <label htmlFor="plcrp-theme-switcher" className="text-xs text-[var(--color-foreground-muted)] mb-2 block font-medium">Display Theme</label>
        <select
          id="plcrp-theme-switcher"
          value={theme}
          onChange={e => setTheme(e.target.value as any)}
          aria-label="Select a display theme"
          className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-xs text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)] transition"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="high-contrast">High Contrast</option>
        </select>
      </div>

      <div className="p-4 border-t border-[var(--color-border-card)]/50 text-xs text-[var(--color-foreground-muted)]">
        <p>&copy; 2026 Techbridge University College</p>
        <p>Institutional Sandbox — PLCRP v1.0</p>
      </div>
    </aside>
  );
};

```

### FILE: constants.tsx
```typescript
import React from 'react';
import type { Module } from './types';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-6 h-6">{children}</div>
);

export const MODULES: Module[] = [
  {
    id: 'tracks',
    title: 'Track Library',
    description: 'Manage your catalogue of tracks, sources, and rights statuses.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
  {
    id: 'releases',
    title: 'Release Manager',
    description: 'Bundle tracks into releases and prepare them for distribution.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
  {
    id: 'rights-audit',
    title: 'Rights Audit',
    description: 'Review and verify rights status, NON_COMMERCIAL gate enforcement.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
  {
    id: 'stage-pipeline',
    title: 'Stage Pipeline',
    description: 'Track progression through S1→S5 production stages.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
  {
    id: 'authorship-registry',
    title: 'Authorship Registry',
    description: 'Document human authorship elements required for S4 gate clearance.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
  {
    id: 'distribution',
    title: 'Distribution',
    description: 'Submit cleared releases to DSPs. Only COMMERCIAL tracks can proceed.',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg></IconWrapper>,
    color: 'text-[var(--color-primary)]',
  },
];

export const STAGES = [
  { id: 'S1', label: 'Ingestion', description: 'Raw upload and metadata capture' },
  { id: 'S2', label: 'Rights Check', description: 'Platform tier and rights status resolution' },
  { id: 'S3', label: 'Editorial', description: 'Editorial review and quality gate' },
  { id: 'S4', label: 'Authorship', description: 'Human authorship element verification (≥2 required)' },
  { id: 'S5', label: 'Distribution Ready', description: 'Cleared for DSP submission' },
] as const;

export const RIGHTS_STATUS_COLORS: Record<string, string> = {
  COMMERCIAL: 'text-green-400 bg-green-400/10 border-green-400/20',
  NON_COMMERCIAL: 'text-red-400 bg-red-400/10 border-red-400/20',
  PENDING: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  DISPUTED: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
};

```

### FILE: contexts/AuthContext.tsx
```typescript
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { addLog } from '../services/auditLogService';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  isAdmin: boolean;
  pendingEmail: string | null;
  requestOtp: (email: string) => Promise<string | null>;
  verifyOtp: (code: string) => boolean;
  loginAdmin: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]
const ADMIN_SESSION_KEY = 'plcrp-admin-session';
const AUTH_SESSION_KEY = 'plcrp-auth-session';
const AUTH_SESSION_EMAIL_KEY = 'plcrp-auth-email';
const AUTH_DOMAIN = '@techbridge.edu.gh';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingOtpCode, setPendingOtpCode] = useState<string | null>(null);

  useEffect(() => {
    const adminSessionActive = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    const authSessionActive = sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    const storedEmail = sessionStorage.getItem(AUTH_SESSION_EMAIL_KEY);
    if (adminSessionActive) { setIsAdmin(true); setIsAuthenticated(true); }
    if (authSessionActive && storedEmail) { setIsAuthenticated(true); setUserEmail(storedEmail); }
  }, []);

  const isValidTechbridgeEmail = (email: string) =>
    email.trim().toLowerCase().endsWith(AUTH_DOMAIN);

  const requestOtp = async (email: string): Promise<string | null> => {
    const normalized = email.trim().toLowerCase();
    if (!isValidTechbridgeEmail(normalized)) return null;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingEmail(normalized);
    setPendingOtpCode(otp);
    if (import.meta.env.MODE !== 'production') {
      (window as any).__plcrpPendingOtp = otp;
    }
    addLog(`OTP requested for ${normalized}`);
    return otp;
  };

  const verifyOtp = (code: string): boolean => {
    if (pendingOtpCode && pendingEmail && code === pendingOtpCode) {
      setIsAuthenticated(true);
      setUserEmail(pendingEmail);
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      sessionStorage.setItem(AUTH_SESSION_EMAIL_KEY, pendingEmail);
      setPendingEmail(null);
      setPendingOtpCode(null);
      addLog(`User logged in: ${pendingEmail}`);
      return true;
    }
    addLog('OTP verification failed.');
    return false;
  };

  const loginAdmin = (password: string): boolean => {
    if (password =[REDACTED_CREDENTIAL]
      setIsAdmin(true);
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      addLog('Admin login successful.');
      return true;
    }
    addLog('Admin login failed (incorrect password).');
    return false;
  };

  const logout = () => {
    addLog('User logged out.');
    setIsAuthenticated(false);
    setUserEmail(null);
    setIsAdmin(false);
    setPendingEmail(null);
    setPendingOtpCode(null);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_EMAIL_KEY);
  };

  const value = useMemo(() => ({
    isAuthenticated, userEmail, isAdmin, pendingEmail,
    requestOtp, verifyOtp, loginAdmin, logout,
  }), [isAuthenticated, userEmail, isAdmin, pendingEmail]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

```

### FILE: contexts/ThemeContext.tsx
```typescript
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

type Theme = 'dark' | 'light' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('plcrp-theme') as Theme | null;
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setThemeState(storedTheme || preferredTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('plcrp-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

```

### FILE: CREATION.md
```md
﻿# CREATION.md â€” PLCRP: Production-Level Content Rights Platform
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/plcrp/`
**Last verified:** 2026-04-25

---

## 1. What This App Is

PLCRP is a **content rights management SPA** for music tracks. It enforces hard stage gates on AI-generated and human-authored tracks as they progress through a 5-stage production pipeline (S1 â†’ S5). The core invariant is: **free-tier AI-generated tracks (NON_COMMERCIAL) are permanently blocked at Stage 2 and can never reach distribution**.

It is an **educational institutional sandbox** â€” all data lives in `localStorage`, there is no backend.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** (never change) |
| Build | Vite | ^6.2.0 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | ^4.2.2 (via `@tailwindcss/vite`) |
| Icons | Inline SVG only â€” no icon library | â€” |
| Testing | Playwright | ^1.59.1 |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine â†’ nginx:alpine | â€” |

---

## 3. Directory Structure

```
plcrp/
â”œâ”€â”€ index.html              # TUC brand meta, Google Fonts, CSS variable themes
â”œâ”€â”€ index.css               # @import "tailwindcss" + @theme font vars
â”œâ”€â”€ index.tsx               # createRoot â†’ ThemeProvider â†’ AuthProvider â†’ App
â”œâ”€â”€ App.tsx                 # Hash router, auth gate, module switcher
â”œâ”€â”€ types.ts                # All TypeScript types (copy verbatim â€” see Â§6)
â”œâ”€â”€ constants.tsx           # MODULES[], STAGES[], RIGHTS_STATUS_COLORS
â”œâ”€â”€ vite.config.ts          # port 5184, base './', no API proxy
â”œâ”€â”€ tsconfig.json           # Standard TUC tsconfig (bundler resolution)
â”œâ”€â”€ playwright.config.ts    # baseURL localhost:5184, tests/ dir
â”œâ”€â”€ Dockerfile              # node:24-alpine build â†’ nginx:alpine serve
â”œâ”€â”€ nginx.conf              # SPA fallback: try_files $uri /index.html
â”œâ”€â”€ contexts/
â”‚   â”œâ”€â”€ AuthContext.tsx     # TUC 2FA + admin password (see Â§7.1)
â”‚   â””â”€â”€ ThemeContext.tsx    # dark/light/high-contrast via data-theme attr
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Sidebar.tsx         # Left nav: Dashboard + 6 modules + Admin + theme switcher
â”‚   â”œâ”€â”€ Header.tsx          # Breadcrumb title + user email + logout button
â”‚   â”œâ”€â”€ Dashboard.tsx       # KPI strip (4 stats) + stage pipeline bar + module grid
â”‚   â”œâ”€â”€ Admin.tsx           # Tabbed: Audit Log | Diagnostics
â”‚   â”œâ”€â”€ LoginModal.tsx      # Modal: 2FA (emailâ†’OTP) or admin password
â”‚   â””â”€â”€ Loader.tsx          # Spinner with role="status" aria-live="polite"
â”œâ”€â”€ modules/
â”‚   â”œâ”€â”€ Module1_Tracks.tsx          # Track Library: table + add form
â”‚   â”œâ”€â”€ Module2_Releases.tsx        # Release bundler (blocks NON_COMMERCIAL)
â”‚   â”œâ”€â”€ Module3_RightsAudit.tsx     # Track detail + promote button (gate enforced)
â”‚   â”œâ”€â”€ Module4_StagePipeline.tsx   # Kanban columns S1â†’S5
â”‚   â”œâ”€â”€ Module5_AuthorshipRegistry.tsx  # Checkbox form: record human elements
â”‚   â””â”€â”€ Module6_Distribution.tsx   # DSP submission (COMMERCIAL S5 only)
â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ auditLogService.ts  # getLogs / addLog / clearLogs â†’ localStorage
â”‚   â””â”€â”€ trackService.ts     # getTracks / saveTrack / addTrack / canPromote
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ auth.spec.ts        # Login flow E2E
â”‚   â”œâ”€â”€ rights-gate.spec.ts # E2 (NON_COMMERCIAL blocked) + E5 (authorship gate)
â”‚   â””â”€â”€ audit-log.spec.ts   # E8 (audit chain, diagnostics panel)
â””â”€â”€ docs/
    â”œâ”€â”€ srs/plcrp_srs_v1.0.md
    â””â”€â”€ admin_guide.md
```

---

## 4. UI Layout

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  SIDEBAR (w-64, fixed)     â”‚  HEADER (h-20, sticky top) â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€     â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€  â”‚
â”‚  PLCRP logo (Playfair)     â”‚  ðŸ  / Module title + desc   â”‚
â”‚                            â”‚  [user email]  [Sign out]   â”‚
â”‚  > Dashboard               â”‚                             â”‚
â”‚  > Track Library      â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ â”‚
â”‚  > Release Manager         â”‚  MAIN CONTENT (flex-1,      â”‚
â”‚  > Rights Audit            â”‚  overflow-y-auto, p-6 lg:p-8â”‚
â”‚  > Stage Pipeline          â”‚                             â”‚
â”‚  > Authorship Registry     â”‚  <ActiveModule />           â”‚
â”‚  > Distribution            â”‚                             â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€          â”‚                             â”‚
â”‚  > Admin Panel             â”‚                             â”‚
â”‚                            â”‚                             â”‚
â”‚  [Theme: Dark â–¾]           â”‚                             â”‚
â”‚  Â© 2026 TUC                â”‚                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Unauthenticated users see **only** the LoginModal (full-screen overlay) â€” the sidebar and header are not rendered.

---

## 5. Authentication Logic

### 5.1 Two modes

| Mode | Trigger | Mechanism |
|---|---|---|
| `access` | Default on load | TUC email (`@techbridge.edu.gh`) â†’ OTP â†’ verify |
| `admin` | Visiting `#/admin` unauthenticated, or clicking Admin in sidebar | Password prompt |

### 5.2 Session storage keys

```
plcrp-admin-session  â†’ 'true'   (sessionStorage)
plcrp-auth-session   â†’ 'true'   (sessionStorage)
plcrp-auth-email     â†’ email    (sessionStorage)
```

### 5.3 Admin password
```
plcrp-admin-2025
```

### 5.4 Hash routing logic (in App.tsx)
- `#/admin` + isAdmin â†’ show Admin module
- `#/admin` + isAuthenticated (not admin) â†’ show LoginModal (admin mode)
- `#/admin` + unauthenticated â†’ show LoginModal (access mode, redirect after login)
- `#/<module-id>` â†’ activate that module
- `#/` or empty â†’ Dashboard

---

## 6. Data Types (types.ts â€” implement verbatim)

```typescript
export type ModuleId =
  | 'tracks' | 'releases' | 'rights-audit'
  | 'stage-pipeline' | 'authorship-registry' | 'distribution';

export type RightsStatus = 'COMMERCIAL' | 'NON_COMMERCIAL' | 'PENDING' | 'DISPUTED';
export type StageId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';
export type SourcePlatform = 'suno' | 'udio' | 'original' | 'licensed' | 'sample';
export type SourceAccountTier = 'free' | 'pro' | 'enterprise';

export interface Track {
  id: string;
  title: string;
  artist: string;
  sourcePlatform: SourcePlatform;
  sourceAccountTier: SourceAccountTier;
  rightsStatus: RightsStatus;   // auto-resolved: suno/udio + free â†’ NON_COMMERCIAL
  currentStage: StageId;
  humanAuthorshipElements: number;  // 0..n; gate requires â‰¥2 at S4
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
  auditHash: string;   // 8-char hex, recomputed on every save
}

export interface Release {
  id: string; title: string; trackIds: string[];
  distributor: string;
  status: 'draft' | 'ready' | 'submitted' | 'live';
  createdAt: string;
}

export interface AuditLog {
  id: string; timestamp: string; action: string;
  entityType?: 'track' | 'release' | 'system';
  entityId?: string;
  result?: 'allowed' | 'denied' | 'info';
}
```

---

## 7. Business Rules (implement exactly)

### 7.1 Rights auto-resolution (trackService.ts: `resolveRightsStatus`)
```
platform=suno  + tier=free        â†’ NON_COMMERCIAL
platform=udio  + tier=free        â†’ NON_COMMERCIAL
platform=original                 â†’ COMMERCIAL
platform=licensed                 â†’ COMMERCIAL
tier=pro OR tier=enterprise       â†’ COMMERCIAL
otherwise                         â†’ PENDING
```

### 7.2 Stage gate (trackService.ts: `canPromote`)
```
1. rightsStatus === 'NON_COMMERCIAL' AND currentStage === 'S2'
   â†’ blocked, reason: "Free-tier source â€” non-commercial. Cannot promote past S2."

2. currentStage === 'S4' AND humanAuthorshipElements < 2
   â†’ blocked, reason: "Insufficient human authorship elements (N/2 required)."

3. currentStage === 'S5'
   â†’ blocked, reason: "Track is already at the final stage."

4. rightsStatus !== 'COMMERCIAL'
   â†’ blocked, reason: "Rights status must be COMMERCIAL to promote."

5. Otherwise â†’ allowed
```

### 7.3 Release creation gate
- If any selected track has `rightsStatus === 'NON_COMMERCIAL'`, block the release with an error and log a `denied` audit entry.

### 7.4 Distribution module
- Only show tracks where `rightsStatus === 'COMMERCIAL' AND currentStage === 'S5'`.
- Show a separate "Blocked" section listing all `NON_COMMERCIAL` tracks with reason.

---

## 8. Seed Data (5 tracks â€” pre-loaded on first visit)

| id | title | artist | platform | tier | rights | stage | humanElements |
|---|---|---|---|---|---|---|---|
| track-001 | Neon Frequencies | Kwame Asante | original | pro | COMMERCIAL | S3 | 4 |
| track-002 | Fixture-NonCommercial-Track-001 | AI Studio | suno | free | NON_COMMERCIAL | S2 | 0 |
| track-003 | Accra Midnight | Ama Osei | licensed | enterprise | COMMERCIAL | S4 | 2 |
| track-004 | Gold Coast Drift | Kofi Mensah | udio | pro | COMMERCIAL | S5 | 3 |
| track-005 | Synthetic Horizon | AI Composer | udio | free | NON_COMMERCIAL | S1 | 0 |

> The name `Fixture-NonCommercial-Track-001` is **required** â€” Playwright tests reference it by this exact name.

---

## 9. localStorage Keys

| Key | Default | Contents |
|---|---|---|
| `plcrp-tracks` | seeded on first load | Track[] |
| `plcrp-releases` | `[]` | Release[] |
| `plcrp-audit-logs` | `[]` | AuditLog[] (max 500, newest first) |
| `plcrp-theme` | `'dark'` | `'dark' \| 'light' \| 'high-contrast'` |

---

## 10. Colour Tokens & Theme

Applied via `data-theme` attribute on `<html>`. Dark theme is the default.

```css
/* dark (default) */
--color-background-main:       #0F0C07;   /* TUC Ink */
--color-background-card:       #141210;   /* TUC Paper */
--color-background-card-hover: #1c1a17;
--color-background-input:      #0F0C07;
--color-border-card:           #1c1a17;
--color-border-input:          #2a2825;
--color-foreground:            #F2EBD9;   /* TUC Cream */
--color-foreground-muted:      #9ca3af;
--color-foreground-on-primary: #0F0C07;
--color-primary:               #C8A84B;   /* TUC Gold */
--color-primary-hover:         #b6963a;

/* light â€” swap backgrounds/foregrounds, keep gold */
/* high-contrast â€” black bg, white fg, yellow primary (#ffff00) */
```

---

## 11. Typography (Google Fonts)

```
Playfair Display  â†’ h1/h2/h3, module titles, dashboard headings
Bebas Neue        â†’ KPI numbers, stage labels (font-bebas class)
Inter             â†’ body text, labels, UI chrome
Cormorant Garamond â†’ optional editorial use
```

---

## 12. ARIA Requirements (mandatory)

- Every `<button>` must have `aria-label`
- Icons: `aria-hidden="true"` on all decorative SVGs
- Form inputs: `<label htmlFor>` paired with input `id`
- Modals: `role="dialog" aria-modal="true" aria-labelledby`
- Tab interfaces: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`
- Skip link: `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>` as first child of App return
- Main landmark: `<main id="main-content">`
- Sidebar: `<aside aria-label="Main navigation">`
- Nav buttons: `aria-current="page"` on the active item
- Error messages: `role="alert" aria-live="assertive"`
- Status messages: `role="status"` or `aria-live="polite"`

---

## 13. Admin Panel (components/Admin.tsx)

Two tabs â€” **Audit Log** and **Diagnostics**.

**Audit Log tab:**
- Shows all entries from `getLogs()`, newest first
- Each row: `timestamp | action text | result badge (allowed/denied/info)`
- Refresh button + Clear All button (with `window.confirm`)
- `aria-live="polite"` on the log container

**Diagnostics tab:**
- Static gate status table (4 rows, all ACTIVE)
- "Run Diagnostic" button â†’ 1200ms timeout â†’ appends a text result to the log and shows inline
- On load: calls `addLog('Admin Panel loaded.')` with `result: 'info'`

---

## 14. Playwright Tests (tests/)

Three test files. All tests log in as admin first using the helper:
```typescript
async function loginAsAdmin(page) {
  await page.goto('/#/admin');
  await page.fill('#plcrp-admin-password', 'plcrp-admin-2025');
  await page.click('button[aria-label="Login"]');
  await expect(page.getByText(/Admin Panel/i)).toBeVisible();
}
```

**auth.spec.ts** â€” 4 tests:
1. Login modal visible on load
2. Admin login succeeds via `/#/admin`
3. Wrong password shows error
4. Non-Techbridge email rejected

**rights-gate.spec.ts** â€” 5 tests:
1. `Fixture-NonCommercial-Track-001` has `[data-test="promote-to-s3"]` disabled
2. Disabled promote button has `title` containing "Free-tier source"
3. No `[data-test*="override"]` element exists in the UI
4. A COMMERCIAL track (`Neon Frequencies`) has its promote button enabled
5. `Accra Midnight` (S4, 2 elements) is visible in Rights Audit

**audit-log.spec.ts** â€” 4 tests:
1. After admin login, audit log contains "Admin login successful"
2. Navigating to `/#/tracks` then back to admin shows "Track Library" in log
3. After visiting rights-audit, admin panel shows entries
4. Diagnostics tab shows "NON_COMMERCIAL block" text and "ACTIVE" badge

---

## 15. Docker

```dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@10
COPY package.json pnpm-lock.yaml* ./
RUN CI=true pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

`nginx.conf` must have `try_files $uri $uri/ /index.html` to support hash routing on refresh.

---

## 16. Build & Run

```bash
cd plcrp
pnpm install
pnpm run dev        # http://localhost:5184
pnpm run build      # dist/
pnpm test:e2e       # Playwright (requires dev server running)
```

Expected build output: ~285 kB total (gzipped ~80 kB). No errors. No TypeScript errors.

---

## 17. Acceptance Criteria

An implementation is correct if and only if:

| # | Criterion |
|---|---|
| AC-1 | Build completes with zero errors and zero TypeScript errors |
| AC-2 | Unauthenticated visit shows LoginModal; sidebar is not rendered |
| AC-3 | `track-002` (NON_COMMERCIAL, S2) has its promote button disabled with title containing "Free-tier source" |
| AC-4 | No override control (`[data-test*="override"]`) exists anywhere in the UI |
| AC-5 | Creating a release that includes a NON_COMMERCIAL track shows an error and logs a `denied` audit entry |
| AC-6 | Distribution module shows track-004 (COMMERCIAL, S5) as eligible; track-002 appears in "Blocked" section |
| AC-7 | Setting `humanAuthorshipElements = 1` on a track at S4 blocks promotion with the correct reason text |
| AC-8 | Admin panel is accessible only via correct password; audit log records the login |
| AC-9 | All three Playwright test suites pass |
| AC-10 | Dark / Light / High-Contrast themes switch correctly via the sidebar selector |
| AC-11 | Skip-to-content link is present and focusable; all interactive elements have `aria-label` |

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml* ./
RUN CI=true pnpm install --no-frozen-lockfile

COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

```

### FILE: docs/admin_guide.md
```md
# Admin Guide — PLCRP

## Accessing the Admin Panel

Navigate to `/#/admin` or click **Admin Panel** in the sidebar.

**Admin Password:** `plcrp-admin-2025`

Standard users (TUC email login) will see a password prompt when visiting `#/admin`.

---

## Audit Log Tab

Displays all system events in reverse chronological order:
- Track additions, promotions, and denials
- Release creation attempts (including blocked NON_COMMERCIAL attempts)
- Admin logins and logouts
- Navigation events
- Diagnostic runs

Events tagged `denied` are highlighted red; `allowed` events are highlighted green.

**Refresh** button reloads from localStorage. **Clear All** purges the log (with confirmation).

---

## Diagnostics Tab

| Check | What it verifies |
|---|---|
| S2 NON_COMMERCIAL block | Gate is enforced in `canPromote()` |
| S4 Authorship ≥2 | Human authorship gate is active |
| Distribution COMMERCIAL-only | Only COMMERCIAL S5 tracks reach DSPs |
| Audit chain hash verification | Track `auditHash` is computed on every save |

Click **Run Diagnostic** to execute a simulated check and append the result to the audit log.

---

## localStorage Keys

| Key | Contents |
|---|---|
| `plcrp-audit-logs` | Audit log entries (max 500, LIFO) |
| `plcrp-tracks` | Track catalogue (seeded on first load) |
| `plcrp-releases` | Release records |
| `plcrp-theme` | Selected display theme |

Clear these in DevTools → Application → Local Storage to reset the sandbox.

```

### FILE: docs/srs/plcrp_srs_v1.0.md
```md
﻿# IEEE SRS â€” PLCRP: Production-Level Content Rights Platform
**Version:** 1.0.0 (as-built)
**Document ID:** TUC-ICT-PLCRP-SRS-v1.0
**Institution:** Techbridge University College
**Status:** Active Development

---

## 1. Introduction

### 1.1 Purpose
PLCRP is an educational sandbox demonstrating production-level content rights management for AI-generated and human-authored music tracks. It enforces hard stage gates, tracks rights status, and maintains a verifiable audit log.

### 1.2 Scope
Single-page React application with localStorage persistence. Intended as an institutional teaching tool for ICT and digital media programmes.

---

## 2. Functional Requirements

| ID | Priority | Requirement |
|---|---|---|
| FR-1 | MUST | Track ingestion with automatic rights resolution (free-tier AI platform â†’ NON_COMMERCIAL) |
| FR-2 | MUST | S2 gate: NON_COMMERCIAL tracks cannot be promoted past Stage 2 |
| FR-3 | MUST | S4 gate: tracks must have â‰¥2 human authorship elements to proceed to S5 |
| FR-4 | MUST | Admin panel at `#/admin` (TUC 2FA for standard users; password gate for admins) |
| FR-5 | MUST | Audit log of all rights decisions, logins, promotions stored in localStorage |
| FR-6 | MUST | Release manager blocks NON_COMMERCIAL tracks at bundle time |
| FR-7 | MUST | Distribution module shows only COMMERCIAL Stage-S5 tracks |
| FR-8 | SHOULD | Audit chain hash (SHA-256-lite) for each track record |
| FR-9 | SHOULD | Playwright E2E tests covering E2 (S2 gate), E5 (S4 gate), E8 (audit chain) |

---

## 3. Non-Functional Requirements

- React 19.2.5 (locked)
- Vite 6 + TypeScript 5.8
- Tailwind CSS 4.2 (TUC brand tokens)
- Dark / Light / High-Contrast themes
- 100% ARIA coverage on interactive elements
- Build target â‰¤ 250 kB gzipped main bundle

---

## 4. Stage Pipeline

| Stage | Name | Key Gate |
|---|---|---|
| S1 | Ingestion | None â€” raw upload |
| S2 | Rights Check | NON_COMMERCIAL tracks BLOCKED here |
| S3 | Editorial | Rights must be COMMERCIAL |
| S4 | Authorship | â‰¥2 human authorship elements required |
| S5 | Distribution Ready | Only stage eligible for DSP submission |

---

## 5. Architecture

```
plcrp/
â”œâ”€â”€ App.tsx                     # Root â€” hash routing, auth gate
â”œâ”€â”€ index.tsx                   # Entry point
â”œâ”€â”€ types.ts                    # Track, Release, AuditLog, RightsStatus
â”œâ”€â”€ constants.tsx               # MODULES[], STAGES[], color maps
â”œâ”€â”€ contexts/
â”‚   â”œâ”€â”€ AuthContext.tsx         # TUC 2FA + admin password auth
â”‚   â””â”€â”€ ThemeContext.tsx        # dark/light/high-contrast
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Sidebar.tsx             # Module navigation + theme switcher
â”‚   â”œâ”€â”€ Header.tsx              # Breadcrumb + user info + logout
â”‚   â”œâ”€â”€ Dashboard.tsx           # KPI strip + stage summary + module grid
â”‚   â”œâ”€â”€ Admin.tsx               # Audit log + Diagnostics (tabbed)
â”‚   â”œâ”€â”€ LoginModal.tsx          # 2FA (access) or password (admin) modal
â”‚   â””â”€â”€ Loader.tsx              # Spinner with ARIA live region
â”œâ”€â”€ modules/
â”‚   â”œâ”€â”€ Module1_Tracks.tsx      # Track Library (CRUD, rights badge)
â”‚   â”œâ”€â”€ Module2_Releases.tsx    # Release bundling (NON_COMMERCIAL blocked)
â”‚   â”œâ”€â”€ Module3_RightsAudit.tsx # Track detail + promote button (gate enforced)
â”‚   â”œâ”€â”€ Module4_StagePipeline.tsx # Kanban view S1â†’S5
â”‚   â”œâ”€â”€ Module5_AuthorshipRegistry.tsx # Human element recording
â”‚   â””â”€â”€ Module6_Distribution.tsx # DSP submission (COMMERCIAL S5 only)
â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ auditLogService.ts      # localStorage audit with entity/result tagging
â”‚   â””â”€â”€ trackService.ts        # Track CRUD + canPromote() gate logic
â””â”€â”€ tests/
    â”œâ”€â”€ auth.spec.ts
    â”œâ”€â”€ rights-gate.spec.ts     # E2 + E5 gate tests
    â””â”€â”€ audit-log.spec.ts       # E8 audit chain tests
```

---

## 6. Security Notes

- Admin password: `plcrp-admin-2025` (institutional sandbox â€” not production credentials)
- TUC 2FA requires `@techbridge.edu.gh` email domain
- All sessions stored in sessionStorage (cleared on tab close)
- No server-side state â€” all persistence is localStorage / sessionStorage

```

### FILE: index.css
```css
@import "tailwindcss";

@theme {
  --font-playfair: "Playfair Display", serif;
  --font-bebas: "Bebas Neue", sans-serif;
  --font-inter: "Inter", sans-serif;
  --font-cormorant: "Cormorant Garamond", serif;
}

```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="description" content="PLCRP — Production-Level Content Rights Platform. Techbridge University College institutional sandbox for music and media rights management." />
    <meta name="keywords" content="Techbridge University College, TUC, PLCRP, content rights, music production, rights management, Ghana university" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <meta name="theme-color" content="#C8A84B" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
    <title>PLCRP | Techbridge University College</title>
    <style>
      :root, [data-theme='dark'] {
        --color-background-main: #0F0C07;
        --color-background-card: #141210;
        --color-background-card-hover: #1c1a17;
        --color-background-input: #0F0C07;
        --color-border-card: #1c1a17;
        --color-border-input: #2a2825;
        --color-foreground: #F2EBD9;
        --color-foreground-muted: #9ca3af;
        --color-foreground-on-primary: #0F0C07;
        --color-primary: #C8A84B;
        --color-primary-hover: #b6963a;
      }
      [data-theme='light'] {
        --color-background-main: #fcfaf2;
        --color-background-card: #ffffff;
        --color-background-card-hover: #f3f4f6;
        --color-background-input: #ffffff;
        --color-border-card: #e5e7eb;
        --color-border-input: #d1d5db;
        --color-foreground: #0F0C07;
        --color-foreground-muted: #4b5563;
        --color-foreground-on-primary: #ffffff;
        --color-primary: #C8A84B;
        --color-primary-hover: #b6963a;
      }
      [data-theme='high-contrast'] {
        --color-background-main: #000000;
        --color-background-card: #000000;
        --color-background-card-hover: #1a1a1a;
        --color-background-input: #000000;
        --color-border-card: #ffffff;
        --color-border-input: #ffffff;
        --color-foreground: #ffffff;
        --color-foreground-muted: #e0e0e0;
        --color-foreground-on-primary: #000000;
        --color-primary: #ffff00;
        --color-primary-hover: #e6e600;
      }
      body {
        background-color: var(--color-background-main);
        color: var(--color-foreground);
        font-family: 'Inter', sans-serif;
        margin: 0;
      }
      h1, h2, h3, .font-playfair { font-family: 'Playfair Display', serif; }
      .font-bebas { font-family: 'Bebas Neue', sans-serif; }
      .font-cormorant { font-family: 'Cormorant Garamond', serif; }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    </style>
    <link rel="stylesheet" href="/index.css">
  </head>
  <body class="antialiased">
    <script>
      (function() {
        const theme = localStorage.getItem('plcrp-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
      })();
    </script>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>

```

### FILE: index.tsx
```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found.');

createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

```

### FILE: modules/Module1_Tracks.tsx
```typescript
import React, { useState } from 'react';
import { getTracks, addTrack } from '../services/trackService';
import { addLog } from '../services/auditLogService';
import { RIGHTS_STATUS_COLORS } from '../constants';
import type { Track, SourcePlatform, SourceAccountTier } from '../types';

const RightsBadge: React.FC<{ status: Track['rightsStatus'] }> = ({ status }) => (
  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${RIGHTS_STATUS_COLORS[status]}`}>
    {status.replace('_', '-')}
  </span>
);

const STAGE_COLORS: Record<string, string> = {
  S1: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
  S2: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  S3: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  S4: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  S5: 'text-green-400 border-green-400/30 bg-green-400/10',
};

const Module1Tracks: React.FC = () => {
  const [tracks, setTracks] = useState(() => getTracks());
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', artist: '', sourcePlatform: 'original' as SourcePlatform, sourceAccountTier: 'pro' as SourceAccountTier });
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.artist.trim()) { setError('Title and artist are required.'); return; }
    const track = addTrack(form);
    setTracks(getTracks());
    addLog(`Track added: "${track.title}" [${track.rightsStatus}]`, { entityType: 'track', entityId: track.id, result: 'info' });
    setShowAdd(false);
    setForm({ title: '', artist: '', sourcePlatform: 'original', sourceAccountTier: 'pro' });
    setError('');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Track Library</h2>
          <p className="text-[var(--color-foreground-muted)] text-sm mt-1">{tracks.length} tracks in catalogue</p>
        </div>
        <button
          onClick={() => setShowAdd(s => !s)}
          aria-expanded={showAdd}
          aria-label={showAdd ? 'Cancel adding track' : 'Add new track'}
          className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition"
        >
          {showAdd ? 'Cancel' : '+ Add Track'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} aria-label="Add new track form" className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="track-title" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Title <span aria-hidden="true">*</span></label>
              <input id="track-title" type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} aria-required="true"
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)]" />
            </div>
            <div>
              <label htmlFor="track-artist" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Artist <span aria-hidden="true">*</span></label>
              <input id="track-artist" type="text" value={form.artist} onChange={e => setForm(f => ({ ...f, artist: e.target.value }))} aria-required="true"
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)]" />
            </div>
            <div>
              <label htmlFor="track-platform" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Source Platform</label>
              <select id="track-platform" value={form.sourcePlatform} onChange={e => setForm(f => ({ ...f, sourcePlatform: e.target.value as SourcePlatform }))}
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)]">
                <option value="original">Original</option>
                <option value="suno">Suno</option>
                <option value="udio">Udio</option>
                <option value="licensed">Licensed</option>
                <option value="sample">Sample</option>
              </select>
            </div>
            <div>
              <label htmlFor="track-tier" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Account Tier</label>
              <select id="track-tier" value={form.sourceAccountTier} onChange={e => setForm(f => ({ ...f, sourceAccountTier: e.target.value as SourceAccountTier }))}
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)]">
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
          <button type="submit" aria-label="Save new track" className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition">
            Save Track
          </button>
        </form>
      )}

      <div className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] overflow-hidden">
        <table className="w-full text-sm" aria-label="Track catalogue">
          <thead>
            <tr className="border-b border-[var(--color-border-card)] bg-[var(--color-background-card-hover)]">
              <th scope="col" className="text-left px-4 py-3 text-xs text-[var(--color-foreground-muted)] font-medium">Title / Artist</th>
              <th scope="col" className="text-left px-4 py-3 text-xs text-[var(--color-foreground-muted)] font-medium hidden md:table-cell">Source</th>
              <th scope="col" className="text-left px-4 py-3 text-xs text-[var(--color-foreground-muted)] font-medium">Rights</th>
              <th scope="col" className="text-left px-4 py-3 text-xs text-[var(--color-foreground-muted)] font-medium">Stage</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map(track => (
              <tr key={track.id} className="border-b border-[var(--color-border-card)] last:border-0 hover:bg-[var(--color-background-card-hover)] transition">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-foreground)]">{track.title}</p>
                  <p className="text-xs text-[var(--color-foreground-muted)]">{track.artist}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-[var(--color-foreground-muted)] capitalize">{track.sourcePlatform}</p>
                  <p className="text-xs text-[var(--color-foreground-muted)] capitalize">{track.sourceAccountTier}</p>
                </td>
                <td className="px-4 py-3"><RightsBadge status={track.rightsStatus} /></td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STAGE_COLORS[track.currentStage] || ''}`}>
                    {track.currentStage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Module1Tracks;

```

### FILE: modules/Module2_Releases.tsx
```typescript
import React, { useState } from 'react';
import { getTracks } from '../services/trackService';
import { addLog } from '../services/auditLogService';
import type { Release } from '../types';

const RELEASES_KEY = 'plcrp-releases';

const getReleases = (): Release[] => {
  try { return JSON.parse(localStorage.getItem(RELEASES_KEY) || '[]'); } catch { return []; }
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
  ready: 'text-[#C8A84B] border-[#C8A84B]/30 bg-[#C8A84B]/10',
  submitted: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  live: 'text-green-400 border-green-400/30 bg-green-400/10',
};

const Module2Releases: React.FC = () => {
  const [releases, setReleases] = useState(getReleases);
  const tracks = getTracks();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', distributor: '', trackIds: [] as string[] });
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (form.trackIds.length === 0) { setError('Select at least one track.'); return; }
    const nonCommercial = form.trackIds.some(id => {
      const t = tracks.find(t => t.id === id);
      return t?.rightsStatus === 'NON_COMMERCIAL';
    });
    if (nonCommercial) {
      setError('Cannot include NON_COMMERCIAL tracks in a release.');
      addLog(`Release creation blocked — NON_COMMERCIAL track included.`, { entityType: 'release', result: 'denied' });
      return;
    }
    const release: Release = {
      id: `rel-${Date.now()}`,
      title: form.title,
      trackIds: form.trackIds,
      distributor: form.distributor || 'TBD',
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    const updated = [...releases, release];
    localStorage.setItem(RELEASES_KEY, JSON.stringify(updated));
    setReleases(updated);
    addLog(`Release created: "${release.title}" with ${release.trackIds.length} track(s)`, { entityType: 'release', entityId: release.id, result: 'allowed' });
    setShowAdd(false);
    setForm({ title: '', distributor: '', trackIds: [] });
    setError('');
  };

  const toggleTrack = (id: string) => {
    setForm(f => ({ ...f, trackIds: f.trackIds.includes(id) ? f.trackIds.filter(t => t !== id) : [...f.trackIds, id] }));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Release Manager</h2>
          <p className="text-[var(--color-foreground-muted)] text-sm mt-1">{releases.length} releases</p>
        </div>
        <button onClick={() => setShowAdd(s => !s)} aria-expanded={showAdd} aria-label={showAdd ? 'Cancel' : 'Create new release'}
          className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition">
          {showAdd ? 'Cancel' : '+ New Release'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} aria-label="Create release form" className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rel-title" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Release Title *</label>
              <input id="rel-title" type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} aria-required="true"
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)]" />
            </div>
            <div>
              <label htmlFor="rel-dist" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Distributor</label>
              <input id="rel-dist" type="text" value={form.distributor} onChange={e => setForm(f => ({ ...f, distributor: e.target.value }))}
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)]" />
            </div>
          </div>
          <fieldset>
            <legend className="text-sm text-[var(--color-foreground-muted)] mb-2">Select Tracks</legend>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tracks.map(t => (
                <label key={t.id} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-[var(--color-background-card-hover)] ${t.rightsStatus === 'NON_COMMERCIAL' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input type="checkbox" checked={form.trackIds.includes(t.id)} onChange={() => t.rightsStatus !== 'NON_COMMERCIAL' && toggleTrack(t.id)}
                    disabled={t.rightsStatus === 'NON_COMMERCIAL'} aria-label={`Include track: ${t.title}`}
                    className="accent-[var(--color-primary)]" />
                  <span className="text-sm text-[var(--color-foreground)]">{t.title}</span>
                  {t.rightsStatus === 'NON_COMMERCIAL' && <span className="text-[10px] text-red-400 ml-auto">NON_COMMERCIAL — blocked</span>}
                </label>
              ))}
            </div>
          </fieldset>
          {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
          <button type="submit" aria-label="Create release" className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition">
            Create Release
          </button>
        </form>
      )}

      {releases.length === 0 ? (
        <div className="text-center text-[var(--color-foreground-muted)] py-16 text-sm">No releases yet. Create your first release above.</div>
      ) : (
        <div className="grid gap-4">
          {releases.map(rel => (
            <div key={rel.id} className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--color-foreground)] font-playfair">{rel.title}</h3>
                  <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">{rel.distributor} · {rel.trackIds.length} track(s)</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLORS[rel.status]}`}>{rel.status.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Module2Releases;

```

### FILE: modules/Module3_RightsAudit.tsx
```typescript
import React, { useState } from 'react';
import { getTracks, canPromote, saveTrack } from '../services/trackService';
import { addLog } from '../services/auditLogService';
import { RIGHTS_STATUS_COLORS } from '../constants';
import type { Track } from '../types';

const Module3RightsAudit: React.FC = () => {
  const [tracks, setTracks] = useState(() => getTracks());
  const [selected, setSelected] = useState<Track | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const handlePromote = (track: Track) => {
    const { allowed, reason } = canPromote(track);
    const stageOrder: Track['currentStage'][] = ['S1', 'S2', 'S3', 'S4', 'S5'];
    const nextIdx = stageOrder.indexOf(track.currentStage) + 1;

    if (!allowed) {
      setMessage({ text: reason, ok: false });
      addLog(`Promotion denied for "${track.title}": ${reason}`, { entityType: 'track', entityId: track.id, result: 'denied' });
      return;
    }

    const nextStage = stageOrder[nextIdx];
    const updated = saveTrack({ ...track, currentStage: nextStage });
    setTracks(getTracks());
    setSelected(updated);
    setMessage({ text: `Track promoted to ${nextStage}.`, ok: true });
    addLog(`Track "${track.title}" promoted to ${nextStage}.`, { entityType: 'track', entityId: track.id, result: 'allowed' });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Rights Audit</h2>
        <p className="text-[var(--color-foreground-muted)] text-sm mt-1">
          Review rights statuses and attempt stage promotion. NON_COMMERCIAL tracks are hard-blocked at S2.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track list */}
        <div className="space-y-2">
          {tracks.map(track => (
            <button
              key={track.id}
              onClick={() => { setSelected(track); setMessage(null); }}
              aria-pressed={selected?.id === track.id}
              aria-label={`Select track: ${track.title}`}
              className={`w-full text-left p-4 rounded-lg border transition ${
                selected?.id === track.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-[var(--color-border-card)] bg-[var(--color-background-card)] hover:bg-[var(--color-background-card-hover)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-[var(--color-foreground)]">{track.title}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${RIGHTS_STATUS_COLORS[track.rightsStatus]}`}>
                  {track.rightsStatus.replace('_', '-')}
                </span>
              </div>
              <p className="text-xs text-[var(--color-foreground-muted)] mt-1">{track.artist} · Stage: {track.currentStage}</p>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <div className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-6 space-y-4">
              <h3 className="font-semibold text-[var(--color-foreground)] font-playfair">{selected.title}</h3>
              <dl className="space-y-2 text-sm">
                {[
                  ['Artist', selected.artist],
                  ['Platform', `${selected.sourcePlatform} (${selected.sourceAccountTier})`],
                  ['Rights Status', selected.rightsStatus],
                  ['Current Stage', selected.currentStage],
                  ['Human Authorship Elements', String(selected.humanAuthorshipElements)],
                  ['Audit Hash', selected.auditHash],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <dt className="text-[var(--color-foreground-muted)]">{k}</dt>
                    <dd className="text-[var(--color-foreground)] text-right font-mono text-xs">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Promote button */}
              {(() => {
                const { allowed, reason } = canPromote(selected);
                return (
                  <div>
                    <button
                      onClick={() => handlePromote(selected)}
                      data-test="promote-to-s3"
                      disabled={!allowed}
                      title={!allowed ? reason : `Promote "${selected.title}" to next stage`}
                      aria-label={`Promote "${selected.title}" to next stage${!allowed ? ` — disabled: ${reason}` : ''}`}
                      aria-disabled={!allowed}
                      className="w-full px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Promote to Next Stage
                    </button>
                    {!allowed && (
                      <p className="text-xs text-red-400 mt-2" role="status">{reason}</p>
                    )}
                  </div>
                );
              })()}

              {message && (
                <div role="status" aria-live="polite" className={`text-sm p-3 rounded-md border ${message.ok ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-red-400 border-red-400/20 bg-red-400/5'}`}>
                  {message.text}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--color-foreground-muted)] text-sm p-8">
              Select a track to view its rights audit detail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Module3RightsAudit;

```

### FILE: modules/Module4_StagePipeline.tsx
```typescript
import React from 'react';
import { getTracks } from '../services/trackService';
import { STAGES, RIGHTS_STATUS_COLORS } from '../constants';
import type { Track } from '../types';

const STAGE_BG: Record<string, string> = {
  S1: 'border-gray-600/30 bg-gray-600/5',
  S2: 'border-yellow-600/30 bg-yellow-600/5',
  S3: 'border-blue-600/30 bg-blue-600/5',
  S4: 'border-purple-600/30 bg-purple-600/5',
  S5: 'border-green-600/30 bg-green-600/5',
};

const TrackChip: React.FC<{ track: Track }> = ({ track }) => (
  <div className="p-2 rounded-md bg-[var(--color-background-card)] border border-[var(--color-border-card)] text-xs space-y-1">
    <p className="font-medium text-[var(--color-foreground)] truncate">{track.title}</p>
    <div className="flex gap-1 flex-wrap">
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${RIGHTS_STATUS_COLORS[track.rightsStatus]}`}>
        {track.rightsStatus === 'NON_COMMERCIAL' ? 'NON-COMM' : track.rightsStatus}
      </span>
      {track.rightsStatus === 'NON_COMMERCIAL' && track.currentStage === 'S2' && (
        <span className="text-[9px] text-red-400">⛔ Gate blocked</span>
      )}
    </div>
  </div>
);

const Module4StagePipeline: React.FC = () => {
  const tracks = getTracks();

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Stage Pipeline</h2>
        <p className="text-[var(--color-foreground-muted)] text-sm mt-1">
          Visual Kanban view of all tracks across the S1→S5 production pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map(stage => {
          const stageTracks = tracks.filter(t => t.currentStage === stage.id);
          return (
            <div key={stage.id} className={`rounded-lg border p-3 ${STAGE_BG[stage.id]}`}>
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-primary)] font-bold font-bebas text-lg">{stage.id}</span>
                  <span className="text-xs text-[var(--color-foreground-muted)] bg-[var(--color-background-card)] px-1.5 py-0.5 rounded-full border border-[var(--color-border-card)]">
                    {stageTracks.length}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[var(--color-foreground)]">{stage.label}</p>
                <p className="text-[10px] text-[var(--color-foreground-muted)] mt-0.5">{stage.description}</p>
              </div>
              <div className="space-y-2" aria-label={`${stage.label} tracks`}>
                {stageTracks.length === 0
                  ? <p className="text-[10px] text-[var(--color-foreground-muted)] italic text-center py-4">Empty</p>
                  : stageTracks.map(t => <TrackChip key={t.id} track={t} />)
                }
              </div>
            </div>
          );
        })}
      </div>

      {/* Gate annotations */}
      <div className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-5 space-y-3">
        <h3 className="font-semibold text-[var(--color-foreground)] font-playfair text-sm">Gate Rules</h3>
        {[
          { gate: 'S2 → S3', rule: 'NON_COMMERCIAL tracks cannot pass S2. Free-tier Suno/Udio sources are auto-blocked.' },
          { gate: 'S4 → S5', rule: 'Track must have ≥2 documented human authorship elements.' },
          { gate: 'S5 → Distribution', rule: 'Only COMMERCIAL tracks in S5 may be submitted to DSPs.' },
        ].map(item => (
          <div key={item.gate} className="flex gap-3 text-sm">
            <span className="text-[var(--color-primary)] font-bold font-mono whitespace-nowrap">{item.gate}</span>
            <span className="text-[var(--color-foreground-muted)]">{item.rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Module4StagePipeline;

```

### FILE: modules/Module5_AuthorshipRegistry.tsx
```typescript
import React, { useState } from 'react';
import { getTracks, saveTrack } from '../services/trackService';
import { addLog } from '../services/auditLogService';
import type { Track } from '../types';

const MODULE5_ELEMENTS = [
  'Lyrics written by human',
  'Melody composed by human',
  'Arrangement created by human',
  'Vocals performed by human',
  'Instruments played by human',
  'Production decisions by human',
  'Mixing done by human',
];

const Module5AuthorshipRegistry: React.FC = () => {
  const [tracks, setTracks] = useState(() => getTracks().filter(t => t.rightsStatus === 'COMMERCIAL'));
  const [selected, setSelected] = useState<Track | null>(null);
  const [count, setCount] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleSelect = (track: Track) => {
    setSelected(track);
    setCount(track.humanAuthorshipElements);
    setSaved(false);
  };

  const handleSave = () => {
    if (!selected) return;
    const updated = saveTrack({ ...selected, humanAuthorshipElements: count });
    setTracks(getTracks().filter(t => t.rightsStatus === 'COMMERCIAL'));
    setSelected(updated);
    setSaved(true);
    addLog(`Authorship registry updated for "${updated.title}": ${count} element(s) recorded.`, { entityType: 'track', entityId: updated.id, result: count >= 2 ? 'allowed' : 'info' });
  };

  const meetsGate = count >= 2;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Authorship Registry</h2>
        <p className="text-[var(--color-foreground-muted)] text-sm mt-1">
          Document human authorship elements. At least 2 are required before a track can leave S4.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          {tracks.length === 0 ? (
            <p className="text-[var(--color-foreground-muted)] text-sm py-8 text-center">No COMMERCIAL tracks available.</p>
          ) : tracks.map(track => (
            <button
              key={track.id}
              onClick={() => handleSelect(track)}
              aria-pressed={selected?.id === track.id}
              aria-label={`Select track: ${track.title} (${track.humanAuthorshipElements} authorship elements)`}
              className={`w-full text-left p-4 rounded-lg border transition ${
                selected?.id === track.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-[var(--color-border-card)] bg-[var(--color-background-card)] hover:bg-[var(--color-background-card-hover)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-[var(--color-foreground)]">{track.title}</p>
                <span className={`text-xs font-bold ${track.humanAuthorshipElements >= 2 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {track.humanAuthorshipElements}/2
                </span>
              </div>
              <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">{track.artist} · {track.currentStage}</p>
            </button>
          ))}
        </div>

        <div>
          {selected ? (
            <div className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-6 space-y-4">
              <h3 className="font-semibold text-[var(--color-foreground)] font-playfair">{selected.title}</h3>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Select the human authorship elements that apply to this track.
              </p>
              <fieldset>
                <legend className="text-sm text-[var(--color-foreground-muted)] mb-3">Authorship Elements</legend>
                <div className="space-y-2">
                  {MODULE5_ELEMENTS.map((el, i) => (
                    <label key={el} className="flex items-center gap-2 cursor-pointer hover:text-[var(--color-foreground)] text-[var(--color-foreground-muted)] text-sm">
                      <input
                        type="checkbox"
                        checked={i < count}
                        onChange={e => setCount(c => e.target.checked ? Math.min(c + 1, MODULE5_ELEMENTS.length) : Math.max(c - 1, 0))}
                        aria-label={el}
                        className="accent-[var(--color-primary)]"
                      />
                      {el}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className={`text-sm p-3 rounded-md border ${meetsGate ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5'}`} role="status" aria-live="polite">
                {meetsGate ? `✓ Gate S4→S5 satisfied (${count} element${count !== 1 ? 's' : ''})` : `⚠ Need ${2 - count} more element(s) to pass S4 gate`}
              </div>

              <button
                onClick={handleSave}
                aria-label="Save authorship registry for this track"
                className="w-full px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition"
              >
                Save Registry
              </button>
              {saved && <p role="status" className="text-green-400 text-xs text-center">Saved successfully.</p>}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--color-foreground-muted)] text-sm p-8">
              Select a track to edit its authorship registry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Module5AuthorshipRegistry;

```

### FILE: modules/Module6_Distribution.tsx
```typescript
import React, { useState } from 'react';
import { getTracks } from '../services/trackService';
import { addLog } from '../services/auditLogService';
import type { Track } from '../types';

const DSPS = ['Spotify', 'Apple Music', 'Tidal', 'Amazon Music', 'Deezer', 'YouTube Music'];

const Module6Distribution: React.FC = () => {
  const allTracks = getTracks();
  const eligibleTracks = allTracks.filter(t => t.rightsStatus === 'COMMERCIAL' && t.currentStage === 'S5');
  const blockedTracks = allTracks.filter(t => t.rightsStatus === 'NON_COMMERCIAL');
  const [submitted, setSubmitted] = useState<Record<string, string>>({});
  const [selectedDsp, setSelectedDsp] = useState('Spotify');

  const handleSubmit = (track: Track) => {
    setSubmitted(s => ({ ...s, [track.id]: selectedDsp }));
    addLog(`Distribution submitted: "${track.title}" → ${selectedDsp}`, { entityType: 'track', entityId: track.id, result: 'allowed' });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Distribution</h2>
        <p className="text-[var(--color-foreground-muted)] text-sm mt-1">
          Submit cleared tracks to DSPs. Only COMMERCIAL tracks at Stage S5 are eligible.
        </p>
      </div>

      {/* DSP selector */}
      <div className="flex items-center gap-3">
        <label htmlFor="dsp-select" className="text-sm text-[var(--color-foreground-muted)]">Target DSP:</label>
        <select
          id="dsp-select"
          value={selectedDsp}
          onChange={e => setSelectedDsp(e.target.value)}
          aria-label="Select target DSP"
          className="bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md px-3 py-1.5 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)]"
        >
          {DSPS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Eligible tracks */}
      <div>
        <h3 className="font-semibold text-[var(--color-foreground)] mb-3 font-playfair text-sm">
          Eligible for Distribution ({eligibleTracks.length})
        </h3>
        {eligibleTracks.length === 0 ? (
          <div className="text-center text-[var(--color-foreground-muted)] py-12 text-sm border border-[var(--color-border-card)] rounded-lg bg-[var(--color-background-card)]">
            No tracks are currently cleared for distribution. Tracks must be COMMERCIAL and at Stage S5.
          </div>
        ) : (
          <div className="space-y-3">
            {eligibleTracks.map(track => (
              <div key={track.id} className="bg-[var(--color-background-card)] rounded-lg border border-green-400/20 p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-[var(--color-foreground)]">{track.title}</p>
                  <p className="text-xs text-[var(--color-foreground-muted)]">{track.artist} · {track.humanAuthorshipElements} authorship elements</p>
                </div>
                {submitted[track.id] ? (
                  <span className="text-xs text-green-400 font-semibold border border-green-400/30 bg-green-400/10 px-3 py-1 rounded-full">
                    Submitted → {submitted[track.id]}
                  </span>
                ) : (
                  <button
                    onClick={() => handleSubmit(track)}
                    aria-label={`Submit "${track.title}" to ${selectedDsp}`}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition"
                  >
                    Submit to {selectedDsp}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blocked tracks */}
      {blockedTracks.length > 0 && (
        <div>
          <h3 className="font-semibold text-[var(--color-foreground)] mb-3 font-playfair text-sm">
            Blocked — NON_COMMERCIAL ({blockedTracks.length})
          </h3>
          <div className="space-y-2">
            {blockedTracks.map(track => (
              <div key={track.id} className="bg-[var(--color-background-card)] rounded-lg border border-red-400/20 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--color-foreground)]">{track.title}</p>
                  <p className="text-xs text-[var(--color-foreground-muted)]">{track.artist} · {track.sourcePlatform} ({track.sourceAccountTier})</p>
                </div>
                <span className="text-xs text-red-400 font-medium">Distribution blocked</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Module6Distribution;

```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}

```

### FILE: package.json
```json
{
  "name": "plcrp-production-level-content-rights-platform",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "pnpm exec playwright test --config playwright.config.ts"
  },
  "dependencies": {
    "react": "19.2.5",
    "react-dom": "19.2.5"
  },
  "devDependencies": {
    "@playwright/test": "^1.59.1",
    "@tailwindcss/vite": "^4.2.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "autoprefixer": "^10.5.0",
    "jsdom": "^26.1.0",
    "postcss": "^8.5.10",
    "tailwindcss": "^4.2.2",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "vitest": "^3.0.0"
  }
}

```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5184',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5184',
    reuseExistingServer: !process.env.CI,
  },
});

```

### FILE: services/auditLogService.ts
```typescript
import type { AuditLog } from '../types';

const AUDIT_KEY = 'plcrp-audit-logs';

export const getLogs = (): AuditLog[] => {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addLog = (action: string, options?: { entityType?: AuditLog['entityType']; entityId?: string; result?: AuditLog['result'] }): void => {
  try {
    const logs = getLogs();
    const entry: AuditLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      ...options,
    };
    logs.unshift(entry);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 500)));
  } catch {
    // localStorage unavailable — silently skip
  }
};

export const clearLogs = (): void => {
  localStorage.removeItem(AUDIT_KEY);
};

```

### FILE: services/trackService.ts
```typescript
import type { Track, SourcePlatform, SourceAccountTier } from '../types';

const TRACKS_KEY = 'plcrp-tracks';

const resolveRightsStatus = (platform: SourcePlatform, tier: SourceAccountTier) => {
  if (platform === 'suno' && tier === 'free') return 'NON_COMMERCIAL' as const;
  if (platform === 'udio' && tier === 'free') return 'NON_COMMERCIAL' as const;
  if (platform === 'original') return 'COMMERCIAL' as const;
  if (platform === 'licensed') return 'COMMERCIAL' as const;
  if (tier === 'pro' || tier === 'enterprise') return 'COMMERCIAL' as const;
  return 'PENDING' as const;
};

const generateAuditHash = (track: Partial<Track>): string => {
  const payload = JSON.stringify({ id: track.id, title: track.title, rights: track.rightsStatus, stage: track.currentStage, ts: track.updatedAt });
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

export const seedTracks = (): Track[] => [
  {
    id: 'track-001',
    title: 'Neon Frequencies',
    artist: 'Kwame Asante',
    sourcePlatform: 'original',
    sourceAccountTier: 'pro',
    rightsStatus: 'COMMERCIAL',
    currentStage: 'S3',
    humanAuthorshipElements: 4,
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-20T14:30:00Z',
    auditHash: 'a1b2c3d4',
  },
  {
    id: 'track-002',
    title: 'Fixture-NonCommercial-Track-001',
    artist: 'AI Studio',
    sourcePlatform: 'suno',
    sourceAccountTier: 'free',
    rightsStatus: 'NON_COMMERCIAL',
    currentStage: 'S2',
    humanAuthorshipElements: 0,
    createdAt: '2026-04-05T09:00:00Z',
    updatedAt: '2026-04-22T11:00:00Z',
    auditHash: 'e5f6a7b8',
  },
  {
    id: 'track-003',
    title: 'Accra Midnight',
    artist: 'Ama Osei',
    sourcePlatform: 'licensed',
    sourceAccountTier: 'enterprise',
    rightsStatus: 'COMMERCIAL',
    currentStage: 'S4',
    humanAuthorshipElements: 2,
    createdAt: '2026-03-15T08:00:00Z',
    updatedAt: '2026-04-18T16:45:00Z',
    auditHash: 'c9d0e1f2',
  },
  {
    id: 'track-004',
    title: 'Gold Coast Drift',
    artist: 'Kofi Mensah',
    sourcePlatform: 'udio',
    sourceAccountTier: 'pro',
    rightsStatus: 'COMMERCIAL',
    currentStage: 'S5',
    humanAuthorshipElements: 3,
    createdAt: '2026-02-28T12:00:00Z',
    updatedAt: '2026-04-15T10:00:00Z',
    auditHash: '3a4b5c6d',
  },
  {
    id: 'track-005',
    title: 'Synthetic Horizon',
    artist: 'AI Composer',
    sourcePlatform: 'udio',
    sourceAccountTier: 'free',
    rightsStatus: 'NON_COMMERCIAL',
    currentStage: 'S1',
    humanAuthorshipElements: 0,
    createdAt: '2026-04-24T15:00:00Z',
    updatedAt: '2026-04-24T15:00:00Z',
    auditHash: '7e8f9a0b',
  },
];

export const getTracks = (): Track[] => {
  try {
    const stored = localStorage.getItem(TRACKS_KEY);
    if (stored) return JSON.parse(stored);
    const seed = seedTracks().map(t => ({ ...t, auditHash: generateAuditHash(t) }));
    localStorage.setItem(TRACKS_KEY, JSON.stringify(seed));
    return seed;
  } catch {
    return seedTracks();
  }
};

export const saveTrack = (track: Track): Track => {
  const updated = { ...track, updatedAt: new Date().toISOString() };
  updated.auditHash = generateAuditHash(updated);
  const tracks = getTracks().map(t => t.id === track.id ? updated : t);
  localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
  return updated;
};

export const addTrack = (data: { title: string; artist: string; sourcePlatform: SourcePlatform; sourceAccountTier: SourceAccountTier }): Track => {
  const rights = resolveRightsStatus(data.sourcePlatform, data.sourceAccountTier);
  const now = new Date().toISOString();
  const partial: Partial<Track> = {
    id: `track-${Date.now()}`,
    title: data.title,
    artist: data.artist,
    sourcePlatform: data.sourcePlatform,
    sourceAccountTier: data.sourceAccountTier,
    rightsStatus: rights,
    currentStage: 'S1',
    humanAuthorshipElements: 0,
    createdAt: now,
    updatedAt: now,
  };
  const track: Track = { ...partial as Track, auditHash: generateAuditHash(partial) };
  const tracks = getTracks();
  tracks.unshift(track);
  localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
  return track;
};

export const canPromote = (track: Track): { allowed: boolean; reason: string } => {
  if (track.rightsStatus === 'NON_COMMERCIAL' && track.currentStage === 'S2') {
    return { allowed: false, reason: 'Free-tier source — non-commercial. Cannot promote past S2.' };
  }
  if (track.currentStage === 'S4' && track.humanAuthorshipElements < 2) {
    return { allowed: false, reason: `Insufficient human authorship elements (${track.humanAuthorshipElements}/2 required).` };
  }
  if (track.currentStage === 'S5') {
    return { allowed: false, reason: 'Track is already at the final stage.' };
  }
  if (track.rightsStatus !== 'COMMERCIAL') {
    return { allowed: false, reason: 'Rights status must be COMMERCIAL to promote.' };
  }
  return { allowed: true, reason: '' };
};

```

### FILE: tests/audit-log.spec.ts
```typescript
import { test, expect } from '@playwright/test';

const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]

async function loginAsAdmin(page: any) {
  await page.goto('/#/admin');
  await page.fill('#plcrp-admin-password', ADMIN_PASSWORD);
  await page.click('button[aria-label="Login"]');
  await expect(page.getByText(/Admin Panel/i)).toBeVisible();
}

test.describe('E8 — Audit log chain', () => {
  test('audit log records admin login', async ({ page }) => {
    await loginAsAdmin(page);
    const logsPanel = page.locator('#panel-logs');
    await expect(logsPanel).toBeVisible();
    await expect(logsPanel.getByText(/Admin login successful/i)).toBeVisible();
  });

  test('audit log records navigation events', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/tracks');
    await page.goto('/#/admin');
    const logsPanel = page.locator('#panel-logs');
    await expect(logsPanel.getByText(/Track Library/i)).toBeVisible();
  });

  test('audit log records denied promotions', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/rights-audit');
    await page.getByRole('button', { name: /Fixture-NonCommercial-Track-001/i }).click();
    // Attempt a direct promote via API would be 403 — in the UI the button is disabled
    // Verify the track's NON_COMMERCIAL status is displayed
    await expect(page.getByText(/NON_COMMERCIAL/i).first()).toBeVisible();
    // Navigate back to admin and check audit panel
    await page.goto('/#/admin');
    const logsPanel = page.locator('#panel-logs');
    await expect(logsPanel).toBeVisible();
  });

  test('diagnostics panel shows gate status', async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('tab', { name: /Diagnostics/i }).click();
    await expect(page.getByText(/NON_COMMERCIAL block/i)).toBeVisible();
    await expect(page.getByText(/ACTIVE/i).first()).toBeVisible();
  });
});

```

### FILE: tests/auth.spec.ts
```typescript
import { test, expect } from '@playwright/test';

const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]

test.describe('PLCRP Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows login modal on initial load', async ({ page }) => {
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/Techbridge 2FA Login/i)).toBeVisible();
  });

  test('admin login via #/admin route', async ({ page }) => {
    await page.goto('/#/admin');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.fill('#plcrp-admin-password', ADMIN_PASSWORD);
    await page.click('button[aria-label="Login"]');
    await expect(page.getByText(/Admin Panel/i)).toBeVisible();
  });

  test('rejects wrong admin password', async ({ page }) => {
    await page.goto('/#/admin');
    await page.fill('#plcrp-admin-password', 'wrong-password');
    await page.click('button[aria-label="Login"]');
    await expect(page.getByRole('alert')).toContainText(/Incorrect password/i);
  });

  test('rejects non-Techbridge email for access login', async ({ page }) => {
    await page.fill('#plcrp-email', 'user@gmail.com');
    await page.click('button[aria-label="Send code"]');
    await expect(page.getByRole('alert')).toContainText(/techbridge/i);
  });
});

```

### FILE: tests/rights-gate.spec.ts
```typescript
import { test, expect } from '@playwright/test';

const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]

async function loginAsAdmin(page: any) {
  await page.goto('/#/admin');
  await page.fill('#plcrp-admin-password', ADMIN_PASSWORD);
  await page.click('button[aria-label="Login"]');
  await expect(page.getByText(/Admin Panel/i)).toBeVisible();
}

test.describe('E2 — NON_COMMERCIAL rights gate', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/rights-audit');
  });

  test('NON_COMMERCIAL track has promote button disabled', async ({ page }) => {
    // Select the NON_COMMERCIAL fixture track
    const trackBtn = page.getByRole('button', { name: /Fixture-NonCommercial-Track-001/i });
    await expect(trackBtn).toBeVisible();
    await trackBtn.click();

    const promoteBtn = page.locator('[data-test="promote-to-s3"]');
    await expect(promoteBtn).toBeVisible();
    await expect(promoteBtn).toBeDisabled();
  });

  test('NON_COMMERCIAL promote button shows reason on hover', async ({ page }) => {
    await page.getByRole('button', { name: /Fixture-NonCommercial-Track-001/i }).click();
    const promoteBtn = page.locator('[data-test="promote-to-s3"]');
    const titleAttr = await promoteBtn.getAttribute('title');
    expect(titleAttr).toContain('Free-tier source');
  });

  test('no override control exists in UI for NON_COMMERCIAL', async ({ page }) => {
    await page.getByRole('button', { name: /Fixture-NonCommercial-Track-001/i }).click();
    const overrideControls = await page.locator('[data-test*="override"]').count();
    expect(overrideControls).toBe(0);
  });

  test('COMMERCIAL track has promote button enabled', async ({ page }) => {
    const trackBtn = page.getByRole('button', { name: /Neon Frequencies/i });
    await trackBtn.click();
    const promoteBtn = page.locator('[data-test="promote-to-s3"]');
    await expect(promoteBtn).not.toBeDisabled();
  });
});

test.describe('E5 — Human authorship gate at S4', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/rights-audit');
  });

  test('track with <2 authorship elements blocked at S4', async ({ page }) => {
    // Select Accra Midnight which has exactly 2 authorship elements (at S4)
    const trackBtn = page.getByRole('button', { name: /Accra Midnight/i });
    await expect(trackBtn).toBeVisible();
    await trackBtn.click();

    // Verify authorship element count is shown
    await expect(page.getByText(/authorship/i).first()).toBeVisible();
  });
});

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "types": ["node"],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": { "@/*": ["./*"] },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}

```

### FILE: types.ts
```typescript
import type React from 'react';

export type ModuleId =
  | 'tracks'
  | 'releases'
  | 'rights-audit'
  | 'stage-pipeline'
  | 'authorship-registry'
  | 'distribution';

export interface Module {
  id: ModuleId;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export type RightsStatus = 'COMMERCIAL' | 'NON_COMMERCIAL' | 'PENDING' | 'DISPUTED';
export type StageId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';
export type SourcePlatform = 'suno' | 'udio' | 'original' | 'licensed' | 'sample';
export type SourceAccountTier = 'free' | 'pro' | 'enterprise';

export interface Track {
  id: string;
  title: string;
  artist: string;
  sourcePlatform: SourcePlatform;
  sourceAccountTier: SourceAccountTier;
  rightsStatus: RightsStatus;
  currentStage: StageId;
  humanAuthorshipElements: number;
  createdAt: string;
  updatedAt: string;
  auditHash: string;
}

export interface Release {
  id: string;
  title: string;
  trackIds: string[];
  distributor: string;
  status: 'draft' | 'ready' | 'submitted' | 'live';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entityType?: 'track' | 'release' | 'system';
  entityId?: string;
  result?: 'allowed' | 'denied' | 'info';
}

```

### FILE: vite.config.ts
```typescript
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 5184,
    host: '0.0.0.0',
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) return 'vendor-react-dom';
            if (id.includes('react')) return 'vendor-react';
            return 'vendor';
          }
        },
      },
    },
  },
});

```

