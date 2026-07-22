import React, { useState, useMemo } from 'react';
import { Patient, Visit } from '../types';
import { jsPDF } from 'jspdf';
import {
  X,
  Thermometer,
  Heart,
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock,
  Calendar,
  Search,
  Filter,
  Check,
  FileText,
  User,
  Printer,
  Download,
  Stethoscope,
  ClipboardList,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface PatientHistoryModalProps {
  patient: Patient;
  visits: Visit[];
  onClose: () => void;
}

export default function PatientHistoryModal({
  patient,
  visits,
  onClose
}: PatientHistoryModalProps) {
  // Tabs for vitals chart
  const [activeChartTab, setActiveChartTab] = useState<'all' | 'temp' | 'bp' | 'pulse'>('all');
  
  // History Filters
  const [historySearch, setHistorySearch] = useState('');
  const [historySeverity, setHistorySeverity] = useState<'All' | 'Mild' | 'Moderate' | 'Severe'>('All');
  const [historyDisposition, setHistoryDisposition] = useState<'All' | 'Back to Class' | 'Observe in Sick Bay' | 'Sent Home' | 'Referral to Hospital'>('All');
  
  // State to track which visit card is expanded for notes/treatment
  const [expandedVisitId, setExpandedVisitId] = useState<string | null>(null);

  // Filter and sort visits for this specific patient chronologically
  const patientVisits = useMemo(() => {
    return visits
      .filter(v => v.patientId === patient.id)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()); // Newest first for list view
  }, [visits, patient.id]);

  // Vitals sorted chronologically (oldest to newest) for chart plotting
  const chronologicalVisits = useMemo(() => {
    return [...patientVisits].reverse();
  }, [patientVisits]);

  // Parse vital signs into structured chart data
  const chartData = useMemo(() => {
    return chronologicalVisits.map(v => {
      const dateObj = new Date(v.dateTime);
      const dateLabel = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
      const fullDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Parse Blood Pressure
      let systolic = 120;
      let diastolic = 80;
      if (v.bloodPressure && v.bloodPressure.includes('/')) {
        const parts = v.bloodPressure.split('/');
        const sys = parseInt(parts[0], 10);
        const dia = parseInt(parts[1], 10);
        if (!isNaN(sys)) systolic = sys;
        if (!isNaN(dia)) diastolic = dia;
      }

      return {
        id: v.id,
        date: dateLabel,
        fullDate,
        temperature: v.temperature,
        pulseRate: v.pulseRate,
        systolic,
        diastolic,
        bloodPressure: v.bloodPressure,
        treatment: v.treatment,
        severity: v.severity
      };
    });
  }, [chronologicalVisits]);

  // Consolidated Baseline Medical Analytics
  const vitalsSummary = useMemo(() => {
    if (patientVisits.length === 0) return null;

    let totalTemp = 0;
    let maxTemp = 0;
    let minTemp = 100;
    
    let totalPulse = 0;
    let maxPulse = 0;
    let minPulse = 500;

    let sysValues: number[] = [];
    let diaValues: number[] = [];

    patientVisits.forEach(v => {
      totalTemp += v.temperature;
      if (v.temperature > maxTemp) maxTemp = v.temperature;
      if (v.temperature < minTemp) minTemp = v.temperature;

      totalPulse += v.pulseRate;
      if (v.pulseRate > maxPulse) maxPulse = v.pulseRate;
      if (v.pulseRate < minPulse) minPulse = v.pulseRate;

      if (v.bloodPressure && v.bloodPressure.includes('/')) {
        const parts = v.bloodPressure.split('/');
        const sys = parseInt(parts[0], 10);
        const dia = parseInt(parts[1], 10);
        if (!isNaN(sys)) sysValues.push(sys);
        if (!isNaN(dia)) diaValues.push(dia);
      }
    });

    const avgTemp = (totalTemp / patientVisits.length).toFixed(1);
    const avgPulse = Math.round(totalPulse / patientVisits.length);

    const minSys = sysValues.length > 0 ? Math.min(...sysValues) : 120;
    const maxSys = sysValues.length > 0 ? Math.max(...sysValues) : 120;
    const minDia = diaValues.length > 0 ? Math.min(...diaValues) : 80;
    const maxDia = diaValues.length > 0 ? Math.max(...diaValues) : 80;

    return {
      avgTemp,
      maxTemp,
      minTemp,
      avgPulse,
      maxPulse,
      minPulse,
      bpRange: sysValues.length > 0 ? `${minSys}/${minDia} - ${maxSys}/${maxDia}` : 'N/A'
    };
  }, [patientVisits]);

  // Filtering list history
  const filteredVisits = useMemo(() => {
    return patientVisits.filter(v => {
      const matchesSearch = 
        v.symptoms.toLowerCase().includes(historySearch.toLowerCase()) ||
        v.treatment.toLowerCase().includes(historySearch.toLowerCase()) ||
        v.notes.toLowerCase().includes(historySearch.toLowerCase()) ||
        v.presentingConditions.some(c => c.toLowerCase().includes(historySearch.toLowerCase()));

      const matchesSeverity = historySeverity === 'All' || v.severity === historySeverity;
      const matchesDisposition = historyDisposition === 'All' || v.disposition === historyDisposition;

      return matchesSearch && matchesSeverity && matchesDisposition;
    });
  }, [patientVisits, historySearch, historySeverity, historyDisposition]);

  // Generate a premium medical transcript for the student
  const handleExportTranscriptPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Formal header
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, pageWidth, 42, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TECHBRIDGE UNIVERSITY COLLEGE SICK BAY', 15, 18);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Oyibi, Ghana | Clinical Records Division', 15, 25);
    doc.text(`Doc Ref: TUC-MED-REC-${patient.id}`, pageWidth - 70, 25);

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('OFFICIAL PATIENT MEDICAL HISTORY SUMMARY', 15, 54);

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.line(15, 58, pageWidth - 15, 58);

    // Demographics Block
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('PATIENT DEMOGRAPHICS', 15, 67);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    
    doc.text(`Full Name: ${patient.name}`, 15, 74);
    doc.text(`Admission ID: ${patient.id}`, 15, 80);
    doc.text(`Classification: ${patient.type}`, 15, 86);
    doc.text(`Gender / Age: ${patient.gender} / ${patient.age} years`, 15, 92);

    doc.text(`Grade / Class / Dept: ${patient.classOrDept}`, 105, 74);
    doc.text(`Emergency Guardian: ${patient.emergencyContactName}`, 105, 80);
    doc.text(`Emergency Phone: ${patient.emergencyContactPhone}`, 105, 86);
    doc.text(`Record Audited: ${new Date().toLocaleDateString()}`, 105, 92);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 97, pageWidth - 15, 97);

    // Cautions & Alerts Block
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('CLINICAL ALERTS & PERMANENT CAUTIONS', 15, 105);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const allergiesText = patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None Reported';
    const chronicText = patient.chronicConditions.length > 0 ? patient.chronicConditions.join(', ') : 'None Reported';
    doc.text(`• Permanent Chronic Conditions: ${chronicText}`, 15, 112);
    doc.text(`• Known Drug & Food Allergies: ${allergiesText}`, 15, 118);

    doc.line(15, 123, pageWidth - 15, 123);

    // Vitals Consolidation
    doc.setFont('Helvetica', 'bold');
    doc.text('LONGITUDINAL BASELINE VITALS ANALYTICS', 15, 131);
    
    doc.setFont('Helvetica', 'normal');
    if (vitalsSummary) {
      doc.text(`• Cumulative Visits: ${patientVisits.length} encounters`, 15, 138);
      doc.text(`• Average Vital Temp: ${vitalsSummary.avgTemp} °C (Min: ${vitalsSummary.minTemp}°C / Max: ${vitalsSummary.maxTemp}°C)`, 15, 144);
      doc.text(`• Blood Pressure Range: ${vitalsSummary.bpRange} mmHg`, 15, 150);
      doc.text(`• Average Heart Rate: ${vitalsSummary.avgPulse} bpm (Min: ${vitalsSummary.minPulse} bpm / Max: ${vitalsSummary.maxPulse} bpm)`, 15, 156);
    } else {
      doc.text('• No baselines available (0 visits logged).', 15, 138);
    }

    doc.line(15, 162, pageWidth - 15, 162);

    // Section: Encounters Timeline
    doc.setFont('Helvetica', 'bold');
    doc.text('CHRONOLOGICAL CLINIC VISITS LEDGER', 15, 170);

    let startY = 177;
    doc.setFont('Helvetica', 'normal');

    if (patientVisits.length === 0) {
      doc.text('No logged consultation encounters on file for this patient.', 15, startY);
    } else {
      patientVisits.forEach((v, index) => {
        // Prevent going off page
        if (startY + 35 > pageHeight - 20) {
          doc.addPage();
          // Redraw slim header
          doc.setFillColor(15, 23, 42);
          doc.rect(0, 0, pageWidth, 20, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(10);
          doc.text(`MEDICAL HISTORY TRANSCRIPT - ${patient.name.toUpperCase()}`, 15, 13);
          
          doc.setTextColor(100, 116, 139);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
          doc.line(15, 24, pageWidth - 15, 24);
          startY = 30;
        }

        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(8.5);
        const visitDate = new Date(v.dateTime).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        doc.text(`${index + 1}. Date: ${visitDate} | Severity: ${v.severity.toUpperCase()} | Disp: ${v.disposition}`, 15, startY);

        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(8);
        doc.text(`Vitals: Temp: ${v.temperature}°C, BP: ${v.bloodPressure}, Pulse: ${v.pulseRate} bpm | Logged by: Nurse ${v.treatedBy}`, 20, startY + 5);

        doc.setTextColor(51, 65, 85);
        const conds = `Presenting Conditions: ${v.presentingConditions.join(', ')} | Symptoms: ${v.symptoms}`;
        const treatmentStr = `Action / Treatment: ${v.treatment}`;
        const notesStr = `Clinical Notes: ${v.notes}`;

        const splitConds = doc.splitTextToSize(conds, pageWidth - 35);
        const splitTreatment = doc.splitTextToSize(treatmentStr, pageWidth - 35);
        const splitNotes = doc.splitTextToSize(notesStr, pageWidth - 35);

        doc.text(splitConds, 20, startY + 10);
        
        let localOffset = 10 + (splitConds.length * 4);
        doc.text(splitTreatment, 20, startY + localOffset);
        
        localOffset += (splitTreatment.length * 4);
        doc.text(splitNotes, 20, startY + localOffset);

        localOffset += (splitNotes.length * 4) + 2;

        // Divider between visits
        doc.setDrawColor(241, 245, 249);
        doc.line(20, startY + localOffset, pageWidth - 20, startY + localOffset);

        startY += localOffset + 4;
      });
    }

    // Print signature block on bottom of last page
    if (startY + 25 > pageHeight - 15) {
      doc.addPage();
      startY = 30;
    }

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);

    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('The details contained in this official school health file are confidential. Authorized school staff only.', 15, pageHeight - 20);
    doc.text('Certified by Head of ICT, Techbridge University College.', 15, pageHeight - 15);
    
    doc.save(`TUC_PATIENT_MEDICAL_HISTORY_${patient.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn" id="patient-medical-history-modal-overlay">
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        className="bg-white border-4 border-slate-900 rounded-[2.5rem] w-full max-w-6xl h-[90vh] shadow-[10px_10px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col relative"
        id="patient-history-modal-container"
      >
        {/* Header Block */}
        <div className="bg-slate-900 text-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-slate-900 shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black text-slate-300 font-mono uppercase bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                ID: {patient.id}
              </span>
              <span className={`bento-badge border border-slate-700 uppercase tracking-wider text-[9px] font-black ${
                patient.type === 'Student' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {patient.type}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase italic font-display text-white flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-indigo-400" /> Patient Medical File: {patient.name}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {patient.gender} • {patient.age} yrs • {patient.classOrDept}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportTranscriptPDF}
              className="bg-emerald-500 text-slate-950 font-black text-xs uppercase px-4 py-2.5 rounded-xl border-2 border-slate-800 shadow-[2px_2px_0px_rgba(15,23,42,1)] hover:bg-emerald-400 cursor-pointer flex items-center gap-1.5 transition-all active:translate-y-0.5"
              type="button"
            >
              <Download className="w-4 h-4" /> Export Ledger PDF
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border-2 border-slate-700 rounded-xl transition-all cursor-pointer"
              aria-label="Close medical history modal"
              id="close-history-modal-btn"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Cautions Alert Row (Shrinkable) */}
        {(patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
          <div className="bg-amber-50 border-b-2 border-slate-900 px-6 py-3.5 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between shrink-0">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block">Critical Health Alerts</span>
                <div className="text-xs font-bold text-amber-950 flex flex-wrap gap-x-4">
                  {patient.chronicConditions.length > 0 && <span>Chronic: <strong className="underline">{patient.chronicConditions.join(', ')}</strong></span>}
                  {patient.allergies.length > 0 && <span>Allergies: <strong className="underline">{patient.allergies.join(', ')}</strong></span>}
                </div>
              </div>
            </div>
            <div className="text-[10px] font-black bg-white text-slate-700 px-3 py-1.5 rounded-xl border border-slate-300 shadow-[1px_1px_0px_rgba(15,23,42,1)] uppercase">
              Emergency Contact: {patient.emergencyContactName} ({patient.emergencyContactPhone})
            </div>
          </div>
        )}

        {/* Scrollable Main Content Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50/50">
          
          {/* Top Panel: Analytics Vitals summary & Charts (Side-by-side or stacked) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Consolidated Vital Metrics Statistics (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b-2 border-slate-200">
                <Clock className="w-4 h-4 text-indigo-600" /> Vitals Baselines (Audited Over Time)
              </h3>

              {patientVisits.length === 0 ? (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-center text-slate-400 font-bold uppercase text-xs">
                  No vital baselines computed.
                </div>
              ) : vitalsSummary ? (
                <div className="grid grid-cols-1 gap-3">
                  {/* Avg Temp */}
                  <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[3px_3px_0px_rgba(15,23,42,1)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
                        <Thermometer className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Average Temperature</span>
                        <span className="text-base font-black text-slate-900">{vitalsSummary.avgTemp} °C</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-black bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded border border-rose-300 uppercase block">
                        Max: {vitalsSummary.maxTemp}°C
                      </span>
                    </div>
                  </div>

                  {/* BP Range */}
                  <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[3px_3px_0px_rgba(15,23,42,1)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Blood Pressure Range</span>
                        <span className="text-base font-black text-slate-900">{vitalsSummary.bpRange}</span>
                      </div>
                    </div>
                  </div>

                  {/* Avg Pulse Rate */}
                  <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[3px_3px_0px_rgba(15,23,42,1)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Avg Heart Rate</span>
                        <span className="text-base font-black text-slate-900">{vitalsSummary.avgPulse} bpm</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-black bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-300 uppercase block">
                        Max: {vitalsSummary.maxPulse}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Quick Summary Notice */}
              <div className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-xl text-[10.5px] font-bold text-indigo-900 leading-relaxed uppercase">
                🚩 <strong>Roster Notice:</strong> Patient health files sync dynamically with clinical triage charts. Every vital entry logged automatically appends to this ledger and triggers instant allergen safety warnings.
              </div>
            </div>

            {/* Right Column: Longitudinal Recharts Graphical Trends (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-100 pb-2">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> Longitudinal Clinical Vitals Charts
                </h3>

                {/* Chart Segment Control Tabs */}
                <div className="flex bg-slate-100 border-2 border-slate-900 p-0.5 rounded-xl text-[10px] font-black shadow-[1.5px_1.5px_0px_rgba(15,23,42,1)]">
                  {(['all', 'temp', 'bp', 'pulse'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveChartTab(tab)}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer uppercase ${activeChartTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Display Panel */}
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_rgba(15,23,42,1)]">
                {patientVisits.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
                    <TrendingUp className="w-10 h-10 text-slate-300 animate-bounce" />
                    <span className="text-xs text-slate-400 font-bold uppercase">No Visit Chart Data Compiled</span>
                  </div>
                ) : chartData.length === 1 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-4 space-y-2">
                    <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full font-black uppercase">
                      Baseline Registered
                    </span>
                    <p className="text-xs text-slate-400 font-bold uppercase max-w-sm">
                      longitudinal charts require at least two historic visits to plot progression. Baseline Temp is {patientVisits[0].temperature}°C, BP: {patientVisits[0].bloodPressure}, Pulse: {patientVisits[0].pulseRate} bpm.
                    </p>
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="date"
                          tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                          stroke="#0f172a"
                          strokeWidth={1.5}
                        />
                        <YAxis
                          tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                          stroke="#0f172a"
                          strokeWidth={1.5}
                          domain={
                            activeChartTab === 'temp' ? [34, 42] :
                            activeChartTab === 'pulse' ? [40, 140] :
                            activeChartTab === 'bp' ? [50, 180] :
                            ['auto', 'auto']
                          }
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #0f172a',
                            borderRadius: '12px',
                            boxShadow: '3px 3px 0px rgba(15,23,42,1)',
                            fontSize: '11px',
                            fontWeight: 'bold',
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            fontSize: '9px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            paddingTop: '10px'
                          }}
                        />

                        {/* Temp Line */}
                        {(activeChartTab === 'all' || activeChartTab === 'temp') && (
                          <Line
                            type="monotone"
                            dataKey="temperature"
                            name="Temperature (°C)"
                            stroke="#f43f5e"
                            strokeWidth={3}
                            activeDot={{ r: 6 }}
                            dot={{ strokeWidth: 2, r: 4 }}
                          />
                        )}

                        {/* BP Lines */}
                        {(activeChartTab === 'all' || activeChartTab === 'bp') && (
                          <Line
                            type="monotone"
                            dataKey="systolic"
                            name="Systolic BP"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            activeDot={{ r: 6 }}
                            dot={{ strokeWidth: 2, r: 4 }}
                          />
                        )}
                        {(activeChartTab === 'all' || activeChartTab === 'bp') && (
                          <Line
                            type="monotone"
                            dataKey="diastolic"
                            name="Diastolic BP"
                            stroke="#60a5fa"
                            strokeWidth={2}
                            strokeDasharray="3 3"
                            dot={{ strokeWidth: 2, r: 3 }}
                          />
                        )}

                        {/* Pulse Rate Line */}
                        {(activeChartTab === 'all' || activeChartTab === 'pulse') && (
                          <Line
                            type="monotone"
                            dataKey="pulseRate"
                            name="Pulse (BPM)"
                            stroke="#f97316"
                            strokeWidth={2.5}
                            activeDot={{ r: 6 }}
                            dot={{ strokeWidth: 2, r: 4 }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Panel: Interactive Visit History timelines (Full list with nested details) */}
          <div className="space-y-4" id="patient-history-ledger-block">
            
            {/* Ledger header with advanced filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-slate-200 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-black text-slate-900 text-sm uppercase italic font-display flex items-center gap-1.5">
                  <ClipboardList className="w-5 h-5 text-indigo-600" /> Historic Clinical Visits Ledger
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Audit and search student encounter logs, treatments, nursing actions, and clinical dispositions.
                </p>
              </div>

              {/* History Filtering Bar */}
              <div className="flex flex-wrap gap-2 items-center">
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search symptoms, drugs, notes..."
                    className="pl-8 pr-3 py-1.5 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold placeholder-slate-400 text-slate-700 focus:outline-none w-52"
                  />
                </div>

                {/* Severity select */}
                <select
                  value={historySeverity}
                  onChange={(e) => setHistorySeverity(e.target.value as any)}
                  className="bg-white border-2 border-slate-900 py-1.5 px-2.5 rounded-xl text-xs font-black text-slate-700 cursor-pointer"
                >
                  <option value="All">All Severity</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>

                {/* Disposition select */}
                <select
                  value={historyDisposition}
                  onChange={(e) => setHistoryDisposition(e.target.value as any)}
                  className="bg-white border-2 border-slate-900 py-1.5 px-2.5 rounded-xl text-xs font-black text-slate-700 cursor-pointer max-w-[150px] sm:max-w-xs"
                >
                  <option value="All">All Dispositions</option>
                  <option value="Back to Class">Back to Class</option>
                  <option value="Observe in Sick Bay">Observe Bed</option>
                  <option value="Sent Home">Sent Home</option>
                  <option value="Referral to Hospital">Hospital Ref</option>
                </select>
              </div>
            </div>

            {/* Timelines Cards stack */}
            <div className="space-y-3">
              {filteredVisits.length === 0 ? (
                <div className="border-2 border-dashed border-slate-300 rounded-2xl py-12 text-center text-slate-400 font-bold uppercase text-xs">
                  {patientVisits.length === 0 
                    ? 'No consultation visits recorded for this student.' 
                    : 'No visits match the search filters.'}
                </div>
              ) : (
                filteredVisits.map((v, idx) => {
                  const isExpanded = expandedVisitId === v.id;
                  const dateObj = new Date(v.dateTime);
                  const formattedDate = dateObj.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });
                  const formattedTime = dateObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={v.id}
                      className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden transition-all duration-150 shadow-[3px_3px_0px_rgba(15,23,42,1)]"
                    >
                      {/* Accordion Row Trigger */}
                      <button
                        type="button"
                        onClick={() => setExpandedVisitId(isExpanded ? null : v.id)}
                        className="w-full text-left p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                      >
                        {/* Date / Time */}
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 border border-slate-200 p-2 rounded-xl text-center font-black text-slate-700 shrink-0 min-w-[55px]">
                            <span className="text-[10px] uppercase block leading-none font-sans text-slate-400">Visit {filteredVisits.length - idx}</span>
                            <span className="text-sm block mt-0.5">{formattedDate.split(' ')[0]}</span>
                            <span className="text-[9px] uppercase font-bold text-indigo-600 block">{formattedDate.split(' ')[1]}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900 uppercase">Consultation</span>
                              <span className={`bento-badge text-[8px] font-black uppercase border border-slate-900 shadow-[1px_1px_0px_#000] px-1.5 py-0.5 ${
                                v.severity === 'Severe' ? 'bg-rose-100 text-rose-800' :
                                v.severity === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                                'bg-emerald-100 text-emerald-800'
                              }`}>
                                {v.severity}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-500 font-mono mt-0.5">Time: {formattedTime} • Nurse: {v.treatedBy}</p>
                          </div>
                        </div>

                        {/* Conditions List */}
                        <div className="flex-1 flex flex-wrap gap-1 md:px-4">
                          {v.presentingConditions.map(cond => (
                            <span key={cond} className="text-[10px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                              {cond}
                            </span>
                          ))}
                        </div>

                        {/* Status / Disposition Trigger arrow */}
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <div className="text-right">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Disposition</span>
                            <span className="text-xs font-black text-slate-800 uppercase">{v.disposition}</span>
                          </div>
                          <div className="p-1 border border-slate-200 rounded-lg text-slate-500 bg-slate-50">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </button>

                      {/* Expanded Section Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t-2 border-slate-100 bg-slate-50/50 p-4 md:p-6 space-y-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              
                              {/* Vitals in visit */}
                              <div className="bg-white border border-slate-200 p-3.5 rounded-xl space-y-2">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                  <Thermometer className="w-3.5 h-3.5 text-slate-400" /> Triage Vitals Captured
                                </h5>
                                <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-bold">
                                  <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                                    <span className="text-[8px] text-slate-400 font-black uppercase block">Temp</span>
                                    <span className="text-slate-800">{v.temperature}°C</span>
                                  </div>
                                  <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                                    <span className="text-[8px] text-slate-400 font-black uppercase block">BP</span>
                                    <span className="text-slate-800 text-[10px]">{v.bloodPressure}</span>
                                  </div>
                                  <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                                    <span className="text-[8px] text-slate-400 font-black uppercase block">Pulse</span>
                                    <span className="text-slate-800">{v.pulseRate} bpm</span>
                                  </div>
                                </div>
                              </div>

                              {/* Symptoms & presenting condition details */}
                              <div className="bg-white border border-slate-200 p-3.5 rounded-xl space-y-1 md:col-span-2">
                                <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">Symptoms Presented</h5>
                                <p className="text-xs font-bold text-slate-800">
                                  {v.symptoms || 'No specific individual symptoms listed other than baseline.'}
                                </p>
                              </div>

                            </div>

                            {/* Treatment & Care Log */}
                            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1.5">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-500" /> Actions Taken & Medical Treatment Logs
                              </h5>
                              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                                {v.treatment}
                              </p>
                              
                              {/* Dispensed Medication details if any */}
                              {(v.medicationDispensedId && v.medicationDispensedQty) ? (
                                <div className="mt-2.5 pt-2 border-t border-dashed border-slate-100 flex items-center gap-2 text-xs">
                                  <span className="text-[9px] font-black bg-emerald-50 border border-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded uppercase font-mono">
                                    Disbursed Prescription
                                  </span>
                                  <span className="font-bold text-slate-600">
                                    Dispensed {v.medicationDispensedQty} unit(s) of Medication ID: <strong className="text-slate-800 font-black">{v.medicationDispensedId}</strong>
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            {/* Clinical Nurse Notes */}
                            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-indigo-500" /> Professional Nursing Comments / Ward Notes
                              </h5>
                              <p className="text-xs italic text-slate-600 leading-relaxed font-semibold bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                "{v.notes || 'No clinical remarks appended.'}"
                              </p>
                            </div>

                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

        {/* Modal Footer (Sticky) */}
        <div className="bg-slate-100 p-4 border-t-2 border-slate-900 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-slate-900 text-white font-black text-xs uppercase px-5 py-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#000] hover:bg-slate-800 cursor-pointer"
            type="button"
          >
            Close Patient Record
          </button>
        </div>

      </motion.div>
    </div>
  );
}
