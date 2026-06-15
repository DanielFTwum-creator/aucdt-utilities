
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Database, FileText, Users, ClipboardCheck, 
  LogOut, Menu, X, Code2, Shield, ArrowRight, Mail, Moon, Sun, 
  Eye, BookOpen, Activity, Lock, Unlock, Terminal
} from 'lucide-react';
import { ViewState, UserRole, ThemeMode, AuditLog } from './types';
import Dashboard from './components/Dashboard';
import QuestionBank from './components/QuestionBank';
import QuizConfig from './components/QuizConfig';
import CandidateQuiz from './components/CandidateQuiz';
import EvaluatorReview from './components/EvaluatorReview';
import Analytics from './components/Analytics';
import TakeHomeView from './components/TakeHomeView';
import SystemDocs from './components/SystemDocs';
import Diagnostics from './components/Diagnostics';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.LIGHT);
  const [isSidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      user: 'Daniel Twum',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'ICT2024') {
      setIsAuthenticated(true);
      logAction('LOGIN', 'User successfully authenticated via master passcode');
    } else {
      alert('Invalid Passcode. Please contact the ICT Unit.');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === ThemeMode.LIGHT ? ThemeMode.DARK : theme === ThemeMode.DARK ? ThemeMode.CONTRAST : ThemeMode.LIGHT;
    setTheme(nextTheme);
    logAction('THEME_CHANGE', `Theme set to ${nextTheme}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-maroon flex items-center justify-center p-6">
        <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full text-center space-y-8 animate-slide">
          <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="Logo" className="h-20 mx-auto" />
          <div>
            <h1 className="text-2xl font-black text-brand-maroon">SECURE GATEWAY</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">ICT INFRASTRUCTURE PORTAL</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder="Institutional Passcode" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-maroon outline-none transition-all text-center font-bold tracking-[0.5em]"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary w-full py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform">
              ACCESS PORTAL
            </button>
          </form>
          <p className="text-[10px] font-bold text-slate-400 italic">"Design and Build a Nation!"</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'DASHBOARD', icon: <LayoutDashboard size={20} />, label: 'DASHBOARD' },
    { id: 'QUESTIONS', icon: <Database size={20} />, label: 'QUESTION BANK' },
    { id: 'QUIZZES', icon: <FileText size={20} />, label: 'TEMPLATES' },
    { id: 'TAKE_HOME', icon: <Code2 size={20} />, label: 'TAKE HOME' },
    { id: 'ASSESSMENTS', icon: <ClipboardCheck size={20} />, label: 'ASSESSMENTS' },
    { id: 'SYSTEM_DOCS', icon: <BookOpen size={20} />, label: 'SYSTEM DOCS' },
    { id: 'DIAGNOSTICS', icon: <Activity size={20} />, label: 'DIAGNOSTICS' },
  ];

  return (
    <div className={`flex h-dvh w-full transition-colors duration-300 ${theme === ThemeMode.CONTRAST ? 'theme-contrast' : theme === ThemeMode.DARK ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 w-72 md:w-24'} fixed md:relative inset-y-0 left-0 h-full transition-all duration-300 border-r ${theme === ThemeMode.CONTRAST ? 'bg-black border-white' : 'bg-brand-maroon border-brand-maroon'} flex flex-col z-40 shadow-2xl`}>
        <div className="p-6 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-8">
            <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden shadow-inner`}>
              <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="Logo" className="object-contain" />
            </div>
            {isSidebarOpen && <span className="font-heading font-black text-xl text-white tracking-tighter uppercase leading-none ml-3">TECHBRIDGE</span>}
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 min-h-[44px] w-11 flex items-center justify-center hover:bg-white/10 rounded-md text-brand-gold ml-auto" aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id as ViewState); logAction('VIEW_NAV', item.id); }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group ${currentView === item.id ? 'sidebar-link-active' : 'hover:bg-white/5 text-white/60 hover:text-white'}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="font-heading font-extrabold text-xs tracking-wider">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-3">
          <button onClick={toggleTheme} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all text-white/50">
            {theme === ThemeMode.LIGHT ? <Sun size={20} /> : theme === ThemeMode.DARK ? <Moon size={20} /> : <Eye size={20} />}
            {isSidebarOpen && <span className="font-heading font-bold text-xs tracking-wider uppercase">{theme} MODE</span>}
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-brand-gold transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-heading font-bold text-xs tracking-wider">EXIT PORTAL</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto flex flex-col relative">
        <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b-4 border-brand-maroon px-4 sm:px-6 lg:px-10 py-4 sm:py-5 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setSidebarOpen(true)} className="md:hidden p-2 min-h-[44px] w-11 flex items-center justify-center rounded-lg hover:bg-slate-100" aria-label="Open navigation">
              <Menu size={20} className="text-brand-maroon" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-3xl font-black text-brand-maroon uppercase">{currentView.replace('_', ' ')}</h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">TechBridge ICT Infrastructure Dept.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 px-5 py-2 border-2 border-brand-maroon/5 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <div className="text-right leading-tight">
              <p className="text-xs font-black text-brand-maroon uppercase">Daniel Twum</p>
              <p className="text-[9px] font-bold opacity-60">HEAD OF ICT</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-brand-gold overflow-hidden">
              <img src="https://picsum.photos/40/40?grayscale&seed=daniel" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-10">
          {currentView === 'DASHBOARD' && <Dashboard />}
          {currentView === 'QUESTIONS' && <QuestionBank />}
          {currentView === 'QUIZZES' && <QuizConfig />}
          {currentView === 'TAKE_HOME' && <TakeHomeView />}
          {currentView === 'SYSTEM_DOCS' && <SystemDocs />}
          {currentView === 'DIAGNOSTICS' && <Diagnostics auditLogs={auditLogs} />}
        </div>

        <footer className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              Formerly AsanSka University College of Design and Technology • &copy; 2024 TechBridge University College ICT Unit
            </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
