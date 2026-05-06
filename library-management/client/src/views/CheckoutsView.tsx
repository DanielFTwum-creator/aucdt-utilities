import { useEffect, useState } from 'react';
import { checkoutsApi, booksApi, type Checkout, type Book } from '../services/api';

const EMPTY: Omit<Checkout, 'id' | 'created_at'> = {
  book_id: '', borrower_id: '', checkout_date: '', due_date: '', return_date: '', status: 'active', late_fee: 0,
};

export default function CheckoutsView() {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([checkoutsApi.list(), booksApi.list()])
      .then(([c, b]) => { setCheckouts(c); setBooks(b); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const bookTitle = (id: string) => books.find(b => b.id === id)?.title || id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await checkoutsApi.update(editId, form); else await checkoutsApi.create(form);
    setForm(EMPTY); setEditId(null); setShowForm(false); load();
  };

  const handleEdit = (c: Checkout) => {
    setForm({
      book_id: c.book_id, borrower_id: c.borrower_id,
      checkout_date: c.checkout_date?.slice(0, 10) || '',
      due_date: c.due_date?.slice(0, 10) || '',
      return_date: c.return_date?.slice(0, 10) || '',
      status: c.status, late_fee: c.late_fee,
    });
    setEditId(c.id); setShowForm(true);
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading checkouts…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Checkouts ({checkouts.length})</h2>
        <button onClick={() => { setForm({ ...EMPTY, book_id: books[0]?.id || '', checkout_date: new Date().toISOString().slice(0, 10) }); setEditId(null); setShowForm(true); }} className="bg-amber-700 text-white px-4 py-2 rounded text-sm hover:bg-amber-800">+ New Checkout</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 mb-6 grid grid-cols-2 gap-4">
          <h3 className="col-span-2 font-medium">{editId ? 'Edit Checkout' : 'New Checkout'}</h3>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Book</span>
            <select value={form.book_id} onChange={e => setForm(f => ({ ...f, book_id: e.target.value }))} className="border rounded px-3 py-1.5 text-sm" required>
              <option value="">— Select book —</option>
              {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </label>
          {([
            ['borrower_id', 'Borrower ID', 'text'],
            ['checkout_date', 'Checkout Date', 'date'],
            ['due_date', 'Due Date', 'date'],
            ['return_date', 'Return Date', 'date'],
            ['late_fee', 'Late Fee (GHS)', 'number'],
          ] as [keyof typeof form, string, string][]).map(([k, l, t]) => (
            <label key={k} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{l}</span>
              <input
                type={t}
                value={String(form[k])}
                step={t === 'number' ? '0.01' : undefined}
                onChange={e => setForm(f => ({ ...f, [k]: t === 'number' ? Number(e.target.value) : e.target.value }))}
                className="border rounded px-3 py-1.5 text-sm"
                required={k !== 'return_date'}
              />
            </label>
          ))}
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Status</span>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="border rounded px-3 py-1.5 text-sm">
              <option value="active">Active</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
              <option value="lost">Lost</option>
            </select>
          </label>
          <div className="col-span-2 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-amber-700 text-white rounded">{editId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
            <tr>{['Book', 'Borrower ID', 'Checkout', 'Due', 'Returned', 'Late Fee', 'Status', ''].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {checkouts.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No checkouts yet</td></tr>}
            {checkouts.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium max-w-xs truncate">{bookTitle(c.book_id)}</td>
                <td className="px-4 py-3 text-gray-500">{c.borrower_id}</td>
                <td className="px-4 py-3">{c.checkout_date?.slice(0, 10)}</td>
                <td className="px-4 py-3">{c.due_date?.slice(0, 10)}</td>
                <td className="px-4 py-3">{c.return_date?.slice(0, 10) || '—'}</td>
                <td className="px-4 py-3">{c.late_fee > 0 ? `GHS ${Number(c.late_fee).toFixed(2)}` : '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-blue-100 text-blue-700' : c.status === 'returned' ? 'bg-green-100 text-green-700' : c.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(c)} className="text-blue-600 text-xs hover:underline">Edit</button>
                  <button onClick={async () => { if (confirm('Delete this checkout?')) { await checkoutsApi.remove(c.id); load(); } }} className="text-red-500 text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
