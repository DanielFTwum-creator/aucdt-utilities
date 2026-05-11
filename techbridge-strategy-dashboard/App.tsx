import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import OverviewPrint from './components/OverviewPrint';
import StrategyView from './components/StrategyView';
import Financials from './components/Financials';
import MarketingView from './components/MarketingView';
import RisksView from './components/RisksView';
import AdminView from './components/AdminView';
import { Calendar, Download, LogOut, User, Loader2, Printer, Presentation } from 'lucide-react';
import { Theme, AuditLogEntry } from './types';
import { DataProvider } from './contexts/DataContext';
import { exportToPDF } from './utils/pdfExport';
import { generatePPTX } from './utils/pptxExport';

const DashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState<Theme>('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('techbridge_strategy_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Persist logs to localStorage
  useEffect(() => {
    localStorage.setItem('techbridge_strategy_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const [isExporting, setIsExporting] = useState(false);
  const [isPrintingAll, setIsPrintingAll] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);

  // Logging Helper
  const logAction = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      action,
      details,
      user: isAuthenticated ? 'Admin' : 'System'
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  // Auth Functions
  const handleLogin = (password: string) => {
    if (password === 'admin') {
      setIsAuthenticated(true);
      logAction('AUTH_LOGIN', 'Admin authenticated successfully');
      return true;
    }
    logAction('AUTH_FAIL', 'Failed login attempt');
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    logAction('AUTH_LOGOUT', 'Admin logged out');
    setActiveTab('overview');
  };

  // Helper to get title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Executive Briefing';
      case 'strategy': return 'Strategic Implementation Plan';
      case 'financials': return 'Financial Projections';
      case 'marketing': return 'Marketing & Recruitment';
      case 'risks': return 'Risk Management';
      case 'admin': return 'System Administration';
      case 'agent': return 'AI Data Agent';
      default: return 'Dashboard';
    }
  };

  // PDF Export Function
  const handleExport = async () => {
    setIsExporting(true);
    const title = getPageTitle();
    // Use the ID we assigned to the main content container
    const success = await exportToPDF(
      'dashboard-main-content', 
      `TechBridge-${activeTab}-Report.pdf`,
      `TechBridge: ${title}`
    );
    
    if (success) {
      logAction('EXPORT_PDF', `Exported ${activeTab} view to PDF`);
    } else {
      logAction('EXPORT_FAIL', `Failed to export ${activeTab} view`);
    }
    setIsExporting(false);
  };

  // Print All Function
  const handlePrintAll = async () => {
    setIsPrintingAll(true);
    setPrintProgress(0);
    
    // Allow time for the hidden container to render and charts to initialize
    setTimeout(async () => {
      const success = await exportToPDF(
        'print-all-container',
        'TechBridge-Full-Report.pdf',
        'TechBridge University College: Full Strategic Report',
        (progress) => setPrintProgress(progress)
      );
      
      if (success) {
        logAction('EXPORT_ALL_PDF', 'Exported full report to PDF');
      } else {
        logAction('EXPORT_FAIL', 'Failed to export full report');
      }
      setIsPrintingAll(false);
      setPrintProgress(0);
    }, 1000);
  };

  // PPTX Export Function
  const handlePptxExport = async () => {
    setIsGeneratingPPT(true);
    const title = getPageTitle();
    
    // We add a small delay to allow UI to update to "Generating..." state
    setTimeout(async () => {
        const success = await generatePPTX(
            'dashboard-main-content',
            `TechBridge: ${title}`
        );
        
        if (success) {
            logAction('EXPORT_PPTX', `Generated PowerPoint for ${activeTab}`);
        } else {
            logAction('EXPORT_FAIL', `Failed to generate PPTX for ${activeTab}`);
        }
        setIsGeneratingPPT(false);
    }, 100);
  };

  // Render Content Switcher
  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'strategy': return <StrategyView />;
      case 'financials': return <Financials />;
      case 'marketing': return <MarketingView />;
      case 'risks': return <RisksView />;
      case 'admin': return <AdminView isAuthenticated={isAuthenticated} login={handleLogin} auditLogs={auditLogs} />;
      case 'agent': return <AdminView isAuthenticated={isAuthenticated} login={handleLogin} auditLogs={auditLogs} initialTab="agent" />;
      default: return <Overview />;
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} ${theme === 'contrast' ? 'dark high-contrast' : ''}`}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} setTheme={setTheme} isAuthenticated={isAuthenticated} />
        
        <main className="flex-1 ml-64 overflow-y-auto" role="main">
          <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 px-8 py-4 flex justify-between items-center shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{getPageTitle()}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: 7 February 2026</p>
            </div>
            
            <div className="flex space-x-3">
               <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg border border-transparent dark:border-slate-600">
                  <Calendar size={16} />
                  <span>Q1 2026 Phase</span>
               </div>
               
               <button 
                  onClick={handlePptxExport}
                  disabled={isGeneratingPPT || isExporting || isPrintingAll}
                  className={`flex items-center space-x-2 text-sm text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${isGeneratingPPT ? 'bg-slate-700 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
                  aria-label="Generate PowerPoint"
               >
                  {isGeneratingPPT ? <Loader2 size={16} className="animate-spin" /> : <Presentation size={16} />}
                  <span>{isGeneratingPPT ? 'Generating...' : 'Export PPTX'}</span>
               </button>

               <button 
                  onClick={handleExport}
                  disabled={isExporting || isGeneratingPPT || isPrintingAll}
                  className={`flex items-center space-x-2 text-sm text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isExporting ? 'bg-slate-700 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700'}`}
                  aria-label="Print Current View"
               >
                  {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                  <span>{isExporting ? 'Printing...' : 'Print View'}</span>
               </button>

               <button 
                  onClick={handlePrintAll}
                  disabled={isExporting || isGeneratingPPT || isPrintingAll}
                  className={`flex items-center space-x-2 text-sm text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${isPrintingAll ? 'bg-slate-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                  aria-label="Print Full Report"
               >
                  {isPrintingAll ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  <span>{isPrintingAll ? `${printProgress}% Generating...` : 'Print All'}</span>
               </button>

               {isAuthenticated && (
                 <button 
                   onClick={handleLogout}
                   className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-4 py-2 rounded-lg transition-colors border border-red-100 dark:border-red-900/30"
                   aria-label="Logout"
                 >
                   <LogOut size={16} />
                   <span>Logout</span>
                 </button>
               )}
            </div>
          </header>

          <div id="dashboard-main-content" className="p-8 max-w-7xl mx-auto">
            {renderContent()}
          </div>

          {/* Hidden Container for Print All */}
          {isPrintingAll && (
            <div id="print-all-container" style={{ position: 'fixed', left: '-10000px', top: 0, width: '1600px', zIndex: -100, backgroundColor: 'white' }}>
              <div className="p-8 space-y-8">
                <div className="section-container">
                  <OverviewPrint />
                </div>
                <div className="section-container pt-8">
                  <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-4">The Situation At A Glance</h2>
                  <Overview />
                </div>
                <div className="section-container pt-8">
                  <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-4">Strategic Implementation Plan</h2>
                  <StrategyView />
                </div>
                <div className="section-container pt-8">
                  <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-4">Financial Projections</h2>
                  <Financials />
                </div>
                <div className="section-container pt-8">
                  <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-4">Marketing & Recruitment</h2>
                  <MarketingView />
                </div>
                <div className="section-container pt-8">
                  <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-4">Risk Management</h2>
                  <RisksView />
                </div>
                <div className="section-container pt-8">
                  <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-4">System Administration</h2>
                  <AdminView isAuthenticated={isAuthenticated} login={handleLogin} auditLogs={auditLogs} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
};

export default App;