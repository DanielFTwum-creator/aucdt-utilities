import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Admin/Login';
import Dashboard from '@/pages/Admin/Dashboard';
import Diagnostics from '@/pages/Admin/Diagnostics';
import Testing from '@/pages/Admin/Testing';
import DbMonitor from '@/pages/Admin/DbMonitor';
import Logs from '@/pages/Admin/Logs';
import Performance from '@/pages/Admin/Performance';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="/admin/diagnostics" replace />} />
          <Route path="diagnostics" element={<Diagnostics />} />
          <Route path="testing" element={<Testing />} />
          <Route path="db-monitor" element={<DbMonitor />} />
          <Route path="logs" element={<Logs />} />
          <Route path="performance" element={<Performance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
