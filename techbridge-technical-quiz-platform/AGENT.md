# techbridge-technical-quiz-platform - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-technical-quiz-platform.

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
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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
    <div className={`flex h-screen w-full transition-colors duration-300 ${theme === ThemeMode.CONTRAST ? 'theme-contrast' : theme === ThemeMode.DARK ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} h-full transition-all duration-300 border-r ${theme === ThemeMode.CONTRAST ? 'bg-black border-white' : 'bg-brand-maroon border-brand-maroon'} flex flex-col z-20 shadow-2xl`}>
        <div className="p-6 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-8">
            <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden shadow-inner`}>
              <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="Logo" className="object-contain" />
            </div>
            {isSidebarOpen && <span className="font-heading font-black text-xl text-white tracking-tighter uppercase leading-none ml-3">TECHBRIDGE</span>}
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-white/10 rounded-md text-brand-gold ml-auto">
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
        <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b-4 border-brand-maroon px-10 py-5 flex justify-between items-center shadow-md">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-brand-maroon uppercase">{currentView.replace('_', ' ')}</h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">TechBridge ICT Infrastructure Dept.</p>
          </div>
          <div className="flex items-center gap-4 px-5 py-2 border-2 border-brand-maroon/5 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <div className="text-right leading-tight">
              <p className="text-xs font-black text-brand-maroon uppercase">Daniel Twum</p>
              <p className="text-[9px] font-bold opacity-60">HEAD OF ICT</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-brand-gold overflow-hidden">
              <img src="https://picsum.photos/40/40?grayscale&seed=daniel" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 p-10">
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

```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_techbridge_technical_quiz_platform';
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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Techbridge Technical Quiz Platform</h1>
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

### FILE: components/Analytics.tsx
```typescript

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Award, Target, Zap, Clock } from 'lucide-react';

const categoryData = [
  { subject: 'Java Core', A: 85, B: 70, fullMark: 100 },
  { subject: 'Spring Boot', A: 65, B: 80, fullMark: 100 },
  { subject: 'MariaDB', A: 90, B: 60, fullMark: 100 },
  { subject: 'DevOps', A: 40, B: 55, fullMark: 100 },
  { subject: 'Soft Skills', A: 75, B: 90, fullMark: 100 },
];

const distributionData = [
  { range: '0-20', count: 5 },
  { range: '21-40', count: 12 },
  { range: '41-60', count: 25 },
  { range: '61-80', count: 48 },
  { range: '81-100', count: 32 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pass Rate', value: '68%', icon: <Target className="text-indigo-500" />, sub: 'Cohort Average' },
          { label: 'Top Score', value: '98/100', icon: <Award className="text-emerald-500" />, sub: 'Sarah Chen' },
          { label: 'Avg Time', value: '42m', icon: <Clock className="text-amber-500" />, sub: 'Out of 60m' },
          { label: 'Completion', value: '94%', icon: <Zap className="text-purple-500" />, sub: 'Active Sessions' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700">{stat.icon}</div>
              <span className="text-sm font-bold opacity-60 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-3xl font-black mb-1">{stat.value}</p>
            <p className="text-xs font-medium text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Distribution */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            Score Distribution
            <span className="text-xs font-normal opacity-50 px-2 py-0.5 bg-slate-100 rounded-full">Histogram</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Map */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-6">Cohort Competency Map</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 11}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Current Candidate" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Radar name="Average Cohort" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Tooltip contentStyle={{borderRadius: '16px'}} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

```

### FILE: components/CandidateQuiz.tsx
```typescript

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Flag, 
  Send,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { MOCK_QUESTIONS } from '../mockData';
import { QuestionType } from '../types';

interface CandidateQuizProps {
  onFinish: () => void;
}

const CandidateQuiz: React.FC<CandidateQuizProps> = ({ onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 mins
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAutoSubmit = () => {
    alert("Time's up! Your answers are being submitted.");
    onFinish();
  };

  const currentQuestion = MOCK_QUESTIONS[currentIdx];

  const handleResponse = (val: any) => {
    setResponses(prev => ({ ...prev, [currentQuestion.id]: val }));
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestion.id)) {
      newFlagged.delete(currentQuestion.id);
    } else {
      newFlagged.add(currentQuestion.id);
    }
    setFlagged(newFlagged);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const progress = (Object.keys(responses).length / MOCK_QUESTIONS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Quiz Header (Sticky) */}
      <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${timeLeft < 300 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-indigo-100 text-indigo-600'}`}>
            <Timer size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold tracking-wider opacity-60">Time Remaining</p>
            <p className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-rose-600' : 'text-slate-800 dark:text-slate-100'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
        <div className="flex-1 mx-8 max-w-xs hidden sm:block">
          <div className="flex justify-between text-xs mb-1 font-bold">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <button 
          onClick={() => setIsSubmitting(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
        >
          <Send size={18} />
          Submit Quiz
        </button>
      </div>

      {/* Question Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-start mb-6">
              <span className="text-indigo-600 font-bold px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-sm">
                Question {currentIdx + 1} of {MOCK_QUESTIONS.length}
              </span>
              <button 
                onClick={toggleFlag}
                className={`p-2 rounded-lg transition-colors ${flagged.has(currentQuestion.id) ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <Flag size={20} fill={flagged.has(currentQuestion.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <h2 className="text-xl font-semibold leading-relaxed mb-8">
              {currentQuestion.content}
            </h2>

            <div className="space-y-4">
              {currentQuestion.type === QuestionType.MCQ && currentQuestion.options?.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleResponse(option)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${
                    responses[currentQuestion.id] === option 
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' 
                    : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    responses[currentQuestion.id] === option 
                    ? 'border-indigo-600 bg-indigo-600 text-white' 
                    : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-400'
                  }`}>
                    {responses[currentQuestion.id] === option && <CheckCircle size={14} />}
                  </div>
                  <span className="font-medium">{option}</span>
                </button>
              ))}

              {currentQuestion.type === QuestionType.CODE && (
                <textarea
                  className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-indigo-400 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                  placeholder="// Enter your solution code here..."
                  value={responses[currentQuestion.id] || ''}
                  onChange={(e) => handleResponse(e.target.value)}
                />
              )}

              {currentQuestion.type === QuestionType.SCENARIO && (
                <textarea
                  className="w-full h-48 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Type your detailed response here..."
                  value={responses[currentQuestion.id] || ''}
                  onChange={(e) => handleResponse(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <div className="flex gap-2">
              {MOCK_QUESTIONS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIdx ? 'w-8 bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
              ))}
            </div>
            <button 
              disabled={currentIdx === MOCK_QUESTIONS.length - 1}
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Question Map */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-60">Question Map</h3>
            <div className="grid grid-cols-4 gap-2">
              {MOCK_QUESTIONS.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(i)}
                  className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all border-2 ${
                    currentIdx === i ? 'border-indigo-600 ring-2 ring-indigo-100 ring-offset-2 dark:ring-offset-slate-900' : 'border-transparent'
                  } ${
                    responses[q.id] ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  } ${
                    flagged.has(q.id) ? 'bg-amber-400 text-white border-amber-400' : ''
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium">
                <div className="w-3 h-3 rounded bg-indigo-600"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-700"></div>
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <div className="w-3 h-3 rounded bg-amber-400"></div>
                <span>Flagged</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 mb-2">
              <HelpCircle size={18} />
              <span className="font-bold">Need Help?</span>
            </div>
            <p className="text-xs leading-relaxed text-indigo-600 dark:text-indigo-500">
              Your progress is auto-saved every 30 seconds. In case of disconnection, just refresh the page.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Ready to submit?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
              You have {MOCK_QUESTIONS.length - Object.keys(responses).length} unanswered questions. Once submitted, you cannot change your answers.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsSubmitting(false)}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={onFinish}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateQuiz;

```

### FILE: components/Dashboard.tsx
```typescript

import React from 'react';
import { 
  Users, 
  BookOpen, 
  CheckSquare, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', candidates: 12, avgScore: 65 },
  { name: 'Tue', candidates: 18, avgScore: 72 },
  { name: 'Wed', candidates: 15, avgScore: 68 },
  { name: 'Thu', candidates: 25, avgScore: 75 },
  { name: 'Fri', candidates: 30, avgScore: 82 },
  { name: 'Sat', candidates: 10, avgScore: 78 },
  { name: 'Sun', candidates: 5, avgScore: 70 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Brand Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Enrolled Candidates', value: '1,248', icon: <Users />, trend: '+12%', color: 'bg-brand-maroon text-white' },
          { label: 'Active Curriculums', value: '24', icon: <BookOpen />, trend: '+2', color: 'bg-brand-gold text-brand-maroon' },
          { label: 'Evaluation Queue', value: '18', icon: <CheckSquare />, trend: 'Urgent', color: 'bg-white border-2 border-brand-maroon text-brand-maroon' },
          { label: 'Course Completion', value: '84%', icon: <Clock />, trend: '+5%', color: 'bg-slate-900 text-brand-gold' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} p-8 rounded-3xl shadow-lg border border-white/5 group transition-transform hover:scale-105`}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-white/10">{stat.icon}</div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-black/10 rounded-full">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest opacity-70">{stat.label}</h3>
            <p className="text-3xl font-black mt-2 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart - Brand Palette */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2rem] border-2 border-brand-maroon/5 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-brand-maroon tracking-tight uppercase">Institutional Performance Metrics</h2>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-maroon"></span>
              <span className="w-3 h-3 rounded-full bg-brand-gold"></span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B1D1D" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6B1D1D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B1D1D', fontSize: 11, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B1D1D', fontSize: 11, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="candidates" stroke="#6B1D1D" fillOpacity={1} fill="url(#colorBrand)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Review Queue with Brand Styling */}
        <div className="bg-brand-maroon text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
              PENDING EVALUATIONS
              <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Alex Rivera', role: 'Full Stack Dev', time: '2h ago', avatar: 'https://picsum.photos/40/40?random=1' },
                { name: 'Sarah Chen', role: 'Java Specialist', time: '4h ago', avatar: 'https://picsum.photos/40/40?random=2' },
                { name: 'John Doe', role: 'DevOps Lead', time: '1d ago', avatar: 'https://picsum.photos/40/40?random=3' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/10 rounded-2xl transition-all cursor-pointer group">
                  <img src={activity.avatar} className="w-12 h-12 rounded-full border-2 border-brand-gold/30" alt="" />
                  <div className="flex-1">
                    <p className="font-bold text-sm tracking-tight">{activity.name}</p>
                    <p className="text-[10px] font-bold text-brand-gold/60 uppercase">{activity.role}</p>
                  </div>
                  <ArrowRight size={16} className="text-brand-gold opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-brand-gold text-brand-maroon font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors">
              Access Review Portal
            </button>
          </div>
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-brand-gold/5 blur-[80px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

```

### FILE: components/Diagnostics.tsx
```typescript

import React, { useState } from 'react';
import { Activity, Terminal, Shield, CheckCircle, AlertTriangle, Search, Trash2 } from 'lucide-react';
import { AuditLog } from '../types';

interface DiagnosticsProps {
  auditLogs: AuditLog[];
}

const Diagnostics: React.FC<DiagnosticsProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'LOGS' | 'TESTS'>('LOGS');
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runSystemTests = () => {
    setIsRunningTests(true);
    setTimeout(() => setIsRunningTests(false), 2000);
  };

  return (
    <div className="space-y-8 animate-slide">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 border-b-8 border-brand-gold shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-brand-gold">
              <Activity className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Unit Diagnostic Suite</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Infrastructure Integrity</h2>
          </div>
          <button 
            onClick={runSystemTests}
            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isRunningTests ? 'bg-slate-700 text-slate-400' : 'bg-brand-gold text-brand-maroon hover:scale-105'}`}
            disabled={isRunningTests}
          >
            {isRunningTests ? 'Executing Puppeteer Suite...' : 'Run Production Tests'}
          </button>
        </div>
        <div className="absolute right-[-40px] top-[-40px] opacity-[0.03] text-white">
          <Shield size={300} fill="currentColor" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {[
            { id: 'LOGS', label: 'AUDIT LEDGER', icon: <Terminal size={18}/> },
            { id: 'TESTS', label: 'TEST ARTIFACTS', icon: <CheckCircle size={18}/> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black text-[10px] tracking-[0.2em] uppercase transition-all ${activeTab === tab.id ? 'bg-brand-maroon text-brand-gold shadow-xl scale-105' : 'bg-white text-slate-400 hover:text-brand-maroon border border-slate-100'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] border-2 border-brand-maroon/5 shadow-2xl overflow-hidden min-h-[600px]">
            {activeTab === 'LOGS' ? (
              <div className="p-0">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Filter logs..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-maroon" />
                  </div>
                  <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
                <div className="p-6 space-y-4">
                  {auditLogs.length > 0 ? auditLogs.map(log => (
                    <div key={log.id} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                      <div className="p-2 bg-slate-100 text-slate-400 rounded-lg shrink-0 group-hover:bg-brand-gold group-hover:text-brand-maroon transition-colors"><Shield size={16}/></div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-brand-maroon tracking-wider">{log.action}</span>
                          <span className="text-[9px] font-bold text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700">{log.details}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No Log Entries Found</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-10 space-y-8">
                <div className="p-8 bg-brand-maroon/5 rounded-3xl border-2 border-dashed border-brand-maroon/20 flex flex-col items-center justify-center text-center space-y-4">
                  <Terminal size={48} className="text-brand-maroon/20" />
                  <div>
                    <h3 className="font-black text-brand-maroon">TEST ARTIFACTS</h3>
                    <p className="text-xs text-slate-500 font-bold max-w-xs mx-auto mt-2 uppercase tracking-tighter">Automated Puppeteer screenshots and PDF reports will populate here after test execution.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-video bg-slate-100 rounded-2xl border-2 border-slate-200 animate-pulse flex items-center justify-center">
                       <Shield className="text-slate-300" size={32} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;

```

### FILE: components/EvaluatorReview.tsx
```typescript

import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Award, 
  ArrowRight,
  Code,
  FileText,
  Star
} from 'lucide-react';
import { MOCK_QUESTIONS } from '../mockData';
import { QuestionType } from '../types';

const EvaluatorReview: React.FC = () => {
  const [selectedAssessment, setSelectedAssessment] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const candidates = [
    { name: 'Alex Rivera', role: 'Senior Java Dev', score: 85, status: 'Needs Review', submitted: '2h ago' },
    { name: 'Sarah Chen', role: 'Full Stack Engineer', score: 92, status: 'Reviewed', submitted: '4h ago' },
    { name: 'John Doe', role: 'Backend Lead', score: 64, status: 'Needs Review', submitted: '1d ago' },
  ];

  // For demo, we show the first subjective question
  const subjectQuestion = MOCK_QUESTIONS.find(q => q.type === QuestionType.CODE || q.type === QuestionType.SCENARIO);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar - Review Queue */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-60 px-2">Review Queue</h3>
        <div className="space-y-2">
          {candidates.map((cand, i) => (
            <button
              key={i}
              onClick={() => setSelectedAssessment(i)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selectedAssessment === i 
                ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-700' 
                : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold truncate">{cand.name}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${cand.status === 'Reviewed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {cand.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{cand.role}</p>
              <div className="flex justify-between items-center text-[10px] font-bold opacity-60">
                <span>Objective: {cand.score}%</span>
                <span>{cand.submitted}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Review Workspace */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{candidates[selectedAssessment].name}</h2>
                <p className="text-sm text-slate-500">Evaluation: Full Stack Java Assessment v1</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
              Finalize & Release
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Question Breakdown */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Code size={20} /></span>
                  <h3 className="font-bold text-lg">Question 2: Coding Challenge</h3>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-sm font-semibold opacity-60">Weight: 25 pts</span>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">Candidate Response</h4>
                  <div className="p-6 bg-slate-900 text-indigo-300 font-mono text-xs rounded-2xl shadow-inner leading-relaxed">
                    <pre>{`@GetMapping("/{id}")
public User fetchUser(@PathVariable Long id) {
  return service.find(id);
  // I would also add error handling here
  // maybe a try catch block
}`}</pre>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">Ideal Solution / Rubric</h4>
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-400 font-mono text-xs rounded-2xl border border-emerald-100 dark:border-emerald-900/50 leading-relaxed">
                    <pre>{`@GetMapping("/{id}")
public ResponseEntity<User> getUser(@PathVariable Long id) {
  return repository.findById(id)
    .map(ResponseEntity::ok)
    .orElse(ResponseEntity.notFound().build());
}`}</pre>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-sm font-bold flex items-center gap-2"><MessageSquare size={16} /> Feedback for Candidate</h4>
                  <textarea 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter detailed feedback..."
                  ></textarea>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold flex items-center gap-2"><Star size={16} /> Scoring</h4>
                  <div className="space-y-2">
                    <label className="text-xs opacity-60 font-bold block">Assigned Points (Max 25)</label>
                    <input 
                      type="number" 
                      max="25" 
                      className="w-full p-3 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-700 rounded-xl text-xl font-bold text-center focus:border-indigo-500 outline-none transition-all"
                      placeholder="0"
                    />
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(v => (
                        <button key={v} className="flex-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 text-[10px] font-bold transition-all">
                          {v*5}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluatorReview;

```

### FILE: components/QuestionBank.tsx
```typescript

import React, { useState } from 'react';
/* Added CheckSquare to the lucide-react imports */
import { Search, Filter, Plus, Edit3, Trash2, MoreVertical, Code, List, HelpCircle, FileText, CheckSquare } from 'lucide-react';
import { MOCK_QUESTIONS } from '../mockData';
import { QuestionType, Difficulty } from '../types';

const QuestionBank: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const filteredQuestions = MOCK_QUESTIONS.filter(q => 
    (filterType === 'All' || q.type === filterType) &&
    (q.content.toLowerCase().includes(searchTerm.toLowerCase()) || q.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDifficultyColor = (diff: Difficulty) => {
    switch(diff) {
      case Difficulty.BEGINNER: return 'bg-emerald-100 text-emerald-700';
      case Difficulty.INTERMEDIATE: return 'bg-blue-100 text-blue-700';
      case Difficulty.ADVANCED: return 'bg-amber-100 text-amber-700';
      case Difficulty.EXPERT: return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTypeIcon = (type: QuestionType) => {
    switch(type) {
      case QuestionType.MCQ: return <List size={16} />;
      case QuestionType.CODE: return <Code size={16} />;
      case QuestionType.SCENARIO: return <HelpCircle size={16} />;
      case QuestionType.MULTI_SELECT: return <CheckSquare size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search questions, categories, tags..." 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium">
            <Filter size={18} />
            Filters
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium shadow-md shadow-indigo-100 dark:shadow-none">
            <Plus size={18} />
            New Question
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Question</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Points</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredQuestions.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4 max-w-xs">
                  <div className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2">{q.content}</div>
                  <div className="flex gap-1 mt-1">
                    {q.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded uppercase font-bold">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    {getTypeIcon(q.type)}
                    {q.type}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">{q.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getDifficultyColor(q.difficulty)}`}>
                    {q.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-indigo-600">{q.points}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-all"><Edit3 size={18} /></button>
                    <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredQuestions.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <p>No questions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;

```

### FILE: components/QuizConfig.tsx
```typescript

import React from 'react';
import { MOCK_QUIZZES } from '../mockData';
import { Settings, Clock, Target, ListChecks, ChevronRight } from 'lucide-react';

const QuizConfig: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_QUIZZES.map((quiz) => (
          <div key={quiz.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl">
                <Settings size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-500">
                {quiz.category}
              </span>
            </div>
            
            <h3 className="text-lg font-bold mb-4 group-hover:text-indigo-600 transition-colors">{quiz.name}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm opacity-70 font-medium">
                <Clock size={16} />
                <span>{quiz.timeLimit} Minutes Duration</span>
              </div>
              <div className="flex items-center gap-3 text-sm opacity-70 font-medium">
                <ListChecks size={16} />
                <span>{quiz.questions.length} Selected Questions</span>
              </div>
              <div className="flex items-center gap-3 text-sm opacity-70 font-medium">
                <Target size={16} />
                <span>{quiz.passThreshold}% Passing Score</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex gap-2">
              <button className="flex-1 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                Edit Config
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-all hover:bg-indigo-50/30">
          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
            <Settings size={24} />
          </div>
          <span className="font-bold">Create New Template</span>
        </button>
      </div>
    </div>
  );
};

export default QuizConfig;

```

### FILE: components/SystemDocs.tsx
```typescript

import React, { useState } from 'react';
import { FileText, Layers, Users, Server, HardDrive, ShieldCheck } from 'lucide-react';

const SystemDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SRS' | 'ARCH' | 'GUIDE'>('SRS');

  const ArchitectureDiagram = () => (
    <div className="bg-slate-900 p-8 rounded-[2rem] border-2 border-brand-maroon/20 shadow-2xl overflow-hidden flex items-center justify-center">
      <svg viewBox="0 0 800 500" className="w-full h-auto max-w-4xl text-brand-gold">
        <rect x="300" y="50" width="200" height="60" rx="10" fill="#6B1D1D" stroke="#F4C430" strokeWidth="2" />
        <text x="400" y="85" textAnchor="middle" fill="#F4C430" fontSize="14" fontWeight="bold">REACT CLIENT APP</text>
        
        <path d="M400 110 V160" stroke="#F4C430" strokeWidth="2" strokeDasharray="5,5" />
        
        <rect x="250" y="160" width="300" height="100" rx="15" fill="#4A1515" stroke="#F4C430" strokeWidth="2" />
        <text x="400" y="195" textAnchor="middle" fill="#F4C430" fontSize="14" fontWeight="bold">ICT GATEWAY (AUTH & LOGIC)</text>
        <text x="400" y="220" textAnchor="middle" fill="#FFF" fontSize="10" opacity="0.7">Spring Boot 3.x | JWT | Audit Log</text>
        
        <path d="M400 260 V310" stroke="#F4C430" strokeWidth="2" />
        
        <rect x="325" y="310" width="150" height="80" rx="10" fill="#222" stroke="#F4C430" strokeWidth="2" />
        <text x="400" y="345" textAnchor="middle" fill="#F4C430" fontSize="14" fontWeight="bold">MARIADB</text>
        <text x="400" y="365" textAnchor="middle" fill="#FFF" fontSize="10" opacity="0.7">Persistent Ledger</text>
        
        <rect x="580" y="170" width="120" height="60" rx="10" fill="#333" stroke="#F4C430" strokeWidth="2" />
        <text x="640" y="205" textAnchor="middle" fill="#F4C430" fontSize="14" fontWeight="bold">REDIS</text>
        
        <path d="M550 210 H580" stroke="#F4C430" strokeWidth="2" />
        <circle cx="400" cy="450" r="30" fill="#6B1D1D" stroke="#F4C430" strokeWidth="2" />
        <text x="400" y="455" textAnchor="middle" fill="#F4C430" fontSize="12" fontWeight="bold">DOCKER</text>
      </svg>
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex gap-4">
        {[
          { id: 'SRS', label: 'IEEE SRS', icon: <FileText size={18}/> },
          { id: 'ARCH', label: 'Architecture Diagram', icon: <Layers size={18}/> },
          { id: 'GUIDE', label: 'Admin Guide', icon: <ShieldCheck size={18}/> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs tracking-widest transition-all ${activeTab === tab.id ? 'bg-brand-maroon text-brand-gold shadow-lg scale-105' : 'bg-white border border-slate-100 text-slate-400 hover:text-brand-maroon'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-12 rounded-[3rem] border-2 border-brand-maroon/5 shadow-2xl space-y-8 animate-slide">
        {activeTab === 'SRS' && (
          <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black text-brand-maroon border-b-4 border-brand-gold pb-4 inline-block">1. Introduction</h2>
            <p className="mt-6 text-slate-600 leading-relaxed font-medium">The TechBridge Institutional Assessment Platform (IAP) serves as the primary technical evaluation engine for the TechBridge University College ICT Unit. It provides a standardized framework for evaluating full-stack competency with a focus on Spring Boot, MariaDB, and containerized deployment.</p>
            <h3 className="text-xl font-bold text-brand-maroon mt-8">2. Functional Requirements</h3>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-600">
              <li>Master Passcode Authentication (ICT Unit Access)</li>
              <li>Hierarchical Take-Home Directive Distribution</li>
              <li>Institutional Audit Logging (Security Compliant)</li>
              <li>Universal Accessibility (Light/Dark/High-Contrast)</li>
            </ul>
          </div>
        )}

        {activeTab === 'ARCH' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-brand-maroon">SYSTEM TOPOLOGY v1.0</h2>
            <ArchitectureDiagram />
          </div>
        )}

        {activeTab === 'GUIDE' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 rounded-3xl space-y-4">
                <div className="p-3 bg-brand-maroon text-brand-gold rounded-xl inline-block"><Users size={24}/></div>
                <h3 className="font-black text-brand-maroon">STAFF ONBOARDING</h3>
                <p className="text-xs text-slate-500 font-bold uppercase">Authorized Daniel Twum Directive</p>
                <ol className="list-decimal pl-4 text-sm text-slate-600 space-y-2">
                  <li>Assign Candidate ID through Question Bank</li>
                  <li>Monitor Take-Home completion in Review Queue</li>
                  <li>Generate Performance SVG for Deanery review</li>
                </ol>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl space-y-4">
                <div className="p-3 bg-brand-gold text-brand-maroon rounded-xl inline-block"><Server size={24}/></div>
                <h3 className="font-black text-brand-maroon">DEPLOYMENT SPECS</h3>
                <p className="text-xs text-slate-500 font-bold uppercase">DevOps Infrastructure</p>
                <code className="block bg-slate-900 text-brand-gold p-4 rounded-xl text-xs font-mono">
                  docker-compose up -d --build
                  <br/># MariaDB 10.11
                  <br/># Spring Boot 3.2.1
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemDocs;

```

### FILE: components/TakeHomeView.tsx
```typescript

import React, { useState } from 'react';
import { 
  Book, 
  Terminal, 
  Database, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Server,
  Layers,
  Shield,
  Zap,
  Star,
  Trophy,
  Mail,
  Fingerprint
} from 'lucide-react';
import { MOCK_TAKE_HOMES } from '../mockData';
import { Difficulty } from '../types';

const TakeHomeView: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number>(0); // 0: Easy, 1: Medium, 2: Hard
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentProject = MOCK_TAKE_HOMES[selectedTier];

  const toggleStep = (idx: number) => {
    const next = new Set(completedSteps);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setCompletedSteps(next);
  };

  const getTierIcon = (idx: number) => {
    switch(idx) {
      case 0: return <Zap size={18} />;
      case 1: return <Star size={18} />;
      case 2: return <Trophy size={18} />;
      default: return <Shield size={18} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Tier Selector Navigation */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Select Assessment Tier</p>
        <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border-2 border-brand-maroon/10 shadow-lg flex gap-2">
          {MOCK_TAKE_HOMES.map((project, idx) => (
            <button
              key={project.id}
              onClick={() => {
                setSelectedTier(idx);
                setCompletedSteps(new Set());
              }}
              className={`px-6 py-3 rounded-xl font-heading font-black text-xs tracking-widest transition-all flex items-center gap-3 relative overflow-hidden ${
                selectedTier === idx 
                ? 'bg-brand-maroon text-brand-gold shadow-md scale-105' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-brand-maroon'
              }`}
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0">
                  <div className="bg-brand-gold text-brand-maroon text-[6px] font-black px-1 transform rotate-45 translate-x-2 -translate-y-0.5">REC</div>
                </div>
              )}
              {getTierIcon(idx)}
              {project.difficulty.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Academic Brief Header */}
      <div className="bg-brand-maroon text-white rounded-[3rem] p-10 relative overflow-hidden shadow-2xl border-b-8 border-brand-gold transition-all duration-500">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-gold rounded-xl text-brand-maroon animate-pulse">
                {getTierIcon(selectedTier)}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Directive Level: {currentProject.difficulty}</span>
                {selectedTier === 0 && <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Recommended for ICT Unit Onboarding</span>}
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none brand-heading">
              {currentProject.title}
            </h1>
            <p className="text-brand-lightGold/60 text-lg font-medium leading-relaxed italic border-l-4 border-brand-gold pl-6">
              "{currentProject.overview}"
            </p>
            
            <div className="pt-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-brand-gold p-0.5 shrink-0 bg-white">
                <img src="https://picsum.photos/48/48?grayscale&seed=daniel" alt="Daniel Twum" className="rounded-full grayscale" />
              </div>
              <div className="text-sm">
                <p className="font-black uppercase tracking-tight text-brand-gold">Daniel Twum</p>
                <p className="text-xs font-bold text-white/50 uppercase">Head of ICT • TechBridge Authority</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 w-full md:w-80 space-y-6 shrink-0 relative">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-brand-gold text-brand-maroon rounded-full flex items-center justify-center shadow-lg border-4 border-brand-maroon animate-bounce">
              <Fingerprint size={24} />
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-gold/10 rounded-2xl text-brand-gold">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-brand-gold/50 tracking-widest">Directive Window</p>
                <p className="text-2xl font-black">{currentProject.duration}</p>
              </div>
            </div>
            <div className="h-px bg-white/10"></div>
            <button className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl">
              <Download size={20} />
              GET OFFICIAL BRIEF
            </button>
          </div>
        </div>
        
        {/* Abstract watermark */}
        <div className="absolute right-[-100px] bottom-[-100px] opacity-[0.03]">
           <Shield size={600} fill="currentColor" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Core Content */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* Deliverables Section */}
          <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-brand-maroon/5 shadow-2xl overflow-hidden">
            <div className="px-10 py-8 border-b-2 border-brand-maroon/5 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-4">
              <div className="p-3 bg-brand-maroon text-brand-gold rounded-2xl shadow-lg"><Book size={20} /></div>
              <h2 className="text-2xl font-black text-brand-maroon tracking-tight uppercase">Mission Objectives</h2>
            </div>
            <div className="p-10 space-y-5">
              {currentProject.userStories.map((story: string, i: number) => (
                <div 
                  key={i} 
                  onClick={() => toggleStep(i)}
                  className={`flex items-start gap-6 p-6 rounded-3xl cursor-pointer transition-all border-2 ${
                    completedSteps.has(i) 
                    ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800' 
                    : 'bg-white border-slate-100 dark:bg-slate-900 hover:border-brand-gold shadow-sm'
                  }`}
                >
                  <div className={`mt-1 shrink-0 ${completedSteps.has(i) ? 'text-emerald-500' : 'text-brand-maroon/20'}`}>
                    <CheckCircle2 size={30} fill={completedSteps.has(i) ? 'currentColor' : 'none'} strokeWidth={3} />
                  </div>
                  <p className={`font-extrabold text-lg leading-tight tracking-tight ${completedSteps.has(i) ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-50' : 'text-slate-800 dark:text-slate-100'}`}>
                    {story}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Architecture Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="bg-brand-maroon rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8 border-r-4 border-brand-gold">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-gold text-brand-maroon rounded-2xl"><Server size={20} /></div>
                <h2 className="text-xl font-black tracking-tight uppercase">API Blueprint</h2>
              </div>
              <div className="space-y-4">
                {currentProject.apiSpecs.map((api: any, i: number) => (
                  <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/10 group hover:border-brand-gold transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                        api.method === 'POST' ? 'bg-brand-gold text-brand-maroon' :
                        api.method === 'GET' ? 'bg-white/20 text-white' : 'bg-brand-brown text-white'
                      }`}>{api.method}</span>
                      <code className="text-xs font-black tracking-wider text-brand-gold">{api.path}</code>
                    </div>
                    <p className="text-xs font-bold text-white/50">{api.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-brand-gold rounded-[2.5rem] p-10 text-brand-maroon shadow-2xl space-y-8 border-b-8 border-brand-maroon/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-maroon text-brand-gold rounded-2xl"><Database size={20} /></div>
                <h2 className="text-xl font-black tracking-tight uppercase">Schema Definition</h2>
              </div>
              <div className="space-y-5">
                {currentProject.databaseSchema.map((schema: string, i: number) => (
                  <div key={i} className="flex gap-4">
                    <Layers size={18} className="mt-1 text-brand-maroon shrink-0 opacity-40" />
                    <p className="text-sm font-black italic leading-tight">{schema}</p>
                  </div>
                ))}
                <div className="h-px bg-brand-maroon/20 w-full"></div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-brand-maroon animate-ping"></div>
                   <p className="text-[10px] font-black uppercase">MariaDB 10.11+ Required</p>
                </div>
              </div>
            </section>
          </div>

          {/* Environment Constraints Card */}
          <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-brand-maroon/5 shadow-2xl overflow-hidden">
            <div className="px-10 py-8 border-b-2 border-brand-maroon/5 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl"><Terminal size={20} /></div>
              <h2 className="text-2xl font-black text-brand-maroon tracking-tight uppercase">Infrastructure Directives</h2>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentProject.technicalConstraints.map((constraint, i) => {
                const [cat, detail] = constraint.includes(':') ? constraint.split(':') : [null, constraint];
                return (
                  <div key={i} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-brand-maroon/20 transition-all group">
                    {cat && <span className="block text-[10px] font-black uppercase text-brand-maroon/40 tracking-widest mb-2 group-hover:text-brand-maroon transition-colors">{cat}</span>}
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">{detail}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          {/* Official ICT Contact */}
          <div className="bg-white rounded-[2.5rem] border-4 border-brand-maroon p-8 shadow-xl space-y-4 relative overflow-hidden group">
             <div className="absolute -bottom-8 -right-8 text-brand-maroon/5 group-hover:text-brand-maroon/10 transition-colors">
                <Shield size={120} fill="currentColor" />
             </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-maroon flex items-center justify-center text-white">
                  <Mail size={16} />
                </div>
                <h3 className="font-heading font-black text-xs text-brand-maroon uppercase tracking-widest">ICT Support</h3>
             </div>
             <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase relative z-10">
                Authorized directive issued by the ICT Governance Office.
             </p>
             <p className="text-xs font-black text-brand-maroon relative z-10">daniel.twum@techbridge.edu.gh</p>
          </div>

          {/* Submission Protocol */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8 border-t-8 border-brand-gold">
            <h3 className="text-2xl font-black tracking-tight uppercase leading-none">Submission Protocol</h3>
            <div className="space-y-6">
              {[1,2,3].map((step) => (
                <div key={step} className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-2xl bg-brand-gold text-brand-maroon flex items-center justify-center font-black text-xl shrink-0">
                    {step}
                  </div>
                  <p className="text-xs font-bold text-slate-300">
                    {step === 1 && "Fork the certified Spring Boot / MariaDB boilerplate."}
                    {step === 2 && "Implement logic and provide a production-ready Dockerfile."}
                    {step === 3 && "Submit via the official ICT staff portal for verification."}
                  </p>
                </div>
              ))}
            </div>
            <a 
              href={currentProject.boilerplateUrl} 
              target="_blank" 
              className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-black"
            >
              ACCESS ICT REPO <ExternalLink size={20} />
            </a>
          </div>

          {/* Institutional Rubric */}
          <div className="bg-white rounded-[2.5rem] border-2 border-brand-maroon/5 p-10 shadow-xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-lightGold text-brand-maroon rounded-2xl"><Info size={20} /></div>
              <h3 className="font-black text-xs uppercase tracking-widest text-brand-maroon">Grading Matrix</h3>
            </div>
            <div className="space-y-6">
              {currentProject.rubric.map((item: any, i: number) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                    <span className="text-slate-500">{item.criterion}</span>
                    <span className="text-brand-maroon">{item.weight}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-brand-maroon rounded-full" style={{ width: `${item.weight}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeHomeView;

```

### FILE: CREATION.md
```md
# techbridge-technical-quiz-platform

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

This application is deployed behind an Nginx reverse proxy at the path `/techbridge-technical-quiz-platform/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/techbridge-technical-quiz-platform/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/techbridge-technical-quiz-platform/',  // REQUIRED: Assets must load from /techbridge-technical-quiz-platform/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/techbridge-technical-quiz-platform"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/techbridge-technical-quiz-platform">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/techbridge-technical-quiz-platform/`, not at the root
- **Asset Loading**: Without `base: '/techbridge-technical-quiz-platform/'`, assets try to load from `/assets/` instead of `/techbridge-technical-quiz-platform/assets/`
- **Routing**: Without `basename="/techbridge-technical-quiz-platform"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/techbridge-technical-quiz-platform/assets/index-*.js`
- Link tags should reference: `/techbridge-technical-quiz-platform/assets/index-*.css`

If they reference `/assets/` instead of `/techbridge-technical-quiz-platform/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/techbridge-technical-quiz-platform/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/techbridge-technical-quiz-platform/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: techbridge-technical-quiz-platform

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
# Admin Guide — techbridge-technical-quiz-platform

**Application:** techbridge-technical-quiz-platform
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

Audit log data is stored in `localStorage` under the key `tuc_techbridge-technical-quiz-platform_audit`.

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
# Deployment Guide — techbridge-technical-quiz-platform

**Application:** techbridge-technical-quiz-platform
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd techbridge-technical-quiz-platform
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
docker-compose -f docker-compose-all-apps.yml build techbridge-technical-quiz-platform
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up techbridge-technical-quiz-platform
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

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Techbridge Technical Quiz Platform
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Techbridge Technical Quiz Platform**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Techbridge Technical Quiz Platform** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Techbridge Technical Quiz Platform** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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

### FILE: docs/TESTING.md
```md
# Testing Guide — techbridge-technical-quiz-platform

**Application:** techbridge-technical-quiz-platform
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd techbridge-technical-quiz-platform
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
    <meta property="og:title" content="Techbridge Technical Quiz Platform | Techbridge University College" />
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
    <meta name="twitter:title" content="Techbridge Technical Quiz Platform | Techbridge University College" />
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
    <title>Techbridge Technical Quiz Platform | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

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
        <div class="tuc-status">techbridge technical quiz platform</div>
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
  "name": "Techbridge Technical Quiz Platform",
  "description": "A best-in-class technical assessment platform for full-stack developers featuring real-time evaluation, advanced analytics, and AI-powered question generation.",
  "requestFramePermissions": [
    "camera",
    "microphone"
  ]
}
```

### FILE: mockData.ts
```typescript

import { Question, QuestionType, Difficulty, QuizTemplate, TakeHomeProject } from './types';

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: QuestionType.MCQ,
    category: 'Java',
    difficulty: Difficulty.INTERMEDIATE,
    content: 'Which of the following is true about Java memory management?',
    options: [
      'The stack stores objects, and the heap stores local variables.',
      'The heap stores objects, and the stack stores local variables.',
      'Both heap and stack store objects.',
      'Garbage collection happens exclusively in the stack.'
    ],
    correctAnswer: 'The heap stores objects, and the stack stores local variables.',
    points: 10,
    tags: ['Memory', 'JVM']
  },
  {
    id: 'q2',
    type: QuestionType.CODE,
    category: 'Spring Boot',
    difficulty: Difficulty.ADVANCED,
    content: 'Write a Spring Boot controller method that handles a GET request for a specific user ID and returns a 404 if not found.',
    idealAnswer: '@GetMapping("/{id}")\npublic ResponseEntity<User> getUser(@PathVariable Long id) {\n  return repository.findById(id)\n    .map(ResponseEntity::ok)\n    .orElse(ResponseEntity.notFound().build());\n}',
    points: 25,
    tags: ['REST', 'Controllers']
  },
  {
    id: 'q3',
    type: QuestionType.SCENARIO,
    category: 'DevOps',
    difficulty: Difficulty.EXPERT,
    content: 'A production microservice is experiencing intermittent 504 Gateway Timeout errors. Walk through your debugging process.',
    idealAnswer: 'Check load balancer logs, verify pod health, check circuit breaker status, investigate database connection pool saturation...',
    points: 30,
    tags: ['SRE', 'Troubleshooting']
  }
];

export const MOCK_TAKE_HOMES: TakeHomeProject[] = [
  {
    id: 'th-easy',
    title: 'ICT Staff Registry API (Core)',
    duration: '48 Hours',
    difficulty: Difficulty.BEGINNER,
    overview: "Develop a practical Spring Boot service for the TechBridge ICT Unit to track internal staff assignments. This core assessment evaluates your ability to build a standard REST service, integrate with MariaDB, and provide a containerized environment.",
    userStories: [
      "As an ICT Admin, I can register a new staff member with their role and department.",
      "As a User, I can retrieve a list of all ICT personnel and their current status.",
      "As a System, all records must persist in a MariaDB instance and survive restarts.",
      "As a DevOps Engineer, I can use a Dockerfile to build and run the application instantly."
    ],
    technicalConstraints: [
      "Backend Framework: Spring Boot 3.x (Java 17+).",
      "Database: MariaDB (latest stable) for relational data persistence.",
      "Containerization: A multi-stage Dockerfile must be included.",
      "Persistence Layer: Use Spring Data JPA or MyBatis for database interaction.",
      "Initialization: Provide a simple SQL script or flyway migration for schema setup."
    ],
    apiSpecs: [
      { method: "POST", path: "/api/staff", description: "Register a new ICT staff member. Body: { name, role, email }" },
      { method: "GET", path: "/api/staff", description: "Fetch all registered ICT personnel records." },
      { method: "GET", path: "/api/staff/:id", description: "Retrieve detailed record for a specific staff member." }
    ],
    databaseSchema: [
      "Table `ict_staff`: id (UUID), name (VARCHAR), role (VARCHAR), email (VARCHAR, UNIQUE), created_at (TIMESTAMP)"
    ],
    bonusTasks: [
      "Add basic field validation for email and mandatory fields.",
      "Implement a 'docker-compose.yml' that links the Spring Boot app and MariaDB."
    ],
    rubric: [
      { criterion: "MariaDB Connectivity & Persistence", weight: 45 },
      { criterion: "Dockerfile & Container Efficiency", weight: 35 },
      { criterion: "REST API Standards Compliance", weight: 20 }
    ],
    boilerplateUrl: "https://github.com/techbridge-ict/onboarding-starter"
  },
  {
    id: 'th-medium',
    title: 'Advanced Campus Equipment Ledger',
    duration: '48 Hours',
    difficulty: Difficulty.INTERMEDIATE,
    overview: "Extend the basic registry into a full equipment tracking system for the ICT Unit. This project adds complexity through relational data mapping and cached lookups using Redis.",
    userStories: [
      "As a Technician, I can assign hardware assets to specific staff members.",
      "As a Manager, I can view an audit log of asset transitions (Available -> Assigned -> Repair).",
      "As a System, asset search results should be cached in Redis to minimize database load.",
      "As a DevOps Engineer, the environment must include a linked Database and Cache layer."
    ],
    technicalConstraints: [
      "Backend: Spring Boot 3.x with Spring Data Redis for caching.",
      "Database: MariaDB with optimized foreign key relationships.",
      "Infrastructure: Docker Compose required for multi-service orchestration (API + DB + Redis).",
      "Architecture: Separation of concerns between Service and Repository layers."
    ],
    apiSpecs: [
      { method: "POST", path: "/api/assets", description: "Register a new campus asset." },
      { method: "GET", path: "/api/assets/search", description: "Search assets with Redis caching enabled." },
      { method: "PATCH", path: "/api/assets/:id/assign", description: "Update asset assignment and status." }
    ],
    databaseSchema: [
      "Table `assets`: id, serial_number, model, type, status, assigned_staff_id",
      "Table `ict_staff`: id, name, role, email",
      "Table `audit_log`: id, asset_id, action, timestamp"
    ],
    bonusTasks: [
      "Implement Spring Security with basic HTTP auth for administrative actions.",
      "Add a 'Health' dashboard showing DB and Redis connection status."
    ],
    rubric: [
      { criterion: "Redis Integration & Cache Strategy", weight: 30 },
      { criterion: "Relational Mapping & Integrity", weight: 30 },
      { criterion: "Orchestration (Docker Compose)", weight: 25 },
      { criterion: "Security Implementation", weight: 15 }
    ],
    boilerplateUrl: "https://github.com/techbridge-ict/equipment-ledger-starter"
  },
  {
    id: 'th-hard',
    title: 'Distributed Institutional Performance Engine',
    duration: '72 Hours',
    difficulty: Difficulty.EXPERT,
    overview: "Build a high-performance, asynchronous ledger for processing institution-wide grade submissions and performance metrics. This Expert tier challenge evaluates advanced distributed system architecture.",
    userStories: [
      "As a Registrar, I can upload batch grade records (100k+ entries) via a single request.",
      "As a System, large batches are processed asynchronously using a task queue (RabbitMQ/Redis Streams).",
      "As an Admin, I can monitor real-time throughput metrics on a WebSocket-enabled dashboard.",
      "As a System, if a processing node fails, tasks must be automatically retried with zero data loss."
    ],
    technicalConstraints: [
      "Processing: Spring Boot with Asynchronous Event Listeners or Spring Batch.",
      "Messaging: Use RabbitMQ or Redis Streams for decoupling ingestion from processing.",
      "Persistence: MariaDB with batch-insert optimizations and transaction management.",
      "Frontend: React dashboard showing real-time processing charts (WebSockets).",
      "Resiliency: Implementation of a 'Circuit Breaker' pattern (e.g., Resilience4j)."
    ],
    apiSpecs: [
      { method: "POST", path: "/api/v1/ingest", description: "Initiate high-volume batch processing." },
      { method: "GET", path: "/api/v1/metrics/live", description: "WebSocket endpoint for live throughput data." },
      { method: "GET", path: "/api/v1/tasks/failed", description: "Retrieve records that failed processing for manual retry." }
    ],
    databaseSchema: [
      "Table `grade_batches`: id, filename, total_records, status, processed_at",
      "Table `grade_entries`: id, batch_id, student_id, grade, status, error_msg",
      "Table `metrics`: id, timestamp, records_per_second, error_rate"
    ],
    bonusTasks: [
      "Implement a distributed lock (Redlock) to ensure only one batch processor handles a file at a time.",
      "Integrate Grafana/Prometheus scraping endpoints for the orchestrator."
    ],
    rubric: [
      { criterion: "Distributed Processing & Fault Tolerance", weight: 40 },
      { criterion: "Database Ingestion Performance", weight: 30 },
      { criterion: "Real-time Observability & UX", weight: 20 },
      { criterion: "Scalability Documentation", weight: 10 }
    ],
    boilerplateUrl: "https://github.com/techbridge-ict/performance-engine-starter"
  }
];

export const MOCK_QUIZZES: QuizTemplate[] = [
  {
    id: 'quiz1',
    name: 'Full Stack Java Assessment v1',
    category: 'Technical Screen',
    timeLimit: 60,
    questions: ['q1', 'q2', 'q3'],
    passThreshold: 70
  }
];

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
  "name": "techbridge-technical-quiz-platform",
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
    "@google/genai": "1.40.0",
    "clsx": "2.1.1",
    "framer-motion": "12.34.0",
    "lucide-react": "0.563.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "recharts": "3.7.0",
    "tailwind-merge": "3.4.0",
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

View your app in AI Studio: https://ai.studio/apps/drive/1DsPn4Olsvr83rINCzyt3pXf21Jy-ZxEN

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

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
          <span className="font-bold text-sm">Techbridge Technical Quiz Platform</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Techbridge Technical Quiz Platform — Admin</h1>
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
 * E2E stub — techbridge-technical-quiz-platform
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('techbridge-technical-quiz-platform E2E', () => {
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

export enum UserRole {
  ADMIN = 'System Admin',
  QUIZ_ADMIN = 'Quiz Admin',
  EVALUATOR = 'Technical Evaluator',
  CANDIDATE = 'Candidate'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  CONTRAST = 'contrast'
}

export enum QuestionType {
  MCQ = 'Multiple Choice',
  MULTI_SELECT = 'Multiple Response',
  CODE = 'Code Challenge',
  SHORT_ANSWER = 'Short Answer',
  SCENARIO = 'Scenario-based',
  PROJECT = 'Take-Home Project'
}

export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

export interface AuditLog {
  id: string;
  timestamp: number;
  user: string;
  action: string;
  details: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  category: string;
  difficulty: Difficulty;
  content: string;
  options?: string[];
  correctAnswer?: string | string[];
  idealAnswer?: string;
  points: number;
  tags: string[];
}

export interface TakeHomeProject {
  id: string;
  title: string;
  duration: string;
  difficulty: Difficulty;
  overview: string;
  userStories: string[];
  technicalConstraints: string[];
  apiSpecs: { method: string; path: string; description: string }[];
  databaseSchema: string[];
  bonusTasks: string[];
  rubric: { criterion: string; weight: number }[];
  boilerplateUrl: string;
}

export interface QuizTemplate {
  id: string;
  name: string;
  category: 'Technical Screen' | 'Culture Fit' | 'Final Assessment';
  timeLimit: number; 
  questions: string[]; 
  passThreshold: number;
}

export type ViewState = 'DASHBOARD' | 'QUESTIONS' | 'QUIZZES' | 'ASSESSMENTS' | 'CANDIDATE_PLAYER' | 'EVALUATOR_REVIEW' | 'TAKE_HOME' | 'SYSTEM_DOCS' | 'DIAGNOSTICS';

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

// Vitest unit test configuration — techbridge-technical-quiz-platform
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

// Vitest E2E configuration — techbridge-technical-quiz-platform
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

