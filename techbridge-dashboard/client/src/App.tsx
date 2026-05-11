import { Routes, Route, NavLink } from 'react-router-dom';
import WidgetsView from './views/WidgetsView';
import MetricsView from './views/MetricsView';

export default function App() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded font-medium transition-colors ${isActive ? 'bg-white text-sky-800' : 'text-sky-100 hover:bg-sky-700'}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-sky-800 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight">Techbridge Dashboard</h1>
          <nav className="flex gap-2">
            <NavLink to="/" end className={linkClass}>Widgets</NavLink>
            <NavLink to="/metrics" className={linkClass}>Metrics</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<WidgetsView />} />
          <Route path="/metrics" element={<MetricsView />} />
        </Routes>
      </main>
    </div>
  );
}
