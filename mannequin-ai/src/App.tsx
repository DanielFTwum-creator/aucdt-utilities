import React, { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { ModuleDetail } from "./components/ModuleDetail";
import { Sidebar } from "./components/Sidebar";
import { MODULES } from "./constants";
import { ThemeProvider, useTheme } from "./hooks/useTheme";
import "./styles/global.css";

const HeroSection = ({ onEnter }: { onEnter: () => void }) => {
  const { colors } = useTheme();
  return (
    <div className="h-screen flex items-center justify-center flex-col kente-bg" style={{ background: colors.bg }}>
       <h1 className="text-9xl font-light leading-none mb-4" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>
        Mannequin<span className="block italic gold-shimmer">AI</span>
      </h1>
      <button onClick={onEnter} className="px-8 py-3 bg-gold text-black uppercase font-bold tracking-widest rounded-sm mt-10 hover:opacity-80 transition-opacity">
        Enter Platform
      </button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>("landing");
  const [isAdmin] = useState(false);
  const { colors } = useTheme();

  if (activeModule === "landing") {
    return <HeroSection onEnter={() => setActiveModule("dashboard")} />;
  }

  const selectedModule = MODULES.find(m => m.id === activeModule);

  return (
    <div className="flex min-h-screen" style={{ background: colors.bg }}>
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule} 
        isAdmin={isAdmin} 
      />
      <main className="flex-1 overflow-y-auto">
        {activeModule === "dashboard" && <Dashboard setActiveModule={setActiveModule} />}
        {selectedModule && <ModuleDetail module={selectedModule} />}
        {activeModule !== "dashboard" && !selectedModule && (
          <div className="p-10" style={{ color: colors.text }}>
            Admin Console - Coming Soon
          </div>
        )}
      </main>
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
