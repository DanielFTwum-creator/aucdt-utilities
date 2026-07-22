import React, { useState, useEffect, useRef } from 'react';
import { Visit, Patient, Medication, Referral, FacilityLog, DailyHealthCheck, AuditLog } from './types';
import { exchange, silentSession, setAccessToken, wmsLogout, isAdminRole, type WmsUser, type WmsSession } from './lib/wmsAuth';
import LoginPage from './components/LoginPage';
import * as api from './lib/api';

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

  // Flash the "Changes Saved" toast after a successful DB write.
  const flashSaved = () => {
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    setSaveStatus({ show: true, timestamp: timeStr });
    setTimeout(() => setSaveStatus(prev => ({ ...prev, show: false })), 3500);
  };

  // Append Audit Log Helper — persists to the DB, shown optimistically at once.
  const logEvent = (action: string, category: 'AUTH' | 'CLINICAL' | 'INVENTORY' | 'FACILITY' | 'SYSTEM', details: string) => {
    const actor = wmsUser?.name || "Clinical Staff";
    const optimistic: AuditLog = {
      id: `tmp-${Date.now()}`,
      dateTime: new Date().toISOString(),
      action, category, actor, details
    };
    setAuditLogs(prev => [optimistic, ...prev]);
    api.addAuditLog({ action, category, actor, details }).catch(err => console.error('audit log failed', err));
  };

  // Pull the full authoritative dataset from the SickBay database. Called once
  // the user is signed in, and after every write so the UI reflects the DB.
  const refreshAll = async () => {
    const [p, m, v, r, f, d, a] = await Promise.all([
      api.getPatients(), api.getMedications(), api.getVisits(),
      api.getReferrals(), api.getFacilityLogs(), api.getDailyChecks(), api.getAuditLogs()
    ]);
    setPatients(p);
    setMedications(m);
    setVisits(v);
    setReferrals(r);
    setFacilityLogs(f);
    setDailyHealthChecks(d);
    setAuditLogs(a);
  };

  // Load data once the WMS session is established.
  useEffect(() => {
    if (!wmsUser) return;
    refreshAll().catch(err => console.error('Failed to load SickBay data from the database', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wmsUser]);

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

  // State Manipulation Handlers — each persists to the DB, then re-pulls the
  // authoritative dataset so every client stays consistent.
  const handleAddVisit = async (newVisitData: Omit<Visit, 'id' | 'dateTime'> & { referralHospital?: string; referralReason?: string }) => {
    // Stock deduction and any hospital referral are handled atomically server-side.
    try {
      await api.addVisit(newVisitData as api.VisitPayload);
      logEvent('Registered Clinical Visit', 'CLINICAL', `Registered visit for patient ${newVisitData.patientName} (ID: ${newVisitData.patientId})`);
      await refreshAll();
      flashSaved();
      setCurrentTab('dashboard');
      setPreSelectedPatientId(undefined);
    } catch (e: any) {
      alert(`Could not save the visit: ${e.message}`);
    }
  };

  const handleDischargeObservation = async (visitId: string, notes: string) => {
    try {
      await api.dischargeVisit(visitId, notes);
      logEvent('Discharged Observation Bed', 'CLINICAL', `Discharged visit ID ${visitId} from observation bed`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not discharge: ${e.message}`);
    }
  };

  const handleAddPatient = async (patient: Patient) => {
    try {
      await api.addPatient(patient);
      logEvent('Added Patient Profile', 'CLINICAL', `Created new medical file for ${patient.name} (ID: ${patient.id})`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not add patient: ${e.message}`);
    }
  };

  const handleAddDailyHealthCheck = async (check: Omit<DailyHealthCheck, 'id' | 'dateTime'>) => {
    try {
      await api.addDailyCheck(check);
      logEvent('Logged Morning Screening', 'CLINICAL', `Registered daily check-in for ${check.patientName}`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not save check-in: ${e.message}`);
    }
  };

  const handleAddMedication = async (medication: Medication) => {
    try {
      await api.addMedication(medication);
      logEvent('Pharmacy Add Medication', 'INVENTORY', `Added new stock line ${medication.name}`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not add medication: ${e.message}`);
    }
  };

  const handleUpdateMedication = async (updatedMed: Medication) => {
    try {
      await api.updateMedication(updatedMed);
      logEvent('Pharmacy Stock Adjust', 'INVENTORY', `Adjusted inventory values for ${updatedMed.name}`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not update medication: ${e.message}`);
    }
  };

  const handleRemoveMedication = async (id: string) => {
    try {
      await api.deleteMedication(id);
      logEvent('Pharmacy Stock Delete', 'INVENTORY', `Removed inventory listing ID ${id}`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not remove medication: ${e.message}`);
    }
  };

  const handleRestockMedication = async (id: string, qty: number) => {
    const med = medications.find(m => m.id === id);
    if (!med) return;
    try {
      await api.updateMedication({ ...med, quantityOnHand: med.quantityOnHand + qty });
      logEvent('Pharmacy Restock', 'INVENTORY', `Restocked ${qty} units of ID ${id}`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not restock: ${e.message}`);
    }
  };

  const handleDiscardExpiredMedication = async (id: string) => {
    const med = medications.find(m => m.id === id);
    if (!med) return;
    try {
      await api.updateMedication({ ...med, quantityOnHand: 0 });
      logEvent('Discarded Expired Medication', 'INVENTORY', `Zeroed and discarded expired batches for ID ${id}`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not discard batch: ${e.message}`);
    }
  };

  const handleAddReferral = async (newRef: Referral) => {
    try {
      await api.addReferral(newRef);
      logEvent('Added Referral Protocol', 'CLINICAL', `Initiated emergency hospital referral for ${newRef.patientName}`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not add referral: ${e.message}`);
    }
  };

  const handleUpdateReferralStatus = async (id: string, status: Referral['status'], outcome?: string) => {
    try {
      await api.updateReferral(id, status, outcome);
      logEvent('Updated Referral Status', 'CLINICAL', `Marked referral ID ${id} as ${status}`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not update referral: ${e.message}`);
    }
  };

  const handleAddFacilityLog = async (log: FacilityLog) => {
    try {
      await api.addFacilityLog(log);
      logEvent('Reported Facility Defect', 'FACILITY', `Logged fault report for ${log.equipmentName}`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not log defect: ${e.message}`);
    }
  };

  const handleResolveFacilityLog = async (id: string, resolutionDays: number) => {
    try {
      await api.resolveFacilityLog(id, resolutionDays);
      logEvent('Resolved Facility Defect', 'FACILITY', `Marked defect resolution for ID ${id} in ${resolutionDays} days`);
      await refreshAll();
      flashSaved();
    } catch (e: any) {
      alert(`Could not resolve defect: ${e.message}`);
    }
  };

  // Re-sync from the authoritative database (replaces the old localStorage wipe).
  const handleResetDatabase = async () => {
    if (window.confirm("Re-sync all records from the SickBay database? This reloads the authoritative dataset from the server.")) {
      try {
        await refreshAll();
        logEvent('Data Re-sync', 'SYSTEM', 'Reloaded authoritative dataset from the SickBay database');
        flashSaved();
      } catch (e: any) {
        alert(`Could not re-sync: ${e.message}`);
      }
    }
  };

  // In-app JSON import belonged to the localStorage era. Restore is now a
  // server-side database operation (MariaDB backups), so this is disabled.
  const handleImportDatabase = (_dataStr: string) => {
    alert("In-app restore is disabled in the database-backed version. Database restores are handled server-side from MariaDB backups.");
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
    { id: 'roster', label: 'Student & Staff Roster', icon: Users },
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
              {currentTime || 'Clock initialising...'}
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
                  <span>{wmsUser?.name || 'Administrator'} (Admin)</span>
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
                  Admin features require SYSTEM_ADMIN, HOD, ADMIN_STAFF, or MEDICAL_OFFICER role via WMS.
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
            userName={wmsUser?.name}
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
            onSeedDemoData={refreshAll}
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
