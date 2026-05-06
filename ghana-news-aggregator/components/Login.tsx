import React, { useState } from 'react';
import { Lock, User as UserIcon, AlertCircle, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (password: string) => void;
  error?: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div 
        className="max-w-md w-full p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300"
        role="main"
        aria-labelledby="login-heading"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-4" aria-hidden="true">
            <ShieldCheck size={48} />
          </div>
          <h1 id="login-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Secure Admin Access</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Ghana News Aggregator System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Admin Login Form">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                <UserIcon size={18} aria-hidden="true" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                placeholder="Enter username"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password-field" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                <Lock size={18} aria-hidden="true" />
              </div>
              <input
                id="password-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                aria-describedby="password-hint"
              />
            </div>
            <p id="password-hint" className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 text-right italic">
              Hint: admin123
            </p>
          </div>

          {error && (
            <div 
              className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm animate-in slide-in-from-top-2" 
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle size={16} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-slate-900 transition-all active:scale-[0.98]"
            aria-label="Submit login credentials"
          >
            Authenticate
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                Protected by Session Encryption
            </p>
        </div>
      </div>
    </div>
  );
};