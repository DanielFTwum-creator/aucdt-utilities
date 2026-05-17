# fees-comparison-dashboard - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for fees-comparison-dashboard.

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

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript
import React, { useState } from 'react';
import FeesComparisonDashboard from './components/FeesComparisonDashboard';
import AdminPanel from './components/AdminPanel';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Theme } from './types';

const Header: React.FC<{ currentView: 'public' | 'admin', onViewChange: (v: 'public' | 'admin') => void }> = ({ currentView, onViewChange }) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-md ${
      theme === 'dark' 
        ? 'bg-gray-900/80 border-gray-700/50 text-white' 
        : 'bg-white/80 border-gray-200/50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => onViewChange('public')}
        >
          <div className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' ? 'bg-blue-900/30 group-hover:bg-blue-900/50' : 'bg-blue-50 group-hover:bg-blue-100'
          }`}>
            <svg 
              className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            EduData Ghana
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Selector */}
          <div className={`flex p-1 rounded-full border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
          }`}>
            {(['light', 'dark', 'high-contrast'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                  theme === t 
                    ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-300 scale-105' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                aria-label={`Switch to ${t} theme`}
              >
                {t === 'high-contrast' ? 'HC' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => onViewChange(currentView === 'public' ? 'admin' : 'public')}
            className={`text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600' 
                : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-200'
            }`}
          >
            {currentView === 'public' ? 'Admin Access' : 'Public Dashboard'}
          </button>
        </div>
      </div>
    </header>
  );
};

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'
    }`}>
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-fade-in-up">
          {currentView === 'public' ? <FeesComparisonDashboard /> : <AdminPanel />}
        </div>
      </main>

      <footer className={`border-t mt-auto transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-100 text-gray-500'
      }`}>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm font-medium">
            &copy; {new Date().getFullYear()} EduData Ghana.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0 text-sm">
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
```

### FILE: backend/.env.example
```text
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/fees_comparison_dashboard_db

# JWT Configuration
JWT_SECRET=[REDACTED_CREDENTIAL]
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

```

### FILE: backend/.gitignore
```text
node_modules/
dist/
.env
*.log
.DS_Store

```

### FILE: backend/package.json
```json
{
  "name": "Fees Comparison-backend",
  "version": "1.0.0",
  "description": "Backend API for Fees Comparison",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.4.1",
    "zod": "^3.22.4",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.11.5",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "vitest": "^1.2.1",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  }
}

```

### FILE: backend/README.md
```md
# Fees Comparison - Backend API

## Quick Start

```bash
pnpm install
cp .env.example .env
# Configure .env
pnpm dev
```

## API Endpoints

(To be documented)

## Database Schema

(To be defined in src/config/database.sql)

```

### FILE: backend/src/server.ts
```typescript
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Routes
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
// Import additional routes here

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
// Add additional routes here

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

```

### FILE: backend/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}

```

### FILE: components/AdminPanel.tsx
```typescript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const AdminPanel: React.FC = () => {
  const { isAuthenticated, login, logout, updatePassword, auditLogs } = useAuth();
  const { undergraduateData, updateFee } = useData();
  const { theme } = useTheme();
  
  const [passwordInput, setPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'logs' | 'data' | 'settings' | 'health'>('logs');

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border transition-all ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
            }`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Admin Portal</h2>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Secure authentication required to access this area.</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (!login(passwordInput)) setError('Incorrect password. Please try again.');
            else setError('');
          }}>
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 opacity-70">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-700 focus:ring-blue-500 focus:border-transparent' 
                    : 'bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-transparent'
                }`}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2 flex items-center"><span className="mr-1">⚠</span> {error}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 transform active:scale-95">
              Authenticate
            </button>
          </form>
          <p className="text-center text-xs mt-6 opacity-50">Authorized Personnel Only</p>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className={`rounded-3xl shadow-xl border overflow-hidden flex flex-col min-h-[800px] ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      {/* Admin Header */}
      <div className={`px-8 py-6 border-b flex justify-between items-center ${
         theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">A</div>
          <div>
            <h2 className="text-xl font-bold">Administrator</h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>● System Active</p>
          </div>
        </div>
        <button onClick={logout} className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
           theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'
        }`}>
          Sign Out
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar Nav */}
        <div className={`md:w-64 border-r flex flex-col ${
           theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'
        }`}>
          <nav className="p-4 space-y-2">
            {[
              { id: 'logs', label: 'Audit Logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'data', label: 'Data Management', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
              { id: 'settings', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
              { id: 'health', label: 'System Health', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-gray-500 hover:bg-gray-200/50 dark:hover:bg-gray-800'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 bg-opacity-50">
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="font-bold text-xl">System Audit Trail</h3>
                 <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Total Events: {auditLogs.length}</span>
              </div>
              <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className={`text-xs uppercase font-bold tracking-wider ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                      <tr>
                        <th className="px-6 py-4">Timestamp</th>
                        <th className="px-6 py-4">Event Type</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Initiator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {auditLogs.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No events recorded in this session.</td></tr>
                      ) : (
                        auditLogs.map(log => (
                          <tr key={log.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`}>
                            <td className="px-6 py-4 font-mono text-xs opacity-70">{new Date(log.timestamp).toLocaleTimeString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                log.action.includes('LOGIN') ? 'bg-green-100 text-green-800' : 
                                log.action.includes('UPDATE') ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{log.details}</td>
                            <td className="px-6 py-4 font-medium">{log.actor}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <h3 className="font-bold text-xl mb-6">Modify Undergraduate Fees</h3>
              <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="max-h-[600px] overflow-y-auto">
                   {undergraduateData.map((item, idx) => (
                    <div key={idx} className={`p-4 flex items-center justify-between border-b last:border-0 ${theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{item.name}</span>
                        <span className={`text-xs mt-1 inline-block w-fit px-2 py-0.5 rounded ${item.type === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Freshman Fees</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₵</span>
                          <input
                            type="number"
                            value={item.fees}
                            onChange={(e) => updateFee('undergraduate', idx, 'fees', Number(e.target.value))}
                            className={`w-32 pl-7 pr-3 py-2 text-sm rounded-lg border font-mono ${
                              theme === 'dark' 
                                ? 'bg-gray-800 border-gray-600 focus:ring-blue-500' 
                                : 'bg-white border-gray-300 focus:ring-blue-500'
                            } outline-none focus:ring-2 transition-all`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-xl">
              <h3 className="font-bold text-xl mb-6">Credential Management</h3>
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">New Admin Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                    placeholder="Enter new secure password"
                  />
                  <p className="text-xs text-gray-500 mt-2">Password will be active immediately for this session.</p>
                </div>
                <button
                  onClick={() => {
                    if(newPassword) {
                      updatePassword(newPassword);
                      setNewPassword('');
                      alert('Security credentials updated successfully.');
                    }
                  }}
                  disabled={!newPassword}
                  className={`px-6 py-3 rounded-xl font-semibold text-white transition-all ${
                    newPassword 
                      ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Update Credentials
                </button>
              </div>
            </div>
          )}

           {activeTab === 'health' && (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                 <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                   <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                 </div>
                 <h3 className="text-lg font-medium">System Diagnostics</h3>
                 <p className="text-gray-500 max-w-xs">Run self-test suite to verify application integrity and performance.</p>
                 {/* Placeholder for Phase 3 TestRunner component */}
                 <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium">Launch Diagnostics (Preview)</button>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
```

### FILE: components/FeesComparisonDashboard.tsx
```typescript
import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ViewType } from '../types';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const formatCurrency = (value: number): string => {
  return `GH₵${value.toLocaleString()}`;
};

const formatAxisCurrency = (value: number): string => {
  if (value >= 1000) {
    return `GH₵${(value / 1000).toFixed(0)}k`;
  }
  return `GH₵${value}`;
};

const FeesComparisonDashboard: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>('undergraduate');
  const { undergraduateData, internationalData, postgraduateData } = useData();
  const { theme } = useTheme();

  const dataToDisplay = useMemo(() => {
    switch (viewType) {
      case 'undergraduate': return undergraduateData;
      case 'international': return internationalData;
      case 'postgraduate': return postgraduateData;
      default: return undergraduateData;
    }
  }, [viewType, undergraduateData, internationalData, postgraduateData]);

  // Enhanced theme-aware colors with gradients
  const colors = useMemo(() => {
    if (theme === 'high-contrast') {
      return {
        text: '#000000',
        bar1: '#000000',
        bar2: '#555555',
        grid: '#000000',
        tooltipBg: '#ffffff',
        tooltipText: '#000000',
        cardBg: '#ffffff',
        borderColor: '#000000',
        accentGradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
        headerGradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
      };
    } else if (theme === 'dark') {
      return {
        text: '#9ca3af',
        bar1: '#3b82f6',
        bar2: '#10b981',
        grid: '#374151',
        tooltipBg: 'rgba(17, 24, 39, 0.98)',
        tooltipText: '#f3f4f6',
        cardBg: '#1e293b',
        borderColor: '#374151',
        accentGradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        headerGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
      };
    }
    return {
      text: '#64748b',
      bar1: '#2563eb',
      bar2: '#059669',
      grid: '#e2e8f0',
      tooltipBg: 'rgba(255, 255, 255, 0.98)',
      tooltipText: '#1e293b',
      cardBg: '#ffffff',
      borderColor: '#e2e8f0',
      accentGradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
      headerGradient: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)'
    };
  }, [theme]);

  // Fixed: Use any for tooltip props to avoid type errors with Recharts definitions
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="p-5 border-2 shadow-2xl rounded-2xl backdrop-blur-xl transform transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: colors.tooltipBg, 
            borderColor: colors.borderColor,
            color: colors.tooltipText,
            minWidth: '240px',
            boxShadow: theme === 'dark' 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
              : '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <p className="font-bold border-b-2 pb-3 mb-4 text-base tracking-tight" style={{ borderColor: colors.borderColor }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-3 group">
              <span className="text-sm font-semibold flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div 
                  className="w-3 h-3 rounded-full mr-3 shadow-md ring-2 ring-offset-2 transition-transform group-hover:scale-110" 
                  style={{ 
                    backgroundColor: entry.color,
                    '--tw-ring-color': entry.color,
                    '--tw-ring-offset-color': colors.tooltipBg
                  } as React.CSSProperties}
                ></div>
                {entry.name}
              </span>
              <span className="text-sm font-bold font-mono ml-4 transition-all group-hover:scale-105" style={{ color: entry.color }}>
                {formatCurrency(entry.value as number)}
              </span>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t-2 flex justify-between items-center" style={{ borderColor: colors.borderColor }}>
            <span className="text-xs uppercase tracking-widest font-bold opacity-50">Type</span>
            <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide border-2 shadow-sm transition-all hover:shadow-md ${
              data.type === 'public' 
                ? (theme === 'dark' ? 'bg-blue-900/50 text-blue-200 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200')
                : (theme === 'dark' ? 'bg-orange-900/50 text-orange-200 border-orange-700' : 'bg-orange-50 text-orange-700 border-orange-200')
            }`}>
              {data.type}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className={`rounded-[2rem] shadow-2xl overflow-hidden border-2 transition-all duration-500 hover:shadow-3xl ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 
        theme === 'high-contrast' ? 'bg-white border-black border-4' : 'bg-white border-gray-200'
      }`}>
        
        {/* Dashboard Header - Enhanced */}
        <div 
          className={`p-10 border-b-2 backdrop-blur-sm ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
          style={{ background: colors.headerGradient }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-12 rounded-full animate-pulse"
                  style={{ background: colors.accentGradient }}
                ></div>
                <h1 className={`text-4xl font-black tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Tuition Analysis
                </h1>
              </div>
              <div className="flex items-center gap-3 ml-5">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'bg-gray-700/70 text-gray-300' : 'bg-white/70 text-gray-600 shadow-sm'
                }`}>
                  2024-2025
                </div>
                <span className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Comparative Fee Structures
                </span>
              </div>
            </div>

            {/* Enhanced Segmented Control */}
            <div className={`flex p-2 rounded-2xl border-2 backdrop-blur-md shadow-lg ${
              theme === 'dark' ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              {[
                { id: 'undergraduate', label: 'Undergraduate', icon: '🎓' },
                { id: 'international', label: 'International', icon: '🌍' },
                { id: 'postgraduate', label: 'Postgraduate', icon: '📚' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewType(tab.id as ViewType)}
                  className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
                    viewType === tab.id
                      ? (theme === 'dark' 
                          ? 'bg-gray-700 text-white shadow-xl scale-105' 
                          : 'bg-white text-blue-700 shadow-xl ring-2 ring-blue-500/20')
                      : (theme === 'dark' 
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100')
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-10">
          {/* Chart Container - Enhanced */}
          <div className={`p-8 rounded-3xl border-2 mb-10 relative transition-all duration-300 hover:shadow-xl ${
            theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-inner'
          }`}>
            <div className="flex justify-between items-end mb-8 px-2">
              <div className="space-y-2">
                <h2 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                  Fee Distribution
                </h2>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Annual tuition cost per institution
                </p>
              </div>
              <div 
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-md ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 border-2 border-gray-200'
                }`}
              >
                💰 GH₵
              </div>
            </div>

            <div className="w-full h-[520px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataToDisplay}
                  margin={{ top: 20, right: 20, left: 0, bottom: 120 }}
                  barGap={8}
                >
                  <defs>
                    <linearGradient id="bar1Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors.bar1} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={colors.bar1} stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="bar2Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors.bar2} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={colors.bar2} stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="5 5" 
                    vertical={false} 
                    stroke={colors.grid}
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    interval={0}
                    tick={{ fontSize: 11, fill: colors.text, fontWeight: 600 }}
                    tickMargin={15}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatAxisCurrency}
                    tick={{ fontSize: 12, fill: colors.text, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip 
                    content={CustomTooltip} 
                    cursor={{ 
                      fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      radius: 8
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '30px', fontSize: '13px', fontWeight: 600 }} 
                    iconType="circle"
                    iconSize={12}
                  />
                  <Bar
                    dataKey="fees"
                    name="Freshman/Annual"
                    fill="url(#bar1Gradient)"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1800}
                    animationBegin={200}
                    maxBarSize={70}
                  />
                  {viewType === 'undergraduate' && (
                    <Bar
                      dataKey="continuing"
                      name="Continuing"
                      fill="url(#bar2Gradient)"
                      radius={[8, 8, 0, 0]}
                      animationDuration={1800}
                      animationBegin={400}
                      maxBarSize={70}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ),
            title: 'Sector Disparity',
            description: 'Private institutions like Academic City and Ashesi exhibit 5x-10x higher tuition fees compared to public counterparts due to funding models.',
            color: 'blue',
            gradient: 'from-blue-500 to-indigo-600'
          },
          {
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            ),
            title: 'Program Premiums',
            description: 'Specialized STEM programmes (Medicine, Engineering) and Law degrees consistently command the highest fees across both public and private sectors.',
            color: 'emerald',
            gradient: 'from-emerald-500 to-teal-600'
          },
          {
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            title: 'Intl. Variance',
            description: 'International student fees are pegged to USD, creating significant cost divergence based on exchange rates, with medical programmes reaching premium tiers.',
            color: 'purple',
            gradient: 'from-purple-500 to-pink-600'
          }
        ].map((card, index) => (
          <div 
            key={index}
            className={`group p-8 rounded-3xl border-2 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div 
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 text-white shadow-xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
            >
              {card.icon}
            </div>
            <h3 className={`font-black text-xl mb-4 tracking-tight ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {card.title}
            </h3>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {card.description}
            </p>
            <div className={`mt-6 pt-4 border-t transition-opacity opacity-0 group-hover:opacity-100 ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Key Insight
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Enhanced Footer Note */}
      <div className={`text-center py-6 px-8 rounded-2xl ${
        theme === 'dark' ? 'bg-gray-800/50 text-gray-500' : 'bg-gray-50/50 text-gray-400'
      }`}>
        <p className="text-xs font-semibold tracking-wide">
          📊 Data sourced from official 2024-2025 University Fee Schedules
        </p>
        <p className="text-xs font-medium mt-1 opacity-70">
          Last verified October 2023
        </p>
      </div>
    </div>
  );
};

export default FeesComparisonDashboard;
```

### FILE: contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useState } from 'react';
import { AuthState, AuditLog } from '../types';

interface AuthContextType extends AuthState {
  auditLogs: AuditLog[];
  logAction: (action: string, details: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('admin123'); // Default configurable password
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      action,
      details,
      actor: 'Admin'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = (inputPassword: string) => {
    if (inputPassword =[REDACTED_CREDENTIAL]
      setIsAuthenticated(true);
      logAction('LOGIN', 'Admin logged in successfully');
      return true;
    }
    logAction('LOGIN_FAILED', 'Invalid password attempt');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    logAction('LOGOUT', 'Admin logged out');
  };

  const updatePassword = [REDACTED_CREDENTIAL]
    setPassword(newPassword);
    logAction('SECURITY_UPDATE', 'Admin password changed');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, updatePassword, auditLogs, logAction }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

```

### FILE: contexts/DataContext.tsx
```typescript
import React, { createContext, useContext, useState } from 'react';
import { DataContextType, ViewType, UndergraduateFeeData, InternationalFeeData, PostgraduateFeeData } from '../types';
import { useAuth } from './AuthContext';

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Static Data
const initialUndergraduateData: UndergraduateFeeData[] = [
  { name: 'UG (Humanities)', fees: 2319, continuing: 1774, type: 'public' },
  { name: 'UG (Admin/Law)', fees: 2435, continuing: 1890, type: 'public' },
  { name: 'KNUST (Humanities)', fees: 1875, continuing: 1715, type: 'public' },
  { name: 'KNUST (Business)', fees: 2428, continuing: 2268, type: 'public' },
  { name: 'KNUST (Engineering)', fees: 3778, continuing: 2968, type: 'public' },
  { name: 'KNUST (Medicine)', fees: 4068, continuing: 3908, type: 'public' },
  { name: 'UEW (Humanities)', fees: 2226, continuing: 2226, type: 'public' },
  { name: 'UEW (Business)', fees: 3096, continuing: 3096, type: 'public' },
  { name: 'UEW (Science)', fees: 2783, continuing: 2783, type: 'public' },
  { name: 'TUC', fees: 5299, continuing: 5299, type: 'private' },
  { name: 'Academic City (CS)', fees: 41580, continuing: 41580, type: 'private' },
  { name: 'Academic City (Journalism)', fees: 29700, continuing: 29700, type: 'private' },
  { name: 'Academic City (Biomed)', fees: 59400, continuing: 59400, type: 'private' },
  { name: 'Ashesi (Business)', fees: 12500, continuing: 12500, type: 'private' },
  { name: 'Ashesi (Engineering)', fees: 14000, continuing: 14000, type: 'private' },
  { name: 'Valley View (Business)', fees: 2250, continuing: 2250, type: 'private' },
  { name: 'Valley View (Science)', fees: 2856, continuing: 2856, type: 'private' },
  { name: 'Wisconsin (General)', fees: 3180, continuing: 3180, type: 'private' },
  { name: 'Wisconsin (Law)', fees: 5800, continuing: 5800, type: 'private' }
];

const initialInternationalData: InternationalFeeData[] = [
  { name: 'UG (Humanities) - African', fees: 4328 * 15, type: 'public' },
  { name: 'UG (Humanities) - Non-African', fees: 5109 * 15, type: 'public' },
  { name: 'UG (Admin/Law)', fees: 5336 * 15, type: 'public' },
  { name: 'KNUST (Humanities)', fees: 4354 * 15, type: 'public' },
  { name: 'KNUST (Business/Law)', fees: 6054 * 15, type: 'public' },
  { name: 'KNUST (Engineering)', fees: 6204 * 15, type: 'public' },
  { name: 'KNUST (Medicine)', fees: 7487 * 15, type: 'public' },
  { name: 'Lancaster (Foundation)', fees: 7000 * 15, type: 'private' },
  { name: 'Lancaster (Undergraduate)', fees: 9000 * 15, type: 'private' }
];

const initialPostgraduateData: PostgraduateFeeData[] = [
  { name: 'UG (MA - One Year)', fees: 13074, type: 'public' },
  { name: 'UG (MPhil/MBA)', fees: 13551, type: 'public' },
  { name: 'UG (Law - ADR/HRA)', fees: 22485, type: 'public' },
  { name: 'UG (EPM - Regular)', fees: 18540, type: 'public' },
  { name: 'UG (EPM - Weekend)', fees: 25785, type: 'public' },
  { name: 'UG (PhD - Humanities)', fees: 10256, type: 'public' },
  { name: 'UG (PhD - Admin)', fees: 11694, type: 'public' },
  { name: 'Academic City (Data Sci)', fees: 47250 / 2, type: 'private' },
  { name: 'Academic City (Cyber Sec)', fees: 47250 / 2, type: 'private' },
  { name: 'Lancaster (MBA)', fees: (12000 * 15) / 2, type: 'private' }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [undergraduateData, setUndergraduateData] = useState(initialUndergraduateData);
  const [internationalData, setInternationalData] = useState(initialInternationalData);
  const [postgraduateData, setPostgraduateData] = useState(initialPostgraduateData);
  const { logAction, auditLogs } = useAuth();

  const updateFee = (category: ViewType, index: number, field: string, value: number) => {
    let oldVal = 0;
    let name = '';

    const updateList = (list: any[], setter: Function) => {
      const newList = [...list];
      oldVal = newList[index][field];
      name = newList[index].name;
      newList[index] = { ...newList[index], [field]: value };
      setter(newList);
    };

    if (category === 'undergraduate') updateList(undergraduateData, setUndergraduateData);
    else if (category === 'international') updateList(internationalData, setInternationalData);
    else if (category === 'postgraduate') updateList(postgraduateData, setPostgraduateData);

    logAction('DATA_UPDATE', `Updated ${category} fee for ${name}: ${field} changed from ${oldVal} to ${value}`);
  };

  return (
    <DataContext.Provider value={{ 
      undergraduateData, 
      internationalData, 
      postgraduateData, 
      updateFee,
      auditLogs 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

```

### FILE: contexts/ThemeContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Remove previous theme classes
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast', 'dark');
    
    // Add new theme class
    document.body.classList.add(`theme-${theme}`);
    if (theme === 'dark') {
      document.body.classList.add('dark');
    }

    // Accessibility: Set color scheme preference
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#ffffff');
    }
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
﻿# CREATION.md â€” Fees Comparison Dashboard (Ghana University Fees Dashboard)
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/fees-comparison-dashboard/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Fees Comparison Dashboard (`ghana-university-fees-dashboard` v0.0.0, public-facing brand: **EduData Ghana**) is a **client-side analytics SPA** that lets prospective students, parents, and researchers compare tuition fees across public and private universities in Ghana. The dashboard renders a Recharts vertical bar chart over three mutually exclusive student cohorts:

- **Undergraduate** â€” freshman vs continuing fees per institution.
- **International** â€” converted (USD Ã— 15 cedi) fees for African and non-African applicants.
- **Postgraduate** â€” Master/MPhil/MBA/PhD/MBA programmes.

Beyond the public dashboard, a **password-gated Admin Panel** lets authorised staff (a) edit fees in-place and (b) view the audit log, security/credential settings, and a system-health placeholder. All data lives in React `useState` providers â€” there is **no backend API** in the current build (a `backend/` workspace placeholder exists for future API work).

The service is wired into the TUC monorepo and ships as a Tomcat WAR (`fees-comparison-dashboard` is in the WAR-deployment list) and as a Docker image served by `serve` on port 4173.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** (never change) |
| DOM | react-dom | 19.2.5 |
| react-is | react-is | ^18.2.0 |
| Build | Vite | 7.3.1 |
| Vite plugin | @vitejs/plugin-react | ^5.1.1 |
| Language | TypeScript | ~5.9.3 |
| Styling | Tailwind CSS | ^4.2.2 (via `@tailwindcss/vite`) |
| Charts | Recharts | ^3.5.0 |
| Routing | react-router-dom | ^7.1.0 (declared, used minimally) |
| Icons | lucide-react | ^0.400.0 |
| Static server | serve | 14.2.5 |
| Unit tests | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.3.2 / ^26.1.0 |
| Jest-DOM | @testing-library/jest-dom | ^6.6.3 |
| User events | @testing-library/user-event | ^14.6.1 |
| prop-types | prop-types | ^15.8.1 |
| Node types | @types/node | ^24.10.1 |
| Package manager | pnpm | 10.30.1 (declared in `packageManager`) |
| Container | node:24-alpine â†’ nginx:alpine (or `serve` on 4173) | â€” |

---

## 3. Directory Structure (verbatim)

```
fees-comparison-dashboard/
â”œâ”€â”€ index.html                  # EduData Ghana brand, fonts
â”œâ”€â”€ index.tsx                   # createRoot â†’ <App />
â”œâ”€â”€ index.css                   # Tailwind directives
â”œâ”€â”€ App.tsx                     # ThemeProvider â†’ AuthProvider â†’ DataProvider â†’ MainContent (Header + view switch)
â”œâ”€â”€ types.ts                    # Verbatim type contract â€” see Â§6
â”œâ”€â”€ package.json                # name: ghana-university-fees-dashboard
â”œâ”€â”€ pnpm-lock.yaml
â”œâ”€â”€ pnpm-workspace.yaml         # includes ./, ./backend
â”œâ”€â”€ vite.config.ts              # dev port 3000, base './'
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ vitest.config.ts
â”œâ”€â”€ vitest.e2e.config.ts
â”œâ”€â”€ Dockerfile                  # node:24-alpine builder; runtime serve dist on 4173
â”œâ”€â”€ Dockerfile.prod
â”œâ”€â”€ nginx.conf                  # SPA fallback try_files $uri /index.html
â”œâ”€â”€ .env.local                  # GEMINI_API_KEY (legacy AI Studio export)
â”œâ”€â”€ .npmrc
â”œâ”€â”€ .dockerignore
â”œâ”€â”€ DEPLOYMENT.md
â”œâ”€â”€ README.md
â”œâ”€â”€ SRS.md                      # IEEE SRS v1.1
â”œâ”€â”€ metadata.json
â”œâ”€â”€ public/                     # static assets
â”œâ”€â”€ docs/                       # architecture diagrams, deployment guide
â”œâ”€â”€ migrations/                 # placeholder for backend SQL migrations
â”œâ”€â”€ backend/                    # workspace placeholder (no live API yet)
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ FeesComparisonDashboard.tsx   # Public tab + chart + insights
â”‚   â””â”€â”€ AdminPanel.tsx                # Login, Logs, Data Mgmt, Security, Health tabs
â”œâ”€â”€ contexts/
â”‚   â”œâ”€â”€ ThemeContext.tsx        # light | dark | high-contrast â†’ body class
â”‚   â”œâ”€â”€ AuthContext.tsx         # in-memory password + audit log
â”‚   â””â”€â”€ DataContext.tsx         # seeded fees data + updateFee()
â”œâ”€â”€ src/                        # legacy React Scripts artefacts (kept for fallback)
â”‚   â”œâ”€â”€ AuthGate.jsx
â”‚   â”œâ”€â”€ components/, contexts/, services/, pages/
â”‚   â”œâ”€â”€ __tests__/
â”‚   â””â”€â”€ index.js
â””â”€â”€ WEB-INF/                    # Tomcat context for WAR deploy
```

The **canonical entry tree** is `index.tsx â†’ App.tsx â†’ components/`. The `src/` folder is a legacy CRA tree retained only for the WAR/Tomcat fallback path.

---

## 4. UI Layout

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  HEADER (sticky, h-16, backdrop-blur-md)                  â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€    â”‚
â”‚  [ðŸ“Š EduData Ghana]            [Light|Dark|HC] [Adminâ–¸]  â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  MAIN (max-w-7xl, py-8 sm:py-12)                          â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
â”‚  â”‚  TABS: Undergraduate | International | Postgraduate  â”‚ â”‚
â”‚  â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€  â”‚ â”‚
â”‚  â”‚  RECHARTS BAR CHART (ResponsiveContainer)            â”‚ â”‚
â”‚  â”‚  X axis: institution names                           â”‚ â”‚
â”‚  â”‚  Y axis: GHâ‚µ values (formatted "GHâ‚µNk")              â”‚ â”‚
â”‚  â”‚  Bars (UG): freshman + continuing                    â”‚ â”‚
â”‚  â”‚  Bars (Intl/PG): single fee                          â”‚ â”‚
â”‚  â”‚  Tooltip: name + value (GHâ‚µ...) + type badge         â”‚ â”‚
â”‚  â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€  â”‚ â”‚
â”‚  â”‚  KEY OBSERVATIONS panel â€” text insights              â”‚ â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  FOOTER â€” Â© year EduData Ghana â€” Privacy / Terms / Contactâ”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Clicking **Admin Access** swaps `<FeesComparisonDashboard />` for `<AdminPanel />`. Same view returns to "Public Dashboard".

---

## 5. Provider Composition (`App.tsx`)

```tsx
const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <DataProvider>
        <MainContent />
      </DataProvider>
    </AuthProvider>
  </ThemeProvider>
);
```

`MainContent` owns the local `currentView: 'public' | 'admin'` state and renders `<Header />` + chart-or-admin + footer.

`index.tsx`:
```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

---

## 6. Data Types (`types.ts` â€” implement verbatim)

```ts
export interface BaseFeeData {
  name: string;
  fees: number;
  type: 'public' | 'private';
}
export interface UndergraduateFeeData extends BaseFeeData { continuing: number; }
export interface InternationalFeeData extends BaseFeeData {}
export interface PostgraduateFeeData extends BaseFeeData {}
export type FeeDataItem = UndergraduateFeeData | InternationalFeeData | PostgraduateFeeData;
export type ViewType = 'undergraduate' | 'international' | 'postgraduate';
export type Theme = 'light' | 'dark' | 'high-contrast';

export interface AuditLog {
  id: string; timestamp: number; action: string; details: string; actor: string;
}
export interface AuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  updatePassword: (newPassword: string) => void;
}
export interface DataContextType {
  undergraduateData: UndergraduateFeeData[];
  internationalData: InternationalFeeData[];
  postgraduateData: PostgraduateFeeData[];
  updateFee: (category: ViewType, index: number, field: string, value: number) => void;
  auditLogs: AuditLog[];
}
```

---

## 7. Seeded Data (`contexts/DataContext.tsx` â€” required)

### 7.1 Undergraduate (19 rows â€” fees in GHâ‚µ)
Public: UG (Humanities) 2319/1774, UG (Admin/Law) 2435/1890, KNUST (Humanities) 1875/1715, KNUST (Business) 2428/2268, KNUST (Engineering) 3778/2968, KNUST (Medicine) 4068/3908, UEW (Humanities) 2226, UEW (Business) 3096, UEW (Science) 2783.
Private: TUC 5299, Academic City (CS) 41580, Academic City (Journalism) 29700, Academic City (Biomed) 59400, Ashesi (Business) 12500, Ashesi (Engineering) 14000, Valley View (Business) 2250, Valley View (Science) 2856, Wisconsin (General) 3180, Wisconsin (Law) 5800.

### 7.2 International (9 rows â€” base $ Ã— 15 cedi multiplier)
Public: UG (Humanities) African 4328Ã—15, UG (Humanities) Non-African 5109Ã—15, UG (Admin/Law) 5336Ã—15, KNUST (Humanities) 4354Ã—15, KNUST (Business/Law) 6054Ã—15, KNUST (Engineering) 6204Ã—15, KNUST (Medicine) 7487Ã—15.
Private: Lancaster (Foundation) 7000Ã—15, Lancaster (Undergraduate) 9000Ã—15.

### 7.3 Postgraduate (10 rows)
Public: UG (MA â€“ One Year) 13074, UG (MPhil/MBA) 13551, UG (Law â€“ ADR/HRA) 22485, UG (EPM â€“ Regular) 18540, UG (EPM â€“ Weekend) 25785, UG (PhD â€“ Humanities) 10256, UG (PhD â€“ Admin) 11694.
Private: Academic City (Data Sci) 47250/2, Academic City (Cyber Sec) 47250/2, Lancaster (MBA) (12000Ã—15)/2.

The literal multiplications/divisions must be preserved in the source so future maintainers can audit derivation.

---

## 8. Authentication (`contexts/AuthContext.tsx`)

- In-memory password (default `admin123`) â€” **no localStorage persistence; session loss on reload is intentional** for the public preview build.
- `login(password) â†’ boolean`. Calls `logAction('LOGIN', 'Admin logged in successfully')` on success or `logAction('LOGIN_FAILED', 'Invalid password attempt')` on failure.
- `logout()` â†’ `logAction('LOGOUT', 'Admin logged out')`.
- `updatePassword(newPassword)` â†’ `logAction('SECURITY_UPDATE', 'Admin password changed')`.
- Every mutation funnels through `logAction(action, details)` which prepends a new `AuditLog` (id = 9-char base36) onto `auditLogs` state.

---

## 9. Data Mutation (`contexts/DataContext.tsx`)

`updateFee(category, index, field, value)`:
1. Reads `oldVal = list[index][field]` and `name = list[index].name` for the audit message.
2. Returns a new immutable list with the field overwritten.
3. Calls `logAction('DATA_UPDATE', \`Updated ${category} fee for ${name}: ${field} changed from ${oldVal} to ${value}\`)`.

`DataProvider` consumes `useAuth()` for `logAction`, so it **must** sit inside `<AuthProvider>` (already enforced in `App.tsx`).

---

## 10. Theme System (`contexts/ThemeContext.tsx`)

Theme is `'light' | 'dark' | 'high-contrast'`. Default is `light`. `useEffect` on theme change:
1. Removes `theme-light theme-dark theme-high-contrast dark` from `document.body.classList`.
2. Adds `theme-${theme}`; if `theme === 'dark'` also adds `dark` (for Tailwind dark variants).
3. Updates `<meta name="theme-color">` to `#111827` (dark) or `#ffffff` (otherwise).

The chart and admin shell consume `useTheme()` and switch palettes inline â€” see Â§11.

---

## 11. Chart Palette (per theme)

```ts
// light
{ text: '#64748b', bar1: '#2563eb', bar2: '#059669', grid: '#e2e8f0',
  tooltipBg: 'rgba(255,255,255,0.98)', tooltipText: '#1e293b',
  cardBg: '#ffffff', borderColor: '#e2e8f0',
  accentGradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }
// dark
{ text: '#9ca3af', bar1: '#3b82f6', bar2: '#10b981', grid: '#374151',
  tooltipBg: 'rgba(17,24,39,0.98)', tooltipText: '#f3f4f6',
  cardBg: '#1e293b', borderColor: '#374151' }
// high-contrast
{ text: '#000000', bar1: '#000000', bar2: '#555555', grid: '#000000',
  tooltipBg: '#ffffff', tooltipText: '#000000',
  cardBg: '#ffffff', borderColor: '#000000' }
```

**TUC brand overlay** (used in headers/footers/marketing surfaces): Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`, Paper `#141210`. Typography: Playfair Display, Bebas Neue, Inter / Cormorant Garamond.

Page background switches between `bg-[#0f172a]` (dark) and `bg-[#f8fafc]` (light).

---

## 12. Public Dashboard (`components/FeesComparisonDashboard.tsx`)

- Local `viewType: ViewType` state (default `'undergraduate'`).
- `dataToDisplay = useMemo` switching on `viewType`.
- Three pill-style filter tabs at the top of the card: Undergraduate, International, Postgraduate.
- `<ResponsiveContainer>` wraps `<BarChart>` with `XAxis dataKey="name"`, `YAxis tickFormatter={formatAxisCurrency}`.
- For Undergraduate, render two `<Bar>` series: `dataKey="fees"` (Freshman, `bar1`), `dataKey="continuing"` (Continuing, `bar2`).
- Currency helpers:
  ```ts
  formatCurrency(v)     â†’ `GHâ‚µ${v.toLocaleString()}`
  formatAxisCurrency(v) â†’ v >= 1000 ? `GHâ‚µ${(v/1000).toFixed(0)}k` : `GHâ‚µ${v}`
  ```
- Tooltip shows: institution name, fee value via `formatCurrency`, public/private type badge.
- A "Key Observations" insights panel below the chart summarises the active view in 3â€“5 bullets.
- All bars must distinguish public/private by colour or pattern (REQ-1.4 of SRS).

---

## 13. Admin Panel (`components/AdminPanel.tsx`)

Two render modes:

### 13.1 Login view (when `!isAuthenticated`)
- Centred card, "Admin Portal" title, lock icon.
- Password `<input type="password">` with `aria-label`.
- On submit calls `login(passwordInput)`; on false â†’ "Incorrect password. Please try again."

### 13.2 Authenticated view
Sticky header: avatar circle "A", "Administrator", "â— System Active" status, **Sign Out** button (red).

Sidebar (md:w-64) with four tab buttons:

| Tab id | Label | Content |
|---|---|---|
| `logs` | Audit Logs | Table of all `auditLogs` entries: timestamp (locale time), event type pill (green for LOGIN, blue for UPDATE, gray default), description, initiator |
| `data` | Data Management | Editable list of undergraduate rows; freshman fees (`field='fees'`) editable inline; calls `updateFee('undergraduate', idx, 'fees', Number(e.target.value))` |
| `settings` | Security | New-password input + "Update Credentials" button â†’ `updatePassword()` |
| `health` | System Health | Placeholder card; "Launch Diagnostics (Preview)" button â€” Phase 3 hook for the test runner |

The admin shell rounds at `rounded-3xl`, min-height 800px, sidebar bg `bg-gray-50/50` (light) or `bg-gray-900/50` (dark).

---

## 14. Build Configuration (`vite.config.ts`)

Dev server port **3000**, host `0.0.0.0`. `base: './'` for Tomcat-relative deployment. Plugins: `react()`, `tailwindcss()`. Vite `define` shims `process.env.API_KEY` and `process.env.GEMINI_API_KEY` from the `GEMINI_API_KEY` env var (legacy AI Studio scaffolding â€” kept for backward compatibility).

Build output goes to `dist/` with `assets/[name]-[hash].[ext]` filenames. `chunkSizeWarningLimit: 1000`. Manual chunks split:

| Chunk | Modules |
|---|---|
| `vendor-react-dom` | react-dom |
| `vendor-router` | react-router |
| `vendor-react` | react |
| `vendor-charts` | recharts, d3-* |
| `vendor-motion` | framer-motion, motion |
| `vendor-icons` | lucide, heroicons |
| `vendor` | everything else |

> Note: the committed `vite.config.ts` has a duplicated `build:` block (legacy merge artefact). Deduplicate when refactoring.

---

## 15. Docker

`Dockerfile` (multi-stage):
1. `FROM node:24-alpine AS builder` â€” `corepack enable`, `pnpm install --frozen-lockfile || npm install`, copy source, `pnpm run build`.
2. `FROM node:24-alpine` â€” install global `serve`, copy `dist/`, `EXPOSE 4173`, `HEALTHCHECK` hits `http://localhost:4173/health`, `CMD ["serve", "-s", "dist", "-l", "4173"]`.

`Dockerfile.prod` is the slimmer nginx variant pairing with `nginx.conf`. The nginx config exposes `/health` returning `'healthy'`, sets X-Frame-Options/X-Content-Type/X-XSS/Referrer-Policy headers, gzips text/css/js/json/svg, and applies `try_files $uri $uri/ /index.html` for SPA deep-link refreshes.

Network: `tuc-network`. Reachable through gateway `nginx-gateway` at `http://localhost:8080/fees-comparison-dashboard/`.

---

## 16. Build / Run / Test

```bash
pnpm install
pnpm run dev          # Vite, port 3000
pnpm run build        # â†’ dist/
pnpm run preview
pnpm test             # Vitest
pnpm run test:ui
pnpm run test:coverage
pnpm run test:e2e     # vitest run --config vitest.e2e.config.ts
```

Coverage target: â‰¥70% across branches/functions/lines/statements (TUC monorepo standard).

---

## 17. Environment Variables

```bash
# .env.local
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
```

The Vite `define` block exposes `process.env.GEMINI_API_KEY` so any historical reference still resolves.

---

## 18. ARIA / Accessibility Requirements

- Theme switcher buttons each have `aria-label="Switch to <theme> theme"`.
- Header `Admin Access` / `Public Dashboard` toggle button â€” must remain keyboard-accessible (`<button>`).
- Login form input must have `<label htmlFor>` paired with input `id`.
- All inline SVG icons in the header should have `aria-hidden="true"`.
- Chart `<section role="region" aria-labelledby="..." aria-describedby="...">` with `sr-only` description summarising the trend (per TUC SHARED-STANDARDS).
- Skip-to-content link as the first focusable element of `<App>`.
- Currency values comma-separated (REQ-NFR-3); minimum 4.5:1 contrast (REQ-NFR-4).
- 200% browser zoom must not break layout (REQ-NFR-1).

---

## 19. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build completes with zero TypeScript errors |
| AC-2 | Header shows "EduData Ghana" wordmark and three theme pills (light / dark / HC) |
| AC-3 | Switching theme updates `document.body.className` to `theme-<value>` (and adds `dark` when applicable) |
| AC-4 | Public dashboard renders a Recharts bar chart for the selected `ViewType` |
| AC-5 | Undergraduate view renders two bar series: freshman and continuing |
| AC-6 | International and postgraduate views render single fee bars; values formatted `GHâ‚µNk` on the Y axis |
| AC-7 | Tooltip displays institution name, currency-formatted fee, and public/private type |
| AC-8 | Clicking "Admin Access" swaps the main view to `<AdminPanel />` |
| AC-9 | Admin login with default password `admin123` succeeds; wrong password shows inline error |
| AC-10 | After login, audit log records the LOGIN event in the Logs tab |
| AC-11 | Changing a fee in Data Management calls `updateFee` and emits a `DATA_UPDATE` audit entry |
| AC-12 | Updating the password emits `SECURITY_UPDATE` and immediately invalidates the old password |
| AC-13 | Logout flips back to the login screen and emits a `LOGOUT` audit entry |
| AC-14 | High-contrast theme renders chart in pure black/grey with white card backgrounds |
| AC-15 | All chart values are comma-separated for thousands (e.g. `GHâ‚µ41,580`) |
| AC-16 | Docker build succeeds with `node:24-alpine` and the resulting image serves on port 4173 (or via nginx on 80) |
| AC-17 | `nginx.conf` exposes `/health` returning HTTP 200 |
| AC-18 | Deep-link refresh on `/admin` returns `index.html` (SPA fallback works) |
| AC-19 | Service is reachable through TUC gateway at `http://localhost:8080/fees-comparison-dashboard/` |
| AC-20 | All `<button>` elements are keyboard-focusable and have visible focus styles |

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/fees-comparison-dashboard/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/fees-comparison-dashboard/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/fees-comparison-dashboard/',  // REQUIRED: Assets must load from /fees-comparison-dashboard/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/fees-comparison-dashboard"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/fees-comparison-dashboard">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/fees-comparison-dashboard/`, not at the root
- **Asset Loading**: Without `base: '/fees-comparison-dashboard/'`, assets try to load from `/assets/` instead of `/fees-comparison-dashboard/assets/`
- **Routing**: Without `basename="/fees-comparison-dashboard"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/fees-comparison-dashboard/assets/index-*.js`
- Link tags should reference: `/fees-comparison-dashboard/assets/index-*.css`

If they reference `/assets/` instead of `/fees-comparison-dashboard/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/fees-comparison-dashboard/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/fees-comparison-dashboard/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: fees-comparison-dashboard

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
# EduData Ghana - Administrator Guide

## 1. Introduction
This guide is intended for system administrators responsible for managing the EduData Ghana University Fees Dashboard. It covers authentication, data management, audit monitoring, and system diagnostics.

## 2. Accessing the Admin Panel
1. Navigate to the application homepage.
2. Click the **"Admin Login"** button located in the top-right corner of the header.
3. Enter the administrator password.
   - **Default Password:** `admin123`
   - *Security Note: It is mandatory to change this password immediately upon first login.*

## 3. Security Management
### Changing the Password
1. Log in to the Admin Dashboard.
2. Navigate to the **"Security"** tab.
3. Enter your new password in the input field.
4. Click **"Update Password"**.
5. A confirmation alert will appear. The new password is effective immediately for the current session.
   - *Note: Since this is a client-side demo, password changes persist only for the duration of the session/reload unless a backend is connected.*

## 4. Managing Data
The application allows real-time updates to fee structures without redeployment.

1. Navigate to the **"Manage Data"** tab.
2. Select the category you wish to edit (Currently defaults to 'Undergraduate').
3. Locate the institution/program you wish to modify.
4. Update the **Fees** input field with the new numeric value.
5. Changes are reflected immediately on the public dashboard.
6. **Audit Trail:** Every data change is automatically logged with a timestamp and the old/new values.

## 5. System Monitoring (Audit Logs)
To view the history of actions taken within the system:

1. Navigate to the **"Audit Logs"** tab.
2. The table displays:
   - **Time:** Exact timestamp of the event.
   - **Action:** Type of event (e.g., LOGIN, DATA_UPDATE, SECURITY_UPDATE).
   - **Details:** Specifics of what changed (e.g., "Updated UG fees...").
   - **Actor:** Identity of the user (currently 'Admin').

## 6. System Diagnostics (Self-Test)
The application includes a built-in "System Health" module to verify integrity.

1. Navigate to the **"System Health"** tab (added in Phase 3).
2. Click the **"Run Diagnostic Suite"** button.
3. The system will perform:
   - **Context Integrity Check:** Verifies data providers are active.
   - **Data Availability Check:** Ensures fee arrays are populated.
   - **Theme System Check:** Verifies theme switching logic.
4. Results are displayed in real-time. If any test fails, consult the browser console for stack traces.

## 7. Troubleshooting
- **Login Fails:** Ensure Caps Lock is off. If the page was reloaded, the password resets to `admin123`.
- **Chart Not Updating:** Try switching tabs (e.g., to International and back) to force a re-render.
- **Blank Screen:** Check browser console (F12) for JavaScript errors. Ensure your browser supports React 18+.

---
*Generated for EduData Ghana v1.1 - Phase 4*
```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — ghana-university-fees-dashboard

**Application:** ghana-university-fees-dashboard
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd ghana-university-fees-dashboard
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
docker-compose -f docker-compose-all-apps.yml build ghana-university-fees-dashboard
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up ghana-university-fees-dashboard
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
# Deployment Guide - EduData Ghana

## 1. Prerequisites
Before deploying, ensure you have the following installed on your local development machine:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- A Git client

## 2. Local Development Build
To build the application locally for testing:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/ghana-fees-dashboard.git
   cd ghana-fees-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

4. **Create a production build:**
   ```bash
   npm run build
   ```
   This creates a `build` directory with optimized, minified static assets.

## 3. Production Deployment Options

### Option A: Static Hosting (Netlify/Vercel) - *Recommended*
Since this is a client-side SPA, static hosting is the most efficient method.

1. **Connect Repository:**
   - Log in to Netlify or Vercel.
   - select "Import from Git".
   - Choose your repository.

2. **Configure Build Settings:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`

3. **Deploy:**
   - Click "Deploy Site".
   - The platform will automatically install dependencies, build the app, and provision a CDN URL.

### Option B: Traditional Web Server (Apache/Nginx)
1. Run `npm run build` locally.
2. Upload the contents of the `build/` folder to your server's public HTML directory (e.g., `/var/www/html`).
3. **Important Configuration:**
   - Ensure your server is configured to handle client-side routing. All 404 requests should be redirected to `index.html`.
   - **Nginx Example:**
     ```nginx
     location / {
       try_files $uri $uri/ /index.html;
     }
     ```

## 4. Post-Deployment Verification
1. Access the production URL.
2. Verify that the initial load time is acceptable (< 1.5s).
3. Check the **Admin Login** functionality.
4. Verify that data visualizations render correctly on mobile devices.

## 5. Continuous Integration (Optional)
To set up CI for automated testing:
1. Configure your pipeline (GitHub Actions / GitLab CI) to run:
   ```bash
   npm install
   node tests/e2e.js
   ```
2. If the E2E tests pass, proceed with the build and deployment steps.

---
*Generated for EduData Ghana v1.1 - Phase 4*
```

### FILE: docs/README.md
```md
# EduData Ghana - Documentation Hub

Welcome to the comprehensive documentation for the EduData Ghana University Fees Dashboard.

## 📂 Contents

### 1. System Requirements & Architecture
- **[Final SRS Document](SRS_GhanaFees_Final.md)**: The complete technical specification and requirements.
- **[System Architecture](svg/architecture.svg)**: High-level component diagram.
- **[Data Flow Diagram](svg/data_flow.svg)**: Process flow for data updates.

### 2. Operational Guides
- **[Administrator Guide](ADMIN_GUIDE.md)**: Manual for managing fees, security, and logs.
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)**: Instructions for production build and hosting.
- **[Testing Guide](TESTING_GUIDE.md)**: How to run Self-Diagnostics and Playwright tests.

### 3. Technical Diagrams (SVG)
- [Technology Stack](svg/tech_stack.svg)
- [UML Use Case](svg/use_case.svg)
- [UML Sequence](svg/sequence.svg)

### 4. Presentation Assets
- [Simplified Architecture](presentation/arch_simplified.svg)
- [Simplified Tech Stack](presentation/tech_simplified.svg)

---
*Generated: October 2023 - Project Refresh Phase 5*

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Ghana University Fees Dashboard
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Ghana University Fees Dashboard**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Ghana University Fees Dashboard** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Ghana University Fees Dashboard** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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

### FILE: docs/SRS_GhanaFees_Final.md
```md
# System Requirements Specification (SRS)
**Project:** EduData Ghana University Fees Dashboard
**Version:** 2.0 (Final Release)
**Date:** October 26, 2023
**Status:** Complete

---

## 1. Introduction

### 1.1 Purpose
The purpose of the EduData Ghana platform is to provide transparent, comparative analysis of university tuition fees across Ghana. This final SRS documents the complete system, including the public dashboard, secure administration panel, audit logging, and testing infrastructure.

### 1.2 Scope
The application is a secure Single Page Application (SPA) offering:
- **Public:** Interactive visualizations of tuition fees (Undergraduate, International, Postgraduate).
- **Admin:** Secure login, real-time data management, and audit logging.
- **System:** Integrated self-diagnostics and high-contrast accessibility modes.

---

## 2. System Architecture

The system utilizes a React-based architecture relying on the Context API for global state management (Auth, Data, Theme). It is designed for client-side execution with zero backend dependency for the MVP phase.

![System Architecture](svg/architecture.svg)

### 2.1 Technology Stack
- **Core:** React 19, TypeScript.
- **Styling:** Tailwind CSS.
- **Visualization:** Recharts.
- **Testing:** Playwright (E2E), Internal Diagnostics.

![Tech Stack](svg/tech_stack.svg)

---

## 3. Functional Requirements

### 3.1 Public Dashboard
- **FR-1:** Display comparative bar charts for fees.
- **FR-2:** Allow filtering by Student Category (Undergraduate, International, Postgraduate).
- **FR-3:** Display tooltips with breakdown of Freshman vs. Continuing fees.
- **FR-4:** Support Light, Dark, and High-Contrast themes.

### 3.2 Administration & Security
- **FR-5:** Secure Login screen with configurable password.
- **FR-6:** Edit fee structures in real-time.
- **FR-7:** Log all administrative actions (Login, Update, Logout).
- **FR-8:** View Audit Logs in a tabular format.

![Use Case Diagram](svg/use_case.svg)

### 3.3 Data Flow
When an administrator updates a fee, the data flows through the Validation layer, updates the DataContext, triggers a re-render of the Dashboard, and appends an entry to the Audit Log.

![Data Flow Diagram](svg/data_flow.svg)

---

## 4. System Logic (Sequence)

The following sequence diagram illustrates the secure interaction flow when an Admin updates a fee record.

![Sequence Diagram](svg/sequence.svg)

---

## 5. Non-Functional Requirements

### 5.1 Accessibility
- **NFR-1:** WCAG 2.1 AA Compliance.
- **NFR-2:** High-contrast mode for visually impaired users.
- **NFR-3:** Screen reader support (ARIA labels) on all interactive elements.

### 5.2 Performance
- **NFR-4:** Application Time-to-Interactive (TTI) < 1.5s.
- **NFR-5:** Chart re-render latency < 50ms.

### 5.3 Reliability
- **NFR-6:** Internal "System Health" self-test must pass all checks before deployment.
- **NFR-7:** E2E Playwright tests must pass on CI pipeline.

---
*End of Document - Phase 5 Complete*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — ghana-university-fees-dashboard

**Application:** ghana-university-fees-dashboard
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd ghana-university-fees-dashboard
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
# Testing Guide - EduData Ghana

## 1. Overview
This project employs a two-tiered testing strategy:
1. **Internal Self-Diagnostics:** Runs within the application admin panel for quick health checks.
2. **External E2E Testing:** Uses Playwright to simulate user interactions and verify critical flows in a headless browser environment.

## 2. Internal Self-Diagnostics (Manual)
The "System Health" tab in the Admin Panel allows administrators to verify the application state without technical tools.

### How to Run:
1. Log in to the Admin Panel.
2. Click the **"System Health"** tab.
3. Click **"Run Diagnostic Suite"**.

### Test Coverage:
- **Context Integrity:** Checks if Auth, Data, and Theme contexts are initialized.
- **Data Availability:** Verifies that fee arrays (Undergraduate, International) are not empty.
- **Theme System:** Simulates a theme switch and verifies the state update.
- **Admin Session:** Verifies the current session is marked as authenticated.

## 3. Automated E2E Testing (Playwright)
We use Playwright to perform End-to-End testing. This suite launches a headless Chrome instance and interacts with the app like a real user.

### Prerequisites:
- Node.js installed.
- Dependencies installed (`npm install playwright`).

### Test Suite File:
- Location: `tests/e2e.js`

### Scenarios Covered:
1. **Homepage Render:** Verifies the page loads and title is correct.
2. **Tab Navigation:** Clicks "International Students" and verifies chart data updates.
3. **Theme Toggling:** Clicks "Dark Mode" and checks for CSS class application.
4. **Admin Login:** Navigates to Admin, enters password, and verifies Dashboard load.

### How to Run:
1. Ensure the application is running locally (usually on port 3000):
   ```bash
   npm start
   ```
2. In a new terminal window, run the test script:
   ```bash
   node tests/e2e.js
   ```

### Interpreting Results:
- **Pass:** console will log `[PASS] Test Name`.
- **Fail:** Console will log `[FAIL] Test Name` with an error message.
- **Screenshots:** The test script captures screenshots of critical states (e.g., `screenshot_home.png`, `screenshot_admin.png`) in the root directory for visual debugging.

## 4. Reporting Issues
If a test fails:
1. Check the console output for specific error messages.
2. Review the generated screenshots to see the UI state at the time of failure.
3. Verify that the application is running on the expected port (`http://localhost:3000`).

---
*Generated for EduData Ghana v1.1 - Phase 4*
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
    <meta property="og:title" content="Fees Comparison Dashboard | Techbridge University College" />
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
    <meta name="twitter:title" content="Fees Comparison Dashboard | Techbridge University College" />
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
    <title>Fees Comparison Dashboard | Techbridge University College</title>

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
      .skip-to-main {
        position: absolute;
        left: -9999px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
        z-index: 9999;
      }
      .skip-to-main:focus {
        left: 8px;
        width: auto;
        height: auto;
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
    <a href="#main-content" class="skip-to-main" aria-label="Skip to main content">Skip to main content</a>
    <noscript>You need to enable JavaScript to run this app.</noscript>

    <div id="root" role="main" aria-label="Fees Comparison Dashboard">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">fees comparison dashboard</div>
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
  "name": "Ghana University Fees Dashboard",
  "description": "A comprehensive data visualization dashboard comparing tuition fees across public and private universities in Ghana.",
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
  "name": "ghana-university-fees-dashboard",
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
    "react-dom": "19.2.5",
    "react-is": "^18.2.0",
    "prop-types": "^15.8.1",
    "recharts": "^3.5.0",
    "react-router-dom": "^7.1.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^24.10.1",
    "@vitejs/plugin-react": "^5.1.1",
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

View your app in AI Studio: https://ai.studio/apps/drive/11ysa_M_d_frAYPh7fC0HT-9zmQUNtdb3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/AuthGate.jsx
```javascript
import { useState } from 'react';

const AUTH_KEY = 'tuc_auth_fees_comparison_dashboard';
const ACCENT   = '#e11d48';

export function AuthGate({ children }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e) => {
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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Fees Comparison Dashboard</h1>
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

### FILE: src/index.js
```javascript
import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4020;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = [REDACTED_CREDENTIAL]
const DB_NAME = process.env.DB_NAME || 'fees_comparison';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS institutions (
        id VARCHAR(255) PRIMARY KEY, institution_name VARCHAR(255),
        country VARCHAR(100), established_year INT, website_url VARCHAR(500),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS fees_structure (
        id VARCHAR(255) PRIMARY KEY, institution_id VARCHAR(255),
        program_name VARCHAR(255), year INT, tuition_fee DECIMAL(12,2),
        accommodation_fee DECIMAL(12,2), other_fees DECIMAL(12,2),
        currency VARCHAR(3), academic_year VARCHAR(20),
        FOREIGN KEY (institution_id) REFERENCES institutions(id),
        INDEX idx_institution (institution_id), INDEX idx_program (program_name)
      )
    `);
    conn.release();
    console.log('Fees Comparison DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'fees-comparison' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/institution') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const instId = `inst_${Date.now()}`;
          await conn.query(
            'INSERT INTO institutions (id, institution_name, country, established_year, website_url) VALUES (?, ?, ?, ?, ?)',
            [instId, data.name || '', data.country || '', data.year || 2000, data.website || '']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, institution_id: instId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/fees')) {
      const conn = await pool.getConnection();
      const [fees] = await conn.query('SELECT * FROM fees_structure ORDER BY academic_year DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(fees));
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (e) {
    console.error('Request error:', e);
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function start() {
  await initDB();
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch(e => { res.writeHead(500); res.end('error'); });
  });
  server.listen(PORT, () => console.log(`Fees Comparison API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });

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
          <span className="font-bold text-sm">Fees Comparison Dashboard</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Fees Comparison Dashboard — Admin</h1>
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
 * E2E stub — ghana-university-fees-dashboard
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('ghana-university-fees-dashboard E2E', () => {
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

### FILE: SRS.md
```md
# System Requirements Specification (SRS)
**Project:** Ghana University Fees Dashboard
**Version:** 1.1
**Date:** October 26, 2023
**Phase:** 1 (Foundation Setup)

## 1. Introduction

### 1.1 Purpose
The purpose of the Ghana University Fees Dashboard is to provide a transparent, interactive data visualization tool that enables prospective students, parents, and educational researchers to compare tuition fees across public and private universities in Ghana. This document defines the functional and non-functional requirements for the initial release (Phase 1).

### 1.2 Scope
The application is a client-side Single Page Application (SPA) built with React. It provides:
- Comparative visualization of tuition fees.
- Filtering capabilities for different student categories (Undergraduate, International, Postgraduate).
- Interactive details via tooltips.
- A responsive design suitable for mobile and desktop devices.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SPA:** Single Page Application.
- **SRS:** System Requirements Specification.
- **GH₵:** Ghanaian Cedi (Currency).
- **CSR:** Client-Side Rendering.
- **Component:** A modular part of the React application (e.g., `FeesComparisonDashboard`).

## 2. Overall Description

### 2.1 Product Perspective
This system operates as a standalone web application. It relies on a modern browser environment to render the User Interface (UI) and execute logic via JavaScript. It is designed to be hosted on static hosting services.

### 2.2 User Classes and Characteristics
- **Prospective Students:** Users seeking tuition information for university selection.
- **Parents/Guardians:** Users analyzing financial requirements for education.
- **Researchers:** Users comparing public vs. private sector pricing strategies.

### 2.3 Operating Environment
- **Client:** Modern web browsers (Chrome, Firefox, Safari, Edge).
- **Display:** Responsive support for resolutions from 320px (mobile) to 4k (desktop).

### 2.4 Design and Implementation Constraints
- **Frontend Framework:** React 19.
- **Styling Utility:** Tailwind CSS.
- **Charting Library:** Recharts.
- **Language:** TypeScript for type safety.

### 2.5 Data Model
The application manages three core data structures as defined in `types.ts`:
- **UndergraduateFeeData:** Includes `fees` (freshman) and `continuing` (ongoing) costs.
- **InternationalFeeData:** Includes converted fee structures.
- **PostgraduateFeeData:** Includes program-specific annual fees.
- **Common Fields:** `name` (Institution Name), `type` (Public/Private).

## 3. System Features

### 3.1 Interactive Fee Visualization
- **Description:** A dynamic bar chart that renders fee data based on the selected view.
- **Functional Requirements:**
  - **REQ-1.1:** The system shall display a vertical bar chart.
  - **REQ-1.2:** The chart shall render the X-axis with Institution Names.
  - **REQ-1.3:** The chart shall render the Y-axis with Currency values (GH₵).
  - **REQ-1.4:** The system shall distinguish fee types (e.g., Freshman vs. Continuing) using distinct colors.

### 3.2 Category Filtering System
- **Description:** A tab-based navigation control to switch data contexts.
- **Functional Requirements:**
  - **REQ-2.1:** The system shall provide three mutually exclusive filters: 'Undergraduate', 'International', 'Postgraduate'.
  - **REQ-2.2:** Selecting a filter shall immediately (within 100ms) update the chart data.
  - **REQ-2.3:** The active filter state shall be visually distinct (highlighted).

### 3.3 Contextual Data Details
- **Description:** On-hover tooltips providing precise data points.
- **Functional Requirements:**
  - **REQ-3.1:** Hovering over a bar shall display a floating tooltip.
  - **REQ-3.2:** The tooltip shall show: Institution Name, Fee Value formatted in GH₵, and Institution Type (Public/Private).
  - **REQ-3.3:** The tooltip shall utilize a semi-transparent backdrop for readability.

### 3.4 Data Analysis Insights
- **Description:** A text-based summary of key observations based on the data.
- **Functional Requirements:**
  - **REQ-4.1:** The system shall display a list of "Key Observations" relevant to the currently selected filter.

## 4. Nonfunctional Requirements

### 4.1 Performance
- **REQ-NFR-1:** Initial application load time shall be under 1.5 seconds on a standard 4G network.
- **REQ-NFR-2:** UI interactions (filtering) shall render in under 16ms (60fps target).

### 4.2 Usability
- **REQ-NFR-3:** Currency values shall be comma-separated for readability (e.g., 10,000).
- **REQ-NFR-4:** The UI shall use high-contrast colors accessible to users with mild visual impairments.

### 4.3 Maintainability
- **REQ-NFR-5:** The code shall adhere to TypeScript strict mode.
- **REQ-NFR-6:** Component logic shall be separated from data definitions.

---
*End of SRS Document*
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
export interface BaseFeeData {
  name: string;
  fees: number;
  type: 'public' | 'private';
}

export interface UndergraduateFeeData extends BaseFeeData {
  continuing: number;
}

export interface InternationalFeeData extends BaseFeeData {}

export interface PostgraduateFeeData extends BaseFeeData {}

export type FeeDataItem = UndergraduateFeeData | InternationalFeeData | PostgraduateFeeData;

export type ViewType = 'undergraduate' | 'international' | 'postgraduate';

// Phase 2 Additions
export type Theme = 'light' | 'dark' | 'high-contrast';

export interface AuditLog {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  actor: string; // e.g., 'Admin'
}

export interface AuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  updatePassword: (newPassword: string) => void;
}

export interface DataContextType {
  undergraduateData: UndergraduateFeeData[];
  internationalData: InternationalFeeData[];
  postgraduateData: PostgraduateFeeData[];
  updateFee: (category: ViewType, index: number, field: string, value: number) => void;
  auditLogs: AuditLog[];
}

```

### FILE: vite.config.ts
```typescript
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

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
      },
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        // Generate relative paths for assets
        rollupOptions: {
          output: {
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          }
        }
      },
      // Set base to relative path for Tomcat deployment
      base: './'
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
    },
  };
});
```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — ghana-university-fees-dashboard
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

// Vitest E2E configuration — ghana-university-fees-dashboard
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

