import React, { useState } from 'react';

interface AdminLoginProps {
    onLogin: (password: string) => void;
    onCancel: () => void;
    error?: string | null;
    isLockedOut?: boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel, error, isLockedOut }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLockedOut) {
            onLogin(password);
        }
    };

    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-login-title"
        >
            <div
                className="relative w-full max-w-md bg-brand-card-bg border border-brand-gold/30 rounded-none shadow-2xl p-8"
                onClick={handleModalContentClick}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>
                <button 
                    onClick={onCancel} 
                    className="absolute top-3 right-3 text-brand-gold-pale hover:text-brand-gold transition-colors p-1"
                    aria-label="Close admin login"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 id="admin-login-title" className="text-3xl font-playfair font-bold text-center text-brand-cream mb-6 uppercase tracking-wide">Admin Access</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline font-dm-sans text-sm">{error}</span>
                        </div>
                    )}
                    <div>
                        <label htmlFor="password-input" className="block text-lg font-cormorant italic text-brand-gold">Password</label>
                        <input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-brand-input-bg border-b border-brand-gold/50 text-brand-cream placeholder-brand-gold-pale/30 focus:outline-none focus:border-brand-gold transition-colors font-dm-sans disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                            autoFocus
                            placeholder="Enter secure key..."
                            disabled={isLockedOut}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="w-full justify-center py-2 px-4 border border-brand-gold/30 text-sm font-bebas tracking-wider text-brand-gold-pale hover:text-brand-gold hover:border-brand-gold transition-all uppercase">Cancel</button>
                        <button type="submit" disabled={isLockedOut} className="w-full justify-center py-2 px-4 bg-brand-gold text-brand-ink text-sm font-bebas tracking-wider hover:bg-brand-gold-light transition-all uppercase shadow-lg shadow-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
