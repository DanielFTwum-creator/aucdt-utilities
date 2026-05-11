import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import type { Module, ModuleId } from './types';
import { MODULES } from './constants';
import Module1VisualDesign from './modules/Module1_VisualDesign';
import Module2VideoProduction from './modules/Module2_VideoProduction';
import Module3ContentCreation from './modules/Module3_ContentCreation';
import Module5Storytelling from './modules/Module5_Storytelling';
import Module6SentimentAnalysis from './modules/Module6_SentimentAnalysis';
import Module7UxUiDesign from './modules/Module7_UxUiDesign';
import Module10Ethics from './modules/Module10_Ethics';
import Module4Personalization from './modules/Module4_Personalization';
import Module8Branding from './modules/Module8_Branding';
import Module9Deepfakes from './modules/Module9_Deepfakes';
import { useAuth } from './contexts/AuthContext';
import { Admin } from './components/Admin';
import { LoginModal } from './components/LoginModal';
import { addLog } from './services/auditLogService';


const getHash = () => typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?/, '') : '';

const App: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeModuleId, setActiveModuleId] = useState<ModuleId | 'admin' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>(getHash);
  const initialMount = React.useRef(true);

  // Derived Values
  const isAdminRoute = currentHash === 'admin';
  const activeModule: Partial<Module> | null = useMemo(() => {
    if (activeModuleId === 'admin') return { title: 'Admin Panel', description: 'Manage application and view logs' };
    if (!activeModuleId) return null;
    return MODULES.find(m => m.id === activeModuleId) || null;
  }, [activeModuleId]);

  // Unified Synchronization Effect
  useEffect(() => {
    const handleSync = () => {
      const hash = getHash();
      setCurrentHash(hash);

      // Handle Admin Route
      if (hash === 'admin') {
        if (isAdmin) {
          setActiveModuleId('admin');
          setShowLoginModal(false);
        } else if (isAuthenticated) {
          // Standard student visiting #/admin -> show login modal but stay on dashboard
          setActiveModuleId(null);
          setShowLoginModal(true);
        } else {
          // Unauthenticated visiting #/admin -> let the early return show the login modal
          setActiveModuleId(null);
          setShowLoginModal(false);
        }
      } 
      // Handle Standard Modules
      else if (hash) {
        const module = MODULES.find(m => m.id === hash);
        if (module) {
          setActiveModuleId(hash as ModuleId);
          setShowLoginModal(false);
        } else {
          setActiveModuleId(null);
          setShowLoginModal(false);
        }
      } 
      // Handle Root/Dashboard
      else {
        setActiveModuleId(null);
        setShowLoginModal(false);
      }
    };

    handleSync();
    window.addEventListener('hashchange', handleSync);
    return () => window.removeEventListener('hashchange', handleSync);
  }, [isAdmin, isAuthenticated]);

  // Audit Logging & Internal Hash Sync
  useEffect(() => {
    if (initialMount.current) {
        initialMount.current = false;
        return;
    }

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

  // 3. Clear Modal on successful Auth via effect to ensure clean state
  useEffect(() => {
    if (isAuthenticated || isAdmin) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated, isAdmin]);

  const handleAdminClick = () => {
    if (isAdmin) {
      setActiveModuleId('admin');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    if (!isAdmin && getHash() === 'admin') {
      window.location.hash = '';
    }
  };

  const renderActiveModule = () => {
    if (activeModuleId === 'admin' && isAdmin) return <Admin />;
    switch (activeModuleId) {
      case 'visual-design': return <Module1VisualDesign />;
      case 'video-production': return <Module2VideoProduction />;
      case 'content-creation': return <Module3ContentCreation />;
      case 'storytelling': return <Module5Storytelling />;
      case 'sentiment-analysis': return <Module6SentimentAnalysis />;
      case 'ux-ui-design': return <Module7UxUiDesign />;
      case 'ethics': return <Module10Ethics />;
      case 'personalization': return <Module4Personalization />;
      case 'branding': return <Module8Branding />;
      case 'deepfakes': return <Module9Deepfakes />;
      default: return <Dashboard setActiveModuleId={setActiveModuleId} />;
    }
  };

  // RENDER LOGIC
  const content = (!isAuthenticated && !isAdmin) ? (
    <LoginModal
      onClose={() => { if (isAdminRoute) window.location.hash = ''; }}
      mode={isAdminRoute ? 'admin' : 'access'}
      hideCancel={!isAdminRoute}
    />
  ) : (
    <>
      <Sidebar activeModuleId={activeModuleId} setActiveModuleId={setActiveModuleId} onAdminClick={handleAdminClick} />
      <div className="flex flex-col flex-1">
        <Header module={activeModule} onHomeClick={() => setActiveModuleId(null)} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderActiveModule()}
        </main>
      </div>
      {showLoginModal && <LoginModal onClose={handleLoginModalClose} />}
    </>
  );

  return (
    <div className="flex h-screen bg-[var(--color-background-main)] text-[var(--color-foreground)] font-sans">
      {content}
    </div>
  );
};

export default App;
