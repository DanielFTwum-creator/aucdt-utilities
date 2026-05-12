import React, { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setPassword('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'Tab' && isOpen && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(password);
      if (success) {
        onSuccess();
      } else {
        setError('Incorrect password. Please try again.');
        inputRef.current?.select();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[var(--color-bg-modal-overlay)] z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8">
          <h2 id="password-modal-title" className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Admin Access Required</h2>
          <p className="text-[var(--color-text-secondary)] mb-4">Please enter the administrator password to continue.</p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="admin-password" className="sr-only">Password</label>
                <input
                  ref={inputRef}
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-all duration-200"
                  placeholder="Password"
                />
              </div>
              {error && <p className="text-[var(--color-error)] text-sm">{error}</p>}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-4 py-2.5 font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-border-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-text-tertiary)] focus:ring-offset-[var(--color-bg-primary)] transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !password}
                className="w-full flex items-center justify-center px-4 py-2.5 font-semibold text-[var(--color-text-on-accent)] bg-[var(--color-accent-primary)] rounded-lg hover:bg-[var(--color-accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-[var(--color-bg-primary)] transition disabled:bg-[var(--color-text-tertiary)] disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Verifying...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};