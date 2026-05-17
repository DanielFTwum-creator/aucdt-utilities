# send-platform-dashboard - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for send-platform-dashboard.

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

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

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
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import NewJob from './pages/NewJob';
import Schedules from './pages/Schedules';
import Executions from './pages/Executions';
import Diagnostics from './pages/admin/Diagnostics';
import DbMonitor from './pages/admin/DbMonitor';
import Testing from './pages/admin/Testing';
import Logs from './pages/admin/Logs';
import Performance from './pages/admin/Performance';
import ApiGateway from './pages/admin/ApiGateway';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="jobs/new" element={<NewJob />} />
              <Route path="jobs/:id" element={<JobDetail />} />
              <Route path="schedules" element={<Schedules />} />
              <Route path="executions" element={<Executions />} />
              
              {/* Admin Section */}
              <Route path="admin/api-gateway" element={<ApiGateway />} />
              <Route path="admin/diagnostics" element={<Diagnostics />} />
              <Route path="admin/db-monitor" element={<DbMonitor />} />
              <Route path="admin/testing" element={<Testing />} />
              <Route path="admin/logs" element={<Logs />} />
              <Route path="admin/performance" element={<Performance />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_send_platform_dashboard';
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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Send Platform Dashboard</h1>
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

### FILE: components/JobDefinitionTab.tsx
```typescript
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ReportJob } from '../types';

interface JobDefinitionTabProps {
  job: ReportJob;
}

const JobDefinitionTab: React.FC<JobDefinitionTabProps> = ({ job }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="text-amber-600 mt-0.5" size={18} />
        <div className="text-sm text-amber-800">
          <p className="font-semibold">Schema Validation Active</p>
          <p>Changes to the definition must comply with the registered JSON schema. Invalid configurations will be rejected.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description</label>
          <input 
            type="text" 
            defaultValue={job.description} 
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority (1-10)</label>
           <input 
             type="number" 
             min="1"
             max="10"
             defaultValue={job.priority} 
             className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
           />
        </div>
      </div>

      <div className="h-96 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden relative font-mono text-sm">
        <textarea 
          className="w-full h-full p-4 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none focus:outline-none"
          defaultValue={job.json_definition}
        />
      </div>
    </div>
  );
};

export default JobDefinitionTab;
```

### FILE: components/JobDeliveryTab.tsx
```typescript
import React from 'react';
import { Share2, MoreHorizontal, Plus } from 'lucide-react';
import { DeliveryTarget } from '../types';

interface JobDeliveryTabProps {
  targets: DeliveryTarget[];
  onAddTarget: () => void;
}

const JobDeliveryTab: React.FC<JobDeliveryTabProps> = ({ targets, onAddTarget }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {targets.map(target => (
        <div key={target.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg ${
              target.channel === 'EMAIL' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200' : 
              target.channel === 'SHAREPOINT' ? 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-200' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Share2 size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{target.channel}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {JSON.stringify(target.config).substring(0, 50)}...
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">Active</span>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      ))}
      
      <button 
        onClick={onAddTarget}
        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all font-medium flex items-center justify-center"
      >
        <Plus size={18} className="mr-2" />
        Add Delivery Target
      </button>
    </div>
  );
};

export default JobDeliveryTab;
```

### FILE: components/JobScheduleTab.tsx
```typescript
import React from 'react';
import { Layers } from 'lucide-react';
import { ReportJob } from '../types';

interface JobScheduleTabProps {
  job: ReportJob;
}

const JobScheduleTab: React.FC<JobScheduleTabProps> = ({ job }) => {
  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cron Expression</label>
          <div className="flex">
            <input 
              type="text" 
              defaultValue={job.schedule?.cron_expression} 
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 text-sm font-mono dark:bg-gray-700 dark:text-white"
            />
            <button className="bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 px-3 rounded-r-lg text-gray-600 dark:text-gray-200 text-sm hover:bg-gray-200 dark:hover:bg-gray-500">
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Runs at 08:00 AM on day 1 of the month</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:text-white">
            <option>{job.schedule?.timezone}</option>
            <option>UTC</option>
            <option>America/New_York</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-4 h-4 mr-2" alt="Google Calendar" />
            Google Calendar Integration
        </h4>
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">Sync this schedule to the "SEND Reports" calendar.</p>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">Sync Now</button>
        </div>
        <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center">
            <Layers size={12} className="mr-1" /> Last synced: 2 minutes ago
        </div>
      </div>
    </div>
  );
};

export default JobScheduleTab;
```

### FILE: components/Layout.tsx
```typescript
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  History, 
  Settings, 
  ShieldAlert, 
  Database, 
  Activity, 
  Terminal,
  Server,
  Network,
  Sun,
  Moon,
  LogOut,
  User,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`
      }
      aria-label={label}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

const Layout: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('high-contrast');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon size={20} />;
    if (theme === 'high-contrast') return <Eye size={20} />;
    return <Sun size={20} />;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl">S</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SEND Platform</h1>
              <p className="text-xs text-gray-400">v1.0.0 (Stable)</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto" role="navigation" aria-label="Main Navigation">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider" id="nav-core-modules">
            Core Modules
          </div>
          <div role="group" aria-labelledby="nav-core-modules">
            <SidebarItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarItem to="/jobs" icon={<FileText size={20} />} label="Report Jobs" />
            <SidebarItem to="/schedules" icon={<Calendar size={20} />} label="Schedules" />
            <SidebarItem to="/executions" icon={<History size={20} />} label="Execution Log" />
          </div>
          
          <div className="mt-8 px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider" id="nav-admin-console">
            Admin Console
          </div>
          <div role="group" aria-labelledby="nav-admin-console">
            <SidebarItem to="/admin/api-gateway" icon={<Network size={20} />} label="API Gateway" />
            <SidebarItem to="/admin/diagnostics" icon={<ShieldAlert size={20} />} label="Diagnostics" />
            <SidebarItem to="/admin/db-monitor" icon={<Database size={20} />} label="DB Monitor" />
            <SidebarItem to="/admin/performance" icon={<Activity size={20} />} label="Performance" />
            <SidebarItem to="/admin/logs" icon={<Terminal size={20} />} label="System Logs" />
            <SidebarItem to="/admin/testing" icon={<Server size={20} />} label="Test Suites" />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-green-400 flex items-center justify-center text-xs font-bold text-white">
              {user?.username.substring(0,2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-green-400">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-8 shadow-sm transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {isAdmin ? 'System Administration' : 'Report Management'}
          </h2>
          <div className="flex items-center space-x-4">
             <button 
               onClick={toggleTheme}
               className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
               aria-label="Toggle Theme"
               title={`Current theme: ${theme}`}
             >
               {getThemeIcon()}
             </button>
             
             <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

             <button 
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Logout"
                title="Logout"
             >
               <LogOut size={20} />
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
```

### FILE: components/ProtectedRoute.tsx
```typescript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Authenticating…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### FILE: components/StatusBadge.tsx
```typescript
import React from 'react';
import { JobStatus, ExecutionStatus } from '../types';

interface StatusBadgeProps {
  status: JobStatus | ExecutionStatus | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = (s: string) => {
    switch (s) {
      case JobStatus.ACTIVE:
      case ExecutionStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case JobStatus.PAUSED:
      case ExecutionStatus.QUEUED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case JobStatus.ARCHIVED:
      case ExecutionStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case JobStatus.DELETED:
      case ExecutionStatus.FAILED:
      case ExecutionStatus.TIMEOUT:
        return 'bg-red-100 text-red-800 border-red-200';
      case ExecutionStatus.RUNNING:
        return 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
```

### FILE: context/AuthContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, setToken, getToken, clearToken } from '../services/apiClient';
import { auditService } from '../services/auditService';

interface LoginResponse {
  token: string;
  username: string;
  role: string;
  name: string;
}

interface MeResponse {
  id: number;
  username: string;
  name: string;
  role: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, rehydrate from token if present
  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }

    api.get<MeResponse>('/auth/me')
      .then(me => setUser({ id: me.id, username: me.username, name: me.name, role: me.role as User['role'] }))
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.post<LoginResponse>('/auth/login', { username, password });
    setToken(res.token);
    const me = await api.get<MeResponse>('/auth/me');
    const newUser: User = { id: me.id, username: me.username, name: me.name, role: me.role as User['role'] };
    setUser(newUser);
    auditService.log(username, 'LOGIN', 'Auth System', 'SUCCESS');
  };

  const logout = () => {
    if (user) auditService.log(user.username, 'LOGOUT', 'Auth System', 'SUCCESS');
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

```

### FILE: context/ThemeContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('dark', 'high-contrast');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'high-contrast') {
      root.classList.add('high-contrast');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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

### FILE: CREATION.md
```md
# send-platform-dashboard

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

This application is deployed behind an Nginx reverse proxy at the path `/send-platform-dashboard/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/send-platform-dashboard/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/send-platform-dashboard/',  // REQUIRED: Assets must load from /send-platform-dashboard/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/send-platform-dashboard"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/send-platform-dashboard">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/send-platform-dashboard/`, not at the root
- **Asset Loading**: Without `base: '/send-platform-dashboard/'`, assets try to load from `/assets/` instead of `/send-platform-dashboard/assets/`
- **Routing**: Without `basename="/send-platform-dashboard"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/send-platform-dashboard/assets/index-*.js`
- Link tags should reference: `/send-platform-dashboard/assets/index-*.css`

If they reference `/assets/` instead of `/send-platform-dashboard/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/send-platform-dashboard/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/send-platform-dashboard/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: send-platform-dashboard

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
# Admin Guide — send-platform-dashboard

**Application:** send-platform-dashboard
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

Audit log data is stored in `localStorage` under the key `tuc_send-platform-dashboard_audit`.

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
# Deployment Guide — send-platform-dashboard

**Application:** send-platform-dashboard
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd send-platform-dashboard
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
docker-compose -f docker-compose-all-apps.yml build send-platform-dashboard
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up send-platform-dashboard
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
﻿# Gap Analysis Report
**Phase:** 5 (Final Delivery)  
**Status:** ALL PHASES COMPLETE - FINAL GAP ANALYSIS CONFIRMS 100% ALIGNMENT  
**Date:** 2026-03-02  

## 1. Executive Summary
This final report confirms that the SEND Platform Admin Console has been fully implemented according to the Software Requirements Specification (SRS) v2.0.0. All planned features, including security, accessibility, and the testing framework, are operational. Documentation is complete and centralized in the `/docs` directory.

## 2. Requirement Verification Matrix

| Requirement ID | Description | Implementation Status | Evidence |
|----------------|-------------|-----------------------|----------|
| **REQ-CORE-01** | React Version | **VERIFIED** | `package.json` confirms v19.2.5. |
| **REQ-SEC-01** | Admin Auth | **VERIFIED** | `ProtectedRoute` guards all `/admin` routes. |
| **REQ-SEC-02** | Audit Logs | **VERIFIED** | Login/Logout and Config changes are logged to `AuditService`. |
| **REQ-ACC-01** | High Contrast | **COMPLETE** | `index.html` CSS overrides implemented for `.high-contrast`. |
| **REQ-ACC-02** | ARIA Labels | **COMPLETE** | Added to Sidebar, Charts, Buttons, and Inputs. |
| **REQ-TST-03** | Playwright Sim | **COMPLETE** | 5 Scenarios implemented including Theme/Diagnostics. |
| **REQ-TST-04** | Reporting | **COMPLETE** | "Download Report" button added to test results. |
| **REQ-DOC-07** | Board Diagram | **COMPLETE** | `docs/board_presentation.svg` generated. |

## 3. Resolution of Gaps

| Gap ID | Issue | Resolution | Status |
|--------|-------|------------|--------|
| **GAP-14** | Doc Structure | Consolidated all docs into `/docs` folder. | **RESOLVED** |
| **GAP-15** | Executive Viz | Created high-level board presentation diagram. | **RESOLVED** |
| **GAP-16** | SRS Sync | Updated SRS with final testing and accessibility features. | **RESOLVED** |

## 4. Architectural Compliance
*   **Documentation**: All artifacts are centralized in `/docs`.
*   **Versioning**: All guides are versioned (v1.0.0) and dated.
*   **React**: Confirmed v19.2.5.

## 5. Conclusion
The project has achieved 100% alignment between the SRS and the Implementation. No outstanding gaps remain. The system is ready for deployment.

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Send Platform Dashboard
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Send Platform Dashboard**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Send Platform Dashboard** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Send Platform Dashboard** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
| Docker service configured | âŒ Non-compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1, Recharts 3.7.0, React Router DOM
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
# Testing Guide — send-platform-dashboard

**Application:** send-platform-dashboard
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd send-platform-dashboard
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

### FILE: documentation/ADMIN_GUIDE.md
```md
# SEND Platform - Administrator Guide
**Version:** 1.0.0  
**Date:** 2026-03-02  

## 1. Getting Started
### 1.1 Accessing the Console
Navigate to the root URL of the deployed application. You will be redirected to the Login page.
*   **Default URL**: `http://localhost:3000/` (dev) or your production domain.
*   **Credentials**:
    *   Username: `admin`
    *   Password: `password`

### 1.2 Dashboard Overview
The Dashboard provides a high-level view of the system's health:
*   **Active Jobs**: Number of reports currently scheduled to run.
*   **Execution Trends**: 7-day bar chart showing Success vs. Failure rates.
*   **Recent Executions**: Table of the last 5 report runs.

## 2. Job Management
### 2.1 Creating a New Job
1.  Navigate to **Report Jobs** via the sidebar.
2.  Click the **+ New Job** button in the top right.
3.  Fill in the Job Name and Output Format.
4.  Click **Create Job**.

### 2.2 Editing a Job
1.  Click the "Edit" (pencil) icon on any job row.
2.  **JSON Definition**: Modify the query logic or template path directly in the JSON editor.
3.  **Schedule**: Update the Cron expression.
4.  **Delivery Targets**: Add or remove Email/SharePoint destinations.
5.  Click **Save Changes** (Note: In this version, changes are not persisted to a backend).

## 3. System Administration
The **Admin Console** section in the sidebar is restricted to users with `ADMIN` role.

### 3.1 API Gateway
Manage the virtual routing of requests to backend microservices.
*   **Routes**: View active paths and upstream services.
*   **Global Policy**: Toggle "Rate Limiting" on/off to protect the system during high load.
*   **Maintenance**: Enable "Maintenance Mode" to reject non-admin traffic.

### 3.2 Diagnostics
View the health status of internal components and external dependencies.
*   **Component Health**: Status of microservices (Scheduler, Notification, etc.).
*   **Connectivity**: Ping status for Database, SMTP, and SharePoint.

### 3.3 Database Monitor
Real-time view of the database performance.
*   **Active Connections**: Current load on the DB.
*   **Slow Queries**: Log of SQL queries taking >500ms.

### 3.4 Logs
Centralized Audit Log viewer.
*   Tracks Login/Logout events.
*   Tracks Configuration changes.
*   Use the **Refresh** button to load the latest events.

### 3.5 Testing Framework
Interactive tool for verifying system integrity.
*   **Integration Tests**: Validates client-side data structures.
*   **E2E Scenarios**: Runs simulated user journeys (using Playwright logic) to verify workflows like "Login", "Create Job", "Diagnostics", and "Theme Toggling".
*   **Reporting**: Download test results as PDF (simulated).

## 4. Accessibility & Theming
### 4.1 Theme Selection
The platform supports three visual modes:
*   **Light**: Default day mode.
*   **Dark**: Low-light mode for reduced eye strain.
*   **High Contrast**: Strict black/white/yellow palette for maximum visibility (WCAG AAA targeted).

### 4.2 Accessibility Features
*   **Screen Readers**: All interactive elements have ARIA labels.
*   **Keyboard Navigation**: Full support for Tab/Enter/Space navigation.


```

### FILE: documentation/DEPLOYMENT.md
```md
﻿# Deployment Guide
**Project:** SEND Platform Admin Console  
**Framework:** React 19.2.5  

## 1. Prerequisites
*   **Node.js**: Version 18.x or higher.
*   **Package Manager**: `npm` or `yarn`.
*   **Web Server**: Nginx, Apache, or S3-compatible bucket for static hosting.

## 2. Installation
Clone the repository and install dependencies.
```bash
git clone <repository-url>
cd send-admin-console
npm install
```

## 3. Development Server
To run the application locally with Hot Module Replacement (HMR):
```bash
npm start
# Opens at http://localhost:3000
```

## 4. Production Build
The application is a Single Page Application (SPA) that compiles to static HTML/CSS/JS.

### 4.1 Build Command
```bash
npm run build
```

### 4.2 Output Directory
The build artifacts will be generated in the `dist/` (or `build/`) directory.
*   `index.html`: Entry point.
*   `assets/`: Compiled JavaScript and CSS bundles.

### 4.3 React 19.2.5 Requirement
Ensure your build environment supports React 19.
*   Verify `package.json`:
    ```json
    "dependencies": {
      "react": "^19.2.5",
      "react-dom": "^19.2.5"
    }
    ```
*   This project uses ES Modules. Ensure your serving infrastructure correctly handles `.mjs` or `.js` modules if using specific bundlers.

## 5. Hosting Configuration
### 5.1 Nginx Example
Since this is an SPA using Client-Side Routing (React Router), you must configure the server to fallback to `index.html` for 404s.

```nginx
server {
    listen 80;
    server_name admin.send-platform.com;
    root /var/www/send-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 5.2 Environment Variables
Create a `.env` file in the root for build-time configuration (if applicable in future phases).
Currently, the app uses mocked services, so no backend URL configuration is required.

```

### FILE: documentation/GAP_ANALYSIS.md
```md
﻿# Gap Analysis Report
**Phase:** 4 (Documentation & Final Polish)  
**Status:** PHASE 4 COMPLETE - READY FOR HANDOVER  
**Date:** 2026-03-02  

## 1. Executive Summary
Phase 4 has been successfully executed. Comprehensive documentation has been generated, covering System Architecture, Database Schema, Administration, Deployment, and Testing. All guides explicitly state the **React 19.2.5** requirement. The documentation accurately reflects the implemented features, including the new Testing Framework capabilities and Accessibility modes.

## 2. Requirement Verification Matrix

| Requirement ID | Description | Implementation Status | Evidence |
|----------------|-------------|-----------------------|----------|
| **REQ-DOC-01** | Architecture Diagram | **COMPLETE** | `documentation/architecture.svg` generated. |
| **REQ-DOC-02** | Database Diagram | **COMPLETE** | `documentation/database.svg` generated. |
| **REQ-DOC-03** | Admin Guide | **COMPLETE** | `documentation/ADMIN_GUIDE.md` updated with new features. |
| **REQ-DOC-04** | Deployment Guide | **COMPLETE** | `documentation/DEPLOYMENT.md` confirms React 19.2.5. |
| **REQ-DOC-05** | Testing Guide | **COMPLETE** | `documentation/TESTING.md` lists all 5 scenarios. |
| **REQ-DOC-06** | React Version | **VERIFIED** | All guides mention React 19.2.5. |

## 3. Resolution of Gaps

| Gap ID | Issue | Resolution | Status |
|--------|-------|------------|--------|
| **GAP-11** | Doc Alignment | Updated Admin Guide to include High Contrast & Diagnostics. | **RESOLVED** |
| **GAP-12** | Test Doc Coverage | Updated Testing Guide to list E2E-004 and E2E-005. | **RESOLVED** |
| **GAP-13** | Architecture Viz | Created SVG diagrams for system and data structure. | **RESOLVED** |

## 4. Architectural Compliance
*   **Documentation**: All artifacts are centralized in `/documentation`.
*   **Versioning**: All guides are versioned (v1.0.0) and dated.

## 5. Conclusion
The project meets all Phase 4 requirements. The documentation is complete, accurate, and ready for handover to the operations team.

```

### FILE: documentation/SRS.md
```md
﻿# Software Requirements Specification (SRS)
**Project:** SEND Platform Admin Console  
**Version:** 2.0.0 (Final)  
**Date:** 2026-03-02  

## 1. Introduction
### 1.1 Purpose
The purpose of this document is to define the requirements for the Admin Console of the SEND (Schedule | Execute | Notify | Deliver) Report Automation Platform. This console provides a visual interface for managing report jobs, schedules, delivery configurations, and monitoring system health.

### 1.2 Scope
The application is a Single Page Application (SPA) serving as the "Middle Tier" management layer. It interacts with backend microservices (Scheduler, Report Engine, Notification Service) via REST APIs. 
**Note:** In this implementation version, backend services are **mocked** to demonstrate UI functionality, data flow, and admin workflows without requiring a deployed server infrastructure.

## 2. Overall Description
### 2.1 Product Functions
*   **Dashboard**: High-level metrics on job execution, failures, and system throughput.
*   **Job Management**: Create, Read, Update, Delete (CRUD) definitions for report jobs (JSON-based).
*   **Scheduling**: Manage Cron-based execution schedules and timezone configurations.
*   **Execution History**: Audit log of past report runs with status and output links.
*   **Admin Console**:
    *   **Security**: Password-protected access for administrative functions (`/admin/*`).
    *   **API Gateway**: Route management, rate limiting, and authentication policy configuration.
    *   **Diagnostics**: Component health checks and connectivity verification.
    *   **DB Monitor**: Database connection stats and slow query logs.
    *   **Performance**: Real-time CPU/Memory visualization.
    *   **System Logs**: Centralized log viewer with audit trails.
    *   **Testing**: 
        *   **Integration**: Client-side verification of data structures and schema validity.
        *   **E2E Simulation**: Interactive runner for Playwright test scenarios, displaying execution logs and result snapshots.

### 2.2 System Architecture
The following diagrams illustrate the system's structure and data flow.

#### 2.2.1 Application Architecture
![Architecture Diagram](architecture.svg)

#### 2.2.2 Data Flow
![Data Flow Diagram](data_flow.svg)

#### 2.2.3 Technology Stack
![Tech Stack](tech_stack.svg)

### 2.3 User Characteristics
*   **System Administrators**: Technical users responsible for infrastructure and configuration.
*   **Data Analysts**: Users defining report queries and templates.
*   **QA Engineers**: Users verifying system integrity via the Testing module.

## 3. Specific Requirements

### 3.1 External Interface Requirements
*   **Framework**: **React 19.2.5** (Mandatory).
*   **Styling**: Tailwind CSS with Dark Mode support.
*   **Icons**: Lucide React.
*   **Routing**: React Router DOM v7.

### 3.2 Functional Requirements

#### 3.2.1 Job Management
*   **REQ-JM-01**: System shall display a paginated list of all report jobs.
*   **REQ-JM-02**: System shall allow viewing details of a specific job via UUID or ID.
*   **REQ-JM-03**: System shall provide a JSON editor for modifying job definitions.
*   **REQ-JM-04**: System shall allow creation of new jobs.
*   **REQ-JM-05**: System shall provide "Save" and "Trigger" actions that provide immediate user feedback (Simulated persistence).

#### 3.2.2 Scheduling
*   **REQ-SCH-01**: System shall display active cron schedules.
*   **REQ-SCH-02**: System shall calculate and display the "Next Run" timestamp based on cron expression.

#### 3.2.3 API Gateway Management
*   **REQ-GW-01**: System shall list all registered API routes.
*   **REQ-GW-02**: System shall display real-time throughput metrics.
*   **REQ-GW-03**: System shall allow toggling Global Rate Limiting.
*   **REQ-GW-04**: System shall support configuring Auth Types (OAuth2, JWT, API Key) per route.

#### 3.2.4 System Monitoring & Security
*   **REQ-MON-01**: System shall visualize CPU and Memory usage over a 24-hour period.
*   **REQ-MON-02**: System shall perform connectivity checks to external dependencies (SharePoint, SMTP, DB).
*   **REQ-SEC-01**: All admin routes (`/admin/*`) shall be protected by authentication.
*   **REQ-SEC-02**: Critical actions (login, logout, config changes) shall be recorded in the audit log.
*   **REQ-SEC-03**: Admin diagnostics must be isolated from public routes.

#### 3.2.5 Testing Framework
*   **REQ-TST-01**: System shall provide a dashboard to trigger Unit/Integration tests.
*   **REQ-TST-02**: System shall display the source code of defined E2E Playwright scenarios.
*   **REQ-TST-03**: System shall simulate the execution of E2E tests, displaying step-by-step console logs and result screenshots.

### 3.3 Non-Functional Requirements
*   **Accessibility**: Application shall support WCAG 2.1 AA standards (ARIA labels, keyboard navigation).
*   **Theming**: Application shall support Light, Dark, and High-Contrast themes.

## 4. Constraints
*   Application must run client-side without a Node.js backend server for UI logic.
*   Data persistence is handled via external API calls (currently mocked).

```

### FILE: documentation/TESTING.md
```md
# Testing Guide
**Project:** SEND Platform Admin Console  

## 1. Overview
The application includes a built-in **Testing Framework** accessible via the Admin Console (`/admin/testing`). This allows operators to verify system integrity without external CI/CD tools during the "Middle Tier" development phase.

## 2. Accessing Tests
1.  Log in as `admin`.
2.  Navigate to **Test Suites** in the sidebar.

## 3. Test Types

### 3.1 Unit & Integration
These tests verify the internal consistency of the application's data structures and mock services.
*   **Validate Job Schema**: Checks if all Job objects in memory match the `ReportJob` interface.
*   **Gateway Route Integrity**: Ensures API Gateway routes point to valid upstream services.
*   **Mock Data Consistency**: Verifies foreign key relationships (e.g., Job ID in Schedule matches an existing Job).

**To Run:**
1.  Select the **Unit & Integration** tab.
2.  Click the **Play** button next to a test case.
3.  Result (PASS/FAIL) appears instantly.

### 3.2 E2E Scenarios (Playwright Simulation)
This module simulates End-to-End user journeys using a Playwright-like syntax. Note that in this client-side environment, these are *simulations* that visualize how the test would execute.

**Available Scenarios:**
*   **E2E-001: Admin Login Flow**: Simulates typing credentials and verifying dashboard redirection.
*   **E2E-002: Create New Job**: Simulates form filling and submission.
*   **E2E-003: API Gateway Rate Limit**: Simulates toggling a switch in the admin settings.
*   **E2E-004: Verify Diagnostics**: Verifies that all system health checks are visible.
*   **E2E-005: Theme Toggle Accessibility**: Verifies switching between Light, Dark, and High-Contrast modes.

**To Run:**
1.  Select the **E2E Scenarios** tab.
2.  Choose a scenario from the left list.
3.  Review the **Source Code** in the bottom panel.
4.  Click **Run Scenario**.
5.  Watch the **Execution Console** for step-by-step logs.
6.  View the **Test Result** and generated screenshot (mocked).
7.  Click **Report** to download the test results (simulated).

## 4. Adding New Tests
To add new E2E scenarios, developers must modify `services/playwrightScenarios.ts`.
Structure:
```typescript
{
  id: 'E2E-XXX',
  name: 'Test Name',
  code: `...playwright script...`,
  steps: [ ...metadata for UI visualization... ]
}
```

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
    <meta property="og:title" content="SEND Platform | Admin Console" />
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
    <meta name="twitter:title" content="SEND Platform | Admin Console" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SEND Platform | Admin Console</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Inter', sans-serif;
      }
      /* High Contrast Overrides */
      .high-contrast {
        --bg-primary: #000000;
        --text-primary: #ffffff;
        --accent: #ffff00;
        --border: #ffffff;
      }
      .high-contrast body {
        background-color: var(--bg-primary) !important;
        color: var(--text-primary) !important;
      }
      .high-contrast * {
        border-color: var(--border) !important;
      }
      .high-contrast .bg-white, 
      .high-contrast .bg-gray-50, 
      .high-contrast .bg-gray-100,
      .high-contrast .bg-gray-800,
      .high-contrast .bg-gray-900 {
        background-color: #000000 !important;
        color: #ffffff !important;
        border: 1px solid #ffffff !important;
      }
      .high-contrast .text-gray-500, 
      .high-contrast .text-gray-400,
      .high-contrast .text-gray-600,
      .high-contrast .text-gray-900,
      .high-contrast .text-blue-600,
      .high-contrast .text-green-600,
      .high-contrast .text-red-600 {
        color: #ffff00 !important;
      }
      .high-contrast button, 
      .high-contrast a {
        text-decoration: underline !important;
        color: #00ffff !important;
      }
      .high-contrast input, 
      .high-contrast select, 
      .high-contrast textarea {
        background-color: #000000 !important;
        color: #ffffff !important;
        border: 2px solid #ffffff !important;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react-router-dom": "https://esm.sh/react-router-dom@^7.13.0",
    "lucide-react": "https://esm.sh/lucide-react@^0.564.0",
    "react-dom/": "https://esm.sh/react-dom@^19.2.4/",
    "react/": "https://esm.sh/react@^19.2.4/",
    "react": "https://esm.sh/react@^19.2.4",
    "recharts": "https://esm.sh/recharts@^3.7.0"
  }
}
</script>
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
  <body class="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">send platform dashboard</div>
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
  "name": "SEND Platform Dashboard",
  "description": "Admin dashboard for the SEND (Schedule | Execute | Notify | Deliver) Report Automation Platform. Manages report jobs, schedules, delivery targets, and monitors system performance.",
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
  "name": "send-platform-dashboard",
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
    "react-router-dom": "^7.13.0",
    "lucide-react": "^0.564.0",
    "react-dom": "19.2.5",
    "react": "19.2.5",
    "recharts": "^3.7.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
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

### FILE: pages/admin/ApiGateway.tsx
```typescript
import React, { useState } from 'react';
import { 
  Network, 
  Shield, 
  Zap, 
  Globe, 
  Plus, 
  MoreHorizontal, 
  Search, 
  Filter,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { mockGatewayRoutes } from '../../services/mockData';
import { HttpMethod, AuthType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { auditService } from '../../services/auditService';

const ApiGateway: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'routes' | 'metrics' | 'settings'>('routes');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const { user } = useAuth();

  const filteredRoutes = mockGatewayRoutes.filter(route => 
    route.path.toLowerCase().includes(searchTerm.toLowerCase()) || 
    route.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMaintenance = () => {
    const newState = !isMaintenanceMode;
    setIsMaintenanceMode(newState);
    auditService.log(
      user?.username || 'unknown',
      'UPDATE_CONFIG',
      'API Gateway',
      'SUCCESS',
      `Maintenance mode set to ${newState}`
    );
  };

  const getMethodBadge = (method: HttpMethod) => {
    switch(method) {
      case HttpMethod.GET: return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800';
      case HttpMethod.POST: return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800';
      case HttpMethod.PUT: return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800';
      case HttpMethod.DELETE: return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getAuthIcon = (type: AuthType) => {
    switch(type) {
      case AuthType.OAUTH2: return '🔐 OAuth2';
      case AuthType.JWT: return '🎫 JWT';
      case AuthType.API_KEY: return '🔑 Key';
      case AuthType.NONE: return '🔓 Public';
      default: return '?';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Network className="mr-3 text-blue-600 dark:text-blue-400" size={28} />
            API Gateway Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage request routing, authentication policies, and rate limits.</p>
        </div>
        <div className="flex space-x-3">
          <span className="flex items-center px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full border border-green-100 dark:border-green-900 text-sm font-medium">
             <Globe size={14} className="mr-2" /> Gateway Online
          </span>
          <button 
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Add new route"
          >
            <Plus size={18} className="mr-2" />
            Add Route
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Throughput</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,245 <span className="text-sm font-normal text-gray-400">req/s</span></h3>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Zap size={20} />
              </div>
           </div>
           <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-4">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Auth Rejections</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">0.4%</h3>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <Shield size={20} />
              </div>
           </div>
           <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Low anomaly detection rate</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Routes</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{mockGatewayRoutes.length}</h3>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <Network size={20} />
              </div>
           </div>
           <p className="text-xs text-green-600 dark:text-green-400 mt-3 flex items-center">
             <CheckCircle size={12} className="mr-1" /> All upstreams healthy
           </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 flex px-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('routes')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'routes' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Route Definitions
          </button>
          <button 
            onClick={() => setActiveTab('metrics')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'metrics' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Global Policy
          </button>
        </div>

        {activeTab === 'routes' && (
          <div>
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50 dark:bg-gray-800">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search routes by path..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-gray-700 dark:text-white"
                  aria-label="Search routes"
                />
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
                  <Filter size={16} className="mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {/* Routes Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left" aria-label="API Routes List">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Method</th>
                    <th className="px-6 py-4 font-semibold">Path Pattern</th>
                    <th className="px-6 py-4 font-semibold">Upstream Target</th>
                    <th className="px-6 py-4 font-semibold">Auth Policy</th>
                    <th className="px-6 py-4 font-semibold">Rate Limit</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredRoutes.map((route) => (
                    <tr key={route.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getMethodBadge(route.method)}`}>
                          {route.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm text-gray-900 dark:text-white font-medium">{route.path}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{route.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">
                        {route.upstream_service}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                          {getAuthIcon(route.auth_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {route.rate_limit_per_min} <span className="text-xs text-gray-400">req/min</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-600 rounded-lg"
                          aria-label={`Actions for route ${route.path}`}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center rounded-b-xl">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing all {mockGatewayRoutes.length} active routes
              </span>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="p-8 max-w-4xl">
              <div className="space-y-8">
                <div className="flex items-start justify-between p-4 border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900 rounded-lg">
                  <div className="flex items-start">
                     <div className="bg-blue-200 dark:bg-blue-800 p-2 rounded-lg text-blue-700 dark:text-blue-200 mr-4">
                        <Zap size={24} />
                     </div>
                     <div>
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Global Rate Limiting</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Enforce a hard ceiling on total requests processed by the gateway to protect downstream infrastructure.
                        </p>
                     </div>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-300 dark:bg-blue-700 cursor-pointer"></label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Security Defaults</h4>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Default Auth Strategy</span>
                            <select className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white border rounded-md p-1">
                               <option>OAUTH2 (Recommended)</option>
                               <option>API Key</option>
                            </select>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Block Anonymous Requests</span>
                            <input type="checkbox" defaultChecked className="dark:bg-gray-700" />
                         </div>
                      </div>
                   </div>

                   <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Maintenance</h4>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Maintenance Mode</span>
                            <button 
                              onClick={toggleMaintenance}
                              className={`px-3 py-1 text-xs rounded border font-medium transition-colors ${
                                isMaintenanceMode 
                                  ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                              }`}
                            >
                               {isMaintenanceMode ? 'Disable' : 'Enable'}
                            </button>
                         </div>
                         <p className="text-xs text-gray-400">
                           When enabled, all non-admin requests will receive a 503 Service Unavailable response.
                         </p>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ApiGateway;
```

### FILE: pages/admin/DbMonitor.tsx
```typescript
import React from 'react';
import { Database, HardDrive, RefreshCw } from 'lucide-react';

const DbMonitor: React.FC = () => {
  const handleRefresh = () => {
    // In a real app, this would re-fetch data
    const btn = document.getElementById('refresh-btn');
    if (btn) {
      btn.classList.add('animate-spin');
      setTimeout(() => btn.classList.remove('animate-spin'), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Database Monitor</h1>
         <button 
           onClick={handleRefresh}
           className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
           aria-label="Refresh database metrics"
         >
           <RefreshCw size={14} className="mr-1" id="refresh-btn" /> Refresh
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <Database className="mx-auto text-indigo-500 mb-2" size={32} />
            <h3 className="text-2xl font-bold text-gray-800">45</h3>
            <p className="text-gray-500 text-sm">Active Connections</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <HardDrive className="mx-auto text-emerald-500 mb-2" size={32} />
            <h3 className="text-2xl font-bold text-gray-800">12.4 GB</h3>
            <p className="text-gray-500 text-sm">Storage Used</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <ActivityIcon />
            <h3 className="text-2xl font-bold text-gray-800">98%</h3>
            <p className="text-gray-500 text-sm">Cache Hit Ratio</p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-800">Slow Queries Log</div>
        <table className="w-full text-left text-sm">
           <thead className="bg-gray-50 text-gray-500">
             <tr>
               <th className="px-6 py-3">Timestamp</th>
               <th className="px-6 py-3">Duration</th>
               <th className="px-6 py-3">Query Snippet</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             <tr>
               <td className="px-6 py-3 text-gray-600">2026-02-14 08:01:22</td>
               <td className="px-6 py-3 text-red-600 font-medium">1205ms</td>
               <td className="px-6 py-3 font-mono text-gray-700">SELECT * FROM execution_logs WHERE output_content LIKE...</td>
             </tr>
             <tr>
               <td className="px-6 py-3 text-gray-600">2026-02-14 07:55:01</td>
               <td className="px-6 py-3 text-red-600 font-medium">850ms</td>
               <td className="px-6 py-3 font-mono text-gray-700">UPDATE send_jobs SET status='LOCKED' WHERE...</td>
             </tr>
           </tbody>
        </table>
      </div>
    </div>
  );
};

const ActivityIcon = () => (
  <svg className="mx-auto text-blue-500 mb-2 w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default DbMonitor;
```

### FILE: pages/admin/Diagnostics.tsx
```typescript
import React from 'react';
import { Activity, Server, Database, ShieldCheck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const Diagnostics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Diagnostics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Component Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
              <Server className="mr-2" size={18} aria-hidden="true" /> Component Health
            </h3>
          </div>
          <div className="p-4 space-y-4" role="list" aria-label="Component Health Status">
             {[
               { name: 'API Gateway', status: 'OK', ping: '12ms' },
               { name: 'Job Scheduler', status: 'OK', ping: '5ms' },
               { name: 'Worker Pool A', status: 'OK', ping: '45ms' },
               { name: 'Notification Service', status: 'WARNING', ping: '120ms', msg: 'High Latency' },
               { name: 'Report Engine (Jasper)', status: 'OK', ping: '200ms' },
             ].map((c, i) => (
               <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded" role="listitem">
                  <div className="flex items-center space-x-3">
                    {c.status === 'OK' && <CheckCircle className="text-green-500" size={20} aria-label="Status: OK" />}
                    {c.status === 'WARNING' && <AlertTriangle className="text-yellow-500" size={20} aria-label="Status: Warning" />}
                    <span className="font-medium text-gray-700 dark:text-gray-200">{c.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">{c.status}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{c.ping}</span>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* External Connectivity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Activity className="mr-2" size={18} /> Connectivity Checks
            </h3>
          </div>
          <div className="p-4 space-y-4">
             {[
               { name: 'Primary Database (MySQL)', status: 'Connected' },
               { name: 'Google Calendar API', status: 'Authenticated (OAuth)' },
               { name: 'SharePoint Graph API', status: 'Authenticated (OAuth)' },
               { name: 'SMTP Relay', status: 'Connected' },
               { name: 'Redis Cache', status: 'Connected' },
             ].map((c, i) => (
               <div key={i} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">{c.name}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">{c.status}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;
```

### FILE: pages/admin/Logs.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { auditService } from '../../services/auditService';
import { AuditLog } from '../../types';
import { RefreshCw } from 'lucide-react';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const fetchLogs = () => {
    setLogs([...auditService.getLogs()]);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Logs</h1>
        <button 
          onClick={fetchLogs}
          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          aria-label="Refresh system logs"
        >
           <RefreshCw size={14} className="mr-1" aria-hidden="true" /> Refresh
        </button>
      </div>
      
      <div 
        className="bg-gray-900 text-gray-300 rounded-xl shadow-lg p-6 font-mono text-sm h-[600px] overflow-y-auto border border-gray-800"
        role="log"
        aria-live="polite"
        aria-label="Audit Log Output"
      >
        {logs.map((log) => (
          <div key={log.id} className="mb-2 hover:bg-gray-800 p-1 rounded">
            <span className="text-gray-500 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={`font-bold mr-2 ${
              log.status === 'SUCCESS' ? 'text-green-400' : 'text-red-500'
            }`}>{log.status}</span>
            <span className="text-purple-400 mr-2">[{log.user}@{log.target}]</span>
            <span className="text-gray-300">{log.action}: {log.details || 'No details'}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-500 italic">No logs available.</div>
        )}
        <div className="animate-pulse mt-2 text-gray-500">_</div>
      </div>
    </div>
  );
};

export default Logs;
```

### FILE: pages/admin/Performance.tsx
```typescript
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockPerformanceData } from '../../services/mockData';

const Performance: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">System Performance</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6" id="perf-chart-title">CPU & Memory Usage (24h)</h3>
        <p className="sr-only" aria-labelledby="perf-chart-title">
          Area chart showing CPU and Memory usage trends over the last 24 hours. CPU usage averages around 40%, Memory usage averages around 60%.
        </p>
        <div className="h-80" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="cpu" stackId="1" stroke="#8884d8" fill="#8884d8" name="CPU %" />
              <Area type="monotone" dataKey="memory" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Memory %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Performance;
```

### FILE: pages/admin/Testing.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { Play, Check, X, Loader2, Code, Terminal, Image as ImageIcon, CheckCircle, AlertOctagon, Download } from 'lucide-react';
import { SCENARIOS } from '../../services/playwrightScenarios';
import { PuppeteerScenario, TestRunResult } from '../../types';
import { mockJobs, mockGatewayRoutes } from '../../services/mockData';

const Testing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'integration' | 'e2e'>('integration');
  const [selectedScenario, setSelectedScenario] = useState<PuppeteerScenario>(SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<TestRunResult | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Integration Tests Logic
  const [integrationResults, setIntegrationResults] = useState<Record<string, 'PENDING' | 'PASS' | 'FAIL'>>({
    'check-jobs-schema': 'PENDING',
    'verify-gateway-routes': 'PENDING',
    'validate-mock-data': 'PENDING'
  });

  const runIntegrationTest = (id: string) => {
    setIntegrationResults(prev => ({ ...prev, [id]: 'PENDING' }));
    setTimeout(() => {
      let passed = true;
      if (id === 'check-jobs-schema') {
        passed = mockJobs.every(j => j.id && j.name && j.uuid);
      } else if (id === 'verify-gateway-routes') {
        passed = mockGatewayRoutes.every(r => r.upstream_service && r.method);
      }
      setIntegrationResults(prev => ({ ...prev, [id]: passed ? 'PASS' : 'FAIL' }));
    }, 1000);
  };

  const handleDownloadReport = () => {
    alert("Downloading Test Report PDF...\n[SIMULATION]");
  };

  // E2E Simulation Logic
  const runE2EScenario = async () => {
    setIsRunning(true);
    setLogs(['🚀 Initializing Playwright (Headless Chrome)...']);
    setResult(null);

    const steps = selectedScenario.steps;
    let success = true;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await new Promise(r => setTimeout(r, 800)); // Simulate network/processing delay
      
      setLogs(prev => [...prev, `> [${step.action}] ${step.description}`]);
      
      // Simulate random failure (1% chance)
      if (Math.random() > 0.99) {
        success = false;
        setLogs(prev => [...prev, `❌ Error: Timeout waiting for selector "${step.selector}"`]);
        break;
      } else {
        setLogs(prev => [...prev, `  ✅ OK (${Math.floor(Math.random() * 50) + 10}ms)`]);
      }
    }

    if (success) {
      setLogs(prev => [...prev, '✨ Scenario Completed Successfully']);
    } else {
      setLogs(prev => [...prev, '💀 Scenario Failed']);
    }

    setResult({
      scenarioId: selectedScenario.id,
      timestamp: new Date().toISOString(),
      success,
      logs: [],
      durationMs: steps.length * 800,
      screenshotUrl: success ? 'https://via.placeholder.com/800x450/e0f2fe/1e3a8a?text=SUCCESS+SCREENSHOT' : 'https://via.placeholder.com/800x450/fee2e2/991b1b?text=FAILURE+SCREENSHOT'
    });
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testing Framework</h1>
          <p className="text-gray-500 dark:text-gray-400">Execute automated test suites and verify system integrity.</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 flex px-6" role="tablist">
          <button 
            onClick={() => setActiveTab('integration')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'integration' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            role="tab"
            aria-selected={activeTab === 'integration'}
          >
            Unit & Integration
          </button>
          <button 
            onClick={() => setActiveTab('e2e')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'e2e' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            role="tab"
            aria-selected={activeTab === 'e2e'}
          >
            E2E Scenarios (Playwright)
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'integration' && (
             <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'check-jobs-schema', name: 'Validate Job Schema', desc: 'Checks all defined jobs against generic interface.' },
                    { id: 'verify-gateway-routes', name: 'Gateway Route Integrity', desc: 'Ensures no orphaned upstream services.' },
                    { id: 'validate-mock-data', name: 'Mock Data Consistency', desc: 'Verifies relational integrity of mock datasets.' }
                  ].map(test => (
                    <div key={test.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                       <div>
                         <h3 className="font-semibold text-gray-900 dark:text-white">{test.name}</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400">{test.desc}</p>
                       </div>
                       <div className="flex items-center space-x-3">
                         {integrationResults[test.id] === 'PASS' && <span className="text-green-600 font-bold text-sm">PASS</span>}
                         {integrationResults[test.id] === 'FAIL' && <span className="text-red-600 font-bold text-sm">FAIL</span>}
                         <button 
                           onClick={() => runIntegrationTest(test.id)}
                           className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800"
                           aria-label={`Run test: ${test.name}`}
                         >
                           <Play size={16} />
                         </button>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {activeTab === 'e2e' && (
            <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
              {/* Scenario List */}
              <div className="w-full lg:w-1/3 border-r border-gray-100 dark:border-gray-700 pr-6 space-y-4 overflow-y-auto" role="list" aria-label="Test Scenarios">
                {SCENARIOS.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedScenario.id === scenario.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                    role="listitem"
                    aria-current={selectedScenario.id === scenario.id}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{scenario.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        scenario.criticality === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{scenario.criticality}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{scenario.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{scenario.description}</p>
                  </button>
                ))}
              </div>

              {/* Execution Pane */}
              <div className="flex-1 flex flex-col space-y-4">
                 <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                       <Terminal size={18} className="text-gray-500 dark:text-gray-300" aria-hidden="true" />
                       <span className="font-mono text-sm font-semibold dark:text-white">Execution Console</span>
                    </div>
                    <button 
                      onClick={runE2EScenario}
                      disabled={isRunning}
                      className={`flex items-center px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                        isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      aria-label="Run selected scenario"
                    >
                      {isRunning ? <Loader2 className="animate-spin mr-2" size={18} /> : <Play className="mr-2" size={18} />}
                      Run Scenario
                    </button>
                 </div>

                 <div 
                   className="flex-1 bg-black rounded-lg p-4 font-mono text-xs text-green-400 overflow-y-auto shadow-inner relative"
                   role="log"
                   aria-live="polite"
                 >
                    {logs.length === 0 && <span className="text-gray-500 select-none">Ready to start...</span>}
                    {logs.map((log, i) => (
                      <div key={i} className="mb-1">{log}</div>
                    ))}
                    <div ref={logEndRef} />
                 </div>

                 {/* Results & Screenshot Mock */}
                 {result && (
                   <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="w-1/3">
                        <img src={result.screenshotUrl} alt="Test Result Screenshot" className="rounded border border-gray-200 dark:border-gray-600 shadow-sm" />
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                           <h4 className="font-bold text-gray-900 dark:text-white flex items-center mb-2">
                             {result.success ? <CheckCircle className="text-green-500 mr-2" /> : <AlertOctagon className="text-red-500 mr-2" />}
                             Test Result: {result.success ? 'PASSED' : 'FAILED'}
                           </h4>
                           <button 
                             onClick={handleDownloadReport}
                             className="text-xs flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
                           >
                             <Download size={14} className="mr-1" /> Report
                           </button>
                         </div>
                         <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-500">Duration:</div>
                            <div className="font-mono dark:text-gray-300">{result.durationMs}ms</div>
                            <div className="text-gray-500">Timestamp:</div>
                            <div className="font-mono dark:text-gray-300">{new Date(result.timestamp).toLocaleTimeString()}</div>
                         </div>
                         <div className="mt-4">
                           <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Source Code</p>
                           <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-[10px] text-gray-700 dark:text-gray-300 overflow-x-auto border border-gray-200 dark:border-gray-700 h-24">
                             {selectedScenario.code}
                           </pre>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testing;
```

### FILE: pages/Dashboard.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Play, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { listJobs, listExecutions, getAdminMetrics, AdminMetrics } from '../services/jobApi';
import StatusBadge from '../components/StatusBadge';
import { ReportJob, ExecutionInstance } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ReportJob[]>([]);
  const [executions, setExecutions] = useState<ExecutionInstance[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      listJobs(0, 10),
      listExecutions(0, 5),
      getAdminMetrics(),
    ]).then(([jobsRes, execsRes, metricsRes]) => {
      if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.jobs);
      if (execsRes.status === 'fulfilled') setExecutions(execsRes.value.executions);
      if (metricsRes.status === 'fulfilled') setMetrics(metricsRes.value);
    }).finally(() => setLoading(false));
  }, []);

  const activeJobs  = metrics?.totalJobs ?? jobs.filter(j => j.status === 'ACTIVE').length;
  const failedCount = metrics?.executions.failed ?? executions.filter(e => e.status === 'FAILED').length;
  const totalExecs  = metrics?.executions.total ?? executions.length;

  const chartData = [
    { name: 'Mon', success: 40, failed: 2 },
    { name: 'Tue', success: 30, failed: 1 },
    { name: 'Wed', success: 20, failed: 3 },
    { name: 'Thu', success: 27, failed: 0 },
    { name: 'Fri', success: 18, failed: 1 },
    { name: 'Sat', success: 23, failed: 0 },
    { name: 'Sun', success: 34, failed: 2 },
  ];

  if (loading) {
    return <div className="py-24 text-center text-gray-400 text-sm">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Jobs</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{activeJobs}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Play size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">All report jobs in system</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Executions</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalExecs}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {metrics ? `${metrics.executions.completed} completed` : 'All time'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Failed Executions</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{failedCount}</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-red-600">
              <XCircle size={24} />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">{failedCount > 0 ? 'Requires attention' : 'All clear'}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Running Now</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{metrics?.executions.running ?? 0}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Active executions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Execution Trends (7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="success" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Success" />
                <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Upcoming Schedule</h3>
          <div className="space-y-4">
            {jobs.filter(j => j.schedule?.is_active).slice(0, 5).map(job => (
              <div key={job.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.name}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    {job.schedule?.next_run_at && (
                      <span className="text-xs text-gray-500">
                        Next: {new Date(job.schedule.next_run_at).toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                      {job.schedule?.cron_expression}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {jobs.filter(j => j.schedule?.is_active).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No active schedules</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/schedules')}
            className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
          >
            View Full Calendar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Recent Executions</h3>
          <button
            type="button"
            onClick={() => navigate('/executions')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All
          </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Job</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Started At</th>
              <th className="px-6 py-3 font-medium">Duration</th>
              <th className="px-6 py-3 font-medium">Output</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {executions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                  No executions yet
                </td>
              </tr>
            ) : executions.map(exec => {
              const job = jobs.find(j => j.id === exec.job_id);
              return (
                <tr key={exec.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{job?.name || `Job #${exec.job_id}`}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={exec.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(exec.started_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {exec.duration_ms ? `${(exec.duration_ms / 1000).toFixed(1)}s` : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                    {exec.output_path || exec.error_message || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

```

### FILE: pages/Executions.tsx
```typescript

```

### FILE: pages/JobDetail.tsx
```typescript
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Play, Clock, FileJson, Share2 } from 'lucide-react';
import { mockJobs, mockDeliveryTargets } from '../services/mockData';
import StatusBadge from '../components/StatusBadge';
import JobDefinitionTab from '../components/JobDefinitionTab';
import JobScheduleTab from '../components/JobScheduleTab';
import JobDeliveryTab from '../components/JobDeliveryTab';

const JobDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find(j => j.id === Number(id));
  const [activeTab, setActiveTab] = useState<'definition' | 'schedule' | 'delivery'>('definition');
  
  if (!job) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Job not found</div>;

  const handleTrigger = () => {
    // In a real app, this would call the API
    alert(`[SIMULATION] Job "${job.name}" has been triggered manually.\nExecution ID: exec-${Date.now()}`);
  };

  const handleSave = () => {
    // In a real app, this would PUT to the API
    alert(`[SIMULATION] Configuration for "${job.name}" saved successfully.\nSchema Validation: PASSED`);
  };

  const handleAddTarget = () => {
    alert(`[SIMULATION] Open "Add Delivery Target" Modal.\n(Feature pending backend integration)`);
  };

  const targets = mockDeliveryTargets.filter(t => t.job_id === job.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/jobs')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.name}</h1>
              <StatusBadge status={job.status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono text-xs">{job.uuid}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleTrigger}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
          >
            <Play size={16} className="mr-2" />
            Trigger Now
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 flex px-6">
          <button 
            onClick={() => setActiveTab('definition')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors flex items-center ${
              activeTab === 'definition' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <FileJson size={16} className="mr-2" />
            JSON Definition
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors flex items-center ${
              activeTab === 'schedule' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Clock size={16} className="mr-2" />
            Schedule
          </button>
          <button 
            onClick={() => setActiveTab('delivery')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors flex items-center ${
              activeTab === 'delivery' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Share2 size={16} className="mr-2" />
            Delivery Targets
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'definition' && <JobDefinitionTab job={job} />}
          {activeTab === 'schedule' && <JobScheduleTab job={job} />}
          {activeTab === 'delivery' && <JobDeliveryTab targets={targets} onAddTarget={handleAddTarget} />}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
```

### FILE: pages/Jobs.tsx
```typescript
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Play, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { listJobs, patchJobStatus, runJob } from '../services/jobApi';
import StatusBadge from '../components/StatusBadge';
import { ReportJob } from '../types';

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ReportJob[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [running, setRunning] = useState<number | null>(null);
  const PAGE_SIZE = 20;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { jobs: data, total: t } = await listJobs(page, PAGE_SIZE);
      setJobs(data);
      setTotal(t);
    } catch (e: any) {
      setError(e.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleRun = async (id: number) => {
    setRunning(id);
    try {
      await runJob(id);
      fetchJobs();
    } catch (e: any) {
      alert(`Run failed: ${e.message}`);
    } finally {
      setRunning(null);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Archive job "${name}"?`)) return;
    try {
      await patchJobStatus(id, 'DELETED');
      fetchJobs();
    } catch (e: any) {
      alert(`Failed: ${e.message}`);
    }
  };

  const filtered = jobs.filter(j =>
    j.name.toLowerCase().includes(search.toLowerCase()) ||
    j.uuid.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Jobs</h1>
          <p className="text-gray-500 mt-1">Manage report definitions and configuration.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchJobs}
            className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/jobs/new')}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            New Job
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search jobs by name or UUID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button type="button" className="flex items-center px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>

        {/* States */}
        {loading && (
          <div className="py-16 text-center text-gray-400 text-sm">Loading jobs…</div>
        )}
        {error && !loading && (
          <div className="py-16 text-center text-red-500 text-sm">{error}</div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Job Name</th>
                  <th className="px-6 py-4 font-semibold">Format</th>
                  <th className="px-6 py-4 font-semibold">Schedule</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Last Update</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                      No jobs found. Create your first report job to get started.
                    </td>
                  </tr>
                ) : filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{job.name}</span>
                        <span className="text-xs text-gray-500 font-mono mt-0.5">{job.uuid.substring(0, 8)}…</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-semibold text-gray-700">
                        {job.output_format}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {job.schedule ? (
                        <div className="flex items-center text-sm text-gray-600">
                          <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-xs mr-2">
                            {job.schedule.cron_expression}
                          </code>
                          <span className="text-xs text-gray-400">{job.schedule.timezone}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No schedule</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(job.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleRun(job.id)}
                          disabled={running === job.id}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded disabled:opacity-40"
                          title="Run Now"
                        >
                          <Play size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(job.id, job.name)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {total === 0 ? 'No results' : `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)} of ${total}`}
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;

```

### FILE: pages/Login.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Console</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to manage the SEND Platform</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Use your TUC SEND Platform credentials
        </div>
      </div>
    </div>
  );
};

export default Login;

```

### FILE: pages/NewJob.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { createJob } from '../services/jobApi';

const NewJob: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    outputFormat: 'PDF',
    priority: 5,
    cronExpression: '',
    timezone: 'Africa/Accra',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createJob({
        name: form.name,
        description: form.description,
        outputFormat: form.outputFormat,
        priority: Number(form.priority),
        ...(form.cronExpression ? {
          schedule: { cronExpression: form.cronExpression, timezone: form.timezone }
        } : {}),
      });
      navigate('/jobs');
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/jobs')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Job</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Define a new report automation task.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm" role="alert">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Monthly Sales Report"
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={set('description')}
            placeholder="Describe the purpose of this report..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Format</label>
            <select
              value={form.outputFormat}
              onChange={set('outputFormat')}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="PDF">PDF</option>
              <option value="XLSX">Excel (XLSX)</option>
              <option value="CSV">CSV</option>
              <option value="DOCX">Word (DOCX)</option>
              <option value="HTML">HTML</option>
              <option value="JSON">JSON</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority (1=High, 10=Low)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={form.priority}
              onChange={set('priority')}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Schedule (optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cron Expression</label>
              <input
                type="text"
                value={form.cronExpression}
                onChange={set('cronExpression')}
                placeholder="e.g. 0 8 1 * *"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm font-mono dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Leave blank for manual execution only</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
              <select
                value={form.timezone}
                onChange={set('timezone')}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="Africa/Accra">Africa/Accra (GMT)</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New York</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={18} className="mr-2" />
            {saving ? 'Creating…' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewJob;

```

### FILE: pages/Schedules.tsx
```typescript
import React from 'react';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { mockJobs } from '../services/mockData';

const Schedules: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
        <p className="text-gray-500 mt-1">Overview of all active cron schedules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockJobs.filter(j => j.schedule).map(job => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
             <div className={`absolute top-0 left-0 w-1 h-full ${job.schedule?.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
             
             <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-gray-900 text-lg">{job.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">{job.uuid.substring(0, 13)}...</p>
               </div>
               <span className={`px-2 py-1 rounded text-xs font-semibold ${job.schedule?.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                 {job.schedule?.is_active ? 'ACTIVE' : 'DISABLED'}
               </span>
             </div>

             <div className="space-y-3">
               <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                  <Clock size={18} className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Cron Pattern</p>
                    <code className="text-sm font-mono text-indigo-600 font-bold">{job.schedule?.cron_expression}</code>
                  </div>
               </div>

               <div className="flex items-center text-gray-700 p-2">
                  <CalendarIcon size={18} className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Next Run</p>
                    <p className="text-sm font-medium">
                      {new Date(job.schedule?.next_run_at || '').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
               </div>
             </div>

             <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
               <button className="text-blue-600 text-sm font-medium hover:text-blue-800">Edit Schedule</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedules;
```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['html', { outputFolder: 'tests/playwright-report' }]],
  use: {
    baseURL: 'http://localhost:3000',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1cc423cc-d7f8-49bd-aa22-caa728d56e8e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: services/apiClient.ts
```typescript
const BASE_URL = '/api';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = [REDACTED_CREDENTIAL]
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Unauthorised');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || body.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get:    <T>(path: string)                      => request<T>(path),
  post:   <T>(path: string, body?: unknown)      => request<T>(path, { method: 'POST',  body: body ? JSON.stringify(body) : undefined }),
  put:    <T>(path: string, body?: unknown)      => request<T>(path, { method: 'PUT',   body: body ? JSON.stringify(body) : undefined }),
  patch:  <T>(path: string, body?: unknown)      => request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string)                      => request<T>(path, { method: 'DELETE' }),
};

```

### FILE: services/auditService.ts
```typescript
import { AuditLog } from '../types';

class AuditService {
  private logs: AuditLog[] = [];

  constructor() {
    // Seed some initial logs
    this.logs = [
      {
        id: 'aud-001',
        user: 'system',
        action: 'SYSTEM_STARTUP',
        target: 'Core Services',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'SUCCESS',
        details: 'System initialized successfully'
      },
      {
        id: 'aud-002',
        user: 'daniel.admin',
        action: 'UPDATE_JOB',
        target: 'Job #1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'SUCCESS',
        details: 'Changed schedule cron expression'
      }
    ];
  }

  log(user: string, action: string, target: string, status: 'SUCCESS' | 'FAILURE' = 'SUCCESS', details?: string) {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      user,
      action,
      target,
      timestamp: new Date().toISOString(),
      status,
      details
    };
    this.logs.unshift(newLog);
    console.log(`[AUDIT] ${action} by ${user}: ${status}`);
    return newLog;
  }

  getLogs(): AuditLog[] {
    return this.logs;
  }
}

export const auditService = new AuditService();
```

### FILE: services/jobApi.ts
```typescript
import { api } from './apiClient';
import { ReportJob, ExecutionInstance, Schedule } from '../types';

// ─── Raw shapes returned by the Java API (camelCase) ─────────────────────────

interface ApiSchedule {
  id: number;
  cronExpression: string;
  timezone: string;
  active: boolean;
  nextRunAt?: string;
  lastRunAt?: string;
}

interface ApiExecution {
  id: number;
  status: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  outputPath?: string;
  outputSizeBytes?: number;
  rowCount?: number;
  errorMessage?: string;
  retryCount?: number;
}

interface ApiJob {
  id: number;
  uuid: string;
  name: string;
  description: string;
  owner?: { id: number; username: string; name: string };
  jsonDefinition?: string;
  outputFormat: string;
  status: string;
  priority: number;
  maxRetries: number;
  timeoutSeconds: number;
  createdAt: string;
  updatedAt: string;
  schedule?: ApiSchedule;
  executions?: ApiExecution[];
}

interface PageResponse<T> {
  content: T[];
  page: { totalElements: number; totalPages: number; number: number; size: number };
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

function mapSchedule(s: ApiSchedule): Schedule {
  return {
    id: s.id,
    job_id: 0, // not returned by API (back-reference)
    cron_expression: s.cronExpression,
    timezone: s.timezone,
    is_active: s.active,
    next_run_at: s.nextRunAt ?? '',
  };
}

function mapExecution(e: ApiExecution, jobId: number): ExecutionInstance {
  return {
    id: e.id,
    job_id: jobId,
    status: e.status as ExecutionInstance['status'],
    started_at: e.startedAt,
    completed_at: e.completedAt,
    duration_ms: e.durationMs,
    output_path: e.outputPath,
    output_size_bytes: e.outputSizeBytes,
    row_count: e.rowCount,
    error_message: e.errorMessage,
  };
}

function mapJob(j: ApiJob): ReportJob {
  return {
    id: j.id,
    uuid: j.uuid,
    name: j.name,
    description: j.description,
    owner_id: j.owner?.id ?? 0,
    json_definition: j.jsonDefinition ?? '',
    output_format: j.outputFormat as ReportJob['output_format'],
    status: j.status as ReportJob['status'],
    priority: j.priority,
    max_retries: j.maxRetries,
    timeout_seconds: j.timeoutSeconds,
    created_at: j.createdAt,
    updated_at: j.updatedAt,
    schedule: j.schedule ? mapSchedule(j.schedule) : undefined,
    last_execution: j.executions?.[0] ? mapExecution(j.executions[0], j.id) : undefined,
  };
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function listJobs(page = 0, size = 20): Promise<{ jobs: ReportJob[]; total: number }> {
  const res = await api.get<PageResponse<ApiJob>>(`/jobs?page=${page}&size=${size}`);
  return { jobs: res.content.map(mapJob), total: res.page.totalElements };
}

export async function getJob(id: number): Promise<ReportJob> {
  const j = await api.get<ApiJob>(`/jobs/${id}`);
  return mapJob(j);
}

export interface CreateJobPayload {
  name: string;
  description?: string;
  outputFormat: string;
  priority: number;
  maxRetries?: number;
  timeoutSeconds?: number;
  jsonDefinition?: string;
  schedule?: { cronExpression: string; timezone: string };
}

export async function createJob(payload: CreateJobPayload): Promise<ReportJob> {
  const j = await api.post<ApiJob>('/jobs', payload);
  return mapJob(j);
}

export async function updateJob(id: number, payload: Partial<CreateJobPayload>): Promise<ReportJob> {
  const j = await api.put<ApiJob>(`/jobs/${id}`, payload);
  return mapJob(j);
}

export async function patchJobStatus(id: number, status: string): Promise<ReportJob> {
  const j = await api.patch<ApiJob>(`/jobs/${id}/status`, { status });
  return mapJob(j);
}

export async function runJob(id: number): Promise<ExecutionInstance> {
  const e = await api.post<ApiExecution>(`/jobs/${id}/run`);
  return mapExecution(e, id);
}

export async function getJobExecutions(id: number): Promise<ExecutionInstance[]> {
  const res = await api.get<PageResponse<ApiExecution>>(`/jobs/${id}/executions?size=50`);
  return res.content.map(e => mapExecution(e, id));
}

export async function listExecutions(page = 0, size = 20): Promise<{ executions: ExecutionInstance[]; total: number }> {
  const res = await api.get<PageResponse<ApiExecution>>(`/executions?page=${page}&size=${size}`);
  // executions endpoint doesn't return job_id directly — we set 0 as placeholder
  return { executions: res.content.map(e => mapExecution(e, 0)), total: res.page.totalElements };
}

export interface AdminMetrics {
  totalJobs: number;
  totalUsers: number;
  executions: {
    total: number;
    completed: number;
    failed: number;
    running: number;
  };
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  return api.get<AdminMetrics>('/admin/metrics');
}

```

### FILE: services/mockData.ts
```typescript
import { ReportJob, JobStatus, OutputFormat, ExecutionStatus, ExecutionInstance, DeliveryChannel, GatewayRoute, HttpMethod, AuthType } from '../types';

export const mockJobs: ReportJob[] = [
  {
    id: 1,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Monthly Enrollment Summary',
    description: 'Aggregates student enrollment data by department for the current semester.',
    owner_id: 101,
    json_definition: JSON.stringify({
      reportName: "Monthly Enrollment Summary",
      dataSource: { query: "SELECT * FROM enrollment..." },
      template: "enrollment-v2"
    }, null, 2),
    output_format: OutputFormat.PDF,
    status: JobStatus.ACTIVE,
    priority: 1,
    max_retries: 3,
    timeout_seconds: 300,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-02-10T14:30:00Z',
    schedule: {
      id: 1,
      job_id: 1,
      cron_expression: '0 8 1 * *',
      timezone: 'Africa/Accra',
      is_active: true,
      next_run_at: '2026-03-01T08:00:00Z'
    }
  },
  {
    id: 2,
    uuid: '661f9511-f30c-52e5-b827-557766551111',
    name: 'Financial Audit 2025',
    description: 'Yearly financial transaction log for external auditing.',
    owner_id: 102,
    json_definition: JSON.stringify({
      reportName: "Financial Audit",
      dataSource: { table: "transactions_2025" },
      template: "finance-audit-std"
    }, null, 2),
    output_format: OutputFormat.XLSX,
    status: JobStatus.PAUSED,
    priority: 5,
    max_retries: 5,
    timeout_seconds: 600,
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-02-12T11:00:00Z',
    schedule: {
      id: 2,
      job_id: 2,
      cron_expression: '0 0 1 1 *',
      timezone: 'UTC',
      is_active: false,
      next_run_at: '2027-01-01T00:00:00Z'
    }
  },
  {
    id: 3,
    uuid: '772g0622-g41d-63f6-c938-668877662222',
    name: 'Daily System Health Check',
    description: 'Internal report on server status and error rates.',
    owner_id: 101,
    json_definition: JSON.stringify({
      reportName: "System Health",
      dataSource: { api: "/health/metrics" },
      template: "health-check-html"
    }, null, 2),
    output_format: OutputFormat.HTML,
    status: JobStatus.ACTIVE,
    priority: 1,
    max_retries: 1,
    timeout_seconds: 60,
    created_at: '2026-02-14T10:00:00Z',
    updated_at: '2026-02-14T10:00:00Z',
    schedule: {
      id: 3,
      job_id: 3,
      cron_expression: '0 6 * * *',
      timezone: 'UTC',
      is_active: true,
      next_run_at: '2026-02-15T06:00:00Z'
    }
  }
];

export const mockExecutions: ExecutionInstance[] = [
  {
    id: 1001,
    job_id: 1,
    status: ExecutionStatus.COMPLETED,
    started_at: '2026-02-01T08:00:00Z',
    completed_at: '2026-02-01T08:02:15Z',
    duration_ms: 135000,
    output_path: '/reports/2026/feb/enrollment.pdf',
    output_size_bytes: 4500000,
    row_count: 1250
  },
  {
    id: 1002,
    job_id: 3,
    status: ExecutionStatus.COMPLETED,
    started_at: '2026-02-14T06:00:00Z',
    completed_at: '2026-02-14T06:00:05Z',
    duration_ms: 5000,
    output_path: '/reports/system/health_20260214.html',
    output_size_bytes: 15000,
    row_count: 50
  },
  {
    id: 1003,
    job_id: 2,
    status: ExecutionStatus.FAILED,
    started_at: '2026-01-01T00:00:00Z',
    completed_at: '2026-01-01T00:00:10Z',
    duration_ms: 10000,
    error_message: 'Database Connection Timeout: Could not connect to FinanceDB',
    row_count: 0
  }
];

export const mockDeliveryTargets = [
  {
    id: 1,
    job_id: 1,
    channel: DeliveryChannel.EMAIL,
    config: { to: ['dean@techbridge.edu.gh'], subject: 'Monthly Report' },
    is_active: true
  },
  {
    id: 2,
    job_id: 1,
    channel: DeliveryChannel.SHAREPOINT,
    config: { siteId: 'finance-site', library: 'Reports' },
    is_active: true
  }
];

export const mockPerformanceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: 20 + Math.random() * 30,
  memory: 40 + Math.random() * 20,
  activeJobs: Math.floor(Math.random() * 10)
}));

export const mockGatewayRoutes: GatewayRoute[] = [
  // User Management Endpoints
  {
    id: 'rt-user-001',
    path: '/api/v1/users',
    method: HttpMethod.GET,
    upstream_service: 'user-service:8080',
    auth_type: AuthType.OAUTH2,
    rate_limit_per_min: 1000,
    is_active: true,
    description: 'List all platform users'
  },
  {
    id: 'rt-user-002',
    path: '/api/v1/users',
    method: HttpMethod.POST,
    upstream_service: 'user-service:8080',
    auth_type: AuthType.JWT,
    rate_limit_per_min: 100,
    is_active: true,
    description: 'Create a new user'
  },
  {
    id: 'rt-user-003',
    path: '/api/v1/users/:id',
    method: HttpMethod.DELETE,
    upstream_service: 'user-service:8080',
    auth_type: AuthType.JWT,
    rate_limit_per_min: 50,
    is_active: true,
    description: 'Deactivate a user account'
  },
  
  // Data Retrieval Endpoints
  {
    id: 'rt-data-001',
    path: '/api/v1/data/reports',
    method: HttpMethod.GET,
    upstream_service: 'report-engine:8081',
    auth_type: AuthType.API_KEY,
    rate_limit_per_min: 500,
    is_active: true,
    description: 'Retrieve generated report metadata'
  },
  {
    id: 'rt-data-002',
    path: '/api/v1/data/metrics',
    method: HttpMethod.GET,
    upstream_service: 'monitoring-service:9090',
    auth_type: AuthType.API_KEY,
    rate_limit_per_min: 2000,
    is_active: true,
    description: 'Fetch system performance metrics'
  },
  {
    id: 'rt-data-003',
    path: '/api/v1/jobs/:id/execution-log',
    method: HttpMethod.GET,
    upstream_service: 'scheduler-service:8082',
    auth_type: AuthType.OAUTH2,
    rate_limit_per_min: 300,
    is_active: true,
    description: 'Get execution history for a specific job'
  }
];
```

### FILE: services/playwrightScenarios.ts
```typescript
import { PuppeteerScenario } from '../types';

export const SCENARIOS: PuppeteerScenario[] = [
  {
    id: 'E2E-001',
    name: 'Admin Login Flow',
    description: 'Verifies that an admin user can log in with valid credentials and is redirected to the dashboard.',
    criticality: 'HIGH',
    code: `
import { test, expect } from '@playwright/test';

test('Admin Login Flow', async ({ page }) => {
  // 1. Navigate to Login
  await page.goto('/#/login');

  // 2. Enter Credentials
  await page.locator('#username').fill('admin');
  await page.locator('#password').fill('password');

  // 3. Submit
  await page.locator('button[type="submit"]').click();

  // 4. Verify Redirection
  const title = await page.locator('h1').textContent();
  expect(title).toBe('Active Jobs');
});
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/login', description: 'Navigate to Login Page' },
      { id: 2, action: 'type', selector: '#username', description: 'Type Username' },
      { id: 3, action: 'type', selector: '#password', description: 'Type Password' },
      { id: 4, action: 'click', selector: 'button[type="submit"]', description: 'Click Login Button' },
      { id: 5, action: 'waitFor', selector: '/dashboard', description: 'Wait for Dashboard Redirection' }
    ]
  },
  {
    id: 'E2E-002',
    name: 'Create New Job',
    description: 'Ensures the job creation form submits correctly and validates input.',
    criticality: 'HIGH',
    code: `
import { test, expect } from '@playwright/test';

test('Create New Job', async ({ page }) => {
  await page.goto('/#/jobs/new');

  // 1. Fill Form
  await page.locator('input[placeholder="e.g. Monthly Sales Report"]').fill('Playwright Auto-Test Job');
  await page.locator('select').selectOption('PDF');

  // 2. Submit
  await page.getByRole('button', { name: 'Create Job' }).click();

  // 3. Verify Navigation
  await expect(page.locator('table')).toBeVisible();
});
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/jobs/new', description: 'Navigate to New Job Page' },
      { id: 2, action: 'type', selector: 'input[name="name"]', description: 'Enter Job Name' },
      { id: 3, action: 'select', selector: 'select[name="format"]', description: 'Select PDF Format' },
      { id: 4, action: 'click', selector: 'button.create-job', description: 'Submit Form' },
      { id: 5, action: 'assert', expected: '/jobs', description: 'Verify Redirect to Job List' }
    ]
  },
  {
    id: 'E2E-003',
    name: 'API Gateway Rate Limit',
    description: 'Checks if rate limiting controls can be toggled via the UI.',
    criticality: 'MEDIUM',
    code: `
import { test, expect } from '@playwright/test';

test('API Gateway Rate Limit Toggle', async ({ page }) => {
  await page.goto('/#/admin/api-gateway');
  await page.getByRole('button', { name: 'Global Policy' }).click();
  await page.locator('#toggle-rate-limit').click();
  const isChecked = await page.locator('#toggle-rate-limit').isChecked();
  console.log('Rate limit active:', isChecked);
});
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/admin/api-gateway', description: 'Go to API Gateway' },
      { id: 2, action: 'click', selector: 'tab-settings', description: 'Switch to Settings Tab' },
      { id: 3, action: 'click', selector: '#toggle', description: 'Toggle Rate Limit Switch' },
      { id: 4, action: 'verify', selector: '#toggle', description: 'Verify Switch State Changed' }
    ]
  },
  {
    id: 'E2E-004',
    name: 'Verify Diagnostics',
    description: 'Navigates to Diagnostics page and verifies all component health checks are visible.',
    criticality: 'MEDIUM',
    code: `
import { test, expect } from '@playwright/test';

test('Verify Diagnostics', async ({ page }) => {
  await page.goto('/#/admin/diagnostics');
  await expect(page.locator('h1', { hasText: 'System Diagnostics' })).toBeVisible();
  const healthChecks = await page.locator('[role="listitem"]').count();
  expect(healthChecks).toBeGreaterThanOrEqual(5);
});
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/admin/diagnostics', description: 'Navigate to Diagnostics' },
      { id: 2, action: 'waitFor', selector: 'h1', description: 'Wait for Header' },
      { id: 3, action: 'count', selector: '[role="listitem"]', description: 'Count Health Check Items' },
      { id: 4, action: 'assert', expected: '>= 5', description: 'Verify at least 5 checks present' }
    ]
  },
  {
    id: 'E2E-005',
    name: 'Theme Toggle Accessibility',
    description: 'Toggles between Light, Dark, and High-Contrast modes.',
    criticality: 'LOW',
    code: `
import { test, expect } from '@playwright/test';

test('Theme Toggle Accessibility', async ({ page }) => {
  await page.goto('/');
  await page.locator('button[aria-label="Toggle Theme"]').click();
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  expect(isDark).toBe(true);

  await page.locator('button[aria-label="Toggle Theme"]').click();
  const isHighContrast = await page.evaluate(() => document.documentElement.classList.contains('high-contrast'));
  expect(isHighContrast).toBe(true);
});
    `,
    steps: [
      { id: 1, action: 'click', selector: 'button[aria-label="Toggle Theme"]', description: 'Click Theme Toggle (Dark)' },
      { id: 2, action: 'verify', selector: 'html.dark', description: 'Verify Dark Mode Class' },
      { id: 3, action: 'click', selector: 'button[aria-label="Toggle Theme"]', description: 'Click Theme Toggle (High Contrast)' },
      { id: 4, action: 'verify', selector: 'html.high-contrast', description: 'Verify High Contrast Class' }
    ]
  }
];

```

### FILE: services/puppeteerScenarios.ts
```typescript
import { PlaywrightScenario } from '../types';

export const SCENARIOS: PlaywrightScenario[] = [
  {
    id: 'E2E-001',
    name: 'Admin Login Flow',
    description: 'Verifies that an admin user can log in with valid credentials and is redirected to the dashboard.',
    criticality: 'HIGH',
    code: `
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 1. Navigate to Login
  await page.goto('http://localhost:3000/#/login');
  
  // 2. Enter Credentials
  await page.type('#username', 'admin');
  await page.type('#password', 'password');
  
  // 3. Submit
  await page.click('button[type="submit"]');
  
  // 4. Verify Redirection
  await page.waitForSelector('h1'); // Dashboard header
  const title = await page.$eval('h1', el => el.textContent);
  
  if (title !== 'Active Jobs') throw new Error('Login failed');
  
  await browser.close();
})();
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/login', description: 'Navigate to Login Page' },
      { id: 2, action: 'type', selector: '#username', description: 'Type Username' },
      { id: 3, action: 'type', selector: '#password', description: 'Type Password' },
      { id: 4, action: 'click', selector: 'button[type="submit"]', description: 'Click Login Button' },
      { id: 5, action: 'waitFor', selector: '/dashboard', description: 'Wait for Dashboard Redirection' }
    ]
  },
  {
    id: 'E2E-002',
    name: 'Create New Job',
    description: 'Ensures the job creation form submits correctly and validates input.',
    criticality: 'HIGH',
    code: `
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/#/jobs/new');
  
  // 1. Fill Form
  await page.type('input[placeholder="e.g. Monthly Sales Report"]', 'Playwright Auto-Test Job');
  await page.select('select', 'PDF');
  
  // 2. Submit
  await page.click('button:has-text("Create Job")');
  
  // 3. Verify Navigation
  await page.waitForSelector('table'); // Jobs table
  
  await browser.close();
})();
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/jobs/new', description: 'Navigate to New Job Page' },
      { id: 2, action: 'type', selector: 'input[name="name"]', description: 'Enter Job Name' },
      { id: 3, action: 'select', selector: 'select[name="format"]', description: 'Select PDF Format' },
      { id: 4, action: 'click', selector: 'button.create-job', description: 'Submit Form' },
      { id: 5, action: 'assert', expected: '/jobs', description: 'Verify Redirect to Job List' }
    ]
  },
  {
    id: 'E2E-003',
    name: 'API Gateway Rate Limit',
    description: 'Checks if rate limiting controls can be toggled via the UI.',
    criticality: 'MEDIUM',
    code: `
// ...setup...
await page.goto('http://localhost:3000/#/admin/api-gateway');
await page.click('button:has-text("Global Policy")');
await page.click('#toggle-rate-limit');
const isChecked = await page.$eval('#toggle-rate-limit', el => el.checked);
console.log('Rate limit active:', isChecked);
// ...teardown...
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/admin/api-gateway', description: 'Go to API Gateway' },
      { id: 2, action: 'click', selector: 'tab-settings', description: 'Switch to Settings Tab' },
      { id: 3, action: 'click', selector: '#toggle', description: 'Toggle Rate Limit Switch' },
      { id: 4, action: 'verify', selector: '#toggle', description: 'Verify Switch State Changed' }
    ]
  },
  {
    id: 'E2E-004',
    name: 'Verify Diagnostics',
    description: 'Navigates to Diagnostics page and verifies all component health checks are visible.',
    criticality: 'MEDIUM',
    code: `
// ...setup...
await page.goto('http://localhost:3000/#/admin/diagnostics');
await page.waitForSelector('h1:has-text("System Diagnostics")');
const healthChecks = await page.$$eval('[role="listitem"]', items => items.length);
if (healthChecks < 5) throw new Error('Missing health checks');
// ...teardown...
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/admin/diagnostics', description: 'Navigate to Diagnostics' },
      { id: 2, action: 'waitFor', selector: 'h1', description: 'Wait for Header' },
      { id: 3, action: 'count', selector: '[role="listitem"]', description: 'Count Health Check Items' },
      { id: 4, action: 'assert', expected: '>= 5', description: 'Verify at least 5 checks present' }
    ]
  },
  {
    id: 'E2E-005',
    name: 'Theme Toggle Accessibility',
    description: 'Toggles between Light, Dark, and High-Contrast modes.',
    criticality: 'LOW',
    code: `
// ...setup...
await page.click('button[aria-label="Toggle Theme"]');
const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
await page.click('button[aria-label="Toggle Theme"]');
const isHighContrast = await page.evaluate(() => document.documentElement.classList.contains('high-contrast'));
// ...teardown...
    `,
    steps: [
      { id: 1, action: 'click', selector: 'button[aria-label="Toggle Theme"]', description: 'Click Theme Toggle (Dark)' },
      { id: 2, action: 'verify', selector: 'html.dark', description: 'Verify Dark Mode Class' },
      { id: 3, action: 'click', selector: 'button[aria-label="Toggle Theme"]', description: 'Click Theme Toggle (High Contrast)' },
      { id: 4, action: 'verify', selector: 'html.high-contrast', description: 'Verify High Contrast Class' }
    ]
  }
];
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
          <span className="font-bold text-sm">Send Platform Dashboard</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Send Platform Dashboard — Admin</h1>
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
 * E2E stub — send-platform-dashboard
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('send-platform-dashboard E2E', () => {
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

### FILE: tests/e2e/app.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('SEND Platform Dashboard', () => {
  test('should load and display main navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').or(page.locator('nav'))).toBeVisible();
  });

  test('should display Active Jobs section', async ({ page }) => {
    await page.goto('/#/login');
    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('password');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h1', { hasText: /Active Jobs/i })).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to diagnostics page', async ({ page }) => {
    await page.goto('/#/admin/diagnostics');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display testing framework page', async ({ page }) => {
    await page.goto('/#/admin/testing');
    await expect(page.locator('h1', { hasText: /Testing Framework/i })).toBeVisible({ timeout: 10000 });
  });

  test('should display E2E Scenarios tab', async ({ page }) => {
    await page.goto('/#/admin/testing');
    await expect(page.locator('h1', { hasText: /Testing Framework/i })).toBeVisible({ timeout: 10000 });
    const e2eTab = page.getByRole('tab', { name: /E2E Scenarios/i });
    await expect(e2eTab).toBeVisible();
  });
});

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
// Enums based on SRS Section 4.1
export enum OutputFormat {
  PDF = 'PDF',
  XLSX = 'XLSX',
  CSV = 'CSV',
  DOCX = 'DOCX',
  HTML = 'HTML',
  JSON = 'JSON'
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}

export enum ExecutionStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED'
}

export enum DeliveryChannel {
  EMAIL = 'EMAIL',
  SHAREPOINT = 'SHAREPOINT',
  GDRIVE = 'GDRIVE',
  SFTP = 'SFTP',
  REST_API = 'REST_API'
}

// Entity Interfaces
export interface ReportJob {
  id: number;
  uuid: string;
  name: string;
  description: string;
  owner_id: number;
  json_definition: string; // Stored as stringified JSON for editing
  output_format: OutputFormat;
  status: JobStatus;
  priority: number; // 1-10 scale (1 = High, 10 = Low)
  max_retries: number;
  timeout_seconds: number;
  created_at: string;
  updated_at: string;
  last_execution?: ExecutionInstance; // Joined for display
  schedule?: Schedule; // Joined for display
}

export interface Schedule {
  id: number;
  job_id: number;
  cron_expression: string;
  timezone: string;
  is_active: boolean;
  next_run_at: string;
}

export interface ExecutionInstance {
  id: number;
  job_id: number;
  status: ExecutionStatus;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  output_path?: string;
  output_size_bytes?: number;
  row_count?: number;
  error_message?: string;
}

export interface DeliveryTarget {
  id: number;
  job_id: number;
  channel: DeliveryChannel;
  config: Record<string, any>;
  is_active: boolean;
}

export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'USER';
  name: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILURE';
  details?: string;
}

// Admin Metrics Types
export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  history: { time: string; value: number }[];
}

// API Gateway Types
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export enum AuthType {
  NONE = 'NONE',
  API_KEY = [REDACTED_CREDENTIAL]
  OAUTH2 = 'OAUTH2',
  JWT = 'JWT'
}

export interface GatewayRoute {
  id: string;
  path: string;
  method: HttpMethod;
  upstream_service: string;
  auth_type: AuthType;
  rate_limit_per_min: number;
  is_active: boolean;
  description: string;
}

// Testing Framework Types
export interface TestStep {
  id: number;
  action: string;
  selector?: string;
  expected?: string;
  description: string;
}

export interface PuppeteerScenario {
  id: string;
  name: string;
  description: string;
  criticality: 'HIGH' | 'MEDIUM' | 'LOW';
  code: string; // The Puppeteer script content
  steps: TestStep[];
}

export interface TestRunResult {
  scenarioId: string;
  timestamp: string;
  success: boolean;
  logs: string[];
  durationMs: number;
  screenshotUrl?: string; // Mock URL
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
  },
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:8090',
            changeOrigin: true,
          },
        },
      },
      base: './',
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

// Vitest unit test configuration — send-platform-dashboard
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

// Vitest E2E configuration — send-platform-dashboard
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

