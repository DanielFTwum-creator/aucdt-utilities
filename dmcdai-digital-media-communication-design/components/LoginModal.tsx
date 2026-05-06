import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
  mode?: 'access' | 'admin';
  hideCancel?: boolean;
}

const ACCESS_DOMAIN = '@techbridge.edu.gh';

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, mode = 'admin', hideCancel = false }) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const { requestOtp, verifyOtp, loginAdmin, pendingEmail } = useAuth();

    const handleAccessSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 'email') {
            const generatedCode = await requestOtp(email);
            if (!generatedCode) {
                setError(`Only ${ACCESS_DOMAIN} addresses can access this application, or the email could not be sent.`);
                return;
            }
            setError('');
            setInfo('A verification code has been sent to your Techbridge email.');
            setStep('otp');
            return;
        }

        try {
            if (verifyOtp(code.trim())) {
                onClose();
            } else {
                setError('Incorrect verification code. Please try again.');
                setCode('');
            }
        } catch (err) {
            console.error('OTP verification error:', err);
            setError('Verification failed. Please try again.');
            setCode('');
        }
    };

    const handleAdminSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginAdmin(password)) {
            onClose();
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    const title = mode === 'access' ? 'Techbridge 2FA Login' : 'Admin Login';
    const buttonText = mode === 'access' ? (step === 'email' ? 'Send code' : 'Verify code') : 'Login';

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            aria-modal="true"
            role="dialog"
            aria-labelledby="login-title"
        >
            <div className="bg-[var(--color-background-card)] p-8 rounded-lg shadow-2xl w-full max-w-sm border border-[var(--color-border-card)]">
                <h2 id="login-title" className="text-2xl font-bold text-[var(--color-foreground)] mb-4 font-playfair">{title}</h2>
                <form onSubmit={mode === 'access' ? handleAccessSubmit : handleAdminSubmit}>
                    {mode === 'access' ? (
                        <>
                            {step === 'email' ? (
                                <>
                                    <label htmlFor="email" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 font-inter">
                                        Techbridge Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                            setInfo('');
                                        }}
                                        className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 font-inter"
                                        autoFocus
                                    />
                                </>
                            ) : (
                                <>
                                    <label htmlFor="email" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 font-inter">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={pendingEmail ?? email}
                                        disabled
                                        className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground-muted)] transition duration-200 font-inter"
                                    />
                                    <label htmlFor="code" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 mt-4 font-inter">
                                        Verification Code
                                    </label>
                                    <input
                                        id="code"
                                        type="text"
                                        value={code}
                                        onChange={(e) => {
                                            setCode(e.target.value);
                                            setError('');
                                        }}
                                        className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 font-inter"
                                        autoFocus
                                    />
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 font-inter">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 font-inter font-mono"
                                autoFocus
                            />
                        </>
                    )}

                    {info && <p className="text-green-400 text-sm mt-2 font-inter">{info}</p>}
                    {error && <p className="text-red-400 text-sm mt-2 font-inter">{error}</p>}
                    <div className="mt-6 flex justify-end gap-4 font-inter">
                        {!hideCancel && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Cancel login"
                                title="Discard login attempt"
                                className="px-4 py-2 rounded-md text-sm font-semibold text-[var(--color-foreground)] bg-transparent hover:bg-[var(--color-background-card-hover)] transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            aria-label={buttonText}
                            title={buttonText}
                            className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[#b6963a] transition-colors"
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
