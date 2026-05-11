import { useState, useEffect } from "react";
import { 
  AnimatePresence 
} from "motion/react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { 
  TimelineView, 
  SegmentsView, 
  FunnelView, 
  ChecklistView,
  AdminView 
} from "./components/Views";

export default function App() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="flex min-h-screen bg-bg text-text">
      {/* ── SIDEBAR ── */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} setTheme={setTheme} />

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 md:pl-72 flex flex-col min-w-0">
        <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-12 lg:py-20">
          <Header />

          {/* Navigation for Mobile */}
          <div className="mb-10 flex gap-2 overflow-x-auto pb-4 no-scrollbar md:hidden">
            {[
              { id: 'timeline', label: 'Timeline' },
              { id: 'segments', label: 'Segments' },
              { id: 'funnel', label: 'Funnel' },
              { id: 'week1', label: 'Checklist' },
              { id: 'admin', label: 'Admin' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-full border px-6 py-2.5 text-xs font-bold transition-all shadow-sm ${
                  activeTab === tab.id 
                    ? "border-accent bg-accent text-white shadow-accent/20" 
                    : "border-border bg-card text-text-muted hover:bg-bg"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <div key={activeTab}>
              {activeTab === 'timeline' && <TimelineView />}
              {activeTab === 'segments' && <SegmentsView />}
              {activeTab === 'funnel' && <FunnelView />}
              {activeTab === 'week1' && <ChecklistView />}
              {activeTab === 'admin' && <AdminView />}
            </div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
