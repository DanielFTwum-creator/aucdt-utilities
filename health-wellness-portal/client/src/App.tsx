import { useState } from 'react';
import HealthRecordsView from './views/HealthRecordsView';
import AppointmentsView from './views/AppointmentsView';

type Tab = 'records' | 'appointments';

export default function App() {
  const [tab, setTab] = useState<Tab>('records');
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-800 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold">Health & Wellness Portal — TUC</h1>
        <p className="text-teal-200 text-sm">Techbridge University College</p>
      </header>
      <nav className="bg-white border-b px-6 flex gap-2 pt-2">
        <button onClick={() => setTab('records')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'records' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Health Records</button>
        <button onClick={() => setTab('appointments')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'appointments' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Appointments</button>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">
        {tab === 'records' ? <HealthRecordsView /> : <AppointmentsView />}
      </main>
    </div>
  );
}
