import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Lock, ArrowRight } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-tuc-ink flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-12 border border-tuc-gold/20 shadow-2xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand-leaf rounded-full flex items-center justify-center mx-auto mb-6 text-tuc-gold">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif mb-2">Admin Access</h1>
          <p className="text-brand-stone text-sm label-caps">LFPaperWorks Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="label-caps mb-4 block">Security Password</label>
            <input 
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full p-4 border-b border-brand-linen focus:border-tuc-gold outline-none transition-all font-serif text-lg text-center tracking-widest"
              placeholder="••••••••"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-4 text-center">Invalid credentials. Attempt logged.</p>}
          </div>

          <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center space-x-3">
            <span>Authorize</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-12 text-[10px] text-brand-stone text-center uppercase tracking-[0.2em] leading-relaxed">
          All administrative actions are recorded in the system audit log. 
          Unauthorized access attempts are strictly monitored.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
