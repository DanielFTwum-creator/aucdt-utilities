import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminContext';
import { Lock, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLayout() {
  const { state, login } = useAdminAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(pin)) {
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  if (!state.authenticated) {
    return (
      <div className="min-h-screen bg-[#050a12] flex items-center justify-center p-4 selection:bg-brand-cyan/30">
        <div className="noise-overlay" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0c1520] border border-[#1a2d42] p-12 relative z-10"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-cyan shadow-[0_0_15px_rgba(0,255,209,0.5)]" />
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-brand-cyan/5 border border-brand-cyan/20 flex items-center justify-center mb-6">
              <Lock className="text-brand-cyan" size={32} />
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-widest uppercase">Admin Verification</h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-2">Precision Capital Restricted Terminal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Entry Pin</label>
              <input 
                type="password" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-[#050a12] border border-[#1a2d42] p-4 text-white font-mono text-center tracking-[1em] focus:outline-none focus:border-brand-cyan transition-all"
                placeholder="****"
                autoFocus
              />
              {error && <p className="text-[9px] font-mono text-brand-red font-bold uppercase text-center mt-2 animate-pulse">Access Denied: Invalid Hash</p>}
            </div>

            <button className="w-full bg-brand-cyan text-[#050a12] font-bold py-5 uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,209,0.2)]">
              Decrypt Session
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-3">
            <ShieldAlert size={14} className="text-slate-700" />
            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em]">Sovereign Node Auth v4.0</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a12] text-white font-sans selection:bg-brand-cyan/30">
      <div className="noise-overlay" />
      <Outlet />
    </div>
  );
}
