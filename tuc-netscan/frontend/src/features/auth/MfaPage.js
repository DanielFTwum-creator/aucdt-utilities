import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { wmsMfa, netscanSsoExchange } from '../../lib/wmsAuth';
import { useAuthStore } from '../../lib/api';
/**
 * TOTP MFA for NetScan staff (their WMS role requires it). Shown when the SSO callback returned an
 * mfa_ticket. On success the WMS access token is exchanged for a NetScan session (TUC-ICT-SRS-2026-013).
 */
export function MfaPage() {
    const navigate = useNavigate();
    const login = useAuthStore(s => s.login);
    const location = useLocation();
    const [ticket, setTicket] = useState(location.state?.mfaTicket ?? '');
    const [mode, setMode] = useState('verify');
    if (!ticket)
        return _jsx(Navigate, { to: "/login", replace: true });
    // WMS issued an access token -> exchange for a NetScan token and enter the app.
    const land = async (res) => {
        const r = await netscanSsoExchange(res.access_token);
        login(r.token, r.username);
        navigate('/', { replace: true });
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-4", style: { background: '#060e1a' }, children: _jsx("div", { className: "w-full max-w-sm noc-card p-6", children: mode === 'verify'
                ? _jsx(VerifyForm, { ticket: ticket, setTicket: setTicket, onDone: land, onEnrol: () => setMode('enroll') })
                : _jsx(EnrolWizard, { ticket: ticket, setTicket: setTicket, onDone: land, onBack: () => setMode('verify') }) }) }));
}
const codeInput = "w-full bg-black/20 border border-white/10 rounded px-3 py-2.5 text-center text-lg tracking-[0.4em] font-mono-code text-slate-200 focus:outline-none focus:border-gold/50";
const btn = "w-full py-2.5 rounded font-mono-code text-sm tracking-widest transition-all disabled:opacity-50 mt-3";
const btnStyle = { background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A' };
const linkBtn = "w-full py-2 text-xs font-mono-code text-slate-500 hover:text-slate-300 mt-2";
const errBox = "flex items-start gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded p-3 mt-3";
function VerifyForm({ ticket, setTicket, onDone, onEnrol }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const verify = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            const res = await wmsMfa('/api/auth/mfa/verify', { mfa_ticket: ticket, code });
            if (res.mfa_ticket) {
                setTicket(res.mfa_ticket);
                throw new Error(res.error || 'Invalid code');
            }
            if (!res.access_token)
                throw new Error(res.error || 'Verification failed');
            await onDone(res);
        }
        catch (err) {
            setError(err?.message || 'Invalid code');
        }
        finally {
            setBusy(false);
        }
    };
    return (_jsxs("form", { onSubmit: verify, children: [_jsx("h1", { className: "font-mono-display text-lg text-gold tracking-widest text-center mb-1", children: "TWO-FACTOR" }), _jsx("p", { className: "text-slate-500 text-xs text-center mb-5 font-mono-code", children: "Enter the 6-digit code from your authenticator" }), _jsx("input", { value: code, onChange: e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6)), inputMode: "numeric", autoComplete: "one-time-code", placeholder: "123456", autoFocus: true, className: codeInput }), error && _jsx("div", { className: errBox, children: error }), _jsx("button", { type: "submit", disabled: busy || code.length !== 6, className: btn, style: btnStyle, children: busy ? 'VERIFYING…' : 'VERIFY' }), _jsx("button", { type: "button", onClick: onEnrol, className: linkBtn, children: "First time? Set up your authenticator" })] }));
}
function EnrolWizard({ ticket, setTicket, onDone, onBack }) {
    const [secret, setSecret] = useState(null);
    const [qr, setQr] = useState(null);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const begin = async () => {
        setBusy(true);
        setError('');
        try {
            const res = await wmsMfa('/api/auth/mfa/enroll/begin', { mfa_ticket: ticket });
            if (!res.secret || !res.otpauthUri)
                throw new Error(res.error || 'Could not start enrolment');
            setSecret(res.secret);
            setQr(await QRCode.toDataURL(res.otpauthUri, { margin: 1, width: 200 }));
        }
        catch (err) {
            setError(err?.message || 'Could not start enrolment');
        }
        finally {
            setBusy(false);
        }
    };
    const confirm = async (e) => {
        e.preventDefault();
        if (!secret)
            return;
        setBusy(true);
        setError('');
        try {
            const res = await wmsMfa('/api/auth/mfa/enroll/confirm', { mfa_ticket: ticket, secret, code });
            if (res.mfa_ticket) {
                setTicket(res.mfa_ticket);
                throw new Error(res.error || 'Invalid code');
            }
            if (!res.access_token)
                throw new Error(res.error || 'Confirmation failed');
            await onDone(res);
        }
        catch (err) {
            setError(err?.message || 'Invalid code');
        }
        finally {
            setBusy(false);
        }
    };
    if (!secret) {
        return (_jsxs("div", { children: [_jsx("h1", { className: "font-mono-display text-lg text-gold tracking-widest text-center mb-1", children: "SET UP MFA" }), _jsx("p", { className: "text-slate-500 text-xs text-center mb-5 font-mono-code", children: "Your role requires an authenticator app" }), error && _jsx("div", { className: errBox, children: error }), _jsx("button", { type: "button", onClick: begin, disabled: busy, className: btn, style: btnStyle, children: busy ? 'PREPARING…' : 'BEGIN SETUP' }), _jsx("button", { type: "button", onClick: onBack, className: linkBtn, children: "\u2190 I already have a code" })] }));
    }
    return (_jsxs("form", { onSubmit: confirm, children: [_jsx("h1", { className: "font-mono-display text-lg text-gold tracking-widest text-center mb-1", children: "SCAN & VERIFY" }), qr && _jsx("img", { src: qr, alt: "Authenticator QR", className: "mx-auto mb-3 rounded" }), secret && _jsxs("p", { className: "text-[10px] text-slate-500 text-center break-all font-mono-code mb-3", children: ["Manual key: ", secret] }), _jsx("input", { value: code, onChange: e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6)), inputMode: "numeric", autoComplete: "one-time-code", placeholder: "123456", autoFocus: true, className: codeInput }), error && _jsx("div", { className: errBox, children: error }), _jsx("button", { type: "submit", disabled: busy || code.length !== 6, className: btn, style: btnStyle, children: busy ? 'CONFIRMING…' : 'CONFIRM' }), _jsx("button", { type: "button", onClick: onBack, className: linkBtn, children: "\u2190 Back" })] }));
}
