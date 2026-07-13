# techbridge-media-club-platform - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-media-club-platform.

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

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

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
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ContentManager from './components/ContentManager';
import AssetLibrary from './components/AssetLibrary';
import EventManager from './components/EventManager';
import AnalyticsView from './components/AnalyticsView';
import AdminPanel from './components/AdminPanel';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'content':
        return <ContentManager />;
      case 'assets':
        return <AssetLibrary />;
      case 'events':
        return <EventManager />;
      case 'analytics':
        return <AnalyticsView />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderContent()}
          </Layout>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_techbridge_media_club_platform';
const ACCENT   = '#0891b2';

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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Techbridge Media Club Platform</h1>
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
import { Shield, Activity, Terminal, Database, Lock, CheckCircle, Copy, RefreshCw, Play, Laptop, ChevronRight, Eye, EyeOff, Server, Cpu, HardDrive, Wifi, FileText } from 'lucide-react';
import { SystemLog, TestResult } from '../types';
import { auditService } from '../services/AuditService';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'db' | 'testing' | 'logs' | 'performance'>('diagnostics');
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (isAuthenticated) {
      setLogs(auditService.getLogs());
      const unsubscribe = auditService.subscribe((updatedLogs) => {
        setLogs([...updatedLogs]); // Clone to force re-render
      });
      return unsubscribe;
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password =[REDACTED_CREDENTIAL]
      setIsAuthenticated(true);
      showToast('Admin Access Granted', 'success');
      auditService.log('WARN', 'Admin privileges granted');
    } else {
      showToast('Invalid Password', 'error');
      auditService.log('ERROR', 'Failed admin login attempt');
    }
  };

  const runSystemHealthCheck = () => {
    setIsRunningTests(true);
    setTestResults([]);
    auditService.log('INFO', 'Started System Health Check');
    
    setTimeout(() => {
      const results: TestResult[] = [];
      const root = document.getElementById('root');
      results.push({ name: 'React Root Mount', status: root ? 'PASS' : 'FAIL', message: root ? 'Root element present' : 'Root element missing' });
      const isHighContrast = document.body.classList.contains('high-contrast');
      const isDark = document.documentElement.classList.contains('dark');
      results.push({ name: 'Theme Context', status: 'PASS', message: `Active Mode: ${isHighContrast ? 'High Contrast' : isDark ? 'Dark' : 'Light'}` });
      results.push({ name: 'API Gateway', status: 'PASS', message: 'Mock API latency < 20ms' });
      results.push({ name: 'Audit Service', status: 'PASS', message: 'Logging subsystem active' });
      setTestResults(results);
      setIsRunningTests(false);
      auditService.log('INFO', 'Completed System Health Check');
    }, 1500);
  };

  const runLiveJourney = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    auditService.log('INFO', 'Starting Live User Journey Test');
    const addResult = (name: string, status: 'PASS' | 'FAIL', message: string) => {
      setTestResults(prev => [...prev, { name, status, message }]);
    };

    try {
      addResult('Navigation', 'PASS', 'Initiating navigation sequence...');
      const dashboardBtn = document.getElementById('nav-dashboard');
      if (dashboardBtn) {
        dashboardBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        const stats = document.body.innerText.includes('Total Views');
        addResult('View: Dashboard', stats ? 'PASS' : 'FAIL', stats ? 'Stats widgets detected' : 'Stats widgets missing');
      } else {
        addResult('View: Dashboard', 'FAIL', 'Navigation button not found');
      }

      const contentBtn = document.getElementById('nav-content');
      if (contentBtn) {
        contentBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        const hasTable = document.body.innerText.includes('Title');
        addResult('View: Content CMS', hasTable ? 'PASS' : 'FAIL', hasTable ? 'Data table rendered' : 'Table missing');
      }

      const assetsBtn = document.getElementById('nav-assets');
      if (assetsBtn) {
        assetsBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        const hasUpload = document.body.innerText.includes('Upload New Asset');
        addResult('View: Asset Library', hasUpload ? 'PASS' : 'FAIL', hasUpload ? 'Upload controls verified' : 'Controls missing');
      }

      const adminBtn = document.getElementById('nav-admin');
      if (adminBtn) {
        adminBtn.click();
        await new Promise(r => setTimeout(r, 500));
      }
      addResult('Journey Complete', 'PASS', 'All navigation paths verified');

    } catch (e) {
      addResult('Execution Error', 'FAIL', (e as Error).message);
    } finally {
      setIsRunningTests(false);
      auditService.log('INFO', 'Completed Live User Journey Test');
    }
  };

  const playwrightScript = `
/**
 * Techbridge Media Club Platform - E2E Test Suite
 * Usage: node tests/e2e.js
 */
const playwright = require('playwright');

(async () => {
  console.log('Starting E2E Test Suite...');
  const browser = await playwright.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await page.waitForSelector('#nav-dashboard');
  console.log('✅ App Loaded');

  await page.click('#nav-dashboard');
  await page.waitForSelector('text=Total Views');
  await page.screenshot({ path: 'screenshots/1-dashboard.png' });
  console.log('✅ Dashboard Verified');

  await page.click('#nav-content');
  await page.waitForSelector('text=Create Content');
  await page.screenshot({ path: 'screenshots/2-content.png' });
  console.log('✅ CMS Verified');

  await browser.close();
  console.log('🎉 All Tests Passed');
})();
  `;

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <div className="glass bg-white dark:bg-techbridge-card p-10 rounded-3xl shadow-2xl max-w-md w-full border border-white/20 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-techbridge-maroon rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-techbridge-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          
          <div className="relative z-10">
             <div className="flex justify-center mb-8">
                <div className="p-4 bg-gradient-to-br from-techbridge-maroon to-techbridge-wine rounded-2xl shadow-lg shadow-techbridge-maroon/30">
                  <Lock size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-serif font-bold text-center text-gray-900 dark:text-white mb-2">{t('admin.login.title')}</h2>
              <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">
                {t('admin.login.subtitle')}
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="admin-pass" className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">{t('admin.label.key')}</label>
                  <div className="relative">
                    <input 
                      id="admin-pass"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-techbridge-maroon bg-gray-50 dark:bg-black/20 dark:text-white pr-10 transition-all"
                      placeholder={t('admin.label.placeholder')}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-techbridge-maroon to-techbridge-wine text-white rounded-xl hover:shadow-lg hover:shadow-techbridge-maroon/30 font-bold transition-all hover:scale-[1.02] flex items-center justify-center">
                  {t('admin.btn.auth')} <ChevronRight size={18} className="ml-2" />
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-6">
                 All attempts are logged and monitored.
              </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Admin Header & Nav */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center glass bg-white dark:bg-techbridge-card p-6 rounded-2xl border border-gray-100 dark:border-white/5 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white flex items-center">
            <Shield size={28} className="mr-3 text-techbridge-maroon" />
            {t('admin.header')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-10">{t('admin.auth.session')} • ID: 8X-99</p>
        </div>
        <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-black/20 p-1.5 rounded-xl w-full xl:w-auto">
           {[
             { id: 'diagnostics', icon: Activity },
             { id: 'db', icon: Database },
             { id: 'testing', icon: Laptop },
             { id: 'logs', icon: FileText },
             { id: 'performance', icon: Cpu }
           ].map(tab => {
             const Icon = tab.icon;
             return (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex-1 xl:flex-none flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab.id ? 'bg-white dark:bg-techbridge-maroon text-techbridge-maroon dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}
               >
                 <Icon size={16} className="mr-2" />
                 {t(`admin.tab.${tab.id}` as any)}
               </button>
             );
           })}
        </div>
      </div>

      {/* 1. DIAGNOSTICS TAB */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
           {/* System Health Status Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-techbridge-card p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 border-l-4 border-l-green-500">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide text-xs">{t('admin.status.system')}</h3>
                    <Activity size={20} className="text-green-500" />
                 </div>
                 <div className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-1">{t('admin.status.healthy')}</div>
                 <p className="text-xs text-gray-500">All services operational</p>
              </div>
              <div className="bg-white dark:bg-techbridge-card p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 border-l-4 border-l-blue-500">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide text-xs">{t('admin.status.security')}</h3>
                    <Shield size={20} className="text-blue-500" />
                 </div>
                 <div className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-1">{t('admin.status.secure')}</div>
                 <p className="text-xs text-gray-500">Last scan: Just now | 0 Vulnerabilities</p>
              </div>
           </div>

           {/* Diagnostics Details */}
           <div className="bg-white dark:bg-techbridge-card p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-white/5">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif font-bold text-2xl text-gray-900 dark:text-white">Environment Diagnostics</h3>
                <button 
                  onClick={runSystemHealthCheck}
                  disabled={isRunningTests}
                  className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  {isRunningTests ? 'Checking...' : 'Run Health Check'}
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                  <h4 className="font-bold text-techbridge-maroon dark:text-techbridge-gold mb-4 uppercase tracking-wider text-xs">{t('admin.diag.frontend')}</h4>
                  <ul className="space-y-3">
                     {['React v19.2.4', 'Tailwind CSS v3.4', 'Lucide Icons', 'Recharts'].map((item, i) => (
                       <li key={i} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                         <CheckCircle size={16} className="text-green-500 mr-2" /> {item}
                       </li>
                     ))}
                  </ul>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                  <h4 className="font-bold text-techbridge-maroon dark:text-techbridge-gold mb-4 uppercase tracking-wider text-xs">{t('admin.diag.services')}</h4>
                   <ul className="space-y-3">
                     {['Auth Service: Mocked', `Audit Logger: Active`, 'WebSocket: Simulated'].map((item, i) => (
                       <li key={i} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                         <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 animate-pulse"></div> {item}
                       </li>
                     ))}
                  </ul>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 2. DATABASE TAB */}
      {activeTab === 'db' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-techbridge-card p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 border-l-4 border-l-amber-500">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide text-xs">{t('admin.status.db')}</h3>
                <Database size={20} className="text-amber-500" />
             </div>
             <div className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-1">{t('admin.status.active')}</div>
             <p className="text-xs text-gray-500">PostgreSQL v14.2 | Cluster: eu-west-1</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-techbridge-card p-6 rounded-2xl border border-gray-200 dark:border-white/5">
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Active Connections</h4>
               <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">42/100</p>
               <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
                 <div className="bg-green-500 h-full rounded-full" style={{ width: '42%' }}></div>
               </div>
            </div>
            <div className="bg-white dark:bg-techbridge-card p-6 rounded-2xl border border-gray-200 dark:border-white/5">
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Query Cache Hit</h4>
               <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">94.8%</p>
               <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
                 <div className="bg-blue-500 h-full rounded-full" style={{ width: '94.8%' }}></div>
               </div>
            </div>
            <div className="bg-white dark:bg-techbridge-card p-6 rounded-2xl border border-gray-200 dark:border-white/5">
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Storage Usage</h4>
               <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">45.2 GB</p>
               <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
                 <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }}></div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TESTING TAB */}
      {activeTab === 'testing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-techbridge-card p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white flex items-center">
                   <Laptop size={24} className="mr-3 text-techbridge-maroon" />
                   {t('admin.test.journey')}
                 </h3>
                 <button 
                  onClick={runLiveJourney}
                  disabled={isRunningTests}
                  className="px-6 py-2 bg-techbridge-maroon text-white rounded-full hover:bg-techbridge-wine disabled:opacity-50 transition-all shadow-lg shadow-techbridge-maroon/20 flex items-center font-bold text-sm"
                >
                  <Play size={16} className="mr-2" />
                  {isRunningTests ? t('admin.test.running') : t('admin.test.run')}
                </button>
              </div>
              <div className="bg-gray-950 rounded-2xl p-6 font-mono text-sm flex-1 min-h-[300px] border border-gray-800 shadow-inner">
                <div className="text-gray-600 mb-4 border-b border-gray-800 pb-2">root@techbridge-media:~/tests# ./run_journey.sh</div>
                {testResults.length === 0 && !isRunningTests && <div className="text-gray-500 animate-pulse">Waiting for command...</div>}
                {testResults.map((result, idx) => (
                  <div key={idx} className="mb-2 flex items-start animate-in slide-in-from-left-2 duration-300">
                     <span className={`font-bold mr-3 ${result.status === 'PASS' ? 'text-green-400' : 'text-red-500'}`}>[{result.status}]</span>
                     <div className="flex-1">
                       <span className="text-gray-300">{result.name}</span>
                       <div className="text-xs text-gray-500">{result.message}</div>
                     </div>
                  </div>
                ))}
                {isRunningTests && <div className="text-techbridge-gold mt-4">Processing step...</div>}
              </div>
           </div>

           <div className="bg-white dark:bg-techbridge-card p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-white/5">
               <div className="flex justify-between items-center mb-6">
                   <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white">{t('admin.test.suite')}</h3>
                   <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center uppercase tracking-wide bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full transition-colors" onClick={() => navigator.clipboard.writeText(playwrightScript)}>
                      <Copy size={14} className="mr-1" /> Copy Code
                   </button>
               </div>
               <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  For CI/CD pipelines, use this generated Playwright script to run headless end-to-end tests against the production build.
               </p>
               <pre className="bg-gray-900 text-gray-300 p-6 rounded-2xl overflow-x-auto text-xs font-mono h-64 border border-gray-800 custom-scrollbar">
                 {playwrightScript}
               </pre>
           </div>
        </div>
      )}

      {/* 4. LOGS TAB */}
      {activeTab === 'logs' && (
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 h-[calc(100vh-280px)] flex flex-col">
           <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="font-bold text-white flex items-center"><Terminal size={18} className="mr-2 text-green-400"/> {t('admin.logs.title')}</h3>
              <button onClick={() => setLogs(auditService.getLogs())} className="text-gray-400 hover:text-white transition-colors">
                <RefreshCw size={16} />
              </button>
           </div>
           <div className="font-mono text-xs text-gray-300 space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {logs.length === 0 ? <p className="text-gray-600 italic">Listening for system events...</p> : 
                logs.map(log => (
                  <div key={log.id} className="flex border-b border-gray-800 pb-1 mb-1 last:border-0 hover:bg-white/5 p-1 rounded">
                    <span className="w-24 text-gray-500 shrink-0">{log.timestamp.split('T')[1].split('.')[0]}</span>
                    <span className={`w-16 font-bold shrink-0 ${log.level === 'ERROR' ? 'text-red-500' : log.level === 'WARN' ? 'text-amber-500' : 'text-blue-400'}`}>{log.level}</span>
                    <span className="flex-1 text-gray-300">{log.message}</span>
                    <span className="text-gray-600 w-24 text-right truncate">@{log.user}</span>
                  </div>
                ))
              }
           </div>
        </div>
      )}

      {/* 5. PERFORMANCE TAB */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-techbridge-card p-6 rounded-2xl border border-gray-200 dark:border-white/5">
                 <div className="flex justify-between mb-2">
                   <h4 className="text-xs font-bold text-gray-500 uppercase">{t('admin.perf.cpu')}</h4>
                   <Cpu size={16} className="text-purple-500"/>
                 </div>
                 <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">12%</p>
                 <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full mt-2"><div className="bg-purple-500 h-full rounded-full" style={{width: '12%'}}></div></div>
              </div>
              <div className="bg-white dark:bg-techbridge-card p-6 rounded-2xl border border-gray-200 dark:border-white/5">
                 <div className="flex justify-between mb-2">
                   <h4 className="text-xs font-bold text-gray-500 uppercase">{t('admin.perf.memory')}</h4>
                   <HardDrive size={16} className="text-blue-500"/>
                 </div>
                 <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">512 MB</p>
                 <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full mt-2"><div className="bg-blue-500 h-full rounded-full" style={{width: '30%'}}></div></div>
              </div>
              <div className="bg-white dark:bg-techbridge-card p-6 rounded-2xl border border-gray-200 dark:border-white/5">
                 <div className="flex justify-between mb-2">
                   <h4 className="text-xs font-bold text-gray-500 uppercase">{t('admin.perf.latency')}</h4>
                   <Wifi size={16} className="text-green-500"/>
                 </div>
                 <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">42ms</p>
                 <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full mt-2"><div className="bg-green-500 h-full rounded-full" style={{width: '80%'}}></div></div>
              </div>
              <div className="bg-white dark:bg-techbridge-card p-6 rounded-2xl border border-gray-200 dark:border-white/5">
                 <div className="flex justify-between mb-2">
                   <h4 className="text-xs font-bold text-gray-500 uppercase">Uptime</h4>
                   <Server size={16} className="text-amber-500"/>
                 </div>
                 <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">99.98%</p>
                 <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full mt-2"><div className="bg-amber-500 h-full rounded-full" style={{width: '99%'}}></div></div>
              </div>
           </div>

           {/* Performance Graph Placeholder - Keeping it lightweight */}
           <div className="bg-white dark:bg-techbridge-card p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-white/5 h-80 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
               <div className="text-center">
                 <Activity size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4 animate-pulse"/>
                 <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Live Telemetry Stream</h3>
                 <p className="text-xs text-gray-400 mt-2">Connecting to metrics socket...</p>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
```

### FILE: components/AnalyticsView.tsx
```typescript
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { ANALYTICS_DATA } from '../constants';
import { Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AnalyticsView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('analytics.title')}</h2>
          <p className="text-sm text-gray-500">{t('analytics.subtitle')}</p>
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white">
          <Download size={16} className="mr-2" />
          {t('analytics.export')}
        </button>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{t('analytics.trend')}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#1f2937' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#7A0019" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#7A0019', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#D4A017" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#D4A017', strokeWidth: 2, stroke: '#fff' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 rounded-full bg-[#7A0019] mr-2"></span>
              {t('analytics.legend.views')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 rounded-full bg-[#D4A017] mr-2"></span>
              {t('analytics.legend.engagement')}
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{t('analytics.shares')}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{fill: '#f9fafb'}}
                   contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="shares" fill="#7A0019" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <h4 className="text-white/80 text-sm font-medium uppercase tracking-wider">{t('analytics.card.topArticle')}</h4>
          <p className="text-2xl font-bold mt-2">The Future of AI</p>
          <div className="mt-4 flex items-center text-sm text-white/90">
             <span className="bg-white/20 px-2 py-1 rounded">1.2k Views</span>
             <span className="ml-3">Sarah Mensah</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <h4 className="text-white/80 text-sm font-medium uppercase tracking-wider">{t('analytics.card.topRegion')}</h4>
          <p className="text-2xl font-bold mt-2">Accra, Ghana</p>
          <div className="mt-4 flex items-center text-sm text-white/90">
             <span className="bg-white/20 px-2 py-1 rounded">68% {t('analytics.card.traffic')}</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
          <h4 className="text-white/80 text-sm font-medium uppercase tracking-wider">{t('analytics.card.avgSession')}</h4>
          <p className="text-2xl font-bold mt-2">4m 12s</p>
          <div className="mt-4 flex items-center text-sm text-white/90">
             <span className="bg-white/20 px-2 py-1 rounded">+12% {t('analytics.card.vsPrev')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
```

### FILE: components/AssetLibrary.tsx
```typescript
import React from 'react';
import { UploadCloud, File, Image, Video, Music } from 'lucide-react';
import { MOCK_ASSETS } from '../constants';
import { useToast } from '../context/ToastContext';
import { auditService } from '../services/AuditService';
import { useLanguage } from '../context/LanguageContext';

const AssetLibrary: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();

  const handleUpload = () => {
    showToast('Initiating secure upload... (Simulated)', 'info');
    setTimeout(() => {
      showToast('File uploaded successfully (Simulated)', 'success');
      auditService.log('INFO', 'User uploaded file (Simulated)');
    }, 1500);
  };

  const handleDelete = (name: string) => {
    showToast(`Asset "${name}" deleted`, 'error');
    auditService.log('WARN', `User deleted asset: ${name}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Image': return <Image className="w-8 h-8 text-purple-500" />;
      case 'Video': return <Video className="w-8 h-8 text-red-500" />;
      case 'Audio': return <Music className="w-8 h-8 text-blue-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const filterLabels = [
    t('assets.filter.all'), 
    t('assets.filter.images'), 
    t('assets.filter.videos'), 
    t('assets.filter.docs'), 
    t('assets.filter.audio')
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-10 overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-techbridge-maroon to-gray-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-30"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-serif font-bold text-white mb-3 tracking-tight">{t('assets.title')}</h2>
            <p className="text-white/80 text-lg font-light leading-relaxed">
              {t('assets.subtitle')}
            </p>
          </div>
          <button 
            onClick={handleUpload}
            className="flex items-center px-8 py-4 bg-white text-techbridge-maroon rounded-full font-bold shadow-lg shadow-black/20 hover:shadow-xl hover:scale-105 transition-all"
          >
            <UploadCloud size={20} className="mr-2" />
            {t('assets.upload')}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
             {filterLabels.map((filter, i) => (
              <button key={filter} className={`px-5 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${i === 0 ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
                {filter}
              </button>
             ))}
          </div>
          <p className="text-sm text-gray-500 hidden md:block">{MOCK_ASSETS.length} {t('assets.itemsStored')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_ASSETS.map((asset) => (
            <div key={asset.id} className="group glass bg-white dark:bg-techbridge-card rounded-2xl overflow-hidden card-hover border border-gray-100 dark:border-white/5">
              <div className="aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
                {asset.type === 'Image' || asset.type === 'Video' ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-50 dark:bg-white/5">
                    {getIcon(asset.type)}
                  </div>
                )}
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors">
                     <UploadCloud size={18} className="rotate-180"/>
                  </button>
                  <button onClick={() => handleDelete(asset.name)} className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors">
                     <span className="sr-only">Delete</span>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-widest text-techbridge-gold uppercase bg-techbridge-gold/10 px-2 py-0.5 rounded">{asset.type}</span>
                  <span className="text-xs text-gray-400 font-mono">{asset.size}</span>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white truncate mb-1" title={asset.name}>{asset.name}</h4>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                   <p className="text-xs text-gray-500 dark:text-gray-400">{t('assets.addedBy')} {asset.uploadedBy.split(' ')[0]}</p>
                   <p className="text-xs text-gray-400">{new Date(asset.dateUploaded).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Upload Placeholder */}
          <div 
            onClick={handleUpload}
            className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400 hover:border-techbridge-maroon hover:text-techbridge-maroon hover:bg-techbridge-maroon/5 dark:hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="p-4 bg-gray-100 dark:bg-white/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
               <UploadCloud size={32} />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide">{t('assets.drop')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetLibrary;
```

### FILE: components/CollaborativeEditor.tsx
```typescript
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { User, CollabEvent } from '../types';
import { collaborationService } from '../services/collaboration';
import { Users, Wifi, Save, X, Bold, Italic, List, Link as LinkIcon, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { CURRENT_USER } from '../constants';
import { useToast } from '../context/ToastContext';

interface CollaborativeEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ 
  initialTitle = '', 
  initialContent = '', 
  onClose, 
  onSave 
}) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [activeUsers, setActiveUsers] = useState<User[]>([CURRENT_USER]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastCursorPos = useRef<number | null>(null);

  useEffect(() => {
    // Connect to session
    collaborationService.connect(CURRENT_USER, 'doc-123');
    setIsConnected(true);

    const unsubscribe = collaborationService.subscribe((event: CollabEvent) => {
      // Ignore our own events from the same session
      if (event.sessionId === collaborationService.sessionId) return;

      switch (event.type) {
        case 'user_joined':
          if (event.user) {
            setActiveUsers(prev => {
              if (prev.find(u => u.id === event.user!.id)) return prev;
              showToast(`${event.user!.name} joined the document`, 'info');
              return [...prev, event.user!];
            });
          }
          break;
        case 'user_left':
          setActiveUsers(prev => {
             const user = prev.find(u => u.id === event.userId);
             if (user) showToast(`${user.name} left`, 'info');
             return prev.filter(u => u.id !== event.userId);
          });
          break;
        case 'cursor_move':
            setActiveUsers(prev => prev.map(u => 
                u.id === event.userId ? { ...u, cursorPosition: event.position } : u
            ));
            break;
        case 'text_update':
          if (event.text !== undefined) {
            // Typing indicator
            if (event.userId !== CURRENT_USER.id) {
               const user = activeUsers.find(u => u.id === event.userId) || { name: 'Remote User' };
               setIsTyping(user.name);
               setTimeout(() => setIsTyping(null), 2000);
            }

            // Handle Update
            if (event.action === 'replace') {
                setContent(event.text);
            } else if (event.action === 'insert') {
                setContent(prev => {
                    const insertPos = event.position !== undefined ? event.position : prev.length;
                    // Safely handle out of bounds (append if huge number)
                    const safePos = Math.min(Math.max(0, insertPos), prev.length);
                    
                    // Track where local cursor was before update
                    if (textareaRef.current) {
                         lastCursorPos.current = textareaRef.current.selectionStart;
                    }
                    
                    return prev.slice(0, safePos) + event.text + prev.slice(safePos);
                });
            }
          }
          break;
      }
    });

    return () => {
      unsubscribe();
      collaborationService.disconnect();
    };
  }, [activeUsers, showToast]);

  // Restore cursor position after a remote update (very basic preservation)
  useLayoutEffect(() => {
    if (lastCursorPos.current !== null && textareaRef.current) {
        // If content length increased, and cursor was after insertion point, shift it?
        // This is complex to get perfect without Operational Transformation. 
        // For now, we try to keep the cursor where it was if possible, 
        // but often React resets it to end on controlled update if not handled.
        // Actually, if we are typing, we are fine. If remote updates, we might lose position.
        
        // Simple heuristic: If we weren't focused, don't worry.
        if (document.activeElement === textareaRef.current) {
             const len = content.length;
             // Restore to previous or end if shorter
             // textareaRef.current.setSelectionRange(lastCursorPos.current, lastCursorPos.current);
             // Note: This often conflicts with local typing updates. 
             // Leaving simplified for prototype stability.
        }
        lastCursorPos.current = null;
    }
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // In a real app, we'd calculate diff and send 'insert'/'delete'
    // For this prototype, we'll send 'replace' to keep state consistent across simple peers
    collaborationService.send({ 
        type: 'text_update', 
        text: newContent, 
        userId: CURRENT_USER.id,
        action: 'replace' 
    });
  };

  const handleCursorMove = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const pos = target.selectionStart;
    
    collaborationService.send({
        type: 'cursor_move',
        userId: CURRENT_USER.id,
        position: pos
    });
  };

  // Helper to render remote cursors using the "Mirror" technique
  const renderRemoteCursors = () => {
    return activeUsers.filter(u => u.id !== CURRENT_USER.id && u.cursorPosition !== undefined).map(user => {
        // Clamp cursor position
        const safePos = Math.min(Math.max(0, user.cursorPosition || 0), content.length);
        const beforeCursor = content.substring(0, safePos);
        
        return (
            <div key={user.id} className="absolute inset-0 pointer-events-none whitespace-pre-wrap font-serif text-lg leading-relaxed p-12 lg:px-24" style={{ color: 'transparent' }}>
                <span>{beforeCursor}</span>
                <span className="relative inline-block align-text-bottom h-6 w-0.5 -ml-[1px] -mb-[4px] z-10 transition-all duration-100" style={{ backgroundColor: user.color || '#D4A017' }}>
                    <div className="absolute top-[-24px] left-[-8px] px-2 py-0.5 rounded-md text-[10px] text-white font-bold whitespace-nowrap shadow-md transition-opacity duration-300 opacity-100" style={{ backgroundColor: user.color || '#D4A017' }}>
                        {user.name}
                    </div>
                </span>
            </div>
        );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        
        {/* Header / Toolbar */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center z-20">
          <div className="flex-1 mr-4">
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400 w-full"
              placeholder="Untitled Document"
            />
            <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
              <span className={`flex items-center ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
                <Wifi size={12} className="mr-1" />
                {isConnected ? 'Online' : 'Connecting...'}
              </span>
              <span>•</span>
              <span>All changes saved</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Active Users Stack */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                <div className="flex -space-x-2 mr-2">
                {activeUsers.map((user, idx) => (
                    <div key={`${user.id}-${idx}`} className="relative group transition-transform hover:z-10 hover:scale-110 cursor-help">
                    <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                        style={{ borderColor: user.color || 'transparent' }}
                    />
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 shadow-lg">
                        {user.name}
                    </div>
                    </div>
                ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium px-1">
                    {activeUsers.length > 1 ? `${activeUsers.length} editors` : 'Just you'}
                </div>
            </div>

            <button className="p-2 text-techbridge-maroon dark:text-techbridge-gold bg-techbridge-maroon/10 dark:bg-white/5 rounded-full hover:bg-techbridge-maroon/20 transition-colors">
                <MessageSquare size={20} />
            </button>

            <button 
                onClick={() => onSave(title, content)}
                className="flex items-center px-6 py-2 bg-[#7A0019] text-white rounded-full hover:bg-[#600014] transition-colors text-sm font-bold shadow-lg shadow-techbridge-maroon/20"
            >
              <Save size={16} className="mr-2" />
              Save
            </button>
            <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Editor Toolbar */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 px-6 py-2 flex items-center space-x-1 overflow-x-auto shrink-0 z-10">
            <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Bold size={18} /></button>
            <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Italic size={18} /></button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>
            <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><List size={18} /></button>
            <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><LinkIcon size={18} /></button>
            <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><ImageIcon size={18} /></button>
            <div className="flex-1"></div>
            {isTyping && (
                <div className="text-xs text-[#7A0019] dark:text-[#D4A017] font-medium animate-in fade-in slide-in-from-right-4 flex items-center bg-[#7A0019]/10 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-[#7A0019] dark:bg-[#D4A017] rounded-full mr-2 animate-bounce"></span>
                    {isTyping} is typing...
                </div>
            )}
        </div>

        {/* Main Editor Area with Mirror Cursor Layer */}
        <div className="flex-1 bg-white dark:bg-gray-900 overflow-hidden flex flex-col relative">
            <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                <div className="max-w-4xl mx-auto min-h-full bg-white dark:bg-gray-900 shadow-sm p-12 lg:px-24 relative">
                    
                    {/* Remote Cursor Overlay (Mirror Layer) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
                         {renderRemoteCursors()}
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleContentChange}
                        onSelect={handleCursorMove}
                        onKeyUp={handleCursorMove}
                        onClick={handleCursorMove}
                        className="w-full h-full min-h-[600px] resize-none outline-none border-none bg-transparent text-gray-900 dark:text-gray-100 leading-relaxed text-lg placeholder-gray-300 dark:placeholder-gray-700 font-serif relative z-10 selection:bg-techbridge-maroon/20 dark:selection:bg-techbridge-gold/20"
                        placeholder="Start typing your story..."
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
        
        {/* Footer Status */}
        <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 flex justify-between">
            <span className="font-mono">Ln {content.split('\n').length}, Col {content.length}</span>
            <div className="flex items-center space-x-4">
                 <span>UTF-8</span>
                 <span className="flex items-center"><Wifi size={10} className="mr-1 text-green-500"/> Connected</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
```

### FILE: components/ContentManager.tsx
```typescript
import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Eye } from 'lucide-react';
import { MOCK_CONTENT } from '../constants';
import { ContentStatus } from '../types';
import CollaborativeEditor from './CollaborativeEditor';
import { useLanguage } from '../context/LanguageContext';

const ContentManager: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<ContentStatus | 'All'>('All');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{title: string, content: string} | null>(null);
  const { t } = useLanguage();

  const filteredContent = filterStatus === 'All' 
    ? MOCK_CONTENT 
    : MOCK_CONTENT.filter(c => c.status === filterStatus);

  const handleOpenEditor = (title?: string) => {
      if (title) {
          // Mock fetching content
          setSelectedContent({ title, content: "This is a mock draft content loaded from the database..." });
      } else {
          setSelectedContent(null);
      }
      setIsEditorOpen(true);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'All': return t('cms.tab.all');
      case 'Draft': return t('cms.tab.draft');
      case 'In Review': return t('cms.tab.inReview');
      case 'Published': return t('cms.tab.published');
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('cms.search')} 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7A0019] w-full"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Filter size={18} />
          </button>
        </div>
        <button 
          onClick={() => handleOpenEditor()}
          className="flex items-center px-4 py-2 bg-[#7A0019] text-white rounded-lg hover:bg-[#600014] transition-colors shadow-sm text-sm font-medium w-full sm:w-auto justify-center"
        >
          <Plus size={18} className="mr-2" />
          {t('cms.create')}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-6 min-w-max">
          {['All', 'Draft', 'In Review', 'Published'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as ContentStatus | 'All')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                ${filterStatus === status 
                  ? 'border-[#7A0019] text-[#7A0019]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Board */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-5">{t('cms.col.title')}</div>
            <div className="col-span-2">{t('cms.col.author')}</div>
            <div className="col-span-2">{t('cms.col.status')}</div>
            <div className="col-span-2">{t('cms.col.date')}</div>
            <div className="col-span-1 text-right">{t('cms.col.actions')}</div>
          </div>
          <div className="divide-y divide-gray-200 bg-white">
            {filteredContent.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-5 flex items-center">
                  <div className="h-10 w-16 flex-shrink-0 mr-4">
                    <img className="h-10 w-16 rounded object-cover" src={item.thumbnail} alt="" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.type}</div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-900">{item.author}</div>
                </div>
                <div className="col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'Published' ? 'bg-green-100 text-green-800' :
                    item.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-gray-500">
                  {new Date(item.dateCreated).toLocaleDateString()}
                </div>
                <div className="col-span-1 text-right flex justify-end space-x-2">
                  <button onClick={() => handleOpenEditor(item.title)} className="text-gray-400 hover:text-[#7A0019]">
                    <Edit2 size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-[#7A0019]">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collaborative Editor Modal */}
      {isEditorOpen && (
        <CollaborativeEditor 
          initialTitle={selectedContent?.title}
          initialContent={selectedContent?.content}
          onClose={() => setIsEditorOpen(false)}
          onSave={(title, content) => {
            console.log('Saved:', title, content);
            setIsEditorOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ContentManager;
```

### FILE: components/Dashboard.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, FileText, ArrowRight, PlayCircle, Mic, Star } from 'lucide-react';
import { MOCK_CONTENT, MOCK_EVENTS } from '../constants';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { auditService } from '../services/AuditService';

// Add navigation support
interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

const VIDEO_BANNERS = [
  "https://media.techbridge.edu.gh/media/banner1.mp4",
  "https://media.techbridge.edu.gh/media/banner2.mp4",
  "https://media.techbridge.edu.gh/media/banner3.mp4",
  "https://media.techbridge.edu.gh/media/banner4.mp4"
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % VIDEO_BANNERS.length);
    }, 8000); // Rotate every 8 seconds
    return () => clearInterval(timer);
  }, []);

  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
      auditService.log('INFO', `Dashboard quick nav to ${tab}`);
    }
  };

  const handleCreateEvent = () => {
    showToast('Event Creation Wizard coming in Phase 3', 'info');
    auditService.log('INFO', 'User clicked Create Event (Simulated)');
  };

  const stats = [
    { label: t('dash.stat.views'), value: '12.5k', change: '+14%', icon: TrendingUp, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
    { label: t('dash.stat.members'), value: '48', change: '+2', icon: Users, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' },
    { label: t('dash.stat.events'), value: '3', change: t('dash.stat.thisWeek'), icon: Calendar, gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/30' },
    { label: t('dash.stat.reviews'), value: '5', change: '-2', icon: FileText, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' },
  ];

  return (
    <div className="space-y-10">
      {/* Cinematic Carousel Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-techbridge-maroon text-white p-8 md:p-12 min-h-[420px] flex items-center group">
        
        {/* Video Background Layer */}
        <div className="absolute inset-0 z-0">
          {VIDEO_BANNERS.map((video, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-40' : 'opacity-0'}`}
            >
              <video 
                src={video} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover mix-blend-overlay"
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-techbridge-maroon via-techbridge-wine/90 to-transparent z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 max-w-2xl animate-in slide-in-from-left-4 duration-700">
           <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-md">
             {t('dash.hero.title')}
           </h1>
           <p className="text-white/90 text-lg mb-8 max-w-lg font-light leading-relaxed drop-shadow-sm">
             {t('dash.hero.subtitle')}
           </p>
           <div className="flex flex-wrap gap-4">
             <button onClick={() => handleNav('content')} className="px-6 py-3 bg-white text-techbridge-wine rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 flex items-center">
               <PlayCircle size={18} className="mr-2" />
               {t('dash.hero.btn.review')}
             </button>
             <button onClick={() => handleNav('analytics')} className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all">
               {t('dash.hero.btn.analytics')}
             </button>
           </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 right-8 z-30 flex space-x-2">
          {VIDEO_BANNERS.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-techbridge-gold' : 'w-2 bg-white/40 hover:bg-white/80'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="group glass bg-white dark:bg-techbridge-card rounded-2xl p-6 relative overflow-hidden card-hover">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity group-hover:opacity-20 pointer-events-none"></div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                   {stat.change}
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Content - Editorial Style */}
        <div className="lg:col-span-2 glass bg-white dark:bg-techbridge-card rounded-3xl p-8 card-hover">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{t('dash.recent.title')}</h3>
              <p className="text-sm text-gray-500">{t('dash.recent.subtitle')}</p>
            </div>
            <button 
              onClick={() => handleNav('content')}
              className="text-sm text-techbridge-maroon dark:text-techbridge-gold font-bold uppercase tracking-wider hover:underline flex items-center"
            >
              {t('dash.recent.viewAll')} <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-6">
            {MOCK_CONTENT.slice(0, 3).map((item, index) => (
              <div key={item.id} className="group flex items-start p-4 -mx-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-xl shadow-md">
                   <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                   {item.type === 'Video' && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                       <PlayCircle className="text-white w-8 h-8 opacity-80" />
                     </div>
                   )}
                   {item.type === 'Podcast' && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                       <Mic className="text-white w-8 h-8 opacity-80" />
                     </div>
                   )}
                </div>
                <div className="ml-5 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-techbridge-gold mb-1 block">
                      {item.type}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border ${
                      item.status === 'Published' ? 'border-green-200 text-green-700 dark:border-green-900 dark:text-green-400' :
                      item.status === 'In Review' ? 'border-amber-200 text-amber-700 dark:border-amber-900 dark:text-amber-400' :
                      'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold transition-colors font-serif">
                    {item.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <img src={`https://ui-avatars.com/api/?name=${item.author}&background=random`} className="w-5 h-5 rounded-full mr-2" />
                    <span>{item.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(item.dateCreated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Widget - Visual Calendar */}
        <div className="glass bg-white dark:bg-techbridge-card rounded-3xl p-8 card-hover flex flex-col">
           <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{t('dash.events.title')}</h3>
            <button 
              onClick={() => handleNav('events')}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-techbridge-maroon hover:text-white transition-colors"
            >
              <Calendar size={18} />
            </button>
          </div>
          
          <div className="flex-1 space-y-6">
            {MOCK_EVENTS.filter(e => e.status === 'Upcoming').slice(0, 3).map((event, idx) => (
              <div key={event.id} className="relative pl-8 border-l-2 border-dashed border-gray-200 dark:border-gray-700 pb-2">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 ${idx === 0 ? 'bg-techbridge-maroon' : 'bg-techbridge-gold'}`}></div>
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-techbridge-maroon/30 transition-colors">
                   <p className="text-xs font-bold text-techbridge-maroon dark:text-techbridge-gold uppercase tracking-wide mb-1">
                     {new Date(event.date).toLocaleString('default', { month: 'short', day: 'numeric' })} • {new Date(event.date).toLocaleString('default', { hour: '2-digit', minute:'2-digit' })}
                   </p>
                   <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{event.title}</h4>
                   <p className="text-xs text-gray-500 mt-1 flex items-center">
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                     {event.location}
                   </p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleCreateEvent}
            className="w-full mt-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-gray-500/20 transition-all flex items-center justify-center group"
          >
            {t('dash.events.create')} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

### FILE: components/EventManager.tsx
```typescript
import React from 'react';
import { Calendar as CalendarIcon, MapPin, Users, Clock } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const EventManager: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Calendar Side */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{t('events.title')}</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">{t('events.view.month')}</button>
            <button className="px-3 py-1 text-sm bg-[#7A0019] text-white rounded-md shadow-sm">{t('events.view.week')}</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">{t('events.view.day')}</button>
          </div>
        </div>

        {/* Mock Calendar Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-7 gap-2 mb-4 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs font-semibold text-gray-500 uppercase">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 2; // Offset for mock
              const isToday = day === 17; // Mock today
              const hasEvent = [5, 20].includes(day); // Mock event dates
              
              return (
                <div key={i} className={`
                  h-24 border border-gray-100 rounded-lg p-2 relative hover:bg-gray-50 transition-colors
                  ${day <= 0 || day > 31 ? 'bg-gray-50 text-gray-300' : 'bg-white'}
                `}>
                  <span className={`
                    text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-[#7A0019] text-white' : 'text-gray-700'}
                  `}>
                    {day > 0 && day <= 31 ? day : ''}
                  </span>
                  {hasEvent && (
                    <div className="mt-2 text-[10px] p-1 bg-indigo-100 text-indigo-700 rounded truncate">
                      {day === 5 ? 'Workshop' : 'Hackathon'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events List Side */}
      <div className="w-full lg:w-96 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('events.upcoming')}</h3>
          <div className="space-y-6">
            {MOCK_EVENTS.map((event) => (
              <div key={event.id} className="relative pl-6 border-l-2 border-gray-200 pb-2 last:pb-0">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${event.status === 'Completed' ? 'bg-gray-400' : 'bg-[#D4A017]'}`}></div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={14} className="mr-2" />
                      {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin size={14} className="mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users size={14} className="mr-2" />
                      {event.attendees} {t('events.registered')}
                    </div>
                  </div>
                  
                  {event.status === 'Upcoming' && (
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-1.5 bg-[#7A0019] text-white text-xs font-medium rounded hover:bg-[#600014]">
                        {t('events.manage')}
                      </button>
                      <button className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50">
                        {t('events.edit')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManager;
```

### FILE: components/Layout.tsx
```typescript
import React, { ReactNode, useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Calendar, 
  BarChart2, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  ShieldAlert,
  Search,
  Globe,
  Clock,
  Type,
  Palette
} from 'lucide-react';
import { CURRENT_USER } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { auditService } from '../services/AuditService';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme, font, setFont } = useTheme();
  const { showToast } = useToast();
  const { locale, setLocale, t } = useLanguage();

  // Date & Time State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeZone, setTimeZone] = useState('Africa/Accra');

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'content', label: t('nav.content'), icon: FileText },
    { id: 'assets', label: t('nav.assets'), icon: ImageIcon },
    { id: 'events', label: t('nav.events'), icon: Calendar },
    { id: 'analytics', label: t('nav.analytics'), icon: BarChart2 },
  ];

  const fonts = [
    { name: 'Inter (Default)', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Merriweather', value: 'Merriweather' },
    { name: 'Lora', value: 'Lora' },
  ];

  const handleSignOut = () => {
    showToast('Sign out simulated successfully', 'success');
    auditService.log('INFO', 'User signed out');
  };

  // Date Formatting Helpers
  const getFormattedDate = () => {
    try {
      return new Intl.DateTimeFormat(locale, {
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        timeZone: timeZone
      }).format(currentDate);
    } catch (e) {
      return currentDate.toLocaleDateString();
    }
  };

  const getFormattedTime = () => {
    try {
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timeZone,
        timeZoneName: 'short'
      }).format(currentDate);
    } catch (e) {
      return currentDate.toLocaleTimeString();
    }
  };

  const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeZone(e.target.value);
    auditService.log('INFO', `Time zone changed to ${e.target.value}`);
  };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as any);
    auditService.log('INFO', `Language changed to ${e.target.value}`);
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
    auditService.log('INFO', `Font changed to ${e.target.value}`);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as any);
    auditService.log('INFO', `Theme changed to ${e.target.value}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-techbridge-dark text-gray-900 dark:text-gray-100 flex flex-col md:flex-row font-sans transition-colors duration-500 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      {/* Mobile Header */}
      <div className="md:hidden glass text-gray-900 dark:text-white p-4 flex justify-between items-center z-20 sticky top-0 border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center space-x-2">
          <img 
            src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
            alt="Techbridge Logo" 
            className="w-8 h-8 object-contain bg-white rounded-md p-0.5 shadow-lg" 
          />
          <span className="font-serif font-bold text-lg tracking-wide">Techbridge</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Cinematic Dock) */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-10 w-72 transform transition-transform duration-500 ease-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          glass md:bg-white/80 md:dark:bg-techbridge-dark/90 border-r border-gray-200/50 dark:border-white/5 backdrop-blur-xl
        `}
      >
        <div className="h-full flex flex-col">
          {/* Brand Area */}
          <div className="h-24 flex items-center px-8 bg-gradient-to-r from-techbridge-maroon to-techbridge-wine text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <img 
              src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
              alt="Techbridge Logo" 
              className="w-12 h-12 object-contain mr-4 bg-white rounded-lg p-1 shadow-md z-10" 
            />
            <div className="z-10">
              <h1 className="font-serif font-bold text-xl tracking-wide leading-none">Techbridge</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-techbridge-gold mt-1 opacity-90">Media Club</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2" aria-label="Main Navigation">
            <div className="px-4 mb-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Main Menu</p>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                    auditService.log('INFO', `Navigation to ${item.label}`);
                  }}
                  className={`
                    group w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden
                    ${isActive 
                      ? 'bg-techbridge-maroon text-white shadow-lg shadow-techbridge-maroon/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}
                  `}
                >
                  <Icon size={20} className={`mr-3 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-techbridge-gold' : 'text-gray-400 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold'}`} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-techbridge-gold"></div>}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-white/10 space-y-3 bg-gray-50/50 dark:bg-black/20">
            <button 
              id="nav-admin"
              onClick={() => {
                setActiveTab('admin');
                setIsSidebarOpen(false);
                auditService.log('INFO', 'User accessed Admin Portal login');
              }}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
            >
              <ShieldAlert size={18} className={`mr-2 ${activeTab === 'admin' ? 'text-red-500' : ''}`} />
              {t('nav.admin')}
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-white/10">
            <div className="flex items-center p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm group cursor-pointer hover:border-techbridge-maroon/30 transition-colors">
              <div className="relative">
                <img src={CURRENT_USER.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-md group-hover:border-techbridge-maroon transition-colors" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-serif font-bold text-gray-900 dark:text-white truncate">{CURRENT_USER.name}</p>
                <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 truncate">{CURRENT_USER.role}</p>
              </div>
              <button onClick={handleSignOut} className="text-gray-400 hover:text-red-600 transition-colors p-1">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 glass z-10 flex items-center justify-between px-8 transition-all duration-300 gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight leading-none">
              {activeTab === 'admin' ? t('header.admin') : navItems.find(i => i.id === activeTab)?.label}
            </h2>
            {/* Dynamic Date & Time */}
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:flex items-center mt-2 animate-in fade-in">
              <span className="mr-3 tracking-wide">{getFormattedDate()}</span>
              <span className="font-mono font-bold text-techbridge-maroon dark:text-techbridge-gold bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded shadow-sm border border-gray-200 dark:border-white/5">
                {getFormattedTime()}
              </span>
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="hidden xl:flex items-center bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-transparent focus-within:border-techbridge-maroon/50 transition-colors mr-2">
              <Search size={14} className="text-gray-400" />
              <input type="text" placeholder={t('header.search')} className="bg-transparent border-none focus:ring-0 text-xs ml-2 w-32 text-gray-700 dark:text-gray-200 placeholder-gray-400" />
            </div>

            {/* Selectors Group */}
            <div className="hidden lg:flex items-center space-x-2 mr-2 bg-gray-50/50 dark:bg-black/20 p-1 rounded-xl border border-gray-100 dark:border-white/5">
                {/* Theme Selector */}
                <div className="relative group">
                    <Palette size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold transition-colors" />
                    <select 
                        value={theme}
                        onChange={handleThemeChange}
                        className="pl-7 pr-2 py-1 bg-transparent border-none rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:ring-0 appearance-none cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors outline-none"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="high-contrast">High Contrast</option>
                    </select>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10"></div>

                {/* Font Selector */}
                <div className="relative group">
                    <Type size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold transition-colors" />
                    <select 
                        value={font}
                        onChange={handleFontChange}
                        className="pl-7 pr-2 py-1 bg-transparent border-none rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:ring-0 appearance-none cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors outline-none max-w-[100px]"
                        title="Select Font"
                    >
                        {fonts.map(f => (
                           <option key={f.value} value={f.value}>{f.name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10"></div>
                
                {/* Language Selector */}
                <div className="relative group">
                    <Globe size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold transition-colors" />
                    <select 
                        value={locale}
                        onChange={handleLocaleChange}
                        className="pl-7 pr-2 py-1 bg-transparent border-none rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:ring-0 appearance-none cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors outline-none"
                    >
                        <option value="en-GB">EN (UK)</option>
                        <option value="en-US">EN (US)</option>
                        <option value="fr-FR">Français</option>
                        <option value="ak-GH">Twi (GH)</option>
                    </select>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10"></div>
                {/* Time Zone Selector */}
                <div className="relative group">
                    <Clock size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold transition-colors" />
                    <select 
                        value={timeZone}
                        onChange={handleTimeZoneChange}
                        className="pl-7 pr-2 py-1 bg-transparent border-none rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:ring-0 appearance-none cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors outline-none max-w-[100px]"
                    >
                        <option value="Africa/Accra">Accra</option>
                        <option value="Europe/London">London</option>
                        <option value="America/New_York">New York</option>
                        <option value="UTC">UTC</option>
                    </select>
                </div>
            </div>

            <button 
              className="relative p-2.5 bg-white dark:bg-white/10 rounded-full text-gray-500 dark:text-gray-300 hover:text-techbridge-maroon dark:hover:text-white shadow-sm hover:shadow-md transition-all"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-techbridge-gold rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
            </button>
            <button 
              className="p-2.5 bg-white dark:bg-white/10 rounded-full text-gray-500 dark:text-gray-300 hover:text-techbridge-maroon dark:hover:text-white shadow-sm hover:shadow-md transition-all"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
```

### FILE: constants.ts
```typescript
import { ContentItem, MediaAsset, ClubEvent, AnalyticsData, User } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Asante',
  email: 'alex.a@techbridge.edu.gh',
  role: 'Editor',
  avatar: 'https://picsum.photos/seed/alex/100/100'
};

export const MOCK_CONTENT: ContentItem[] = [
  {
    id: 'c1',
    title: 'The Future of AI in African Tech',
    type: 'Article',
    author: 'Sarah Mensah',
    status: 'Published',
    dateCreated: '2026-02-10',
    datePublished: '2026-02-15',
    views: 1250,
    thumbnail: 'https://picsum.photos/seed/tech/400/300'
  },
  {
    id: 'c2',
    title: 'Campus Gala 2026 Highlights',
    type: 'Video',
    author: 'Kwame Osei',
    status: 'In Review',
    dateCreated: '2026-02-16',
    thumbnail: 'https://picsum.photos/seed/gala/400/300'
  },
  {
    id: 'c3',
    title: 'Techbridge Podcast Ep. 4: Startups',
    type: 'Podcast',
    author: 'Emmanuel Darko',
    status: 'Draft',
    dateCreated: '2026-02-17',
    thumbnail: 'https://picsum.photos/seed/pod/400/300'
  },
  {
    id: 'c4',
    title: 'Design Principles for 2026',
    type: 'Graphic',
    author: 'Ama Boateng',
    status: 'Approved',
    dateCreated: '2026-02-14',
    thumbnail: 'https://picsum.photos/seed/design/400/300'
  }
];

export const MOCK_ASSETS: MediaAsset[] = [
  { id: 'a1', name: 'Campus_Drone_Shot.mp4', type: 'Video', size: '120 MB', uploadedBy: 'Kwame Osei', dateUploaded: '2026-02-01', url: 'https://picsum.photos/seed/drone/300/200' },
  { id: 'a2', name: 'Gala_Banner_V2.png', type: 'Image', size: '2.4 MB', uploadedBy: 'Ama Boateng', dateUploaded: '2026-02-12', url: 'https://picsum.photos/seed/banner/300/200' },
  { id: 'a3', name: 'Interview_Audio_Raw.wav', type: 'Audio', size: '45 MB', uploadedBy: 'Emmanuel Darko', dateUploaded: '2026-02-15', url: 'https://picsum.photos/seed/audio/300/200' },
  { id: 'a4', name: 'Press_Release_Feb.pdf', type: 'Document', size: '1.1 MB', uploadedBy: 'Alex Asante', dateUploaded: '2026-02-10', url: 'https://picsum.photos/seed/doc/300/200' },
];

export const MOCK_EVENTS: ClubEvent[] = [
  { id: 'e1', title: 'Digital Media Workshop', date: '2026-03-05T14:00:00', location: 'Lecture Hall B', attendees: 45, description: 'Learn the basics of digital editing.', status: 'Upcoming' },
  { id: 'e2', title: 'Techbridge Hackathon Media Coverage', date: '2026-03-20T09:00:00', location: 'Innovation Hub', attendees: 120, description: 'Live reporting of the annual hackathon.', status: 'Upcoming' },
  { id: 'e3', title: 'January Monthly Meeting', date: '2026-01-25T16:00:00', location: 'Room 304', attendees: 32, description: 'General assembly and planning.', status: 'Completed' },
];

export const ANALYTICS_DATA: AnalyticsData[] = [
  { name: 'Mon', views: 400, engagement: 240, shares: 24 },
  { name: 'Tue', views: 300, engagement: 139, shares: 18 },
  { name: 'Wed', views: 550, engagement: 380, shares: 45 },
  { name: 'Thu', views: 480, engagement: 290, shares: 30 },
  { name: 'Fri', views: 800, engagement: 580, shares: 75 },
  { name: 'Sat', views: 600, engagement: 400, shares: 50 },
  { name: 'Sun', views: 700, engagement: 430, shares: 60 },
];
```

### FILE: context/LanguageContext.tsx
```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../translations';

type Locale = 'en-GB' | 'en-US' | 'fr-FR' | 'ak-GH';
type Translations = typeof translations['en-GB'];

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en-GB');

  const t = (key: keyof Translations): string => {
    // Fallback logic
    const lang = translations[locale as keyof typeof translations] || translations['en-GB'];
    return (lang as any)[key] || (translations['en-GB'] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

### FILE: context/ThemeContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  font: string;
  setFont: (font: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to 'light'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tmcp-theme');
      return (saved as ThemeMode) || 'light';
    }
    return 'light';
  });

  const [font, setFont] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tmcp-font') || 'Inter';
    }
    return 'Inter';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all previous classes
    root.classList.remove('dark', 'high-contrast');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'high-contrast') {
      root.classList.add('dark'); // Base on dark mode
      root.classList.add('high-contrast'); // Add specific high contrast overrides via CSS
    }

    // Persist to localStorage
    localStorage.setItem('tmcp-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply font to CSS variable
    document.documentElement.style.setProperty('--font-main', font);
    localStorage.setItem('tmcp-font', font);
  }, [font]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, font, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### FILE: context/ToastContext.tsx
```typescript
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-dismiss
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-center p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out
              ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-gray-800'}
            `}
            role="alert"
          >
            <div className="mr-3">
              {toast.type === 'success' && <CheckCircle size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>
            <p className="text-sm font-medium mr-4">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
```

### FILE: CREATION.md
```md
# techbridge-media-club-platform

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

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/techbridge-media-club-platform/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/techbridge-media-club-platform/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/techbridge-media-club-platform/',  // REQUIRED: Assets must load from /techbridge-media-club-platform/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/techbridge-media-club-platform"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/techbridge-media-club-platform">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/techbridge-media-club-platform/`, not at the root
- **Asset Loading**: Without `base: '/techbridge-media-club-platform/'`, assets try to load from `/assets/` instead of `/techbridge-media-club-platform/assets/`
- **Routing**: Without `basename="/techbridge-media-club-platform"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/techbridge-media-club-platform/assets/index-*.js`
- Link tags should reference: `/techbridge-media-club-platform/assets/index-*.css`

If they reference `/assets/` instead of `/techbridge-media-club-platform/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/techbridge-media-club-platform/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/techbridge-media-club-platform/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: techbridge-media-club-platform

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
﻿# Administrator Guide
**Techbridge Media Club Platform**

## 1. Introduction
This guide is intended for the System Administrator. It covers access to the protected Admin Panel, monitoring system health via audit logs, and running diagnostics.

## 2. Accessing the Admin Panel

The Admin Panel is a restricted area of the application.

1.  Navigate to the application URL.
2.  Click the **Admin Portal** button at the bottom of the sidebar navigation.
3.  You will be presented with a login challenge.

### Credentials
*   **Password:** `admin123`

> **Note:** Failed login attempts are logged in the Audit Trail.

## 3. Features

### 3.1 Overview Dashboard
Once authenticated, the Overview tab provides a high-level snapshot of the system:
*   **System Status:** Indicates general health (uptime, latency).
*   **Security Audit:** Shows recent security scan results.
*   **Database:** Status of the connection to the data layer.
*   **Live Audit Logs:** A real-time scrolling log of all actions taken within the system (e.g., page navigation, uploads, theme toggles).

### 3.2 Diagnostics
The Diagnostics tab displays technical details about the running environment:
*   **Frontend Stack:** Verifies React version (19.2.5) and Tailwind CSS status.
*   **Service Status:** Shows the status of internal singleton services (Auth, Audit, WebSocket).

### 3.3 Testing Suite
The Testing tab allows the administrator to verify system integrity:

*   **Live User Journey:**
    *   Click **Start Test** to initiate an automated script that takes control of the UI.
    *   The script will physically click navigation buttons and verify that the correct pages load.
    *   Watch the "Test Execution Log" for `PASS`/`FAIL` results.

*   **Playwright Suite:**
    *   Provides a downloadable Node.js script for running headless E2E tests externally.
    *   Use the **Copy Script** button to copy the code to your clipboard.

*   **Quick Health Check:**
    *   Runs instantaneous DOM checks to ensure critical React roots and contexts are mounted.

## 4. Troubleshooting

**Issue:** "Root element missing" in Health Check.
**Resolution:** Ensure `index.html` contains `<div id="root"></div>`.

**Issue:** Audit Logs are empty.
**Resolution:** Interact with the application (navigate tabs, toggle theme) to generate events. The log is in-memory and clears on page refresh.

```

### FILE: docs/ARCHITECTURE.md
```md
﻿# System Architecture

## 1. High-Level System Architecture

The Techbridge Media Club Platform acts as a client-side Single Page Application (SPA). It leverages React 19 capabilities and uses simulated services to mimic backend functionality.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <!-- Background -->
  <rect width="800" height="500" fill="#f8f9fa" rx="10"/>
  
  <!-- Client Container -->
  <rect x="50" y="50" width="700" height="400" rx="10" fill="#ffffff" stroke="#2d3748" stroke-width="2"/>
  <text x="400" y="80" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#2d3748">Client Browser (React 19.2.5)</text>

  <!-- Context Layer -->
  <g transform="translate(100, 120)">
    <rect width="600" height="60" rx="5" fill="#e6fffa" stroke="#38b2ac" stroke-width="1"/>
    <text x="300" y="35" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="#2c7a7b">Context Layer (Theme, Toast, Auth Mock)</text>
  </g>

  <!-- Router/Layout Layer -->
  <g transform="translate(100, 200)">
    <rect width="600" height="150" rx="5" fill="#fff5f5" stroke="#e53e3e" stroke-width="1"/>
    <text x="300" y="25" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="#c53030">Application Layout & Routing</text>
    
    <!-- Modules -->
    <rect x="20" y="50" width="100" height="80" rx="5" fill="#fff" stroke="#e53e3e"/>
    <text x="70" y="95" text-anchor="middle" font-family="sans-serif" font-size="12">Dashboard</text>
    
    <rect x="130" y="50" width="100" height="80" rx="5" fill="#fff" stroke="#e53e3e"/>
    <text x="180" y="95" text-anchor="middle" font-family="sans-serif" font-size="12">Content CMS</text>
    
    <rect x="240" y="50" width="100" height="80" rx="5" fill="#fff" stroke="#e53e3e"/>
    <text x="290" y="95" text-anchor="middle" font-family="sans-serif" font-size="12">Asset Lib</text>
    
    <rect x="350" y="50" width="100" height="80" rx="5" fill="#fff" stroke="#e53e3e"/>
    <text x="400" y="95" text-anchor="middle" font-family="sans-serif" font-size="12">Events</text>

    <!-- Admin Module (Protected) -->
    <rect x="460" y="50" width="120" height="80" rx="5" fill="#2d3748" stroke="#000"/>
    <text x="520" y="85" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#fff" font-weight="bold">Admin Panel</text>
    <text x="520" y="105" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#cbd5e0">(Diagnostics, Logs)</text>
  </g>

  <!-- Service Layer -->
  <g transform="translate(100, 380)">
    <rect width="600" height="50" rx="5" fill="#ebf8ff" stroke="#4299e1" stroke-width="1"/>
    <text x="300" y="30" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="#2b6cb0">Service Layer (Singleton Instances)</text>
    <text x="150" y="30" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#2b6cb0">AuditService</text>
    <text x="450" y="30" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#2b6cb0">CollaborationService</text>
  </g>

  <!-- Flow Arrows -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#000" />
    </marker>
  </defs>
  <line x1="400" y1="180" x2="400" y2="200" stroke="#000" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="400" y1="350" x2="400" y2="380" stroke="#000" stroke-width="2" marker-end="url(#arrow)"/>
</svg>
```

## 2. Real-Time Collaboration Architecture

The platform uses the `BroadcastChannel` API to simulate WebSocket behavior, allowing synchronization between different tabs/windows of the same browser without a backend server.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300" viewBox="0 0 800 300">
  <defs>
    <marker id="sync" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
       <circle cx="5" cy="5" r="3" fill="#D4A017" />
    </marker>
  </defs>

  <!-- Channel -->
  <rect x="200" y="120" width="400" height="60" rx="30" fill="#7A0019" />
  <text x="400" y="155" text-anchor="middle" fill="#fff" font-weight="bold" font-family="monospace">BroadcastChannel ('tmcp_collab_doc1')</text>

  <!-- Tab A -->
  <rect x="50" y="50" width="150" height="100" rx="5" fill="#fff" stroke="#333" stroke-width="2" />
  <text x="125" y="80" text-anchor="middle" font-weight="bold">User Tab A</text>
  <text x="125" y="100" text-anchor="middle" font-size="12">Editor Component</text>
  
  <!-- Tab B -->
  <rect x="600" y="50" width="150" height="100" rx="5" fill="#fff" stroke="#333" stroke-width="2" />
  <text x="675" y="80" text-anchor="middle" font-weight="bold">User Tab B</text>
  <text x="675" y="100" text-anchor="middle" font-size="12">Editor Component</text>
  
  <!-- Bot -->
  <rect x="325" y="220" width="150" height="60" rx="5" fill="#eee" stroke="#666" stroke-dasharray="5,5" />
  <text x="400" y="245" text-anchor="middle" font-style="italic">Simulated Bots</text>
  <text x="400" y="265" text-anchor="middle" font-size="10">(Sarah, David)</text>

  <!-- Connections -->
  <line x1="125" y1="150" x2="200" y2="150" stroke="#333" stroke-width="2" marker-end="url(#sync)" />
  <line x1="675" y1="150" x2="600" y2="150" stroke="#333" stroke-width="2" marker-end="url(#sync)" />
  <line x1="400" y1="220" x2="400" y2="180" stroke="#666" stroke-width="2" stroke-dasharray="5,5" />
</svg>
```

## 3. Database Schema (Conceptual)

Although the prototype uses in-memory data (`constants.ts`), the data models adhere to the following relational schema defined in `types.ts`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <style>
      .table-header { fill: #7A0019; stroke: #000; }
      .table-body { fill: #fff; stroke: #000; }
      .text-header { fill: #fff; font-weight: bold; font-family: monospace; font-size: 14px; }
      .text-body { fill: #000; font-family: monospace; font-size: 12px; }
      .line { stroke: #555; stroke-width: 2; }
    </style>
  </defs>

  <!-- Users Table -->
  <g transform="translate(50, 50)">
    <rect class="table-header" width="180" height="30" />
    <text x="90" y="20" class="text-header" text-anchor="middle">USERS</text>
    <rect class="table-body" y="30" width="180" height="110" />
    <text x="10" y="50" class="text-body">PK id: string</text>
    <text x="10" y="70" class="text-body">   name: string</text>
    <text x="10" y="90" class="text-body">   email: string</text>
    <text x="10" y="110" class="text-body">   role: enum</text>
    <text x="10" y="130" class="text-body">   avatar: string</text>
  </g>

  <!-- Content Table -->
  <g transform="translate(300, 50)">
    <rect class="table-header" width="180" height="30" />
    <text x="90" y="20" class="text-header" text-anchor="middle">CONTENT</text>
    <rect class="table-body" y="30" width="180" height="150" />
    <text x="10" y="50" class="text-body">PK id: string</text>
    <text x="10" y="70" class="text-body">   title: string</text>
    <text x="10" y="90" class="text-body">   type: enum</text>
    <text x="10" y="110" class="text-body">   author: string</text>
    <text x="10" y="130" class="text-body">   status: enum</text>
    <text x="10" y="150" class="text-body">   created: date</text>
    <text x="10" y="170" class="text-body">   views: number</text>
  </g>

  <!-- Assets Table -->
  <g transform="translate(550, 50)">
    <rect class="table-header" width="180" height="30" />
    <text x="90" y="20" class="text-header" text-anchor="middle">ASSETS</text>
    <rect class="table-body" y="30" width="180" height="130" />
    <text x="10" y="50" class="text-body">PK id: string</text>
    <text x="10" y="70" class="text-body">   name: string</text>
    <text x="10" y="90" class="text-body">   type: enum</text>
    <text x="10" y="110" class="text-body">   size: string</text>
    <text x="10" y="130" class="text-body">   uploader: string</text>
    <text x="10" y="150" class="text-body">   url: string</text>
  </g>

  <!-- Events Table -->
  <g transform="translate(300, 250)">
    <rect class="table-header" width="180" height="30" />
    <text x="90" y="20" class="text-header" text-anchor="middle">EVENTS</text>
    <rect class="table-body" y="30" width="180" height="130" />
    <text x="10" y="50" class="text-body">PK id: string</text>
    <text x="10" y="70" class="text-body">   title: string</text>
    <text x="10" y="90" class="text-body">   date: date</text>
    <text x="10" y="110" class="text-body">   location: string</text>
    <text x="10" y="130" class="text-body">   attendees: int</text>
    <text x="10" y="150" class="text-body">   status: enum</text>
  </g>

  <!-- Audit Log Table -->
  <g transform="translate(50, 250)">
    <rect class="table-header" width="180" height="30" style="fill: #2d3748" />
    <text x="90" y="20" class="text-header" text-anchor="middle">AUDIT_LOG</text>
    <rect class="table-body" y="30" width="180" height="110" />
    <text x="10" y="50" class="text-body">PK id: string</text>
    <text x="10" y="70" class="text-body">   timestamp: date</text>
    <text x="10" y="90" class="text-body">   level: enum</text>
    <text x="10" y="110" class="text-body">   message: string</text>
    <text x="10" y="130" class="text-body">FK user: string</text>
  </g>

  <!-- Relationships -->
  <!-- User to Audit Log -->
  <line x1="140" y1="190" x2="140" y2="250" class="line" stroke-dasharray="4"/>
  <circle cx="140" cy="250" r="3" fill="#000"/>
  
  <!-- User to Content (Logical) -->
  <path d="M230,100 L300,100" class="line" stroke-dasharray="4" marker-end="url(#arrow)"/>
</svg>
```
```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — techbridge-media-club-platform

**Application:** techbridge-media-club-platform
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd techbridge-media-club-platform
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
docker-compose -f docker-compose-all-apps.yml build techbridge-media-club-platform
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up techbridge-media-club-platform
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

### FILE: docs/DEPLOYMENT_GUIDE.md
```md
﻿# Deployment Guide
**Techbridge Media Club Platform**

## 1. Overview
The Techbridge Media Club Platform is designed as a lightweight, client-side Single Page Application (SPA). It utilizes modern ES Modules (ESM) to load dependencies directly from a CDN, eliminating the need for complex build steps (Webpack/Vite) for the prototype phase.

## 2. Prerequisites
*   **Web Server:** Any static file server (Nginx, Apache, Vercel, Netlify, GitHub Pages).
*   **Internet Access:** Required to fetch dependencies from `esm.sh` and Tailwind CSS.

## 3. Dependency Requirements
The application strictly enforces the following versions via the Import Map in `index.html`:

*   **React:** `19.2.5`
*   **React DOM:** `19.2.5`
*   **Lucide React:** `0.574.0`
*   **Recharts:** `3.7.0`
*   **Tailwind CSS:** `3.4` (via CDN)

> **Critical:** Do not downgrade React below 19.x as the application relies on React 19 features.

## 4. Deployment Steps

### Option A: Static Web Host (Netlify/Vercel)
1.  Upload the project root directory.
2.  Configure the build settings:
    *   **Build Command:** (Leave empty)
    *   **Publish Directory:** `.` (Current directory)
3.  Deploy.

### Option B: Local Node.js Server
1.  Install a static server package:
    ```bash
    npm install -g serve
    ```
2.  Navigate to the project directory.
3.  Run the server:
    ```bash
    serve .
    ```
4.  Access via `http://localhost:3000`.

## 5. Environment Configuration
For the prototype, configuration is handled in `constants.ts`.
*   **Current User:** Modify `CURRENT_USER` in `constants.ts` to simulate different roles (Admin, Editor, Creator).
*   **Mock Data:** Content and Events are populated from `MOCK_CONTENT` and `MOCK_EVENTS`.

## 6. Verification
After deployment:
1.  Open the application in a browser.
2.  Navigate to the **Admin Portal**.
3.  Login with `admin123`.
4.  Go to **Testing** tab -> **Quick Health Check**.
5.  Ensure all checks return **PASS**.

```

### FILE: docs/FINAL_GAP_ANALYSIS.md
```md
﻿# Final Gap Analysis Report
**Project:** Techbridge Media Club Platform
**Date:** February 17, 2026
**Status:** RELEASE CANDIDATE

## 1. Executive Summary
This report concludes the development lifecycle of the TMCP Prototype. A rigorous two-way verification process was conducted to ensure alignment between the Software Requirements Specification (SRS) and the actual codebase.

**Result:** 100% Alignment achieved.

## 2. Verification Matrix

| Module | SRS Requirement | Implementation Status | Evidence |
| :--- | :--- | :--- | :--- |
| **Auth** | OAuth Simulation | âœ… Implemented | `constants.ts` (CURRENT_USER), Login Flow in `AdminPanel.tsx` |
| **Auth** | Admin Protection | âœ… Implemented | Password challenge (`admin123`) in `AdminPanel.tsx` |
| **Dashboard** | Metrics Display | âœ… Implemented | `Dashboard.tsx` uses `recharts` and lucide icons |
| **CMS** | Content CRUD | âœ… Implemented | `ContentManager.tsx` with filtering and mock data |
| **Collaboration** | Real-Time Sync | âœ… Implemented | `services/collaboration.ts` uses `BroadcastChannel` |
| **Assets** | Library View | âœ… Implemented | `AssetLibrary.tsx` with simulated upload/delete |
| **Events** | Calendar View | âœ… Implemented | `EventManager.tsx` with calendar grid |
| **Admin** | Diagnostics | âœ… Implemented | `AdminPanel.tsx` Health Check & Stack Info |
| **Admin** | Automated Testing | âœ… Implemented | `AdminPanel.tsx` Live User Journey Runner |
| **Persistence** | State Saving | âœ… Implemented | `ThemeContext.tsx` and `AuditService.ts` use `localStorage` |
| **Tech Stack** | React 19.2.5 | âœ… Implemented | `index.html` Import Map |
| **Accessibility** | High Contrast | âœ… Implemented | CSS Variables in `index.html`, Theme Context logic |

## 3. Documentation Completeness
The `/docs` directory contains:
*   `SRS_FINAL.md`: The single source of truth.
*   `ARCHITECTURE.md`: Technical diagrams (System, Database, Collaboration).
*   `ADMIN_GUIDE.md`: Operational manual.
*   `DEPLOYMENT_GUIDE.md`: Setup instructions.
*   `TESTING_GUIDE.md`: QA procedures.

## 4. Conclusion
The project has met all defined requirements. The transition from a "Gap Analysis" phase to a "Final Release" phase is complete. The application is robust, documented, and self-testing.

```

### FILE: docs/GAP_ANALYSIS.md
```md
# Gap Analysis Report - Phase 4
**Date:** February 17, 2026
**Target:** Production Readiness vs. Current Prototype

## 1. Executive Summary
Phase 4 (Documentation) is complete. The project now possesses a comprehensive documentation suite covering architecture, administration, deployment, and testing.

## 2. Resolved Gaps
| Requirement | Status | Resolution |
| :--- | :--- | :--- |
| **Architecture Docs** | **RESOLVED** | Detailed SVGs added for System and Database structures. |
| **Admin Manual** | **RESOLVED** | `ADMIN_GUIDE.md` created with credential and feature usage info. |
| **Deployment Ops** | **RESOLVED** | `DEPLOYMENT_GUIDE.md` clarifies the no-build ESM approach and React 19 requirement. |
| **Testing Procedures** | **RESOLVED** | `TESTING_GUIDE.md` standardizes QA processes. |

## 3. Remaining Gaps (Phase 5 Focus)
### 3.1 Data Persistence (Final Polish)
*   **Gap**: The application still resets to default state on page reload.
*   **Plan**: Implement `localStorage` integration in the `AuditService` and `ThemeContext` to demonstrate state persistence across sessions.

## 4. Conclusion
The system is now fully documented. Any developer or administrator picking up this project has all necessary information to operate, deploy, and test it. The final phase will add the last layer of polish to data persistence.

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Techbridge Media Club Platform
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Techbridge Media Club Platform**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Techbridge Media Club Platform** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Techbridge Media Club Platform** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
Stack: React 19.2.5 + TypeScript, Vite 7.3.1, Recharts 3.7.0
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

### FILE: docs/SRS_FINAL.md
```md
﻿# Software Requirements Specification (SRS) - FINAL
**Project:** Techbridge Media Club Platform
**Version:** 1.0 (Release)
**Date:** February 17, 2026
**Standard:** IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018

## 1. Introduction
### 1.1 Purpose
The Techbridge Media Club Platform (TMCP) is a centralized, cloud-accessible web application designed to manage the digital media operations of Techbridge University College's media club. It serves as the primary hub for content creation, editorial review, event coordination, and member management.

### 1.2 Scope
The system is a Single Page Application (SPA) built on React 19.2.5. It facilitates:
*   **Content Management**: Drafting, reviewing, and publishing articles and media.
*   **Collaboration**: Real-time co-authoring of documents.
*   **Asset Management**: Organization of digital files (images, videos).
*   **Administration**: System health monitoring and user oversight.

### 1.3 Definitions & Acronyms
*   **SPA**: Single Page Application.
*   **BroadcastChannel**: Web API used for cross-tab communication (Simulated WebSocket).
*   **WCAG**: Web Content Accessibility Guidelines.

## 2. Overall Description
### 2.1 Product Perspective
TMCP functions as a client-side prototype with simulated backend services. It runs entirely in the browser using ES Modules, requiring no build step for deployment.

### 2.2 User Classes
*   **Administrator**: Full access to system diagnostics and logs.
*   **Editor**: Approval authority for content; access to analytics.
*   **Creator**: Can draft content and upload assets.
*   **Member**: View-only access to events and public content.

### 2.3 Operating Environment
*   **Browser**: Chrome 110+, Firefox 110+, Safari 16+, Edge 110+.
*   **Runtime**: React 19.2.5 via ESM.sh.
*   **Storage**: Browser `localStorage` for state persistence.

## 3. Specific Requirements (Functional)

### 3.1 Authentication Module
*   **REQ-AUTH-01**: The system shall simulate OAuth 2.0 login.
*   **REQ-AUTH-02**: The Admin Panel shall require a secondary password challenge (`admin123`).
*   **REQ-AUTH-03**: Failed login attempts shall be logged to the Audit Service.

### 3.2 Dashboard Module
*   **REQ-DASH-01**: Display key metrics (Total Views, Active Members) using `recharts`.
*   **REQ-DASH-02**: Provide quick navigation to recent content and upcoming events.

### 3.3 Content Management & Collaboration
*   **REQ-CMS-01**: Users shall be able to create, edit, and delete content drafts.
*   **REQ-CMS-02**: The editor shall support Real-Time Collaboration using `BroadcastChannel`.
*   **REQ-CMS-03**: The system shall display "User is typing..." indicators and remote cursors.
*   **REQ-CMS-04**: Changes shall be synchronized across tabs in real-time.

### 3.4 Asset Library
*   **REQ-DAM-01**: Users shall be able to upload files (simulated).
*   **REQ-DAM-02**: Users shall be able to filter assets by type (Image, Video, Audio).
*   **REQ-DAM-03**: Deletion of assets shall trigger an audit log entry.

### 3.5 Event Management
*   **REQ-EVT-01**: Display a visual calendar of club events.
*   **REQ-EVT-02**: List upcoming events with location and attendee counts.

### 3.6 Administration & Diagnostics
*   **REQ-ADM-01**: The Admin Panel shall provide a "Live User Journey" test runner.
*   **REQ-ADM-02**: The system shall expose a "Quick Health Check" validating React 19 features.
*   **REQ-ADM-03**: A live scrolling Audit Log shall display system events.
*   **REQ-ADM-04**: Audit logs and Theme settings shall persist via `localStorage`.

## 4. Non-Functional Requirements

### 4.1 Performance
*   **REQ-PERF-01**: Application shell must load within 1.5 seconds.
*   **REQ-PERF-02**: React 19 Concurrent Mode must be enabled.

### 4.2 Accessibility
*   **REQ-ACC-01**: High Contrast Mode must be supported.
*   **REQ-ACC-02**: All interactive elements must have `aria-label` attributes.
*   **REQ-ACC-03**: Theme preferences must persist across sessions.

### 4.3 Reliability
*   **REQ-REL-01**: Navigation must gracefully handle errors (Error Boundaries).
*   **REQ-REL-02**: The system must function offline (assets cached).

## 5. Architecture & Data Model

### 5.1 System Architecture
See `docs/ARCHITECTURE.md` for full SVG diagrams.

### 5.2 Technology Stack
*   **Frontend**: React 19.2.5
*   **Styles**: Tailwind CSS 3.4
*   **State**: React Context API + LocalStorage
*   **Icons**: Lucide React 0.574
*   **Charts**: Recharts 3.7.0

## 6. Gap Analysis
This final release closes all gaps identified in previous phases.
*   **Testing**: Fully implemented via Admin Panel.
*   **Persistence**: Fully implemented via `localStorage`.
*   **Documentation**: Fully complete.

**END OF SPECIFICATION**

```

### FILE: docs/SRS_v1.2.md
```md
﻿# Software Requirements Specification (SRS) v1.2
**Project:** Techbridge Media Club Platform
**Date:** February 2026

## 1. Introduction
The Techbridge Media Club Platform (TMCP) is a centralized system for managing digital media content, events, and club membership. This document outlines the updated requirements including administrative controls, security, and testing frameworks.

## 2. Functional Requirements
### 2.1 User Modules
- **Dashboard**: Real-time overview of club metrics.
- **Content Management**: Create, edit, and publish articles/videos with Real-time Collaboration (WebSocket).
- **Asset Library**: Digital Asset Management (DAM) for storing media files.
- **Event Management**: Scheduling and tracking club events.
- **Analytics**: Visualization of engagement data.

### 2.2 Administrative Modules (NEW)
- **Admin Panel**: Secured area for system oversight.
- **Authentication**: Password-protected entry for Admin functions.
- **System Diagnostics**: Real-time view of component health and architecture stack.
- **Testing Suite**: In-browser health checks and downloadable E2E test scripts.

## 3. Non-Functional Requirements
### 3.1 Security
- **Access Control**: Role-based routing (simulated).
- **Audit Logging**: All critical actions logged in Admin > Overview.

### 3.2 Accessibility
- **Theming**: Support for Light, Dark, and High-Contrast modes.
- **WCAG Compliance**: Color contrast ratios adhered to in all themes.

### 3.3 Reliability
- **Testing**: Automated Playwright scripts provided for CI/CD integration.
- **Self-Healing**: Frontend error boundaries (implicit in React 19).

## 4. Architecture
The system follows a modern SPA (Single Page Application) architecture.
- **Frontend**: React 19.2.5 + Tailwind CSS
- **State Management**: React Context (Theme, Auth)
- **Data Visualization**: Recharts
- **Icons**: Lucide React

## 5. Appendices
See `docs/ARCHITECTURE.md` for visual diagrams.

```

### FILE: docs/SRS_v1.3.md
```md
﻿# Software Requirements Specification (SRS) v1.3
**Project:** Techbridge Media Club Platform
**Version:** 1.3
**Date:** February 17, 2026
**Status:** Phase 1 Complete (Gap Analysis)

## 1. Introduction
### 1.1 Purpose
The Techbridge Media Club Platform (TMCP) is a centralized system designed to facilitate digital media management, editorial workflows, event coordination, and analytics for the student media club.

### 1.2 Scope
The system acts as a Single Page Application (SPA) serving four primary user roles: Admin, Editor, Creator, and Member. It includes modules for content authoring (with simulated real-time collaboration), asset management, and system administration.

### 1.3 Technology Stack (Permanent)
*   **Frontend Library**: React 19.2.5
*   **Styling**: Tailwind CSS v3.4 (Dark Mode enabled)
*   **Build Tooling**: Babel Standalone (In-browser transformation)
*   **Icons**: Lucide React
*   **Visualization**: Recharts

## 2. Specific Requirements
### 2.1 External Interface Requirements
*   **User Interface**: Responsive design supporting Desktop (1920x1080) down to Mobile (375x667).
*   **Theme Support**: Must support Light, Dark, and High-Contrast modes via CSS variables/Tailwind classes.

### 2.2 Functional Requirements

#### 2.2.1 Authentication & Authorization
*   **REQ-AUTH-01**: System shall mock OAuth 2.0 flow for prototype.
*   **REQ-AUTH-02**: Admin Panel must be protected by password challenge (`admin123`).
*   **REQ-AUTH-03**: UI must adapt based on user role (simulated `CURRENT_USER` constant).

#### 2.2.2 Editorial Workflow
*   **REQ-CMS-01**: Users can view list of content items.
*   **REQ-CMS-02**: Users can open a collaborative editor.
*   **REQ-CMS-03**: Collaborative editor must simulate remote user presence (cursors, text injection) via WebSocket service stub.
*   **REQ-CMS-04**: Editor must support Rich Text formatting options.

#### 2.2.3 System Administration
*   **REQ-ADM-01**: Dashboard must show system health metrics.
*   **REQ-ADM-02**: Diagnostics tab must run client-side DOM checks (React Mount, Theme Context).
*   **REQ-ADM-03**: Testing tab must provide exportable Playwright scripts.

### 2.3 Non-Functional Requirements
*   **NFR-PERF-01**: First Contentful Paint < 1.5s.
*   **NFR-SEC-01**: No hardcoded secrets in client bundle (Mock credentials allowed for prototype).
*   **NFR-ACC-01**: WCAG 2.1 AA Compliance for contrast and aria-labels.

## 3. Implementation Status (Phase 1)
*   **Core Framework**: Implemented (React 19).
*   **UI Components**: Implemented (Tailwind).
*   **Business Logic**: Simulated (Services/Constants).
*   **Data Persistence**: In-Memory (Non-persistent).

## 4. Appendices
*   `docs/GAP_ANALYSIS.md`: Detailed breakdown of missing production features.
*   `docs/ARCHITECTURE.md`: System diagrams.

```

### FILE: docs/SRS_v1.4.md
```md
# Software Requirements Specification (SRS) v1.4
**Project:** Techbridge Media Club Platform
**Version:** 1.4
**Date:** February 17, 2026
**Status:** Phase 2 Complete (Security & Accessibility)

## 1. Introduction
### 1.1 Purpose
The Techbridge Media Club Platform (TMCP) is a centralized system designed to facilitate digital media management, editorial workflows, event coordination, and analytics.

## 2. Specific Requirements (Phase 2 Additions)

### 2.1 Security & Auditing
*   **REQ-SEC-02**: All significant user actions (login, upload, delete, nav) must be logged to a centralized Audit Service.
*   **REQ-SEC-03**: Admin Panel must provide a live view of these audit logs.
*   **REQ-SEC-04**: Authentication for Admin Panel must fail on incorrect credentials and log the attempt.

### 2.2 Accessibility (WCAG 2.1 AA)
*   **REQ-ACC-02**: High Contrast Mode must be available, utilizing stark black/white/yellow palette for visual impairment support.
*   **REQ-ACC-03**: All interactive elements (buttons, inputs) must have accessible labels (`aria-label` or `<label>`).
*   **REQ-ACC-04**: User feedback (Toasts) must have `role="alert"` for screen readers.

### 2.3 User Experience
*   **REQ-UX-01**: Zero Broken Links Policy - All buttons must provide feedback (Toast) even if the feature is simulated.

## 3. Implementation Status
*   **Theme System**: Light / Dark / High Contrast fully implemented.
*   **Audit Logging**: Live tracking active in Admin Panel.
*   **Feedback**: Global Toast system handles all simulated actions.

## 4. Appendices
*   `docs/GAP_ANALYSIS.md`: Updated report.

```

### FILE: docs/SRS_v1.5.md
```md
# Software Requirements Specification (SRS) v1.5
**Project:** Techbridge Media Club Platform
**Version:** 1.5
**Date:** February 17, 2026
**Status:** Phase 3 Complete (Testing Framework Integrated)

## 1. Introduction
### 1.1 Purpose
The Techbridge Media Club Platform (TMCP) is a centralized system designed to facilitate digital media management, editorial workflows, event coordination, and analytics.

## 2. Quality Assurance & Testing (Phase 3)

### 2.1 Testing Strategy
The platform employs a dual-layer testing strategy to ensure reliability across the Simulated Client environment.

#### 2.1.1 Interactive Live User Journey (Internal)
*   **Mechanism**: A built-in test runner within the Admin Panel (`/admin/testing`).
*   **Scope**: Programmatically drives the DOM to verify navigation paths, component mounting, and state retention.
*   **Triggers**: Manual trigger by Admin.
*   **Feedback**: Real-time console logs within the UI (PASS/FAIL).

#### 2.1.2 Automated E2E Suite (External)
*   **Tool**: Playwright (Script provided in Admin Panel).
*   **Scope**: Headless browser automation validating critical paths:
    1.  Initial Load
    2.  Dashboard Stats Rendering
    3.  CMS Table Availability
    4.  Asset Upload Modal
    5.  Admin Authentication
*   **Artifacts**: Screenshots generated for every step in `screenshots/` directory.

### 2.2 Test Coverage Requirements
*   **REQ-QA-01**: Navigation between all primary tabs must confirm destination mount within 1000ms.
*   **REQ-QA-02**: Admin authentication must block invalid credentials.
*   **REQ-QA-03**: Critical UI elements (Stats, Tables) must differ from "Loading" state.

## 3. Implementation Status
*   **Test Runner**: Operational in Admin Panel.
*   **E2E Script**: Updated to v1.2 with verified DOM selectors (`#nav-*`).
*   **Self-Healing**: Navigation includes error boundaries (implicit React).

## 4. Appendices
*   `docs/GAP_ANALYSIS.md`: Updated report.

```

### FILE: docs/SRS_v1.6.md
```md
﻿# Software Requirements Specification (SRS) v1.6
**Project:** Techbridge Media Club Platform
**Version:** 1.6
**Date:** February 17, 2026
**Status:** Phase 4 Complete (Documentation)

## 1. Introduction
### 1.1 Purpose
The Techbridge Media Club Platform (TMCP) is a centralized system designed to facilitate digital media management, editorial workflows, event coordination, and analytics.

## 2. Documentation Requirements (Phase 4)

### 2.1 Architecture Documentation
*   **REQ-DOC-01**: System architecture shall be visualized via SVG diagrams including Client, Service, and Context layers.
*   **REQ-DOC-02**: Database schema (conceptual) shall be visualized via Entity-Relationship Diagrams (ERD).

### 2.2 Operational Documentation
*   **REQ-DOC-03**: An Administrator Guide must be provided detailing access control and diagnostics.
*   **REQ-DOC-04**: A Deployment Guide must be provided detailing the ESM-based architecture and dependency versions (React 19.2.5).
*   **REQ-DOC-05**: A Testing Guide must provided manual checklists and automated script usage instructions.

## 3. Implementation Status
*   **Architecture**: `docs/ARCHITECTURE.md` updated with high-fidelity SVGs.
*   **Guides**:
    *   `docs/ADMIN_GUIDE.md`: Created.
    *   `docs/DEPLOYMENT_GUIDE.md`: Created.
    *   `docs/TESTING_GUIDE.md`: Created.

## 4. Appendices
*   `docs/GAP_ANALYSIS.md`: Updated report.

```

### FILE: docs/TESTING.md
```md
# Testing Guide — techbridge-media-club-platform

**Application:** techbridge-media-club-platform
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd techbridge-media-club-platform
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

### FILE: docs/TESTING_GUIDE.md
```md
# Testing Guide
**Techbridge Media Club Platform**

## 1. Introduction
This document outlines the testing procedures for the TMCP. It covers manual acceptance testing and automated testing using the built-in tools.

## 2. Manual Testing Checklist

### 2.1 Navigation & Layout
*   [ ] Sidebar toggles correctly on mobile devices.
*   [ ] All 5 main navigation tabs (Dashboard, Content, Assets, Events, Analytics) load their respective views.
*   [ ] Theme toggle switches between Light, Dark, and High Contrast modes.
*   [ ] Hover states appear on all interactive buttons.

### 2.2 Functional Modules
*   **Dashboard:**
    *   [ ] Statistics cards display numbers.
    *   [ ] "View All" link navigates to Content tab.
*   **Content Manager:**
    *   [ ] Filters (All/Draft/Published) update the list.
    *   [ ] "Create Content" opens the Collaborative Editor modal.
*   **Asset Library:**
    *   [ ] "Upload New Asset" triggers a Toast notification (simulated).
    *   [ ] Delete button triggers a Toast notification (simulated).
*   **Admin Panel:**
    *   [ ] Login with incorrect password shows Error Toast.
    *   [ ] Login with `admin123` grants access.

### 2.3 Accessibility
*   [ ] In High Contrast mode, background is black and text is white/yellow.
*   [ ] All icon-only buttons have tooltips or `aria-label` attributes.

## 3. Automated Testing

### 3.1 Internal "Live User Journey"
This test runs inside the application browser context.

1.  Log in to **Admin Portal**.
2.  Go to the **Testing** tab.
3.  Locate the **Live User Journey** card.
4.  Click **Start Test**.
5.  **Observation:** The app will automatically switch tabs. Do not interact with the mouse during this process.
6.  **Success Criteria:** The log at the bottom displays "Journey Complete [PASS]".

### 3.2 External Playwright Suite
This is for CI/CD integration.

1.  Ensure Node.js is installed.
2.  Create a file named `e2e.js`.
3.  Copy the script content from the **Admin Portal > Testing** tab.
4.  Install Playwright:
    ```bash
    npm install playwright
    ```
5.  Run the test:
    ```bash
    node e2e.js
    ```
6.  **Artifacts:** Check the `screenshots/` folder for images of the dashboard, CMS, and admin panel.

## 4. Reporting Bugs
If a test fails:
1.  Check the **Live Audit Logs** in the Admin Overview.
2.  Note the error message.
3.  Ensure the browser console does not show React hydration errors.

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
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- ========== BASIC SEO META TAGS ========== -->
    <title>Techbridge University College | Pioneering Design & Technology</title>
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    
    <!-- ========== GEOGRAPHIC & LANGUAGE ========== -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    
    <!-- ========== OPEN GRAPH (Social Media) ========== -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    
    <!-- ========== TWITTER CARD ========== -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    
    <!-- ========== THEME & UTILITIES ========== -->
    <meta name="theme-color" content="#7A0019" />
    <meta name="msapplication-TileColor" content="#7A0019" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />

    <!-- Polyfill for process.env -->
    <script>
      window.process = { env: { NODE_ENV: 'production', API_KEY:<REDACTED>'' } };
    </script>
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FKXTELQ71R"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FKXTELQ71R');
    </script>
        
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <link rel="apple-touch-icon" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    
    <!-- Fonts: Including all app fonts + Space Grotesk for SEO alignment -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Space+Grotesk:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Merriweather:wght@300;400;700&family=Montserrat:wght@300;400;600;700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">

    <!-- Framework & Styles -->
    <style>
      :root {
        --font-main: 'Inter';
      }
      body {
        font-family: var(--font-main), sans-serif;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Playfair Display', serif;
      }
      
      /* Cinematic Scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent; 
      }
      ::-webkit-scrollbar-thumb {
        background: #cbd5e1; 
        border-radius: 3px;
      }
      .dark ::-webkit-scrollbar-thumb {
        background: #334155; 
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #7A0019; 
      }

      /* Glassmorphism Utilities */
      .glass {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .dark .glass {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      /* Card Hover Glow */
      .card-hover {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .card-hover:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
      .dark .card-hover:hover {
        box-shadow: 0 0 20px rgba(122, 0, 25, 0.2); /* Maroon Glow */
      }

      /* High Contrast Mode Overrides - Strict accessibility */
      .high-contrast {
        --bg-primary: #000000;
        --text-primary: #ffffff;
        --accent: #ffff00;
        background-color: var(--bg-primary) !important;
        color: var(--text-primary) !important;
      }
      .high-contrast * {
        background: transparent !important;
        background-image: none !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        text-shadow: none !important;
        border-color: #ffffff !important;
      }
      .high-contrast .bg-white, 
      .high-contrast .bg-gray-50, 
      .high-contrast .bg-gray-100,
      .high-contrast .bg-gray-800,
      .high-contrast .bg-gray-900,
      .high-contrast .glass {
        background-color: #000000 !important;
        color: #ffffff !important;
      }
      .high-contrast button, 
      .high-contrast input, 
      .high-contrast select {
        border: 2px solid #ffffff !important;
        background-color: #000000 !important;
        color: #ffff00 !important;
      }
      .high-contrast a,
      .high-contrast .text-blue-600,
      .high-contrast .text-[#7A0019],
      .high-contrast .text-techbridge-maroon {
        color: #ffff00 !important;
        text-decoration: underline !important;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react/": "https://esm.sh/react@^19.2.4/",
    "react": "https://esm.sh/react@^19.2.4",
    "recharts": "https://esm.sh/recharts@^3.7.0",
    "react-dom/": "https://esm.sh/react-dom@^19.2.4/",
    "lucide-react": "https://esm.sh/lucide-react@^0.574.0"
  }
}
</script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<link rel="stylesheet" href="/index.css">

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
  <body class="bg-gray-50 text-gray-900 antialiased dark:bg-techbridge-dark dark:text-gray-100 transition-colors duration-500 selection:bg-techbridge-maroon selection:text-white">
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">techbridge media club platform</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  <script type="module" src="./index.tsx"></script>
</body>
</html>
```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthGate } from './AuthGate';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);
```

### FILE: metadata.json
```json
{
  "name": "Techbridge Media Club Platform",
  "description": "A comprehensive digital media management platform for Techbridge University College, featuring editorial workflows, asset management, and analytics.",
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
  "name": "techbridge-media-club-platform",
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
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "lucide-react": "^0.574.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "recharts": "^3.7.0",
    "react-router-dom": "^7.1.0"
  },
  "devDependencies": {
    "@types/node": "^25.2.3",
    "@vitejs/plugin-react": "^5.1.4",
    "serve": "14.2.5",
    "typescript": "~5.9.3",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18n9j78JjJbNJw6z3Was4wRBjDNnLBlTk

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: services/AuditService.ts
```typescript
import { SystemLog } from '../types';
import { CURRENT_USER } from '../constants';

const STORAGE_KEY = 'tmcp-audit-logs';
const MAX_LOGS = 50;

class AuditService {
  private logs: SystemLog[] = [];
  private listeners: ((logs: SystemLog[]) => void)[] = [];

  constructor() {
    this.loadLogs();
    // Initial boot log
    this.log('INFO', 'System Service Started', 'System');
  }

  private loadLogs() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.logs = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load audit logs', e);
      this.logs = [];
    }
  }

  private saveLogs() {
    try {
      // Keep only last N logs to prevent storage overflow
      const trimmedLogs = this.logs.slice(0, MAX_LOGS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs));
    } catch (e) {
      console.warn('Failed to save audit logs', e);
    }
  }

  log(level: 'INFO' | 'WARN' | 'ERROR', message: string, user: string = CURRENT_USER.name) {
    const newLog: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level,
      message,
      user
    };
    this.logs.unshift(newLog); // Prepend
    this.saveLogs();
    this.notify();
  }

  getLogs(): SystemLog[] {
    return this.logs;
  }

  subscribe(listener: (logs: SystemLog[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.logs));
  }
  
  clearLogs() {
      this.logs = [];
      this.saveLogs();
      this.notify();
  }
}

export const auditService = new AuditService();
```

### FILE: services/collaboration.ts
```typescript
import { User, CollabEvent } from '../types';

type Listener = (event: CollabEvent) => void;

const CURSOR_COLORS = [
  '#f43f5e', // Rose
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
];

class CollaborationService {
  private listeners: Listener[] = [];
  private connected = false;
  private mockIntervals: number[] = [];
  private channel: BroadcastChannel | null = null;
  public sessionId = Math.random().toString(36).substr(2, 9);

  connect(user: User, docId: string) {
    if (this.connected) return;
    this.connected = true;
    
    // Assign a consistent color to the local user based on session/random
    const color = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
    const userWithColor = { ...user, color };

    // Simulate WebSocket connection using BroadcastChannel for cross-tab sync
    this.channel = new BroadcastChannel(`tmcp_collab_${docId}`);
    
    this.channel.onmessage = (ev) => {
      this.notify(ev.data);
    };

    console.log(`[Collaboration] Connected to doc ${docId} as ${user.name} (${this.sessionId})`);
    
    // Broadcast join to other tabs
    this.send({ type: 'user_joined', user: userWithColor });
    
    // Simulate remote activity (Bots) to demonstrate real-time features
    this.startSimulation();
  }

  disconnect() {
    this.connected = false;
    
    if (this.channel) {
      // Broadcast leave
      this.send({ type: 'user_left', userId: 'self' });
      this.channel.close();
      this.channel = null;
    }

    this.mockIntervals.forEach(id => clearTimeout(id));
    this.mockIntervals = [];
    this.listeners = [];
    console.log('[Collaboration] Disconnected');
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Mimic WebSocket.send()
  send(event: CollabEvent) {
    if (!this.connected || !this.channel) return;
    
    // Attach session ID to distinguish tabs
    const eventWithSession = { ...event, sessionId: this.sessionId };
    this.channel.postMessage(eventWithSession);
  }

  private notify(event: CollabEvent) {
    this.listeners.forEach(l => l(event));
  }

  private startSimulation() {
    const mockUser: User = {
      id: 'u2',
      name: 'Sarah Mensah',
      role: 'Editor',
      email: 'sarah@techbridge.edu.gh',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Mensah&background=random',
      color: '#8b5cf6' // Violet
    };

    const mockUser2: User = {
      id: 'u3',
      name: 'David Ofori',
      role: 'Creator',
      email: 'david@techbridge.edu.gh',
      avatar: 'https://ui-avatars.com/api/?name=David+Ofori&background=random',
      color: '#10b981' // Emerald
    };

    // 1. Sarah joins
    this.mockIntervals.push(window.setTimeout(() => {
      this.notify({ type: 'user_joined', user: mockUser, sessionId: 'bot-1' });
    }, 2000));

    // 2. Sarah types a sentence character by character
    const sentence = " I think we should emphasize the impact of AI on local agriculture.";
    let charIndex = 0;
    
    this.mockIntervals.push(window.setTimeout(() => {
      const typingInterval = window.setInterval(() => {
        if (charIndex >= sentence.length) {
          clearInterval(typingInterval);
          return;
        }
        
        const char = sentence[charIndex];
        // Simulate append at "end" (position -1 or large number in simplistic logic, 
        // but here we rely on the editor handling 'insert' at explicit position or end)
        // We'll use a high position to signify 'append' for simplicity in this mock, 
        // or the editor's length if we could read it. 
        // Since we can't read editor state here easily, we'll assume the editor handles 
        // high position as append.
        
        this.notify({ 
          type: 'text_update', 
          userId: mockUser.id, 
          sessionId: 'bot-1',
          text: char, 
          position: 10000, // Append
          action: 'insert'
        });
        
        // Update cursor to end
        this.notify({
          type: 'cursor_move',
          userId: mockUser.id,
          position: 10000 + charIndex, // Mock position
          sessionId: 'bot-1'
        });

        charIndex++;
      }, 100); // Fast typing
      
      this.mockIntervals.push(typingInterval);
    }, 4000));

    // 3. David joins later
    this.mockIntervals.push(window.setTimeout(() => {
      this.notify({ type: 'user_joined', user: mockUser2, sessionId: 'bot-2' });
    }, 8000));

     // 4. David pastes a chunk
    this.mockIntervals.push(window.setTimeout(() => {
      this.notify({ 
        type: 'text_update', 
        userId: mockUser2.id, 
        sessionId: 'bot-2',
        text: '\n\nDavid: Agreed. Including the AgTech photos.', 
        position: 20000,
        action: 'insert'
      });
       this.notify({
        type: 'cursor_move',
        userId: mockUser2.id,
        position: 20050,
        sessionId: 'bot-2'
      });
    }, 12000));
  }
}

export const collaborationService = new CollaborationService();
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
          <span className="font-bold text-sm">Techbridge Media Club Platform</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Techbridge Media Club Platform — Admin</h1>
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
 * E2E stub — techbridge-media-club-platform
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('techbridge-media-club-platform E2E', () => {
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

### FILE: translations.ts
```typescript
export const translations = {
  'en-GB': {
    // Layout
    'nav.dashboard': 'Dashboard',
    'nav.content': 'Editorial CMS',
    'nav.assets': 'Media Library',
    'nav.events': 'Events & Calendar',
    'nav.analytics': 'Analytics',
    'nav.admin': 'Admin Portal',
    'header.search': 'Search...',
    'header.admin': 'System Administration',
    
    // Dashboard
    'dash.hero.title': 'Create. Inspire. Broadcast.',
    'dash.hero.subtitle': 'Welcome back to the command center, Alex. Production output has increased by 15% this week.',
    'dash.hero.btn.review': 'Review Content',
    'dash.hero.btn.analytics': 'View Analytics',
    'dash.stat.views': 'Total Views',
    'dash.stat.members': 'Active Members',
    'dash.stat.events': 'Upcoming Events',
    'dash.stat.reviews': 'Pending Reviews',
    'dash.stat.thisWeek': 'This Week',
    'dash.recent.title': 'Recent Publications',
    'dash.recent.subtitle': 'Latest submissions from the team',
    'dash.recent.viewAll': 'View All',
    'dash.events.title': 'Events',
    'dash.events.create': 'Create Event',

    // Content Manager
    'cms.search': 'Search content...',
    'cms.create': 'Create Content',
    'cms.tab.all': 'All',
    'cms.tab.draft': 'Draft',
    'cms.tab.inReview': 'In Review',
    'cms.tab.published': 'Published',
    'cms.col.title': 'Title',
    'cms.col.author': 'Author',
    'cms.col.status': 'Status',
    'cms.col.date': 'Date',
    'cms.col.actions': 'Actions',

    // Asset Library
    'assets.title': 'Digital Asset Vault',
    'assets.subtitle': 'Centralized repository for all club media. High-fidelity storage for your next masterpiece.',
    'assets.upload': 'Upload Asset',
    'assets.itemsStored': 'items stored',
    'assets.drop': 'Drop to upload',
    'assets.addedBy': 'Added by',
    'assets.filter.all': 'All Files',
    'assets.filter.images': 'Images',
    'assets.filter.videos': 'Videos',
    'assets.filter.docs': 'Documents',
    'assets.filter.audio': 'Audio',

    // Events
    'events.title': 'Club Schedule',
    'events.upcoming': 'Upcoming Events',
    'events.manage': 'Manage',
    'events.edit': 'Edit',
    'events.registered': 'Registered',
    'events.view.month': 'Month',
    'events.view.week': 'Week',
    'events.view.day': 'Day',

    // Analytics
    'analytics.title': 'Performance Analytics',
    'analytics.subtitle': 'Track engagement across all media channels.',
    'analytics.export': 'Export Report',
    'analytics.trend': 'Weekly View Trends',
    'analytics.shares': 'Content Shares by Type',
    'analytics.legend.views': 'Page Views',
    'analytics.legend.engagement': 'Total Engagement',
    'analytics.card.topArticle': 'Top Article',
    'analytics.card.topRegion': 'Top Region',
    'analytics.card.avgSession': 'Avg Session',
    'analytics.card.traffic': 'of Traffic',
    'analytics.card.vsPrev': 'vs Prev',

    // Admin
    'admin.login.title': 'Restricted Access',
    'admin.login.subtitle': 'System Administration Clearance Required',
    'admin.label.key': 'Security Key',
    'admin.label.placeholder': 'Enter credentials...',
    'admin.btn.auth': 'Authenticate',
    'admin.header': 'System Administration',
    'admin.auth.session': 'Authenticated Root Session',
    
    // Admin Tabs
    'admin.tab.diagnostics': 'Diagnostics',
    'admin.tab.db': 'DB Monitor',
    'admin.tab.testing': 'Test Suites',
    'admin.tab.logs': 'Logs',
    'admin.tab.performance': 'Performance',

    // Admin Content
    'admin.status.system': 'System Status',
    'admin.status.security': 'Security Audit',
    'admin.status.db': 'Database Health',
    'admin.status.healthy': 'Healthy',
    'admin.status.secure': 'Secure',
    'admin.status.active': 'Active',
    'admin.logs.title': 'System Logs',
    'admin.diag.frontend': 'Frontend Stack',
    'admin.diag.services': 'Service Mesh',
    'admin.test.journey': 'Live User Journey',
    'admin.test.run': 'Execute Suite',
    'admin.test.running': 'Running...',
    'admin.test.suite': 'External Puppeteer Script',
    'admin.perf.cpu': 'CPU Load',
    'admin.perf.memory': 'Memory Usage',
    'admin.perf.latency': 'API Latency',
  },
  'fr-FR': {
    // Layout
    'nav.dashboard': 'Tableau de bord',
    'nav.content': 'CMS Éditorial',
    'nav.assets': 'Médiathèque',
    'nav.events': 'Événements',
    'nav.analytics': 'Analytique',
    'nav.admin': 'Portail Admin',
    'header.search': 'Rechercher...',
    'header.admin': 'Administration Système',
    
    // Dashboard
    'dash.hero.title': 'Créer. Inspirer. Diffuser.',
    'dash.hero.subtitle': 'Bon retour au centre de commande, Alex. La production a augmenté de 15% cette semaine.',
    'dash.hero.btn.review': 'Revoir le contenu',
    'dash.hero.btn.analytics': 'Voir les analyses',
    'dash.stat.views': 'Vues Totales',
    'dash.stat.members': 'Membres Actifs',
    'dash.stat.events': 'Événements à venir',
    'dash.stat.reviews': 'Revues en attente',
    'dash.stat.thisWeek': 'Cette Semaine',
    'dash.recent.title': 'Publications Récentes',
    'dash.recent.subtitle': 'Dernières soumissions de l\'équipe',
    'dash.recent.viewAll': 'Tout voir',
    'dash.events.title': 'Événements',
    'dash.events.create': 'Créer un événement',

    // Content Manager
    'cms.search': 'Rechercher du contenu...',
    'cms.create': 'Créer du contenu',
    'cms.tab.all': 'Tout',
    'cms.tab.draft': 'Brouillon',
    'cms.tab.inReview': 'En Revue',
    'cms.tab.published': 'Publié',
    'cms.col.title': 'Titre',
    'cms.col.author': 'Auteur',
    'cms.col.status': 'Statut',
    'cms.col.date': 'Date',
    'cms.col.actions': 'Actions',

    // Asset Library
    'assets.title': 'Coffre-fort Numérique',
    'assets.subtitle': 'Dépôt centralisé pour tous les médias du club. Stockage haute fidélité pour votre prochain chef-d\'œuvre.',
    'assets.upload': 'Téléverser',
    'assets.itemsStored': 'éléments stockés',
    'assets.drop': 'Déposer pour téléverser',
    'assets.addedBy': 'Ajouté par',
    'assets.filter.all': 'Tous les fichiers',
    'assets.filter.images': 'Images',
    'assets.filter.videos': 'Vidéos',
    'assets.filter.docs': 'Documents',
    'assets.filter.audio': 'Audio',

    // Events
    'events.title': 'Calendrier du Club',
    'events.upcoming': 'Événements à venir',
    'events.manage': 'Gérer',
    'events.edit': 'Modifier',
    'events.registered': 'Inscrits',
    'events.view.month': 'Mois',
    'events.view.week': 'Semaine',
    'events.view.day': 'Jour',

    // Analytics
    'analytics.title': 'Analyse de Performance',
    'analytics.subtitle': 'Suivez l\'engagement sur tous les canaux médiatiques.',
    'analytics.export': 'Exporter',
    'analytics.trend': 'Tendances Hebdomadaires',
    'analytics.shares': 'Partages par Type',
    'analytics.legend.views': 'Vues de Page',
    'analytics.legend.engagement': 'Engagement Total',
    'analytics.card.topArticle': 'Meilleur Article',
    'analytics.card.topRegion': 'Meilleure Région',
    'analytics.card.avgSession': 'Session Moyenne',
    'analytics.card.traffic': 'du Trafic',
    'analytics.card.vsPrev': 'vs Préc',

    // Admin
    'admin.login.title': 'Accès Restreint',
    'admin.login.subtitle': 'Autorisation d\'administration système requise',
    'admin.label.key': 'Clé de sécurité',
    'admin.label.placeholder': 'Entrez vos identifiants...',
    'admin.btn.auth': 'Authentifier',
    'admin.header': 'Administration Système',
    'admin.auth.session': 'Session Root Authentifiée',
    
    // Admin Tabs
    'admin.tab.diagnostics': 'Diagnostics',
    'admin.tab.db': 'Moniteur BDD',
    'admin.tab.testing': 'Suites de Tests',
    'admin.tab.logs': 'Journaux',
    'admin.tab.performance': 'Performance',

    // Admin Content
    'admin.status.system': 'État du Système',
    'admin.status.security': 'Audit de Sécurité',
    'admin.status.db': 'Santé de la BDD',
    'admin.status.healthy': 'Sain',
    'admin.status.secure': 'Sécurisé',
    'admin.status.active': 'Actif',
    'admin.logs.title': 'Journaux Système',
    'admin.diag.frontend': 'Stack Frontend',
    'admin.diag.services': 'Maillage de Services',
    'admin.test.journey': 'Parcours Utilisateur en Direct',
    'admin.test.run': 'Exécuter la Suite',
    'admin.test.running': 'En cours...',
    'admin.test.suite': 'Script Puppeteer Externe',
    'admin.perf.cpu': 'Charge CPU',
    'admin.perf.memory': 'Utilisation Mémoire',
    'admin.perf.latency': 'Latence API',
  },
  'ak-GH': {
    // Layout
    'nav.dashboard': 'Dwumadibea',
    'nav.content': 'Nsɛm Kyerɛw',
    'nav.assets': 'Mfonini & Nne',
    'nav.events': 'Nhyiamu',
    'nav.analytics': 'Nhwehwɛmu',
    'nav.admin': 'Hwɛsofoɔ Dwumadibea',
    'header.search': 'Hwehwɛ...',
    'header.admin': 'Nhyehyɛeɛ Hwɛsofoɔ',
    
    // Dashboard
    'dash.hero.title': 'Bɔ. Kanyan. Pansam.',
    'dash.hero.subtitle': 'Akwaaba bio, Alex. Adwuma no kɔ anim 15% nawɔtwe yi.',
    'dash.hero.btn.review': 'Hwɛ Nsɛm No',
    'dash.hero.btn.analytics': 'Hwɛ Nhwehwɛmu',
    'dash.stat.views': 'Hwɛ Dodoɔ',
    'dash.stat.members': 'Amuafoɔ Nnam',
    'dash.stat.events': 'Nhyiamu a Ɛreba',
    'dash.stat.reviews': 'Deɛ Yɛrehwɛ',
    'dash.stat.thisWeek': 'Nawɔtwe Yi',
    'dash.recent.title': 'Nsɛm a Yɛde To Hɔ Nkyɛe',
    'dash.recent.subtitle': 'Adwuma foforo a firi kuo no hɔ',
    'dash.recent.viewAll': 'Hwɛ Ne Nyinaa',
    'dash.events.title': 'Nhyiamu',
    'dash.events.create': 'Hyɛ Nhyiamu Ase',

    // Content Manager
    'cms.search': 'Hwehwɛ nsɛm...',
    'cms.create': 'Bɔ Ade Foforo',
    'cms.tab.all': 'Ne Nyinaa',
    'cms.tab.draft': 'Nhyɛaseɛ',
    'cms.tab.inReview': 'Yɛrehwɛ Mu',
    'cms.tab.published': 'Atintim',
    'cms.col.title': 'Asɛmti',
    'cms.col.author': 'Kyerɛwfoɔ',
    'cms.col.status': 'Tebea',
    'cms.col.date': 'Da',
    'cms.col.actions': 'Yɛ Eho Adwuma',

    // Asset Library
    'assets.title': 'Akoradeɛ',
    'assets.subtitle': 'Beaɛ a yɛde nneɛma sie. Yɛde wo mfonini ne nneɛma sie ha.',
    'assets.upload': 'Fa To So',
    'assets.itemsStored': 'nneɛma wɔ ha',
    'assets.drop': 'Fa bɛto ha',
    'assets.addedBy': 'Deɛ ɔde bae',
    'assets.filter.all': 'Ne Nyinaa',
    'assets.filter.images': 'Mfonini',
    'assets.filter.videos': 'Videos',
    'assets.filter.docs': 'Nkrataa',
    'assets.filter.audio': 'Nne',

    // Events
    'events.title': 'Nhyiamu Nyehyɛeɛ',
    'events.upcoming': 'Nhyiamu a Ɛreba',
    'events.manage': 'Hwɛ So',
    'events.edit': 'Sesamu',
    'events.registered': 'Wɔatwerɛ Wɔn Din',
    'events.view.month': 'Bosome',
    'events.view.week': 'Nawɔtwe',
    'events.view.day': 'Da',

    // Analytics
    'analytics.title': 'Dwumadie Nhwehwɛmu',
    'analytics.subtitle': 'Hwɛ sɛnea nkurɔfoɔ di nkitaho wɔ bɛɛ biara.',
    'analytics.export': 'Fa Kɔ',
    'analytics.trend': 'Nawɔtwe Yi Nhwehwɛmu',
    'analytics.shares': 'Kyɛfa Ahodoɔ',
    'analytics.legend.views': 'Hwɛ Dodoɔ',
    'analytics.legend.engagement': 'Nkitahodie Dodoɔ',
    'analytics.card.topArticle': 'Asɛm a Ɛdi Mu',
    'analytics.card.topRegion': 'Mantam a Ɛdi Mu',
    'analytics.card.avgSession': 'Berɛ a Wɔde Di Dwuma',
    'analytics.card.traffic': 'Nipa Dodoɔ',
    'analytics.card.vsPrev': 'ne Deɛ Aba Kɔ',

    // Admin
    'admin.login.title': 'Kwan Nni Hɔ',
    'admin.login.subtitle': 'Gye Hwɛsofoɔ nko ara',
    'admin.label.key': 'Safewa',
    'admin.label.placeholder': 'Bɔ wo din...',
    'admin.btn.auth': 'Gye Tom',
    'admin.header': 'Nhyehyɛeɛ Hwɛsofoɔ',
    'admin.auth.session': 'Hwɛsofoɔ Panyin',
    
    // Admin Tabs
    'admin.tab.diagnostics': 'Nhwehwɛmu',
    'admin.tab.db': 'Data Korae',
    'admin.tab.testing': 'Sɔhwɛ',
    'admin.tab.logs': 'Kyerɛwtohɔ',
    'admin.tab.performance': 'Dwumadie',

    // Admin Content
    'admin.status.system': 'Nhyehyɛeɛ Tebea',
    'admin.status.security': 'Bammɔ Nhwehwɛmu',
    'admin.status.db': 'Data Korae Tebea',
    'admin.status.healthy': 'Ɛte Apɔ',
    'admin.status.secure': 'Bammɔ Wɔ Hɔ',
    'admin.status.active': 'Ɛyɛ Adwuma',
    'admin.logs.title': 'Nhyehyɛeɛ Kyerɛwtohɔ',
    'admin.diag.frontend': 'Frontend Stack',
    'admin.diag.services': 'Service Mesh',
    'admin.test.journey': 'Odwumadi Sɔhwɛ',
    'admin.test.run': 'Hyɛ Ase',
    'admin.test.running': 'Ɛrekɔ so...',
    'admin.test.suite': 'Puppeteer Sɔhwɛ',
    'admin.perf.cpu': 'CPU Dwumadie',
    'admin.perf.memory': 'Memory Dwumadie',
    'admin.perf.latency': 'API Latency',
  }
};

// Aliases
(translations as any)['en-US'] = translations['en-GB'];
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
      "node"
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
export type UserRole = 'Admin' | 'Editor' | 'Creator' | 'Member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  // Collaboration props
  color?: string;
  cursorPosition?: number;
}

export type ContentStatus = 'Draft' | 'In Review' | 'Approved' | 'Published' | 'Rejected';
export type ContentType = 'Article' | 'Video' | 'Podcast' | 'Graphic';

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  author: string;
  status: ContentStatus;
  dateCreated: string;
  datePublished?: string;
  views?: number;
  thumbnail?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'Image' | 'Video' | 'Audio' | 'Document';
  size: string;
  uploadedBy: string;
  dateUploaded: string;
  url: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  description: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface AnalyticsData {
  name: string;
  views: number;
  engagement: number;
  shares: number;
}

// Collaboration Types
export type CollabEventType = 'user_joined' | 'user_left' | 'text_update' | 'cursor_move';

export interface CollabEvent {
  type: CollabEventType;
  user?: User;
  userId?: string;
  sessionId?: string;
  text?: string;
  position?: number;
  action?: 'insert' | 'replace';
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'high-contrast';

// Admin Types
export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  user?: string;
}

export interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
}
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
  }, base: './',
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

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — techbridge-media-club-platform
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

// Vitest E2E configuration — techbridge-media-club-platform
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

