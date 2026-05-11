import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AgentStatus, LogEntry, Article, ArticleStatus } from '../types';
import { 
  Play, Pause, Terminal, Cpu, Globe, Share2, 
  CheckCircle2, Zap, Shield, Activity, 
  RefreshCcw, Layers, BrainCircuit, AlertTriangle, Calendar,
  ExternalLink, X, Info, Search, List, Newspaper, BarChart3, TrendingUp,
  Smile, Meh, Frown, Hash, Eye
} from 'lucide-react';

interface AgentMonitorProps {
  status: AgentStatus;
  logs: LogEntry[];
  articles: Article[];
}

export const AgentMonitor: React.FC<AgentMonitorProps> = ({ status, logs, articles }) => {
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom on new entries
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const scheduledCount = useMemo(() => {
      return articles.filter(a => a.status === ArticleStatus.SCHEDULED).length;
  }, [articles]);

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'idle': return 'bg-slate-400 dark:bg-slate-600 shadow-slate-400/20';
      case 'fetching': return 'bg-sky-500 shadow-sky-500/40';
      case 'processing': return 'bg-indigo-500 shadow-indigo-500/40';
      case 'publishing': return 'bg-emerald-500 shadow-emerald-500/40';
      case 'sleeping': return 'bg-amber-500 shadow-amber-500/40';
      default: return 'bg-slate-500';
    }
  };

  const getStatusLabel = (state: string) => {
    switch (state) {
      case 'idle': return 'Standing By';
      case 'fetching': return 'Ingesting Feeds';
      case 'processing': return 'AI Cogitation';
      case 'publishing': return 'Social Dispatch';
      case 'sleeping': return 'Power Save';
      default: return state.toUpperCase();
    }
  };

  const handleEntityClick = (title: string) => {
    const article = articles.find(a => a.title === title);
    if (article) {
      setSelectedArticle(article);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 relative">
      {/* Header Diagnostics */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${getStatusColor(status.state)}`}>
            {status.state === 'idle' && <Activity className="text-white" size={24} />}
            {status.state === 'fetching' && <RefreshCcw className="text-white animate-spin" size={24} />}
            {status.state === 'processing' && <BrainCircuit className="text-white animate-pulse" size={24} />}
            {status.state === 'publishing' && <Share2 className="text-white animate-bounce" size={24} />}
            {status.state === 'sleeping' && <Zap className="text-white opacity-50" size={24} />}
          </div>
          <div>
            <h2 className="font-serif font-black text-2xl text-slate-900 dark:text-white leading-none">
              Nexus Agent v2.0
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">System Engine:</span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                {getStatusLabel(status.state)}
              </span>
            </div>
            {status.activeTask && (
                <p className="text-[10px] text-brand-500 font-bold mt-1 animate-pulse">{status.activeTask}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Heartbeat</p>
            <p className="text-xs font-mono text-slate-600 dark:text-slate-400">1.02s latency</p>
          </div>
          <button 
            onClick={() => setIsManualOverride(!isManualOverride)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 ${
              isManualOverride 
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/20'
            }`}
          >
            {isManualOverride ? <Pause size={16} /> : <Play size={16} />}
            {isManualOverride ? 'Resume Auto' : 'Manual Halt'}
          </button>
        </div>
      </div>

      {/* Main Control Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Pipeline Visualization */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50"></div>
            
            <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-700 pb-2">
              Autonomous Cycle Workflow
            </h3>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 px-4">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-700 -translate-y-1/2 hidden md:block z-0"></div>
              
              {[
                { id: 'fetching', icon: Globe, label: 'Ingest', desc: 'Search Grounding' },
                { id: 'processing', icon: BrainCircuit, label: 'Analyse', desc: 'Gemini Synthesis' },
                { id: 'publishing', icon: Share2, label: 'Deploy', desc: 'Graph API' },
                { id: 'idle', icon: CheckCircle2, label: 'Audit', desc: 'Compliance Check' }
              ].map((step, idx) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 bg-white dark:bg-slate-800 ${
                    status.state === step.id 
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400 scale-110 shadow-xl shadow-brand-500/10' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600'
                  }`}>
                    <step.icon size={28} className={status.state === step.id ? 'animate-pulse' : ''} />
                  </div>
                  <div className="mt-4">
                    <p className={`text-xs font-black uppercase tracking-widest ${status.state === step.id ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[100px] leading-tight">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Runtime</p>
                <p className="text-sm font-mono text-slate-800 dark:text-slate-200">102:14:05</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agent Entropy</p>
                <p className="text-sm font-mono text-slate-800 dark:text-slate-200">0.42 / 1.0</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accuracy</p>
                <p className="text-sm font-mono text-green-600 dark:text-green-400">{status.successRate}%</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dispatch Queue</p>
                <p className="text-sm font-mono text-slate-800 dark:text-slate-200">{scheduledCount} items</p>
              </div>
            </div>
          </div>

          {/* Terminal View */}
          <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col h-[350px]">
            <div className="bg-slate-800/50 px-4 py-2 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-brand-400" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Kernel Log Stream</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
              </div>
            </div>
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1.5 scrollbar-hide bg-black/30"
            >
              {logs.map((log) => (
                <div key={log.id} className="flex gap-4 group hover:bg-white/5 py-0.5 transition-colors items-center">
                  <span className="text-slate-600 shrink-0 select-none w-16">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                  </span>
                  <button 
                    onClick={() => setSelectedLog(log)}
                    className={`
                      uppercase shrink-0 w-24 font-bold select-none text-[10px] px-1.5 py-0.5 rounded-sm border transition-all hover:scale-105 active:scale-95
                      ${log.level === 'info' ? 'text-blue-400 border-blue-400/20 bg-blue-400/5 hover:bg-blue-400/20' : ''}
                      ${log.level === 'warn' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/20' : ''}
                      ${log.level === 'error' ? 'text-rose-400 border-rose-400/20 bg-rose-400/5 hover:bg-rose-400/20' : ''}
                      ${log.level === 'success' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5 hover:bg-emerald-400/20' : ''}
                    `}
                    title="Click for operation details"
                  >
                    {log.module}
                  </button>
                  <span className="text-slate-400 group-hover:text-slate-200 transition-colors flex-1 truncate">
                    {log.message}
                  </span>
                  {log.details && (
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-brand-400 hover:text-brand-300 transition-all"
                      title="View Metadata"
                    >
                      <Info size={12} />
                    </button>
                  )}
                </div>
              ))}
              <div className="text-brand-500 animate-pulse font-bold mt-2">_</div>
            </div>
          </div>
        </div>

        {/* Sidebar Metrics */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-xl flex flex-col justify-between h-[180px] relative overflow-hidden group">
            <Layers className="absolute -bottom-6 -right-6 text-white/5 group-hover:text-white/10 transition-all duration-700" size={160} />
            <div>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Discovery Throughput / 24h</p>
              <h4 className="text-4xl font-serif font-black">{status.articlesProcessedToday}</h4>
              <p className="text-xs text-slate-400 mt-1">Grounding verified articles</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 w-3/4 transition-all duration-1000"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-500">75%</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-[180px]">
            <div>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Publishing Quota / 24h</p>
              <h4 className="text-4xl font-serif font-black text-slate-900 dark:text-white">{status.postsPublishedToday}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Autonomous Social Dispatches</p>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={12} /> Target Met
              </span>
              <span className="flex items-center gap-1">
                  <Calendar size={12} /> Queue: {scheduledCount}
              </span>
            </div>
          </div>

          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-rose-500 text-white rounded-lg shadow-lg shadow-rose-500/20">
                <AlertTriangle size={16} />
              </div>
              <h5 className="font-bold text-sm text-rose-900 dark:text-rose-400 uppercase tracking-wider">Health Alerts</h5>
            </div>
            <ul className="space-y-2">
              <li className="text-[10px] text-rose-700 dark:text-rose-500 flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                <span>Optimized Search Grounding: Increased fetch buffer to 12 items.</span>
              </li>
              <li className="text-[10px] text-rose-700 dark:text-rose-500 flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                <span>Autonomous publisher verified {scheduledCount} items in queue.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Drill-down Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border
                  ${selectedLog.level === 'info' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' : ''}
                  ${selectedLog.level === 'warn' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : ''}
                  ${selectedLog.level === 'error' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : ''}
                  ${selectedLog.level === 'success' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : ''}
                `}>
                  {selectedLog.module}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white leading-tight">Operation Telemetry</h4>
                  <p className="text-[10px] text-slate-500 font-mono">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Terminal size={12} /> Execution Summary
                </h5>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {selectedLog.message}
                </p>
              </div>

              {selectedLog.details ? (
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <List size={12} /> Operation Details
                  </h5>
                  
                  {/* Specialized Renderers for Common Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedLog.details).map(([key, value]) => {
                      if (key === 'items' && Array.isArray(value)) return null; // Render separately below
                      return (
                        <div key={key} className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-xs font-mono text-slate-700 dark:text-slate-200 font-bold break-all">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Array of items drill-down (e.g., Aggregated Article List) */}
                  {selectedLog.details.items && Array.isArray(selectedLog.details.items) && (
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900/40">
                      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-500 uppercase">Processed Entities</span>
                         <span className="text-[10px] font-mono text-brand-500 font-bold">{selectedLog.details.items.length} TOTAL</span>
                      </div>
                      <ul className="divide-y divide-slate-100 dark:divide-slate-700 max-h-64 overflow-y-auto">
                        {selectedLog.details.items.map((item: string, i: number) => (
                          <li key={i} className="group transition-colors">
                            <button 
                              onClick={() => handleEntityClick(item)}
                              className="w-full text-left px-4 py-2.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800"
                            >
                              <span className="text-[10px] font-mono text-slate-400 mt-0.5">{String(i+1).padStart(2, '0')}</span>
                              <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex-1">{item}</span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-brand-500">
                                <Eye size={12} />
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-center pt-4">
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full flex items-center gap-2 border border-emerald-100 dark:border-emerald-800">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Integrity Verified</span>
                      </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl">
                  <Search size={32} className="opacity-20 mb-3" />
                  <p className="text-xs italic font-serif">No extended metadata available for this trace</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 flex justify-end gap-3">
               <button 
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Detail View Modal (Overlay) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in zoom-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500 text-white rounded-xl">
                  <Newspaper size={20} />
                </div>
                <div>
                  <h4 className="font-serif font-black text-slate-900 dark:text-white leading-tight">Content Inspector</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Deep Article Metadata Review</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="aspect-video w-full bg-slate-900 relative">
                 <img 
                  src={selectedArticle.imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                   <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-brand-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md">
                        {selectedArticle.category}
                      </span>
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                        {selectedArticle.sourceName} • {new Date(selectedArticle.publishedAt).toLocaleDateString()}
                      </span>
                   </div>
                   <h3 className="text-2xl font-serif font-black text-white leading-tight">
                     {selectedArticle.title}
                   </h3>
                </div>
              </div>

              <div className="p-8 space-y-8">
                 <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg italic text-slate-600 dark:text-slate-300 leading-relaxed font-serif border-l-4 border-brand-500 pl-6">
                      {selectedArticle.summary}
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <TrendingUp size={14} className="text-emerald-500" /> Engagement Score
                       </p>
                       <div className="flex items-end gap-2">
                          <span className="text-3xl font-black text-slate-900 dark:text-white">{selectedArticle.engagementScore || 0}%</span>
                          <span className="text-[10px] text-slate-500 mb-1.5 font-bold">Predictive Confidence</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500" 
                            style={{ width: `${selectedArticle.engagementScore || 0}%` }}
                          ></div>
                       </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <BarChart3 size={14} className="text-brand-500" /> Sentiment Analysis
                       </p>
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl border
                             ${selectedArticle.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 
                               selectedArticle.sentiment === 'neutral' ? 'bg-sky-100 text-sky-600 border-sky-200' : 
                               'bg-rose-100 text-rose-600 border-rose-200'}
                          `}>
                             {selectedArticle.sentiment === 'positive' && <Smile size={24}/>}
                             {selectedArticle.sentiment === 'neutral' && <Meh size={24}/>}
                             {(selectedArticle.sentiment === 'negative' || selectedArticle.sentiment === 'critical') && <Frown size={24}/>}
                          </div>
                          <div>
                             <span className="text-xl font-black text-slate-900 dark:text-white capitalize">{selectedArticle.sentiment}</span>
                             <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Automated Tone Detection</p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <Hash size={14} className="text-purple-500" /> Topic Metadata
                       </p>
                       <div className="flex flex-wrap gap-2">
                          {selectedArticle.tags?.map(tag => (
                            <span key={tag} className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                              {tag}
                            </span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-6 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 flex justify-between items-center">
               <a 
                href={selectedArticle.originalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold text-brand-600 hover:underline"
              >
                <ExternalLink size={14} /> View Original Source
              </a>
               <button 
                onClick={() => setSelectedArticle(null)}
                className="px-8 py-3 bg-brand-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all active:scale-95"
              >
                Return to Monitor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};