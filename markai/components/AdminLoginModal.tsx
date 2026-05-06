
import React, { useState, useEffect, useRef } from 'react';
import Spinner from './Spinner';
import { useAdmin } from '../contexts/AdminContext';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const { adminLogin } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    passwordInputRef.current?.focus();
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
          return;
        }
        if (event.key === 'Tab') {
            if (event.shiftKey) { // Shift+Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
            } else { // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
            }
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const success = await adminLogin(password);
      if (success) {
        onLoginSuccess();
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div ref={modalRef} className="bg-secondary rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <h2 id="admin-login-title" className="text-2xl font-bold text-primary mb-2">Admin Access</h2>
        <p className="text-secondary mb-6">Please enter the password to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-semibold text-primary mb-2">Password</label>
            <input
              ref={passwordInputRef}
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition"
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2 rounded-lg text-primary bg-primary hover:bg-border-default font-bold transition disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-accent-primary text-white font-bold hover:bg-accent-primary/90 transition flex items-center justify-center w-28 disabled:bg-gray-400">
              {isLoading ? <Spinner/> : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
