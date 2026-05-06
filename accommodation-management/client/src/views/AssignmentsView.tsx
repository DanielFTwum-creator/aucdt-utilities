import { useEffect, useState } from 'react';
import { assignmentsApi, hostelsApi, type Hostel, type RoomAssignment } from '../services/api';

const EMPTY: Omit<RoomAssignment, 'id' | 'created_at'> = {
  hostel_id: '',
  room_number: '',
  student_id: '',
  student_name: '',
  check_in_date: '',
  check_out_date: '',
  room_condition: 'good',
  assignment_status: 'active',
};

export default function AssignmentsView() {
  const [assignments, setAssignments] = useState<RoomAssignment[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([assignmentsApi.list(), hostelsApi.list()])
      .then(([a, h]) => { setAssignments(a); setHostels(h); })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const hostelName = (id: string) => hostels.find(h => h.id === id)?.hostel_name || id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await assignmentsApi.update(editId, form);
    } else {
      await assignmentsApi.create(form);
    }
    setForm(EMPTY);
    setEditId(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (a: RoomAssignment) => {
    setForm({
      hostel_id: a.hostel_id,
      room_number: a.room_number,
      student_id: a.student_id,
      student_name: a.student_name,
      check_in_date: a.check_in_date?.slice(0, 10) || '',
      check_out_date: a.check_out_date?.slice(0, 10) || '',
      room_condition: a.room_condition,
      assignment_status: a.assignment_status,
    });
    setEditId(a.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this room assignment?')) return;
    await assignmentsApi.remove(id);
    load();
  };

  if (loading) return <div className="text-gray-500 py-8 text-center">Loading assignments…</div>;
  if (error) return <div className="text-red-600 py-8 text-center">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Room Assignments ({assignments.length})</h2>
        <button
          onClick={() => { setForm({ ...EMPTY, hostel_id: hostels[0]?.id || '' }); setEditId(null); setShowForm(true); }}
          className="bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800"
        >
          + Add Assignment
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 mb-6 grid grid-cols-2 gap-4">
          <h3 className="col-span-2 font-medium text-gray-700">{editId ? 'Edit Assignment' : 'New Assignment'}</h3>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Hostel</span>
            <select value={form.hostel_id} onChange={e => setForm(f => ({ ...f, hostel_id: e.target.value }))} className="border rounded px-3 py-1.5 text-sm" required>
              <option value="">— Select hostel —</option>
              {hostels.map(h => <option key={h.id} value={h.id}>{h.hostel_name}</option>)}
            </select>
          </label>

          {([
            ['room_number', 'Room Number', 'text'],
            ['student_id', 'Student ID', 'text'],
            ['student_name', 'Student Name', 'text'],
            ['check_in_date', 'Check-In Date', 'date'],
            ['check_out_date', 'Check-Out Date', 'date'],
          ] as [keyof typeof form, string, string][]).map(([key, label, type]) => (
            <label key={key} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{label}</span>
              <input
                type={type}
                value={String(form[key])}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="border rounded px-3 py-1.5 text-sm"
                required={key !== 'check_out_date'}
              />
            </label>
          ))}

          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Room Condition</span>
            <select value={form.room_condition} onChange={e => setForm(f => ({ ...f, room_condition: e.target.value }))} className="border rounded px-3 py-1.5 text-sm">
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Status</span>
            <select value={form.assignment_status} onChange={e => setForm(f => ({ ...f, assignment_status: e.target.value }))} className="border rounded px-3 py-1.5 text-sm">
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
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
              {['Hostel', 'Room', 'Student ID', 'Student Name', 'Check-In', 'Check-Out', 'Condition', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assignments.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No assignments yet</td></tr>
            )}
            {assignments.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{hostelName(a.hostel_id)}</td>
                <td className="px-4 py-3 font-medium">{a.room_number}</td>
                <td className="px-4 py-3 text-gray-600">{a.student_id}</td>
                <td className="px-4 py-3">{a.student_name}</td>
                <td className="px-4 py-3">{a.check_in_date?.slice(0, 10)}</td>
                <td className="px-4 py-3">{a.check_out_date?.slice(0, 10) || '—'}</td>
                <td className="px-4 py-3 capitalize">{a.room_condition}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.assignment_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {a.assignment_status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(a)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
