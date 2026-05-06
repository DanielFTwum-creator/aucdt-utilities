import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Appointment, AppointmentStatus, Patient, Alert, AlertSeverity } from '../types';

const data = [
  { name: 'Mon', count: 12 },
  { name: 'Tue', count: 19 },
  { name: 'Wed', count: 15 },
  { name: 'Thu', count: 22 },
  { name: 'Fri', count: 30 },
  { name: 'Sat', count: 10 },
  { name: 'Sun', count: 0 },
];

interface DashboardProps {
  patients: Patient[];
  appointments: Appointment[];
  alerts: Alert[];
  onJoinVideo: (id: string) => void;
  onViewPatient: (id: string) => void;
  onRescheduleAppointment?: (id: string, newDate: string, newTime: string) => void;
  onCancelAppointment?: (id: string, reason: string) => void;
  onAddAppointment?: (appt: Appointment) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ patients, appointments, alerts, onJoinVideo, onViewPatient, onRescheduleAppointment, onCancelAppointment, onAddAppointment }) => {
  // Reschedule State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  
  // Cancel State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  // Walk-in / Check-in State
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWalkInPatient, setSelectedWalkInPatient] = useState<Patient | null>(null);
  const [walkInReason, setWalkInReason] = useState('Routine Check-in');

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const stats = [
    { label: 'Total Patients', value: patients.length, change: '+12%', color: 'blue' },
    { label: 'Appointments Today', value: appointments.length, change: '+4', color: 'emerald' },
    { label: 'Active Alerts', value: alerts.filter(a => !a.resolved).length, change: 'Urgent', color: 'rose' },
    { label: 'Avg Waiting Time', value: '18 min', change: '-2 min', color: 'amber' },
  ];

  const activeAlerts = alerts.filter(a => !a.resolved).sort((a, b) => {
    const priority = { [AlertSeverity.CRITICAL]: 0, [AlertSeverity.WARNING]: 1, [AlertSeverity.INFO]: 2 };
    return priority[a.severity] - priority[b.severity];
  }).slice(0, 5);

  // Search Logic for Walk-in
  const filteredWalkInPatients = patients.filter(p => 
    (p.firstName + ' ' + p.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  ).slice(0, 5);

  const openRescheduleModal = (e: React.MouseEvent, appt: Appointment) => {
    e.stopPropagation();
    setSelectedAppointmentId(appt.id);
    setNewDate(appt.date);
    setNewTime(appt.time);
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (selectedAppointmentId && onRescheduleAppointment) {
      if (!newDate || !newTime) {
        setNotification({ message: 'Please select both date and time.', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
        return;
      }
      onRescheduleAppointment(selectedAppointmentId, newDate, newTime);
      setRescheduleModalOpen(false);
      setNotification({ message: 'Appointment rescheduled successfully.', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const openCancelModal = (e: React.MouseEvent, appt: Appointment) => {
    e.stopPropagation();
    setAppointmentToCancel(appt);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (appointmentToCancel && onCancelAppointment) {
      if (!cancelReason.trim()) {
        setNotification({ message: 'A cancellation reason is required.', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
        return;
      }
      onCancelAppointment(appointmentToCancel.id, cancelReason);
      setCancelModalOpen(false);
      setAppointmentToCancel(null);
      setNotification({ message: 'Appointment cancelled successfully.', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleWalkInCheckIn = () => {
    if (!selectedWalkInPatient || !onAddAppointment) return;
    
    const now = new Date();
    const newAppointment: Appointment = {
      id: `A${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      patientId: selectedWalkInPatient.id,
      providerId: 'D001', // Default to current provider
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: 15, // Standard slot
      type: 'Consultation',
      status: AppointmentStatus.CHECKED_IN,
      reasonForVisit: walkInReason,
      details: 'Walk-in encounter created via Dashboard.',
      notes: ''
    };

    onAddAppointment(newAppointment);
    setCheckInModalOpen(false);
    setSelectedWalkInPatient(null);
    setSearchQuery('');
    setNotification({ message: 'Patient checked in successfully.', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl border flex items-center space-x-4 animate-in slide-in-from-right-12 duration-500 ${
          notification.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
        }`}>
          <div className="bg-white/20 p-2 rounded-xl">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
          </div>
          <span className="font-bold text-sm uppercase tracking-wider">{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Clinic Overview</h2>
          <p className="text-gray-500 font-medium">Welcome back, Dr. Atiase. System is stable.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 font-bold transition-all text-sm uppercase tracking-wider">
            Export Analytics
          </button>
          <button 
            onClick={() => setCheckInModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 font-bold flex items-center space-x-2 transition-all text-sm uppercase tracking-wider active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            <span>Walk-in / Check-in</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col group hover:border-emerald-500 transition-all cursor-default">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 group-hover:text-emerald-500 transition-colors">{stat.label}</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</span>
              <span className={`text-xs font-black ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-amber-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Enhanced Alerts Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
             <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Active Clinical Alerts</h3>
                  <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-0.5">Real-time Patient Safety Monitor</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                  <span className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/50">Live</span>
                </div>
             </div>
             <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {activeAlerts.length > 0 ? activeAlerts.map(alert => {
                   const patient = patients.find(p => p.id === alert.patientId);
                   return (
                     <div key={alert.id} className="p-6 flex items-start space-x-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer" onClick={() => onViewPatient(alert.patientId)}>
                        <div className={`mt-1 p-3 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 ${
                          alert.severity === AlertSeverity.CRITICAL ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40' :
                          alert.severity === AlertSeverity.WARNING ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40'
                        }`}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-extrabold text-gray-900 dark:text-white flex items-center text-lg tracking-tight">
                              {patient ? `${patient.firstName} ${patient.lastName}` : 'System Agent'}
                              {patient && (
                                <span className="ml-2 px-1.5 py-0.5 font-mono text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-900/50 rounded border border-emerald-200 dark:border-emerald-700 shadow-sm font-black transition-colors group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800">
                                  ID: {patient.id}
                                </span>
                              )}
                            </h4>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-3">{alert.message}</p>
                          <div className="flex items-center space-x-4">
                             <div className="flex items-center space-x-2">
                               <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                               <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.1em]">{alert.type}</span>
                             </div>
                             <div className="flex items-center space-x-2">
                               <div className={`w-1.5 h-1.5 rounded-full ${
                                  alert.severity === AlertSeverity.CRITICAL ? 'bg-rose-500' :
                                  alert.severity === AlertSeverity.WARNING ? 'bg-amber-500' : 'bg-blue-500'
                               }`}></div>
                               <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${
                                  alert.severity === AlertSeverity.CRITICAL ? 'text-rose-600' :
                                  alert.severity === AlertSeverity.WARNING ? 'text-amber-600' : 'text-blue-600'
                               }`}>{alert.severity} Priority</span>
                             </div>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                          </div>
                        </div>
                     </div>
                   );
                }) : (
                  <div className="p-20 text-center text-gray-400 text-sm italic font-medium">Zero abnormal clinical flags detected. Clinical safety verified.</div>
                )}
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Clinical Traffic Analytics</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#9ca3af'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', backgroundColor: '#fff', padding: '12px' }}
                    labelStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px', color: '#111827', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorCount)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 self-start">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Active Schedule</h3>
            <button className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Full Calendar</button>
          </div>
          <div className="space-y-4">
            {appointments.length > 0 ? appointments.map((appt) => {
              const patient = patients.find(p => p.id === appt.patientId);
              return (
                <div key={appt.id} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer group border border-transparent hover:border-gray-100 dark:hover:border-slate-700" onClick={() => onViewPatient(appt.patientId)}>
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex flex-col items-center justify-center font-black text-emerald-700 dark:text-emerald-400 flex-shrink-0 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <span className="text-sm">{appt.time}</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <p className={`font-bold transition-colors truncate ${patient?.status === 'Inactive' ? 'text-gray-400 dark:text-gray-500 line-through decoration-rose-500' : 'text-gray-900 dark:text-white group-hover:text-emerald-600'}`}>
                        {patient?.firstName} {patient?.lastName}
                      </p>
                      <span className="hidden sm:inline-block px-1.5 py-0.5 font-mono text-[9px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded transition-colors group-hover:bg-white dark:group-hover:bg-slate-900">
                        {patient?.id}
                      </span>
                      {patient?.status === 'Inactive' && (
                        <span className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-[8px] font-black uppercase rounded border border-rose-200 dark:border-rose-800 tracking-wider">
                          Archived
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <p className={`text-[10px] font-black ${appt.type === 'Video Consultation' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'} uppercase tracking-widest`}>
                        {appt.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      appt.status === AppointmentStatus.SCHEDULED ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900' : 
                      appt.status === AppointmentStatus.CANCELLED ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 line-through' :
                      'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900'
                    }`}>
                      {appt.status}
                    </span>
                    <div className="flex items-center space-x-1">
                      {/* Reschedule Trigger */}
                      {appt.status !== AppointmentStatus.CANCELLED && (
                        <button 
                          onClick={(e) => openRescheduleModal(e, appt)}
                          className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
                          title="Reschedule Appointment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </button>
                      )}
                      
                      {/* Cancel Trigger */}
                      {appt.status !== AppointmentStatus.CANCELLED && (
                        <button 
                          onClick={(e) => openCancelModal(e, appt)}
                          className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1"
                          title="Cancel Appointment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-16">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Registry Empty</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Walk-in / Check-in Modal */}
      {checkInModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-emerald-200 dark:border-emerald-900 max-w-lg w-full flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center space-x-4">
                 <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-2xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Patient Check-in</h3>
                    <p className="text-sm text-gray-500 font-medium">Walk-in & Immediate Appointments</p>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                 {!selectedWalkInPatient ? (
                   <div className="space-y-4">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
                        <input 
                          autoFocus
                          type="text"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-gray-900 dark:text-white"
                          placeholder="Search name, phone or ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      {searchQuery && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Matching Records</p>
                          {filteredWalkInPatients.length > 0 ? filteredWalkInPatients.map(p => (
                            <div 
                              key={p.id} 
                              onClick={() => setSelectedWalkInPatient(p)}
                              className="p-4 bg-gray-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-100 dark:border-slate-800 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                            >
                               <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center font-bold text-gray-500">{p.firstName[0]}{p.lastName[0]}</div>
                                  <div>
                                     <p className="font-bold text-gray-900 dark:text-white">{p.firstName} {p.lastName}</p>
                                     <p className="text-xs text-gray-500">{p.id} • {p.dob}</p>
                                  </div>
                               </div>
                               <button className="px-3 py-1.5 bg-white dark:bg-slate-900 text-emerald-600 text-xs font-bold rounded-lg shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">Select</button>
                            </div>
                          )) : (
                            <div className="p-8 text-center bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                               <p className="text-gray-400 font-medium text-sm">No matching patients found.</p>
                               <button onClick={() => {/* Ideally navigate to Registry */}} className="mt-2 text-emerald-600 text-xs font-bold hover:underline">Go to Registry to Enroll</button>
                            </div>
                          )}
                        </div>
                      )}
                   </div>
                 ) : (
                   <div className="space-y-6 animate-in slide-in-from-right-4">
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-600 font-black text-lg shadow-sm">
                               {selectedWalkInPatient.firstName[0]}{selectedWalkInPatient.lastName[0]}
                            </div>
                            <div>
                               <h4 className="font-bold text-gray-900 dark:text-white">{selectedWalkInPatient.firstName} {selectedWalkInPatient.lastName}</h4>
                               <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">{selectedWalkInPatient.id}</p>
                            </div>
                         </div>
                         <button onClick={() => setSelectedWalkInPatient(null)} className="text-gray-400 hover:text-rose-500 text-xs font-bold underline">Change</button>
                      </div>

                      <div className="space-y-4">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Visit Reason</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-gray-900 dark:text-white"
                              value={walkInReason}
                              onChange={(e) => setWalkInReason(e.target.value)}
                            />
                         </div>
                         <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl text-xs text-gray-500 flex items-start space-x-2">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p>This action will create an immediate appointment for <strong>Today</strong> and set status to <strong>Checked-In</strong>. The patient will appear in the provider's active queue.</p>
                         </div>
                      </div>
                   </div>
                 )}
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end items-center space-x-3">
                 <button 
                    onClick={() => { setCheckInModalOpen(false); setSelectedWalkInPatient(null); setSearchQuery(''); }}
                    className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handleWalkInCheckIn}
                    disabled={!selectedWalkInPatient}
                    className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    Confirm Check-in
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalOpen && selectedAppointmentId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-indigo-200 dark:border-indigo-900 max-w-sm w-full p-8 animate-in zoom-in duration-300">
              <div className="flex items-center space-x-4 mb-6">
                 <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-2xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Reschedule Visit</h3>
                    <p className="text-sm text-gray-500 font-medium">Ref: {selectedAppointmentId}</p>
                 </div>
              </div>
              
              <div className="space-y-4 mb-8">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">New Date</label>
                    <input 
                      type="date"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-gray-900 dark:text-white"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">New Time</label>
                    <input 
                      type="time"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-gray-900 dark:text-white"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                 </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                 <button 
                    onClick={() => setRescheduleModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handleConfirmReschedule}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-900/20 transition-all"
                 >
                    Confirm Change
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOpen && appointmentToCancel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-rose-200 dark:border-rose-900 max-w-sm w-full p-8 animate-in zoom-in duration-300">
              <div className="flex items-center space-x-4 mb-6">
                 <div className="p-3 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-2xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Cancel Appointment</h3>
                    <p className="text-sm text-gray-500 font-medium">Ref: {appointmentToCancel.id}</p>
                 </div>
              </div>
              
              <div className="space-y-4 mb-8">
                 <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                   Are you sure you want to cancel this appointment? This action will free up the slot in the calendar.
                 </p>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Reason for Cancellation</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm font-medium text-gray-900 dark:text-white resize-none"
                      rows={3}
                      placeholder="e.g. Patient requested, Provider unavailable..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                 </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                 <button 
                    onClick={() => setCancelModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                 >
                    Keep
                 </button>
                 <button 
                    onClick={handleConfirmCancel}
                    className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-900/20 transition-all"
                 >
                    Confirm Cancel
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;