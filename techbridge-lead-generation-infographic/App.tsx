import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsSection from './components/StatsSection';
import ProgramsSection from './components/ProgramsSection';
import FeaturesSection from './components/FeaturesSection';
import CtaSection from './components/CtaSection';
import AuditLog from './components/AuditLog';
import type { AuditLogEntry } from './types';

const App: React.FC = () => {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    try {
      const savedLog = window.localStorage.getItem('aucdt_submission_log');
      return savedLog ? JSON.parse(savedLog) : [];
    } catch (error) {
      console.error("Failed to parse audit log from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('aucdt_submission_log', JSON.stringify(auditLog));
    } catch (error) {
      console.error("Failed to save audit log to localStorage", error);
    }
  }, [auditLog]);

  const addAuditLogEntry = (entry: AuditLogEntry) => {
    setAuditLog(prevLog => [entry, ...prevLog]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B1538] via-[#A52A4A] to-[#8B1538] py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <main className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 border-2 border-yellow-500/30 overflow-hidden">
        <Header />
        <div className="p-6 sm:p-10 md:p-12 space-y-12">
          <StatsSection />
          <ProgramsSection />
          <FeaturesSection />
          <CtaSection addAuditLogEntry={addAuditLogEntry} />
        </div>
      </main>
      <div className="max-w-4xl mx-auto mt-4">
          <AuditLog logEntries={auditLog} setLogEntries={setAuditLog} />
      </div>
    </div>
  );
};

export default App;