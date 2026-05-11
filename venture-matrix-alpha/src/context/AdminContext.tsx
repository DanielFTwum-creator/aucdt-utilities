import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminState {
  authenticated: boolean;
  apiCallCount: number;
  sessionStart: string;
}

const AdminContext = createContext<{
  state: AdminState;
  login: (pin: string) => boolean;
  incrementApiCount: () => void;
  logout: () => void;
} | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [sessionStart] = useState(new Date().toISOString());

  const login = (pin: string) => {
    // Demo PIN: 1337
    if (pin === '1337' || pin === 'alpha2026') {
      setAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setAuthenticated(false);
  const incrementApiCount = () => setApiCallCount(prev => prev + 1);

  return (
    <AdminContext.Provider value={{ 
      state: { authenticated, apiCallCount, sessionStart }, 
      login, 
      incrementApiCount,
      logout
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminProvider');
  return context;
};
