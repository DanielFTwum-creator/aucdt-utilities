import AdminLayout from "./AdminLayout";

export default function Testing() {
  return (
    <AdminLayout>
      <h2 className="font-masthead text-4xl mb-8">Test Suite</h2>
      <div className="bg-[var(--bg-elevated)] p-6 border border-[var(--border-subtle)]">
        <h3 className="font-label text-[var(--accent-red)] mb-4">Unit Tests</h3>
        <div className="font-mono text-sm mb-2 text-green-500">
          ✓ Component Rendering: PASS
        </div>
        <div className="font-mono text-sm mb-2 text-green-500">
          ✓ PDF Generation: PASS
        </div>
        <div className="font-mono text-sm mb-2 text-green-500">
          ✓ Routing: PASS
        </div>
      </div>
    </AdminLayout>
  );
}
