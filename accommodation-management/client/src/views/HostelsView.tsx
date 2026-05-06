import { useEffect, useState } from 'react';
import { hostelsApi, type Hostel } from '../services/api';

const EMPTY: Omit<Hostel, 'id' | 'created_at'> = {
  hostel_name: '',
  location: '',
  total_rooms: 0,
  occupied_rooms: 0,
  gender_type: 'mixed',
  warden_name: '',
  status: 'active',
};

export default function HostelsView() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    hostelsApi
      .list()
      .then(setHostels)
      .catch(() => setError('Failed to load hostels'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await hostelsApi.update(editId, form);
    } else {
      await hostelsApi.create(form);
    }
    setForm(EMPTY);
    setEditId(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (h: Hostel) => {
    setForm({
      hostel_name: h.hostel_name,
      location: h.location,
      total_rooms: h.total_rooms,
      occupied_rooms: h.occupied_rooms,
      gender_type: h.gender_type,
      warden_name: h.warden_name,
      status: h.status,
    });
    setEditId(h.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hostel and all its room assignments?')) return;
    await hostelsApi.remove(id);
    load();
  };

  if (loading) return <div className="text-gray-500 py-8 text-center">Loading hostels…</div>;
  if (error) return <div className="text-red-600 py-8 text-center">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Hostels ({hostels.length})</h2>
        <button
          onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}
          className="bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800"
        >
          + Add Hostel
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 mb-6 grid grid-cols-2 gap-4">
          <h3 className="col-span-2 font-medium text-gray-700">{editId ? 'Edit Hostel' : 'New Hostel'}</h3>
          {([
            ['hostel_name', 'Hostel Name', 'text'],
            ['location', 'Location', 'text'],
            ['total_rooms', 'Total Rooms', 'number'],
            ['occupied_rooms', 'Occupied Rooms', 'number'],
            ['warden_name', 'Warden Name', 'text'],
          ] as [keyof typeof form, string, string][]).map(([key, label, type]) => (
            <label key={key} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{label}</span>
              <input
                type={type}
                value={String(form[key])}
                onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                className="border rounded px-3 py-1.5 text-sm"
                required
              />
            </label>
          ))}
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Gender Type</span>
            <select value={form.gender_type} onChange={e => setForm(f => ({ ...f, gender_type: e.target.value }))} className="border rounded px-3 py-1.5 text-sm">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="mixed">Mixed</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Status</span>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="border rounded px-3 py-1.5 text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </label>
          <div className="col-span-2 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">{editId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              {['Name', 'Location', 'Rooms', 'Occupied', 'Gender', 'Warden', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {hostels.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No hostels yet</td></tr>
            )}
            {hostels.map(h => (
              <tr key={h.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{h.hostel_name}</td>
                <td className="px-4 py-3 text-gray-600">{h.location}</td>
                <td className="px-4 py-3">{h.total_rooms}</td>
                <td className="px-4 py-3">{h.occupied_rooms}</td>
                <td className="px-4 py-3 capitalize">{h.gender_type}</td>
                <td className="px-4 py-3">{h.warden_name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${h.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {h.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(h)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(h.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
