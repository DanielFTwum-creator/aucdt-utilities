import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './Layout';
import { Dashboard } from './pages/Dashboard';
import { Entities } from './pages/Entities';
import { Health } from './pages/Health';
import { Alerts } from './pages/Alerts';
import { Login } from './pages/Login';
import { Diagnostics } from './pages/admin/Diagnostics';
import { DbMonitor } from './pages/admin/DbMonitor';
import { Logs } from './pages/admin/Logs';
import { Performance } from './pages/admin/Performance';
import { Testing } from './pages/admin/Testing';
import { SentinelConsole } from './pages/admin/SentinelConsole';
import { RequireAuth } from './components/RequireAuth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="entities" element={<Entities />} />
          <Route path="health" element={<Health />} />
          <Route path="alerts" element={<Alerts />} />

          {/* Admin Routes - Protected */}
          <Route path="admin" element={<RequireAuth><Outlet /></RequireAuth>}>
            <Route path="diagnostics" element={<Diagnostics />} />
            <Route path="db-monitor" element={<DbMonitor />} />
            <Route path="logs" element={<Logs />} />
            <Route path="performance" element={<Performance />} />
            <Route path="testing" element={<Testing />} />
            <Route path="sentinel" element={<SentinelConsole />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
