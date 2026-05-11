
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TimetablePage from './pages/TimetablePage';
import ReportsPage from './pages/ReportsPage';
import DataManagementPage from './pages/DataManagementPage';
import AuditLogPage from './pages/AuditLogPage';
import NotificationsPage from './pages/NotificationsPage';
import Layout from './components/Layout';
import { UserRole } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Main />
      </HashRouter>
    </AuthProvider>
  );
};

const Main: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/" element={user ? <Layout><DashboardPage /></Layout> : <Navigate to="/login" />} />
            <Route path="/timetable" element={user ? <Layout><TimetablePage /></Layout> : <Navigate to="/login" />} />
            <Route path="/notifications" element={user ? <Layout><NotificationsPage /></Layout> : <Navigate to="/login" />} />
            
            {/* Admin only routes */}
            <Route path="/reports" element={
                <ProtectedRoute role={UserRole.ADMIN}>
                    <Layout><ReportsPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/data-management" element={
                <ProtectedRoute role={UserRole.ADMIN}>
                    <Layout><DataManagementPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/audit-log" element={
                <ProtectedRoute role={UserRole.ADMIN}>
                    <Layout><AuditLogPage /></Layout>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
    );
};


interface ProtectedRouteProps {
    role: UserRole;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== role) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};


export default App;
