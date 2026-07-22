import React, { useState } from 'react';
import { FacilityLog } from '../types';
import { 
  Wrench, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  HelpCircle,
  Activity,
  UserCheck,
  ClipboardList
} from 'lucide-react';

interface FacilityLogViewProps {
  logs: FacilityLog[];
  onAddLog: (log: FacilityLog) => void;
  onResolveLog: (id: string, resolutionDays: number) => void;
}

const COMMON_EQUIPMENT = [
  "Veronica Handwashing Bucket",
  "Infrared Digital Thermometer",
  "Oxygen Concentrator / Cylinder",
  "Digital Blood Pressure Monitor",
  "Clinical Bed Rails & Padding",
  "First Aid Emergency Cabinets",
  "Sick Bay Cleanliness & Ventilation",
  "Isolation Room Air Purifier"
];

export default function FacilityLogView({
  logs,
  onAddLog,
  onResolveLog
}: FacilityLogViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [equipmentName, setEquipmentName] = useState('Veronica Handwashing Bucket');
  const [customName, setCustomName] = useState('');
  const [status, setStatus] = useState<FacilityLog['status']>('Needs Maintenance');
  const [reportedIssue, setReportedIssue] = useState('');
  const [reportedBy, setReportedBy] = useState('Nurse T. Asante');

  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionDays, setResolutionDays] = useState<string>('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEquipName = equipmentName === 'Other' ? customName : equipmentName;
    if (!finalEquipName) return;

    onAddLog({
      id: `FAC-${Math.floor(100 + Math.random() * 900)}`,
      dateTime: new Date().toISOString(),
      equipmentName: finalEquipName,
      status,
      reportedIssue: reportedIssue || undefined,
      reportedBy,
      isResolved: false
    });

    // Reset Form
    setEquipmentName('Veronica Handwashing Bucket');
    setCustomName('');
    setStatus('Needs Maintenance');
    setReportedIssue('');
    setShowAddForm(false);
  };

  const handleResolveSubmit = (id: string) => {
    const days = parseInt(resolutionDays);
    onResolveLog(id, isNaN(days) ? 0 : days);
    setResolvingId(null);
    setResolutionDays('1');
  };

  const unresolvedLogs = logs.filter(l => !l.isResolved);
  const resolvedLogs = logs.filter(l => l.isResolved);

  return (
    <div className="space-y-6" id="facility-tab">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase italic font-display text-slate-900">Facility Maintenance & Sanitation</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase">Track cleanliness audits, digital medical diagnostic tools, and essential infection-control equipment.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bento-btn bg-[#0f172a] text-white shadow-[3px_3px_0px_rgba(15,23,42,1)] text-xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
          id="toggle-add-facility-btn"
        >
          <Wrench className="w-4 h-4" /> Log Equipment / Facility Issue
        </button>
      </div>

      {/* Grid: Unresolved & Resolved Splits */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-5 shadow-[4px_4px_0px_rgba(15,23,42,1)] animate-fadeIn" id="add-facility-issue-form">
          <div className="md:col-span-3 pb-3 border-b-2 border-slate-900">
            <h3 className="font-black uppercase text-slate-900 text-sm md:text-base">File Maintenance Report</h3>
            <p className="text-xs text-slate-500 font-bold uppercase">Log hardware, safety, or sterilization outages to prevent clinical disruption.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Facility Area / Equipment</label>
            <select
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-xs font-black text-slate-700 focus:outline-none shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            >
              {COMMON_EQUIPMENT.map(equip => (
                <option key={equip} value={equip}>{equip}</option>
              ))}
              <option value="Other">Other (Custom Field)</option>
            </select>
          </div>

          {equipmentName === 'Other' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-xs font-black text-slate-600 uppercase block">Enter Custom Equipment Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Stethoscope"
                className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                required={equipmentName === 'Other'}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Initial Issue State</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as FacilityLog['status'])}
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-xs font-black text-slate-700 focus:outline-none shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            >
              <option value="Needs Maintenance">Needs Maintenance (Partially Usable)</option>
              <option value="Non-Functional">Non-Functional (Total Outage)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Attending Reporter</label>
            <select
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-xs font-black text-slate-700 focus:outline-none shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            >
              <option value="Nurse T. Asante">Mrs. Theresa Asante (School Nurse)</option>
              <option value="Nurse P. Fleischer-Djoleto">Mr. Peter Fleischer-Djoleto (Nurse Officer)</option>
            </select>
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Describe Maintenance Complaint / Outage</label>
            <textarea
              value={reportedIssue}
              onChange={(e) => setReportedIssue(e.target.value)}
              placeholder="e.g. foot pedal chain broken, requiring manual touching of Veronica bucket..."
              className="w-full border-2 border-slate-900 rounded-xl p-3 text-sm focus:outline-none text-slate-700 bg-white font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              rows={3}
              required
            />
          </div>

          <div className="md:col-span-3 flex justify-end gap-3 pt-3 border-t-2 border-slate-900">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bento-btn bg-white border-2 border-slate-900 text-slate-700 shadow-[2px_2px_0px_rgba(15,23,42,1)] text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bento-btn bento-btn-emerald shadow-[2px_2px_0px_rgba(15,23,42,1)] text-xs font-black flex items-center gap-1.5"
            >
              ✓ Save Maintenance Request
            </button>
          </div>
        </form>
      )}

      {/* Active issues and completed reports list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="facility-logs-split">
        
        {/* Left column: Unresolved Outages */}
        <div className="lg:col-span-7 space-y-4" id="active-outages">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 italic font-display flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse border border-slate-900" />
            Active Service Requests ({unresolvedLogs.length})
          </h3>

          <div className="space-y-4" id="unresolved-logs-list">
            {unresolvedLogs.map(log => (
              <div key={log.id} className="bento-card bg-white p-5 hover:shadow-[4px_4px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-all space-y-4" id={`facility-unresolved-card-${log.id}`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-black text-slate-400 block uppercase">LOG-ID: {log.id}</span>
                    <h4 className="font-black text-slate-900 text-base uppercase leading-none">{log.equipmentName}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase mt-1">Logged on {new Date(log.dateTime).toLocaleDateString()} by {log.reportedBy}</p>
                  </div>

                  <span className={`bento-badge border-2 border-slate-900 shadow-[1px_1px_0px_rgba(15,23,42,1)] uppercase text-[9px] font-black ${
                    log.status === 'Non-Functional' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {log.status}
                  </span>
                </div>

                {log.reportedIssue && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border-2 border-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                    &quot;{log.reportedIssue}&quot;
                  </p>
                )}

                {/* Resolution trigger */}
                <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-rose-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-rose-500" /> Maintenance pending
                  </span>

                  {resolvingId === log.id ? (
                    <div className="flex items-center gap-1.5 animate-fadeIn" id={`resolve-action-block-${log.id}`}>
                      <input
                        type="number"
                        min="0"
                        value={resolutionDays}
                        onChange={(e) => setResolutionDays(e.target.value)}
                        placeholder="Days"
                        className="w-14 py-1 px-2 border-2 border-slate-900 rounded-lg text-xs font-black focus:outline-none"
                      />
                      <span className="text-xs text-slate-400 font-black uppercase">days</span>
                      <button
                        onClick={() => handleResolveSubmit(log.id)}
                        className="bento-btn bento-btn-emerald py-1 px-2.5 text-[10px] font-black cursor-pointer"
                      >
                        Solve
                      </button>
                      <button
                        onClick={() => setResolvingId(null)}
                        className="bento-btn bg-white border-2 border-slate-900 text-slate-500 py-1 px-2.5 text-[10px] font-black cursor-pointer"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setResolvingId(log.id);
                        setResolutionDays('1');
                      }}
                      className="bento-btn bg-white border-2 border-slate-900 hover:bg-slate-50 transition-colors text-slate-700 text-xs font-black flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Resolve Issue
                    </button>
                  )}
                </div>
              </div>
            ))}

            {unresolvedLogs.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm font-black uppercase border-2 border-dashed border-slate-300 rounded-2xl bg-white">
                🎉 No active hardware outages or cleanliness lapses. School sick bay is fully operational.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Resolved Reports */}
        <div className="lg:col-span-5 space-y-4" id="resolved-outages">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 italic font-display flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Completed / Serviced Logs ({resolvedLogs.length})
          </h3>

          <div className="space-y-3" id="resolved-logs-list">
            {resolvedLogs.map(log => (
              <div key={log.id} className="bg-slate-50 border-2 border-slate-900 rounded-xl p-4 space-y-2 shadow-[2px_2px_0px_rgba(15,23,42,1)]" id={`facility-resolved-card-${log.id}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm uppercase leading-none">{log.equipmentName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Resolved by {log.reportedBy}</p>
                  </div>
                  <span className="bento-badge border-2 border-slate-900 uppercase bg-emerald-100 text-emerald-800 text-[9px] font-black shadow-[1px_1px_0px_rgba(15,23,42,1)]">
                    Resolved in {log.resolutionDays ?? 1}d
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 italic font-semibold">&quot;{log.reportedIssue}&quot;</p>
              </div>
            ))}

            {resolvedLogs.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs font-black uppercase border-2 border-dashed border-slate-300 rounded-xl bg-white">
                No archived facility audits yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
