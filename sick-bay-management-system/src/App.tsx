import React, { useState, useEffect, useRef } from 'react';
import { Visit, Patient, Medication, Referral, FacilityLog, DailyHealthCheck, AuditLog } from './types';
import { exchange, silentSession, setAccessToken, wmsLogout, isAdminRole, type WmsUser, type WmsSession } from './lib/wmsAuth';
import LoginPage from './components/LoginPage';
import { 
  INITIAL_PATIENTS, 
  INITIAL_MEDICATIONS, 
  INITIAL_VISITS, 
  INITIAL_REFERRALS, 
  INITIAL_FACILITY_LOGS,
  INITIAL_DAILY_CHECKS,
  INITIAL_AUDIT_LOGS
} from './data/mockData';

// Component Imports
import Dashboard from './components/Dashboard';
import VisitLogger from './components/VisitLogger';
import RosterView from './components/RosterView';
import InventoryView from './components/InventoryView';
import ReferralsView from './components/ReferralsView';
import FacilityLogView from './components/FacilityLogView';
import ReportsView from './components/ReportsView';
import VisitsListView from './components/VisitsListView';
import CareProLogo from './components/CareProLogo';
import { motion, AnimatePresence } from 'motion/react';

import { 
  Activity, 
  Users, 
  ClipboardList, 
  BriefcaseMedical, 
  Building2, 
  Wrench, 
  BarChart, 
  Calendar,
  Clock,
  HeartPulse,
  Menu,
  X,
  Plus,
  Check,
  Lock,
  Unlock,
  Sun,
  Moon,
  Contrast,
  ShieldAlert
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'sickbay_management_state_v2';

export default function App() {
  // Master database state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [facilityLogs, setFacilityLogs] = useState<FacilityLog[]>([]);
  const [dailyHealthChecks, setDailyHealthChecks] = useState<DailyHealthCheck[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Theme Switching state (Light / Dark / High-contrast)
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>(() => {
    return (localStorage.getItem('tuc_sickbay_theme') as any) || 'light';
  });

  // WMS SSO Auth states
  const [wmsUser, setWmsUser] = useState<WmsUser | null>(null);
  const [booting, setBooting] = useState(true);
  const [wmsError, setWmsError] = useState<string | null>(null);
  const [mfaTicket, setMfaTicket] = useState<string | null>(null);
  const bootRan = useRef(false);

  // Derived admin role from WMS session
  const isAdmin = wmsUser ? isAdminRole(wmsUser.role) : false;
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  // Autosave status indicator state
  const [saveStatus, setSaveStatus] = useState<{ show: boolean; timestamp: string }>({ show: false, timestamp: '' });

  // Navigation and interactive flow states
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [preSelectedPatientId, setPreSelectedPatientId] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Apply Theme class system wide
  useEffect(() => {
    const root = document.getElementById('app-root');
    if (root) {
      root.classList.remove('dark', 'high-contrast');
      if (theme !== 'light') {
        root.classList.add(theme);
      }
    }
    localStorage.setItem('tuc_sickbay_theme', theme);
  }, [theme]);

  // WMS SSO Boot Flow (mirrors LEMS App.jsx pattern)
  const UNDER_SICKBAY = typeof window !== 'undefined' && window.location.pathname.startsWith('/sickbay');
  const APP_PATH = UNDER_SICKBAY ? '/sickbay/' : '/';

  useEffect(() => {
    if (bootRan.current) return;
    bootRan.current = true;

    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const ticket = params.get('mfa_ticket');
      const err = params.get('error');
      if (code || ticket || err) window.history.replaceState(null, '', APP_PATH);

      try {
        if (err) { setWmsError(err); return; }
        if (ticket) { setMfaTicket(ticket); return; }
        if (code) {
          try { adoptSession(await exchange(code)); }
          catch { setWmsError('oauth'); }
          return;
        }
        // Silent session adoption via shared fleet cookie
        const session = await silentSession();
        if (session) adoptSession(session);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const adoptSession = (session: WmsSession) => {
    setAccessToken(session.access_token);
    setWmsUser(session.user);
    setMfaTicket(null);
    setWmsError(null);
    setBooting(false);
  };

  // Append Audit Log Helper
  const logEvent = (action: string, category: 'AUTH' | 'CLINICAL' | 'INVENTORY' | 'FACILITY' | 'SYSTEM', details: string) => {
    const newLog: AuditLog = {
      id: `AUD-2026-${Math.floor(100 + Math.random() * 900)}`,
      dateTime: new Date().toISOString(),
      action,
      category,
      actor: wmsUser?.name || "Clinical Staff",
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 1. Initial State Loading from localStorage
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPatients(parsed.patients || INITIAL_PATIENTS);
        setMedications(parsed.medications || INITIAL_MEDICATIONS);
        setVisits(parsed.visits || INITIAL_VISITS);
        setReferrals(parsed.referrals || INITIAL_REFERRALS);
        setFacilityLogs(parsed.facilityLogs || INITIAL_FACILITY_LOGS);
        setDailyHealthChecks(parsed.dailyHealthChecks || INITIAL_DAILY_CHECKS);
        setAuditLogs(parsed.auditLogs || INITIAL_AUDIT_LOGS);
      } catch (e) {
        console.error("Cache corrupted, loading starting dataset.", e);
        loadDefaultDataset();
      }
    } else {
      loadDefaultDataset();
    }
  }, []);

  // 2. Real-time Database Synchronization to localStorage
  useEffect(() => {
    if (patients.length > 0 || medications.length > 0 || visits.length > 0) {
      const stateToCache = {
        patients,
        medications,
        visits,
        referrals,
        facilityLogs,
        dailyHealthChecks,
        auditLogs
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToCache));

      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      setSaveStatus({ show: true, timestamp: timeStr });

      const timer = setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, show: false }));
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [patients, medications, visits, referrals, facilityLogs, dailyHealthChecks, auditLogs]);

  // 3. Real-time School Clock
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      };
      setCurrentTime(new Date().toLocaleDateString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDefaultDataset = () => {
    setPatients(INITIAL_PATIENTS);
    setMedications(INITIAL_MEDICATIONS);
    setVisits(INITIAL_VISITS);
    setReferrals(INITIAL_REFERRALS);
    setFacilityLogs(INITIAL_FACILITY_LOGS);
    setDailyHealthChecks(INITIAL_DAILY_CHECKS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      patients: INITIAL_PATIENTS,
      medications: INITIAL_MEDICATIONS,
      visits: INITIAL_VISITS,
      referrals: INITIAL_REFERRALS,
      facilityLogs: INITIAL_FACILITY_LOGS,
      dailyHealthChecks: INITIAL_DAILY_CHECKS,
      auditLogs: INITIAL_AUDIT_LOGS
    }));
  };

  // State Manipulation Handlers
  const handleAddVisit = (newVisitData: Omit<Visit, 'id' | 'dateTime'> & { referralHospital?: string; referralReason?: string }) => {
    const visitId = `VST-2026-${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();

    const finalVisit: Visit = {
      ...newVisitData,
      id: visitId,
      dateTime: nowIso
    };

    // 1. Process medication stock deductions
    if (newVisitData.medicationDispensedId && newVisitData.medicationDispensedQty) {
      setMedications(prev => prev.map(med => {
        if (med.id === newVisitData.medicationDispensedId) {
          return {
            ...med,
            quantityOnHand: Math.max(0, med.quantityOnHand - (newVisitData.medicationDispensedQty || 0))
          };
        }
        return med;
      }));
    }

    // 2. Process emergency hospital referral protocol
    if (newVisitData.disposition === 'Referral to Hospital' && newVisitData.referralHospital) {
      const newReferral: Referral = {
        id: `REF-2026-${Math.floor(100 + Math.random() * 900)}`,
        visitId: visitId,
        patientName: newVisitData.patientName,
        patientId: newVisitData.patientId,
        dateTime: nowIso,
        referralHospital: newVisitData.referralHospital,
        reason: newVisitData.referralReason || 'Referred for clinical assessment',
        status: 'Pending'
      };
      setReferrals(prev => [newReferral, ...prev]);
    }

    // 3. Save clinical visit
    setVisits(prev => [...prev, finalVisit]);
    logEvent('Registered Clinical Visit', 'CLINICAL', `Registered visit for patient ${newVisitData.patientName} (ID: ${newVisitData.patientId})`);
    setCurrentTab('dashboard');
    setPreSelectedPatientId(undefined);
  };

  const handleDischargeObservation = (visitId: string, notes: string) => {
    setVisits(prev => prev.map(v => {
      if (v.id === visitId) {
        return {
          ...v,
          observationEndTime: new Date().toISOString(),
          notes: v.notes ? `${v.notes} | Checkout notes: ${notes}` : notes,
          disposition: 'Back to Class'
        };
      }
      return v;
    }));
    logEvent('Discharged Observation Bed', 'CLINICAL', `Discharged visit ID ${visitId} from observation bed`);
  };

  const handleAddPatient = (patient: Patient) => {
    setPatients(prev => [patient, ...prev]);
    logEvent('Added Patient Profile', 'CLINICAL', `Created new medical file for ${patient.name} (ID: ${patient.id})`);
  };

  const handleAddDailyHealthCheck = (check: Omit<DailyHealthCheck, 'id' | 'dateTime'>) => {
    const newCheck: DailyHealthCheck = {
      ...check,
      id: `DHC-2026-${Math.floor(100 + Math.random() * 900)}`,
      dateTime: new Date().toISOString()
    };
    setDailyHealthChecks(prev => [newCheck, ...prev]);
    logEvent('Logged Morning Screening', 'CLINICAL', `Registered daily check-in for ${check.patientName}`);
  };

  const handleAddMedication = (medication: Medication) => {
    setMedications(prev => [medication, ...prev]);
    logEvent('Pharmacy Add Medication', 'INVENTORY', `Added new stock line ${medication.name}`);
  };

  const handleUpdateMedication = (updatedMed: Medication) => {
    setMedications(prev => prev.map(med => med.id === updatedMed.id ? updatedMed : med));
    logEvent('Pharmacy Stock Adjust', 'INVENTORY', `Adjusted inventory values for ${updatedMed.name}`);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    logEvent('Pharmacy Stock Delete', 'INVENTORY', `Removed inventory listing ID ${id}`);
  };

  const handleRestockMedication = (id: string, qty: number) => {
    setMedications(prev => prev.map(med => {
      if (med.id === id) {
        return {
          ...med,
          quantityOnHand: med.quantityOnHand + qty
        };
      }
      return med;
    }));
    logEvent('Pharmacy Restock', 'INVENTORY', `Restocked ${qty} units of ID ${id}`);
  };

  const handleDiscardExpiredMedication = (id: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === id) {
        return {
          ...med,
          quantityOnHand: 0
        };
      }
      return med;
    }));
    logEvent('Discarded Expired Medication', 'INVENTORY', `Zeroed and discarded expired batches for ID ${id}`);
  };

  const handleAddReferral = (newRef: Referral) => {
    setReferrals(prev => [newRef, ...prev]);
    logEvent('Added Referral Protocol', 'CLINICAL', `Initiated emergency hospital referral for ${newRef.patientName}`);
  };

  const handleUpdateReferralStatus = (id: string, status: Referral['status'], outcome?: string) => {
    setReferrals(prev => prev.map(ref => {
      if (ref.id === id) {
        return {
          ...ref,
          status,
          outcomeNotes: outcome || ref.outcomeNotes
        };
      }
      return ref;
    }));
    logEvent('Updated Referral Status', 'CLINICAL', `Marked referral ID ${id} as ${status}`);
  };

  const handleAddFacilityLog = (log: FacilityLog) => {
    setFacilityLogs(prev => [log, ...prev]);
    logEvent('Reported Facility Defect', 'FACILITY', `Logged fault report for ${log.equipmentName}`);
  };

  const handleResolveFacilityLog = (id: string, resolutionDays: number) => {
    setFacilityLogs(prev => prev.map(log => {
      if (log.id === id) {
        return {
          ...log,
          isResolved: true,
          status: 'Functional',
          resolutionDays
        };
      }
      return log;
    }));
    logEvent('Resolved Facility Defect', 'FACILITY', `Marked defect resolution for ID ${id} in ${resolutionDays} days`);
  };

  const handleResetDatabase = () => {
    if (window.confirm("Are you sure you want to completely wipe the local database cache? This deletes all custom school entries.")) {
      setPatients([]);
      setMedications([]);
      setVisits([]);
      setReferrals([]);
      setFacilityLogs([]);
      setDailyHealthChecks([]);
      setAuditLogs([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      loadDefaultDataset();
      logEvent('Database Hard Reset', 'SYSTEM', 'Wiped local storage container, reloaded original seed profiles');
    }
  };

  const handleImportDatabase = (dataStr: string) => {
    try {
      const parsed = JSON.parse(dataStr);
      if (parsed.patients && parsed.medications && parsed.visits) {
        setPatients(parsed.patients);
        setMedications(parsed.medications);
        setVisits(parsed.visits);
        setReferrals(parsed.referrals || []);
        setFacilityLogs(parsed.facilityLogs || []);
        setDailyHealthChecks(parsed.dailyHealthChecks || parsed.daily_health_checks || []);
        setAuditLogs(parsed.auditLogs || []);
        logEvent('Database Restore', 'SYSTEM', 'Uploaded externally formatted school backup JSON');
        alert("School Sick Bay database successfully restored!");
      } else {
        alert("Invalid backup schema. Key database files are missing.");
      }
    } catch (e) {
      alert("Error reading JSON backup file.");
    }
  };

  // WMS SSO Logout
  const handleLogout = () => {
    wmsLogout();
    setAccessToken(null);
    setWmsUser(null);
    setCurrentTab('dashboard');
    logEvent('WMS SSO Logout', 'AUTH', 'Terminated WMS SSO session (fleet-wide).');
  };

  // Navigations link setup
  const tabsConfig = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'logger', label: 'Log Visit', icon: Plus },
    { id: 'visits', label: 'Encounters Journal', icon: ClipboardList },
    { id: 'roster', label: 'Student Roster', icon: Users },
    { id: 'inventory', label: 'Pharmacy Stock', icon: BriefcaseMedical, restricted: true },
    { id: 'referrals', label: 'Hospital Referrals', icon: Building2 },
    { id: 'facility', label: 'Facility Logs', icon: Wrench, restricted: true },
    { id: 'reports', label: 'Reports & Sync', icon: BarChart, restricted: true },
  ];

  const handleSelectCheckInFromRoster = (patientId: string) => {
    setPreSelectedPatientId(patientId);
    setCurrentTab('logger');
  };

  const handleTabClick = (tabId: string) => {
    const restrictedTabs = ['inventory', 'facility', 'reports'];
    if (restrictedTabs.includes(tabId) && !isAdmin) {
      // Non-admin users cannot access restricted tabs (WMS role-gated)
      return;
    } else {
      setCurrentTab(tabId);
      if (tabId !== 'logger') setPreSelectedPatientId(undefined);
    }
  };

  // Boot splash while checking WMS SSO session
  if (booting) {
    return (
      <div className="boot-splash">
        <div className="boot-splash-logo">
          <CareProLogo size={36} />
        </div>
        <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Signing you in…</p>
      </div>
    );
  }

  // Login gate — show WMS SSO login page if not authenticated
  if (!wmsUser) {
    return (
      <LoginPage
        wmsError={wmsError}
        mfaTicket={mfaTicket}
        onMfaTicket={setMfaTicket}
        onSession={adoptSession}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col md:flex-row text-slate-900 font-sans" id="app-root">
      
      {/* Mobile Top Header Navigation */}
      <header className="md:hidden bg-[#0f172a] text-white px-5 py-4 flex items-center justify-between sticky top-0 z-40 border-b-2 border-slate-900 shadow-md" id="mobile-header">
        <div className="flex items-center gap-2">
          <CareProLogo size={32} />
          <span className="font-black text-sm tracking-tight uppercase font-display">CAREPro Sick Bay</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 text-slate-300 hover:text-white"
          id="mobile-menu-trigger"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0f172a]/95 z-30 pt-16 flex flex-col" id="mobile-drawer">
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {tabsConfig.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    handleTabClick(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-slate-900 ${
                    isActive 
                      ? 'bg-[#34d399] text-[#0f172a] shadow-[3px_3px_0px_#000]' 
                      : 'bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-3.5">
                    <Icon className="w-5 h-5 shrink-0" /> {tab.label}
                  </span>
                  {tab.restricted && !isAdmin && (
                    <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Large Desktop Vertical Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0f172a] text-slate-300 border-r-2 border-slate-900 p-6 space-y-8 shrink-0 justify-between h-screen sticky top-0 animate-sidebar" id="desktop-sidebar">
        <div className="space-y-8">
          {/* Clinical Emblem */}
          <div className="flex items-center gap-3 px-1.5" id="sidebar-logo">
            <CareProLogo size={42} />
            <div>
              <span className="font-black text-white text-sm md:text-base tracking-tight uppercase leading-none block font-display">TUC CARE <span className="text-[#f43f5e]">PRO</span></span>
              <span className="text-[9px] text-[#34d399] font-bold tracking-widest uppercase block">Sick Bay Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2" id="sidebar-nav">
            {tabsConfig.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  title={`${tab.label}${tab.restricted && !isAdmin ? ' (Requires Admin Rights)' : ''}`}
                  className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-2 ${
                    isActive 
                      ? 'bg-[#34d399] text-[#0f172a] border-slate-900 shadow-[3px_3px_0px_#000] scale-102 font-black' 
                      : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                  id={`nav-link-${tab.id}`}
                >
                  <span className="flex items-center gap-3.5">
                    <Icon className="w-4 h-4 shrink-0" /> {tab.label}
                  </span>
                  {tab.restricted && !isAdmin && (
                    <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls: Clock, Theme, Admin privileges */}
        <div className="border-t border-slate-800/85 pt-4 px-1.5 space-y-4">
          {/* Active Clock */}
          <div className="space-y-0.5">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">System Chronometer</span>
            <span className="text-[10px] font-mono font-black text-slate-200 block" id="realtime-clock">
              {currentTime || 'Clock initializing...'}
            </span>
          </div>

          {/* Theme Switcher Toggle Row */}
          <div className="space-y-1.5">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Accessibility Theme</span>
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg">
              <button
                onClick={() => setTheme('light')}
                className={`py-1 rounded-md text-[9px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  theme === 'light' ? 'bg-[#34d399] text-[#0f172a]' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Standard High-contrast Light"
              >
                <Sun className="w-2.5 h-2.5" /> Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`py-1 rounded-md text-[9px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  theme === 'dark' ? 'bg-[#34d399] text-[#0f172a]' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Eye-safe Dark Mode"
              >
                <Moon className="w-2.5 h-2.5" /> Dark
              </button>
              <button
                onClick={() => setTheme('high-contrast')}
                className={`py-1 rounded-md text-[9px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  theme === 'high-contrast' ? 'bg-[#34d399] text-[#0f172a]' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="TUC Compliance Contrast"
              >
                <Contrast className="w-2.5 h-2.5" /> Contrast
              </button>
            </div>
          </div>

          {/* Admin authorization status widget */}
          <div className="pt-2 border-t border-slate-800/60">
            {isAdmin ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-950/80 border border-emerald-500/30 rounded-lg text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                  <Unlock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Daniel Twum (Admin)</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-650 rounded-lg text-slate-300 hover:text-white text-[9px] font-black uppercase tracking-wider cursor-pointer"
                >
                  Terminate Session
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-950/80 border border-amber-500/30 rounded-lg text-amber-400 text-[9px] font-black uppercase tracking-wider">
                  <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Standard Access</span>
                </div>
                <p className="text-[8px] text-slate-500 px-1 leading-relaxed">
                  Admin features require SYSTEM_ADMIN, HOD, or MEDICAL_OFFICER role via WMS.
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 w-full overflow-y-auto space-y-8" id="main-content">
        
        {/* Render Active Tab */}
        {currentTab === 'dashboard' && (
          <Dashboard
            visits={visits}
            medications={medications}
            facilityLogs={facilityLogs}
            patients={patients}
            dailyHealthChecks={dailyHealthChecks}
            onAddDailyHealthCheck={handleAddDailyHealthCheck}
            onNavigate={handleTabClick}
            onDischargeObservation={handleDischargeObservation}
            onOpenQuickLog={() => {
              setPreSelectedPatientId(undefined);
              setCurrentTab('logger');
            }}
          />
        )}

        {currentTab === 'logger' && (
          <VisitLogger
            patients={patients}
            medications={medications}
            onAddVisit={handleAddVisit}
            onCancel={() => {
              setPreSelectedPatientId(undefined);
              setCurrentTab('dashboard');
            }}
            preSelectedPatientId={preSelectedPatientId}
          />
        )}

        {currentTab === 'visits' && (
          <VisitsListView visits={visits} />
        )}

        {currentTab === 'roster' && (
          <RosterView
            patients={patients}
            visits={visits}
            onAddPatient={handleAddPatient}
            onSelectCheckIn={handleSelectCheckInFromRoster}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryView
            medications={medications}
            onAddMedication={handleAddMedication}
            onUpdateMedication={handleUpdateMedication}
            onRemoveMedication={handleRemoveMedication}
            onRestock={handleRestockMedication}
            onDiscardExpired={handleDiscardExpiredMedication}
          />
        )}

        {currentTab === 'referrals' && (
          <ReferralsView
            referrals={referrals}
            onAddReferral={handleAddReferral}
            onUpdateStatus={handleUpdateReferralStatus}
          />
        )}

        {currentTab === 'facility' && (
          <FacilityLogView
            logs={facilityLogs}
            onAddLog={handleAddFacilityLog}
            onResolveLog={handleResolveFacilityLog}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            visits={visits}
            medications={medications}
            facilityLogs={facilityLogs}
            patients={patients}
            dailyHealthChecks={dailyHealthChecks}
            auditLogs={auditLogs}
            onResetDatabase={handleResetDatabase}
            onImportDatabase={handleImportDatabase}
            onSeedDemoData={loadDefaultDataset}
          />
        )}

      </main>

      {/* Password Authentication Modal removed — replaced by WMS SSO LoginPage gate */}

      {/* Real-time TUC Local Save Sync Status Notification */}
      <AnimatePresence>
        {saveStatus.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3 px-4 py-2.5 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_rgba(15,23,42,1)]"
            id="autosave-status-toast"
          >
            <div className="p-1 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-700">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider leading-none">Changes Saved</span>
              <span className="text-[9px] font-mono font-black text-emerald-600 mt-1 uppercase leading-none">{saveStatus.timestamp}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
