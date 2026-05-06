import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { PromptBuilder } from '@/components/PromptBuilder';
import { StreamPlayer } from '@/components/player/StreamPlayer';
import { TrackLibrary } from '@/components/library/TrackLibrary';
import { LoginScreen } from '@/components/LoginScreen';
import { useGenerationStore } from '@/store/generationStore';
import { setAccessToken, registerAuthFailureHandler } from '@/services/api';
export default function App() {
    const [tab, setTab] = useState('generate');
    const [jobId, setJobId] = useState(null);
    const [params, setParams] = useState(null);
    const [token, setToken] = useState(() => sessionStorage.getItem('ls_token'));
    const [quota, setQuota] = useState(20);
    const store = useGenerationStore();
    const handleAuthenticated = (t, q) => {
        sessionStorage.setItem('ls_token', t);
        setToken(t);
        setQuota(q);
    };
    const handleLogout = () => {
        sessionStorage.removeItem('ls_token');
        setAccessToken(null);
        setToken(null);
    };
    // Register auth failure handler (session expired / refresh failed)
    useEffect(() => {
        registerAuthFailureHandler(() => {
            sessionStorage.removeItem('ls_token');
            setToken(null);
        });
    }, []);
    // Inject token into axios headers whenever it changes
    if (token)
        setAccessToken(token);
    if (!token) {
        return _jsx(LoginScreen, { onAuthenticated: handleAuthenticated });
    }
    const handleGenerate = (p, id) => {
        setParams(p);
        setJobId(id);
    };
    return (_jsxs("div", { className: "ls-shell", children: [_jsx("a", { href: "#main-content", className: "skip-link", children: "Skip to content" }), _jsxs("nav", { className: "ls-sidebar", children: [_jsxs("div", { className: "ls-logo", children: [_jsx("div", { className: "ls-logo-icon", children: _jsxs("svg", { width: "17", height: "17", viewBox: "0 0 16 16", fill: "none", children: [_jsx("path", { d: "M3 8a5 5 0 0 1 10 0", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round" }), _jsx("path", { d: "M5.5 10.5a3 3 0 0 1 5 0", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round" }), _jsx("circle", { cx: "8", cy: "12.5", r: "1", fill: "white" })] }) }), _jsxs("div", { children: [_jsx("div", { className: "ls-logo-name", children: "LyriaStream" }), _jsx("div", { className: "ls-logo-sub", children: "Self-Hosted AI \u00B7 TUC" })] })] }), _jsxs("button", { type: "button", className: `ls-nav-item${tab === 'generate' ? ' active' : ''}`, onClick: () => setTab('generate'), "aria-current": tab === 'generate' ? 'page' : undefined, children: [_jsxs("svg", { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", children: [_jsx("rect", { x: "2", y: "2", width: "12", height: "12", rx: "2" }), _jsx("path", { d: "M5 8h6M5 5.5h4M5 10.5h3" })] }), "Generate"] }), _jsxs("button", { type: "button", className: `ls-nav-item${tab === 'library' ? ' active' : ''}`, onClick: () => setTab('library'), "aria-current": tab === 'library' ? 'page' : undefined, children: [_jsx("svg", { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", children: _jsx("path", { d: "M2 4h12M2 8h9M2 12h6" }) }), "Library"] }), _jsx("div", { className: "ls-nav-spacer" }), _jsx("div", { className: "ls-sidebar-quota", children: _jsxs("span", { children: [quota, " generation", quota !== 1 ? 's' : '', " left"] }) }), store.computeMode && (_jsxs("div", { className: "ls-compute-badge", children: [_jsx("span", { className: `ls-compute-dot ls-compute-dot--${store.computeMode === 'gpu_full' ? 'gpu' :
                                    store.computeMode === 'cpu_draft' ? 'cpu' : 'auto'}` }), store.computeMode] })), _jsxs("button", { type: "button", className: "ls-nav-item", onClick: handleLogout, children: [_jsx("svg", { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", children: _jsx("path", { d: "M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3M10 11l3-3-3-3M13 8H6" }) }), "Sign out"] })] }), _jsxs("main", { id: "main-content", className: "ls-main", children: [tab === 'generate' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "ls-page-header", children: [_jsx("h1", { children: "Generate music" }), _jsx("p", { children: "Describe what you want to hear, then tune the details below" })] }), _jsx("section", { "aria-label": "Music generation", children: _jsx(PromptBuilder, { onGenerate: handleGenerate }) }), jobId && params && (_jsx("section", { "aria-label": "Playback", className: "ls-playback-section animate-slide-up", children: _jsx(StreamPlayer, { jobId: jobId, params: params }) }))] })), tab === 'library' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "ls-page-header", children: [_jsx("h1", { children: "Library" }), _jsx("p", { children: "Your generated tracks" })] }), _jsx("section", { "aria-label": "Track library", children: _jsx(TrackLibrary, {}) })] })), _jsxs("footer", { className: "ls-footer", children: [_jsx("span", { children: "LyriaStream v2.0" }), _jsx("span", { children: "\u00B7" }), _jsx("span", { children: "TUC-ICT-SRS-2026-008" }), _jsx("span", { children: "\u00B7" }), _jsx("span", { children: "Techbridge University College" }), _jsx("span", { children: "\u00B7" }), _jsx("span", { children: "Models: MusicGen (MIT) \u00B7 Riffusion (MIT)" })] })] })] }));
}
