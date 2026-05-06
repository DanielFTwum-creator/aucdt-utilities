import React, { useState } from 'react';
import JobPostingsView from './views/JobPostingsView';
import JobApplicationsView from './views/JobApplicationsView';

const tabs = ['Job Postings', 'Job Applications'] as const;
type Tab = typeof tabs[number];

export default function App() {
  const [active, setActive] = useState<Tab>('Job Postings');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-800 text-white px-6 py-4 shadow">
        <h1 className="text-2xl font-bold">Career Services</h1>
        <p className="text-green-200 text-sm mt-0.5">Techbridge University College</p>
      </header>

      <nav className="bg-white border-b px-6">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                active === tab
                  ? 'border-green-800 text-green-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {active === 'Job Postings' && <JobPostingsView />}
        {active === 'Job Applications' && <JobApplicationsView />}
      </main>
    </div>
  );
}
