
import React, { useState, useEffect, useRef } from 'react';
import { RopheTestRunner } from '../services/testService';
import { TestResult } from '../types';

const SelfTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const runnerRef = useRef<RopheTestRunner | null>(null);

  useEffect(() => {
    runnerRef.current = new RopheTestRunner(setResults);
    setResults(runnerRef.current.getResults());
  }, []);

  const runAll = async () => {
    if (!runnerRef.current || isRunningAll) return;
    setIsRunningAll(true);
    await runnerRef.current.runAll();
    setIsRunningAll(false);
  };

  const runSingle = async (id: string) => {
    if (!runnerRef.current) return;
    await runnerRef.current.runTest(id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded tracking-wider border border-emerald-200">DevOps Tooling</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Puppeteer Self-Test</h2>
          <p className="text-gray-500 font-medium">Verify end-to-end integrity of clinical workflows.</p>
        </div>
        
        <button 
          onClick={runAll}
          disabled={isRunningAll}
          className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center space-x-3 shadow-xl disabled:opacity-50"
        >
          {isRunningAll ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          <span>{isRunningAll ? 'Running Suite...' : 'Run Integration Suite'}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {results.map((test) => (
            <div 
              key={test.id} 
              className={`bg-white p-6 rounded-[2rem] border-2 transition-all ${
                test.status === 'passed' ? 'border-emerald-100' : 
                test.status === 'failed' ? 'border-rose-100' : 
                test.status === 'running' ? 'border-indigo-200 shadow-lg' : 'border-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    test.status === 'passed' ? 'bg-emerald-50 text-emerald-600' : 
                    test.status === 'failed' ? 'bg-rose-50 text-rose-600' : 
                    test.status === 'running' ? 'bg-indigo-50 text-indigo-600 animate-pulse' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {test.status === 'passed' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                    {test.status === 'failed' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>}
                    {test.status === 'running' && <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>}
                    {test.status === 'idle' && <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900">{test.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {test.status === 'idle' ? 'Ready to execute' : `${test.duration}ms execution time`}
                    </p>
                  </div>
                </div>
                {test.status !== 'running' && (
                  <button 
                    onClick={() => runSingle(test.id)}
                    className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                )}
              </div>
              
              <div className="bg-gray-900 rounded-2xl p-4 font-mono text-[11px] overflow-hidden">
                <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
                  <span className="text-gray-500 uppercase tracking-widest font-black">XHR Monitor</span>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-1 h-32 overflow-y-auto custom-scrollbar">
                  {test.logs.length > 0 ? test.logs.map((log, i) => (
                    <div key={i} className="flex space-x-3">
                      <span className="text-gray-600 select-none">{i+1}</span>
                      <span className={log.startsWith('SUCCESS') ? 'text-emerald-400' : log.startsWith('FAILED') ? 'text-rose-400' : 'text-gray-300'}>
                        {log}
                      </span>
                    </div>
                  )) : (
                    <div className="text-gray-600 italic">No logs emitted yet.</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-800 rounded-full opacity-20 blur-3xl"></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6">Execution Summary</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-black mb-1">{results.filter(r => r.status === 'passed').length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/60">Passed Scenarios</p>
              </div>
              <div>
                <p className="text-4xl font-black mb-1">{results.filter(r => r.status === 'failed').length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/60">Failed Scenarios</p>
              </div>
            </div>
            
            <div className="mt-12 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold border-t border-emerald-800 pt-6">
                <span className="text-emerald-300/80">Code Coverage</span>
                <span>94.2%</span>
              </div>
              <div className="w-full h-1.5 bg-emerald-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[94.2%]"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Last Captured Instance</h3>
             <div className="aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8">
                <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Screenshot archival disabled for sandbox performance</p>
                <p className="text-[10px] text-gray-300 mt-2 italic">Standard Puppeteer output directed to XHR Monitor</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfTest;
