import React, { useState, useEffect, useRef } from 'react';
import Spinner from './Spinner';
import { sendNotification } from '../services/notificationService';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSendLink: (email: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, onSendLink }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();

    const modal = modalRef.current;
    if (!modal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Send password reset email via notification service
    const resetLink = `https://markai.app/reset?token=${btoa(email)}-${Date.now()}`; // mock token
    await sendNotification({
        to: email,
        subject: 'Your MarkAI Password Reset Link',
        body: `
            <h1>Password Reset Request</h1>
            <p>We received a request to reset your password. Click the link below to proceed:</p>
            <p><a href="${resetLink}" target="_blank" style="padding: 10px 15px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Reset Your Password</a></p>
            <p>If you did not request this, you can safely ignore this email.</p>
            <br/>
            <p>Thank you,<br/>The MarkAI Team</p>
        `
    });

    onSendLink(email);
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div ref={modalRef} className="bg-secondary rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="reset-password-title">
        <h2 id="reset-password-title" className="text-2xl font-bold text-primary mb-2">Reset Password</h2>
        
        {isSubmitted ? (
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-accent-tertiary mx-auto my-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-secondary mb-6">If an account exists for <span className="font-semibold text-primary">{email}</span>, you will receive an email with instructions to reset your password.</p>
            <div className="flex justify-end">
              <button onClick={onClose} className="px-6 py-2 rounded-lg bg-accent-primary text-white font-bold hover:bg-accent-primary/90 transition">Close</button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-secondary mb-6">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-semibold text-primary mb-2">Email Address</label>
                <input
                  ref={emailInputRef}
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2 rounded-lg text-primary bg-primary hover:bg-border-default font-bold transition disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isLoading || !email} className="px-6 py-2 rounded-lg bg-accent-primary text-white font-bold hover:bg-accent-primary/90 transition flex items-center justify-center w-40 disabled:bg-gray-400">
                  {isLoading ? <Spinner/> : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;