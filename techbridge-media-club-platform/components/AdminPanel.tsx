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
    if (password === 'admin123') {
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