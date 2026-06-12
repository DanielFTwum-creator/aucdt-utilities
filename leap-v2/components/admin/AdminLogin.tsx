import React, { useState, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import type { AppContextType } from '../../types';

export const AdminLogin: React.FC = () => {
    const { handleLoginSuccess } = useContext(AppContext) as AppContextType;
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
        if (password === ADMIN_PASSWORD) {
            handleLoginSuccess();
        } else {
            setError('Invalid password. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-slide-in-up">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Administrator Access
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Enter password to access the dashboard
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="password-admin" className="sr-only">Password</label>
                            <input
                                id="password-admin"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                required
                                aria-invalid={!!error}
                                aria-describedby={error ? "password-error" : undefined}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    {error && <p id="password-error" className="text-red-500 text-sm text-center" role="alert">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                     <p className="text-center text-xs text-gray-500">
                        {process.env.ADMIN_PASSWORD ? 'Hint: Password is configured via environment variable.' : 'Hint: use `admin123`'}
                     </p>
                </form>
            </div>
        </div>
    );
};