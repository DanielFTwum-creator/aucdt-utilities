import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { logEvent } from '../services/auditLogService';
import { apiUrl } from '../services/apiBase';

const TOKEN_STORAGE_KEY = 'msee_auth_token';
const USER_STORAGE_KEY = 'msee_current_user';

// Helper to decode JWT without a library
const decodeJwt = (token: string): any | null => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_STORAGE_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // On initial load, verify token and set user state
    if (token) {
        const decodedUser = decodeJwt(token);
        if (decodedUser && decodedUser.exp * 1000 > Date.now()) {
            const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } else {
            // Token is expired or invalid
            logOut();
        }
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAuthSuccess = (data: { accessToken: string; user: User }) => {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
    setError(null);
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(apiUrl('/api/auth/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Registration failed.');
        }
        // After successful registration, log the user in automatically
        return await signIn(email, password);
    } catch (e: any) {
        setError(e.message);
        setLoading(false);
        return false;
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(apiUrl('/api/auth/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Sign-in failed.');
        }
        handleAuthSuccess(data);
        logEvent(data.user.role === 'admin' ? 'ADMIN_LOGIN_SUCCESS' : 'STUDENT_LOGIN_SUCCESS');
        setLoading(false);
        return true;
    } catch (e: any) {
        setError(e.message);
        logEvent('ADMIN_LOGIN_FAILURE');
        setLoading(false);
        return false;
    }
  };

  const logOut = useCallback(() => {
    if (user) {
        logEvent(user.role === 'admin' ? 'ADMIN_LOGOUT' : 'STUDENT_LOGOUT');
    }
    setUser(null);
    setToken(null);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }, [user]);

  return { user, token, loading, error, signUp, signIn, logOut };
};