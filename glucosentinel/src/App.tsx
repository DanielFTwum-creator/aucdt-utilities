import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import { Login } from './pages/Login';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminDiagnostics from './pages/AdminDiagnostics';
import AdminTesting from './pages/AdminTesting';
import AdminLogs from './pages/AdminLogs';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="diagnostics" element={<AdminDiagnostics />} />
            <Route path="testing" element={<AdminTesting />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
