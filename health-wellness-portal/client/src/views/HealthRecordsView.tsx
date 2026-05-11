import { useEffect, useState } from 'react';
import { healthRecordsApi, type HealthRecord } from '../services/api';

const EMPTY: Omit<HealthRecord, 'id' | 'created_at'> = {
  patient_id: '', patient_name: '', age: 0, blood_type: '', medical_history: '', allergies: '', last_checkup_date: '',
};

export default function HealthRecordsView() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => { setLoading(true); healthRecordsApi.list().then(setRecords).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await healthRecordsApi.update(editId, form); else await healthRecordsApi.create(form);
    setForm(EMPTY); setEditId(null); setShowForm(false); load();
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Health Records ({records.length})</h2>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }} className="bg-teal-700 text-white px-4 py-2 rounded text-sm hover:bg-teal-800">+ Add Record</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 mb-6 grid grid-cols-2 gap-4">
          <h3 className="col-span-2 font-medium">{editId ? 'Edit Record' : 'New Health Record'}</h3>
          {([['patient_id','Patient ID','text'],['patient_name','Patient Name','text'],['age','Age','number'],['blood_type','Blood Type','text'],['last_checkup_date','Last Checkup','date']] as [keyof typeof form, string, string][]).map(([k,l,t]) => (
            <label key={k} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{l}</span>
              <input type={t} value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: t === 'number' ? Number(e.target.value) : e.target.value }))} className="border rounded px-3 py-1.5 text-sm" required={k !== 'last_checkup_date'} />
            </label>
          ))}
          {(['medical_history','allergies'] as (keyof typeof form)[]).map(k => (
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
            <tr>{['Patient ID','Name','Age','Blood Type','Allergies','Last Checkup',''].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {records.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No records yet</td></tr>}
            {records.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{r.patient_id}</td>
                <td className="px-4 py-3 font-medium">{r.patient_name}</td>
                <td className="px-4 py-3">{r.age}</td>
                <td className="px-4 py-3">{r.blood_type}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{r.allergies || '—'}</td>
                <td className="px-4 py-3">{r.last_checkup_date?.slice(0,10) || '—'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setForm({ patient_id: r.patient_id, patient_name: r.patient_name, age: r.age, blood_type: r.blood_type, medical_history: r.medical_history, allergies: r.allergies, last_checkup_date: r.last_checkup_date?.slice(0,10) || '' }); setEditId(r.id); setShowForm(true); }} className="text-blue-600 text-xs hover:underline">Edit</button>
                  <button onClick={async () => { if (confirm('Delete this record and all appointments?')) { await healthRecordsApi.remove(r.id); load(); } }} className="text-red-500 text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
