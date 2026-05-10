import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { get, set } from 'idb-keyval';
import {
  Sparkles,
  Copy,
  Check,
  Send,
  Layout,
  Palette,
  Type as FontIcon,
  Image as ImageIcon,
  ChevronRight,
  Info,
  Upload,
  Download,
  Save,
  History,
  X,
  RotateCcw,
  Settings,
  Shield
} from 'lucide-react';
import { generateThumbnailPrompts } from './services/geminiService';
import { ThumbnailData, GeneratedPrompts, SavedDesign } from './types';
import { AdminPanel, recordAuditLog } from './components/AdminPanel';
import { AccessibilityPanel } from './components/AccessibilityPanel';

const INITIAL_DATA: ThumbnailData = {
  brandName: 'NEXUS AI',
  logoDescription: 'Minimalist geometric N',
  logoImage: null,
  headlineLine1: 'AI',
  headlineLine2: 'MASTERCLASS',
  subheadline: 'UNLOCK FUTURE GROWTH',
  backgroundScene: 'Futuristic server room with glowing cyan and purple fiber optic data streams.',
  backgroundImage: null,
  bgZoom: 100,
  bgX: 50,
  bgY: 50,
  foregroundSubject: 'Charismatic tech executive presenting, pointing at futuristic holographic data, sharp cinematic lighting.',
  subjectImage: null,
  subjectZoom: 100,
  subjectX: 50,
  subjectY: 50,
  featureIcons: ['Machine Learning', 'Data Strategy', 'Scale Fast'],
  featureImages: [null, null, null],
  taglineBar: 'PROMPT ENGINEERING & BEYOND',
  aspectRatio: '4:5'
};

export default function App() {
  const [data, setData] = useState<ThumbnailData>(INITIAL_DATA);
  const [generated, setGenerated] = useState<GeneratedPrompts | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  useEffect(() => {
    get('luxthumb_design_data').then((savedData) => {
      if (savedData) {
        setData(savedData);
      }
      setIsLoaded(true);
    }).catch((err) => {
      console.error("Failed to load design data from IndexedDB", err);
      setIsLoaded(true);
    });

    get('luxthumb_saved_designs').then((designs) => {
      if (designs) setSavedDesigns(designs);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      set('luxthumb_design_data', data).catch((err) => {
        console.error("Failed to save design data to IndexedDB", err);
      });
    }
  }, [data, isLoaded]);

  const saveCurrentDesign = async () => {
    const newDesign: SavedDesign = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      name: data.brandName || 'Untitled Design',
      data: { ...data }
    };
    const updated = [newDesign, ...savedDesigns];
    setSavedDesigns(updated);
    set('luxthumb_saved_designs', updated).then(() => {
      alert('Design saved to history!');
      recordAuditLog('design_save', `Design saved: ${data.brandName}`);
    });
  };

  const loadDesign = (design: SavedDesign) => {
    setData(design.data);
    setShowHistory(false);
  };

  const resetDesign = () => {
    if (confirm('Reset to initial design data? Current changes will be lost unless saved to history.')) {
      setData(INITIAL_DATA);
      setGenerated(null);
    }
  };

  const deleteDesign = (id: string) => {
    const designToDelete = savedDesigns.find(d => d.id === id);
    const updated = savedDesigns.filter(d => d.id !== id);
    setSavedDesigns(updated);
    set('luxthumb_saved_designs', updated);
    if (designToDelete) {
      recordAuditLog('design_delete', `Design deleted: ${designToDelete.name}`);
    }
  };

  const handleInputChange = (field: keyof ThumbnailData, value: string | number | null) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'backgroundImage' | 'subjectImage' | 'logoImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange(field, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconChange = (index: number, value: string) => {
    const newIcons = [...data.featureIcons];
    newIcons[index] = value;
    setData(prev => ({ ...prev, featureIcons: newIcons }));
  };

  const handleIconImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newImages = [...(data.featureImages || [null, null, null])];
        newImages[index] = ev.target?.result as string;
        setData(prev => ({ ...prev, featureImages: newImages }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeIconImage = (index: number) => {
    const newImages = [...(data.featureImages || [null, null, null])];
    newImages[index] = null;
    setData(prev => ({ ...prev, featureImages: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.foregroundSubject) {
      alert("Please describe the foreground subject (gender, attire, pose, etc.) first.");
      return;
    }
    setLoading(true);
    try {
      const result = await generateThumbnailPrompts(data);
      setGenerated(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate prompts. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const hideBordersForExport = () => {
    const borderElements = document.querySelectorAll('[data-export-border]');
    const styles: { el: Element; original: string }[] = [];
    borderElements.forEach(el => {
      styles.push({ el, original: el.getAttribute('style') || '' });
      const current = (el as HTMLElement).style.borderColor;
      (el as HTMLElement).style.borderColor = 'transparent';
    });
    return styles;
  };

  const restoreBorders = (styles: { el: Element; original: string }[]) => {
    styles.forEach(({ el, original }) => {
      if (original) {
        el.setAttribute('style', original);
      } else {
        el.removeAttribute('style');
      }
    });
  };

  const getTimestampedFilename = (basename: string, extension: string): string => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const brandPrefix = data.brandName ? `${data.brandName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}` : 'luxthumb_design';
    return `${brandPrefix}_${timestamp}.${extension}`;
  };

  const exportToPng = async () => {
    const element = document.getElementById('thumbnail-canvas');
    if (!element) return;
    try {
      setLoading(true);
      element.classList.remove('border', 'border-[#1A1A1A]', 'editorial-shadow');
      const savedStyles = hideBordersForExport();
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#0A0A0A'
      });
      restoreBorders(savedStyles);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');

      const link = document.createElement('a');
      const filename = getTimestampedFilename('thumbnail', 'png');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

      recordAuditLog('export_format_png', `PNG exported: ${filename}`);
    } catch (error) {
      console.error('Export PNG failed:', error);
      alert(`Failed to export PNG: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');
    }
  };

  const exportToPdf = async () => {
    const element = document.getElementById('thumbnail-canvas');
    if (!element) return;
    try {
      setLoading(true);
      element.classList.remove('border', 'border-[#1A1A1A]', 'editorial-shadow');
      const savedStyles = hideBordersForExport();
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#0A0A0A'
      });
      restoreBorders(savedStyles);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: (data.aspectRatio === '9:16' || data.aspectRatio === '4:5') ? 'portrait' : 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const filename = getTimestampedFilename('thumbnail', 'pdf');
      pdf.save(filename);

      recordAuditLog('export_format_pdf', `PDF exported: ${filename}`);
    } catch (error) {
      console.error('Export PDF failed:', error);
      alert('Failed to export PDF.');
    } finally {
      setLoading(false);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');
    }
  };

  const exportToJpg = async () => {
    const element = document.getElementById('thumbnail-canvas');
    if (!element) return;
    try {
      setLoading(true);
      element.classList.remove('border', 'border-[#1A1A1A]', 'editorial-shadow');
      const savedStyles = hideBordersForExport();
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#0A0A0A'
      });
      restoreBorders(savedStyles);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');

      const link = document.createElement('a');
      const filename = getTimestampedFilename('thumbnail', 'jpg');
      link.download = filename;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();

      recordAuditLog('export_format_jpg', `JPG exported: ${filename}`);
    } catch (error) {
      console.error('Export JPG failed:', error);
      alert('Failed to export JPG.');
    } finally {
      setLoading(false);
      element.classList.add('border', 'border-[#1A1A1A]', 'editorial-shadow');
    }
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement('a');
    link.download = 'luxthumb_ad_config.json';
    link.href = dataStr;
    link.click();
    recordAuditLog('export_format_json', `JSON config exported for brand: ${data.brandName}`);
  };

  const handleAdminLogin = () => {
    // btoa('admin123') = 'YWRtaW4xMjM='
    if (btoa(adminPassword) === 'YWRtaW4xMjM=') {
      setIsAdminAuthenticated(true);
      setAdminPassword('');
    } else {
      alert('Incorrect password. Please try again.');
      setAdminPassword('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#F5F5F5] font-sans overflow-hidden">
      {/* Admin Modal Overlay */}
      {isAdminOpen && !isAdminAuthenticated && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Admin login dialog">
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded p-8 w-96 space-y-6 animate-scale-in">
            <div>
              <div className="text-[10px] tracking-[0.2em] text-[#C9A84C] uppercase font-bold mb-1">SECURE ACCESS</div>
              <h2 className="text-xl font-serif italic text-white">Admin Login</h2>
            </div>
            <div className="space-y-3">
              <label htmlFor="admin-password" className="text-[10px] uppercase tracking-widest text-white/50">Password</label>
              <input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                className="w-full bg-[#111] border border-[#222] p-3 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors rounded"
                placeholder="Enter admin password"
                aria-label="Admin password"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdminLogin}
                className="flex-1 py-3 bg-[#C9A84C] text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4B96A] transition-colors rounded"
                aria-label="Login to admin panel"
              >
                Login
              </button>
              <button
                onClick={() => { setIsAdminOpen(false); setAdminPassword(''); }}
                className="px-4 py-3 border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-colors text-[11px] font-bold uppercase tracking-widest rounded"
                aria-label="Cancel admin login"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Full Panel */}
      {isAdminOpen && isAdminAuthenticated && (
        <div className="fixed inset-0 z-[100] animate-fade-in">
          <AdminPanel onLogout={handleAdminLogout} />
        </div>
      )}

      {/* Accessibility Panel */}
      <AccessibilityPanel isOpen={isAccessibilityOpen} onClose={() => setIsAccessibilityOpen(false)} />

      {/* Sidebar - Configuration */}
      <aside className="w-[340px] border-r border-[#2A2A2A] flex flex-col shrink-0 bg-[#0A0A0A] relative z-50">
        <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-start">
          <div>
            <div className="text-[10px] tracking-[0.2em] text-[#C9A84C] uppercase font-bold mb-1">THUMB-AGENT-001</div>
            <h1 className="text-2xl font-serif italic text-white">LuxThumb Designer</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsAccessibilityOpen(true)} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors" title="Accessibility & Theme Settings" aria-label="Open accessibility settings">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={() => setIsAdminOpen(true)} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors" title="Admin Panel" aria-label="Open admin panel">
              <Shield className="w-4 h-4" />
            </button>
            <button onClick={resetDesign} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/50 hover:text-red-500 hover:border-red-500/50 transition-colors" title="Reset Design" aria-label="Reset design to defaults">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={saveCurrentDesign} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors" title="Save Copy to History" aria-label="Save current design to history">
              <Save className="w-4 h-4" />
            </button>
            <button onClick={() => setShowHistory(!showHistory)} className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${showHistory ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-white/10 text-white/50 hover:text-white'}`} title="History" aria-label="Toggle design history">
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
             <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] uppercase tracking-widest text-[#C9A84C] font-bold">Saved Versions</h2>
                <span className="text-[9px] text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded-full">{savedDesigns.length}</span>
             </div>
             {savedDesigns.length === 0 ? (
               <div className="text-center py-12 border border-dashed border-white/10 rounded-sm">
                 <History className="w-6 h-6 text-white/20 mx-auto mb-2" />
                 <p className="text-[10px] uppercase tracking-widest text-white/40">No saves yet</p>
               </div>
             ) : (
               <div className="space-y-2">
                 {savedDesigns.map(design => (
                   <div key={design.id} className="p-4 bg-[#111] border border-white/5 rounded-sm hover:border-[#C9A84C]/50 transition-colors group cursor-pointer" onClick={() => loadDesign(design)}>
                     <div className="flex justify-between items-center mb-2">
                       <div className="text-[11px] font-bold text-white uppercase tracking-wider truncate pr-4">{design.name}</div>
                       <button 
                         onClick={(e) => { e.stopPropagation(); deleteDesign(design.id); }}
                         className="text-white/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                         title="Delete"
                       >
                         <X className="w-3.5 h-3.5" />
                       </button>
                     </div>
                     <div className="text-[9px] text-white/40 uppercase tracking-widest font-mono">
                        {new Date(design.timestamp).toLocaleString()}
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            <section className="space-y-6">
            <h2 className="text-[11px] uppercase tracking-widest text-white/30 font-bold">Input Configuration</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4 pt-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30">Brand Identity</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  <EditorialInput 
                    label="Brand Name" 
                    value={data.brandName} 
                    onChange={(v: string) => handleInputChange('brandName', v)}
                    placeholder="Fancy Homes"
                  />
                  <EditorialInput 
                    label="Logo Type" 
                    value={data.logoDescription} 
                    onChange={(v: string) => handleInputChange('logoDescription', v)}
                    placeholder="Gold icon"
                  />
                </div>
                
                <div className="border border-[#222] rounded-sm p-3 space-y-4 bg-[#111]">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] uppercase tracking-tighter text-[#C9A84C]">Logo Image</label>
                    {data.logoImage && (
                      <button type="button" onClick={() => handleInputChange('logoImage', null)} className="text-[9px] text-red-500 hover:text-red-400">Remove</button>
                    )}
                  </div>
                  
                  {!data.logoImage && (
                    <label className="border-2 border-dashed border-[#222] hover:border-[#C9A84C]/50 rounded p-4 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <Upload className="w-4 h-4 text-white/30 group-hover:text-[#C9A84C] mb-1" />
                      <span className="text-[9px] uppercase tracking-widest text-white/50 group-hover:text-white/80">Upload Logo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logoImage')} />
                    </label>
                  )}
                </div>
              </div>
              <EditorialInput 
                label="Headline L1" 
                value={data.headlineLine1} 
                onChange={(v) => handleInputChange('headlineLine1', v)}
                placeholder="TOURING"
              />
              <EditorialInput 
                label="Headline L2" 
                value={data.headlineLine2} 
                onChange={(v) => handleInputChange('headlineLine2', v)}
                colorClass="text-[#C9A84C]"
                placeholder="THE CITY"
              />
              <EditorialInput 
                label="Subheadline" 
                value={data.subheadline} 
                onChange={(v) => handleInputChange('subheadline', v)}
                placeholder="FIND YOUR NEXT HOME"
              />
              <div className="space-y-4 pt-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30">Background Setup</label>
                <EditorialInput 
                  label="Scene Description" 
                  value={data.backgroundScene} 
                  onChange={(v: string) => handleInputChange('backgroundScene', v)}
                  placeholder="Golden-hour skyline"
                />
                
                <div className="p-3 bg-[#111] border border-[#222] rounded-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] uppercase tracking-tighter text-[#C9A84C]">Image Preview</label>
                    {data.backgroundImage && (
                      <button type="button" onClick={() => handleInputChange('backgroundImage', null)} className="text-[9px] text-red-500 hover:text-red-400">Remove</button>
                    )}
                  </div>
                  
                  {!data.backgroundImage ? (
                    <label className="border-2 border-dashed border-[#222] hover:border-[#C9A84C]/50 rounded p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <Upload className="w-5 h-5 text-white/30 group-hover:text-[#C9A84C] mb-2" />
                      <span className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-white/80">Upload Background</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'backgroundImage')} />
                    </label>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>Zoom ({data.bgZoom}%)</span>
                        </div>
                        <input type="range" min="10" max="300" value={data.bgZoom} onChange={(e) => handleInputChange('bgZoom', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>X Offset ({data.bgX}%)</span>
                        </div>
                        <input type="range" min="0" max="100" value={data.bgX} onChange={(e) => handleInputChange('bgX', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>Y Offset ({data.bgY}%)</span>
                        </div>
                        <input type="range" min="0" max="100" value={data.bgY} onChange={(e) => handleInputChange('bgY', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-3 bg-[#111] border-l-2 border-[#C9A84C] space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-tighter text-[#C9A84C]">Commanding Subject (Required)</label>
                  <textarea
                    className="w-full bg-transparent outline-none text-xs text-white/80 leading-relaxed resize-none h-16"
                    placeholder="e.g. Confident CEO in sharp suit, dramatic rim lighting on shoulders, high-contrast cinematic shadows..."
                    value={data.foregroundSubject}
                    onChange={(e) => handleInputChange('foregroundSubject', e.target.value)}
                  />
                </div>
                
                <div className="border border-[#222] rounded-sm p-3 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] uppercase tracking-tighter text-[#C9A84C]">Subject Image</label>
                    {data.subjectImage && (
                      <button type="button" onClick={() => handleInputChange('subjectImage', null)} className="text-[9px] text-red-500 hover:text-red-400">Remove</button>
                    )}
                  </div>
                  
                  {!data.subjectImage ? (
                    <label className="border-2 border-dashed border-[#222] hover:border-[#C9A84C]/50 rounded p-4 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <Upload className="w-4 h-4 text-white/30 group-hover:text-[#C9A84C] mb-1" />
                      <span className="text-[9px] uppercase tracking-widest text-white/50 group-hover:text-white/80">Upload Subject</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'subjectImage')} />
                    </label>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>Zoom ({data.subjectZoom}%)</span>
                        </div>
                        <input type="range" min="10" max="300" value={data.subjectZoom} onChange={(e) => handleInputChange('subjectZoom', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>X Offset ({data.subjectX}%)</span>
                        </div>
                        <input type="range" min="-100" max="200" value={data.subjectX} onChange={(e) => handleInputChange('subjectX', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] text-white/50 uppercase tracking-widest">
                          <span>Y Offset ({data.subjectY}%)</span>
                        </div>
                        <input type="range" min="-100" max="200" value={data.subjectY} onChange={(e) => handleInputChange('subjectY', parseInt(e.target.value))} className="w-full accent-[#C9A84C]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30">Feature List</label>
                <div className="grid gap-2">
                  {data.featureIcons.map((icon, idx) => {
                    const featImg = data.featureImages?.[idx];
                    return (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 bg-[#111] border border-[#222] p-2 text-[11px] text-white/70 outline-none focus:border-[#C9A84C]/50 transition-colors"
                            placeholder={`Feature 0${idx + 1}`}
                            value={icon}
                            onChange={(e) => handleIconChange(idx, e.target.value)}
                          />
                          {!featImg ? (
                            <label className="w-9 h-9 flex-shrink-0 bg-[#111] border border-[#222] hover:border-[#C9A84C]/50 flex items-center justify-center cursor-pointer transition-colors group">
                              <Upload className="w-3.5 h-3.5 text-white/30 group-hover:text-[#C9A84C]" />
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleIconImageUpload(e, idx)} />
                            </label>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeIconImage(idx)}
                              className="w-9 h-9 flex-shrink-0 bg-[#111] border border-[#C9A84C] relative overflow-hidden group"
                              title="Remove Icon"
                            >
                              <img src={featImg} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-30 transition-opacity" />
                              <X className="w-3 h-3 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <label className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold">Aspect Ratio Control</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { ratio: '4:5', desc: 'Social Feed' },
                    { ratio: '9:16', desc: 'Story / Reel' },
                    { ratio: '1:1', desc: 'Square Post' },
                    { ratio: '16:9', desc: 'Video / Web' }
                  ].map(({ ratio, desc }) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => handleInputChange('aspectRatio', ratio as any)}
                      className={`flex items-center gap-3 p-3 border rounded-sm transition-all text-left ${
                        data.aspectRatio === ratio 
                          ? 'border-[#C9A84C] bg-[#C9A84C]/5' 
                          : 'border-[#222] bg-[#111] hover:border-white/20'
                      }`}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                        <div className={`border-2 ${data.aspectRatio === ratio ? 'border-[#C9A84C]' : 'border-white/30'} transition-all`}
                             style={{
                               width: ratio === '16:9' ? '24px' : ratio === '1:1' ? '20px' : ratio === '4:5' ? '20px' : '16px',
                               height: ratio === '9:16' ? '24px' : ratio === '1:1' ? '20px' : ratio === '4:5' ? '25px' : '20px',
                               aspectRatio: ratio.replace(':', '/')
                             }}
                        />
                      </div>
                      <div>
                        <div className={`text-[11px] font-bold ${data.aspectRatio === ratio ? 'text-[#C9A84C]' : 'text-white/70'} leading-none mb-1`}>{ratio}</div>
                        <div className="text-[9px] text-white/30 uppercase tracking-tighter leading-none">{desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-6 bg-[#C9A84C] text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4B96A] transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Engage Engine
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="space-y-4 pt-4 border-t border-white/5">
            <h2 className="text-[11px] uppercase tracking-widest text-white/30">Active Palette</h2>
            <div className="flex gap-3">
              <PaletteSwatch color="#050505" label="BG" />
              <PaletteSwatch color="#C9A84C" label="Gold" />
              <PaletteSwatch color="#F5F5F5" label="Ink" />
              <PaletteSwatch color="#1A1A1A" label="Acc" />
            </div>
          </section>
        </div>
        )}
      </aside>

      {/* Main Content - Preview and Results */}
      <main className="flex-1 bg-[#0F0F0F] relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#C9A84C_0%,_transparent_70%)] opacity-30"></div>
          <div className="absolute inset-0 bg-[#050505]/40" />
        </div>

        <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center gap-12 z-10 scrollbar-hide">
          {/* Preview Container */}
          <div className="relative group">
            <div id="thumbnail-canvas" className={`relative bg-[#0A0A0A] editorial-shadow border border-[#1A1A1A] overflow-hidden flex flex-col transition-all duration-500`}
                 style={{ 
                   width: data.aspectRatio === '4:5' ? '420px' : data.aspectRatio === '1:1' ? '400px' : data.aspectRatio === '16:9' ? '560px' : '360px',
                   aspectRatio: data.aspectRatio === '4:5' ? '4/5' : data.aspectRatio === '1:1' ? '1/1' : data.aspectRatio === '16:9' ? '16/9' : '9/16'
                 }}>
              
              {/* Background Image / Overlay / Grain */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {data.backgroundImage && (
                  <img 
                    src={data.backgroundImage} 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transform: `scale(${data.bgZoom / 100})`,
                      objectPosition: `${data.bgX}% ${data.bgY}%`
                    }}
                  />
                )}
                <div className="absolute inset-0 opacity-80 mix-blend-overlay pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-tr from-black via-transparent to-[#C9A84C]/20"></div>
                </div>
                {data.backgroundImage && <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />}
              </div>

              {/* Branding / Header */}
              <div className="p-8 flex justify-between items-start relative z-10">
                <div className="flex flex-col">
                  {data.logoImage ? (
                    <img src={data.logoImage} alt="Logo" className="h-8 object-contain mb-2 origin-top-left object-left" />
                  ) : (
                    <div className="w-6 h-6 border-t-2 border-l-2 border-[#C9A84C] mb-2 scale-75 origin-top-left" data-export-border></div>
                  )}
                  <div className="text-[10px] font-serif italic text-white tracking-widest uppercase mt-1">
                    {data.brandName || "Brand Name"}
                  </div>
                  <div className="text-[8px] text-[#C9A84C] uppercase tracking-[0.3em] font-medium"> 
                    {data.logoDescription || "Identity Mark"}
                  </div>
                </div>
              </div>

              {/* Headlines */}
              <div className="px-8 flex-1 flex flex-col justify-center relative z-10">
                <div className="space-y-[-12px]">
                  <h2 className="text-6xl font-serif font-black text-white italic tracking-tighter uppercase leading-none break-words">
                    {data.headlineLine1 || "Headline"}
                  </h2>
                  <h2 className="text-7xl font-serif font-black text-[#C9A84C] italic tracking-tighter uppercase leading-none break-words">
                    {data.headlineLine2 || "Luxury"}
                  </h2>
                </div>

                <div className="mt-6">
                  <span className="inline-block border border-[#C9A84C] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-[0.2em] bg-[#C9A84C]/10 transition-all hover:bg-[#C9A84C]/20 cursor-default">
                    {data.subheadline || "Subheadline Callout"}
                  </span>
                </div>

                {/* Features List */}
                <div className="mt-12 space-y-3">
                  {data.featureIcons.map((feature, i) => {
                    if (!feature) return null;
                    const featImg = data.featureImages?.[i];
                    return (
                      <div key={i} className="flex items-center gap-3 group/feat">
                        {featImg ? (
                          <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 transition-transform group-hover/feat:scale-110">
                            <img src={featImg} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-[#C9A84C] flex items-center justify-center text-[#C9A84C] text-[8px] font-bold flex-shrink-0 transition-transform group-hover/feat:scale-110">
                            {feature[0]?.toUpperCase() || '•'}
                          </div>
                        )}
                        <div className="text-[9px] uppercase tracking-widest text-white/70">
                          {feature}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subject Representation (Right-Aligned) */}
              <div className="absolute right-[-20px] bottom-0 w-2/3 h-4/5 z-0 opacity-80 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-t from-black via-transparent to-transparent absolute inset-0 z-10"></div>
                <div className="w-full h-full bg-[#111] border-l border-[#C9A84C]/30 relative overflow-hidden" data-export-border>
                   {data.subjectImage ? (
                     <img 
                       src={data.subjectImage}
                       alt="Subject"
                       className="absolute inset-0 w-full h-full object-cover"
                       style={{
                         transform: `scale(${data.subjectZoom / 100})`,
                         objectPosition: `${data.subjectX}% ${data.subjectY}%`
                       }}
                     />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-[#222] text-2xl font-serif italic text-center px-12">
                        {data.foregroundSubject ? data.foregroundSubject : "Subject Mask"}
                     </div>
                   )}
                </div>
              </div>

              {/* Footer Bar */}
              <div className="relative z-20 h-12 bg-[#C9A84C] flex items-center px-8 border-t border-black/10" data-export-border>
                <div className="text-[9px] font-bold text-black tracking-[0.25em] uppercase w-full flex justify-between items-center">
                  <span className="truncate max-w-[70%]">{data.taglineBar || "Brand Vision Statements"}</span>
                  <span className="opacity-60 italic shrink-0">v1.0</span>
                </div>
              </div>
            </div>

            {/* Preview Labels */}
            <div className="absolute -bottom-20 left-0 right-0 flex justify-between items-end">
               <div className="text-left space-y-1">
                 <div className="text-[9px] uppercase tracking-widest text-white/30">Layout Engine</div>
                 <div className="text-[11px] font-serif italic text-[#C9A84C]">Editorial Cinematic</div>
               </div>
               <div className="flex items-center gap-3">
                 <button onClick={exportToPng} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 border border-white/20 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors bg-black/50">
                    <Download className="w-3 h-3" /> PNG
                 </button>
                 <button onClick={exportToJpg} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 border border-white/20 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors bg-black/50">
                    <Download className="w-3 h-3" /> JPG
                 </button>
                 <button onClick={exportToPdf} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 border border-white/20 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors bg-black/50">
                    <Download className="w-3 h-3" /> PDF
                 </button>
                 <button onClick={exportToJson} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 border border-white/20 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors bg-black/50">
                    <Download className="w-3 h-3" /> Config
                 </button>
               </div>
               <div className="text-right space-y-1">
                 <div className="text-[9px] uppercase tracking-widest text-white/30">Status</div>
                 <div className="text-[11px] text-white flex items-center justify-end gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   Secure Link Active
                 </div>
               </div>
            </div>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {generated && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[800px] grid md:grid-cols-2 gap-6 pb-24"
              >
                <div className="md:col-span-2 flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-10 h-[1px] bg-[#C9A84C]" />
                  <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold text-white/60">Generated Output Sheets</h3>
                </div>

                <EditorialOutput 
                   title="Midjourney Prompt" 
                   content={generated.midjourney} 
                   onCopy={() => copyToClipboard(generated.midjourney, 'mj')}
                   isCopied={copiedField === 'mj'}
                />

                <EditorialOutput 
                   title="Imagen 3 / DALL-E" 
                   content={generated.imagen3} 
                   onCopy={() => copyToClipboard(generated.imagen3, 'im')}
                   isCopied={copiedField === 'im'}
                />

                <div className="bg-[#111] border border-white/5 p-6 space-y-4 rounded-sm">
                   <div className="flex items-center gap-2 text-[#C9A84C]">
                      <FontIcon className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Type Spec</span>
                   </div>
                   <div className="space-y-3 text-[10px] uppercase tracking-wider text-white/40">
                      <p><span className="text-white/80 pr-2">Hero:</span> {generated.typographySpec.headline}</p>
                      <p><span className="text-white/80 pr-2">Body:</span> {generated.typographySpec.subheadline}</p>
                   </div>
                </div>

                <div className="bg-[#111] border border-white/5 p-6 space-y-4 rounded-sm">
                   <div className="flex items-center gap-2 text-[#C9A84C]">
                      <Palette className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Atmosphere</span>
                   </div>
                   <div className="flex gap-2">
                      <PaletteSwatch color={generated.colorPalette.background} label="BG" />
                      <PaletteSwatch color={generated.colorPalette.goldPrimary} label="Gold" />
                      <PaletteSwatch color={generated.colorPalette.whiteText} label="Ink" />
                   </div>
                </div>

                <div className="md:col-span-2 bg-gradient-to-tr from-[#111] to-[#1a1a1a] border border-[#222] p-8 space-y-4">
                   <div className="flex items-center justify-between">
                     <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C9A84C]">Motion Extension (Veo/Sora)</h4>
                     <button 
                       onClick={() => copyToClipboard(generated.animatedExtension, 'motion')}
                       className="text-[9px] uppercase font-bold text-white/40 hover:text-white transition-colors"
                     >
                       {copiedField === 'motion' ? 'Synced to Clip' : 'Extract Motion'}
                     </button>
                   </div>
                   <p className="font-serif italic text-lg leading-relaxed text-white/80">
                      "{generated.animatedExtension}"
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function EditorialInput({ label, value, onChange, placeholder, colorClass }: any) {
  return (
    <div className="p-3 bg-[#111] border border-[#222] rounded-sm transition-all hover:border-white/10 group">
      <label className="text-[9px] uppercase tracking-tighter text-[#C9A84C] block mb-1 group-hover:text-[#D4B96A] transition-colors">{label}</label>
      <input
        type="text"
        className={`w-full bg-transparent outline-none text-sm font-medium placeholder:text-white/10 ${colorClass || 'text-white'}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function EditorialOutput({ title, content, onCopy, isCopied }: any) {
  return (
    <div className="bg-[#111] border border-white/5 p-6 rounded-sm relative group hover:border-white/10 transition-all">
       <div className="flex items-center justify-between mb-4">
         <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">{title}</span>
         <button onClick={onCopy} className="text-[#C9A84C] hover:text-white transition-colors">
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
         </button>
       </div>
       <p className="text-[11px] text-white/40 font-mono leading-relaxed select-all">
         {content}
       </p>
    </div>
  );
}

function PaletteSwatch({ color, label }: { color: string, label: string }) {
  return (
    <div className="space-y-1">
      <div 
        className="w-8 h-8 rounded-full border border-white/5 shadow-inner" 
        style={{ backgroundColor: color }}
      />
      <div className="text-[8px] uppercase text-white/20 text-center tracking-tighter">{label}</div>
    </div>
  );
}
