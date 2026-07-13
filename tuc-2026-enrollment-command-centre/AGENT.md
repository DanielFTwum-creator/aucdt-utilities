# tuc-2026-enrollment-command-centre - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for tuc-2026-enrollment-command-centre.

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .gitignore
```text
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example

```

### FILE: deploy.ps1
```ps1
# TUC 2026 Enrollment Command Centre Deployment Script
# SCP-based deployment using bash

param(
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/enrollment-2026/",
    [switch]$Build = $false
)

Write-Host "=== TUC 2026 ENROLLMENT COMMAND CENTRE DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath`n"

# Build if requested
if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Write-Host "Error: dist/ not found. Run with -Build flag." -ForegroundColor Red
    exit 1
}

Write-Host "Creating directory..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-2026-enrollment-command-centre' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /enrollment-2026/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /enrollment-2026/index.html [QSA,L]
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/enrollment-2026`n"

```

### FILE: index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TUC 2026 Enrollment Command Centre</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


```

### FILE: metadata.json
```json
{
  "name": "TUC 2026 Enrollment Command Centre",
  "description": "An interactive enrollment and marketing strategy dashboard for Techbridge University College.",
  "requestFramePermissions": [],
  "majorCapabilities": [
    "Interactive strategic marketing timeline",
    "Demographic segmentation strategies",
    "Visual funnel conversion analytics",
    "Operational activation checklist"
  ]
}

```

### FILE: package.json
```json
{
  "name": "tuc-2026-enrollment-command-centre",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^6.2.3",
    "express": "^4.21.2",
    "dotenv": "^17.2.3",
    "motion": "^12.23.24"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3",
    "@types/express": "^4.17.21"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9eba0f4c-b038-4055-938a-c1143fc81f4a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/App.tsx
```typescript
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

```

### FILE: src/components/Header.tsx
```typescript
import React from "react";
import { 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Target 
} from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="mb-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-accent uppercase">
            <MapPin className="h-3 w-3" />
            Oyibi, Greater Accra · TUCHQ-2026
          </div>
          <h1 className="font-serif text-4xl leading-tight text-text md:text-5xl">
            July 2026 <span className="text-accent italic">Enrollment Plan</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-text-muted">
            <Calendar className="h-4 w-4 text-accent" />
            May 11 — July 7
          </div>
          <div className="flex items-center gap-2 rounded-full border border-teal-border bg-teal-bg px-4 py-2 text-xs font-medium text-teal-text">
            <TrendingUp className="h-4 w-4" />
            Conversion Priority
          </div>
          <div className="flex items-center gap-2 rounded-full border border-amber-border bg-amber-bg px-4 py-2 text-xs font-medium text-amber-text">
            <Target className="h-4 w-4" />
            Target: 40%
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 border-t border-border pt-6">
        <div className="h-2 w-2 rounded-full bg-green animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">System Status: Nominal</span>
      </div>
    </header>
  );
};

```

### FILE: src/components/Sidebar.tsx
```typescript
import React from "react";
import { 
  Rows3, 
  UsersRound, 
  Filter, 
  CheckSquare, 
  Settings,
  HelpCircle,
  LogOut,
  ShieldAlert,
  Sun,
  Moon,
  Eye
} from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const navItems = [
  { id: 'timeline', label: 'Timeline', icon: Rows3 },
  { id: 'segments', label: 'By Segment', icon: UsersRound },
  { id: 'funnel', label: 'Funnel Fixes', icon: Filter },
  { id: 'week1', label: 'Week 1 Checklist', icon: CheckSquare },
  { id: 'admin', label: 'Admin Panel', icon: ShieldAlert },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, theme, setTheme }) => {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-white/5 bg-sidebar md:flex" aria-label="Main Navigation">
      <div className="flex h-24 items-center px-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 shadow-lg shadow-indigo-500/20" />
          <div>
            <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Techbridge</div>
            <div className="font-serif text-lg text-slate-100 italic">Command</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8">
        <div className="mb-4 px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Operational Modules</div>
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-white/10 text-white" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 h-5 w-1 rounded-r-full bg-indigo-500"
                />
              )}
              <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110`} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-12 mb-4 px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Accessibility & Theme</div>
        <div className="grid grid-cols-3 gap-2 px-2">
          {[
            { id: 'light', icon: Sun, label: 'Light' },
            { id: 'dark', icon: Moon, label: 'Dark' },
            { id: 'high-contrast', icon: Eye, label: 'Contrast' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              aria-label={`Switch to ${t.label} theme`}
              className={`flex flex-col items-center justify-center rounded-xl p-3 transition-all ${
                theme === t.id 
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              }`}
            >
              <t.icon className="h-4 w-4" />
              <span className="mt-1 text-[8px] font-bold uppercase tracking-tighter">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4">
        <button className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-6 py-4 text-sm font-medium text-slate-300 transition-all hover:bg-white/10" aria-label="User profile">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">DT</div>
            <span>Daniel Twum</span>
          </div>
          <LogOut className="h-4 w-4 opacity-50" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
};

```

### FILE: src/components/Views.tsx
```typescript
import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  CornerDownRight, 
  Smartphone, 
  Home,
  Check
} from "lucide-react";
import { 
  WEEKS, 
  SEGMENTS, 
  FUNNEL_DATA, 
  CHECKLIST_SECTIONS 
} from "../data/planData";

export const TimelineView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-5 gap-4">
        <div />
        {['Marketing', 'Admissions', 'Community', 'Ops/Systems'].map((head) => (
          <div key={head} className="px-2 text-[10px] font-bold tracking-widest text-text-muted uppercase">
            {head}
          </div>
        ))}
      </div>
      
      <div className="space-y-3">
        {WEEKS.map((w, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-3">
            <div className="flex flex-col justify-center rounded-xl bg-card border border-border px-4 py-3 shadow-sm">
              <div className="text-sm font-bold text-text">{w.wk}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">{w.dt}</div>
            </div>
            <div className="rounded-xl border border-blue-border bg-blue-bg p-4 text-xs leading-relaxed text-blue-text">
              {w.blue}
            </div>
            <div className="rounded-xl border border-teal-border bg-teal-bg p-4 text-xs leading-relaxed text-teal-text">
              {w.teal}
            </div>
            <div className={`rounded-xl p-4 text-xs leading-relaxed ${w.amber ? 'border border-amber-border bg-amber-bg text-amber-text' : 'bg-card border border-border/50 opacity-20'}`}>
              {w.amber}
            </div>
            <div className="rounded-xl border border-purple-border bg-purple-bg p-4 text-xs leading-relaxed text-purple-text">
              {w.purple}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const SegmentsView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6 md:grid-cols-3"
    >
      {SEGMENTS.map((s, idx) => (
        <div key={idx} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 pt-12 transition-all hover:bg-bg">
          <div 
            className="absolute top-0 left-0 h-1.5 w-full opacity-50" 
            style={{ backgroundColor: `var(--color-${s.iconClass}-text)` }}
          />
          
          <div 
            className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition-transform group-hover:scale-110"
            style={{ 
              backgroundColor: `var(--color-${s.iconClass}-bg)`,
              color: `var(--color-${s.iconClass}-text)`,
              borderColor: `var(--color-${s.iconClass}-border)`
            }}
          >
            <s.icon className="h-6 w-6" />
          </div>
          
          <h3 className="mb-2 text-xl font-medium text-text">{s.title}</h3>
          <div className="mb-8 rounded-2xl border-l-2 border-accent bg-bg px-4 py-3 text-sm italic leading-relaxed text-text-muted">
            {s.mindset}
          </div>
          
          <div className="space-y-4">
            {s.items.map((item, iidx) => (
              <div key={iidx} className="flex gap-3 text-sm leading-relaxed text-text-muted">
                <CornerDownRight className="mt-1 h-3 w-3 shrink-0 opacity-40" />
                <span>
                  {item.t} <span className="ml-2 inline-block rounded-full border border-blue-border bg-blue-bg px-2.5 py-0.5 text-[10px] font-bold text-blue-text">{item.tag}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export const FunnelView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="rounded-3xl border border-border bg-card p-10">
        <div className="mb-10 max-w-xl">
          <h3 className="mb-3 text-2xl font-medium text-text italic font-serif underline decoration-accent/30 underline-offset-8">Conversion Gap Analysis</h3>
          <p className="text-sm leading-relaxed text-text-muted">
            Applications drop from 75% to 18% at two critical stages. The tactical fixes below target the "Silence Gap" and "Parent Trust" bottlenecks.
          </p>
        </div>
        
        <div className="space-y-6">
          {FUNNEL_DATA.map((f, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <div className="w-24 shrink-0 text-right text-xs font-bold tracking-widest text-text-muted uppercase">{f.label}</div>
              <div className="relative flex-1">
                <div className="h-10 w-full overflow-hidden rounded-xl bg-bg border border-border">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${f.pct}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="flex h-full items-center px-4" 
                    style={{ background: f.fill, border: `1px solid ${f.stroke}` }}
                  >
                    <span className="text-xs font-bold" style={{ color: f.textCol }}>{f.pct}%</span>
                  </motion.div>
                </div>
              </div>
              <div className="w-32 shrink-0">
                {f.badge && (
                  <span className={`inline-block rounded-full px-4 py-1.5 text-[10px] font-bold border ${
                    f.badge.includes('⚠') 
                    ? 'bg-amber-bg text-amber-text border-amber-border' 
                    : 'bg-blue-bg text-blue-text border-blue-border'
                  }`}>
                    {f.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-accent/30">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-bg text-blue-text border border-blue-border">
              <Smartphone className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-text">Fix 1: Post-Apply Silence</h4>
          </div>
          <p className="mb-6 text-xs text-text-muted">7-day automated WhatsApp nurture sequence to reduce lead decay.</p>
          <div className="space-y-3">
            {[1, 3, 5, 7].map((day, d) => (
              <div key={day} className="flex gap-3 text-xs leading-relaxed text-text-muted">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-bg font-bold text-blue-text border border-blue-border">{d+1}</span>
                <span><strong className="text-text">Day {day}:</strong> {['Confirm next steps', 'Share student spotlight', 'Virtual tour invite', 'Personal call'][d]}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-amber-border/30">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-bg text-amber-text border border-amber-border">
              <Home className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-text">Fix 2: Parent Buy-In</h4>
          </div>
          <p className="mb-6 text-xs text-text-muted">Targeted collateral for parents addressing accreditation and career ROI.</p>
          <div className="space-y-3">
            {['Parent Info Pack (PDF)', 'Virtual Parent Night', 'In-person Q&A', 'Testimonial Drive'].map((step, s) => (
              <div key={s} className="flex gap-3 text-xs leading-relaxed text-text-muted">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-bg font-bold text-amber-text border border-amber-border">{String.fromCharCode(65+s)}</span>
                <span className="text-text">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ChecklistView: React.FC = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  
  const totalItems = CHECKLIST_SECTIONS.reduce((acc, sec) => acc + sec.items.length, 0);
  const doneCount = completed.size;
  const progressPct = Math.round((doneCount / totalItems) * 100);

  const toggleTask = (id: string) => {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompleted(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="rounded-3xl bg-blue-bg border border-blue-border p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-medium text-text italic font-serif">Week 1 Readiness</h3>
            <p className="text-xs text-text-muted mt-1">Foundation tasks to secure the funnel</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-3xl font-light text-text">{progressPct}%</div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{doneCount} of {totalItems} Complete</div>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-bg border border-border">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            className="h-full bg-accent shadow-[0_0_20px_rgba(99,102,241,0.3)]" 
          />
        </div>
      </div>

      <div className="space-y-8">
        {CHECKLIST_SECTIONS.map((sec, si) => (
          <div key={si}>
            <div className="mb-4 flex items-center gap-3">
              <div className="text-[10px] font-bold tracking-widest text-text-muted uppercase">{sec.label}</div>
              <span className={`rounded-full border px-3 py-0.5 text-[9px] font-bold uppercase transition-colors ${sec.badgeClass}`}>{sec.badge}</span>
            </div>
            <div className="space-y-2">
              {sec.items.map((it, ii) => {
                const id = `${si}-${ii}`;
                const isDone = completed.has(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleTask(id)}
                    className={`flex w-full items-start gap-4 rounded-2xl border px-6 py-5 text-left transition-all ${
                      isDone 
                        ? "border-teal-border bg-teal-bg opacity-50" 
                        : "border-border bg-card shadow-sm hover:border-accent/40 hover:bg-bg"
                    }`}
                  >
                    <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                      isDone ? "border-green bg-green text-white" : "border-border"
                    }`}>
                      {isDone && <Check className="h-4 w-4" strokeWidth={3} />}
                    </div>
                    <div>
                      <div className={`text-sm font-medium transition-all ${isDone ? "text-text-muted line-through" : "text-text"}`}>
                        {it.t}
                      </div>
                      <div className="mt-1 text-[10px] font-bold tracking-wider text-text-muted uppercase">{it.meta}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const AdminView: React.FC = () => {
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [logs, setLogs] = useState<{ id: string; action: string; time: string }[]>([
    { id: "1", action: "System initialized", time: "2026-05-11 10:00" },
    { id: "2", action: "Timeline baseline generated", time: "2026-05-11 10:05" },
  ]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "TUC2026") {
      setIsUnlocked(true);
      setLogs(prev => [{
        id: Math.random().toString(),
        action: "Admin terminal accessed",
        time: new Date().toLocaleTimeString()
      }, ...prev]);
    } else {
      alert("Invalid Command Key");
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-10 text-center backdrop-blur-xl shadow-xl">
          <h2 className="mb-2 text-2xl font-serif text-text italic underline decoration-accent/30 underline-offset-8">Command Node</h2>
          <p className="mb-8 text-sm text-text-muted">Restricted access area. Enter tactical authorization key.</p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              placeholder="Authorization Key"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg px-6 py-4 text-center text-sm tracking-widest text-text placeholder:text-text-muted focus:border-accent focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-accent py-4 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover active:scale-95"
            >
              Verify Authority
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-accent/30 shadow-sm">
          <h3 className="mb-6 font-bold text-text">System Overrides</h3>
          <div className="space-y-4">
            <button className="w-full rounded-xl bg-bg border border-border px-6 py-4 text-left text-sm font-medium text-text-muted transition-all hover:bg-red/10 hover:text-red hover:border-red/30">
              Reset Campaign State
            </button>
            <button className="w-full rounded-xl bg-bg border border-border px-6 py-4 text-left text-sm font-medium text-text-muted transition-all hover:bg-green/10 hover:text-green hover:border-green/30">
              Broadcast Enrollment Alert
            </button>
          </div>
        </div>
        
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <h3 className="mb-6 font-bold text-text">Audit Log</h3>
          <div className="space-y-3 font-mono text-[10px]">
            {logs.map((log) => (
              <div key={log.id} className="flex justify-between border-b border-border pb-2 text-text-muted">
                <span className="text-accent">{log.action}</span>
                <span>{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

```

### FILE: src/data/planData.ts
```typescript
import { 
  School, 
  Clock, 
  Briefcase 
} from "lucide-react";

export const WEEKS = [
  { wk: 'Wk 1', dt: 'May 11', blue: 'Set up WhatsApp nurture sequence', teal: 'Audit all pending applications', amber: 'Call every cold applicant personally', purple: 'Assign dedicated admissions contact' },
  { wk: 'Wk 2', dt: 'May 18', blue: 'Launch Instagram & TikTok content', teal: 'Create parent info pack (PDF)', amber: 'Film 2 student transformation videos', purple: 'Fix website mobile load speed' },
  { wk: 'Wk 3', dt: 'May 25', blue: 'Run gap-year targeted Facebook/IG ads', teal: 'Host virtual parent info session', amber: 'Add WhatsApp chat button to website', purple: 'Recruit 8–10 student ambassadors' },
  { wk: 'Wk 4', dt: 'Jun 1',  blue: 'SHS workshop — 2 schools in Accra', teal: 'Film 2 more student stories', amber: 'Launch "Apply in 2 minutes" mobile form', purple: 'Referral discount program live' },
  { wk: 'Wk 5', dt: 'Jun 8',  blue: 'LinkedIn push — working adult segment', teal: 'Open day on campus (hands-on)', amber: 'Google My Business fully optimised', purple: 'Re-engagement WhatsApp blast to all leads' },
  { wk: 'Wk 6', dt: 'Jun 15', blue: 'SHS workshop — 2 more schools', teal: 'Alumni testimonial campaign', amber: '2nd parent info session (in-person)', purple: 'Review ad performance, reallocate budget' },
  { wk: 'Wk 7', dt: 'Jun 22', blue: 'Final social media push — urgency content', teal: 'Personal calls to all warm leads', amber: 'Last-chance open day', purple: 'Confirm enrollment with deposited students' },
  { wk: 'Wk 8', dt: 'Jun 29', blue: 'Final applicant follow-up sweep', teal: 'Onboarding comms to enrolled students', amber: '', purple: 'Document what worked for Jan 2027' }
];

export const SEGMENTS = [
  {
    icon: School, iconClass: 'blue',
    title: 'Fresh SHS graduates',
    mindset: '"I want university but not sure I\'ll make the cut-off"',
    items: [
      { t: 'Run design/entrepreneurship workshops inside SHS schools — not just a table at a career fair', tag: 'Wk 4 & 6' },
      { t: 'Recruit student ambassadors to recruit from their own former schools', tag: 'Wk 3' },
      { t: 'TikTok & IG Reels — campus life, studio work, student projects', tag: 'Wk 2' },
      { t: 'Peer testimonial content — "why I chose TUC" short videos', tag: 'Wk 3' }
    ]
  },
  {
    icon: Clock, iconClass: 'teal',
    title: 'Gap year / missed cut-off',
    mindset: '"I\'m stuck — I need a solution now"',
    items: [
      { t: 'Facebook & IG ads targeted at 18–22s in Accra — "smart pivot" framing, not consolation', tag: 'Wk 3' },
      { t: 'Dedicated landing page: "Didn\'t get your first choice? Here\'s why TUC is the better outcome"', tag: 'Wk 2' },
      { t: 'WhatsApp direct line — staffed by a real admissions person, not a bot', tag: 'Wk 1' },
      { t: 'Student stories from people who were in the same position and thrived at TUC', tag: 'Wk 4' }
    ]
  },
  {
    icon: Briefcase, iconClass: 'amber',
    title: 'Working adults',
    mindset: '"I need to upskill but I can\'t quit my job"',
    items: [
      { t: 'LinkedIn sponsored posts — target professionals in Accra, age 25–40', tag: 'Wk 5' },
      { t: 'Confirm evening/weekend programme availability — this is their #1 barrier', tag: 'Wk 1' },
      { t: 'Approach HR managers at mid-size Ghanaian firms for staff development partnerships', tag: 'Wk 5–6' },
      { t: 'Pitch is career ROI: "Earn your degree while keeping your salary"', tag: 'Wk 5' }
    ]
  }
];

export const FUNNEL_DATA = [
  { label: 'Awareness', pct: 100, fill: 'var(--color-blue-bg)', stroke: 'var(--color-blue-border)', textCol: 'var(--color-blue-text)', badge: '' },
  { label: 'Application', pct: 75, fill: 'var(--color-teal-bg)', stroke: 'var(--color-teal-border)', textCol: 'var(--color-teal-text)', badge: 'Working well' },
  { label: 'Post-apply', pct: 45, fill: 'var(--color-amber-bg)', stroke: 'var(--color-amber-border)', textCol: 'var(--color-amber-text)', badge: '⚠ Silence gap' },
  { label: 'Parent buy-in', pct: 30, fill: 'var(--color-amber-bg)', stroke: 'var(--color-amber-border)', textCol: 'var(--color-amber-text)', badge: '⚠ Parent gap' },
  { label: 'Enrolled', pct: 18, fill: 'var(--color-purple-bg)', stroke: 'var(--color-purple-border)', textCol: 'var(--color-purple-text)', badge: 'Target: 35–40%' }
];

export const CHECKLIST_SECTIONS = [
  {
    label: 'Must do — plug the conversion leak first',
    badge: 'Conversion priority',
    badgeClass: 'bg-teal-bg text-teal-text border-teal-border',
    items: [
      { t: 'Audit every pending application — how many, how old, where they\'re from', meta: 'Admissions lead · 2 hrs' },
      { t: 'Assign one person as the dedicated admissions follow-up contact', meta: 'Management decision · 30 mins' },
      { t: 'Call every cold applicant personally', meta: 'Admissions lead · half day' },
      { t: 'Draft the 7-day WhatsApp nurture sequence (4 messages)', meta: 'Marketing team · 3 hrs' },
      { t: 'Confirm whether evening/weekend classes are available for working adults', meta: 'Academic team · 1 hr' }
    ]
  },
  {
    label: 'Start this week — top of funnel',
    badge: 'Awareness',
    badgeClass: 'bg-blue-bg text-blue-text border-blue-border',
    items: [
      { t: 'Set up or claim Google My Business listing and fill it out completely', meta: 'Marketing · 1 hr · free' },
      { t: 'Film one "day in the life at TUC" short video with a current student', meta: 'Marketing · half day' },
      { t: 'Add a WhatsApp chat button to the TUC website homepage', meta: 'Web person · 1 hr' },
      { t: 'Identify 8–10 current students to become paid/incentivised ambassadors', meta: 'Student affairs · 2 hrs' }
    ]
  }
];

```

### FILE: src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "DM Serif Display", serif;

  /* Theme-aware variables */
  --color-bg: var(--bg-primary);
  --color-sidebar: var(--bg-sidebar);
  --color-card: var(--bg-card);
  --color-border: var(--border-color);
  --color-text: var(--text-primary);
  --color-text-muted: var(--text-muted);
  
  --color-accent: var(--brand-accent);
  --color-accent-hover: var(--brand-accent-hover);
  
  --color-blue-bg: var(--blue-tint-bg);
  --color-blue-border: var(--blue-tint-border);
  --color-blue-text: var(--blue-tint-text);
  
  --color-teal-bg: var(--teal-tint-bg);
  --color-teal-border: var(--teal-tint-border);
  --color-teal-text: var(--teal-tint-text);
  
  --color-amber-bg: var(--amber-tint-bg);
  --color-amber-border: var(--amber-tint-border);
  --color-amber-text: var(--amber-tint-text);
  
  --color-purple-bg: var(--purple-tint-bg);
  --color-purple-border: var(--purple-tint-border);
  --color-purple-text: var(--purple-tint-text);
  
  --color-green: #22c55e;
  --color-red: #ef4444;
}

@layer base {
  :root {
    --bg-primary: #f8fafc;
    --bg-sidebar: #0f172a;
    --bg-card: #ffffff;
    --border-color: #e2e8f0;
    --text-primary: #1e293b;
    --text-muted: #64748b;
    --brand-accent: #6366f1;
    --brand-accent-hover: #4f46e5;

    --blue-tint-bg: #eef2ff;
    --blue-tint-border: #c7d2fe;
    --blue-tint-text: #4338ca;

    --teal-tint-bg: #f0fdf4;
    --teal-tint-border: #bbf7d0;
    --teal-tint-text: #15803d;

    --amber-tint-bg: #fffbeb;
    --amber-tint-border: #fde68a;
    --amber-tint-text: #b45309;

    --purple-tint-bg: #faf5ff;
    --purple-tint-border: #e9d5ff;
    --purple-tint-text: #7e22ce;
  }

  [data-theme='dark'] {
    --bg-primary: #020617;
    --bg-sidebar: #0f172a;
    --bg-card: #0f172a / 50%;
    --border-color: rgba(255, 255, 255, 0.05);
    --text-primary: #f1f5f9;
    --text-muted: #94a3b8;
    --brand-accent: #818cf8;
    --brand-accent-hover: #6366f1;

    --blue-tint-bg: rgba(99, 102, 241, 0.1);
    --blue-tint-border: rgba(99, 102, 241, 0.2);
    --blue-tint-text: #a5b4fc;

    --teal-tint-bg: rgba(34, 197, 94, 0.1);
    --teal-tint-border: rgba(34, 197, 94, 0.2);
    --teal-tint-text: #86efac;

    --amber-tint-bg: rgba(245, 158, 11, 0.1);
    --amber-tint-border: rgba(245, 158, 11, 0.2);
    --amber-tint-text: #fcd34d;

    --purple-tint-bg: rgba(168, 85, 247, 0.1);
    --purple-tint-border: rgba(168, 85, 247, 0.2);
    --purple-tint-text: #d8b4fe;
  }

  [data-theme='high-contrast'] {
    --bg-primary: #000000;
    --bg-sidebar: #000000;
    --bg-card: #000000;
    --border-color: #ffffff;
    --text-primary: #ffffff;
    --text-muted: #ffffff;
    --brand-accent: #ffff00;
    --brand-accent-hover: #ffff00;

    --blue-tint-bg: #000000;
    --blue-tint-border: #ffffff;
    --blue-tint-text: #ffffff;

    --teal-tint-bg: #000000;
    --teal-tint-border: #ffffff;
    --teal-tint-text: #ffffff;

    --amber-tint-bg: #000000;
    --amber-tint-border: #ffffff;
    --amber-tint-text: #ffffff;

    --purple-tint-bg: #000000;
    --purple-tint-border: #ffffff;
    --purple-tint-text: #ffffff;
  }

  body {
    @apply bg-bg text-text antialiased transition-colors duration-200;
    font-family: var(--font-sans);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}

/* Accessibility: Focus highlights */
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-accent;
}
```

### FILE: src/main.tsx
```typescript
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

```

### FILE: SRS.md
```md
# Software Requirements Specification (SRS)
## Project: TUC Enrollment Command Centre
**Document ID:** TUC-ICT-SRS-2026-001  
**Version:** 1.1.0  
**Status:** Baseline  
**Date:** May 11, 2026

---

### 1. Introduction
#### 1.1 Purpose
This document specifies the functional and non-functional requirements for the TUC Enrollment Command Centre (v1.0), a tactical dashboard for managing the July 2026 student enrollment cycle.

#### 1.2 Scope
The system provides a high-level strategic overview and tactical execution framework for the TUC Marketing Division. It covers timeline management, demographic segmentation, funnel leak analysis, and operational task tracking.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **TUC**: Techbridge University College.
- **SHS**: Senior High School.
- **Command Centre**: The interactive dashboard interface.
- **Funnel**: The series of stages a prospective student moves through from awareness to enrollment.

#### 1.4 References
- TUC Marketing Strategy 2026.
- IEEE 830-1998 Standard for Software Requirements Specifications.

#### 1.5 Overview
The remainder of this document describes the general product perspective, specific functional requirements, and non-functional constraints including design aesthetics and performance benchmarks.

---

### 2. General Description
#### 2.1 Product Perspective
The application is a standalone React-based command dashboard. It is designed to run within the TUC internal intranet/preview environment.

#### 2.2 Product Functions
- **Master Timeline**: 8-week multi-stream roadmap.
- **Segment Matrix**: Demographic-specific marketing tactics.
- **Funnel Analytics**: Visualization of conversion and abandonment rates.
- **Deployment Checklist**: Real-time status tracking for activation tasks.

#### 2.3 User Characteristics
- **Marketing Lead**: Strategic decision-maker.
- **Admissions Officer**: Task executor.

#### 2.4 Constraints
- Must use Tailwind CSS for all styling.
- Must follow the "Professional Polish / Nova Core" design system.
- Deployment restricted to Cloud Run via AI Studio.

---

### 3. Specific Requirements
#### 3.1 Functional Requirements
- **FR-01 (Navigation)**: The system shall provide a sidebar for navigation between operational nodes.
- **FR-02 (Timeline)**: The system shall display a grid of tasks organized by week and functional stream.
- **FR-03 (Funnel)**: The system shall visualize the enrollment drop-off points with clear callouts for "leaks."
- **FR-04 (Tracking)**: The system shall allow users to mark tasks as complete in the Week 1 checklist.

#### 3.2 Interface Requirements
- **Sidebar**: Fixed-width (72px md:288px) navigation rail.
- **Color Palette**: Dark slate backgrounds with indigo accents (#6366f1).
- **Typography**: Inter Sans for UI, Serif for headers.

#### 3.3 Non-Functional Requirements
- **Usability**: Single-click tab transitions with <200ms latency.
- **Design**: "Professional Polish" aesthetic (sharp edges, subtle shadows, clear hierarchy).

---
**Approved By:** TUC ICT Department

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}

```

### FILE: vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/enrollment-2026/',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

```

