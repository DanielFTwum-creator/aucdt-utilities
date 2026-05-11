import React, { useState } from 'react';
import { Card, Input, Button } from './UIComponents';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      if (username === 'admin' && password === 'password123') {
        onLoginSuccess();
      } else {
        setError('Invalid username or password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center items-center mb-6">
          <svg className="w-12 h-12 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm3-6h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008ZM6 21v-3.093c0-1.16.536-2.22 1.41-2.907l2.224-1.779c.874-.699 2.026-.699 2.9 0l2.223 1.779c.874.687 1.41 1.747 1.41 2.907V21M6 21h12m-6-15.75v.008" />
          </svg>
          <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">Salary Calculator</h1>
        </div>
        <Card title="Secure Sign In">
          <form onSubmit={handleLogin} className="p-6 space-y-6">
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                id="password-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="password123"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" disabled={isLoading} variant="primary" className="w-full">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <p className="text-xs text-center text-gray-500">
                For demo purposes, use username: <strong>admin</strong> and password: <strong>password123</strong>
            </p>
          </form>
        </Card>
      </div>
      <footer className="text-center p-4 text-gray-500 text-sm mt-8">
        <p>&copy; 2025 SalaryCorp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginScreen;
