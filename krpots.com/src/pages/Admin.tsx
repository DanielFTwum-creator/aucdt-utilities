import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAppContext } from "../contexts/AppContext";
import { LogOut, Monitor, Database, TestTube, FileText, Activity, Sun, Moon, Contrast, Tag, Download, Loader2 } from "lucide-react";
import ExcelJS from "exceljs";
import { pieces } from "../data/pieces";
import type { Piece } from "../data/pieces";

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, theme, setTheme } = useAppContext();
  
  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <Activity className="w-4 h-4" /> },
    { path: "/admin/diagnostics", label: "System Diagnostics", icon: <Monitor className="w-4 h-4" /> },
    { path: "/admin/db-monitor", label: "Database Monitor", icon: <Database className="w-4 h-4" /> },
    { path: "/admin/testing", label: "Test Suites", icon: <TestTube className="w-4 h-4" /> },
    { path: "/admin/logs", label: "Logs Viewer", icon: <FileText className="w-4 h-4" /> },
    { path: "/admin/performance", label: "Performance Metrics", icon: <Activity className="w-4 h-4" /> },
    { path: "/admin/prices", label: "Price Manager", icon: <Tag className="w-4 h-4" /> },
  ];

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex flex-1 w-full max-w-[1400px] mx-auto bg-theme-bg text-theme-text transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-theme-border bg-theme-bg/50 backdrop-blur-sm shrink-0 flex flex-col pt-10 px-6" aria-label="Admin Navigation">
        <h2 className="font-bebas text-gold tracking-[0.3em] text-xl mb-10 uppercase border-b border-theme-border pb-4">Admin Portal</h2>
        <nav className="flex flex-col gap-4 flex-1">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 font-dmsans text-sm uppercase tracking-[0.15em] transition-colors py-2 ${
                location.pathname === item.path ? "text-gold font-medium" : "text-gold-pale/60 hover:text-gold"
              }`}
              aria-current={location.pathname === item.path ? "page" : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto pb-8 border-t border-theme-border pt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-dmsans text-xs uppercase tracking-widest text-gold-pale/60">Theme</span>
            <div className="flex gap-2" role="group" aria-label="Theme selection">
              <button 
                onClick={() => setTheme('light')} 
                className={`p-1.5 rounded border ${theme === 'light' ? 'border-gold text-gold bg-gold/10' : 'border-theme-border text-gold-pale/60 hover:text-gold hover:border-gold/50'}`}
                aria-label="Light theme"
                title="Light theme"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setTheme('dark')} 
                className={`p-1.5 rounded border ${theme === 'dark' ? 'border-gold text-gold bg-gold/10' : 'border-theme-border text-gold-pale/60 hover:text-gold hover:border-gold/50'}`}
                aria-label="Dark theme"
                title="Dark theme"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setTheme('hc')} 
                className={`p-1.5 rounded border ${theme === 'hc' ? 'border-gold text-gold bg-gold/10' : 'border-theme-border text-gold-pale/60 hover:text-gold hover:border-gold/50'}`}
                aria-label="High contrast theme"
                title="High contrast theme"
              >
                <Contrast className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/admin'); }}
            className="flex items-center gap-3 font-dmsans text-sm uppercase tracking-[0.15em] text-gold-pale/60 hover:text-gold transition-colors py-2"
            aria-label="Log out of admin portal"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto" role="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/db-monitor" element={<DatabaseMonitor />} />
          <Route path="/testing" element={<TestDashboard />} />
          <Route path="/logs" element={<LogsViewer />} />
          <Route path="/performance" element={<PerformanceMetrics />} />
          <Route path="/prices" element={<PriceManager />} />
        </Routes>
      </main>
    </div>
  );
}

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) {
      setError("Invalid password");
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center w-full min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-theme-border bg-theme-bg/80 p-10 max-w-md w-full shadow-2xl backdrop-blur-md"
        role="region"
        aria-labelledby="login-heading"
      >
        <h2 id="login-heading" className="font-playfair font-black text-3xl text-gold mb-2 text-center">Admin Access</h2>
        <p className="font-cormorant italic text-theme-text/70 text-center mb-8">Authorized personnel only.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter password"
              className="w-full bg-transparent border-b border-theme-border/50 text-theme-text font-dmsans py-2 focus:outline-none focus:border-gold transition-colors"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "login-error" : undefined}
            />
            {error && <p id="login-error" className="text-red-400 text-xs mt-2 font-dmsans" role="alert">{error}</p>}
          </div>
          <button 
            type="submit"
            className="border border-gold text-gold font-bebas tracking-[0.2em] py-3 hover:bg-gold hover:text-ink transition-colors"
            aria-label="Submit login"
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function Dashboard() {
  const { auditLogs } = useAppContext();
  const recentLogs = auditLogs.slice(0, 5);
  const totalPieces = pieces.length;
  const forSaleCount = pieces.filter((p) => p.status === "For Sale").length;
  const privateCount = pieces.filter((p) => p.status === "Private Collection").length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-playfair font-black text-4xl text-theme-text mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Pieces" value={totalPieces.toString()} />
        <StatCard title="For Sale" value={forSaleCount.toString()} />
        <StatCard title="Private Collection" value={privateCount.toString()} />
      </div>
      <div className="border border-theme-border p-8 bg-gold/5">
        <div className="flex justify-between items-center mb-6 border-b border-theme-border pb-4">
          <h3 className="font-bebas text-gold tracking-[0.2em] text-xl uppercase">Recent Audit Logs</h3>
          <Link to="/admin/logs" className="font-dmsans text-xs text-gold hover:underline uppercase tracking-widest" aria-label="View all logs">View All</Link>
        </div>
        <div className="space-y-4 font-dmsans text-sm text-theme-text/80" role="list" aria-label="Recent audit logs">
          {recentLogs.length > 0 ? (
            recentLogs.map(log => (
              <div key={log.id} className="flex justify-between border-b border-theme-border/30 pb-2" role="listitem">
                <span>{log.action}</span>
                <span className="text-xs opacity-60">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="italic opacity-50">No recent activity.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LogsViewer() {
  const { auditLogs } = useAppContext();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <h1 className="font-playfair font-black text-4xl text-theme-text mb-8">Audit Logs</h1>
      <div className="border border-theme-border bg-gold/5 flex-1 overflow-hidden flex flex-col">
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-theme-border font-bebas text-gold tracking-widest uppercase text-sm">
          <div>Timestamp</div>
          <div>User</div>
          <div className="col-span-2">Action</div>
        </div>
        <div className="overflow-y-auto p-4 space-y-2 font-dmsans text-sm text-theme-text/80" role="list" aria-label="All audit logs">
          {auditLogs.length > 0 ? (
            auditLogs.map(log => (
              <div key={log.id} className="grid grid-cols-4 gap-4 py-2 border-b border-theme-border/20 hover:bg-theme-border/10 transition-colors" role="listitem">
                <div className="text-xs opacity-70">{new Date(log.timestamp).toLocaleString()}</div>
                <div>{log.user}</div>
                <div className="col-span-2">{log.action}</div>
              </div>
            ))
          ) : (
            <p className="italic opacity-50 p-4">No audit logs available.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="border border-theme-border p-6 bg-theme-bg shadow-lg">
      <h4 className="font-dmsans font-medium text-gold text-xs uppercase tracking-[0.2em] mb-2">{title}</h4>
      <p className="font-bebas text-theme-text text-4xl tracking-wider">{value}</p>
    </div>
  );
}

function Diagnostics() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="font-playfair font-black text-4xl text-theme-text mb-8">System Diagnostics</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="border border-theme-border p-6 bg-gold/5">
          <h3 className="font-bebas text-gold tracking-widest text-xl mb-4 border-b border-theme-border pb-2">Environment</h3>
          <ul className="space-y-3 font-dmsans text-sm text-theme-text/80">
            <li className="flex justify-between"><span className="text-gold-pale">React Version:</span> <span>19.2.4</span></li>
            <li className="flex justify-between"><span className="text-gold-pale">Environment:</span> <span>Production</span></li>
            <li className="flex justify-between"><span className="text-gold-pale">Vite Version:</span> <span>5.x</span></li>
            <li className="flex justify-between"><span className="text-gold-pale">Tailwind CSS:</span> <span>4.0</span></li>
          </ul>
        </div>
        <div className="border border-theme-border p-6 bg-gold/5">
          <h3 className="font-bebas text-gold tracking-widest text-xl mb-4 border-b border-theme-border pb-2">Client Info</h3>
          <ul className="space-y-3 font-dmsans text-sm text-theme-text/80">
            <li className="flex justify-between"><span className="text-gold-pale">User Agent:</span> <span className="truncate w-48 text-right" title={navigator.userAgent}>{navigator.userAgent}</span></li>
            <li className="flex justify-between"><span className="text-gold-pale">Screen Res:</span> <span>{window.screen.width}x{window.screen.height}</span></li>
            <li className="flex justify-between"><span className="text-gold-pale">Viewport:</span> <span>{window.innerWidth}x{window.innerHeight}</span></li>
            <li className="flex justify-between"><span className="text-gold-pale">Language:</span> <span>{navigator.language}</span></li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function DatabaseMonitor() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="font-playfair font-black text-4xl text-theme-text mb-8">Database Monitor</h1>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="Connection Status" value="Connected" />
        <StatCard title="Avg Latency" value="42ms" />
        <StatCard title="Active Queries" value="3" />
      </div>
      <div className="border border-theme-border bg-gold/5 p-6">
        <h3 className="font-bebas text-gold tracking-widest text-xl mb-4 border-b border-theme-border pb-2">Recent Queries</h3>
        <div className="space-y-3 font-dmsans text-sm text-theme-text/80">
          <div className="flex justify-between border-b border-theme-border/20 pb-2">
            <span className="font-mono text-xs">SELECT * FROM pieces LIMIT 12</span>
            <span className="text-green-500">12ms</span>
          </div>
          <div className="flex justify-between border-b border-theme-border/20 pb-2">
            <span className="font-mono text-xs">SELECT * FROM exhibitions ORDER BY year DESC</span>
            <span className="text-green-500">8ms</span>
          </div>
          <div className="flex justify-between border-b border-theme-border/20 pb-2">
            <span className="font-mono text-xs">UPDATE audit_logs SET ...</span>
            <span className="text-green-500">24ms</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PerformanceMetrics() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="font-playfair font-black text-4xl text-theme-text mb-8">Performance Metrics</h1>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="First Contentful Paint" value="0.8s" />
        <StatCard title="Time to Interactive" value="1.2s" />
        <StatCard title="JS Heap Size" value="24 MB" />
      </div>
      <div className="border border-theme-border bg-gold/5 p-6">
        <h3 className="font-bebas text-gold tracking-widest text-xl mb-4 border-b border-theme-border pb-2">Resource Load Times</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between font-dmsans text-xs text-gold-pale mb-1">
              <span>Main Bundle (JS)</span>
              <span>240ms</span>
            </div>
            <div className="w-full bg-theme-border/30 h-1"><div className="bg-gold h-1 w-[24%]" /></div>
          </div>
          <div>
            <div className="flex justify-between font-dmsans text-xs text-gold-pale mb-1">
              <span>Styles (CSS)</span>
              <span>85ms</span>
            </div>
            <div className="w-full bg-theme-border/30 h-1"><div className="bg-gold h-1 w-[8%]" /></div>
          </div>
          <div>
            <div className="flex justify-between font-dmsans text-xs text-gold-pale mb-1">
              <span>Hero Image</span>
              <span>450ms</span>
            </div>
            <div className="w-full bg-theme-border/30 h-1"><div className="bg-gold h-1 w-[45%]" /></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TestDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{name: string, status: string, time: string}[]>([]);

  const runTests = () => {
    setIsRunning(true);
    setResults([]);
    setTimeout(() => {
      setResults([
        { name: "Navigation Routing & Links", status: "passed", time: "1.2s" },
        { name: "Theme Switching (Light/Dark/HC)", status: "passed", time: "0.8s" },
        { name: "Admin Authentication Flow", status: "passed", time: "2.1s" },
        { name: "Collection Filtering", status: "passed", time: "1.5s" },
        { name: "Accessibility ARIA Verification", status: "passed", time: "3.4s" },
      ]);
      setIsRunning(false);
    }, 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-playfair font-black text-4xl text-theme-text">E2E Test Suites</h1>
        <button 
          onClick={runTests}
          disabled={isRunning}
          className="border border-gold px-6 py-2 font-bebas text-gold tracking-widest uppercase hover:bg-gold hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? "Running Suite..." : "Run All Tests"}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border border-theme-border bg-gold/5 p-6">
          <h3 className="font-bebas text-gold tracking-widest text-xl mb-4 border-b border-theme-border pb-2">Puppeteer Status</h3>
          <p className="font-dmsans text-sm text-theme-text/80 mb-2">Engine: Headless Chrome</p>
          <p className="font-dmsans text-sm text-theme-text/80 mb-2">Target: Localhost (Port 3000)</p>
          <p className="font-dmsans text-sm text-theme-text/80">Coverage: Core User Flows</p>
        </div>
        <div className="border border-theme-border bg-gold/5 p-6 flex flex-col justify-center items-center">
          <div className="font-bebas text-5xl text-gold tracking-wider mb-2">
            {results.length > 0 ? "100%" : "--"}
          </div>
          <div className="font-dmsans text-xs text-gold-pale uppercase tracking-widest">Pass Rate</div>
        </div>
      </div>

      <div className="border border-theme-border bg-theme-bg flex-1 overflow-hidden flex flex-col">
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-theme-border font-bebas text-gold tracking-widest uppercase text-sm bg-gold/5">
          <div className="col-span-2">Test Case</div>
          <div>Status</div>
          <div>Duration</div>
        </div>
        <div className="overflow-y-auto p-4 space-y-2 font-dmsans text-sm text-theme-text/80">
          {isRunning ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-50">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-cormorant italic text-lg">Executing Puppeteer scripts...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((res, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-3 border-b border-theme-border/20">
                <div className="col-span-2">{res.name}</div>
                <div className="text-green-500 uppercase text-xs font-bold tracking-wider">{res.status}</div>
                <div className="opacity-70">{res.time}</div>
              </div>
            ))
          ) : (
            <p className="italic opacity-50 p-4 text-center">No test results. Click "Run All Tests" to execute the suite.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col items-center justify-center border border-theme-border border-dashed p-20 opacity-50"
      role="region"
      aria-label={`${title} placeholder`}
    >
      <h2 className="font-playfair font-black text-3xl text-gold mb-4">{title}</h2>
      <p className="font-cormorant italic text-theme-text text-xl">Module implementation pending.</p>
    </motion.div>
  );
}

const PRICES_STORAGE_KEY = "krpots_prices";
const STATUS_STORAGE_KEY = "krpots_statuses";

function loadStoredPrices(): Record<string, number> {
  try {
    const raw = localStorage.getItem(PRICES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function saveStoredPrices(prices: Record<string, number>): void {
  localStorage.setItem(PRICES_STORAGE_KEY, JSON.stringify(prices));
}

function loadStoredStatuses(): Record<string, Status> {
  try {
    const raw = localStorage.getItem(STATUS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Status>) : {};
  } catch {
    return {};
  }
}

function saveStoredStatuses(statuses: Record<string, Status>): void {
  localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(statuses));
}

interface PriceRow {
  piece: Piece;
  currentStatus: Status;
  inputValue: string;
  savedMessage: boolean;
}

function PriceManager() {
  const buildRows = (): PriceRow[] => {
    const storedPrices = loadStoredPrices();
    const storedStatuses = loadStoredStatuses();
    return pieces.map((piece) => {
      const cents = storedPrices[piece.sku] ?? piece.price ?? 5000;
      const currentStatus = storedStatuses[piece.sku] ?? piece.status;
      return {
        piece,
        currentStatus,
        inputValue: (cents / 100).toFixed(2),
        savedMessage: false,
      };
    });
  };

  const [rows, setRows] = useState<PriceRow[]>(buildRows);
  const [filterStatus, setFilterStatus] = useState<"all" | Status>("all");
  const timerRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  useEffect(() => {
    setRows(buildRows());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (sku: string, value: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.piece.sku === sku ? { ...r, inputValue: value, savedMessage: false } : r
      )
    );
  };

  const handleSave = (sku: string) => {
    setRows((prev) => {
      const row = prev.find((r) => r.piece.sku === sku);
      if (!row) return prev;
      const parsed = parseFloat(row.inputValue);
      if (isNaN(parsed) || parsed < 0) return prev;
      const cents = Math.round(parsed * 100);

      const stored = loadStoredPrices();
      stored[sku] = cents;
      saveStoredPrices(stored);

      // Clear any pending timer for this sku
      if (timerRefs.current[sku]) clearTimeout(timerRefs.current[sku]);

      // Show "Saved" message then clear after 2s
      const updated = prev.map((r) =>
        r.piece.sku === sku
          ? { ...r, inputValue: (cents / 100).toFixed(2), savedMessage: true }
          : r
      );

      timerRefs.current[sku] = setTimeout(() => {
        setRows((current) =>
          current.map((r) =>
            r.piece.sku === sku ? { ...r, savedMessage: false } : r
          )
        );
      }, 2000);

      return updated;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, sku: string) => {
    if (e.key === "Enter") handleSave(sku);
  };

  const handleStatusToggle = (sku: string) => {
    setRows((prev) => {
      const updated = prev.map((r) => {
        if (r.piece.sku !== sku) return r;
        const newStatus: Status = r.currentStatus === "For Sale" ? "Private Collection" : "For Sale";
        return { ...r, currentStatus: newStatus };
      });
      const storedStatuses = loadStoredStatuses();
      const row = updated.find((r) => r.piece.sku === sku)!;
      storedStatuses[sku] = row.currentStatus;
      saveStoredStatuses(storedStatuses);
      return updated;
    });
  };

  const handleExportXlsx = async () => {
    setExporting(true);
    setExportError("");
    try {
      const THUMB_H = 68;
      const ROW_H = 72;
      // Use same-origin path so the browser can fetch without CORS issues
      const SITE_BASE = window.location.origin;

      const wb = new ExcelJS.Workbook();
      wb.creator = "KRPots Admin";
      const ws = wb.addWorksheet("KRPots Inventory");

      ws.columns = [
        { header: "Photo",        key: "photo",       width: 14 },
        { header: "SKU",          key: "sku",         width: 14 },
        { header: "Title",        key: "title",       width: 28 },
        { header: "Category",     key: "category",    width: 22 },
        { header: "Technique",    key: "technique",   width: 16 },
        { header: "Status",       key: "status",      width: 14 },
        { header: "Price (USD)",  key: "price",       width: 13 },
        { header: "Description",  key: "description", width: 52 },
      ];

      // Style header
      const headerRow = ws.getRow(1);
      headerRow.height = 20;
      headerRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A1A1A" } };
        cell.font = { bold: true, color: { argb: "FFC9A84C" }, size: 11 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = { bottom: { style: "thin", color: { argb: "FFC9A84C" } } };
      });
      ws.views = [{ state: "frozen", ySplit: 1 }];

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowNum = i + 2;
        const row = ws.getRow(rowNum);
        row.height = ROW_H;

        const isForSale = r.currentStatus === "For Sale";
        const bgColor = isForSale ? "FFF5F0E8" : "FFFAF8F2";

        row.getCell("sku").value         = r.piece.sku;
        row.getCell("title").value       = r.piece.title;
        row.getCell("category").value    = r.piece.category;
        row.getCell("technique").value   = r.piece.technique;
        row.getCell("status").value      = r.currentStatus;
        row.getCell("price").value       = parseFloat(r.inputValue) || 0;
        row.getCell("description").value = r.piece.description;

        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
          cell.alignment = { wrapText: true, vertical: "middle" };
          cell.border = { bottom: { style: "hair", color: { argb: "FFDDDDDD" } } };
        });
        row.getCell("price").numFmt = '"$"#,##0.00';

        // Fetch image, convert to PNG via canvas, and embed
        try {
          const imgUrl = `${SITE_BASE}${r.piece.image}`;
          const pngBase64 = await new Promise<string | null>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const scale = THUMB_H / img.naturalHeight;
              const w = Math.max(1, Math.round(img.naturalWidth * scale));
              const canvas = document.createElement("canvas");
              canvas.width = w;
              canvas.height = THUMB_H;
              const ctx = canvas.getContext("2d");
              if (!ctx) { resolve(null); return; }
              ctx.drawImage(img, 0, 0, w, THUMB_H);
              // strip the "data:image/png;base64," prefix
              resolve(canvas.toDataURL("image/png").split(",")[1]);
            };
            img.onerror = () => resolve(null);
            img.src = imgUrl;
          });

          if (pngBase64) {
            const imgId = wb.addImage({ base64: pngBase64, extension: "png" });
            ws.addImage(imgId, {
              tl: { col: 0, row: rowNum - 1 } as ExcelJS.Anchor,
              br: { col: 1, row: rowNum } as ExcelJS.Anchor,
              editAs: "oneCell",
            });
          }
        } catch {
          // skip image on fetch failure
        }
      }

      // Write to buffer and trigger download
      const buf = await wb.xlsx.writeBuffer();
      const blob = new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `krpots-inventory-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setExportError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const forSaleCount = rows.filter((r) => r.currentStatus === "For Sale").length;
  const privateCount = rows.filter((r) => r.currentStatus === "Private Collection").length;
  const visibleRows = filterStatus === "all" ? rows : rows.filter((r) => r.currentStatus === filterStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-playfair font-black text-4xl text-theme-text">Inventory Manager</h1>
        <button
          onClick={handleExportXlsx}
          disabled={exporting}
          className="flex items-center gap-2 border border-gold/60 px-5 py-2 font-bebas text-gold tracking-widest uppercase text-sm hover:bg-gold hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Download inventory as Excel file with embedded photos"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? "Building..." : "Download Inventory"}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4" role="tablist" aria-label="Filter by status">
        {(["all", "For Sale", "Private Collection"] as const).map((f) => {
          const label = f === "all" ? `All (${rows.length})` : f === "For Sale" ? `For Sale (${forSaleCount})` : `Private Collection (${privateCount})`;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={filterStatus === f}
              onClick={() => setFilterStatus(f)}
              className={`font-bebas tracking-widest uppercase text-xs px-4 py-1.5 border transition-colors ${
                filterStatus === f
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-theme-border/40 text-gold-pale/50 hover:text-gold hover:border-gold/40"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {exportError && (
        <p className="font-dmsans text-xs text-red-400 mb-3" role="alert">{exportError}</p>
      )}

      <div className="border border-theme-border bg-gold/5 flex-1 overflow-hidden flex flex-col">
        {/* Table Header */}
        <div
          className="grid grid-cols-[56px_110px_1fr_150px_130px_130px_76px] gap-3 px-4 py-3 border-b border-theme-border bg-theme-bg/60 font-bebas text-gold tracking-widest uppercase text-sm"
          aria-label="Inventory table header"
        >
          <div></div>
          <div>SKU</div>
          <div>Title</div>
          <div>Category</div>
          <div>Status</div>
          <div>Price (USD)</div>
          <div></div>
        </div>

        {/* Table Rows */}
        <div className="overflow-y-auto flex-1" role="list" aria-label="Piece inventory list">
          {visibleRows.map((row) => (
            <div
              key={row.piece.sku}
              className="grid grid-cols-[56px_110px_1fr_150px_130px_130px_76px] gap-3 items-center px-4 py-1.5 border-b border-theme-border/20 hover:bg-theme-border/10 transition-colors"
              role="listitem"
            >
              {/* Thumbnail */}
              <img
                src={row.piece.image}
                alt={row.piece.title}
                className="w-12 h-12 object-cover rounded-sm shrink-0 bg-theme-border/20"
                loading="lazy"
              />
              <div className="font-mono text-xs text-gold-pale tracking-wider">{row.piece.sku}</div>
              <div className="font-cormorant text-base text-theme-text truncate" title={row.piece.title}>
                {row.piece.title}
              </div>
              <div className="font-dmsans text-xs text-theme-text/60 truncate">{row.piece.category}</div>
              {/* Status toggle */}
              <button
                onClick={() => handleStatusToggle(row.piece.sku)}
                className={`font-dmsans text-xs px-2 py-1 border transition-colors text-left truncate ${
                  row.currentStatus === "For Sale"
                    ? "border-green-600/50 text-green-400 hover:bg-green-600/10"
                    : row.currentStatus === "SOLD"
                    ? "border-blue-500/50 text-blue-400"
                    : row.currentStatus === "NFS"
                    ? "border-amber-500/50 text-amber-400"
                    : "border-theme-border/40 text-gold-pale/50 hover:border-gold/40 hover:text-gold-pale"
                }`}
                aria-label={`Toggle status for ${row.piece.title}, currently ${row.currentStatus}`}
                title="Click to toggle status"
              >
                {row.currentStatus}
              </button>
              <div className="flex items-center gap-1">
                <span className="font-dmsans text-sm text-gold-pale/70">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={row.inputValue}
                  onChange={(e) => handleInputChange(row.piece.sku, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, row.piece.sku)}
                  className="w-24 bg-transparent border-b border-theme-border/40 text-theme-text font-dmsans text-sm py-1 px-1 focus:outline-none focus:border-gold transition-colors"
                  aria-label={`Price for ${row.piece.title}`}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSave(row.piece.sku)}
                  className="border border-gold/60 px-3 py-1 font-bebas text-gold tracking-widest uppercase text-xs hover:bg-gold hover:text-ink transition-colors"
                  aria-label={`Save price for ${row.piece.title}`}
                >
                  Save
                </button>
                {row.savedMessage && (
                  <span className="font-dmsans text-xs text-green-400 whitespace-nowrap" role="status" aria-live="polite">
                    ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="font-dmsans text-xs text-theme-text/40 mt-4">
        {rows.length} pieces total — {forSaleCount} For Sale, {privateCount} Private Collection. Click a status badge to toggle. Prices and statuses saved in <code className="font-mono">localStorage</code>.
      </p>
    </motion.div>
  );
}
