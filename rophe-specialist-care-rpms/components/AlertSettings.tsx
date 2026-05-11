
import React from 'react';
import { AlertThresholds } from '../types';

interface AlertSettingsProps {
  thresholds: AlertThresholds;
  onUpdate: (newThresholds: AlertThresholds) => void;
}

const AlertSettings: React.FC<AlertSettingsProps> = ({ thresholds, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...thresholds,
      [name]: parseFloat(value) || 0
    });
  };

  const inputGroupClass = "space-y-2";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider";
  const inputClass = "w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-gray-900";

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gradient-to-br from-gray-50 to-white">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Clinical Safety Limits</h2>
          </div>
          <p className="text-gray-500 text-sm">Configure global thresholds for automated patient alerts. Crossing these limits will trigger real-time notifications for clinical staff.</p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Blood Pressure */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-emerald-800 border-b border-emerald-50 pb-2">Blood Pressure (BP)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={inputGroupClass}>
                <label className={labelClass}>Systolic Max</label>
                <input type="number" name="bpSystolicMax" value={thresholds.bpSystolicMax} onChange={handleChange} className={inputClass} />
              </div>
              <div className={inputGroupClass}>
                <label className={labelClass}>Diastolic Max</label>
                <input type="number" name="bpDiastolicMax" value={thresholds.bpDiastolicMax} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-emerald-800 border-b border-emerald-50 pb-2">Heart Rate (Pulse)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={inputGroupClass}>
                <label className={labelClass}>Min BPM</label>
                <input type="number" name="pulseMin" value={thresholds.pulseMin} onChange={handleChange} className={inputClass} />
              </div>
              <div className={inputGroupClass}>
                <label className={labelClass}>Max BPM</label>
                <input type="number" name="pulseMax" value={thresholds.pulseMax} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* SpO2 */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-emerald-800 border-b border-emerald-50 pb-2">Oxygen Saturation</h3>
            <div className={inputGroupClass}>
              <label className={labelClass}>Critical SpO2 (%)</label>
              <input type="number" name="spo2Min" value={thresholds.spo2Min} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-emerald-800 border-b border-emerald-50 pb-2">Body Temperature</h3>
            <div className={inputGroupClass}>
              <label className={labelClass}>Max Temp (°C)</label>
              <input type="number" step="0.1" name="tempMax" value={thresholds.tempMax} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-xs font-medium text-gray-400 italic">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Changes are applied immediately across all patient charts.</span>
          </div>
          <button 
            onClick={() => onUpdate({ bpSystolicMax: 140, bpDiastolicMax: 90, pulseMin: 60, pulseMax: 100, spo2Min: 94, tempMax: 38.0 })}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Reset to Clinical Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertSettings;
