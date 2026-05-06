import { useState } from 'react';
import HostelsView from './views/HostelsView';
import AssignmentsView from './views/AssignmentsView';

type Tab = 'hostels' | 'assignments';

export default function App() {
  const [tab, setTab] = useState<Tab>('hostels');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold">Accommodation Management — TUC</h1>
        <p className="text-blue-200 text-sm">Techbridge University College</p>
      </header>

      <nav className="bg-white border-b px-6 flex gap-2 pt-2">
        <button
          onClick={() => setTab('hostels')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'hostels'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Hostels
        </button>
        <button
          onClick={() => setTab('assignments')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'assignments'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Room Assignments
        </button>
      </nav>

      <main className="p-6 max-w-6xl mx-auto">
        {tab === 'hostels' ? <HostelsView /> : <AssignmentsView />}
      </main>
    </div>
  );
}
