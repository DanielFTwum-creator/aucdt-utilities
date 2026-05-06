import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') { // Per standard workflow fallback
      localStorage.setItem('tuc_admin_auth', 'true');
      
      // Audit log entry
      const logs = JSON.parse(localStorage.getItem('tuc_audit_logs') || '[]');
      logs.push({ action: 'LOGIN', timestamp: new Date().toISOString(), user: 'admin' });
      localStorage.setItem('tuc_audit_logs', JSON.stringify(logs));
      
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0C07] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#141210] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-[#C8A84B] font-['Playfair_Display'] text-3xl font-bold mb-2">TUC Admin Portal</h1>
          <p className="text-zinc-400 text-sm">Sign in to access diagnostics and configuration.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2" htmlFor="password">
              Administrator Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C8A84B] focus:ring-1 focus:ring-[#C8A84B] transition"
              placeholder="Enter password"
              aria-label="Administrator Password"
              aria-invalid={!!error}
              aria-describedby={error ? "login-error" : undefined}
            />
            {error && (
              <p id="login-error" className="mt-2 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#C8A84B] hover:bg-[#b09442] text-black font-semibold py-3 rounded-lg transition"
            aria-label="Sign In"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
