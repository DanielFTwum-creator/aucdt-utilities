# techbridge-ai-application-portal - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-ai-application-portal.

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

### FILE: .env
```text
VITE_ADMIN_PASSWORD_HASH=[REDACTED_CREDENTIAL]

```

### FILE: .env.development.local
```text
VITE_GOOGLE_CLIENT_ID=[REDACTED_CREDENTIAL]
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

```

### FILE: .env.example
```text
VITE_ADMIN_PASSWORD_HASH=[REDACTED_CREDENTIAL]

```

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
VITE_GOOGLE_CLIENT_ID=[REDACTED_CREDENTIAL]
VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/auth/google/callback

```

### FILE: .eslintrc.json
```json
{
  "root": true,
  "env": { "browser": true, "es2020": true },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "ignorePatterns": ["dist", ".eslintrc.json"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["react-refresh"],
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ]
  }
}

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

### FILE: App.tsx
```typescript
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilters from './components/CategoryFilters';
import AppGrid from './components/AppGrid';
import Footer from './components/Footer';
import Pagination from './components/Pagination';
import FeatureBand from './components/FeatureBand';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import TableOfContents from './components/TableOfContents';
import { useAuth } from './contexts/AuthContext';
import { AI_APPLICATIONS, CATEGORIES } from './constants';
import { Category, Theme } from './types';
import { logAction } from './services/auditService';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function App() {
  const { logout: authLogout } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All Apps'>('All Apps');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('techbridge_theme') as Theme | null;
    if (savedTheme) return savedTheme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
      return sessionStorage.getItem('techbridge_auth') === 'true';
  });
  const [showAdmin, setShowAdmin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  
  const APPS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [showIndex, setShowIndex] = useState(false);

  const handleLogout = useCallback(() => {
    authLogout();
    setShowAdmin(false);
    logAction('Admin logged out');
  }, [authLogout]);

  // Session Timeout Logic
  useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      const resetTimer = () => {
          if (isAuthenticated) {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(() => {
                  handleLogout();
                  alert('Session timed out due to inactivity.');
              }, SESSION_TIMEOUT);
          }
      };

      if (isAuthenticated) {
          window.addEventListener('mousemove', resetTimer);
          window.addEventListener('keydown', resetTimer);
          window.addEventListener('click', resetTimer);
          resetTimer(); // Start timer
      }

      return () => {
          clearTimeout(timeoutId);
          window.removeEventListener('mousemove', resetTimer);
          window.removeEventListener('keydown', resetTimer);
          window.removeEventListener('click', resetTimer);
      };
  }, [handleLogout, isAuthenticated]);

  // Lockout Timer Logic
  useEffect(() => {
      if (lockoutUntil) {
          const remaining = lockoutUntil - Date.now();
          if (remaining > 0) {
              const timer = setTimeout(() => {
                  setLockoutUntil(null);
                  setLoginAttempts(0);
              }, remaining);
              return () => clearTimeout(timer);
          } else {
              // eslint-disable-next-line react-hooks/set-state-in-effect
              setLockoutUntil(null);
              setLoginAttempts(0);
          }
      }
  }, [lockoutUntil]);

  // Apply theme on mount and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('techbridge_theme', newTheme);
  };

  const hashPassword = [REDACTED_CREDENTIAL]
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleLogin = async (password: string) => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
        const remaining = Math.ceil((lockoutUntil - Date.now()) / 60000);
        setLoginError(`Account locked. Try again in ${remaining} minutes.`);
        return;
    }

    if (lockoutUntil && Date.now() > lockoutUntil) {
        setLockoutUntil(null);
        setLoginAttempts(0);
    }

    const envHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH as string | undefined;
    const inputHash = await hashPassword(password);

    if (inputHash === envHash) {
      setIsAuthenticated(true);
      sessionStorage.setItem('techbridge_auth', 'true');
      setShowAdmin(true); // Ensure dashboard shows
      setLoginError(null);
      setLoginAttempts(0);
      logAction('Admin login successful');
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_DURATION;
          setLockoutUntil(lockoutTime);
          setLoginError(`Too many failed attempts. Locked out for 15 minutes.`);
          logAction('Admin account locked out due to excessive failed login attempts');
      } else {
          setLoginError(`Incorrect password. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`);
          logAction('Admin login failed: incorrect password');
      }
    }
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
        setShowAdmin(true);
    } else {
        setShowAdmin(true);
        setLoginError(null); // Reset error on open
    }
    if (!isAuthenticated) {
        logAction('Admin access attempt');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: Category | 'All Apps') => {
    setActiveCategory(category);
    setCurrentPage(1);
    setShowIndex(false); // Close mobile index if open
    window.scrollTo({ top: document.getElementById('main-content')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowIndex(false);
  };

  const filteredApps = useMemo(() => {
    return AI_APPLICATIONS.filter(app => {
      const matchesCategory = activeCategory === 'All Apps' || app.category === activeCategory;
      const matchesSearch = searchTerm === '' ||
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const totalPages = Math.ceil(filteredApps.length / APPS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * APPS_PER_PAGE,
    currentPage * APPS_PER_PAGE
  );

  const categoryCounts = useMemo(() => {
    const counts: { [key in Category | 'All Apps']: number } = {
      'All Apps': AI_APPLICATIONS.length,
      [Category.Research]: 0,
      [Category.Development]: 0,
      [Category.Analysis]: 0,
      [Category.Education]: 0,
    };
    AI_APPLICATIONS.forEach(app => {
      counts[app.category]++;
    });
    return counts;
  }, []);

  if (showAdmin && isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-ink text-brand-cream font-cormorant relative overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-gold focus:text-brand-ink focus:px-4 focus:py-2 focus:font-bold">
        Skip to main content
      </a>
      <div className="grain-overlay"></div>
      
      <Header 
        totalApps={AI_APPLICATIONS.length} 
        theme={theme}
        onThemeChange={changeTheme}
        onAdminClick={handleAdminClick}
        onIndexClick={() => setShowIndex(true)}
      />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden animate-fade-up delay-200">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-playfair font-bold text-brand-gold opacity-[0.03] pointer-events-none select-none leading-none">
              T
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <span className="font-bebas text-brand-gold tracking-[0.2em] text-lg md:text-xl mb-4 block">PRESTIGE EDITION • VOL. III</span>
              <h1 className="font-playfair font-black text-5xl md:text-8xl text-brand-cream uppercase tracking-tight leading-[0.9] mb-2">
                  The AI Revolution
              </h1>
              <h2 className="font-playfair italic text-3xl md:text-5xl text-brand-gold mb-8">
                  Shaping the Future of Ghana
              </h2>
              <p className="max-w-2xl mx-auto font-cormorant text-xl md:text-2xl text-brand-cream/80 leading-relaxed italic">
                  "An exclusive collection of next-generation tools designed for the modern academic pioneer."
              </p>
          </div>
      </section>

      <FeatureBand />

      <main id="main-content" className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10 animate-fade-up delay-400">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar (Left on large screens) */}
            <aside className="lg:col-span-3 hidden lg:block border-r border-brand-gold/20 pr-8">
                <div className="sticky top-8 space-y-12">
                    <TableOfContents 
                        activeCategory={activeCategory} 
                        onCategoryChange={handleCategoryChange}
                        onScrollToTop={handleScrollToTop}
                    />

                    <div className="bg-brand-card-bg border border-brand-gold/20 p-6 relative">
                        <span className="absolute top-4 left-4 text-6xl font-playfair text-brand-gold opacity-20 leading-none">“</span>
                        <p className="font-playfair italic text-brand-gold-pale text-lg leading-relaxed relative z-10 pt-4">
                            Technology is best when it brings people together. We are building the bridge to tomorrow.
                        </p>
                        <div className="mt-4 flex items-center space-x-3">
                            <div className="h-px w-8 bg-brand-gold/50"></div>
                            <span className="font-bebas text-brand-gold tracking-wider text-sm">Dean of Innovation</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
                <section aria-labelledby="filter-and-search-apps" className="mb-12">
                  <h2 id="filter-and-search-apps" className="sr-only">Filter and search applications</h2>
                  <div className="space-y-8">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearch} />
                    <CategoryFilters
                      categories={CATEGORIES}
                      activeCategory={activeCategory}
                      setActiveCategory={handleCategoryChange}
                      categoryCounts={categoryCounts}
                    />
                  </div>
                </section>

                <section aria-labelledby="ai-applications-grid">
                    <h2 id="ai-applications-grid" className="sr-only">AI Applications</h2>
                    <div className="sr-only" aria-live="polite" role="status">
                      {`${filteredApps.length} application${filteredApps.length !== 1 ? 's' : ''} found.`}
                    </div>
                    
                    {/* Gold Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent mb-12"></div>

                    {paginatedApps.length > 0 ? (
                        <>
                            <AppGrid apps={paginatedApps} />
                            <div className="mt-12">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-24 border border-brand-gold/10 bg-brand-card-bg/30">
                            <p className="font-playfair italic text-2xl text-brand-gold">No applications found matching your criteria.</p>
                            <p className="mt-4 font-dm-sans text-brand-gold-pale/60 uppercase tracking-wider text-sm">Try adjusting your search or filter parameters.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
      </main>
      <Footer />

      {/* Mobile Index Modal */}
      {showIndex && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowIndex(false)}>
            <div className="w-80 h-full bg-brand-ink border-l border-brand-gold p-8 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8 border-b border-brand-gold/30 pb-4">
                    <h2 className="font-playfair text-2xl text-brand-cream">Index</h2>
                    <button onClick={() => setShowIndex(false)} className="text-brand-gold hover:text-brand-cream">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <TableOfContents 
                    activeCategory={activeCategory} 
                    onCategoryChange={handleCategoryChange}
                    onScrollToTop={handleScrollToTop}
                />
            </div>
        </div>
      )}

      {showAdmin && !isAuthenticated && (
        <AdminLogin 
            onLogin={handleLogin} 
            onCancel={() => setShowAdmin(false)} 
            error={loginError}
            isLockedOut={!!lockoutUntil}
        />
      )}
    </div>
  );
}

export default App;

```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_techbridge_ai_application_portal';
const ACCENT   = '#ea580c';

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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Techbridge AI Application Portal</h1>
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

### FILE: components/AdminDashboard.tsx
```typescript
import React, { useState } from 'react';
import { getAuditLogs, logAction } from '../services/auditService';
import { runSelfTests } from '../tests/selfTests';

import { TestResult } from '../types';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const logs = getAuditLogs().reverse();
    const [activeTab, setActiveTab] = useState('audit');
    const [isTesting, setIsTesting] = useState(false);
    const [testResults, setTestResults] = useState<TestResult[]>([]);

    const handleRunTests = async () => {
        setIsTesting(true);
        setTestResults([]);
        logAction('Admin started Puppeteer self-test suite');
        
        const onProgress = (result: TestResult) => {
            setTestResults(prevResults => [...prevResults, result]);
        };

        await runSelfTests(onProgress);

        setIsTesting(false);
        logAction('Admin finished Puppeteer self-test suite');
    };

    return (
        <div className="min-h-screen bg-brand-ink text-brand-cream p-4 sm:p-6 lg:p-8 font-cormorant relative">
            <div className="grain-overlay"></div>
            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex justify-between items-end mb-8 border-b border-brand-gold/30 pb-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-brand-cream uppercase tracking-tight">Admin Dashboard</h1>
                        <p className="text-brand-gold italic text-lg mt-1">System Diagnostics & Security Logs</p>
                    </div>
                    <button onClick={onLogout} className="py-2 px-6 bg-transparent border border-brand-gold text-brand-gold font-bebas tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all uppercase text-lg">Logout</button>
                </div>

                <div className="mb-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('audit')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-bebas text-xl tracking-wide transition-colors ${
                                activeTab === 'audit'
                                    ? 'border-brand-gold text-brand-gold'
                                    : 'border-transparent text-brand-gold-pale/50 hover:text-brand-gold-pale hover:border-brand-gold/30'
                            }`}
                            aria-current={activeTab === 'audit' ? 'page' : undefined}
                        >
                            Audit Log
                        </button>
                        <button
                            onClick={() => setActiveTab('testing')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-bebas text-xl tracking-wide transition-colors ${
                                activeTab === 'testing'
                                    ? 'border-brand-gold text-brand-gold'
                                    : 'border-transparent text-brand-gold-pale/50 hover:text-brand-gold-pale hover:border-brand-gold/30'
                            }`}
                            aria-current={activeTab === 'testing' ? 'page' : undefined}
                        >
                            Puppeteer Self-Test
                        </button>
                    </nav>
                </div>

                {activeTab === 'audit' && (
                    <div className="bg-brand-card-bg border border-brand-gold/20 p-6 shadow-2xl">
                        <h2 className="text-2xl font-playfair italic text-brand-gold mb-4">System Activity Log</h2>
                        <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {logs.length > 0 ? (
                                <ul className="space-y-0 divide-y divide-brand-gold/10">
                                    {logs.map((log, index) => (
                                        <li key={index} className="text-sm p-3 hover:bg-brand-gold/5 transition-colors flex justify-between items-center font-dm-sans">
                                            <span className="text-brand-cream">{log.action}</span>
                                            <span className="font-mono text-brand-gold-pale/60 text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-brand-gold-pale/50 italic">No audit logs found.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'testing' && (
                    <div className="bg-brand-card-bg border border-brand-gold/20 p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-playfair italic text-brand-gold">Self-Testing Suite</h2>
                                <p className="text-brand-gold-pale/60 font-dm-sans text-sm mt-1 max-w-xl">
                                    Simulates critical user journeys to ensure application integrity. Failures will include a screenshot of the page state.
                                </p>
                            </div>
                            <button
                                onClick={handleRunTests}
                                disabled={isTesting}
                                className="inline-flex items-center justify-center py-3 px-6 bg-brand-gold text-brand-ink font-bebas tracking-wider hover:bg-brand-gold-light transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-gold/10"
                            >
                                {isTesting && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-ink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isTesting ? 'Running Tests...' : 'Run Puppeteer Tests'}
                            </button>
                        </div>
                        
                        <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {testResults.length === 0 && !isTesting && <div className="text-center py-12 border-2 border-dashed border-brand-gold/20"><p className="text-brand-gold-pale/50 font-playfair italic text-xl">Ready to execute test suite.</p></div>}
                            {isTesting && testResults.length === 0 && <div className="text-center py-12"><p className="text-brand-gold animate-pulse font-bebas text-xl tracking-wider">Initializing test suite...</p></div>}
                            {testResults.map((result, index) => (
                                <div key={index} className="p-4 bg-brand-ink/50 border-l-4 border-brand-gold/50 hover:border-brand-gold transition-colors">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium font-dm-sans text-brand-cream">{result.description}</p>
                                        <span className={`px-3 py-1 text-xs font-bold font-bebas tracking-wider uppercase ${result.status === 'PASS' ? 'text-green-400 bg-green-900/20 border border-green-900/50' : 'text-red-400 bg-red-900/20 border border-red-900/50'}`}>
                                            {result.status}
                                        </span>
                                    </div>
                                    {result.status === 'FAIL' && (
                                        <div className="mt-3 pt-3 border-t border-brand-gold/10">
                                            <p className="text-sm text-red-400 font-mono bg-red-900/10 p-2 border border-red-900/30 mb-2">Error: {result.error}</p>
                                            {result.screenshot && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-bebas tracking-wider text-brand-gold-pale mb-1 uppercase">Failure Screenshot:</p>
                                                    <img src={result.screenshot} alt={`Screenshot for failed test: ${result.description}`} className="w-full border border-red-500/30 opacity-80 hover:opacity-100 transition-opacity" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

```

### FILE: components/AdminLogin.tsx
```typescript
import React, { useState } from 'react';

interface AdminLoginProps {
    onLogin: (password: string) => void;
    onCancel: () => void;
    error?: string | null;
    isLockedOut?: boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel, error, isLockedOut }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLockedOut) {
            onLogin(password);
        }
    };

    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-login-title"
        >
            <div
                className="relative w-full max-w-md bg-brand-card-bg border border-brand-gold/30 rounded-none shadow-2xl p-8"
                onClick={handleModalContentClick}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>
                <button 
                    onClick={onCancel} 
                    className="absolute top-3 right-3 text-brand-gold-pale hover:text-brand-gold transition-colors p-1"
                    aria-label="Close admin login"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 id="admin-login-title" className="text-3xl font-playfair font-bold text-center text-brand-cream mb-6 uppercase tracking-wide">Admin Access</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline font-dm-sans text-sm">{error}</span>
                        </div>
                    )}
                    <div>
                        <label htmlFor="password-input" className="block text-lg font-cormorant italic text-brand-gold">Password</label>
                        <input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-brand-input-bg border-b border-brand-gold/50 text-brand-cream placeholder-brand-gold-pale/30 focus:outline-none focus:border-brand-gold transition-colors font-dm-sans disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                            autoFocus
                            placeholder="Enter secure key..."
                            disabled={isLockedOut}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="w-full justify-center py-2 px-4 border border-brand-gold/30 text-sm font-bebas tracking-wider text-brand-gold-pale hover:text-brand-gold hover:border-brand-gold transition-all uppercase">Cancel</button>
                        <button type="submit" disabled={isLockedOut} className="w-full justify-center py-2 px-4 bg-brand-gold text-brand-ink text-sm font-bebas tracking-wider hover:bg-brand-gold-light transition-all uppercase shadow-lg shadow-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

```

### FILE: components/AppCard.tsx
```typescript
import React, { useState, useEffect, useMemo } from 'react';
import { AppItem, Category } from '../types';
import { ResearchIcon, DevelopmentIcon, AnalysisIcon, EducationIcon } from './icons';

interface AppCardProps {
  app: AppItem;
  index: number;
}

const categoryStyles: { [key in Category]: { badge: string; icon: React.ReactNode; bgColor: string; textColor: string; } } = {
  [Category.Research]: { badge: 'bg-[var(--color-badge-research-bg)] text-[var(--color-badge-research-text)]', icon: <ResearchIcon />, bgColor: '#DBEAFE', textColor: '#1E40AF' },
  [Category.Development]: { badge: 'bg-[var(--color-badge-development-bg)] text-[var(--color-badge-development-text)]', icon: <DevelopmentIcon />, bgColor: '#EEDCFF', textColor: '#5B21B6' },
  [Category.Analysis]: { badge: 'bg-[var(--color-badge-analysis-bg)] text-[var(--color-badge-analysis-text)]', icon: <AnalysisIcon />, bgColor: '#D1FAE5', textColor: '#065F46' },
  [Category.Education]: { badge: 'bg-[var(--color-badge-education-bg)] text-[var(--color-badge-education-text)]', icon: <EducationIcon />, bgColor: '#FEF3C7', textColor: '#92400E' },
};

const generateSvgPlaceholder = (category: Category, title: string): string => {
    const { bgColor, textColor } = categoryStyles[category];
    const initial = title.charAt(0).toUpperCase();
    const svg = `
        <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${bgColor}" />
            <text
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
                font-family="Inter, sans-serif"
                font-size="120"
                font-weight="bold"
                fill="${textColor}"
            >
                ${initial}
            </text>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};


const AppCard: React.FC<AppCardProps> = ({ app, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>(
    app.imageUrl ? 'loading' : 'loaded' // No loading state if there's no URL
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 50); // Staggered delay
    return () => clearTimeout(timer);
  }, [index]);

  const imageSrc = useMemo(() => {
    if (imageStatus === 'error' || !app.imageUrl) {
        return generateSvgPlaceholder(app.category, app.title);
    }
    return app.imageUrl;
  }, [imageStatus, app.imageUrl, app.category, app.title]);

  const { badge, icon } = categoryStyles[app.category];

  return (
    <div className={`
      group relative transition-all duration-500 ease-in-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      <div className={`
        bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-lg shadow-md group-hover:shadow-xl 
        transition-all duration-300 ease-in-out transform group-hover:-translate-y-1 group-hover:scale-[1.03]
        flex flex-col h-full overflow-hidden
      `}>
        <div className="aspect-video w-full bg-[var(--color-card-border)] relative overflow-hidden">
            {imageStatus === 'loading' && (
              <div className="absolute inset-0 w-full h-full bg-[var(--color-card-border)] shimmer"></div>
            )}
            <img 
                src={imageSrc} 
                alt={`${app.title} preview`} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageStatus === 'loading' ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageStatus('loaded')}
                onError={() => setImageStatus('error')}
            />
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="text-[var(--color-text)] h-8 w-8 flex-shrink-0">{icon}</div>
                <h3 className="text-lg font-bold text-[var(--color-text)] leading-tight truncate">{app.title}</h3>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badge} ml-2 flex-shrink-0`}>
              {app.category}
            </span>
          </div>
          <p className="mt-4 text-[var(--color-text-muted)] text-sm leading-relaxed max-h-20 group-hover:max-h-64 overflow-hidden transition-all duration-300 ease-in-out flex-grow">
            {app.description}
          </p>
        </div>
        <div className="bg-[var(--color-card-footer-bg)] p-4 rounded-b-lg mt-auto">
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full relative overflow-hidden inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] transition-transform duration-200 ease-out transform hover:-translate-y-0.5 active:translate-y-0 group"
          >
            Launch App
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="absolute inset-0 shimmer group-hover:animate-none"></span>
          </a>
        </div>
      </div>
      
      {/* Tooltip */}
      <div role="tooltip" className={`
        absolute bottom-full left-1/2 z-20 mb-3 w-72 max-w-xs -translate-x-1/2 transform rounded-lg bg-[var(--color-tooltip-bg)] p-3 text-sm text-[var(--color-tooltip-text)] shadow-xl
        opacity-0 transition-opacity duration-300
        invisible group-hover:opacity-100 group-hover:visible pointer-events-none
      `}>
        <p className="mb-2 pb-2 font-semibold text-base border-b border-white/20">{app.title}</p>
        <p className="mb-2 text-inherit opacity-80">{app.description}</p>
        <p className="text-xs text-[var(--color-accent)] font-mono break-all">{app.url}</p>
        <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-[var(--color-tooltip-bg)]"></div>
      </div>
    </div>
  );
};

export default AppCard;
```

### FILE: components/AppGrid.tsx
```typescript

import React from 'react';
import AppCard from './AppCard';
import { AppItem } from '../types';

interface AppGridProps {
  apps: AppItem[];
}

const AppGrid: React.FC<AppGridProps> = ({ apps }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {apps.map((app, index) => (
        <AppCard key={app.id} app={app} index={index} />
      ))}
    </div>
  );
};

export default AppGrid;
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

### FILE: components/CategoryFilters.tsx
```typescript
import React from 'react';
import { Category } from '../types';

interface CategoryFiltersProps {
  categories: Category[];
  activeCategory: Category | 'All Apps';
  setActiveCategory: (category: Category | 'All Apps') => void;
  categoryCounts: { [key in Category | 'All Apps']: number };
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categories, activeCategory, setActiveCategory, categoryCounts }) => {
  const allCategories = ['All Apps' as const, ...categories];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3" role="group" aria-label="Filter by category">
      {allCategories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              px-4 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 ease-in-out
              flex items-center space-x-2 min-h-[44px] min-w-[44px] justify-center
              focus:outline-none focus:ring-3 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]
              ${isActive
                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                : 'bg-[var(--color-card-bg)] text-[var(--color-text)] hover:bg-[var(--color-card-border)] hover:shadow-md border border-[var(--color-card-border)]'
              }
            `}
            aria-pressed={isActive}
            aria-label={`Filter by ${category}`}
          >
            <span>{category}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-[var(--color-card-border)]'}`}>
              {categoryCounts[category]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilters;
```

### FILE: components/FeatureBand.tsx
```typescript
import React from 'react';
import { Cpu, Globe, Zap, ShieldCheck } from 'lucide-react';

const FeatureBand: React.FC = () => {
    const features = [
        { icon: <Cpu className="w-5 h-5" />, label: "AI INFRASTRUCTURE", sub: "Next-Gen Compute" },
        { icon: <Globe className="w-5 h-5" />, label: "GLOBAL NETWORK", sub: "Connected Campus" },
        { icon: <Zap className="w-5 h-5" />, label: "INSTANT DEPLOY", sub: "Zero Latency" },
        { icon: <ShieldCheck className="w-5 h-5" />, label: "SECURE CORE", sub: "Enterprise Grade" },
    ];

    return (
        <div className="w-full bg-brand-ink border-y border-brand-gold/30 py-4 animate-fade-up delay-350">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center divide-y md:divide-y-0 md:divide-x divide-brand-gold/20">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-4 px-6 py-2 w-full md:w-auto justify-center md:justify-start group">
                            <div className="text-brand-gold group-hover:text-brand-gold-light transition-colors">
                                {feature.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bebas text-lg tracking-wider text-brand-cream leading-none">{feature.label}</span>
                                <span className="font-cormorant italic text-brand-gold text-sm">{feature.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeatureBand;

```

### FILE: components/Footer.tsx
```typescript
import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-ink text-brand-cream border-t-4 border-brand-gold mt-auto animate-fade-up delay-600">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    {/* Left: Motto */}
                    <div className="flex flex-col items-center md:items-start">
                        <span className="font-playfair italic text-brand-gold text-lg md:text-xl">"Design and Build a Nation"</span>
                        <span className="font-dm-sans text-brand-gold-pale/60 text-xs uppercase tracking-widest mt-1">&copy; {currentYear} Techbridge University College</span>
                    </div>

                    {/* Right: Links & Meta */}
                    <div className="flex items-center space-x-6">
                        <a href="https://techbridge.edu.gh" className="font-bebas text-brand-gold-pale hover:text-brand-gold tracking-wider transition-colors">Main Site</a>
                        <div className="h-3 w-px bg-brand-gold/30"></div>
                        <a href="mailto:info@techbridge.edu.gh" className="font-bebas text-brand-gold-pale hover:text-brand-gold tracking-wider transition-colors">Contact</a>
                    </div>
                </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-brand-ink via-brand-gold/50 to-brand-ink mt-2"></div>
        </footer>
    );
}

export default Footer;

```

### FILE: components/Header.tsx
```typescript
import React, { useState } from 'react';
import { Theme } from '../types';

interface HeaderProps {
    totalApps: number;
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
    onAdminClick: () => void;
    onIndexClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ totalApps, theme, onThemeChange, onAdminClick, onIndexClick }) => {
    const [currentDate] = useState(() => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options).toUpperCase();
    });

    return (
        <header className="relative bg-brand-ink border-b-4 border-brand-gold pt-8 pb-6 animate-fade-down">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                    {/* Left Column: Date & Edition */}
                    <div className="hidden md:flex flex-col items-start border-l-2 border-brand-gold/30 pl-4">
                        <span className="font-bebas text-brand-gold text-xl tracking-widest">{currentDate}</span>
                        <span className="font-dm-sans text-brand-gold-pale text-xs uppercase tracking-widest mt-1">Vol. III • Issue No. 04</span>
                    </div>

                    {/* Center Column: Masthead */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4">
                            <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="Techbridge Seal" className="h-20 w-auto opacity-90 hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <h1 className="font-playfair font-black text-4xl md:text-6xl text-brand-cream uppercase tracking-tight leading-[0.9]">
                            TechBridge
                        </h1>
                        <span className="font-playfair italic text-2xl md:text-3xl text-brand-gold mt-1">University College</span>
                    </div>

                    {/* Right Column: Issue Badge & Controls */}
                    <div className="flex flex-col items-center md:items-end space-y-4">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={onIndexClick}
                                className="md:hidden font-bebas text-brand-gold hover:text-brand-cream transition-colors tracking-wider text-lg border border-brand-gold/50 px-3 py-1"
                            >
                                INDEX
                            </button>
                            <button 
                                onClick={onAdminClick}
                                className="font-bebas text-brand-gold hover:text-brand-cream transition-colors tracking-wider text-lg"
                            >
                                ADMIN ACCESS
                            </button>
                            <div className="h-4 w-px bg-brand-gold/30"></div>
                            <div className="flex space-x-2">
                                {(['light', 'dark', 'high-contrast'] as Theme[]).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => onThemeChange(t)}
                                        className={`w-3 h-3 rounded-full border border-brand-gold transition-all ${theme === t ? 'bg-brand-gold scale-125' : 'bg-transparent hover:bg-brand-gold/50'}`}
                                        aria-label={`Switch to ${t} theme`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="border border-brand-gold/30 p-2 bg-brand-paper/50 backdrop-blur-sm hidden md:block">
                            <div className="flex flex-col items-center px-4 py-1">
                                <span className="font-bebas text-brand-gold text-2xl leading-none">{totalApps}</span>
                                <span className="font-dm-sans text-[10px] text-brand-gold-pale uppercase tracking-wider">Active Modules</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Date (visible only on small screens) */}
                <div className="md:hidden mt-6 text-center border-t border-brand-gold/20 pt-4 flex justify-between items-center">
                    <span className="font-bebas text-brand-gold text-lg tracking-widest">{currentDate}</span>
                    <div className="border border-brand-gold/30 p-1 bg-brand-paper/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center px-2">
                            <span className="font-bebas text-brand-gold text-lg leading-none">{totalApps}</span>
                            <span className="font-dm-sans text-[8px] text-brand-gold-pale uppercase tracking-wider">Apps</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

```

### FILE: components/icons/index.tsx
```typescript

import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        {children}
    </svg>
);

export const ResearchIcon: React.FC = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </IconWrapper>
);

export const DevelopmentIcon: React.FC = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </IconWrapper>
);

export const AnalysisIcon: React.FC = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.085-1.085-1.085m1.085 1.085L5.25 16.5m7.5 0l1-1.085m-1.085 1.085L12.75 15l-1.085-1.085" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </IconWrapper>
);

export const EducationIcon: React.FC = () => (
    <IconWrapper>
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v-5.5a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v2.75M12 14l-9 5 9 5 9-5-9-5zm0 0v5.5a2.25 2.25 0 002.25 2.25h1.5a2.25 2.25 0 002.25-2.25v-2.75" />
    </IconWrapper>
);

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
    let oauthHandled = false;

    const handleOAuthToken = [REDACTED_CREDENTIAL]
      if (oauthHandled) return;
      oauthHandled = true;

      try {
        setIsSubmitting(true);
        setError('');
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const userInfo = await res.json();
        await login({ id: userInfo.id, username: userInfo.name, email: userInfo.email });
        localStorage.removeItem('oauth_token_temp');
      } catch {
        setError('Google login failed. Please try again.');
        setIsSubmitting(false);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'OAUTH_TOKEN_SUCCESS') {
        handleOAuthToken(event.data.access_token);
      }
      if (event.data?.type === 'OAUTH_TOKEN_ERROR') {
        setError(event.data.error_description || event.data.error || 'Google login failed. Please try again.');
        setIsSubmitting(false);
      }
    };

    window.addEventListener('message', handleMessage);

    const checkLocalStorage = setInterval(() => {
      const token = [REDACTED_CREDENTIAL]
      if (token) {
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
      scope: 'openid email profile',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-amber-950 to-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-100 mb-1 font-playfair">Prestige Edition</h1>
          <p className="text-amber-700/80 text-sm font-bebas tracking-widest">THE AI REVOLUTION</p>
        </div>

        <div className="bg-slate-900/50 rounded-2xl shadow-2xl border border-amber-700/30 overflow-hidden p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-center text-amber-100 mb-2 font-playfair">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-amber-700/70 mb-6 text-sm">
            {mode === 'login' ? 'Access the AI application portal' : 'Create an account to get started'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'login' ? (
              <>
                <div>
                  <label htmlFor="identifier" className="block text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">
                    Username or Email
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-700/60" />
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="Enter username or email"
                      disabled={isSubmitting}
                      className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-900/50 focus:border-amber-600 shadow-sm disabled:opacity-50 bg-slate-800 text-amber-50 placeholder:text-amber-700/50"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="username" className="block text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-700/60" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      disabled={isSubmitting}
                      className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-900/50 focus:border-amber-600 shadow-sm disabled:opacity-50 bg-slate-800 text-amber-50 placeholder:text-amber-700/50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-700/60" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isSubmitting}
                      className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-900/50 focus:border-amber-600 shadow-sm disabled:opacity-50 bg-slate-800 text-amber-50 placeholder:text-amber-700/50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-700/60" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      disabled={isSubmitting}
                      className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-900/50 focus:border-amber-600 shadow-sm disabled:opacity-50 bg-slate-800 text-amber-50 placeholder:text-amber-700/50"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-700/60" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isSubmitting}
                  className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-900/50 focus:border-amber-600 shadow-sm disabled:opacity-50 bg-slate-800 text-amber-50 placeholder:text-amber-700/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-amber-700/60 hover:text-amber-600 transition"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-700/60" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                    className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-900/50 focus:border-amber-600 shadow-sm disabled:opacity-50 bg-slate-800 text-amber-50 placeholder:text-amber-700/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-amber-700/60 hover:text-amber-600 transition"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 text-slate-900 px-8 py-3.5 rounded-xl font-medium hover:bg-amber-500 transition-colors shadow-md focus:ring-4 focus:ring-amber-900/50 outline-none disabled:opacity-50 disabled:cursor-not-allowed font-playfair"
            >
              {isSubmitting ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>

            <div className="relative flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-amber-700/20"></div>
              <span className="text-xs text-amber-700/60 uppercase font-semibold">Or</span>
              <div className="flex-1 h-px bg-amber-700/20"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full bg-white border-2 border-amber-200 text-slate-900 px-8 py-3.5 rounded-xl font-medium hover:bg-amber-50 transition-colors shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <p className="text-center text-amber-700/60 text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
              className="text-amber-600 font-medium hover:text-amber-500 transition-colors"
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

### FILE: components/Pagination.tsx
```typescript
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <nav className="mt-12 flex items-center justify-between border-t border-[var(--color-card-border)] pt-6" aria-label="Pagination">
            <div className="-mt-px flex w-0 flex-1">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-[var(--color-text-muted)] hover:border-gray-300 hover:text-[var(--color-text)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clipRule="evenodd" />
                    </svg>
                    Previous
                </button>
            </div>
            <div className="hidden md:-mt-px md:flex">
                <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-[var(--color-text-muted)]">
                    Page {currentPage} of {totalPages}
                </span>
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-[var(--color-text-muted)] hover:border-gray-300 hover:text-[var(--color-text)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <svg className="ml-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Pagination;

```

### FILE: components/SearchBar.tsx
```typescript
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="search"
        name="search"
        id="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full rounded-md border border-[var(--color-input-border)] bg-[var(--color-input-bg)] py-3 pl-10 pr-3 text-base text-[var(--color-input-text)] placeholder:text-[var(--color-input-placeholder)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] transition-colors"
        placeholder="Search for AI applications..."
        aria-label="Search applications"
      />
    </div>
  );
};

export default SearchBar;
```

### FILE: components/TableOfContents.tsx
```typescript
import React from 'react';
import { Category } from '../types';

interface TableOfContentsProps {
    activeCategory: Category | 'All Apps';
    onCategoryChange: (category: Category | 'All Apps') => void;
    onScrollToTop: () => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ activeCategory, onCategoryChange, onScrollToTop }) => {
    const items = [
        { id: '01', title: 'Neural Networks', desc: 'Deep Learning Architectures', category: Category.Research },
        { id: '02', title: 'Data Science', desc: 'Predictive Analytics', category: Category.Analysis },
        { id: '03', title: 'Automation', desc: 'Robotic Process Control', category: Category.Development },
        { id: '04', title: 'Ethics in AI', desc: 'Responsible Innovation', category: Category.Education },
    ];

    return (
        <nav aria-label="Table of Contents" className="space-y-8">
            <div>
                <h3 className="font-bebas text-2xl text-brand-gold tracking-widest mb-6 border-b border-brand-gold/30 pb-2">
                    In This Issue
                </h3>
                <ul className="space-y-6">
                    <li className="group cursor-pointer" onClick={onScrollToTop}>
                         <div className="flex items-baseline space-x-3">
                            <span className="font-bebas text-xl text-brand-gold/50 group-hover:text-brand-gold transition-colors">00</span>
                            <div className="flex flex-col">
                                <span className="font-dm-sans font-bold uppercase text-xs tracking-wider text-brand-cream group-hover:text-brand-gold transition-colors">
                                    Cover Story
                                </span>
                                <span className="font-cormorant italic text-brand-gold-pale/70 text-sm">
                                    The AI Revolution
                                </span>
                            </div>
                        </div>
                    </li>
                    {items.map((item) => (
                        <li key={item.id} className="group cursor-pointer" onClick={() => onCategoryChange(item.category)}>
                            <div className="flex items-baseline space-x-3">
                                <span className={`font-bebas text-xl transition-colors ${activeCategory === item.category ? 'text-brand-gold' : 'text-brand-gold/50 group-hover:text-brand-gold'}`}>
                                    {item.id}
                                </span>
                                <div className="flex flex-col">
                                    <span className={`font-dm-sans font-bold uppercase text-xs tracking-wider transition-colors ${activeCategory === item.category ? 'text-brand-gold' : 'text-brand-cream group-hover:text-brand-gold'}`}>
                                        {item.title}
                                    </span>
                                    <span className="font-cormorant italic text-brand-gold-pale/70 text-sm">
                                        {item.desc}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                     <li className="group cursor-pointer" onClick={() => onCategoryChange('All Apps')}>
                         <div className="flex items-baseline space-x-3">
                            <span className={`font-bebas text-xl transition-colors ${activeCategory === 'All Apps' ? 'text-brand-gold' : 'text-brand-gold/50 group-hover:text-brand-gold'}`}>05</span>
                            <div className="flex flex-col">
                                <span className={`font-dm-sans font-bold uppercase text-xs tracking-wider transition-colors ${activeCategory === 'All Apps' ? 'text-brand-gold' : 'text-brand-cream group-hover:text-brand-gold'}`}>
                                    Full Index
                                </span>
                                <span className="font-cormorant italic text-brand-gold-pale/70 text-sm">
                                    Browse All Applications
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default TableOfContents;

```

### FILE: constants.ts
```typescript


import { Category, AppItem } from './types';

export const CATEGORIES: Category[] = [
  Category.Research,
  Category.Development,
  Category.Analysis,
  Category.Education,
];

export const AI_APPLICATIONS: AppItem[] = [
  { id: 1, name: 'agent', title: 'Agent-Led Software Development', description: 'A powerful framework for building and deploying autonomous AI agents.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/agent' },
  { id: 2, name: 'smartscale-1', title: 'SmartScale Presentation', description: 'Interactive presentation tool for educational purposes.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/smartscale-1' },
  { id: 3, name: 'visquiz', title: 'Visual Quiz Master', description: 'AI-powered visual quiz generation and assessment.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/visquiz' },
  { id: 4, name: 'flyer', title: 'AI Flyer Generator', description: 'Create professional flyers instantly with AI.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/flyer' },
  { id: 5, name: 'draft-email', title: 'AI Email Drafter', description: 'Draft professional emails quickly using AI assistance.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/draft-email' },
  { id: 6, name: 'code-reviewer', title: 'AI Code Reviewer', description: 'Automated code analysis to improve quality and find bugs.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/code-reviewer' },
  { id: 7, name: 'refresh', title: 'AI Studio Directive Workflow', description: 'Streamline your AI studio workflows and directives.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/refresh' },
  { id: 8, name: 'jsonpp', title: 'JSON Preprocessor - Fixed', description: 'Format and beautify your JSON data for better readability.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/jsonpp' },
  { id: 9, name: 'programmes', title: 'AUCDT Design Programmes', description: 'Explore design programmes and academic offerings.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/programmes' },
  { id: 10, name: 'fdt', title: 'AUCDT: Fashion Design Brochure', description: 'Interactive brochure for the Fashion Design Technology programme.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/fdt' },
  { id: 11, name: 'myvbci', title: 'myVBCI Camper App', description: 'Companion app for VBCI campers.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/myvbci' },
  { id: 12, name: 'css-validator', title: 'CSS Validator', description: 'An AI-powered tool to validate and optimise your CSS code.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/css-validator' },
  { id: 13, name: 'recruitment', title: 'Interactive Agency Assessment | AUCDT Student Recruitment', description: 'Streamline the student recruitment and assessment process.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/recruitment' },
  { id: 14, name: 'thepitchhub', title: 'The Pitch Hub Ghana - Empowering Entrepreneurs', description: 'Refine your business pitches with AI-driven feedback.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/thepitchhub' },
  { id: 15, name: 'playgrow', title: 'PlayGrow – Smart Fun for Bright Minds', description: 'Educational games and activities for children.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/playgrow' },
  { id: 16, name: 'creoai', title: 'CreoAI', description: 'Advanced AI tools for creative professionals.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/creoai' },
  { id: 17, name: 'clipai', title: 'ClipAI', description: 'AI-powered video clipping and editing tool.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/clipai' },
  { id: 18, name: 'msee', title: 'AUCDT MSEE Mathematics Aptitude Test', description: 'Mathematics aptitude testing platform.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/msee' },
  { id: 19, name: 'qmd', title: 'QMD to Google Slides Converter', description: 'Convert QMD files directly to Google Slides presentations.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/qmd' },
  { id: 20, name: 'notification', title: 'Application Confirmation | AUCDT', description: 'Intelligent notification system for application confirmations.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/notification' },
  { id: 21, name: 'drone-1', title: 'Drone Light Show Simulator', description: 'Intelligent flight control and data acquisition for autonomous drones.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/drone-1', imageUrl: 'https://placehold.co/600x400/EEDCFF/5B21B6/png?text=Drones' },
  { id: 22, name: 'chow', title: 'ChowConnect Admin Dashboard', description: 'Administrative dashboard for ChowConnect services.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/chow', imageUrl: 'https://placehold.co/600x400/D1FAE5/065F46/png?text=Culinary+AI' },
  { id: 23, name: 'triptych', title: 'Cinematic Triptych Generator', description: 'Create artistic triptychs from your photos using AI.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/triptych' },
  { id: 24, name: 'waec', title: 'Mature Students Exam App', description: 'Prepare for WAEC exams with AI-generated quizzes and materials.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/waec' },
  { id: 25, name: 'smartscale', title: 'SmartScale Presentation', description: 'Advanced presentation tools for educators.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/smartscale' },
  { id: 26, name: 'entrainer', title: 'enTrainer - Engage Your Metabolic Health with Music', description: 'Music-based metabolic health engagement tool.', category: Category.Research, url: 'https://ai-tools.techbridge.edu.gh/entrainer' },
  { id: 27, name: 'sino', title: 'Sino-Twi Translator', description: 'An AI platform for research in Sino-African relations and language translation.', category: Category.Research, url: 'https://ai-tools.techbridge.edu.gh/sino' },
  { id: 28, name: 'sashmade', title: 'Sashmade Kente Academy Proposal', description: 'Proposal and planning for the Sashmade Kente Academy.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/sashmade' },
  { id: 29, name: 'quick-guide', title: 'Object Identifier - Accessibility App', description: 'AI-powered object identification for accessibility.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/quick-guide' },
  { id: 30, name: 'thrive', title: 'AUCDT Interactive Marketing Strategy', description: 'Personalised wellness and marketing strategy tools.', category: Category.Research, url: 'https://ai-tools.techbridge.edu.gh/thrive' },
  { id: 31, name: 'expensepro', title: 'ExpensePro', description: 'Smart expense tracking and management.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/expensepro' },
  { id: 32, name: 'rpms', title: 'Rophe Patient Management System', description: 'Comprehensive patient management system.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/rpms' },
  { id: 33, name: 'markai', title: 'MarkAI: Marketing for Non-Marketers', description: 'Automated marketing tools and feedback.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/markai' },
  { id: 34, name: 'hostelmanagement', title: 'Mount Horeb Prayer Center - Hostel Management', description: 'Management system for hostels and accommodation.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/hostelmanagement' },
  { id: 35, name: 'primevaluer', title: 'PrimeValuer Pro', description: 'AI-based real estate valuation and market analysis.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/primevaluer' },
  { id: 36, name: 'ai-dentist', title: 'AI in Dental Diagnostics: A New Vision for Oral Health', description: 'Advanced AI for dental diagnostics and treatment planning.', category: Category.Research, url: 'https://ai-tools.techbridge.edu.gh/ai-dentist', imageUrl: 'https://placehold.co/600x400/DBEAFE/1E40AF/png?text=AI+Dentist' },
  { id: 37, name: 'dictation', title: 'Dictation App', description: 'Transcribe your speech to text with high accuracy in real-time.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/dictation' },
  { id: 38, name: 'pdf-json', title: 'PDF to Assessment JSON Converter', description: 'Convert complex PDF documents into structured JSON data.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/pdf-json' },
  { id: 39, name: 'cards', title: 'AI Birthday Card Generator', description: 'Generate intelligent cards for various occasions.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/cards' },
  { id: 40, name: 'cardai', title: 'AUCDT AI Application Portal', description: 'The central portal for all AI applications.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/cardai' },
  { id: 41, name: 'warrior', title: 'DJ CyStorm - Electric Storm Warrior', description: 'An AI tool for identifying and mitigating security threats.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/warrior' },
  { id: 42, name: 'lifeplan', title: 'Life Planner AI', description: 'AI-driven insights for personal and professional goal setting.', category: Category.Research, url: 'https://ai-tools.techbridge.edu.gh/lifeplan' },
  { id: 43, name: 'games', title: 'Brick Breaker Game', description: 'A collection of educational games powered by artificial intelligence.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/games' },
  { id: 44, name: 'games/1', title: 'Enhanced Brick Breaker Game', description: 'An enhanced version of the classic Brick Breaker game.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/games/1' },
  { id: 45, name: 'games/3', title: 'Enhanced Brick Breaker Game', description: 'Another variation of the Brick Breaker game.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/games/3' },
  { id: 46, name: 'games/4', title: 'Classic Tetris Game', description: 'Play the classic Tetris game powered by AI.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/games/4' },
  { id: 47, name: 'games/2', title: 'Enhanced Brick Breaker Game', description: 'Advanced levels for the Brick Breaker game.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/games/2' },
  { id: 48, name: 'veca', title: 'VECA - Vermont Education Contact Aggregator', description: 'Aggregate and analyse education contact data.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/veca' },
  { id: 49, name: 'youtube', title: 'YouTube Description Genie', description: 'Extract insights and trends from YouTube video data.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/youtube' },
  { id: 50, name: 'dmcd', title: 'dmcdAI', description: 'Advanced AI tools for DMCD applications.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/dmcd' },
  { id: 51, name: 'present', title: '14-Day Sprint Daily Standup - AUCDT', description: 'Manage your daily standups and sprints efficiently.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/present' },
  { id: 52, name: 'mailer', title: 'Deployment Guide: Python Email Sender App', description: 'Smart email composition, summarisation, and scheduling.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/mailer' },
  { id: 53, name: 'prions', title: 'Infographic: The Genetic Revolution in Prion Disease Research', description: 'A tool for analysing data related to prion disease studies.', category: Category.Research, url: 'https://ai-tools.techbridge.edu.gh/prions' },
  { id: 54, name: 'math', title: 'AUCDT Examination Portal', description: 'Solve complex mathematical problems with step-by-step solutions.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/math', imageUrl: 'https://placehold.co/600x400/FEF3C7/92400E/png?text=Math+Solver' },
  { id: 55, name: 'standup', title: 'AI Stand-up & Workshop Prep', description: 'Prepare for workshops and stand-ups with AI assistance.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/standup' },
  { id: 56, name: 'iam', title: 'AUCDT IAM System', description: 'Identity and Access Management system.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/iam' },
  { id: 57, name: 'md2latex', title: 'AUCDT | Markdown to LuaLaTeX Converter', description: 'Convert your Markdown documents into professional LaTeX format.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/md2latex' },
  { id: 58, name: 'enactus', title: 'Enactus CKT-UTAS – Student Social Entrepreneurship', description: 'Platform for student social entrepreneurship projects.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/enactus' },
  { id: 59, name: 'pde', title: 'Modern Product Development Lifecycle', description: 'Manage the product development lifecycle with AI.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/pde' },
  { id: 60, name: 'doculatex', title: 'DocuLaTeX | PDF, MD, HTML to LaTeX Converter', description: 'Convert various document formats to LaTeX.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/doculatex' },
  { id: 61, name: 'pdf-extractor', title: 'PDF Email Extractor', description: 'Pull text, tables, and images from PDF files effortlessly.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/pdf-extractor' },
  { id: 62, name: 'sdf', title: 'Strategic Development Framework', description: 'Framework for strategic development and planning.', category: Category.Research, url: 'https://ai-tools.techbridge.edu.gh/sdf' },
  { id: 63, name: 'nobleai', title: 'Ghana Home Design AI Assistant', description: 'AI assistant for home design and architecture.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/nobleai' },
  { id: 64, name: 'smartpresent', title: 'SmartScale Presenter', description: 'Advanced presentation tool for professionals.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/smartpresent' },
  { id: 65, name: 'drive-revenue', title: 'Unlock Your Potential: The 15-Minute AI Agent Masterclass', description: 'Analyse market trends to uncover revenue growth opportunities.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/drive-revenue' },
  { id: 66, name: 'training-evaluator', title: 'Office Training Evaluation', description: 'Assess the effectiveness of training programmes with data analysis.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/training-evaluator' },
  { id: 67, name: 'script-generator', title: 'Dialogue Generation App', description: 'Generate scripts for presentations, videos, and podcasts.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/script-generator' },
  { id: 68, name: 'volt', title: 'Volt Virtual Card', description: 'Analyse and optimise energy consumption in power grids.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/volt' },
  { id: 69, name: 'biochem', title: 'BioChemAI Teaching Aid', description: 'AI tool for teaching biochemistry concepts.', category: Category.Education, url: 'https://ai-tools.techbridge.edu.gh/biochem' },
  { id: 70, name: 'genai', title: 'AUCDT GENAI Application Directory', description: 'Create stunning images, text, and music with generative models.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/genai' },
  { id: 71, name: 'lyrics', title: 'Patois Lyricist - Reggae Lyric Generator', description: 'Compose creative and original song lyrics in various styles.', category: Category.Development, url: 'https://ai-tools.techbridge.edu.gh/lyrics' },
  { id: 72, name: 'omniextract', title: 'OmniExtract - PDF Data Extractor', description: 'Extract structured data from unstructured documents and images.', category: Category.Analysis, url: 'https://ai-tools.techbridge.edu.gh/omniextract' },
];
```

### FILE: contexts/AuthContext.tsx
```typescript
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

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
const STORAGE_KEY = 'techbridge_ai_application_portal_user';

const getStoredUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as User;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredUser());

  const login = async (userOrUsername: User | string, password?: string) => {
    if (typeof userOrUsername === 'object') {
      setIsAuthenticated(true);
      setUser(userOrUsername);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userOrUsername));
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      }
      return { success: data.success, message: data.message };
    } catch {
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      }
      return { success: data.success, message: data.message };
    } catch {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
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
# techbridge-ai-application-portal

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
# TechBridge AI Application Portal Deployment Script
param(
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/",
    [switch]$Build = $false
)

Write-Host "=== TECHBRIDGE AI APPLICATION PORTAL DEPLOYMENT ===" -ForegroundColor Cyan
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
bash -c "cd 'C:\Development\github\aucdt-utilities\techbridge-ai-application-portal' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /techbridge-ai-application-portal/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /techbridge-ai-application-portal/index.html [QSA,L]
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal`n"



```

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder
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

### FILE: docs/guides/admin_guide.md
```md
# Techbridge AI Portal - Administrator Guide

**Version 3.0**

## 1. Introduction

This guide provides administrators with all necessary information to manage and maintain the Techbridge AI Application Portal. It covers accessing the admin section, understanding its features, and performing routine checks.

## 2. Accessing the Admin Section

1.  Navigate to the main portal URL.
2.  In the top-right corner of the header, click the "Admin" link.
3.  You will be presented with a secure login modal.

## 3. Admin Authentication

-   **Password:** The default password is `Techbridge_Admin_2024!`.
-   **IMPORTANT:** This password is hardcoded in the application's source code (`App.tsx`). For security, it is **highly recommended** to change this value before deploying the application to a live environment.
-   **Login/Logout:** A successful login grants access to the full-page Admin Dashboard. All login attempts are recorded in the Audit Log. To exit the admin area, click the "Logout" button on the dashboard.

## 4. Admin Dashboard Features

The Admin Dashboard is organized into two main tabs: "Audit Log" and "Playwright Self-Test".

### 4.1. Audit Log Tab

This tab provides a chronological, reverse-sorted list of important administrative actions performed within the application.

-   **Purpose:** To monitor security and administrative activity.
-   **Logged Actions Include:**
    -   Admin access attempts.
    -   Successful and failed admin logins.
    -   Admin logouts.
    -   Initiation and completion of the self-test suite.
-   **Reading Logs:** Each entry includes a precise timestamp and a description of the event. The log persists between sessions.

### 4.2. Playwright Self-Test Tab

This tab contains an in-browser automated testing suite that simulates user actions to verify the portal's core functionality.

-   **Purpose:** To quickly verify that the application is working correctly after any changes or to perform routine health checks.
-   **How to Run Tests:**
    1.  Click the "Playwright Self-Test" tab.
    2.  Click the "Run Playwright Tests" button. A spinner inside the button will indicate that tests are in progress.
    3.  Test results will appear in real-time.
-   **Interpreting Results:**
    -   **PASS:** The test completed successfully.
    -   **FAIL:** The test encountered an error. The result will display an error message and a full-page screenshot of the application at the exact moment of failure for easy debugging.
```

### FILE: docs/guides/deployment_guide.md
```md
# Techbridge AI Portal - Deployment Guide

**Version 3.0**

## 1. Introduction

This guide details the process for deploying the Techbridge AI Portal. As a static, client-side React application, it can be hosted on any modern static web hosting provider.

## 2. Prerequisites

-   Access to a static web hosting provider (e.g., Netlify, Vercel, AWS S3, GitHub Pages).

## 3. Pre-Deployment Configuration

### 3.1. Set the Admin Password
Before deploying, it is **highly recommended** to change the default admin password. Open the `App.tsx` file and change the `ADMIN_PASSWORD` constant to a new, strong, and unique password.

```typescript
// in App.tsx
const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]
```

## 4. Build Process

The current application runs directly from source files without a formal build step. For a production deployment, all `.ts`, `.tsx`, `.html`, and other asset files in the project root should be uploaded to the hosting provider.

For a more optimized deployment, you would typically use a build tool like Vite or Create React App to compile, bundle, and minify the assets. If such a tool were added, the process would be:

1.  **Install Dependencies:** `npm install`
2.  **Build the Application:** `npm run build`
3.  This command would create a `dist` directory containing the optimized static files.

## 5. Deployment

Deploy the contents of the project's root directory (or the `dist` folder if a build step is added) to your chosen static hosting provider.

-   **Using a Drag-and-Drop Service (Netlify, Vercel):**
    1.  Log in to your provider's dashboard.
    2.  Drag the project folder into the deployment area.
    3.  The provider will automatically upload the files and provide you with a live URL.

-   **Using a Web Server (Nginx, Apache):**
    1.  Copy the project files to the webroot directory of your server (e.g., `/var/www/html`).
    2.  Ensure your web server is configured to serve `index.html` as the default file for the directory. For SPAs, you must configure URL rewriting to direct all routes to `index.html` so that client-side routing works correctly.
```

### FILE: docs/guides/testing_guide.md
```md
# Techbridge AI Portal - Testing Guide

**Version 3.0**

## 1. Introduction

This guide outlines the testing procedures for the Techbridge AI Portal, covering both automated and manual testing strategies to ensure application quality, functionality, and usability.

## 2. Automated Testing (Playwright Self-Test)

The primary method for automated testing is the built-in self-test suite available in the Admin Dashboard. This provides a quick and reliable way to perform regression testing on critical features.

### 2.1. Access and Execution
1.  Log in to the Admin Dashboard.
2.  Navigate to the "Playwright Self-Test" tab.
3.  Click "Run Playwright Tests" to execute the entire suite.

### 2.2. Scope of Tests
The suite covers the following critical user journeys as defined in `tests/selfTests.ts`:
-   **Initial Load:** Verifies that the initial page of application cards is rendered correctly.
-   **Search Functionality:** Tests filtering by a specific search term.
-   **Category Filtering:** Ensures category buttons work correctly.
-   **Error States:** Confirms the "No applications found" message is displayed correctly.
-   **Theme Switching:** Validates that changing themes applies the correct CSS styles.

### 2.3. Reviewing Results
-   Monitor the real-time results as they appear.
-   For any **FAIL** status, analyze the **Error Message** and the accompanying **Failure Screenshot** to identify the root cause of the issue.

## 3. Manual Testing

Manual testing is essential to cover usability, cross-browser compatibility, and visual aspects not covered by the automated suite.

### 3.1. Functional Testing Checklist

-   [ ] **Search:**
    -   [ ] Test with various keywords (single word, multiple words).
    -   [ ] Test with keywords that match titles and descriptions.
    -   [ ] Test with no results and verify the "No applications found" message.
-   [ ] **Filtering:** Click each category filter and verify the correct apps are shown.
-   [ ] **App Cards:**
    -   [ ] Hover over a card to verify animations and tooltips.
    -   [ ] Verify image loading indicators (shimmer) appear and are replaced by the image or SVG fallback on error.
    -   [ ] Click "Launch App" and verify the correct URL opens in a new tab.
-   [ ] **Admin Panel:**
    -   [ ] Test login with correct and incorrect passwords.
    -   [ ] Verify the audit logs are created correctly for admin actions.
    -   [ ] Run the self-test and verify the loading spinner appears and results are displayed.

### 3.2. UI & Responsiveness Testing

-   [ ] **Desktop, Tablet, Mobile:** Check the layout on various viewports. Ensure all components are responsive and usable.

### 3.3. Accessibility Testing

-   [ ] **Keyboard Navigation:**
    -   [ ] Navigate the entire site using **Tab**. Ensure all interactive elements are focusable and operable.
    -   [ ] Verify the "Skip to main content" link works correctly.
-   [ ] **Screen Reader:**
    -   [ ] Use a screen reader to verify that search results are announced and interactive elements have proper labels.
-   [- ] **High-Contrast Theme:**
    -   [ ] Switch to the high-contrast theme and ensure all text is legible and UI elements are clearly distinguishable.
```

### FILE: docs/README.md
```md
# Techbridge AI Portal Documentation

This directory contains the complete documentation for the Techbridge AI Application Portal project.

## Contents

- **/srs.md**: The complete and final Software Requirements Specification (SRS) document, detailing all functional and non-functional requirements. This document includes embedded architecture diagrams.

- **/diagrams/**: Standalone versions of all system diagrams in SVG format.
  - `system_architecture.svg`: Illustrates the client-side SPA architecture.
  - `data_architecture.svg`: Visualizes the data structure within the browser's Local Storage.

- **/guides/**: Comprehensive user and maintenance guides.
  - `admin_guide.md`: A complete manual for administrators on how to access and use the admin dashboard, view audit logs, and run self-tests.
  - `deployment_guide.md`: Step-by-step instructions for deploying the application to a production environment.
  - `testing_guide.md`: Instructions for performing automated and manual testing to ensure application quality.

```

### FILE: docs/srs.md
```md
# Software Requirements Specification: Techbridge AI Application Portal

**Version 5.0 (Final)**

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for the AUCDT AI Application Portal. It is intended for project stakeholders, developers, and designers to provide a complete understanding of the system.

### 1.2 Scope
The application is a client-side, web-based portal that serves as a centralized directory for 70+ AI-powered tools. It enables users to discover, search, and filter applications. It also includes a secure administrative section for system management, enhanced audit logging, and a self-testing framework.

### 1.3 Definitions
- **Techbridge**: Techbridge University College
- **SPA**: Single-Page Application
- **SRS**: Software Requirements Specification
- **ARIA**: Accessible Rich Internet Applications
- **SVG**: Scalable Vector Graphics

### 1.4 Overview
This SRS details the product perspective, functions, user characteristics, and specific requirements, covering functional, UI, performance, security, and accessibility aspects.

## 2. Overall Description

### 2.1 Product Perspective
The product is a standalone SPA built with React, TypeScript, and Tailwind CSS. It operates entirely on the client-side, using the browser's Local Storage for state persistence (theme preference, audit logs).

### 2.2 Product Functions
- Display a responsive, paginated grid of AI application cards.
- Provide real-time, text-based search functionality with interactive suggestions.
- Provide one-click category-based filtering.
- Provide user-selectable themes (Light, Dark, High-Contrast).
- Offer a secure, password-protected administrative dashboard via a modal login.
- Log key administrative and user actions for auditing purposes.
- Provide an integrated self-testing framework with screenshot capture for diagnostics.

### 2.3 User Characteristics
- **General Users**: Students, faculty, and researchers of Techbridge with standard web browsing proficiency.
- **Administrators**: Technical staff responsible for maintaining and verifying the application's integrity.

### 2.4 Constraints
- The application is entirely client-side; it has no backend server.
- The admin password and application list are statically defined in the source code.
- Requires a modern web browser with JavaScript and Local Storage enabled.

### 2.5 Assumptions
- Users have continuous internet connectivity for the initial load and for accessing external application URLs and images.

## 3. Specific Requirements

### 3.1 Functional Requirements (General User)
- **FR-1: Search & Suggestions**: 
    - `FR-1.1`: The system must provide a case-insensitive, real-time search input that filters applications by title and description.
    - `FR-1.2`: As a user types (minimum 2 characters), a dropdown shall appear with up to 5 relevant suggestions.
    - `FR-1.3`: A loading indicator shall be displayed within the dropdown while suggestions are being computed.
    - `FR-1.4`: Clicking a suggestion shall populate the search input with the selected term.
- **FR-2: Category Filters**: The system must provide filter buttons for each application category and an "All Apps" option, displaying an item count for each.
- **FR-3: Application Grid**: The system shall display the filtered applications in a responsive grid. A "No applications found" message must be shown if filters yield no results.
- **FR-4: Pagination**: 
    - `FR-4.1`: The application grid shall be paginated, displaying a maximum of 12 applications per page.
    - `FR-4.2`: Navigation controls ("Previous", "Next", and a "Page X of Y" indicator) shall be present to browse pages.
    - `FR-4.3`: When a search or category filter is applied or changed, the view must automatically reset to the first page of the results.
- **FR-5: Application Card**: Each card shall display an image preview, category icon, title, badge, and a truncated description.
- **FR-6: Card Interactivity**: On hover, a card shall animate, its full description shall become visible, and a tooltip with details shall appear.
- **FR-7: Image Loading & Fallback**:
    - `FR-7.1`: While a pre-defined `imageUrl` is loading, a shimmering skeleton loader shall be displayed.
    - `FR-7.2`: If a pre-defined image URL fails to load or is not provided, the system shall display a locally generated SVG placeholder, themed to the application's category.
- **FR-8: Theming**: Users shall be able to select and apply one of three themes: Light, Dark, or High-Contrast. The preference must be saved to Local Storage.

### 3.2 Functional Requirements (Administrator)
- **FR-9: Admin Access**: An "Admin" link in the header shall open a modal login dialog.
- **FR-10: Secure Authentication**: Access to the admin dashboard shall be granted only upon entering the correct, pre-configured password.
- **FR-11: Enhanced Audit Logging**: The system shall automatically record the following events to Local Storage with a timestamp:
    - `FR-11.1`: Admin access attempts, successful/failed logins, and logouts.
    - `FR-11.2`: Initiation and completion of the self-test suite.
    - `FR-11.3`: User theme changes.
    - `FR-11.4`: User search queries (debounced to avoid excessive logging).
    - `FR-11.5`: User category filter selections.
- **FR-12: Audit Log Viewer**: The admin dashboard shall display all audit logs in a reverse chronological list.
- **FR-13: Self-Testing Framework**: The admin dashboard shall provide an interface to run an automated, in-browser test suite. A loading spinner shall be displayed during execution.
- **FR-14: Test Diagnostics**: For any failed test, the system must display an error message and a full-page screenshot of the application state.

### 3.3 User Interface & Accessibility Requirements
- **UI-1: Responsiveness**: The UI must be fully responsive across all standard device viewports.
- **A11Y-1: Keyboard Navigation**: All interactive elements must be navigable and operable using only a keyboard.
- **A11Y-2: Skip Link**: A "Skip to Main Content" link must be the first focusable element.
- **A11Y-3: ARIA**: The system shall use appropriate ARIA attributes for dynamic regions, modals, and controls.
- **A11Y-4: High Contrast**: The High-Contrast theme must ensure text-to-background contrast ratios meet WCAG standards.

## 4. System Architecture

The application is a client-side Single-Page Application (SPA). All logic, data, and rendering occur within the user's web browser. Local Storage is used for persistence of user preferences and administrative data.

<svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif" font-size="14px">
    <title>Techbridge AI Portal System Architecture</title>
    <style>
        .box { fill: #f0f4f8; stroke: #4a5568; stroke-width: 1.5; rx: 8; }
        .box-title { font-weight: bold; font-size: 16px; fill: #2d3748; }
        .component { fill: #ffffff; stroke: #cbd5e0; stroke-width: 1; rx: 4; }
        .component-text { fill: #4a5568; }
        .arrow { stroke: #718096; stroke-width: 2; marker-end: url(#arrowhead); }
        .arrow-label { fill: #718096; font-size: 12px; font-style: italic; }
        .user-icon { font-size: 48px; }
    </style>
    <defs>
        <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#718096" />
        </marker>
    </defs>
    <g transform="translate(50, 200)">
        <text text-anchor="middle" y="-10" class="box-title">User</text>
        <text text-anchor="middle" y="30" class="user-icon">👤</text>
    </g>
    <rect x="200" y="80" width="200" height="340" class="box"/>
    <text x="300" y="110" text-anchor="middle" class="box-title">Web Browser</text>
    <rect x="220" y="140" width="160" height="260" class="component"/>
    <text x="300" y="165" text-anchor="middle" class="component-text" font-weight="bold">React SPA</text>
    <line x1="230" y1="175" x2="370" y2="175" stroke="#cbd5e0"/>
    <text x="230" y="200" class="component-text">• App.tsx (State)</text>
    <text x="230" y="225" class="component-text">• Header</text>
    <text x="230" y="250" class="component-text">• SearchBar</text>
    <text x="230" y="275" class="component-text">• CategoryFilters</text>
    <text x="230" y="300" class="component-text">• AppGrid</text>
    <text x="230" y="325" class="component-text">• AdminDashboard</text>
    <text x="230" y="350" class="component-text">• selfTests.ts</text>
    <text x="230" y="375" class="component-text">• ...other components</text>
    <g transform="translate(520, 190)">
      <rect x="0" y="0" width="220" height="120" class="box"/>
      <text x="110" y="30" text-anchor="middle" class="box-title">Browser Local Storage</text>
      <path d="M 20 50 H 200 M 20 85 H 200" stroke="#cbd5e0" />
      <text x="30" y="70" class="component-text">🔑 techbridge_theme</text>
      <text x="30" y="105" class="component-text">🔑 techbridge_auditLog</text>
    </g>
    <path class="arrow" d="M 120 225 H 200" />
    <text x="135" y="215" class="arrow-label">Interacts</text>
    <path class="arrow" d="M 400 250 C 450 250, 470 250, 520 250" />
    <text x="410" y="240" class="arrow-label">Reads/Writes</text>
</svg>

## 5. Data Architecture

The application utilizes the browser's key-value `localStorage` store as its database for persisting non-critical data. All other application data (the list of AI tools) is static and compiled into the application at build time.

<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif" font-size="14px">
    <title>Techbridge AI Portal Data Architecture (Local Storage)</title>
    <style>
        .title { font-weight: bold; font-size: 20px; fill: #2d3748; }
        .table { fill: #ffffff; stroke: #4a5568; stroke-width: 1.5; }
        .table-header { fill: #edf2f7; stroke: #4a5568; font-weight: bold; }
        .table-text { fill: #4a5568; }
        .col-type { fill: #718096; font-style: italic; }
        .note { font-size: 11px; fill: #718096; }
    </style>
    <text x="400" y="40" text-anchor="middle" class="title">Local Storage Data Architecture (Key-Value Store)</text>
    <g transform="translate(50, 100)">
        <rect class="table" x="0" y="0" width="300" height="120" rx="5"/>
        <rect class="table-header" x="0" y="0" width="300" height="40" rx="5"/>
        <text class="table-text" x="150" y="25" text-anchor="middle" font-weight="bold">techbridge_theme</text>
        <line x1="1" y1="80" x2="299" y2="80" stroke="#cbd5e0"/>
        <text class="table-text" x="15" y="65">key</text>
        <text class="col-type" x="290" y="65" text-anchor="end">string</text>
        <text class="table-text" x="15" y="105" font-style="italic">Example: 'dark'</text>
    </g>
    <g transform="translate(450, 100)">
        <rect class="table" x="0" y="0" width="300" height="200" rx="5"/>
        <rect class="table-header" x="0" y="0" width="300" height="40" rx="5"/>
        <text class="table-text" x="150" y="25" text-anchor="middle" font-weight="bold">techbridge_auditLog</text>
        <text class="table-text" x="150" y="55" text-anchor="middle">(Stored as a JSON string)</text>
        <line x1="1" y1="80" x2="299" y2="80" stroke="#cbd5e0"/>
        <text class="table-text" x="15" y="105">timestamp</text>
        <text class="col-type" x="290" y="105" text-anchor="end">ISOString</text>
        <line x1="1" y1="120" x2="299" y2="120" stroke="#cbd5e0"/>
        <text class="table-text" x="15" y="145">action</text>
        <text class="col-type" x="290" y="145" text-anchor="end">string</text>
        <line x1="1" y1="160" x2="299" y2="160" stroke="#cbd5e0"/>
        <text class="note" x="150" y="180" text-anchor="middle">Stores admin and user interaction events</text>
    </g>
</svg>
```

### FILE: eslint.config.js
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)

```

### FILE: index.css
```css
@import "tailwindcss";

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Default Theme (Dark/Prestige) */
  --color-brand-gold: #C8A84B;
  --color-brand-gold-light: #E8C96A;
  --color-brand-gold-pale: #F5E6B8;
  --color-brand-ink: #0F0C07;
  --color-brand-cream: #F2EBD9;
  --color-brand-paper: #141210;
  
  /* Legacy vars - keeping for safety but should migrate */
  --color-background: var(--color-brand-ink);
  --color-text: var(--color-brand-cream);
  --color-primary: var(--color-brand-gold);
}

[data-theme='light'] {
  --color-brand-gold: #A0863C; /* Darker gold for contrast on light */
  --color-brand-gold-light: #C8A84B;
  --color-brand-gold-pale: #E8C96A;
  --color-brand-ink: #F9F7F2; /* Light cream background */
  --color-brand-cream: #1A1814; /* Dark text */
  --color-brand-paper: #FFFFFF;
}

[data-theme='high-contrast'] {
  --color-brand-gold: #FFFF00; /* Pure Yellow */
  --color-brand-gold-light: #000000; /* Black text on yellow */
  --color-brand-gold-pale: #FFFFFF; /* White */
  --color-brand-ink: #000000; /* Pure Black */
  --color-brand-cream: #FFFFFF; /* Pure White */
  --color-brand-paper: #000000; /* Pure Black */
}

body {
  background-color: var(--color-brand-ink);
  color: var(--color-brand-cream);
  font-family: 'Cormorant Garamond', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
}

.font-bebas {
  font-family: 'Bebas Neue', sans-serif;
}

.font-dm-sans {
  font-family: 'DM Sans', sans-serif;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
}

::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-hover);
}

/* Animations */
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-down {
  animation: fadeDown 0.8s ease forwards;
}

.animate-fade-up {
  animation: fadeUp 0.8s ease forwards;
}

.delay-200 { animation-delay: 0.2s; }
.delay-350 { animation-delay: 0.35s; }
.delay-400 { animation-delay: 0.4s; }
.delay-600 { animation-delay: 0.6s; }

/* Grain Overlay */
.grain-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
}

```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB" data-theme="light">
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
    <meta property="og:title" content="Techbridge AI Application Portal" />
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
    <meta name="twitter:title" content="Techbridge AI Application Portal" />
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
    <title>Techbridge AI Application Portal</title>
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:wght@400;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --color-background: #FDFBF6;
        --color-text: #4A2F2F;
        --color-text-muted: #6b7280;
        --color-accent: #D4AF37;
        --color-primary: #006400;
        --color-primary-hover: #008000;
        --color-card-bg: #FFFFFF;
        --color-card-footer-bg: #f9fafb;
        --color-card-border: #e5e7eb;
        --color-header-bg-from: #4A2F2F;
        --color-header-bg-to: #5a3f3f;
        --color-header-text: #FFFFFF;
        --color-header-text-muted: #d1d5db;
        --color-tooltip-bg: #4A2F2F;
        --color-tooltip-text: #FFFFFF;
        --color-input-bg: #FFFFFF;
        --color-input-border: #d1d5db;
        --color-input-text: #4A2F2F;
        --color-input-placeholder: #6b7280;
        --color-badge-research-bg: #DBEAFE;
        --color-badge-research-text: #1E40AF;
        --color-badge-development-bg: #EEDCFF;
        --color-badge-development-text: #5B21B6;
        --color-badge-analysis-bg: #D1FAE5;
        --color-badge-analysis-text: #065F46;
        --color-badge-education-bg: #FEF3C7;
        --color-badge-education-text: #92400E;
      }
      [data-theme="dark"] {
        --color-background: #111827;
        --color-text: #F9FAFB;
        --color-text-muted: #9ca3af;
        --color-accent: #D4AF37;
        --color-primary: #22c55e;
        --color-primary-hover: #16a34a;
        --color-card-bg: #1f2937;
        --color-card-footer-bg: #374151;
        --color-card-border: #4b5563;
        --color-header-bg-from: #1f2937;
        --color-header-bg-to: #111827;
        --color-header-text: #FFFFFF;
        --color-header-text-muted: #9ca3af;
        --color-tooltip-bg: #e5e7eb;
        --color-tooltip-text: #111827;
        --color-input-bg: #374151;
        --color-input-border: #6b7280;
        --color-input-text: #F9FAFB;
        --color-input-placeholder: #9ca3af;
      }
      [data-theme="high-contrast"] {
        --color-background: #000000;
        --color-text: #FFFFFF;
        --color-text-muted: #FFFFFF;
        --color-accent: #FFFF00;
        --color-primary: #005BFF;
        --color-primary-hover: #337dff;
        --color-card-bg: #000000;
        --color-card-footer-bg: #000000;
        --color-card-border: #FFFFFF;
        --color-header-bg-from: #000000;
        --color-header-bg-to: #000000;
        --color-header-text: #FFFFFF;
        --color-header-text-muted: #FFFFFF;
        --color-tooltip-bg: #FFFFFF;
        --color-tooltip-text: #000000;
        --color-input-bg: #000000;
        --color-input-border: #FFFFFF;
        --color-input-text: #FFFFFF;
        --color-input-placeholder: #FFFFFF;
        --color-badge-research-bg: #000000;
        --color-badge-research-text: #FFFF00;
        --color-badge-development-bg: #000000;
        --color-badge-development-text: #FFFF00;
        --color-badge-analysis-bg: #000000;
        --color-badge-analysis-text: #FFFF00;
        --color-badge-education-bg: #000000;
        --color-badge-education-text: #FFFF00;
      }
      [data-theme="gold-luxury"] {
        --color-background: #F5F0E8;
        --color-text: #3D2817;
        --color-text-muted: #5C4033;
        --color-accent: #D4AF37;
        --color-primary: #D4AF37;
        --color-primary-hover: #C9A84B;
        --color-card-bg: #FFFBF5;
        --color-card-footer-bg: #F0E8DC;
        --color-card-border: #D4AF37;
        --color-header-bg-from: #3D2817;
        --color-header-bg-to: #5C4033;
        --color-header-text: #FFFBF5;
        --color-header-text-muted: #D4AF37;
        --color-tooltip-bg: #3D2817;
        --color-tooltip-text: #FFFBF5;
        --color-input-bg: #FFFBF5;
        --color-input-border: #D4AF37;
        --color-input-text: #3D2817;
        --color-input-placeholder: #5C4033;
        --color-badge-research-bg: #F0E8DC;
        --color-badge-research-text: #3D2817;
        --color-badge-development-bg: #F0E8DC;
        --color-badge-development-text: #3D2817;
        --color-badge-analysis-bg: #F0E8DC;
        --color-badge-analysis-text: #3D2817;
        --color-badge-education-bg: #F0E8DC;
        --color-badge-education-text: #3D2817;
      }
      html {
        scroll-behavior: smooth;
      }
      body {
        font-family: var(--font-family, 'Inter'), sans-serif;
        background-color: var(--color-background);
        color: var(--color-text);
        transition: background-color 0.3s, color 0.3s;
      }
      [data-theme="gold-luxury"] body {
        font-family: 'Lora', serif;
      }
      .shimmer::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0,
          rgba(255, 255, 255, 0.2) 20%,
          rgba(255, 255, 255, 0.5) 60%,
          rgba(255, 255, 255, 0)
        );
        animation: shimmer 1.5s infinite;
      }
      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
      }
    </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script type="importmap">
{
  "imports": {
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.22.0"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body>
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-[var(--color-header-bg-from)] focus:rounded-md focus:font-semibold">Skip to main content</a>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

### FILE: index.tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
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
  "name": "Techbridge AI Application Portal",
  "description": "A web-based application directory that provides a centralised access point to 70+ AI-powered applications and tools for students, faculty, and researchers at Techbridge University College (formerly AsanSka University College of Design and Technology).",
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
  "name": "techbridge-ai-application-portal",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "@google/genai": "^1.22.0",
    "autoprefixer": "^10.4.27",
    "lucide-react": "^0.577.0",
    "postcss": "^8.5.8",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "tailwindcss": "^4.2.1"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@tailwindcss/postcss": "^4.2.1",
    "@tailwindcss/vite": "^4.2.2",
    "@types/node": "^22.14.0",
    "@typescript-eslint/eslint-plugin": "^8.56.1",
    "@typescript-eslint/parser": "^8.56.1",
    "@vitejs/plugin-react": "^5.0.0",
    "eslint": "^9.39.4",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "typescript": "~5.8.2",
    "typescript-eslint": "^8.56.1",
    "vite": "^6.2.0"
  }
}

```

### FILE: postcss.config.js
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/15b396f1-a2fe-4d69-88e1-a83fbb1ce39b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: services/auditService.ts
```typescript
export interface AuditLog {
    timestamp: string;
    action: string;
}

export const getAuditLogs = (): AuditLog[] => {
    try {
        const logs = localStorage.getItem('techbridge_auditLog');
        return logs ? JSON.parse(logs) : [];
    } catch (error) {
        console.error("Failed to parse audit logs:", error);
        return [];
    }
};

export const logAction = (action: string) => {
    const logs = getAuditLogs();
    const newLog = { timestamp: new Date().toISOString(), action };
    logs.push(newLog);
    localStorage.setItem('techbridge_auditLog', JSON.stringify(logs));
};

```

### FILE: tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gold': 'var(--color-brand-gold)',
        'brand-gold-light': 'var(--color-brand-gold-light)',
        'brand-gold-pale': 'var(--color-brand-gold-pale)',
        'brand-ink': 'var(--color-brand-ink)',
        'brand-cream': 'var(--color-brand-cream)',
        'brand-paper': 'var(--color-brand-paper)',
        'brand-card-bg': 'var(--color-brand-paper)', // Alias for backward compat
        'brand-input-bg': 'var(--color-brand-paper)', // Alias
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'bebas': ['"Bebas Neue"', 'sans-serif'],
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'dm-sans': ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}

```

### FILE: tests/selfTests.ts
```typescript
import { TestResult } from '../types';

// Helper to capture a screenshot of the body
const captureScreenshot = async (): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(window as any).html2canvas) {
    console.error('html2canvas is not loaded');
    return 'html2canvas script not found.';
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvas = await (window as any).html2canvas(document.body, {
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
        useCORS: true,
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Screenshot failed:', error);
    return 'Failed to capture screenshot.';
  }
};

// Simple assertion helper
const expect = (value: unknown) => ({
  toBe: (expected: unknown) => {
    if (value !== expected) {
      throw new Error(`Expected ${JSON.stringify(value)} to be ${JSON.stringify(expected)}`);
    }
  },
  toContain: (substring: string) => {
    if (typeof value !== 'string' || !value.includes(substring)) {
        throw new Error(`Expected "${value}" to contain "${substring}"`);
    }
  },
});

// Helper to wait for re-renders
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Test Definitions
const testSuite: { description: string; testFn: () => Promise<void> }[] = [
  {
    description: 'Initial page should load and render all applications',
    testFn: async () => {
      await wait(500); // Wait for initial animation
      const appCards = document.querySelectorAll('.group.relative');
      expect(appCards.length).toBe(12);
      const header = document.querySelector('header');
      if (!header) throw new Error('Header not found');
      expect(header.textContent).toContain('TechBridge');
    }
  },
  {
    description: 'Should filter applications by search term "agent"',
    testFn: async () => {
      const searchInput = document.getElementById('search') as HTMLInputElement;
      if (!searchInput) throw new Error('Search input not found');
      
      searchInput.value = 'agent';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(300);
      
      const appCards = document.querySelectorAll('.group.relative');
      expect(appCards.length).toBe(1);
      const cardTitle = appCards[0].querySelector('h3');
      expect(cardTitle?.textContent).toBe('Agent-Led Software Development');
      
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(300);
    }
  },
  {
    description: 'Should filter applications by "Research" category',
    testFn: async () => {
      const categoryButtons = Array.from(document.querySelectorAll('button[aria-label^="Filter by"]'));
      const researchButton = categoryButtons.find(btn => btn.textContent?.includes('Research')) as HTMLButtonElement;
      if (!researchButton) throw new Error('Research filter button not found');
      
      researchButton.click();
      await wait(300);
      
      const appCards = document.querySelectorAll('.group.relative');
      expect(appCards.length).toBe(7);
      const allBadgesAreResearch = Array.from(appCards).every(card => card.textContent?.includes('Research'));
      expect(allBadgesAreResearch).toBe(true);

      const allAppsButton = categoryButtons.find(btn => btn.textContent?.includes('All Apps')) as HTMLButtonElement;
      if (!allAppsButton) throw new Error('All Apps button not found for cleanup');
      allAppsButton.click();
      await wait(300);
    }
  },
  {
    description: 'Should show "No applications found" message for invalid search',
    testFn: async () => {
      const searchInput = document.getElementById('search') as HTMLInputElement;
      if (!searchInput) throw new Error('Search input not found');

      searchInput.value = 'xyz-nonexistent-app-xyz';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(300);

      const noAppsMessage = document.querySelector('.text-center.py-24');
      if (!noAppsMessage) throw new Error('"No applications found" message container not found');
      expect(noAppsMessage.textContent).toContain('No applications found');

      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(300);
    }
  },
  {
    description: 'Should switch theme to Dark mode and verify style change',
    testFn: async () => {
      const themeButtons = Array.from(document.querySelectorAll('button[aria-label^="Switch to"]'));
      const darkButton = themeButtons.find(btn => btn.getAttribute('aria-label')?.includes('dark')) as HTMLButtonElement;
      if (!darkButton) throw new Error('Dark theme button not found');

      darkButton.click();
      await wait(300);
      
      const htmlElement = document.documentElement;
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
      
      const bodyColor = getComputedStyle(document.body).backgroundColor;
      // rgb(15, 12, 7) is the RGB equivalent of brand-ink / #0F0C07
      expect(bodyColor).toBe('rgb(15, 12, 7)');

      const lightButton = themeButtons.find(btn => btn.getAttribute('aria-label')?.includes('light')) as HTMLButtonElement;
       if (!lightButton) throw new Error('Light theme button not found for cleanup');
      lightButton.click();
      await wait(300);
    }
  }
];

export const runSelfTests = async (onProgress: (result: TestResult) => void) => {
  for (const test of testSuite) {
    const result: TestResult = { description: test.description, status: 'FAIL' };
    try {
      await test.testFn();
      result.status = 'PASS';
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.error = error.message;
      } else {
        result.error = String(error);
      }
      result.screenshot = await captureScreenshot();
    }
    onProgress(result);
    await wait(200); // Small delay between tests for visual feedback
  }
};

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
export enum Category {
  Research = 'Research',
  Development = 'Development',
  Analysis = 'Analysis',
  Education = 'Education',
}

export interface TestResult {
    description: string;
    status: 'PASS' | 'FAIL';
    error?: string;
    screenshot?: string;
}


export interface AppItem {
  id: number;
  name: string;
  title: string;
  description: string;
  category: Category;
  url: string;
  imageUrl?: string;
}

export type Theme = 'light' | 'dark' | 'high-contrast';
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
      base: './',
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

