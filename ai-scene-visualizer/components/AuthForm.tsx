import React, { useState } from 'react';

interface AuthFormProps {
    onLoginSuccess: (username: string) => void;
}

const USERS_STORAGE_KEY = 'ai-scene-visualizer-users';

const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const getUsers = (): { username: string; password?: string }[] => {
        try {
            const users = localStorage.getItem(USERS_STORAGE_KEY);
            return users ? JSON.parse(users) : [];
        } catch { return []; }
    };

    const saveUsers = (users: { username: string; password?: string }[]) => {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }

        const users = getUsers();
        const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (isLoginView) {
            if (existingUser && existingUser.password === password) {
                onLoginSuccess(username);
            } else {
                setError('Invalid username or password.');
            }
        } else {
            if (existingUser) {
                setError('Username already exists. Please choose another.');
            } else {
                saveUsers([...users, { username, password }]);
                onLoginSuccess(username);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-sans p-4">
            <div className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                        {isLoginView ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="mt-2 text-slate-400">
                        {isLoginView ? 'Sign in to access your creations' : 'Join to start visualizing scenes'}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            id="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-black/30 border-2 border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-amber-400"
                            placeholder="Username"
                            aria-invalid={!!error}
                            aria-errormessage="auth-error"
                        />
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-black/30 border-2 border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-amber-400"
                            placeholder="Password"
                            aria-invalid={!!error}
                            aria-errormessage="auth-error"
                        />
                    </div>

                    {error && <p id="auth-error" className="text-sm text-red-400 text-center" role="alert">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 text-base font-bold rounded-lg text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-90 transition-opacity"
                        >
                            {isLoginView ? 'Sign In' : 'Register & Sign In'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-slate-400">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => { setIsLoginView(!isLoginView); setError(null); }}
                        className="font-semibold text-amber-400 hover:text-amber-300 ml-1"
                    >
                        {isLoginView ? 'Register' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
