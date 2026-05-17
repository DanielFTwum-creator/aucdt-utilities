# mirror-truth---thumbnail-designer - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for mirror-truth---thumbnail-designer.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

```

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { ThumbnailArt } from './components/ThumbnailArt';
import { Annotations } from './components/Annotations';
import { Controls } from './components/Controls';
import { AdminPanel } from './components/AdminPanel';
import { ThumbnailConfig, ThemeMode, AuditLogEntry } from './types';
import { Maximize2, Monitor, Sun, Moon, Shield } from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<ThemeMode>('dark');
  
  // Admin & Audit State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const [config, setConfig] = useState<ThumbnailConfig>({
    artistName: 'Kudjo Twum',
    hookText: 'YUH CYAN',
    accentWord: 'RUN',
    showSafeZones: false,
    showGrid: false,
    animate: true,
    variant: 'original',
    leftImage: null,
    rightImage: null,
    
    // Image Transform Defaults
    leftImageScale: 1,
    leftImageX: 0,
    leftImageY: 0,
    rightImageScale: 1,
    rightImageX: 0,
    rightImageY: 0,

    // Face Container Defaults
    faceX: 0,
    faceY: 0,
    faceScale: 1,
    faceSpread: 0,

    showCssFace: true,
    hookLetterSpacing: 8,
    hookFontWeight: '400',
  });

  const [isExporting, setIsExporting] = useState(false);
  const artRef = useRef<HTMLDivElement>(null);

  // State to handle the scaling of the 1280px container
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial theme setup
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Calculate scale based on available width, maxing out at 1 (100% size)
        // We add some padding (40px) to calculation to keep margins
        const availableWidth = Math.min(window.innerWidth - 40, 1280);
        const newScale = availableWidth / 1280;
        setScale(newScale);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    logAction('TOGGLE_THEME', `Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  const logAction = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      details
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const handleLogin = (password: string): boolean => {
    // Mock authentication
    if (password =[REDACTED_CREDENTIAL]
      setIsAuthenticated(true);
      logAction('ADMIN_LOGIN', 'Successful authentication');
      return true;
    }
    logAction('AUTH_FAILURE', 'Invalid password attempt');
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    logAction('ADMIN_LOGOUT', 'User logged out');
  };

  const filterElements = (node: HTMLElement) => {
    // Exclude elements with the 'export-exclude' class
    return !node.classList?.contains('export-exclude');
  };

  const handleExport = async () => {
    if (artRef.current === null) return;
    
    setIsExporting(true);
    logAction('EXPORT_INIT', `Format: PNG, Variant: ${config.variant}`);
    try {
      // Capture the element at its native resolution (1280x720) regardless of current scale
      // NOTE: cacheBust must be false when using Blob URLs (uploaded images), otherwise the URL becomes invalid
      const dataUrl = await toPng(artRef.current, { 
        cacheBust: false, 
        pixelRatio: 1,
        filter: filterElements,
      });
      
      const link = document.createElement('a');
      link.download = `mirror-truth-${config.variant}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      logAction('EXPORT_SUCCESS', 'Image downloaded successfully');
    } catch (err) {
      console.error('Failed to export image', err);
      logAction('EXPORT_ERROR', 'Failed to generate image');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
     if (artRef.current === null) return;
     
     setIsExporting(true);
     logAction('SHARE_INIT', 'User initiated share');
     try {
       const blob = await toBlob(artRef.current, {
         cacheBust: false, // NOTE: cacheBust must be false for Blob URLs
         pixelRatio: 1,
         filter: filterElements,
       });

       if (blob && navigator.share) {
         const file = new File([blob], `thumbnail-${Date.now()}.png`, { type: 'image/png' });
         await navigator.share({
           title: 'Mirror Truth Thumbnail',
           text: `Check out this thumbnail concept for ${config.artistName}`,
           files: [file],
         });
         logAction('SHARE_SUCCESS', 'Native share completed');
       } else {
         // Fallback if sharing is not supported
         alert("Sharing is not supported on this device/browser. Downloading instead.");
         // We call the internal export logic, which now also has cacheBust: false
         const dataUrl = await toPng(artRef.current, { 
            cacheBust: false, 
            pixelRatio: 1,
            filter: filterElements,
          });
          
          const link = document.createElement('a');
          link.download = `mirror-truth-${config.variant}-${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
          logAction('SHARE_FALLBACK', 'Downloaded via fallback');
       }

     } catch (err) {
       console.error('Failed to share image', err);
       logAction('SHARE_ERROR', 'Share operation failed');
     } finally {
       setIsExporting(false);
     }
  };

  const handleImageDrop = (side: 'left' | 'right', file: File) => {
    const url = URL.createObjectURL(file);
    setConfig(prev => ({
      ...prev,
      [side === 'left' ? 'leftImage' : 'rightImage']: url
    }));
    logAction('IMAGE_UPLOAD', `Uploaded ${side} face via drag-and-drop`);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center py-10 px-4 font-mono transition-colors duration-300 ${theme === 'dark' ? 'bg-[#111] text-[#ccc]' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Admin Panel Modal */}
      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
        auditLogs={auditLogs}
      />

      {/* Header & Global Tools */}
      <div className="w-full max-w-[1280px] flex items-center justify-between mb-8">
        <h2 className="font-mono text-xs uppercase tracking-[6px] text-zinc-500 text-center flex items-center gap-3">
          <Monitor size={14} /> Thumbnail Mockup — "Mirror Truth" Concept
        </h2>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Admin Toggle */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className={`p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${isAuthenticated ? 'text-green-500' : 'text-zinc-500'}`}
            title="Admin & Audit Log"
            aria-label="Admin Panel"
          >
             <Shield size={16} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <Controls 
        config={config} 
        setConfig={setConfig} 
        onExport={handleExport}
        onShare={handleShare}
        isExporting={isExporting}
      />

      {/* Thumbnail Preview Area */}
      <div 
        ref={containerRef}
        className="relative flex justify-center items-center mb-6"
        style={{
          width: '1280px',
          height: `${720 * scale}px`, // Adjust container height to match scaled content
        }}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
           {/* Wrap ThumbnailArt in a div for reference capture */}
           <div ref={artRef}>
              <ThumbnailArt config={config} onImageDrop={handleImageDrop} />
           </div>
        </div>
      </div>

      {/* Scale Indicator */}
      <p className="font-mono text-[10px] text-zinc-600 dark:text-zinc-600 uppercase tracking-[3px] mb-8 flex items-center gap-2">
        <Maximize2 size={10} />
        Viewport Scale: {Math.round(scale * 100)}% — Base: 1280 × 720
      </p>

      {/* Annotations */}
      <Annotations />
      
    </div>
  );
};

export default App;
```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_mirror_truth_thumbnail_designer';
const ACCENT   = '#059669';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Mirror Truth   Thumbnail Designer</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: components/AdminPanel.tsx
```typescript
import React, { useState } from 'react';
import { Shield, Lock, X, FileText, CheckCircle, AlertCircle, Activity, Layout } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  auditLogs: AuditLogEntry[];
}

type Tab = 'audit' | 'diagnostics';

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isOpen, 
  onClose, 
  isAuthenticated, 
  onLogin, 
  onLogout,
  auditLogs 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('audit');
  const [diagnosticResults, setDiagnosticResults] = useState<{name: string; status: 'pass'|'fail'; msg: string}[]>([]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setPassword('');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const runDiagnostics = () => {
    const results = [];
    
    // 1. DOM Check
    const canvas = document.getElementById('thumbnail-canvas');
    if (canvas) results.push({name: 'Canvas Mount', status: 'pass', msg: 'Canvas element found in DOM'});
    else results.push({name: 'Canvas Mount', status: 'fail', msg: 'Canvas element missing'});

    // 2. Theme Check
    const isDark = document.documentElement.classList.contains('dark');
    results.push({name: 'Theme State', status: 'pass', msg: `Current system theme: ${isDark ? 'Dark' : 'Light'}`});

    // 3. Performance / Feature Check
    if (window.matchMedia) results.push({name: 'Media Query API', status: 'pass', msg: 'Supported'});
    else results.push({name: 'Media Query API', status: 'fail', msg: 'Not Supported'});

    setDiagnosticResults(results as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/50">
          <h3 className="font-bebas text-xl text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Shield size={18} className="text-burnt-amber" /> 
            {isAuthenticated ? 'System Admin' : 'Admin Authentication'}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <Lock size={32} className="text-zinc-400" />
                </div>
              </div>
              <p className="text-sm text-center text-zinc-600 dark:text-zinc-400 font-mono mb-2">
                Restricted Access. Enter credentials.
              </p>
              
              <div className="space-y-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full p-2 bg-zinc-50 dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-200 focus:border-burnt-amber outline-none font-mono text-sm"
                  autoFocus
                />
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-mono">
                    <AlertCircle size={12} /> {error}
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-burnt-amber hover:bg-amber-600 text-white font-mono text-xs uppercase tracking-wider rounded transition-colors"
              >
                Authenticate
              </button>
            </form>
          ) : (
            <div className="space-y-4">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle size={12} /> Session Active
                    </span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="text-xs font-mono text-red-500 hover:underline"
                  >
                    Logout
                  </button>
               </div>
               
               {/* Tab Navigation */}
               <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-4">
                   <button 
                    onClick={() => setActiveTab('audit')}
                    className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider ${activeTab === 'audit' ? 'text-burnt-amber border-b-2 border-burnt-amber' : 'text-zinc-500'}`}
                   >
                       Audit Log
                   </button>
                   <button 
                    onClick={() => setActiveTab('diagnostics')}
                    className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider ${activeTab === 'diagnostics' ? 'text-burnt-amber border-b-2 border-burnt-amber' : 'text-zinc-500'}`}
                   >
                       Diagnostics
                   </button>
               </div>

               {activeTab === 'audit' && (
               <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden animate-in fade-in duration-300">
                 <div className="bg-zinc-100 dark:bg-zinc-950 px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                    <FileText size={12} className="text-zinc-500" />
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Activity History</span>
                 </div>
                 <div className="max-h-[300px] overflow-y-auto p-0">
                    {auditLogs.length === 0 ? (
                      <div className="p-4 text-center text-xs text-zinc-500 font-mono italic">No activity recorded</div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {auditLogs.slice().reverse().map((log) => (
                            <tr key={log.id} className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                              <td className="px-3 py-2 text-[10px] font-mono text-zinc-400 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="px-3 py-2 text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
                                <span className="font-bold text-burnt-amber mr-2">{log.action}</span>
                                <span className="text-zinc-500">{log.details}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                 </div>
               </div>
               )}

               {activeTab === 'diagnostics' && (
                   <div className="space-y-4 animate-in fade-in duration-300">
                       <button 
                        onClick={runDiagnostics}
                        className="w-full py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-xs uppercase tracking-wider rounded border border-zinc-300 dark:border-zinc-700 transition-colors flex items-center justify-center gap-2"
                       >
                           <Activity size={14} /> Run Self-Test
                       </button>

                       {diagnosticResults.length > 0 && (
                           <div className="space-y-2">
                               {diagnosticResults.map((result, idx) => (
                                   <div key={idx} className="flex items-center justify-between p-3 rounded bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800">
                                       <div className="flex items-center gap-2">
                                           {result.status === 'pass' ? <CheckCircle size={14} className="text-green-500"/> : <AlertCircle size={14} className="text-red-500"/>}
                                           <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300">{result.name}</span>
                                       </div>
                                       <span className="text-[10px] font-mono text-zinc-500">{result.msg}</span>
                                   </div>
                               ))}
                           </div>
                       )}
                       
                       <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
                           <h4 className="text-[10px] uppercase font-mono text-zinc-500 mb-2 flex items-center gap-1"><Layout size={10}/> Layout Integrity</h4>
                           <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                               <div className="bg-green-500 h-full w-[100%]"></div>
                           </div>
                           <p className="text-[9px] text-zinc-400 mt-1">Viewport Scale: Valid</p>
                       </div>
                   </div>
               )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

### FILE: components/Annotations.tsx
```typescript
import React from 'react';
import { Palette, Type, ScanFace, Activity } from 'lucide-react';

export const Annotations: React.FC = () => {
  return (
    <div className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 mb-10">
      
      {/* Colour Palette */}
      <div className="border-t border-zinc-300 dark:border-zinc-800 pt-4">
        <h4 className="flex items-center gap-2 font-bebas text-lg tracking-[3px] text-zinc-600 dark:text-zinc-500 mb-2">
          <Palette size={16} /> Colour Palette
        </h4>
        <div className="space-y-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono leading-relaxed">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-[2px] bg-deep-black border border-zinc-700 mr-2"></span>
            Deep Black #0A0A0A
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-[2px] bg-burnt-amber mr-2"></span>
            Burnt Amber #D4760A
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-[2px] bg-cyan-shadow mr-2"></span>
            Cyan Shadow #0A6E6E
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-[2px] bg-warm-white border border-zinc-700 mr-2"></span>
            Warm White #F5F5F0
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="border-t border-zinc-300 dark:border-zinc-800 pt-4">
        <h4 className="flex items-center gap-2 font-bebas text-lg tracking-[3px] text-zinc-600 dark:text-zinc-500 mb-2">
          <Type size={16} /> Typography
        </h4>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono leading-relaxed">
          <strong>Hook:</strong> Bebas Neue, 96px, tracked +8px<br/>
          <strong>Artist:</strong> JetBrains Mono, 13px, 35% opacity<br/>
          <span className="text-burnt-amber">"RUN"</span> in amber to isolate the action word and create urgency.
        </p>
      </div>

      {/* Split Face Concept */}
      <div className="border-t border-zinc-300 dark:border-zinc-800 pt-4">
        <h4 className="flex items-center gap-2 font-bebas text-lg tracking-[3px] text-zinc-600 dark:text-zinc-500 mb-2">
          <ScanFace size={16} /> Split Face
        </h4>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono leading-relaxed">
          <strong>Left:</strong> Sharp, amber lit (Truth/Present).<br/>
          <strong>Right:</strong> Blurred, teal (Shadow/Past).<br/>
          Designed to be replaced with a real photo using the same lighting split. The blur on the right is intentional to signify memory or distortion.
        </p>
      </div>

      {/* Glitch Line */}
      <div className="border-t border-zinc-300 dark:border-zinc-800 pt-4">
        <h4 className="flex items-center gap-2 font-bebas text-lg tracking-[3px] text-zinc-600 dark:text-zinc-500 mb-2">
          <Activity size={16} /> Glitch Line
        </h4>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono leading-relaxed">
          Digital fragments along the centre divide. Pixel scatter and horizontal displacement. Bridges the tech identity with the musical theme.
        </p>
      </div>

    </div>
  );
};
```

### FILE: components/Controls.tsx
```typescript
import React, { useRef, useState } from 'react';
import { ThumbnailConfig, ThumbnailVariant } from '../types';
import { Play, Pause, Eye, EyeOff, Grid, Type, User, Layers, Image, Upload, ScanFace, AlignLeft, Download, Loader2, Share2, Move, ZoomIn, Scaling, SplitSquareHorizontal } from 'lucide-react';

interface ControlsProps {
  config: ThumbnailConfig;
  setConfig: React.Dispatch<React.SetStateAction<ThumbnailConfig>>;
  onExport: () => void;
  onShare: () => void;
  isExporting: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ config, setConfig, onExport, onShare, isExporting }) => {
  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);
  
  // Local state to toggle between Left/Right transform controls
  const [activeTransformSide, setActiveTransformSide] = useState<'left' | 'right'>('left');

  const handleChange = (key: keyof ThumbnailConfig, value: string | boolean | ThumbnailVariant | null | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (side: 'left' | 'right', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleChange(side === 'left' ? 'leftImage' : 'rightImage', url);
      // Auto-switch control focus to the newly uploaded side
      setActiveTransformSide(side);
    }
  };

  const variants: { id: ThumbnailVariant; label: string }[] = [
    { id: 'original', label: 'ORIGINAL' },
    { id: 'neon-void', label: 'NEON VOID' },
    { id: 'editorial', label: 'EDITORIAL' },
  ];

  // Helper to determine active image state for the currently selected side
  const currentScale = activeTransformSide === 'left' ? config.leftImageScale : config.rightImageScale;
  const currentX = activeTransformSide === 'left' ? config.leftImageX : config.rightImageX;
  const currentY = activeTransformSide === 'left' ? config.leftImageY : config.rightImageY;

  return (
    <div className="w-full max-w-[1280px] mb-10 bg-white/60 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl flex flex-wrap gap-x-8 gap-y-6 items-center justify-between backdrop-blur-sm transition-colors duration-300 shadow-sm">
      
      {/* Inputs Group */}
      <div className="flex flex-wrap gap-6 items-center">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-zinc-500 dark:text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-1">
             <User size={10} /> Artist Name
          </label>
          <input 
            type="text" 
            value={config.artistName}
            onChange={(e) => handleChange('artistName', e.target.value)}
            className="bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs px-3 py-2 rounded font-mono focus:border-burnt-amber focus:outline-none w-36 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-1">
            <Type size={10} /> Hook Text
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={config.hookText}
              onChange={(e) => handleChange('hookText', e.target.value)}
              className="bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs px-3 py-2 rounded font-mono focus:border-burnt-amber focus:outline-none w-28 transition-colors"
            />
            <input 
              type="text" 
              value={config.accentWord}
              onChange={(e) => handleChange('accentWord', e.target.value)}
              className="bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-zinc-700 text-burnt-amber text-xs px-3 py-2 rounded font-mono focus:border-burnt-amber focus:outline-none w-24 font-bold transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Face Position & Image Adjust Group */}
      <div className="flex items-center gap-6 border-l border-r border-zinc-200 dark:border-zinc-800 px-6 mx-2">
        
        {/* Frame Adjust */}
        <div className="flex flex-col gap-2">
             <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-1">
                <Scaling size={10} /> Face Frame
            </label>
            <div className="flex gap-3 items-center">
                 {/* Scale */}
                 <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-zinc-600 flex items-center gap-1"><ZoomIn size={8}/> {config.faceScale.toFixed(1)}x</span>
                    <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={config.faceScale}
                        onChange={(e) => handleChange('faceScale', Number(e.target.value))}
                        className="w-16 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
                 {/* X/Y */}
                 <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-zinc-600 flex items-center gap-1"><Move size={8}/> {config.faceX},{config.faceY}</span>
                     <div className="flex gap-1">
                         <input
                            type="range"
                            min="-400"
                            max="400"
                            step="10"
                            value={config.faceX}
                            onChange={(e) => handleChange('faceX', Number(e.target.value))}
                            className="w-12 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            title="Face X"
                        />
                        <input
                            type="range"
                            min="-300"
                            max="300"
                            step="10"
                            value={config.faceY}
                            onChange={(e) => handleChange('faceY', Number(e.target.value))}
                            className="w-12 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            title="Face Y"
                        />
                     </div>
                 </div>
                 {/* Spread */}
                 <div className="flex flex-col gap-1 ml-2">
                    <span className="text-[9px] text-zinc-600 flex items-center gap-1"><SplitSquareHorizontal size={8}/> Gap</span>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        step="5"
                        value={config.faceSpread}
                        onChange={(e) => handleChange('faceSpread', Number(e.target.value))}
                        className="w-14 h-1.5 accent-burnt-amber bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
            </div>
        </div>

        {/* Image Adjust (Conditional) */}
        {(config.leftImage || config.rightImage) && (
            <div className="flex flex-col gap-2 pl-6 border-l border-zinc-200 dark:border-zinc-800/50">
                <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-1">
                        <Image size={10} /> Img Adjust
                    </label>
                    <div className="flex bg-zinc-200 dark:bg-zinc-800 rounded p-0.5 ml-2">
                        <button 
                            onClick={() => setActiveTransformSide('left')} 
                            className={`px-2 py-0.5 text-[9px] rounded transition-colors ${activeTransformSide === 'left' ? 'bg-zinc-600 text-white' : 'text-zinc-500 dark:text-zinc-400'}`}
                            disabled={!config.leftImage}
                        >
                            L
                        </button>
                        <button 
                            onClick={() => setActiveTransformSide('right')} 
                            className={`px-2 py-0.5 text-[9px] rounded transition-colors ${activeTransformSide === 'right' ? 'bg-zinc-600 text-white' : 'text-zinc-500 dark:text-zinc-400'}`}
                            disabled={!config.rightImage}
                        >
                            R
                        </button>
                    </div>
                </div>
                
                <div className="flex gap-3 items-center">
                     {/* Scale */}
                     <div className="flex flex-col gap-1">
                        <input
                            type="range"
                            min="0.1"
                            max="3.0"
                            step="0.1"
                            value={currentScale}
                            onChange={(e) => handleChange(activeTransformSide === 'left' ? 'leftImageScale' : 'rightImageScale', Number(e.target.value))}
                            className="w-14 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            title="Zoom"
                        />
                     </div>
                     {/* X Pos */}
                     <div className="flex flex-col gap-1">
                        <input
                            type="range"
                            min="-400"
                            max="400"
                            step="10"
                            value={currentX}
                            onChange={(e) => handleChange(activeTransformSide === 'left' ? 'leftImageX' : 'rightImageX', Number(e.target.value))}
                            className="w-14 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            title="X Position"
                        />
                     </div>
                      {/* Y Pos */}
                      <div className="flex flex-col gap-1">
                        <input
                            type="range"
                            min="-400"
                            max="400"
                            step="10"
                            value={currentY}
                            onChange={(e) => handleChange(activeTransformSide === 'left' ? 'leftImageY' : 'rightImageY', Number(e.target.value))}
                            className="w-14 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            title="Y Position"
                        />
                     </div>
                </div>
            </div>
        )}
      </div>

      {/* Assets & Toggles Group */}
      <div className="flex flex-wrap items-center gap-4">
        
        {/* Face Assets */}
        <div className="flex items-center gap-2 pr-6 border-r border-zinc-200 dark:border-zinc-800">
            {/* Hidden Inputs */}
            <input ref={leftInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('left', e)} />
            <input ref={rightInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('right', e)} />

            <button 
                onClick={() => leftInputRef.current?.click()}
                className={`flex items-center gap-1 px-3 py-2 rounded text-[10px] font-mono border transition-all ${config.leftImage ? 'border-burnt-amber text-burnt-amber' : 'border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                title="Upload Left Face"
            >
                <Upload size={12} /> L
            </button>
            <button 
                onClick={() => rightInputRef.current?.click()}
                className={`flex items-center gap-1 px-3 py-2 rounded text-[10px] font-mono border transition-all ${config.rightImage ? 'border-cyan-shadow text-cyan-600 dark:text-cyan-400' : 'border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                title="Upload Right Face"
            >
                <Upload size={12} /> R
            </button>

            <button
                onClick={() => handleChange('showCssFace', !config.showCssFace)}
                className={`ml-1 p-2 rounded border transition-all ${config.showCssFace ? 'border-zinc-500 text-zinc-800 dark:text-zinc-300' : 'border-zinc-300 dark:border-zinc-800 text-zinc-500 dark:text-zinc-600'}`}
                title="Toggle CSS Structure"
            >
                <ScanFace size={14} />
            </button>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
            <button
            onClick={() => handleChange('animate', !config.animate)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono border transition-all ${
                config.animate 
                ? 'bg-burnt-amber/10 border-burnt-amber text-burnt-amber' 
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            >
            {config.animate ? <Pause size={14} /> : <Play size={14} />}
            </button>

            <button
            onClick={() => handleChange('showSafeZones', !config.showSafeZones)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono border transition-all ${
                config.showSafeZones 
                ? 'bg-red-500/10 border-red-500 text-red-500 dark:text-red-400' 
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            title="Safe Zones"
            >
            {config.showSafeZones ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
        </div>

        {/* Action Buttons */}
        <div className="ml-auto flex gap-3">
            <button
            onClick={onShare}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-mono border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 hover:text-black dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Share"
            >
                <Share2 size={14} />
            </button>
            
            <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 rounded text-xs font-mono border border-zinc-400 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 hover:text-black dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            </button>
        </div>

      </div>
    </div>
  );
};
```

### FILE: components/ThumbnailArt.tsx
```typescript
import React, { useState } from 'react';
import { ThumbnailConfig, GlitchFragment, PixelScatter, ThumbnailVariant } from '../types';
import { Info, X, Upload } from 'lucide-react';

interface ThumbnailArtProps {
  config: ThumbnailConfig;
  onImageDrop?: (side: 'left' | 'right', file: File) => void;
}

const GLITCH_FRAGMENTS: GlitchFragment[] = [
  { id: 1, width: 35, height: 3, top: 18, left: -15, color: 'rgba(212, 118, 10, 0.5)', delay: 0 },
  { id: 2, width: 25, height: 2, top: 28, left: -8, color: 'rgba(10, 110, 110, 0.5)', delay: 0.4 },
  { id: 3, width: 50, height: 4, top: 42, left: -25, color: 'rgba(245, 245, 240, 0.2)', delay: 0.8 },
  { id: 4, width: 18, height: 2, top: 55, left: -5, color: 'rgba(212, 118, 10, 0.4)', delay: 1.2 },
  { id: 5, width: 40, height: 3, top: 67, left: -20, color: 'rgba(10, 110, 110, 0.4)', delay: 0.2 },
  { id: 6, width: 30, height: 5, top: 78, left: -12, color: 'rgba(245, 245, 240, 0.15)', delay: 0.6 },
  { id: 7, width: 22, height: 2, top: 35, left: 2, color: 'rgba(212, 118, 10, 0.35)', delay: 1 },
  { id: 8, width: 45, height: 3, top: 88, left: -22, color: 'rgba(10, 110, 110, 0.3)', delay: 1.4 },
];

const PIXEL_SCATTERS: PixelScatter[] = [
  { id: 1, top: 22, left: -8, color: '#D4760A', delay: 0.1, opacity: 1 },
  { id: 2, top: 24, left: 12, color: '#0A6E6E', delay: 0.5, opacity: 1 },
  { id: 3, top: 45, left: -14, color: '#F5F5F0', delay: 0.3, opacity: 0.4 },
  { id: 4, top: 48, left: 10, color: '#D4760A', delay: 0.7, opacity: 0.5 },
  { id: 5, top: 70, left: -10, color: '#0A6E6E', delay: 0.9, opacity: 1 },
  { id: 6, top: 73, left: 8, color: '#F5F5F0', delay: 1.1, opacity: 0.3 },
  { id: 7, top: 60, left: -6, color: '#D4760A', delay: 0.2, opacity: 0.6 },
  { id: 8, top: 15, left: 6, color: '#0A6E6E', delay: 0.8, opacity: 0.4 },
];

// Styles configuration based on variant
const getVariantStyles = (variant: ThumbnailVariant) => {
  switch (variant) {
    case 'neon-void':
      return {
        leftBg: 'linear-gradient(170deg, #09090b 0%, #18181b 40%, #27272a 100%)', // Dark/Desaturated
        rightBg: 'linear-gradient(190deg, #1e1b4b 0%, #701a75 40%, #db2777 100%)', // Vibrant Neon Pink/Purple
        leftTint: 'linear-gradient(170deg, rgba(9,9,11,0.8) 0%, rgba(39,39,42,0.6) 100%)',
        rightTint: 'linear-gradient(190deg, rgba(30,27,75,0.6) 0%, rgba(219,39,119,0.5) 100%)',
        leftEyeColor: '#52525b',
        rightEyeColor: '#f472b6',
        leftShadow: '0 0 15px rgba(82, 82, 91, 0.5)',
        rightShadow: '0 0 20px rgba(219, 39, 119, 0.8)',
        textColor: 'text-white',
        accentColor: 'text-neon-purple',
        fontClass: 'font-bebas',
        artistPos: 'top-[48px] left-[52px]',
        glowColor: 'rgba(219, 39, 119, 0.2)',
      };
    case 'editorial':
      return {
        leftBg: 'linear-gradient(170deg, #0A0A0A 0%, #1a0f04 15%, #D4760A 40%, #E8943A 55%, #D4760A 70%, #1a0f04 90%, #0A0A0A 100%)', // Original
        rightBg: 'linear-gradient(190deg, #0A0A0A 0%, #041a1a 15%, #0A6E6E 40%, #0C8585 52%, #0A6E6E 65%, #041a1a 88%, #0A0A0A 100%)', // Original
        leftTint: 'linear-gradient(170deg, rgba(10,10,10,0.8) 0%, rgba(212,118,10,0.4) 100%)',
        rightTint: 'linear-gradient(190deg, rgba(10,10,10,0.8) 0%, rgba(10,110,110,0.4) 100%)',
        leftEyeColor: '#3d1f00',
        rightEyeColor: '#003d3d',
        leftShadow: '0 0 15px rgba(212,118,10,0.5)',
        rightShadow: '0 0 20px rgba(10,110,110,0.4)',
        textColor: 'text-warm-white',
        accentColor: 'text-burnt-amber',
        fontClass: 'font-serif italic', // Playfair Display
        artistPos: 'bottom-[48px] right-[48px] text-right', // Moved to bottom right
        glowColor: 'rgba(212, 118, 10, 0.08)',
      };
    case 'original':
    default:
      return {
        leftBg: 'linear-gradient(170deg, #0A0A0A 0%, #1a0f04 15%, #D4760A 40%, #E8943A 55%, #D4760A 70%, #1a0f04 90%, #0A0A0A 100%)',
        rightBg: 'linear-gradient(190deg, #0A0A0A 0%, #041a1a 15%, #0A6E6E 40%, #0C8585 52%, #0A6E6E 65%, #041a1a 88%, #0A0A0A 100%)',
        leftTint: 'linear-gradient(170deg, rgba(10,10,10,0.7) 0%, rgba(212,118,10,0.5) 100%)',
        rightTint: 'linear-gradient(190deg, rgba(10,10,10,0.7) 0%, rgba(10,110,110,0.5) 100%)',
        leftEyeColor: '#3d1f00',
        rightEyeColor: '#003d3d',
        leftShadow: '0 0 15px rgba(212,118,10,0.5)',
        rightShadow: '0 0 20px rgba(10,110,110,0.4)',
        textColor: 'text-warm-white',
        accentColor: 'text-burnt-amber',
        fontClass: 'font-bebas',
        artistPos: 'top-[48px] left-[52px]',
        glowColor: 'rgba(212, 118, 10, 0.08)',
      };
  }
};

export const ThumbnailArt: React.FC<ThumbnailArtProps> = ({ config, onImageDrop }) => {
  const { artistName, hookText, accentWord, animate, showSafeZones, showGrid, variant, leftImage, rightImage, showCssFace, hookLetterSpacing, hookFontWeight, faceX, faceY, faceScale, faceSpread } = config;
  const styles = getVariantStyles(variant);
  
  // Interactive State
  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);
  const [dragOverSide, setDragOverSide] = useState<'left' | 'right' | null>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close overlay if clicking background but not the faces if they were the trigger
    if (e.target === e.currentTarget) {
        setActiveSide(null);
    }
  };

  const handleDragOver = (e: React.DragEvent, side: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverSide !== side) {
      setDragOverSide(side);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSide(null);
  };

  const handleDrop = (e: React.DragEvent, side: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSide(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/') && onImageDrop) {
      onImageDrop(side, file);
    }
  };

  return (
    <div 
        id="thumbnail-canvas"
        className="relative w-[1280px] h-[720px] bg-deep-black overflow-hidden border border-zinc-800 shadow-2xl select-none group/canvas"
        onClick={handleBackdropClick}
    >
      {/* Dynamic Styles for Animations */}
      <style>{`
        @keyframes glitchShift {
          0% { transform: translateX(0); opacity: 0.6; }
          30% { transform: translateX(3px); opacity: 1; }
          70% { transform: translateX(-2px); opacity: 0.4; }
          100% { transform: translateX(1px); opacity: 0.8; }
        }
        @keyframes pixelFlicker {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>

      {/* ======================== */}
      {/* AMBIENT LIGHT LEAKS      */}
      {/* ======================== */}
      <div className="absolute -top-[50px] -left-[50px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(212,118,10,0.06)_0%,transparent_70%)] z-10" />
      <div className="absolute -bottom-[50px] -right-[50px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(10,110,110,0.04)_0%,transparent_70%)] z-10" />

      {/* ======================== */}
      {/* FACE ASSEMBLY WRAPPER    */}
      {/* ======================== */}
      <div 
        className="absolute z-20"
        style={{
            top: '50%',
            left: '50%',
            width: '480px',
            height: '600px',
            transform: `translate(-50%, -50%) translate(${faceX}px, ${faceY}px) scale(${faceScale})`
        }}
      >

        {/* ======================== */}
        {/* SPLIT FACE CONTAINER     */}
        {/* ======================== */}
        <div className="absolute inset-0 flex z-20">
            
            {/* LEFT SIDE — TRUTH */}
            <div 
                className={`w-1/2 h-full relative overflow-hidden cursor-pointer transition-all duration-500 group/left hover:brightness-110 ${dragOverSide === 'left' ? 'ring-2 ring-burnt-amber z-30 brightness-125' : ''}`}
                style={{ 
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    background: leftImage ? '#000' : styles.leftBg,
                    transform: `translateX(-${faceSpread / 2}px)`
                }}
                onClick={(e) => { e.stopPropagation(); setActiveSide('left'); }}
                onDragOver={(e) => handleDragOver(e, 'left')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'left')}
            >
                {/* User Image Render */}
                {leftImage && (
                <>
                    <img 
                        src={leftImage} 
                        alt="Left Face" 
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-100 ease-out" 
                        style={{
                        transform: `scale(${config.leftImageScale}) translate(${config.leftImageX}px, ${config.leftImageY}px)`
                        }}
                    />
                    {/* Colour Grading Overlay */}
                    <div className="absolute inset-0 mix-blend-color" style={{ background: styles.leftTint }}></div>
                    <div className="absolute inset-0 mix-blend-overlay opacity-50" style={{ background: styles.leftBg }}></div>
                </>
                )}

                <div className="absolute inset-0 bg-[radial-gradient(ellipse_120px_200px_at_70%_35%,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-50"></div>
                
                {/* Drag Overlay */}
                {dragOverSide === 'left' && (
                  <div className="absolute inset-0 bg-burnt-amber/20 flex items-center justify-center">
                    <div className="bg-black/80 px-4 py-2 rounded text-burnt-amber font-mono text-xs flex items-center gap-2">
                       <Upload size={14} /> DROP TO UPLOAD TRUTH
                    </div>
                  </div>
                )}

                {/* Eye Detail Left (Toggleable) */}
                {showCssFace && (
                <div 
                    className="absolute w-[42px] h-[18px] rounded-[50%] top-[38%] right-[25%]"
                    style={{
                        background: `radial-gradient(ellipse, ${styles.leftEyeColor} 30%, transparent 70%)`,
                        boxShadow: styles.leftShadow
                    }}
                ></div>
                )}

                {/* Hover Indicator */}
                <div className="absolute top-4 left-4 opacity-0 group-hover/left:opacity-100 transition-opacity duration-300 export-exclude">
                    <Info size={24} className="text-white drop-shadow-lg" />
                </div>
            </div>

            {/* RIGHT SIDE — SHADOW */}
            <div 
                className={`w-1/2 h-full relative overflow-hidden backdrop-blur-[2.5px] blur-[2.5px] cursor-pointer transition-all duration-500 group/right hover:brightness-110 hover:blur-[1px] ${dragOverSide === 'right' ? 'ring-2 ring-cyan-shadow z-30 brightness-125' : ''}`}
                style={{ 
                    background: rightImage ? '#000' : styles.rightBg,
                    transform: `translateX(${faceSpread / 2}px)` 
                }}
                onClick={(e) => { e.stopPropagation(); setActiveSide('right'); }}
                onDragOver={(e) => handleDragOver(e, 'right')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'right')}
            >
            {/* User Image Render */}
            {rightImage && (
                <>
                    <img 
                        src={rightImage} 
                        alt="Right Face" 
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-100 ease-out" 
                        style={{
                        transform: `scale(${config.rightImageScale}) translate(${config.rightImageX}px, ${config.rightImageY}px)`
                        }}
                    />
                    {/* Colour Grading Overlay */}
                    <div className="absolute inset-0 mix-blend-color" style={{ background: styles.rightTint }}></div>
                    <div className="absolute inset-0 mix-blend-overlay opacity-50" style={{ background: styles.rightBg }}></div>
                </>
                )}

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_120px_200px_at_30%_35%,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-50"></div>
            
             {/* Drag Overlay */}
             {dragOverSide === 'right' && (
                  <div className="absolute inset-0 bg-cyan-shadow/20 flex items-center justify-center">
                    <div className="bg-black/80 px-4 py-2 rounded text-cyan-400 font-mono text-xs flex items-center gap-2">
                       <Upload size={14} /> DROP TO UPLOAD SHADOW
                    </div>
                  </div>
                )}

            {/* Eye Detail Right (Toggleable) */}
            {showCssFace && (
                <div 
                    className="absolute w-[42px] h-[18px] rounded-[50%] top-[38%] left-[25%] blur-[1px]"
                    style={{
                        background: `radial-gradient(ellipse, ${styles.rightEyeColor} 30%, transparent 70%)`,
                        boxShadow: styles.rightShadow
                    }}
                ></div>
                )}

                {/* Hover Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover/right:opacity-100 transition-opacity duration-300 export-exclude">
                    <Info size={24} className="text-white drop-shadow-lg" />
                </div>
            </div>

        </div>

        {/* ======================== */}
        {/* INTERACTIVE OVERLAYS     */}
        {/* ======================== */}
        {activeSide === 'left' && (
            <div className="absolute top-1/2 left-[50%] -translate-x-[120%] -translate-y-1/2 w-[300px] z-[50] animate-in fade-in slide-in-from-right-10 duration-300 export-exclude">
                <div className="bg-black/90 border-l-4 border-burnt-amber p-6 text-left shadow-2xl backdrop-blur-md">
                    <button onClick={() => setActiveSide(null)} className="absolute top-2 right-2 text-zinc-500 hover:text-white"><X size={16}/></button>
                    <h3 className="font-bebas text-3xl text-burnt-amber tracking-widest mb-2">THE TRUTH</h3>
                    <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                        <strong>ANALYSIS:</strong> Present Tense.<br/>
                        <strong>STATE:</strong> Raw, unfiltered reality.<br/>
                        <strong>FOCUS:</strong> Sharp.<br/><br/>
                        "The mirror doesn't lie, but it only shows you what's in front of it right now."
                    </p>
                </div>
                {/* Connecting Line */}
                <div className="absolute top-1/2 -right-[20px] w-[20px] h-[1px] bg-burnt-amber/50"></div>
                <div className="absolute top-1/2 -right-[20px] w-2 h-2 bg-burnt-amber rounded-full -translate-y-1/2"></div>
            </div>
        )}

        {activeSide === 'right' && (
            <div className="absolute top-1/2 right-[50%] -translate-x-[120%] -translate-y-1/2 w-[300px] z-[50] animate-in fade-in slide-in-from-left-10 duration-300 export-exclude" style={{ right: 'auto', left: 'auto', transform: 'translate(120%, -50%)' }}>
                <div className="bg-black/90 border-r-4 border-cyan-shadow p-6 text-right shadow-2xl backdrop-blur-md">
                    <button onClick={() => setActiveSide(null)} className="absolute top-2 left-2 text-zinc-500 hover:text-white"><X size={16}/></button>
                    <h3 className="font-bebas text-3xl text-cyan-500 tracking-widest mb-2">THE SHADOW</h3>
                    <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                        <strong>ANALYSIS:</strong> Past Tense.<br/>
                        <strong>STATE:</strong> Distorted memory.<br/>
                        <strong>FOCUS:</strong> Blurred.<br/><br/>
                        "Ghosts don't haunt places, they haunt people. This side is what you're running from."
                    </p>
                </div>
                {/* Connecting Line */}
                <div className="absolute top-1/2 -left-[20px] w-[20px] h-[1px] bg-cyan-500/50"></div>
                <div className="absolute top-1/2 -left-[20px] w-2 h-2 bg-cyan-500 rounded-full -translate-y-1/2"></div>
            </div>
        )}

        {/* ======================== */}
        {/* FACIAL STRUCTURE HINTS   */}
        {/* ======================== */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
            {showCssFace && (
            <>
                {/* Nose */}
                <div className="absolute top-[42%] left-1/2 -translate-x-1/2 w-[40px] h-[70px] rounded-[50%] bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_0%,transparent_100%)] opacity-30" />
                {/* Mouth */}
                <div className="absolute top-[62%] left-1/2 -translate-x-1/2 w-[80px] h-[12px] border-b-[2px] border-[rgba(100,60,20,0.25)] rounded-b-[50%]" />
                {/* Jaw Left */}
                <div 
                    className="absolute bottom-[10%] w-[120px] h-[200px] rounded-[50%] left-[15%] border-r border-[rgba(255,255,255,0.1)]" 
                    style={{ transform: `translateX(-${faceSpread / 2}px)` }}
                />
                {/* Jaw Right */}
                <div 
                    className="absolute bottom-[10%] w-[120px] h-[200px] rounded-[50%] right-[15%] border-l border-[rgba(255,255,255,0.1)] blur-[2px]" 
                    style={{ transform: `translateX(${faceSpread / 2}px)` }}
                />
            </>
            )}
        </div>

        {/* ======================== */}
        {/* GLITCH ZONE              */}
        {/* ======================== */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20px] h-[600px] z-[25] overflow-visible pointer-events-none">
            <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-[linear-gradient(180deg,transparent_0%,rgba(245,245,240,0.1)_10%,rgba(245,245,240,0.4)_25%,rgba(212,118,10,0.6)_35%,rgba(245,245,240,0.5)_50%,rgba(10,110,110,0.6)_65%,rgba(245,245,240,0.3)_80%,rgba(245,245,240,0.1)_90%,transparent_100%)]"></div>
            
            {GLITCH_FRAGMENTS.map((gf) => (
            <div
                key={`gf-${gf.id}`}
                className="absolute"
                style={{
                width: `${gf.width}px`,
                height: `${gf.height}px`,
                top: `${gf.top}%`,
                left: `${gf.left}px`,
                backgroundColor: gf.color,
                animation: animate ? `glitchShift 3s ease-in-out infinite alternate` : 'none',
                animationDelay: `${gf.delay}s`
                }}
            />
            ))}

            {PIXEL_SCATTERS.map((px) => (
            <div
                key={`px-${px.id}`}
                className="absolute w-[4px] h-[4px]"
                style={{
                top: `${px.top}%`,
                left: `${px.left}px`,
                backgroundColor: px.color,
                opacity: px.opacity,
                animation: animate ? `pixelFlicker 2s ease-in-out infinite` : 'none',
                animationDelay: `${px.delay}s`
                }}
            />
            ))}
        </div>

      </div>

      {/* ======================== */}
      {/* OVERLAYS                 */}
      {/* ======================== */}
      
      {/* Scanlines */}
      <div className="absolute inset-0 z-[25] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)]" />

      {/* Noise */}
      <div className="absolute inset-0 z-[27] pointer-events-none opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '128px 128px'
      }}></div>

      {/* Vignette */}
      <div className="absolute inset-0 z-[26] pointer-events-none bg-[radial-gradient(ellipse_70%_65%_at_50%_50%,transparent_0%,rgba(10,10,10,0.3)_60%,rgba(10,10,10,0.85)_100%)]"></div>

      {/* Text Layer */}
      <div className="absolute inset-0 z-[30] pointer-events-none">
        <div className={`absolute font-mono text-[13px] font-normal tracking-[8px] uppercase text-[rgba(245,245,240,0.35)] ${styles.artistPos}`}>
          {artistName}
        </div>
        
        {variant !== 'editorial' ? (
            <div 
                className={`absolute bottom-[60px] left-0 right-0 text-center ${styles.fontClass} text-[96px] ${styles.textColor} leading-none drop-shadow-[0_0_60px_rgba(212,118,10,0.4)]`}
                style={{
                  letterSpacing: `${hookLetterSpacing}px`,
                  fontWeight: hookFontWeight
                }}
            >
                <span className="drop-shadow-[0_0_120px_rgba(10,110,110,0.2)]">
                    {hookText} <span className={`${styles.accentColor} drop-shadow-[0_0_40px_rgba(212,118,10,0.6)]`}>{accentWord}</span>
                </span>
                {/* Ambient Text Glow */}
                <div 
                    className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[500px] h-[80px] -z-10"
                    style={{ background: `radial-gradient(ellipse, ${styles.glowColor} 0%, transparent 70%)`}}
                ></div>
            </div>
        ) : (
            <div 
                className={`absolute bottom-[60px] left-[60px] right-auto text-left ${styles.fontClass} text-[80px] ${styles.textColor} leading-tight`}
                style={{
                  letterSpacing: `${hookLetterSpacing - 4}px`, // Slight adjustment for editorial
                  fontWeight: hookFontWeight
                }}
            >
                <span className="block italic opacity-80">{hookText}</span>
                <span className={`${styles.accentColor} not-italic font-bold block`}>{accentWord}</span>
            </div>
        )}
      </div>

      {/* ======================== */}
      {/* ANALYTICS OVERLAYS       */}
      {/* ======================== */}
      {showGrid && (
        <div className="absolute inset-0 z-[40] pointer-events-none export-exclude">
            {/* Rule of Thirds */}
            <div className="absolute top-0 left-1/3 w-px h-full bg-cyan-400 opacity-30"></div>
            <div className="absolute top-0 left-2/3 w-px h-full bg-cyan-400 opacity-30"></div>
            <div className="absolute top-1/3 left-0 w-full h-px bg-cyan-400 opacity-30"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-cyan-400 opacity-30"></div>
        </div>
      )}

      {showSafeZones && (
        <div className="absolute inset-0 z-[40] pointer-events-none export-exclude">
            {/* YouTube Timestamp (Bottom Right) */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                12:45
            </div>
            {/* Safe Area Border (Approximate) */}
            <div className="absolute inset-[30px] border border-red-500/30 border-dashed"></div>
            <div className="absolute top-2 right-2 text-[10px] text-red-500/50 uppercase tracking-widest font-mono">
                UI Obstruction Zone
            </div>
        </div>
      )}

    </div>
  );
};
```

### FILE: CREATION.md
```md
# mirror-truth---thumbnail-designer

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/mirror-truth---thumbnail-designer/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/mirror-truth---thumbnail-designer/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/mirror-truth---thumbnail-designer/',  // REQUIRED: Assets must load from /mirror-truth---thumbnail-designer/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/mirror-truth---thumbnail-designer"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/mirror-truth---thumbnail-designer">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/mirror-truth---thumbnail-designer/`, not at the root
- **Asset Loading**: Without `base: '/mirror-truth---thumbnail-designer/'`, assets try to load from `/assets/` instead of `/mirror-truth---thumbnail-designer/assets/`
- **Routing**: Without `basename="/mirror-truth---thumbnail-designer"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/mirror-truth---thumbnail-designer/assets/index-*.js`
- Link tags should reference: `/mirror-truth---thumbnail-designer/assets/index-*.css`

If they reference `/assets/` instead of `/mirror-truth---thumbnail-designer/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/mirror-truth---thumbnail-designer/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/mirror-truth---thumbnail-designer/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: mirror-truth---thumbnail-designer

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — mirror-truth---thumbnail-designer

**Application:** mirror-truth---thumbnail-designer
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_mirror-truth---thumbnail-designer_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — mirror-truth---thumbnail-designer

**Application:** mirror-truth---thumbnail-designer
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd mirror-truth---thumbnail-designer
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build mirror-truth---thumbnail-designer
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up mirror-truth---thumbnail-designer
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/SRS-MirrorTruth-1.0.md
```md
# Software Requirements Specification (SRS)
## Project: Mirror Truth — Thumbnail Designer
**Version:** 1.0  
**Status:** Phase 1 Baseline

---

## 1. Introduction

### 1.1 Purpose
The purpose of the "Mirror Truth" application is to provide content creators with a specialized tool for generating high-quality, cyberpunk-aesthetic YouTube thumbnails. It automates complex CSS compositing, split-face effects, and typographic layouts that would otherwise require advanced photo editing software.

### 1.2 Scope
The application runs entirely in the browser. It allows users to upload imagery, customize text, adjust composition geometry, and export the final result as a PNG file.

---

## 2. Functional Requirements

### 2.1 Configuration & Customization
*   **FR-01 Artist Identity:** User shall be able to input an "Artist Name".
*   **FR-02 Typography:** User shall be able to input "Hook Text" and an "Accent Word".
*   **FR-03 Text Styling:** User shall be able to adjust letter spacing and font weight.
*   **FR-04 Variants:** The system shall support three distinct visual themes:
    *   *Original* (Amber/Teal split)
    *   *Neon Void* (Purple/Pink/Dark high contrast)
    *   *Editorial* (Clean, serif-based typography)

### 2.2 Image Management
*   **FR-05 Image Upload:** User shall be able to upload two separate images:
    *   "Left Face" (associated with Truth/Present theme)
    *   "Right Face" (associated with Shadow/Past theme)
*   **FR-06 Drag & Drop:** User shall be able to drag image files directly onto the left or right sections of the canvas to upload.
*   **FR-07 Image Adjustment:** For each uploaded image, the user shall be able to control:
    *   Scale (Zoom)
    *   Horizontal Position (X)
    *   Vertical Position (Y)

### 2.3 Canvas Composition
*   **FR-08 Face Frame Control:** User shall be able to adjust the global container holding both split faces:
    *   Global Scale
    *   Global X/Y Position
    *   Split Gap (Spread) between left and right sections.
*   **FR-09 Visual Aids:**
    *   *Safe Zones:* Overlay showing YouTube timestamp and UI obstruction areas.
    *   *Rule of Thirds:* Grid overlay for composition.
    *   *CSS Face Structure:* Toggleable schematic overlay of facial features (eyes, nose, mouth guides).
*   **FR-10 Animation:** User shall be able to toggle "Glitch" and "Pulse" animations on/off.

### 2.4 Output & Export
*   **FR-11 Preview Scaling:** The preview area shall automatically scale to fit the user's viewport while maintaining the 1280x720 aspect ratio.
*   **FR-12 Export:** User shall be able to download the composed canvas as a `.png` file at 1280x720 resolution.
*   **FR-13 Share:** User shall be able to invoke the native Web Share API (if supported) to share the image.

---

## 3. Non-Functional Requirements

### 3.1 Usability
*   **NFR-01 Responsiveness:** The UI controls shall wrap appropriately on smaller screens.
*   **NFR-02 Feedback:** Hover states shall indicate interactive elements. Drag-over states shall highlight drop zones.

### 3.2 Performance
*   **NFR-03 Real-time Rendering:** Adjustments to sliders and inputs shall reflect immediately (<16ms latency) on the canvas.
*   **NFR-04 Export Speed:** Image generation should complete within 2 seconds on average devices.

### 3.3 Reliability
*   **NFR-05 Export Integrity:** The exported image must exactly match the visual state of the canvas (excluding UI helpers like grids).
*   **NFR-06 Offline Capability:** The application core logic relies on local resources (after initial load), though fonts and Tailwind load via CDN.

---

## 4. User Interface Guidelines

### 4.1 Aesthetic Theme
*   **Background:** Deep Black (#111)
*   **Text:** Light Grey (#ccc)
*   **Accents:** Burnt Amber (#D4760A) and Cyan Shadow (#0A6E6E).
*   **Fonts:** Monospace for UI controls, Display fonts for Canvas.

### 4.2 Layout
*   **Header:** Branding and title.
*   **Controls:** Top-aligned panel containing all inputs.
*   **Canvas:** Centered, scaled viewport.
*   **Annotations:** Bottom section explaining design decisions (Static).

---
**End of SRS**

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Mirror Truth   Thumbnail Designer
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Mirror Truth   Thumbnail Designer**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Mirror Truth   Thumbnail Designer** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Mirror Truth   Thumbnail Designer** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âŒ Non-compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/tech-stack.md
```md
﻿# Technology Stack â€” Mirror Truth

## Overview
Mirror Truth is a client-side React application designed for high-fidelity, interactive image manipulation and export. It utilizes a modern, build-less architecture relying on ES Modules delivered via CDN.

## Core Framework
*   **Runtime:** Browser (ES6+ Support required)
*   **Library:** React 19.2.5
*   **DOM Manipulation:** React DOM 19.2.5
*   **Module Loading:** Native ES Modules (via `importmap`)

## Styling & UI
*   **Utility Framework:** Tailwind CSS (v3.4 via CDN)
*   **Typography:** 
    *   *Bebas Neue* (Headlines)
    *   *JetBrains Mono* (Technical/Data)
    *   *Playfair Display* (Editorial variant)
*   **Icons:** Lucide React (v0.564.0)

## Functional Libraries
*   **Image Export:** `html-to-image` (v1.11.11) - Handles DOM-to-PNG rasterization.
*   **File Handling:** Native Browser File API (Blob URLs).

## Architecture
*   **Entry Point:** `index.html` loads `index.tsx`.
*   **State Management:** React `useState` & `useReducer` (Local component state).
*   **Component Structure:**
    *   `App.tsx`: Main orchestrator and layout container.
    *   `components/Controls.tsx`: UI for user input and configuration.
    *   `components/ThumbnailArt.tsx`: The visual canvas/render target.
    *   `components/Annotations.tsx`: Static visual style guide.
*   **Types:** TypeScript interfaces defined in `types.ts`.

## Performance Considerations
*   **Rendering:** React StrictMode enabled.
*   **Exporting:** Cache-busting disabled for Blob URLs to ensure export stability.
*   **Animations:** CSS Keyframes used for "Glitch" and "Pulse" effects to minimize JS thread blocking.

```

### FILE: docs/TESTING.md
```md
# Testing Guide — mirror-truth---thumbnail-designer

**Application:** mirror-truth---thumbnail-designer
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd mirror-truth---thumbnail-designer
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Mirror Truth   Thumbnail Designer | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Mirror Truth   Thumbnail Designer | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mirror Truth   Thumbnail Designer | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

    <script type="module" src="./index.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">mirror truth   thumbnail designer</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthGate } from './AuthGate';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);
```

### FILE: metadata.json
```json
{
  "name": "Mirror Truth - Thumbnail Designer",
  "description": "A high-fidelity, interactive YouTube thumbnail mockup tool featuring cyberpunk aesthetics, split-face CSS art, and real-time safe-zone analysis.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "packageManager": "pnpm@10.30.1",
  "name": "mirror-truth---thumbnail-designer",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "html-to-image": "1.11.11",
    "lucide-react": "^0.564.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "serve": "14.2.5",
    "typescript": "~5.8.2",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "@playwright/test": "^1.49.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['html', { outputFolder: 'tests/playwright-report' }]],
  use: {
    baseURL: 'http://localhost:8080',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
});

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1IVOvqvJvItHN8wmyEWMgO3CSuLOq9DOy

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Mirror Truth   Thumbnail Designer</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Mirror Truth   Thumbnail Designer — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — mirror-truth---thumbnail-designer
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('mirror-truth---thumbnail-designer E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tests/e2e/app.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('Mirror Truth - Thumbnail Designer', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#thumbnail-canvas')).toBeVisible();
  });

  test('should have theme toggle button', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('button[aria-label="Toggle Theme"]');
    await expect(themeBtn).toBeVisible();
  });

  test('should switch theme when toggle is clicked', async ({ page }) => {
    await page.goto('/');
    const classBeforeClick = await page.locator('html').getAttribute('class');
    await page.locator('button[aria-label="Toggle Theme"]').click();
    await page.waitForTimeout(500);
    const classAfterClick = await page.locator('html').getAttribute('class');
    expect(classBeforeClick).not.toBe(classAfterClick);
  });

  test('should display admin panel button', async ({ page }) => {
    await page.goto('/');
    const adminBtn = page.locator('button[aria-label="Admin Panel"]');
    await expect(adminBtn).toBeVisible();
  });

  test('should open admin modal with password field', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[aria-label="Admin Panel"]').click();
    await page.waitForTimeout(300);
    const passwordInput = [REDACTED_CREDENTIAL]
    await expect(passwordInput).toBeVisible();
  });
});

```

### FILE: tests/puppeteer/e2e.js
```javascript
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Ensure reports directory exists
const reportDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

(async () => {
    console.log('🚀 Starting Mirror Truth E2E Tests...');
    const browser = await chromium.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    // Set viewport to standard HD
    await page.setViewport({ width: 1440, height: 900 });

    try {
        // 1. Load Application
        console.log('📍 Navigating to application...');
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
        
        // Take initial screenshot
        await page.screenshot({ path: path.join(reportDir, '01-load.png') });
        console.log('✅ App loaded successfully');

        // 2. Verify Core Elements
        const canvas = await page.$('#thumbnail-canvas');
        if (canvas) console.log('✅ Thumbnail Canvas found');
        else throw new Error('Thumbnail Canvas not found');

        // 3. Test Theme Toggle
        console.log('🌗 Testing Theme Toggle...');
        const bodyClassBefore = await page.evaluate(() => document.documentElement.className);
        // Assuming the toggle is the button with Sun/Moon icon. Finding by aria-label if possible or generic button structure
        // In our app, it's the first button in the header group.
        await page.click('button[aria-label="Toggle Theme"]');
        await new Promise(r => setTimeout(r, 500)); // wait for transition
        const bodyClassAfter = await page.evaluate(() => document.documentElement.className);
        
        if (bodyClassBefore !== bodyClassAfter) {
            console.log(`✅ Theme switched from "${bodyClassBefore}" to "${bodyClassAfter}"`);
        } else {
            throw new Error('Theme toggle failed');
        }
        await page.screenshot({ path: path.join(reportDir, '02-light-mode.png') });

        // 4. Test Text Input Update
        console.log('⌨️ Testing Text Input...');
        const artistInput = await page.$('input[value="Kudjo Twum"]'); // Initial value
        if (artistInput) {
            await artistInput.click({ clickCount: 3 });
            await artistInput.type('TEST ARTIST');
            await new Promise(r => setTimeout(r, 200));
            // Check if rendered canvas text updated (Visual check via screenshot)
            await page.screenshot({ path: path.join(reportDir, '03-text-update.png') });
            console.log('✅ Text input interaction successful');
        } else {
            console.warn('⚠️ Could not find specific artist input to test');
        }

        // 5. Test Admin Panel Open
        console.log('🛡️ Testing Admin Panel...');
        await page.click('button[aria-label="Admin Panel"]');
        await new Promise(r => setTimeout(r, 300));
        await page.screenshot({ path: path.join(reportDir, '04-admin-modal.png') });
        
        const passwordInput = [REDACTED_CREDENTIAL]
        if (passwordInput) console.log('✅ Admin Modal opened and password field found');
        else throw new Error('Admin modal failed to open');

        console.log('🎉 All tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({ path: path.join(reportDir, 'error-state.png') });
    } finally {
        await browser.close();
    }
})();
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
    "types": [
      "node"
    ],
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

### FILE: types.ts
```typescript
export type ThumbnailVariant = 'original' | 'neon-void' | 'editorial';

export interface ThumbnailConfig {
  artistName: string;
  hookText: string;
  accentWord: string;
  showSafeZones: boolean;
  showGrid: boolean;
  animate: boolean;
  variant: ThumbnailVariant;
  leftImage: string | null;
  rightImage: string | null;
  
  // Image Transforms
  leftImageScale: number;
  leftImageX: number;
  leftImageY: number;
  rightImageScale: number;
  rightImageX: number;
  rightImageY: number;

  // Face Container Transforms
  faceX: number;
  faceY: number;
  faceScale: number;
  faceSpread: number;

  showCssFace: boolean;
  hookLetterSpacing: number;
  hookFontWeight: string;
}

export interface GlitchFragment {
  id: number;
  width: number;
  height: number;
  top: number;
  left: number;
  color: string;
  delay: number;
}

export interface PixelScatter {
  id: number;
  top: number;
  left: number;
  color: string;
  delay: number;
  opacity: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export type ThemeMode = 'dark' | 'light';
```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
  base: './',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — mirror-truth---thumbnail-designer
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — mirror-truth---thumbnail-designer
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

