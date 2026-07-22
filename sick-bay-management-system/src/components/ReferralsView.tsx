import React, { useState } from 'react';
import { Referral } from '../types';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Plus, 
  Search, 
  AlertTriangle, 
  UserCheck,
  Send,
  Stethoscope
} from 'lucide-react';

interface ReferralsViewProps {
  referrals: Referral[];
  onUpdateStatus: (id: string, status: Referral['status'], outcome?: string) => void;
  onAddReferral: (referral: Referral) => void;
}

export default function ReferralsView({
  referrals,
  onUpdateStatus,
  onAddReferral
}: ReferralsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [statusVal, setStatusVal] = useState<Referral['status']>('Pending');

  // Manual Referral form
  const [showAddForm, setShowAddForm] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [hospital, setHospital] = useState('');
  const [reason, setReason] = useState('');

  const activeTransfersCount = referrals.filter(r => r.status === 'Transferred' || r.status === 'Pending').length;

  const handleUpdateSubmit = (id: string) => {
    onUpdateStatus(id, statusVal, outcomeNotes);
    setSelectedReferralId(null);
    setOutcomeNotes('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !hospital || !reason) return;

    onAddReferral({
      id: `REF-2026-${Math.floor(100 + Math.random()*900)}`,
      visitId: `VST-MANUAL-${Math.floor(100 + Math.random()*900)}`,
      patientName,
      patientId: patientId || 'STU-UNKNOWN',
      dateTime: new Date().toISOString(),
      referralHospital: hospital,
      reason,
      status: 'Pending'
    });

    // Reset Form
    setPatientName('');
    setPatientId('');
    setHospital('');
    setReason('');
    setShowAddForm(false);
  };

  const filteredReferrals = referrals.filter(ref => 
    ref.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ref.referralHospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="referrals-tab">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase italic font-display text-slate-900">Hospital & Specialist Referrals</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase">Track student transfer protocols to external clinics, hospitals, and emergency emergency evaluations.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bento-btn bg-[#0f172a] text-white shadow-[3px_3px_0px_rgba(15,23,42,1)] text-xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
          id="toggle-add-referral-btn"
        >
          <Plus className="w-4 h-4" /> Create Referral Record
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="referral-stats">
        <div className="bg-white border-2 border-slate-900 rounded-xl p-4 flex items-center gap-3 shadow-[3px_3px_0px_rgba(15,23,42,1)]">
          <div className="p-2.5 bg-rose-100 text-rose-600 border-2 border-slate-900 rounded-lg shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Active Transfers</span>
            <span className="text-xl font-black text-slate-900 font-display">{activeTransfersCount}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-xl p-4 flex items-center gap-3 shadow-[3px_3px_0px_rgba(15,23,42,1)]">
          <div className="p-2.5 bg-emerald-100 text-emerald-600 border-2 border-slate-900 rounded-lg shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Resolved Cases</span>
            <span className="text-xl font-black text-slate-900 font-display">{referrals.filter(r => r.status === 'Discharged' || r.status === 'Followed Up').length}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-xl p-4 flex items-center gap-3 shadow-[3px_3px_0px_rgba(15,23,42,1)]">
          <div className="p-2.5 bg-indigo-100 text-indigo-600 border-2 border-slate-900 rounded-lg shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Referrals logged</span>
            <span className="text-xl font-black text-slate-900 font-display">{referrals.length}</span>
          </div>
        </div>
      </div>

      {/* Manual Referral Entry Form */}
      {showAddForm && (
        <form onSubmit={handleManualSubmit} className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5 shadow-[4px_4px_0px_rgba(15,23,42,1)] animate-fadeIn" id="add-referral-form">
          <div className="md:col-span-2 pb-3 border-b-2 border-slate-900">
            <h3 className="font-black uppercase text-slate-900 text-sm md:text-base">Register Manual Referral Transfer</h3>
            <p className="text-xs text-slate-500 font-bold uppercase">Create a record for external treatments if not initiated through a routine check-in.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Student/Staff Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Kwame Mensah"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Patient Roster ID (Optional)</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. STU-2026-004"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Target Hospital / Clinic</label>
            <input
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="e.g. Ridge Municipal Hospital"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Clinical Reason for Referral</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Suspected acute surgical fracture"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t-2 border-slate-900">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bento-btn bg-white border-2 border-slate-900 text-slate-700 shadow-[2px_2px_0px_rgba(15,23,42,1)] text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bento-btn bento-btn-emerald shadow-[2px_2px_0px_rgba(15,23,42,1)] text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-4 h-4" /> Save Record
            </button>
          </div>
        </form>
      )}

      {/* Filter and table layout */}
      <div className="relative" id="referrals-search">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search referrals by patient name or receiving hospital..."
          className="w-full pl-10 pr-4 py-3 border-2 border-slate-900 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
        />
      </div>

      {/* Referrals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="referrals-grid">
        {filteredReferrals.map(ref => (
          <div key={ref.id} className="bento-card bg-white p-5 hover:shadow-[4px_4px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4" id={`referral-card-${ref.id}`}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-black text-slate-400 font-mono block uppercase">ID: {ref.id}</span>
                  <h3 className="font-black text-slate-900 text-base leading-none uppercase">{ref.patientName}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase mt-1">Checked in {new Date(ref.dateTime).toLocaleDateString()}</p>
                </div>
                <span className={`bento-badge border-2 border-slate-900 shadow-[1px_1px_0px_rgba(15,23,42,1)] uppercase text-[9px] font-black ${
                  ref.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                  ref.status === 'Transferred' ? 'bg-indigo-100 text-indigo-800' :
                  ref.status === 'Discharged' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {ref.status}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)] space-y-2">
                <div className="text-xs text-slate-600 font-bold flex items-center gap-1 uppercase">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <strong className="text-slate-800 font-black">Facility: </strong> {ref.referralHospital}
                </div>
                <div className="text-xs text-slate-600 font-bold uppercase">
                  <strong className="text-slate-800 font-black">Reason: </strong> {ref.reason}
                </div>
                {ref.outcomeNotes && (
                  <div className="text-xs text-slate-500 border-t-2 border-slate-200 pt-2 italic font-bold">
                    <strong className="text-slate-700 not-italic font-black uppercase block text-[10px] text-slate-400 tracking-wider">Feedback / Outcomes:</strong>
                    &quot;{ref.outcomeNotes}&quot;
                  </div>
                )}
              </div>
            </div>

            {/* Actions / Outcome updater */}
            <div className="pt-3 border-t-2 border-slate-100">
              {selectedReferralId === ref.id ? (
                <div className="space-y-2.5 pt-2 animate-fadeIn" id={`outcome-editor-${ref.id}`}>
                  <div className="flex gap-2">
                    <select
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value as Referral['status'])}
                      className="py-1 px-2.5 bg-white border-2 border-slate-900 rounded-lg text-xs font-black text-slate-700 shadow-[1px_1px_0px_rgba(15,23,42,1)]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Transferred">Transferred</option>
                      <option value="Discharged">Discharged</option>
                      <option value="Followed Up">Followed Up</option>
                    </select>
                  </div>
                  <textarea
                    value={outcomeNotes}
                    onChange={(e) => setOutcomeNotes(e.target.value)}
                    placeholder="Enter outcomes / feedback received from hospital..."
                    className="w-full text-xs border-2 border-slate-900 rounded-lg p-2 focus:outline-none font-bold bg-white shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedReferralId(null)}
                      className="bento-btn bg-white border-2 border-slate-900 py-1 px-2.5 text-xs text-slate-500 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateSubmit(ref.id)}
                      className="bento-btn bento-btn-emerald py-1 px-2.5 text-xs font-black cursor-pointer"
                    >
                      Save Status
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedReferralId(ref.id);
                    setStatusVal(ref.status);
                    setOutcomeNotes(ref.outcomeNotes || '');
                  }}
                  className="bento-btn bg-white border-2 border-slate-900 hover:bg-slate-50 transition-colors text-slate-700 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" /> Log Referral Outcome
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredReferrals.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-16 text-slate-400 text-sm font-black uppercase border-2 border-dashed border-slate-300 rounded-3xl">
            No referral pipelines active.
          </div>
        )}
      </div>
    </div>
  );
}
