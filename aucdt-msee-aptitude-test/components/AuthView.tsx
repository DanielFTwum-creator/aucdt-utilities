import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AUCDT_COLORS } from '../constants';
import { MessageDisplay } from './common';
import { Message } from '../types';
import { UserPlus, LogIn, Shield } from 'lucide-react';

interface AuthViewProps {
    isAdminLogin: boolean;
    onForgotPassword: () => void;
    onAdminForgotPassword: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ isAdminLogin, onForgotPassword, onAdminForgotPassword }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<Message | null>(null);
    const { signUp, signIn, error: authError } = useAuth();

    useEffect(() => {
      // If the view switches to admin login, we should not be in registration mode.
      if (isAdminLogin) {
        setIsRegistering(false);
      }
    }, [isAdminLogin]);
    
    useEffect(() => {
        // Display auth errors from the hook
        if(authError) {
            setMessage({ text: authError, type: 'error' });
        }
    }, [authError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        let success = false;
        if (isRegistering && !isAdminLogin) {
            success = await signUp(email, password);
        } else {
            success = await signIn(email, password);
        }
        // The useAuth hook will handle navigation on success, so we just need to handle failure.
        if (!success && !authError) { // Show a generic message if the hook didn't set one
            setMessage({ text: 'An unexpected error occurred.', type: 'error' });
        }
    };

    const renderTitle = () => {
        if (isAdminLogin) return 'Admin Access';
        return isRegistering ? 'Create Student Account' : 'Student Sign In';
    };

    const renderDescription = () => {
        if (isAdminLogin) return 'Sign in to access the admin dashboard.';
        return isRegistering ? 'Sign up to begin your exam.' : 'Sign in to access your exam.';
    };

    const renderIcon = () => {
        if (isAdminLogin) return <Shield size={40} style={{ color: 'var(--primary-text-color)' }} />;
        return isRegistering ? <UserPlus size={40} style={{ color: 'var(--primary-text-color)' }} /> : <LogIn size={40} style={{ color: 'var(--primary-text-color)' }} />;
    }

    return (
        <div className="w-full max-w-md mx-auto bg-[var(--card-background)] rounded-xl shadow-lg p-8 md:p-12 text-center border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
            <div className="mx-auto mb-6 bg-[var(--card-border-color)] p-3 rounded-full w-fit">
              {renderIcon()}
            </div>
            <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--primary-text-color)' }}>
                {renderTitle()}
            </h1>
            <p className="text-lg mb-8">
                {renderDescription()}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <MessageDisplay message={message} />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    aria-label="Email Address"
                    required
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    aria-label="Password"
                    required
                    minLength={6}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                />
                <button
                    type="submit"
                    className="w-full py-3 px-10 rounded-lg text-lg font-bold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                    style={{ backgroundColor: AUCDT_COLORS.deepBrown, color: AUCDT_COLORS.white }}>
                    {isRegistering ? 'Register' : 'Sign In'}
                </button>
            </form>
            <div className="mt-6 text-center">
                {!isAdminLogin && (
                    <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm hover:underline" style={{ color: 'var(--text-color)' }}>
                        {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                    </button>
                )}
            </div>
            {!isRegistering && (
                 <div className="mt-4 text-center">
                    <button onClick={isAdminLogin ? onAdminForgotPassword : onForgotPassword} className="text-sm hover:underline" style={{ color: 'var(--text-color)' }}>
                        Forgot Password?
                    </button>
                </div>
            )}
            <p className="mt-4">
                <a href={isAdminLogin ? window.location.pathname : `${window.location.pathname}?admin=true`} className="text-sm hover:underline" style={{ color: 'var(--text-color)' }}>
                    {isAdminLogin ? "Return to Student Portal" : "Access Admin Portal"}
                </a>
            </p>
        </div>
    );
};