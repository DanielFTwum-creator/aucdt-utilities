import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../authStore';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
