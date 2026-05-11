
import React, { useState, useEffect, useCallback } from 'react';
import { WORKSHOP_MODULES, ICONS } from './constants.tsx';
import { WorkshopModule, ModuleStatus, Theme, AuditLog, QuizQuestion, User } from './types.ts';
import AICoach from './components/AICoach.tsx';
import TestDashboard from './components/TestDashboard.tsx';
import { generateDesignVisual } from './services/gemini.ts';

// TechBridge Branding Constants
const LOGO_URL = "https://techbridge.edu.gh/static/TUC_LOGO_1.png";
const ADMIN_PASSWORD = "techbridge2024";

const Header: React.FC<{ 
  user: User | null;
  theme: Theme;
  setTheme: (t: Theme) => void;
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  currentView: string;
  setCurrentView: (v: any) => void;
}> = ({ user, theme, setTheme, isAdmin, onAdminClick, onLogout, currentView, setCurrentView }) => {
  // Fix: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error
  const themes: { id: Theme; icon: (c: string) => React.ReactNode; label: string }[] = [
    { id: 'light', icon: ICONS.Sun, label: 'Light Mode' },
    { id: 'dark', icon: ICONS.Moon, label: 'Dark Mode' },
    { id: 'high-contrast', icon: ICONS.Accessibility, label: 'High Contrast' }
  ];

  return (
    <header className={`sticky top-0 z-50 w-full shadow-2xl transition-colors duration-300 ${
      theme === 'high-contrast' ? 'bg-black border-b-4 border-yellow-400' : 'bg-maroon-gradient'
    }`}>
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 h-24 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="TECHBRIDGE Logo" className="h-14 w-auto object-contain filter drop-shadow-md" />
            <div className="hidden sm:block border-l border-white/20 pl-4">
              <h1 className={`text-xl font-extrabold tracking-tighter uppercase leading-none text-white`}>
                TECHBRIDGE
              </h1>
              <div className="flex flex-col">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-0.5 ${theme === 'high-contrast' ? 'text-yellow-400' : 'text-[#F4C430]'}`}>
                  University College
                </p>
                <p className="text-[7px] font-medium text-white/60 leading-tight uppercase tracking-tight mt-0.5 max-w-[200px]">
                  (Formerly AsanSka University College of Design and Technology)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex bg-black/20 p-1 rounded-xl gap-1 border border-white/10" role="group" aria-label="Theme Selection">
              {themes.map(t => (
                <div key={t.id} className="relative group">
                  <button
                    onClick={() => setTheme(t.id)}
                    aria-label={t.label}
                    className={`p-2.5 rounded-lg transition-all flex items-center justify-center ${
                      theme === t.id 
                        ? 'bg-[#F4C430] text-[#6B1515] shadow-lg scale-105' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t.icon("w-5 h-5")}
                  </button>
                  {/* Institutional Tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-1.5 bg-[#6B1515] text-[#F4C430] text-[9px] font-black uppercase tracking-widest rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 border border-[#F4C430]/30 whitespace-nowrap z-50">
                    {t.label}
                  </div>
                </div>
              ))}
            </div>

            {user && (
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-white tracking-tight">{user.name}</p>
                  <div className="flex gap-2 justify-end mt-1">
                    <button 
                      onClick={onAdminClick}
                      className={`text-[9px] uppercase font-black tracking-tighter px-2 py-0.5 rounded transition-colors ${
                        isAdmin 
                          ? 'bg-green-500 text-white' 
                          : theme === 'high-contrast' ? 'bg-yellow-400 text-black' : 'bg-[#F4C430] text-[#6B1515]'
                      }`}
                    >
                      {isAdmin ? 'Faculty Access' : 'Faculty Hub'}
                    </button>
                    <button 
                      onClick={onLogout}
                      className="text-[9px] uppercase font-black tracking-tighter px-2 py-0.5 bg-white/10 text-white hover:bg-white/20 rounded"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#F4C430] flex items-center justify-center text-[#6B1515] font-black text-lg ring-4 ring-white/10 shadow-lg">
                  {user.initials}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {user && (
        <div className={`backdrop-blur-md ${theme === 'high-contrast' ? 'bg-black' : 'bg-black/20'}`}>
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-8 overflow-x-auto no-scrollbar" role="navigation">
              {['Dashboard', 'Faculty Hub'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => {
                    if (item === 'Faculty Hub') { if(!isAdmin) onAdminClick(); else setCurrentView('admin'); }
                    else setCurrentView('dashboard');
                  }}
                  className={`text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap py-4 transition-all border-b-2 px-1 ${
                    (item === 'Dashboard' && currentView === 'dashboard') || 
                    (item === 'Faculty Hub' && currentView === 'admin')
                      ? 'text-[#F4C430] border-[#F4C430]' 
                      : 'text-white/60 border-transparent hover:text-white hover:border-white/30'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

const AuthView: React.FC<{ onEnroll: (name: string) => void; theme: Theme }> = ({ onEnroll, theme }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onEnroll(name.trim());
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className={`w-full max-w-md p-10 rounded-[40px] shadow-2xl border-2 animate-in zoom-in-95 duration-500 ${
        theme === 'high-contrast' ? 'bg-black border-yellow-400' : 'bg-white border-[#6B1515]/5'
      }`}>
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#6B1515] rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl transform -rotate-3">
             <img src={LOGO_URL} alt="" className="w-12 opacity-90" />
          </div>
          <h2 className="text-3xl font-black text-[#6B1515] uppercase tracking-tighter">Scholarly Enrollment</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">Join the TechBridge Pioneer Cohort</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Pioneer Full Name</label>
            <input 
              required
              autoFocus
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kwame Mensah"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#6B1515] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#6B1515]"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-[#6B1515] text-[#F4C430] rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Commence Workshop
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-gray-400 font-medium uppercase leading-relaxed px-6">
          By enrolling, you gain institutional access to the 6R Design Methodology toolkit.
        </p>
      </div>
    </div>
  );
};

const QuizView: React.FC<{ module: WorkshopModule; onBack: () => void }> = ({ module, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = module.quizzes[currentQuestion];
  if (!question) return <div>No quiz content.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-10 duration-500">
      <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-[#6B1515] opacity-60 hover:opacity-100 flex items-center gap-2">
        {ICONS.ChevronLeft("w-4 h-4")} Return to Lesson
      </button>

      <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-[#6B1515]/5">
        <div className="flex justify-between items-center mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F4C430] bg-[#6B1515] px-4 py-2 rounded-full">
            Question {currentQuestion + 1} of {module.quizzes.length}
          </span>
        </div>

        <h3 className="text-3xl font-black text-[#6B1515] leading-tight mb-12">{question.text}</h3>

        <div className="grid gap-4">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className={`w-full p-6 text-left rounded-2xl border-2 transition-all font-bold ${
                selectedOption === idx 
                  ? 'bg-[#6B1515] text-white border-[#6B1515]' 
                  : 'bg-gray-50 border-transparent hover:border-gray-200 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] ${
                  selectedOption === idx ? 'bg-[#F4C430] text-[#6B1515]' : 'bg-gray-200 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <button 
            disabled={selectedOption === null}
            onClick={() => {
              if (selectedOption === question.correct) {
                if (currentQuestion < module.quizzes.length - 1) {
                  setCurrentQuestion(prev => prev + 1);
                  setSelectedOption(null);
                } else {
                  setShowResult(true);
                }
              } else {
                alert("Incorrect. Review the lesson material and try again.");
                setSelectedOption(null);
              }
            }}
            className="px-12 py-5 bg-[#6B1515] text-[#F4C430] rounded-full font-black uppercase tracking-widest disabled:opacity-30 shadow-xl"
          >
            {currentQuestion === module.quizzes.length - 1 ? 'Finish Assessment' : 'Next Question'}
          </button>
        </div>
      </div>

      {showResult && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-16 max-w-lg text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              {ICONS.Review("w-12 h-12")}
            </div>
            <h2 className="text-4xl font-black text-[#6B1515] uppercase tracking-tighter mb-4">Mastery Achieved</h2>
            <p className="text-gray-500 mb-12 leading-relaxed">You have successfully validated your understanding of the <strong>{module.title}</strong> module.</p>
            <button onClick={onBack} className="w-full py-5 bg-[#6B1515] text-[#F4C430] rounded-full font-black uppercase tracking-widest shadow-lg">Return to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
};

const FacultyHub: React.FC<{ 
  logs: AuditLog[]; 
  onClearLogs: () => void;
  users: User[];
  onMaintenanceToggle: () => void;
  onNotifyDemo: () => void;
}> = ({ logs, onClearLogs, users, onMaintenanceToggle, onNotifyDemo }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'testbed'>('overview');

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#6B1515] uppercase tracking-tighter">Faculty Hub</h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest opacity-60">TechBridge Institutional Control</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
          {(['overview', 'logs', 'testbed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-[#6B1515] text-white shadow-lg' : 'text-gray-500 hover:text-[#6B1515]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Cohort Size</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#6B1515]">{users.length}</span>
              <span className="text-gray-400 text-xs font-bold uppercase">Pioneers Enrolled</span>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-50">
               <ul className="space-y-4">
                 {users.map((u, i) => (
                   <li key={i} className="flex justify-between items-center text-xs">
                     <span className="font-bold text-[#6B1515]">{u.name}</span>
                     <span className="text-gray-400">{new Date(u.enrolledAt).toLocaleDateString()}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          <div className="bg-[#6B1515] p-8 rounded-3xl shadow-xl text-white md:col-span-2 relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-[#F4C430] mb-6">Institutional Health</h4>
               <p className="text-2xl font-bold mb-8">System status: <span className="text-green-400">Operational</span></p>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                   <p className="text-[9px] uppercase font-black tracking-widest text-white/60 mb-1">Last Audit</p>
                   <p className="text-xs font-mono">{logs[0]?.timestamp.split('T')[1].split('.')[0] || 'N/A'}</p>
                 </div>
                 <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                   <p className="text-[9px] uppercase font-black tracking-widest text-white/60 mb-1">PWA Alerts</p>
                   <button onClick={onNotifyDemo} className="text-xs font-mono text-[#F4C430] underline">Send Broadcast</button>
                 </div>
               </div>
               <button 
                 onClick={onMaintenanceToggle}
                 className="mt-8 w-full py-4 bg-[#F4C430] text-[#6B1515] rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-colors"
               >
                 Institutional Maintenance Mode
               </button>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-10">
               {ICONS.Bot("w-48 h-48")}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white border-2 border-gray-100 rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-right-5">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-black text-[#6B1515] uppercase tracking-tighter">Academic Records</h3>
            <button onClick={onClearLogs} className="text-[9px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg">Purge History</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" role="grid">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Pioneer/Admin</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 font-mono text-[10px] text-gray-500">{log.timestamp}</td>
                    <td className="px-8 py-5 text-xs font-bold text-[#6B1515]">{log.user}</td>
                    <td className="px-8 py-5"><span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[9px] font-black uppercase">{log.action}</span></td>
                    <td className="px-8 py-5 text-xs text-gray-600">{log.details}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 uppercase font-black text-xs tracking-widest">No audit data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'testbed' && (
        <TestDashboard />
      )}
    </div>
  );
};

export default function App() {
  const [activeModule, setActiveModule] = useState<WorkshopModule | null>(null);
  const [currentView, setCurrentView] = useState<'auth' | 'dashboard' | 'lesson' | 'quiz' | 'admin'>('auth');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('tb-theme') as Theme) || 'light');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [lessonVisual, setLessonVisual] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tb-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [enrolledUsers, setEnrolledUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tb-all-users');
    return saved ? JSON.parse(saved) : (currentUser ? [currentUser] : []);
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => JSON.parse(localStorage.getItem('tb-audit-logs') || '[]'));

  useEffect(() => {
    if (currentUser && currentView === 'auth') {
      setCurrentView('dashboard');
    }
  }, [currentUser, currentView]);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('tb-theme', theme);
  }, [theme]);

  const addAuditLog = useCallback((action: string, details: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      user: isAdmin ? 'ADMIN_ROOT' : (currentUser?.name || 'EXTERNAL_GUEST'),
      action,
      details
    };
    const updated = [newLog, ...auditLogs].slice(0, 100);
    setAuditLogs(updated);
    localStorage.setItem('tb-audit-logs', JSON.stringify(updated));
  }, [auditLogs, isAdmin, currentUser]);

  const handleEnroll = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newUser: User = { name, initials, enrolledAt: new Date().toISOString() };
    setCurrentUser(newUser);
    localStorage.setItem('tb-user', JSON.stringify(newUser));
    const allUsers = [...enrolledUsers, newUser];
    setEnrolledUsers(allUsers);
    localStorage.setItem('tb-all-users', JSON.stringify(allUsers));
    setCurrentView('dashboard');
    addAuditLog('ENROLL', `Pioneer identified and enrolled: ${name}`);
  };

  const handleLogout = () => {
    if (confirm("Concluding session. Are you certain?")) {
      addAuditLog('LOGOUT', `Pioneer session terminated for: ${currentUser?.name}`);
      setCurrentUser(null);
      setIsAdmin(false);
      localStorage.removeItem('tb-user');
      setCurrentView('auth');
    }
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setCurrentView('dashboard');
      addAuditLog('FACULTY_DISCONNECT', 'Administrative session cleared');
    } else {
      const pass = prompt("Institutional Security Protocol: Enter Faculty Key");
      if (pass === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setCurrentView('admin');
        addAuditLog('FACULTY_CONNECT', 'Administrative oversight established');
      } else if (pass !== null) {
        alert("Unauthorized attempt blocked.");
        addAuditLog('SECURITY_VIOLATION', 'Failed faculty key injection');
      }
    }
  };

  const handleGenerateVisual = async () => {
    if (!activeModule) return;
    setIsGeneratingVisual(true);
    addAuditLog('VISUAL_GEN', `Requested conceptual visual for ${activeModule.title}`);
    const visual = await generateDesignVisual(activeModule.subtitle);
    setLessonVisual(visual);
    setIsGeneratingVisual(false);
  };

  const handleEnableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          addAuditLog('PWA_ALERTS_ENABLED', 'User granted notification permissions');
          alert("Institutional Alerts Enabled. You will receive updates via PWA Push.");
        }
      });
    }
  };

  const handleNotifyDemo = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification("TechBridge Broadcast", {
          body: "New faculty resources have been uploaded to R2: Reimagine.",
          icon: LOGO_URL
        });
        addAuditLog('BROADCAST_SENT', 'Faculty sent demo notification');
      });
    }
  };

  const getThemeClasses = () => {
    if (theme === 'dark') return 'bg-[#121212] text-white';
    if (theme === 'high-contrast') return 'bg-black text-white';
    return 'bg-[#F5F5F5] text-[#333333]';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()} font-sans`}>
      <Header 
        user={currentUser} theme={theme} setTheme={setTheme} 
        isAdmin={isAdmin} onAdminClick={handleAdminToggle} 
        onLogout={handleLogout}
        currentView={currentView} setCurrentView={setCurrentView}
      />
      
      <main className="container mx-auto px-4 py-12">
        {currentView === 'auth' && !currentUser && (
          <AuthView onEnroll={handleEnroll} theme={theme} />
        )}

        {currentUser && (
          <>
            {currentView === 'admin' && isAdmin && (
              <FacultyHub 
                logs={auditLogs} 
                onClearLogs={() => {setAuditLogs([]); localStorage.removeItem('tb-audit-logs'); addAuditLog('LOGS_PURGED', 'Admin cleared institutional history');}} 
                users={enrolledUsers}
                onMaintenanceToggle={() => alert("Maintenance mode activated.")}
                onNotifyDemo={handleNotifyDemo}
              />
            )}
            
            {currentView === 'quiz' && activeModule && <QuizView module={activeModule} onBack={() => setCurrentView('dashboard')} />}
            
            {currentView === 'dashboard' && (
              <div className="space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <section className={`relative p-10 md:p-20 rounded-[60px] overflow-hidden shadow-2xl ${
                  theme === 'high-contrast' ? 'bg-black border-4 border-yellow-400' : 'bg-maroon-diagonal'
                }`}>
                  <div className="relative z-10 max-w-4xl text-white">
                    <p className="text-[#F4C430] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Academic Status: Active</p>
                    <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-none">
                      Pioneer <br/><span className="text-[#F4C430]">Tomorrow's</span> Design.
                    </h2>
                    <p className="text-white/80 text-xl mb-10 max-w-xl font-medium">Salutations, {currentUser.name}. You are part of an elite cohort mastering the 6R Methodology.</p>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => { setActiveModule(WORKSHOP_MODULES[1]); setCurrentView('lesson'); }} 
                        className="px-12 py-6 bg-[#F4C430] text-[#6B1515] rounded-full font-black uppercase tracking-widest shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1"
                      >
                        Resume Learning Cycle
                      </button>
                      <button 
                        onClick={handleEnableNotifications}
                        className="px-12 py-6 bg-white/10 border border-white/20 text-white rounded-full font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                      >
                        Enable Alerts
                      </button>
                    </div>
                  </div>
                </section>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {WORKSHOP_MODULES.map((mod) => (
                    <div 
                      key={mod.id}
                      onClick={() => { if(mod.status !== ModuleStatus.LOCKED) { setActiveModule(mod); setLessonVisual(null); setCurrentView('lesson'); addAuditLog('MOD_ACCESS', `Navigated to module ${mod.id}: ${mod.title}`); } }}
                      className={`p-10 rounded-[40px] border-2 transition-all cursor-pointer group relative ${
                        mod.status === ModuleStatus.LOCKED ? 'opacity-40 grayscale cursor-not-allowed bg-gray-100' : 
                        theme === 'dark' ? 'bg-[#1E1E1E] border-gray-800' : 'bg-white border-transparent shadow-xl hover:border-[#6B1515]'
                      }`}
                    >
                       <div className="flex justify-between items-start mb-6">
                         <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-[#6B1515] transition-colors">
                           {ICONS.Target(`w-6 h-6 ${mod.status === ModuleStatus.LOCKED ? 'text-gray-400' : 'text-[#6B1515] group-hover:text-white'}`)}
                         </div>
                       </div>
                       <h4 className="font-black uppercase tracking-tighter text-2xl group-hover:text-[#6B1515] transition-colors mb-2">{mod.title}</h4>
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#F4C430] mb-4">{mod.subtitle}</p>
                       <p className="text-sm opacity-60 mb-10 leading-relaxed">{mod.description}</p>
                       <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className={`h-full transition-all duration-1000 ${mod.status === ModuleStatus.COMPLETED ? 'bg-green-500' : 'bg-[#6B1515]'}`} style={{ width: `${mod.progress}%` }} />
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'lesson' && activeModule && (
              <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-left-5">
                <button onClick={() => setCurrentView('dashboard')} className="font-black uppercase text-[10px] tracking-widest text-[#6B1515]/60 hover:text-[#6B1515] flex items-center gap-2">
                   {ICONS.ChevronLeft("w-4 h-4")} Return to Dashboard
                </button>
                <div className={`p-16 rounded-[60px] shadow-2xl ${theme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">{activeModule.title}</h1>
                      <p className="text-[#F4C430] font-black uppercase tracking-[0.3em] text-xs">{activeModule.subtitle}</p>
                    </div>
                  </div>
                  
                  {lessonVisual ? (
                    <div className="mb-12 rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95">
                      <img src={lessonVisual} alt="AI Generated Concept" className="w-full aspect-video object-cover" />
                      <div className="p-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-center text-[#6B1515]">AI Generated Conceptual Visual for {activeModule.subtitle}</div>
                    </div>
                  ) : (
                    <button 
                      onClick={handleGenerateVisual}
                      disabled={isGeneratingVisual}
                      className="w-full mb-12 p-10 border-4 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center text-center hover:border-[#6B1515]/20 transition-colors group"
                    >
                      {isGeneratingVisual ? (
                        <div className="animate-spin">{ICONS.Clock("w-8 h-8 text-[#6B1515]")}</div>
                      ) : (
                        ICONS.Bot("w-8 h-8 text-gray-200 group-hover:text-[#6B1515] transition-colors")
                      )}
                      <p className="mt-4 text-[#6B1515]/40 group-hover:text-[#6B1515] text-[10px] font-black uppercase tracking-widest">
                        {isGeneratingVisual ? "Generating AI Visual Aid..." : "Request Conceptual Diagram (AI)"}
                      </p>
                    </button>
                  )}

                  <p className="text-2xl opacity-80 leading-relaxed mb-16 font-medium text-gray-700">{activeModule.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {activeModule.quizzes.length > 0 && (
                      <button 
                        onClick={() => setCurrentView('quiz')}
                        className="w-full py-8 bg-[#6B1515] text-[#F4C430] rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                      >
                        {ICONS.Target("w-8 h-8")} Start Assessment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <AICoach currentStage={activeModule?.title || "Scholastic Overview"} />
    </div>
  );
}
