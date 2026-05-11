import { useState, useEffect } from 'react';
import { getAdminConfig } from '../lib/db';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const login = async (inputPassword: string) => {
    const storedPassword = await getAdminConfig('adminPassword');
    if (!storedPassword) {
      // If no password set, set the first input as the password
      await setAdminConfig('adminPassword', inputPassword);
      setIsAuthenticated(true);
      return true;
    }
    if (inputPassword === storedPassword) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};
