import React, { useState } from 'react';
import { Patient, Visit } from '../types';
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
import {
  X,
  Thermometer,
  Heart,
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock,
  Calendar,
  User,
  ActivitySquare
} from 'lucide-react';

interface VitalsTrendViewProps {
  patient: Patient;
  visits: Visit[];
  onClose: () => void;
}

export default function VitalsTrendView({
  patient,
  visits,
  onClose
}: VitalsTrendViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'temp' | 'bp' | 'pulse'>('all');

  // Filter and sort visits for this specific patient chronologically
  const patientVisits = visits
    .filter(v => v.patientId === patient.id)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  // Parse vital signs into structured chart data
  const chartData = patientVisits.map(v => {
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

  // Latest encounter details
  const latestVisit = patientVisits[patientVisits.length - 1];

  // Helper values for warnings based on latest vitals
  const latestTemp = latestVisit ? latestVisit.temperature : 37.0;
  const isHighFever = latestTemp >= 37.8;
  const isLowTemp = latestTemp < 35.5;

  let latestSys = 120;
  let latestDia = 80;
  if (latestVisit && latestVisit.bloodPressure && latestVisit.bloodPressure.includes('/')) {
    const parts = latestVisit.bloodPressure.split('/');
    const sys = parseInt(parts[0], 10);
    const dia = parseInt(parts[1], 10);
    if (!isNaN(sys)) latestSys = sys;
    if (!isNaN(dia)) latestDia = dia;
  }
  const isHighBP = latestSys >= 130 || latestDia >= 80;
  const isLowBP = latestSys < 90 || latestDia < 60;

  const latestPulse = latestVisit ? latestVisit.pulseRate : 72;
  const isHighPulse = latestPulse > 100;
  const isLowPulse = latestPulse < 60;

  return (
    <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_rgba(15,23,42,1)] space-y-6 animate-fadeIn" id={`vitals-trend-container-${patient.id}`}>
      {/* Header section */}
      <div className="flex items-start justify-between border-b-2 border-slate-100 pb-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 font-mono uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-300">ID: {patient.id}</span>
            <span className={`bento-badge border-2 border-slate-900 shadow-[1px_1px_0px_rgba(15,23,42,1)] uppercase tracking-wider text-[9px] font-black ${
              patient.type === 'Student' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {patient.type}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase italic font-display text-slate-900 flex items-center gap-2">
            <ActivitySquare className="w-6 h-6 text-indigo-600" /> Vitals & Clinical History: {patient.name}
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase">{patient.gender} • {patient.age} yrs • {patient.classOrDept}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-900 rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_rgba(15,23,42,1)]"
          aria-label="Close trends panel"
          id="close-vitals-btn"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Profile Medical Warnings Alert Banner */}
      {(patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
        <div className="bg-amber-50 border-2 border-slate-900 p-4 rounded-2xl shadow-[3px_3px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between" id="patient-allergies-alert">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-black text-amber-800 uppercase block tracking-wider">Permanent Health Cautions</span>
              <div className="text-xs font-bold text-amber-950 space-y-0.5">
                {patient.chronicConditions.length > 0 && <p>• Chronic: {patient.chronicConditions.join(', ')}</p>}
                {patient.allergies.length > 0 && <p>• Allergy Warnings: {patient.allergies.join(', ')}</p>}
              </div>
            </div>
          </div>
          <div className="text-[11px] font-bold bg-white text-slate-700 px-3 py-1.5 rounded-xl border border-slate-300 shadow-[1px_1px_0px_rgba(15,23,42,1)] self-end md:self-auto uppercase">
            Emergency Contacts: {patient.emergencyContactName} ({patient.emergencyContactPhone})
          </div>
        </div>
      )}

      {patientVisits.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-3xl" id="no-history-panel">
          <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">No Encounter History Yet</h3>
          <p className="text-xs text-slate-400 font-semibold uppercase mt-1 max-w-sm mx-auto">
            This student has not checked into the sick bay during this auditing period. Start logging visits to compile their medical trend charts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="clinical-history-grid">
          
          {/* Vitals Summary Cards / Latest State (1 column) */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="font-black text-slate-950 text-sm uppercase italic tracking-wider flex items-center gap-1.5 pb-2 border-b-2 border-slate-100">
              <Clock className="w-4 h-4 text-slate-500" /> Latest Logged Vitals
            </h3>
            
            {/* Temperature card */}
            <div className={`border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_rgba(15,23,42,1)] flex items-center justify-between ${
              isHighFever ? 'bg-rose-50' : isLowTemp ? 'bg-blue-50' : 'bg-white'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border border-slate-900 ${
                  isHighFever ? 'bg-rose-200 text-rose-800' : isLowTemp ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Temperature</span>
                  <span className="text-lg font-black text-slate-900">{latestTemp} °C</span>
                </div>
              </div>
              <div className="text-right">
                {isHighFever ? (
                  <span className="text-[9px] font-black bg-rose-200 text-rose-800 px-2 py-0.5 rounded-md border border-rose-400 uppercase">Fever</span>
                ) : isLowTemp ? (
                  <span className="text-[9px] font-black bg-blue-200 text-blue-800 px-2 py-0.5 rounded-md border border-blue-400 uppercase">Hypothermia</span>
                ) : (
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-400 uppercase">Normal</span>
                )}
              </div>
            </div>

            {/* Blood Pressure card */}
            <div className={`border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_rgba(15,23,42,1)] flex items-center justify-between ${
              isHighBP ? 'bg-amber-50' : isLowBP ? 'bg-blue-50' : 'bg-white'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border border-slate-900 ${
                  isHighBP ? 'bg-amber-200 text-amber-800' : isLowBP ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Blood Pressure</span>
                  <span className="text-lg font-black text-slate-900">{latestVisit?.bloodPressure || 'N/A'}</span>
                </div>
              </div>
              <div className="text-right">
                {isHighBP ? (
                  <span className="text-[9px] font-black bg-amber-200 text-amber-800 px-2 py-0.5 rounded-md border border-amber-400 uppercase">Elevated</span>
                ) : isLowBP ? (
                  <span className="text-[9px] font-black bg-blue-200 text-blue-800 px-2 py-0.5 rounded-md border border-blue-400 uppercase">Low</span>
                ) : (
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-400 uppercase">Normal</span>
                )}
              </div>
            </div>

            {/* Pulse Rate card */}
            <div className={`border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_rgba(15,23,42,1)] flex items-center justify-between ${
              isHighPulse ? 'bg-orange-50' : isLowPulse ? 'bg-blue-50' : 'bg-white'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border border-slate-900 ${
                  isHighPulse ? 'bg-orange-200 text-orange-800' : isLowPulse ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pulse Rate</span>
                  <span className="text-lg font-black text-slate-900">{latestPulse} bpm</span>
                </div>
              </div>
              <div className="text-right">
                {isHighPulse ? (
                  <span className="text-[9px] font-black bg-orange-200 text-orange-800 px-2 py-0.5 rounded-md border border-orange-400 uppercase">High</span>
                ) : isLowPulse ? (
                  <span className="text-[9px] font-black bg-blue-200 text-blue-800 px-2 py-0.5 rounded-md border border-blue-400 uppercase">Bradycardia</span>
                ) : (
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-400 uppercase">Normal</span>
                )}
              </div>
            </div>

            {/* Past visits sidebar */}
            <div className="space-y-2 mt-4">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Timeline History</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {patientVisits.slice().reverse().map(v => (
                  <div key={v.id} className="bg-slate-50 hover:bg-slate-100 transition-colors border-2 border-slate-900 rounded-xl p-3 flex justify-between items-center text-xs shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="font-black text-slate-700">{new Date(v.dateTime).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold">{v.presentingConditions.join(', ')}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-full border border-slate-900 ${
                      v.severity === 'Severe' ? 'bg-rose-100 text-rose-700' :
                      v.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {v.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recharts Graphical Trends (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
              <h3 className="font-black text-slate-950 text-sm uppercase italic tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-slate-500" /> Longitudinal Clinical Trends
              </h3>

              {/* Graphical tabs */}
              <div className="flex bg-slate-100 border-2 border-slate-900 p-0.5 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_rgba(15,23,42,1)]">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${activeTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('temp')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${activeTab === 'temp' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Temp
                </button>
                <button
                  onClick={() => setActiveTab('bp')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${activeTab === 'bp' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  BP
                </button>
                <button
                  onClick={() => setActiveTab('pulse')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${activeTab === 'pulse' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Pulse
                </button>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 md:p-6 shadow-[4px_4px_0px_rgba(15,23,42,1)]" id="recharts-visualisation-canvas">
              {chartData.length === 1 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-full font-black uppercase">Single Logged Visit</span>
                  <p className="text-xs text-slate-400 font-bold uppercase max-w-sm">
                    A trend line requires at least two points to establish progression. Showing latest baseline values: Temp: {latestTemp}°C, BP: {latestVisit?.bloodPressure}, Pulse: {latestPulse} bpm.
                  </p>
                </div>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
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
                          activeTab === 'temp' ? [34, 42] :
                          activeTab === 'pulse' ? [40, 140] :
                          activeTab === 'bp' ? [50, 180] :
                          ['auto', 'auto']
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '2px solid #0f172a',
                          borderRadius: '12px',
                          boxShadow: '2.5px 2.5px 0px rgba(15,23,42,1)',
                          fontSize: '11px',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 'bold',
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          fontFamily: 'Inter, sans-serif',
                          paddingTop: '10px'
                        }}
                      />

                      {/* Line configuration depending on active tab selection */}
                      {(activeTab === 'all' || activeTab === 'temp') && (
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          name="Temperature (°C)"
                          stroke="#ef4444"
                          strokeWidth={3}
                          activeDot={{ r: 6, strokeWidth: 1 }}
                          dot={{ strokeWidth: 2, r: 4 }}
                        />
                      )}

                      {(activeTab === 'all' || activeTab === 'bp') && (
                        <Line
                          type="monotone"
                          dataKey="systolic"
                          name="Systolic BP"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          activeDot={{ r: 6, strokeWidth: 1 }}
                          dot={{ strokeWidth: 2, r: 4 }}
                        />
                      )}

                      {(activeTab === 'all' || activeTab === 'bp') && (
                        <Line
                          type="monotone"
                          dataKey="diastolic"
                          name="Diastolic BP"
                          stroke="#60a5fa"
                          strokeWidth={2.5}
                          strokeDasharray="4 4"
                          activeDot={{ r: 5 }}
                          dot={{ strokeWidth: 2, r: 3 }}
                        />
                      )}

                      {(activeTab === 'all' || activeTab === 'pulse') && (
                        <Line
                          type="monotone"
                          dataKey="pulseRate"
                          name="Pulse Rate (BPM)"
                          stroke="#f97316"
                          strokeWidth={2.5}
                          activeDot={{ r: 6, strokeWidth: 1 }}
                          dot={{ strokeWidth: 2, r: 4 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 font-bold leading-relaxed">
                <strong>Vitals Guidance:</strong> High temperatures (≥37.8°C) represent localized infection risks. High blood pressure (systolic ≥130 mmHg) requires rest and secondary stress assessment. Normal heart rate spans 60 - 100 beats per minute.
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
