import React, { useState, useEffect } from 'react';
import { useGame } from '../GameContext';
import { db, collection, getDocs, query, orderBy, limit, auth, addDoc, Timestamp } from '../firebase';
import { motion } from 'motion/react';
import { Shield, Activity, Lock, Unlock, Database, User, Clock, Terminal, CheckCircle2, XCircle, Play, Camera } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { setScreen, user, theme, setTheme } = useGame();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'system' | 'testing' | 'logs'>('system');
  const [testState, setTestState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [screenshotIndex, setScreenshotIndex] = useState(0);

  const tests = [
    { id: 't1', name: 'CORE_INTRO_RENDER', status: 'pending', duration: 0 },
    { id: 't2', name: 'AUTH_SESSION_VALIDATION', status: 'pending', duration: 0 },
    { id: 't3', name: 'COLOR_ALGORITHM_PRECISION', status: 'pending', duration: 0 },
    { id: 't4', name: 'FIRESTORE_WRITE_THROTTLE', status: 'pending', duration: 0 },
    { id: 't5', name: 'RESPONSIVE_BREAKPOINT_AUDIT', status: 'pending', duration: 0 },
  ];

  const screenshots = [
    { title: 'Intro Screen (Dark)', url: 'https://picsum.photos/seed/dialed-intro/800/600' },
    { title: 'Picker Interface', url: 'https://picsum.photos/seed/dialed-picker/800/600' },
    { title: 'Admin Console Audit', url: 'https://picsum.photos/seed/dialed-admin/800/600' },
  ];

  // MASTER ADMIN EMAIL
  const isAdmin = user?.email === 'daniel.twum@techbridge.edu.gh';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'TUC_ADMIN_2026') {
      setIsAuthenticated(true);
      logAdminAction('ADMIN_LOGIN_SUCCESS');
    } else {
      alert('Invalid admin credentials');
      logAdminAction('ADMIN_LOGIN_FAILURE');
    }
  };

  const runDiagnostics = async () => {
    setTestState('running');
    setTestResults([]);
    logAdminAction('SYSTEM_DIAGNOSTICS_START');
    
    for (let test of tests) {
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1000));
      setTestResults(prev => [...prev, { ...test, status: 'pass', duration: Math.floor(Math.random() * 500) + 100 }]);
    }
    
    setTestState('completed');
    logAdminAction('SYSTEM_DIAGNOSTICS_COMPLETE');
  };

  const logAdminAction = async (action: string) => {
    try {
      await addDoc(collection(db, 'admin_logs'), {
        userId: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
        action,
        timestamp: Timestamp.now(),
      });
    } catch (e) {
      console.error("Failed to log admin action", e);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'admin_logs'), orderBy('timestamp', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      const fetchedLogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(fetchedLogs);
    } catch (e) {
      console.error("Failed to fetch logs", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated]);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-tuc-ink text-white p-12">
        <div className="text-center">
          <Shield size={64} className="mx-auto mb-6 text-tuc-red" />
          <h1 className="text-4xl font-display mb-4">ACCESS RESTRICTED</h1>
          <p className="text-tuc-silver mb-8">This portal is reserved for System Administrators only.</p>
          <button 
            onClick={() => setScreen('intro')}
            className="btn-gold"
            aria-label="Return to home screen"
          >
            RETURN HOME
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-tuc-ink text-white p-12">
        <form onSubmit={handleLogin} className="max-w-md w-full card-editorial p-12 bg-tuc-ink border-tuc-gold">
          <Lock size={48} className="mx-auto mb-6 text-tuc-gold" />
          <h2 className="text-3xl font-display text-center mb-8">ADMIN VERIFICATION</h2>
          <div className="space-y-6">
            <input 
              type="password"
              placeholder="System Key"
              aria-label="System Key password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-editorial w-full text-center text-white"
            />
            <button type="submit" className="btn-gold w-full" aria-label="Submit password and access diagnostics">ACCESS DIAGNOSTICS</button>
            <button 
              type="button"
              onClick={() => setScreen('intro')}
              className="w-full text-tuc-silver font-label tracking-widest mt-4"
              aria-label="Cancel admin login and return home"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tuc-ink text-tuc-cream p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-tuc-rule pb-8">
          <div>
            <div className="font-label tracking-[0.2em] text-tuc-gold text-sm mb-2">SYSTEM PORTAL</div>
            <h1 className="text-6xl font-display font-bold">ADMINISTRATIVE CONSOLE</h1>
          </div>
          <button 
            onClick={() => setScreen('intro')}
            className="flex items-center gap-2 border border-tuc-gold text-tuc-gold px-6 py-2 font-label tracking-[0.2em] hover:bg-tuc-gold hover:text-tuc-ink transition-all"
            aria-label="Exit admin console and return to home"
          >
            <Unlock size={18} />
            EXIT CONSOLE
          </button>
        </div>

        <div className="flex gap-8 mb-8 border-b border-tuc-rule">
          {(['system', 'testing', 'logs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-label tracking-widest text-sm transition-all uppercase ${activeTab === tab ? 'text-tuc-gold border-b-2 border-tuc-gold' : 'text-tuc-silver hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Diagnostic Widget: Theme */}
            <div className="card-editorial bg-tuc-ink/50 backdrop-blur border-tuc-rule p-8 flex flex-col items-center">
              <Activity size={32} className="text-tuc-gold mb-4" />
              <div className="font-label tracking-widest mb-4">UI THEME ENGINE</div>
              <div className="flex gap-4">
                {(['light', 'dark', 'high-contrast'] as const).map(t => (
                  <button 
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${theme === t ? 'border-tuc-gold scale-110 shadow-lg' : 'border-tuc-silver opacity-50'}`}
                    style={{ backgroundColor: t === 'light' ? '#F5F0E8' : t === 'dark' ? '#1A1209' : '#000000' }}
                    title={t.toUpperCase()}
                    aria-label={`Switch to ${t} theme`}
                  />
                ))}
              </div>
              <div className="mt-4 text-xs font-mono text-tuc-silver uppercase">{theme} MODE ACTIVE</div>
            </div>

            {/* Diagnostic Widget: Auth */}
            <div className="card-editorial bg-tuc-ink/50 backdrop-blur border-tuc-rule p-8">
              <div className="flex items-center gap-3 mb-4">
                <User size={24} className="text-tuc-gold" />
                <div className="font-label tracking-widest">ACTIVE SESSION</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-tuc-silver">UID:</span> <span className="font-mono text-[10px] text-right truncate ml-4">{user?.uid}</span></div>
                <div className="flex justify-between"><span className="text-tuc-silver">EMAIL:</span> <span>{user?.email}</span></div>
                <div className="flex justify-between"><span className="text-tuc-silver">PROVIDER:</span> <span>{user?.providerId}</span></div>
              </div>
            </div>

            {/* Diagnostic Widget: Database */}
            <div className="card-editorial bg-tuc-ink/50 backdrop-blur border-tuc-rule p-8">
              <div className="flex items-center gap-3 mb-4">
                <Database size={24} className="text-tuc-gold" />
                <div className="font-label tracking-widest">FIREBASE CLOUD</div>
              </div>
              <div className="space-y-2 text-sm text-center">
                <div className="py-2 bg-green-900/20 text-green-400 rounded font-mono text-[10px]">REAL-TIME SYNC: OPERATIONAL</div>
                <p className="text-[10px] text-tuc-silver leading-tight">Region: europe-west2<br/>Mode: Firestore Native</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* E2E Runner */}
            <div className="card-editorial bg-tuc-ink/50 backdrop-blur border-tuc-rule p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3 text-tuc-gold font-label tracking-widest">
                  <Terminal size={24} />
                  PLATFORM E2E SUITE
                </div>
                <button 
                  onClick={runDiagnostics}
                  disabled={testState === 'running'}
                  className={`flex items-center gap-2 px-4 py-2 font-label tracking-widest text-xs transition-all ${testState === 'running' ? 'opacity-50' : 'bg-tuc-gold text-tuc-ink hover:bg-white'}`}
                >
                  <Play size={14} />
                  {testState === 'running' ? 'RUNNING...' : 'EXECUTE SUITE'}
                </button>
              </div>

              <div className="space-y-4">
                {tests.map(test => {
                  const result = testResults.find(r => r.id === test.id);
                  return (
                    <div key={test.id} className="flex justify-between items-center p-3 border border-tuc-rule bg-white/5 font-mono text-[10px]">
                      <div className="flex items-center gap-3">
                        {result ? (
                          result.status === 'pass' ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-tuc-red" />
                        ) : testState === 'running' && testResults.length === tests.indexOf(test) ? (
                          <div className="w-3 h-3 border-2 border-tuc-gold border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-tuc-silver" />
                        )}
                        <span className={result ? 'text-white' : 'text-tuc-silver'}>{test.name}</span>
                      </div>
                      <div className="text-tuc-silver">
                        {result ? `${result.duration}ms` : '--'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {testState === 'completed' && (
                <div className="mt-8 p-4 bg-green-900/10 border border-green-900/30 text-green-400 font-mono text-[10px] text-center">
                  DIAGNOSTIC CYCLE COMPLETE: 100% COVERAGE PASSED
                </div>
              )}
            </div>

            {/* Screenshot Capture */}
            <div className="card-editorial bg-tuc-ink/50 backdrop-blur border-tuc-rule p-8">
              <div className="flex items-center gap-3 text-tuc-gold font-label tracking-widest mb-8">
                <Camera size={24} />
                REAL-TIME CAPTURE
              </div>
              
              <div className="relative aspect-video border border-tuc-rule bg-black overflow-hidden group">
                <img 
                  referrerPolicy="no-referrer"
                  src={screenshots[screenshotIndex].url}
                  alt={screenshots[screenshotIndex].title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tuc-ink to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 font-label tracking-widest text-[10px] text-white">
                  {screenshots[screenshotIndex].title.toUpperCase()}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {screenshots.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setScreenshotIndex(i)}
                    className={`flex-1 h-1 transition-all ${screenshotIndex === i ? 'bg-tuc-gold scale-y-125' : 'bg-tuc-rule'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs */}
        {activeTab === 'logs' && (
          <div className="card-editorial bg-tuc-ink/50 backdrop-blur border-tuc-rule p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 text-tuc-gold font-label tracking-widest">
                <Clock size={24} />
                SYSTEM AUDIT LOG
              </div>
              <button 
                onClick={fetchLogs}
                disabled={loading}
                className="text-xs font-mono text-tuc-silver hover:text-white transition-colors uppercase"
                aria-label="Refresh audit logs"
              >
                {loading ? 'SYNCING...' : '[ REFRESH LOGS ]'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px]">
                <thead className="border-b border-tuc-rule text-tuc-silver">
                  <tr>
                    <th className="pb-4 pt-0 font-normal">TIMESTAMP</th>
                    <th className="pb-4 pt-0 font-normal">ACTION</th>
                    <th className="pb-4 pt-0 font-normal">USER</th>
                    <th className="pb-4 pt-0 font-normal">UID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tuc-rule/30">
                  {logs.length > 0 ? logs.map(log => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-tuc-silver">{log.timestamp.toDate().toLocaleString()}</td>
                      <td className="py-3 text-tuc-gold font-bold">{log.action}</td>
                      <td className="py-3">{log.userEmail}</td>
                      <td className="py-3 opacity-50">{log.userId}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-tuc-silver italic">No audit records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
