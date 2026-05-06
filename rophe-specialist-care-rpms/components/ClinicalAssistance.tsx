import React, { useState } from 'react';
import { geminiService, ClinicalAnalysisResult } from '../services/geminiService';
import { Patient } from '../types';

interface ClinicalAssistanceProps {
  complaint: string;
  patient: Patient;
  addAuditLog?: (action: string, details: string) => void;
}

const ClinicalAssistance: React.FC<ClinicalAssistanceProps> = ({
  complaint,
  patient,
  addAuditLog
}) => {
  const [assistance, setAssistance] = useState<ClinicalAnalysisResult | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnonymizationDetails, setShowAnonymizationDetails] = useState(false);

  const handleGetAssistance = async () => {
    if (!complaint) return;
    setLoading(true);
    setError(null);
    try {
      const result = await geminiService.getClinicalAssistance(
        complaint,
        patient,
        addAuditLog
      );

      if (result) {
        setAssistance(result);
      } else {
        setError("AI Engine unavailable. Please verify API configuration.");
      }
    } catch (err: any) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!complaint) return;
    setSummarizing(true);
    try {
      const text = await geminiService.summarizeForPatient(complaint);
      setSummary(text || "No summary generated.");
    } catch (err) {
      setSummary("Error generating patient summary.");
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl transition-all duration-500 hover:shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600"></div>

      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-emerald-100 dark:bg-emerald-900/40 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping"></div>
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight">Rophe Intel Agent</h3>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clinical Mode</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Gemini 3 Pro</span>
                {assistance?.anonymizationInfo && (
                  <>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">PHI Protected</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateSummary}
              disabled={summarizing || !complaint}
              className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all disabled:opacity-50"
            >
              {summarizing ? 'Summarizing...' : 'Patient Summary'}
            </button>
            <button
              onClick={handleGetAssistance}
              disabled={loading || !complaint}
              className={`group px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center space-x-3 ${
                loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
              ) : (
                <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 00.547 1.022l1.428 1.428a2 2 0 002.828 0l1.428-1.428a2 2 0 000-2.828l-1.428-1.428zM17.5 7.5l-3 3M17.5 7.5l-3-3M17.5 7.5H13.5" />
                </svg>
              )}
              <span>{loading ? 'Thinking...' : 'Analyse Symptoms'}</span>
            </button>
          </div>
        </div>

        {/* PHI Anonymization Info Banner */}
        {assistance?.anonymizationInfo && assistance.anonymizationInfo.phiElementsRemoved > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-300">
                    PHI Anonymization Active
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    {assistance.anonymizationInfo.phiElementsRemoved} sensitive element(s) removed before AI analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAnonymizationDetails(!showAnonymizationDetails)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                {showAnonymizationDetails ? 'Hide' : 'Show'} Details
              </button>
            </div>

            {showAnonymizationDetails && (
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-900/50 space-y-2">
                <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">
                  Anonymized Elements:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {assistance.anonymizationInfo.replacements.map((replacement, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-blue-900"
                    >
                      <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        {replacement.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                        {replacement.count}x replaced
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 italic mt-3">
                  Anonymized at: {new Date(assistance.anonymizationInfo.timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {summary && (
          <div className="mb-8 p-6 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl animate-medical-in">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Education Summary</h4>
              <button onClick={() => setSummary(null)} className="text-gray-400 hover:text-rose-500 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed italic">{summary}</p>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-2xl">
            <p className="text-sm text-rose-800 dark:text-rose-300 font-medium">{error}</p>
          </div>
        )}

        {assistance && (
          <div className="space-y-8 animate-medical-in">
            {assistance.urgentFlags?.length > 0 && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-3 mb-4 text-rose-800 dark:text-rose-400">
                  <div className="p-1.5 bg-rose-500 text-white rounded-lg animate-pulse">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Urgent Red Flags Detected</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assistance.urgentFlags.map((flag: string, i: number) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-slate-900/40 rounded-xl text-xs text-rose-900 dark:text-rose-300 font-bold border border-rose-100/50 dark:border-rose-900/20">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Differential Diagnostics</h4>
                  <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800 ml-4"></div>
                </div>
                <div className="space-y-3">
                  {assistance.possibleDiagnoses?.map((diag: any, i: number) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col group hover:border-emerald-300 transition-all shadow-sm hover:shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            diag.probability === 'High' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' :
                            diag.probability === 'Moderate' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' :
                            'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                          }`}>
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-extrabold text-gray-900 dark:text-white text-base">{diag.name}</p>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">{diag.icd10}</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">ICD-10 Code</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            diag.probability === 'High' ? 'bg-emerald-500 text-white' :
                            diag.probability === 'Moderate' ? 'bg-indigo-500 text-white' :
                            'bg-gray-100 dark:bg-slate-700 text-gray-500'
                          }`}>
                            {diag.probability}
                          </div>
                          {diag.confidence !== undefined && (
                            <span className="text-[10px] font-bold text-gray-500">
                              {diag.confidence}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                      {diag.reasoning && (
                        <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
                          <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed">
                            {diag.reasoning}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Proposed Clinical Plan</h4>
                  <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800 ml-4"></div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-inner">
                  <div className="space-y-5">
                    {assistance.treatmentSuggestions?.map((step: string, i: number) => (
                      <div key={i} className="flex items-start space-x-4">
                        <div className="mt-1 w-2 h-2 bg-emerald-400 rounded-full ring-4 ring-emerald-50 dark:ring-emerald-900 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalAssistance;
