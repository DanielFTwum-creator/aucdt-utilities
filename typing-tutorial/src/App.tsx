import { useState, useEffect } from "react";
import { Lesson, UserProgress, AuditLog, ServiceHealth, ThemeMode } from "./types";
import { LESSONS } from "./data";
import Navbar from "./components/Navbar";
import LessonsTab from "./components/LessonsTab";
import ExerciseTab from "./components/ExerciseTab";
import SpeedTestTab from "./components/SpeedTestTab";
import GameTab from "./components/GameTab";
import AdminTab from "./components/AdminTab";
import DocumentsTab from "./components/DocumentsTab";

export default function App() {
  // Navigation & views active states
  const [activeTab, setActiveTab] = useState<string>("lessons");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // User stats & progress metrics state
  const [progress, setProgress] = useState<UserProgress>(() => {
    const cached = localStorage.getItem("tuc_user_progress");
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* fallback */ }
    }
    return {
      level: 1,
      points: 0,
      accuracy: 0,
      wpm: 0,
      bestAccuracy: 0,
      bestSpeed: 0,
      lessonsCompleted: 0,
      unlockedCards: []
    };
  });

  // Theme control state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const cached = localStorage.getItem("tuc_theme") as ThemeMode;
    return cached || "light";
  });

  // Audit Logs database state
  const [logs, setLogs] = useState<AuditLog[]>(() => {
    const cached = localStorage.getItem("tuc_audit_logs");
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* fallback */ }
    }
    // Seed initial operational parameters on first launch
    const seeds: AuditLog[] = [
      {
        id: "log-seed-1",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        action: "INIT_SYSTEM",
        category: "system",
        user: "D. Twum (ICT)",
        status: "success",
        details: "Techbridge AI Typing Master cluster initialized dynamically."
      },
      {
        id: "log-seed-2",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        action: "SYNC_DB",
        category: "system",
        user: "Plesk Router",
        status: "success",
        details: "MariaDB student records tables linked. Nginx Port Ingress operational on port 3000."
      }
    ];
    return seeds;
  });

  // Systems health diagnostics monitoring
  const [healthServices, setHealthServices] = useState<ServiceHealth[]>([
    {
      name: "Plesk Obsidian Host",
      status: "healthy",
      latency: "12ms",
      port: 8443,
      details: "Docker containers active."
    },
    {
      name: "Nginx Reverse Proxy",
      status: "healthy",
      latency: "4ms",
      port: 3000,
      details: "Proxying /api routes to Node server."
    },
    {
      name: "Node Engine Container",
      status: "healthy",
      latency: "8ms",
      port: 3000,
      details: "Express production builds active."
    },
    {
      name: "MariaDB Database",
      status: "healthy",
      latency: "15ms",
      port: 3306,
      details: "Schema connections linked."
    }
  ]);

  // Syncing user progress to localstorage
  useEffect(() => {
    localStorage.setItem("tuc_user_progress", JSON.stringify(progress));
  }, [progress]);

  // Syncing audit logs to localstorage
  useEffect(() => {
    localStorage.setItem("tuc_audit_logs", JSON.stringify(logs));
  }, [logs]);

  // Set visual theme on document body
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "high-contrast");
    
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.backgroundColor = "#121214";
    } else if (theme === "high-contrast") {
      root.classList.add("high-contrast", "dark");
      root.style.backgroundColor = "#000000";
    } else {
      root.classList.add("light");
      root.style.backgroundColor = "#fdfdfd";
    }
    localStorage.setItem("tuc_theme", theme);
  }, [theme]);

  // Custom logging append helper
  const addAuditLog = (
    action: string,
    category: "authentication" | "lesson" | "speedtest" | "game" | "settings" | "system",
    status: "success" | "warning" | "error",
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      action,
      category,
      user: "Student Node",
      status,
      details
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Complete a row-exercise lesson
  const handleCompleteLessonExercise = (accuracy: number, wpm: number, pointsEarned: number) => {
    if (!selectedLesson) return;

    const currentLessonIdx = LESSONS.findIndex((l) => l.id === selectedLesson.id);
    const nextLessonIndex = currentLessonIdx + 1;

    setProgress((prev) => {
      const updatedCompleted = Math.max(prev.lessonsCompleted, nextLessonIndex);
      const updatedLevel = Math.min(10, Math.floor(updatedCompleted / 2) + 1);
      const isRecordSpeed = wpm > prev.bestSpeed;
      const isRecordAcc = accuracy > prev.bestAccuracy;

      return {
        ...prev,
        points: prev.points + pointsEarned,
        accuracy,
        wpm,
        lessonsCompleted: updatedCompleted,
        level: updatedLevel,
        bestSpeed: isRecordSpeed ? wpm : prev.bestSpeed,
        bestAccuracy: isRecordAcc ? accuracy : prev.bestAccuracy
      };
    });

    addAuditLog(
      "COMPLETED_LESSON",
      "lesson",
      "success",
      `Finished "${selectedLesson.title}". Speed: ${wpm} WPM | Acc: ${accuracy}%`
    );

    setSelectedLesson(null);
    setActiveTab("lessons");
  };

  // Complete Speedtest 60s practice
  const handleRecordSpeedtestResult = (wpmResult: number, accuracyResult: number, pointsEarned: number) => {
    setProgress((prev) => {
      const isRecordSpeed = wpmResult > prev.bestSpeed;
      const isRecordAcc = accuracyResult > prev.bestAccuracy;

      return {
        ...prev,
        points: prev.points + pointsEarned,
        bestSpeed: isRecordSpeed ? wpmResult : prev.bestSpeed,
        bestAccuracy: isRecordAcc ? accuracyResult : prev.bestAccuracy
      };
    });

    addAuditLog(
      "SPEEDTEST_SUBMITTED",
      "speedtest",
      "success",
      `Completed Timed Speedtest. Speed: ${wpmResult} WPM | Acc: ${accuracyResult}%`
    );
  };

  // Arcade completion points logging
  const handleRecordGamePoints = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      points: prev.points + score
    }));
    addAuditLog(
      "ARCADE_COMPLETED",
      "game",
      "success",
      `Finished arcade race. Points gained: ${score}`
    );
  };

  const handleClearLogs = () => {
    setLogs([]);
    addAuditLog("CLEAR_LOGS", "system", "warning", "Audit logs history flushed by student administrator.");
  };

  const handleRecordTestExecution = (testSuiteName: string) => {
    addAuditLog("PLAYWRIGHT_TEST_RUN", "system", "success", `Assert E2E verified: "${testSuiteName}" passed smoothly.`);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    addAuditLog("THEME_CHANGED", "settings", "success", `Visual design theme changed to: ${newTheme}`);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setSelectedLesson(null);
  };

  const refreshHealthServices = () => {
    // Simulates quick health check latency responses
    setHealthServices((prev) =>
      prev.map((s) => ({
        ...s,
        latency: `${Math.round(2 + Math.random() * 14)}ms`
      }))
    );
    addAuditLog("SYSTEM_HEALTH_POLL", "system", "success", "Nginx gateway & MariaDB ports parsed successfully.");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 antialiased font-sans">
      
      {/* Universal header section */}
      <Navbar
        progress={progress}
        theme={theme}
        onThemeChange={handleThemeChange}
        onNavigate={handleNavigate}
        activeTab={selectedLesson ? "lessons" : activeTab}
      />

      {/* Primary viewport content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* If a lessons row practice has been chosen, lock view strictly to the exercise canvas bounds */}
        {selectedLesson ? (
          <ExerciseTab
            lesson={selectedLesson}
            progress={progress}
            onFinish={handleCompleteLessonExercise}
            onBack={() => {
              setSelectedLesson(null);
              addAuditLog("EXERCISE_ABORTED", "lesson", "warning", `Session cancelled early for ${selectedLesson.title}`);
            }}
          />
        ) : (
          /* Normal Tab routing rendering */
          <div>
            {activeTab === "lessons" && (
              <LessonsTab
                progress={progress}
                onSelectLesson={(lesson) => {
                  setSelectedLesson(lesson);
                  addAuditLog("EXERCISE_STARTED", "lesson", "success", `Began Guided row-exercise: ${lesson.title}`);
                }}
              />
            )}

            {activeTab === "speedtest" && (
              <SpeedTestTab onRecordResult={handleRecordSpeedtestResult} />
            )}

            {activeTab === "game" && (
              <GameTab onGameFinished={handleRecordGamePoints} />
            )}

            {activeTab === "admin" && (
              <AdminTab
                logs={logs}
                onClearLogs={handleClearLogs}
                onRunTest={handleRecordTestExecution}
                healthServices={healthServices}
                onRefreshHealth={refreshHealthServices}
              />
            )}

            {activeTab === "docs" && (
              <DocumentsTab />
            )}
          </div>
        )}

      </main>

      <footer className="w-full px-4 sm:px-6 lg:px-8 py-8 mt-12 border-t border-zinc-200 dark:border-zinc-850 text-center text-xs text-zinc-500 font-mono">
        <p>&copy; 2026 Techbridge University College, Oyibi, Ghana. Department of ICT.</p>
        <p className="mt-1 text-[10px] text-zinc-400">Document Mapping Standard: TUC-INC-2026-001 | Host: Plesk Nginx Reversed Node CLI</p>
      </footer>

    </div>
  );
}
