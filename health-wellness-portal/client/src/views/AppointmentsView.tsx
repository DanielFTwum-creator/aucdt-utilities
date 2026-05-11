import { useEffect, useState } from 'react';
import { appointmentsApi, healthRecordsApi, type Appointment, type HealthRecord } from '../services/api';

const EMPTY: Omit<Appointment, 'id' | 'created_at'> = {
  health_record_id: '', appointment_date: '', doctor_name: '', department: '', reason_for_visit: '', status: 'scheduled', notes: '',
};

export default function AppointmentsView() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => { setLoading(true); Promise.all([appointmentsApi.list(), healthRecordsApi.list()]).then(([a,r]) => { setAppointments(a); setRecords(r); }).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const patientName = (id: string) => records.find(r => r.id === id)?.patient_name || id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await appointmentsApi.update(editId, form); else await appointmentsApi.create(form);
    setForm(EMPTY); setEditId(null); setShowForm(false); load();
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Appointments ({appointments.length})</h2>
        <button onClick={() => { setForm({ ...EMPTY, health_record_id: records[0]?.id || '' }); setEditId(null); setShowForm(true); }} className="bg-teal-700 text-white px-4 py-2 rounded text-sm hover:bg-teal-800">+ Schedule Appointment</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 mb-6 grid grid-cols-2 gap-4">
          <h3 className="col-span-2 font-medium">{editId ? 'Edit Appointment' : 'New Appointment'}</h3>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Patient</span>
            <select value={form.health_record_id} onChange={e => setForm(f => ({ ...f, health_record_id: e.target.value }))} className="border rounded px-3 py-1.5 text-sm" required>
              <option value="">— Select patient —</option>
              {records.map(r => <option key={r.id} value={r.id}>{r.patient_name}</option>)}
            </select>
          </label>
          {([['appointment_date','Appointment Date','datetime-local'],['doctor_name','Doctor Name','text'],['department','Department','text']] as [keyof typeof form, string, string][]).map(([k,l,t]) => (
            <label key={k} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{l}</span>
              <input type={t} value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="border rounded px-3 py-1.5 text-sm" required />
            </label>
          ))}
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Status</span>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="border rounded px-3 py-1.5 text-sm">
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </label>
          {(['reason_for_visit','notes'] as (keyof typeof form)[]).map(k => (
            <label key={k} className="col-span-2 flex flex-col gap-1">
              <span className="text-xs text-gray-500 capitalize">{k.replace('_',' ')}</span>
              <textarea value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="border rounded px-3 py-1.5 text-sm" rows={2} />
            </label>
          ))}
          <div className="col-span-2 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-teal-700 text-white rounded">{editId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      )}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
            <tr>{['Patient','Date','Doctor','Department','Reason','Status',''].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {appointments.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No appointments yet</td></tr>}
            {appointments.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{patientName(a.health_record_id)}</td>
                <td className="px-4 py-3">{a.appointment_date?.slice(0,16).replace('T',' ')}</td>
                <td className="px-4 py-3">{a.doctor_name}</td>
                <td className="px-4 py-3">{a.department}</td>
                <td className="px-4 py-3 max-w-xs truncate text-gray-500">{a.reason_for_visit}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setForm({ health_record_id: a.health_record_id, appointment_date: a.appointment_date?.slice(0,16) || '', doctor_name: a.doctor_name, department: a.department, reason_for_visit: a.reason_for_visit, status: a.status, notes: a.notes }); setEditId(a.id); setShowForm(true); }} className="text-blue-600 text-xs hover:underline">Edit</button>
                  <button onClick={async () => { if (confirm('Delete?')) { await appointmentsApi.remove(a.id); load(); } }} className="text-red-500 text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
