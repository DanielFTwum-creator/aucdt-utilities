import React, { useState } from 'react';
import { Visit, Medication, FacilityLog, Patient, DailyHealthCheck } from '../types';
import { 
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Plus, 
  Clock, 
  LogOut, 
  Bed, 
  Thermometer, 
  ChevronRight,
  ShieldCheck,
  BriefcaseMedical,
  Heart,
  Pill,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import StatCard from './StatCard';
import ActionButton from './ActionButton';

interface DashboardProps {
  visits: Visit[];
  medications: Medication[];
  facilityLogs: FacilityLog[];
  patients: Patient[];
  dailyHealthChecks: DailyHealthCheck[];
  onAddDailyHealthCheck: (check: Omit<DailyHealthCheck, 'id' | 'dateTime'>) => void;
  onNavigate: (tab: string) => void;
  onDischargeObservation: (visitId: string, notes: string) => void;
  onOpenQuickLog: () => void;
  userName?: string;
}

export default function Dashboard({
  visits,
  medications,
  facilityLogs,
  patients,
  dailyHealthChecks,
  onAddDailyHealthCheck,
  onNavigate,
  onDischargeObservation,
  onOpenQuickLog,
  userName
}: DashboardProps) {
  const [selectedVisitIdForDischarge, setSelectedVisitIdForDischarge] = useState<string | null>(null);
  const [dischargeNotes, setDischargeNotes] = useState('');

  // Daily Health Check states
  const [showDailyCheckForm, setShowDailyCheckForm] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [tempVal, setTempVal] = useState('36.5');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['None / Healthy']);
  const [checkStatus, setCheckStatus] = useState<'Healthy' | 'Needs Monitor' | 'Refer to Sickbay'>('Healthy');
  const [checkNotes, setCheckNotes] = useState('');
  const [dhcSearchQuery, setDhcSearchQuery] = useState('');
  const [dhcFilterStatus, setDhcFilterStatus] = useState<string>('All');

  const handleSymptomToggle = (symptom: string) => {
    if (symptom === 'None / Healthy') {
      setSelectedSymptoms(['None / Healthy']);
    } else {
      let updated = selectedSymptoms.filter(s => s !== 'None / Healthy');
      if (updated.includes(symptom)) {
        updated = updated.filter(s => s !== symptom);
        if (updated.length === 0) {
          updated = ['None / Healthy'];
        }
      } else {
        updated.push(symptom);
      }
      setSelectedSymptoms(updated);
    }
  };

  const handleDailyCheckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert("Please select a student");
      return;
    }
    const student = patients.find(p => p.id === selectedStudentId);
    if (!student) return;

    onAddDailyHealthCheck({
      patientId: student.id,
      patientName: student.name,
      classOrDept: student.classOrDept,
      temperature: parseFloat(tempVal) || 36.5,
      symptoms: selectedSymptoms,
      status: checkStatus,
      notes: checkNotes
    });

    // Reset form
    setSelectedStudentId('');
    setTempVal('36.5');
    setSelectedSymptoms(['None / Healthy']);
    setCheckStatus('Healthy');
    setCheckNotes('');
    setShowDailyCheckForm(false);
  };

  // Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const visitsToday = visits.filter(v => v.dateTime.startsWith(todayStr));
  
  // Active observations (Observe in Sick Bay and no observationEndTime)
  const activeObservations = visits.filter(v => v.disposition === 'Observe in Sick Bay' && !v.observationEndTime);

  // Low stock medications (quantity <= threshold)
  const lowStockMedications = medications.filter(m => m.quantityOnHand <= m.reorderThreshold);
  // Expired medications (expiry date <= today)
  const expiredMedications = medications.filter(m => new Date(m.expiryDate) <= new Date());

  // Medications expiring within the next 30 days (excluding already expired ones for better specificity)
  const expiringSoonMedications = medications.filter(m => {
    const expDate = new Date(m.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setHours(0, 0, 0, 0);
    thirtyDaysLater.setDate(today.getDate() + 30);
    return expDate > today && expDate <= thirtyDaysLater;
  });

  const getDaysUntilExpiry = (dateStr: string) => {
    const exp = new Date(dateStr);
    exp.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Unresolved facility issues
  const unresolvedIssues = facilityLogs.filter(f => !f.isResolved);

  // Group visits by patient to find each patient's latest visit
  const latestVisitByPatient: { [patientId: string]: Visit } = {};
  visits.forEach(v => {
    const existing = latestVisitByPatient[v.patientId];
    if (!existing || new Date(v.dateTime) > new Date(existing.dateTime)) {
      latestVisitByPatient[v.patientId] = v;
    }
  });

  // Check which of these latest visits have a fever (>= 37.8) or high BP. Uses the
  // standard hypertension threshold (>= 140/90) so a normal 120/80 reading is not
  // flagged as abnormal (which also kept inflating the Critical Alerts count).
  const patientsWithVitalsAlerts = Object.values(latestVisitByPatient).map(v => {
    let systolic = 120;
    let diastolic = 80;
    if (v.bloodPressure && v.bloodPressure.includes('/')) {
      const parts = v.bloodPressure.split('/');
      const sys = parseInt(parts[0], 10);
      const dia = parseInt(parts[1], 10);
      if (!isNaN(sys)) systolic = sys;
      if (!isNaN(dia)) diastolic = dia;
    }
    const isFever = v.temperature >= 37.8;
    const isHighBP = systolic >= 140 || diastolic >= 90;
    
    return {
      visit: v,
      isFever,
      isHighBP,
      systolic,
      diastolic,
      temperature: v.temperature,
      bloodPressure: v.bloodPressure,
      patientName: v.patientName,
      patientType: v.patientType,
      classOrDept: v.classOrDept,
      patientId: v.patientId
    };
  }).filter(alert => alert.isFever || alert.isHighBP);

  // Stats for the last 30 days
  const visitsLast30Days = visits.length; // Simplified for demo
  const studentVisitsCount = visits.filter(v => v.patientType === 'Student').length;
  const staffVisitsCount = visits.filter(v => v.patientType === 'Staff').length;

  // Group visits by presenting conditions for chart
  const conditionMap: { [key: string]: number } = {};
  visits.forEach(v => {
    v.presentingConditions.forEach(c => {
      // Clean up common condition names for clean charting
      let shortName = c.split('(')[0].trim();
      conditionMap[shortName] = (conditionMap[shortName] || 0) + 1;
    });
  });

  const conditionData = Object.entries(conditionMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5

  const maxConditionCount = Math.max(...conditionData.map(d => d.count), 1);

  // Today's Summary derived values (priority-first dashboard)
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = userName ? userName.trim().split(/\s+/)[0] : '';

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const visitsYesterdayCount = visits.filter(v => v.dateTime.startsWith(yesterdayStr)).length;
  const visitDelta = visitsToday.length - visitsYesterdayCount;

  // Critical = things that need action now: expired stock, abnormal vitals, unresolved facility faults.
  const criticalCount = expiredMedications.length + patientsWithVitalsAlerts.length + unresolvedIssues.length;

  const handleDischargeSubmit = (visitId: string) => {
    onDischargeObservation(visitId, dischargeNotes || 'Discharged from sick bay after resting. Symptoms resolved.');
    setSelectedVisitIdForDischarge(null);
    setDischargeNotes('');
  };

  return (
    <div className="space-y-8" id="dashboard-tab">
      {/* Today's Summary — compact, priority-first header */}
      <div className="bento-card-dark rounded-[2rem] p-5 md:p-6 relative overflow-hidden" id="welcome-banner">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-radial from-emerald-500 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#34d399]/20 text-[#34d399] rounded-full text-[11px] font-black tracking-wide border-2 border-[#34d399]">
                <ShieldCheck className="w-3.5 h-3.5" /> School Health Centre Live
              </span>
              <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase font-display italic text-white">
                {greeting}{firstName ? `, ${firstName}` : ''}
              </h1>
            </div>

            {/* Live summary figures */}
            <div className="flex flex-wrap gap-2" aria-label="Today's clinic summary">
              <div className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 min-w-[92px]">
                <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Visits today</span>
                <span className="text-lg font-black text-white leading-none">
                  {visitsToday.length}
                  {(visitsToday.length > 0 || visitsYesterdayCount > 0) && (
                    <span className={`ml-1.5 text-[10px] font-black align-middle ${visitDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {visitDelta >= 0 ? '▲' : '▼'} {Math.abs(visitDelta)}
                    </span>
                  )}
                </span>
              </div>
              <div className={`rounded-xl px-3 py-2 min-w-[92px] border ${criticalCount > 0 ? 'bg-rose-500/20 border-rose-400/40' : 'bg-white/10 border-white/15'}`}>
                <span className={`block text-[9px] font-black uppercase tracking-wider ${criticalCount > 0 ? 'text-rose-300' : 'text-slate-400'}`}>Critical</span>
                <span className={`text-lg font-black leading-none ${criticalCount > 0 ? 'text-rose-100' : 'text-white'}`}>{criticalCount}</span>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 min-w-[92px]">
                <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">In observation</span>
                <span className="text-lg font-black text-white leading-none">{activeObservations.length}</span>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 min-w-[110px]">
                <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Clinic status</span>
                <span className={`text-sm font-black leading-none ${criticalCount > 0 ? 'text-amber-300' : 'text-emerald-400'}`}>
                  {criticalCount > 0 ? 'Needs attention' : 'Operational'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <ActionButton
              id="quick-log-btn"
              onClick={onOpenQuickLog}
              variant="primary"
              label="Log New Visit"
              icon={Plus}
            />
            <ActionButton
              id="view-roster-btn"
              onClick={() => onNavigate('roster')}
              variant="secondary"
              label="Roster"
              icon={Users}
              iconClassName="w-4 h-4"
            />
            <ActionButton
              id="daily-health-check-btn"
              onClick={() => setShowDailyCheckForm(!showDailyCheckForm)}
              variant="secondary"
              label={showDailyCheckForm ? "Close Form" : "Daily Check"}
              icon={Heart}
            />
          </div>
        </div>
      </div>

      {/* Daily Health Check Form Section */}
      {showDailyCheckForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card p-6 space-y-6 border-2 border-slate-900 bg-indigo-50/40 rounded-[2rem] shadow-[6px_6px_0px_rgba(15,23,42,1)] animate-fadeIn"
          id="daily-health-check-form-container"
        >
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-black uppercase italic font-display text-indigo-950 flex items-center gap-2">
                <Heart className="w-6 h-6 text-indigo-600 animate-pulse" /> New Daily Wellness Check
              </h2>
              <p className="text-xs text-indigo-800 font-semibold uppercase">Quick routine student clinical screening</p>
            </div>
            <button 
              type="button"
              onClick={() => setShowDailyCheckForm(false)}
              className="text-xs font-black uppercase bg-white border-2 border-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 shadow-[2px_2px_0px_rgba(15,23,42,1)] cursor-pointer text-slate-700"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleDailyCheckSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Student Selector */}
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                  Select Student <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-white border-2 border-slate-900 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose student from roster --</option>
                  {patients.filter(p => p.type === 'Student').map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.classOrDept}) - ID: {s.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Temperature & Presets */}
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                  Body Temperature (°C) <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="34"
                    max="43"
                    required
                    value={tempVal}
                    onChange={(e) => setTempVal(e.target.value)}
                    className="flex-1 bg-white border-2 border-slate-900 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex gap-1.5">
                    {['36.5', '37.5', '38.2'].map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setTempVal(p)}
                        className={`text-xs font-black px-3 py-2 border-2 border-slate-900 rounded-xl shadow-[1px_1px_0px_rgba(15,23,42,1)] transition-colors cursor-pointer ${
                          tempVal === p ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        {p}°C
                      </button>
                    ))}
                  </div>
                </div>
                {parseFloat(tempVal) >= 37.8 && (
                  <p className="text-[10px] font-black uppercase text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> High temperature / fever detected!
                  </p>
                )}
              </div>

              {/* Status Picker */}
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                  Overall Wellness Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Healthy', 'Needs Monitor', 'Refer to Sickbay'] as const).map(status => {
                    const isActive = checkStatus === status;
                    let colorClass = '';
                    if (status === 'Healthy') colorClass = isActive ? 'bg-emerald-500 text-slate-950 border-emerald-700 font-black' : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-900';
                    if (status === 'Needs Monitor') colorClass = isActive ? 'bg-amber-500 text-slate-950 border-amber-700 font-black' : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-900';
                    if (status === 'Refer to Sickbay') colorClass = isActive ? 'bg-rose-500 text-white border-rose-700 font-black' : 'bg-white hover:bg-rose-50 text-slate-800 border-slate-900';

                    return (
                      <button
                        type="button"
                        key={status}
                        onClick={() => setCheckStatus(status)}
                        className={`p-3 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-[2px_2px_0px_rgba(15,23,42,1)] text-center cursor-pointer ${colorClass}`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Symptoms Checklist */}
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                  Symptoms Exhibited
                </label>
                <div className="grid grid-cols-2 gap-2 bg-white border-2 border-slate-900 rounded-xl p-3.5">
                  {['None / Healthy', 'Cough', 'Runny Nose', 'Sore Throat', 'Headache', 'Feverish / Chills', 'Stomach Ache', 'Fatigue'].map(sym => {
                    const isSelected = selectedSymptoms.includes(sym);
                    return (
                      <button
                        type="button"
                        key={sym}
                        onClick={() => handleSymptomToggle(sym)}
                        className={`text-left px-2.5 py-1.5 rounded-lg border-2 text-xs font-bold uppercase transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-slate-900 text-white border-slate-900' 
                            : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100'
                        }`}
                      >
                        <span>{sym}</span>
                        {isSelected && <span className="text-[10px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Notes */}
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                  Check Notes / Remarks (Optional)
                </label>
                <textarea
                  value={checkNotes}
                  onChange={(e) => setCheckNotes(e.target.value)}
                  placeholder="E.g. student reports feeling better today, allergy check done, etc..."
                  rows={2}
                  className="w-full bg-white border-2 border-slate-900 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 border-2 border-slate-900 text-slate-900 font-black uppercase py-3.5 rounded-xl text-sm transition-all shadow-[4px_4px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_rgba(15,23,42,1)] cursor-pointer"
              >
                ✓ Save Wellness Check
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Metrics Grid — ordered by operational urgency (most critical first) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        {/* 1. Critical: needs action now */}
        <StatCard
          id="kpi-critical-alerts"
          status={criticalCount > 0 ? 'danger' : 'success'}
          count={criticalCount}
          label="Critical Alerts"
          subtext={
            criticalCount > 0 ? (
              <div className="flex flex-wrap gap-1 mt-0.5" id="critical-sub-counts">
                {expiredMedications.length > 0 && (
                  <span className="bg-red-950/40 text-rose-100 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                    {expiredMedications.length} Expired
                  </span>
                )}
                {patientsWithVitalsAlerts.length > 0 && (
                  <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                    {patientsWithVitalsAlerts.length} Vitals
                  </span>
                )}
                {unresolvedIssues.length > 0 && (
                  <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                    {unresolvedIssues.length} Facility
                  </span>
                )}
              </div>
            ) : (
              "All clear"
            )
          }
          icon={AlertTriangle}
          onClick={() => onNavigate('inventory')}
        />

        {/* 2. In observation now */}
        <StatCard
          id="kpi-bed-occupancy"
          status="info"
          count={activeObservations.length}
          label="In Observation"
          subtext={
            activeObservations.length > 0 ? (
              <span className="underline decoration-white/50 underline-offset-2">
                View active beds ↓
              </span>
            ) : (
              "Beds free"
            )
          }
          icon={Bed}
          onClick={
            activeObservations.length > 0
              ? () => document.getElementById('active-beds-panel')?.scrollIntoView({ behavior: 'smooth' })
              : undefined
          }
        />

        {/* 3. Visits today with trend vs yesterday */}
        <StatCard
          id="kpi-visits-today"
          status="info"
          count={visitsToday.length}
          label="Visits Today"
          subtext={
            <span className="text-[11px] font-bold flex items-center gap-1 mt-0.5">
              <span className={visitDelta >= 0 ? 'text-emerald-300' : 'text-rose-200'}>
                {visitDelta >= 0 ? '▲' : '▼'} {Math.abs(visitDelta)}
              </span>
              <span className="opacity-70">vs yesterday ({visitsYesterdayCount})</span>
            </span>
          }
          icon={Activity}
          onClick={() => onNavigate('visits')}
        />

        {/* 4. Medicine stock */}
        <StatCard
          id="kpi-inventory-alerts"
          status={lowStockMedications.length > 0 ? 'warning' : 'success'}
          count={lowStockMedications.length}
          label="Low Stock Meds"
          subtext={lowStockMedications.length > 0 ? "Below reorder level" : "Stock levels healthy"}
          icon={Pill}
          onClick={() => onNavigate('inventory')}
        />
      </div>

      {/* Observation Bed Section */}
      {activeObservations.length > 0 && (
        <div className="bg-amber-100 border-2 border-slate-900 rounded-[2rem] p-6 space-y-4 shadow-[6px_6px_0px_#0f172a]" id="active-beds-panel">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white border-2 border-slate-900 text-slate-900 rounded-xl animate-pulse">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase italic tracking-tight font-display text-slate-900">Active Observation Beds</h2>
              <p className="text-xs text-slate-700 font-bold uppercase">Please discharge students or staff once their clinical observation completes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="beds-grid">
            {activeObservations.map(obs => (
              <div key={obs.id} className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden" id={`bed-card-${obs.id}`}>
                <div className="absolute right-0 top-0 bg-[#0f172a] text-white px-3 py-1 rounded-bl-xl border-l-2 border-b-2 border-slate-900 text-xs font-black tracking-wide">
                  {obs.observedBedNo || 'Bed Reserved'}
                </div>
                <div className="space-y-1.5 pr-12">
                  <h3 className="font-black text-slate-800 text-base leading-tight">{obs.patientName}</h3>
                  <p className="text-xs text-slate-500 font-bold">{obs.patientType} • {obs.classOrDept}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold uppercase text-[9px]">Temp / Pulse / BP</span>
                    <span className="font-mono text-slate-700 font-black">{obs.temperature}°C / {obs.pulseRate} bpm / {obs.bloodPressure}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-2">
                    <strong className="text-slate-800 font-bold">Symptoms: </strong>{obs.symptoms}
                  </div>
                </div>

                {selectedVisitIdForDischarge === obs.id ? (
                  <div className="space-y-2 pt-2 border-t-2 border-slate-100" id={`discharge-form-${obs.id}`}>
                    <textarea
                      value={dischargeNotes}
                      onChange={(e) => setDischargeNotes(e.target.value)}
                      placeholder="Add recovery notes / checkout medication before discharging..."
                      className="w-full text-xs border-2 border-slate-900 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 placeholder-slate-400"
                      rows={2}
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedVisitIdForDischarge(null)}
                        className="bento-btn bg-white hover:bg-slate-100 text-xs py-1 px-3"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDischargeSubmit(obs.id)}
                        className="bento-btn bento-btn-primary text-xs py-1 px-3"
                      >
                        <CheckCircle className="w-3 h-3" /> Save & Discharge
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Checked in {new Date(obs.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => setSelectedVisitIdForDischarge(obs.id)}
                      className="bento-btn bento-btn-primary text-xs py-1.5 px-3"
                    >
                      <LogOut className="w-3 h-3" /> Discharge
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics and Sidebars Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="dashboard-details">
        {/* Analytics Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Medical Alerts Widget */}
          <div className="bento-card p-6 space-y-6 border-2 border-slate-900 bg-white rounded-[2rem] shadow-[6px_6px_0px_rgba(15,23,42,1)] animate-fadeIn" id="medical-alerts-widget">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black uppercase italic font-display text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-rose-600 animate-pulse" /> Active Medical & Stock Alerts
                </h2>
                <p className="text-xs text-slate-400 font-semibold uppercase">Real-time surveillance of patient health status and clinical supplies</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-rose-100 text-rose-800 border-2 border-slate-900 px-3 py-1 rounded-xl shadow-[2px_2px_0px_rgba(15,23,42,1)] uppercase">
                  {lowStockMedications.length + patientsWithVitalsAlerts.length + expiringSoonMedications.length} Active Alerts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="medical-alerts-grid">
              {/* Left Column: Medications Below Minimum Stock */}
              <div className="space-y-4" id="medications-stock-alerts">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Pill className="w-4 h-4 text-emerald-600" /> Stock Alerts ({lowStockMedications.length})
                </h3>
                
                {lowStockMedications.length > 0 ? (
                  <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                    {lowStockMedications.map(med => (
                      <div key={med.id} className="bg-red-50 hover:bg-red-100 transition-colors border-2 border-slate-900 rounded-2xl p-3.5 shadow-[3px_3px_0px_rgba(15,23,42,1)] flex flex-col justify-between" id={`med-alert-card-${med.id}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-black text-slate-900 text-sm uppercase">{med.name}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Category: {med.category}</p>
                          </div>
                          <span className="text-[10px] font-black bg-red-200 text-red-800 border border-red-300 px-2 py-0.5 rounded uppercase shrink-0">
                            Low Stock
                          </span>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-red-200/50">
                          <div>
                            <span className="text-slate-500 font-medium">Stock: </span>
                            <span className="font-black text-red-700">{med.quantityOnHand} {med.unit}</span>
                            <span className="text-[10px] text-slate-400 font-bold"> (Min: {med.reorderThreshold})</span>
                          </div>
                          <button
                            onClick={() => onNavigate('inventory')}
                            className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            Update Stock <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-black uppercase">All items well-stocked</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-0.5 font-semibold">No medications are currently below minimum stock thresholds</p>
                  </div>
                )}
              </div>

              {/* Middle Column: Medications Expiring Soon (< 30 Days) */}
              <div className="space-y-4" id="medications-expiry-alerts">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Clock className="w-4 h-4 text-amber-500" /> Expiry Alerts ({expiringSoonMedications.length})
                </h3>

                {expiringSoonMedications.length > 0 ? (
                  <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                    {expiringSoonMedications.map(med => {
                      const daysLeft = getDaysUntilExpiry(med.expiryDate);
                      let badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
                      if (daysLeft <= 10) {
                        badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
                      } else if (daysLeft <= 20) {
                        badgeColor = 'bg-orange-100 text-orange-800 border-orange-300';
                      }

                      return (
                        <div key={med.id} className="bg-amber-50/70 hover:bg-amber-100/80 transition-colors border-2 border-slate-900 rounded-2xl p-3.5 shadow-[3px_3px_0px_rgba(15,23,42,1)] flex flex-col justify-between" id={`expiry-alert-card-${med.id}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-black text-slate-900 text-sm uppercase">{med.name}</h4>
                              <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Category: {med.category}</p>
                            </div>
                            <span className={`text-[10px] font-black border px-2 py-0.5 rounded uppercase shrink-0 ${badgeColor}`}>
                              {daysLeft}d left
                            </span>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-amber-200/50">
                            <div>
                              <span className="text-slate-500 font-medium">Expires: </span>
                              <span className="font-mono font-black text-slate-700">{med.expiryDate}</span>
                            </div>
                            <button
                              onClick={() => onNavigate('inventory')}
                              className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              Update <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-black uppercase">No Expiry Warnings</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-0.5 font-semibold">No medications are expiring within the next 30 days</p>
                  </div>
                )}
              </div>

              {/* Right Column: Patients with Recent Fever/High BP readings */}
              <div className="space-y-4" id="patients-vitals-alerts">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Heart className="w-4 h-4 text-rose-600" /> Vitals Warnings ({patientsWithVitalsAlerts.length})
                </h3>

                {patientsWithVitalsAlerts.length > 0 ? (
                  <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                    {patientsWithVitalsAlerts.map(alert => (
                      <div key={alert.patientId} className="bg-amber-50 hover:bg-amber-100 transition-colors border-2 border-slate-900 rounded-2xl p-3.5 shadow-[3px_3px_0px_rgba(15,23,42,1)]" id={`patient-alert-card-${alert.patientId}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <h4 className="font-black text-slate-900 text-sm uppercase leading-tight">{alert.patientName}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{alert.patientType} • {alert.classOrDept}</p>
                          </div>
                          <span className="text-[9px] font-black bg-amber-200 text-amber-800 border border-amber-300 px-2 py-0.5 rounded uppercase shrink-0">
                            Abnormal Vitals
                          </span>
                        </div>

                        {/* Warnings indicators */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {alert.isFever && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-300 px-2 py-1 rounded">
                              <Thermometer className="w-3.5 h-3.5" /> Temp: {alert.temperature} °C (Fever)
                            </span>
                          )}
                          {alert.isHighBP && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black bg-orange-100 text-orange-700 border border-orange-300 px-2 py-1 rounded">
                              <Activity className="w-3.5 h-3.5" /> BP: {alert.bloodPressure} (High)
                            </span>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-amber-200/50 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-bold uppercase">
                            Reading: {new Date(alert.visit.dateTime).toLocaleDateString()} {new Date(alert.visit.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => onNavigate('roster')}
                            className="font-black uppercase text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            View Profile <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-black uppercase">No Vitals Alerts</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-0.5 font-semibold">No recent patients are showing fever or high blood pressure readings</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Daily Health Check Journal */}
          <div className="bento-card p-6 space-y-6 border-2 border-slate-900 bg-white rounded-[2rem] shadow-[6px_6px_0px_rgba(15,23,42,1)]" id="daily-health-checks-widget">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black uppercase italic font-display text-slate-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-indigo-600" /> Daily Health Check Journal
                </h2>
                <p className="text-xs text-slate-400 font-semibold uppercase">Routine wellness check-ups & screening registry</p>
              </div>

              {/* Mini Stats Banner */}
              <div className="flex flex-wrap gap-2">
                <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-center min-w-[70px]">
                  <span className="text-[9px] font-black text-slate-400 block uppercase leading-none">Total</span>
                  <span className="text-sm font-black text-slate-800 leading-none mt-1 block">{dailyHealthChecks.length}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center min-w-[70px]">
                  <span className="text-[9px] font-black text-emerald-500 block uppercase leading-none">Healthy</span>
                  <span className="text-sm font-black text-emerald-700 leading-none mt-1 block">
                    {dailyHealthChecks.filter(c => c.status === 'Healthy').length}
                  </span>
                </div>
                <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-center min-w-[70px]">
                  <span className="text-[9px] font-black text-amber-500 block uppercase leading-none">Monitor</span>
                  <span className="text-sm font-black text-amber-700 leading-none mt-1 block">
                    {dailyHealthChecks.filter(c => c.status === 'Needs Monitor').length}
                  </span>
                </div>
                <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-center min-w-[70px]">
                  <span className="text-[9px] font-black text-rose-500 block uppercase leading-none">Sickbay</span>
                  <span className="text-sm font-black text-rose-700 leading-none mt-1 block">
                    {dailyHealthChecks.filter(c => c.status === 'Refer to Sickbay').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search student or class..."
                value={dhcSearchQuery}
                onChange={(e) => setDhcSearchQuery(e.target.value)}
                className="flex-1 text-xs border-2 border-slate-900 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 font-bold uppercase placeholder-slate-400 focus:outline-none focus:bg-white"
              />
              <div className="flex gap-1">
                {['All', 'Healthy', 'Needs Monitor', 'Refer to Sickbay'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setDhcFilterStatus(st)}
                    className={`text-[10px] font-black uppercase px-2.5 py-2 border-2 border-slate-900 rounded-xl transition-all shadow-[1px_1px_0px_rgba(15,23,42,1)] cursor-pointer ${
                      dhcFilterStatus === st ? 'bg-indigo-600 text-white shadow-none translate-y-0.5 font-black' : 'bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1" id="daily-checks-list-rows">
              {(() => {
                const filtered = dailyHealthChecks.filter(c => {
                  const matchSearch = c.patientName.toLowerCase().includes(dhcSearchQuery.toLowerCase()) || 
                                      c.classOrDept.toLowerCase().includes(dhcSearchQuery.toLowerCase());
                  const matchStatus = dhcFilterStatus === 'All' || c.status === dhcFilterStatus;
                  return matchSearch && matchStatus;
                });

                if (filtered.length > 0) {
                  return filtered.map((check) => {
                    const checkDate = new Date(check.dateTime);
                    let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                    if (check.status === 'Needs Monitor') badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
                    if (check.status === 'Refer to Sickbay') badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';

                    const isFever = check.temperature >= 37.8;

                    return (
                      <div 
                        key={check.id} 
                        className="bg-slate-50 hover:bg-slate-100/80 transition-colors border-2 border-slate-900 rounded-2xl p-4 shadow-[2px_2px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn"
                        id={`dhc-row-${check.id}`}
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-black text-slate-900 text-sm uppercase leading-tight">{check.patientName}</h4>
                            <span className="text-[10px] font-bold text-slate-400">• {check.classOrDept}</span>
                            <span className={`text-[9px] font-black border px-2 py-0.5 rounded uppercase ${badgeBg}`}>
                              {check.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                            <div className="flex items-center gap-1">
                              <Thermometer className={`w-3.5 h-3.5 ${isFever ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                              <span className="text-slate-500 font-bold uppercase">Temp:</span>
                              <span className={`font-black ${isFever ? 'text-rose-600 font-black' : 'text-slate-700'}`}>{check.temperature} °C</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 font-bold uppercase">Symptoms:</span>
                              <div className="flex flex-wrap gap-1">
                                {check.symptoms.map(s => (
                                  <span key={s} className="text-[10px] font-black bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded border border-slate-300 uppercase">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {check.notes && (
                            <p className="text-xs text-slate-500 italic bg-white/60 border border-slate-200/50 p-2 rounded-lg">
                              &quot;{check.notes}&quot;
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">
                            Checked at {checkDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium block mt-0.5">
                            {checkDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  });
                } else {
                  return (
                    <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                      <CheckCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 font-black uppercase">No checks match your filter</p>
                      <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Record routine checks using the Daily Health Check button above</p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          <div className="bento-card p-6 space-y-6" id="top-conditions-analytics">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase italic font-display text-slate-900">Top Presenting Conditions</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase">Main medical issues logged across current visits</p>
              </div>
              <button
                onClick={() => onNavigate('reports')}
                className="text-xs font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                Detailed reports <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Custom SVG Bar Chart */}
            {conditionData.length > 0 ? (
              <div className="space-y-4" id="custom-condition-bar-chart">
                {conditionData.map((d, index) => {
                  const percentage = (d.count / maxConditionCount) * 100;
                  return (
                    <div key={d.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full border border-slate-900" style={{ backgroundColor: `hsl(${140 + index * 40}, 75%, 45%)` }} />
                          {d.name}
                        </span>
                        <span>{d.count} {d.count === 1 ? 'visit' : 'visits'}</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-900">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: `hsl(${140 + index * 40}, 75%, 45%)` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No clinical visits recorded yet to show health data.
              </div>
            )}
          </div>

          {/* Recent Visits List */}
          <div className="bento-card p-6 space-y-4" id="recent-visits-panel">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase italic font-display text-slate-900">Recent Visits Timeline</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase">The latest school clinical check-ins</p>
              </div>
              <button
                onClick={() => onNavigate('visits')}
                className="text-xs font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                View all visits <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y-2 divide-slate-100" id="recent-visits-list">
              {visits.slice().reverse().slice(0, 4).map((visit) => (
                <div key={visit.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4 hover:bg-slate-50/50 p-2 rounded-xl transition-colors" id={`recent-visit-row-${visit.id}`}>
                  <div className={`p-2 rounded-xl border-2 border-slate-900 ${
                    visit.severity === 'Severe' 
                      ? 'bg-rose-100 text-rose-600' 
                      : visit.severity === 'Moderate'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-100 text-emerald-600'
                  } shrink-0`}>
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-slate-800 text-sm md:text-base truncate">{visit.patientName}</h4>
                      <span className="bento-badge border-slate-900" style={{
                        backgroundColor: visit.severity === 'Severe' ? '#ffe4e6' : visit.severity === 'Moderate' ? '#fef3c7' : '#d1fae5',
                        color: visit.severity === 'Severe' ? '#e11d48' : visit.severity === 'Moderate' ? '#d97706' : '#059669',
                      }}>{visit.severity}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold">
                      {visit.patientType} • {visit.classOrDept} • {new Date(visit.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      <strong className="text-slate-700">Presenting: </strong>{visit.presentingConditions.join(', ') || 'General Symptoms'}
                    </p>
                    {visit.treatment && (
                      <p className="text-xs text-slate-500 italic line-clamp-1">
                        &quot;{visit.treatment}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {visits.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No medical records found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards Right Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Demographic Breakdown */}
          <div className="bento-card p-6 space-y-5" id="demographic-chart-box">
            <div>
              <h2 className="text-lg font-black uppercase italic font-display text-slate-900">Patient Composition</h2>
              <p className="text-xs text-slate-400 font-semibold uppercase">Total visits breakdown by patient type</p>
            </div>

            {/* Premium custom SVG Donut Chart */}
            {visits.length > 0 ? (
              <div className="flex flex-col items-center space-y-4" id="custom-demographic-donut-chart">
                <svg width="150" height="150" viewBox="0 0 100 100" className="-rotate-95">
                  {/* Outer circle track */}
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                  
                  {/* Student slice */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray={`${(studentVisitsCount / visits.length) * 219.9} 219.9`}
                  />
                  {/* Staff slice - offset */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    strokeDasharray={`${(staffVisitsCount / visits.length) * 219.9} 219.9`}
                    strokeDashoffset={`-${(studentVisitsCount / visits.length) * 219.9}`}
                  />
                </svg>

                <div className="grid grid-cols-2 gap-4 w-full" id="donut-legend">
                  <div className="text-center bg-emerald-50 border-2 border-slate-900 p-2.5 rounded-xl">
                    <span className="text-xs font-black text-slate-500 block uppercase">Students</span>
                    <span className="text-xl font-black text-emerald-600 block">{studentVisitsCount}</span>
                    <span className="text-[10px] text-emerald-600/75 font-bold">({visits.length ? Math.round((studentVisitsCount / visits.length) * 100) : 0}%)</span>
                  </div>
                  <div className="text-center bg-blue-50 border-2 border-slate-900 p-2.5 rounded-xl">
                    <span className="text-xs font-black text-slate-500 block uppercase">Staff</span>
                    <span className="text-xl font-black text-blue-600 block">{staffVisitsCount}</span>
                    <span className="text-[10px] text-blue-600/75 font-bold">({visits.length ? Math.round((staffVisitsCount / visits.length) * 100) : 0}%)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                No visitor statistics available.
              </div>
            )}
          </div>

          {/* Quick Critical Actions/Alerts */}
          <div className="bento-card p-6 space-y-4" id="inventory-alerts-panel">
            <h2 className="text-lg font-black uppercase italic font-display text-slate-900">Critical Alerts</h2>
            
            <div className="space-y-3" id="alerts-container">
              {lowStockMedications.slice(0, 2).map(med => (
                <div key={med.id} className="flex gap-3 bg-red-100 border-2 border-slate-900 rounded-2xl p-3.5" id={`alert-stock-${med.id}`}>
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-red-950 text-xs uppercase">{med.name} is Low</h4>
                    <p className="text-[10px] text-red-700 font-bold uppercase">Left: {med.quantityOnHand} {med.unit} (Limit: {med.reorderThreshold})</p>
                    <button 
                      onClick={() => onNavigate('inventory')}
                      className="text-[10px] font-black uppercase text-red-900 underline mt-1 cursor-pointer"
                    >
                      Reorder now
                    </button>
                  </div>
                </div>
              ))}

              {expiredMedications.slice(0, 1).map(med => (
                <div key={med.id} className="flex gap-3 bg-rose-100 border-2 border-slate-900 rounded-2xl p-3.5" id={`alert-expiry-${med.id}`}>
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-rose-950 text-xs uppercase">{med.name} Expired</h4>
                    <p className="text-[10px] text-rose-700 font-bold uppercase">Expired on: {med.expiryDate}</p>
                    <button 
                      onClick={() => onNavigate('inventory')}
                      className="text-[10px] font-black uppercase text-rose-900 underline mt-1 cursor-pointer"
                    >
                      Remove from Stock
                    </button>
                  </div>
                </div>
              ))}

              {unresolvedIssues.length > 0 && (
                <div className="flex gap-3 bg-amber-100 border-2 border-slate-900 rounded-2xl p-3.5" id="alert-veronica">
                  <BriefcaseMedical className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-amber-950 text-xs uppercase">Unresolved Facility Issue</h4>
                    <p className="text-[10px] text-amber-700 font-bold">
                      Item: &quot;{unresolvedIssues[0].equipmentName}&quot; is reported as {unresolvedIssues[0].status.toLowerCase()}.
                    </p>
                    <button 
                      onClick={() => onNavigate('facility')}
                      className="text-[10px] font-black uppercase text-amber-900 underline mt-1 cursor-pointer"
                    >
                      View Facility logs
                    </button>
                  </div>
                </div>
              )}

              {lowStockMedications.length === 0 && expiredMedications.length === 0 && unresolvedIssues.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-100 rounded-xl">
                  🎉 All medical supply lines, medicines, and facilities are functional and secure.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
