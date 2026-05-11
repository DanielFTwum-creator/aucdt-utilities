import AdminLayout from "./AdminLayout";

export default function Diagnostics() {
  return (
    <AdminLayout>
      <h2 className="font-masthead text-4xl mb-8">System Diagnostics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[var(--bg-elevated)] p-6 border border-[var(--border-subtle)]">
          <h3 className="font-label text-[var(--accent-red)] mb-4">Environment</h3>
          <pre className="font-mono text-xs text-[var(--text-muted)]">
            NODE_ENV: {process.env.NODE_ENV || 'development'}
            <br />
            REACT_VERSION: 19.0.0
            <br />
            BUILD_TIME: {new Date().toISOString()}
          </pre>
        </div>
        <div className="bg-[var(--bg-elevated)] p-6 border border-[var(--border-subtle)]">
          <h3 className="font-label text-[var(--accent-red)] mb-4">Status</h3>
          <div className="flex items-center gap-2 font-mono text-sm">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            SYSTEM OPERATIONAL
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
