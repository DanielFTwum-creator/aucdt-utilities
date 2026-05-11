import { useState } from 'react';
import AlumniProfilesView from './views/AlumniProfilesView';
import AlumniConnectionsView from './views/AlumniConnectionsView';

const tabs = ['Alumni Profiles', 'Alumni Connections'] as const;
type Tab = typeof tabs[number];

export default function App() {
  const [active, setActive] = useState<Tab>('Alumni Profiles');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-800 text-white px-6 py-4 shadow">
        <h1 className="text-2xl font-bold">Alumni Network</h1>
        <p className="text-indigo-200 text-sm mt-0.5">Techbridge University College</p>
      </header>

      <nav className="bg-white border-b px-6">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                active === tab
                  ? 'border-indigo-800 text-indigo-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {active === 'Alumni Profiles' && <AlumniProfilesView />}
        {active === 'Alumni Connections' && <AlumniConnectionsView />}
      </main>
    </div>
  );
}
