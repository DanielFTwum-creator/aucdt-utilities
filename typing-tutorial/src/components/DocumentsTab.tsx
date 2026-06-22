import { useState } from "react";
import { FileText, Cpu, Database, Award, Info, BookOpen, RefreshCw } from "lucide-react";

export default function DocumentsTab() {
  const [activeDoc, setActiveDoc] = useState<"architecture" | "erd" | "srs" | "reset" | "appstore" | "mobile" | "icons" | "privacy">("architecture");

  // Renders the System Architecture SVG Diagram with clean, modern visuals
  const renderArchitectureSVG = () => (
    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-center">
      <svg viewBox="0 0 800 500" className="w-full max-w-2xl h-auto font-mono text-[10px]">
        {/* Background definition */}
        <rect width="800" height="500" rx="16" fill="#0c0f17" />
        <grid className="opacity-10" />

        {/* Title */}
        <text x="40" y="40" fill="#f4f4f5" fontSize="16" fontWeight="bold">TUC SYSTEM INFRASTRUCTURE GRID (TUC-INC-2026-001)</text>
        <text x="40" y="58" fill="#71717a" fontSize="10">Nginx Reverse Proxy & Multi-Platform Packaging Architecture</text>

        {/* Client side block */}
        <rect x="50" y="100" width="220" height="340" rx="12" fill="#18181b" stroke="#27272a" strokeWidth="2" />
        <rect x="50" y="100" width="220" height="35" rx="12" fill="#3b82f6" fillOpacity="0.1" />
        <text x="65" y="122" fill="#3b82f6" fontWeight="bold">CLIENT TIERS (React + TS)</text>

        {/* Browser Core */}
        <rect x="70" y="155" width="180" height="80" rx="6" fill="#27272a" stroke="#ffffff" strokeOpacity="0.1" />
        <text x="85" y="175" fill="#e4e4e7" fontWeight="bold">Web Browser Sandbox</text>
        <text x="85" y="195" fill="#a1a1aa">★ HTML5 Local Storage</text>
        <text x="85" y="210" fill="#a1a1aa">★ Theme Presets & Logs</text>

        {/* Capacitor iOS / Android compiled core */}
        <rect x="70" y="255" width="180" height="160" rx="6" fill="#27272a" stroke="#ffffff" strokeOpacity="0.1" />
        <text x="85" y="275" fill="#e4e4e7" fontWeight="bold">Capacitor Wrapper (v8.3.3)</text>
        <text x="85" y="295" fill="#f43f5e">▶ Apple iOS arm64 Code</text>
        <text x="85" y="310" fill="#f43f5e">   • Xcode Archiving</text>
        <text x="85" y="335" fill="#10b981">▶ Google Android JVM</text>
        <text x="85" y="350" fill="#10b981">   • Gradle & JKS Keys</text>
        <text x="85" y="375" fill="#3b82f6">★ Touch Target Maps</text>
        <text x="85" y="390" fill="#3b82f6">★ Offline Core Engine</text>

        {/* Connector Line Broker */}
        <path d="M 270 270 L 370 270" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="370,270 360,265 360,275" fill="#f43f5e" />
        <text x="282" y="260" fill="#f43f5e" fontSize="8" fontWeight="bold">HTTPS ONLY</text>

        {/* Server Side Node */}
        <rect x="390" y="100" width="360" height="340" rx="12" fill="#18181b" stroke="#27272a" strokeWidth="2" />
        <rect x="390" y="100" width="360" height="35" rx="12" fill="#10b981" fillOpacity="0.1" />
        <text x="405" y="122" fill="#10b981" fontWeight="bold">PLESK OBSIDIAN DOCKER ENVIRONMENT (Ghana)</text>

        {/* Web Gate Reverse Proxy */}
        <rect x="410" y="155" width="140" height="110" rx="6" fill="#27272a" />
        <text x="425" y="175" fill="#a1a1aa" fontWeight="bold">Nginx Core Proxy</text>
        <text x="425" y="195" fill="#e4e4e7">✔ SSL Termination</text>
        <text x="425" y="210" fill="#e4e4e7">✔ Port Ingress Proxy</text>
        <text x="425" y="225" fill="#e4e4e7">✔ Custom Header Cors</text>
        <text x="425" y="240" fill="#e4e4e7">✔ Port Binding: 3000</text>

        {/* Node.js Running Server */}
        <rect x="410" y="285" width="140" height="130" rx="6" fill="#27272a" />
        <text x="425" y="305" fill="#a1a1aa" fontWeight="bold">Node.js Server</text>
        <text x="425" y="325" fill="#e4e4e7">✔ Express API Router</text>
        <text x="425" y="340" fill="#e4e4e7">✔ Webpack / Esbuild</text>
        <text x="425" y="355" fill="#e4e4e7">✔ Environment Setup</text>
        <text x="425" y="370" fill="#e4e4e7">✔ Health Monitor API</text>
        <text x="425" y="385" fill="#6366f1">✔ Port 3000 Endpoint</text>

        {/* MariaDB Databases block */}
        <rect x="580" y="155" width="150" height="260" rx="6" fill="#27272a" />
        <text x="595" y="175" fill="#a1a1aa" fontWeight="bold">MariaDB MySQL Server</text>
        <text x="595" y="200" fill="#3b82f6" fontWeight="bold">tuc_student_progress</text>
        <text x="595" y="215" fill="#71717a">  • student_id (PK)</text>
        <text x="595" y="230" fill="#71717a">  • current_level</text>
        <text x="595" y="245" fill="#71717a">  • points / speed</text>
        
        <text x="595" y="280" fill="#10b981" fontWeight="bold">tuc_audit_logs</text>
        <text x="595" y="295" fill="#71717a">  • log_id (PK)</text>
        <text x="595" y="310" fill="#71717a">  • timestamp</text>
        <text x="595" y="325" fill="#71717a">  • user_action</text>
        <text x="595" y="340" fill="#71717a">  • category / actor</text>

        {/* MySQL Internal data pipelines connecting */}
        <path d="M 550 220 L 580 220" stroke="#a1a1aa" strokeWidth="1.5" />
        <path d="M 550 350 L 580 350" stroke="#a1a1aa" strokeWidth="1.5" />
      </svg>
    </div>
  );

  // Renders the Database Entity Relationship Diagram (ERD) with standard schemas
  const renderErdSVG = () => (
    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-center">
      <svg viewBox="0 0 800 450" className="w-full max-w-2xl h-auto font-mono text-[10px]">
        {/* Background definition */}
        <rect width="800" height="450" rx="16" fill="#0d0e12" />

        <text x="40" y="40" fill="#f4f4f5" fontSize="16" fontWeight="bold">DATABASE ENTITY RELATIONSHIP DIAGRAM (ERD)</text>
        <text x="40" y="58" fill="#71717a" fontSize="10">Standard UML MariaDB schemas representing student performance metrics and logging entities</text>

        {/* Student Progress table entity */}
        <rect x="50" y="100" width="280" height="190" rx="8" fill="#161b22" stroke="#30363d" strokeWidth="2" />
        <rect x="50" y="100" width="280" height="30" rx="8" fill="#238636" fillOpacity="0.1" />
        <text x="65" y="120" fill="#2ea043" fontWeight="bold">tuc_student_progress (Table)</text>
        <line x1="50" y1="130" x2="330" y2="130" stroke="#30363d" />
        {/* Columns list */}
        <text x="65" y="148" fill="#e6edf3" fontWeight="bold">🔐 student_id</text>
        <text x="210" y="148" fill="#8b949e">VARCHAR(50)  [PK]</text>
        <text x="65" y="168" fill="#e6edf3">★ current_level</text>
        <text x="210" y="168" fill="#8b949e">INT DEFAULT 1</text>
        <text x="65" y="188" fill="#e6edf3">★ total_points</text>
        <text x="210" y="188" fill="#8b949e">INT DEFAULT 0</text>
        <text x="65" y="208" fill="#e6edf3">★ best_wpm</text>
        <text x="210" y="208" fill="#8b949e">INT DEFAULT 0</text>
        <text x="65" y="228" fill="#e6edf3">★ best_accuracy</text>
        <text x="210" y="228" fill="#8b949e">DECIMAL(5,2)</text>
        <text x="65" y="248" fill="#e6edf3">★ lessons_completed</text>
        <text x="210" y="248" fill="#8b949e">INT DEFAULT 0</text>
        <text x="65" y="268" fill="#e6edf3">★ updated_at</text>
        <text x="210" y="268" fill="#8b949e">TIMESTAMP [CURR]</text>

        {/* Audit Log table entity */}
        <rect x="470" y="100" width="280" height="170" rx="8" fill="#161b22" stroke="#30363d" strokeWidth="2" />
        <rect x="470" y="100" width="280" height="30" rx="8" fill="#1f6feb" fillOpacity="0.1" />
        <text x="485" y="120" fill="#58a6ff" fontWeight="bold">tuc_audit_logs (Table)</text>
        <line x1="470" y1="130" x2="750" y2="130" stroke="#30363d" />
        {/* Columns list */}
        <text x="485" y="148" fill="#e6edf3" fontWeight="bold">🔐 log_id</text>
        <text x="610" y="148" fill="#8b949e">VARCHAR(50)  [PK]</text>
        <text x="485" y="168" fill="#e6edf3">★ timestamp</text>
        <text x="610" y="168" fill="#8b949e">VARCHAR(30)</text>
        <text x="485" y="188" fill="#e6edf3">★ user_action</text>
        <text x="610" y="188" fill="#8b949e">VARCHAR(100)</text>
        <text x="485" y="208" fill="#e6edf3">★ category_class</text>
        <text x="610" y="208" fill="#8b949e">VARCHAR(30)</text>
        <text x="485" y="228" fill="#e6edf3">★ actor_user</text>
        <text x="610" y="228" fill="#8b949e">VARCHAR(50)</text>
        <text x="485" y="248" fill="#e6edf3">★ status_state</text>
        <text x="610" y="248" fill="#8b949e">VARCHAR(20)</text>

        {/* UML Relationship mapping connector (one-to-many relationship notation) */}
        <path d="M 330 195 L 400 195 L 400 185 L 470 185" stroke="#8b949e" strokeWidth="1.5" />
        {/* Cards endpoints logic */}
        <text x="340" y="188" fill="#8b949e" fontWeight="bold">1</text>
        <text x="455" y="178" fill="#8b949e" fontWeight="bold">0..*</text>
        
        {/* Info Box below mapping */}
        <rect x="50" y="325" width="700" height="75" rx="8" fill="#1c2128" stroke="#30363d" />
        <text x="65" y="348" fill="#848484" fontSize="9">Relation Key mapping model: Each individual Student Progress metrics record tracks performance indexes</text>
        <text x="65" y="363" fill="#848484" fontSize="9">internally and relates to several Audit Log records, reflecting sequential actions. This allows</text>
        <text x="65" y="378" fill="#848484" fontSize="9">Daniel Twum, Head of ICT, to troubleshoot system workflows and verify learner histories.</text>
      </svg>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          System Blueprints & Specifications
        </h2>
        <p className="text-xs text-zinc-500">
          Official engineering plans, UML blueprints, store processes, and compliance specs for Techbridge College.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left column: Sidebar document index */}
        <div className="md:col-span-1 space-y-2">
          <button
            id="view-doc-architecture-btn"
            onClick={() => setActiveDoc("architecture")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeDoc === "architecture"
                ? "bg-emerald-600 text-white shadow-sm font-black"
                : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Cpu size={14} />
            <span>Nginx Server Architecture</span>
          </button>

          <button
            id="view-doc-erd-btn"
            onClick={() => setActiveDoc("erd")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeDoc === "erd"
                ? "bg-emerald-600 text-white shadow-sm font-black"
                : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Database size={14} />
            <span>UML Database ERD</span>
          </button>

          <button
            id="view-doc-srs-btn"
            onClick={() => setActiveDoc("srs")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeDoc === "srs"
                ? "bg-emerald-600 text-white shadow-sm font-black"
                : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <BookOpen size={14} />
            <span>SRS Specification (UK English)</span>
          </button>

          <button
            id="view-doc-reset-btn"
            onClick={() => setActiveDoc("reset")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeDoc === "reset"
                ? "bg-emerald-600 text-white shadow-sm font-black"
                : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <RefreshCw size={14} />
            <span>Operations Reset Checklist</span>
          </button>

          <button
            id="view-doc-appstore-btn"
            onClick={() => setActiveDoc("appstore")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeDoc === "appstore"
                ? "bg-emerald-600 text-white shadow-sm font-black"
                : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Award size={14} />
            <span>App Store Submission SOP</span>
          </button>

          <button
            id="view-doc-mobile-btn"
            onClick={() => setActiveDoc("mobile")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeDoc === "mobile"
                ? "bg-emerald-600 text-white shadow-sm font-black"
                : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Cpu size={14} />
            <span>Capacitor Compiling SOP</span>
          </button>

          <button
            id="view-doc-icons-btn"
            onClick={() => setActiveDoc("icons")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeDoc === "icons"
                ? "bg-emerald-600 text-white shadow-sm font-black"
                : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Info size={14} />
            <span>Icon Sizing Specs</span>
          </button>

          <button
            id="view-doc-privacy-btn"
            onClick={() => setActiveDoc("privacy")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeDoc === "privacy"
                ? "bg-emerald-600 text-white shadow-sm font-black"
                : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <FileText size={14} />
            <span>GDPR Privacy Policy HTML</span>
          </button>
        </div>

        {/* Right column: Document details container */}
        <div className="md:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 overflow-hidden">
          
          {activeDoc === "architecture" && (
            <div className="space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white font-mono uppercase">
                  Nginx Server Reverse Proxy Setup (TUC-INC-2026-001)
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  UML Architecture diagram describing data payloads moving from compiled wrappers to Dockerized MariaDB setups.
                </p>
              </div>
              {renderArchitectureSVG()}
              <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-mono space-y-2">
                <p><strong>• Vite Web Integration:</strong> High speed assets reside locally and utilize browser structures. HMR switches seamlessly under local configurations.</p>
                <p><strong>• Capacitor Native Layers:</strong> Mirrors JavaScript code straight into Xcode/Android packages, and maps viewport boundaries to prevent scaling glitches.</p>
                <p><strong>• Nginx Reverse Proxy:</strong> Manages inbound SSL terminations and redirects packets natively to node processes on port 3000.</p>
              </div>
            </div>
          )}

          {activeDoc === "erd" && (
            <div className="space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white font-mono uppercase">
                  UML MariaDB Database Schema (TUC-ICT-SRS-2026-001)
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Entity relationship configurations detailing relations, unique keys, and column attributes.
                </p>
              </div>
              {renderErdSVG()}
              <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-mono space-y-2">
                <p><strong>• High Efficiency Indexes:</strong> The PK student_id is indexed natively inside database structures. This handles high student query lists cleanly.</p>
                <p><strong>• Transient Logs:</strong> tuc_audit_logs record specific micro events and clean up automatically to free up disk storage.</p>
              </div>
            </div>
          )}

          {activeDoc === "srs" && (
            <div className="space-y-4 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto pr-2">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white font-mono uppercase">
                  IEEE 830 / 29148 Spec (TUC-ICT-SRS-2026-001 · Rev 3)
                </h3>
                <p className="text-xs text-zinc-500">Full specification sheet — Daniel Twum, Head of ICT, Techbridge University College. Revised June 2026.</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded border border-zinc-200 dark:border-zinc-800 font-sans text-xs text-zinc-700 dark:text-zinc-300 space-y-4">
                <h4 className="font-bold text-sm text-zinc-950 dark:text-white">1.0 Scope</h4>
                <p>VortexType targets first-year computer literacy students at TUC, Ghana. The system delivers 11 progressive keyboard lessons (home row → top row → number row → bottom row → numeric keypad), a timed WPM speed test, two arcade game modes, and an admin audit panel — all deployed at <span className="font-mono">ai-tools.techbridge.edu.gh/typing-tutor/</span>.</p>

                <h4 className="font-bold text-sm text-zinc-950 dark:text-white">2.0 Functional Requirements</h4>
                <p><strong>FR-01 Lesson Engine:</strong> 11 lessons unlock progressively at ≥80% accuracy. Each lesson contains 4 randomised practice drills. Lessons 1–10 use the QWERTY hand diagram + per-finger colour coding. Lesson 11 activates the dedicated NumpadGuide ghost-hand overlay for the right-hand numeric keypad.</p>
                <p><strong>FR-02 Live Coaching:</strong> A finger-guidance coaching strip displays the next target key's finger assignment and home-row anchor in real time. A metronome BPM control (40–120 BPM) assists rhythmic pacing.</p>
                <p><strong>FR-03 WPM Speed Test:</strong> 60-second timed assessment with gross/net WPM, accuracy percentage, and points calculation. Results persist to LocalStorage.</p>
                <p><strong>FR-04 Arcade Mode — Arcade Race:</strong> 60/45/30-second word sprint (easy/medium/hard). Players type randomly selected words from a 1,050-word bank covering 24 thematic categories. Score multiplied by difficulty factor.</p>
                <p><strong>FR-05 Arcade Mode — Shark Attack:</strong> Words rise from the ocean floor toward a shark; the player must type the word before it is consumed. Three lives; word timer scales with difficulty (7 000 / 5 000 / 3 500 ms). Saved-word counter tracked per session.</p>
                <p><strong>FR-06 Admin Panel:</strong> Password-gated audit log panel displaying timestamped actions (lesson completions, speed tests, arcade sessions, theme changes). System health monitor for Nginx, Node, MariaDB, and Plesk services. Embedded Cypress E2E test launcher.</p>
                <p><strong>FR-07 Accessibility:</strong> Three themes — Light, Dark, High Contrast — persist to LocalStorage. All interactive controls meet a 44 px minimum touch target. Colour accents pass WCAG AA contrast at all theme levels.</p>

                <h4 className="font-bold text-sm text-zinc-950 dark:text-white">3.0 Design System</h4>
                <p>Visual identity: clean white / neutral-50 backgrounds, emerald-600 primary accent, emerald-50 tip strip backgrounds. Typography: system sans-serif, sentence case, no excessive all-caps. Navbar uses underline-style tab navigation. Lesson grid: 1 col (mobile) → 2 col (md) → 3 col (lg+), targeting ≤1 000 px total page height at 1 080 px viewport.</p>

                <h4 className="font-bold text-sm text-zinc-950 dark:text-white">4.0 Test Coverage</h4>
                <p><strong>full-keyboard-coverage.cy.ts:</strong> Exercises all 11 lesson tiers end-to-end (every QWERTY key, numpad digits/dot/dash, spacebar-highlight regression), the numpad ghost-hand guide, the per-finger colour-coded hand diagram, and a full Shark Attack arcade round.</p>
                <p><strong>ai-for-good.cy.ts:</strong> Verifies app load, theme accessibility toggle (Light/Dark/High Contrast), lesson initiation and exit flow, settings popover, and correct h2 headings on all five tab panels.</p>

                <h4 className="font-bold text-sm text-zinc-950 dark:text-white">5.0 Institutional Alignment</h4>
                <p>Host: Techbridge University College, Oyibi, Greater Accra, Ghana. Deployment: Plesk Obsidian → Nginx reverse proxy (port 3000) → Node.js container. Data: LocalStorage only; no student identifiers sent to external services. Complies with Ghana Data Protection Act 2012 (Act 843).</p>

                <h4 className="font-bold text-sm text-zinc-950 dark:text-white">6.0 Operational Integrity</h4>
                <p>Audit logging captures all lesson completions, speed tests, arcade sessions, theme changes, and admin actions with ISO 8601 timestamps. The Head of ICT accesses logs via a password-gated admin panel. Log data persists to LocalStorage and can be flushed via the Admin panel.</p>
              </div>
            </div>
          )}

          {activeDoc === "reset" && (
            <div className="space-y-4 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto pr-2">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white font-mono uppercase">
                  Operational Recovery Checklist (TUC-INC-2026-002)
                </h3>
                <p className="text-xs text-zinc-500">Step-by-step restoration model to synchronize app states during server glitches.</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded border border-zinc-200 dark:border-zinc-800 space-y-3 font-sans">
                <h4 className="font-bold text-xs text-zinc-950 dark:text-white">✔ Browser Reset workflow</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Instruct students to open Browser DevTools (F12) and toggle Storage. Flush `tuc_user_progress` and trigger a hard reload (F5) to clear cache files.</p>
                <h4 className="font-bold text-xs text-zinc-950 dark:text-white">✔ Environment Restart</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Log in to Plesk web host (ict-server.tuc.edu.gh:8443) and trigger restart pipelines on Node containers to resolve memory lock states.</p>
              </div>
            </div>
          )}

          {activeDoc === "appstore" && (
            <div className="space-y-4 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto pr-2">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white font-mono uppercase">
                  Google Play & App Store Submission Guide (TUC-INC-2026-004)
                </h3>
                <p className="text-xs text-zinc-500">Standard operating guidelines for mobile marketplace publishing.</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded border border-zinc-200 dark:border-zinc-800 space-y-3 font-sans">
                <h4 className="font-bold text-xs text-zinc-950 dark:text-white">✔ Apple App Store Connect Check</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Configure provisioning profiles on developer.apple.com to merge certificates and select com.techbridge.typingtutor ID. Compile Apple archives within Xcode workspace and distribute.</p>
                <h4 className="font-bold text-xs text-zinc-950 dark:text-white">✔ Google Play AAB Signing</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Open android packages on Android Studio. Generate Signed Android App Bundle (AAB), define keystore file passwords, compile outputs, and push to production console tracks.</p>
              </div>
            </div>
          )}

          {activeDoc === "mobile" && (
            <div className="space-y-4 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto pr-2 font-mono">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white font-mono uppercase">
                  Capacitor Compiling SOP (TUC-INC-2026-005)
                </h3>
                <p className="text-xs text-zinc-500">Android SDK paths, Cocoapod references, and packaging commands.</p>
              </div>
              <div className="p-3 bg-zinc-950 text-sky-400 rounded text-[10px] space-y-1">
                <div># Compile web stack to static dist</div>
                <div>npm run build</div>
                <div># Synchronise native wrapper platforms</div>
                <div>npx cap sync</div>
                <div># Open and compile within Xcode</div>
                <div>npx cap open ios</div>
                <div># Open and compile within Android Studio</div>
                <div>npx cap open android</div>
              </div>
            </div>
          )}

          {activeDoc === "icons" && (
            <div className="space-y-4 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto pr-2">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white font-mono uppercase">
                  Capacitor Launcher Icon Sizing Manifest (TUC-INC-2026-006)
                </h3>
                <p className="text-xs text-zinc-500">DPI ratios, iPad specs, and automated capacitor assets CLI generation scripts.</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded border border-zinc-200 dark:border-zinc-800 font-sans text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
                <p><strong>• Input Image Sizing:</strong> Root assets directory MUST contain high resolution templates: `assets/icon-only.png` (1024x1024px) & `assets/splash.png` (2732x2732px).</p>
                <p><strong>• Android Mimap standard:</strong> Outputs automatically compile sizes covering mdpi (48x48px), hdpi (72x72px), xhdpi (96x96px), xxhdpi (144x144px), and xxxhdpi (192x192px).</p>
              </div>
            </div>
          )}

          {activeDoc === "privacy" && (
            <div className="space-y-4 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto pr-2">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white font-mono uppercase">
                  CCPA / GDPR / GDPA Compliance Sheet (privacy.html)
                </h3>
                <p className="text-xs text-zinc-500">Ghana Data Protection Act 2012 (Act 843) aligned user policies.</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 space-y-3 font-sans text-xs">
                <p><strong>✔ Student Data Isolation:</strong> The platform processes speeds (WPM), mistakes, progress parameters entirely offline inside native client caches. No student identifiers map to external cloud storage.</p>
                <p><strong>✔ User Rights:</strong> Students retain rights to erase local metadata instantly by triggering "Reset Progress" or selecting hard caches wipes.</p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
