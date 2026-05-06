import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginProps {
  addLogEntry: (action: string) => void;
}

const Login: React.FC<LoginProps> = ({ addLogEntry }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    addLogEntry('Admin login attempt.');
    
    const success = await login(password);
    
    setIsLoading(false);
    if (success) {
      addLogEntry('Admin login successful.');
    } else {
      setError('Invalid password.');
      addLogEntry('Admin login failed.');
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600 dark:text-gray-400 mb-2 font-semibold">Password</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-pink-500 focus:bg-white dark:focus:bg-gray-800 rounded-lg outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <button type="submit" className="w-full px-6 py-3 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors disabled:bg-pink-400" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;