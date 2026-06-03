import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/api';
import { LoginPage } from './features/auth/LoginPage';
import { Layout } from './components/ui/Layout';
import { OverviewPage } from './features/overview/OverviewPage';
import { DevicesPage } from './features/devices/DevicesPage';
import { BandwidthPage } from './features/bandwidth/BandwidthPage';
import { AlertsPage } from './features/alerts/AlertsAndMore';
import { ControlPage } from './features/alerts/AlertsAndMore';
import { AuditPage } from './features/alerts/AlertsAndMore';
import './index.css';
const qc = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 15_000, retry: 1, refetchInterval: 30_000 }
    }
});
function ProtectedRoute({ children }) {
    const token = useAuthStore(s => s.token);
    return token ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login", replace: true });
}
export default function App() {
    return (_jsx(QueryClientProvider, { client: qc, children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsxs(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Layout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(OverviewPage, {}) }), _jsx(Route, { path: "devices", element: _jsx(DevicesPage, {}) }), _jsx(Route, { path: "bandwidth", element: _jsx(BandwidthPage, {}) }), _jsx(Route, { path: "alerts", element: _jsx(AlertsPage, {}) }), _jsx(Route, { path: "control", element: _jsx(ControlPage, {}) }), _jsx(Route, { path: "audit", element: _jsx(AuditPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
