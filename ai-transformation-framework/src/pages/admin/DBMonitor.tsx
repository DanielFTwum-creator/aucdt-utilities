import AdminLayout from "./AdminLayout";

export default function DBMonitor() {
  return (
    <AdminLayout>
      <h2 className="font-masthead text-4xl mb-8">Database Monitor</h2>
      <div className="bg-[var(--bg-elevated)] p-6 border border-[var(--border-subtle)]">
        <h3 className="font-label text-[var(--accent-red)] mb-4">Connection Status</h3>
        <div className="flex items-center gap-2 font-mono text-sm mb-4">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          CONNECTED (Simulated)
        </div>
        <pre className="font-mono text-xs text-[var(--text-muted)] bg-black p-4 border border-[var(--border-subtle)]">
          Connection Pool: 5/10 active
          Latency: 12ms
          Last Backup: {new Date().toISOString()}
        </pre>
      </div>
    </AdminLayout>
  );
}
