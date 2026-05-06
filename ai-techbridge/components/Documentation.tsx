import React, { useState } from 'react';
import ArchitectureGraph from './ArchitectureGraph';
import DatabaseGraph from './DatabaseGraph';

const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'admin' | 'deployment' | 'testing'>('architecture');

  const renderContent = () => {
    switch (activeTab) {
      case 'architecture':
        return (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col">
                <h3 className="text-lg font-black mb-6 text-techbridge-gold uppercase tracking-tighter">System Topology (V4)</h3>
                <div className="flex-1 flex items-center justify-center overflow-hidden rounded-xl">
                  <ArchitectureGraph />
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-techbridge-beige shadow-2xl flex flex-col">
                <h3 className="text-lg font-black mb-6 text-techbridge-burgundy uppercase tracking-tighter">Data Logic Registry</h3>
                <div className="flex-1 flex items-center justify-center overflow-hidden rounded-xl">
                  <DatabaseGraph />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] border border-techbridge-beige dark:border-slate-700 max-w-none">
               <h3 className="text-2xl font-black text-techbridge-burgundy dark:text-white uppercase tracking-tight mb-4">Technical Overview</h3>
               <p className="font-medium text-gray-500 mb-8">The AI @ TechBridge Portal utilizes a micro-service inspired architecture designed for high availability and university-wide scaling.</p>
               <ul className="grid md:grid-cols-2 gap-6 list-none p-0">
                  <li className="bg-techbridge-cream dark:bg-slate-900 p-6 rounded-2xl border border-techbridge-beige">
                    <strong className="text-techbridge-burgundy block mb-2 uppercase text-xs">React 19 Engine</strong>
                    Utilizing Concurrent Rendering and selective hydration for an FCP &lt; 1.2s.
                  </li>
                  <li className="bg-techbridge-cream dark:bg-slate-900 p-6 rounded-2xl border border-techbridge-beige">
                    <strong className="text-techbridge-burgundy block mb-2 uppercase text-xs">Uplink Gateway</strong>
                    Gemini 1.5 Flash integration with custom system instructions for academic precision.
                  </li>
               </ul>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="max-w-none animate-in slide-in-from-left-4 duration-500">
            <h3 className="text-2xl font-black text-techbridge-burgundy dark:text-techbridge-gold uppercase">Administrator Operating Guide</h3>
            <div className="space-y-6 mt-8">
              <div className="bg-techbridge-burgundy/5 p-8 rounded-[2.5rem] border border-techbridge-burgundy/10 font-sans">
                <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-techbridge-burgundy">Security Access Protocol</h4>
                <p className="text-sm font-medium">The Control Node utilizes a static validation handshake for development environments. Production nodes utilize OAuth2/SAML university single sign-on.</p>
              </div>
              <div className="bg-techbridge-gold/5 p-8 rounded-[2.5rem] border border-techbridge-gold/20 font-sans">
                <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-techbridge-burgundy">Audit Log Management</h4>
                <p className="text-sm font-medium">Telemetry is captured via <code>AuditLogService</code>. Actions exceeding priority level 4 (Login failures, system purges) trigger immediate node isolation alerts.</p>
              </div>
            </div>
          </div>
        );
      case 'deployment':
        return (
          <div className="max-w-none animate-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-black text-techbridge-burgundy dark:text-techbridge-gold uppercase">Deployment Architecture</h3>
            <div className="mt-8 space-y-4">
              {[
                { step: 1, title: 'Asset Generation', desc: 'Execute build pipeline to generate optimized ESM chunks.' },
                { step: 2, title: 'Edge Distribution', desc: 'Sync static assets with the Oyibi Campus Edge CDN.' },
                { step: 3, title: 'SSL Verification', desc: 'Validate TLS 1.3 certificates for secure communication.' }
              ].map(s => (
                <div key={s.step} className="flex gap-6 items-start bg-white dark:bg-slate-800 p-6 rounded-3xl border border-techbridge-beige dark:border-slate-700 shadow-sm font-sans">
                  <span className="w-12 h-12 bg-techbridge-burgundy text-white flex items-center justify-center rounded-2xl font-black text-xl flex-shrink-0">{s.step}</span>
                  <div>
                    <h4 className="font-black uppercase text-xs tracking-widest text-techbridge-burgundy dark:text-white mb-1">{s.title}</h4>
                    <p className="text-sm text-gray-500 font-medium">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'testing':
        return (
          <div className="max-w-none animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-black text-techbridge-burgundy dark:text-techbridge-gold uppercase">QA & Verification Protocol</h3>
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] font-sans">
                <h4 className="font-bold text-techbridge-gold uppercase text-xs tracking-widest mb-4">Automation Logic</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Headless browser flows (Puppeteer) are executed every 6 hours to verify navigation integrity and search indexing efficiency across the directory.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] font-sans">
                <h4 className="font-bold text-techbridge-gold uppercase text-xs tracking-widest mb-4">Visual Audit</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Screen-buffer comparison ensures high-contrast modes and mobile responsiveness remain compliant with TUC accessibility standards (WCAG 2.1).</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-28 pb-12 px-4 md:px-8 lg:px-16 bg-techbridge-cream dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h2 className="text-6xl font-black dark:text-white mb-4 tracking-tighter uppercase text-techbridge-burgundy">Knowledge Base</h2>
          <div className="h-2 w-24 bg-techbridge-gold rounded-full mb-6"></div>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Technical specifications and university operational guides.</p>
        </header>

        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { id: 'architecture', label: 'Topology & Logic', icon: '🏗️' },
            { id: 'admin', label: 'Admin Guide', icon: '🛡️' },
            { id: 'deployment', label: 'Cloud Pipeline', icon: '☁️' },
            { id: 'testing', label: 'Testing Protocol', icon: '🧪' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-techbridge-burgundy text-white shadow-xl shadow-techbridge-burgundy/20 scale-105' 
                  : 'bg-white text-techbridge-burgundy hover:bg-techbridge-beige border border-techbridge-beige'
              }`}
            >
              <span className="mr-2">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[500px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
