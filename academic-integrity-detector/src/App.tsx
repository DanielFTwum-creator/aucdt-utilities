import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Diagnostics } from './pages/admin/Diagnostics';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F2EBD9] dark:bg-[#0F0C07] text-[#0F0C07] dark:text-[#F2EBD9] transition-colors duration-500 font-body">
        <style>
            { `
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Bebas+Neue&display=swap');
            .font-display { font-family: 'Playfair Display', serif; }
            .font-body { font-family: 'Cormorant Garamond', serif; }
            .font-label { font-family: 'Bebas Neue', sans-serif; }
            ` }
        </style>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="admin/*" element={<Diagnostics />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
