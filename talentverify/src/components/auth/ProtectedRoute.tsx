import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role if they try to access unauthorized area
    if (user.role === 'candidate') return <Navigate to="/portal" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/diagnostics" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
