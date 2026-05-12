import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { DiagnosticsService, TestResult } from '../lib/diagnostics';

interface PlaywrightRunnerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlaywrightRunner: React.FC<PlaywrightRunnerProps> = ({ isOpen, onClose }) => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{service: string; status: 'ok'|'error'; ms: number}[]>([]);
  const [activeTab, setActiveTab] = useState<'tests' | 'health'>('tests');

  // Load test suite list
  useEffect(() => {
    if (isOpen && tests.length === 0) {
      setTests(DiagnosticsService.getTestSuites());
    }
  }, [isOpen]);

  const runAllTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    setTests(prev => prev.map(t => ({ ...t, status: 'pending', screenshot: undefined, message: undefined })));

    let updatedTests = [...DiagnosticsService.getTestSuites()];
    
    for (let i = 0; i < updatedTests.length; i++) {
      // Set to running
      updatedTests[i] = { ...updatedTests[i], status: 'running' };
      setTests([...updatedTests]);
      
      const result = await DiagnosticsService.runTest(updatedTests[i]);
      updatedTests[i] = result;
      setTests([...updatedTests]);
    }
    
    setIsRunning(false);
  };

  const runHealthCheck = async () => {
    setHealthStatus([]);
    const results = await DiagnosticsService.checkHealthEndpoints();
    setHealthStatus(results);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'health' && healthStatus.length === 0) {
      runHealthCheck();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const passed = tests.filter(t => t.status === 'passed').length;
  const failed = tests.filter(t => t.status === 'failed').length;
  const total = tests.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="test-runner-overlay">
      <div className="bg-bg-primary w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col h-[85vh] border border-border overflow-hidden transform scale-100 transition-all">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-bg-secondary">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-primary/20 rounded-lg">
              <Icons.Terminal className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono tracking-tight text-text-primary">Playwright Self-Test Environment</h2>
              <p className="text-xs text-text-muted font-mono">Automated E2E Diagnostics & Health Checks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
            <Icons.X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-bg-primary">
          <button 
             onClick={() => setActiveTab('tests')}
             className={`flex-1 p-3 text-sm font-mono font-bold border-b-2 transition-colors ${activeTab === 'tests' ? 'border-accent-primary text-accent-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
          >
             Browser UI Tests
          </button>
          <button 
             onClick={() => setActiveTab('health')}
             className={`flex-1 p-3 text-sm font-mono font-bold border-b-2 transition-colors ${activeTab === 'health' ? 'border-accent-primary text-accent-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
          >
             Service Health Check
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-bg-primary">
          {activeTab === 'tests' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-bg-secondary p-4 rounded-xl border border-border">
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-text-primary">{total}</div>
                    <div className="text-xs text-text-muted uppercase tracking-wider">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-green-500">{passed}</div>
                    <div className="text-xs text-green-500/70 uppercase tracking-wider">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-red-500">{failed}</div>
                    <div className="text-xs text-red-500/70 uppercase tracking-wider">Failed</div>
                  </div>
                </div>
                
                <button 
                  onClick={runAllTests}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-6 py-2 bg-accent-primary text-white rounded-lg font-mono font-bold hover:bg-accent-secondary disabled:opacity-50 transition-colors"
                >
                  {isRunning ? <Icons.Refresh className="w-4 h-4 animate-spin" /> : <Icons.Play className="w-4 h-4" />}
                  {isRunning ? 'Running...' : 'Run Suite'}
                </button>
              </div>

              <div className="space-y-3">
                {tests.map(test => (
                  <div key={test.id} className={`p-4 rounded-xl border ${test.status === 'failed' ? 'border-red-500/30 bg-red-500/5' : test.status === 'passed' ? 'border-green-500/30 bg-green-500/5' : 'border-border bg-bg-secondary'} transition-all`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {test.status === 'pending' && <div className="w-2 h-2 rounded-full bg-text-muted/50" />}
                        {test.status === 'running' && <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />}
                        {test.status === 'passed' && <Icons.Check className="w-4 h-4 text-green-500" />}
                        {test.status === 'failed' && <Icons.AlertCircle className="w-4 h-4 text-red-500" />}
                        <span className="font-mono text-sm font-medium text-text-primary">{test.name}</span>
                      </div>
                      
                      {test.duration && <span className="text-xs text-text-muted font-mono">{test.duration}ms</span>}
                    </div>

                    {test.message && (
                      <div className={`mt-3 pl-7 text-xs font-mono p-2 rounded bg-bg-primary/50 ${test.status === 'failed' ? 'text-red-400' : 'text-text-secondary'}`}>
                        {test.message}
                      </div>
                    )}

                    {test.screenshot && (
                      <div className="mt-3 pl-7">
                        <p className="text-xs text-red-400 mb-1 font-mono uppercase tracking-wider text-[10px]">Error Screenshot Capture:</p>
                        <img 
                          src={test.screenshot} 
                          alt="Test failure screenshot" 
                          className="rounded-lg border border-red-500/20 max-w-sm shadow-md"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex justify-between items-center bg-bg-secondary p-4 rounded-xl border border-border">
                 <h3 className="font-mono text-sm font-bold">API & Service Core Diagnostics</h3>
                 <button onClick={runHealthCheck} className="flex items-center gap-2 text-xs font-mono bg-bg-tertiary px-3 py-1.5 rounded border border-border hover:border-accent-primary transition-colors">
                    <Icons.Refresh className="w-3 h-3" /> Refresh
                 </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {healthStatus.map((service, i) => (
                    <div key={i} className="bg-bg-secondary border border-border p-4 rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${service.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="font-mono text-sm text-text-primary">{service.service}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-xs font-mono bg-bg-tertiary px-2 py-1 rounded text-text-muted">{service.ms}ms</span>
                          <span className={`text-xs font-mono uppercase font-bold tracking-wider ${service.status === 'ok' ? 'text-green-500' : 'text-red-500'}`}>
                             {service.status === 'ok' ? 'Healthy' : 'Degraded'}
                          </span>
                       </div>
                    </div>
                 ))}
                 {healthStatus.length === 0 && (
                    <div className="col-span-full text-center py-8 text-text-muted font-mono text-sm animate-pulse">
                       Pinging service endpoints...
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
