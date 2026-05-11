import React, { useState, useMemo } from 'react';
import AlertSettings from './AlertSettings';
import SelfTest from './SelfTest';
import { AlertThresholds, AuditLogEntry, Patient, Appointment, AppointmentStatus } from '../types';

interface AdminPanelProps {
  isAuthenticated: boolean;
  onLogin: (password: string) => void;
  thresholds: AlertThresholds;
  onUpdateThresholds: (newThresholds: AlertThresholds) => void;
  auditLogs: AuditLogEntry[];
  adminPasswordConfig: string;
  onUpdatePassword: (newPass: string) => void;
  patients: Patient[];
  appointments: Appointment[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isAuthenticated, 
  onLogin, 
  thresholds, 
  onUpdateThresholds, 
  auditLogs,
  adminPasswordConfig,
  onUpdatePassword,
  patients,
  appointments
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'thresholds' | 'logs' | 'security' | 'tests' | 'comms'>('thresholds');
  
  // New Password State
  const [newPass, setNewPass] = useState('');
  const [passUpdateSuccess, setPassUpdateSuccess] = useState(false);

  // Reminder State
  const [processingReminders, setProcessingReminders] = useState(false);
  const [lastBatchCount, setLastBatchCount] = useState<number | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPasswordConfig) {
      onLogin(passwordInput);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handlePassUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length >= 6) {
      onUpdatePassword(newPass);
      setPassUpdateSuccess(true);
      setNewPass('');
      setTimeout(() => setPassUpdateSuccess(false), 3000);
    }
  };

  // Logic to identify appointments in the next 48 hours
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    const fortyEightHoursFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    
    return appointments.filter(appt => {
      const apptDate = new Date(`${appt.date}T${appt.time}`);
      return (
        appt.status === AppointmentStatus.SCHEDULED &&
        apptDate >= now &&
        apptDate <= fortyEightHoursFromNow
      );
    }).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  }, [appointments]);

  const handleBroadcastReminders = () => {
    setProcessingReminders(true);
    // Simulate API delay for batch processing
    setTimeout(() => {
      // In a real app, this would trigger an API call. 
      // Here we rely on the parent (App.tsx) handling the audit logs if passed back, 
      // but for this localized logic we will simulate success here.
      setLastBatchCount(upcomingAppointments.length);
      setProcessingReminders(false);
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-2xl mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Restricted</h2>
            <p className="text-gray-500 text-sm mt-2">Authentication required to manage clinical safety systems.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-pass" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Access Key</label>
              <input 
                id="admin-pass"
                type="password" 
                autoFocus
                className={`w-full px-4 py-3 rounded-xl border ${loginError ? 'border-rose-300 ring-2 ring-rose-100' : 'border-gray-200'} focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:bg-slate-900`}
                placeholder="Enter passphrase"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                aria-invalid={loginError}
              />
              {loginError && <p className="text-rose-600 text-[10px] font-bold mt-2 uppercase flex items-center"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg> Access Denied</p>}
            </div>
            <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95">
              Unlock Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded tracking-wider border border-emerald-200">Superuser Mode</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">System Administration</h2>
          <p className="text-gray-500 font-medium">Global governance, safety thresholds, and transparency logs.</p>
        </div>
        
        <nav className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl w-fit overflow-x-auto" aria-label="Admin sub-navigation">
          {(['thresholds', 'comms', 'logs', 'security', 'tests'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeSubTab === tab 
                ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'tests' ? 'System Tests' : tab === 'comms' ? 'Communications' : tab}
            </button>
          ))}
        </nav>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {activeSubTab === 'thresholds' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <AlertSettings thresholds={thresholds} onUpdate={onUpdateThresholds} />
          </div>
        )}

        {activeSubTab === 'comms' && (
           <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 p-8">
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">Appointment Reminder Queue</h3>
                      <p className="text-sm text-gray-500 font-medium">Automated SMS/Email dispatch for next 48 hours.</p>
                   </div>
                   <button 
                     onClick={handleBroadcastReminders}
                     disabled={processingReminders || upcomingAppointments.length === 0}
                     className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center space-x-2 ${
                       processingReminders 
                       ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                       : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-900/20'
                     }`}
                   >
                     {processingReminders ? (
                       <><div className="w-4 h-4 border-2 border-gray-500/30 border-t-gray-500 animate-spin rounded-full"></div><span>Sending...</span></>
                     ) : (
                       <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg><span>Broadcast Batch</span></>
                     )}
                   </button>
                </div>

                {lastBatchCount !== null && (
                  <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex items-center space-x-3 animate-in slide-in-from-top-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <span className="text-emerald-800 dark:text-emerald-300 text-sm font-bold">Success: {lastBatchCount} reminders dispatched to notification gateway.</span>
                  </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-slate-950">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Appointment Time</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Channel</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {upcomingAppointments.length > 0 ? upcomingAppointments.map(appt => {
                        const patient = patients.find(p => p.id === appt.patientId);
                        return (
                          <tr key={appt.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors">
                             <td className="px-6 py-4">
                               <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-800">
                                 {patient?.id}
                               </span>
                             </td>
                             <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                               {patient?.firstName} {patient?.lastName}
                             </td>
                             <td className="px-6 py-4">
                               <span className="block text-sm font-bold text-gray-700 dark:text-gray-300">{appt.date}</span>
                               <span className="block text-xs text-gray-500">{appt.time} ({appt.duration}m)</span>
                             </td>
                             <td className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-400">{appt.type}</td>
                             <td className="px-6 py-4">
                               <div className="flex flex-col space-y-1">
                                 <span className="text-xs text-gray-600 dark:text-gray-300 flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>{patient?.email}</span>
                                 <span className="text-xs text-gray-600 dark:text-gray-300 flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>{patient?.phone}</span>
                               </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                               <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                 Pending
                               </span>
                             </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                            No appointments scheduled for the next 48 hours.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
             </div>
           </div>
        )}

        {activeSubTab === 'logs' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-black text-gray-900 dark:text-white flex items-center uppercase tracking-widest text-sm">
                <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Audit Trail
              </h3>
              <button onClick={() => window.print()} className="text-[10px] font-bold text-gray-400 hover:text-emerald-600 transition-colors uppercase tracking-widest border border-gray-100 dark:border-slate-800 px-3 py-1.5 rounded-lg">Export Log</button>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-800">
              {auditLogs.length > 0 ? auditLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-6">
                  <div className="w-24 flex-shrink-0">
                    <p className="text-[10px] font-mono text-gray-400 mb-1">{new Date(log.timestamp).toLocaleDateString()}</p>
                    <p className="text-[10px] font-mono text-gray-900 dark:text-gray-300 font-bold">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded tracking-tighter">{log.user}</span>
                      <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{log.action}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{log.details}</p>
                  </div>
                  <div className="text-[9px] font-mono text-gray-300 uppercase select-none">{log.id}</div>
                </div>
              )) : (
                <div className="py-20 text-center">
                  <p className="text-gray-400 font-medium">Zero system events recorded in current session.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'security' && (
          <div className="max-w-xl mx-auto w-full bg-white dark:bg-slate-900 p-10 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Security Configuration</h3>
            <form onSubmit={handlePassUpdate} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Update Admin Passphrase</label>
                <input 
                  type="password"
                  className="w-full px-5 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none font-bold bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                  placeholder="Minimum 6 characters"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={newPass.length < 6}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50"
              >
                Apply New Key
              </button>
              {passUpdateSuccess && (
                <p className="text-center text-emerald-600 font-bold text-xs uppercase tracking-widest animate-bounce">Passphrase updated successfully</p>
              )}
            </form>
            <div className="mt-10 pt-8 border-t border-gray-50 dark:border-slate-800">
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-gray-600 dark:text-gray-300">Note:</strong> Changing the passphrase will only apply to the current session. Persistent storage of credentials is not enabled for Phase 2.
              </p>
            </div>
          </div>
        )}

        {activeSubTab === 'tests' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <SelfTest />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;