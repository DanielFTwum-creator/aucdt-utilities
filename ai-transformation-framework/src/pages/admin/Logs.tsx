import AdminLayout from "./AdminLayout";

export default function Logs() {
  return (
    <AdminLayout>
      <h2 className="font-masthead text-4xl mb-8">System Logs</h2>
      <div className="bg-[var(--bg-elevated)] p-6 border border-[var(--border-subtle)] h-96 overflow-y-auto font-mono text-xs">
        <div className="text-[var(--text-muted)] border-b border-[var(--border-subtle)] py-1">
          [{new Date().toISOString()}] INFO: System initialized
        </div>
        <div className="text-[var(--text-muted)] border-b border-[var(--border-subtle)] py-1">
          [{new Date().toISOString()}] INFO: Admin route accessed
        </div>
        <div className="text-[var(--accent-red)] border-b border-[var(--border-subtle)] py-1">
          [{new Date().toISOString()}] WARN: High memory usage detected (Simulated)
        </div>
      </div>
    </AdminLayout>
  );
}
