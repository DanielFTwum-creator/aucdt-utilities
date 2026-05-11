import { Routes, Route } from 'react-router-dom';
import ComplaintsView from './views/ComplaintsView';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-700 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold tracking-tight">Complaint Resolution System</h1>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ComplaintsView />} />
        </Routes>
      </main>
    </div>
  );
}
