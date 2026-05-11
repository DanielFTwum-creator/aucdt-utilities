import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Grid, Map as MapIcon, LogIn, Plane } from 'lucide-react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Routes, Route } from 'react-router-dom';
import Viewfinder from './components/Viewfinder';
import { Button } from './components/ui/button';

const Collection = React.lazy(() => import('./components/Collection'));
const Map = React.lazy(() => import('./components/Map'));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const AuditLogs = React.lazy(() => import('./components/admin/AuditLogs'));
const Diagnostics = React.lazy(() => import('./components/admin/Diagnostics'));
const TestingDashboard = React.lazy(() => import('./components/admin/TestingDashboard'));
const AdminLogin = React.lazy(() => import('./components/admin/AdminLogin'));

function PageLoader() {
  return (
    <div className="flex-1 bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Plane className="w-12 h-12 text-white" />
        </motion.div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AppContent user={user} />} />
      <Route
        path="/admin"
        element={
          <React.Suspense fallback={<PageLoader />}>
            {isAdmin ? <AdminLayout /> : <AdminLogin onLogin={() => setIsAdmin(true)} />}
          </React.Suspense>
        }
      >
        <Route path="dashboard" element={<React.Suspense fallback={<PageLoader />}><AdminDashboard /></React.Suspense>} />
        <Route path="logs" element={<React.Suspense fallback={<PageLoader />}><AuditLogs /></React.Suspense>} />
        <Route path="diagnostics" element={<React.Suspense fallback={<PageLoader />}><Diagnostics /></React.Suspense>} />
        <Route path="testing" element={<React.Suspense fallback={<PageLoader />}><TestingDashboard /></React.Suspense>} />
      </Route>
    </Routes>
  );
}

function AppContent({ user }: { user: FirebaseUser | null }) {
  const [activeTab, setActiveTab] = useState<'viewfinder' | 'collection' | 'map'>('viewfinder');

  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoginError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginError(err?.message ?? 'Login failed');
    }
  };

  if (!user) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center p-6 text-center font-mono">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <div className="relative inline-block mb-8">
            <Plane className="w-24 h-24 text-white rotate-45" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-white/20 rounded-full blur-3xl"
            />
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter mb-4">FLYDEE</h1>
          <p className="text-zinc-500 max-w-xs mx-auto text-sm uppercase tracking-widest leading-relaxed">
            The world's first gamified plane-spotting experience.
          </p>
        </motion.div>

        <Button
          size="lg"
          onClick={handleLogin}
          className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg font-bold rounded-full flex gap-3"
        >
          <LogIn className="w-5 h-5" />
          INITIALIZE SYSTEM
        </Button>

        {loginError && (
          <p className="mt-4 text-red-400 text-xs uppercase tracking-widest max-w-xs text-center">
            {loginError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-screen bg-black flex flex-col text-white" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <main className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: 0 }}>
        {activeTab === 'viewfinder' && <Viewfinder />}
        {activeTab === 'collection' && (
          <React.Suspense fallback={<PageLoader />}>
            <Collection />
          </React.Suspense>
        )}
        {activeTab === 'map' && (
          <React.Suspense fallback={<PageLoader />}>
            <Map />
          </React.Suspense>
        )}
      </main>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="bg-zinc-950 border-t border-zinc-900 flex items-center justify-around px-6 z-50 text-white"
        style={{ flexShrink: 0, height: '5rem' }}
      >
        <NavButton active={activeTab === 'collection'} onClick={() => setActiveTab('collection')} icon={<Grid className="w-6 h-6" />} label="Binder" />
        <NavButton active={activeTab === 'viewfinder'} onClick={() => setActiveTab('viewfinder')} icon={<Camera className="w-8 h-8" />} label="Open viewfinder scanner" primary />
        <NavButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<MapIcon className="w-6 h-6" />} label="Radar" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, primary }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active ? 'true' : 'false'}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${primary ? '-mt-10' : ''} ${active ? 'text-white' : 'text-zinc-400'}`}
    >
      <div className={`p-3 rounded-full transition-all duration-300 ${primary ? 'bg-white text-black shadow-xl shadow-white/10 scale-110' : active ? 'bg-zinc-900' : ''}`}>
        {icon}
      </div>
      {!primary && <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>}
    </button>
  );
}
