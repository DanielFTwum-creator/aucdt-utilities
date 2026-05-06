import React, { useState, useRef } from 'react';
import { Upload, Bot, Activity, ArrowRight, Check, FileText, AlertCircle, Loader2, X, CheckCircle2 } from 'lucide-react';
import { useDashboardData } from '../contexts/DataContext';
import { DataAgent } from '../utils/DataAgent';

const SAMPLE_DATA = `Budget Allocation Update:
- Student Recruitment: 600,000
- Faculty Salaries: 450,000
- Campus Tech Upgrades: 150,000
- Innovation Fund: 75,000

Financial Trajectory (Revised):
2026: 240 students, 2.5M revenue, 3.8M cost
2027: 320 students, 3.4M revenue, 3.0M cost
2028: 450 students, 4.8M revenue, 3.2M cost
2029: 550 students, 6.0M revenue, 3.4M cost

Marketing Strategy Adjustment:
- TikTok Influencers: 180,000
- High School Roadshow: 220,000
- Alumni Network: 50,000`;

const AgentView: React.FC = () => {
  const { data, updateData } = useDashboardData();
  const [agentInput, setAgentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentResult, setAgentResult] = useState<{success: boolean; message: string; changes?: string[]} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessData = () => {
      if (!agentInput.trim()) return;
      
      setIsProcessing(true);
      setAgentResult(null);

      // Simulate AI processing delay
      setTimeout(() => {
        try {
            const { newData, result } = DataAgent.process(agentInput, data);
            
            if (result.success) {
                // Commit changes to the global context
                if (newData.budget !== data.budget) updateData('budget', newData.budget);
                if (newData.financials !== data.financials) updateData('financials', newData.financials);
                if (newData.marketing !== data.marketing) updateData('marketing', newData.marketing);
            }

            setAgentResult(result);
        } catch (error) {
            setAgentResult({
                success: false,
                message: "An unexpected error occurred during processing.",
                changes: []
            });
        } finally {
            setIsProcessing(false);
        }
      }, 2000); 
  };

  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        if (event.target?.result) {
            setAgentInput(event.target.result as string);
            setAgentResult(null); // Clear previous results on new input
        }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) readFileContent(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFileContent(file);
  };

  const loadSample = () => {
    setAgentInput(SAMPLE_DATA);
    setAgentResult(null);
  };

  const clearInput = () => {
      setAgentInput('');
      setAgentResult(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-140px)] min-h-[600px]">
          {/* Input Zone */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden transition-colors">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                        <Bot className="text-indigo-600 dark:text-indigo-400" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">AI Data Agent</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Ingest unstructured data to update dashboard metrics.</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                        onClick={loadSample}
                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1 border border-indigo-100 dark:border-indigo-900/30"
                        title="Load sample data for testing"
                    >
                        <FileText size={14} />
                        <span>Sample</span>
                    </button>
                    {agentInput && (
                        <button 
                            onClick={clearInput}
                            className="text-xs font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1.5 rounded-md transition-colors"
                            title="Clear input"
                        >
                            <X size={14} />
                        </button>
                    )}
                  </div>
              </div>

              <div className="flex-1 p-6 flex flex-col space-y-4 overflow-y-auto">
                  {/* Drag & Drop Area */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                        isDragging 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.01]' 
                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept=".txt,.md,.json" 
                        onChange={handleFileUpload} 
                      />
                      <Upload className={`mx-auto mb-3 transition-colors ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`} size={32} />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {isDragging ? "Drop file to upload" : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Supported formats: .txt, .md, .json</p>
                  </div>

                  {/* Text Area */}
                  <div className="flex-1 relative min-h-[200px]">
                      <textarea 
                         className="w-full h-full resize-none p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none dark:text-slate-300 placeholder-slate-400 transition-all"
                         placeholder="Paste unstructured text data here...
Example:
Budget Allocation:
Student Recruitment - 500,000
Faculty - 200,000

Financial Trajectory:
2028: 400 students, 4.0M revenue, 3.0M cost"
                         value={agentInput}
                         onChange={(e) => setAgentInput(e.target.value)}
                         disabled={isProcessing}
                      ></textarea>
                  </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <button 
                     onClick={handleProcessData}
                     disabled={isProcessing || !agentInput.trim()}
                     className={`w-full py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all shadow-sm ${
                         isProcessing || !agentInput.trim()
                         ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' 
                         : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.99]'
                     }`}
                  >
                      {isProcessing ? (
                          <><Loader2 className="animate-spin" size={18} /> <span>Processing Data...</span></>
                      ) : (
                          <><Bot size={18} /> <span>Run Data Agent</span></>
                      )}
                  </button>
              </div>
          </div>

          {/* Output Zone */}
          <div className="bg-slate-950 rounded-xl shadow-lg border border-slate-800 flex flex-col font-mono text-sm relative overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                      <div className="flex space-x-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium ml-2">agent-output.log</span>
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      {isProcessing ? 'Running' : 'Idle'}
                  </div>
              </div>

              {/* Terminal Body */}
              <div className="flex-1 p-6 overflow-y-auto font-mono text-sm">
                  {!agentResult && !isProcessing && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 opacity-50">
                          <Activity size={48} strokeWidth={1} />
                          <p>Waiting for agent input...</p>
                      </div>
                  )}
                  
                  {isProcessing && (
                      <div className="space-y-3">
                          <div className="flex items-center text-indigo-400">
                              <span className="mr-2">➜</span>
                              <span className="animate-pulse">Initializing data parser...</span>
                          </div>
                          <div className="flex items-center text-indigo-400 delay-100">
                              <span className="mr-2">➜</span>
                              <span className="animate-pulse" style={{ animationDelay: '150ms' }}>Detecting file format...</span>
                          </div>
                          <div className="flex items-center text-indigo-400 delay-200">
                              <span className="mr-2">➜</span>
                              <span className="animate-pulse" style={{ animationDelay: '300ms' }}>Identifying contexts (Budget, Finance, Marketing)...</span>
                          </div>
                          <div className="flex items-center text-indigo-400 delay-300">
                              <span className="mr-2">➜</span>
                              <span className="animate-pulse" style={{ animationDelay: '450ms' }}>Validating schema constraints...</span>
                          </div>
                      </div>
                  )}

                  {agentResult && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className={`flex items-start gap-3 p-4 rounded-lg border ${agentResult.success ? 'bg-green-950/30 border-green-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
                              <div className={`mt-0.5 ${agentResult.success ? 'text-green-400' : 'text-red-400'}`}>
                                  {agentResult.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                              </div>
                              <div>
                                  <h4 className={`font-bold mb-1 ${agentResult.success ? 'text-green-400' : 'text-red-400'}`}>
                                      {agentResult.success ? 'Processing Complete' : 'Processing Failed'}
                                  </h4>
                                  <p className="text-slate-300">{agentResult.message}</p>
                              </div>
                          </div>
                          
                          {agentResult.changes && agentResult.changes.length > 0 && (
                              <div className="space-y-2">
                                  <div className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-2 flex items-center">
                                      <Activity size={12} className="mr-1" /> Change Log
                                  </div>
                                  <div className="pl-3 border-l-2 border-slate-800 space-y-2">
                                      {agentResult.changes.map((change, idx) => (
                                          <div key={idx} className="text-slate-300 flex items-start gap-2 text-xs md:text-sm group">
                                              <span className="text-green-500 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                                  <Check size={14} />
                                              </span>
                                              <span className="group-hover:text-white transition-colors">{change}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}

                          {agentResult.success && (
                              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                                  <span className="text-xs text-slate-500">System State: Updated</span>
                                  <span className="text-xs text-indigo-400 font-bold">Ready for next task</span>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      </div>
  );
};

export default AgentView;
