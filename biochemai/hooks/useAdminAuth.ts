import { useState } from 'react';
import { getAdminConfig, setAdminConfig, addAuditLog } from '../lib/db';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (inputPassword: string) => {
    const storedPassword = await getAdminConfig('adminPassword');
    if (!storedPassword) {
      await setAdminConfig('adminPassword', inputPassword);
      await addAuditLog('Admin Login', 'First admin password set.');
      setIsAuthenticated(true);
      return true;
    }
    if (inputPassword === storedPassword) {
      await addAuditLog('Admin Login', 'Successful login.');
      setIsAuthenticated(true);
      return true;
    }
    await addAuditLog('Admin Login Attempt', 'Failed login attempt.');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};
