import AdminLayout from "./AdminLayout";

export default function Performance() {
  return (
    <AdminLayout>
      <h2 className="font-masthead text-4xl mb-8">Performance Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-elevated)] p-6 border border-[var(--border-subtle)] text-center">
          <h3 className="font-label text-[var(--text-muted)] mb-2">FCP</h3>
          <div className="font-masthead text-4xl text-green-500">0.8s</div>
        </div>
        <div className="bg-[var(--bg-elevated)] p-6 border border-[var(--border-subtle)] text-center">
          <h3 className="font-label text-[var(--text-muted)] mb-2">LCP</h3>
          <div className="font-masthead text-4xl text-green-500">1.2s</div>
        </div>
        <div className="bg-[var(--bg-elevated)] p-6 border border-[var(--border-subtle)] text-center">
          <h3 className="font-label text-[var(--text-muted)] mb-2">CLS</h3>
          <div className="font-masthead text-4xl text-green-500">0.01</div>
        </div>
      </div>
    </AdminLayout>
  );
}
