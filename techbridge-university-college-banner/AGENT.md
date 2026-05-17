# techbridge-university-college-banner - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-university-college-banner.

### FILE: .env.example
```text
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"

```

### FILE: .gitignore
```text
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example

```

### FILE: CREATION.md
```md
# techbridge-university-college-banner

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

### FILE: docs/SRS.md
```md
﻿# IEEE Software Requirements Specification (SRS)
## Techbridge University College Banner Utility
**Version:** 3.0.0
**Status:** Foundation Phase
**Institution:** Techbridge University College (TUC)
**Date:** 2026-04-21
**Standard:** IEEE 29148-2018

---

### 1. Introduction
#### 1.1 Purpose
This document specifies the requirements for the Techbridge University College Banner Utility, a specialized component designed for institutional branding and programme broadcasting.

#### 1.2 Scope
The Banner Utility is a static React-based component used for high-visibility display of TUC's academic offerings. It conforms to the TUC Shared Branding Standards.

---

### 2. Overall Description
#### 2.1 Product Perspective
The banner is a standalone utility within the `aucdt-utilities` monorepo.

#### 2.2 Design Constraints
- **React version:** 19.2.5
- **Branding:** TUC Gold (`#C8A84B`), Ink (`#0F0C07`), Cream (`#F2EBD9`)
- **Typography:** Bebas Neue / Inter

---

### 3. Functional Requirements
- **FR-01**: Display primary institutional branding.
- **FR-02**: List core academic programmes.
- **FR-03**: Provide contact and admission details.
- **FR-04**: Support an `# /admin` route for content diagnostics.

---

### 4. Non-Functional Requirements
- **Performance**: Instant render via Vite.
- **Accessibility**: 100% ARIA label coverage.
- **Compliance**: Strict adherence to TUC branding palette.

```

### FILE: index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <title>Techbridge University College Banner | TUC</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


```

### FILE: metadata.json
```json
{
  "name": "Techbridge University College Banner",
  "description": "An application displaying the redesigned Techbridge University College banner.",
  "requestFramePermissions": [],
  "majorCapabilities": []
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
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.50.1",
    "@tailwindcss/vite": "^4.2.4",
    "@vitejs/plugin-react": "^6.0.1",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "lucide-react": "^1.8.0",
    "motion": "^12.38.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "vite": "^8.0.9"
  },
  "devDependencies": {
    "@types/express": "^5.0.6",
    "@types/node": "^25.6.0",
    "autoprefixer": "^10.5.0",
    "tailwindcss": "^4.2.4",
    "tsx": "^4.21.0",
    "typescript": "~6.0.3",
    "vite": "^6.2.0"
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

View your app in AI Studio: https://ai.studio/apps/b92846f1-7e6e-4f43-b291-621a95e217fc

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/App.tsx
```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import TechbridgeBanner from './components/TechbridgeBanner';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const [currentHash, setCurrentHash] = React.useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentHash === '#/admin' || currentHash === '/admin') {
    return <AdminPanel />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden">
        <TechbridgeBanner />
      </div>
    </div>
  );
}



```

### FILE: src/components/TechbridgeBanner.tsx
```typescript
import * as React from "react";
import { useBannerColors } from "../context/ColorContext";

export default function TechbridgeBanner() {
  const { colors, fonts } = useBannerColors();
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--b-primary',      colors.primary);
    el.style.setProperty('--b-secondary',    colors.secondary);
    el.style.setProperty('--b-text-primary', colors.textPrimary);
    el.style.setProperty('--b-heading-font', `'${fonts.heading}', sans-serif`);
    el.style.setProperty('--b-body-font',    `'${fonts.body}', sans-serif`);
  }, [colors, fonts]);

  return (
    <div ref={rootRef} className="w-[640px] h-[850px] bg-white relative shadow-2xl border-x border-[#ddd] overflow-hidden font-sans">
      <div className="h-[6px] w-full banner-accent-bar" />

      <div className="py-[24px] text-center w-full banner-header">
        <h1 className="text-[60px] font-black tracking-[16px] leading-tight banner-heading">TECHBRIDGE</h1>
        <div className="text-[24px] font-bold tracking-[8px] mt-1 uppercase leading-tight banner-heading">UNIVERSITY COLLEGE</div>
      </div>

      <div className="text-center text-[19px] font-extrabold mt-[8px] mb-[2px] px-4 leading-tight italic banner-formerly">
        Formerly Asanska University College of Design and Technology
      </div>

      <div className="h-[20px] bg-white w-full" />

      <div className="w-[300px] mx-auto text-center py-2 rounded font-black text-[18px] tracking-[1px] uppercase whitespace-nowrap banner-programmes-bar">
        PROGRAMMES WE OFFER
      </div>

      <div className="px-[40px] pt-[25px]">
        {[
          "BA / Dip. Jewellery Design",
          "BA / Dip. Product Design",
          "B.Tech. Fashion Design",
          "B.Tech. Digital Media & Comm. Design"
        ].map((item, index) => (
          <div key={index} className="flex items-start mb-[15px]">
            <div className="w-[14px] h-[14px] rounded-full mr-[20px] shrink-0 mt-[10px] banner-bullet" />
            <div className="font-extrabold leading-[1.1] text-[32px] banner-programme-name">
              {item}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-[26px] font-black my-[10px] banner-cert-line">
        6-month &amp; 1-year certificates
      </div>

      <div className="w-[580px] mx-auto text-center py-[12px] rounded font-black text-[26px] tracking-[2px] uppercase banner-admissions-bar">
        ADMISSIONS ARE ONGOING
      </div>

      <div className="flex justify-between px-[30px] mt-[15px]">
        <div className="w-[320px] h-[108px] rounded flex flex-col justify-center items-center banner-contact-box">
          <div className="text-[34px] font-black tracking-[1px] leading-tight">054 012 4488</div>
          <div className="text-[34px] font-black tracking-[1px] leading-tight">054 012 4400</div>
          <div className="text-[10px] font-bold tracking-[1.5px] opacity-85 mt-1">MON – FRI · 8:00 AM – 5:00 PM</div>
        </div>
        <div className="w-[240px] h-[108px] rounded bg-white flex flex-col justify-center items-center text-center px-2 banner-apply-box">
          <div className="text-[14px] font-extrabold tracking-[2px] mb-1 banner-apply-label">APPLY ONLINE</div>
          <div className="text-[24px] font-black leading-tight text-center px-4 flex items-center justify-center h-full banner-apply-url">techbridge.edu.gh</div>
        </div>
      </div>

      <div className="text-center text-[11px] font-extrabold tracking-[2px] mt-[20px] banner-location">
        OYIBI · GREATER ACCRA · GHANA
      </div>

      <div className="h-[20px] w-full" />

      <div className="h-[6px] w-full absolute bottom-0 banner-bottom-bar" />
    </div>
  );
}

```

### FILE: src/context/ColorContext.tsx
```typescript
import React, { useContext, useEffect } from 'react';

export const FONT_OPTIONS = [
  { label: 'Bebas Neue',        family: 'Bebas Neue',        weights: '400' },
  { label: 'Playfair Display',  family: 'Playfair Display',  weights: '700;900' },
  { label: 'Oswald',            family: 'Oswald',            weights: '600;700' },
  { label: 'Montserrat',        family: 'Montserrat',        weights: '700;900' },
  { label: 'Cormorant Garamond',family: 'Cormorant Garamond',weights: '700' },
  { label: 'Anton',             family: 'Anton',             weights: '400' },
  { label: 'Inter',             family: 'Inter',             weights: '700;900' },
  { label: 'Raleway',           family: 'Raleway',           weights: '700;900' },
];

function loadGoogleFont(family: string, weights: string) {
  const id = `gfont-${family.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weights}&display=swap`;
  document.head.appendChild(link);
}

const DEFAULT_COLORS = {
  primary: '#C8A84B',
  secondary: '#0F0C07',
  accent: '#F2EBD9',
  textPrimary: '#0F0C07',
  textSecondary: '#FFFFFF',
};

const DEFAULT_FONTS = {
  heading: 'Bebas Neue',
  body: 'Inter',
};

const ColorContext = React.createContext({
  colors: DEFAULT_COLORS,
  fonts: DEFAULT_FONTS,
  updateColor: (_key: string, _value: string) => {},
  updateFont: (_key: string, _value: string) => {},
});

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [colors, setColors] = React.useState(() => {
    const saved = localStorage.getItem('banner-colors');
    return saved ? JSON.parse(saved) : DEFAULT_COLORS;
  });

  const [fonts, setFonts] = React.useState(() => {
    const saved = localStorage.getItem('banner-fonts');
    return saved ? JSON.parse(saved) : DEFAULT_FONTS;
  });

  useEffect(() => {
    FONT_OPTIONS.forEach(f => loadGoogleFont(f.family, f.weights));
  }, []);

  const updateColor = (key: string, value: string) => {
    setColors(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('banner-colors', JSON.stringify(next));
      return next;
    });
  };

  const updateFont = (key: string, value: string) => {
    setFonts(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('banner-fonts', JSON.stringify(next));
      return next;
    });
  };

  return (
    <ColorContext.Provider value={{ colors, fonts, updateColor, updateFont }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useBannerColors = () => useContext(ColorContext);

```

### FILE: src/index.css
```css
@import "tailwindcss";

.banner-preview-viewport {
  overflow: hidden;
  border-radius: 0.25rem;
  height: calc(850px * var(--preview-scale, 0.55));
}

.banner-preview-scaler {
  transform: scale(var(--preview-scale, 0.55));
  transform-origin: top left;
  width: 640px;
  height: 850px;
}

/* TechbridgeBanner — dynamic theme tokens via CSS custom properties */
.banner-accent-bar      { background-color: var(--b-primary); }
.banner-header          { background-color: var(--b-primary); color: var(--b-text-primary); }
.banner-heading         { font-family: var(--b-heading-font); }
.banner-formerly        { color: var(--b-text-primary); font-family: var(--b-body-font); }
.banner-programmes-bar  { background-color: var(--b-secondary); color: #fff; }
.banner-bullet          { background-color: var(--b-primary); }
.banner-programme-name  { color: var(--b-text-primary); font-family: var(--b-heading-font); }
.banner-cert-line       { color: var(--b-primary); }
.banner-admissions-bar  { background-color: var(--b-primary); color: var(--b-text-primary); }
.banner-contact-box     { background-color: var(--b-secondary); color: #fff; }
.banner-apply-box       { border: 3px solid var(--b-primary); }
.banner-apply-label     { color: var(--b-primary); }
.banner-apply-url       { color: var(--b-text-primary); }
.banner-location        { color: var(--b-text-primary); }
.banner-bottom-bar      { background-color: var(--b-secondary); }

```

### FILE: src/main.tsx
```typescript
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ColorProvider } from './context/ColorContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorProvider>
      <App />
    </ColorProvider>
  </StrictMode>,
);

```

### FILE: src/pages/AdminPanel.tsx
```typescript
import React, { useRef, useState, useEffect } from 'react';
import { useBannerColors, FONT_OPTIONS } from '../context/ColorContext';
import TechbridgeBanner from '../components/TechbridgeBanner';

const BANNER_W = 640;
const BANNER_H = 850;

export default function AdminPanel() {
  const { colors, fonts, updateColor, updateFont } = useBannerColors();
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);

  useEffect(() => {
    const update = () => {
      if (previewRef.current) {
        const available = previewRef.current.clientWidth - 48;
        const next = Math.min(available / BANNER_W, 1);
        setScale(next);
        previewRef.current.style.setProperty('--preview-scale', String(next));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const colorInputs = [
    { id: 'primary',       label: 'Primary (Gold)',    value: colors.primary },
    { id: 'secondary',     label: 'Secondary (Ink)',   value: colors.secondary },
    { id: 'accent',        label: 'Accent (Cream)',    value: colors.accent },
    { id: 'textPrimary',   label: 'Text Primary',      value: colors.textPrimary },
    { id: 'textSecondary', label: 'Text Secondary',    value: colors.textSecondary },
  ];

  return (
    <div className="min-h-screen bg-[#0F0C07] text-white p-8 font-sans">
      <h1 className="text-4xl font-black text-[#C8A84B] mb-4">Banner Colorwheel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Left — colour + font controls */}
        <div className="space-y-6">
          <div className="bg-[#141210] border border-[#C8A84B] p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Color Controls</h2>
            <div className="space-y-4">
              {colorInputs.map(color => (
                <div key={color.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="font-medium">{color.label}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={color.value}
                      onChange={(e) => updateColor(color.id, e.target.value)}
                      className="bg-black text-white px-2 py-1 rounded border border-gray-600 text-sm w-24 font-mono"
                      aria-label={`Hex value for ${color.label}`}
                    />
                    <input
                      type="color"
                      value={color.value}
                      onChange={(e) => updateColor(color.id, e.target.value)}
                      className="w-8 h-8 rounded-full cursor-pointer border-0"
                      aria-label={`Pick colour for ${color.label}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141210] border border-[#C8A84B] p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Font Controls</h2>
            <div className="space-y-4">
              {([
                { id: 'heading', label: 'Heading Font', value: fonts.heading },
                { id: 'body',    label: 'Body Font',    value: fonts.body },
              ] as const).map(slot => (
                <div key={slot.id} className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-sm font-medium mb-2 text-gray-300">{slot.label}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map(f => (
                      <button
                        key={f.family}
                        type="button"
                        onClick={() => updateFont(slot.id, f.family)}
                        className={`px-3 py-2 rounded text-sm text-left transition-colors ${
                          slot.value === f.family
                            ? 'bg-[#C8A84B] text-black font-bold'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                        aria-pressed={slot.value === f.family ? 'true' : 'false'}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Active: <span className="text-[#C8A84B]">{slot.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — live banner preview */}
        <div
          ref={previewRef}
          className="bg-[#141210] border border-[#C8A84B] p-6 rounded-lg shadow-xl"
        >
          <h2 className="text-xl font-bold mb-4">
            Live Preview
            <span className="ml-2 text-xs text-gray-400 font-normal">{Math.round(scale * 100)}%</span>
          </h2>
          <div className="banner-preview-viewport">
            <div className="banner-preview-scaler">
              <TechbridgeBanner />
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8">
        <a href="#/" className="text-[#C8A84B] hover:underline">← Back to Banner</a>
      </div>
    </div>
  );
}

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

### FILE: vite.config.ts
```typescript
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
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
      },
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

