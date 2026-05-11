import React, { useState, useRef } from 'react';
import { CATALOG_DATA, ThumbnailSection, ThumbnailVariation, VariationStyle } from './data/catalog';
import { ThumbnailCard } from './components/ThumbnailCard';
import { DetailModal } from './components/DetailModal';
import { StyleGuide } from './components/StyleGuide';
import { AIAgent } from './components/AIAgent';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LayoutGrid, BookOpen, Layers, Filter, Search, Menu, X, Upload, Image as ImageIcon, Trash2, Sun, Moon, Eye } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AdminProvider, useAdmin } from './context/AdminContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex bg-[var(--bg-secondary)] rounded-lg p-1 border border-[var(--border-color)]">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md transition-all ${theme === 'light' ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        aria-label="Light Theme"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md transition-all ${theme === 'dark' ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        aria-label="Dark Theme"
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setTheme('high-contrast')}
        className={`p-1.5 rounded-md transition-all ${theme === 'high-contrast' ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        aria-label="High Contrast Theme"
      >
        <Eye size={16} />
      </button>
    </div>
  );
};

const AdminRoute = () => {
  const { isAuthenticated } = useAdmin();
  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};

const MainApp = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('all');
  const [selectedVariation, setSelectedVariation] = useState<ThumbnailVariation | null>(null);
  const [selectedSection, setSelectedSection] = useState<{title: string, theme: string} | null>(null);
  const [filterStyle, setFilterStyle] = useState<VariationStyle | 'All'>('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleViewDetails = (variation: ThumbnailVariation, section: ThumbnailSection) => {
    setSelectedVariation(variation);
    setSelectedSection({ title: section.title, theme: section.theme });
  };

  const closeDetails = () => {
    setSelectedVariation(null);
    setSelectedSection(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBackground(url);
    }
  };

  const clearCustomBackground = () => {
    setCustomBackground(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredSections = activeSectionId === 'all' 
    ? CATALOG_DATA 
    : CATALOG_DATA.filter(s => s.id === activeSectionId);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <LayoutGrid className="text-[var(--accent-color)]" />
            MasterCatalog
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-[var(--text-secondary)]">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-[var(--border-color)]">
          <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Custom Overlay
          </div>
          {!customBackground ? (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] py-3 px-4 rounded-lg border border-[var(--border-color)] border-dashed transition-colors text-sm font-medium"
            >
              <Upload size={16} />
              Upload Media
            </button>
          ) : (
            <div className="space-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-[var(--border-color)]">
                {customBackground.match(/\.(mp4|webm)$/) ? (
                   <video src={customBackground} className="w-full h-full object-cover" />
                ) : (
                   <img src={customBackground} alt="Custom" className="w-full h-full object-cover" />
                )}
              </div>
              <button 
                onClick={clearCustomBackground}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 px-4 rounded-lg border border-red-500/20 transition-colors text-xs font-medium"
              >
                <Trash2 size={14} />
                Remove Overlay
              </button>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*,video/*" 
            className="hidden" 
          />
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-250px)]">
          <button
            onClick={() => { setActiveSectionId('all'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeSectionId === 'all' ? 'bg-[var(--accent-color)]/10 text-[var(--accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Layers size={18} />
            All Collections
          </button>

          <div className="pt-4 pb-2 px-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Sections
          </div>

          {CATALOG_DATA.map(section => (
            <button
              key={section.id}
              onClick={() => { setActiveSectionId(section.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                activeSectionId === section.id ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-l-2 border-[var(--accent-color)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/50 hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="truncate">{section.title}</span>
            </button>
          ))}

          <div className="pt-4 pb-2 px-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Resources
          </div>

          <button
            onClick={() => { setActiveSectionId('style-guide'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeSectionId === 'style-guide' ? 'bg-[var(--accent-color)]/10 text-[var(--accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookOpen size={18} />
            Style Guide
          </button>

          <div className="pt-4 pb-2 px-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Admin
          </div>

          <button
            onClick={() => { setActiveSectionId('admin'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeSectionId === 'admin' ? 'bg-[var(--accent-color)]/10 text-[var(--accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Layers size={18} />
            Admin Console
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-medium text-[var(--text-primary)] hidden sm:block">
              {activeSectionId === 'all' ? 'Complete Catalogue' : 
               activeSectionId === 'style-guide' ? 'Documentation' :
               activeSectionId === 'admin' ? 'Administration' :
               CATALOG_DATA.find(s => s.id === activeSectionId)?.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {activeSectionId !== 'style-guide' && activeSectionId !== 'admin' && (
              <>
                <div className="hidden md:flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg p-1 border border-[var(--border-color)]">
                  {(['All', 'Golden Glow', 'Thick Outline', 'Red Glow', 'Clean Shadow'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setFilterStyle(style)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        filterStyle === style 
                          ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
                
                {/* Mobile Filter Dropdown (simplified) */}
                <div className="md:hidden relative group">
                  <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <Filter size={20} />
                  </button>
                </div>
              </>
            )}
            
            <div className="h-6 w-px bg-[var(--border-color)] mx-2"></div>
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-0 scroll-smooth">
          {activeSectionId === 'style-guide' ? (
            <div className="p-6">
              <StyleGuide />
            </div>
          ) : activeSectionId === 'admin' ? (
            <AdminRoute />
          ) : (
            <div className="p-6 max-w-7xl mx-auto space-y-12 pb-20">
              {filteredSections.map(section => {
                const visibleVariations = filterStyle === 'All' 
                  ? section.variations 
                  : section.variations.filter(v => v.style === filterStyle);

                if (visibleVariations.length === 0) return null;

                return (
                  <section key={section.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{section.title}</h3>
                      <p className="text-[var(--text-secondary)] text-sm max-w-3xl">{section.theme} — <span className="text-[var(--accent-text)]">{section.message}</span></p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {visibleVariations.map(variation => (
                        <ThumbnailCard 
                          key={variation.id} 
                          variation={variation} 
                          sectionTitle={section.title}
                          sectionTheme={section.theme}
                          onViewDetails={(v) => handleViewDetails(v, section)}
                          customBackground={customBackground}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
              
              {filteredSections.every(s => 
                (filterStyle === 'All' ? s.variations : s.variations.filter(v => v.style === filterStyle)).length === 0
              ) && (
                <div className="text-center py-20">
                  <p className="text-[var(--text-secondary)] text-lg">No thumbnails found matching this filter.</p>
                  <button 
                    onClick={() => setFilterStyle('All')}
                    className="mt-4 text-[var(--accent-text)] hover:text-[var(--accent-hover)] text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedVariation && selectedSection && (
        <DetailModal 
          variation={selectedVariation} 
          sectionTitle={selectedSection.title}
          sectionTheme={selectedSection.theme}
          onClose={closeDetails} 
          customBackground={customBackground}
        />
      )}

      {/* AI Agent */}
      <AIAgent />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <MainApp />
      </AdminProvider>
    </ThemeProvider>
  );
}

