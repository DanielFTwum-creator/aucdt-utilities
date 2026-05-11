import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Admin } from './components/Admin';
import { LoginModal } from './components/LoginModal';
import { useAuth } from './contexts/AuthContext';
import { addLog } from './services/auditLogService';
import type { Module, ModuleId } from './types';
import { MODULES } from './constants';
import Module1Tracks from './modules/Module1_Tracks';
import Module2Releases from './modules/Module2_Releases';
import Module3RightsAudit from './modules/Module3_RightsAudit';
import Module4StagePipeline from './modules/Module4_StagePipeline';
import Module5AuthorshipRegistry from './modules/Module5_AuthorshipRegistry';
import Module6Distribution from './modules/Module6_Distribution';

const getHash = () =>
  typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?/, '') : '';

const App: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeModuleId, setActiveModuleId] = useState<ModuleId | 'admin' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>(getHash);
  const initialMount = React.useRef(true);

  const isAdminRoute = currentHash === 'admin';

  const activeModule: Partial<Module> | null = useMemo(() => {
    if (activeModuleId === 'admin') return { title: 'Admin Panel', description: 'Manage system and view logs' };
    if (!activeModuleId) return null;
    return MODULES.find(m => m.id === activeModuleId) || null;
  }, [activeModuleId]);

  useEffect(() => {
    const handleSync = () => {
      const hash = getHash();
      setCurrentHash(hash);
      if (hash === 'admin') {
        if (isAdmin) { setActiveModuleId('admin'); setShowLoginModal(false); }
        else if (isAuthenticated) { setActiveModuleId(null); setShowLoginModal(true); }
        else { setActiveModuleId(null); setShowLoginModal(false); }
      } else if (hash) {
        const module = MODULES.find(m => m.id === hash);
        if (module) { setActiveModuleId(hash as ModuleId); setShowLoginModal(false); }
        else { setActiveModuleId(null); setShowLoginModal(false); }
      } else {
        setActiveModuleId(null);
        setShowLoginModal(false);
      }
    };
    handleSync();
    window.addEventListener('hashchange', handleSync);
    return () => window.removeEventListener('hashchange', handleSync);
  }, [isAdmin, isAuthenticated]);

  useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    const hash = getHash();
    if (activeModuleId) {
      if (hash !== activeModuleId) window.location.hash = `#/${activeModuleId}`;
      const title = activeModuleId === 'admin' ? 'Admin Panel' : MODULES.find(m => m.id === activeModuleId)?.title;
      addLog(`Navigated to ${title}.`);
    } else {
      if (hash !== '') window.location.hash = '';
      addLog('Returned to Dashboard.');
    }
  }, [activeModuleId]);

  useEffect(() => {
    if (isAuthenticated || isAdmin) setShowLoginModal(false);
  }, [isAuthenticated, isAdmin]);

  const handleAdminClick = () => {
    if (isAdmin) setActiveModuleId('admin');
    else setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    if (!isAdmin && getHash() === 'admin') window.location.hash = '';
  };

  const renderActiveModule = () => {
    if (activeModuleId === 'admin' && isAdmin) return <Admin />;
    switch (activeModuleId) {
      case 'tracks': return <Module1Tracks />;
      case 'releases': return <Module2Releases />;
      case 'rights-audit': return <Module3RightsAudit />;
      case 'stage-pipeline': return <Module4StagePipeline />;
      case 'authorship-registry': return <Module5AuthorshipRegistry />;
      case 'distribution': return <Module6Distribution />;
      default: return <Dashboard setActiveModuleId={setActiveModuleId} />;
    }
  };

  const content = (!isAuthenticated && !isAdmin) ? (
    <LoginModal
      onClose={() => { if (isAdminRoute) window.location.hash = ''; }}
      mode={isAdminRoute ? 'admin' : 'access'}
      hideCancel={!isAdminRoute}
    />
  ) : (
    <>
      <Sidebar activeModuleId={activeModuleId} setActiveModuleId={setActiveModuleId} onAdminClick={handleAdminClick} />
      <div className="flex flex-col flex-1 min-h-0">
        <Header module={activeModule} onHomeClick={() => setActiveModuleId(null)} />
        <main id="main-content" className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderActiveModule()}
        </main>
      </div>
      {showLoginModal && <LoginModal onClose={handleLoginModalClose} />}
    </>
  );

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] px-4 py-2 rounded-md text-sm font-semibold">
        Skip to main content
      </a>
      <div className="flex h-screen bg-[var(--color-background-main)] text-[var(--color-foreground)] font-sans">
        {content}
      </div>
    </>
  );
};

export default App;
