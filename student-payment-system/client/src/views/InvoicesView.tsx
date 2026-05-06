import { useState, useEffect } from 'react';
import {
  Invoice,
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from '../services/api';

const empty: Partial<Invoice> = {
  payment_id: '',
  invoice_number: '',
  student_id: '',
  invoice_date: '',
  due_date: '',
  total_amount: 0,
  amount_paid: 0,
  balance_due: 0,
  invoice_status: 'unpaid',
};

export default function InvoicesView() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [form, setForm] = useState<Partial<Invoice>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setItems(await getInvoices());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startEdit(item: Invoice) {
    setForm({ ...item });
    setEditId(item.id);
    setShowForm(true);
  }

  function startAdd() {
    setForm({ ...empty });
    setEditId(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await updateInvoice(editId, form);
      } else {
        await createInvoice(form);
      }
      setShowForm(false);
      setForm({ ...empty });
      setEditId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this invoice?')) return;
    try {
      await deleteInvoice(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Invoices</h2>
        <button
          onClick={() => (showForm && !editId ? setShowForm(false) : startAdd())}
          className="bg-emerald-800 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors"
        >
          {showForm && !editId ? 'Cancel' : '+ Add Invoice'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4 bg-red-50 p-3 rounded">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">{editId ? 'Edit Invoice' : 'New Invoice'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={form.invoice_number || ''} onChange={e => setForm(f => ({ ...f, invoice_number: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment ID</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={form.payment_id || ''} onChange={e => setForm(f => ({ ...f, payment_id: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={form.student_id || ''} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
              <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={form.invoice_date || ''} onChange={e => setForm(f => ({ ...f, invoice_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={form.due_date || ''} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
              <input type="number" step="0.01" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={form.total_amount || ''} onChange={e => setForm(f => ({ ...f, total_amount: parseFloat(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
              <input type="number" step="0.01" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={form.amount_paid || ''} onChange={e => setForm(f => ({ ...f, amount_paid: parseFloat(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Balance Due</label>
              <input type="number" step="0.01" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={form.balance_due || ''} onChange={e => setForm(f => ({ ...f, balance_due: parseFloat(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={form.invoice_status || 'unpaid'} onChange={e => setForm(f => ({ ...f, invoice_status: e.target.value }))}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="partial">Partial</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-emerald-800 text-white px-6 py-2 rounded hover:bg-emerald-700 transition-colors">
              {editId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No invoices found. Add one to get started.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Invoice #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Student ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Paid</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Balance</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Due Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.invoice_number}</td>
                  <td className="px-4 py-3 text-gray-600">{item.student_id}</td>
                  <td className="px-4 py-3 text-gray-600">GHS {Number(item.total_amount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">GHS {Number(item.amount_paid).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">GHS {Number(item.balance_due).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{item.due_date ? item.due_date.slice(0, 10) : '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.invoice_status === 'paid' ? 'bg-green-100 text-green-700' : item.invoice_status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.invoice_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => startEdit(item)} className="text-emerald-700 hover:text-emerald-900 font-medium">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
