import { Routes, Route, NavLink } from 'react-router-dom';
import CoachingSessionsView from './views/CoachingSessionsView';
import ProgressTrackingView from './views/ProgressTrackingView';

export default function App() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded font-medium transition-colors ${isActive ? 'bg-white text-rose-800' : 'text-rose-100 hover:bg-rose-700'}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-rose-800 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight">Student Success Coach</h1>
          <nav className="flex gap-2">
            <NavLink to="/" end className={linkClass}>Coaching Sessions</NavLink>
            <NavLink to="/progress" className={linkClass}>Progress Tracking</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<CoachingSessionsView />} />
          <Route path="/progress" element={<ProgressTrackingView />} />
        </Routes>
      </main>
    </div>
  );
}
