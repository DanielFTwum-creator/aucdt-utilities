import { useState } from 'react';
import { X, TrendingUp, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (email: string, password: string, name: string) => Promise<boolean>;
  onGoogleLogin: () => void;
  onClose: () => void;
  error: string | null;
  loading: boolean;
}

export default function AuthModal({ onLogin, onRegister, onGoogleLogin, onClose, error, loading }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await onLogin(email, password);
    } else {
      await onRegister(email, password, name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="Authentication">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-8 shadow-2xl relative mx-4">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-indigo-600" size={28} />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">StockPulse</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {mode === 'login' ? 'Sign in to access your portfolio.' : 'Start your 14-day free trial. No credit card required.'}
        </p>

        {error && (
          <div role="alert" className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg mb-4">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-60 mb-5"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400 dark:text-gray-500">
            <span className="bg-white dark:bg-gray-900 px-3">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Jane Smith"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-transparent focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
          )}
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-transparent focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                minLength={8}
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-transparent focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            aria-busy={loading}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>

        {mode === 'register' && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.1 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.9 6.1C12.2 13.2 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-2.8-.4-4.1H24v7.8h12.4c-.3 2.1-1.6 5.2-4.6 7.3l7.1 5.5c4.2-3.9 6.6-9.6 6.6-16.5z" />
      <path fill="#FBBC05" d="M10.4 28.6a14.5 14.5 0 0 1 0-9.2l-7.9-6.1a24 24 0 0 0 0 21.4l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.6 2.3-8.8 2.3-6.4 0-11.8-3.7-13.6-9.4l-7.9 6.1C6.4 42.6 14.6 48 24 48z" />
    </svg>
  );
}
