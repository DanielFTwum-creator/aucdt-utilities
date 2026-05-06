/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CategoryView from './pages/CategoryView';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <Router>
          <div className="min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300">
            <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2" aria-label="Shortcut Master Home">
                  <span className="text-2xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">Shortcut</span>
                  <span className="text-2xl font-bold tracking-tighter text-[var(--text-primary)]">Master</span>
                </Link>
                <nav className="flex items-center gap-6">
                  <Link to="/" className="text-sm font-medium text-[var(--text-secondary)] hover:text-indigo-600 transition-colors" aria-label="Go to Home">Home</Link>
                  <Link to="/admin" className="text-sm font-medium text-[var(--text-secondary)] hover:text-indigo-600 transition-colors" aria-label="Go to Admin Panel">Admin</Link>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            
            <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/category/:id" element={<CategoryView />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AdminProvider>
    </ThemeProvider>
  );
}
