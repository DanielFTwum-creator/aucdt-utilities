import { Routes, Route, NavLink } from 'react-router-dom';
import PaymentsView from './views/PaymentsView';
import InvoicesView from './views/InvoicesView';

export default function App() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded font-medium transition-colors ${isActive ? 'bg-white text-emerald-800' : 'text-emerald-100 hover:bg-emerald-700'}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-emerald-800 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight">Student Payment System</h1>
          <nav className="flex gap-2">
            <NavLink to="/" end className={linkClass}>Payments</NavLink>
            <NavLink to="/invoices" className={linkClass}>Invoices</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<PaymentsView />} />
          <Route path="/invoices" element={<InvoicesView />} />
        </Routes>
      </main>
    </div>
  );
}
