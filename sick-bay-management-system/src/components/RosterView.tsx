import React, { useState } from 'react';
import { Patient, Visit } from '../types';
import VitalsTrendView from './VitalsTrendView';
import PatientHistoryModal from './PatientHistoryModal';
import { 
  Plus, 
  Search, 
  Users, 
  UserPlus, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Stethoscope, 
  FileCheck,
  Filter,
  QrCode,
  Printer,
  Camera
} from 'lucide-react';
import { motion } from 'motion/react';

interface RosterViewProps {
  patients: Patient[];
  visits: Visit[];
  onAddPatient: (patient: Patient) => void;
  onSelectCheckIn: (patientId: string) => void;
}

export default function RosterView({
  patients,
  visits,
  onAddPatient,
  onSelectCheckIn
}: RosterViewProps) {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Student' | 'Staff'>('All');
  const [filterMedicalWarning, setFilterMedicalWarning] = useState<boolean>(false);

  // Selected Student for Vitals Trend Graph
  const [selectedPatientForTrends, setSelectedPatientForTrends] = useState<Patient | null>(null);

  // Selected Student for Full Medical History & Trends Modal
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<Patient | null>(null);

  // QR and Scanner State
  const [selectedPatientForQr, setSelectedPatientForQr] = useState<Patient | null>(null);
  const [showScannerConsole, setShowScannerConsole] = useState(false);
  const [scannedPatient, setScannedPatient] = useState<Patient | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerSearchQuery, setScannerSearchQuery] = useState('');

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'Student' | 'Staff'>('Student');
  const [newGender, setNewGender] = useState<'Male' | 'Female'>('Male');
  const [newAge, setNewAge] = useState<number>(15);
  const [newClassOrDept, setNewClassOrDept] = useState('');
  const [newAllergies, setNewAllergies] = useState('');
  const [newChronic, setNewChronic] = useState('');
  const [newEmergencyName, setNewEmergencyName] = useState('');
  const [newEmergencyPhone, setNewEmergencyPhone] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newName || !newClassOrDept) return;

    onAddPatient({
      id: newId,
      name: newName,
      type: newType,
      gender: newGender,
      age: Number(newAge),
      classOrDept: newClassOrDept,
      allergies: newAllergies ? newAllergies.split(',').map(s => s.trim()).filter(Boolean) : [],
      chronicConditions: newChronic ? newChronic.split(',').map(s => s.trim()).filter(Boolean) : [],
      emergencyContactName: newEmergencyName || 'Guardian',
      emergencyContactPhone: newEmergencyPhone || 'N/A'
    });

    // Reset Form
    setNewId('');
    setNewName('');
    setNewType('Student');
    setNewGender('Male');
    setNewAge(15);
    setNewClassOrDept('');
    setNewAllergies('');
    setNewChronic('');
    setNewEmergencyName('');
    setNewEmergencyPhone('');
    setShowAddForm(false);
  };

  const getVisitCount = (patientId: string) => {
    return visits.filter(v => v.patientId === patientId).length;
  };

  const playScanBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, ctx.currentTime); // high pure frequency beep
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn("AudioContext block or not supported:", e);
    }
  };

  const handleSimulatedScan = (patient: Patient) => {
    setIsScanning(true);
    setScannedPatient(null);
    playScanBeep();
    
    setTimeout(() => {
      setScannedPatient(patient);
      setIsScanning(false);
    }, 500);
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.classOrDept.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || patient.type === filterType;

    const matchesWarning = 
      !filterMedicalWarning || 
      patient.allergies.length > 0 || 
      patient.chronicConditions.length > 0;

    return matchesSearch && matchesType && matchesWarning;
  });

  return (
    <div className="space-y-6" id="roster-tab">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase italic font-display text-slate-900">School Medical Roster</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase">Manage school students and staff profiles with integrated allergen and clinical warnings.</p>
        </div>
        <div className="flex flex-wrap gap-2.5 self-start md:self-auto">
          <button
            onClick={() => {
              setShowScannerConsole(!showScannerConsole);
              setScannedPatient(null);
            }}
            className="bento-btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-[3px_3px_0px_rgba(15,23,42,1)] text-xs flex items-center gap-2 cursor-pointer"
            id="toggle-qr-scanner-btn"
          >
            <Camera className="w-4 h-4" /> {showScannerConsole ? "Close QR Scanner" : "Scan QR ID Badge"}
          </button>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setNewId(newType === 'Student' ? `STU-2026-${Math.floor(100 + Math.random() * 900)}` : `STF-2026-${Math.floor(100 + Math.random() * 900)}`);
            }}
            className="bento-btn bg-[#0f172a] text-white shadow-[3px_3px_0px_rgba(15,23,42,1)] text-xs flex items-center gap-2 cursor-pointer"
            id="toggle-add-patient-btn"
          >
            <UserPlus className="w-4 h-4" /> Add Student / Staff
          </button>
        </div>
      </div>

      {/* Selected Patient Vitals Trend Graph Panel */}
      {selectedPatientForTrends && (
        <VitalsTrendView 
          patient={selectedPatientForTrends}
          visits={visits}
          onClose={() => setSelectedPatientForTrends(null)}
        />
      )}

      {/* Scanner Console Panel */}
      {showScannerConsole && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card border-2 border-slate-900 bg-slate-900 text-slate-100 p-6 rounded-[2rem] shadow-[6px_6px_0px_#000] space-y-6 animate-fadeIn"
          id="qr-scanner-console"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-white">CAREPro QR & RFID Scanning Console</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">HARDWARE STATUS: ONLINE & READY</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowScannerConsole(false);
                setScannedPatient(null);
              }}
              className="text-xs font-black uppercase tracking-wider bg-slate-800 border-2 border-slate-700 text-slate-300 px-3.5 py-1.5 rounded-xl hover:bg-slate-700 cursor-pointer"
            >
              Close Console
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Viewfinder (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-black rounded-2xl border-2 border-slate-850 p-5 min-h-[360px] relative overflow-hidden">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-md" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-md" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-md" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-md" />

              {/* Scanning Laser Line */}
              {isScanning && (
                <div className="absolute left-0 right-0 h-1 bg-rose-500 shadow-[0_0_15px_#f43f5e] animate-laserLine top-0 z-10" />
              )}
              {!isScanning && !scannedPatient && (
                <div className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_10px_#10b981] animate-laserLine top-0 z-10" />
              )}

              {/* Viewer Content */}
              <div className="my-auto flex flex-col items-center justify-center text-center space-y-4 py-8 relative z-0">
                {isScanning ? (
                  <div className="space-y-3">
                    <QrCode className="w-16 h-16 text-indigo-400 animate-pulse mx-auto" />
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Interpreting digital payload...</p>
                  </div>
                ) : scannedPatient ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4 w-full"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded uppercase tracking-wider">
                        SCAN COMPLETE
                      </span>
                      <h4 className="text-lg font-black text-white uppercase mt-2 leading-tight">{scannedPatient.name}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase">{scannedPatient.type} • ID: {scannedPatient.id}</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Class/Dept: {scannedPatient.classOrDept}</p>
                    </div>

                    {/* Allergies Alerts right in Scanner view to protect patients! */}
                    {(scannedPatient.allergies.length > 0 || scannedPatient.chronicConditions.length > 0) && (
                      <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl max-w-sm mx-auto space-y-1 text-left">
                        <span className="text-[10px] text-rose-400 font-black flex items-center gap-1 uppercase">
                          <AlertTriangle className="w-3.5 h-3.5" /> High Clinical Warning Alerts:
                        </span>
                        {scannedPatient.allergies.length > 0 && (
                          <p className="text-[11px] font-medium text-rose-300 leading-tight">
                            <strong className="font-bold">Allergies:</strong> {scannedPatient.allergies.join(', ')}
                          </p>
                        )}
                        {scannedPatient.chronicConditions.length > 0 && (
                          <p className="text-[11px] font-medium text-rose-300 leading-tight">
                            <strong className="font-bold">Chronic Conditions:</strong> {scannedPatient.chronicConditions.join(', ')}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-xs mx-auto pt-2">
                      <button
                        onClick={() => {
                          onSelectCheckIn(scannedPatient.id);
                          setShowScannerConsole(false);
                          setScannedPatient(null);
                        }}
                        className="bento-btn bento-btn-emerald w-full py-2.5 text-xs font-black shadow-[2px_2px_0px_#000] uppercase text-slate-950 cursor-pointer"
                      >
                        Log Medical Visit
                      </button>
                      <button
                        onClick={() => setScannedPatient(null)}
                        className="w-full bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 text-slate-200 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                      >
                        Scan Another
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <QrCode className="w-16 h-16 text-emerald-400 mx-auto opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                    </div>
                    <div className="space-y-1 max-w-xs mx-auto">
                      <p className="text-xs font-black uppercase text-emerald-400 tracking-wider">Awaiting Student ID Scan...</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase leading-normal">
                        Select a clinical badge on the right panel to simulate holding an ID card to the sensor.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Console logs ticker */}
              <div className="border-t border-slate-900 pt-3 text-[10px] text-slate-500 font-mono flex justify-between uppercase">
                <span>SENSOR: CMOS CAMERA ACTIVE</span>
                <span>BAUD: 115200 KBPS</span>
              </div>
            </div>

            {/* Simulation Dashboard (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Roster Scan Simulation Board</h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase mt-1">
                    Every student registered in the TUC Care database has a unique clinical QR code. In a physical environment, the student presents this badge to the CMOS scanner at the Sick Bay door to bypass manual profile entry.
                  </p>
                </div>

                {/* Filter and roster search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={scannerSearchQuery}
                    onChange={(e) => setScannerSearchQuery(e.target.value)}
                    placeholder="Search students to simulate scan..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-800 border-2 border-slate-700 rounded-xl text-xs font-bold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Mini Badge List */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {patients
                    .filter(p => p.name.toLowerCase().includes(scannerSearchQuery.toLowerCase()) || p.id.toLowerCase().includes(scannerSearchQuery.toLowerCase()))
                    .map(p => {
                      const isTarget = scannedPatient?.id === p.id;
                      return (
                        <div 
                          key={p.id}
                          className={`border-2 rounded-xl p-2.5 transition-all flex items-center justify-between gap-3 ${
                            isTarget 
                              ? 'border-emerald-500 bg-emerald-500/10' 
                              : 'border-slate-800 bg-slate-850 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Simulated miniature QR */}
                            <div className="w-10 h-10 bg-white p-0.5 rounded border border-slate-700 shrink-0 flex items-center justify-center">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(p.id)}`} 
                                alt="QR Mini" 
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <h5 className="text-xs font-black text-white uppercase">{p.name}</h5>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{p.classOrDept} • ID: {p.id}</p>
                              <div className="flex gap-1.5 mt-0.5">
                                {p.allergies.length > 0 && <span className="text-[8px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1 rounded uppercase">Allergy</span>}
                                {p.chronicConditions.length > 0 && <span className="text-[8px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 rounded uppercase">Chronic</span>}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={isScanning}
                            onClick={() => handleSimulatedScan(p)}
                            className={`text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              isScanning 
                                ? 'bg-slate-800 text-slate-600 border-transparent' 
                                : 'bg-emerald-500 text-slate-950 border-slate-900 shadow-[1px_1px_0px_rgba(255,255,255,0.2)] hover:bg-emerald-400'
                            }`}
                          >
                            Tap Badge
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Student Digital Health Badge Modal */}
      {selectedPatientForQr && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn" id="patient-badge-modal">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-6 max-w-sm w-full shadow-[8px_8px_0px_rgba(15,23,42,1)] relative space-y-6"
          >
            {/* Badge header */}
            <div className="text-center border-b-2 border-dashed border-slate-200 pb-4">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <div className="w-6 h-6 bg-[#f43f5e] border border-slate-900 rounded-md flex items-center justify-center text-white font-black text-sm shadow-xs">+</div>
                <span className="font-black text-slate-900 text-xs tracking-tight uppercase">Techbridge University College</span>
              </div>
              <h3 className="font-black text-[10px] text-indigo-600 font-mono tracking-widest uppercase">Clinical ID Emergency Badge</h3>
            </div>

            {/* QR display block */}
            <div className="bg-slate-50 border-2 border-slate-900 rounded-3xl p-4 flex flex-col items-center justify-center shadow-[4px_4px_0px_rgba(15,23,42,1)] relative overflow-hidden">
              <div className="bg-white p-3 border-2 border-slate-900 rounded-2xl relative z-10">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedPatientForQr.id)}&color=0f172a&bgcolor=ffffff&qzone=1`}
                  alt={`${selectedPatientForQr.name} QR Badge`}
                  className="w-40 h-40 object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center mt-3 relative z-10">
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide leading-tight">{selectedPatientForQr.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono font-bold mt-1 uppercase tracking-wider">ID: {selectedPatientForQr.id}</p>
                <p className="text-[10px] text-slate-500 font-black mt-0.5 uppercase">{selectedPatientForQr.gender} • {selectedPatientForQr.age} yrs • {selectedPatientForQr.classOrDept}</p>
              </div>
            </div>

            {/* Quick warning flags */}
            {(selectedPatientForQr.allergies.length > 0 || selectedPatientForQr.chronicConditions.length > 0) && (
              <div className="bg-amber-50 border-2 border-slate-900 rounded-2xl p-3.5 space-y-1.5 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase block">Clinician Alert Indicators</span>
                {selectedPatientForQr.allergies.length > 0 && (
                  <div className="text-[10px] font-bold text-rose-800 flex items-start gap-1">
                    <span className="text-rose-500 shrink-0">⚠️</span>
                    <span>Allergies: {selectedPatientForQr.allergies.join(', ')}</span>
                  </div>
                )}
                {selectedPatientForQr.chronicConditions.length > 0 && (
                  <div className="text-[10px] font-bold text-amber-800 flex items-start gap-1">
                    <span className="text-amber-500 shrink-0">⚠️</span>
                    <span>Chronic: {selectedPatientForQr.chronicConditions.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onSelectCheckIn(selectedPatientForQr.id);
                  setSelectedPatientForQr(null);
                }}
                className="w-full bento-btn bento-btn-emerald py-3 text-xs font-black shadow-[3px_3px_0px_rgba(15,23,42,1)] uppercase text-slate-950 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" /> Simulate Scanner Scan
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    alert("Card sent to local Techbridge TUC Badge Printer!");
                  }}
                  className="bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 py-2.5 rounded-xl text-[10px] font-black uppercase text-slate-800 shadow-[2px_2px_0px_rgba(15,23,42,1)] cursor-pointer flex items-center justify-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" /> Print Badge
                </button>
                <button
                  onClick={() => setSelectedPatientForQr(null)}
                  className="bg-white hover:bg-slate-50 border-2 border-slate-900 py-2.5 rounded-xl text-[10px] font-black uppercase text-slate-700 shadow-[2px_2px_0px_rgba(15,23,42,1)] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Profile Form Panel */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-5 shadow-[4px_4px_0px_rgba(15,23,42,1)] animate-fadeIn" id="add-patient-form">
          <div className="md:col-span-3 pb-3 border-b-2 border-slate-900">
            <h3 className="font-black uppercase text-slate-900 text-sm md:text-base">Register School Profile</h3>
            <p className="text-xs text-slate-500 font-bold uppercase">Add a permanent record to prevent manual double entries during visits.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">ID / Admission Number</label>
            <input
              type="text"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              placeholder="e.g. STU-2026-905"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Full Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Kofi Annan"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Type</label>
            <select
              value={newType}
              onChange={(e) => {
                const val = e.target.value as 'Student' | 'Staff';
                setNewType(val);
                setNewId(val === 'Student' ? `STU-2026-${Math.floor(100 + Math.random()*900)}` : `STF-2026-${Math.floor(100 + Math.random()*900)}`);
              }}
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-black text-slate-700 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            >
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNewGender('Male')}
                className={`py-2 text-xs font-black border-2 rounded-xl cursor-pointer transition-all shadow-[2px_2px_0px_rgba(15,23,42,1)] ${newGender === 'Male' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-900'}`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setNewGender('Female')}
                className={`py-2 text-xs font-black border-2 rounded-xl cursor-pointer transition-all shadow-[2px_2px_0px_rgba(15,23,42,1)] ${newGender === 'Female' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-900'}`}
              >
                Female
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Age</label>
            <input
              type="number"
              value={newAge}
              onChange={(e) => setNewAge(Number(e.target.value))}
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Class / Department</label>
            <input
              type="text"
              value={newClassOrDept}
              onChange={(e) => setNewClassOrDept(e.target.value)}
              placeholder="e.g. Grade 11 Science"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Drug & Food Allergies</label>
            <input
              type="text"
              value={newAllergies}
              onChange={(e) => setNewAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Aspirin (Comma separated)"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Chronic Illnesses</label>
            <input
              type="text"
              value={newChronic}
              onChange={(e) => setNewChronic(e.target.value)}
              placeholder="e.g. Asthma, Epilepsy (Comma separated)"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-600 uppercase block">Contact Person</label>
              <input
                type="text"
                value={newEmergencyName}
                onChange={(e) => setNewEmergencyName(e.target.value)}
                placeholder="Name"
                className="w-full py-2 px-2 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold focus:outline-none shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-600 uppercase block">Contact Phone</label>
              <input
                type="text"
                value={newEmergencyPhone}
                onChange={(e) => setNewEmergencyPhone(e.target.value)}
                placeholder="Phone"
                className="w-full py-2 px-2 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold focus:outline-none shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              />
            </div>
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
              className="bento-btn bento-btn-emerald shadow-[2px_2px_0px_rgba(15,23,42,1)] text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Register Profile
            </button>
          </div>
        </form>
      )}

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row gap-3 items-center" id="roster-filters">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, grade/class, or Admission ID..."
            className="w-full pl-10 pr-4 py-3 border-2 border-slate-900 rounded-xl text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto" id="roster-quick-tabs">
          <span className="p-2.5 bg-slate-100 rounded-xl border-2 border-slate-900 text-slate-700 hidden sm:inline shadow-[2px_2px_0px_rgba(15,23,42,1)]">
            <Filter className="w-4 h-4" />
          </span>
          <div className="grid grid-cols-3 gap-1 bg-white border-2 border-slate-900 p-1 rounded-xl w-full md:w-auto shadow-[2px_2px_0px_rgba(15,23,42,1)]">
            {(['All', 'Student', 'Staff'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${filterType === tab ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {tab}s
              </button>
            ))}
          </div>

          <button
            onClick={() => setFilterMedicalWarning(!filterMedicalWarning)}
            className={`bento-btn border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)] text-xs font-black flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              filterMedicalWarning 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-white text-slate-600'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> High Risk Only
          </button>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="roster-profiles-grid">
        {filteredPatients.map(patient => {
          const visitsCount = getVisitCount(patient.id);
          const hasWarning = patient.allergies.length > 0 || patient.chronicConditions.length > 0;

          return (
            <div key={patient.id} className="bento-card bg-white p-5 hover:shadow-[4px_4px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-all space-y-4 flex flex-col justify-between" id={`patient-card-${patient.id}`}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 font-mono block uppercase">ID: {patient.id}</span>
                    <h3 className="font-black text-slate-900 text-base leading-tight uppercase">{patient.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase">{patient.gender} • {patient.age} yrs • {patient.classOrDept}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`bento-badge border-2 border-slate-900 shadow-[1px_1px_0px_rgba(15,23,42,1)] uppercase tracking-wider text-[9px] font-black ${
                      patient.type === 'Student' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {patient.type}
                    </span>
                    <button
                      onClick={() => setSelectedPatientForQr(patient)}
                      title="Show Student QR Code Badge"
                      className="p-1.5 text-slate-700 hover:text-slate-950 hover:bg-indigo-50 border-2 border-slate-900 rounded-lg shadow-[1px_1px_0px_rgba(15,23,42,1)] active:translate-y-0.5 cursor-pointer bg-white transition-all"
                      type="button"
                    >
                      <QrCode className="w-4 h-4 text-indigo-600" />
                    </button>
                  </div>
                </div>

                {/* Warnings indicators */}
                {hasWarning ? (
                  <div className="space-y-1.5 bg-amber-50 p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                    {patient.chronicConditions.length > 0 && (
                      <div className="text-[11px] text-amber-900 font-black flex items-start gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>Chronic: {patient.chronicConditions.join(', ')}</span>
                      </div>
                    )}
                    {patient.allergies.length > 0 && (
                      <div className="text-[11px] text-rose-900 font-black flex items-start gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>Allergy: {patient.allergies.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-800 font-black bg-emerald-50 p-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)] flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Clinical records cleared
                  </div>
                )}
              </div>

              {/* Card Footer: Visits & Action */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100 gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedPatientForHistory(patient)}
                  className="text-xs font-black text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 uppercase cursor-pointer"
                  id={`view-history-${patient.id}`}
                  type="button"
                >
                  <Stethoscope className="w-4 h-4 text-indigo-600" /> {visitsCount} {visitsCount === 1 ? 'visit' : 'visits'} • Medical History
                </button>
                <button
                  onClick={() => onSelectCheckIn(patient.id)}
                  className="bento-btn bento-btn-emerald py-1.5 px-3.5 text-xs font-black shadow-[2px_2px_0px_rgba(15,23,42,1)] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Visit
                </button>
              </div>
            </div>
          );
        })}

        {filteredPatients.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 text-slate-400 text-sm font-black border-2 border-dashed border-slate-300 rounded-3xl uppercase">
            No student or staff profiles matched filters. Try clearing keywords.
          </div>
        )}
      </div>

      {/* Selected Patient Medical History Modal */}
      {selectedPatientForHistory && (
        <PatientHistoryModal
          patient={selectedPatientForHistory}
          visits={visits}
          onClose={() => setSelectedPatientForHistory(null)}
        />
      )}
    </div>
  );
}
