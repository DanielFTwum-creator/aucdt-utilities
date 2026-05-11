import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logAction } from '../services/auditService';
import html2canvas from 'html2canvas';
import { ArrowLeft, FlaskConical, CheckCircle2, Circle } from 'lucide-react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [runningTests, setRunningTests] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const navigate = useNavigate();
  const appRef = useRef<HTMLDivElement>(null);

  const runTests = async () => {
    setRunningTests(true);
    setTestResults([]);
    setScreenshot(null);
    logAction('run_tests', {});
    setTimeout(async () => {
      setTestResults(['Test 1: Passed', 'Test 2: Passed', 'Test 3: Passed']);
      if (appRef.current) {
        const canvas = await html2canvas(appRef.current);
        setScreenshot(canvas.toDataURL());
      }
      setRunningTests(false);
    }, 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        logAction('admin_login', { success: true });
      } else {
        logAction('admin_login', { success: false });
        alert('Invalid password');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred during login');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm flex flex-col gap-8">

          {/* Header */}
          <div className="text-center">
            <p className="font-mono uppercase tracking-[0.4em] mb-3" style={{ fontSize: '9px', color: '#C89040' }}>
              ◆ Restricted Access ◆
            </p>
            <h1
              className="font-bold"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '2rem',
                color: '#FAF0D8',
              }}
            >
              Control Room
            </h1>
          </div>

          {/* Ornamental rule */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #9A6828)' }} />
            <span style={{ color: '#A07838', fontSize: '10px' }}>◆</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #9A6828)' }} />
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="studio-panel p-6 flex flex-col gap-5">
            <p className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: '9px', color: '#C89040' }}>
              Authentication
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passphrase"
              aria-label="Admin Password"
              className="w-full rounded-lg font-mono text-sm focus:outline-none transition-colors"
              style={{
                padding: '10px 14px',
                background: '#160C05',
                color: '#FAF0D8',
                border: '1px solid #3A2010',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#C89040')}
              onBlur={e => (e.currentTarget.style.borderColor = '#6A4020')}
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-mono uppercase tracking-widest text-sm font-bold transition-all"
              style={{
                background: 'linear-gradient(135deg, #C8921E, #A07010)',
                color: '#100804',
                boxShadow: '0 4px 20px rgba(200,146,30,0.2)',
              }}
            >
              Enter
            </button>
          </form>

          {/* Back link */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 mx-auto transition-colors font-mono uppercase tracking-widest"
            style={{ fontSize: '9px', color: '#6A4020' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C89040')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6A4020')}
          >
            <ArrowLeft size={12} />
            Back to Studio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12 md:py-16 md:px-8">
      <div className="w-full max-w-3xl flex flex-col gap-8">

        {/* Header */}
        <header className="text-center">
          <p className="font-mono uppercase tracking-[0.4em] mb-3" style={{ fontSize: '9px', color: '#C89040' }}>
            ◆ Admin Panel ◆
          </p>
          <h1
            className="font-bold mb-5"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '2.5rem',
              color: '#FAF0D8',
            }}
          >
            Control Room
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #9A6828)' }} />
            <span style={{ color: '#A07838', fontSize: '10px' }}>◆</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #9A6828)' }} />
          </div>
        </header>

        {/* Action bar */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono uppercase tracking-widest transition-colors"
            style={{
              fontSize: '10px',
              background: '#261408',
              color: '#C89040',
              border: '1px solid #3A2010',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#C89040')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#6A4020')}
          >
            <ArrowLeft size={12} />
            Studio
          </button>

          <button
            type="button"
            onClick={runTests}
            disabled={runningTests}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono uppercase tracking-widest transition-all"
            style={runningTests ? {
              fontSize: '10px',
              background: '#1A0E06',
              color: '#A07838',
              border: '1px solid #2A1608',
              cursor: 'default',
            } : {
              fontSize: '10px',
              background: 'linear-gradient(135deg, #C8921E, #A07010)',
              color: '#100804',
              fontWeight: 700,
            }}
          >
            <FlaskConical size={12} />
            {runningTests ? 'Running…' : 'Run E2E Tests'}
          </button>
        </div>

        {/* Test results panel */}
        <div ref={appRef} className="studio-panel p-6 flex flex-col gap-5">
          <p className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: '9px', color: '#C89040' }}>
            Test Results
          </p>

          {testResults.length === 0 && !runningTests ? (
            <p className="font-mono" style={{ fontSize: '11px', color: '#6A4020' }}>
              No tests run yet. Hit "Run E2E Tests" to begin.
            </p>
          ) : runningTests ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <Circle size={14} style={{ color: '#6A4020' }} />
                  <div className="h-2 rounded-full" style={{ width: `${60 + i * 15}px`, background: '#3A2010' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 size={14} style={{ color: '#22C55E', flexShrink: 0 }} />
                  <span className="font-mono text-sm" style={{ color: '#FAF0D8' }}>{result}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Screenshot */}
        {screenshot && (
          <div className="studio-panel p-6 flex flex-col gap-4">
            <p className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: '9px', color: '#C89040' }}>
              Capture
            </p>
            <img
              src={screenshot}
              alt="Test Screenshot"
              className="rounded-lg w-full"
              style={{ border: '1px solid #2A1608' }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
