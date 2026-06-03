import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/api';
import { LoginPage } from './features/auth/LoginPage';
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

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
      </BrowserRouter>
    </QueryClientProvider>
  );
}
