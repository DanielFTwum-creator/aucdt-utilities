import React, { useState } from 'react';
import MentorsView from './views/MentorsView';
import MenteesView from './views/MenteesView';

type Tab = 'mentors' | 'mentees';

export default function App() {
  const [tab, setTab] = useState<Tab>('mentors');

  return (
    <div className="min-h-screen bg-violet-50">
      <header className="bg-violet-800 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold">Mentorship Program</h1>
        <p className="text-violet-300 text-sm">Techbridge University College</p>
      </header>

      <nav className="bg-white border-b shadow-sm px-6 flex gap-1 pt-2">
        {(['mentors', 'mentees'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize rounded-t transition-colors ${
              tab === t
                ? 'bg-violet-800 text-white'
                : 'text-violet-700 hover:bg-violet-100'
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto mt-4">
        {tab === 'mentors' && <MentorsView />}
        {tab === 'mentees' && <MenteesView />}
      </main>
    </div>
  );
}
