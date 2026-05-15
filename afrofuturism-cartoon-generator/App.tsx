import React, { useState } from 'react';
import { AnalyseIcon, GenerateIcon, CompareIcon, QuickIcon, LibraryIcon, AdminIcon } from './components/icons';
import AnalyseTab from './components/AnalyseTab';
import GenerateBriefTab from './components/GenerateBriefTab';
import CompareTab from './components/CompareTab';
import QuickAnalysisTab from './components/QuickAnalysisTab';
import LibraryTab from './components/LibraryTab';
import AdminDashboard from './components/AdminDashboard';

type TabId = 'analyse' | 'generate' | 'quick' | 'compare' | 'library';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  shortLabel: string;
}

const TABS: Tab[] = [
  { id: 'analyse', label: 'Full Analysis', shortLabel: 'Analyse', icon: <AnalyseIcon /> },
  { id: 'generate', label: 'Creative Brief', shortLabel: 'Generate', icon: <GenerateIcon /> },
  { id: 'quick', label: 'Quick Analysis', shortLabel: 'Quick', icon: <QuickIcon /> },
  { id: 'compare', label: 'Compare', shortLabel: 'Compare', icon: <CompareIcon /> },
  { id: 'library', label: 'Library', shortLabel: 'Library', icon: <LibraryIcon /> },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('analyse');
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-[#050010] text-purple-100">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-[#0a0020]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-lg shadow-lg shadow-purple-900/50">
                🌍
              </div>
              <div>
                <h1 className="text-sm font-bold text-amber-300 leading-tight">Afrofuturism</h1>
                <p className="text-xs text-purple-400 leading-tight">Cartoon Directive Generator</p>
              </div>
            </div>

            {/* Admin button */}
            <button
              onClick={() => setShowAdmin(true)}
              aria-label="Open Admin Dashboard"
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-purple-500 hover:text-purple-300 border border-purple-800/30 hover:border-purple-600/50 rounded-xl transition-colors"
            >
              <AdminIcon className="w-4 h-4" />
              Admin
            </button>
          </div>

          {/* Tab nav */}
          <nav role="tablist" aria-label="Main navigation" className="flex gap-1 pb-0 -mb-px overflow-x-auto scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-purple-500 hover:text-purple-300 hover:border-purple-600/50'
                }`}
              >
                <span className="w-4 h-4">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.shortLabel}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero banner — only on analyse tab */}
      {activeTab === 'analyse' && (
        <div className="border-b border-purple-800/20 bg-gradient-to-r from-purple-950/60 via-[#0a0020] to-amber-950/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-5xl">🌌</div>
            <div>
              <p className="text-lg font-bold text-amber-200 mb-1">Where African Heritage Meets Tomorrow</p>
              <p className="text-sm text-purple-300 max-w-2xl">
                Analyse and generate Afrofuturism cartoons using structured directives — cultural authenticity scoring,
                representation quality assessment, and AI-powered creative brief generation. v1.0 · {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'analyse' && <AnalyseTab />}
        {activeTab === 'generate' && <GenerateBriefTab />}
        {activeTab === 'quick' && <QuickAnalysisTab />}
        {activeTab === 'compare' && <CompareTab />}
        {activeTab === 'library' && <LibraryTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-800/20 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-600">
          <p>Afrofuturism Cartoon Directive Generator v1.0 · Techbridge University College · Daniel Frempong Twum</p>
          <p>Built with React · TypeScript · Tailwind CSS · Gemini AI</p>
        </div>
      </footer>

      {/* Admin overlay */}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

export default App;
