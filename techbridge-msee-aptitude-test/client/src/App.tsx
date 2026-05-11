import { Routes, Route, NavLink } from 'react-router-dom';
import QuestionsView from './views/QuestionsView';
import AnswersView from './views/AnswersView';

export default function App() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded font-medium transition-colors ${isActive ? 'bg-white text-zinc-800' : 'text-zinc-100 hover:bg-zinc-600'}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-zinc-800 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight">MSEE Aptitude Test</h1>
          <nav className="flex gap-2">
            <NavLink to="/" end className={linkClass}>Questions</NavLink>
            <NavLink to="/answers" className={linkClass}>Answers</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<QuestionsView />} />
          <Route path="/answers" element={<AnswersView />} />
        </Routes>
      </main>
    </div>
  );
}
