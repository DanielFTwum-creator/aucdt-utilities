import { Routes, Route, NavLink } from 'react-router-dom';
import ArticlesView from './views/ArticlesView';
import FeedsView from './views/FeedsView';

export default function App() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded font-medium transition-colors ${isActive ? 'bg-white text-blue-800' : 'text-blue-100 hover:bg-blue-700'}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight">Newsfeed</h1>
          <nav className="flex gap-2">
            <NavLink to="/" end className={linkClass}>Articles</NavLink>
            <NavLink to="/feeds" className={linkClass}>Feeds</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ArticlesView />} />
          <Route path="/feeds" element={<FeedsView />} />
        </Routes>
      </main>
    </div>
  );
}
