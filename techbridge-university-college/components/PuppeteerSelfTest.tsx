
import React, { useState, useRef, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Terminal, Activity, ArrowLeft, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { TEST_SUITE, TestResult } from '../lib/testRunner';

interface PuppeteerSelfTestProps {
  onBack: () => void;
}

const PuppeteerSelfTest: React.FC<PuppeteerSelfTestProps> = ({ onBack }) => {
  const [results, setResults] = useState<TestResult[]>(
    TEST_SUITE.map(t => ({ name: t.name, status: 'pending', logs: [], screenshots: [] }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [activeTestIndex, setActiveTestIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const runTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    // Reset
    setResults(TEST_SUITE.map(t => ({ name: t.name, status: 'pending', logs: [], screenshots: [] })));

    for (let i = 0; i < TEST_SUITE.length; i++) {
      setActiveTestIndex(i);
      const test = TEST_SUITE[i];
      const startTime = Date.now();
      
      setResults(prev => {
        const next = [...prev];
        next[i] = { ...next[i], status: 'running' };
        return next;
      });

      try {
        await test.action({
          log: (msg) => {
            setResults(prev => {
              const next = [...prev];
              next[i].logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
              return next;
            });
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          },
          screenshot: async (label) => {
            // Mocking a capture delay and URI
            const mockUri = `https://picsum.photos/800/600?random=${Math.random()}`;
            setResults(prev => {
              const next = [...prev];
              next[i].screenshots.push(mockUri);
              next[i].logs.push(`[SNAPSHOT] Captured: ${label}`);
              return next;
            });
          }
        });

        setResults(prev => {
          const next = [...prev];
          next[i] = { 
            ...next[i], 
            status: 'passed', 
            duration: Date.now() - startTime,
            logs: [...next[i].logs, `[SUCCESS] Test completed in ${Date.now() - startTime}ms`]
          };
          return next;
        });

      } catch (e: any) {
        setResults(prev => {
          const next = [...prev];
          next[i] = { 
            ...next[i], 
            status: 'failed', 
            error: e.message,
            duration: Date.now() - startTime,
            logs: [...next[i].logs, `[ERROR] ${e.message}`]
          };
          return next;
        });
      }
      await new Promise(r => setTimeout(r, 800));
    }

    setIsRunning(false);
    setActiveTestIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-mono p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Terminal size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Puppeteer Self-Test Suite</h1>
              <p className="text-gray-400 text-sm uppercase tracking-widest font-black">Visual Diagnostic Hub</p>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors border border-gray-700 font-bold"
          >
            <ArrowLeft size={16} className="mr-2" /> Exit Suite
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity size={18} className="mr-2 text-green-400" />
                Control Panel
              </h2>
              <button
                onClick={runTests}
                disabled={isRunning}
                className={`w-full py-4 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  isRunning 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/40'
                }`}
              >
                {isRunning ? 'Running Suite...' : 'Run Diagnostics'}
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Test Cases</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {results.map((test, idx) => (
                  <div key={idx} className={`px-6 py-4 flex items-center justify-between transition-colors ${activeTestIndex === idx ? 'bg-blue-900/20' : ''}`}>
                    <div className="flex items-center space-x-3">
                      {test.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-600" />}
                      {test.status === 'running' && <LoaderIcon />}
                      {test.status === 'passed' && <CheckCircle size={20} className="text-green-500" />}
                      {test.status === 'failed' && <XCircle size={20} className="text-red-500" />}
                      <span className={`text-xs font-bold uppercase ${test.status === 'pending' ? 'text-gray-500' : test.status === 'running' ? 'text-blue-400' : 'text-gray-200'}`}>
                        {test.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-black/80 rounded-xl border border-gray-700 shadow-2xl h-[400px] flex flex-col backdrop-blur-sm">
              <div className="px-4 py-2 bg-gray-800/80 rounded-t-xl border-b border-gray-700 flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-500 font-mono">STDOUT --verbose</span>
              </div>
              
              <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto font-mono text-xs space-y-2 scrollbar-thin">
                {results.flatMap((t, tIdx) => 
                  t.logs.map((log, lIdx) => (
                    <div key={`${tIdx}-${lIdx}`} className="flex">
                      <span className="text-blue-500 mr-2">➜</span>
                      <span className={`${log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-green-400' : log.includes('[SNAPSHOT]') ? 'text-blue-400' : 'text-gray-300'}`}>
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Snapshot Gallery */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                <ImageIcon size={18} className="text-blue-400" /> Diagnostic Snapshot Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.flatMap(r => r.screenshots).map((src, i) => (
                  <div key={i} className="group relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors">
                    <img src={src} alt="Test snapshot" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                       <ExternalLink size={16} className="text-white" />
                    </div>
                  </div>
                ))}
                {results.every(r => r.screenshots.length === 0) && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-700 rounded-xl">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Awaiting diagnostic snapshots...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoaderIcon = () => (
  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default PuppeteerSelfTest;
