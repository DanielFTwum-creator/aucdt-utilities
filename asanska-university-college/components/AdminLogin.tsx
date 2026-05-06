import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from './Icons';

const ADMIN_PASSWORD = 'password123'; // In a real app, this should be an environment variable.

const AdminLogin: React.FC<{ onLoginSuccess: () => void; onClose: () => void; }> = ({ onLoginSuccess, onClose }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus the input field when the modal opens
        inputRef.current?.focus();

        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password === ADMIN_PASSWORD) {
            onLoginSuccess();
        } else {
            setError('Invalid password. Please try again.');
            setPassword('');
        }
    };

    return (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" 
          aria-modal="true" 
          role="dialog"
          aria-labelledby="login-modal-title"
        >
            <div className="bg-aucdt-background dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md relative">
                <button 
                  onClick={onClose} 
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                  aria-label="Close login modal"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 id="login-modal-title" className="text-2xl font-bold text-aucdt-primary dark:text-white text-center mb-6">
                  Admin Login
                </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-aucdt-dark-text dark:text-gray-300">
                            Password
                        </label>
                        <input
                            ref={inputRef}
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aucdt-secondary focus:border-aucdt-secondary sm:text-sm text-aucdt-dark-text dark:text-white"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-white bg-aucdt-primary hover:bg-aucdt-secondary hover:text-aucdt-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aucdt-primary transition-all duration-300"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
