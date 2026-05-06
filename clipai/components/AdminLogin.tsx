import React, { useState, useEffect } from 'react';

interface AdminLoginProps {
    onLoginSuccess: () => void;
    onBack: () => void;
}

const PASSWORD_KEY = 'clipai-admin-password';

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
    const [storedPassword, setStoredPassword] = useState<string | null>(null);
    const [isSetupMode, setIsSetupMode] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const pass = localStorage.getItem(PASSWORD_KEY);
        setStoredPassword(pass);
        if (!pass) {
            setIsSetupMode(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === storedPassword) {
            onLoginSuccess();
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };
    
    const handleSetup = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
             setError('Password must be at least 6 characters long.');
             return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        localStorage.setItem(PASSWORD_KEY, password);
        onLoginSuccess();
    };

    if (storedPassword === null) {
        // Still loading from localStorage, show a blank state to avoid flicker
        return <div className="hc-bg hc-border hc-text max-w-md mx-auto mt-10 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700" style={{ minHeight: '350px' }}></div>;
    }

    if (isSetupMode) {
        return (
            <div className="hc-bg hc-border hc-text max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white hc-text">Set Admin Password</h2>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">This is the first time you're accessing the admin panel. Please set a secure password.</p>
                <form onSubmit={handleSetup} className="mt-6 space-y-6">
                    <div>
                        <label htmlFor="password-set" className="sr-only">New Password</label>
                        <input id="password-set" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password (min. 6 characters)" className="hc-bg hc-border hc-text hc-placeholder block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
                    </div>
                     <div>
                        <label htmlFor="password-confirm" className="sr-only">Confirm New Password</label>
                        <input id="password-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="hc-bg hc-border hc-text hc-placeholder block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
                    </div>
                    {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
                    <div className="flex flex-col sm:flex-row-reverse gap-3">
                         <button type="submit" className="w-full justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700">Set Password & Login</button>
                         <button type="button" onClick={onBack} className="w-full justify-center px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Back to App</button>
                    </div>
                </form>
            </div>
        );
    }
    
    return (
        <div className="hc-bg hc-border hc-text max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white hc-text">Admin Access</h2>
            <form onSubmit={handleLogin} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="password-input" className="sr-only">Password</label>
                    <input id="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="hc-bg hc-border hc-text hc-placeholder block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
                <div className="flex flex-col sm:flex-row-reverse gap-3">
                     <button type="submit" className="w-full justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700">Login</button>
                    <button type="button" onClick={onBack} className="w-full justify-center px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Back to App</button>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;