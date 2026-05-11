
import React, { useState } from 'react';
import { FileText, Layers, Users, Server, HardDrive, ShieldCheck } from 'lucide-react';

const SystemDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SRS' | 'ARCH' | 'GUIDE'>('SRS');

  const ArchitectureDiagram = () => (
    <div className="bg-slate-900 p-8 rounded-[2rem] border-2 border-brand-maroon/20 shadow-2xl overflow-hidden flex items-center justify-center">
      <svg viewBox="0 0 800 500" className="w-full h-auto max-w-4xl text-brand-gold">
        <rect x="300" y="50" width="200" height="60" rx="10" fill="#6B1D1D" stroke="#F4C430" strokeWidth="2" />
        <text x="400" y="85" textAnchor="middle" fill="#F4C430" fontSize="14" fontWeight="bold">REACT CLIENT APP</text>
        
        <path d="M400 110 V160" stroke="#F4C430" strokeWidth="2" strokeDasharray="5,5" />
        
        <rect x="250" y="160" width="300" height="100" rx="15" fill="#4A1515" stroke="#F4C430" strokeWidth="2" />
        <text x="400" y="195" textAnchor="middle" fill="#F4C430" fontSize="14" fontWeight="bold">ICT GATEWAY (AUTH & LOGIC)</text>
        <text x="400" y="220" textAnchor="middle" fill="#FFF" fontSize="10" opacity="0.7">Spring Boot 3.x | JWT | Audit Log</text>
        
        <path d="M400 260 V310" stroke="#F4C430" strokeWidth="2" />
        
        <rect x="325" y="310" width="150" height="80" rx="10" fill="#222" stroke="#F4C430" strokeWidth="2" />
        <text x="400" y="345" textAnchor="middle" fill="#F4C430" fontSize="14" fontWeight="bold">MARIADB</text>
        <text x="400" y="365" textAnchor="middle" fill="#FFF" fontSize="10" opacity="0.7">Persistent Ledger</text>
        
        <rect x="580" y="170" width="120" height="60" rx="10" fill="#333" stroke="#F4C430" strokeWidth="2" />
        <text x="640" y="205" textAnchor="middle" fill="#F4C430" fontSize="14" fontWeight="bold">REDIS</text>
        
        <path d="M550 210 H580" stroke="#F4C430" strokeWidth="2" />
        <circle cx="400" cy="450" r="30" fill="#6B1D1D" stroke="#F4C430" strokeWidth="2" />
        <text x="400" y="455" textAnchor="middle" fill="#F4C430" fontSize="12" fontWeight="bold">DOCKER</text>
      </svg>
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex gap-4">
        {[
          { id: 'SRS', label: 'IEEE SRS', icon: <FileText size={18}/> },
          { id: 'ARCH', label: 'Architecture Diagram', icon: <Layers size={18}/> },
          { id: 'GUIDE', label: 'Admin Guide', icon: <ShieldCheck size={18}/> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs tracking-widest transition-all ${activeTab === tab.id ? 'bg-brand-maroon text-brand-gold shadow-lg scale-105' : 'bg-white border border-slate-100 text-slate-400 hover:text-brand-maroon'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-12 rounded-[3rem] border-2 border-brand-maroon/5 shadow-2xl space-y-8 animate-slide">
        {activeTab === 'SRS' && (
          <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-black text-brand-maroon border-b-4 border-brand-gold pb-4 inline-block">1. Introduction</h2>
            <p className="mt-6 text-slate-600 leading-relaxed font-medium">The TechBridge Institutional Assessment Platform (IAP) serves as the primary technical evaluation engine for the TechBridge University College ICT Unit. It provides a standardized framework for evaluating full-stack competency with a focus on Spring Boot, MariaDB, and containerized deployment.</p>
            <h3 className="text-xl font-bold text-brand-maroon mt-8">2. Functional Requirements</h3>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-600">
              <li>Master Passcode Authentication (ICT Unit Access)</li>
              <li>Hierarchical Take-Home Directive Distribution</li>
              <li>Institutional Audit Logging (Security Compliant)</li>
              <li>Universal Accessibility (Light/Dark/High-Contrast)</li>
            </ul>
          </div>
        )}

        {activeTab === 'ARCH' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-brand-maroon">SYSTEM TOPOLOGY v1.0</h2>
            <ArchitectureDiagram />
          </div>
        )}

        {activeTab === 'GUIDE' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 rounded-3xl space-y-4">
                <div className="p-3 bg-brand-maroon text-brand-gold rounded-xl inline-block"><Users size={24}/></div>
                <h3 className="font-black text-brand-maroon">STAFF ONBOARDING</h3>
                <p className="text-xs text-slate-500 font-bold uppercase">Authorized Daniel Twum Directive</p>
                <ol className="list-decimal pl-4 text-sm text-slate-600 space-y-2">
                  <li>Assign Candidate ID through Question Bank</li>
                  <li>Monitor Take-Home completion in Review Queue</li>
                  <li>Generate Performance SVG for Deanery review</li>
                </ol>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl space-y-4">
                <div className="p-3 bg-brand-gold text-brand-maroon rounded-xl inline-block"><Server size={24}/></div>
                <h3 className="font-black text-brand-maroon">DEPLOYMENT SPECS</h3>
                <p className="text-xs text-slate-500 font-bold uppercase">DevOps Infrastructure</p>
                <code className="block bg-slate-900 text-brand-gold p-4 rounded-xl text-xs font-mono">
                  docker-compose up -d --build
                  <br/># MariaDB 10.11
                  <br/># Spring Boot 3.2.1
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemDocs;
