import React, { useState, useEffect } from 'react';
import { Patient, Medication, Visit, SeverityLevel, Disposition } from '../types';
import { 
  Search, 
  AlertOctagon, 
  AlertTriangle, 
  UserCheck, 
  Activity, 
  Heart, 
  Thermometer, 
  Check, 
  HelpCircle,
  Clock,
  Send,
  Plus
} from 'lucide-react';

interface VisitLoggerProps {
  patients: Patient[];
  medications: Medication[];
  onAddVisit: (visit: Omit<Visit, 'id' | 'dateTime'> & { referralHospital?: string; referralReason?: string }) => void;
  onCancel: () => void;
  preSelectedPatientId?: string;
}

const COMMON_CONDITIONS = [
  "URTI (Upper Respiratory Infection)",
  "Headache / Migraine",
  "Gastroenteritis",
  "Minor Injury / Wound",
  "Anaemia",
  "Diarrhoea",
  "Peptic Ulcer Disease (PUD)",
  "Epileptic Fit / Seizure",
  "Asthma Attack",
  "Allergic Reaction",
  "Hypertension Monitoring",
  "Fever / Suspected Malaria",
  "General Pain"
];

export default function VisitLogger({
  patients,
  medications,
  onAddVisit,
  onCancel,
  preSelectedPatientId
}: VisitLoggerProps) {
  // Patient Selection
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showRosterResults, setShowRosterResults] = useState(false);

  // Vitals
  const [temperature, setTemperature] = useState<string>('36.8');
  const [bloodPressure, setBloodPressure] = useState<string>('120/80');
  const [pulseRate, setPulseRate] = useState<string>('75');

  // Case Details
  const [symptoms, setSymptoms] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [severity, setSeverity] = useState<SeverityLevel>('Mild');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  const [treatedBy, setTreatedBy] = useState('Nurse T. Asante');

  // Medication Dispensing
  const [dispenseMedId, setDispenseMedId] = useState<string>('');
  const [dispenseQty, setDispenseQty] = useState<string>('0');

  // Outcome/Disposition
  const [disposition, setDisposition] = useState<Disposition>('Back to Class');
  const [bedNo, setBedNo] = useState<string>('Bed A');
  const [referralHospital, setReferralHospital] = useState('');
  const [referralReason, setReferralReason] = useState('');

  // Allergy warning state
  const [allergyWarning, setAllergyWarning] = useState<string | null>(null);

  // If preselected patient id
  useEffect(() => {
    if (preSelectedPatientId) {
      const patient = patients.find(p => p.id === preSelectedPatientId);
      if (patient) {
        setSelectedPatient(patient);
        setSearchTerm(patient.name);
      }
    }
  }, [preSelectedPatientId, patients]);

  // Drug-allergy check
  useEffect(() => {
    if (!selectedPatient || !dispenseMedId) {
      setAllergyWarning(null);
      return;
    }

    const med = medications.find(m => m.id === dispenseMedId);
    if (!med) return;

    // Simple keyword match for common drug allergies
    const hasPenicillinAllergy = selectedPatient.allergies.some(a => a.toLowerCase().includes('penicillin') || a.toLowerCase().includes('amoxicillin'));
    const isPenicillinDrug = med.name.toLowerCase().includes('penicillin') || med.name.toLowerCase().includes('amoxicillin');

    const hasSulfaAllergy = selectedPatient.allergies.some(a => a.toLowerCase().includes('sulfa'));
    const isSulfaDrug = med.name.toLowerCase().includes('sulfa');

    const hasAspirinAllergy = selectedPatient.allergies.some(a => a.toLowerCase().includes('aspirin') || a.toLowerCase().includes('ibuprofen'));
    const isNsaid = med.name.toLowerCase().includes('aspirin') || med.name.toLowerCase().includes('ibuprofen');

    if (hasPenicillinAllergy && isPenicillinDrug) {
      setAllergyWarning(`⚠️ Allergen Warning: ${selectedPatient.name} has a recorded PENICILLIN allergy, and "${med.name}" is a penicillin/beta-lactam derivative.`);
    } else if (hasSulfaAllergy && isSulfaDrug) {
      setAllergyWarning(`⚠️ Allergen Warning: ${selectedPatient.name} has a recorded SULFA allergy.`);
    } else if (hasAspirinAllergy && isNsaid) {
      setAllergyWarning(`⚠️ Allergen Warning: ${selectedPatient.name} has a recorded NSAID/Aspirin allergy, and "${med.name}" is a registered NSAID analgesic.`);
    } else {
      setAllergyWarning(null);
    }
  }, [selectedPatient, dispenseMedId, medications]);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter(c => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setShowRosterResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    onAddVisit({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientType: selectedPatient.type,
      classOrDept: selectedPatient.classOrDept,
      gender: selectedPatient.gender,
      temperature: parseFloat(temperature) || 36.8,
      bloodPressure: bloodPressure || '120/80',
      pulseRate: parseInt(pulseRate) || 75,
      symptoms,
      presentingConditions: selectedConditions,
      severity,
      treatment,
      medicationDispensedId: dispenseMedId || undefined,
      medicationDispensedQty: dispenseMedId && parseInt(dispenseQty) > 0 ? parseInt(dispenseQty) : undefined,
      disposition,
      observedBedNo: disposition === 'Observe in Sick Bay' ? bedNo : undefined,
      notes,
      treatedBy,
      referralHospital: disposition === 'Referral to Hospital' ? referralHospital : undefined,
      referralReason: disposition === 'Referral to Hospital' ? referralReason : undefined
    });
  };

  const selectedMedObj = medications.find(m => m.id === dispenseMedId);
  const isOutOfStock = selectedMedObj && selectedMedObj.quantityOnHand <= 0;
  const isExceeded = selectedMedObj && parseInt(dispenseQty) > selectedMedObj.quantityOnHand;

  // Temperature color guide
  const tempVal = parseFloat(temperature);
  const isHighFever = tempVal >= 37.8;
  const isHyperpyrexia = tempVal >= 39.0;

  // Blood pressure parsing and indicators
  const parseBP = (bp: string) => {
    const parts = bp.split('/');
    const sys = parseInt(parts[0], 10);
    const dia = parseInt(parts[1], 10);
    return { sys, dia };
  };
  const { sys: bpSys, dia: bpDia } = parseBP(bloodPressure);
  const isHighBP = !isNaN(bpSys) && !isNaN(bpDia) && (bpSys >= 130 || bpDia >= 80);
  const isLowBP = !isNaN(bpSys) && !isNaN(bpDia) && (bpSys < 90 || bpDia < 60);

  // Pulse rate parsing and indicators
  const pulseVal = parseInt(pulseRate, 10);
  const isHighPulse = !isNaN(pulseVal) && pulseVal > 100;
  const isLowPulse = !isNaN(pulseVal) && pulseVal < 60;

  return (
    <div className="bento-card p-6 md:p-8 space-y-8" id="visit-logger-card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black uppercase italic font-display text-slate-900">Log Clinical Visit</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase">Record a new patient encounter, diagnostics, vitals, and dispensing actions.</p>
        </div>
        <button
          onClick={onCancel}
          className="bento-btn bg-white hover:bg-slate-100 border-2 border-slate-900 text-xs text-slate-700 shadow-[3px_3px_0px_#0f172a]"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" id="clinical-log-form">
        
        {/* Step 1: Patient Selection Lookup */}
        <div className="space-y-2 relative" id="patient-lookup-section">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Patient Lookup (Student / Staff)</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowRosterResults(true);
                if (selectedPatient && e.target.value !== selectedPatient.name) {
                  setSelectedPatient(null);
                }
              }}
              onFocus={() => setShowRosterResults(true)}
              placeholder="Type student name or ID to check-in..."
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-900 rounded-xl text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          {/* Search Dropdown Results */}
          {showRosterResults && searchTerm.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border-2 border-slate-900 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto divide-y-2 divide-slate-100" id="search-results-popover">
              {filteredPatients.map(patient => (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => handlePatientSelect(patient)}
                  className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-black text-slate-800 text-sm">{patient.name}</span>
                    <span className="text-xs text-slate-400 ml-2">({patient.id})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-black text-slate-500 rounded-full border border-slate-200">{patient.type}</span>
                    <span className="text-xs text-slate-500 font-bold">{patient.classOrDept}</span>
                  </div>
                </button>
              ))}
              {filteredPatients.length === 0 && (
                <div className="p-3.5 text-center text-xs text-slate-400 font-black uppercase flex items-center justify-center gap-2">
                  No matching student or staff. 
                  <button
                    type="button"
                    onClick={() => {
                      // Autogenerate a minimal profile
                      const mockNewPatient: Patient = {
                        id: `STU-GEN-${Math.floor(Math.random()*1000)}`,
                        name: searchTerm,
                        type: 'Student',
                        gender: 'Male',
                        age: 15,
                        classOrDept: 'Temporary Profile',
                        emergencyContactName: 'Guardian',
                        emergencyContactPhone: 'Unknown',
                        allergies: [],
                        chronicConditions: []
                      };
                      handlePatientSelect(mockNewPatient);
                    }}
                    className="text-emerald-600 underline font-black ml-1 hover:text-emerald-800"
                  >
                    Create Quick Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active Patient Details Banner (Safety & Warning Check) */}
          {selectedPatient && (
            <div className="bg-emerald-50 border-2 border-slate-900 rounded-[2rem] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[4px_4px_0px_#0f172a]" id="patient-safety-banner">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-white border-2 border-slate-900 text-slate-900 rounded-xl mt-0.5">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">{selectedPatient.name}</h4>
                  <p className="text-xs text-emerald-800 font-bold">
                    {selectedPatient.gender} • {selectedPatient.age} yrs • {selectedPatient.classOrDept} • ID: {selectedPatient.id}
                  </p>
                  <p className="text-xs text-emerald-600/95 font-bold mt-1">
                    Emergency: {selectedPatient.emergencyContactName} ({selectedPatient.emergencyContactPhone})
                  </p>
                </div>
              </div>

              {/* Safety Alerts: Pre-existing conditions and drug allergies */}
              <div className="space-y-1.5 shrink-0" id="safety-health-warnings">
                {selectedPatient.chronicConditions.length > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                    <AlertTriangle className="w-3.5 h-3.5" /> Chronic: {selectedPatient.chronicConditions.join(', ')}
                  </div>
                )}
                {selectedPatient.allergies.length > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-[10px] font-bold border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)] ml-2">
                    <AlertOctagon className="w-3.5 h-3.5 animate-pulse" /> Allergies: {selectedPatient.allergies.join(', ')}
                  </div>
                )}
                {selectedPatient.chronicConditions.length === 0 && selectedPatient.allergies.length === 0 && (
                  <span className="text-xs text-emerald-600 font-black uppercase bg-white px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                    ✓ No Medical Warnings
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Clinical Vitals */}
        <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4" id="vitals-inputs-section">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-orange-500" /> Temperature (°C)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className={`w-full py-2 px-3 border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-1 font-bold ${
                  isHighFever ? 'bg-orange-100 text-orange-950' : 'bg-white text-slate-700'
                }`}
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">°C</span>
            </div>
            <div className="text-[10px] font-bold">
              {isHyperpyrexia ? (
                <span className="text-rose-600 uppercase">⚠️ Critical Hyperpyrexia!</span>
              ) : isHighFever ? (
                <span className="text-orange-600 uppercase">⚠️ Fever registered</span>
              ) : (
                <span className="text-slate-400 uppercase">Normal Range (36.1 - 37.2)</span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-500" /> Blood Pressure (mmHg)
            </label>
            <input
              type="text"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              placeholder="e.g. 120/80"
              className={`w-full py-2 px-3 border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-1 font-bold ${
                isHighBP ? 'bg-amber-100 text-amber-950' : isLowBP ? 'bg-blue-100 text-blue-950' : 'bg-white text-slate-700'
              }`}
              required
            />
            <div className="text-[10px] font-bold">
              {isHighBP ? (
                <span className="text-amber-600 uppercase font-bold">⚠️ Elevated / Hypertension BP</span>
              ) : isLowBP ? (
                <span className="text-blue-600 uppercase font-bold">⚠️ Low Blood Pressure</span>
              ) : (
                <span className="text-slate-400 uppercase">Normal Range (90/60 - 120/80)</span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" /> Pulse Rate (bpm)
            </label>
            <div className="relative">
              <input
                type="number"
                value={pulseRate}
                onChange={(e) => setPulseRate(e.target.value)}
                placeholder="e.g. 72"
                className={`w-full py-2 px-3 border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-1 font-bold ${
                  isHighPulse ? 'bg-orange-100 text-orange-950' : isLowPulse ? 'bg-blue-100 text-blue-950' : 'bg-white text-slate-700'
                }`}
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">BPM</span>
            </div>
            <div className="text-[10px] font-bold">
              {isHighPulse ? (
                <span className="text-orange-600 uppercase font-bold">⚠️ Elevated / Tachycardia</span>
              ) : isLowPulse ? (
                <span className="text-blue-600 uppercase font-bold">⚠️ Low / Bradycardia</span>
              ) : (
                <span className="text-slate-400 uppercase">Normal Range (60 - 100 bpm)</span>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Presenting Conditions Multi-Select */}
        <div className="space-y-2.5" id="presenting-conditions-section">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Presenting Clinical Conditions</label>
          <div className="flex flex-wrap gap-2" id="conditions-multi-select-grid">
            {COMMON_CONDITIONS.map(condition => {
              const isSelected = selectedConditions.includes(condition);
              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleCondition(condition)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border-2 border-slate-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#0f172a] ${
                    isSelected 
                      ? 'bg-slate-900 text-white shadow-[2px_2px_0px_#34d399]' 
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
                  {condition}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Symptoms, Severity and Case Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="symptoms-severity-section">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Symptoms & Complaints</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe chief complaint, onset, and duration..."
              className="w-full border-2 border-slate-900 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 text-slate-700 bg-white shadow-[2px_2px_0px_#0f172a]"
              rows={4}
              required
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Urgency / Severity Level</label>
              <div className="grid grid-cols-3 gap-2" id="severity-selection">
                {(['Mild', 'Moderate', 'Severe'] as SeverityLevel[]).map(level => {
                  const isSel = severity === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSeverity(level)}
                      className={`py-2 rounded-xl text-xs font-bold border-2 border-slate-900 transition-all cursor-pointer shadow-[2px_2px_0px_#0f172a] ${
                        isSel 
                          ? level === 'Severe' 
                            ? 'bg-rose-100 text-rose-800 shadow-[2px_2px_0px_#e11d48]'
                            : level === 'Moderate'
                              ? 'bg-amber-100 text-amber-800 shadow-[2px_2px_0px_#d97706]'
                              : 'bg-emerald-100 text-emerald-800 shadow-[2px_2px_0px_#059669]'
                          : 'bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">First Aid & Clinic Treatment</label>
              <input
                type="text"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="e.g., Cold sponge, rest, dressing wound..."
                className="w-full py-2.5 px-3 border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-1 text-slate-700 shadow-[2px_2px_0px_#0f172a]"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Medication & Dispensing (Linked to Stock) */}
        <div className="border-2 border-slate-900 bg-slate-50 rounded-[2rem] p-5 space-y-4 shadow-[4px_4px_0px_#0f172a]" id="dispensing-block">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Dispense Sick Bay Medicine</label>
            <span className="text-[10px] bg-[#0f172a] text-white px-2 py-0.5 rounded-md font-bold border border-slate-900 uppercase">Auto-Stock Deducts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="medication-dispense-grid">
            <div className="space-y-1.5">
              <select
                value={dispenseMedId}
                onChange={(e) => setDispenseMedId(e.target.value)}
                className="w-full py-2 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none text-slate-700 font-bold"
              >
                <option value="">-- No Medication Dispensed --</option>
                {medications.map(med => (
                  <option key={med.id} value={med.id}>
                    {med.name} (Qty: {med.quantityOnHand} {med.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  value={dispenseQty}
                  onChange={(e) => setDispenseQty(e.target.value)}
                  placeholder="Qty"
                  className="w-full py-2 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none text-slate-700 font-bold"
                  disabled={!dispenseMedId}
                />
                {selectedMedObj && <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">{selectedMedObj.unit}</span>}
              </div>
            </div>
          </div>

          {/* Allergy warnings or stock error labels */}
          {allergyWarning && (
            <div className="bg-rose-100 border-2 border-slate-900 rounded-xl p-3.5 text-xs text-rose-800 font-bold flex items-start gap-2 animate-bounce">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{allergyWarning}</span>
            </div>
          )}

          {selectedMedObj && isOutOfStock && (
            <div className="bg-red-100 border-2 border-slate-900 rounded-xl p-3 text-xs text-red-800 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>OUT OF STOCK: Cannot dispense this medication. Please reorder stock.</span>
            </div>
          )}

          {selectedMedObj && isExceeded && !isOutOfStock && (
            <div className="bg-amber-100 border-2 border-slate-900 rounded-xl p-3 text-xs text-amber-800 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>EXCEEDS AVAILABLE STOCK: Available: {selectedMedObj.quantityOnHand} {selectedMedObj.unit}.</span>
            </div>
          )}
        </div>

        {/* Step 6: Disposition Outcome */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="disposition-section">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Disposition / Outcome</label>
            <select
              value={disposition}
              onChange={(e) => setDisposition(e.target.value as Disposition)}
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none text-slate-700 font-bold shadow-[2px_2px_0px_#0f172a]"
            >
              <option value="Back to Class">Back to Class / Work</option>
              <option value="Observe in Sick Bay">Observe in Sick Bay Bed</option>
              <option value="Sent Home">Sent Home</option>
              <option value="Referral to Hospital">Referral to Hospital</option>
            </select>
          </div>

          {/* Conditional Disposition Fields */}
          {disposition === 'Observe in Sick Bay' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Bed Number Selection</label>
              <select
                value={bedNo}
                onChange={(e) => setBedNo(e.target.value)}
                className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none text-slate-700 font-bold shadow-[2px_2px_0px_#0f172a]"
              >
                <option value="Bed A">Bed A (Observation Row)</option>
                <option value="Bed B">Bed B (Observation Row)</option>
                <option value="Bed C">Bed C (Emergency/Observation)</option>
                <option value="Bed D">Bed D (Isolation Bed)</option>
              </select>
            </div>
          )}

          {disposition === 'Referral to Hospital' && (
            <div className="space-y-4 col-span-1 md:col-span-2 bg-rose-50 border-2 border-slate-900 p-4 rounded-2xl animate-fadeIn shadow-[4px_4px_0px_#e11d48]">
              <h4 className="text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Hospital Referral Protocol Required
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Target Hospital / Specialist</label>
                  <input
                    type="text"
                    value={referralHospital}
                    onChange={(e) => setReferralHospital(e.target.value)}
                    placeholder="e.g. Ridge Municipal Hospital"
                    className="w-full py-2 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none text-slate-700 font-bold"
                    required={disposition === 'Referral to Hospital'}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Primary Reason for Referral</label>
                  <input
                    type="text"
                    value={referralReason}
                    onChange={(e) => setReferralReason(e.target.value)}
                    placeholder="e.g. Suspected acute surgical appendicitis"
                    className="w-full py-2 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none text-slate-700 font-bold"
                    required={disposition === 'Referral to Hospital'}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Case Notes & Nurse Officer Signature */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="clinical-notes-section">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Clinical Case Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record clinical summary, patient condition, hydration or advice given..."
              className="w-full border-2 border-slate-900 rounded-xl p-3 text-sm focus:outline-none text-slate-700 bg-white shadow-[2px_2px_0px_#0f172a]"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Attending Practitioner Signature</label>
            <select
              value={treatedBy}
              onChange={(e) => setTreatedBy(e.target.value)}
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none text-slate-700 font-bold shadow-[2px_2px_0px_#0f172a]"
            >
              <option value="Nurse T. Asante">Mrs. Theresa Asante (School Nurse)</option>
              <option value="Nurse P. Fleischer-Djoleto">Mr. Peter Fleischer-Djoleto (Nurse Officer)</option>
              <option value="ICT Administrator">ICT Administrator (System Audit Override)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t-2 border-slate-100" id="logger-action-footer">
          <button
            type="button"
            onClick={onCancel}
            className="bento-btn bg-white border-2 border-slate-900 text-slate-700 shadow-[3px_3px_0px_#0f172a] hover:bg-slate-50 font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedPatient || isOutOfStock || isExceeded}
            className={`bento-btn text-sm flex items-center gap-2 cursor-pointer ${
              !selectedPatient || isOutOfStock || isExceeded
                ? 'bg-slate-200 border-2 border-slate-400 text-slate-400 shadow-none cursor-not-allowed'
                : 'bento-btn-emerald shadow-[3px_3px_0px_#0f172a]'
            }`}
          >
            <Send className="w-4 h-4" /> Save Clinical Encounter
          </button>
        </div>
      </form>
    </div>
  );
}
