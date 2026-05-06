import { Routes, Route, NavLink } from 'react-router-dom';
import ScholarshipsView from './views/ScholarshipsView';
import ScholarshipApplicationsView from './views/ScholarshipApplicationsView';

export default function App() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded font-medium transition-colors ${isActive ? 'bg-white text-yellow-800' : 'text-yellow-100 hover:bg-yellow-700'}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-yellow-800 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight">Scholarship Tracker</h1>
          <nav className="flex gap-2">
            <NavLink to="/" end className={linkClass}>Scholarships</NavLink>
            <NavLink to="/applications" className={linkClass}>Applications</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ScholarshipsView />} />
          <Route path="/applications" element={<ScholarshipApplicationsView />} />
        </Routes>
      </main>
    </div>
  );
}
