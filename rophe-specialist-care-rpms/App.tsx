import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatientRegistry from './components/PatientRegistry';
import ClinicalAssistance from './components/ClinicalAssistance';
import VideoCall from './components/VideoCall';
import AdminPanel from './components/AdminPanel';
import { AdminProvider, useAdmin } from './src/contexts/AdminContext';
import { useAuth } from './src/contexts/AuthContext';
import { mockPatients, mockAppointments, mockAlerts } from './services/mockData';
import { Patient, Appointment, AppointmentStatus, Alert, AlertSeverity, AlertType, PatientRecording, AlertThresholds, ThemeType, AuditLogEntry, User } from './types';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdmin, adminLogin, adminLogout } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [activeVideoAppointmentId, setActiveVideoAppointmentId] = useState<string | null>(null);
  const [clinicalComplaint, setClinicalComplaint] = useState('');

  const [theme, setTheme] = useState<ThemeType>(() => (localStorage.getItem('rophe_theme') as ThemeType) || 'light');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const [alertThresholds, setAlertThresholds] = useState<AlertThresholds>({
    bpSystolicMax: 140,
    bpDiastolicMax: 90,
    pulseMin: 60,
    pulseMax: 100,
    spo2Min: 94,
    tempMax: 38.0
  });
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    localStorage.setItem('rophe_theme', theme);
  }, [theme]);

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      user: user?.username || 'System',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLogout = () => {
    addAuditLog('USER_LOGOUT', `Session terminated for ${user?.username}`);
    logout();
    adminLogout();
  };

  const handleUpdateThresholds = (newThresholds: AlertThresholds) => {
    addAuditLog('SAFETY_THRESHOLD_MODIFIED', `New clinical limits applied. SysMax: ${newThresholds.bpSystolicMax}`);
    setAlertThresholds(newThresholds);
  };

  const handleAdminLogin = async (password: string) => {
    const success = await adminLogin(password);
    if (success) {
      addAuditLog('ADMIN_AUTH_SUCCESS', 'Administrator successfully entered secure command zone.');
    }
    return success;
  };

  const [vitals, setVitals] = useState({
    bp: '', pulse: '', temp: '', rr: '', spo2: '', weight: '', height: ''
  });

  const bmi = useMemo(() => {
    const w = parseFloat(vitals.weight);
    const h = parseFloat(vitals.height) / 100;
    if (w > 0 && h > 0) return (w / (h * h)).toFixed(1);
    return '--';
  }, [vitals.weight, vitals.height]);

  useEffect(() => {
    if (!selectedPatientId) return;

    if (vitals.bp) {
      const [sys, dia] = vitals.bp.split('/').map(Number);
      if (sys > alertThresholds.bpSystolicMax || dia > alertThresholds.bpDiastolicMax) {
        addSystemAlert(selectedPatientId, `Hypertension Detected: ${vitals.bp}`, AlertSeverity.CRITICAL, AlertType.VITAL);
      }
    }
    
    if (vitals.spo2 && parseInt(vitals.spo2) < alertThresholds.spo2Min) {
      addSystemAlert(selectedPatientId, `Critical Hypoxia: SpO2 ${vitals.spo2}%`, AlertSeverity.CRITICAL, AlertType.VITAL);
    }

    if (vitals.temp && parseFloat(vitals.temp) > alertThresholds.tempMax) {
      addSystemAlert(selectedPatientId, `Pyrexia Detected: ${vitals.temp}°C`, AlertSeverity.WARNING, AlertType.VITAL);
    }
  }, [vitals, alertThresholds, selectedPatientId]);

  const addSystemAlert = (patientId: string, message: string, severity: AlertSeverity, type: AlertType) => {
    setAlerts(prev => {
      const isDuplicate = prev.some(a => a.patientId === patientId && a.message === message && !a.resolved);
      if (isDuplicate) return prev;
      const newAlert: Alert = {
        id: `AL${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        patientId, message, severity, type,
        timestamp: new Date().toISOString(),
        resolved: false
      };
      return [newAlert, ...prev];
    });
  };

  const handlePatientRegistry = (p: Patient) => {
    setPatients([...patients, p]);
    setActiveTab('dashboard');
    addAuditLog('PATIENT_ENROLLED', `New record created: ${p.firstName} ${p.lastName} (UID: ${p.id})`);
  };

  const handleBulkRegister = (newPatients: Patient[]) => {
    setPatients(prev => [...prev, ...newPatients]);
    addAuditLog('PATIENT_BULK_IMPORT', `Bulk ingestion completed: ${newPatients.length} records imported into registry.`);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    addAuditLog('PATIENT_UPDATED', `Record modified: ${updatedPatient.firstName} ${updatedPatient.lastName} (UID: ${updatedPatient.id})`);
  };

  // FR-PM-005: Merge Logic
  const handleMergePatients = (masterId: string, duplicateId: string) => {
    const master = patients.find(p => p.id === masterId);
    const duplicate = patients.find(p => p.id === duplicateId);

    if (!master || !duplicate) return;

    // Merge logic: Combine arrays, deduping strings
    const mergedAllergies = Array.from(new Set([...master.allergies, ...duplicate.allergies]));
    const mergedHistory = Array.from(new Set([...master.medicalHistory, ...duplicate.medicalHistory]));
    
    // Merge recordings and re-link ownership to master
    const duplicateRecordings = (duplicate.recordings || []).map(r => ({ ...r, patientId: masterId }));
    const mergedRecordings = [...(master.recordings || []), ...duplicateRecordings];

    const updatedMaster: Patient = {
      ...master,
      allergies: mergedAllergies,
      medicalHistory: mergedHistory,
      recordings: mergedRecordings
    };

    // Update Patients State: Update master, Remove duplicate
    setPatients(prev => prev.filter(p => p.id !== duplicateId).map(p => p.id === masterId ? updatedMaster : p));

    // Re-link Appointments
    setAppointments(prev => prev.map(a => a.patientId === duplicateId ? { ...a, patientId: masterId } : a));

    // Re-link Alerts
    setAlerts(prev => prev.map(a => a.patientId === duplicateId ? { ...a, patientId: masterId } : a));

    addAuditLog('PATIENT_MERGE', `Merged duplicate record ${duplicateId} into master ${masterId}. Inherited ${duplicateRecordings.length} recordings.`);
  };

  const handleSaveRecording = (recording: PatientRecording) => {
    setPatients(prev => prev.map(p => {
      if (p.id === recording.patientId) {
        // Prevent adding data to inactive patients (FR-PM-004 compliance)
        if (p.status === 'Inactive') return p;
        const updatedRecordings = [...(p.recordings || []), recording];
        return { ...p, recordings: updatedRecordings };
      }
      return p;
    }));
    addAuditLog('CLINICAL_ARCHIVE_EXPORT', `Clinical video session saved to patient file: ${recording.fileName}`);
  };

  // FR-AM-002: Appointment Rescheduling
  const handleRescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments(prev => prev.map(appt => 
      appt.id === id 
        ? { ...appt, date: newDate, time: newTime, status: AppointmentStatus.SCHEDULED } 
        : appt
    ));
    addAuditLog('APPOINTMENT_RESCHEDULE', `Appointment ${id} moved to ${newDate} at ${newTime}`);
  };

  // FR-AM-003: Appointment Cancellation
  const handleCancelAppointment = (id: string, reason: string) => {
    setAppointments(prev => prev.map(appt => 
      appt.id === id 
        ? { ...appt, status: AppointmentStatus.CANCELLED, cancellationReason: reason } 
        : appt
    ));
    addAuditLog('APPOINTMENT_CANCEL', `Appointment ${id} cancelled. Reason: ${reason}`);
  };

  // FR-AM-005: Walk-in Appointment Creation
  const handleAddAppointment = (newAppt: Appointment) => {
    setAppointments(prev => [...prev, newAppt]);
    addAuditLog('APPOINTMENT_CREATED', `New appointment slot generated: ${newAppt.id} (${newAppt.type}) - ${newAppt.status}`);
  };

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    addAuditLog('NAV_TRANSITION', `Workspace context changed to: ${id}`);
  };

  const handleJoinVideo = (appointmentId: string) => { 
    setActiveVideoAppointmentId(appointmentId); 
    addAuditLog('TELEHEALTH_ENGAGEMENT', `P2P Encrypted consultation established for Appointment REF: ${appointmentId}`); 
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            patients={patients} 
            appointments={appointments} 
            alerts={alerts} 
            onJoinVideo={handleJoinVideo} 
            onViewPatient={(id) => { setSelectedPatientId(id); handleTabChange('clinical-notes'); }}
            onRescheduleAppointment={handleRescheduleAppointment}
            onCancelAppointment={handleCancelAppointment}
            onAddAppointment={handleAddAppointment}
          />
        );
      case 'patients':
        return (
          <PatientRegistry 
            patients={patients} 
            onRegister={handlePatientRegistry} 
            onBulkRegister={handleBulkRegister}
            onUpdatePatient={handleUpdatePatient}
            onMergePatients={handleMergePatients}
          />
        );
      case 'admin':
        return (
          <AdminPanel
            isAuthenticated={isAdmin}
            onLogin={handleAdminLogin}
            thresholds={alertThresholds}
            onUpdateThresholds={handleUpdateThresholds}
            auditLogs={auditLogs}
            patients={patients}
            appointments={appointments}
          />
        );
      case 'clinical-notes':
        const p = patients.find(pat => pat.id === selectedPatientId) || patients[0];
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{p.firstName} {p.lastName}</h2>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px]">EHR ID: {p.id}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{p.dob} • {p.gender}</span>
                    {p.status === 'Inactive' && (
                      <>
                        <span className="w-1 h-1 bg-rose-300 rounded-full"></span>
                        <span className="text-rose-500 font-black uppercase tracking-widest text-[10px]">ARCHIVED</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => addAuditLog('NOTE_DRAFT_SAVE', `Incomplete note saved for ${p.id}`)} className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold border border-gray-200 dark:border-slate-700">Save Draft</button>
                  <button onClick={() => addAuditLog('NOTE_FINALIZED', `Encounter signed and sealed for ${p.id}`)} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/10">Sign Encounter</button>
                </div>
             </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <label htmlFor="complaint-field" className="block text-xs font-black text-gray-400 uppercase tracking-widest">Symptomatology & Clinical History</label>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/></svg> AI Enabled</span>
                  </div>
                  <textarea 
                    id="complaint-field"
                    className="w-full p-8 border-2 border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950 rounded-3xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none min-h-[220px] text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed transition-all" 
                    placeholder="Describe patient's presentation for real-time ICD-10 suggestions..."
                    value={clinicalComplaint}
                    onChange={(e) => setClinicalComplaint(e.target.value)}
                  />
                  <div className="mt-10">
                    <ClinicalAssistance complaint={clinicalComplaint} history={p.medicalHistory} />
                  </div>
                </div>
                
                {/* Recordings Section */}
                {p.recordings && p.recordings.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Telehealth Archives</h3>
                    <div className="space-y-4">
                      {p.recordings.map((rec) => (
                        <div key={rec.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{rec.fileName}</p>
                              <p className="text-[10px] text-gray-400 uppercase font-mono">{new Date(rec.date).toLocaleString()} • {Math.floor(rec.duration / 60)}m {rec.duration % 60}s</p>
                            </div>
                          </div>
                          <a href={rec.videoUrl} download={rec.fileName} className="text-indigo-600 font-bold text-xs hover:underline">Download</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Vital Sign Intake</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-gray-500 uppercase">BP (mmHg)</span>
                      <input 
                        className="bg-transparent text-right font-black text-gray-900 dark:text-white outline-none w-20" 
                        placeholder="120/80" 
                        value={vitals.bp} 
                        onChange={(e) => setVitals({...vitals, bp: e.target.value})} 
                        aria-label="Blood Pressure"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-gray-500 uppercase">Temp (°C)</span>
                      <input 
                        className="bg-transparent text-right font-black text-gray-900 dark:text-white outline-none w-20" 
                        placeholder="36.5" 
                        value={vitals.temp} 
                        onChange={(e) => setVitals({...vitals, temp: e.target.value})} 
                        aria-label="Temperature"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-gray-500 uppercase">SpO2 (%)</span>
                      <input 
                        className="bg-transparent text-right font-black text-gray-900 dark:text-white outline-none w-20" 
                        placeholder="98" 
                        value={vitals.spo2} 
                        onChange={(e) => setVitals({...vitals, spo2: e.target.value})} 
                        aria-label="Oxygen Saturation"
                      />
                    </div>
                    <div className="pt-4 flex items-center justify-between px-2">
                       <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Calculated BMI</span>
                       <span className="text-2xl font-black text-emerald-600">{bmi}</span>
                    </div>
                  </div>
                </section>
                
                <section className="bg-emerald-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/20">
                   <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Clinical Guidance</h3>
                   <p className="text-sm font-medium leading-relaxed text-emerald-50 mb-6">Patient has a history of {p.medicalHistory.join(', ') || 'no prior conditions'}. Consider cardiovascular risk assessment if BP remains elevated.</p>
                   <button onClick={() => addAuditLog('RISK_ASSESS_CLICK', 'Provider viewed risk calculators.')} className="w-full py-3 bg-white text-emerald-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all">Risk Calculators</button>
                </section>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">System Workspace Initializing...</div>;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      user={user!}
      theme={theme}
      onThemeChange={(t) => { setTheme(t); addAuditLog('ACCESSIBILITY_THEME_CHANGE', `User toggled display mode to: ${t.toUpperCase()}`); }}
      onLogout={handleLogout}
    >
      <div role="region" aria-label="Clinical Activity Area" id="main-content">
        {renderContent()}
      </div>
      {activeVideoAppointmentId && (
        <VideoCall 
          patient={patients.find(p => p.id === appointments.find(a => a.id === activeVideoAppointmentId)?.patientId)!} 
          appointmentId={activeVideoAppointmentId}
          onEnd={() => { setActiveVideoAppointmentId(null); addAuditLog('TELEHEALTH_DISCONNECT', 'Provider terminated the virtual consultation.'); }} 
          onSaveRecording={handleSaveRecording}
        />
      )}
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </AuthProvider>
  );
}