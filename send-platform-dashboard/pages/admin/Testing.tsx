import React, { useState, useRef, useEffect } from 'react';
import { Play, Check, X, Loader2, Code, Terminal, Image as ImageIcon, CheckCircle, AlertOctagon, Download } from 'lucide-react';
import { SCENARIOS } from '../../services/playwrightScenarios';
import { PuppeteerScenario, TestRunResult } from '../../types';
import { mockJobs, mockGatewayRoutes } from '../../services/mockData';

const Testing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'integration' | 'e2e'>('integration');
  const [selectedScenario, setSelectedScenario] = useState<PuppeteerScenario>(SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<TestRunResult | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Integration Tests Logic
  const [integrationResults, setIntegrationResults] = useState<Record<string, 'PENDING' | 'PASS' | 'FAIL'>>({
    'check-jobs-schema': 'PENDING',
    'verify-gateway-routes': 'PENDING',
    'validate-mock-data': 'PENDING'
  });

  const runIntegrationTest = (id: string) => {
    setIntegrationResults(prev => ({ ...prev, [id]: 'PENDING' }));
    setTimeout(() => {
      let passed = true;
      if (id === 'check-jobs-schema') {
        passed = mockJobs.every(j => j.id && j.name && j.uuid);
      } else if (id === 'verify-gateway-routes') {
        passed = mockGatewayRoutes.every(r => r.upstream_service && r.method);
      }
      setIntegrationResults(prev => ({ ...prev, [id]: passed ? 'PASS' : 'FAIL' }));
    }, 1000);
  };

  const handleDownloadReport = () => {
    alert("Downloading Test Report PDF...\n[SIMULATION]");
  };

  // E2E Simulation Logic
  const runE2EScenario = async () => {
    setIsRunning(true);
    setLogs(['🚀 Initializing Playwright (Headless Chrome)...']);
    setResult(null);

    const steps = selectedScenario.steps;
    let success = true;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await new Promise(r => setTimeout(r, 800)); // Simulate network/processing delay
      
      setLogs(prev => [...prev, `> [${step.action}] ${step.description}`]);
      
      // Simulate random failure (1% chance)
      if (Math.random() > 0.99) {
        success = false;
        setLogs(prev => [...prev, `❌ Error: Timeout waiting for selector "${step.selector}"`]);
        break;
      } else {
        setLogs(prev => [...prev, `  ✅ OK (${Math.floor(Math.random() * 50) + 10}ms)`]);
      }
    }

    if (success) {
      setLogs(prev => [...prev, '✨ Scenario Completed Successfully']);
    } else {
      setLogs(prev => [...prev, '💀 Scenario Failed']);
    }

    setResult({
      scenarioId: selectedScenario.id,
      timestamp: new Date().toISOString(),
      success,
      logs: [],
      durationMs: steps.length * 800,
      screenshotUrl: success ? 'https://via.placeholder.com/800x450/e0f2fe/1e3a8a?text=SUCCESS+SCREENSHOT' : 'https://via.placeholder.com/800x450/fee2e2/991b1b?text=FAILURE+SCREENSHOT'
    });
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testing Framework</h1>
          <p className="text-gray-500 dark:text-gray-400">Execute automated test suites and verify system integrity.</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 flex px-6" role="tablist">
          <button 
            onClick={() => setActiveTab('integration')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'integration' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            role="tab"
            aria-selected={activeTab === 'integration'}
          >
            Unit & Integration
          </button>
          <button 
            onClick={() => setActiveTab('e2e')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'e2e' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            role="tab"
            aria-selected={activeTab === 'e2e'}
          >
            E2E Scenarios (Playwright)
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'integration' && (
             <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'check-jobs-schema', name: 'Validate Job Schema', desc: 'Checks all defined jobs against generic interface.' },
                    { id: 'verify-gateway-routes', name: 'Gateway Route Integrity', desc: 'Ensures no orphaned upstream services.' },
                    { id: 'validate-mock-data', name: 'Mock Data Consistency', desc: 'Verifies relational integrity of mock datasets.' }
                  ].map(test => (
                    <div key={test.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                       <div>
                         <h3 className="font-semibold text-gray-900 dark:text-white">{test.name}</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400">{test.desc}</p>
                       </div>
                       <div className="flex items-center space-x-3">
                         {integrationResults[test.id] === 'PASS' && <span className="text-green-600 font-bold text-sm">PASS</span>}
                         {integrationResults[test.id] === 'FAIL' && <span className="text-red-600 font-bold text-sm">FAIL</span>}
                         <button 
                           onClick={() => runIntegrationTest(test.id)}
                           className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800"
                           aria-label={`Run test: ${test.name}`}
                         >
                           <Play size={16} />
                         </button>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {activeTab === 'e2e' && (
            <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
              {/* Scenario List */}
              <div className="w-full lg:w-1/3 border-r border-gray-100 dark:border-gray-700 pr-6 space-y-4 overflow-y-auto" role="list" aria-label="Test Scenarios">
                {SCENARIOS.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedScenario.id === scenario.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                    role="listitem"
                    aria-current={selectedScenario.id === scenario.id}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{scenario.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        scenario.criticality === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{scenario.criticality}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{scenario.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{scenario.description}</p>
                  </button>
                ))}
              </div>

              {/* Execution Pane */}
              <div className="flex-1 flex flex-col space-y-4">
                 <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                       <Terminal size={18} className="text-gray-500 dark:text-gray-300" aria-hidden="true" />
                       <span className="font-mono text-sm font-semibold dark:text-white">Execution Console</span>
                    </div>
                    <button 
                      onClick={runE2EScenario}
                      disabled={isRunning}
                      className={`flex items-center px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                        isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      aria-label="Run selected scenario"
                    >
                      {isRunning ? <Loader2 className="animate-spin mr-2" size={18} /> : <Play className="mr-2" size={18} />}
                      Run Scenario
                    </button>
                 </div>

                 <div 
                   className="flex-1 bg-black rounded-lg p-4 font-mono text-xs text-green-400 overflow-y-auto shadow-inner relative"
                   role="log"
                   aria-live="polite"
                 >
                    {logs.length === 0 && <span className="text-gray-500 select-none">Ready to start...</span>}
                    {logs.map((log, i) => (
                      <div key={i} className="mb-1">{log}</div>
                    ))}
                    <div ref={logEndRef} />
                 </div>

                 {/* Results & Screenshot Mock */}
                 {result && (
                   <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="w-1/3">
                        <img src={result.screenshotUrl} alt="Test Result Screenshot" className="rounded border border-gray-200 dark:border-gray-600 shadow-sm" />
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                           <h4 className="font-bold text-gray-900 dark:text-white flex items-center mb-2">
                             {result.success ? <CheckCircle className="text-green-500 mr-2" /> : <AlertOctagon className="text-red-500 mr-2" />}
                             Test Result: {result.success ? 'PASSED' : 'FAILED'}
                           </h4>
                           <button 
                             onClick={handleDownloadReport}
                             className="text-xs flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
                           >
                             <Download size={14} className="mr-1" /> Report
                           </button>
                         </div>
                         <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-500">Duration:</div>
                            <div className="font-mono dark:text-gray-300">{result.durationMs}ms</div>
                            <div className="text-gray-500">Timestamp:</div>
                            <div className="font-mono dark:text-gray-300">{new Date(result.timestamp).toLocaleTimeString()}</div>
                         </div>
                         <div className="mt-4">
                           <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Source Code</p>
                           <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-[10px] text-gray-700 dark:text-gray-300 overflow-x-auto border border-gray-200 dark:border-gray-700 h-24">
                             {selectedScenario.code}
                           </pre>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testing;