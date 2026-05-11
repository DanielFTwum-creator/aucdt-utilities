import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CheckCircle, FileText, Activity, Zap, Shield, Lock, HardDrive,
  AlertTriangle, RefreshCw, Monitor, Smartphone
} from 'lucide-react';
import { Tooltip } from './Tooltip';

const AdminSidebar = () => {
  const location = useLocation();
  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col p-6 space-y-8">
      <div className="flex items-center gap-3 px-2">
        <Shield className="w-6 h-6 text-tuc-gold" />
        <span className="font-black tracking-tighter text-lg">POSTER_ADMIN</span>
      </div>

      <nav className="flex-1 space-y-2">
        {[
          { path: '/admin/diagnostics', icon: Activity, label: 'Diagnostics', tip: 'View system health and diagnostics' },
          { path: '/admin/testing', icon: Zap, label: 'Testing suite', tip: 'Run automated layout and PDF tests' },
          { path: '/admin/logs', icon: FileText, label: 'System Logs', tip: 'View real-time event logs' },
          { path: '/', icon: Activity, label: 'Exit to App', tip: 'Return to the poster editor' },
        ].map((item) => (
          <Tooltip key={item.path} text={item.tip} position="right" isDarkMode={true}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'bg-tuc-crimson text-white shadow-lg shadow-tuc-crimson/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-bold">{item.label}</span>
            </Link>
          </Tooltip>
        ))}
      </nav>

      <div className="pt-8 border-t border-white/10 opacity-50">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">v1.2.0 production</p>
      </div>
    </div>
  );
};

const DiagnosticsPage = () => {
  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <header>
        <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">System Diagnostics</h1>
        <p className="text-slate-500 font-medium">Real-time health monitor and dependency verification</p>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">React Core</h3>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">19.2.5</p>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-full bg-emerald-500"></div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Headless engine</h3>
            <Zap className="w-4 h-4 text-tuc-gold" />
          </div>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">PLAYWRIGHT</p>
          <div className="flex gap-1">
            <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
            <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
            <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Cache Status</h3>
            <HardDrive className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">94% OK</p>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-[94%] bg-blue-500"></div>
          </div>
        </div>
      </div>

      <section className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Service</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Endpoint</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Latency</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {[
              { s: 'Poster Engine', e: '/api/generate', l: '420ms', st: 'Healthy' },
              { s: 'PDF Distro', e: '/api/save-files', l: '12ms', st: 'Healthy' },
              { s: 'Vite Middleware', e: 'N/A', l: '0.2ms', st: 'Active' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-white transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700 text-sm">{row.s}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">{row.e}</td>
                <td className="px-6 py-4 text-xs font-semibold text-slate-600">{row.l}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">
                    <div className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse"></div>
                    {row.st}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const TestingPage = () => {
  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <header>
        <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Testing Suite</h1>
        <p className="text-slate-500 font-medium">Automated validation for all distribution formats</p>
      </header>

      <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-xl shadow-slate-200/40 border-b-4 border-b-tuc-gold">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-tuc-gold/10 flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-tuc-gold" />
               </div>
               <div>
                  <h3 className="text-lg font-black tracking-tighter">Retina Cross-Browser Audit</h3>
                  <p className="text-sm text-slate-400">Playwright v1.59.1 chromium</p>
               </div>
            </div>
            <Tooltip text="Execute all automated verification tests" position="bottom" isDarkMode={false}>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-transform duration-75 shadow-lg shadow-slate-900/10">
                 RUN ALL TESTS
              </button>
            </Tooltip>
         </div>

         <div className="space-y-4">
            {[
              { name: 'Landscape 4:3 Snapshot', status: 'Passed', time: '1.2s' },
              { name: 'Square 1:1 Overflow Check', status: 'Passed', time: '0.8s' },
              { name: 'Portrait 3:4 Layout Grid', status: 'Failed', time: 'N/A' },
              { name: 'PDF CMYK Compliance', status: 'Pending', time: 'N/A' },
            ].map((test, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                  <div className="flex items-center gap-3">
                     {test.status === 'Passed' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : test.status === 'Failed' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <RefreshCw className="w-4 h-4 text-slate-300 animate-spin" />}
                     <span className="font-bold text-slate-700">{test.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-mono text-slate-400">{test.time}</span>
                     <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        test.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' :
                        test.status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-500'
                     }`}>{test.status}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const LogsPage = () => (
  <div className="p-12 max-w-4xl space-y-12">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-5xl font-black tracking-tighter text-slate-900">SYSTEM_LOGS</h1>
        <p className="text-slate-500 text-lg mt-2 font-medium">Real-time event stream and error audits</p>
      </div>
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <span className="text-xs font-black text-amber-700 uppercase tracking-widest leading-none">Debug Mode Active</span>
      </div>
    </div>

    <div className="bg-slate-900 rounded-3xl p-8 font-mono text-[13px] text-slate-300 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tuc-gold via-tuc-crimson to-tuc-gold opacity-50"></div>
      <div className="space-y-3">
        <div className="flex gap-4 opacity-50">
          <span className="text-slate-600 shrink-0">15:42:01.214</span>
          <span className="text-emerald-400 shrink-0">[INFO]</span>
          <span>System kernel initialized successfully (React 19.2.5)</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-600 shrink-0">15:42:01.350</span>
          <span className="text-blue-400 shrink-0">[VITE]</span>
          <span>HMR connected. Environment: production (simulated)</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-600 shrink-0">15:42:01.882</span>
          <span className="text-emerald-400 shrink-0">[INFO]</span>
          <span>6R Aesthetic Engine ready. Loaded 5 aspect ratios.</span>
        </div>
        <div className="flex gap-4 text-amber-400">
          <span className="text-slate-600 shrink-0">15:42:02.100</span>
          <span className="text-amber-500 shrink-0">[WARN]</span>
          <span>PDF buffer size exceeding optimal limits (Compressed)</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-600 shrink-0">15:43:45.002</span>
          <span className="text-purple-400 shrink-0">[AUTH]</span>
          <span>Admin session verified via passcode input.</span>
        </div>
        <div className="flex gap-4 animate-pulse">
          <span className="text-slate-600 shrink-0">15:44:12.987</span>
          <span className="text-emerald-400 shrink-0">[LIVE]</span>
          <span>Watching for changes in /assets/masks/...</span>
        </div>
      </div>
    </div>
  </div>
);

export const AdminLayout = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const authenticate = (pwd: string) => {
    if (!adminPassword) {
      setError('Admin password not configured');
      return;
    }
    if (pwd === adminPassword) {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Incorrect passcode');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-sans">
        <div className="w-full max-w-sm p-10 bg-white rounded-3xl shadow-2xl space-y-8 border-t-8 border-t-tuc-crimson">
          <div className="text-center space-y-2">
            <Lock className="w-12 h-12 text-tuc-crimson mx-auto mb-4" />
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">ADMIN LOCK</h2>
            <p className="text-slate-500 text-sm font-medium">Verify credentials to access diagnostic suite</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="System passcode"
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-tuc-crimson focus:ring-4 focus:ring-tuc-crimson/5 transition-all text-center text-base font-black tracking-widest"
              onKeyPress={(e) => e.key === 'Enter' && authenticate(password)}
            />
            {error && <p className="text-xs text-red-600 font-bold text-center">{error}</p>}
            <Tooltip text="Gain access to system diagnostics" position="bottom" isDarkMode={false}>
              <button
                onClick={() => authenticate(password)}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-sm hover:translate-y-[-2px] hover:shadow-xl hover:shadow-slate-900/20 active:scale-95 transition-all"
              >
                AUTHENTICATE
              </button>
            </Tooltip>
            <Link to="/" className="block text-center text-xs font-bold text-slate-400 hover:text-tuc-crimson transition-colors uppercase tracking-widest">
              Back to Terminal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
         <Routes>
            <Route path="diagnostics" element={<DiagnosticsPage />} />
            <Route path="testing" element={<TestingPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="*" element={<DiagnosticsPage />} />
         </Routes>
      </main>
    </div>
  );
};
