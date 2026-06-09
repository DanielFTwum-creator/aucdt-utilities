import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/api';
import { wmsSilentRefresh, netscanSsoExchange } from './lib/wmsAuth';
import { LoginPage } from './features/auth/LoginPage';
import { CallbackPage } from './features/auth/CallbackPage';
import { MfaPage } from './features/auth/MfaPage';
import { Layout } from './components/ui/Layout';
import { OverviewPage }   from './features/overview/OverviewPage';
import { DevicesPage }    from './features/devices/DevicesPage';
import { BandwidthPage }  from './features/bandwidth/BandwidthPage';
import { AlertsPage }     from './features/alerts/AlertsAndMore';
import { ControlPage }    from './features/alerts/AlertsAndMore';
import { AuditPage }      from './features/alerts/AlertsAndMore';
import './index.css';

const qc = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 15_000, retry: 1, refetchInterval: 30_000 }
  }
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

/**
 * Silent SSO adoption (TUC-ICT-SRS-2026-013 FR-SSO-005): on load, if there's no NetScan token and
 * we're not mid-OAuth-callback, try the shared WMS session — success means the user is signed in
 * with no interaction. Otherwise fall through to the login screen.
 */
function SsoBoot({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token);
  const login = useAuthStore(s => s.login);
  const [booting, setBooting] = useState(!token);

  useEffect(() => {
    if (token) return;
    const { pathname, search } = window.location;
    if (pathname.startsWith('/auth/callback') || pathname.startsWith('/mfa')
        || search.includes('code=') || search.includes('mfa_ticket=')) {
      setBooting(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const wmsToken = await wmsSilentRefresh();
      if (!cancelled && wmsToken) {
        try { const r = await netscanSsoExchange(wmsToken); login(r.token, r.username); } catch { /* fall through */ }
      }
      if (!cancelled) setBooting(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono-code text-xs tracking-widest text-slate-500"
           style={{ background: '#060e1a' }}>
        CONNECTING…
      </div>
    );
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <SsoBoot>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<CallbackPage />} />
          <Route path="/mfa" element={<MfaPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<OverviewPage />} />
            <Route path="devices"   element={<DevicesPage />} />
            <Route path="bandwidth" element={<BandwidthPage />} />
            <Route path="alerts"    element={<AlertsPage />} />
            <Route path="control"   element={<ControlPage />} />
            <Route path="audit"     element={<AuditPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </SsoBoot>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
