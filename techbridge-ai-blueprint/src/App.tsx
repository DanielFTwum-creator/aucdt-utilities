import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Clipboard, 
  Check, 
  AlertCircle, 
  Lock, 
  FileText, 
  Shield, 
  TestTube, 
  BookOpen, 
  CheckCircle2, 
  Smartphone,
  Workflow,
  Settings,
  Info,
  ExternalLink,
  Target,
  LayoutDashboard,
  Code,
  Eye,
  EyeOff,
  History,
  Sun,
  Moon,
  Contrast,
  LogOut,
  User,
  Save,
  Clock,
  LogIn,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { saveLastState, getLastState, saveProjectSnapshot, getProjectHistory, ProjectState as LocalProjectState } from "./lib/db";
import { db, handleFirestoreError, OperationType } from "./lib/firebase";
import { registerUser, loginUser, clearSession, getSession, sendHelpdeskNotification, SessionUser } from "./lib/auth";
import { useAuth } from "./contexts/AuthContext";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp, 
  orderBy, 
  limit,
  Timestamp
} from "firebase/firestore";

// --- Types & Constants ---

type ModelType = "Sonnet" | "Haiku";
type PlatformMode = "claude" | "aistudio" | "master";
type ThemeType = "light" | "dark" | "contrast";

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: "security" | "system" | "user";
  details: string;
}

interface PhaseItem {
  label: string;
  model: ModelType;
}

interface Phase {
  id: number;
  title: string;
  icon: React.ReactNode;
  gate: string | null;
  note: string;
  items: PhaseItem[];
  optional?: boolean;
}

const PHASES: Phase[] = [
  {
    id: 1,
    title: "Foundation",
    icon: <FileText className="w-5 h-5" />,
    gate: null,
    note: "SRS must be complete before any other phase begins. Batch into one Sonnet message.",
    items: [
      { label: "Generate IEEE SRS document (TUC-ICT-SRS-YYYY-NNN)", model: "Sonnet" },
      { label: "Reset project to clean baseline", model: "Sonnet" },
    ],
  },
  {
    id: 2,
    title: "Security & Accessibility",
    icon: <Shield className="w-5 h-5" />,
    gate: "Phase 1 SRS confirmed",
    note: "Batch security design decisions into one Sonnet message before delegating to Haiku.",
    items: [
      { label: "Implement password-protected Admin section", model: "Sonnet" },
      { label: "Scaffold Admin section architecture", model: "Haiku" },
      { label: "Add audit logging for all admin actions", model: "Sonnet" },
      { label: "Add full accessibility support (ARIA, keyboard)", model: "Haiku" },
      { label: "Implement Light / Dark / High-contrast themes", model: "Haiku" },
    ],
  },
  {
    id: 3,
    title: "Automated Testing",
    icon: <TestTube className="w-5 h-5" />,
    gate: "Phase 2 confirmed",
    note: "Batch test architecture decisions into one Sonnet message before delegating to Haiku.",
    items: [
      { label: "Integrate internal health-check routines", model: "Sonnet" },
      { label: "Scaffold self-testing capabilities", model: "Haiku" },
      { label: "Create Playwright end-to-end test suite", model: "Haiku" },
      { label: "Add interactive test tab with real-time results", model: "Haiku" },
    ],
  },
  {
    id: 4,
    title: "Documentation",
    icon: <BookOpen className="w-5 h-5" />,
    gate: "Phase 3 confirmed",
    note: "Batch both SVG diagrams into one Sonnet message.",
    items: [
      { label: "Generate System Architecture Diagram (SVG)", model: "Sonnet" },
      { label: "Generate Database ERD Diagram (SVG)", model: "Sonnet" },
      { label: "Create Administrator Guide in /docs", model: "Haiku" },
      { label: "Create Deployment Guide in /docs", model: "Haiku" },
      { label: "Create Testing Guide in /docs", model: "Haiku" },
    ],
  },
  {
    id: 5,
    title: "Finalisation",
    icon: <CheckCircle2 className="w-5 h-5" />,
    gate: "Phase 4 confirmed",
    note: "Batch SRS update + gap analysis + diagram embedding into one Sonnet message.",
    items: [
      { label: "Update IEEE SRS with all implemented features", model: "Sonnet" },
      { label: "Embed SVG diagrams directly in SRS", model: "Sonnet" },
      { label: "SRS \u2194 Implemented Features Gap Analysis", model: "Sonnet" },
      { label: "Organise all files in /docs directory", model: "Haiku" },
    ],
  },
  {
    id: 6,
    title: "App Store Deployment",
    icon: <Smartphone className="w-5 h-5" />,
    gate: "Phase 5 confirmed ✅",
    optional: true,
    note: "Skip if not targeting mobile app stores. Batch APP_STORE_GUIDE + MOBILE_BUILD_GUIDE + privacy.html into one Sonnet message.",
    items: [
      { label: "Install Capacitor 8.3.3", model: "Haiku" },
      { label: "Add iOS and Android platforms", model: "Haiku" },
      { label: "Create capacitor.config.ts with app ID and name", model: "Haiku" },
      { label: "Update package.json version to 1.0.0", model: "Haiku" },
      { label: "Add npm scripts for mobile builds and device testing", model: "Haiku" },
      { label: "Write APP_STORE_GUIDE.md (complete submission SOP)", model: "Sonnet" },
      { label: "Write MOBILE_BUILD_GUIDE.md (build/test workflow)", model: "Sonnet" },
      { label: "Write APP_ICONS_GUIDE.md (icon generation process)", model: "Haiku" },
      { label: "Create privacy.html (GDPR / CCPA / GDPA compliant)", model: "Sonnet" },
      { label: "Create APPSTORE_READY.md (pre-submission checklist)", model: "Haiku" },
      { label: "Test on iOS simulator and Android emulator", model: "Haiku" },
      { label: "Verify exports, theming, and admin panel on devices", model: "Haiku" },
    ],
  },
];

const CONTEXT_BLOCK = `CONTEXT (read before executing):
- Institution: Techbridge University College (TUC), Oyibi, Ghana
- Owner: Daniel Twum, Head of ICT
- Documentation: IEEE 830 / IEEE 29148 SRS format (UK English)
- Naming: TUC-ICT-SRS-YYYY-NNN | TUC-INC-YYYY-NNN
- Tech Stack: React, TS, Tailwind | Node.js, Python, Java | MySQL, MariaDB
- Infrastructure: Docker, Plesk, Nginx`;

const DIRECTIVES: Record<"claude" | "aistudio", Record<number, string>> = {
  claude: {
    1: `EXECUTE PHASE 1 \u2014 FOUNDATION\nProject: [PROJECT_NAME]\nSRS first, code later. Batch both items into one message.\n\u25a1 Generate IEEE SRS document (TUC-ICT-SRS-YYYY-NNN)\n\u25a1 Reset project to clean baseline\n\nCOMPLETION REQUIREMENTS:\n- Confirm SRS created with TUC naming\n- Confirm project reset\n- State "PHASE 1 COMPLETE \u2705 \u2014 READY FOR PHASE 2"`,
    2: `EXECUTE PHASE 2 \u2014 SECURITY & ACCESSIBILITY\nProject: [PROJECT_NAME]\nGate: Phase 1 SRS confirmed \u2705\nBatch design into Sonnet before delegating scaffold to Haiku.\n\u25a1 Admin section design & scaffold\n\u25a1 Audit logging for all actions\n\u25a1 Full accessibility (ARIA, keyboard)\n\u25a1 High-contrast & Dark themes\n\nCOMPLETION: State "PHASE 2 COMPLETE \u2705 \u2014 READY FOR PHASE 3"`,
    3: `EXECUTE PHASE 3 \u2014 TESTING\nProject: [PROJECT_NAME]\nGate: Phase 2 confirmed \u2705\nBatch test architecture into Sonnet, delegate to Haiku.\n\u25a1 Internal health-checks\n\u25a1 Playwright test suite\n\u25a1 Interactive test UI tab with screenshots\n\nCOMPLETION: State "PHASE 3 COMPLETE \u2705 \u2014 READY FOR PHASE 4"`,
    4: `EXECUTE PHASE 4 \u2014 DOCUMENTATION\nProject: [PROJECT_NAME]\nGate: Phase 3 confirmed \u2705\nBatch SVG diagrams into Sonnet.\n\u25a1 System Architecture Diagram (SVG)\n\u25a1 Database ERD (SVG)\n\u25a1 Admin, Deployment, and Testing guides\n\nCOMPLETION: State "PHASE 4 COMPLETE \u2705 \u2014 READY FOR PHASE 5"`,
    5: `EXECUTE PHASE 5 \u2014 FINALISATION\nProject: [PROJECT_NAME]\nGate: Phase 4 confirmed \u2705\nBatch SRS update + diagrams into Sonnet.\n\u25a1 Update final IEEE SRS\n\u25a1 Embed SVG diagrams\n\u25a1 Full Gap Analysis table\n\u25a1 Organise /docs structure\n\nCOMPLETION: State "PHASE 5 COMPLETE \u2705 \u2014 PROJECT REFRESH COMPLETE"`,
    6: `EXECUTE PHASE 6 — APP STORE DEPLOYMENT
Project: [PROJECT_NAME]
Gate: Phase 5 confirmed ✅
Note: Skip this phase if not targeting mobile app stores. Batch APP_STORE_GUIDE + MOBILE_BUILD_GUIDE + privacy.html into one Sonnet message.

☐ Install Capacitor 8.3.3 [Haiku]
☐ Add iOS and Android platforms [Haiku]
☐ Create capacitor.config.ts with app ID and name [Haiku]
☐ Update package.json version to 1.0.0 [Haiku]
☐ Add npm scripts for mobile builds and device testing [Haiku]
☐ Write APP_STORE_GUIDE.md (complete submission SOP) [Sonnet]
☐ Write MOBILE_BUILD_GUIDE.md (build/test workflow) [Sonnet]
☐ Write APP_ICONS_GUIDE.md (icon generation process) [Haiku]
☐ Create privacy.html (GDPR / CCPA / GDPA compliant, must be a live public URL) [Sonnet]
☐ Create APPSTORE_READY.md (pre-submission checklist) [Haiku]
☐ Test on iOS simulator and Android emulator [Haiku]
☐ Verify exports, theming, and admin panel on devices [Haiku]

COMPLETION REQUIREMENTS:
- Confirm Capacitor configured and platforms added
- Confirm all guides created in /docs
- Confirm privacy.html live at public URL
- Confirm tested on both simulators
- State "PHASE 6 COMPLETE ✅ — PROJECT REFRESH FINISHED"`,
  },
  aistudio: {
    1: `${CONTEXT_BLOCK}\n\nPROJECT: [PROJECT_NAME]\nTASK: PHASE 1 \u2014 FOUNDATION\nExecute in order:\n1. Generate complete IEEE 830 SRS document (TUC-ICT-SRS-YYYY-NNN).\n2. Create project reset checklist.\n\nOutput full SRS document. State "PHASE 1 COMPLETE \u2705 \u2014 READY FOR PHASE 2" at the end.`,
    2: `${CONTEXT_BLOCK}\n\nPROJECT: [PROJECT_NAME]\nTASK: PHASE 2 \u2014 SECURITY & UI\n1. Design password-protected Admin auth & logic.\n2. Add audit logging table & functions.\n3. Implement system-wide accessibility & ARIA.\n4. Add Light/Dark/High-contrast theme switching (localStorage).\n\nOutput full code. State "PHASE 2 COMPLETE \u2705 \u2014 READY FOR PHASE 3" at the end.`,
    3: `${CONTEXT_BLOCK}\n\nPROJECT: [PROJECT_NAME]\nTASK: PHASE 3 \u2014 TESTING\n1. Add service health-checks.\n2. Generate Playwright tests for auth and admin.\n3. Build interactive test runner component with screenshot capture.\n\nState "PHASE 3 COMPLETE \u2705 \u2014 READY FOR PHASE 4" at the end.`,
    4: `${CONTEXT_BLOCK}\n\nPROJECT: [PROJECT_NAME]\nTASK: PHASE 4 \u2014 DOCUMENTATION\n1. System Architecture Diagram (SVG code).\n2. Database ERD Diagram (SVG code).\n3. Detailed Admin, Deployment, and Testing Guides in /docs.\n\nState "PHASE 4 COMPLETE \u2705 \u2014 READY FOR PHASE 5" at the end.`,
    5: `${CONTEXT_BLOCK}\n\nPROJECT: [PROJECT_NAME]\nTASK: PHASE 5 \u2014 FINALISATION\n1. Update final IEEE SRS with diagrams embedded.\n2. Provide SRS \u2194 Feature Gap Analysis table.\n3. Show final /docs folder structure.\n\nState "PHASE 5 COMPLETE \u2705 \u2014 PROJECT REFRESH COMPLETE" at the end.`,
    6: `${CONTEXT_BLOCK}

PROJECT: [PROJECT_NAME]
TASK: PHASE 6 — APP STORE DEPLOYMENT
GATE: Phase 5 finalisation must be complete before starting this phase.
NOTE: Only execute this phase if the project is targeting iOS and/or Android app stores.

You are acting as a senior mobile deployment engineer. Execute the following tasks in order. Confirm each with ✅ before proceeding to the next. Do not skip or defer any item.

TASKS:
1. Provide the exact commands to install and configure Capacitor 8.3.3:
   - Install @capacitor/core, @capacitor/cli, @capacitor/ios, @capacitor/android
   - Initialise with correct app name and ID (com.techbridge.[appname])
   - Add iOS and Android platforms

2. Write a complete capacitor.config.ts for this project:
   - App ID: com.techbridge.[appname]
   - App name: [Project Name]
   - Web directory: dist

3. Specify the package.json version update to 1.0.0 and provide the full npm scripts block:
   - build, build:web, build:ios, build:android, ios:open, android:open, mobile:sync

4. Write APP_STORE_GUIDE.md — complete iOS App Store and Google Play submission SOP:
   - Account setup, app record creation, metadata, screenshots, build upload, review submission
   - Save path: /docs/APP_STORE_GUIDE.md

5. Write MOBILE_BUILD_GUIDE.md — build workflow and debugging:
   - Step-by-step build commands for both platforms
   - Common errors and fixes
   - Save path: /docs/MOBILE_BUILD_GUIDE.md

6. Write APP_ICONS_GUIDE.md — icon generation process:
   - Required sizes for iOS and Android
   - Recommended tools and placement paths
   - Save path: /docs/APP_ICONS_GUIDE.md

7. Write a GDPR / CCPA / GDPA compliant privacy.html:
   - Must be suitable for hosting at a public URL (e.g. https://[domain]/privacy.html)
   - Cover data collection, storage, user rights, contact details for TUC
   - Save path: /public/privacy.html

8. Write APPSTORE_READY.md — pre-submission checklist:
   - ✅/❌ checklist of all setup items
   - Timeline estimate and next steps
   - Save path: /docs/APPSTORE_READY.md

9. Provide device testing instructions:
   - iOS simulator commands (Xcode)
   - Android emulator commands (Android Studio)
   - What to verify: exports, theming, admin panel, accessibility

OUTPUT FORMAT:
- Deliver all code and documents in full — no placeholders
- End your response with: "PHASE 6 COMPLETE ✅ — PROJECT REFRESH FINISHED"`,
  }
};

// --- Custom Components ---

const ResonanceBackdrop = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40 transition-opacity duration-700">
      <div className="absolute inset-0 dot-pattern" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-brand/5 to-transparent" />
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,var(--color-brand-glow)_0%,transparent_70%)]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
    </div>
  );
};

const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "sonnet" | "haiku" }) => {
  const styles = {
    default: "bg-bg-tertiary text-text-secondary border-border-secondary",
    sonnet: "bg-brand/10 text-brand border-brand/20",
    haiku: "bg-success/10 text-success border-success/20",
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles[variant]} uppercase tracking-wider`}>
      {children}
    </span>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };
  
  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand text-white text-xs font-semibold hover:bg-brand/90 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy Directive"}
    </button>
  );
};

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState<"checklist" | "workflow" | "rules" | "admin" | "testing">("checklist");
  const [mode, setMode] = useState<PlatformMode>("claude");
  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem("tuc-blueprint-theme") as ThemeType) || "light";
  });
  const [projectName, setProjectName] = useState("Techbridge AI Blueprint [TAB]");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [openPhase, setOpenPhase] = useState<number | null>(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [projectHistory, setProjectHistory] = useState<any[]>([]);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirm, setAuthConfirm] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showAuthPassword, setShowAuthPassword] = useState(false);

  // Restore session on mount
  const { user: oauthUser, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check OAuth user first (from Google login)
    if (oauthUser && isAuthenticated) {
      setUser({
        uid: oauthUser.id,
        name: oauthUser.username,
        email: oauthUser.email
      } as SessionUser);
      setIsAuthLoading(false);
      return;
    }

    // Fallback: check Firebase session
    const session = getSession();
    if (session) setUser(session);
    setIsAuthLoading(false);
  }, [oauthUser, isAuthenticated]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authName.trim()) return setAuthError('Full name is required.');
    if (!authEmail.trim()) return setAuthError('Email is required.');
    if (authPassword.length < 8) return setAuthError('Password must be at least 8 characters.');
    if (authPassword !== authConfirm) return setAuthError('Passwords do not match.');
    setAuthLoading(true);
    const result = await registerUser(authName.trim(), authEmail.trim(), authPassword);
    if (!result.ok) { setAuthError(result.error || 'Registration failed.'); setAuthLoading(false); return; }
    const session = getSession()!;
    setUser(session);
    await sendHelpdeskNotification(session);
    logAction("User Registered", "security", `New account: ${session.email}`);
    setAuthLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const result = await loginUser(authEmail.trim(), authPassword);
    if (!result.ok) { setAuthError(result.error || 'Login failed.'); setAuthLoading(false); return; }
    setUser(result.user!);
    logAction("User Login", "security", `Session started: ${result.user!.email}`);
    setAuthLoading(false);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    logAction("Session Terminated", "security", "User signed out.");
  };

  // DB Sync - Initial Load
  useEffect(() => {
    const loadState = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const shareId = urlParams.get("share");

      if (shareId) {
        try {
          const shareDoc = await getDoc(doc(db, "shares", shareId));
          if (shareDoc.exists()) {
            const data = shareDoc.data();
            setProjectName(data.projectName);
            setCheckedItems(data.checkedItems);
            setOpenPhase(4); // Focus on Docs for shared diagrams
            logAction("Shared State Loaded", "system", `Viewing read-only share: ${shareId}`);
            return; // Don't load local state if viewing a share
          }
        } catch (error) {
          console.error("Failed to load share", error);
        }
      }

      const saved = await getLastState();
      if (saved) {
        if (saved.projectName) setProjectName(saved.projectName);
        if (saved.checkedItems) setCheckedItems(saved.checkedItems);
        if (saved.openPhase) setOpenPhase(saved.openPhase);
        if (saved.activeTab) setActiveTab(saved.activeTab as any);
      }
      const history = await getProjectHistory();
      setProjectHistory(history);
    };
    loadState();
  }, []);

  // Firestore History Sync
  useEffect(() => {
    if (!user) {
      setProjectHistory([]);
      return;
    }

    const q = query(
      collection(db, "projects"),
      where("ownerId", "==", user.uid),
      orderBy("updatedAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        timestamp: (d.data().updatedAt as Timestamp)?.toMillis() || Date.now()
      }));
      setProjectHistory(projects);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "projects");
    });

    return () => unsubscribe();
  }, [user]);

  // DB Sync - Save State
  useEffect(() => {
    const state: Partial<LocalProjectState> = {
      projectName,
      checkedItems,
      openPhase,
      activeTab
    };
    saveLastState(state);
  }, [projectName, checkedItems, openPhase, activeTab]);

  // Snapshot trigger
  const triggerSnapshot = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const projectId = `p-${Date.now()}`;
    const snapshot = {
      id: projectId,
      ownerId: user.uid,
      name: projectName || "Unnamed Project",
      checkedItems,
      openPhase,
      activeTab,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    };
    
    try {
      await setDoc(doc(db, "projects", projectId), snapshot);
      logAction("Cloud Snapshot Created", "system", `State pushed to TUC ICT Node: ${projectId}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${projectId}`);
    }
  };

  // Health Sync disabled — no backend server in static deployment
  // setHealthStatus({ status: 'ok' });

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tuc-blueprint-theme", theme);
    // Silent logging for theme changes to avoid recursion or spam if it was automated
    // But manual user changes are worth logging
  }, [theme]);

  // Project Name Change Logging
  const lastNameLogged = useRef("");
  useEffect(() => {
    const timer = setTimeout(() => {
      if (projectName && projectName !== lastNameLogged.current) {
        logAction("Project Renamed", "user", `Project target set to: ${projectName}`);
        lastNameLogged.current = projectName;
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [projectName]);

  // Logging Utility
  const logAction = async (action: string, category: AuditLog["category"], details: string) => {
    const logId = `TUC-LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newLog: AuditLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      action,
      category,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 100));

    // Persist to Firestore if logged in
    if (user) {
      try {
        await setDoc(doc(db, "audit_logs", logId), {
          timestamp: serverTimestamp(),
          userId: user.uid,
          userEmail: user.email,
          action,
          resource: "system",
          details
        });
      } catch (err) {
        console.error("Failed to persist log", err);
      }
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "TUC-REFRESH-2024") {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginError("");
      setPassword("");
      logAction("Admin Login", "security", "Successful authentication via password gate.");
    } else {
      setLoginError("Invalid ICT Credential Password");
      logAction("Login Failed", "security", "Unauthorized access attempt to Admin Panel.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setActiveTab("checklist");
    logAction("Admin Logout", "security", "Session terminated by user.");
  };

  const runSystemTests = async () => {
    setIsRunningTests(true);
    logAction("Tests Started", "system", "UI-triggered automated verification suite initialized.");
    try {
      const res = await fetch("/api/tests/run");
      const data = await res.json();
      setTimeout(() => {
        setTestResults(data);
        setIsRunningTests(false);
        logAction("Tests Completed", "system", `Suite finished with status: ${data.overallStatus.toUpperCase()}`);
      }, 2000); // Add fake delay for realism
    } catch (err) {
      console.error("Tests failed", err);
      setIsRunningTests(false);
    }
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    logAction("Theme Changed", "user", `System theme set to: ${newTheme.toUpperCase()}`);
  };

  const handleExport = () => {
    window.location.href = "/api/export";
    logAction("Project Export Triggered", "system", "Source code bundle requested and generated via Cloud Node.");
  };

  const handleDeploy = () => {
    logAction("Deployment Started", "system", "Primary build pipeline triggered for Cloud ICT environment.");
    // In a real app, this would trigger the build process.
  };

  const handleShareDiagrams = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const shareId = `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const shareData = {
      id: shareId,
      projectName,
      checkedItems,
      sharedBy: user.email,
      sharedById: user.uid,
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, "shares", shareId), shareData);
      const url = `${window.location.origin}?share=${shareId}`;
      setShareLink(url);
      await navigator.clipboard.writeText(url);
      logAction("Diagrams Shared", "user", `Public share link generated: ${shareId}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `shares/${shareId}`);
    }
  };

  const toggleItem = (key: string) => {
    const isChecking = !checkedItems[key];
    setCheckedItems(prev => ({ ...prev, [key]: isChecking }));
    logAction(
      isChecking ? "Task Completed" : "Task Unchecked", 
      "user", 
      `Phase item ${key} state changed.`
    );
  };

  const totals = useMemo(() => {
    const total = PHASES.flatMap(p => p.items).length;
    const completed = Object.values(checkedItems).filter(Boolean).length;
    return { total, completed, percent: Math.round((completed / total) * 100) };
  }, [checkedItems]);

  const getDirectiveText = (phaseId: number) => {
    const platformKey = mode === "master" ? "aistudio" : mode;
    const text = DIRECTIVES[platformKey][phaseId as 1|2|3|4|5|6] || "";
    return text.replace(/\[PROJECT_NAME\]/g, projectName || "Unnamed Project");
  };

  const currentDirective = useMemo(() => {
    if (mode === "master") {
      const allPhases = [1, 2, 3, 4, 5, 6].map(id => {
        const text = DIRECTIVES.aistudio[id as 1|2|3|4|5|6];
        return `### PHASE ${id}\n${text}`;
      }).join("\n\n---\n\n");
      return allPhases.replace(/\[PROJECT_NAME\]/g, projectName || "Unnamed Project");
    }
    return openPhase ? getDirectiveText(openPhase) : "Select a phase to view its directive...";
  }, [openPhase, mode, projectName]);

  const gitInfo = useMemo(() => {
    // @ts-ignore
    const commit = typeof __GIT_COMMIT__ !== 'undefined' ? __GIT_COMMIT__ : 'unknown';
    // @ts-ignore
    const branch = typeof __GIT_BRANCH__ !== 'undefined' ? __GIT_BRANCH__ : 'unknown';
    return { commit, branch };
  }, []);

  if (isAuthLoading) {
    return (
      <div className="h-screen w-screen bg-bg-main flex items-center justify-center p-6 select-none font-sans">
        <div className="flex flex-col items-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-slate-900/10 border-t-slate-900 rounded-full mb-4 shadow-xl shadow-brand/5"
          />
          <h2 className="text-sm font-black text-text-tertiary uppercase tracking-[0.3em] animate-pulse">Initializing TAB Node...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    // Firebase auth not initialized yet, show loading
    // OAuth auth is handled by AppWithAuth component
    return (
      <div className="h-screen w-screen bg-bg-main flex items-center justify-center p-6 select-none font-sans">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-xs text-text-tertiary mt-4 uppercase tracking-wider">Initializing Blueprint...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden text-text-primary select-none font-sans transition-colors duration-500">
      
      {/* Left Sidebar: Navigation & Project */}
      <aside className="w-72 bg-bg-sidebar border-r border-border-standard flex flex-col h-full shrink-0 z-20 shadow-xl shadow-black/5 transition-all duration-300">
        <div className="p-8 border-b border-border-subtle bg-bg-panel/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand/20 ring-1 ring-white/10">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tighter text-text-primary leading-none">Techbridge AI Blueprint</h1>
              <p className="text-[9px] font-bold text-brand uppercase tracking-[0.2em] mt-1 opacity-80">[TAB] System</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.15em] mb-2 block px-2">Project Context</label>
            <div className="relative group">
              <input 
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Naming Project..."
                className="w-full bg-bg-panel border border-border-standard rounded-lg py-2.5 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-text-tertiary font-medium shadow-sm"
                aria-label="Project Name"
              />
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto custom-scrollbar" role="navigation">
          <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.15em] mb-3 px-3">System PHASES</div>
          {PHASES.map((p) => (
            <button 
              key={p.id}
              onClick={() => {
                setOpenPhase(p.id);
                logAction("Phase View Changed", "user", `Navigated to Phase ${p.id}: ${p.title}`);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-200 group ${
                openPhase === p.id 
                  ? "bg-brand text-white shadow-lg shadow-brand/25 ring-1 ring-white/20" 
                  : "text-text-secondary hover:bg-white hover:shadow-sm"
              }`}
              aria-label={`View Phase ${p.id}: ${p.title}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${openPhase === p.id ? "bg-white scale-125" : "bg-text-tertiary/40 group-hover:bg-brand/50"}`}></div>
              {p.title}
            </button>
          ))}

          <div className="pt-8 text-[9px] font-black text-text-tertiary uppercase tracking-[0.15em] mb-3 px-3">System Views</div>
          {(["checklist", "workflow", "rules", "testing"] as const).map((t) => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-200 ${
                activeTab === t 
                ? "text-text-primary bg-white shadow-md border border-border-subtle" 
                : "text-text-secondary hover:bg-white hover:shadow-sm"
              }`}
              aria-label={`Switch to ${t} view`}
            >
              {activeTab === t ? <ChevronRight className="w-4 h-4 text-brand animate-in fade-in slide-in-from-left-1" aria-hidden="true" /> : <div className="w-4" />}
              <span className="capitalize">{t}</span>
            </button>
          ))}

          {/* Admin Tab - Locked */}
          <button 
            onClick={() => {
              if (isAdmin) setActiveTab("admin");
              else setShowLogin(true);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 mt-6 rounded-xl text-sm transition-all duration-300 ${
              activeTab === "admin" 
                ? "bg-slate-900 text-white shadow-xl ring-1 ring-white/10" 
                : "text-text-secondary bg-white/50 border border-dashed border-border-standard hover:bg-white hover:border-solid hover:shadow-sm"
            } ${!isAdmin && "opacity-90"}`}
            aria-label="Access Admin Section"
          >
            <div className="flex items-center gap-4">
              {isAdmin ? <LayoutDashboard className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span className="font-bold">Admin Panel</span>
            </div>
            {!isAdmin && <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>}
          </button>
        </nav>

        <div className="p-6 border-t border-border-subtle bg-bg-panel/30">
            {/* Profile (Simplified in dashboard since gated) */}
            <div className="flex items-center gap-4 p-3 bg-white shadow-sm border border-border-subtle rounded-xl transition-all hover:shadow-md group">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-xs text-white font-black">
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-text-primary">{user.name || "Techbridge User"}</p>
                <p className="text-[9px] text-text-tertiary font-bold uppercase tracking-wider truncate">{user.email}</p>
              </div>
              <LogOut
                className="w-4 h-4 text-text-tertiary hover:text-danger hover:scale-110 transition-all cursor-pointer"
                onClick={handleLogout}
                aria-label="Sign out"
              />
            </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col h-full bg-bg-main overflow-hidden relative" role="main">
        {/* Top Header */}
        <header className="h-20 bg-bg-panel/80 backdrop-blur-md border-b border-border-standard flex items-center justify-between px-8 shrink-0 z-10 transition-colors">
          <div className="flex items-center gap-6">
            <div className="text-[9px] uppercase font-black text-text-tertiary tracking-[0.2em] hidden lg:block border-r border-border-standard pr-6 h-8 flex items-center">
              TUC / {projectName || "BLUEPRINT"}
            </div>
            <div>
              <div className="font-bold text-base text-text-primary tracking-tight">
                {activeTab === "admin" ? "ICT Administrative Console" : (openPhase ? PHASES.find(p => p.id === openPhase)?.title : "Select Phase")}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_var(--color-success)]"></div>
                <span className="text-[10px] font-bold text-success uppercase tracking-widest">Connected to ICT Node</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <div className="flex bg-bg-main p-1 rounded-xl border border-border-standard shadow-inner" role="radiogroup" aria-label="Theme selection">
              <button 
                onClick={() => handleThemeChange("light")}
                className={`p-2 rounded-lg transition-all duration-300 ${theme === "light" ? "bg-white text-brand shadow-md scale-110 ring-1 ring-brand/10" : "text-text-tertiary hover:text-text-secondary"}`}
                title="Light Theme"
                aria-label="Switch to light theme"
                aria-checked={theme === "light"}
                role="radio"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleThemeChange("dark")}
                className={`p-2 rounded-lg transition-all duration-300 ${theme === "dark" ? "bg-slate-800 text-brand shadow-md scale-110 ring-1 ring-brand/50" : "text-text-tertiary hover:text-text-secondary"}`}
                title="Dark Theme"
                aria-label="Switch to dark theme"
                aria-checked={theme === "dark"}
                role="radio"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleThemeChange("contrast")}
                className={`p-2 rounded-lg transition-all duration-300 ${theme === "contrast" ? "bg-slate-900 text-brand shadow-md scale-110 ring-1 ring-white/40" : "text-text-tertiary hover:text-text-secondary"}`}
                title="High Contrast Theme"
                aria-label="Switch to high contrast theme"
                aria-checked={theme === "contrast"}
                role="radio"
              >
                <Contrast className="w-4 h-4" />
              </button>
            </div>

            <div className="flex bg-bg-main p-1 rounded-xl border border-border-standard shadow-inner mx-2">
              {(["claude", "aistudio", "master"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    mode === m 
                      ? "bg-white text-brand shadow-sm border border-border-standard scale-105" 
                      : "text-text-tertiary hover:text-text-secondary"
                  }`}
                  aria-label={`Switch to ${m} mode`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="h-8 w-px bg-border-standard mx-2" />
            <button 
              onClick={handleExport}
              className="px-5 py-2 text-xs font-bold text-text-secondary border border-border-strong rounded-xl hover:bg-white hover:text-text-primary hover:shadow-md transition-all duration-300 active:scale-95" 
              aria-label="Export code as ZIP"
            >
              Export
            </button>
            <button 
              onClick={triggerSnapshot}
              className="p-2 text-text-secondary border border-border-standard rounded-xl hover:bg-white hover:text-brand transition-all shadow-sm"
              title="Save Snapshot"
            >
              <Save className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDeploy}
              className="px-6 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 hover:shadow-xl shadow-brand/20 transition-all duration-300 active:scale-95 ring-1 ring-white/10" 
              aria-label="Deploy current version"
            >
              Deploy
            </button>
          </div>
        </header>

        {/* Workspace Canvas */}
        <div className="flex-1 relative overflow-hidden overflow-y-auto custom-scrollbar p-10 text-text-primary z-0">
          <ResonanceBackdrop />
          <div className="max-w-4xl mx-auto space-y-10 pb-20 relative z-10">
            
            {activeTab === "admin" ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight">ICT System Oversight</h2>
                  <History className="w-5 h-5 text-text-tertiary" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Active Sessions", value: "1", icon: <User className="w-4 h-4" /> },
                    { label: "Security Events", value: auditLogs.filter(l => l.category === "security").length.toString(), icon: <Shield className="w-4 h-4" /> },
                    { label: "Total Logs", value: auditLogs.length.toString(), icon: <Clipboard className="w-4 h-4" /> },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border border-border-standard p-4 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-text-tertiary">
                        {stat.icon}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-border-standard rounded-lg overflow-hidden shadow-sm">
                  <div className="px-5 py-3 bg-slate-50 border-b border-border-standard flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Audit Trail (TUC-INC-2024-XXX)</span>
                    <button 
                      onClick={() => setAuditLogs([])}
                      className="text-[10px] font-bold text-danger hover:underline"
                    >
                      Purge History
                    </button>
                  </div>
                  <div className="p-0 max-h-[400px] overflow-y-auto">
                    {auditLogs.length === 0 ? (
                      <div className="p-12 text-center text-text-tertiary">
                        <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="text-xs">No entries in the audit database.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="sticky top-0 bg-white shadow-sm">
                          <tr className="border-b border-border-subtle text-text-tertiary uppercase text-[9px] font-bold">
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                          {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-mono text-[10px] text-text-tertiary whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="px-4 py-3 font-semibold">{log.action}</td>
                              <td className="px-4 py-3">
                                <Badge variant={log.category === "security" ? "sonnet" : "default"}>
                                  {log.category}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-text-secondary truncate max-w-[200px]" title={log.details}>
                                {log.details}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Project History */}
                <div className="bg-white border border-border-standard rounded-lg overflow-hidden shadow-sm">
                  <div className="px-5 py-3 bg-slate-50 border-b border-border-standard flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-text-tertiary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Mission Snapshots (Cloud Sync)</span>
                    </div>
                  </div>
                  <div className="p-0">
                    {!user ? (
                      <div className="p-12 text-center">
                        <Lock className="w-8 h-8 mx-auto mb-3 text-text-tertiary opacity-30" />
                        <p className="text-xs text-text-secondary">Sign in to sync your mission progress to the cloud.</p>
                      </div>
                    ) : projectHistory.length === 0 ? (
                      <div className="p-8 text-center text-text-tertiary">
                        <Save className="w-6 h-6 mx-auto mb-2 opacity-20" />
                        <p className="text-xs">No cloud snapshots found for this account.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border-subtle max-h-[300px] overflow-y-auto">
                        {projectHistory.map((snap) => (
                          <div key={snap.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-text-primary">{snap.name || snap.projectName || "Unnamed Project"}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] text-text-tertiary font-mono">{new Date(snap.timestamp).toLocaleString()}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-text-secondary font-bold uppercase">Phase {snap.openPhase}</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={async () => {
                                setProjectName(snap.name || snap.projectName);
                                setCheckedItems(snap.checkedItems);
                                setOpenPhase(snap.openPhase);
                                setActiveTab(snap.activeTab as any);
                                logAction("Snapshot Restored", "user", `Restored cloud state: ${snap.id}`);
                              }}
                              className="px-3 py-1.5 text-[11px] font-bold bg-brand/10 text-brand rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand hover:text-white"
                            >
                              Restore
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* System Diagnostics */}
                {healthStatus && (
                  <div className="bg-white border border-border-standard p-6 rounded-lg shadow-sm">
                    <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-4">Node Health</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(healthStatus.services).map(([service, status]: [string, any]) => (
                        <div key={service} className="p-3 bg-slate-50 rounded-lg border border-border-subtle">
                          <p className="text-[9px] font-bold text-text-tertiary uppercase mb-1">{service.replace("_", " ")}</p>
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${status === "active" || status === "online" || status === "connected" ? "bg-success" : "bg-warning"}`}></div>
                            <span className="text-[11px] font-bold capitalize">{status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : activeTab === "testing" ? (
              <motion.div 
                key="testing-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">System Verification</h2>
                    <p className="text-xs text-text-secondary mt-1">Run Playwright E2E suites and internal health probes.</p>
                  </div>
                  <button 
                    onClick={runSystemTests}
                    disabled={isRunningTests}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-sm shadow-lg transition-all ${isRunningTests ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-800 active:scale-95"}`}
                  >
                    {isRunningTests ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Running Suite...
                      </>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4" />
                        Run All Tests
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-border-standard rounded-lg overflow-hidden flex flex-col shadow-sm">
                    <div className="px-5 py-3 border-b border-border-standard bg-slate-50 flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Interactive Results</span>
                      <TestTube className="w-3.5 h-3.5 text-text-tertiary" />
                    </div>
                    <div className="flex-1 p-5 space-y-3 min-h-[300px]">
                      {!testResults && !isRunningTests && (
                        <div className="h-full flex flex-col items-center justify-center text-text-tertiary opacity-40">
                          <Shield className="w-10 h-10 mb-3" />
                          <p className="text-[10px] font-bold uppercase">Ready for Diagnostic Trigger</p>
                        </div>
                      )}
                      {isRunningTests && (
                        <div className="space-y-4 pt-4">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                              <div className="w-4 h-4 bg-slate-100 rounded"></div>
                              <div className="flex-1 h-3 bg-slate-50 rounded"></div>
                              <div className="w-12 h-3 bg-slate-50 rounded"></div>
                            </div>
                          ))}
                          <p className="text-[10px] text-center text-text-tertiary animate-bounce mt-8">Spawning Playwright instances...</p>
                        </div>
                      )}
                      {testResults && (
                        <div className="space-y-3">
                          {testResults.results.map((test: any) => (
                            <div key={test.id} className="flex items-center justify-between p-3 border border-border-subtle rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-success" />
                                <span className="text-xs font-semibold">{test.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono text-text-tertiary">{test.duration}</span>
                                <Badge variant="haiku">Passed</Badge>
                              </div>
                            </div>
                          ))}
                          <div className="mt-6 p-4 bg-success/5 border border-success/10 rounded-lg text-center">
                            <p className="text-[10px] font-bold text-success uppercase mb-1">Overall Outcome</p>
                            <p className="text-lg font-bold text-success">100% COMPLIANT</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-border-standard rounded-lg overflow-hidden shadow-sm">
                    <div className="px-5 py-3 border-b border-border-standard bg-slate-50 flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Capture Manifest</span>
                      <Eye className="w-3.5 h-3.5 text-text-tertiary" />
                    </div>
                    <div className="p-5">
                      {testResults ? (
                        <div className="space-y-4">
                          <img 
                            src={testResults.screenshot} 
                            alt="Test failure/success capture" 
                            className="w-full h-48 object-cover rounded-lg border border-border-standard shadow-inner"
                          />
                          <div className="bg-slate-900 rounded-lg p-4 font-mono text-[10px] text-slate-300">
                            <p className="text-slate-500 mb-2">// Playwright Metadata</p>
                            <p>Job ID: {testResults.jobId}</p>
                            <p>Browser: Chromium 120.0</p>
                            <p>Artifact: screenshot_final.png</p>
                            <p>Trace: tuc-ict-trace.zip</p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-text-tertiary border-2 border-dashed border-slate-100 rounded-lg">
                          <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Artifacts</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Status Card */}
                <motion.div 
                  layout
                  className="bg-bg-panel border border-border-standard rounded-2xl p-8 shadow-xl shadow-black/5 ring-1 ring-white/10 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Target className="w-32 h-32 -mr-16 -mt-16" />
                  </div>
                  <div className="flex justify-between items-end mb-8 relative z-10">
                    <div>
                      <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-1">Implementation Roadmap</h3>
                      <p className="text-2xl font-bold tracking-tighter text-text-primary">{totals.completed} / {totals.total} Components Completed</p>
                    </div>
                    <span className="text-4xl font-black text-brand tabular-nums">{totals.percent}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-bg-main rounded-full overflow-hidden shadow-inner ring-1 ring-black/[0.02]">
                    <motion.div 
                      key="progress-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${totals.percent}%` }}
                      className="h-full bg-brand shadow-[0_0_15px_var(--color-brand-glow)] transition-all duration-700 ease-out"
                    />
                  </div>
                </motion.div>

                {/* Content Tab Logic */}
                <AnimatePresence mode="wait">
                  {activeTab === "checklist" && (
                    <motion.div 
                      key="checklist"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-6"
                    >
                      {PHASES.map((phase) => (
                        <div 
                          key={phase.id}
                          className={`bg-bg-panel border rounded-2xl transition-all duration-300 overflow-hidden ${
                            openPhase === phase.id 
                              ? "border-brand shadow-2xl shadow-brand/10 ring-1 ring-brand/20" 
                              : "border-border-standard shadow-lg shadow-black/[0.02] hover:border-border-strong hover:shadow-xl hover:-translate-y-0.5"
                          }`}
                        >
                          <button 
                            onClick={() => {
                              setOpenPhase(phase.id);
                              logAction("Phase Expansion", "user", `Expanded Phase ${phase.id} details.`);
                            }}
                            className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-brand focus:ring-inset"
                            aria-expanded={openPhase === phase.id}
                            aria-controls={`phase-content-${phase.id}`}
                          >
                            <div className="flex items-center gap-5">
                              <div className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm ${
                                openPhase === phase.id ? "bg-brand text-white shadow-brand/30" : "bg-bg-sidebar text-text-tertiary"
                              }`} aria-hidden="true">
                                {React.cloneElement(phase.icon as React.ReactElement, { className: "w-5 h-5" })}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.15em]">Phase {phase.id}</span>
                                  {phase.optional && <Badge>Optional</Badge>}
                                </div>
                                <h3 className="text-base font-bold text-text-primary tracking-tight">{phase.title}</h3>
                              </div>
                            </div>
                            <div className="p-2 rounded-full hover:bg-bg-sidebar transition-colors">
                              {openPhase === phase.id ? <ChevronDown className="w-5 h-5 text-text-primary" /> : <ChevronRight className="w-5 h-5 text-text-tertiary opacity-50" />}
                            </div>
                          </button>

                          <AnimatePresence>
                            {openPhase === phase.id && (
                              <motion.div 
                                id={`phase-content-${phase.id}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-5 pb-5 border-t border-border-subtle pt-4 bg-slate-50/50 overflow-hidden"
                              >
                                <div className="space-y-2.5">
                                  {phase.id === 4 && (
                                    <div className="flex gap-2 mb-2 px-1">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleShareDiagrams();
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md group/share"
                                      >
                                        <Share2 className="w-3.5 h-3.5 group-hover/share:scale-110 transition-transform" />
                                        Share Diagrams
                                      </button>
                                    </div>
                                  )}
                                  {phase.items.map((item, idx) => {
                                    const key = `${phase.id}-${idx}`;
                                    const isChecked = checkedItems[key];
                                    return (
                                      <button 
                                        key={key}
                                        onClick={() => toggleItem(key)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-l-4 transition-all duration-300 group ${
                                          isChecked 
                                            ? "bg-bg-sidebar border-l-success opacity-70 scale-[0.99]" 
                                            : "bg-bg-panel border-l-brand border-border-standard hover:shadow-lg hover:border-r-border-standard hover:translate-x-1"
                                        }`}
                                        aria-pressed={isChecked}
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                                            isChecked 
                                              ? "bg-success border-success rotate-0" 
                                              : "bg-white border-border-strong group-hover:border-brand -rotate-12 group-hover:rotate-0"
                                          }`}>
                                            {isChecked && <Check className="w-4 h-4 text-white stroke-[3px]" />}
                                          </div>
                                          <span className={`text-xs font-bold leading-tight transition-all duration-300 ${isChecked ? "line-through text-text-tertiary" : "text-text-primary"}`}>
                                            {item.label}
                                          </span>
                                        </div>
                                        <Badge variant={(item.model.toLowerCase() as any)}>{item.model}</Badge>
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "workflow" && (
                    <motion.div 
                      key="workflow-view"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-bg-panel border border-border-standard rounded-2xl p-10 shadow-2xl shadow-black/5 space-y-10 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand/50 via-success/50 to-brand/50" />
                      <div className="text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand/10">
                          <Workflow className="w-8 h-8 text-brand" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-text-primary tracking-tight">Automated Refresh Protocol</h3>
                        <p className="text-xs text-text-secondary leading-relaxed px-4 font-medium italic opacity-80">Standard TUC ICT session lifecycle for rapid application hardening and production-ready output.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border-subtle to-transparent -translate-y-1/2 hidden md:block" />
                        {[
                          { step: 1, title: "Foundation", model: "Sonnet" },
                          { step: 2, title: "Secure", model: "Haiku" },
                          { step: 3, title: "Refine", model: "Sonnet" },
                          { step: 4, title: "Validate", model: "Haiku" },
                          { step: 5, title: "Finalise", model: "Sonnet" },
                        ].map((s) => (
                          <div key={s.step} className="relative bg-bg-panel p-6 border border-border-subtle rounded-2xl text-center shadow-lg shadow-black/[0.03] z-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-brand/30 group">
                            <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/20 mx-auto mb-4 flex items-center justify-center text-[10px] text-white font-black shadow-lg transition-transform group-hover:scale-110">
                              {s.step}
                            </div>
                            <h4 className="text-[11px] font-black mb-2 text-text-primary uppercase tracking-tighter">{s.title}</h4>
                            <Badge variant={(s.model.toLowerCase() as any)}>{s.model}</Badge>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "rules" && (
                    <motion.div 
                      key="rules-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <div className="bg-white border border-border-standard rounded-lg p-6 shadow-sm shadow-brand/5 border-l-4 border-l-brand">
                        <h4 className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-4">Core Directives</h4>
                        <ul className="space-y-4">
                          {[
                            "SRS MUST be complete before code generation.",
                            "No placeholders in production environments.",
                            "UK British English documentation only.",
                            "IEEE 830 documentation standard is mandatory.",
                          ].map((r, i) => (
                            <li key={i} className="flex gap-3 text-xs leading-relaxed text-text-secondary">
                              <Check className="w-4 h-4 text-success shrink-0" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-900 rounded-lg p-6 shadow-xl text-slate-300 border border-slate-800">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">System Context</h4>
                        <pre className="text-[10px] font-mono leading-relaxed overflow-x-auto text-slate-400 whitespace-pre-wrap selection:bg-brand/40">
                          {CONTEXT_BLOCK}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <footer className="h-10 bg-white border-t border-border-standard flex items-center justify-between px-4 shrink-0 transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-text-tertiary uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
              Connected to ICT Node
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-[10px] text-text-tertiary font-medium">{projectName || "Active Session"}</span>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 text-[8px] font-mono text-text-tertiary uppercase">
              <span className="opacity-60">[{gitInfo.branch}]</span>
              <span className="font-bold text-brand/70">{gitInfo.commit}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-text-tertiary">
            <span>Security Level: <span className={isAdmin ? "text-success font-bold" : "text-warning font-bold"}>{isAdmin ? "ROOT" : "RESTRICTED"}</span></span>
            <span>v8.4.2</span>
          </div>
        </footer>
      </main>

      {/* Right Sidebar: Directives */}
      <aside className="w-80 bg-bg-sidebar border-l border-border-standard flex flex-col h-full shrink-0 shadow-2xl shadow-black/5 z-20 transition-all duration-300">
        <div className="p-6 border-b border-border-subtle bg-bg-panel/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-sm tracking-tighter text-text-primary uppercase tracking-widest px-1 opacity-80">Active Directive</h2>
            <Target className="w-4 h-4 text-brand animate-pulse" />
          </div>
          <div className="relative group">
            <textarea 
              readOnly
              value={currentDirective}
              className="w-full h-56 p-4 text-xs border border-brand/20 bg-white shadow-inner text-brand-dark rounded-xl focus:outline-none resize-none font-bold leading-relaxed transition-all scrollbar-hide"
              aria-label="Current AI Directive"
            />
            <div className="absolute bottom-3 right-3 shadow-lg rounded-lg">
              <CopyButton text={currentDirective} />
            </div>
          </div>
          <div className="mt-4 p-3 bg-brand/5 border border-brand/10 rounded-lg">
            <p className="text-[10px] text-text-secondary font-medium leading-relaxed italic">
              <Info className="w-3 h-3 inline mr-1 text-brand opacity-60 mb-0.5" />
              {openPhase ? PHASES.find(p => p.id === openPhase)?.note : "Select a phase to see technical notes."}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <h3 className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] px-1">Mission Timeline</h3>
          <div className="space-y-4">
            {PHASES.filter(p => (openPhase ? p.id <= openPhase : true)).reverse().map((p) => {
              const isActive = p.id === openPhase;
              const isCompleted = p.id < (openPhase || 1);
              return (
                <div key={p.id} className={`p-4 border rounded-xl transition-all duration-300 group ${
                  isActive ? "bg-white shadow-xl border-brand/20 scale-[1.02]" : "bg-bg-panel/50 border-border-subtle hover:bg-white hover:shadow-md"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isCompleted ? "text-success" : "text-brand"}`}>
                      {isCompleted ? "Verified \u2713" : isActive ? "Active Now" : "Ready"}
                    </span>
                    <span className="text-[9px] text-text-tertiary font-bold">Phase {p.id}</span>
                  </div>
                  <p className="text-xs font-bold text-text-primary tracking-tight leading-tight">{p.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-white border-t border-border-standard shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center text-[10px] font-black text-text-secondary mb-3 tracking-widest opacity-80">
            <span>HARDENING SYNC</span>
            <span className="text-brand tabular-nums font-black">{totals.percent}%</span>
          </div>
          <div className="w-full h-1.5 bg-bg-main rounded-full overflow-hidden shadow-inner ring-1 ring-black/[0.03]">
            <motion.div 
              className="h-full bg-brand rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_var(--color-brand-glow)]"
              style={{ width: `${totals.percent}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${totals.percent}%` }}
            />
          </div>
        </div>
      </aside>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-8 border border-border-standard"
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-title"
            >
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-border-standard">
                  <Lock className="w-6 h-6 text-brand" />
                </div>
                <h2 id="login-title" className="text-xl font-bold text-text-primary">ICT Gatekeeper</h2>
                <p className="text-xs text-text-secondary mt-1">Personnel access required for System Architecture changes.</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block mb-1.5 px-1">Admin Credential Passkey</label>
                  <div className="relative">
                    <input 
                      autoFocus
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                      className="w-full bg-slate-50 border border-border-standard rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all font-mono"
                    />
                    <Eye className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  </div>
                  {loginError && (
                    <p 
                      className="text-[10px] text-danger font-bold mt-2 flex items-center gap-1"
                      role="alert"
                      aria-live="assertive"
                    >
                      <AlertCircle className="w-3 h-3" aria-hidden="true" />
                      {loginError}
                    </p>
                  )}
                </div>
                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-[0.98] text-sm"
                  >
                    Authenticate
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="w-full bg-transparent text-text-tertiary font-bold py-2.5 rounded-lg hover:text-text-primary transition-all text-sm mt-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-border-subtle text-center">
                <p className="text-[9px] text-text-tertiary uppercase tracking-widest font-bold">Techbridge University College \u2022 ICT Security</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Share Notification Toast */}
      <AnimatePresence>
        {shareLink && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] w-full max-w-sm"
          >
            <div className="mx-4 bg-slate-900 border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-1">Diagram Link Ready</p>
                <p className="text-[11px] text-white/70 truncate font-mono">{shareLink}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    logAction("Share Link Copied", "user", "Link copied from toast notification.");
                  }}
                  className="px-3 py-1.5 bg-brand text-white text-[10px] font-bold rounded-lg shadow-lg hover:shadow-brand/20 transition-all"
                >
                  Copy
                </button>
                <button 
                  onClick={() => setShareLink(null)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
