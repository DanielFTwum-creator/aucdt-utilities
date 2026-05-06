import { useState } from 'react';
import BooksView from './views/BooksView';
import CheckoutsView from './views/CheckoutsView';

type Tab = 'books' | 'checkouts';

export default function App() {
  const [tab, setTab] = useState<Tab>('books');
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-amber-800 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold">Library Management — TUC</h1>
        <p className="text-amber-200 text-sm">Techbridge University College</p>
      </header>
      <nav className="bg-white border-b px-6 flex gap-2 pt-2">
        <button
          onClick={() => setTab('books')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'books' ? 'border-amber-600 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Books
        </button>
        <button
          onClick={() => setTab('checkouts')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'checkouts' ? 'border-amber-600 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Checkouts
        </button>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">
        {tab === 'books' ? <BooksView /> : <CheckoutsView />}
      </main>
    </div>
  );
}
