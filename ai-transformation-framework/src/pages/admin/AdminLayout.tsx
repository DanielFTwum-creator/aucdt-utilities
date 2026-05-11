import { Link } from "react-router-dom";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex">
      <aside className="w-64 bg-[var(--bg-elevated)] border-r border-[var(--border-subtle)] p-6">
        <h1 className="font-masthead text-2xl text-[var(--accent-red)] mb-8">ADMIN</h1>
        <nav className="flex flex-col gap-4 font-mono text-sm">
          <Link to="/admin/diagnostics" className="hover:text-[var(--accent-red)]">DIAGNOSTICS</Link>
          <Link to="/admin/db-monitor" className="hover:text-[var(--accent-red)]">DB MONITOR</Link>
          <Link to="/admin/testing" className="hover:text-[var(--accent-red)]">TESTING</Link>
          <Link to="/admin/logs" className="hover:text-[var(--accent-red)]">LOGS</Link>
          <Link to="/admin/performance" className="hover:text-[var(--accent-red)]">PERFORMANCE</Link>
          <Link to="/" className="mt-8 text-[var(--text-muted)] hover:text-white">← BACK TO SITE</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
