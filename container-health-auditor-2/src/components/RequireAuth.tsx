import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../authStore';

export function RequireAuth({ children }: { children: React.ReactElement }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
