import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { VentureProvider } from './context/VentureContext';
import { AdminProvider } from './context/AdminContext';
import MatrixView from './routes/MatrixView';
import CompareStream from './routes/CompareStream';
import AdminLayout from './routes/admin/AdminLayout';
import AdminDashboard from './routes/admin/Dashboard';
import Diagnostics from './routes/admin/Diagnostics';

export default function App() {
  return (
    <AdminProvider>
      <VentureProvider>
        <Routes>
          <Route path="/" element={<MatrixView />} />
          <Route path="/compare" element={<CompareStream />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="diagnostics" element={<Diagnostics />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </VentureProvider>
    </AdminProvider>
  );
}
