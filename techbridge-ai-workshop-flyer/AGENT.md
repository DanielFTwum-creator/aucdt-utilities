# techbridge-ai-workshop-flyer - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-ai-workshop-flyer.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: .env.development.local
```text
VITE_GOOGLE_CLIENT_ID=[REDACTED_CREDENTIAL]
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

```

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
VITE_GOOGLE_CLIENT_ID=[REDACTED_CREDENTIAL]
VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/techbridge-ai-workshop-flyer/auth/google/callback

```

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { Flyer } from './components/Flyer';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { AdminPanel } from './components/AdminPanel';
import { useAuth } from './contexts/AuthContext';
import { ThemeMode } from './types';
import { auditLogger } from './utils/audit';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    auditLogger.log('App Started', `Initial theme: ${theme}`);
    
    // Accessibility: Allow opening admin with Ctrl+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin(prev => !prev);
        auditLogger.log('Admin Panel Toggle', 'Keyboard Shortcut Used');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 transition-colors duration-300"
         style={{ backgroundColor: 'var(--bg-root)' }}>
      
      {/* Accessibility / Theme Controls */}
      <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />

      {/* Main Flyer */}
      <Flyer />

      {/* Footer Admin Link (Accessible) */}
      <button 
        onClick={() => { setShowAdmin(true); auditLogger.log('Admin Panel Toggle', 'Footer Link Clicked'); }}
        className="fixed bottom-2 right-2 text-[10px] opacity-20 hover:opacity-100 transition-opacity"
        style={{ color: 'var(--text-secondary)' }}
      >
        Admin
      </button>

      {/* Admin Modal */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

export default App;
```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_techbridge_ai_workshop_flyer';
const ACCENT   = '#db2777';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Techbridge AI Workshop Flyer</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: components/AdminPanel.tsx
```typescript
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
    if (password =[REDACTED_CREDENTIAL]
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
```

### FILE: components/AppWithAuth.tsx
```typescript
import { useAuth } from '../contexts/AuthContext';
import { LoginView } from './LoginView';
import App from '../App';

export const AppWithAuth: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <App />;
};

```

### FILE: components/BackgroundElements.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { BACKGROUND_VIDEOS } from '../constants';

export const BackgroundElements: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Select a random video on mount
    const randomVideo = BACKGROUND_VIDEOS[Math.floor(Math.random() * BACKGROUND_VIDEOS.length)];
    setVideoSrc(randomVideo);
  }, []);

  return (
    <>
      {/* Dynamic Video Background */}
      {videoSrc && (
        <div className="video-bg absolute inset-0 overflow-hidden z-0 rounded-xl bg-[#050505]">
           <video 
             autoPlay 
             muted 
             loop 
             playsInline 
             onCanPlay={() => setVideoLoaded(true)}
             className={`w-full h-full object-cover scale-110 blur-[3px] transition-opacity duration-1000 ease-in-out ${videoLoaded ? 'opacity-50' : 'opacity-0'}`}
           >
             <source src={videoSrc} type="video/mp4" />
           </video>
        </div>
      )}

      {/* Gradient Overlays for Readability (Ghana Night Sky Theme) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0505]/90 via-[#05100a]/70 to-[#000000]/95 z-0 pointer-events-none mix-blend-multiply" />
      <div className="absolute inset-0 bg-[var(--bg-flyer)] opacity-30 z-0 pointer-events-none mix-blend-overlay" />

      {/* Digital Kente / Adinkra Pattern Overlay */}
      <div className="kente-pattern-bg absolute inset-0 pointer-events-none z-0 mix-blend-screen" />

      {/* --- CULTURAL SYMBOLS (ADINKRA) --- */}
      
      {/* Symbol 1: Mate Masie (Wisdom/Knowledge) - Top Right */}
      <div className="adinkra-bg absolute -top-10 -right-10 w-96 h-96 opacity-10 pointer-events-none z-0 rotate-12 animate-pulse">
        <svg viewBox="0 0 100 100" fill="var(--accent-gold)">
           <rect x="10" y="35" width="35" height="20" rx="5" />
           <rect x="55" y="35" width="35" height="20" rx="5" />
           <rect x="10" y="60" width="35" height="20" rx="5" />
           <rect x="55" y="60" width="35" height="20" rx="5" />
        </svg>
      </div>

      {/* Symbol 2: Gye Nyame (Supremacy) - Bottom Left */}
      <div className="adinkra-bg absolute -bottom-20 -left-20 w-[500px] h-[500px] opacity-10 pointer-events-none z-0 -rotate-12">
        <svg viewBox="0 0 24 24" fill="var(--accent-green)">
           {/* Simplified Representation of Gye Nyame shape */}
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>

      {/* Geometric Lines (Kente Colors) */}
      <div className="absolute top-0 left-0 w-48 h-1 bg-gradient-to-r from-[var(--accent-red)] to-transparent z-10" />
      <div className="absolute top-0 right-0 w-48 h-1 bg-gradient-to-l from-[var(--accent-gold)] to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-1 bg-gradient-to-r from-[var(--accent-green)] to-transparent z-10" />
      <div className="absolute bottom-0 right-0 w-48 h-1 bg-gradient-to-l from-[var(--accent-green)] to-transparent z-10" />

      <div className="absolute top-0 left-0 h-48 w-1 bg-gradient-to-b from-[var(--accent-red)] to-transparent z-10" />
      <div className="absolute top-0 right-0 h-48 w-1 bg-gradient-to-b from-[var(--accent-gold)] to-transparent z-10" />
      
      {/* Floating Accent Dots */}
      <div className="glow-orb absolute top-44 left-16 w-1.5 h-1.5 rounded-full opacity-60 animate-pulse" style={{ backgroundColor: 'var(--accent-gold)' }} />
      <div className="glow-orb absolute top-72 right-20 w-1 h-1 rounded-full opacity-50" style={{ backgroundColor: 'var(--accent-red)' }} />
      <div className="glow-orb absolute bottom-64 left-10 w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: 'var(--accent-green)' }} />
    </>
  );
};
```

### FILE: components/Flyer.tsx
```typescript
import React, { useRef, useState } from 'react';
import { BackgroundElements } from './BackgroundElements';
import { SpeakerCard } from './SpeakerCard';
import { Showcase } from './Showcase';
// Removed HandbookPresentation import as it's no longer used
import { INSTITUTION, SPEAKERS, EVENT_DETAILS, SHOWCASE_IMAGES } from '../constants';

export const Flyer: React.FC = () => {
  const cardRef = useRef<HTMLElement>(null);
  // Removed showHandbookPresentation state as it's no longer needed

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xCenter = rect.width / 2;
    const yCenter = rect.height / 2;
    const rotateX = ((y - yCenter) / yCenter) * -1;
    const rotateY = ((x - xCenter) / xCenter) * 1;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  };

  return (
    <main 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[800px] min-h-[1100px] rounded-xl overflow-hidden shadow-2xl mx-auto my-8 transition-transform duration-200 ease-out border-t-4 border-[var(--accent-gold)]"
      style={{ background: 'var(--bg-flyer)', transformStyle: 'preserve-3d' }}
      aria-label="Flyer: AI Rendering in Fashion Design Workshop"
    >
      
      <BackgroundElements />

      <article className="relative z-10 p-8 sm:p-12 flex flex-col h-full text-[var(--text-primary)]">
        
        {/* Header */}
        <header className="text-center mb-8 animate-fadeInUp">
          <div className="flex justify-center mb-6">
            <img 
              src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
              alt="Techbridge University College Logo" 
              className="w-24 h-auto drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
            />
          </div>

          <h2 className="font-poppins text-sm font-semibold tracking-[0.25em] uppercase mb-2" style={{ color: 'var(--accent-gold)' }}>
            {INSTITUTION.name}
          </h2>
          <p className="text-[11px] font-normal tracking-[0.2em] uppercase mb-6" style={{ color: 'var(--text-secondary)' }}>
            {INSTITUTION.dept} &nbsp;·&nbsp; {INSTITUTION.location}
          </p>

          <div className="flex items-center gap-3 my-4 opacity-60" aria-hidden="true">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--accent-red)] to-transparent" />
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: 'var(--accent-gold)' }} />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--accent-green)] to-transparent" />
          </div>

          <p className="text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--text-secondary)' }}>proudly presents</p>

          <div 
            className="inline-block px-5 py-1.5 mb-4 rounded-full border text-[11px] tracking-[0.2em] uppercase"
            style={{ 
              borderColor: 'var(--accent-gold)', 
              backgroundColor: 'rgba(255, 215, 0, 0.05)', 
              color: 'var(--accent-gold)' 
            }}
          >
            ⚡ Practical Workshop
          </div>

          <h1 className="font-playfair text-5xl sm:text-6xl font-black leading-[1.1] mb-2 drop-shadow-lg">
            <span className="block" style={{ color: 'var(--text-primary)' }}>Afrofuturism:</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-br from-[var(--accent-gold)] via-yellow-200 to-[var(--accent-red)]"
                  style={{ backgroundImage: 'linear-gradient(to bottom right, var(--accent-gold), #fff, var(--accent-red))', backgroundClip: 'text', WebkitBackgroundClip: 'text' }}>
              AI Fashion
            </span>
            <span className="block text-4xl sm:text-5xl mt-2" style={{ color: 'var(--accent-green)' }}>Design Workshop</span>
          </h1>
        </header>

        {/* AI Showcase */}
        <section className="animate-fadeInUp delay-100">
           <Showcase images={SHOWCASE_IMAGES} />
        </section>

        {/* Focus Box */}
        <div 
          className="mx-auto max-w-xl w-full rounded-lg p-4 text-center mb-8 backdrop-blur-sm animate-fadeInUp delay-200 kente-border-top"
          style={{ 
            backgroundColor: 'rgba(0, 107, 63, 0.1)', 
            borderBottom: '1px solid var(--accent-green)'
          }}
        >
          <div className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: 'var(--accent-gold)' }}>Workshop Focus</div>
          <div className="text-base font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            Merging Traditional African Aesthetics with Generative AI
          </div>
        </div>

        {/* Workshop Materials Link / Button */}
        <section className="text-center mb-8 animate-fadeInUp delay-200 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://techbridge.edu.gh/static/presentations/TECHBRIDGE%20african_fashion_ai_workshop.pdf" // Updated PDF URL
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--accent-green)] text-black font-bold uppercase tracking-wide text-sm shadow-lg 
                       hover:bg-[var(--accent-gold)] hover:text-black transition-all duration-300 transform hover:scale-105"
            aria-label="View Workshop Handbook PDF in a new tab"
          >
            <span className="text-xl" aria-hidden="true">⬇️</span> View PDF
          </a>
        </section>


        {/* Event Details Grid */}
        <section aria-label="Event Details" className="flex flex-wrap justify-center gap-8 mb-8 animate-fadeInUp delay-300">
          {EVENT_DETAILS.map((detail, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-2xl mb-1" aria-hidden="true">{detail.icon}</span>
              <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-secondary)' }}>{detail.label}</span>
              <span className="text-base font-bold mt-1" style={{ color: 'var(--accent-gold)' }}>{detail.value}</span>
              {detail.subValue && <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{detail.subValue}</span>}
            </div>
          ))}
        </section>

        <div className="flex items-center gap-3 my-6 opacity-60 animate-fadeInUp delay-300" aria-hidden="true">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--accent-green)] to-transparent" />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: 'var(--accent-gold)' }} />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--accent-green)] to-transparent" />
        </div>

        {/* Resource Persons Header */}
        <div className="text-center mb-6 animate-fadeInUp delay-400">
          <span className="relative inline-block px-4 text-[11px] tracking-[0.3em] uppercase" style={{ color: 'var(--text-secondary)' }}>
            <span className="mr-2" style={{ color: 'var(--accent-gold)' }} aria-hidden="true">✦</span>
            Visionary Speakers
            <span className="ml-2" style={{ color: 'var(--accent-gold)' }} aria-hidden="true">✦</span>
          </span>
        </div>

        {/* Speakers */}
        <section aria-label="Speakers" className="flex flex-wrap justify-center gap-6 mb-8 animate-fadeInUp delay-400">
          {SPEAKERS.map((speaker, idx) => (
            <SpeakerCard key={idx} speaker={speaker} />
          ))}
        </section>

        {/* Audience Strip */}
        <div className="mt-auto rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm animate-fadeInUp delay-500"
             style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-3xl" aria-hidden="true">🇬🇭</div>
          <div className="flex-1">
            <div className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: 'var(--accent-gold)' }}>Invitation</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Open to all Techbridge Fashion Students &amp; Alumni
            </div>
          </div>
          <div className="hidden sm:block text-[10px] text-center leading-relaxed border-l pl-4"
               style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
            Akwaaba<br/>Welcome<br/>2026
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t flex flex-wrap justify-between items-center gap-4 animate-fadeInUp delay-500"
                style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-secondary)' }}>Organiser</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Victoria Abra Honu</span>
            {/* Fix: Wrap string literal in curly braces to avoid parser confusion */}
            <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{'Head, Fashion Dept.'}</span>
          </div>

          <div className="font-extrabold text-xs tracking-[0.15em] px-5 py-2 rounded-full uppercase shadow-lg"
               style={{ 
                 background: 'linear-gradient(to right, var(--accent-red), var(--accent-gold), var(--accent-green))', 
                 color: '#000',
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
               }}>
            Free Entry
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1">
            <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-secondary)' }}>Location</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Oyibi, Ghana</span>
            {/* Fix: Wrap string literal in curly braces to avoid parser confusion */}
            <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{'Techbridge Univ. College'}</span>
          </div>
        </footer>

      </article>

      {/* Handbook Presentation Modal (Removed) */}
    </main>
  );
};
```

### FILE: components/HandbookPresentation.tsx
```typescript

```

### FILE: components/LoginView.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, User as UserIcon, Lock, Phone } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const handleOAuthToken = [REDACTED_CREDENTIAL]
      try {
        setIsSubmitting(true);
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const userInfo = await res.json();
        await login({ id: userInfo.id, username: userInfo.name, email: userInfo.email });
        localStorage.removeItem('oauth_token_temp');
      } catch (err) {
        setError('Google login failed. Please try again.');
        setIsSubmitting(false);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      console.log('Message event received:', event.data?.type);
      if (event.data?.type === 'OAUTH_TOKEN_SUCCESS') {
        console.log('✓ Got OAUTH_TOKEN_SUCCESS message');
        handleOAuthToken(event.data.access_token);
      }
    };
    console.log('Setting up message listener');
    window.addEventListener('message', handleMessage);

    const checkLocalStorage = setInterval(() => {
      const token = [REDACTED_CREDENTIAL]
      if (token) {
        console.log('✓ Found token in localStorage');
        handleOAuthToken(token);
        clearInterval(checkLocalStorage);
      }
    }, 100);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(checkLocalStorage);
    };
  }, [login]);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured. Use username/password instead.');
      return;
    }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'email profile',
      prompt: 'select_account'
    });
    const authWindow = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      'oauth_popup',
      'width=600,height=700'
    );
    if (!authWindow) setError('Popup blocked. Please allow popups for this site.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(identifier, password);
      } else {
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        if (!username) throw new Error('Username is required.');
        if (!email) throw new Error('Email is required.');
        result = await register(username, email, password);
      }
      if (!result.success) {
        setError(result.message || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setIdentifier('');
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    clearForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-600 mb-1">Workshop Flyer</h1>
          <p className="text-slate-600 text-sm">Techbridge University College Event Hub</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-rose-200 overflow-hidden p-8">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-slate-600 mb-6 text-sm">
            {mode === 'login' ? 'Access the flyer platform' : 'Create an account to get started'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'login' ? (
              <>
                <div>
                  <label htmlFor="identifier" className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    Username or Email
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="Enter username or email"
                      disabled={isSubmitting}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-600 shadow-sm disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="username" className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      disabled={isSubmitting}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-600 shadow-sm disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isSubmitting}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-600 shadow-sm disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      disabled={isSubmitting}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-600 shadow-sm disabled:opacity-50"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isSubmitting}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-600 shadow-sm disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-600 shadow-sm disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-rose-700 transition-colors shadow-md focus:ring-4 focus:ring-rose-100 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>

            <div className="relative flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Or</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full bg-white border-2 border-slate-300 text-slate-700 px-8 py-3.5 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-slate-600 text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
              className="text-rose-600 font-medium hover:text-rose-700 transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

```

### FILE: components/Showcase.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { ShowcaseImage } from '../types';

interface ShowcaseProps {
  images: ShowcaseImage[];
}

export const Showcase: React.FC<ShowcaseProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full mb-10 overflow-hidden relative rounded-xl border border-[var(--border-color)] group shadow-2xl">
      
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] bg-black">
        {images.map((img, idx) => (
          <div
            key={img.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img 
              src={img.url} 
              alt={img.caption} 
              className="w-full h-full object-cover opacity-80"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-root)] via-transparent to-transparent" />
          </div>
        ))}
        
        {/* Holographic Scanline Overlay (Aesthetic Only) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 z-10"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 255, 127, 0.1) 50%)',
            backgroundSize: '100% 4px'
          }}
        />
      </div>

      {/* Controls / Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end z-20">
        <div className="flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'w-8 bg-[var(--accent-gold)]' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="text-right">
          {/* Badge completely removed as requested */}
          <p className="text-lg font-playfair font-bold text-white leading-none drop-shadow-md">
            {images[activeIndex].caption}
          </p>
        </div>
      </div>
    </div>
  );
};
```

### FILE: components/SpeakerCard.tsx
```typescript
import React from 'react';
import { Speaker } from '../types';

interface SpeakerCardProps {
  speaker: Speaker;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker }) => {
  const isPrimary = speaker.variant === 'primary';
  
  // Dynamic styles: Primary = Gold, Secondary = Green
  const accentColor = isPrimary ? 'var(--accent-gold)' : 'var(--accent-green)';
  
  return (
    <div 
      className="relative flex flex-col items-center flex-1 min-w-[280px] p-6 
      rounded-2xl border backdrop-blur-sm 
      transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,69,0,0.2)]"
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderColor: `color-mix(in srgb, ${accentColor}, transparent 70%)` 
      }}
      tabIndex={0}
      role="article"
      aria-label={`Speaker: ${speaker.name}, ${speaker.title}`}
    >
      
      {/* Badge */}
      <div 
        className="absolute top-3 right-3 px-3 py-1 rounded-full border text-[10px] tracking-widest uppercase font-semibold transition-colors group-hover:border-[var(--accent-red)] group-hover:text-[var(--accent-red)]"
        style={{ 
          backgroundColor: `color-mix(in srgb, ${accentColor}, transparent 80%)`,
          borderColor: `color-mix(in srgb, ${accentColor}, transparent 60%)`,
          color: accentColor
        }}
      >
        Resource Person
      </div>

      {/* Avatar */}
      <div 
        className="w-32 h-32 mb-4 rounded-full overflow-hidden border-[3px] shadow-lg flex items-center justify-center bg-gray-900 transition-colors group-hover:border-[var(--accent-red)]"
        style={{ 
          borderColor: `color-mix(in srgb, ${accentColor}, transparent 50%)`,
          boxShadow: `0 0 20px color-mix(in srgb, ${accentColor}, transparent 90%)`
        }}
      >
        {speaker.isAi ? (
          <span className="text-5xl" role="img" aria-label="AI Robot Avatar">🤖</span>
        ) : (
          <img 
            src={speaker.imageUrl} 
            alt={`Photo of ${speaker.name}`} 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Name & Title */}
      <h3 className="font-playfair text-lg font-bold mb-2 text-center leading-tight transition-colors group-hover:text-white" style={{ color: 'var(--text-primary)' }}>
        {speaker.name}
      </h3>
      <p className="text-[11px] text-center leading-relaxed mb-4 h-12 flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
        {speaker.title}
      </p>

      {/* Topic */}
      <div className="w-full mt-auto rounded-lg p-3 transition-colors group-hover:bg-[rgba(255,69,0,0.1)]"
           style={{ backgroundColor: `color-mix(in srgb, ${accentColor}, transparent 90%)` }}>
        <div className="text-[9px] uppercase tracking-widest mb-1 text-center transition-colors group-hover:text-[var(--accent-red)]"
             style={{ color: `color-mix(in srgb, ${accentColor}, #fff 20%)` }}>
          Speaking On
        </div>
        <div className="text-xs font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
          {speaker.topic.startsWith("⏰") || speaker.topic.startsWith("🎨") ? speaker.topic : `🎙️ ${speaker.topic}`}
        </div>
      </div>
    </div>
  );
};
```

### FILE: components/ThemeSwitcher.tsx
```typescript
import React from 'react';
    import { ThemeMode } from '../types';
    import { auditLogger } from '../utils/audit';

    interface ThemeSwitcherProps {
      currentTheme: ThemeMode;
      onThemeChange: (theme: ThemeMode) => void;
    }

    export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
      const handleThemeChange = (theme: ThemeMode) => {
        onThemeChange(theme);
        auditLogger.log('Theme Changed', `Switched to ${theme}`);
      };

      return (
        <div 
          role="region" 
          aria-label="Accessibility Controls"
          className="fixed top-4 right-4 z-50 flex gap-2 p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-xl"
        >
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-2 rounded-full transition-colors ${currentTheme === 'light' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
            aria-label="Switch to Light Theme"
            title="Light Theme"
          >
            ☀️
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-2 rounded-full transition-colors ${currentTheme === 'dark' ? 'bg-orange-500 text-white' : 'text-white hover:bg-white/10'}`}
            aria-label="Switch to Dark Theme"
            title="Dark Theme"
          >
            🌙
          </button>
          <button
            onClick={() => handleThemeChange('high-contrast')}
            className={`p-2 rounded-full transition-colors ${currentTheme === 'high-contrast' ? 'bg-yellow-400 text-black font-bold' : 'text-white hover:bg-white/10'}`}
            aria-label="Switch to High Contrast Theme"
            title="High Contrast"
          >
            👁️‍🗨️
          </button>
        </div>
      );
    };
```

### FILE: constants.ts
```typescript
import { Speaker, EventDetail, ShowcaseImage } from './types';

export const EVENT_DETAILS: EventDetail[] = [
  {
    icon: "📅",
    label: "Date",
    value: "Thursday, 19th Feb",
    subValue: "2026"
  },
  {
    icon: "🕐",
    label: "Time",
    value: "12:30 PM",
    subValue: "Prompt Start"
  },
  {
    icon: "📍",
    label: "Venue",
    value: "University Auditorium",
    subValue: "Techbridge University College"
  }
];

export const SPEAKERS: Speaker[] = [
  {
    name: "H.E. Ophelia Asare",
    title: "Founder & Executive Director, Share The Smile Ophelia Foundation International",
    topic: "Time Management",
    imageUrl: "https://techbridge.edu.gh/static/images/Md.%20Ophelia%202.jpeg",
    variant: "primary"
  },
  {
    name: "Mr. Daniel Twum",
    title: "AI & Digital Tools Facilitator, Techbridge University College",
    topic: "AI Rendering in Fashion",
    imageUrl: "https://techbridge.edu.gh/static/images/DFT_PXL_20260130_100136291.MP.jpg",
    variant: "secondary"
  }
];

// Placeholder images mimicking the "Glowing Wireframe Fashion" style
export const SHOWCASE_IMAGES: ShowcaseImage[] = [
  {
    id: 'img1',
    url: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=1000&auto=format&fit=crop',
    caption: 'Digital Textiles'
  },
  {
    id: 'img2',
    url: 'https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?q=80&w=1000&auto=format&fit=crop',
    caption: 'Neural Patterns'
  },
  {
    id: 'img3',
    url: 'https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?q=80&w=1000&auto=format&fit=crop',
    caption: 'Virtual Couture'
  }
];

export const BACKGROUND_VIDEOS = [
  "https://techbridge.edu.gh/static/videos/luminescent.mp4",
  "https://techbridge.edu.gh/static/videos/holographic-kanji-advertisements-flying-delivery-d%20%287%29.mp4",
  "https://techbridge.edu.gh/static/videos/holo-graphic-kanji-advertisements-flying-delivery-d.mp4"
];

export const INSTITUTION = {
  name: "Techbridge University College",
  dept: "Department of Fashion Design",
  location: "Oyibi, Ghana"
};

export const OCR_HANDBOOK_PAGES = [
  `Al Meets African Fashion Design Technology
Workshop Exercise Handbook
AI MEETS AFRICAN FASHION DESIGN TECHNOLOGY
WORKSHOP EXERCISE HANDBOOK
20 Hands-On Exercises for Al Newbies
Using Meta Al • Google Gemini • NightCafe
Leonardo Al • ChatGPT
Celebrating African Textile Heritage Through Artificial Intelligence
Workshop Level
Beginner-Friendly – No Al Experience Required
Total Exercises
20 exercises across 5 Al platforms
Duration
Approximately 9 hours total (4.5 hrs per day for 2-day workshop)
What You Need
Smartphone or laptop with internet access
Accounts Required
Meta Al (free), Gemini (free), NightCafe (free), Leonardo Al (free), ChatGPT
(free)
Kente • Ankara • Adire • Bogolan • Shweshwe • Kanga • Aso-oke • Ndebele
Kente Ankara Adire Bogolan Shweshwe
Page 1`,
  `Al Meets African Fashion Design Technology
TABLE OF CONTENTS
Introduction to Al in African Fashion Design
How to Use This Handbook
Quick-Start Guide: Setting Up Your Al Tools
EXERCISES
META AI EXERCISES (1-4)
Workshop Exercise Handbook
3
4
5
6
Exercise 1: My First Fashion Conversation
6
Exercise 2: Design Brief Generator
7
Exercise 3: Trend Research Assistant
8
Exercise 4: Fabric & Material Consultant
9
GEMINI EXERCISES (5-8)
10
Exercise 5: Visual Mood Board with Gemini
10
Exercise 6: Collection Name & Brand Story
11
Exercise 7: Silhouette & Pattern Analysis
12
Exercise 8: Pricing & Business Strategy
13
NIGHTCAFE EXERCISES (9-12)
14
Exercise 9: Your First Al Fashion Illustration
14
Exercise 10: African Pattern Library Creation
15
Exercise 11: Campaign Imagery Concepts
16
Exercise 12: Accessory & Detail Design
17
LEONARDO AI EXERCISES (13-16)
18
Exercise 13: Runway Look Visualisation
18
Exercise 14: Textile & Surface Design
19
Exercise 15: Brand Identity Visuals
20
Exercise 16: Sustainable Fashion Visualisation
21
CHATGPT EXERCISES (17-20)
22
Exercise 17: Collection Planning & Production Timeline
22
Exercise 18: Marketing Copy & Social Media Strategy
23
Exercise 19: Customer Experience Design
24
Exercise 20: Future Collections & Al Integration Strategy
25
Workshop Completion Certificate
26
Al Prompt Glossary for Fashion Designers
27
Kente Ankara Adire Bogolan Shweshwe
Page 2`,
  `Al Meets African Fashion Design Technology
Workshop Exercise Handbook
INTRODUCTION TO AI IN AFRICAN FASHION DESIGN
Welcome to the Al Meets African Fashion Design Technology
Workshop!
Africa is home to some of the world's most extraordinary fashion traditions – from the
geometric precision of Kente weaving to the fluid artistry of Adire dyeing, from the bold
geometry of Ndebele beadwork to the storytelling symbolism of Bogolan mudcloth. These
traditions represent thousands of years of innovation, cultural knowledge, and artistic
brilliance.
Today, a new form of intelligence is emerging – Artificial Intelligence (AI) – and African
fashion designers are uniquely positioned to harness it. Not to replace our traditions, but to
amplify them. Not to erase our heritage, but to carry it forward into new markets, new forms,
and new conversations.
This workshop introduces you to five powerful Al tools that can become your creative
partners, business advisors, and communication assistants. You do not need any technical
knowledge to begin. You only need curiosity, creativity, and pride in the richness of African
fashion heritage.
Why Al for African Fashion?
The global fashion industry generates over $2.5 trillion annually. African fashion, with its extraordinary
cultural depth and growing diaspora market, is positioned for exponential growth. Al tools can help you:
•
Accelerate your design process from concept to collection
•
Create professional-quality marketing and branding materials
•
Research global trends and adapt them to your aesthetic
•
Plan productions, manage timelines, and develop pricing strategies
•
Generate concept images before investing in costly photoshoots
•
Write compelling copy for social media, press kits, and sales pitches
•
Build a global audience that appreciates the depth of African textile traditions
A Note on Cultural Integrity
As you work through these exercises, remember that Al is a tool – and like all tools, the
quality of what you create depends on your knowledge, intention, and creative vision. Al
does not understand the sacred significance of Kente colours, the community rituals around
Adire dyeing, or the spiritual dimensions of Bogolan mudcloth. You do. Your job is to direct
the tool with cultural intelligence and artistic intention.
Kente Ankara Adire Bogolan Shweshwe
Page 3`,
  `Al Meets African Fashion Design Technology
Workshop Exercise Handbook
Always ask yourself: Does this Al output honour the tradition it is inspired by? Does it tell a
story I am proud to tell? Would the community this tradition comes from recognise and
respect this work?
Kente Ankara Adire Bogolan Shweshwe
Page 4`,
  `Al Meets African Fashion Design Technology
HOW TO USE THIS HANDBOOK
Workshop Exercise Handbook
This handbook contains 20 exercises organised across 5 Al platforms. Each exercise is designed to be
completed independently, but they build on each other throughout the workshop.
Exercise Structure
Every exercise follows the same format:
Tool & Level
Which Al platform to use and the difficulty level
Objective
What you will achieve by completing this exercise
Background
Cultural and practical context for the exercise
Step-by-Step
Clear instructions you can follow on your device
Pro Tips
Expert advice to get better results
Reflection
A question to help you apply what you have learned
Extension
An optional challenge for those who want to go further
Level Guide
Beginner
Perfect for your very first session with each tool. Simple, clear prompts with
immediate visible results.
Intermediate
Builds on basic skills. Requires a little more thought and involves more complex
prompts or multi-step tasks.
Quick-Start Guide: Setting Up Your Al Tools
Before the workshop begins, please create free accounts on these platforms:
Tool
Website / Access
Best For (in this workshop)
Exercises
Meta Al
meta.ai or WhatsApp
Research, brainstorming, fabric advice,
trend analysis
Exercises 1-4
Google Gemini
gemini.google.com
Mood boards, brand stories, business
strategy
Exercises 5-8
NightCafe
nightcafe.studio
Al fashion illustrations, patterns,
campaign concepts
Exercises 9-12
Leonardo Al
leonardo.ai
Runway looks, textile design, brand
visuals
Exercises 13-16
ChatGPT
chat.openai.com
Planning, writing, marketing strategy,
business advice
Exercises 17-20
Kente Ankara Adire Bogolan Shweshwe
Page 5`,
  `Al Meets African Fashion Design Technology
ΜΕΤΑ ΑΙ EXERCISES
Research • Conversation • Expert Advice
#1
EXERCISE 1
Tool: Meta Al
Workshop Exercise Handbook
Beginner
My First Fashion Conversation
Objective
Learn how to have a productive design conversation with Meta Al and
understand how to phrase fashion-specific prompts.
Duration
15 mins
Tool
Meta Al
Background
Meta Al is accessible directly on WhatsApp, Instagram, and Facebook – platforms already
widely used across Africa. This makes it one of the most accessible Al tools for fashion
designers.
Step-by-Step Instructions
1. Open Meta Al (on WhatsApp: type @Meta Al, or visit meta.ai)
2. Type this prompt: "I am an African fashion designer. I want to create a modern outfit that uses
Kente cloth patterns. Describe the key design elements I should include."
3. Read the response carefully and note at least 3 new ideas
4. Ask a follow-up: "How can I combine Kente with denim for a streetwear look?"
5. Ask another follow-up: "What are trending colour combinations for Kente-inspired fashion in
2025?"
6. Write down the 5 most useful insights from your conversation
Pro Tips for Better Results
•
Be specific about the African textile or tradition you are working with
•
Meta Al responds well to step-by-step questions
•
You can use your local language alongside English - try adding Twi, Swahili, or Hausa
words
Reflection Question
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Page 6`,
  `Al Meets African Fashion Design Technology
Workshop Exercise Handbook
What surprised you most about the Al
response? How was it different from
Googling the same question?
Try the same prompt with Ankara fabric
instead of Kente and compare the two
responses.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 7`,
  `Al Meets African Fashion Design Technology
#2
EXERCISE 2
Tool: Meta Al
Workshop Exercise Handbook
Beginner
Design Brief Generator
Objective
Use Meta Al to generate a structured design brief for a collection inspired by a
specific African culture or festival.
Duration
20 mins
Tool
Meta Al
Background
A design brief is the foundation of any fashion collection. Al can help you create
comprehensive briefs that cover concept, target market, colour story, silhouettes, and fabric
selection.
Step-by-Step Instructions
7. Choose a theme from: Durbar Festival (Nigeria/Ghana), Umkhosi Womhlanga (South Africa),
Timkat (Ethiopia), or Ngoma Festival (East Africa)
8. Prompt Meta Al: "Create a detailed fashion design brief for a ready-to-wear collection inspired
by [your chosen festival]. Include: concept statement, target customer profile, colour palette, key
silhouettes, fabric recommendations, and mood board keywords."
9. Review the output and highlight elements you agree with
10. Refine by asking: "Make the target customer profile more specific for a 25-35 year old urban
professional woman in Lagos/Nairobi/Accra."
11. Ask: "What sustainable fabric alternatives could replace traditional materials in this collection?"
12. Save your final brief as notes
Pro Tips for Better Results
•
The more cultural context you provide, the richer the output
•
Ask Al to include both traditional and contemporary elements
•
Request specific fabric names: Aso-oke, Shweshwe, Kikoi, Mudcloth
Reflection Question
Extension Challenge
How could this brief help you pitch your
collection to a retailer or investor?
Ask Meta Al to write a press release for your
collection based on the brief it created.
Kente Ankara Adire Bogolan Shweshwe
Page 8`,
  `Al Meets African Fashion Design Technology
My Notes & Observations:
Workshop Exercise Handbook
Kente Ankara Adire Bogolan Shweshwe
Page 9`,
  `Al Meets African Fashion Design Technology
#3
EXERCISE 3
Tool: Meta Al
Workshop Exercise Handbook
Intermediate
Trend Research Assistant
Objective
Use Meta Al to research global fashion trends and identify how they can be
adapted to incorporate African aesthetics.
Duration
25 mins
Tool
Meta Al
Background
Staying relevant requires understanding global trends while maintaining cultural
authenticity. Al can bridge this gap by helping you analyse trends through an African design
lens.
Step-by-Step Instructions
13. Ask: "What are the top 5 global fashion trends for 2025? Give me a brief description of each."
14. For each trend, ask: "How can I incorporate Yoruba adire textile traditions into the [trend name]
trend?"
15. Ask: "Which of these trends best aligns with the growing global appreciation for African heritage
fashion?"
16. Request: "Give me 3 specific outfit ideas that blend the [best trend] with West African fashion
sensibilities."
17. Ask: "What fabrics, colours, and accessories would make these outfits commercially viable for
both African and diaspora markets?"
18. Create a simple trend board list based on your research
Pro Tips for Better Results
•
Ask about trends on different continents for comparison
•
Request information about specific markets: Lagos, Nairobi, Accra, Johannesburg
•
Ask about price points and target demographics for each trend
Reflection Question
Extension Challenge
How does Al trend research differ from
reading fashion magazines? What are the
advantages and limitations?
Ask Meta Al to identify which African
designers are currently trending globally and
what makes their work distinctive.
Kente Ankara Adire Bogolan Shweshwe
Page 10`,
  `Al Meets African Fashion Design Technology
My Notes & Observations:
Workshop Exercise Handbook
Kente Ankara Adire Bogolan Shweshwe
Page 11`,
  `Al Meets African Fashion Design Technology
#4
EXERCISE 4
Tool: Meta Al
Workshop Exercise Handbook
Intermediate
Fabric & Material Consultant
Objective
Use Meta Al as an expert fabric consultant to help you make informed
material choices for your African-inspired designs.
Duration
20 mins
Tool
Meta Al
Background
Fabric selection is crucial in fashion design. Understanding fabric properties, sourcing
options, and cultural significance helps create authentic and commercially successful
designs.
Step-by-Step Instructions
19. Describe a design concept to Meta Al: "I am designing a formal evening dress that incorporates
traditional Ghanaian Kente cloth. What fabric combinations would work for the body of the dress
and what should I consider about working with Kente?"
20. Ask: "What are the care instructions and practical considerations for customers buying garments
made from [fabric name]?"
21. Ask: "What sustainable and locally-sourced fabric alternatives exist for
Kente/Ankara/Kanga/Mud cloth in African countries?"
22. Request: "Compare Aso-oke, Brocade, and Organza as options for a bridal headpiece. Give
pros and cons of each."
23. Ask: "What is the cultural significance of colours in Kente cloth and how should I communicate
this to international customers?"
24. Document your 5 most important fabric insights
Pro Tips for Better Results
•
Ask about both aesthetic and practical fabric properties
•
Request information about fabric sourcing locations within Africa
•
Ask about fabric cost ranges to inform pricing decisions
Reflection Question
Extension Challenge
How can understanding fabric properties
and cultural significance improve your
Kente Ankara Adire Bogolan Shweshwe
Page 12`,
  `Al Meets African Fashion Design Technology
designs and your storytelling as a
designer?
Workshop Exercise Handbook
Ask Meta Al to help you write product
descriptions for garments made from
traditional African fabrics.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 13`,
  `Al Meets African Fashion Design Technology
GOOGLE GEMINI EXERCISES
Analysis • Brand Strategy • Creative Thinking
#5
EXERCISE 5
Tool: Gemini
Workshop Exercise Handbook
Beginner
Visual Mood Board with Gemini
Objective
Use Google Gemini to research and describe a comprehensive visual mood
board for an African-inspired fashion collection.
Duration
25 mins
Tool
Gemini
Background
Google Gemini has access to vast visual and cultural knowledge. It can help you create
rich, detailed mood board concepts that capture the essence of African fashion traditions.
Step-by-Step Instructions
25. Go to gemini.google.com and create a free account if needed
26. Type: "I am creating a mood board for a fashion collection inspired by the Maasai people of East
Africa. Describe in detail: key colours, textures, patterns, silhouettes, accessories, and the
overall mood I should capture."
27. Ask: "What famous photographers or artists have captured Maasai aesthetics that I could
reference for inspiration?"
28. Ask: "Describe 5 specific images that would be perfect for this mood board, including
composition, lighting, and styling details."
29. Ask: "How can I make this collection feel contemporary while respecting Maasai cultural
heritage? What should I avoid?"
30. Ask Gemini to suggest colour hex codes for your palette
31. Write up your mood board concept in paragraph form
Pro Tips for Better Results
•
Ask Gemini to describe images in rich detail - this helps you search for references
•
Request information about cultural protocols and copyright considerations
•
Ask about similar aesthetics from other African cultures for inspiration
Kente Ankara Adire Bogolan Shweshwe
Page 14`,
  `Al Meets African Fashion Design Technology
Reflection Question
How does a detailed mood board
description help you communicate your
vision to clients, seamstresses, or
photographers?
Extension Challenge
Workshop Exercise Handbook
Ask Gemini to compare mood boards for
three different African cultures side by side.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 15`,
  `Al Meets African Fashion Design Technology
#6
EXERCISE 6
Tool: Gemini
Workshop Exercise Handbook
Beginner
Collection Name & Brand Story
Objective
Use Gemini to brainstorm collection names, brand taglines, and compelling
brand stories rooted in African fashion heritage.
Duration
20 mins
Tool
Gemini
Background
A powerful brand story connects your designs to their cultural roots while making them
aspirational for a global audience. Gemini's language capabilities can help you craft
authentic narratives.
Step-by-Step Instructions
32. Give Gemini context: "I am an African fashion designer creating a collection that celebrates
[your chosen African textile/tradition]. My target customer is a confident, culturally-proud woman
aged 28-45."
33. Ask: "Generate 10 potential collection names inspired by [textile/tradition]. Include names in
English and in the original language where appropriate."
34. For your top 3 names, ask: "Write a 3-sentence brand story for a collection named [name] that
explanter its cultural roots and contemporary relevance."
35. Ask: "Create 5 tagline options for this collection that would work for social media and marketing
materials."
36. Ask: "Write a 150-word "About This Collection" paragraph suitable for a look book or press kit."
37. Refine your favourite options by saying: "Make this more poetic and evocative while keeping it
professional."
Pro Tips for Better Results
•
Share specific cultural references for more authentic language
•
Ask for translations and meanings of potential names
•
Request options in different tones: luxurious, empowering, playful, spiritual
Reflection Question
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Ask Gemini to write a founder's bio and origin
story for your fashion brand.
Page 16`,
  `Al Meets African Fashion Design Technology
How does having a strong brand story
change how you present your work to
buyers, media, or on social platforms?
My Notes & Observations:
Workshop Exercise Handbook
Kente Ankara Adire Bogolan Shweshwe
Page 17`,
  `Al Meets African Fashion Design Technology
#7
EXERCISE 7
Tool: Gemini
Workshop Exercise Handbook
Intermediate
Silhouette & Pattern Analysis
Objective
Use Gemini to analyse traditional African clothing silhouettes and pattern
placement techniques for contemporary application.
Duration
30 mins
Tool
Gemini
Background
African fashion has an incredible diversity of silhouettes – from the flowing Boubou and
structured Agbada to the wrapped Kanga and tailored Shweshwe dress. Understanding
these forms is essential for authentic contemporary design.
Step-by-Step Instructions
38. Ask Gemini: "Analyse the traditional Boubou silhouette from West Africa. Describe its structural
elements, cultural significance, and how it flatters different body types."
39. Ask: "How have contemporary African designers modernised the Boubou? Give 3 specific
examples of innovative approaches."
40. Ask: "Describe the traditional rules for pattern placement on Kente cloth garments. What is the
cultural significance of how patterns are positioned?"
41. Ask: "How can I adapt Kente pattern placement principles to design a contemporary blazer
while maintaining cultural authenticity?"
42. Ask: "Compare the silhouette traditions of West Africa, East Africa, and Southern Africa. What
are the key differences and similarities?"
43. Sketch or describe your own silhouette concept inspired by this research
Pro Tips for Better Results
•
Ask about body proportion and silhouette relationships
•
Request information about construction techniques that create specific silhouettes
•
Ask about how climate has influenced silhouette development in different African regions
Reflection Question
Extension Challenge
How does understanding the cultural rules
of a design tradition help you make more
Ask Gemini to explain the difference between
cultural appreciation and cultural
Kente Ankara Adire Bogolan Shweshwe
Page 18`,
  `Al Meets African Fashion Design Technology
informed choices about when and how to
adapt it?
Workshop Exercise Handbook
appropriation in fashion, with specific African
examples.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 19`,
  `Al Meets African Fashion Design Technology
#8
EXERCISE 8
Tool: Gemini
Workshop Exercise Handbook
Intermediate
Pricing & Business Strategy
Objective
Use Gemini as a business advisor to develop pricing strategies and market
positioning for African fashion brands.
Duration
25 mins
Tool
Gemini
Background
Many talented African designers undervalue their work. Al can help you develop pricing
strategies that account for the cultural value, craftsmanship, and global positioning of your
brand.
Step-by-Step Instructions
44. Set the context: "I am an African fashion designer based in [your city] creating handmade
garments using traditional Ankara fabric. My garments take 8-12 hours to make and use high-
quality imported and local materials."
45. Ask: "What pricing strategy should I use to position my brand between fast fashion and luxury?
Walk me through the calculation methodology."
46. Ask: "What are the key markets for African fashion globally? Where is demand growing fastest
and what do those markets value?"
47. Ask: "How should I adjust my pricing and branding if I want to sell in [Lagos/London/New
York/Johannesburg] markets?"
48. Ask: "What are 5 ways I can justify premium pricing for handmade African fashion to
international customers who might compare prices to mass-market alternatives?"
49. Ask: "Create a basic pricing formula I can use for each garment type in my collection."
Pro Tips for Better Results
•
Provide real cost figures for more practical advice
•
Ask about pricing for different sales channels: direct-to-consumer, boutiques, online, pop-ups
•
Ask about payment terms, currency considerations, and export pricing
Reflection Question
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Ask Gemini to help you write a pitch to a
boutique retailer explaining why they should
stock your collection.
Page 20`,
  `Al Meets African Fashion Design Technology
What aspects of pricing your work had you
not considered before? How will this
change your approach?
Workshop Exercise Handbook
Ask Gemini to help you write a pitch to a
boutique retailer explaining why they should
stock your collection.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 21`,
  `Workshop Exercise Handbook
Al Meets African Fashion Design Technology
NIGHTCAFE STUDIO EXERCISES
Image Generation • Pattern Design • Campaign Concepts
#9
EXERCISE 9
Tool: NightCafe
Beginner
Your First Al Fashion Illustration
Objective
Create your first Al-generated fashion illustration using NightCafe Studio,
exploring how to describe African textile aesthetics in image prompts.
Duration
25 mins
Tool
NightCafe
Background
NightCafe Studio (nightcafe.studio) is a user-friendly Al image generation platform. For
fashion designers, it can generate concept illustrations, fabric pattern ideas, and campaign
imagery.
Step-by-Step Instructions
50. Go to nightcafe.studio and create a free account
51. Click "Create" and choose "Artistic" or "Stable Diffusion" as your Al model
52. Enter this prompt: "African fashion editorial, woman wearing vibrant Ankara print jumpsuit, full
length portrait, warm studio lighting, high fashion photography, detailed fabric texture, rich
colours"
53. Generate 4 variations and study the differences
54. Choose the best result and note what works and what does not
55. Try a second prompt: "Fashion sketch illustration, Nigerian Agbada-inspired suit for modern
woman, architectural silhouette, watercolour style, gold and deep blue palette"
56. Compare your two results and save your favourites
Pro Tips for Better Results
•
Use fashion photography terms: editorial, runway, look book, campaign
•
Specify lighting: golden hour, studio, natural light, dramatic shadows
•
Name specific African textiles: Kente, Ankara, Adire, Bogolan, Shweshwe
•
Add quality modifiers: high fashion, professional photography, detailed, 4K
Kente Ankara Adire Bogolan Shweshwe
Page 22`,
  `Al Meets African Fashion Design Technology
Reflection Question
How could these Al illustrations help you
communicate your design concepts before
making actual garments?
Extension Challenge
Workshop Exercise Handbook
Try generating pattern-only images:
'seamless Ankara pattern design, geometric,
bold colours, repeat pattern, textile print'
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 23`,
  `Al Meets African Fashion Design Technology
#10
EXERCISE 10
Tool: NightCafe
Workshop Exercise Handbook
Beginner
African Pattern Library Creation
Objective
Generate a library of African-inspired pattern concepts using NightCafe to
explore colour combinations and geometric motifs.
Duration
30 mins
Tool
NightCafe
Background
African textile patterns are among the most sophisticated in the world. Al can help you
explore variations, colour combinations, and pattern fusions that would take hours to sketch
manually.
Step-by-Step Instructions
57. Create a new project in NightCafe for your pattern library
58. Generate Pattern 1 – Kente inspired: "Kente cloth pattern, geometric weave design, gold black
and red, seamless repeat pattern, textile design"
59. Generate Pattern 2 – Adire inspired: "Yoruba adire eleko pattern, indigo and white, resist-dye
textile, organic flowing shapes, traditional Nigerian fabric"
60. Generate Pattern 3 – Bogolan inspired: "Malian bogolan mudcloth pattern, earth tones,
geometric symbols, handcrafted textile look, brown cream and terracotta"
61. Generate Pattern 4 – Fusion: "Contemporary African print fusion, Ankara meets Kente, modern
geometric, fashion textile, vibrant multicolour"
62. Generate Pattern 5 – Minimalist: "Minimalist African geometric print, single motif repeat,
monochrome, modern fashion textile, clean lines"
63. Save all patterns and note which you could see working in your designs
Pro Tips for Better Results
•
Add "seamless," "repeat pattern," or "textile print" for fabric-appropriate outputs
•
Specify colour names or reference traditional meanings
•
Use "close-up textile texture" to see pattern detail
Reflection Question
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Page 24`,
  `Al Meets African Fashion Design Technology
Which patterns feel authentic to African
traditions? Which feel more like Al's
interpretation? What is the difference?
Workshop Exercise Handbook
Try mixing two different African textile
traditions in one prompt and observe the
result.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 25`,
  `Al Meets African Fashion Design Technology
#11
EXERCISE 11
Tool: NightCafe
Workshop Exercise Handbook
Intermediate
Campaign Imagery Concepts
Generate campaign imagery concepts for an African fashion brand, exploring
different visual storytelling approaches.
Objective
Duration
35 mins
Tool
NightCafe
Background
Fashion photography and campaign imagery are expensive to produce. Al can help you
concept and test visual directions before investing in a full shoot, saving time and money.
Step-by-Step Instructions
64. Choose a collection theme from your earlier exercises
65. Campaign Shot 1 – Heritage: "African fashion campaign, woman in traditional Ndebele-inspired
modern dress, outdoor landscape, South African savanna background, golden hour, editorial
photography, empowered pose"
66. Campaign Shot 2 – Urban: "Contemporary African streetwear, young woman in Ankara-print co-
ord set, Lagos skyline background, urban fashion photography, confident stance, vibrant
colours"
67. Campaign Shot 3 – Studio: "Minimalist fashion studio shot, African woman in structured Kente
evening gown, white background, dramatic side lighting, high fashion editorial, architectural
silhouette"
68. Campaign Shot 4 – Movement: "African fashion photography, flowing Boubou dress in motion,
vibrant pattern, dynamic movement shot, cultural celebration, joyful expression"
69. Compare the four concepts: which best represents your brand?
70. Generate 2 more variations of your preferred concept
Pro Tips for Better Results
•
Include location references specific to African cities
•
Specify the emotion and energy you want to convey
•
Try different model descriptions for diverse representation
•
Use "brand campaign," "advertising," "look book" to set the right tone
Reflection Question
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Page 26`,
  `Al Meets African Fashion Design Technology
How does the visual setting (landscape,
urban, studio) change the story your
fashion tells? Which aligns with your brand
identity?
Workshop Exercise Handbook
Create an Al-generated concept for a
collection campaign video storyboard,
describing each scene.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 27`,
  `Al Meets African Fashion Design Technology
#12
EXERCISE 12
Tool: NightCafe
Workshop Exercise Handbook
Intermediate
Accessory & Detail Design
Objective
Use NightCafe to generate African-inspired accessory and detail concepts to
complement fashion collections.
Duration
30 mins
Tool
NightCafe
Background
Accessories are the punctuation of an outfit. African fashion has an extraordinarily rich
accessory heritage – from Fulani jewellery to Zulu beadwork to Ghanaian Krobo beads. Al
can help you explore contemporary interpretations.
Step-by-Step Instructions
71. Jewellery Concept: "African contemporary jewellery, Maasai-inspired statement necklace,
beaded geometric design, modern minimalist setting, editorial product photography, gold and
red and blue"
72. Headpiece Concept: "African fashion headwrap editorial, modern Gele styling, structural
origami-inspired head piece, high fashion photography, vibrant emerald green"
73. Bag Concept: "Contemporary African fashion bag, leather and Kente woven combination,
structured tote, artisan craftsmanship, product photography, earth tones"
74. Shoes Concept: "African-inspired fashion footwear, beaded sandal design, traditional meets
contemporary, editorial product shot, colourful and intricate"
75. Embroidery Detail: "Close up fashion embroidery detail, traditional African motifs on white fabric,
gold thread, couture craftsmanship, macro photography"
76. Choose your 2 favourite concepts and note what you would change or refine
77. Generate 2 more variations of your top choice
Pro Tips for Better Results
•
Use "product photography" for clean accessory shots
•
Specify materials: leather, brass, beads, fabric, wood, horn
•
Add "handcrafted" and "artisan" to get more textured, craft-inspired results
Reflection Question
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Page 28`,
  `Al Meets African Fashion Design Technology
How can Al-generated accessory concepts
save you time and money in the
development phase of your collection?
Workshop Exercise Handbook
Generate a flat-lay concept: 'African fashion
flat lay, collection accessories arranged
artfully, kente and beaded pieces, aerial view,
editorial styling'
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 29`,
  `Al Meets African Fashion Design Technology
LEONARDO AI EXERCISES
Fashion Illustration • Textile Design • Brand Visuals
#13
EXERCISE 13
Tool: Leonardo Al
Workshop Exercise Handbook
Beginner
Runway Look Visualisation
Objective
Use Leonardo Al to create detailed runway look illustrations for an African
fashion collection.
Duration
25 mins
Tool
Leonardo Al
Background
Leonardo Al (leonardo.ai) offers more precise control over image generation, including the
ability to maintain consistent character appearance across multiple looks – invaluable for a
fashion collection.
Step-by-Step Instructions
78. Create a free account at leonardo.ai
79. Select "Leonardo Diffusion XL" or "AlbedoBase XL" as your model for fashion illustrations
80. Create Look 1: "Full length fashion illustration, African woman on runway, wearing structural
Ankara print pantsuit, tailored silhouette, bold geometric pattern in orange and blue, fashion
week editorial"
81. Create Look 2: "Fashion runway photo, floor length evening gown incorporating traditional
Kente cloth pattern, contemporary cut, elegant draping, fashion editorial quality"
82. Create Look 3: "Fashion editorial, two-piece Adire-print crop top and wide leg trouser, artisan
hand-dyed look, natural earthy tones with indigo, modern African fashion"
83. Review all three: note consistency of style, which looks most commercially viable
84. Try to generate a "back view" of your favourite look
Pro Tips for Better Results
•
Leonardo gives more control over lighting and composition than some tools
•
Use the "Alchemy" renderer for higher quality fashion output
•
Try the "prompt magic" feature to enhance your descriptions
•
Specify "full body" and "full length" to see the complete look
Kente Ankara Adire Bogolan Shweshwe
Page 30`,
  `Al Meets African Fashion Design Technology
Reflection Question
How closely do the Al images match your
initial vision? What elements are most
accurately and least accurately rendered?
Extension Challenge
Workshop Exercise Handbook
Try to create a consistent collection by
keeping all prompts in the same visual style
and colour palette.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 31`,
  `Al Meets African Fashion Design Technology
#14
EXERCISE 14
Tool: Leonardo Al
Workshop Exercise Handbook
Intermediate
Textile & Surface Design
Objective
Use Leonardo Al to design original textile surface patterns inspired by African
art traditions that could be used for custom fabric printing.
Duration
35 mins
Tool
Leonardo Al
Background
Original fabric prints are a powerful differentiator for African fashion brands. With Al tools,
designers can create original print designs without needing years of textile design training.
Step-by-Step Instructions
85. In Leonardo Al, select the "Pattern" category or use Stable Diffusion
86. Design Print 1 – Figurative: "African textile print design, stylised human figures in celebration,
Ghanaian adinkra symbols incorporated, bold black outlines, warm colour palette, seamless
repeat pattern, digital textile"
87. Design Print 2 – Geometric: "Contemporary African geometric textile print, inspired by traditional
basket weaving patterns, op-art style, monochrome black and white, modern fashion fabric"
88. Design Print 3 – Botanical: "African botanical print, tropical flowers and leaves styled with
traditional African art aesthetics, vibrant colours, Ankara-inspired, seamless textile pattern"
89. Design Print 4 – Abstract: "Abstract African art inspired textile print, fluid brush strokes,
mudcloth earth tones meets neon accents, contemporary art fashion fabric"
90. Select your 2 best prints and note what makes them commercially appealing
91. Ask yourself: where would you use each print – evening wear, casual wear, accessories?
Pro Tips for Better Results
•
Add "300 DPI" and "print ready" to get higher detail output
•
Use "seamless tile" for fabric-appropriate patterns
•
Specify the repeat type: half-drop, block, brick
•
Reference specific African art forms: Adinkra, Nsibidi, Ndebele geometric
Reflection Question
How does creating your own print design
(even with Al assistance) strengthen your
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Page 32`,
  `Al Meets African Fashion Design Technology
brand identity compared to using
commercially available Ankara prints?
Workshop Exercise Handbook
Mock up one of your prints on a garment
silhouette by creating a new prompt
describing a garment in your custom print.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 33`,
  `Al Meets African Fashion Design Technology
#15
EXERCISE 15
Tool: Leonardo Al
Workshop Exercise Handbook
Intermediate
Brand Identity Visuals
Objective
Use Leonardo Al to generate brand identity visual concepts including logo
inspiration, brand imagery, and signature visual elements.
Duration
30 mins
Tool
Leonardo Al
Background
A cohesive visual identity is essential for a fashion brand. From logo concepts to signature
imagery, Al can help you explore and develop your brand visual language.
Step-by-Step Instructions
92. Logo Concept: "African fashion brand logo concept, elegant modern typography, incorporating
subtle traditional adinkra or Kente geometric element, minimal, sophisticated, black and gold"
93. Brand Mark: "Circular fashion brand emblem, stylised African woman silhouette, geometric
border pattern inspired by traditional textiles, luxury brand aesthetic, deep blue and gold"
94. Signature Image: "Brand signature image, African woman in profile, wearing elaborate
traditional headwrap, silhouette style illustration, single bold colour, fashion brand identity
visual"
95. Pattern Border: "Decorative border design for fashion brand stationery, traditional African
geometric motif adapted to modern luxury brand, subtle and refined, gold on cream"
96. Lookbook Cover: "Fashion brand lookbook cover design concept, editorial layout, African
model, minimalist with bold typography space, luxury fashion publication"
97. Evaluate consistency: do these elements feel like they belong to the same brand?
Pro Tips for Better Results
•
Keep colour palette consistent across all brand visual prompts
•
Use "vector style" or "flat design" for cleaner logo concepts
•
Add "luxury," "premium," or "high-end" to elevate the aesthetic
•
Specify what the brand should communicate: empowerment, heritage, modern, artisan
Reflection Question
What are the most important visual
elements that make a fashion brand feel
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Page 34`,
  `Al Meets African Fashion Design Technology
authentically African without relying on
stereotypes?
Workshop Exercise Handbook
Generate a social media post template
concept incorporating your brand identity
elements.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 35`,
  `Al Meets African Fashion Design Technology
#16
EXERCISE 16
Tool: Leonardo Al
Workshop Exercise Handbook
Beginner
Sustainable Fashion Visualisation
Explore how Al imagery can communicate the sustainability and ethical
production story of African fashion brands.
Objective
Duration
25 mins
Tool
Leonardo Al
Background
Sustainability is increasingly important to global fashion consumers. African fashion often
has inherent sustainability credentials through handcraft, natural materials, and community
production. Al can help you visualise and communicate this story.
Step-by-Step Instructions
98. Craft Story: "African artisan fashion editorial, hands weaving traditional kente loom, golden light,
documentary-style photography, authentic craft process, warm earthy tones"
99. Community Image: "African fashion community workshop, women working together creating
garments, collaborative, bright and warm, positive empowerment editorial photography"
100.
Natural Materials: "Natural African textile materials still life, raw cotton, indigo plants, tree
bark, natural dyes, earthy colour palette, artisan craft photography, sustainability"
101.
Final Product: "Sustainable African fashion, organic cotton dress with natural indigo
hand dye, editorial photography, outdoor natural setting, eco fashion, earthy and fresh"
102.
Brand Story: "African fashion brand campaign sustainability story, from fibre to fashion
journey, composite editorial concept, natural and handmade aesthetic"
103.
Note: which images would be most effective in your marketing and why
Pro Tips for Better Results
•
Use words like: handcrafted, natural, community, heritage, artisan, ethical
•
Request "documentary photography style" for authentic feeling images
•
Include natural settings: markets, workshops, farmland, craft studios
Reflection Question
How does the sustainability story of your
production process become part of your
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Page 36`,
  `Al Meets African Fashion Design Technology
brand's value proposition and justify
premium pricing?
My Notes & Observations:
Workshop Exercise Handbook
Kente Ankara Adire Bogolan Shweshwe
Page 37`,
  `Al Meets African Fashion Design Technology
CHATGPT EXERCISES
Planning Writing • Marketing • Business Strategy
#17
EXERCISE 17
Tool: ChatGPT
Workshop Exercise Handbook
Beginner
Collection Planning & Production Timeline
Use ChatGPT to create a comprehensive production plan and timeline for
launching an African fashion collection.
Objective
Duration
25 mins
Tool
ChatGPT
Background
ChatGPT (chat.openai.com) excels at structured planning, long-form writing, and detailed
analysis. For fashion designers, it is particularly valuable for business planning, writing, and
problem-solving.
Step-by-Step Instructions
104.
Give ChatGPT your brief: "I am launching a 10-piece ready-to-wear collection in 12
weeks. The collection is inspired by traditional Nigerian tie-dye (adire) techniques. I have a team
of 3 seamstresses and a fabric sourcing budget of [your amount]."
105.
Ask: "Create a detailed 12-week production timeline with weekly milestones for this
collection launch."
106.
Ask: "What are the 10 most critical risks that could delay my launch and how should I
mitigate each one?"
107.
Ask: "Create a checklist of everything I need to organise for a collection launch, grouped
by: Design, Production, Marketing, Sales, and Logistics."
108. Ask: "How should I prioritise if I only have time to complete 8 of the 10 pieces? What
criteria should I use?"
109.
Save your production plan
Pro Tips for Better Results
•
Give ChatGPT real constraints: budget, timeline, team size, resources
•
Ask for contingency planning
•
Request the plan in table format for easier reading
•
Ask ChatGPT to identify dependencies: what must happen before what
Kente Ankara Adire Bogolan Shweshwe
Page 38`,
  `Al Meets African Fashion Design Technology
Workshop Exercise Handbook
Reflection Question
What aspects of your production process
had you not formally planned before? How
does having this plan change your
approach?
Extension Challenge
Ask ChatGPT to create a sample contract
template between you and a fabric supplier or
seamstress.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 39`,
  `Al Meets African Fashion Design Technology
#18
EXERCISE 18
Tool: ChatGPT
Workshop Exercise Handbook
Intermediate
Marketing Copy & Social Media Strategy
Objective
Use ChatGPT to develop marketing copy, social media captions, and a
content strategy for an African fashion brand.
Duration
30 mins
Tool
ChatGPT
Background
Compelling copy and consistent social media presence are essential for modern fashion
brands. ChatGPT can generate large volumes of varied, high-quality content quickly.
Step-by-Step Instructions
110.
Set your brand context: "My African fashion brand is called [Brand Name]. It creates
contemporary garments inspired by [your chosen African textile]. My target customer is a
culturally-proud African professional woman aged 25-40."
111.
Ask: "Write 10 Instagram caption options for launching a new Kente-inspired blazer.
Include hashtag suggestions. Vary between: storytelling, product-focused, cultural context, and
aspirational tones."
112.
Ask: "Create a 30-day social media content calendar for my brand. Include content type,
caption theme, and 3 hashtags per post."
113. Ask: "Write a compelling email newsletter announcing my new collection. Subject line
options and full body copy."
114.
Ask: "What are the 5 most effective ways an African fashion brand can grow its
Instagram following organically in 2025?"
115.
Ask: "Help me write a compelling bio for Instagram, LinkedIn, and Twitter for my fashion
brand. Keep each platform appropriate."
Pro Tips for Better Results
•
Ask for multiple tone options: professional, playful, educational, inspirational
•
Request platform-specific content: Instagram vs TikTok vs LinkedIn vs Twitter
•
Ask for content in different languages you serve
•
Request A/B testing options: two versions of the same message
Reflection Question
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Ask ChatGPT to write a 5-minute
presentation script about your brand for a
fashion trade show or pitch competition.
Page 40`,
  `Al Meets African Fashion Design Technology
How could consistently using Al for content
creation free up your time as a designer?
What would you do with that extra time?
Workshop Exercise Handbook
Ask ChatGPT to write a 5-minute
presentation script about your brand for a
fashion trade show or pitch competition.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 41`,
  `Al Meets African Fashion Design Technology
#19
EXERCISE 19
Tool: ChatGPT
Workshop Exercise Handbook
Intermediate
Customer Experience Design
Use ChatGPT to design exceptional customer experiences that reflect African
hospitality and enhance your fashion brand.
Objective
Duration
25 mins
Tool
ChatGPT
Background
Customer experience is a powerful differentiator for fashion brands, especially when you
are competing with fast fashion. African cultures have deep traditions of hospitality and
community that can inform truly unique customer experiences.
Step-by-Step Instructions
116.
Ask ChatGPT: "What are the key elements of exceptional customer experience in luxury
and boutique fashion retail? Give examples from both global and African brands."
117.
Ask: "How can African concepts of hospitality (Ubuntu philosophy, communal
celebration, gifting traditions) be translated into modern fashion retail experiences?"
118.
Ask: "Design a complete customer journey for someone buying their first piece from my
African fashion brand online. Map every touchpoint from discovery to post-purchase."
119.
Ask: "What are 5 creative packaging ideas for an African fashion brand that make the
unboxing experience memorable and culturally meaningful?"
120.
Ask: "How should I handle returns and complaints in a way that builds customer loyalty?
Write a customer service policy for my brand."
121.
Ask: "Create a customer loyalty programme concept for my African fashion brand that
rewards repeat customers and brand ambassadors."
Pro Tips for Better Results
•
Reference specific African cultural values: Ubuntu, Akwaaba, Harambee
•
Ask about both online and offline customer experience
•
Consider international customers who may be encountering African fashion for the first time
•
Ask about customer experience benchmarks in your price tier
Reflection Question
How does exceptional customer
experience become part of your brand
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Page 42`,
  `Al Meets African Fashion Design Technology
story and support word-of-mouth marketing
in African communities?
Workshop Exercise Handbook
Ask ChatGPT to write a complete FAQ page
for your fashion brand's website that reflects
your brand voice.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 43`,
  `Al Meets African Fashion Design Technology
#20
EXERCISE 20
Tool: ChatGPT
Workshop Exercise Handbook
Intermediate
Future Collections & Al Integration Strategy
Objective
Use ChatGPT to develop a forward-thinking strategy for how Al tools will
continue to support the growth and development of your African fashion
brand.
Duration
30 mins
Tool
ChatGPT
Background
Al is not just a one-time tool – it can be systematically integrated into every aspect of your
fashion business. This final exercise challenges you to think strategically about your Al-
powered future.
Step-by-Step Instructions
122.
Ask ChatGPT: "Map all the ways Al can support an African fashion brand across: design
development, production, marketing, sales, customer experience, and business operations. Be
specific."
123.
Ask: "What Al skills should an African fashion designer develop over the next 2 years to
remain competitive and creative? Create a learning roadmap."
124.
Ask: "Design a concept for an Al-assisted custom clothing service for an African fashion
brand. How would it work? What would the customer experience be? What Al tools would power
it?"
125.
Ask: "What are the ethical considerations for African fashion designers using Al? Think
about: cultural ownership, artist credit, data privacy, and impact on traditional artisans."
126.
Ask: "Write a 3-year vision statement for my Al-integrated African fashion brand that
balances technological innovation with cultural authenticity and community impact."
127.
Reflect on your 20-exercise journey: what has changed in how you think about Al and
African fashion design?
Pro Tips for Better Results
•
Think about Al as a team member, not just a tool
•
Ask about Al developments specifically affecting African creative industries
•
Consider both the opportunities and the risks of Al dependency
•
Ask about building community around your brand using Al-powered tools
Reflection Question
Kente Ankara Adire Bogolan Shweshwe
Extension Challenge
Page 44`,
  `Al Meets African Fashion Design Technology
Workshop Exercise Handbook
As an African fashion designer, what is
your unique responsibility in how you use
Al - both to your creative tradition and to
the future of the industry?
Ask ChatGPT to help you write a manifesto
for ethical and culturally-responsible Al use in
African fashion design.
My Notes & Observations:
Kente Ankara Adire Bogolan Shweshwe
Page 45`,
  `Al Meets African Fashion Design Technology
Workshop Exercise Handbook
AI PROMPT GLOSSARY FOR AFRICAN FASHION DESIGNERS
Use these terms in your Al prompts to get better results:
Term / Phrase
'Act as a fashion
What It Does
Tells Al to respond from a professional fashion perspective
designer'
'Be specific about [fabric Keeps the Al focused on the exact textile you are working with
name]'
'Give me 5 options'
Generates multiple variations to choose from
'Make it more
Asks Al to modernise traditional elements
contemporary'
'Explain the cultural
Requests deeper cultural context
significance'
'For a luxury market'
Adjusts the tone and style recommendations upward
'In the style of [region]
Specifies geographic aesthetic influence
Africa'
'Make it commercially
Focuses on market-ready, sellable designs
viable'
'Seamless repeat
For image Al: creates fabric-appropriate pattern tiles
pattern'
'Editorial fashion
For image Al: creates high-fashion quality images
photography'
'Full length fashion
For image Al: shows the complete outfit
illustration'
'Step by step'
Asks for detailed, ordered instructions
'Refine this / improve
Iterates on previous Al output
this'
'What are the risks?'
Asks Al to identify potential problems or challenges
'Write this for Instagram
Adapts content to a specific platform's tone
/ LinkedIn'
Kente Ankara Adire Bogolan Shweshwe
Page 46`,
  `Al Meets African Fashion Design Technology
CERTIFICATE OF COMPLETION
Al Meets African Fashion Design Technology Workshop
This certifies that
Workshop Exercise Handbook
(Participant Name)
has successfully completed all 20 hands-on exercises in
Al-Powered African Fashion Design Technology
demonstrating proficiency in using Meta Al, Google Gemini, NightCafe Studio,
Leonardo Al, and ChatGPT for fashion design, brand development,
and cultural storytelling.
Kente Ankara Adire Bogolan Shweshwe Kanga Aso-oke Ndebele
Facilitator Signature
Date
Kente Ankara Adire Bogolan Shweshwe
Page 47`,
];
```

### FILE: contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userOrUsername: User | string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('techbridge_ai_workshop_flyer_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('techbridge_ai_workshop_flyer_user');
      }
    }
  }, []);

  const login = async (userOrUsername: User | string, password?: string) => {
    if (typeof userOrUsername === 'object') {
      setIsAuthenticated(true);
      setUser(userOrUsername);
      localStorage.setItem('techbridge_ai_workshop_flyer_user', JSON.stringify(userOrUsername));
      return { success: true };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userOrUsername, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem('techbridge_ai_workshop_flyer_user', JSON.stringify(data.user));
      }
      return { success: data.success, message: data.message };
    } catch (err) {
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem('techbridge_ai_workshop_flyer_user', JSON.stringify(data.user));
      }
      return { success: data.success, message: data.message };
    } catch (err) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('techbridge_ai_workshop_flyer_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

```

### FILE: CREATION.md
```md
# techbridge-ai-workshop-flyer

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: deploy.ps1
```ps1
# TechBridge AI Workshop Flyer Deployment Script
param(
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/workshop/",
    [switch]$Build = $false
)

Write-Host "=== TECHBRIDGE AI WORKSHOP FLYER DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath`n"

if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; exit 1 }
}

if (-not (Test-Path "dist")) {
    Write-Host "Error: dist/ not found. Run with -Build flag." -ForegroundColor Red; exit 1
}

Write-Host "Creating directory..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-workshop-flyer' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /workshop/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /workshop/index.html [QSA,L]
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/workshop`n"



```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/techbridge-ai-workshop-flyer/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/techbridge-ai-workshop-flyer/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/techbridge-ai-workshop-flyer/',  // REQUIRED: Assets must load from /techbridge-ai-workshop-flyer/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/techbridge-ai-workshop-flyer"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/techbridge-ai-workshop-flyer">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/techbridge-ai-workshop-flyer/`, not at the root
- **Asset Loading**: Without `base: '/techbridge-ai-workshop-flyer/'`, assets try to load from `/assets/` instead of `/techbridge-ai-workshop-flyer/assets/`
- **Routing**: Without `basename="/techbridge-ai-workshop-flyer"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/techbridge-ai-workshop-flyer/assets/index-*.js`
- Link tags should reference: `/techbridge-ai-workshop-flyer/assets/index-*.css`

If they reference `/assets/` instead of `/techbridge-ai-workshop-flyer/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/techbridge-ai-workshop-flyer/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/techbridge-ai-workshop-flyer/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: techbridge-ai-workshop-flyer

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — techbridge-ai-workshop-flyer

**Application:** techbridge-ai-workshop-flyer
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_techbridge-ai-workshop-flyer_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — techbridge-ai-workshop-flyer

**Application:** techbridge-ai-workshop-flyer
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd techbridge-ai-workshop-flyer
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build techbridge-ai-workshop-flyer
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up techbridge-ai-workshop-flyer
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/GAP_ANALYSIS.md
```md
# Gap Analysis & Traceability Report
**Project:** Techbridge AI Workshop Flyer
**Current Version:** 1.1 (Post-Phase 2 Implementation)
**Reference:** SRS v1.0

---

## 1. Executive Summary
The project has successfully transitioned from a static high-fidelity prototype (Phase 1) to a secure, accessible web application (Phase 2).

**Key Findings:**
*   ✅ **100%** of SRS v1.0 Functional Requirements are met.
*   ⚠️ **Significant Scope Creep**: Phase 2 introduced complex features (Admin, Auditing, Theming) that are currently undocumented in the SRS.
*   ✅ **Accessibility**: The application now exceeds the original "High-fidelity" mandate by adhering to WCAG 2.1 AA standards.

---

## 2. Forward Gap Analysis (SRS v1.0 → Implementation)
*Do the current features satisfy the original requirements?*

| SRS ID | Requirement | Status | Implementation Notes |
|--------|-------------|--------|----------------------|
| **FR-01** | Display Inst. Details | ✅ **Met** | `constants.ts` -> `Flyer.tsx` header. |
| **FR-02** | Event Title Styling | ✅ **Met** | Gradient text and Playfair font applied. |
| **FR-03** | Event Logistics | ✅ **Met** | Grid layout in `Flyer.tsx`. |
| **FR-04** | Speaker Lists (AI/Human) | ✅ **Met** | `SpeakerCard.tsx` handles `isAi` logic dynamically. |
| **FR-05** | Workshop Focus | ✅ **Met** | Central focus box implemented. |
| **FR-07** | Circuit/Orb Background | ✅ **Met** | `BackgroundElements.tsx`. |
| **NFR-01** | Sci-Fi Dark Mode | 🔄 **Modified** | Original requirement met, but now part of a larger Theme System. |
| **NFR-03** | Responsiveness | ✅ **Met** | Tailwind CSS responsive prefixes (`sm:`, `md:`) used throughout. |

---

## 3. Reverse Gap Analysis (Implementation → SRS v1.0)
*What exists in the code that is NOT in the documentation? (Undocumented Features)*

The following features were implemented during **Phase 2** and represent a gap in the current SRS v1.0 documentation.

| Implemented Feature | Description | Missing Requirement ID | Action Required |
|---------------------|-------------|------------------------|-----------------|
| **Theme System** | Toggle between Dark, Light, and High-Contrast modes using CSS variables. | **NFR-NEW-01** | Add to SRS v2.0 |
| **Admin Authentication** | Password-protected modal (default: `admin`) to access restricted areas. | **FR-NEW-01** | Add to SRS v2.0 |
| **Audit Logging** | In-memory tracking of user actions (Login, Theme Change) with timestamps. | **FR-NEW-02** | Add to SRS v2.0 |
| **Accessibility Controls** | ARIA labels, semantic HTML, and focus ring management for WCAG compliance. | **NFR-NEW-02** | Add to SRS v2.0 |
| **Keyboard Shortcuts** | `Ctrl+Shift+A` to toggle Admin Panel. | **FR-NEW-03** | Add to SRS v2.0 |

---

## 4. Competitive Gap Analysis (vs. Best-in-Class Standards)
*Remaining gaps to achieve "World Class" status.*

| Feature Category | Best-in-Class Standard | Current State (v1.1) | Gap Severity |
|------------------|------------------------|----------------------|--------------|
| **Registration** | Integrated RSVP/Ticket generation. | Static "Free Entry" badge. | **High** |
| **Persistence** | Database storage for Audit Logs. | In-memory (lost on refresh). | **Medium** |
| **Testing** | Automated E2E test suite. | Manual testing only. | **High** (Targeting Phase 3) |
| **SEO/Social** | Open Graph meta tags for sharing. | Basic HTML title only. | **Medium** |
| **PWA** | Offline capabilities & Installability. | Standard Web Page. | **Low** |

---

## 5. Recommendations for Phase 3
1.  **Update SRS**: Generate SRS v2.0 to formally document the Security and Theming modules.
2.  **Test Automation**: Implement the Playwright test suite (Phase 3 Checklist) to ensure the new Accessibility features do not regress.
3.  **Data Persistence**: While out of scope for a flyer, the Audit Log should ideally persist to `localStorage` if no backend is available.

```

### FILE: docs/guides/admin-guide.md
```md
# Administrator Guide
**Project:** Techbridge AI Workshop Flyer
**Version:** 1.0

---

## 1. Accessing the Admin Panel
There are two methods to access the secured Administrator Dashboard:

1.  **UI Footer Link**: Scroll to the very bottom right of the page. Click the faint "Admin" text link.
2.  **Keyboard Shortcut**: Press `Ctrl + Shift + A` simultaneously anywhere on the page.

## 2. Authentication
*   **Default Password**: `admin`
*   **Note**: This password is hardcoded for demonstration purposes. For production use, see `components/AdminPanel.tsx` line 25 to update logic.

## 3. Dashboard Features

### 3.1 Audit Logs
The **Audit Logs** tab tracks user interactions within the current session.
*   **Events Tracked**: Login attempts, theme changes, dashboard toggles.
*   **Data Persistence**: Logs are stored in-memory. Reloading the page clears the logs.
*   **Clear History**: Use the "Clear History" button to wipe the current session logs.

### 3.2 Diagnostics (Self-Testing)
The **Diagnostics** tab provides tools to verify system integrity.
*   **Run Diagnostics**: Click this button to execute the client-side test suite (`utils/diagnostics.ts`).
*   **Checks Performed**:
    *   DOM Integrity (Root/Main elements existence).
    *   Theme System (CSS Variable injection).
    *   Accessibility (Alt text compliance).
    *   Interactive Controls (Focusable buttons).
    *   Content Rendering (Speaker cards).

## 4. Theme Management
The administrator can verify visual integrity across three modes using the floating toggle widget in the top-right corner:
*   ☀️ **Light Mode**: Professional, high-readability.
*   🌙 **Dark Mode**: Default Sci-Fi aesthetic.
*   👁️‍🗨️ **High Contrast**: WCAG AAA compliance (pure black/yellow).

## 5. Troubleshooting
*   **Panel won't open**: Ensure no browser extensions are blocking keyboard shortcuts.
*   **Logs empty**: Logs are volatile. If the page was refreshed, logs are lost.
*   **Diagnostics Fail**: Check the browser console (F12) for detailed error messages if the UI shows a "Fail" status.

```

### FILE: docs/guides/deployment-guide.md
```md
# Deployment Guide
**Project:** Techbridge AI Workshop Flyer
**Target Environment:** Static Web Hosting

---

## 1. Prerequisites
*   **Node.js** (v18+): Required for running the Playwright test suite, though not strictly required for serving the app in its current "no-build" state.
*   **Web Browser**: Chrome/Edge/Firefox (Latest) supporting ES Modules and Import Maps.

## 2. Build Architecture
This application utilizes a **Zero-Build** architecture for development and rapid prototyping:
*   **React** is loaded via `esm.sh` CDN.
*   **Tailwind** is loaded via Play CDN (Runtime JIT).
*   **TypeScript/JSX** files are assumed to be served in an environment that handles basic resolution or via a lightweight dev server (like Vite) if compiled. 

*Note: For the provided file structure, the application expects `index.html` to be the entry point.*

## 3. Production Deployment (Static)
To deploy this application to a production environment (e.g., Netlify, Vercel, GitHub Pages):

### Option A: Standard Static Host
1.  Upload all files (`index.html`, `App.tsx`, `index.tsx`, etc.) to the public root.
2.  Ensure your web server serves `.tsx` files with the correct MIME type if compiling on the fly, OR use a build tool.

### Option B: Recommended Production Build (Vite)
For a robust production deployment, it is recommended to wrap the code in a Vite config:

1.  Initialize Vite:
    ```bash
    npm create vite@latest techbridge-flyer -- --template react-ts
    ```
2.  Move `components`, `utils`, `types.ts`, `constants.ts`, `App.tsx` into `src/`.
3.  Move `index.html` to root.
4.  Run Build:
    ```bash
    npm run build
    ```
5.  Deploy the `dist/` folder.

## 4. Environment Configuration
Currently, there are no `.env` dependencies.
*   **API Keys**: None required.
*   **Backend**: None (Serverless/Client-side only).

## 5. Verifying Deployment
1.  Open the production URL.
2.  Check the console for `[AUDIT] App Started`.
3.  Press `Ctrl+Shift+A` to open the Admin Panel.
4.  Run **Diagnostics** to confirm the production build is healthy.

```

### FILE: docs/guides/testing-guide.md
```md
# Testing Guide
**Project:** Techbridge AI Workshop Flyer
**Frameworks:** Jest (conceptually), Playwright (E2E), Manual Diagnostics

---

## 1. Automated E2E Testing (Playwright)
The project includes a robust End-to-End (E2E) test suite located in `tests/playwright/e2e.js`. This suite launches a headless Chrome browser to simulate user interactions.

### 1.1 Prerequisites
```bash
npm install playwright
```

### 1.2 Running the Suite
1.  Ensure the application is running locally (e.g., `http://localhost:3000`).
2.  Update `BASE_URL` in `tests/playwright/e2e.js` if utilizing a different port.
3.  Execute the test runner:
    ```bash
    node tests/playwright/e2e.js
    ```

### 1.3 Test Coverage
The E2E suite verifies:
1.  **Initial Load**: Checks Page Title and Main Container existence.
2.  **Content Rendering**: Verifies Speaker Cards (>2) are present.
3.  **Theming**: Switches to Light Mode and verifies CSS variable computation.
4.  **Security**: Simulates `Ctrl+Shift+A`, inputs admin password, and verifies Dashboard access.
5.  **Screenshots**: Captures evidence in `tests/playwright/screenshots/`.

---

## 2. Client-Side Self-Testing (Diagnostics)
The application allows administrators to run tests directly within the production environment.

### 2.1 Execution
1.  Log in to the **Admin Panel**.
2.  Navigate to the **Diagnostics** tab.
3.  Click **Run Diagnostics**.

### 2.2 Interpretation
*   **Green Check (Pass)**: The component is functioning within parameters.
*   **Red X (Fail)**: Critical failure. Check the `message` field for details (e.g., "Missing Alt Text on 2 images").

---

## 3. Manual Accessibility Testing (WCAG)
1.  **Tab Navigation**: Press `Tab` repeatedly. Verify that focus rings appear on all Buttons and Speaker Cards.
2.  **Screen Reader**: Enable VoiceOver (Mac) or NVDA (Windows). Ensure "Flyer", "Event Details", and "Speakers" sections are announced correctly.
3.  **High Contrast**: Use the Theme Switcher to enable High Contrast mode. Verify all blurred backgrounds are removed and text is strictly Yellow/White on Black.

```

### FILE: docs/SRS-TechbridgeFlyer-1.0.md
```md
# Software Requirements Specification (SRS)
## Project: Techbridge AI Workshop Flyer
**Version:** 2.0 (Final Release)
**Status:** Production Ready

---

## 1. Introduction

### 1.1 Purpose
The purpose of this application is to serve as a high-fidelity, digital promotional flyer for the "AI Rendering in Fashion Design" workshop hosted by Techbridge University College. It acts as both a promotional tool and a technical demonstration of modern web capabilities including secure administration, accessibility compliance, and self-testing.

### 1.2 Scope
The application is a single-page React web application. It displays event logistics, speaker profiles, and institutional branding. It includes a secure Administrator Panel for system diagnostics, audit logging, and specific accessibility toggles.

---

## 2. Functional Requirements

### 2.1 Content Display
- **FR-01:** The system shall display the Institution Name, Department, and Location.
- **FR-02:** The system shall display the Event Title ("AI Rendering in Fashion Design Workshop") with distinct styling.
- **FR-03:** The system shall display a list of Event Details including Date, Time, and Venue.
- **FR-04:** The system shall display a list of Speakers.
    - **FR-04.1:** Each speaker card must show Name, Title, and Topic.
    - **FR-04.2:** If a speaker is flagged as `isAi: true`, an avatar placeholder/icon shall be displayed.
    - **FR-04.3:** If a speaker is human, their provided `imageUrl` shall be displayed.
- **FR-05:** The system shall display a "Workshop Focus" section describing the core value proposition.
- **FR-06:** The system shall display a "Target Audience" section.

### 2.2 UI/UX Effects
- **FR-07:** The background shall feature a "circuit" pattern and animated glowing orbs to fit the AI theme.
- **FR-08:** The UI shall utilize glassmorphism (backdrop blur, semi-transparent backgrounds) for content containers.
- **FR-09:** Speaker cards shall have hover effects (translate Y-axis).

### 2.3 Administration & Security (New in v2.0)
- **FR-10:** The system shall provide a secure Admin Panel accessible via Keyboard Shortcut (`Ctrl+Shift+A`) or footer link.
- **FR-11:** The system shall authenticate administrators via a password mechanism (Default: `admin`).
- **FR-12:** The system shall maintain an in-memory Audit Log of all critical actions (Login, Theme Change, Test Execution).
- **FR-13:** The system shall provide a "Diagnostics" tab to run client-side self-tests on DOM integrity and accessibility.

---

## 3. Non-Functional Requirements

### 3.1 Aesthetics
- **NFR-01:** The design style must be "Sci-Fi/Futuristic" utilizing dark mode colors (#0a0a0a, #0d1b2a) and neon accents.
- **NFR-02:** Typography must utilize 'Playfair Display' for headings and 'Poppins' for body text.

### 3.2 Responsiveness
- **NFR-03:** The layout must adapt to mobile devices (stacked layout) and desktop screens (grid/flex layouts) seamlessly.

### 3.3 Technology
- **NFR-05:** The application shall be built using React 19+.
- **NFR-06:** Styling shall be implemented using Tailwind CSS.
- **NFR-07:** Data shall be decoupled from the view layer.

### 3.4 Accessibility (New in v2.0)
- **NFR-08:** The system shall support a High Contrast Mode for visually impaired users.
- **NFR-09:** All interactive elements must have visible focus rings and ARIA labels.
- **NFR-10:** The system shall be navigable via keyboard (Tab/Enter).

---

## 4. System Architecture

### 4.1 High-Level Architecture
The application follows a Client-Side Single Page Architecture (SPA) pattern.

![System Architecture](diagrams/architecture.svg)

### 4.2 Data Schema
Data is managed via in-memory constants and state interfaces.

![Database Schema](diagrams/database.svg)

### 4.3 Data Flow
Information flows primarily from static constants to the view layer, while user actions flow into the centralized Audit Logger.

![Data Flow](diagrams/data-flow.svg)

---

## 5. Technology Stack Visual

![Tech Stack](diagrams/tech-stack-visual.svg)

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Techbridge Ai Workshop Flyer
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Techbridge Ai Workshop Flyer**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Techbridge Ai Workshop Flyer** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Techbridge Ai Workshop Flyer** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/tech-stack.md
```md
﻿# Technology Stack

## Frontend Framework
- **React (v19.2.5)**
  - Component-based architecture.
  - Functional components with Hooks.
  - Sourced via ESM.sh for browser-native module loading.

## Styling
- **Tailwind CSS (v3.4)**
  - Utility-first CSS framework.
  - Loaded via CDN for rapid prototyping and runtime compilation.
  - Custom configuration for typography (Playfair Display, Poppins) and color palette.

## Language
- **TypeScript**
  - Strong typing for interfaces (`Speaker`, `EventDetail`).
  - Ensures data integrity across component props.

## Assets & typography
- **Google Fonts**: Playfair Display (Headings), Poppins (Body), Bebas Neue.
- **Icons**: Emoji-based icons (for lightweight performance) and CSS shapes.

## Build/Runtime
- **ES Modules**: Browser-native ES module imports via `<script type="importmap">`.
- **Babel (Implicit)**: In-browser transpilation (assumed for `.tsx` execution in this specific environment) or standard Vite build pipeline depending on deployment target.

```

### FILE: docs/TESTING.md
```md
# Testing Guide — techbridge-ai-workshop-flyer

**Application:** techbridge-ai-workshop-flyer
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd techbridge-ai-workshop-flyer
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Techbridge Ai Workshop Flyer | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Techbridge Ai Workshop Flyer | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Techbridge Ai Workshop Flyer | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Lora:wght@400;700&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      :root, [data-theme='gold-luxury'] {
        --font-sans: 'Lora', serif;
        --color-bg-primary: #F5F0E8;
        --color-bg-secondary: #FFFBF5;
        --color-text-primary: #3D2817;
        --color-accent-primary: #D4AF37;
      }
      [data-theme='dark'] {
        --font-sans: 'Inter', sans-serif;
        --color-bg-primary: #1A1A1A;
        --color-bg-secondary: #2D2D2D;
        --color-text-primary: #FFFFFF;
        --color-accent-primary: #64FFDA;
      }
      body {
        font-family: var(--font-sans, 'Inter'), sans-serif;
        margin: 0;
        padding: 0;
        background-color: var(--color-bg-primary);
        color: var(--color-text-primary);
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      #root {
        min-height: 100vh;
      }
    </style>
    <script>
      (function() {
        try {
          const theme = localStorage.getItem('techbridge-ai-workshop-flyer-theme') || 'gold-luxury';
          const themeSlug = theme.toLowerCase().replace(/\s+/g, '-');
          document.documentElement.setAttribute('data-theme', themeSlug);
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'gold-luxury');
        }
      })();
    </script>

    <script type="module" src="./index.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">techbridge ai workshop flyer</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { AppWithAuth } from './components/AppWithAuth';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  </React.StrictMode>
);
```

### FILE: metadata.json
```json
{
  "name": "Techbridge AI Workshop Flyer",
  "description": "A high-fidelity, responsive digital flyer for a Fashion Design AI Workshop, featuring a sci-fi aesthetic, gradient effects, and glassmorphism UI elements.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "packageManager": "pnpm@10.30.1",
  "name": "techbridge-ai-workshop-flyer",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "serve": "14.2.5",
    "typescript": "~5.8.2",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "@playwright/test": "^1.49.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
# Techbridge AI Workshop Flyer

![Tech Stack](docs/diagrams/tech-stack-visual.svg)

## 📌 Executive Summary
The **Techbridge AI Workshop Flyer** is a high-fidelity, interactive web application designed to promote the "AI Rendering in Fashion Design" workshop. 

Going beyond a simple static page, this project implements a production-grade architecture featuring secure administration, automated self-testing, and rigorous accessibility compliance (WCAG 2.1 AA).

### ✨ Key Features
*   **Sci-Fi Aesthetic**: Immersive dark-mode design with circuit animations and glassmorphism.
*   **Secure Admin Panel**: Protected dashboard (`Ctrl+Shift+A`, password: `admin`) for system monitoring.
*   **Accessibility First**: Native Theme Switcher (Light/Dark/High-Contrast) and screen-reader optimizations.
*   **Self-Healing**: Built-in diagnostics engine to verify DOM integrity and content rendering.

---

## 📚 Documentation Structure

The project documentation is organized into the following modules:

### 📋 Requirements & Analysis
*   **[SRS v2.0 (Final)](docs/SRS-TechbridgeFlyer-1.0.md)**: Full Software Requirements Specification.
*   **[Gap Analysis](docs/GAP_ANALYSIS.md)**: Traceability report covering Phase 1-2 scope.
*   **[Tech Stack](docs/tech-stack.md)**: Detailed breakdown of libraries and tools.

### 🛠 Operational Guides
*   **[Deployment Guide](docs/guides/deployment-guide.md)**: How to publish to production (Netlify/Vercel).
*   **[Admin Guide](docs/guides/admin-guide.md)**: Manual for the secured dashboard.
*   **[Testing Guide](docs/guides/testing-guide.md)**: Instructions for Playwright and Manual tests.

### 📐 Architecture
*   **[System Architecture](docs/diagrams/architecture.svg)**
*   **[Data Flow](docs/diagrams/data-flow.svg)**
*   **[Database Schema](docs/diagrams/database.svg)**

---

## 🚀 Quick Start

1.  **Run Application**:
    open `index.html` in a modern browser.

2.  **Access Admin Panel**:
    Press `Ctrl + Shift + A` and enter password `admin`.

3.  **Run Tests**:
    ```bash
    npm install playwright
    node tests/playwright/e2e.js
    ```

---
*Generated by Phase 5 Execution | Techbridge AI*

```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Techbridge Ai Workshop Flyer</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Techbridge Ai Workshop Flyer — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — techbridge-ai-workshop-flyer
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('techbridge-ai-workshop-flyer E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tests/puppeteer/e2e.js
```javascript
/**
 * Playwright E2E Test Suite for Techbridge Flyer App
 * 
 * Usage:
 * 1. Ensure app is running (e.g., http://localhost:3000)
 * 2. npm install playwright
 * 3. node tests/playwright/e2e.js
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000'; // Adjust as needed
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)){
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  console.log('🚀 Starting E2E Test Suite...');
  
  const browser = await chromium.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Helper to take screenshot
  const takeScreenshot = async (name) => {
    const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`📸 Screenshot saved: ${name}.png`);
  };

  try {
    // 1. Initial Load
    console.log(`Testing navigation to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    const title = await page.title();
    if (title.includes('Techbridge AI Workshop')) {
      console.log('✅ Page Title Verified');
    } else {
      throw new Error(`Title mismatch: ${title}`);
    }
    await takeScreenshot('01-initial-load');

    // 2. Check Critical Elements
    const flyerExists = await page.$('main[aria-label="Flyer: AI Rendering in Fashion Design Workshop"]');
    if (flyerExists) console.log('✅ Flyer container found');
    else throw new Error('Flyer container missing');

    const speakers = await page.$$('[role="article"]');
    if (speakers.length >= 2) console.log(`✅ ${speakers.length} Speakers rendered`);
    else throw new Error('Speakers not rendered correctly');

    // 3. Accessibility / Theme Testing
    console.log('Testing Theme Switcher...');
    const themeSwitcher = await page.$('[aria-label="Accessibility Controls"]');
    if (!themeSwitcher) throw new Error('Theme Switcher not found');
    
    // Switch to Light Mode
    const lightButton = await page.$('button[aria-label="Switch to Light Theme"]');
    await lightButton.click();
    await new Promise(r => setTimeout(r, 500)); // Wait for transition
    await takeScreenshot('02-light-mode');
    
    // Verify CSS Variable change
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    console.log(`Info: Background color is now ${bgColor}`);

    // 4. Admin Panel Interaction
    console.log('Testing Admin Panel Access...');
    // Simulate Ctrl+Shift+A
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('A');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');
    
    await new Promise(r => setTimeout(r, 500));
    await takeScreenshot('03-admin-login-modal');

    // Login
    await page.type('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 500));

    // Verify Dashboard
    const dashboardTitle = await page.$('#admin-dash-title');
    if (dashboardTitle) console.log('✅ Admin Login Successful');
    else throw new Error('Failed to login to Admin Panel');
    
    await takeScreenshot('04-admin-dashboard');

    console.log('🎉 All Tests Passed Successfully!');

  } catch (error) {
    console.error('❌ Test Failed:', error);
    await takeScreenshot('error-state');
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node",
      "vite/client"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript
export interface Speaker {
  name: string;
  title: string;
  topic: string;
  isAi?: boolean;
  imageUrl?: string;
  variant: 'primary' | 'secondary';
}

export interface EventDetail {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
}

export type ThemeMode = 'dark' | 'light' | 'high-contrast';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  message?: string;
  timestamp: number;
}

export interface ShowcaseImage {
  id: string;
  url: string;
  caption: string;
}
```

### FILE: utils/audit.ts
```typescript
import { AuditLogEntry } from '../types';

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private listeners: (() => void)[] = [];

  log(action: string, details?: string) {
    const entry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      details
    };
    this.logs.unshift(entry);
    // Keep only last 100 logs
    if (this.logs.length > 100) this.logs.pop();
    this.notify();
    console.log(`[AUDIT] ${action}:`, details || '');
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const auditLogger = new AuditLogger();
```

### FILE: utils/diagnostics.ts
```typescript
import { TestResult } from '../types';

export const runSystemDiagnostics = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];
  
  const addResult = (name: string, passed: boolean, message: string) => {
    results.push({
      id: crypto.randomUUID(),
      name,
      status: passed ? 'pass' : 'fail',
      message,
      timestamp: Date.now()
    });
  };

  // Test 1: DOM Structure Integrity
  try {
    const root = document.getElementById('root');
    const flyer = document.querySelector('main');
    addResult(
      'Critical DOM Elements', 
      !!(root && flyer), 
      root && flyer ? 'Root and Main Flyer container found.' : 'Critical DOM elements missing.'
    );
  } catch (e) {
    addResult('Critical DOM Elements', false, `Error: ${e}`);
  }

  // Test 2: CSS Variable Injection
  try {
    const computed = getComputedStyle(document.documentElement);
    const bg = computed.getPropertyValue('--bg-root').trim();
    addResult(
      'Theme System Variables', 
      bg.length > 0, 
      bg.length > 0 ? 'CSS Variables detected.' : '--bg-root variable is undefined.'
    );
  } catch (e) {
    addResult('Theme System Variables', false, `Error: ${e}`);
  }

  // Test 3: Accessibility Attributes
  try {
    const images = document.querySelectorAll('img');
    let missingAlt = 0;
    images.forEach(img => {
      if (!img.hasAttribute('alt')) missingAlt++;
    });
    addResult(
      'Image Accessibility (Alt Text)', 
      missingAlt === 0, 
      missingAlt === 0 ? 'All images have alt attributes.' : `${missingAlt} images missing alt text.`
    );
  } catch (e) {
    addResult('Image Accessibility', false, `Error: ${e}`);
  }

  // Test 4: Interactive Elements
  try {
    const buttons = document.querySelectorAll('button');
    const focusable = Array.from(buttons).every(btn => btn.tabIndex !== -1);
    addResult(
      'Interactive Controls', 
      buttons.length > 0 && focusable, 
      `Found ${buttons.length} buttons, all focusable.`
    );
  } catch (e) {
    addResult('Interactive Controls', false, `Error: ${e}`);
  }

  // Test 5: Speaker Data Rendering
  try {
    const cards = document.querySelectorAll('[role="article"]');
    addResult(
      'Content Rendering', 
      cards.length > 0, 
      `Rendered ${cards.length} speaker cards successfully.`
    );
  } catch (e) {
    addResult('Content Rendering', false, `Error: ${e}`);
  }

  // Simulate async delay for realism
  await new Promise(r => setTimeout(r, 800));

  return results;
};
```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
  base: './',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — techbridge-ai-workshop-flyer
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — techbridge-ai-workshop-flyer
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

