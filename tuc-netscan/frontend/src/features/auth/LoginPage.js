import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, useAuthStore } from '../../lib/api';
import { wmsLoginUrl } from '../../lib/wmsAuth';
import { Wifi, Lock, User, AlertCircle } from 'lucide-react';
export function LoginPage() {
    const [username, setUsername] = useState('daniel.twum');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore(s => s.login);
    const navigate = useNavigate();
    const reason = new URLSearchParams(window.location.search).get('reason');
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.login(username, password);
            login(res.token, res.username);
            navigate('/');
        }
        catch {
            setError('Invalid credentials. Default dev password: tuc-ict-2026');
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center", style: { background: 'linear-gradient(135deg, #060e1a 0%, #0D1B2E 50%, #060e1a 100%)', backgroundImage: 'linear-gradient(rgba(200,146,10,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,10,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }, children: _jsxs("div", { className: "w-full max-w-sm", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4", style: { background: 'rgba(200,146,10,0.1)', border: '1px solid rgba(200,146,10,0.3)' }, children: _jsx(Wifi, { size: 28, className: "text-gold" }) }), _jsx("h1", { className: "font-mono-display text-2xl text-gold tracking-widest", children: "TUC NETSCAN" }), _jsx("p", { className: "text-slate-500 text-xs font-mono-code mt-1 tracking-widest", children: "CAMPUS NETWORK OPERATIONS" }), _jsx("div", { className: "mt-2 text-xs text-slate-600 font-mono-code", children: "TUC-ICT-SRS-2026-012" })] }), _jsxs("div", { className: "noc-card p-6", children: [reason && (_jsxs("div", { className: "flex items-start gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded p-3 mb-4", children: [_jsx(AlertCircle, { size: 12, className: "mt-0.5 shrink-0" }), reason === 'domain' ? 'Only @techbridge.edu.gh accounts are permitted.'
                                    : reason === 'deactivated' ? 'Your account has been deactivated.'
                                        : 'Sign-in failed. Please try again.'] })), _jsx("button", { type: "button", onClick: () => { window.location.href = wmsLoginUrl(); }, className: "w-full flex items-center justify-center gap-2 py-2.5 rounded font-mono-code text-sm tracking-widest transition-all", style: { background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A' }, children: "CONTINUE WITH GOOGLE" }), _jsxs("div", { className: "relative flex items-center gap-3 my-5", children: [_jsx("div", { className: "flex-1 h-px bg-white/10" }), _jsx("span", { className: "text-slate-600 text-[10px] uppercase font-mono-code tracking-widest", children: "break-glass" }), _jsx("div", { className: "flex-1 h-px bg-white/10" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono-code text-slate-400 mb-1.5 tracking-widest", children: "USERNAME" }), _jsxs("div", { className: "relative", children: [_jsx(User, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" }), _jsx("input", { type: "text", value: username, onChange: e => setUsername(e.target.value), className: "w-full bg-black/20 border border-white/10 rounded px-3 py-2.5 pl-9 text-sm font-mono-code text-slate-200 focus:outline-none focus:border-gold/50 transition-colors", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono-code text-slate-400 mb-1.5 tracking-widest", children: "PASSWORD" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" }), _jsx("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "tuc-ict-2026 (dev)", className: "w-full bg-black/20 border border-white/10 rounded px-3 py-2.5 pl-9 text-sm font-mono-code text-slate-200 focus:outline-none focus:border-gold/50 transition-colors", required: true })] })] }), error && (_jsxs("div", { className: "flex items-start gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded p-3", children: [_jsx(AlertCircle, { size: 12, className: "mt-0.5 shrink-0" }), error] })), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-2.5 rounded font-mono-code text-sm tracking-widest transition-all duration-200 disabled:opacity-50", style: { background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A' }, children: loading ? 'AUTHENTICATING...' : 'AUTHORISE ACCESS' })] })] }), _jsx("p", { className: "text-center text-xs text-slate-600 mt-6 font-mono-code", children: "Techbridge University College \u00B7 ICT Office \u00B7 Oyibi, Ghana" })] }) }));
}
