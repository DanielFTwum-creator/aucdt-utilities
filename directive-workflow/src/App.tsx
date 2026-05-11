import React, { useState } from "react";
import { PhaseCard } from "./components/PhaseCard";
import { ProjectDownloader } from "./components/ProjectDownloader";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { PHASES } from "./data/phases";
import { ThemeProvider } from "./hooks/useTheme";
import "./styles/global.css";

const AppContent: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("session");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const activePhase = PHASES.find(p => p.id === activeId) || PHASES[0];
  const doneCount = Object.values(completed).filter(Boolean).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(activePhase.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleDone = () => {
    setCompleted(prev => ({
      ...prev,
      [activeId]: !prev[activeId]
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--secondary)]/30">
      <Sidebar 
        activeId={activeId} 
        completed={completed} 
        onSelect={setActiveId} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar doneCount={doneCount} total={PHASES.length} />
        
        <main className="flex-1 flex flex-col min-h-0">
          <PhaseCard 
            phase={activePhase}
            isDone={!!completed[activeId]}
            onToggleDone={toggleDone}
            onCopy={handleCopy}
            copied={copied}
          />
          <ProjectDownloader />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
