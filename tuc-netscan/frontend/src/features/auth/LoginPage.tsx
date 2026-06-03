import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, useAuthStore } from '../../lib/api';
import { Wifi, Lock, User, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const [username, setUsername] = useState('daniel.twum');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const login    = useAuthStore(s => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.login(username, password);
      login(res.token, res.username);
      navigate('/');
    } catch {
      setError('Invalid credentials. Default dev password: tuc-ict-2026');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{background: 'linear-gradient(135deg, #060e1a 0%, #0D1B2E 50%, #060e1a 100%)', backgroundImage: 'linear-gradient(rgba(200,146,10,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,10,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px'}}>

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4"
               style={{background: 'rgba(200,146,10,0.1)', border: '1px solid rgba(200,146,10,0.3)'}}>
            <Wifi size={28} className="text-gold" />
          </div>
          <h1 className="font-mono-display text-2xl text-gold tracking-widest">TUC NETSCAN</h1>
          <p className="text-slate-500 text-xs font-mono-code mt-1 tracking-widest">CAMPUS NETWORK OPERATIONS</p>
          <div className="mt-2 text-xs text-slate-600 font-mono-code">TUC-ICT-SRS-2026-012</div>
        </div>

        {/* Form card */}
        <div className="noc-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-code text-slate-400 mb-1.5 tracking-widest">USERNAME</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text" value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2.5 pl-9 text-sm font-mono-code text-slate-200 focus:outline-none focus:border-gold/50 transition-colors"
                  required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-code text-slate-400 mb-1.5 tracking-widest">PASSWORD</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="tuc-ict-2026 (dev)"
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2.5 pl-9 text-sm font-mono-code text-slate-200 focus:outline-none focus:border-gold/50 transition-colors"
                  required />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded p-3">
                <AlertCircle size={12} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded font-mono-code text-sm tracking-widest transition-all duration-200 disabled:opacity-50"
              style={{background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A'}}>
              {loading ? 'AUTHENTICATING...' : 'AUTHORISE ACCESS'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6 font-mono-code">
          Techbridge University College · ICT Office · Oyibi, Ghana
        </p>
      </div>
    </div>
  );
}
