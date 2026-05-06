import React, { useState } from 'react';
import { Lock, Loader2, AlertCircle, User, ShieldCheck } from 'lucide-react';
import { logAction } from '../../services/logger';
import { AuthService } from '../../services/auth';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const { user } = await AuthService.login(username, password);
        
        // Detailed security logging
        logAction(
            'AUTH_SUCCESS', 
            `Authenticated user ${user.username} (ID: ${user.id}) via JWT simulation`, 
            'auth', 
            user.username
        );
        
        onLogin();
    } catch (err: any) {
        // Log failed attempt with context
        logAction(
            'AUTH_FAILURE', 
            `Failed login attempt for user: '${username}'. Reason: Invalid Credentials`, 
            'auth', 
            username || 'anonymous'
        );
        
        setError('Invalid username or password');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-slate-700 shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex flex-col items-center mb-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/50">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-black text-white">Admin Access</h1>
                <p className="text-slate-400 text-sm mt-1">Secure JWT Authentication</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 relative z-10">
                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="admin"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••••••"
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-300 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/30 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In securely'}
                </button>
            </form>
            
            <div className="mt-8 text-center">
                <p className="text-xs text-slate-600 font-mono">
                    System Protected • <span title="Use 'admin' / 'Password123!' for demo" className="cursor-help border-b border-dotted border-slate-700">v2.1.0</span>
                </p>
            </div>
        </div>
    </div>
  );
};