import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuditLogService } from '@/services/auditLog';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'recruiter' | 'hiring_manager' | 'candidate';
}

interface AuthContextType {
  user: User | null;
  login: (role: User['role'], password?: string, email?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session (mock)
    const storedUser = localStorage.getItem('talentverify_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (role: User['role'], password?: string, email?: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      // Default email for admin if not provided (legacy support)
      const loginEmail = role === 'admin' && !email ? 'admin@talentverify.com' : email;
      
      // If no email provided for non-admin, we can't login via API unless we use the mock fallback (which we are replacing).
      // But for the existing "Quick Login" buttons in Login.tsx, they don't provide email/password.
      // To support "User auth", we should probably require them.
      // However, to avoid breaking the app immediately, I'll fallback to mock if no credentials provided?
      // No, the user asked for "User auth", implying real auth.
      // So I will implement the API call. If it fails (e.g. missing creds), it fails.
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role, 
          email: loginEmail, 
          password 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        if (role === 'admin') {
             AuditLogService.log('LOGIN_FAILED', 'unknown', 'system', `Failed admin login attempt: ${data.error}`);
        }
        setIsLoading(false);
        return false;
      }

      const user = data.user;
      setUser(user);
      localStorage.setItem('talentverify_user', JSON.stringify(user));
      
      AuditLogService.log('LOGIN_SUCCESS', user.id.toString(), user.name, `User logged in as ${role}`);

      if (role === 'candidate') {
        navigate('/portal');
      } else if (role === 'admin') {
        navigate('/admin/diagnostics');
      } else {
        navigate('/dashboard');
      }
      
      setIsLoading(false);
      return true;

    } catch (err) {
      console.error('Login error:', err);
      setError('Network error during login');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    if (user) {
      AuditLogService.log('LOGOUT', user.id.toString(), user.name, 'User logged out');
    }
    setUser(null);
    localStorage.removeItem('talentverify_user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
