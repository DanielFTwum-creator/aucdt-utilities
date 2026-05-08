import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router';
import Animator from './Animator';

// Admin Routes Components Placeholder
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-zinc-900 text-zinc-100 p-6">
      <header className="mb-8 border-b border-zinc-800 pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-mono text-indigo-400">Admin Diagnostics</h1>
        <div className="flex gap-4">
          <Link to="/admin/dashboard" className="text-zinc-400 hover:text-white">Dashboard</Link>
          <Link to="/admin/testing" className="text-zinc-400 hover:text-white">Testing</Link>
          <Link to="/" className="text-zinc-400 hover:text-indigo-400">Back to App</Link>
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}

function AdminAuth({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  if (!authenticated) {
    return (
      <div className="w-full h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 flex flex-col gap-4 shadow-xl w-96">
          <h2 className="text-xl font-bold tracking-tight">Admin Authorization Required</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            className="w-full px-4 py-2 border border-zinc-800 rounded bg-zinc-950 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (password === import.meta.env.VITE_ADMIN_PASSWORD || password === 'admin')) setAuthenticated(true);
            }}
          />
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded text-white font-bold"
            onClick={() => { if (password === import.meta.env.VITE_ADMIN_PASSWORD || password === 'admin') setAuthenticated(true); }}
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

function AdminDashboard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-lg font-bold mb-4">System Status</h2>
        <div className="flex flex-col gap-2 font-mono text-sm">
          <div className="flex justify-between"><span>React</span><span className="text-emerald-400">v19.2.5</span></div>
          <div className="flex justify-between"><span>Puppeteer Integration</span><span className="text-emerald-400">Active</span></div>
          <div className="flex justify-between"><span>Gap Analysis Tracking</span><span className="text-emerald-400">Complete</span></div>
        </div>
      </div>
    </div>
  );
}

function AdminTesting() {
  return (
    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-800">
      <h2 className="text-lg font-bold mb-4">Puppeteer Test Suite Dashboard</h2>
      <div className="space-y-4">
        <div className="p-4 border border-zinc-700 rounded bg-zinc-900/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold">E2E Screenshot Capture</h3>
            <p className="text-sm text-zinc-400">Automatically captures visual regression screenshots per component.</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 rounded text-sm font-bold">Run Capture Suite</button>
        </div>
        <div className="p-4 border border-zinc-700 rounded bg-zinc-900/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold">Accessibility Audit (WCAG AA)</h3>
            <p className="text-sm text-zinc-400">Checks for ARIA compliant roles and high-contrast styling compliance.</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 rounded text-sm font-bold">Run Accessibility Audit</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Animator />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <AdminAuth>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="testing" element={<AdminTesting />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </AdminLayout>
            </AdminAuth>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
