import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { auth, setAccessToken } from '@/services/api';
export function LoginScreen({ onAuthenticated }) {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (mode === 'register') {
                await auth.register(email, password, name || undefined);
                // Auto-login after register
            }
            const { data } = await auth.login(email, password);
            setAccessToken(data.accessToken);
            onAuthenticated(data.accessToken, data.quotaRemaining);
        }
        catch (err) {
            const msg = err
                ?.response?.data?.message;
            setError(msg ?? (mode === 'register' ? 'Registration failed' : 'Invalid email or password'));
        }
        finally {
            setLoading(false);
        }
    }, [mode, email, password, name, onAuthenticated]);
    return (_jsx("div", { className: "ls-login-shell", children: _jsxs("div", { className: "ls-login-card", children: [_jsxs("div", { className: "ls-login-logo", children: [_jsx("div", { className: "ls-logo-icon", children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 16 16", fill: "none", children: [_jsx("path", { d: "M3 8a5 5 0 0 1 10 0", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round" }), _jsx("path", { d: "M5.5 10.5a3 3 0 0 1 5 0", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round" }), _jsx("circle", { cx: "8", cy: "12.5", r: "1", fill: "white" })] }) }), _jsxs("div", { children: [_jsx("div", { className: "ls-logo-name", children: "LyriaStream" }), _jsx("div", { className: "ls-logo-sub", children: "Self-Hosted AI Music \u00B7 TUC" })] })] }), _jsx("h2", { className: "ls-login-title", children: mode === 'login' ? 'Sign in to continue' : 'Create an account' }), _jsxs("form", { onSubmit: (e) => void handleSubmit(e), className: "ls-login-form", children: [mode === 'register' && (_jsxs("div", { className: "ls-field", children: [_jsx("label", { className: "ls-section-label", htmlFor: "ls-name", children: "Display name" }), _jsx("input", { id: "ls-name", type: "text", className: "ls-input", value: name, onChange: e => setName(e.target.value), placeholder: "Your name", autoComplete: "name" })] })), _jsxs("div", { className: "ls-field", children: [_jsx("label", { className: "ls-section-label", htmlFor: "ls-email", children: "Email" }), _jsx("input", { id: "ls-email", type: "email", className: "ls-input", value: email, onChange: e => setEmail(e.target.value), placeholder: "you@example.com", required: true, autoComplete: "email" })] }), _jsxs("div", { className: "ls-field", children: [_jsx("label", { className: "ls-section-label", htmlFor: "ls-password", children: "Password" }), _jsx("input", { id: "ls-password", type: "password", className: "ls-input", value: password, onChange: e => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, autoComplete: mode === 'login' ? 'current-password' : 'new-password' })] }), error && _jsx("div", { className: "ls-error", children: error }), _jsx("button", { type: "submit", className: "ls-btn-primary ls-btn-full", disabled: loading || !email || !password, children: loading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "animate-spin", "aria-hidden": true, children: "\u27F3" }), " ", mode === 'login' ? 'Signing in…' : 'Creating account…'] })) : (mode === 'login' ? 'Sign in' : 'Create account') })] }), _jsxs("p", { className: "ls-login-switch", children: [mode === 'login' ? "Don't have an account? " : 'Already have an account? ', _jsx("button", { type: "button", className: "ls-link", onClick: () => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }, children: mode === 'login' ? 'Register' : 'Sign in' })] })] }) }));
}
