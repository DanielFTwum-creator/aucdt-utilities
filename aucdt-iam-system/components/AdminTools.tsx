import React, { useEffect, useRef, useState } from 'react';
import { TEST_SUITES, runStepMock } from '../services/mockPuppeteer';
import { AuditLog, TestCase } from '../types';

interface AdminToolsProps {
  logs: AuditLog[];
  onLogAction: (action: string) => void;
}

// Reusable Export Dropdown Component based on best practices
const ExportDropdown: React.FC<{ data: AuditLog[] }> = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // "Click Outside" logic to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCopy = async () => {
        const text = JSON.stringify(data, null, 2);
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
                setIsOpen(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        setIsOpen(false);
    };

    const handleExportJSON = () => {
        downloadFile(JSON.stringify(data, null, 2), `audit-logs-${Date.now()}.json`, 'application/json');
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Timestamp', 'Action', 'Admin ID'];
        const rows = data.map(log => [
            log.id,
            new Date(log.timestamp).toISOString(),
            `"${log.action.replace(/"/g, '""')}"`, // Escape quotes
            log.adminId
        ]);
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        downloadFile(csvContent, `audit-logs-${Date.now()}.csv`, 'text/csv');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 shadow-sm"
            >
                <i className="fas fa-download"></i> Export
                <i className={`fas fa-chevron-down text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-fade-in">
                    <div className="py-1">
                        <button onClick={handleCopy} className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                            {isCopied ? <i className="fas fa-check text-green-500"></i> : <i className="fas fa-copy"></i>}
                            {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                        <button onClick={handleExportCSV} className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                            <i className="fas fa-file-csv text-green-600"></i> Export as CSV
                        </button>
                        <button onClick={handleExportJSON} className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                            <i className="fas fa-file-code text-yellow-600"></i> Export as JSON
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AdminTools: React.FC<AdminToolsProps> = ({ logs, onLogAction }) => {
  const [activeTab, setActiveTab] = useState<'TESTS' | 'AUDIT'>('TESTS');
  
  // Test Runner State
  const [suites, setSuites] = useState<TestCase[]>(TEST_SUITES);
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>(TEST_SUITES[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  const selectedSuite = suites.find(s => s.id === selectedSuiteId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [suites]);

  const runSuite = async (suiteId: string) => {
    if (isRunning) return;
    setIsRunning(true);
    onLogAction(`Initiated Test Suite: ${suiteId}`);

    // Reset specific suite
    setSuites(prev => prev.map(s => 
      s.id === suiteId 
        ? { ...s, status: 'RUNNING', steps: s.steps.map(step => ({ ...step, status: 'PENDING', screenshotUrl: undefined, duration: undefined })) }
        : s
    ));

    const suiteIndex = suites.findIndex(s => s.id === suiteId);
    if (suiteIndex === -1) return;

    const steps = suites[suiteIndex].steps;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Mark step running
      setSuites(prev => {
        const newSuites = [...prev];
        newSuites[suiteIndex].steps[i].status = 'RUNNING';
        return newSuites;
      });

      // Execute Mock
      try {
        const result = await runStepMock(suiteId, step);
        
        // Mark step passed
        setSuites(prev => {
          const newSuites = [...prev];
          newSuites[suiteIndex].steps[i].status = 'PASSED';
          newSuites[suiteIndex].steps[i].screenshotUrl = result.screenshot;
          newSuites[suiteIndex].steps[i].duration = result.duration;
          return newSuites;
        });
      } catch (e) {
        // Mark failed (Mock shouldn't fail but good for robustness)
        setSuites(prev => {
          const newSuites = [...prev];
          newSuites[suiteIndex].steps[i].status = 'FAILED';
          return newSuites;
        });
      }
    }

    // Mark suite finished
    setSuites(prev => {
      const newSuites = [...prev];
      newSuites[suiteIndex].status = 'PASSED';
      return newSuites;
    });

    setIsRunning(false);
    onLogAction(`Completed Test Suite: ${suiteId} - PASSED`);
  };

  const runAllSuites = async () => {
    if (isRunning) return;
    for (const suite of suites) {
      await runSuite(suite.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASSED': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'FAILED': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'RUNNING': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">System Administration</h2>
        <div className="flex space-x-2 bg-white dark:bg-darkcard p-1 rounded-lg border dark:border-gray-700">
            <button 
                onClick={() => setActiveTab('TESTS')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'TESTS' ? 'bg-primary text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                <i className="fas fa-robot mr-2"></i> Automated Tests
            </button>
            <button 
                onClick={() => setActiveTab('AUDIT')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'AUDIT' ? 'bg-primary text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                <i className="fas fa-shield-alt mr-2"></i> Audit Logs
            </button>
        </div>
      </div>

      {activeTab === 'TESTS' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
            {/* Sidebar: Test Suites */}
            <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200">Test Suites</h3>
                    <button 
                        onClick={runAllSuites} 
                        disabled={isRunning}
                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {isRunning ? 'Running...' : 'Run All'}
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {suites.map(suite => (
                        <div 
                            key={suite.id}
                            onClick={() => setSelectedSuiteId(suite.id)}
                            className={`p-4 rounded-lg cursor-pointer border transition-all ${selectedSuiteId === suite.id ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{suite.name}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(suite.status)}`}>
                                    {suite.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{suite.description}</p>
                            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div 
                                    className={`h-1.5 rounded-full transition-all duration-500 ${suite.status === 'PASSED' ? 'bg-green-500' : suite.status === 'FAILED' ? 'bg-red-500' : 'bg-primary'}`} 
                                    style={{ width: `${(suite.steps.filter(s => s.status === 'PASSED').length / suite.steps.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main: Execution Console */}
            <div className="lg:col-span-2 bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">{selectedSuite?.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Puppeteer Execution Log</p>
                    </div>
                    <button 
                        onClick={() => selectedSuite && runSuite(selectedSuite.id)}
                        disabled={isRunning}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 shadow-sm transition-colors"
                    >
                        <i className="fas fa-play mr-2"></i> Run This Suite
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-900 font-mono text-sm" ref={scrollRef}>
                    {selectedSuite?.steps.map((step, idx) => (
                        <div key={step.id} className="flex items-start space-x-3 group">
                            <div className="pt-1">
                                {step.status === 'PENDING' && <div className="w-2 h-2 rounded-full bg-gray-600"></div>}
                                {step.status === 'RUNNING' && <i className="fas fa-circle-notch fa-spin text-blue-400"></i>}
                                {step.status === 'PASSED' && <i className="fas fa-check-circle text-green-400"></i>}
                                {step.status === 'FAILED' && <i className="fas fa-times-circle text-red-400"></i>}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-baseline">
                                    <span className={`text-gray-300 ${step.status === 'RUNNING' ? 'text-blue-300 font-bold' : ''}`}>
                                        {step.description}
                                    </span>
                                    {step.duration && <span className="text-gray-500 text-xs">+{step.duration}ms</span>}
                                </div>
                                {step.status === 'PASSED' && step.screenshotUrl && (
                                    <button 
                                        onClick={() => setActiveScreenshot(step.screenshotUrl || null)}
                                        className="mt-2 flex items-center text-xs text-gray-500 hover:text-white transition-colors focus:outline-none"
                                    >
                                        <i className="fas fa-camera mr-1"></i> View Capture
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {selectedSuite?.status === 'PASSED' && (
                        <div className="pt-4 border-t border-gray-700 text-green-400 font-bold">
                            SUITE EXECUTION COMPLETED SUCCESSFULLY.
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'AUDIT' && (
          <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 flex-1 flex flex-col">
             <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">Security Audit Logs</h3>
                 <ExportDropdown data={logs} />
             </div>
             <div className="overflow-y-auto flex-1">
                 <table className="w-full text-left" aria-label="Audit Logs Table">
                     <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs uppercase sticky top-0">
                         <tr>
                             <th className="px-6 py-3" scope="col">Timestamp</th>
                             <th className="px-6 py-3" scope="col">Action</th>
                             <th className="px-6 py-3" scope="col">Admin ID</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y dark:divide-gray-700 text-sm">
                         {logs.map(log => (
                             <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                 <td className="px-6 py-3 text-gray-500 font-mono">{new Date(log.timestamp).toISOString()}</td>
                                 <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">{log.action}</td>
                                 <td className="px-6 py-3 text-gray-500">{log.adminId}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
          </div>
      )}

      {/* Screenshot Modal */}
      {activeScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4" onClick={() => setActiveScreenshot(null)}>
            <div className="bg-white p-2 rounded-lg max-w-4xl w-full shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2 px-2">
                    <h4 className="font-bold text-gray-700">Captured Screenshot</h4>
                    <button onClick={() => setActiveScreenshot(null)} className="text-gray-500 hover:text-red-500">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <img src={activeScreenshot} alt="Test Capture" className="w-full h-auto rounded border border-gray-200" />
            </div>
        </div>
      )}
    </div>
  );
};