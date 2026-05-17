# bionicskins™ - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for bionicskins™.

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

### FILE: .env.local
```text
VITE_GOOGLE_CLIENT_ID=[REDACTED_CREDENTIAL]
VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/bionicskins/auth/google/callback

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
﻿# CREATION.md â€” BionicSkinsâ„¢
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/bionicskinsâ„¢/`
**Last verified:** 2026-04-25

---

## 1. What This App Is

BionicSkinsâ„¢ is a **medical technology company website** for a prosthetic skin/limb solutions brand. It is a multi-page marketing site with content management via Firebase Firestore. Admins can create/edit blog posts and amputee resources. Patients can submit referral forms and contact requests. All data flows through Firebase â€” there is no separate backend server.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** |
| Build | Vite | ^7 |
| Language | TypeScript | ~5.8 |
| Router | React Router DOM | ^7 |
| Styling | Tailwind CSS | ^4.2 |
| Icons | lucide-react | latest |
| Animation | motion (framer-motion v12 standalone) | latest |
| AI | `@google/genai` | latest |
| Database | Firebase Firestore | latest |
| Auth | Firebase Auth | latest |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine â†’ nginx:alpine | â€” |

---

## 3. Directory Structure

```
src/
â”œâ”€â”€ App.tsx               # React Router routes (no auth wrapper â€” admin page self-guards)
â”œâ”€â”€ main.tsx
â”œâ”€â”€ index.css
â”œâ”€â”€ lib/
â”‚   â””â”€â”€ firebase.ts       # initializeApp(config) â†’ export db, auth
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Header.tsx        # Top nav: logo + navigation links + mobile hamburger
â”‚   â”œâ”€â”€ Footer.tsx        # Contact info + social links + copyright
â”‚   â”œâ”€â”€ HeroSection.tsx   # Large image hero with CTA
â”‚   â”œâ”€â”€ ContentSection.tsx # Reusable text + image section
â”‚   â”œâ”€â”€ ValuesAccordion.tsx # Expandable values/FAQs
â”‚   â”œâ”€â”€ NewsSection.tsx   # Latest blog posts preview
â”‚   â”œâ”€â”€ BlogList.tsx      # All blog posts grid
â”‚   â”œâ”€â”€ BlogEditor.tsx    # Firestore-backed blog post editor (admin)
â”‚   â”œâ”€â”€ ResourceList.tsx  # Amputee resources list
â”‚   â”œâ”€â”€ ResourceEditor.tsx # Firestore-backed resource editor (admin)
â”‚   â””â”€â”€ ui/               # Shared UI primitives (Button, Card, Badge, etc.)
â””â”€â”€ pages/
    â”œâ”€â”€ Home.tsx              # Hero + company overview + blog preview
    â”œâ”€â”€ Technology.tsx        # Product/tech showcase
    â”œâ”€â”€ OurBlog.tsx           # Blog listing (BlogList component)
    â”œâ”€â”€ BecomeAPatient.tsx    # Patient intake form (saves to Firestore)
    â”œâ”€â”€ AmputeeResources.tsx  # Resource library (ResourceList)
    â”œâ”€â”€ ReferAPatient.tsx     # Clinician referral form (saves to Firestore)
    â”œâ”€â”€ ClinicalTrials.tsx    # Clinical trial information + sign-up form
    â”œâ”€â”€ ContactUs.tsx         # Contact form (saves to Firestore)
    â”œâ”€â”€ Policies.tsx          # Privacy policy and terms
    â””â”€â”€ AdminDashboard.tsx    # CMS: blog + resources + form submissions
```

---

## 4. Routes

```
/                   â†’ Home
/about              â†’ Home (same component, scrolls to about section)
/technology         â†’ Technology
/our-blog           â†’ OurBlog
/become-a-patient   â†’ BecomeAPatient
/amputee-resources  â†’ AmputeeResources
/refer-a-patient    â†’ ReferAPatient
/clinical-trials    â†’ ClinicalTrials
/contact-us         â†’ ContactUs
/policies           â†’ Policies
/admin              â†’ AdminDashboard (guarded: Firebase Auth sign-in required)
```

---

## 5. Firebase Configuration (firebase-applet-config.json)

```json
{
  "projectId": "...",
  "appId": "...",
  "apiKey": "...",
  "authDomain": "...",
  "firestoreDatabaseId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "measurementId": "..."
}
```

> Loaded in `src/lib/firebase.ts`. The `firestoreDatabaseId` field is used to target a non-default Firestore database:
> `getFirestore(app, config.firestoreDatabaseId)`

---

## 6. Firestore Collections

| Collection | Documents | Notes |
|---|---|---|
| `blog_posts` | id, title, content, author, publishedAt, tags[], imageUrl, published | Admin creates/edits; public reads |
| `amputee_resources` | id, title, description, category, fileUrl, createdAt | Admin manages |
| `patient_forms` | Submitted BecomeAPatient forms | Admin read-only |
| `referral_forms` | Submitted ReferAPatient forms | Admin read-only |
| `contact_submissions` | Submitted ContactUs forms | Admin read-only |
| `clinical_trial_signups` | ClinicalTrials sign-ups | Admin read-only |

---

## 7. Admin Dashboard (pages/AdminDashboard.tsx)

**Access:** Firebase Auth email/password sign-in. Admin credentials managed in Firebase Console.

Features:
- **Blog tab:** List posts + create/edit via `BlogEditor` modal. Calls Gemini to draft content.
- **Resources tab:** List/edit amputee resources via `ResourceEditor`.
- **Submissions tab:** View all form submissions (patient, referral, contact, trials).

**Admin Auth guard:** Check `firebase.auth().currentUser` on mount. If null â†’ redirect to `/admin` sign-in form.

---

## 8. Gemini AI Feature

Used in `BlogEditor.tsx`:
- "âœ¨ Draft with AI" button: sends post title/topic to Gemini â†’ returns full blog post draft
- User edits before saving to Firestore

---

## 9. Colour Tokens

```css
/* Medical / clinical aesthetic */
--color-primary:     #0a2342;   /* deep navy */
--color-accent:      #00b4d8;   /* medical teal/blue */
--color-accent-alt:  #90e0ef;   /* light teal highlight */
--color-bg:          #ffffff;
--color-bg-alt:      #f0f9ff;   /* very light blue tint */
--color-text:        #1a1a2e;
--color-text-muted:  #5f6b7c;
--color-border:      #bde0fe;
```

---

## 10. ARIA Requirements

- `Header`: `role="banner"`
- `Footer`: `role="contentinfo"`
- Main landmark: `<main id="main-content">`
- Skip link: `<a href="#main-content" className="sr-only focus:not-sr-only">`
- Navigation: `<nav aria-label="Main navigation">`
- All form inputs: `<label htmlFor>` with matching `id`
- All icon buttons: `aria-label`
- Blog post cards: `aria-label="Read post: {title}"`
- Form submission feedback: `role="alert"` on error, `role="status"` on success

---

## 11. Firestore Security Rules (firestore.rules)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blog posts: public read, admin write
    match /blog_posts/{doc} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null;
    }
    // Resources: public read, admin write
    match /amputee_resources/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Form submissions: write-only for public, read for admin
    match /{collection}/{doc} {
      allow create: if collection in ['patient_forms','referral_forms','contact_submissions','clinical_trial_signups'];
      allow read: if request.auth != null;
    }
  }
}
```

---

## 12. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build is error-free |
| AC-2 | Home page renders with Hero, blog preview, and values sections |
| AC-3 | OurBlog page loads posts from Firestore (or empty state) |
| AC-4 | BecomeAPatient form submits to `patient_forms` collection |
| AC-5 | Admin login via Firebase Auth grants access to dashboard |
| AC-6 | Admin can create/edit a blog post via BlogEditor |
| AC-7 | Gemini "Draft with AI" generates blog content |
| AC-8 | Firestore rules prevent unauthenticated writes to admin collections |
| AC-9 | Skip link, all form label associations, and icon button aria-labels are present |

```

### FILE: deploy.ps1
```ps1
# BionicSkins™ Deployment Script

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/bionicskins/",
    [switch]$Build = $false
)

Write-Host "=== BIONICSKINS™ DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath`n"

if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}

# Check if dist or build exists
$buildDir = if (Test-Path "dist") { "dist" } elseif (Test-Path "build") { "build" } else { $null }

if (-not $buildDir) {
    Write-Host "Error: Neither dist/ nor build/ found. Run with -Build flag." -ForegroundColor Red
    exit 1
}

Write-Host "Creating directory..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\bionicskins™' && scp -r -o StrictHostKeyChecking=no $buildDir/* $RemoteHost`:$RemotePath 2>/dev/null"

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /bionicskins/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /bionicskins/index.html [QSA,L]
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R aucdtadmin:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/bionicskins`n"

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || npm install
COPY . .
RUN pnpm run build || npm run build

FROM node:24-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/admin_guide.md
```md
# Admin Guide — BionicSkins™

## Access
Navigate to `/#/admin` or click "Admin" in the footer.

**Password:** `admin123`

## Firebase
Configuration lives in `firebase-applet-config.json`. Firestore rules are in `firestore.rules`.

## Logs
Audit events stored in localStorage key `bionicskins-audit`.

```

### FILE: docs/srs/srs_v1.0.md
```md
# IEEE SRS — BionicSkins™
**Version:** 1.0.0 (as-built)
**Institution:** Techbridge University College
**Status:** Active

## 1. Introduction
BionicSkins™ is a product showcase / e-commerce demo for adaptive prosthetic skin solutions. Built as a React SPA with Firebase backend integration.

## 2. Functional Requirements
| ID | Requirement |
|---|---|
| FR-1 | Product catalogue display with filtering |
| FR-2 | Firebase Firestore data source for product records |
| FR-3 | Admin panel accessible via `#/admin` |

## 3. Architecture
- **Framework:** Vite + React
- **Backend:** Firebase (Firestore + Auth)
- **Styling:** Tailwind CSS
- **Config:** `firebase-applet-config.json`, `firebase-blueprint.json`

```

### FILE: firebase-applet-config.json
```json
{
  "projectId": "gen-lang-client-0402452400",
  "appId": "1:381783929321:web:adada2cb75c8fe90425b78",
  "apiKey": "<REDACTED_GEMINI_KEY>",
  "authDomain": "gen-lang-client-0402452400.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-d8f27f86-2ed4-4663-9f44-d79ce93d4c64",
  "storageBucket": "gen-lang-client-0402452400.firebasestorage.app",
  "messagingSenderId": "381783929321",
  "measurementId": ""
}
```

### FILE: firebase-blueprint.json
```json
{
  "entities": {
    "BlogPost": {
      "title": "BlogPost",
      "description": "A blog post or news article.",
      "type": "object",
      "properties": {
        "title": { "type": "string", "description": "The title of the post." },
        "content": { "type": "string", "description": "The content of the post." },
        "author": { "type": "string", "description": "The author of the post." },
        "createdAt": { "type": "string", "format": "date", "description": "The creation date." }
      },
      "required": ["title", "content", "createdAt"]
    },
    "Resource": {
      "title": "Resource",
      "description": "A downloadable resource or guide.",
      "type": "object",
      "properties": {
        "title": { "type": "string", "description": "The title of the resource." },
        "description": { "type": "string", "description": "A brief description." },
        "url": { "type": "string", "format": "uri", "description": "The URL to the resource." }
      },
      "required": ["title", "url"]
    }
  },
  "firestore": {
    "/blogPosts/{postId}": {
      "schema": "BlogPost",
      "description": "Collection of blog posts."
    },
    "/resources/{resourceId}": {
      "schema": "Resource",
      "description": "Collection of resources."
    }
  }
}

```

### FILE: index.html
```html
<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <!-- SEO -->
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>Bionic Skins™</title>

    <!-- Meta Tags -->
    <meta name="description" content="BionicSkins™ revolutionizes prosthetics with innovative tech and personalized care, improving fit for amputees to enhance comfort and quality of life." />
    <meta http-equiv="Accept-CH" content="Sec-CH-UA-Platform-Version, Sec-CH-UA-Model" />

    <!-- Favicons -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    
    <!-- Open Graph & Twitter -->
    <link rel="canonical" href="https://www.bionicskins.com"/>
    <meta property="og:site_name" content="Bionic Skins™"/>
    <meta property="og:title" content="Bionic Skins™"/>
    <meta property="og:url" content="https://www.bionicskins.com"/>
    <meta property="og:type" content="website"/>
    <meta property="og:description" content="BionicSkins™ revolutionizes prosthetics with innovative tech and personalized care, improving fit for amputees to enhance comfort and quality of life."/>
    <meta property="og:image" content="http://static1.squarespace.com/static/65d385945c1b7165dd6ac28a/t/65d533a9f0f3e04c3904a508/1708471209144/Compassionate+Patient+Care+-+Powered+by+Science+%28Instagram+Post%29.png?format=1500w"/>
    <meta property="og:image:width" content="1080"/>
    <meta property="og:image:height" content="1080"/>
    <meta itemprop="name" content="Bionic Skins™"/>
    <meta itemprop="url" content="https://www.bionicskins.com"/>
    <meta itemprop="description" content="BionicSkins™ revolutionizes prosthetics with innovative tech and personalized care, improving fit for amputees to enhance comfort and quality of life."/>
    <meta itemprop="thumbnailUrl" content="http://static1.squarespace.com/static/65d385945c1b7165dd6ac28a/t/65d533a9f0f3e04c3904a508/1708471209144/Compassionate+Patient+Care+-+Powered+by+Science+%28Instagram+Post%29.png?format=1500w"/>
    <link rel="image_src" href="http://static1.squarespace.com/static/65d385945c1b7165dd6ac28a/t/65d533a9f0f3e04c3904a508/1708471209144/Compassionate+Patient+Care+-+Powered+by+Science+%28Instagram+Post%29.png?format=1500w" />
    <meta itemprop="image" content="http://static1.squarespace.com/static/65d385945c1b7165dd6ac28a/t/65d533a9f0f3e04c3904a508/1708471209144/Compassionate+Patient+Care+-+Powered+by+Science+%28Instagram+Post%29.png?format=1500w"/>
    <meta name="twitter:title" content="Bionic Skins™"/>
    <meta name="twitter:image" content="http://static1.squarespace.com/static/65d385945c1b7165dd6ac28a/t/65d533a9f0f3e04c3904a508/1708471209144/Compassionate+Patient+Care+-+Powered+by+Science+%28Instagram+Post%29.png?format=1500w"/>
    <meta name="twitter:url" content="https://www.bionicskins.com"/>
    <meta name="twitter:card" content="summary"/>
    <meta name="twitter:description" content="BionicSkins™ revolutionizes prosthetics with innovative tech and personalized care, improving fit for amputees to enhance comfort and quality of life."/>

    <!-- Fonts Base -->
    <link rel="preconnect" href="https://images.squarespace-cdn.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,400;0,700;1,400;1,700">
  
    <!-- LD+JSON Data -->
    <script type="application/ld+json">{"url":"https://www.bionicskins.com","name":"Bionic Skins™","image":"//images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/4ad6dc7e-8351-4f15-9969-0582e4aadbc0/Compassionate+Patient+Care+-+Powered+by+Science+%28Reddit+Banner%29.png","@context":"http://schema.org","@type":"WebSite"}</script>
    <script type="application/ld+json">{"address":"","image":"https://static1.squarespace.com/static/65d385945c1b7165dd6ac28a/t/65d52b70829ef254f0a98452/1726841427311/","openingHours":"","@context":"http://schema.org","@type":"LocalBusiness"}</script>
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
  "name": "BionicSkins™",
  "description": "Advanced prosthetics provider grounded in MIT research, combining state-of-the-art technology with compassionate patient care.",
  "requestFramePermissions": ["camera", "microphone", "geolocation"]
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
    "@google/genai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "firebase": "^12.11.0",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.13.2",
    "vite": "^6.2.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
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

View your app in AI Studio: https://ai.studio/apps/d8f27f86-2ed4-4663-9f44-d79ce93d4c64

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

import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ReferAPatient from './pages/ReferAPatient';
import AdminDashboard from './pages/AdminDashboard';
import Technology from './pages/Technology';
import OurBlog from './pages/OurBlog';
import BecomeAPatient from './pages/BecomeAPatient';
import AmputeeResources from './pages/AmputeeResources';
import ClinicalTrials from './pages/ClinicalTrials';
import ContactUs from './pages/ContactUs';
import Policies from './pages/Policies';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/our-blog" element={<OurBlog />} />
          <Route path="/become-a-patient" element={<BecomeAPatient />} />
          <Route path="/amputee-resources" element={<AmputeeResources />} />
          <Route path="/refer-a-patient" element={<ReferAPatient />} />
          <Route path="/clinical-trials" element={<ClinicalTrials />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

```

### FILE: src/AppWithAuth.tsx
```typescript
import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginView } from './components/LoginView';
import App from './App';

export const AppWithAuth: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <App />;
};

```

### FILE: src/components/BlogEditor.tsx
```typescript
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) {
      setMessage('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'blogPosts'), {
        title,
        content,
        category,
        author: 'Admin',
        createdAt: new Date().toISOString().split('T')[0]
      });
      setTitle('');
      setContent('');
      setCategory('');
      setMessage('Post published successfully!');
    } catch (error) {
      setMessage('Error publishing post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-frost">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-serif text-navy mb-8">Add New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-4 rounded-[4px] border border-navy/20" />
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full p-4 rounded-[4px] border border-navy/20" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" className="w-full p-4 rounded-[4px] border border-navy/20 h-40" />
          <button type="submit" className="bg-navy text-white px-8 py-3 rounded-[4px] font-sans font-medium hover:bg-prof-blue transition" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
          {message && <p className="text-navy font-sans">{message}</p>}
        </form>
      </div>
    </section>
  );
}

```

### FILE: src/components/BlogList.tsx
```typescript
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Skeleton } from './ui/Skeleton';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: string;
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter(post => 
    (category === 'All' || post.category === category) &&
    (post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-serif text-navy mb-16 tracking-tight text-center">Our Blog</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
          <input type="text" placeholder="Search posts..." className="p-4 rounded-[4px] border border-navy/20 w-full md:w-64" onChange={(e) => setSearchTerm(e.target.value)} />
          <select className="p-4 rounded-[4px] border border-navy/20 w-full md:w-48" onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => <div key={i}><Skeleton className="h-64 rounded-[24px]" /></div>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map(post => (
              <motion.div key={post.id} className="bg-frost p-8 rounded-[24px] border border-navy/10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <h3 className="text-2xl font-serif text-navy mb-4">{post.title}</h3>
                <p className="text-gray-600 font-sans mb-4">{post.content.substring(0, 100)}...</p>
                <p className="text-sm text-prof-blue font-sans">{post.author} • {post.createdAt}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

```

### FILE: src/components/ContentSection.tsx
```typescript
import { motion } from 'motion/react';

interface Props {
  title: string;
  description: string;
  imageSrc: string;
}

export default function ContentSection({ title, description, imageSrc }: Props) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center"
    >
      <div>
        <h2 className="text-5xl font-bold font-serif text-navy mb-8 tracking-tight">{title}</h2>
        <p className="text-xl text-[#5F7182] font-sans leading-relaxed font-light">{description}</p>
      </div>
      <img src={imageSrc} alt={title} className="rounded-[16px] shadow-xl w-full h-[500px] object-cover border-4 border-[#FDFCFA]" referrerPolicy="no-referrer" />
    </motion.section>
  );
}

```

### FILE: src/components/Footer.tsx
```typescript
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Top Section: Links, Info & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 font-sans">
          
          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-navy mb-6">Contact Us</h3>
            <p className="text-[#6a879a] leading-relaxed">
              209 Burlington Rd, Suite 217,<br />
              Bedford, Massachusetts, 01730
            </p>
            <p className="text-[#6a879a]">
              Email: <a href="mailto:info@bionicskins.com" className="text-navy hover:underline">info@bionicskins.com</a>
            </p>
            <p className="text-[#6a879a]">
              Office Number: <a href="tel:6179327698" className="text-navy hover:underline">(1) 617-932-7698</a>
            </p>
            <p className="text-[#6a879a]">
              Fax Number: (1) 617-518-5455
            </p>
          </div>

          {/* Hours Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-navy mb-6">Hours</h3>
            <p className="text-[#6a879a]">Monday – Friday:</p>
            <p className="text-[#6a879a]">9:00 am - 5:00 pm</p>
            <p className="text-[#6a879a] italic pt-2">By Appointment Only</p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-navy mb-6">Quick Links</h3>
            <div className="flex flex-col space-y-3">
              <Link to="/about" className="text-navy hover:text-accent transition-colors w-fit">About Bionic Skins™</Link>
              <Link to="/technology" className="text-navy hover:text-accent transition-colors w-fit">Our Technology</Link>
              <Link to="/become-a-patient" className="text-navy hover:text-accent transition-colors w-fit">Become A Patient</Link>
              <Link to="/policies" className="text-navy hover:text-accent transition-colors w-fit">Policies</Link>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-navy mb-6">Newsletter</h3>
            <p className="text-[#6a879a] text-sm mb-4">Subscribe to receive news and updates.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="px-4 py-2 border border-gray-200 rounded-[4px] focus:outline-none focus:border-navy"
              />
              <button 
                type="submit" 
                className="bg-accent text-white px-6 py-2 rounded-[4px] font-bold hover:opacity-90 transition-opacity"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full h-[400px] mb-16 rounded-[12px] overflow-hidden shadow-sm grayscale hover:grayscale-0 transition-all duration-700">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1471.954605940502!2d-71.26444589999999!3d42.4852945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e3bb07963db88f%3A0xc3f587fc9f6920e5!2s209%20Burlington%20Rd%2C%20Bedford%2C%20MA%2001730!5e0!3m2!1sen!2sus!4v1712160000000!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Accreditations Section */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 py-12 border-t border-b border-gray-100">
          <img src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/1709222327231-X9V7M8BN3CX60BF3F6G5/American+Board+For+Certification+Prosthetics.png" alt="ABC Prosthetics" className="h-[4.5rem] w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <img src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/1709222327282-VZCGFKFOH1KDXZHRVN1K/American+Orthotic+Prosthetic+Association+AOPA.png" alt="AOPA" className="h-[4.5rem] w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <img src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/1709222327998-4AX7PRY09G0V3K6BC6JD/American+Society+for+Testing+and+Materials.png" alt="ASTM" className="h-[4.5rem] w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <img src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/1709222328000-JGEZ6PWV13SOJTHJTC0S/Board+Of+Certification+Accreditation.png" alt="BOC" className="h-[4.5rem] w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <img src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/1709222328806-G9LUR4M3RNM5QUBYNVS3/The+Academy+AAOP.png" alt="AAOP" className="h-[4.5rem] w-auto opacity-80 hover:opacity-100 transition-opacity" />
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-sm text-[#8c9ca8] font-sans">
          &copy; {new Date().getFullYear()} BionicSkins™ All rights reserved.
        </div>
        
      </div>
    </footer>
  );
}

```

### FILE: src/components/Header.tsx
```typescript
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#2A5171] text-white text-center py-2 text-sm font-sans relative z-[60]">
        Now Accepting New Patients
        {/* Placeholder close button for visual parity, no functional state needed rn */}
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs cursor-pointer opacity-70 hover:opacity-100">&#10005;</span>
      </div>

      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-frost shadow-sm"
      >
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          
          <Link to="/">
            <img 
              src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/4ad6dc7e-8351-4f15-9969-0582e4aadbc0/Compassionate+Patient+Care+-+Powered+by+Science+%28Reddit+Banner%29.png" 
              alt="Bionic Skins™" 
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          <nav className="hidden md:flex space-x-8 font-sans font-medium text-[#2A5171] items-center">

            {/* About Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center hover:text-prof-blue transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-prof-blue hover:after:w-full after:transition-all">
                About
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                <div className="bg-white shadow-xl border border-gray-100 rounded-b-md overflow-hidden flex flex-col py-2">
                  <Link to="/about" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors">
                    About Bionic Skins™
                  </Link>
                  <Link to="/technology" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors border-t border-gray-50">
                    Our Technology
                  </Link>
                  <Link to="/our-blog" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors border-t border-gray-50">
                    Our Blog
                  </Link>
                </div>
              </div>
            </div>

            {/* Patients Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center hover:text-prof-blue transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-prof-blue hover:after:w-full after:transition-all">
                Patients
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                  <div className="bg-white shadow-xl border border-gray-100 rounded-b-md overflow-hidden flex flex-col py-2">
                    <Link to="/become-a-patient" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors">
                      Become A Patient
                    </Link>
                    <Link to="/amputee-resources" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors border-t border-gray-50">
                      Resource Center
                    </Link>
                  </div>
              </div>
            </div>
            
            {/* Physicians Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center hover:text-prof-blue transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-prof-blue hover:after:w-full after:transition-all">
                Physicians
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                  <div className="bg-white shadow-xl border border-gray-100 rounded-b-md overflow-hidden flex flex-col py-2">
                    <Link to="/refer-a-patient" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors">
                      Refer A Patient
                    </Link>
                    <Link to="/clinical-trials" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors border-t border-gray-50">
                      Clinical Trials
                    </Link>
                  </div>
              </div>
            </div>
          </nav>
          
          <Link to="/contact-us" className="hidden xl:block bg-navy text-white px-6 py-2.5 rounded-[4px] font-sans font-bold hover:opacity-90 transition-all duration-300">
            Contact Us
          </Link>
          
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="text-navy" /> : <Menu className="text-navy" />}
          </button>
        </div>
      </motion.header>
    </>
  );
}

```

### FILE: src/components/HeroSection.tsx
```typescript
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <>
      {/* Full-width hero with background image */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/5540ffb4-eb38-4860-8f63-4ef21775b73a/Bostons+Best+Prosthetics+Bionic+Skins.png')`,
          }}
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/30" />
      </section>

      {/* "Now Accepting Patients" CTA — below hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center py-10 bg-white"
      >
        <Link
          to="/become-a-patient"
          className="bg-[#16426C] text-white px-10 py-4 text-lg font-sans font-medium rounded-[4px] hover:bg-[#2A5171] transition-all duration-300 tracking-wide"
        >
          Now Accepting Patients
        </Link>
      </motion.div>
    </>
  );
}

```

### FILE: src/components/LoginView.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let oauthHandled = false;

    const handleOAuthToken = [REDACTED_CREDENTIAL]
      if (oauthHandled) return;
      oauthHandled = true;

      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const userInfo = await res.json();
        login({
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
        });
        localStorage.removeItem('oauth_token_temp');
      } catch {
        setError('Google login failed. Please try again.');
      }
    };

    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'OAUTH_TOKEN_SUCCESS') {
        handleOAuthToken(event.data.access_token);
      }
      if (event.data?.type === 'OAUTH_TOKEN_ERROR') {
        setError(event.data.error_description || event.data.error || 'Google login failed.');
      }
    };

    window.addEventListener('message', handleOAuthMessage);

    const fallback = window.setInterval(() => {
      const token = [REDACTED_CREDENTIAL]
      if (token) {
        handleOAuthToken(token);
        window.clearInterval(fallback);
      }
    }, 100);

    return () => {
      window.removeEventListener('message', handleOAuthMessage);
      window.clearInterval(fallback);
    };
  }, [login]);

  const handleOAuthClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'openid email profile',
      prompt: 'select_account',
    });

    window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      'oauth_popup',
      'width=600,height=700'
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) login(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-[var(--color-accent-primary)]">
          Welcome
        </h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleOAuthClick}
          className="w-full mb-6 px-4 py-3 bg-[var(--color-accent-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Continue with Email
          </button>
        </form>
      </div>
    </div>
  );
};

```

### FILE: src/components/NewsSection.tsx
```typescript
import { Facebook, Instagram, Linkedin, Link as LinkIcon } from 'lucide-react';

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  );
}

const SOCIAL_LINKS = [
  { icon: Facebook,   href: 'https://www.facebook.com/BionicSkins',                                                  label: 'Facebook' },
  { icon: Instagram,  href: 'https://www.instagram.com/bionicskins/',                                                label: 'Instagram' },
  { icon: Linkedin,   href: 'https://www.linkedin.com/company/bionicskins/',                                         label: 'LinkedIn' },
  { icon: TikTokIcon, href: 'https://www.tiktok.com/@bionicskins',                                                   label: 'TikTok' },
  { icon: LinkIcon,   href: 'https://livingwithamplitude.com/article/hugh-herr-bionic-skins-prosthetic-socket-amputees/', label: 'Interview' },
];

const INTERVIEW_URL = 'https://livingwithamplitude.com/article/hugh-herr-bionic-skins-prosthetic-socket-amputees/';

export default function NewsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-start">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-8">

            {/* Heading + social + text */}
            <div>
              <h2 className="text-5xl font-serif text-navy mb-4 tracking-tight">In The News</h2>
              <p className="text-[#2F6FA8] font-sans font-bold text-lg mb-3">Stay in-the-know</p>
              <div className="flex items-center gap-4 mb-5">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="text-[#2A5171] hover:text-prof-blue transition-colors">
                  <Icon size={20} />
                </a>
              ))}
              </div>
              <p className="text-[#6a879a] text-sm leading-relaxed">
                BionicSkins™ is ready to share the news. Our commitment to revolutionizing prosthetics and
                providing unparalleled comfort to our patients is our number one priority. Stay in the know by
                following our social media channels, where we'll keep you updated on our latest advancements,
                patient stories, and industry insights. Join us on this remarkable journey as we redefine the
                future of prosthetics, one step at a time.
              </p>
            </div>

            {/* Wave banner card */}
            <div className="relative">
              {/* Waves extend beyond card on both sides */}
              <svg
                className="absolute top-1/2 -translate-y-1/2 left-[-40px] right-[-40px] w-[calc(100%+80px)] pointer-events-none"
                style={{ height: '160px' }}
                viewBox="0 0 700 160"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {[0,12,24,36,48,60,72,84,96,108,120,132,144].map((offset, i) => (
                  <path
                    key={i}
                    d={`M0,${80 + Math.sin(i) * 15} C175,${30 + offset} 350,${130 - offset} 525,${80 + Math.sin(i) * 15} S700,${30 + offset} 700,${80 + Math.sin(i) * 15}`}
                    fill="none"
                    stroke="#5BA8D6"
                    strokeWidth="0.8"
                    opacity={0.6 - i * 0.04}
                  />
                ))}
              </svg>

              {/* Card */}
              <div className="relative z-10 bg-white/85 backdrop-blur-sm border border-gray-200 rounded-[12px] shadow-sm px-8 py-8 text-center mx-4">
                <h3 className="text-xl font-serif text-navy leading-snug mb-6">
                  Hugh Herr Interviews With Amplitude Magazine To Introduce BionicSkins™
                </h3>
                <a
                  href={INTERVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#16426C] text-white px-7 py-2.5 rounded-[4px] font-sans font-medium text-sm hover:bg-[#2A5171] transition-all duration-300"
                >
                  Read Full Interview Here
                </a>
              </div>
            </div>
          </div>

          {/* ── Right column: article card ── */}
          <div className="rounded-[12px] overflow-hidden border border-gray-200 shadow-md">
            {/* Blue header */}
            <div className="bg-[#2A5171] px-5 py-3 flex items-start justify-between gap-4">
              <p className="text-white text-sm font-sans font-bold uppercase tracking-wide leading-tight">
                Bionic Skins' Scientific Socket Solution
              </p>
              <span className="text-white/60 text-[10px] font-sans shrink-0 pt-0.5">January 30, 2024</span>
            </div>

            {/* Article body */}
            <div className="bg-white p-5 grid grid-cols-[1fr_auto] gap-4">
              {/* Left: text + main image */}
              <div>
                <p className="text-navy font-sans font-semibold text-sm mb-3 leading-snug">
                  Can prosthetic innovator Hugh Herr build a better socket-and-liner system?
                </p>
                <p className="text-[#6a879a] text-xs leading-relaxed mb-4">
                  <strong className="text-navy">This year marks</strong> the 20th anniversary of the patent for
                  the iWalk Knee, one of the first smart prosthetic joints ever invented. At a time when Mark
                  Zuckerberg barely knew his algorithms from his Adam's apple, the iWalk boasted an artificial
                  brain powerful enough to crunch a torrent of data about its wearer's biomechanics, then
                  adjust in real time to integrate seamlessly with each stride.
                </p>
                <img
                  src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/fbcfdfbd-1d76-47b0-8028-b76d0dbea356/hughherr_1920x1080.jpg?format=2500w"
                  alt="Hugh Herr"
                  className="w-full h-36 object-cover object-top rounded"
                  referrerPolicy="no-referrer"
                />
                <p className="text-[#6a879a] text-xs mt-3 leading-relaxed">
                  The device heralded a new era of responsive, interactive artificial limbs. It also helped make
                  the patent-holder…
                </p>
                <a href={INTERVIEW_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-3 text-[#2F6FA8] text-xs font-sans font-medium hover:underline">
                  Read full article →
                </a>
              </div>

              {/* Right: two stacked thumbnails */}
              <div className="flex flex-col gap-2 w-28 shrink-0">
                <div className="rounded overflow-hidden border border-gray-100">
                  <div className="bg-[#1a1a2e] p-1.5 text-center">
                    <p className="text-white text-[8px] font-sans leading-tight">Learn about<br />Running Foot Grants</p>
                  </div>
                  <img
                    src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/76ec0ecd-d141-4f57-9967-7c8f6ad6d718/Bionic+Skin+Prosthetic+Studio.png?format=2500w"
                    alt="Running Foot Grants"
                    className="w-full h-16 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded overflow-hidden border border-gray-100">
                  <div className="bg-white p-1 text-center border-b border-gray-100">
                    <p className="text-[#c0392b] text-[9px] font-sans font-bold tracking-widest">AMPLITUDE</p>
                  </div>
                  <img
                    src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/a2f5acae-97fb-4c82-a62a-35f3ffc5991e/Compassionate+Patient+Care+-+Powered+by+Science+%28Instagram+Post%29.png"
                    alt="Amplitude Magazine"
                    className="w-full h-20 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

```

### FILE: src/components/ResourceEditor.tsx
```typescript
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ResourceEditor() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      setMessage('Title and URL are required.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'resources'), { title, description, url });
      setTitle('');
      setDescription('');
      setUrl('');
      setMessage('Resource added successfully!');
    } catch (error) {
      setMessage('Error adding resource.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-frost">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-serif text-navy mb-8">Add New Resource</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-4 rounded-[4px] border border-navy/20" />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full p-4 rounded-[4px] border border-navy/20" />
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" className="w-full p-4 rounded-[4px] border border-navy/20" />
          <button type="submit" className="bg-navy text-white px-8 py-3 rounded-[4px] font-sans font-medium hover:bg-prof-blue transition" disabled={loading}>
            {loading ? 'Adding...' : 'Add Resource'}
          </button>
          {message && <p className="text-navy font-sans">{message}</p>}
        </form>
      </div>
    </section>
  );
}

```

### FILE: src/components/ResourceList.tsx
```typescript
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Skeleton } from './ui/Skeleton';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
}

export default function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'resources'), orderBy('title', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      setResources(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    res.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-serif text-navy mb-16 tracking-tight text-center">Resource Center</h2>
        
        <div className="mb-12 flex justify-center">
          <input type="text" placeholder="Search resources..." className="p-4 rounded-[4px] border border-navy/20 w-full md:w-96" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => <div key={i}><Skeleton className="h-40 rounded-[24px]" /></div>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredResources.map(res => (
              <a key={res.id} href={res.url} target="_blank" className="block bg-frost p-8 rounded-[24px] border border-navy/10 hover:border-prof-blue transition">
                <h3 className="text-2xl font-serif text-navy mb-2">{res.title}</h3>
                <p className="text-gray-600 font-sans">{res.description}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

```

### FILE: src/components/ui/Skeleton.tsx
```typescript
export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

```

### FILE: src/components/ValuesAccordion.tsx
```typescript
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const values = [
  { title: 'Innovation', content: 'We push the boundaries of computational design and technology to magnify the skills and abilities of our practitioners and empower our patients to live healthier, happier lives.' },
  { title: 'Integrity', content: 'We practice with honesty and transparency, maintaining the highest ethical standards to cultivate trust with our patients and partners.' },
  { title: 'Partnership', content: 'We believe in building lasting relationships with our patients, physicians, and partners — working collaboratively to achieve the best outcomes for every individual we serve.' },
  { title: 'Personalized Care', content: 'Every patient is unique. We use cutting-edge technology and deep clinical expertise to deliver prosthetic solutions tailored precisely to each individual\'s anatomy and lifestyle.' },
  { title: 'Respect', content: 'We treat every patient, colleague, and partner with dignity and compassion, honoring the trust placed in us at every stage of the care journey.' },
];

export default function ValuesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-frost px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* Left: small image + description text below */}
        <div>
          <img
            src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/6cd0ccf7-0d7d-4f31-a9cd-c32d115a72ce/Lauren+%26+Eric.png"
            alt="Our Values"
            className="rounded-[16px] shadow-lg w-full h-[320px] object-cover mb-8 border-4 border-white"
            referrerPolicy="no-referrer"
          />
          <p className="text-[#5F7182] font-sans text-sm leading-relaxed">
            At BionicSkins™, we uphold a set of core values that guide our daily actions and shape our interactions
            with our patients and partners. Innovation, integrity, partnership, personalized care, and respect are the
            pillars of our organization.
          </p>
        </div>

        {/* Right: heading + accordion */}
        <div>
          <h2 className="text-4xl font-bold font-serif text-navy mb-8 tracking-tight focus:outline-none">Our Values</h2>
          {values.map((v, i) => (
            <div key={i} className="border-b border-navy/20">
              <button
                className="w-full py-5 flex justify-between items-center font-sans text-lg font-bold text-navy text-left hover:text-accent transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {v.title}
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} className="shrink-0 ml-4">
                  <ChevronDown size={22} className="text-navy" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pb-6 font-sans text-base text-[#5F7182] leading-relaxed overflow-hidden"
                  >
                    {v.content}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name?: string;
  id?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userOrEmail: User | string, password?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'bionicskins_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (userOrEmail: User | string, password?: string) => {
    if (typeof userOrEmail === 'string') {
      // Form-based login
      const userData: User = { email: userOrEmail };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } else {
      // OAuth login
      setUser(userOrEmail);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userOrEmail));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

```

### FILE: src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Source+Sans+3:wght@300;400;600&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Source Sans 3", sans-serif;
  --font-serif: "Montserrat", sans-serif;
  --color-navy: #164975;
  --color-prof-blue: #2A5171;
  --color-sky: #5BA8D6;
  --color-frost: #ECF0F4;
  --color-accent: #8CB342;
  --color-gold: #C8A96E;
}

body {
  @apply text-navy antialiased;
}

```

### FILE: src/lib/firebase.ts
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

```

### FILE: src/main.tsx
```typescript
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppWithAuth } from './AppWithAuth';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter basename="/bionicskins">
        <AppWithAuth />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);

```

### FILE: src/pages/About.tsx
```typescript
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import ContentSection from '../components/ContentSection';
import ValuesAccordion from '../components/ValuesAccordion';

export default function About() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">

      {/* Page Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-[#1B2A4A] text-white py-20 px-6 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-serif mb-4 tracking-tight">About Us</h1>
        <p className="text-lg font-sans font-light text-white/70 max-w-2xl mx-auto">
          Compassionate Patient Care — Powered by Science.
        </p>
      </motion.section>

      {/* Welcome section — two columns: text left, video right */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center"
      >
        <div>
          <h2 className="text-5xl font-serif text-navy mb-8 tracking-tight">Welcome To Bionic Skins™</h2>
          <p className="text-xl text-gray-600 font-sans leading-relaxed font-light mb-10">
            Our experienced team of professionals is dedicated to providing compassionate and personalized care to individuals seeking advanced prosthetic solutions. To schedule an appointment, please email or call our office. Patient visits are by appointment only, and we are open Monday through Friday from 9 AM to 5 PM.
          </p>
          <Link
            to="/become-a-patient"
            className="inline-block bg-[#16426C] text-white px-8 py-3.5 font-sans font-medium rounded-[4px] hover:bg-[#2A5171] transition-all duration-300 tracking-wide"
          >
            Get Scheduled
          </Link>
        </div>

        {/* Embedded video */}
        <div className="rounded-[24px] overflow-hidden shadow-2xl aspect-video">
          <iframe
            src="https://www.youtube.com/embed/QrQUGBd3YGs?rel=0&modestbranding=1"
            title="BionicSkins™ — Compassionate Patient Care"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </motion.section>

      {/* Who We Are — image left, text right */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-white px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif text-[#1B2A4A] text-center mb-10">Who We Are</h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <img
              src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/fbcfdfbd-1d76-47b0-8028-b76d0dbea356/hughherr_1920x1080.jpg?format=2500w"
              alt="Professor Hugh Herr"
              className="rounded-[24px] shadow-2xl w-full h-[420px] object-cover object-top"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-3xl font-serif text-[#2A5171] mb-6">Our Legacy</h3>
              <p className="text-lg text-[#6a879a] leading-relaxed">
                Founded by MIT Professor Hugh Herr, BionicSkins™ is an advanced prosthetics provider grounded in 15 years of MIT research. BionicSkins™ has made patient comfort a science. Our unique clinic combines state-of-the-art technology with deep clinical knowledge to make patient comfort our mission.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <ContentSection
        title="Our Method"
        description="Our innovative technology is designed and manufactured from Cone-Beam Computed Tomography imaging, physics-based computation, artificial intelligence, and 3D printing. These scientific methods are used to guide our clinical care team in their mission to provide precise, optimally-fit prostheses."
        imageSrc="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/a2f5acae-97fb-4c82-a62a-35f3ffc5991e/Compassionate+Patient+Care+-+Powered+by+Science+%28Instagram+Post%29.png"
      />

      {/* Our Team — image left, text right */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-[#EEF1F3] px-6"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <img
            src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/76ec0ecd-d141-4f57-9967-7c8f6ad6d718/Bionic+Skin+Prosthetic+Studio.png?format=2500w"
            alt="Our Team"
            className="rounded-[24px] shadow-2xl w-full h-[420px] object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-5xl font-serif text-navy mb-8 tracking-tight">Our Team</h2>
            <p className="text-xl text-gray-600 font-sans leading-relaxed font-light">
              Our experienced team of compassionate professionals believes that everyone deserves the ability to pursue a full and active life. Dedicated to providing our patients with the highest quality care and support, BionicSkins™ is leading the way in advanced and personalized prosthetic delivery.
            </p>
          </div>
        </div>
      </motion.section>

      <ValuesAccordion />
    </div>
  );
}

```

### FILE: src/pages/AdminDashboard.tsx
```typescript
import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Shield, Database, LayoutTemplate, Activity } from 'lucide-react';
import BlogEditor from '../components/BlogEditor';
import ResourceEditor from '../components/ResourceEditor';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'blog' | 'resources' | 'audit'>('blog');

  // Basic TUC Standard check for admin/admin
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials supplied. Access logged.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#EEF1F3] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-100"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-[#E8F3FA] p-4 rounded-full">
              <Lock className="text-[#2A5171]" size={36} />
            </div>
          </div>
          <h2 className="text-2xl font-sans font-semibold text-center text-[#1B2A4A] mb-2">Secure Gateway</h2>
          <p className="text-sm text-center text-[#6a879a] mb-8">Authentication required for administrative access.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1B2A4A] mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded outline-none focus:border-[#2F6FA8] px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B2A4A] mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded outline-none focus:border-[#2F6FA8] px-4 py-2"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button type="submit" className="w-full bg-[#16426C] hover:bg-[#2F6FA8] transition-colors text-white py-3 rounded font-medium mt-2">
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-[#F9F9F9]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1B2A4A] text-white flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <Shield size={24} className="text-[#5BA8D6]" />
          <h2 className="text-xl font-semibold">TUC Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('blog')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'blog' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <LayoutTemplate size={18} /> CMS: Blog
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'resources' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <Database size={18} /> CMS: Resources
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'audit' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <Activity size={18} /> Audit Stream
          </button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full py-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 rounded transition-colors text-sm"
          >
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.2 }}
        >
          {activeTab === 'blog' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-serif text-[#1B2A4A] mb-8 pb-4 border-b">Blog Management</h1>
              <BlogEditor />
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-serif text-[#1B2A4A] mb-8 pb-4 border-b">Resource Management</h1>
              <ResourceEditor />
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h1 className="text-3xl font-serif text-[#1B2A4A] mb-2">System Audit Stream</h1>
               <p className="text-gray-500 mb-8 pb-4 border-b">Tracking Phase 2 compliance and administrative actions.</p>
               <div className="bg-[#1B2A4A] text-green-400 font-mono p-6 rounded-md text-sm overflow-y-auto h-96">
                  <p>19:42:01 - SYSTEM_INIT: Compliance protocol engaged.</p>
                  <p>19:45:12 - AUTH_ATTEMPT: IP Address Localhost.</p>
                  <p>19:45:12 - AUTH_SUCCESS: admin securely negotiated.</p>
                  <p className="text-yellow-400">19:46:00 - WARN: Storage payload requires flush.</p>
                  <p>19:46:15 - RES_UPDATE: "Living with Amputation" pushed to CDN.</p>
                  <br />
                  <p className="text-gray-400 italic">-- End of Live Stream --</p>
               </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

```

### FILE: src/pages/AmputeeResources.tsx
```typescript
import { useState } from 'react';

type ResourceTab = 'foundations' | 'advocacy' | 'adaptive' | 'health';

const resources: Record<ResourceTab, { name: string; description: string; url: string }[]> = {
  foundations: [
    {
      name: 'A Leg Forever Charitable Foundation',
      description: 'A 501(c)(3) nonprofit established by Liz Norden, mother of Boston Marathon Survivors who each lost a leg. Assists amputees (Massachusetts residents only) who lost limbs under tragic circumstances.',
      url: 'https://www.alegforever.com/',
    },
    {
      name: 'Heather Abbott Foundation',
      description: 'Helps provide customized prostheses to those who have suffered limb loss through traumatic circumstances, with many ways to get involved including fundraisers and corporate sponsorship.',
      url: 'https://heatherabbottfoundation.org/',
    },
    {
      name: 'Less Leg More Heart',
      description: 'We spread hope, decrease suffering, and enhance viability within the amputee community by providing customized education, support, services, and supplies.',
      url: 'https://www.lesslegmoreheart.com/',
    },
    {
      name: 'The Born To Run Foundation®',
      description: 'A tax-exempt 501(c)(3) dedicated to providing child amputees with a specific prosthetic that will allow them to run again. Also assists adults navigating this new phase of life.',
      url: 'https://theborntorunfoundation.org/',
    },
    {
      name: "Who Says I Can't",
      description: 'Works with adults and kids with physical disabilities to become involved with active sports, partnering with prosthetics and adaptive equipment providers.',
      url: 'https://whosaysicant.org/',
    },
    {
      name: 'ABLE Now',
      description: "ABLE accounts are the result of a decade-long, cross-disability advocacy effort to enable families to save in a child's name without fear of losing essential services and support.",
      url: 'https://www.ablenow.com/',
    },
  ],
  advocacy: [
    {
      name: 'American Association of People With Disabilities (AAPD)',
      description: 'A national disability-led and cross-disability rights organization advocating for full civil rights for over 60 million Americans with disabilities.',
      url: 'https://www.aapd.com/',
    },
    {
      name: 'American Orthotic and Prosthetic Association (AOPA)',
      description: 'The largest non-profit in O&P with 2,000+ patient care facilities, AOPA fosters relationships with decision-makers, provides education, and advances equality in the profession.',
      url: 'https://www.aopanet.org/',
    },
    {
      name: 'Association of Programs for Rural Independent Living (APRIL)',
      description: 'A national grassroots, consumer-controlled membership organization for centers serving people with disabilities living in rural America.',
      url: 'https://www.april-rural.org/index.php/en/',
    },
    {
      name: 'National Council On Independent Living',
      description: 'The longest-running national cross-disability grassroots organization run by and for people with disabilities, founded in 1982.',
      url: 'https://ncil.org/',
    },
    {
      name: 'National Disability Rights Network',
      description: 'Works in Washington, DC on behalf of Protection and Advocacy Systems (P&As) and Client Assistance Programs (CAPs), the nation\'s largest providers of legal advocacy services for people with disabilities.',
      url: 'https://www.ndrn.org/',
    },
    {
      name: 'Association of Assistive Technology Act Programs',
      description: 'ATAP facilitates coordination of state and territory AT Act Programs nationally and provides technical assistance and support to its members.',
      url: 'https://ataporg.org/',
    },
  ],
  adaptive: [
    {
      name: 'Billy Footwear',
      description: 'Shoes that embody universal design, appealing to and working for everyone — created by two Seattle locals focused on inclusive footwear.',
      url: 'https://billyfootwear.com/pages/about-us',
    },
    {
      name: 'Buck & Buck',
      description: 'Adapts most clothing items for those with amputated limbs, including cutting garments to fit or inserting snap/zipper closures along seams for prosthetic access.',
      url: 'https://www.buckandbuck.com/shop-by-need/amputee-clothing.html',
    },
    {
      name: 'Patti & Ricky',
      description: 'The Adaptive Fashion Marketplace for adults and kids with and without disabilities, chronic conditions, patients, seniors, and caregivers with an inclusive shopping experience.',
      url: 'https://www.pattiandricky.com/',
    },
    {
      name: 'No Limits',
      description: 'A team of disabled designers bringing to life products they wish existed earlier — fashion that lets users live comfortably, confidently, and independently.',
      url: 'https://no-limbits.com/',
    },
    {
      name: 'Reboundwear',
      description: "Provides fashionable and functional clothing for the everyabled. Guided by core values of integrity, authenticity, compassion, and passion.",
      url: 'https://www.reboundwear.com/',
    },
    {
      name: 'Silverts',
      description: 'An amputee clothing line designed to simplify everyday tasks. Provides comfort, style, and independence to those who have undergone surgery or live with an artificial limb.',
      url: 'https://www.silverts.com/shop-by-need/amputee-clothing',
    },
    {
      name: 'Zappos Adaptive',
      description: 'Connects people with products that make life easier. Categories include: Easy-On/Off Shoes, AFO-Friendly, Post-Surgical Wear, Wheelchair-Friendly and many more.',
      url: 'https://www.zappos.com/c/adaptive',
    },
  ],
  health: [
    {
      name: 'Choose PT',
      description: 'Physical therapists are movement experts who help you avoid surgery and prescription drugs, maximize your mobility, manage pain and chronic conditions.',
      url: 'https://www.choosept.com/',
    },
    {
      name: 'Crisis Text Line',
      description: 'Free, 24/7 support for those in crisis. Text HOME to 741741 to connect with a trained Crisis Counselor.',
      url: 'https://www.crisistextline.org/',
    },
  ],
};

const tabs: { key: ResourceTab; label: string }[] = [
  { key: 'foundations', label: 'Foundations & Financial Aid' },
  { key: 'advocacy', label: 'Advocacy Organizations' },
  { key: 'adaptive', label: 'Adaptive Clothing' },
  { key: 'health', label: 'Health & Wellness' },
];

export default function AmputeeResources() {
  const [activeTab, setActiveTab] = useState<ResourceTab>('foundations');

  return (
    <div className="flex-grow bg-[#F9F9F9]">

      {/* Hero */}
      <section className="bg-[#1B2A4A] py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Amputee Resource Center</h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed text-[#E8F3FA]">
          We work to provide different resources for amputees and prosthetic users to help them move better and be more independent.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="bg-[#EEF1F3] border-b border-gray-200 py-6 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-[#1B2A4A] font-bold mb-1">Disclaimer Regarding Patient Resources</p>
          <p className="text-sm text-[#6a879a] leading-relaxed">
            BionicSkins™ strives to support individuals with amputation by offering information about ways to enhance their quality of life. The patient resources listed on our website are intended to provide educational information and a starting point for your research. These resources may include products, services, or organizations that are not directly affiliated with BionicSkins™. Inclusion on this list is not an endorsement by BionicSkins™. Evaluate each resource to determine its suitability for your needs. Consult healthcare professionals for informed decisions.
          </p>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        {/* Tab Nav */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-[#1B2A4A] text-white shadow-sm'
                  : 'bg-white text-[#6a879a] border border-gray-200 hover:border-[#1B2A4A] hover:text-[#1B2A4A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources[activeTab].map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#2F6FA8] transition-all duration-200 flex flex-col"
            >
              <h3 className="text-base font-bold text-[#1B2A4A] mb-3 group-hover:text-[#2F6FA8] transition-colors duration-200 leading-snug">
                {resource.name}
              </h3>
              <p className="text-sm text-[#6a879a] leading-relaxed flex-grow">{resource.description}</p>
              <span className="mt-5 text-xs font-semibold text-[#2F6FA8] group-hover:underline">
                Visit Website →
              </span>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
```

### FILE: src/pages/BecomeAPatient.tsx
```typescript
import { Link } from 'react-router-dom';
import { Phone, Mail, Calendar, FileText } from 'lucide-react';

export default function BecomeAPatient() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">
      
      {/* Hero */}
      <section className="bg-[#1B2A4A] py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-6 tracking-wide text-[#E8F3FA]">Become A Patient</h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed text-gray-200">
          We are excited to announce that we are now accepting new patients! Our experienced team of professionals is dedicated to providing compassionate and personalized care to individuals seeking advanced prosthetic solutions.
        </p>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:w-1/3 space-y-12">
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-serif text-[#1B2A4A] mb-6 border-b border-gray-100 pb-4">Specialties</h3>
              <ul className="space-y-3 text-[#6a879a] font-medium">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Below knee / Above knee</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Partial Foot / Hand</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Below Elbow / Above Elbow</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Knee Disarticulation</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Wrist Disarticulation</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Elbow Disarticulation</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Syme</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Pediatric</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Myoelectric Upper Extremity Devices</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Special Cases</li>
              </ul>
              <p className="text-sm italic text-[#2A5171] mt-6">
                If you find that none of the choices mentioned meet your requirements, kindly reach out to our office for personalized assistance.
              </p>
            </div>

            <div className="bg-[#E8F3FA] p-8 rounded-xl border border-[#D0E2EF]">
              <h3 className="text-2xl font-serif text-[#1B2A4A] mb-4">Accepted Insurance</h3>
              <p className="text-[#4A6478] leading-relaxed">
                We understand that navigating insurance can be complex. Rest assured, we work with a wide range of insurance providers to make your prosthetic care as accessible as possible. To confirm your specific coverage, please don't hesitate to call or email us. It's important to note that insurance coverage can change at any time, so we're always here to help you stay up-to-date.
              </p>
            </div>

          </div>

          {/* Right Column: Steps */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-serif text-[#1B2A4A] mb-10">Steps To Become A Patient</h2>
            
            <div className="space-y-8">
              
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-[#1B2A4A] rounded-full flex items-center justify-center text-white shadow-lg">
                  <Phone size={24} />
                </div>
                <div className="pt-2">
                  <h4 className="text-xl font-bold text-[#1B2A4A] mb-3">1. Contact BionicSkins™</h4>
                  <p className="text-[#6a879a] leading-relaxed">
                    Call the office at <a href="tel:6179327698" className="text-[#2F6FA8] font-medium hover:underline">(1) 617-932-7698</a> or email us at <a href="mailto:info@bionicskins.com" className="text-[#2F6FA8] font-medium hover:underline">info@bionicskins.com</a> to begin the process.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-[#2F6FA8] rounded-full flex items-center justify-center text-white shadow-lg">
                  <Calendar size={24} />
                </div>
                <div className="pt-2">
                  <h4 className="text-xl font-bold text-[#1B2A4A] mb-3">2. Schedule an Appointment</h4>
                  <p className="text-[#6a879a] leading-relaxed mb-2">
                    Operating hours are Monday through Friday from 9 AM to 5 PM.
                  </p>
                  <p className="text-[#6a879a] leading-relaxed">
                    Patient visits are by appointment only. Special appointment accommodations may be made on a case-by-case basis. If you need a different appointment time, please let us know and we will do our best to accommodate your needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-[#5BA8D6] rounded-full flex items-center justify-center text-white shadow-lg">
                  <FileText size={24} />
                </div>
                <div className="pt-2">
                  <h4 className="text-xl font-bold text-[#1B2A4A] mb-3">3. Provide Necessary Information</h4>
                  <p className="text-[#6a879a] leading-relaxed">
                    Please bring your insurance cards, ID, and prescription to your first appointment. This will help us assist you promptly. Our staff may ask for additional information.
                  </p>
                </div>
              </div>

            </div>

            {/* Link out to resources */}
            <div className="mt-16 pt-10 border-t border-gray-200 text-center bg-white p-8 rounded-lg shadow-sm">
              <h4 className="text-2xl font-serif text-[#1B2A4A] mb-4">Patient Resource Center</h4>
              <p className="text-[#6a879a] max-w-2xl mx-auto mb-6">
                We work to provide different resources for amputees and prosthetic users to help them move better and be more independent. Discover information about prosthetic technology, life post-amputation, and how to care for your prosthetic.
              </p>
              <Link to="/amputee-resources" className="inline-block bg-[#16426C] text-white px-8 py-3 rounded hover:bg-[#2F6FA8] transition-colors font-medium">
                Visit Resource Center
              </Link>
            </div>

          </div>
          
        </div>
      </section>

    </div>
  );
}
```

### FILE: src/pages/ClinicalTrials.tsx
```typescript
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ClinicalTrials() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">
      
      {/* Header */}
      <section className="bg-[#1B2A4A] py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Clinical Trials</h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed text-[#E8F3FA]">
          BionicSkins™ is dedicated to advancing prosthetics through research and innovation. We aim to enhance comfort, functionality, and quality of life for amputees.
        </p>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        
        {/* Trial Focus */}
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100 mb-12">
          <div className="inline-block bg-[#E8F3FA] text-[#2F6FA8] font-medium px-4 py-1.5 rounded-full text-sm mb-6 border border-[#D0E2EF]">
            Active Trial: NCT05656924
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-[#1B2A4A] mb-6 leading-relaxed">
            Improving the Health Status of Dysvascular Amputees by Deploying Digital Prosthetic Interface Technology in Combination With an Exercise Intervention
          </h2>
          
          <div className="relative w-full overflow-hidden rounded-lg shadow-md mb-8" style={{ paddingTop: '56.25%' }}>
            <iframe 
               className="absolute top-0 left-0 w-full h-full"
               src="https://www.youtube.com/embed/ErpUS83_Yro" 
               title="Improving the Health Status of Dysvascular Amputees" 
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
            ></iframe>
          </div>
          
          <div className="space-y-6">
            <div>
               <h4 className="text-lg font-bold text-[#1B2A4A] mb-2">Brief Summary:</h4>
               <p className="text-[#6a879a] leading-relaxed">
                 This study explores a new "digital prosthetic interface technology" designed to enhance the health of individuals with lower limb amputations due to type 2 diabetes (dysvascular amputees). It also examines the benefits of combining this technology with a tailored exercise program to improve overall health outcomes.
               </p>
            </div>
            <div>
               <h4 className="text-lg font-bold text-[#1B2A4A] mb-2">Detailed Description:</h4>
               <p className="text-[#6a879a] leading-relaxed">
                 The research compares digital prosthetic interface technology to traditional systems, focusing on health improvements and exercise adherence. Using mobile health technology, the study supports dysvascular amputees in a walking program, aiming to enhance their clinical outcomes.
               </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 p-6 bg-[#F9F9F9] rounded-lg border border-gray-100">
             <div>
               <p className="text-sm font-bold text-[#1B2A4A] uppercase tracking-wider mb-1">Conditions</p>
               <p className="text-[#6a879a]">Diabetes Type 2, Amputation</p>
             </div>
             <div>
               <p className="text-sm font-bold text-[#1B2A4A] uppercase tracking-wider mb-1">Intervention / Treatment</p>
               <p className="text-[#6a879a]">Device: Digital Prosthetic Interface Technology</p>
             </div>
          </div>
          
          <div className="mt-6 text-right">
             <a href="https://clinicaltrials.gov/study/NCT05656924" target="_blank" rel="noreferrer" className="text-[#2F6FA8] hover:underline font-medium text-sm">
               View Full Research Details on ClinicalTrials.gov &rarr;
             </a>
          </div>
        </div>

        {/* Criteria Arrays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Inclusion Criteria */}
          <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#2F6FA8]">
            <h3 className="text-2xl font-serif text-[#1B2A4A] mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-[#2F6FA8]" /> Inclusion Criteria
            </h3>
            <ul className="space-y-4 text-[#6a879a] text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2F6FA8] flex-shrink-0" />
                Unilateral transtibial amputation within the past 4-16 months
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2F6FA8] flex-shrink-0" />
                Etiology secondary to complications of Diabetes Mellitus (DM) type II
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2F6FA8] flex-shrink-0" />
                Current use of a prosthesis, with at least 2 months prior use
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2F6FA8] flex-shrink-0" />
                K2 or K3 level (as determined using the Amputee Mobility Predictor assessment tool)
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2F6FA8] flex-shrink-0" />
                Own a smartphone
              </li>
            </ul>
          </div>

          {/* Exclusion Criteria */}
          <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#6a879a]">
            <h3 className="text-2xl font-serif text-[#1B2A4A] mb-6 flex items-center gap-3">
              <XCircle className="text-[#6a879a]" /> Exclusion Criteria
            </h3>
            <ul className="space-y-4 text-[#6a879a] text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Amputation due to cancer or macrotrauma or acute hemorrhage
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Bilateral amputation
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Medically or surgically unstable contralateral lower extremity as determined by medical criteria (e.g., critical limb ischemia)
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Severe residual limb pain that limits function preventing participation in an exercise-based program
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Medical conditions that would interfere with subject's participation in regular sustained exercise
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Anthropometric characteristics that are not compatible with the technology used to scan the residuum and manufacture the liner and socket (e.g., a residuum circumference greater than 32 inches)
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Current pregnancy
              </li>
            </ul>
          </div>

        </div>

        {/* Participation Info */}
        <div className="bg-[#1B2A4A] text-white p-10 rounded-xl text-center">
           <h3 className="text-2xl font-serif mb-4">Research Participation</h3>
           <p className="text-[#E8F3FA] leading-relaxed max-w-2xl mx-auto mb-8 font-light">
             For inquiries regarding participation in the ongoing prosthetic trials, kindly reach out to us through phone, email, or the designated contact form. If you wish to receive further details about upcoming clinical trials or have queries about the existing trials, please specify your interest in the form. Our team is ready to offer more information and discuss potential opportunities for engagement.
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left bg-white/10 p-6 rounded-lg border border-white/20">
              <div className="col-span-1 md:col-span-2 border-b border-white/20 pb-4 mb-2">
                <p className="text-sm uppercase tracking-widest text-[#5BA8D6] mb-1">Clinical & Research Prosthetist</p>
                <p className="font-semibold text-lg">Devin Finnerty, CPO, MPO</p>
              </div>
              <div>
                <p className="text-sm text-[#5BA8D6] mb-1">Email</p>
                <a href="mailto:research@bionicskins.com" className="hover:text-white transition-colors">research@bionicskins.com</a>
              </div>
              <div>
                <p className="text-sm text-[#5BA8D6] mb-1">Phone</p>
                <a href="tel:6179327698" className="hover:text-white transition-colors">(617) 932-7698</a>
              </div>
           </div>
        </div>

      </section>

    </div>
  );
}
```

### FILE: src/pages/ContactUs.tsx
```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MapPin, Phone, Mail, Clock, FileText } from 'lucide-react';

const contactAccordion = [
  { 
    title: 'Hours', 
    content: 'Our patient appointment hours are Monday - Friday from 9am-5pm. To schedule an appointment, please call 617-932-7698.' 
  },
  { 
    title: 'Parking', 
    content: '- Please refrain from parking under the building in any of the numbered spots, as they are reserved for tenants (unless you require the handicap-designated spaces by the front door).\n- Open and uncovered spots outside the building are available for patient parking.\n- Enter through the front door (directly across from Polatis), located below the 209 Burlington Road Marquee.' 
  },
  { 
    title: 'Suite Access', 
    content: 'Using the Main Staircase:\n- Enter the front door on the ground floor.\n- Proceed straight ahead to the main staircase.\n- Turn right at the top of the stairs.\n- Suite 217 is the first suite on your right.\n\nUsing the Elevator:\n- Enter the elevator in the lobby, located to the left of the main staircase.\n- Press the button for Level 2.\n- Exit the elevator and turn right.\n- Suite 217 is the first suite on your right, past the staircase.' 
  }
];

export default function ContactUs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex-grow bg-[#F9F9F9]">
      
      {/* Header */}
      <section className="bg-[#1B2A4A] py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Contact Us</h1>
      </section>

      <section className="py-16 px-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Info & Accordion */}
          <div className="lg:w-1/2 space-y-10">
            <div>
              <h2 className="text-3xl font-serif text-[#1B2A4A] mb-4">Welcome To BionicSkins™</h2>
              <p className="text-lg text-[#6a879a] leading-relaxed">
                BionicSkins™ is dedicated to providing compassionate patient care and support. We strive to offer a seamless experience for our patients and visitors. If you have any questions, concerns, or need to schedule an appointment, please don't hesitate to contact us. Our friendly and knowledgeable staff is here to assist you in any way we can.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#2F6FA8] mt-1" />
                <div>
                  <h4 className="font-semibold text-[#1B2A4A]">Our Clinic</h4>
                  <p className="text-sm text-[#6a879a]">209 Burlington Rd, Suite 217<br/>Bedford, MA 01730</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-[#2F6FA8] mt-1" />
                <div>
                  <h4 className="font-semibold text-[#1B2A4A]">Phone</h4>
                  <p className="text-sm text-[#6a879a]">(1) 617-932-7698</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-[#2F6FA8] mt-1" />
                <div>
                  <h4 className="font-semibold text-[#1B2A4A]">Email</h4>
                  <p className="text-sm text-[#6a879a]">info@bionicskins.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FileText className="text-[#2F6FA8] mt-1" />
                <div>
                  <h4 className="font-semibold text-[#1B2A4A]">Fax (Prescriptions)</h4>
                  <p className="text-sm text-[#6a879a]">(1) 617-518-5455</p>
                </div>
              </div>
            </div>

            {/* Logistics Accordion */}
            <div className="border-t border-black pt-4 mt-8">
              <h3 className="text-xl font-serif text-[#1B2A4A] mb-4">Visit Logistics</h3>
              {contactAccordion.map((item, i) => (
                <div key={i} className="border-b border-black">
                  <button 
                    className="w-full py-4 flex justify-between items-center text-left text-[1.1rem] font-sans text-[#2F6FA8] hover:text-[#1B2A4A] transition-colors"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    {item.title}
                    <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }}>
                      <ChevronDown className="text-black" strokeWidth={1} size={24} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pt-2 font-sans text-[#1B2A4A] leading-relaxed whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: General Inquiries Form */}
          <div className="lg:w-1/2">
            <div className="bg-[#EEF1F3] rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-serif text-[#1B2A4A] mb-6 border-b border-gray-300 pb-4">General Inquiries</h3>
              <form className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#4A6478] mb-1">First Name <span className="text-[#a4b1bb]">(required)</span></label>
                    <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                  </div>
                  <div>
                    <label className="block text-sm text-[#4A6478] mb-1">Last Name <span className="text-[#a4b1bb]">(required)</span></label>
                    <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#4A6478] mb-1">Email <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                  <input type="email" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                </div>

                <div>
                  <label className="block text-sm text-[#4A6478] mb-1">Message <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                  <textarea rows={5} className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8] resize-y" required></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" className="bg-[#16426C] text-white px-8 py-3 rounded-md font-sans font-medium hover:bg-[#2F6FA8] transition-colors w-full">
                    Submit Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </section>

      {/* Google Maps Embed */}
      <section className="w-full h-[450px] border-t border-gray-200">
        <iframe
          title="BionicSkins™ Location"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2944.2!2d-71.2740!3d42.4930!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e39f6f4e5f5b5f%3A0x0!2s209+Burlington+Rd%2C+Bedford%2C+MA+01730!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
        />
      </section>

    </div>
  );
}
```

### FILE: src/pages/Home.tsx
```typescript
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ContentSection from '../components/ContentSection';
import ValuesAccordion from '../components/ValuesAccordion';
import NewsSection from '../components/NewsSection';

export default function Home() {
  return (
    <div className="flex-grow bg-[#FDFCFA]">
      <HeroSection />

      {/* Welcome section — two columns: text left, video right */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center"
      >
        <div>
          <h2 className="text-5xl font-bold font-serif text-navy mb-8 tracking-tight">Welcome To Bionic Skins™</h2>
          <p className="text-xl text-[#5F7182] font-sans leading-relaxed font-light mb-10">
            Our experienced team of professionals is dedicated to providing compassionate and personalized care to individuals seeking advanced prosthetic solutions. To schedule an appointment, please email or call our office. Patient visits are by appointment only, and we are open Monday through Friday from 9 AM to 5 PM.
          </p>
          <Link
            to="/become-a-patient"
            className="inline-block bg-navy text-white px-8 py-3.5 font-sans font-bold rounded-[4px] hover:opacity-90 transition-all duration-300 tracking-wide shadow-sm"
          >
            Get Scheduled
          </Link>
        </div>

        {/* Embedded video */}
        <div className="rounded-[16px] overflow-hidden shadow-2xl aspect-video border-8 border-white">
          <iframe
            src="https://www.youtube.com/embed/QrQUGBd3YGs?rel=0&modestbranding=1"
            title="BionicSkins™ — Compassionate Patient Care"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </motion.section>

      {/* Who We Are — image left, text right */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 bg-white px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold font-serif text-navy text-center mb-16">Who We Are</h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <img
              src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/fbcfdfbd-1d76-47b0-8028-b76d0dbea356/hughherr_1920x1080.jpg?format=2500w"
              alt="Professor Hugh Herr"
              className="rounded-[16px] shadow-xl w-full h-[480px] object-cover object-top border-4 border-[#FDFCFA]"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-3xl font-bold font-serif text-navy mb-6">Our Legacy</h3>
              <p className="text-lg text-[#5F7182] leading-relaxed font-sans">
                Founded by MIT Professor Hugh Herr, BionicSkins™ is an advanced prosthetics provider grounded in 15 years of MIT research. BionicSkins™ has made patient comfort a science. Our unique clinic combines state-of-the-art technology with deep clinical knowledge to make patient comfort our mission.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <ContentSection 
        title="Our Method" 
        description="Our innovative technology is designed and manufactured from Cone-Beam Computed Tomography imaging, physics-based computation, artificial intelligence, and 3D printing. These scientific methods are used to guide our clinical care team in their mission to provide precise, optimally-fit prostheses." 
        imageSrc="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/a2f5acae-97fb-4c82-a62a-35f3ffc5991e/Compassionate+Patient+Care+-+Powered+by+Science+%28Instagram+Post%29.png"
      />

      {/* Our Team — image left, text right */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 bg-frost px-6"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <img
            src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/76ec0ecd-d141-4f57-9967-7c8f6ad6d718/Bionic+Skin+Prosthetic+Studio.png?format=2500w"
            alt="Our Team"
            className="rounded-[16px] shadow-xl w-full h-[480px] object-cover border-4 border-white"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-5xl font-bold font-serif text-navy mb-8 tracking-tight">Our Team</h2>
            <p className="text-xl text-[#5F7182] font-sans leading-relaxed font-light">
              Our experienced team of compassionate professionals believes that everyone deserves the ability to pursue a full and active life. Dedicated to providing our patients with the highest quality care and support, BionicSkins™ is leading the way in advanced and personalized prosthetic delivery.
            </p>
          </div>
        </div>
      </motion.section>

      <ValuesAccordion />
      <NewsSection />
    </div>
  );
}

```

### FILE: src/pages/OurBlog.tsx
```typescript
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    title: 'Bionic Skins™ Receives 2024 OPGA Freedom Award',
    slug: 'bionic-skins-receives-2024-opga-freedom-award',
    excerpt: 'We are proud to announce that BionicSkins™ has been recognized with the 2024 OPGA Freedom Award for our outstanding contribution to the orthotic and prosthetic field.',
    externalUrl: 'https://www.bionicskins.com/our-blog/bionic-skins-receives-2024-opga-freedom-award',
  },
  {
    title: 'Redefining Prosthetic Comfort and Care',
    slug: 'redefining-prosthetic-comfort-and-care',
    excerpt: 'At BionicSkins™, we believe that every patient deserves a prosthetic experience that truly fits their life. Explore how we are changing the standard of prosthetic delivery.',
    externalUrl: 'https://www.bionicskins.com/our-blog/redefining-prosthetic-comfort-and-care',
  },
  {
    title: 'The Human Touch in Advanced Prosthetics',
    slug: 'the-human-touch-in-advanced-prosthetics',
    excerpt: 'Technology is only as powerful as the people who apply it. Discover how our clinical team combines cutting-edge science with compassionate, patient-centered care.',
    externalUrl: 'https://www.bionicskins.com/our-blog/the-human-touch-in-advanced-prosthetics',
  },
  {
    title: "Medicare's Expanded Coverage for Microprocessor Knees",
    slug: 'medicares-expanded-coverage-for-microprocessor-knees',
    excerpt: "A recent Medicare policy update now includes coverage for microprocessor-controlled prosthetic knees (MPKs) for K2-level amputees. It details the historically high costs of these devices, the new eligibility criteria under Medicare, and additional financial resources available in Massachusetts to assist with prosthetic costs.",
    externalUrl: 'https://www.bionicskins.com/our-blog/medicares-expanded-coverage-for-microprocessor-knees',
  },
  {
    title: 'Embracing Diversity in Prosthetics: A Response to Sexism in the O&P Field',
    slug: 'embracing-diversity-in-prosthetics-a-response-to-sexism-in-the-op-field',
    excerpt: 'Explore the pressing issue of sexism in the orthotic and prosthetic (O&P) profession as we highlight the importance of diversity and inclusion. Features insights from Lauren Houle, CPO, who advocates for a more inclusive and respectful O&P community.',
    externalUrl: 'https://www.bionicskins.com/our-blog/embracing-diversity-in-prosthetics-a-response-to-sexism-in-the-op-field',
  },
];

export default function OurBlog() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">

      {/* Hero */}
      <section className="bg-[#1B2A4A] py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Our Blog</h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed text-[#E8F3FA]">
          Welcome to the Bionic Skins™ blog series, where we explore the latest advancements in prosthetic technology and share key scientific insights with <em>The Science Of Comfort™</em>.
        </p>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <a
              key={post.slug}
              href={post.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Card color band */}
              <div className="h-1.5 bg-gradient-to-r from-[#1B2A4A] to-[#2F6FA8]" />
              <div className="p-7 flex flex-col flex-grow">
                <h2 className="text-xl font-serif text-[#1B2A4A] mb-3 leading-snug group-hover:text-[#2F6FA8] transition-colors duration-200">
                  {post.title}
                </h2>
                <p className="text-sm text-[#6a879a] leading-relaxed flex-grow">{post.excerpt}</p>
                <span className="mt-6 text-sm font-semibold text-[#2F6FA8] group-hover:underline">
                  Read More →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
```

### FILE: src/pages/Policies.tsx
```typescript
import { ShieldCheck, Scale, FileText, HelpCircle } from 'lucide-react';

export default function Policies() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">
      
      {/* Header */}
      <section className="bg-[#1B2A4A] py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Policies & Assurances</h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed text-[#E8F3FA]">
          At BionicSkins™, we understand the importance of data privacy, clinical security, and research transparency.
        </p>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 max-w-4xl mx-auto space-y-12">
        
        <div className="bg-[#E8F3FA] border border-[#D0E2EF] p-6 rounded-lg text-sm text-[#4A6478]">
          <span className="font-bold">Disclaimer:</span> The policies outlined below are accurate to the best of our knowledge as of the date of publication. However, policies may change over time. For the most up-to-date information, please contact <a href="mailto:info@bionicskins.com" className="text-[#2F6FA8] hover:underline">info@bionicskins.com</a>. Thank you for choosing BionicSkins™.
        </div>

        {/* Legal & Privacy Block */}
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100">
          
          <div className="mb-10">
            <h3 className="text-2xl font-serif text-[#1B2A4A] mb-4 flex items-center gap-3">
               <Scale className="text-[#2F6FA8]" size={28} /> Statement of Legality
            </h3>
            <p className="text-[#6a879a] leading-relaxed mb-4">
              BionicSkins™ values the privacy of its users and takes all necessary steps to protect their personal data. We will not sell, rent, or share any private information collected through our website with third parties for advertising or marketing purposes.
            </p>
            <p className="text-[#6a879a] leading-relaxed">
              Our website operates in compliance with all applicable data protection and privacy laws, ensuring that the personal data of our users remains safe and secure. We are committed to maintaining the trust and confidence of our visitors and customers, and we believe that transparency and respect for privacy are fundamental to achieving this.
            </p>
          </div>

          <hr className="border-gray-100 mb-10" />

          <div className="mb-10">
            <h3 className="text-2xl font-serif text-[#1B2A4A] mb-4 flex items-center gap-3">
               <ShieldCheck className="text-[#2F6FA8]" size={28} /> Privacy Policy
            </h3>
            <h4 className="text-lg font-bold text-[#4A6478] mb-6">What personal data do we collect and why do we collect it:</h4>
            
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-[#1B2A4A] mb-2">Contact Forms</h5>
                <p className="text-[#6a879a] leading-relaxed">When you submit information through a contact form on our website, such as your name, email address, and message, we may retain this information to respond to your inquiry, provide support, or improve our services.</p>
              </div>
              <div>
                <h5 className="font-bold text-[#1B2A4A] mb-2">Cookies</h5>
                <p className="text-[#6a879a] leading-relaxed">A cookie is a small data file that a website stores in your web browser.</p>
              </div>
              <div>
                <h5 className="font-bold text-[#1B2A4A] mb-2">Embedded Content</h5>
                <p className="text-[#6a879a] leading-relaxed">
                  The articles presented on this website may contain embedded content, such as images, videos, and articles. It's important to note that the embedded content from external websites operates in the same manner as if the visitor were directly accessing the original website. It's important to note that these websites may engage in data collection practices, including the utilization of cookies, integration of third-party tracking mechanisms, and monitoring of your interactions with embedded content.
                </p>
              </div>
              <div>
                <h5 className="font-bold text-[#1B2A4A] mb-2">Analytics</h5>
                <p className="text-[#6a879a] leading-relaxed">Our website employs analytics tools to enhance your browsing experience and gather valuable insights. By utilizing these tools, we may retain certain information, such as your IP address, browser type, and pages visited, to analyze website traffic and improve its performance. Rest assured that your privacy is respected, and the collected data is used solely for analytical purposes.</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-10" />

          <div>
            <h3 className="text-2xl font-serif text-[#1B2A4A] mb-4 flex items-center gap-3">
               <FileText className="text-[#2F6FA8]" size={28} /> Financial Conflict Of Interest Policy
            </h3>
            <div className="space-y-4 text-[#6a879a] leading-relaxed">
              <p>The protection of human subjects in research is of utmost importance to Bionic Skins and all researchers who actively partner with Bionic Skins under the terms and conditions of sponsored investigations. While Bionic Skins and peer research institutions have instituted multiple, complementary policies to ensure the safety of study subjects and to preserve the integrity of the research itself, in an increasingly complex research environment, a new policy is required to additionally assure that such research is never subordinated to, or compromised by, financial interests or the pursuit of personal gain.</p>
              <p>In accordance with the rule issued by the U.S. Department of Health and Human Services (PHS) that amends regulations on the responsibility of applicants for Promoting Objectivity in Research (42 C.F.R. Part 50, Subpart F) for which PHS funding is sought and Responsible Prospective Contractors (45 C.F.R. Part 94), Bionic Skins herein revises the institutional Financial Conflict of Interest (FCOI) policy to protect against real or apparent biases in study design, data collection and analysis, adverse event reporting, or the presentation and publication of research findings.</p>
              <p>Bionic Skins is required to create and maintain a written and enforced policy stating the procedures for implementing the PHS FCOI regulation and to inform each Investigator of the regulation, of Bionic Skins’ FCOI policy, and of the Investigator’s disclosure responsibilities under the regulation and the policy. Bionic Skins is also responsible for managing, reducing, or eliminating identified conflicts, and reporting identified conflicts to the Public Health Service (PHS) Awarding Component.</p>
              <p>Investigators are responsible for complying with Bionic Skins’ written FCOI policy and for disclosing their Significant Financial Interests (SFIs) to Bionic Skins.</p>
            </div>
          </div>

        </div>

        {/* FAQs */}
        <div>
          <h3 className="text-3xl font-serif text-[#1B2A4A] mb-8 text-center flex items-center justify-center gap-3">
             <HelpCircle className="text-[#2F6FA8]" size={32} /> Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#1B2A4A] mb-2">What is BionicSkins™?</h4>
               <p className="text-[#6a879a] text-sm leading-relaxed">BionicSkins™ is a Prosthetics Clinic dedicated to advancing the field of prosthetics through innovative technology and personalized care.</p>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#1B2A4A] mb-2">What Types Of Prostheses Does BionicSkins™ Specialize In?</h4>
               <p className="text-[#6a879a] text-sm leading-relaxed">BionicSkins™ specializes in advanced prostheses for individuals with all levels of upper and lower limb amputations. Our team has extensive experience in creating custom solutions to meet the unique needs of each patient.</p>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#1B2A4A] mb-2">Does BionicSkins™ Accept Insurance?</h4>
               <p className="text-[#6a879a] text-sm leading-relaxed">BionicSkins™ accepts most major insurance plans. Please contact our office to verify your insurance coverage.</p>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#1B2A4A] mb-2">What Is The Process For Getting A Prosthetic Device?</h4>
               <p className="text-[#6a879a] text-sm leading-relaxed">The process typically involves: Initial consultation, assessment of needs, custom design and fabrication, fitting and adjustment, and ongoing care and support.</p>
             </div>
          </div>
        </div>

      </section>

    </div>
  );
}
```

### FILE: src/pages/ReferAPatient.tsx
```typescript
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const accordionItems = [
  { title: 'Levels Of Prosthetic Intervention Provided', content: 'Details regarding the levels of prosthetic intervention provided.' },
  { title: 'Referring a Patient to BionicSkins™', content: 'Steps and requirements for referring a patient.' },
  { title: 'Additional Information', content: 'Any additional details relevant to the referral process.' },
  { title: 'Benefits of Referring Your Patients to BionicSkins™', content: 'The advantages of partnering with BionicSkins for prosthetic care.' },
];

export default function ReferAPatient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex-grow flex flex-col bg-[#F9F9F9]">
      {/* Hero section */}
      <section className="w-full h-[50vh] md:h-[55vh] relative overflow-hidden">
        <img 
          src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/6cd0ccf7-0d7d-4f31-a9cd-c32d115a72ce/Lauren+%26+Eric.png" 
          alt="Clinic Environment" 
          className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-[#1B2A4A]/10"></div>
      </section>

      {/* Blue Band Section */}
      <section className="w-full bg-[#6a879a] relative min-h-[160px] md:min-h-[220px] flex items-center">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `linear-gradient(135deg, #000 25%, transparent 25%), linear-gradient(225deg, #000 25%, transparent 25%), linear-gradient(315deg, #000 25%, transparent 25%), linear-gradient(45deg, #000 25%, transparent 25%)`,
          backgroundPosition: `12px 0, 12px 0, 0 0, 0 0`,
          backgroundSize: `24px 24px`,
          backgroundRepeat: `repeat`
        }}></div>

        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-[45%] lg:w-[40%]"></div>
          <div className="md:w-[55%] lg:w-[60%] flex items-center pt-8 md:pt-0 pb-8 md:pb-0">
             <h2 className="text-3xl md:text-4xl text-white font-sans font-light tracking-wide md:pl-8">
               Your Patients-Our Privilege
             </h2>
          </div>
        </div>
      </section>

      {/* White Content Section */}
      <section className="w-full bg-white relative pb-20">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col md:flex-row">
          <div className="md:w-[45%] lg:w-[40%] relative">
             <div className="relative md:absolute w-[90%] md:w-full max-w-[500px] mx-auto md:mx-0 md:-top-[280px] mt-[-60px] md:mt-0 left-0 lg:left-8 z-20">
                <div className="w-full aspect-[4/5] rounded-[2rem] md:rounded-[3rem] rounded-t-[8rem] md:rounded-t-[14rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative transform hover:-translate-y-2 transition-transform duration-500">
                   <img 
                     src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/76e86cc7-d8b5-40c1-99a6-44457d5e8e79/Advanced+Prosthetic+Alignment+Technology.png?format=2500w"
                     alt="Tablet Application Display"
                     className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
                   />
                </div>
             </div>
             <div className="hidden md:block w-full max-w-[500px] aspect-[4/5] invisible"></div>
          </div>

          <div className="md:w-[55%] lg:w-[60%] pt-16 md:pt-16 pb-12 md:pl-8">
            <div className="max-w-[700px]">
              <p className="text-[#1B2A4A] text-[1.1rem] leading-[2] mb-8 font-sans">
                <span className="italic">BionicSkins™</span> is thrilled to be your <span className="text-[#2F6FA8] font-medium">trusted partner</span> in providing exceptional prosthetic care to your patients. We understand the importance of seamless collaboration between physicians and the prosthetic clinic to ensure the best possible outcomes for patients.
              </p>
              <p className="text-[#1B2A4A] text-[1.1rem] leading-[2] font-sans">
                At <span className="italic">BionicSkins™</span>, we strive to make the referral process as smooth and efficient as possible. Our dedicated team is here to assist you every step of the way, from the initial referral to the fabrication and fitting of the prosthesis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Process Section (Accordion + Form) */}
      <section className="w-full bg-white pb-32">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-[2.5rem] font-sans font-light text-[#2F6FA8] mb-12">Referral Process</h2>
          
          {/* Accordion */}
          <div className="mb-16 border-t border-black">
            {accordionItems.map((item, i) => (
              <div key={i} className="border-b border-black">
                <button 
                  className="w-full py-4 flex justify-between items-center text-left text-[1.1rem] font-sans text-[#2F6FA8] hover:text-[#1B2A4A] transition-colors"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  {item.title}
                  <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }}>
                    <ChevronDown className="text-black" strokeWidth={1} size={24} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pt-2 font-sans text-[#1B2A4A] leading-relaxed">
                        {item.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-[#F0F3F5] rounded-xl p-8 md:p-12 shadow-sm font-sans">
            <form className="space-y-6">
              
              <div className="space-y-2">
                <p className="text-[#4A6478] text-sm font-medium mb-4">Name Of Person To Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#8c9ca8] mb-1">First Name <span className="text-[#a4b1bb]">(required)</span></label>
                    <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8c9ca8] mb-1">Last Name <span className="text-[#a4b1bb]">(required)</span></label>
                    <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#4A6478] font-medium mb-1">Email <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                <input type="email" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                <div className="flex items-center mt-3 gap-2">
                  <input type="checkbox" id="news" className="w-4 h-4 rounded-sm border-gray-400 cursor-pointer text-[#16426C] focus:ring-[#16426C]" />
                  <label htmlFor="news" className="text-sm text-[#4A6478] cursor-pointer">Sign up for news and updates</label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#4A6478] font-medium mb-1">Phone Contact For Clinician <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                <input type="tel" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
              </div>

              <div>
                <label className="block text-sm text-[#4A6478] font-medium mb-1">Subject <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
              </div>

              <div>
                <label className="block text-sm text-[#4A6478] font-medium mb-1">Message <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                <textarea rows={4} className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8] resize-y" required></textarea>
              </div>

              <div>
                <label className="block text-sm text-[#4A6478] font-medium mb-1">Best Time & Day To Contact You <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
              </div>

              <div className="pt-2">
                <button type="submit" className="bg-[#16426C] text-white px-8 py-3 rounded-md font-sans font-medium hover:bg-[#2F6FA8] transition-colors shadow-sm">
                  Refer A Patient
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>
    </div>
  );
}

```

### FILE: src/pages/Technology.tsx
```typescript
export default function Technology() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">
      
      {/* Hero Banner Area */}
      <section className="bg-navy py-24 px-6 text-center text-white relative">
        <div className="absolute inset-0 bg-[#16426C] opacity-80" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 tracking-wide">
            The Science Of Comfort™
          </h1>
          <p className="text-xl md:text-2xl font-light text-[#E8F3FA] leading-relaxed">
            BionicSkins™ provides prosthetic products and services using digital design and manufacturing to expand accessibility, improve patient outcomes, and maintain medical costs.
          </p>
        </div>
      </section>

      {/* Where's The Science Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-serif text-[#1B2A4A] border-l-4 border-[#2F6FA8] pl-6">
                Where’s The Science?
              </h2>
            </div>
            <div className="md:w-2/3">
              <p className="text-lg text-[#6a879a] leading-[1.8] mb-6">
                Over the past 20 years, remarkable progress has been made in prosthetic technologies, including advances ranging from lighter, stronger materials to powered mechatronics and myoelectric interfaces. However, opportunities remain to further enhance the fit and comfort of prosthetic interfaces with the body.
              </p>
              <p className="text-lg text-[#6a879a] leading-[1.8]">
                Today, many prosthetic sockets are still crafted using artisanal methods — highly skilled and experience-driven processes that can result in excellent outcomes but are often challenging to consistently replicate over time. Our approach builds upon these proven methods by integrating modern computational tools to help optimize fit, comfort, and reproducibility, aiming to make prosthetic care even more accessible, reliable, and tailored to individual needs. By advancing these technologies, we aim to equip prosthetists and providers with enhanced tools and data to support the best possible patient outcomes.
              </p>
              <div className="mt-8 pt-8 border-t border-gray-100 italic text-[#2A5171]">
                Traditional Prosthetic Methods Demonstrated Below
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interstitial Banner */}
      <section className="w-full bg-[#E8F3FA] py-16 px-6 text-center border-y border-[#2F6FA8]/20">
         <h3 className="text-2xl md:text-3xl font-serif text-[#1B2A4A] max-w-4xl mx-auto leading-relaxed">
           "The digital memory created will provide for a faster and more efficacious delivery model."
         </h3>
      </section>

      {/* Noninvasive Interface Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row-reverse gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-serif text-[#1B2A4A] border-r-0 md:border-r-4 border-l-4 md:border-l-0 border-[#2F6FA8] pl-6 md:pl-0 md:pr-6 text-left md:text-right">
                Noninvasive Mechanical Interface
              </h2>
            </div>
            <div className="md:w-2/3">
              <p className="text-lg text-[#6a879a] leading-[1.8] mb-6">
                BionicSkins™ builds upon long-standing prosthetic design techniques by augmenting the fitting process with data-driven, physics-based algorithms to help optimize comfort and fit. Each interface design is initiated using the specific internal and external anatomy of the user via Computed Tomography (CT) imaging. 
              </p>
              <p className="text-lg text-[#6a879a] leading-[1.8] mb-6">
                Precise geometries of internal and external structures are digitally reconstructed from the medical images to form a user-specific, digital 3D biomechanical model. The initial interface design is combined with the biomechanical model and iteratively altered using a physics-based approach to produce skin-interface pressures conducive to a comfortable and healthy fit.
              </p>
              <p className="text-lg text-[#6a879a] leading-[1.8]">
                The optimized design can subsequently be manufactured using 3D printing techniques and tested in as little as 24 hours from the time of the patient’s scan. This process is entirely computational, and therefore a digital memory of each design can be created and stored for future use.
              </p>
            </div>
        </div>
      </section>

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
    "noEmit": true,
    "types": ["vite/client"]
  }
}

```

### FILE: vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: mode === 'production' ? '/bionicskins/' : '/',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) return 'firebase';
              if (id.includes('lucide-react')) return 'lucide';
              if (id.includes('motion')) return 'motion';
              return 'vendor';
            }
          }
        }
      }
    },
  };
});

```

