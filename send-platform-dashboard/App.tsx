import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import NewJob from './pages/NewJob';
import Schedules from './pages/Schedules';
import Executions from './pages/Executions';
import Diagnostics from './pages/admin/Diagnostics';
import DbMonitor from './pages/admin/DbMonitor';
import Testing from './pages/admin/Testing';
import Logs from './pages/admin/Logs';
import Performance from './pages/admin/Performance';
import ApiGateway from './pages/admin/ApiGateway';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="jobs/new" element={<NewJob />} />
              <Route path="jobs/:id" element={<JobDetail />} />
              <Route path="schedules" element={<Schedules />} />
              <Route path="executions" element={<Executions />} />
              
              {/* Admin Section */}
              <Route path="admin/api-gateway" element={<ApiGateway />} />
              <Route path="admin/diagnostics" element={<Diagnostics />} />
              <Route path="admin/db-monitor" element={<DbMonitor />} />
              <Route path="admin/testing" element={<Testing />} />
              <Route path="admin/logs" element={<Logs />} />
              <Route path="admin/performance" element={<Performance />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;