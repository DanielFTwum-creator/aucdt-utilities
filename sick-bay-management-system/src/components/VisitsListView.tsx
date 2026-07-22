import React, { useState } from 'react';
import { Visit } from '../types';
import { 
  Search, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Thermometer, 
  Heart, 
  Activity, 
  User, 
  Calendar,
  BriefcaseMedical,
  Stethoscope
} from 'lucide-react';

interface VisitsListViewProps {
  visits: Visit[];
}

export default function VisitsListView({ visits }: VisitsListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterDisposition, setFilterDisposition] = useState('All');
  const [expandedVisitId, setExpandedVisitId] = useState<string | null>(null);

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = 
      visit.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.treatedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = filterSeverity === 'All' || visit.severity === filterSeverity;
    const matchesDisposition = filterDisposition === 'All' || visit.disposition === filterDisposition;

    return matchesSearch && matchesSeverity && matchesDisposition;
  });

  return (
    <div className="space-y-6" id="visits-list-tab">
      <div>
        <h2 className="text-xl font-black uppercase italic font-display text-slate-900">Clinical Encounters Journal</h2>
        <p className="text-xs text-slate-400 font-semibold uppercase">The master record of all student and staff medical check-ins, diagnosis details, and treatment protocols.</p>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col md:flex-row gap-3 items-center" id="visits-filters">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search encounters by patient, symptoms, or nurse signature..."
            className="w-full pl-10 pr-4 py-3 border-2 border-slate-900 rounded-xl text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto" id="visits-dropdown-filters">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="flex-1 md:w-40 py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-xs font-black text-slate-700 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
          >
            <option value="All">All Severities</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>

          <select
            value={filterDisposition}
            onChange={(e) => setFilterDisposition(e.target.value)}
            className="flex-1 md:w-48 py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-xs font-black text-slate-700 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
          >
            <option value="All">All Dispositions</option>
            <option value="Back to Class">Back to Class</option>
            <option value="Observe in Sick Bay">Observe in Sick Bay</option>
            <option value="Sent Home">Sent Home</option>
            <option value="Referral to Hospital">Referral to Hospital</option>
          </select>
        </div>
      </div>

      {/* Journal entries */}
      <div className="space-y-4" id="visits-journal">
        {filteredVisits.slice().reverse().map(visit => {
          const isExpanded = expandedVisitId === visit.id;
          
          return (
            <div 
              key={visit.id} 
              className={`bento-card overflow-hidden transition-all duration-200 ${
                isExpanded ? 'bg-slate-50/50 shadow-[4px_4px_0px_rgba(15,23,42,1)]' : ''
              }`}
              id={`visit-card-${visit.id}`}
            >
              {/* Header block (clickable to toggle) */}
              <button
                type="button"
                onClick={() => setExpandedVisitId(isExpanded ? null : visit.id)}
                className="w-full text-left p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 border-2 border-slate-900 ${
                    visit.severity === 'Severe' ? 'bg-rose-100 text-rose-600' :
                    visit.severity === 'Moderate' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-800 text-sm md:text-base leading-none">{visit.patientName}</h3>
                      <span className="text-[10px] text-slate-500 font-black">({visit.patientId})</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase">
                      {visit.patientType} • {visit.classOrDept} • {new Date(visit.dateTime).toLocaleDateString()} {new Date(visit.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <div className="text-right hidden md:block">
                    <span className="bento-badge border-slate-900" style={{
                      backgroundColor: visit.disposition === 'Referral to Hospital' ? '#ffe4e6' : visit.disposition === 'Observe in Sick Bay' ? '#fef3c7' : '#f1f5f9',
                      color: visit.disposition === 'Referral to Hospital' ? '#e11d48' : visit.disposition === 'Observe in Sick Bay' ? '#d97706' : '#334155',
                    }}>
                      {visit.disposition}
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {/* Detailed panel */}
              {isExpanded && (
                <div className="p-6 border-t-2 border-slate-900 bg-slate-50/20 space-y-5 animate-slideDown" id={`visit-expanded-body-${visit.id}`}>
                  
                  {/* Clinical metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id={`vitals-summary-${visit.id}`}>
                    <div className="bg-white border-2 border-slate-900 p-3.5 rounded-xl flex items-center gap-3 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                      <Thermometer className="w-5 h-5 text-orange-500 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-slate-400 block uppercase">Temperature</span>
                        <span className="text-sm font-black text-slate-800">{visit.temperature} °C</span>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-slate-900 p-3.5 rounded-xl flex items-center gap-3 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                      <Activity className="w-5 h-5 text-blue-500 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-slate-400 block uppercase">Blood Pressure</span>
                        <span className="text-sm font-black text-slate-800">{visit.bloodPressure}</span>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-slate-900 p-3.5 rounded-xl flex items-center gap-3 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                      <Heart className="w-5 h-5 text-rose-500 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-slate-400 block uppercase">Pulse Rate</span>
                        <span className="text-sm font-black text-slate-800">{visit.pulseRate} bpm</span>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-slate-900 p-3.5 rounded-xl flex items-center gap-3 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                      <User className="w-5 h-5 text-slate-500 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-slate-400 block uppercase">Severity Status</span>
                        <span className="text-sm font-black text-slate-800">{visit.severity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Diagnosis conditions list */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Identified Presenting Conditions</span>
                    <div className="flex flex-wrap gap-2">
                      {visit.presentingConditions.map(cond => (
                        <span key={cond} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                          {cond}
                        </span>
                      ))}
                      {visit.presentingConditions.length === 0 && (
                        <span className="text-xs text-slate-500 italic font-bold">None specified</span>
                      )}
                    </div>
                  </div>

                  {/* Case Descriptions layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id={`diagnostics-split-${visit.id}`}>
                    <div className="space-y-1">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Symptoms / Complaints</span>
                      <p className="text-sm text-slate-700 bg-white border-2 border-slate-900 rounded-xl p-3.5 font-bold leading-relaxed shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                        {visit.symptoms}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Administered Treatment & Meds</span>
                      <div className="bg-white border-2 border-slate-900 rounded-xl p-3.5 space-y-2 text-sm text-slate-700 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                        <p><strong className="text-slate-800">First-aid treatment:</strong> {visit.treatment || 'None'}</p>
                        {visit.medicationDispensedId && (
                          <div className="flex items-center gap-1.5 text-xs font-black bg-slate-100 p-2 rounded-lg border-2 border-slate-900 mt-2 text-slate-600">
                            <BriefcaseMedical className="w-4 h-4 text-slate-400" />
                            Dispensed: {visit.medicationDispensedQty} {visit.medicationDispensedId === 'MED-001' ? 'tablets Paracetamol' : 'medicine unit'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional notes & signs */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5 font-bold text-slate-500">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Outcome disposition: <strong className="text-slate-900 font-black ml-1 uppercase">{visit.disposition}</strong>
                      {visit.observedBedNo && (
                        <span> (Occupied: {visit.observedBedNo} {visit.observationEndTime ? 'until ' + new Date(visit.observationEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '[STILL OCCUPIED]'})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-100 py-1.5 px-3.5 rounded-lg border-2 border-slate-900 text-slate-700">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Attending Practitioner: <strong className="text-slate-700 font-black ml-1 uppercase">{visit.treatedBy}</strong>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}

        {filteredVisits.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm font-black border-2 border-dashed border-slate-300 rounded-3xl uppercase">
            No medical encounter records matched search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
