import { useEffect, useState } from 'react';
import { booksApi, type Book } from '../services/api';

const EMPTY: Omit<Book, 'id' | 'created_at'> = {
  title: '', author: '', isbn: '', publication_year: 0, total_copies: 1, available_copies: 1, category: 'General',
};

export default function BooksView() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => { setLoading(true); booksApi.list().then(setBooks).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await booksApi.update(editId, form); else await booksApi.create(form);
    setForm(EMPTY); setEditId(null); setShowForm(false); load();
  };

  const handleEdit = (b: Book) => {
    setForm({ title: b.title, author: b.author, isbn: b.isbn, publication_year: b.publication_year, total_copies: b.total_copies, available_copies: b.available_copies, category: b.category });
    setEditId(b.id); setShowForm(true);
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading books…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Books ({books.length})</h2>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }} className="bg-amber-700 text-white px-4 py-2 rounded text-sm hover:bg-amber-800">+ Add Book</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 mb-6 grid grid-cols-2 gap-4">
          <h3 className="col-span-2 font-medium">{editId ? 'Edit Book' : 'New Book'}</h3>
          {([
            ['title', 'Title', 'text'],
            ['author', 'Author', 'text'],
            ['isbn', 'ISBN', 'text'],
            ['publication_year', 'Publication Year', 'number'],
            ['total_copies', 'Total Copies', 'number'],
            ['available_copies', 'Available Copies', 'number'],
            ['category', 'Category', 'text'],
          ] as [keyof typeof form, string, string][]).map(([k, l, t]) => (
            <label key={k} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{l}</span>
              <input
                type={t}
                value={String(form[k])}
                onChange={e => setForm(f => ({ ...f, [k]: t === 'number' ? Number(e.target.value) : e.target.value }))}
                className="border rounded px-3 py-1.5 text-sm"
                required={k !== 'isbn'}
              />
            </label>
          ))}
          <div className="col-span-2 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-amber-700 text-white rounded">{editId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
            <tr>{['Title', 'Author', 'ISBN', 'Year', 'Category', 'Copies', 'Available', ''].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {books.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No books yet</td></tr>}
            {books.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{b.title}</td>
                <td className="px-4 py-3">{b.author}</td>
                <td className="px-4 py-3 text-gray-500">{b.isbn || '—'}</td>
                <td className="px-4 py-3">{b.publication_year || '—'}</td>
                <td className="px-4 py-3">{b.category}</td>
                <td className="px-4 py-3">{b.total_copies}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.available_copies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {b.available_copies}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(b)} className="text-blue-600 text-xs hover:underline">Edit</button>
                  <button onClick={async () => { if (confirm('Delete this book and all checkouts?')) { await booksApi.remove(b.id); load(); } }} className="text-red-500 text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
