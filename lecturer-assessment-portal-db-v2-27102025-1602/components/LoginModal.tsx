import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => void;
  error: string;
}

type ModalView = 'login' | 'forgotPassword' | 'resetSent';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, error }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [view, setView] = useState<ModalView>('login');

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setPassword('');
      setEmail('');
      setView('login');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a POST to /api/v1/auth/forgot-password
    console.log(`SIMULATING API: Requesting password reset for ${email}`);
    // We always show the success message to prevent email enumeration.
    setView('resetSent');
  };

  const renderLoginView = () => (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center text-[#6B1028] dark:text-[#FFA07A] [.high-contrast_&]:text-yellow-300">Admin Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 [.high-contrast_&]:text-white mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 [.high-contrast_&]:bg-black [.high-contrast_&]:border-yellow-300 [.high-contrast_&]:text-white rounded-md focus:ring-2 focus:ring-[#8B1538] dark:focus:ring-rose-400 [.high-contrast_&]:focus:ring-cyan-400 focus:border-[#8B1538] dark:focus:border-rose-400 [.high-contrast_&]:focus:border-cyan-400"
            required
            autoFocus
          />
        </div>
        <div className="text-right text-sm mb-4">
          <button
            type="button"
            onClick={() => setView('forgotPassword')}
            className="font-medium text-sky-600 dark:text-sky-400 [.high-contrast_&]:text-cyan-400 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        {error && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-slate-700 bg-slate-100 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 [.high-contrast_&]:bg-black [.high-contrast_&]:text-white [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-white bg-[#8B1538] hover:bg-opacity-90 [.high-contrast_&]:bg-cyan-500 [.high-contrast_&]:text-black transition-colors font-bold"
          >
            Login
          </button>
        </div>
      </form>
    </>
  );

  const renderForgotPasswordView = () => (
    <>
      <h2 className="text-2xl font-bold mb-2 text-center text-[#6B1028] dark:text-[#FFA07A] [.high-contrast_&]:text-yellow-300">Reset Password</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 [.high-contrast_&]:text-white text-center mb-6">Enter your admin email to receive a password reset link.</p>
      <form onSubmit={handleForgotPasswordSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 [.high-contrast_&]:text-white mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 [.high-contrast_&]:bg-black [.high-contrast_&]:border-yellow-300 [.high-contrast_&]:text-white rounded-md focus:ring-2 focus:ring-[#8B1538] dark:focus:ring-rose-400 [.high-contrast_&]:focus:ring-cyan-400 focus:border-[#8B1538] dark:focus:border-rose-400 [.high-contrast_&]:focus:border-cyan-400"
            required
            autoFocus
            placeholder="admin@aucdt.edu.gh"
          />
        </div>
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={() => setView('login')}
            className="text-sm font-medium text-sky-600 dark:text-sky-400 [.high-contrast_&]:text-cyan-400 hover:underline"
          >
            &larr; Back to Login
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-white bg-[#8B1538] hover:bg-opacity-90 transition-colors font-bold flex items-center gap-2 [.high-contrast_&]:bg-cyan-500 [.high-contrast_&]:text-black"
          >
            <Mail size={16} />
            Send Reset Link
          </button>
        </div>
      </form>
    </>
  );
  
  const renderResetSentView = () => (
    <div className="text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-emerald-500 [.high-contrast_&]:text-green-400" />
      <h2 className="text-2xl font-bold mt-4 text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white">Check Your Email</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400 [.high-contrast_&]:text-slate-300">
        If an account with the provided email exists, a password reset link has been sent. Please check your inbox and spam folder.
      </p>
      <div className="mt-8">
          <button
            type="button"
            onClick={() => setView('login')}
            className="w-full px-4 py-2 rounded-md text-slate-700 bg-slate-100 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 [.high-contrast_&]:bg-black [.high-contrast_&]:text-white [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 transition-colors font-medium"
          >
            &larr; Back to Login
          </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case 'forgotPassword':
        return renderForgotPasswordView();
      case 'resetSent':
        return renderResetSentView();
      case 'login':
      default:
        return renderLoginView();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border-2 [.high-contrast_&]:border-yellow-300 p-8 rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
    </div>
  );
};

export default LoginModal;