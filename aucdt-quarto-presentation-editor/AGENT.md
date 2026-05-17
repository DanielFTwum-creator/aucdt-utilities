# aucdt-quarto-presentation-editor - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for aucdt-quarto-presentation-editor.

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: App.tsx
```typescript
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { DEFAULT_CONTENT } from './constants';
import { parseQmd } from './services/parser';
import { generateHtmlForExport } from './services/export';
import type { PresentationData } from './types';
import { useHistory } from './hooks/useHistory';
import Logo from './components/Logo';

// ── Admin ─────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]
const ADMIN_SESSION_KEY = 'quarto-editor-admin';
const AUDIT_LOG_KEY = 'quarto-editor-audit';
interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }
function getAuditLogs(): AuditEntry[] { try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; } }
function appendAuditLog(action: string, details?: string) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}
const AdminLoginModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [pwd, setPwd] = useState(''); const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem(ADMIN_SESSION_KEY, 'true'); appendAuditLog('ADMIN_LOGIN_SUCCESS'); onSuccess(); } else { appendAuditLog('ADMIN_LOGIN_FAIL'); setError('Invalid password.'); setPwd(''); } };
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="admin-login-title" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-2xl">
        <h2 id="admin-login-title" className="text-lg font-bold mb-6 text-gray-900">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label htmlFor="admin-pwd" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="admin-pwd" type="password" value={pwd} onChange={e => { setPwd(e.target.value); setError(''); }} autoFocus required aria-describedby={error ? 'admin-err' : undefined} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538]" />
            {error && <p id="admin-err" role="alert" className="mt-1 text-xs text-red-500">{error}</p>}</div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-[#8B1538] text-white py-2 rounded-md text-sm font-semibold hover:bg-[#7a122f]">Authenticate</button>
            <button type="button" onClick={onClose} className="px-4 border border-gray-300 text-gray-600 py-2 rounded-md text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [logs, setLogs] = useState<AuditEntry[]>([]); const [tab, setTab] = useState<'logs'|'diagnostics'>('logs'); const [storageTest, setStorageTest] = useState<'idle'|'pass'|'fail'>('idle');
  useEffect(() => { setLogs(getAuditLogs()); }, []);
  const handleLogout = () => { appendAuditLog('ADMIN_LOGOUT'); sessionStorage.removeItem(ADMIN_SESSION_KEY); onClose(); };
  const runStorageTest = () => { try { localStorage.setItem('__diag__','1'); localStorage.removeItem('__diag__'); setStorageTest('pass'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: PASS'); } catch { setStorageTest('fail'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: FAIL'); } };
  return (
    <div role="main" aria-label="Admin Dashboard" className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard — Quarto Editor</h1>
          <button onClick={handleLogout} aria-label="Logout from admin" className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200">Logout</button>
        </div>
        <div role="tablist" aria-label="Admin sections" className="flex gap-2">
          {(['logs','diagnostics'] as const).map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium ${tab===t?'bg-[#8B1538] text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{t==='logs'?'Audit Log':'Diagnostics'}</button>)}
        </div>
        {tab==='logs' && <section aria-label="Audit log"><table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden" aria-label="Admin activity log"><thead className="bg-gray-100"><tr><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Timestamp</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Action</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Details</th></tr></thead><tbody className="divide-y divide-gray-100">{logs.length===0?<tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No entries yet.</td></tr>:logs.map(l=><tr key={l.id}><td className="px-4 py-2 text-gray-500 text-xs">{new Date(l.timestamp).toLocaleString()}</td><td className="px-4 py-2 text-[#8B1538] font-mono text-xs">{l.action}</td><td className="px-4 py-2 text-gray-400 text-xs">{l.details||'—'}</td></tr>)}</tbody></table></section>}
        {tab==='diagnostics' && <section aria-label="System diagnostics" className="space-y-4"><div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"><div><p className="text-sm font-medium text-gray-900">LocalStorage Access</p><p className="text-xs text-gray-500">Verifies browser storage</p></div><div className="flex items-center gap-3">{storageTest!=='idle'&&<span role="status" className={`text-xs font-bold px-2 py-1 rounded ${storageTest==='pass'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{storageTest.toUpperCase()}</span>}<button onClick={runStorageTest} className="px-3 py-1.5 bg-red-50 border border-red-200 text-[#8B1538] rounded text-xs font-medium hover:bg-red-100">Run Test</button></div></div><div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"><div><p className="text-sm font-medium text-gray-900">Saved Presentation</p><p className="text-xs text-gray-500">Checks localStorage for saved content</p></div><span role="status" className={`text-xs font-bold px-2 py-1 rounded ${localStorage.getItem('aucdt-presentation-content')?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{localStorage.getItem('aucdt-presentation-content')?'SAVED':'DEFAULT'}</span></div></section>}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  useEffect(() => {
    const check = () => { if (window.location.hash === '#/admin') { sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' ? setShowAdmin(true) : setShowAdminLogin(true); } };
    check(); window.addEventListener('hashchange', check); return () => window.removeEventListener('hashchange', check);
  }, []);
  const handleAdminClose = useCallback(() => { setShowAdmin(false); window.location.hash = ''; }, []);

  const getInitialContent = (): string => {
    try {
      const savedContent = localStorage.getItem('aucdt-presentation-content');
      return savedContent ?? DEFAULT_CONTENT;
    } catch (error) {
      console.warn('Could not read from localStorage:', error);
      return DEFAULT_CONTENT;
    }
  };

  const {
    state: content,
    set: setContent,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory<string>(getInitialContent());

  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    setIsSaved(false);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('aucdt-presentation-content', content);
        setIsSaved(true);
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [content]);

  const presentationData: PresentationData = useMemo(() => parseQmd(content), [content]);

  const getTimestamp = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  };

  const handleExport = () => {
    const html = generateHtmlForExport(presentationData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const safeTitle = presentationData.frontmatter.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'presentation';
    const timestamp = getTimestamp();
    a.download = `${safeTitle}_${timestamp}.html`;
    a.href = url;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  };

  const handleExportQmd = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const safeTitle = presentationData.frontmatter.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'presentation';
    const timestamp = getTimestamp();
    a.download = `${safeTitle}_${timestamp}.qmd`;
    a.href = url;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  };

  return (
    <>
    {showAdmin && <AdminDashboard onClose={handleAdminClose} />}
    {showAdminLogin && <AdminLoginModal onClose={() => { setShowAdminLogin(false); window.location.hash = ''; }} onSuccess={() => { setShowAdminLogin(false); setShowAdmin(true); }} />}
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#8B1538] focus:text-white focus:rounded-md">Skip to main content</a>
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-[#8B1538] text-white p-3 shadow-md z-10 flex justify-between items-center">
        <Logo />
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportQmd}
            className="bg-gray-200 text-[#8B1538] font-semibold py-2 px-4 rounded-md shadow-md hover:bg-gray-300 transition-colors"
            title="Download presentation source as a .qmd file"
          >
            Export to QMD
          </button>
          <button
            onClick={handleExport}
            className="bg-white text-[#8B1538] font-semibold py-2 px-4 rounded-md shadow-md hover:bg-gray-100 transition-colors"
            title="Download presentation as a self-contained HTML file"
          >
            Export to HTML
          </button>
        </div>
      </header>
      <main id="main-content" className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        <Editor
          value={content}
          onChange={setContent}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          isSaved={isSaved}
        />
        <Preview data={presentationData} />
      </main>
      <footer className="text-center py-2 text-xs text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={() => { window.location.hash = '#/admin'; }} aria-label="Open admin dashboard" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Admin</button>
      </footer>
    </div>
    </>
  );
};

export default App;
```

### FILE: components/Editor.tsx
```typescript
import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaved: boolean;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, onUndo, onRedo, canUndo, canRedo, isSaved }) => {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

    // Undo: Ctrl+Z (Win/Linux) or Cmd+Z (Mac)
    if (ctrlOrCmd && !e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (canUndo) {
        onUndo();
      }
      return;
    }
    
    // Redo:
    // Mac: Cmd+Shift+Z
    // Windows/Linux: Ctrl+Y or Ctrl+Shift+Z
    if (isMac && ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'z') { // Mac Redo
        e.preventDefault();
        if (canRedo) {
            onRedo();
        }
    } else if (!isMac && ctrlOrCmd && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { // Windows/Linux Redo
        e.preventDefault();
        if (canRedo) {
            onRedo();
        }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-200 dark:bg-gray-700 p-2 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Content Editor (.qmd)</h2>
        <div className="flex items-center space-x-2">
           <span className={`text-sm italic mr-3 transition-opacity duration-300 ${isSaved ? 'text-gray-500' : 'text-gray-800 dark:text-gray-300'}`}>
            {isSaved ? 'Saved' : 'Saving...'}
          </span>
           <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            aria-label="Undo change (Ctrl+Z)"
            title="Undo (Ctrl+Z)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4" />
            </svg>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            aria-label="Redo change (Ctrl+Y)"
            title="Redo (Ctrl+Y)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-4-4m4 4l-4 4" />
            </svg>
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow w-full h-full p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none focus:outline-none font-mono text-sm leading-6"
        spellCheck="false"
        aria-label="Presentation Content Editor"
      />
    </div>
  );
};

export default Editor;
```

### FILE: components/Logo.tsx
```typescript
import React from 'react';

const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAJEAQMAAADoM3zDAAAABlBMVEUAAAD///+l2Z/dAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cMGRscBigsUTgAAALGSURBVHja7cExAQAAAMKg9U9tDB8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgB6ongAFFY0N/AAAAAElFTkSuQmCC';

const Logo: React.FC = () => {
  return (
    <img
      src={LOGO_BASE64}
      alt="Asanska University College of Design & Technology Logo"
      className="h-14 w-auto"
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );
};

export default Logo;
```

### FILE: components/Preview.tsx
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import type { PresentationData } from '../types';
import Slide from './Slide';

interface PreviewProps {
  data: PresentationData;
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  const { frontmatter, slides } = data;
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length + 1; // +1 for the title slide

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    // Attach to the parent document to capture keys globally when preview is focused
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide]);
  
  // Reset to first slide if content changes and current slide is out of bounds
  useEffect(() => {
    if (currentSlide >= totalSlides) {
        setCurrentSlide(totalSlides - 1);
    }
  }, [totalSlides, currentSlide]);


  return (
    <div className="flex flex-col h-full bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden qa-preview-wrapper">
       <div className="app-wrapper">
        <div className="header">
            <span className="header-title" title={frontmatter.title?.replace(/<br>/g, ' ')}>
              {frontmatter.title?.replace(/<br>/g, ' ') || 'Presentation'} • AUCDT
            </span>
            <div className="header-info">
                <span className="header-counter">
                  <span>{currentSlide + 1}</span> / <span>{totalSlides}</span>
                </span>
                <span className="header-nav">← → or Space</span>
            </div>
        </div>

        <div className="slides-container">
            <Slide
              isTitleSlide={true}
              isActive={currentSlide === 0}
              content={frontmatter}
            />
            {slides.map((slide, index) => (
              <Slide
                key={slide.id}
                isTitleSlide={false}
                isActive={currentSlide === index + 1}
                content={slide.content}
              />
            ))}
        </div>

        <div className="footer">
            AUCDT - Excellence in Design & Technology
        </div>
    </div>
    </div>
  );
};

export default Preview;

```

### FILE: components/Slide.tsx
```typescript
import React from 'react';
import { markdownToHtml } from '../services/parser';
import type { Frontmatter } from '../types';

interface SlideProps {
  content: string | Frontmatter;
  isActive: boolean;
  isTitleSlide: boolean;
}

const Slide: React.FC<SlideProps> = ({ content, isActive, isTitleSlide }) => {
  const classNames = `slide ${isTitleSlide ? 'title-slide' : ''} ${isActive ? 'active' : ''}`;
  
  let slideInnerHtml: string;

  if (isTitleSlide) {
    const fm = content as Frontmatter;
    slideInnerHtml = `
      <div>
        ${fm.title ? `<h1>${fm.title}</h1>` : ''}
        ${fm.subtitle ? `<h2 class="subtitle">${fm.subtitle}</h2>` : ''}
        ${fm.author ? `<p class="author">${fm.author}</p>` : ''}
      </div>
    `;
  } else {
    slideInnerHtml = markdownToHtml(content as string);
  }

  const wrapperProps = {
    className: classNames,
  };

  const contentWrapper = isTitleSlide 
    ? <div dangerouslySetInnerHTML={{ __html: slideInnerHtml }} />
    : <div className="slide-content" dangerouslySetInnerHTML={{ __html: slideInnerHtml }} />;

  return React.createElement('div', wrapperProps, contentWrapper);
};

export default Slide;

```

### FILE: constants.ts
```typescript
export const DEFAULT_CONTENT = `---
title: "14-Day Sprint<br>Daily Standup"
subtitle: "10:10 AM Meeting Guide"
author: "Asanska University College of Design & Technology"
---

## Sprint Overview

<div class="columns">
  <div class="column">
    <p><strong>Duration:</strong> 14 Days</p>
    <p style="margin-top: 0.8rem;"><strong>Daily Meeting:</strong> 10:10 AM</p>
    <p style="margin-top: 0.8rem;"><strong>Target Length:</strong> 15-20 minutes</p>
  </div>
  <div class="column">
    <p><strong>Goal:</strong> Stay aligned, unblock issues, maintain momentum</p>
    <p style="margin-top: 0.8rem;"><strong>Format:</strong> Quick, focused, action-oriented</p>
  </div>
</div>

## Meeting Structure

<div class="highlight-box">
  <p><strong style="display: block; margin-bottom: 1rem;">Each team member shares 3 things:</strong></p>
  <ul>
    <li>✅ What I completed yesterday</li>
    <li>🎯 What I'm working on today</li>
    <li>🚧 Any blockers or dependencies</li>
  </ul>
</div>

<div class="burgundy-box">
  <strong>Golden Rule:</strong> Quick decisions only—park complex discussions for later.
</div>

## Critical Success Factors

<div class="columns">
    <div class="column">
        <h3>🔄 Consistency</h3>
        <ul>
            <li>Same time, same place</li>
            <li>Non-negotiable</li>
            <li>No exceptions</li>
        </ul>
    </div>
    <div class="column">
        <h3>📊 Accountability</h3>
        <ul>
            <li>Can't attend? Send updates</li>
            <li>Assign backup facilitators</li>
            <li>Keep everyone engaged</li>
        </ul>
    </div>
</div>

## Common Pitfalls to Avoid

<div class="burgundy-box">
    <p><strong>Watch Out For:</strong></p>
    <ul>
        <li>❌ Solving problems in the standup</li>
        <li>❌ Letting it run over 20 minutes</li>
        <li>❌ Skipping when "nothing changed"</li>
        <li>❌ Not following up on blockers</li>
    </ul>
</div>

## Day 14: Sprint Complete! 🎉

<div class="key-point" style="text-align: center;">
  <strong>Celebrate the wins</strong>
</div>

<div class="highlight-box">
  <p><strong>Hold a retrospective:</strong></p>
  <ul>
    <li>What went well?</li>
    <li>What could improve?</li>
    <li>What will we do differently next time?</li>
  </ul>
</div>
`;

```

### FILE: CREATION.md
```md
# aucdt-quarto-presentation-editor

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — TUC -quarto-presentation-editor

**Application:** aucdt-quarto-presentation-editor
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_aucdt-quarto-presentation-editor_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — TUC -quarto-presentation-editor

**Application:** aucdt-quarto-presentation-editor
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd aucdt-quarto-presentation-editor
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build aucdt-quarto-presentation-editor
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up aucdt-quarto-presentation-editor
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Aucdt Quarto Presentation Editor
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Aucdt Quarto Presentation Editor**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Aucdt Quarto Presentation Editor** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Aucdt Quarto Presentation Editor** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âŒ Non-compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — TUC -quarto-presentation-editor

**Application:** aucdt-quarto-presentation-editor
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd aucdt-quarto-presentation-editor
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: hooks/useHistory.ts
```typescript
import React, { useState, useCallback } from 'react';

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export const useHistory = <T>(initialPresent: T) => {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialPresent,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const set = useCallback((newPresent: T) => {
    setState(currentState => {
      const { past, present } = currentState;
      if (newPresent === present) {
        return currentState;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    if (!canUndo) {
      return;
    }
    setState(currentState => {
      const { past, present, future } = currentState;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) {
      return;
    }
    setState(currentState => {
      const { past, present, future } = currentState;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  return { state: state.present, set, undo, redo, canUndo, canRedo };
};
```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- ========== BASIC SEO META TAGS ========== -->
    <title>Techbridge University College | Pioneering Design & Technology</title>
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    
    <!-- 🆕 SEO ADDITION: Keywords -->
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    
    <!-- 🆕 SEO ADDITION: Author and Publisher -->
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    
    <!-- 🆕 SEO ADDITION: Canonical URL -->
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    
    <!-- 🆕 SEO ADDITION: Robots Meta Tag -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    
    <!-- 🆕 SEO ADDITION: Language and Geographic Targeting -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    
    <!-- ========== OPEN GRAPH META TAGS (Facebook, LinkedIn, etc.) ========== -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    
    <!-- ========== TWITTER CARD META TAGS ========== -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    
    <!-- ========== ADDITIONAL SEO META TAGS ========== -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="rating" content="general" />
    <meta name="referrer" content="origin-when-cross-origin" />
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FKXTELQ71R"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FKXTELQ71R');
    </script>
        
    <!-- Favicon / Tab Logo -->
    <link rel="icon" type="image/png" href="https://aucdt.edu.gh/tuc/TUC_LOGO.png" />
    <link rel="apple-touch-icon" href="https://aucdt.edu.gh/tuc/TUC_LOGO.png" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script type="importmap">
    {
      "imports": {
        "react/": "https://aistudiocdn.com/react@^19.2.0/",
        "react": "https://aistudiocdn.com/react@^19.2.0",
        "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/"
      }
    }
    </script>
    <link rel="stylesheet" href="/index.css">
    <style>
      body {
        font-family: 'Poppins', sans-serif;
      }

      /* QA Preference Styles -- Scoped to .qa-preview-wrapper */
      .qa-preview-wrapper {
        --burgundy-primary: #8B1538;
        --burgundy-dark: #6B1028;
        --gold-accent: #D4AF37;
        --gold-light: #F4E4BC;
        --cream-bg: #F8F6F0;
        --warm-beige: #E6D5C7;
        --campus-green: #2E4034;
        --primary-text: #2C1810;
        --light-text: #FFFFFF;
        font-family: 'Poppins', sans-serif;
        color: var(--primary-text);
        line-height: 1.6;
      }

      .qa-preview-wrapper .app-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background: var(--cream-bg);
          border-radius: 0.5rem;
          overflow: hidden;
      }

      .qa-preview-wrapper .header {
          background: linear-gradient(135deg, var(--burgundy-dark) 0%, var(--burgundy-primary) 100%);
          color: var(--light-text);
          padding: 0.75rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid var(--gold-accent);
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          z-index: 10;
      }

      .qa-preview-wrapper .header-title {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }

      .qa-preview-wrapper .header-info {
          display: flex;
          gap: 1.5rem;
          align-items: center;
      }

      .qa-preview-wrapper .header-counter {
          font-size: 0.9rem;
          font-weight: 600;
          background: var(--gold-accent);
          color: var(--burgundy-primary);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          min-width: 70px;
          text-align: center;
      }

      .qa-preview-wrapper .header-nav {
          font-size: 0.8rem;
          opacity: 0.85;
      }

      .qa-preview-wrapper .slides-container {
          flex: 1;
          position: relative;
          overflow: hidden;
      }

      .qa-preview-wrapper .slide {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 1.5rem 2.5rem 2.5rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease-in-out;
          background: var(--cream-bg);
          overflow-y: auto;
      }

      .qa-preview-wrapper .slide.active {
          opacity: 1;
          pointer-events: auto;
      }

      .qa-preview-wrapper .footer {
          background: var(--burgundy-dark);
          color: var(--light-text);
          padding: 0.75rem 1.5rem;
          font-weight: 500;
          border-top: 3px solid var(--gold-accent);
          flex-shrink: 0;
          text-align: center;
          font-size: 0.8rem;
          z-index: 10;
      }
      
      .qa-preview-wrapper .slide-content {
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
      }

      .qa-preview-wrapper h1, .qa-preview-wrapper h2, .qa-preview-wrapper h3, .qa-preview-wrapper h4 {
        margin: 1.5rem 0 1rem 0;
      }

      .qa-preview-wrapper .slide-content > h2:first-child,
      .qa-preview-wrapper .slide-content > h3:first-child,
      .qa-preview-wrapper .slide-content > h4:first-child {
        margin-top: 0;
      }

      .qa-preview-wrapper h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--light-text);
          background: linear-gradient(135deg, var(--burgundy-dark) 0%, var(--burgundy-primary) 100%);
          padding: 1rem 1.5rem;
          margin: -1.5rem -2.5rem 1.5rem -2.5rem;
          border-bottom: 4px solid var(--gold-accent);
          box-shadow: 0 4px 12px rgba(139, 21, 56, 0.3);
      }

      .qa-preview-wrapper h3 {
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--burgundy-dark);
          border-left: 5px solid var(--gold-accent);
          padding-left: 1rem;
      }

      .qa-preview-wrapper h4 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--burgundy-primary);
          border-bottom: 3px solid var(--gold-accent);
          padding-bottom: 0.5rem;
          display: inline-block;
      }

      .qa-preview-wrapper .title-slide {
          text-align: center;
          background: linear-gradient(135deg, var(--burgundy-dark) 0%, var(--burgundy-primary) 100%);
          color: var(--light-text);
          justify-content: center;
          align-items: center;
      }

      .qa-preview-wrapper .title-slide h1 {
          font-size: 3rem;
          font-weight: 700;
          margin: 0;
          padding: 0;
          background: none;
          border: none;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          letter-spacing: -1px;
      }

      .qa-preview-wrapper .title-slide .subtitle {
          font-size: 1.5rem;
          font-weight: 600;
          background: var(--gold-light);
          color: var(--burgundy-primary);
          padding: 1rem 2rem;
          display: inline-block;
          border-left: 6px solid var(--gold-accent);
          margin: 2rem 0;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }

      .qa-preview-wrapper .title-slide .author {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--gold-light);
          margin-top: 2rem;
          letter-spacing: 0.5px;
      }

      .qa-preview-wrapper .highlight-box {
          background: var(--light-text);
          border-left: 6px solid var(--gold-accent);
          border-top: 2px solid var(--gold-light);
          padding: 1.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 12px rgba(139, 21, 56, 0.15);
          border-radius: 4px;
      }

      .qa-preview-wrapper .burgundy-box {
          background: var(--burgundy-primary);
          color: var(--light-text);
          padding: 1.5rem;
          border-radius: 4px;
          border-top: 6px solid var(--gold-accent);
          margin: 1.5rem 0;
          box-shadow: 0 4px 12px rgba(139, 21, 56, 0.4);
      }
      .qa-preview-wrapper .burgundy-box strong {
          color: var(--gold-accent);
      }

      .qa-preview-wrapper .key-point {
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--warm-beige) 100%);
          padding: 1.5rem;
          border-radius: 4px;
          border: 3px solid var(--gold-accent);
          margin: 1.5rem 0;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
      }

      .qa-preview-wrapper .columns {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin: 1.5rem 0;
      }

      .qa-preview-wrapper .column {
          background: var(--light-text);
          padding: 1.5rem;
          border-radius: 4px;
          border-left: 4px solid var(--gold-accent);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .qa-preview-wrapper ul {
          list-style: none;
          padding-left: 0;
          margin: 1rem 0;
      }

      .qa-preview-wrapper ul li {
          padding: 0.6rem 0;
          padding-left: 2rem;
          position: relative;
          line-height: 1.5;
      }

      .qa-preview-wrapper ul li::before {
          content: "▸";
          color: var(--gold-accent);
          font-weight: bold;
          position: absolute;
          left: 0;
          font-size: 1.2em;
      }

      .qa-preview-wrapper strong {
          color: var(--burgundy-primary);
          font-weight: 600;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### FILE: metadata.json
```json
{
  "name": "AUCDT Quarto Presentation Editor",
  "description": "A web-based editor for creating branded AUCDT presentations using a Quarto-like workflow. It provides a live preview of Markdown content styled with the official AUCDT theme.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "name": "aucdt-quarto-presentation-editor",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "react": "19.2.5",
    "react-dom": "19.2.5"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1x0PD_1ECz4qrEQJg3hhighgxY8m_i6_A

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: services/export.ts
```typescript
import type { PresentationData } from '../types';
import { markdownToHtml } from './parser';

export const generateHtmlForExport = (data: PresentationData): string => {
  const { frontmatter, slides } = data;
  const title = frontmatter.title?.replace(/<br>/g, ' ') || 'AUCDT Presentation';

  const titleSlideHtml = `
    <div class="slide active title-slide">
      <div>
        ${frontmatter.title ? `<h1>${frontmatter.title}</h1>` : ''}
        ${frontmatter.subtitle ? `<h2 class="subtitle">${frontmatter.subtitle}</h2>` : ''}
        ${frontmatter.author ? `<p class="author">${frontmatter.author}</p>` : ''}
      </div>
    </div>
  `;

  const contentSlidesHtml = slides.map((slide) => {
    const slideContent = markdownToHtml(slide.content);
    return `
      <div class="slide">
        <div class="slide-content">${slideContent}</div>
      </div>
    `;
  }).join('\\n');

  return `
<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --burgundy-primary: #8B1538;
            --burgundy-dark: #6B1028;
            --gold-accent: #D4AF37;
            --gold-light: #F4E4BC;
            --cream-bg: #F8F6F0;
            --warm-beige: #E6D5C7;
            --campus-green: #2E4034;
            --primary-text: #2C1810;
            --light-text: #FFFFFF;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
            width: 100%;
            height: 100%;
            font-family: 'Poppins', sans-serif;
            background: var(--cream-bg);
            color: var(--primary-text);
            line-height: 1.6;
            overflow: hidden;
        }

        .app-wrapper {
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100%;
        }

        .header {
            background: linear-gradient(135deg, var(--burgundy-dark) 0%, var(--burgundy-primary) 100%);
            color: var(--light-text);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 4px solid var(--gold-accent);
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 100;
        }

        .header-title {
            font-size: 1.1rem;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .header-info { display: flex; gap: 2rem; align-items: center; }

        .header-counter {
            font-size: 1rem;
            font-weight: 600;
            background: var(--gold-accent);
            color: var(--burgundy-primary);
            padding: 0.4rem 1rem;
            border-radius: 20px;
            min-width: 80px;
            text-align: center;
        }

        .header-nav { font-size: 0.9rem; opacity: 0.85; }
        .slides-container { flex: 1; position: relative; overflow: hidden; }

        .slide {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            padding: 2rem 3rem 3rem 3rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease-in-out;
            background: var(--cream-bg);
            overflow-y: auto;
        }

        .slide.active { opacity: 1; pointer-events: auto; }

        .footer {
            background: var(--burgundy-dark);
            color: var(--light-text);
            padding: 1rem 2rem;
            font-weight: 500;
            border-top: 4px solid var(--gold-accent);
            flex-shrink: 0;
            text-align: center;
            font-size: 0.9rem;
            z-index: 100;
        }

        .slide-content { max-width: 900px; margin: 0 auto; width: 100%; }
        
        h1, h2, h3, h4 { margin: 1.5rem 0 1rem 0; }
        .slide-content > h2:first-child, .slide-content > h3:first-child, .slide-content > h4:first-child { margin-top: 0; }
        
        h2 {
            font-size: 2.2rem;
            font-weight: 700;
            color: var(--light-text);
            background: linear-gradient(135deg, var(--burgundy-dark) 0%, var(--burgundy-primary) 100%);
            padding: 1rem 1.5rem;
            margin: -2rem -3rem 1.5rem -3rem;
            border-bottom: 4px solid var(--gold-accent);
            box-shadow: 0 4px 12px rgba(139, 21, 56, 0.3);
        }

        h3 {
            font-size: 1.6rem;
            font-weight: 600;
            color: var(--burgundy-dark);
            border-left: 6px solid var(--gold-accent);
            padding-left: 1rem;
        }

        h4 {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--burgundy-primary);
            border-bottom: 3px solid var(--gold-accent);
            padding-bottom: 0.5rem;
            display: inline-block;
        }

        .title-slide {
            text-align: center;
            background: linear-gradient(135deg, var(--burgundy-dark) 0%, var(--burgundy-primary) 100%);
            color: var(--light-text);
            justify-content: center;
            align-items: center;
        }

        .title-slide h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin: 0; padding: 0; background: none; border: none;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            letter-spacing: -1px;
        }

        .title-slide .subtitle {
            font-size: 1.8rem;
            font-weight: 600;
            background: var(--gold-light);
            color: var(--burgundy-primary);
            padding: 1.2rem 2.5rem;
            display: inline-block;
            border-left: 6px solid var(--gold-accent);
            margin: 2rem 0;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .title-slide .author {
            font-size: 1.3rem;
            font-weight: 500;
            color: var(--gold-light);
            margin-top: 2rem;
            letter-spacing: 0.5px;
        }

        .highlight-box {
            background: var(--light-text);
            border-left: 6px solid var(--gold-accent);
            border-top: 2px solid var(--gold-light);
            padding: 1.5rem; margin: 1.5rem 0;
            box-shadow: 0 4px 12px rgba(139, 21, 56, 0.15);
            border-radius: 4px;
        }

        .burgundy-box {
            background: var(--burgundy-primary);
            color: var(--light-text);
            padding: 1.5rem; border-radius: 4px;
            border-top: 6px solid var(--gold-accent);
            margin: 1.5rem 0;
            box-shadow: 0 4px 12px rgba(139, 21, 56, 0.4);
        }
        .burgundy-box strong { color: var(--gold-accent); }
        
        .key-point {
            background: linear-gradient(135deg, var(--gold-light) 0%, var(--warm-beige) 100%);
            padding: 1.5rem; border-radius: 4px;
            border: 3px solid var(--gold-accent);
            margin: 1.5rem 0; font-weight: 500;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .columns {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem; margin: 1.5rem 0;
        }

        .column {
            background: var(--light-text);
            padding: 1.5rem; border-radius: 4px;
            border-left: 4px solid var(--gold-accent);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        ul { list-style: none; padding-left: 0; margin: 1rem 0; }
        ul li { padding: 0.6rem 0 0.6rem 2rem; position: relative; line-height: 1.5; }
        ul li:before {
            content: "▸";
            color: var(--gold-accent);
            font-weight: bold;
            position: absolute; left: 0; font-size: 1.2em;
        }
        strong { color: var(--burgundy-primary); font-weight: 600; }
    </style>
</head>
<body>
    <div class="app-wrapper">
        <div class="header">
            <span class="header-title">${title} • AUCDT</span>
            <div class="header-info">
                <span class="header-counter"><span id="current">1</span> / <span id="total">${slides.length + 1}</span></span>
                <span class="header-nav">← → or Space</span>
            </div>
        </div>
        <div class="slides-container">
            ${titleSlideHtml}
            ${contentSlidesHtml}
        </div>
        <div class="footer">
            AUCDT - Excellence in Design & Technology
        </div>
    </div>
    <script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        const counter = document.getElementById('current');

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[n].classList.add('active');
            counter.textContent = n + 1;
        }

        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                showSlide(currentSlide);
            }
        }

        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                showSlide(currentSlide);
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault(); nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault(); prevSlide();
            }
        });
        showSlide(0);
    </script>
</body>
</html>
  `;
};

```

### FILE: services/parser.ts
```typescript
import type { Frontmatter, Slide, PresentationData } from '../types';

const parseFrontmatter = (text: string): Frontmatter => {
  const frontmatter: Frontmatter = {};
  const lines = text.split('\n');
  lines.forEach(line => {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (key === 'title' || key === 'subtitle' || key === 'author') {
        // Keep potential HTML like <br> in title
        frontmatter[key as keyof Frontmatter] = value.replace(/^['"]|['"]$/g, '').trim();
      }
    }
  });
  return frontmatter;
};

export const parseQmd = (content: string): PresentationData => {
  let frontmatter: Frontmatter = {};
  let markdownContent = content;

  const yamlMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n/);
  if (yamlMatch) {
    frontmatter = parseFrontmatter(yamlMatch[1]);
    markdownContent = content.substring(yamlMatch[0].length);
  }

  // Split slides by '## ' but handle the case where the first slide has no title
  const slideSplits = markdownContent.trim().split(/(?:\r?\n)## /);

  const slides: Slide[] = slideSplits
    .map((slideContent, index) => {
      if (index === 0 && !markdownContent.trim().startsWith('## ')) {
        // This is the content before the first H2, if it exists
        if (slideContent.trim() === '') return null;
        return {
          id: `slide-0`,
          content: slideContent.trim(),
        };
      }
      
      if (slideContent.trim() === '') return null;
      
      // Re-add the '## ' that was removed by split()
      const finalContent = `## ${slideContent}`;

      return {
        id: `slide-${index}`,
        content: finalContent.trim(),
      };
    })
    .filter((s): s is Slide => s !== null && s.content !== '');
    
  // A presentation with only frontmatter and no slides is valid
  // But if there's content, ensure the first slide is captured
  if (slides.length === 0 && markdownContent.trim() !== '') {
    slides.push({ id: 'slide-0', content: markdownContent.trim() });
  }

  return { frontmatter, slides };
};

// Shared markdown-to-HTML parser
const parseInline = (text: string): string => {
  return text
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" style="margin: 1rem auto; border-radius: 0.25rem; max-width: 100%; height: auto; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);" />')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
};

export const markdownToHtml = (markdown: string): string => {
  // Regex to split by double newlines, but not inside HTML tags
  const blocks = markdown.trim().split(/(\n\s*\n)/)
    .reduce((acc, part) => {
        if (part.trim() === '') {
            if (acc.length > 0 && !acc[acc.length - 1].isHtml) {
                acc[acc.length - 1].content += '\n\n';
            }
        } else if (part.startsWith('<div')) {
            acc.push({ content: part, isHtml: true });
        } else if (acc.length > 0 && acc[acc.length - 1].isHtml) {
            acc.push({ content: part, isHtml: false });
        } else if (acc.length > 0) {
            acc[acc.length - 1].content += part;
        } else {
            acc.push({ content: part, isHtml: false });
        }
        return acc;
    }, [] as { content: string, isHtml: boolean }[]);

  return blocks.map(({ content, isHtml }) => {
    if (isHtml) return content; // Passthrough for HTML blocks

    const block = content.trim();
    if (block.startsWith('## ')) return `<h2>${parseInline(block.substring(3))}</h2>`;
    if (block.startsWith('### ')) return `<h3>${parseInline(block.substring(4))}</h3>`;
    if (block.startsWith('#### ')) return `<h4>${parseInline(block.substring(5))}</h4>`;
    if (block.match(/^(\s*-\s)/)) { // List block
      const items = block.split('\n').map(item => {
        const content = item.replace(/^\s*-\s/, '');
        return `<li>${parseInline(content)}</li>`;
      }).join('');
      return `<ul>${items}</ul>`;
    }
    return `<p>${parseInline(block.replace(/\n/g, '<br/>'))}</p>`; // Paragraph
  }).join('');
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — aucdt-quarto-presentation-editor
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('aucdt-quarto-presentation-editor E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript
export interface Frontmatter {
  title?: string;
  subtitle?: string;
  author?: string;
}

export interface Slide {
  id: string;
  content: string;
}

export interface PresentationData {
  frontmatter: Frontmatter;
  slides: Slide[];
}
```

### FILE: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
  ,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }
  };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — aucdt-quarto-presentation-editor
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — aucdt-quarto-presentation-editor
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

