import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Download, CheckCircle, FileText, ImageIcon, ExternalLink, Zap, Shield,
  Layout, Target, Trash2, RefreshCw, Type, Link as LinkIcon,
  BarChart3, Image as ImageIcon2, Activity, Settings, HardDrive,
  Search, AlertTriangle, Monitor, Smartphone, Moon, Sun, Lock, Play
} from 'lucide-react';
import Poster from './components/Poster';
import Methodology from './components/Methodology';
import { Tooltip } from './components/Tooltip';
import { getPosterHtml } from './lib/poster-utils';
import { exportToMp4, exportViaMediaRecorder, getVideoExportMethod, ExportProgress, canExportVideo } from './lib/video-export';
import { PosterData, defaultPosterData, AspectRatio } from './types';

const AdminLayout = lazy(() => import('./components/AdminPages').then(m => ({ default: m.AdminLayout })));


// --- MAIN APP COMPONENTS ---

function AppContent() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVideoExporting, setIsVideoExporting] = useState(false);
  const [videoProgress, setVideoProgress] = useState<ExportProgress | null>(null);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posterData, setPosterData] = useState<PosterData>(defaultPosterData);
  const exportRef = React.useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tuc-theme');
      return saved ? saved === 'dark' : false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('tuc-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const exportHTML = () => {
    const htmlContent = getPosterHtml(posterData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `poster-${posterData.brandName.toLowerCase().replace(/\s+/g, '-')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async (format: 'png' | 'pdf') => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, data: posterData })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `techbridge-poster-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B1A1A', '#D4A017']
        });
      });
      
      setLastGenerated(format.toUpperCase());
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err instanceof Error ? err.message : "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (lastGenerated) {
      const timer = setTimeout(() => setLastGenerated(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastGenerated]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const updateField = (field: keyof PosterData, value: any) => {
    setPosterData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoExport = async () => {
    if (!exportRef.current) return;

    setIsVideoExporting(true);
    setVideoProgress({ currentFrame: 0, totalFrames: 75, status: 'Initializing...' });

    try {
      const method = getVideoExportMethod();
      let blob: Blob;
      let ext: string;

      if (method === 'webcodecs') {
        blob = await exportToMp4(exportRef.current, posterData, (progress) => {
          setVideoProgress(progress);
        });
        ext = 'mp4';
      } else if (method === 'mediarecorder') {
        const result = await exportViaMediaRecorder(exportRef.current, posterData, (progress) => {
          setVideoProgress(progress);
        });
        blob = result.blob;
        ext = result.extension;
      } else {
        throw new Error('Video export not supported on this browser');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `techbridge-poster-${Date.now()}.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setLastGenerated(ext.toUpperCase());
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#8B1A1A', '#D4A017', '#ffffff']
        });
      });
    } catch (err: any) {
      console.error('Video export failed:', err);
      const msg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));
      setError(`Video Export Error: ${msg || 'Unknown error'}`);
    } finally {
      setIsVideoExporting(false);
      setVideoProgress(null);
    }
  };

  const getPreviewScale = (ratio: AspectRatio) => {
    switch (ratio) {
      case AspectRatio.STORY: return 0.7;
      case AspectRatio.PORTRAIT: return 0.8;
      case AspectRatio.CINEMA: return 0.7;
      case AspectRatio.SQUARE: return 0.7;
      default: return 0.85;
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row h-screen w-full overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-[#f8f6f2]'} font-sans`}>
      {/* Sidebar - Editors (Mobile: full-width, Desktop: 320px sidebar) */}
      <aside className={`w-full lg:w-80 lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-slate-200/60'} shadow-[0_20px_40px_rgba(0,0,0,0.02)] lg:shadow-[20px_0_40px_rgba(0,0,0,0.02)] z-20`}>
        <div className={`p-8 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100/80'} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tuc-crimson overflow-hidden p-1.5 shadow-lg shadow-tuc-crimson/20">
              <img 
                src={posterData.logoUrl} 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-0.5">
              <h1 className={`text-sm font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-tuc-text-primary'}`}>TECHBRIDGE</h1>
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-400">Poster Studio</p>
            </div>
          </div>
          <Tooltip text={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`} position="bottom" isDarkMode={isDarkMode}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl relative overflow-hidden transition-all duration-300 active:scale-95 ${isDarkMode ? 'bg-white/5 text-tuc-gold' : 'bg-slate-50 text-slate-400'}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ y: 20, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </Tooltip>
        </div>

        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 lg:py-8 space-y-8 lg:space-y-10 custom-scrollbar max-h-[60vh] lg:max-h-none">
          {/* Layout & Dimensions */}
          <section className="space-y-6">
            <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pb-2`}>
              <div className="flex items-center gap-2 text-tuc-crimson">
                <Layout className="w-3.5 h-3.5" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.15em]">Layout</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(AspectRatio).map(([key, value]) => (
                <Tooltip key={key} text={`Switch to ${key} format`} position="top" isDarkMode={isDarkMode}>
                  <button
                    onClick={() => updateField('aspectRatio', value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all active:scale-95 w-full ${
                      posterData.aspectRatio === value
                        ? 'bg-tuc-crimson border-tuc-crimson text-white shadow-lg'
                        : isDarkMode ? 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[12px] font-bold uppercase tracking-wider">{key}</span>
                    <span className="text-[10px] opacity-70 mt-0.5">{value}</span>
                  </button>
                </Tooltip>
              ))}
            </div>
          </section>

          {/* Header Section */}
          <section className="space-y-6">
            <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pb-2`}>
              <div className="flex items-center gap-2 text-tuc-crimson">
                <Type className="w-3.5 h-3.5" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.15em]">Messaging</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className="group">
                <Tooltip text="Scrolling row shown at the very top of the poster" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Urgency Strip</label>
                  <input
                    type="text"
                    value={posterData.urgencyText}
                    onChange={(e) => updateField('urgencyText', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10 focus:border-tuc-crimson' : 'bg-slate-50 border-slate-200/60 focus:bg-white focus:border-tuc-crimson focus:ring-4 focus:ring-tuc-crimson/5'}`}
                  />
                </Tooltip>
              </div>
              <div className="group">
                <Tooltip text="Short intro text above the main headline" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Eyebrow</label>
                  <input
                    type="text"
                    value={posterData.eyebrow}
                    onChange={(e) => updateField('eyebrow', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10 focus:border-tuc-crimson' : 'bg-slate-50 border-slate-200/60 focus:bg-white focus:border-tuc-crimson focus:ring-4 focus:ring-tuc-crimson/5'}`}
                  />
                </Tooltip>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Headline Content</label>
                <Tooltip text="First line of the main headline" position="top" isDarkMode={isDarkMode}>
                  <input type="text" value={posterData.headlineLine1} onChange={(e) => updateField('headlineLine1', e.target.value)} className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`} placeholder="Line 1" />
                </Tooltip>
                <Tooltip text="Italicized accent line (Crimson color)" position="top" isDarkMode={isDarkMode}>
                  <input type="text" value={posterData.headlineLine2} onChange={(e) => updateField('headlineLine2', e.target.value)} className={`w-full text-base p-3 rounded-lg border outline-none transition-all font-bold text-tuc-crimson ${isDarkMode ? 'bg-white/5 border-tuc-crimson/30' : 'bg-slate-50 border-tuc-crimson/30'}`} placeholder="Line 2 (Accent)" />
                </Tooltip>
                <Tooltip text="Third line of the main headline" position="top" isDarkMode={isDarkMode}>
                  <input type="text" value={posterData.headlineLine3} onChange={(e) => updateField('headlineLine3', e.target.value)} className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`} placeholder="Line 3" />
                </Tooltip>
                <Tooltip text="Optional fourth line for additional context" position="top" isDarkMode={isDarkMode}>
                  <input type="text" value={posterData.headlineLine4} onChange={(e) => updateField('headlineLine4', e.target.value)} className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`} placeholder="Line 4 (Optional)" />
                </Tooltip>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="space-y-6">
            <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pb-2`}>
              <div className="flex items-center gap-2 text-tuc-crimson">
                <LinkIcon className="w-3.5 h-3.5" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.15em]">Call to Action</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className="group">
                <Tooltip text="Label shown on the call-to-action button" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Button Copy</label>
                  <input
                    type="text"
                    value={posterData.ctaText}
                    onChange={(e) => updateField('ctaText', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`}
                  />
                </Tooltip>
              </div>
              <div className="group">
                <Tooltip text="Destination URL for the call-to-action button" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Target Link</label>
                  <input
                    type="text"
                    value={posterData.ctaUrl}
                    onChange={(e) => updateField('ctaUrl', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`}
                  />
                </Tooltip>
              </div>
            </div>
          </section>

          {/* Brand & Multimedia */}
          <section className="space-y-6">
            <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pb-2`}>
              <div className="flex items-center gap-2 text-tuc-crimson">
                <ImageIcon2 className="w-3.5 h-3.5" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.15em]">Brand & Video</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-tuc-crimson/10 border-tuc-crimson/20' : 'bg-tuc-crimson/5 border-tuc-crimson/10'}`}>
                <div className="space-y-0.5">
                  <span className="text-[12px] font-black text-tuc-crimson uppercase tracking-wider">Video Carousel</span>
                  <p className="text-[10.5px] text-tuc-crimson/60">Interchange logo and tour</p>
                </div>
                <Tooltip text={posterData.showVideo ? "Disable Video Overlay" : "Enable Video Overlay"} position="left" isDarkMode={isDarkMode}>
                  <button 
                    onClick={() => updateField('showVideo', !posterData.showVideo)}
                    className={`w-10 h-5 rounded-full relative transition-all duration-300 ${posterData.showVideo ? 'bg-tuc-crimson shadow-inner shadow-black/10' : 'bg-slate-300'}`}
                  >
                    <motion.div 
                      animate={{ x: posterData.showVideo ? 22 : 4 }}
                      className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-md shadow-black/20"
                    />
                  </button>
                </Tooltip>
              </div>
              <div className="group">
                <Tooltip text="URL to the background video (.mp4 recommended)" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Video Source</label>
                  <input
                    type="text"
                    value={posterData.videoUrl || ''}
                    onChange={(e) => updateField('videoUrl', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`}
                    placeholder="https://...mp4"
                  />
                </Tooltip>
              </div>
              <div className="group">
                <Tooltip text="Display domain shown below the institution name" position="top" isDarkMode={isDarkMode}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-tuc-crimson transition-colors">Domain Label</label>
                  <input
                    type="text"
                    value={posterData.domainUrl}
                    onChange={(e) => updateField('domainUrl', e.target.value)}
                    className={`w-full text-base p-3 rounded-lg border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-200/60'}`}
                  />
                </Tooltip>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="space-y-6 pb-12">
            <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pb-2`}>
              <div className="flex items-center gap-2 text-tuc-crimson">
                <BarChart3 className="w-3.5 h-3.5" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.15em]">Pillar Statistics</h2>
              </div>
            </div>
            <div className="space-y-5">
              {[1, 2, 3].map(num => (
                <div key={num} className="grid grid-cols-5 gap-3 items-end">
                  <div className="col-span-2">
                    <Tooltip text={`Main value for statistic ${num}`} position="top" isDarkMode={isDarkMode}>
                      <label className="text-[10px] font-black text-slate-300 uppercase block mb-1.5 tracking-tighter">Value {num}</label>
                      <input
                        type="text"
                        value={(posterData as any)[`stat${num}Value`]}
                        onChange={(e) => updateField(`stat${num}Value` as any, e.target.value)}
                        className={`w-full text-base p-2 rounded-lg border font-bold text-tuc-crimson ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}
                      />
                    </Tooltip>
                  </div>
                  <div className="col-span-3">
                    <Tooltip text={`Descriptive label for statistic ${num}`} position="top" isDarkMode={isDarkMode}>
                      <label className="text-[10px] font-black text-slate-300 uppercase block mb-1.5 tracking-tighter">Descriptor {num}</label>
                      <input
                        type="text"
                        value={(posterData as any)[`stat${num}Label`]}
                        onChange={(e) => updateField(`stat${num}Label` as any, e.target.value)}
                        className={`w-full text-base p-2 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/5 text-white' : 'bg-slate-50/50 border-slate-100'}`}
                      />
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={`p-4 lg:p-6 border-t ${isDarkMode ? 'bg-[#222] border-white/5' : 'bg-slate-50/50 border-slate-100'} space-y-3 shrink-0`}>
          <Tooltip text="Download Print-Ready PDF" position="top" isDarkMode={isDarkMode}>
            <button
              onClick={() => handleGenerate('pdf')}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-tuc-crimson py-3.5 text-sm font-black text-white shadow-[0_10px_20px_-5px_rgba(139,26,26,0.3)] hover:-translate-y-0.5 hover:shadow-[0_15px_25px_-5px_rgba(139,26,26,0.4)] active:scale-95 transition-all disabled:opacity-50"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              GENERATE PDF
            </button>
          </Tooltip>
          <div className="grid grid-cols-2 gap-3">
            {canExportVideo() ? (
              <Tooltip text="Export 5s MP4 Video" position="top" isDarkMode={isDarkMode}>
                <button
                  type="button"
                  onClick={handleVideoExport}
                  disabled={isGenerating || isVideoExporting}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 ${isDarkMode ? 'bg-tuc-gold/10 border-tuc-gold/20 text-tuc-gold hover:bg-tuc-gold/20' : 'bg-tuc-gold/5 border-tuc-gold/20 text-tuc-gold-dark hover:bg-tuc-gold/10'}`}
                >
                  {isVideoExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  MP4
                </button>
              </Tooltip>
            ) : (
              <Tooltip text="MP4 export is not supported on iOS or this browser" position="top" isDarkMode={isDarkMode}>
                <button
                  type="button"
                  disabled
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition-all active:scale-95 opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-tuc-gold/10 border-tuc-gold/20 text-tuc-gold' : 'bg-tuc-gold/5 border-tuc-gold/20 text-tuc-gold-dark'}`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  MP4
                </button>
              </Tooltip>
            )}
            <Tooltip text="Export High-Res PNG" position="top" isDarkMode={isDarkMode}>
              <button
                onClick={() => handleGenerate('png')}
                disabled={isGenerating || isVideoExporting}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                PNG
              </button>
            </Tooltip>
          </div>
          <Tooltip text="View Raw HTML Code" position="top" isDarkMode={isDarkMode}>
            <button
              onClick={exportHTML}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition-all active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              HTML
            </button>
          </Tooltip>
        </div>
      </aside>

      {/* Main Canvas (Mobile: bottom, Desktop: right side) */}
      <main className={`relative flex-1 overflow-y-auto w-full h-auto lg:h-full scroll-smooth custom-scrollbar ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="relative min-h-screen flex flex-col items-center justify-start py-20">
          <div className={`absolute inset-0 z-0 bg-dot-grid pointer-events-none ${isDarkMode ? 'opacity-10' : 'opacity-40'}`}></div>
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="mb-8 text-center space-y-1">
              <h3 className={`text-[12px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Live Production Preview</h3>
              <div className="flex items-center justify-center gap-2">
                <div className="h-0.5 w-8 bg-tuc-maroon/20 rounded-full"></div>
                <span className="text-[8px] font-bold text-tuc-maroon/40 uppercase">Retina Master 2.0</span>
                <div className="h-0.5 w-8 bg-tuc-maroon/20 rounded-full"></div>
              </div>
            </div>

            <motion.div
              key={JSON.stringify(posterData)}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: getPreviewScale(posterData.aspectRatio), y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] rounded-2xl overflow-hidden ring-1 ring-black/5"
            >
              <Poster data={posterData} />
            </motion.div>

            <div className={`mt-16 grid grid-cols-3 gap-12 border-t pt-8 w-full max-w-2xl opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 ${isDarkMode ? 'border-white/5' : 'border-slate-200/60'}`}>
              <div className="flex flex-col items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-tuc-maroon ring-4 ring-tuc-maroon/10"></div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">CMYK Verified</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-tuc-maroon ring-4 ring-tuc-maroon/10"></div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">300 DPI Export</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-tuc-maroon ring-4 ring-tuc-maroon/10"></div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Retina Scaling</span>
              </div>
            </div>

            <Methodology />
          </div>
        </div>

          <div className="fixed z-30" style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))', left: 'calc(2rem + env(safe-area-inset-left))' }}>
            <Tooltip text="Diagnostic Dashboard" position="right" isDarkMode={isDarkMode}>
              <Link
                to="/admin/diagnostics"
                className={`p-3 rounded-full shadow-lg border transition-all hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-600' : 'bg-white border-slate-100 text-slate-300'}`}
              >
                <Activity className="w-5 h-5" />
              </Link>
            </Tooltip>
          </div>

          {/* Hidden Export Container */}
          <div 
            className="fixed pointer-events-none" 
            style={{ 
              zIndex: -1000, 
              left: '-20000px', 
              top: '0',
              width: 'max-content',
              height: 'max-content',
              opacity: 1, 
              visibility: 'visible'
            }}
            aria-hidden="true"
          >
             <div ref={exportRef} style={{ background: '#FAF7F0', width: 'max-content', display: 'inline-block' }}>
                <Poster data={posterData} forceVisible={true} />
             </div>
          </div>

          {/* Video Export Overlay */}
          <AnimatePresence>
            {isVideoExporting && videoProgress && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6"
              >
                <div className="w-full max-w-sm bg-white rounded-3xl p-10 space-y-8 shadow-2xl text-center">
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="48" cy="48" r="44" 
                        fill="none" 
                        stroke="#f1f5f9" 
                        strokeWidth="8"
                      />
                      <motion.circle 
                        cx="48" cy="48" r="44" 
                        fill="none" 
                        stroke="#8B1A1A" 
                        strokeWidth="8"
                        strokeDasharray="276.46"
                        initial={{ strokeDashoffset: 276.46 }}
                        animate={{ strokeDashoffset: 276.46 * (1 - videoProgress.currentFrame / videoProgress.totalFrames) }}
                        transition={{ duration: 0.3 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black tracking-tighter text-slate-900">
                        {Math.round((videoProgress.currentFrame / videoProgress.totalFrames) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Encoding MP4</h2>
                    <div className="space-y-1">
                      <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Status</p>
                      <p className="text-slate-600 text-sm font-bold truncate max-w-full px-2">{videoProgress.status}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing {posterData.aspectRatio} Aspect Ratio</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="fixed z-[100] flex items-center gap-4 bg-red-600 text-white p-4 pl-6 rounded-2xl shadow-2xl shadow-red-900/20 border border-red-500/50"
              style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))', right: 'calc(2rem + env(safe-area-inset-right))' }}
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Sync Failure</span>
                <span className="text-sm font-bold">{error}</span>
              </div>
              <button onClick={() => setError(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {lastGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="fixed z-[100] flex items-center gap-4 bg-emerald-600 text-white p-4 pl-6 rounded-2xl shadow-2xl shadow-emerald-900/20 border border-emerald-500/50"
              style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))', right: 'calc(2rem + env(safe-area-inset-right))' }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Export Finalized</span>
                  <span className="text-sm font-bold">Successfully generated {lastGenerated} asset.</span>
                </div>
              </div>
              <button onClick={() => setLastGenerated(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={
          <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-50"><div className="text-slate-400">Loading admin...</div></div>}>
            <AdminLayout />
          </Suspense>
        } />
        <Route path="/" element={<AppContent />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

