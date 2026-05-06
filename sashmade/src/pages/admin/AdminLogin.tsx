import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, AlertCircle } from 'lucide-react';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in real app this would verify against DB
    if (username === 'admin' && password === 'sashmade2026') {
      login(username, 'admin');
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-900">
      <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-200 dark:border-stone-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#4A5340] rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-[#D97706]" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#4A5340] dark:text-[#D97706]">Admin Access</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">Secure Area - Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#4A5340] focus:border-transparent"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#4A5340] focus:border-transparent"
              placeholder="password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#4A5340] hover:bg-[#3A4232] text-white font-bold rounded-xl transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
