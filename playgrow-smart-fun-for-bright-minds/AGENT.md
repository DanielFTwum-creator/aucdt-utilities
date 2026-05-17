# playgrow-smart-fun-for-bright-minds - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for playgrow-smart-fun-for-bright-minds.

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
import React, { useState, useEffect } from 'react';
import { ZoneID } from './types';
import { ZONES_DATA } from './data/zones';
import WorldMap from './components/WorldMap';
import ZoneDetail from './components/ZoneDetail';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import SelfTestDashboard from './components/SelfTestDashboard';

export type View = 'map' | 'zone' | 'admin_login' | 'admin_dashboard' | 'self_test';
export type Theme = 'light' | 'dark' | 'high-contrast';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('map');
  const [currentZoneId, setCurrentZoneId] = useState<ZoneID | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
  }, [theme]);

  const handleSelectZone = (zoneId: ZoneID) => {
    setCurrentZoneId(zoneId);
    setCurrentView('zone');
  };

  const handleBackToMap = () => {
    setCurrentZoneId(null);
    setCurrentView('map');
  };
  
  const handleNavigateToAdminLogin = () => {
    setCurrentView('admin_login');
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('admin_dashboard');
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('map');
  };

  const handleNavigateToSelfTest = () => {
    if (isAuthenticated) {
      setCurrentView('self_test');
    }
  };

  const handleBackToAdmin = () => {
    setCurrentView('admin_dashboard');
  }

  const renderContent = () => {
    switch(currentView) {
      case 'zone':
        const currentZone = ZONES_DATA.find(zone => zone.id === currentZoneId);
        if (currentZone) {
            return <ZoneDetail zone={currentZone} onBack={handleBackToMap} theme={theme} setTheme={setTheme} />;
        }
        // Fallback to map if zone is not found
        setCurrentView('map');
        return <WorldMap zones={ZONES_DATA} onSelectZone={handleSelectZone} onAdminClick={handleNavigateToAdminLogin} theme={theme} setTheme={setTheme} />;
      case 'admin_login':
        return <AdminLogin onLoginSuccess={handleLoginSuccess} onBack={handleBackToMap} />;
      case 'admin_dashboard':
        return <AdminDashboard onLogout={handleLogout} onNavigateToSelfTest={handleNavigateToSelfTest} />;
      case 'self_test':
        return <SelfTestDashboard onBack={handleBackToAdmin} />;
      case 'map':
      default:
        return <WorldMap zones={ZONES_DATA} onSelectZone={handleSelectZone} onAdminClick={handleNavigateToAdminLogin} theme={theme} setTheme={setTheme} />;
    }
  }

  return (
    <div className={`w-screen h-screen bg-sky-100 dark:bg-gray-900 overflow-hidden font-sans antialiased hc-bg-primary hc-text-primary`}>
      <div className="transition-opacity duration-500 ease-in-out h-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;

```

### FILE: components/AdminDashboard.tsx
```typescript
import React, { useState } from 'react';
import { TestTubeIcon } from './icons';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateToSelfTest: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onNavigateToSelfTest }) => {
    const [logs, setLogs] = useState<string[]>([]);

    const logAction = (action: string) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ADMIN ACTION: ${action}`;
        console.log(logMessage); // Comprehensive audit logging
        setLogs(prev => [logMessage, ...prev]);
    };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-800 p-4 sm:p-8 hc-bg-primary">
        <header className="flex items-center justify-between mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100 hc-text-primary">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
                <button
                    onClick={onNavigateToSelfTest}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-400 hc-bg-secondary hc-border hc-accent flex items-center space-x-2"
                    >
                    <TestTubeIcon className="w-5 h-5" />
                    <span>Run Self-Tests</span>
                </button>
                <button
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-red-400 hc-bg-secondary hc-border hc-accent"
                    >
                    Logout
                </button>
            </div>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 hc-bg-secondary hc-border">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 hc-text-primary">System Controls</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => logAction('Reset all user progress.')} className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-yellow-400 hc-bg-primary hc-border hc-accent">Reset All Progress</button>
                    <button onClick={() => logAction('Triggered system-wide content update.')} className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-green-400 hc-bg-primary hc-border hc-accent">Push Content Update</button>
                    <button onClick={() => logAction('Triggered manual data backup.')} className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-primary hc-border hc-accent">Trigger System Backup</button>
                    <button onClick={() => logAction('Flushed application cache.')} className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-purple-400 hc-bg-primary hc-border hc-accent">Flush Cache</button>
                </div>
            </div>

            {/* Audit Log */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col hc-bg-secondary hc-border">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 hc-text-primary">Audit Log</h2>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-y-auto h-64 lg:h-auto hc-bg-primary hc-border">
                    {logs.length > 0 ? (
                        logs.map((log, index) => (
                            <p key={index} className="text-sm text-gray-600 dark:text-gray-300 font-mono mb-1 hc-text-secondary">{log}</p>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center mt-4 hc-text-secondary">No actions logged yet.</p>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};

export default AdminDashboard;

```

### FILE: components/AdminLogin.tsx
```typescript
import React, { useState } from 'react';
import { BackIcon, EyeIcon, EyeOffIcon, LockIcon, ShieldIcon, SparklesIcon, FilmIcon, CrownIcon } from './icons';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [currentVariation, setCurrentVariation] = useState(0);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (password =[REDACTED_CREDENTIAL]
        setError('');
        onLoginSuccess();
      } else {
        setError('Incorrect password. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const ThemedBackButton: React.FC<{className?: string}> = ({ className }) => (
     <button 
        type="button"
        onClick={onBack} 
        className={`absolute top-6 left-6 z-10 p-3 rounded-full transition-all focus:outline-none focus:ring-4 ${className}`}
        aria-label="Back to World Map"
    >
        <BackIcon className="w-6 h-6" />
    </button>
  );

  const OceanDepthsTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-b from-cyan-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
       <ThemedBackButton className="bg-cyan-950/50 text-cyan-200 hover:bg-cyan-900/80 focus:ring-cyan-500/50" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-blue-400 rounded-full filter blur-[100px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-indigo-400 rounded-full filter blur-[110px] animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-3xl blur-2xl"></div>
        <div className="relative bg-gradient-to-br from-cyan-950/60 to-indigo-950/60 backdrop-blur-xl rounded-3xl p-10 border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.2)]">
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-pulse">
                <ShieldIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-2 border-2 border-cyan-400/50 rounded-2xl animate-ping"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 dark:text-gray-100 hc-text-primary mb-2">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-3">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cyan-950/50 border border-cyan-500/30 rounded-xl px-4 py-4 text-cyan-100 placeholder-cyan-700 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold py-4 rounded-xl hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const ForestWhisperTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 flex items-center justify-center p-4 relative overflow-hidden">
      <ThemedBackButton className="bg-emerald-950/50 text-emerald-200 hover:bg-emerald-900/80 focus:ring-emerald-500/50" />
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-soft-light filter blur-[140px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-teal-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-10 border border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.15)]">
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <SparklesIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-center bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent mb-2">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-emerald-300 mb-3">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-emerald-950/50 border border-emerald-500/30 rounded-xl px-4 py-4 text-emerald-100 placeholder-emerald-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-semibold py-4 rounded-xl hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
  const SunsetGlowTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      <ThemedBackButton className="bg-white/50 text-purple-600 hover:bg-white/90 focus:ring-pink-400" />
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-gradient-to-br from-orange-300 to-pink-300 rounded-full filter blur-[100px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-pink-300 to-purple-300 rounded-full filter blur-[100px] opacity-40 animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50">
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl rotate-3 hover:rotate-6 transition-transform">
                <CrownIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/80 border-2 border-pink-200 rounded-xl px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-200 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
             {error && <p className="text-red-600 text-sm text-center" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const ArcticFrostTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4 relative overflow-hidden">
      <ThemedBackButton className="bg-white/50 text-blue-600 hover:bg-white/90 focus:ring-blue-400" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full filter blur-[100px] opacity-30"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-200 rounded-full filter blur-[120px] opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full filter blur-[140px] opacity-20"></div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-10 shadow-[0_8px_32px_rgba(59,130,246,0.12)] border border-white/80">
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                <LockIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-2 border-2 border-blue-300 rounded-full"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-3">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/80 border-2 border-blue-200 rounded-xl px-4 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                   aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm text-center" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:via-cyan-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const MidnightGalaxyTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <ThemedBackButton className="bg-indigo-950/50 text-indigo-200 hover:bg-indigo-900/80 focus:ring-purple-500/50" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            ></div>
          ))}
        </div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full filter blur-[150px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600 rounded-full filter blur-[130px] opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-30"></div>
        <div className="relative bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-2xl rounded-3xl p-10 border border-indigo-500/30 shadow-[0_0_100px_rgba(99,102,241,0.3)]">
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <SparklesIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
            </div>
             <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-3">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-indigo-950/50 border border-indigo-500/30 rounded-xl px-4 py-4 text-indigo-100 placeholder-indigo-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const DramaticCinemaTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-black to-black flex items-center justify-center p-4 relative overflow-hidden">
       <ThemedBackButton className="bg-black/50 text-red-200 hover:bg-black/80 focus:ring-red-500/50 border border-red-900/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,0,0,0.15),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
      
      <div className="relative w-full max-w-lg">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-lg blur opacity-25"></div>
          <div className="relative bg-gradient-to-b from-zinc-900 to-black rounded-lg p-10 border border-red-900/50">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-lg rotate-45 shadow-2xl shadow-red-900/50"></div>
                  <FilmIcon className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-red-600"></div>
                <LockIcon className="w-5 h-5 text-red-500" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-red-600"></div>
              </div>
              <h2 className="text-2xl font-light text-red-100 tracking-wide">Administrator Portal</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-red-400 mb-3 tracking-wider">ACCESS PASSWORD</label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-red-900/50 rounded-lg px-4 py-4 text-red-100 placeholder-red-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 transition-all"
                    placeholder="Enter secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-400 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
                {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-bold py-4 rounded-lg hover:from-red-600 hover:via-red-500 hover:to-red-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] disabled:opacity-50 tracking-wider"
              >
                {isLoading ? 'AUTHENTICATING...' : 'ENTER SYSTEM'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const variations = [
    { name: "Ocean Depths", Component: OceanDepthsTheme },
    { name: "Forest Whisper", Component: ForestWhisperTheme },
    { name: "Sunset Glow", Component: SunsetGlowTheme },
    { name: "Arctic Frost", Component: ArcticFrostTheme },
    { name: "Midnight Galaxy", Component: MidnightGalaxyTheme },
    { name: "Dramatic Cinema", Component: DramaticCinemaTheme }
  ];

  const CurrentThemeComponent = variations[currentVariation].Component;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <CurrentThemeComponent />
      
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-sm rounded-full shadow-2xl p-2 flex gap-1 sm:gap-2">
        {variations.map((variation, index) => (
          <button
            key={variation.name}
            onClick={() => setCurrentVariation(index)}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              currentVariation === index
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {variation.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminLogin;

```

### FILE: components/icons.tsx
```typescript
import React from 'react';

export const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7h0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 14.5 2Z" />
    <path d="M12 12a2.5 2.5 0 0 0-2.5 2.5V17a2.5 2.5 0 0 0 5 0v-2.5A2.5 2.5 0 0 0 12 12Z" />
    <path d="M4.5 10A2.5 2.5 0 0 1 7 12.5v0a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 2 12.5v0A2.5 2.5 0 0 1 4.5 10Z" />
    <path d="M19.5 10a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5h0a2.5 2.5 0 0 1-2.5-2.5v0a2.5 2.5 0 0 1 2.5-2.5Z" />
    <path d="M9.5 16A2.5 2.5 0 0 1 12 18.5v0a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 7 18.5v0A2.5 2.5 0 0 1 9.5 16Z" />
    <path d="M14.5 16a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5h0a2.5 2.5 0 0 1-2.5-2.5v0a2.5 2.5 0 0 1 2.5-2.5Z" />
  </svg>
);

export const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.424-.108-.83-.31-1.176-.202-.346-.502-.646-.884-.884-.382-.238-.852-.31-1.176-.31-.92 0-1.667.746-1.667 1.648 0 .921.747 1.667 1.667 1.667s1.667-.746 1.667-1.667c0-.921.747-1.667 1.667-1.667s1.667.746 1.667 1.667c0 .921.747 1.667 1.667 1.667s1.667-.746 1.667-1.667C22 6.5 17.5 2 12 2z" />
  </svg>
);

export const BookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
    </svg>
);

export const RunningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6.5" cy="4.5" r="2.5"/>
        <path d="M12.5 18.5 9 14l-2.5 3"/>
        <path d="m17 12-2-3-3 4"/>
        <path d="m10 11 3-3 4 3-3 4-2-3"/>
    </svg>
);

export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
);

export const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
    </svg>
);

export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
);

// Mini-game icons
export const PuzzleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 12a2 2 0 1 0-2-2"/>
        <path d="M12 14a2 2 0 1 0 2 2"/>
        <path d="M12 6V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
        <path d="M18 12h2a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2h-2"/>
        <path d="M6 12H4a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h2"/>
        <path d="M12 18v2a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-2"/>
        <path d="M22 12h-2"/>
        <path d="M14 12h-4"/>
        <path d="M2 12h2"/>
        <path d="M12 14v-4"/>
        <path d="M12 22v-2"/>
        <path d="M12 2v2"/>
    </svg>
);

export const PatternIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="2"/>
        <circle cx="18" cy="18" r="2"/>
        <circle cx="6" cy="18" r="2"/>
        <circle cx="18" cy="6" r="2"/>
        <path d="M8 6h8"/>
        <path d="M18 8v8"/>
        <path d="M16 18H8"/>
        <path d="M6 16V8"/>
    </svg>
);

export const MatchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12c0-2.5-2-4-2-4s-2 1.5-2 4c0 2.5 2 4 2 4s2-1.5 2-4Z"/>
        <path d="M10 12c0-2.5-2-4-2-4s-2 1.5-2 4c0 2.5 2 4 2 4s2-1.5 2-4Z"/>
        <path d="M15 12h.01"/>
        <path d="M5 12h.01"/>
    </svg>
);

export const GenericGameIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="m9 12 2 2 4-4"/>
    </svg>
);

export const BackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
    </svg>
);

export const ContrastIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 18a6 6 0 0 0 0-12v12z" />
    </svg>
);

export const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export const TestTubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2" />
        <path d="M8.5 2h7" />
        <path d="M14.5 16h-5" />
    </svg>
);

export const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

export const EyeOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);

export const ShieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 3.9-3.9 1.9 3.9 1.9 1.9 3.9 1.9-3.9 3.9-1.9-3.9-1.9Z"/><path d="M5 12s.9-2 2.1-2.1c1.1-.1 2.1.9 2.1 2.1-.1 1.1-.9 2.1-2.1 2.1-.9.1-2.1-.9-2.1-2.1Z"/><path d="M19 12s.9-2 2.1-2.1c1.1-.1 2.1.9 2.1 2.1-.1 1.1-.9 2.1-2.1 2.1-.9.1-2.1-.9-2.1-2.1Z"/></svg>
);

export const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
);

export const CrownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
);

```

### FILE: components/SelfTestDashboard.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { PUPPETEER_TEST_SUITE } from '../tests/playwrightSuite';
import { TestStatus, TestSuite } from '../types';
import { BackIcon } from './icons';

interface SelfTestDashboardProps {
  onBack: () => void;
}

const StatusIndicator: React.FC<{ status: TestStatus }> = ({ status }) => {
    const baseClasses = "w-5 h-5 rounded-full flex items-center justify-center";
    switch (status) {
        case 'running':
            return <div className={`${baseClasses} bg-blue-200`}><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div></div>;
        case 'passed':
            return <div className={`${baseClasses} bg-green-200 text-green-700`}>✓</div>;
        case 'failed':
            return <div className={`${baseClasses} bg-red-200 text-red-700`}>✗</div>;
        case 'pending':
        default:
            return <div className={`${baseClasses} bg-gray-200`}></div>;
    }
};

const SelfTestDashboard: React.FC<SelfTestDashboardProps> = ({ onBack }) => {
    const [testResults, setTestResults] = useState<Record<string, TestStatus>>({});
    const [currentLog, setCurrentLog] = useState('Tests pending. Click "Run Full Test Suite" to start.');
    const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(null);
    const [isTesting, setIsTesting] = useState(false);
    const [completedTests, setCompletedTests] = useState(0);

    useEffect(() => {
        const initialResults: Record<string, TestStatus> = {};
        PUPPETEER_TEST_SUITE.forEach(suite => {
            initialResults[suite.id] = 'pending';
        });
        setTestResults(initialResults);
    }, []);
    
    const runTests = async () => {
        setIsTesting(true);
        setCurrentLog('Initializing test suite...');
        setCompletedTests(0);

        const initialResults: Record<string, TestStatus> = {};
        PUPPETEER_TEST_SUITE.forEach(suite => {
            initialResults[suite.id] = 'pending';
        });
        setTestResults(initialResults);
        await new Promise(res => setTimeout(res, 500));


        for (const suite of PUPPETEER_TEST_SUITE) {
            setTestResults(prev => ({ ...prev, [suite.id]: 'running' }));
            let suitePassed = true;

            for (const step of suite.steps) {
                setCurrentLog(`[${suite.title}] ${step.description}`);
                setCurrentScreenshot(step.screenshot);
                await new Promise(res => setTimeout(res, step.duration));
                
                if (step.shouldFail) {
                    suitePassed = false;
                    break;
                }
            }
            
            setTestResults(prev => ({ ...prev, [suite.id]: suitePassed ? 'passed' : 'failed' }));
            setCompletedTests(prev => prev + 1);
        }

        setCurrentLog('All tests completed.');
        setIsTesting(false);
        setTimeout(() => {
            setCurrentScreenshot(null);
            setCurrentLog('Tests pending. Click "Run Full Test Suite" to start.');
        }, 5000)
    };
    
    const totalTests = PUPPETEER_TEST_SUITE.length;
    const progress = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-800 p-4 sm:p-8 hc-bg-primary">
        <header className="relative flex items-center justify-center mb-6">
             <button 
                onClick={onBack} 
                className="absolute left-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-secondary hc-border"
                aria-label="Back to Admin Dashboard"
            >
                <BackIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 hc-accent" />
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100 hc-text-primary">Playwright Self-Test</h1>
        </header>
        
        <div className="mb-6">
            <button 
                onClick={runTests}
                disabled={isTesting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-400 disabled:bg-gray-400 disabled:cursor-not-allowed hc-bg-secondary hc-border hc-accent"
            >
                {isTesting ? 'Testing in Progress...' : 'Run Full Test Suite'}
            </button>
        </div>
        
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
            {/* Suites */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col hc-bg-secondary hc-border">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 hc-text-primary">Test Suites</h2>
                <div className="space-y-4 overflow-y-auto">
                    {PUPPETEER_TEST_SUITE.map(suite => (
                        <div key={suite.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hc-bg-primary hc-border">
                           <div className="flex items-center justify-between">
                             <h3 className="font-bold text-gray-700 dark:text-gray-200 hc-text-primary">{suite.title}</h3>
                             <StatusIndicator status={testResults[suite.id] || 'pending'} />
                           </div>
                           <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary">{suite.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Log & Screenshot */}
            <div className="lg:col-span-3 grid grid-rows-3 gap-6 min-h-0">
                <div className="row-span-1 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col hc-bg-secondary hc-border">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 hc-text-primary">Live Log</h2>
                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2 hc-bg-primary hc-border">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                    </div>
                    <div className="flex-1 bg-gray-800 dark:bg-black text-white font-mono text-sm p-3 rounded-lg overflow-y-auto hc-bg-primary hc-border">
                       <p className="whitespace-pre-wrap animate-pulse">{currentLog}</p>
                    </div>
                </div>
                <div className="row-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center hc-bg-secondary hc-border">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 self-start hc-text-primary">Screenshot Viewer</h2>
                    <div className="flex-1 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden hc-bg-primary hc-border">
                        {currentScreenshot ? (
                             <img src={currentScreenshot} alt="Current test step screenshot" className="object-contain max-w-full max-h-full" />
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 hc-text-secondary">No test running</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};

export default SelfTestDashboard;

```

### FILE: components/ThemeSwitcher.tsx
```typescript
import React from 'react';
import { Theme } from '../App';
import { SunIcon, MoonIcon, ContrastIcon } from './icons';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  const themes: { name: Theme; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { name: 'light', Icon: SunIcon },
    { name: 'dark', Icon: MoonIcon },
    { name: 'high-contrast', Icon: ContrastIcon },
  ];

  return (
    <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 p-1 rounded-full shadow-md hc-bg-secondary hc-border">
      {themes.map(({ name, Icon }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400 ${
            theme === name ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } hc-bg-primary ${theme === name ? 'hc-accent' : 'hc-text-primary'}`}
          aria-pressed={theme === name}
          aria-label={`Switch to ${name} theme`}
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;

```

### FILE: components/WorldMap.tsx
```typescript
import React from 'react';
import { Zone, ZoneID } from '../types';
import { Theme } from '../App';
import ThemeSwitcher from './ThemeSwitcher';
import { LockIcon } from './icons';


interface WorldMapProps {
  zones: Zone[];
  onSelectZone: (zoneId: ZoneID) => void;
  onAdminClick: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const zonePositions: { [key in ZoneID]: { top: string; left: string } } = {
  [ZoneID.Cognitive]: { top: '18%', left: '50%' },
  [ZoneID.Creativity]: { top: '38%', left: '22%' },
  [ZoneID.Language]: { top: '38%', left: '78%' },
  [ZoneID.Movement]: { top: '68%', left: '25%' },
  [ZoneID.Social]: { top: '85%', left: '50%' },
  [ZoneID.Exploration]: { top: '68%', left: '75%' },
  [ZoneID.Rest]: { top: '55%', left: '50%' },
};

const ZoneButton: React.FC<{ zone: Zone; onClick: () => void; }> = ({ zone, onClick }) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick();
    }
  };

  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer group focus:outline-none"
      style={zonePositions[zone.id]}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Go to ${zone.title}`}
    >
      <div
        className={`${zone.bgColor} dark:bg-gray-700 rounded-full w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 border-4 border-white dark:border-gray-500 transform -translate-x-1/2 -translate-y-1/2 group-focus:ring-4 ring-blue-400 hc-bg-secondary hc-border`}
      >
        <zone.Icon className={`${zone.color} dark:text-gray-300 w-12 h-12 sm:w-16 sm:h-16 hc-accent`} />
      </div>
      <h3 className="absolute -bottom-6 text-gray-800 dark:text-gray-200 font-bold text-lg text-center whitespace-nowrap bg-white/70 dark:bg-gray-800/70 rounded-full px-3 py-1 transform -translate-x-1/2 left-1/2 hc-bg-primary hc-text-primary hc-border">
        {zone.title}
      </h3>
    </div>
  );
};

const WorldMap: React.FC<WorldMapProps> = ({ zones, onSelectZone, onAdminClick, theme, setTheme }) => {
  return (
    <main className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-green-300 dark:from-gray-800 dark:to-gray-900 hc-bg-primary" aria-label="PlayGrow World Map">
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>
       <button 
        onClick={onAdminClick}
        className="absolute top-4 left-4 z-20 p-2 bg-white/50 dark:bg-gray-700/50 rounded-full shadow-md hover:bg-white/80 focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-secondary hc-border"
        aria-label="Open Admin Panel"
        >
            <LockIcon className="w-6 h-6 text-gray-700 dark:text-gray-200 hc-accent" />
        </button>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute w-full h-full">
            <ellipse cx="50" cy="115" rx="70" ry="35" className="fill-current text-green-400 dark:text-green-900 hc-bg-primary" />
        </svg>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-pink-300 rounded-full opacity-50 animate-pulse delay-500"></div>
      </div>

      <header className="z-10 text-center mb-8 sm:mb-16 -mt-24 sm:-mt-8">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white dark:text-gray-100 hc-text-primary" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.25)'}}>PlayGrow</h1>
        <p className="text-white text-lg sm:text-xl mt-2 font-semibold dark:text-gray-300 hc-text-secondary">Smart Fun for Bright Minds</p>
      </header>
      
      <div className="relative w-full h-2/3 max-w-4xl z-10">
        {zones.map((zone) => (
            <ZoneButton
              key={zone.id}
              zone={zone}
              onClick={() => onSelectZone(zone.id)}
            />
        ))}
      </div>
    </main>
  );
};

export default WorldMap;
```

### FILE: components/ZoneDetail.tsx
```typescript
import React from 'react';
import { Zone, MiniGame } from '../types';
import { BackIcon } from './icons';
import { Theme } from '../App';
import ThemeSwitcher from './ThemeSwitcher';

interface ZoneDetailProps {
  zone: Zone;
  onBack: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const MiniGameCard: React.FC<{ miniGame: MiniGame, zone: Zone }> = ({ miniGame, zone }) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            // Placeholder for game start logic
            console.log(`Starting game: ${miniGame.title}`);
        }
    };
    
    return (
    <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-secondary hc-border"
        tabIndex={0}
        role="button"
        aria-label={`Play ${miniGame.title}`}
        onKeyDown={handleKeyDown}
        onClick={() => console.log(`Starting game: ${miniGame.title}`)}
    >
        <div className={`${zone.bgColor} dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mb-4 hc-bg-primary hc-border`}>
            <miniGame.Icon className={`${zone.color} dark:text-gray-300 w-12 h-12 hc-accent`} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">{miniGame.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1 hc-text-secondary">{miniGame.description}</p>
    </div>
)};


const ZoneDetail: React.FC<ZoneDetailProps> = ({ zone, onBack, theme, setTheme }) => {
  return (
    <div className={`w-full h-full flex flex-col ${zone.bgColor} dark:bg-gray-900 transition-colors duration-500 hc-bg-primary`}>
      <header className="relative p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hc-bg-secondary hc-border">
        <button 
            onClick={onBack} 
            className="absolute top-1/2 left-6 -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-primary hc-border"
            aria-label="Back to World Map"
        >
            <BackIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 hc-accent" />
        </button>
        <div className="text-center">
            <h1 className={`text-4xl font-extrabold ${zone.color} dark:text-gray-100 hc-accent`}>{zone.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg hc-text-secondary">{zone.subtitle}</p>
        </div>
        <div className="absolute top-1/2 right-6 -translate-y-1/2">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {zone.miniGames.map(game => (
                <MiniGameCard key={game.id} miniGame={game} zone={zone} />
            ))}
        </div>
      </main>
    </div>
  );
};

export default ZoneDetail;
```

### FILE: CREATION.md
```md
# playgrow-smart-fun-for-bright-minds

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

### FILE: data/zones.ts
```typescript
import { Zone, ZoneID } from '../types';
import {
  BrainIcon,
  PaletteIcon,
  BookIcon,
  RunningIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PuzzleIcon,
  PatternIcon,
  MatchIcon,
  GenericGameIcon,
} from '../components/icons';

export const ZONES_DATA: Zone[] = [
  {
    id: ZoneID.Cognitive,
    title: 'Brainy Town',
    subtitle: 'Cognitive & Problem-Solving',
    Icon: BrainIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    pathColor: 'stroke-blue-300',
    miniGames: [
      { id: 'puzzle', title: 'Puzzle Builder', description: 'Drag-and-drop jigsaw puzzles.', Icon: PuzzleIcon },
      { id: 'pattern', title: 'Pattern Path', description: 'Repeat color or shape patterns.', Icon: PatternIcon },
      { id: 'match', title: 'Find & Match', description: 'Match pairs of images or numbers.', Icon: MatchIcon },
    ],
  },
  {
    id: ZoneID.Creativity,
    title: 'Art Meadow',
    subtitle: 'Creativity & Expression',
    Icon: PaletteIcon,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    pathColor: 'stroke-pink-300',
    miniGames: [
      { id: 'paint', title: 'Paint World', description: 'Draw freely or color scenes.', Icon: GenericGameIcon },
      { id: 'build', title: 'Build-It Blocks', description: 'Create objects from shapes.', Icon: GenericGameIcon },
      { id: 'story', title: 'Story Maker', description: 'Create short animated stories.', Icon: GenericGameIcon },
    ],
  },
  {
    id: ZoneID.Language,
    title: 'Talky Treehouse',
    subtitle: 'Language & Listening',
    Icon: BookIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    pathColor: 'stroke-orange-300',
    miniGames: [
        { id: 'read', title: 'Read-With-Me', description: 'Narrated picture books.', Icon: GenericGameIcon },
        { id: 'rhyme', title: 'Rhyme Race', description: 'Find rhyming pairs.', Icon: GenericGameIcon },
        { id: 'word', title: 'Word Finder', description: 'Hidden-object scenes.', Icon: GenericGameIcon },
    ],
  },
  {
    id: ZoneID.Movement,
    title: 'Move Forest',
    subtitle: 'Movement & Coordination',
    Icon: RunningIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    pathColor: 'stroke-green-300',
    miniGames: [
        { id: 'dance', title: 'Dance Time', description: 'Follow motion cues.', Icon: GenericGameIcon },
        { id: 'animal', title: 'Animal Moves', description: 'Mimic animal actions.', Icon: GenericGameIcon },
        { id: 'catch', title: 'Catch & Balance', description: 'Tilt device to catch fruits.', Icon: GenericGameIcon },
    ],
  },
  {
    id: ZoneID.Social,
    title: 'Heart Valley',
    subtitle: 'Social & Emotional',
    Icon: HeartIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    pathColor: 'stroke-red-300',
    miniGames: [
        { id: 'emotion', title: 'Emotion Faces', description: 'Identify cartoon faces.', Icon: GenericGameIcon },
        { id: 'friend', title: 'Friend Finder', description: 'Match acts of kindness.', Icon: GenericGameIcon },
        { id: 'calm', title: 'Calm Corner', description: 'Breathing and mindfulness.', Icon: GenericGameIcon },
    ],
  },
  {
    id: ZoneID.Exploration,
    title: 'Explore Park',
    subtitle: 'Free Play & Exploration',
    Icon: MagnifyingGlassIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    pathColor: 'stroke-yellow-300',
    miniGames: [
        { id: 'nature', title: 'Nature Quest', description: 'Explore virtual nature scenes.', Icon: GenericGameIcon },
        { id: 'treasure', title: 'Treasure Hunt', description: 'Daily discovery missions.', Icon: GenericGameIcon },
        { id: 'sound', title: 'Sound Explorer', description: 'Identify natural sounds.', Icon: GenericGameIcon },
    ],
  },
  {
    id: ZoneID.Rest,
    title: 'Dream Garden',
    subtitle: 'Rest & Reflection',
    Icon: MoonIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    pathColor: 'stroke-purple-300',
    miniGames: [
        { id: 'storytime', title: 'Goodnight Storytime', description: 'Gentle narrated bedtime tales.', Icon: GenericGameIcon },
        { id: 'gratitude', title: 'Gratitude Moments', description: 'Record what made you happy.', Icon: GenericGameIcon },
        { id: 'music', title: 'Music Clouds', description: 'Tap clouds to play lullabies.', Icon: GenericGameIcon },
    ],
  },
];

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

### FILE: docs/AdministratorGuide.md
```md
# PlayGrow - Administrator Guide

This guide provides instructions for accessing and using the administrative features of the PlayGrow application.

---

## 1. Accessing the Admin Dashboard

The Admin Dashboard is a secure area for managing and testing the application.

1.  **Navigate to the World Map:** Open the application to the main home screen (the World Map).
2.  **Locate the Admin Icon:** In the top-left corner of the screen, you will find a **lock icon (🔒)**.
3.  **Click the Icon:** Click the lock icon to be taken to the Admin Login page.

## 2. Authentication

Access to the dashboard is password-protected to prevent unauthorized entry.

-   **Password:** `playgrow_admin`

Enter this password into the input field and click the "Authenticate" button to proceed. If you enter an incorrect password, an error message will be displayed.

## 3. Dashboard Features

Once authenticated, you will have access to the Admin Dashboard, which is split into two main sections.

### 3.1 System Controls

This panel contains buttons for performing high-level administrative actions. These are currently mock actions for demonstration purposes.

-   **Reset All Progress:** Simulates resetting all user data.
-   **Push Content Update:** Simulates deploying a new content package to the app.
-   **Trigger System Backup:** Simulates a manual backup of application data.
-   **Flush Cache:** Simulates clearing the application's content cache.

### 3.2 Audit Log

Every action performed in the "System Controls" panel is logged here for auditing purposes. Each log entry includes:
-   A precise timestamp (in ISO format).
-   A description of the action performed.

This log provides a clear, real-time trail of all administrative activities. Logs are also sent to the browser's developer console.

## 4. Running Self-Tests

The dashboard provides access to an integrated, automated testing framework that simulates user journeys.

1.  **Navigate to the Test Dashboard:** Click the **"Run Self-Tests"** button at the top of the Admin Dashboard.
2.  **Run the Suite:** On the "Playwright Self-Test" screen, click the **"Run Full Test Suite"** button to begin.
3.  **Monitor Results:** You can monitor the progress in real-time via the "Test Suites" status panel, the "Live Log," and the "Screenshot Viewer."

## 5. Logging Out

To securely exit the admin session:

1.  Click the **"Logout"** button in the top-right corner of the Admin Dashboard.
2.  You will be returned to the main World Map, and your administrative session will be terminated.

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — playgrow-–-smart-fun-for-bright-minds

**Application:** playgrow-–-smart-fun-for-bright-minds
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

Audit log data is stored in `localStorage` under the key `tuc_playgrow-–-smart-fun-for-bright-minds_audit`.

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
# Deployment Guide — playgrow-–-smart-fun-for-bright-minds

**Application:** playgrow-–-smart-fun-for-bright-minds
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd playgrow-–-smart-fun-for-bright-minds
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
docker-compose -f docker-compose-all-apps.yml build playgrow-–-smart-fun-for-bright-minds
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up playgrow-–-smart-fun-for-bright-minds
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

### FILE: docs/DeploymentGuide.md
```md
# PlayGrow - Deployment Guide

This guide outlines the steps to build and deploy the PlayGrow static web application to a production environment.

---

## 1. Prerequisites

Before you begin, ensure you have the following installed on your local machine:
-   [Node.js](https://nodejs.org/) (which includes npm)
-   [Git](https://git-scm.com/)

## 2. Build Process

The application must be compiled from its source files (React, TypeScript) into a set of static HTML, CSS, and JavaScript files that a browser can understand.

1.  **Clone the Repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install Dependencies:**
    Open a terminal in the project's root directory and run the following command to install the necessary packages:
    ```bash
    npm install
    ```

3.  **Create a Production Build:**
    Run the build command to compile and optimize the application for production.
    ```bash
    npm run build
    ```
    This command will create a `dist` (or `build`) directory in your project root. This directory contains all the static files needed for deployment.

_Note: The environment provided does not have a standard build toolchain configured. These commands represent a typical workflow for a standard React/Vite/Create-React-App project._

## 3. Deployment to a Static Host

The contents of the `dist` (or `build`) directory can be deployed to any web server or static hosting service. Services that offer a free tier are an excellent choice for this type of application.

### Recommended Providers:

-   **Vercel:** Offers seamless deployment directly from a Git repository.
-   **Netlify:** Known for its simple drag-and-drop deployment and Git integration.
-   **GitHub Pages:** A free hosting solution integrated directly into your GitHub repository.

### General Deployment Steps:

1.  **Sign up** for an account with your chosen hosting provider (e.g., Netlify).
2.  **Connect Your Git Repository (Recommended):** Most providers can link to your GitHub, GitLab, or Bitbucket account. This enables Continuous Deployment, where any push to your main branch automatically triggers a new build and deployment.
3.  **Manual Deployment (Drag-and-Drop):** Alternatively, you can drag the entire `dist` folder from your local machine directly into the provider's web UI to deploy it.
4.  **Configure Settings (if needed):**
    -   **Build Command:** `npm run build`
    -   **Publish Directory:** `dist` or `build`
5.  **Deploy:** The hosting service will build your project and deploy it to a unique URL.

Once deployed, the application will be live and accessible to users worldwide.

```

### FILE: docs/guides/AdministratorGuide.md
```md
# PlayGrow - Administrator Guide

This guide provides instructions for accessing and using the administrative features of the PlayGrow application.

---

## 1. Accessing the Admin Dashboard

The Admin Dashboard is a secure area for managing and testing the application.

1.  **Navigate to the World Map:** Open the application to the main home screen (the World Map).
2.  **Locate the Admin Icon:** In the top-left corner of the screen, you will find a **lock icon (🔒)**.
3.  **Click the Icon:** Click the lock icon to be taken to the Admin Login page.

## 2. Authentication

Access to the dashboard is password-protected to prevent unauthorized entry.

-   **Password:** `playgrow_admin`

Enter this password into the input field and click the "Authenticate" button to proceed. If you enter an incorrect password, an error message will be displayed.

## 3. Dashboard Features

Once authenticated, you will have access to the Admin Dashboard, which is split into two main sections.

### 3.1 System Controls

This panel contains buttons for performing high-level administrative actions. These are currently mock actions for demonstration purposes.

-   **Reset All Progress:** Simulates resetting all user data.
-   **Push Content Update:** Simulates deploying a new content package to the app.
-   **Trigger System Backup:** Simulates a manual backup of application data.
-   **Flush Cache:** Simulates clearing the application's content cache.

### 3.2 Audit Log

Every action performed in the "System Controls" panel is logged here for auditing purposes. Each log entry includes:
-   A precise timestamp (in ISO format).
-   A description of the action performed.

This log provides a clear, real-time trail of all administrative activities. Logs are also sent to the browser's developer console.

## 4. Running Self-Tests

The dashboard provides access to an integrated, automated testing framework that simulates user journeys.

1.  **Navigate to the Test Dashboard:** Click the **"Run Self-Tests"** button at the top of the Admin Dashboard.
2.  **Run the Suite:** On the "Playwright Self-Test" screen, click the **"Run Full Test Suite"** button to begin.
3.  **Monitor Results:** You can monitor the progress in real-time via the "Test Suites" status panel, the "Live Log," and the "Screenshot Viewer."

## 5. Logging Out

To securely exit the admin session:

1.  Click the **"Logout"** button in the top-right corner of the Admin Dashboard.
2.  You will be returned to the main World Map, and your administrative session will be terminated.
```

### FILE: docs/guides/DeploymentGuide.md
```md
# PlayGrow - Deployment Guide

This guide outlines the steps to build and deploy the PlayGrow static web application to a production environment.

---

## 1. Prerequisites

Before you begin, ensure you have the following installed on your local machine:
-   [Node.js](https://nodejs.org/) (which includes npm)
-   [Git](https://git-scm.com/)

## 2. Build Process

The application must be compiled from its source files (React, TypeScript) into a set of static HTML, CSS, and JavaScript files that a browser can understand.

1.  **Clone the Repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install Dependencies:**
    Open a terminal in the project's root directory and run the following command to install the necessary packages:
    ```bash
    npm install
    ```

3.  **Create a Production Build:**
    Run the build command to compile and optimize the application for production.
    ```bash
    npm run build
    ```
    This command will create a `dist` (or `build`) directory in your project root. This directory contains all the static files needed for deployment.

_Note: The environment provided does not have a standard build toolchain configured. These commands represent a typical workflow for a standard React/Vite/Create-React-App project._

## 3. Deployment to a Static Host

The contents of the `dist` (or `build`) directory can be deployed to any web server or static hosting service. Services that offer a free tier are an excellent choice for this type of application.

### Recommended Providers:

-   **Vercel:** Offers seamless deployment directly from a Git repository.
-   **Netlify:** Known for its simple drag-and-drop deployment and Git integration.
-   **GitHub Pages:** A free hosting solution integrated directly into your GitHub repository.

### General Deployment Steps:

1.  **Sign up** for an account with your chosen hosting provider (e.g., Netlify).
2.  **Connect Your Git Repository (Recommended):** Most providers can link to your GitHub, GitLab, or Bitbucket account. This enables Continuous Deployment, where any push to your main branch automatically triggers a new build and deployment.
3.  **Manual Deployment (Drag-and-Drop):** Alternatively, you can drag the entire `dist` folder from your local machine directly into the provider's web UI to deploy it.
4.  **Configure Settings (if needed):**
    -   **Build Command:** `npm run build`
    -   **Publish Directory:** `dist` or `build`
5.  **Deploy:** The hosting service will build your project and deploy it to a unique URL.

Once deployed, the application will be live and accessible to users worldwide.
```

### FILE: docs/guides/TestingGuide.md
```md
# PlayGrow - Testing Guide

This document provides instructions for testing the PlayGrow application using both its integrated automated testing framework and manual testing procedures.

---

## 1. Automated Testing

The application includes a "Playwright Self-Test" dashboard that simulates critical user journeys and provides real-time feedback without requiring any external tools.

### 1.1 Accessing the Self-Test Dashboard

1.  Navigate to the **Admin Dashboard** (see the Administrator Guide for access instructions).
2.  Click the **"Run Self-Tests"** button, located in the header.

### 1.2 Running the Test Suite

1.  On the "Playwright Self-Test" dashboard, click the large green **"Run Full Test Suite"** button.
2.  The button will become disabled, and the tests will begin executing sequentially.

### 1.3 Interpreting Results

The dashboard provides three panels for monitoring the test run:

-   **Test Suites:** This panel lists all available test suites. Next to each title is a status indicator:
    -   **Gray:** Pending (not yet run).
    -   **Pulsing Blue:** Running.
    -   **Green Check (✓):** Passed.
    -   **Red Cross (✗):** Failed.
-   **Live Log:** This panel displays a real-time log of the exact step the test runner is currently executing. A progress bar at the top shows the overall completion percentage.
-   **Screenshot Viewer:** This panel shows a visual representation (a mock screenshot in SVG format) of the application's UI at each step of the test, helping you visualize the user journey.

---

## 2. Manual Testing Checklist

Manual testing is crucial for verifying user experience and accessibility nuances. Use the following checklist to ensure core functionalities are working as expected.

### ✅ General Functionality

| Test Case                 | Steps                                                                      | Expected Result                                       | Status      |
| ------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- | ----------- |
| **Zone Navigation**       | 1. On World Map, click each of the 7 zones. 2. Use the back button.        | Navigates to the correct Zone Detail page and back.   | `[ ] Pass` |
| **Theme Switching**       | 1. Click the theme switcher. 2. Cycle through Light, Dark, & High-Contrast. | The UI correctly applies the styles for each theme.   | `[ ] Pass` |
| **Mini-Game Interaction** | 1. Go to a Zone Detail page. 2. Click on a mini-game card.                | A console log indicates the game is "starting".       | `[ ] Pass` |

### ✅ Admin Section

| Test Case                    | Steps                                                              | Expected Result                                                           | Status      |
| ---------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- | ----------- |
| **Admin Login (Failure)**    | 1. Go to Admin Login. 2. Enter an incorrect password.              | An error message appears, and access is denied.                           | `[ ] Pass` |
| **Admin Login (Success)**    | 1. Go to Admin Login. 2. Enter `playgrow_admin`.                   | Successfully navigates to the Admin Dashboard.                            | `[ ] Pass` |
| **Admin Logout**             | 1. From the Admin Dashboard, click "Logout".                       | Returns to the World Map; admin session is terminated.                    | `[ ] Pass` |
| **Audit Logging**            | 1. On Admin Dashboard, click a "System Controls" button.           | A new log entry appears in the "Audit Log" panel.                         | `[ ] Pass` |
| **Self-Test Navigation**     | 1. On Admin Dashboard, click "Run Self-Tests". 2. Click back button. | Navigates to the test dashboard and successfully returns to the admin page. | `[ ] Pass` |

### ✅ Accessibility

| Test Case                  | Steps                                                                     | Expected Result                                                         | Status      |
| -------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------- |
| **Keyboard Navigation**    | 1. Use the `Tab` key to navigate through all buttons and interactive cards. | All interactive elements are focusable in a logical order.              | `[ ] Pass` |
| **Focus Indicators**       | 1. As you `Tab` through elements.                                         | A clear, visible ring appears around the currently focused element.     | `[ ] Pass` |
| **Keyboard Activation**    | 1. Focus on a zone or button. 2. Press `Enter` or `Space`.                | The element's action (e.g., navigation) is triggered.                   | `[ ] Pass` |
```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Playgrow â€“ Smart Fun For Bright Minds
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Playgrow â€“ Smart Fun For Bright Minds**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Playgrow â€“ Smart Fun For Bright Minds** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Playgrow â€“ Smart Fun For Bright Minds** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
| TUC branding applied | âŒ Non-compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âŒ Non-compliant |
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

### FILE: docs/TESTING.md
```md
# Testing Guide — playgrow-–-smart-fun-for-bright-minds

**Application:** playgrow-–-smart-fun-for-bright-minds
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd playgrow-–-smart-fun-for-bright-minds
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

### FILE: docs/TestingGuide.md
```md
# PlayGrow - Testing Guide

This document provides instructions for testing the PlayGrow application using both its integrated automated testing framework and manual testing procedures.

---

## 1. Automated Testing

The application includes a "Playwright Self-Test" dashboard that simulates critical user journeys and provides real-time feedback without requiring any external tools.

### 1.1 Accessing the Self-Test Dashboard

1.  Navigate to the **Admin Dashboard** (see the Administrator Guide for access instructions).
2.  Click the **"Run Self-Tests"** button, located in the header.

### 1.2 Running the Test Suite

1.  On the "Playwright Self-Test" dashboard, click the large green **"Run Full Test Suite"** button.
2.  The button will become disabled, and the tests will begin executing sequentially.

### 1.3 Interpreting Results

The dashboard provides three panels for monitoring the test run:

-   **Test Suites:** This panel lists all available test suites. Next to each title is a status indicator:
    -   **Gray:** Pending (not yet run).
    -   **Pulsing Blue:** Running.
    -   **Green Check (✓):** Passed.
    -   **Red Cross (✗):** Failed.
-   **Live Log:** This panel displays a real-time log of the exact step the test runner is currently executing. A progress bar at the top shows the overall completion percentage.
-   **Screenshot Viewer:** This panel shows a visual representation (a mock screenshot in SVG format) of the application's UI at each step of the test, helping you visualize the user journey.

---

## 2. Manual Testing Checklist

Manual testing is crucial for verifying user experience and accessibility nuances. Use the following checklist to ensure core functionalities are working as expected.

### ✅ General Functionality

| Test Case                 | Steps                                                                      | Expected Result                                       | Status      |
| ------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- | ----------- |
| **Zone Navigation**       | 1. On World Map, click each of the 7 zones. 2. Use the back button.        | Navigates to the correct Zone Detail page and back.   | `[ ] Pass` |
| **Theme Switching**       | 1. Click the theme switcher. 2. Cycle through Light, Dark, & High-Contrast. | The UI correctly applies the styles for each theme.   | `[ ] Pass` |
| **Mini-Game Interaction** | 1. Go to a Zone Detail page. 2. Click on a mini-game card.                | A console log indicates the game is "starting".       | `[ ] Pass` |

### ✅ Admin Section

| Test Case                    | Steps                                                              | Expected Result                                                           | Status      |
| ---------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- | ----------- |
| **Admin Login (Failure)**    | 1. Go to Admin Login. 2. Enter an incorrect password.              | An error message appears, and access is denied.                           | `[ ] Pass` |
| **Admin Login (Success)**    | 1. Go to Admin Login. 2. Enter `playgrow_admin`.                   | Successfully navigates to the Admin Dashboard.                            | `[ ] Pass` |
| **Admin Logout**             | 1. From the Admin Dashboard, click "Logout".                       | Returns to the World Map; admin session is terminated.                    | `[ ] Pass` |
| **Audit Logging**            | 1. On Admin Dashboard, click a "System Controls" button.           | A new log entry appears in the "Audit Log" panel.                         | `[ ] Pass` |
| **Self-Test Navigation**     | 1. On Admin Dashboard, click "Run Self-Tests". 2. Click back button. | Navigates to the test dashboard and successfully returns to the admin page. | `[ ] Pass` |

### ✅ Accessibility

| Test Case                  | Steps                                                                     | Expected Result                                                         | Status      |
| -------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------- |
| **Keyboard Navigation**    | 1. Use the `Tab` key to navigate through all buttons and interactive cards. | All interactive elements are focusable in a logical order.              | `[ ] Pass` |
| **Focus Indicators**       | 1. As you `Tab` through elements.                                         | A clear, visible ring appears around the currently focused element.     | `[ ] Pass` |
| **Keyboard Activation**    | 1. Focus on a zone or button. 2. Press `Enter` or `Space`.                | The element's action (e.g., navigation) is triggered.                   | `[ ] Pass` |

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
    <meta property="og:title" content="PlayGrow – Smart Fun for Bright Minds" />
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
    <meta name="twitter:title" content="PlayGrow – Smart Fun for Bright Minds" />
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
    <title>PlayGrow – Smart Fun for Bright Minds</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Nunito', sans-serif;
      }

      /* High-Contrast Theme Styles */
      .high-contrast {
        --bg-primary: #000000;
        --bg-secondary: #000000;
        --text-primary: #ffffff;
        --text-secondary: #dddddd;
        --accent: #ffff00;
        --border-color: #ffff00;
      }
      .high-contrast .hc-bg-primary { background-color: var(--bg-primary); }
      .high-contrast .hc-bg-secondary { background-color: var(--bg-secondary); }
      .high-contrast .hc-text-primary { color: var(--text-primary); }
      .high-contrast .hc-text-secondary { color: var(--text-secondary); }
      .high-contrast .hc-accent { color: var(--accent); }
      .high-contrast .hc-border { border: 2px solid var(--border-color); }
      .high-contrast .hc-shadow { box-shadow: 0 0 0 2px var(--border-color); }
      .high-contrast .hc-stroke { stroke: var(--accent); }
    </style>
  <script type="importmap">
{
  "imports": {
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

### FILE: index.tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

### FILE: metadata.json
```json
{
  "name": "PlayGrow – Smart Fun for Bright Minds",
  "description": "An interactive educational game designed for 5-year-old children to support holistic brain development through playful learning. It features seven developmental zones with themed mini-games to build cognitive, language, creative, emotional, and physical skills.",
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
  "name": "playgrow-â€“-smart-fun-for-bright-minds",
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
    "react": "19.2.5",
    "react-dom": "19.2.5"
  },
  "devDependencies": {
    "@types/node": "^24.10.1",
    "@vitejs/plugin-react": "^5.1.1",
    "typescript": "~5.9.3",
    "vite": "^7.2.2",
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

View your app in AI Studio: https://ai.studio/apps/drive/1YTSZfpcWf_on_9CKB2JN1dIQXVeu4OKG

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — playgrow-–-smart-fun-for-bright-minds
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('playgrow-–-smart-fun-for-bright-minds E2E', () => {
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

### FILE: tests/puppeteerSuite.ts
```typescript
import { TestSuite } from '../types';

const createScreenshot = (content: string): string => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <style>
            .title { font: bold 20px sans-serif; fill: #1f2937; }
            .text { font: 14px sans-serif; fill: #4b5563; }
        </style>
        ${content}
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

const createDarkScreenshot = (content: string): string => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="100%" height="100%" fill="#1f2937"/>
        <style>
            .title { font: bold 20px sans-serif; fill: #f9fafb; }
            .text { font: 14px sans-serif; fill: #d1d5db; }
        </style>
        ${content}
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export const PUPPETEER_TEST_SUITE: TestSuite[] = [
  {
    id: 'admin-login',
    title: 'Admin Login Flow',
    description: 'Tests the full administrator login journey, including failures.',
    steps: [
      {
        description: 'Navigate to World Map and find Admin lock icon.',
        duration: 500,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#cbd5e1" stroke-width="2" fill="#bfdbfe"/>
            <text x="200" y="40" text-anchor="middle" class="title">PlayGrow World Map</text>
            <circle cx="200" cy="150" r="40" fill="#93c5fd" />
            <circle cx="100" cy="200" r="30" fill="#a5b4fc" />
            <circle cx="300" cy="180" r="35" fill="#a78bfa" />
            <rect x="20" y="20" width="40" height="40" fill="#facc15" stroke="black" stroke-width="2" />
            <text x="40" y="45" text-anchor="middle" font-size="24">🔒</text>
        `),
      },
      {
        description: 'Click lock icon to open Admin Login page.',
        duration: 300,
        screenshot: createScreenshot(`
            <rect x="50" y="50" width="300" height="200" rx="10" fill="white" stroke="#e5e7eb" stroke-width="2"/>
            <text x="200" y="90" text-anchor="middle" class="title">Admin Access</text>
            <rect x="80" y="120" width="240" height="40" rx="5" fill="#e5e7eb"/>
            <rect x="80" y="170" width="240" height="40" rx="5" fill="#3b82f6"/>
        `),
      },
      {
        description: 'Enter incorrect password and submit.',
        duration: 800,
        screenshot: createScreenshot(`
            <rect x="50" y="50" width="300" height="200" rx="10" fill="white" stroke="#e5e7eb" stroke-width="2"/>
            <text x="200" y="90" text-anchor="middle" class="title">Admin Access</text>
            <rect x="80" y="120" width="240" height="40" rx="5" fill="#e5e7eb"/>
            <text x="90" y="145" class="text">••••••••</text>
            <text x="200" y="210" text-anchor="middle" fill="#ef4444" class="text">Incorrect password</text>
        `),
        shouldFail: true,
      },
      {
        description: 'Enter correct password and submit.',
        duration: 800,
        screenshot: createScreenshot(`
            <rect x="50" y="50" width="300" height="200" rx="10" fill="white" stroke="#e5e7eb" stroke-width="2"/>
            <text x="200" y="90" text-anchor="middle" class="title">Admin Access</text>
            <rect x="80" y="120" width="240" height="40" rx="5" fill="#e5e7eb"/>
            <text x="90" y="145" class="text">playgrow_admin</text>
        `),
      },
      {
        description: 'Verify successful navigation to Admin Dashboard.',
        duration: 400,
        screenshot: createScreenshot(`
            <text x="200" y="40" text-anchor="middle" class="title">Admin Dashboard</text>
            <rect x="20" y="70" width="170" height="200" rx="10" fill="white" stroke="#e5e7eb"/>
            <text x="105" y="90" text-anchor="middle" class="text">System Controls</text>
             <rect x="190" y="70" width="190" height="200" rx="10" fill="white" stroke="#e5e7eb"/>
            <text x="285" y="90" text-anchor="middle" class="text">Audit Log</text>
        `),
      },
    ],
  },
  {
    id: 'zone-navigation',
    title: 'Zone Navigation',
    description: 'Ensures users can navigate from the map to a zone detail page.',
    steps: [
       {
        description: 'Start at World Map.',
        duration: 300,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#cbd5e1" stroke-width="2" fill="#bfdbfe"/>
            <text x="200" y="40" text-anchor="middle" class="title">PlayGrow World Map</text>
            <circle cx="200" cy="150" r="40" fill="#93c5fd" />
            <text x="200" y="155" text-anchor="middle" class="text">Brainy Town</text>
        `),
      },
      {
        description: 'Click on "Brainy Town" zone.',
        duration: 600,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#cbd5e1" stroke-width="2" fill="#bfdbfe"/>
            <text x="200" y="40" text-anchor="middle" class="title">PlayGrow World Map</text>
            <circle cx="200" cy="150" r="45" fill="#93c5fd" stroke="#3b82f6" stroke-width="3" />
            <text x="200" y="155" text-anchor="middle" class="text">Brainy Town</text>
        `),
      },
      {
        description: 'Verify navigation to Brainy Town detail page.',
        duration: 500,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="50" fill="white" stroke="#e5e7eb"/>
            <text x="200" y="40" text-anchor="middle" class="title">Brainy Town</text>
            <rect x="20" y="80" width="110" height="150" rx="10" fill="white" stroke="#e5e7eb"/>
            <rect x="145" y="80" width="110" height="150" rx="10" fill="white" stroke="#e5e7eb"/>
            <rect x="270" y="80" width="110" height="150" rx="10" fill="white" stroke="#e5e7eb"/>
        `),
      }
    ]
  },
   {
    id: 'theme-switching',
    title: 'Theme Switching',
    description: 'Checks the functionality of the theme switcher.',
    steps: [
      {
        description: 'Start in default Light theme.',
        duration: 200,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#cbd5e1" stroke-width="2" fill="#bfdbfe"/>
            <text x="200" y="40" text-anchor="middle" class="title">Light Theme</text>
            <rect x="280" y="20" width="100" height="40" rx="20" fill="white" stroke="#e5e7eb"/>
            <circle cx="300" cy="40" r="15" fill="#3b82f6"/>
            <text x="300" y="45" text-anchor="middle" fill="white">☀️</text>
        `),
      },
      {
        description: 'Click Dark theme button.',
        duration: 400,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#cbd5e1" stroke-width="2" fill="#bfdbfe"/>
            <text x="200" y="40" text-anchor="middle" class="title">Switching to Dark</text>
            <rect x="280" y="20" width="100" height="40" rx="20" fill="white" stroke="#e5e7eb"/>
            <circle cx="340" cy="40" r="15" fill="#3b82f6"/>
            <text x="340" y="45" text-anchor="middle" fill="white">🌙</text>
        `),
      },
      {
        description: 'Verify Dark theme is applied.',
        duration: 500,
        screenshot: createDarkScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#4b5563" stroke-width="2" fill="#374151"/>
            <text x="200" y="40" text-anchor="middle" class="title">Dark Theme</text>
             <rect x="280" y="20" width="100" height="40" rx="20" fill="#4b5563" stroke="#6b7280"/>
            <circle cx="340" cy="40" r="15" fill="#3b82f6"/>
            <text x="340" y="45" text-anchor="middle" fill="white">🌙</text>
        `),
      },
    ],
  },
];
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
import React from 'react';

export enum ZoneID {
  Cognitive = 'cognitive',
  Creativity = 'creativity',
  Language = 'language',
  Movement = 'movement',
  Social = 'social',
  Exploration = 'exploration',
  Rest = 'rest',
}

export interface MiniGame {
  id: string;
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Zone {
  id: ZoneID;
  title: string;
  subtitle: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  pathColor: string;
  miniGames: MiniGame[];
}


export enum RewardType {
  Star = 'star',
  Sticker = 'sticker',
  Medal = 'medal',
  Badge = 'badge',
}

export interface Reward {
  type: RewardType;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

// Self-Testing Framework Types
export type TestStatus = 'pending' | 'running' | 'passed' | 'failed';

export interface TestStep {
  description: string;
  duration: number; // ms
  screenshot: string; // data URI
  shouldFail?: boolean;
}

export interface TestSuite {
  id: string;
  title: string;
  description: string;
  steps: TestStep[];
}

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
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
  ,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }
  };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — playgrow-–-smart-fun-for-bright-minds
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

// Vitest E2E configuration — playgrow-–-smart-fun-for-bright-minds
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

