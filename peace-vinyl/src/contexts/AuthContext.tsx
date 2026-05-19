import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userOrEmail?: User | string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  useEffect(() => {
    const stored = sessionStorage.getItem('peace_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        sessionStorage.removeItem('peace_user');
      }
    }

    // Handle OAuth callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      console.error('OAuth error:', error);
    } else if (code && state === sessionStorage.getItem('oauth_state')) {
      exchangeCodeForUser(code);
    }

    setIsLoading(false);
  }, []);

  const exchangeCodeForUser = async (code: string) => {
    try {
      const response = await fetch('/api/auth/google/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
      });

      if (response.ok) {
        const { user: userData } = await response.json();
        login(userData);
      }
    } catch (err) {
      console.error('OAuth exchange error:', err);
    }
  };

  const login = (userOrEmail?: User | string) => {
    if (typeof userOrEmail === 'object') {
      // Direct login with user object (from OAuth callback)
      setUser(userOrEmail);
      sessionStorage.setItem('peace_user', JSON.stringify(userOrEmail));
      sessionStorage.removeItem('oauth_state');
      return;
    }

    // OAuth login flow
    const scope = 'openid profile email';
    const responseType = 'code';
    const oauthState = Math.random().toString(36).substring(7);

    sessionStorage.setItem('oauth_state', oauthState);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: responseType,
      scope,
      state: oauthState,
      prompt: 'select_account',
      access_type: 'offline',
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  const logout = () => {
    sessionStorage.removeItem('peace_user');
    sessionStorage.removeItem('oauth_state');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
