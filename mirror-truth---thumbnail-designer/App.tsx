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
    if (password === 'admin') {
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