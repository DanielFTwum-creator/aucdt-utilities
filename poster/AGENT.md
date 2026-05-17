# poster - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for poster.

### FILE: .env.local
```text
VITE_GOOGLE_CLIENT_ID=[REDACTED_CREDENTIAL]
VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/poster/auth/google/callback

```

### FILE: CREATION.md
```md
﻿# CREATION.md â€” Poster (TUC Promotional Poster App)
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/poster/`
**Last verified:** 2026-04-25

---

## 1. What This App Is

A static React component that renders a **Techbridge University College promotional poster** â€” suitable for print (A4/Letter, 640Ã—850px canvas) and digital display. The poster shows the TUC name, "Formerly Asanska University College of Design and Technology", programmes offered, contact details, and branding. There is no user interaction beyond the admin panel.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** |
| Build | Vite | ^6 |
| Language | JavaScript (JSX) â€” **no TypeScript** | â€” |
| Styling | **Inline styles only** â€” no Tailwind | â€” |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine â†’ nginx:alpine | â€” |

> **Important:** This project uses plain JSX (`poster.jsx`, `src/main.jsx`) with **zero** Tailwind or CSS modules. All styling is inline `style={{}}` objects. Do not add a Tailwind dependency.

---

## 3. Directory Structure

```
poster/
â”œâ”€â”€ index.html
â”œâ”€â”€ poster.jsx            # The poster component (TechbridgeBanner)
â”œâ”€â”€ src/
â”‚   â””â”€â”€ main.jsx          # App wrapper with admin overlay + createRoot
â”œâ”€â”€ public/
â”‚   â””â”€â”€ fonts/            # Heavy/black weight font (font-heavy class)
â””â”€â”€ docs/
```

---

## 4. Poster Component (poster.jsx)

**Component name:** `TechbridgeBanner` (default export)

**Canvas:** Fixed `640Ã—850px`, white background, `position: relative`, `overflow: hidden`.

**Layout (top to bottom):**

```
[6px red bar â€” #D0111B]
[Red header band â€” #D0111B]
  TECHBRIDGE  (60px, tracking 16px, black weight)
  UNIVERSITY COLLEGE  (24px, tracking 8px)
[White space â€” 8px]
[Subtitle] "Formerly Asanska University College of Design and Technology"  (16px, #0A0A0A)
[White space â€” 20px]
[Blue pill â€” #1B55A0] "PROGRAMMES WE OFFER"  (18px, 300px wide, centered)
[Programme list â€” 4 items with bullet/icon]
  â€¢ BA / Dip. Jewellery Design
  â€¢ BA / Dip. Product Design
  â€¢ B.Tech. Fashion Design
  â€¢ B.Tech. Digital Media & Comm. Design
[Image section â€” campus or design imagery placeholder]
[Contact/tagline section]
[Footer â€” red bar]
```

**Colours:**
```
Primary red:   #D0111B
Navy blue:     #1B55A0
Near-black:    #0A0A0A
White:         #FFFFFF
```

---

## 5. Admin Panel (src/main.jsx)

The App wrapper in `src/main.jsx` wraps `<TechbridgeBanner />` and adds the admin overlay.

```javascript
// Admin constants
const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]
const ADMIN_SESSION_KEY = 'poster-admin';
const AUDIT_LOG_KEY = 'poster-audit';
```

**Access:** Bottom of page, small "Admin" text link â†’ `window.location.hash = '#/admin'`

Admin overlay uses inline styles (no Tailwind). Same two-tab pattern as other projects (Audit Log + Diagnostics), but all styled inline with the TUC red (`#D0111B`) as accent.

---

## 6. ARIA Requirements

- Admin modal: `role="dialog" aria-modal="true" aria-labelledby`
- Admin tabs: `role="tab" aria-selected`
- Footer admin link: `aria-label="Open admin dashboard"`
- Poster component itself is presentational â€” no interactive ARIA needed on the poster canvas

---

## 7. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build is error-free |
| AC-2 | Poster renders at 640Ã—850px with correct TUC branding |
| AC-3 | All 4 programme names appear in the poster |
| AC-4 | Footer admin link opens admin login modal |
| AC-5 | Password `admin123` grants access; wrong password shows error |
| AC-6 | No Tailwind or CSS file dependency â€” all styles are inline |

```

### FILE: deploy.ps1
```ps1
# Poster Deployment Script
# SCP-based deployment using bash

param(
    [string]$RemoteHost = "root@66.226.72.199",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/poster/",
    [switch]$Build = $false
)

Write-Host "=== POSTER DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath`n"

# Build if requested
if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Write-Host "Error: dist/ not found. Run with -Build flag." -ForegroundColor Red
    exit 1
}

Write-Host "Creating directory..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\poster' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /poster/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /poster/index.html [QSA,L]
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/poster`n"

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml* ./

RUN CI=true pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

```

### FILE: docs/admin_guide.md
```md
# Admin Guide — Poster

## Access
Navigate to `/#/admin` or click "Admin" in the footer.

**Password:** `admin123`

## Features
- Audit log of all admin login events.
- Diagnostics: simple system check.

## Logs
Stored in localStorage key `poster-audit`.

```

### FILE: docs/srs/srs_v1.0.md
```md
# IEEE SRS — Poster
**Version:** 1.0.0 (as-built)
**Institution:** Techbridge University College
**Status:** Active

## 1. Introduction
Poster is a static promotional poster application — renders a branded TUC event/announcement poster as a React component, suitable for print and digital display.

## 2. Functional Requirements
| ID | Requirement |
|---|---|
| FR-1 | Render branded TUC poster from React component |
| FR-2 | Admin panel accessible via `#/admin` (password: `admin123`) |
| FR-3 | Audit log in localStorage |

## 3. Architecture
- **Framework:** Vite + React (JSX, no TypeScript)
- **Styling:** Inline styles (no Tailwind dependency)
- **Admin:** Injected in `src/main.jsx` wrapper
- **Color:** TUC Red `#D0111B`

```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Techbridge University College — Poster" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Techbridge University College — Poster" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Techbridge University College — Poster</title>
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: #f0ede8;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: 100vh;
        padding: 2rem;
      }
      #root {
        width: 100%;
        max-width: 720px;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

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
  "name": "poster",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "19.2.5",
    "react-dom": "19.2.5"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.2.2",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.2.2",
    "vite": "^7.3.1"
  }
}

```

### FILE: poster.jsx
```javascript
export default function TechbridgeBanner() {
  const programmes = [
    "BA / Dip. Jewellery Design",
    "BA / Dip. Product Design",
    "B.Tech. Fashion Design",
    "B.Tech. Digital Media & Comm. Design",
  ];

  return (
    <div className="w-[640px] h-[850px] bg-white relative shadow-2xl border-x border-[#ddd] overflow-hidden font-heavy">
      <div className="h-[6px] bg-[#D0111B] w-full" />

      <div className="bg-[#D0111B] py-[20px] text-center text-white w-full">
        <h1 className="text-[56px] font-black tracking-[16px] leading-tight font-heavy">TECHBRIDGE</h1>
        <div className="text-[20px] font-bold tracking-[6px] mt-0.5 uppercase leading-tight font-heavy">UNIVERSITY COLLEGE</div>
      </div>

      <div className="text-center text-[13px] font-extrabold text-[#0A0A0A] mt-[6px] mb-[1px] px-3 font-heavy leading-tight">
        Formerly Asanska University College of Design and Technology
      </div>

      <div className="h-[12px] bg-white w-full" />

      <div className="bg-[#1B55A0] text-white w-[300px] mx-auto text-center py-1.5 rounded font-black text-[16px] tracking-[0.5px] uppercase whitespace-nowrap font-heavy">
        PROGRAMMES WE OFFER
      </div>

      <div className="px-[32px] pt-[16px] pb-[8px]">
        {programmes.map((item) => (
          <div key={item} className="flex items-center mb-[10px]">
            <div className="w-[12px] h-[12px] bg-[#D0111B] rounded-full mr-[16px] shrink-0" />
            <div className="font-extrabold text-[#0A0A0A] leading-[1.15] text-[26px] font-heavy">
              {item}
            </div>
          </div>
        ))}
      </div>

      <div className="h-[8px] w-full bg-gradient-to-r from-[#D0111B] via-[#1B55A0] to-[#D0111B] opacity-30" />

      <div className="px-[30px] py-[8px]">
        <div className="text-center text-[#0A0A0A] text-[12px] font-black tracking-[1px] uppercase">
          ✓ Flexible schedules · Industry-focused · Affordable fees
        </div>
      </div>

      <div className="text-center text-[#D0111B] text-[22px] font-black my-[8px] font-heavy">
        6-month &amp; 1-year certificates
      </div>

      <div className="bg-[#D0111B] text-white w-[560px] mx-auto text-center py-[10px] rounded font-black text-[22px] tracking-[1.5px] uppercase font-heavy">
        ADMISSIONS ARE ONGOING
      </div>

      <div className="flex justify-between px-[24px] gap-[12px] mt-[10px]">
        <div className="bg-[#1B55A0] text-white flex-1 rounded flex flex-col justify-center items-center py-[12px]">
          <div className="text-[28px] font-black tracking-[0.5px] leading-tight font-heavy">054 012 4488</div>
          <div className="text-[28px] font-black tracking-[0.5px] leading-tight font-heavy">054 012 4400</div>
          <div className="text-[8px] font-bold tracking-[1px] opacity-[0.8] mt-1">MON – FRI · 8:00 AM – 5:00 PM</div>
        </div>
        <div className="flex-1 border-[2px] border-[#D0111B] rounded bg-white flex flex-col justify-center items-center text-center px-2 py-[12px]">
          <div className="text-[#D0111B] text-[11px] font-extrabold tracking-[1.5px] mb-1 font-heavy">EMAIL</div>
          <div className="text-[#0A0A0A] text-[10px] font-black leading-tight font-heavy">info@techbridge.edu.gh</div>
        </div>
      </div>

      <div className="text-center text-[#1B55A0] text-[10px] font-extrabold tracking-[1.5px] mt-[8px] font-heavy">
        OYIBI · GREATER ACCRA · GHANA
      </div>

      <div className="flex-1" />

      <div className="bg-white px-[24px] py-[8px] text-center text-[11px] text-[#6b7280] font-semibold border-t border-[#e5e7eb]">
        Visit <span className="font-black text-[#D0111B]">techbridge.edu.gh</span> to apply online
      </div>

      <div className="h-[6px] bg-[#1B55A0] w-full absolute bottom-0" />
    </div>
  );
}

```

### FILE: src/index.css
```css
@import "tailwindcss";

@utility font-heavy {
  font-family: "Arial Black", Arial, Helvetica, sans-serif;
}

```

### FILE: src/main.jsx
```javascript
import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Poster from "../poster.jsx";

// ── Admin ─────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]
const AUTH_SESSION_KEY = 'tuc_auth_poster';
const USER_KEY = 'poster_user';
const AUDIT_LOG_KEY = 'poster-audit';
function getAuditLogs() { try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; } }
function appendAuditLog(action, details) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}

function AdminLoginModal({ onClose, onSuccess }) {
  const [pwd, setPwd] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

  const completeOAuthLogin = async (accessToken) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user info');
      const userInfo = await res.json();
      const userData = { id: userInfo.id, name: userInfo.name, email: userInfo.email };
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.removeItem('oauth_token_temp');
      sessionStorage.setItem(AUTH_SESSION_KEY, '1');
      appendAuditLog('OAUTH_LOGIN_SUCCESS', userInfo.email);
      onSuccess();
    } catch (err) {
      setError('Google login failed. Please try again or use password.');
      appendAuditLog('OAUTH_LOGIN_FAIL', err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'OAUTH_TOKEN_SUCCESS') {
        completeOAuthLogin(event.data.access_token);
      }
      if (event.data?.type === 'OAUTH_TOKEN_ERROR') {
        setError(event.data.error_description || event.data.error || 'Google login failed. Please try again.');
        setLoading(false);
        appendAuditLog('OAUTH_ERROR', event.data.error);
      }
    };
    window.addEventListener('message', handleMessage);
    const fallback = window.setInterval(() => {
      const token = [REDACTED_CREDENTIAL]
      if (token) { completeOAuthLogin(token); window.clearInterval(fallback); }
    }, 100);
    return () => { window.removeEventListener('message', handleMessage); window.clearInterval(fallback); };
  }, []);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) { setError('Google login not configured. Use password instead.'); return; }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId, redirect_uri: redirectUri, response_type: 'token',
      scope: 'openid email profile', prompt: 'select_account',
    });
    const authWindow = window.open(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, 'oauth_popup', 'width=600,height=700');
    if (!authWindow) setError('Popup blocked. Please allow popups for this site.');
    setLoading(true);
  };

  const handlePasswordSubmit = [REDACTED_CREDENTIAL]

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="admin-login-title" style={{position:'fixed',inset:0,zIndex:50,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
      <div style={{background:'#fff',borderRadius:'8px',padding:'2rem',width:'100%',maxWidth:'380px',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <h2 id="admin-login-title" style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'1.5rem',color:'#0A0A0A'}}>Admin Access</h2>
        <button onClick={handleGoogleLogin} disabled={loading} style={{width:'100%',padding:'0.7rem',background:'#fff',color:'#0A0A0A',border:'1px solid #d1d5db',borderRadius:'6px',fontSize:'0.875rem',fontWeight:600,cursor:'pointer',marginBottom:'1rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}>
          <svg style={{width:'18px',height:'18px'}} viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'1rem'}}><div style={{height:'1px',background:'#e5e7eb',flex:1}} /><span style={{fontSize:'0.8rem',color:'#9ca3af',fontWeight:600}}>or</span><div style={{height:'1px',background:'#e5e7eb',flex:1}} /></div>
        <form onSubmit={handlePasswordSubmit}>
          <label htmlFor="admin-pwd" style={{display:'block',fontSize:'0.8rem',fontWeight:600,marginBottom:'0.4rem',color:'#374151'}}>Password (Staff)</label>
          <input id="admin-pwd" type="password" value={pwd} onChange={e => { setPwd(e.target.value); setError(''); }} autoFocus required aria-describedby={error ? 'admin-err' : undefined} disabled={loading} style={{width:'100%',border:'1px solid #d1d5db',borderRadius:'6px',padding:'0.5rem 0.75rem',fontSize:'0.875rem',marginBottom:'0.5rem',boxSizing:'border-box'}} />
          {error && <p id="admin-err" role="alert" style={{color:'#ef4444',fontSize:'0.75rem',marginBottom:'0.5rem'}}>{error}</p>}
          <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem'}}>
            <button type="submit" disabled={loading} style={{flex:1,background:'#D0111B',color:'#fff',border:'none',borderRadius:'6px',padding:'0.6rem',fontSize:'0.875rem',fontWeight:600,cursor:'pointer',opacity:loading?0.7:1}}>Sign In</button>
            <button type="button" onClick={onClose} disabled={loading} style={{padding:'0.6rem 1rem',border:'1px solid #d1d5db',borderRadius:'6px',background:'#fff',fontSize:'0.875rem',cursor:'pointer'}}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ onClose }) {
  const [logs, setLogs] = useState([]); const [tab, setTab] = useState('logs'); const [storageTest, setStorageTest] = useState('idle'); const [user, setUser] = useState(null);
  useEffect(() => { setLogs(getAuditLogs()); const stored = localStorage.getItem(USER_KEY); if (stored) { try { setUser(JSON.parse(stored)); } catch {} } }, []);
  const handleLogout = () => { appendAuditLog('ADMIN_LOGOUT'); sessionStorage.removeItem(AUTH_SESSION_KEY); localStorage.removeItem(USER_KEY); localStorage.removeItem('oauth_token_temp'); onClose(); };
  const runStorageTest = () => { try { localStorage.setItem('__diag__','1'); localStorage.removeItem('__diag__'); setStorageTest('pass'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: PASS'); } catch { setStorageTest('fail'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: FAIL'); } };
  const s = {base:{position:'fixed',inset:0,zIndex:50,background:'#f9fafb',overflowY:'auto'},inner:{maxWidth:'900px',margin:'0 auto',padding:'2rem'},head:{display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #e5e7eb',paddingBottom:'1.5rem',marginBottom:'1.5rem'},h1:{fontSize:'1.1rem',fontWeight:700,color:'#0A0A0A'},logoutBtn:{padding:'0.5rem 1rem',background:'#fee2e2',color:'#b91c1c',border:'none',borderRadius:'6px',fontSize:'0.8rem',fontWeight:600,cursor:'pointer'},tabBtn:(active)=>({padding:'0.5rem 1rem',borderRadius:'6px',border:'none',fontSize:'0.85rem',fontWeight:500,cursor:'pointer',background:active?'#D0111B':'#e5e7eb',color:active?'#fff':'#374151'})};
  return (
    <div role="main" aria-label="Admin Dashboard" style={s.base}>
      <div style={s.inner}>
        <div style={s.head}>
          <div><h1 style={s.h1}>Admin Dashboard — Poster</h1>{user && <p style={{fontSize:'0.8rem',color:'#6b7280',marginTop:'0.5rem'}}>{user.name} ({user.email})</p>}</div>
          <button onClick={handleLogout} aria-label="Logout from admin" style={s.logoutBtn}>Logout</button>
        </div>
        <div role="tablist" aria-label="Admin sections" style={{display:'flex',gap:'0.5rem',marginBottom:'1.5rem'}}>
          {['logs','diagnostics'].map(t=><button key={t} role="tab" aria-selected={tab===t} onClick={()=>setTab(t)} style={s.tabBtn(tab===t)}>{t==='logs'?'Audit Log':'Diagnostics'}</button>)}
        </div>
        {tab==='logs' && <section aria-label="Audit log"><table style={{width:'100%',fontSize:'0.8rem',borderCollapse:'collapse'}} aria-label="Admin activity log"><thead><tr style={{background:'#f3f4f6'}}><th scope="col" style={{padding:'0.5rem 1rem',textAlign:'left',fontSize:'0.7rem',color:'#6b7280'}}>Timestamp</th><th scope="col" style={{padding:'0.5rem 1rem',textAlign:'left',fontSize:'0.7rem',color:'#6b7280'}}>Action</th><th scope="col" style={{padding:'0.5rem 1rem',textAlign:'left',fontSize:'0.7rem',color:'#6b7280'}}>Details</th></tr></thead><tbody>{logs.length===0?<tr><td colSpan={3} style={{padding:'2rem',textAlign:'center',color:'#9ca3af'}}>No entries yet.</td></tr>:logs.map(l=><tr key={l.id} style={{borderBottom:'1px solid #f3f4f6'}}><td style={{padding:'0.5rem 1rem',color:'#6b7280'}}>{new Date(l.timestamp).toLocaleString()}</td><td style={{padding:'0.5rem 1rem',color:'#D0111B',fontFamily:'monospace'}}>{l.action}</td><td style={{padding:'0.5rem 1rem',color:'#9ca3af'}}>{l.details||'—'}</td></tr>)}</tbody></table></section>}
        {tab==='diagnostics' && <section aria-label="System diagnostics"><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem',background:'#fff',border:'1px solid #e5e7eb',borderRadius:'6px'}}><div><p style={{fontWeight:600,fontSize:'0.875rem',marginBottom:'0.25rem'}}>LocalStorage Access</p><p style={{fontSize:'0.75rem',color:'#6b7280'}}>Verifies browser storage</p></div><div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>{storageTest!=='idle'&&<span role="status" style={{fontSize:'0.7rem',fontWeight:700,padding:'0.2rem 0.5rem',borderRadius:'4px',background:storageTest==='pass'?'#d1fae5':'#fee2e2',color:storageTest==='pass'?'#065f46':'#b91c1c'}}>{storageTest.toUpperCase()}</span>}<button onClick={runStorageTest} style={{padding:'0.4rem 0.75rem',background:'#fff',border:'1px solid #D0111B',color:'#D0111B',borderRadius:'4px',fontSize:'0.75rem',cursor:'pointer'}}>Run Test</button></div></div></section>}
      </div>
    </div>
  );
}

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  useEffect(() => {
    const check = () => { if (window.location.hash === '#/admin') { sessionStorage.getItem(AUTH_SESSION_KEY) === '1' ? setShowAdmin(true) : setShowAdminLogin(true); } };
    check(); window.addEventListener('hashchange', check); return () => window.removeEventListener('hashchange', check);
  }, []);
  const handleAdminClose = useCallback(() => { setShowAdmin(false); window.location.hash = ''; }, []);

  return (
    <>
    {showAdmin && <AdminDashboard onClose={handleAdminClose} />}
    {showAdminLogin && <AdminLoginModal onClose={() => { setShowAdminLogin(false); window.location.hash = ''; }} onSuccess={() => { setShowAdminLogin(false); setShowAdmin(true); }} />}
    <a href="#main-content" style={{position:'absolute',width:'1px',height:'1px',padding:0,margin:'-1px',overflow:'hidden',clip:'rect(0,0,0,0)',whiteSpace:'nowrap',border:0}} onFocus={e=>{e.currentTarget.style.cssText='position:fixed;top:1rem;left:1rem;z-index:100;padding:0.5rem 1rem;background:#D0111B;color:#fff;border-radius:6px;text-decoration:none;'}}>Skip to main content</a>
    <div id="main-content" style={{display:'flex',flexDirection:'column',alignItems:'center',minHeight:'100vh',background:'#f5f5f5',padding:'2rem'}}>
      <Poster />
      <footer style={{marginTop:'1rem',fontSize:'0.7rem',color:'#9ca3af',textAlign:'center'}}>
        <button type="button" onClick={() => { window.location.hash = '#/admin'; }} aria-label="Open admin dashboard" style={{background:'none',border:'none',color:'inherit',cursor:'pointer',fontSize:'inherit'}}>Admin</button>
      </footer>
    </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

### FILE: vite.config.js
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [tailwindcss(), react()],
});

```

