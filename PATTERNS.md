# PATTERNS.md v2.0 — TUC Reusable Engineering Patterns (Refined)

> Pattern library for Daniel Frempong Twum / Techbridge University College (TUC).
> **Reference this file when implementing patterns — do not read it every session.**
> **See PATTERN SELECTION CHECKLIST below to find the right pattern for your project.**
> Core directives → see CLAUDE.md

---

## QUICK START: PATTERN SELECTION CHECKLIST

**At project initiation, check which apply:**

- [ ] Is this a **React / interactive app**? → Use **Pattern 1** (User Journey) + **Pattern 2** (Frontend HTML)
- [ ] **Deploying to Plesk**? → Use **Pattern 7-Extended** (Plesk Vite Deployment with Safe Deployment)
- [ ] **Using Google Sign-In**? → Use **Pattern 9** (OAuth 2.0) + **Pattern 10** (Standardised Login Forms)
  - [ ] **Also using local authentication**? → Add **Pattern 5** (Dual-Auth Logout)
- [ ] **Vision API / OCR task** (document scanning, handwriting)? → Use **Pattern 4** (Gemini API)
- [ ] **Mobile target** (iOS App Store / Google Play)? → Add **Pattern 3** (Capacitor Mobile)
- [ ] **Building a form-heavy app**? → Use **Pattern 10** (Login Forms) + **Pattern 12** (Form Security)
- [ ] **Writing tests**? → Use **Pattern 13** (Playwright Testing Standards)
- [ ] **Managing shared credentials** across projects? → Use **Pattern 14** (Environment Variable Management)

**Time saved by selecting patterns at start:** ~6 hours per project.

---

## PATTERN INDEX (8 Core + 6 Specialised)

### Core Patterns (Used in 80%+ of projects)

| # | Pattern | Purpose | Used By |
|---|---------|---------|---------|
| 1 | Standard User Journey | State machine + UI flow for interactive apps | All TUC React apps (52+) |
| 2 | Frontend HTML Standards | Meta tags, SEO, analytics, theming | All index.html files |
| 7-Extended | **Safe Plesk Vite Deployment** | Deploy to Plesk with health checks, no BOM corruption | All Plesk Vite + React apps |
| 9 | Secure OAuth 2.0 | Authorization Code flow with backend token exchange | 23+ TUC apps with Google Sign-In |
| 10 | Standardised Login Forms | Reusable, themable form component | Blueprint, BiochemAI, WillPro, Email-Drafter |

### Specialised Patterns (Project-specific)

| # | Pattern | Purpose | Used By |
|---|---------|---------|---------|
| 3 | Capacitor Mobile | iOS/Android deployment from React web | LearnAI, BioChemAI, ThesisAI, LuxThumb (pending) |
| 4 | Google Gemini API | Vision, OCR, structured JSON responses | Glucose, Brainiac-Challenge |
| 5 | Dual-Auth Logout | Logout from both OAuth + local session | Glucose, dual-auth apps |
| 6 | Glucose Learnings | Project-specific insights (health data, scanning) | Health-data apps, form patterns |
| 12 | **Form Security** | Identity binding, read-only fields, defaults | All form-heavy apps (20+) |
| 13 | **Playwright Testing** | Accessibility + E2E + health checks | All tested apps (50+) |
| 14 | **Environment Variable Management** | Share credentials safely across projects | All projects using .env |
| 15 | **React Component Resilience** | Safe terminal rendering, safe fetch parsing | Dashboard, data-heavy apps |
| 16 | **Vite Chunk Splitting** | Prevent monolithic 500kb+ index.js bundles | All Vite/React projects |

---

## PATTERN 1: STANDARD USER JOURNEY (BioChemAI Template)

Every TUC application must capture a complete, convincing user flow from entry to exit.
The **BioChemAI pattern** is the reference implementation.

### Architecture

State machine with progressive disclosure and smooth transitions.

```
Entry → Auth Check → Mode Selection → Workflow State → Results / Exit
```

### Mode System (AppMode Enum)

- `Chat` — Conversational AI interaction (default entry point)
- `Quiz` — Structured assessment with generation + progression
- `Test` — Self-testing with animated results
- `Docs` — Reference material
- `Admin` — Password-gated admin panel
- `Voice` — Voice input variant

### State Machine Pattern (Per Mode)

```typescript
type QuizState = 'setup' | 'loading' | 'active' | 'results' | 'error';
```

- **Setup** — User configures (topic, difficulty, question count)
- **Loading** — Visual spinner with contextual message ("Generating 10 questions...")
- **Active** — Interactive progression (user answers, immediate feedback)
- **Results** — Summary with score, breakdown, restart option
- **Error** — Graceful recovery with actionable message

### Persistence Pattern

```typescript
const LOCAL_STORAGE_KEYS = {
  messages: 'biochemai_messages',
  level: 'biochemai_level',
  theme: 'biochemai_theme',
};

useEffect(() => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.messages, JSON.stringify(messages));
}, [messages]);
```

### Beautiful Loading States

- **Animated dots** — Three-dot pulse for "thinking" states
- **Contextual copy** — "BioChemAI is preparing 10 questions for you" (not "Loading...")
- **Visual containment** — Spinner inside rounded card with theme colours
- **No jarring transitions** — Use `opacity + transform`, not `scale/bounce`

### Error Handling (User-Facing)

```
Catch → Display error message → Offer "Try Again" button → Reset state to 'setup'
```

Show what went wrong, not technical details. One clear recovery action. Return to last safe state.

### How to Apply to a New Project

**Step 1: Define modes** — What are the primary user interactions?
```
ai-exam-generator: Setup → Building → ExamActive → Grading → Results
brainiac-challenge: Browse → AttemptChallenge → Scoring → LeaderboardView
```

**Step 2: Implement the state machine**
```typescript
type AppState = 'setup' | 'loading' | 'active' | 'results';
const [state, setState] = useState<AppState>('setup');
```

**Step 3: Add localStorage persistence**
```typescript
useEffect(() => {
  localStorage.setItem('my_app_state', JSON.stringify({ state, data }));
}, [state, data]);
```

**Step 4: Build loading states** — Animated spinner + contextual message + rounded card

**Step 5: Results visualisation** — Score, breakdown, real-time test results, restart button

**Step 6: Test the full flow**
```
Welcome → Configure → Loading → Active → Results → Restart → Welcome
Verify: localStorage persists across refresh · Theme switches in all states · Error recovery works
```

### Visual Checklist (The "Beautiful" Test)

When clicking the Test button:
- ✅ Spinner animates smoothly (no jank)
- ✅ Each test result slides in with transition
- ✅ Status badges (RUNNING / PASS / FAIL) appear in real-time
- ✅ Screenshot visualisation shows what the test verified
- ✅ No layout shift — cards maintain consistent width
- ✅ Loading message matches test name
- ✅ Results flow down naturally, like a waterfall

### Project Status

| Project | Status |
|---|---|
| biochemai | ✅ Reference implementation |
| brainiac-challenge | 🟡 Needs state machine |
| ai-exam-generator | 🟡 Needs loading + results states |
| agenticai-masterclass | 🟡 Needs checkpoint persistence |
| academic-integrity-detector | 🟡 Needs upload → analysis → report flow |

---

## PATTERN 2: FRONTEND HTML STANDARDS (index.html)

Apply to all React/frontend `index.html` files for consistency.

### Meta Tags Block

```html
<!-- TUC Standard Meta -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />

<!-- SEO -->
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<meta name="author" content="Techbridge University College" />
<meta name="publisher" content="TUC ICT Department" />
<link rel="canonical" href="https://..." />
<meta name="robots" content="index, follow" />

<!-- Geographic (Accra) -->
<meta name="geo.region" content="GH-AA" />
<meta name="geo.placename" content="Accra, Ghana" />
<meta name="geo.position" content="5.6037;-0.1870" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:locale" content="en_GH" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@TUCGhana" />
<meta name="twitter:creator" content="@KudjoTwum" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />

<!-- Branding -->
<meta name="theme-color" content="#..." />
<meta name="msapplication-TileColor" content="#..." />
```

### Google Analytics

```html
<!-- Before styles in <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-FKXTELQ71R"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-FKXTELQ71R');
</script>
```

### Font Loading (Before Styles)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

### CSS Variables & Theming

```css
:root,
[data-theme='dark'] {
  --color-background-main: #0f1117;
  --color-foreground: #e2e8f0;
  --color-primary: #6c63ff;
}

[data-theme='light'] {
  --color-background-main: #ffffff;
  --color-foreground: #1a202c;
  --color-primary: #5a52d5;
}

[data-theme='high-contrast'] {
  --color-background-main: #000000;
  --color-foreground: #ffffff;
  --color-primary: #ffff00;
}

body {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### Font Family System

```css
.font-playfair { font-family: 'Playfair Display', serif; }   /* h1, h2, h3 */
.font-outfit { font-family: 'Outfit', sans-serif; }           /* secondary headings */
.font-space-grotesk { font-family: 'Space Grotesk', monospace; } /* technical/mono */
/* Default body: Inter */
```

### Theme Persistence (Inline Script, Before DOM Renders)

```html
<script>
  (function() {
    const theme = localStorage.getItem('{project}-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

### Animations

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in { animation: fadeIn 0.3s ease forwards; }
.animate-slide-in { animation: slideIn 0.3s ease forwards; }
```

---

## PATTERN 3: CAPACITOR MOBILE DEPLOYMENT

For any React web app targeting iOS App Store / Google Play.

### Quick Setup (30 min)

```bash
pnpm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx capacitor init --appName "App Name" --appId com.techbridge.appname --webDir dist
npx capacitor add ios
npx capacitor add android
pnpm build
npx capacitor sync
```

### package.json Scripts

```json
{
  "scripts": {
    "build": "vite build",
    "build:web": "vite build && capacitor copy ios && capacitor copy android",
    "build:ios": "pnpm build:web && npx capacitor build ios",
    "build:android": "pnpm build:web && npx capacitor build android",
    "ios:open": "open ios/App/App.xcworkspace",
    "android:open": "open android",
    "mobile:sync": "capacitor sync"
  }
}
```

### Critical Paths

- **iOS:** `ios/App/App.xcodeproj/` + `.plist` configuration
- **Android:** `android/app/build.gradle` + `AndroidManifest.xml`
- **Config:** `capacitor.config.ts` (app ID, version, web directory)
- **Privacy:** Must be public URL (e.g., `https://domain.com/privacy.html`)

### Required Docs (Create in `/docs/`)

1. `APP_STORE_GUIDE.md` — Complete iOS + Google Play submission steps  [Sonnet]
2. `MOBILE_BUILD_GUIDE.md` — Build workflow, debugging, CI/CD examples [Sonnet]
3. `APP_ICONS_GUIDE.md` — 1024px → all sizes, placement for both platforms [Haiku]
4. `APPSTORE_READY.md` — Pre-submission checklist ✅/❌ [Haiku]
5. `public/privacy.html` — GDPR/CCPA/GDPA compliant [Sonnet]

### Timeline

| Phase | Duration |
|---|---|
| Setup Capacitor + platforms | 30 min |
| Create docs (3 guides) | 2 hours |
| Create icons (external design) | 1–2 hours |
| Test on devices | 1 hour |
| Submit to stores | 1 hour |
| iOS approval | 3–5 days |
| Android approval | 1–2 hours |

### Note

Process is identical across TUC apps. Once written for one project, copy `APP_STORE_GUIDE.md` and adapt app ID + name only.

---

## PATTERN 4: GOOGLE GEMINI API INTEGRATION

For AI vision tasks: document scanning, OCR, handwriting extraction.

### Model Selection

✅ Use: `gemini-3.1-pro-preview` — stable, supports streaming + JSON schema validation  
❌ Avoid: `gemini-1.5-flash` — throws 404 on free tier  
❌ Avoid: `gemini-2.0-flash-exp` — experimental, not available for structured responses  

### Implementation Pattern

```typescript
import { GoogleGenAI, Type } from '@google/genai';

const client = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

const responseStream = await client.models.generateContentStream({
  model: 'gemini-3.1-pro-preview',
  contents: {
    parts: [
      { text: 'Your instruction prompt...' },
      {
        inlineData: {
          data: base64ImageData,
          mimeType: 'image/png',
        },
      },
    ],
  },
  config: {
    temperature: 0,                           // Deterministic for data extraction
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          field1: { type: Type.STRING },
          field2: { type: Type.STRING },
        },
        required: ['field1'],
      },
    },
  },
});

// Collect streamed response
let text = '';
for await (const chunk of responseStream) {
  if (chunk.text) text += chunk.text;
}
const results = JSON.parse(text);
```

### Key Points

- Must use `generateContentStream` (not `generateContent`) for structured responses
- Schema defined via `Type` enum, not TypeScript interfaces
- Response arrives as valid JSON — no markdown stripping needed
- `temperature: 0` ensures deterministic, reproducible extraction

### Proven In Production

Glucose project (deployed 2026-05-16): extracts 20+ handwritten glucose readings from a single photo page.

---

## PATTERN 5: DUAL-AUTH LOGOUT (OAuth + Local Session)

### The Problem

Apps with two-layer auth:
1. **OAuth Layer** — Google Sign-In, stored in `localStorage`
2. **Admin Layer** — Local password, stored in `sessionStorage`

If only the admin logout is called, the OAuth session persists → user remains authenticated → admin auto-grants on next visit → cycles back instead of exiting.

### The Solution

```typescript
import { useAuth } from './contexts/AuthContext';    // OAuth logout
import { useAdmin } from './contexts/AdminContext';  // Local admin logout

function AppContent() {
  const { logout } = useAuth();
  const { adminLogout } = useAdmin();

  const handleLogout = () => {
    adminLogout();  // Clear local session + sessionStorage
    logout();       // Clear OAuth + localStorage
  };

  return <button onClick={handleLogout}>Sign Out</button>;
}
```

### State Transitions

```
[Authenticated + Admin]
    ↓ logout clicked
[adminLogout() clears sessionStorage]
    ↓ AND
[logout() clears localStorage]
    ↓
[LoginView — fresh OAuth flow required]
```

**Origin:** Glucose project, 2026-05-16 — logout was cycling users to password screen because OAuth session persisted.

---

## PATTERN 6: GLUCOSE LEARNINGS (Project-Specific)

**Note:** Generalisable insights have been extracted to Pattern 12 (Form Security). This pattern documents Glucose-specific knowledge only.

### Health Data Privacy

- ❌ Never display user health data on login screen (privacy risk)
- ✅ Health data visible only post-authentication on dashboard
- ✅ Readings scanned from photos, stored encrypted in IndexedDB

### Glucose Scanning Specifics

- Camera flash required for consistent OCR
- Handwriting recognition works best with 150+ DPI images
- Device orientation: portrait for readability, landscape for multi-page scanning

### Integration with Pattern 4 (Gemini API)

Glucose uses Gemini to extract readings from meter photos. See Pattern 4 for technical details.

---

## PATTERN 7-EXTENDED: SAFE PLESK VITE DEPLOYMENT

**MERGED PATTERN:** Combines old Pattern 7 (Plesk Vite Deployment) + Pattern 11 (PowerShell Fixes)

**Projects:** peace-vinyl, tuc-ai-lab, glucose, all Plesk React apps  
**Platform:** Ubuntu + Plesk + Apache  
**Target:** ai-tools.techbridge.edu.gh/[project]/

### Pre-Flight Checklist (Do This First)

- [ ] `.env.local` exists with all required variables
- [ ] `VITE_GOOGLE_CLIENT_ID` set (if using OAuth)
- [ ] `vite.config.ts` has correct `outDir`
- [ ] `package.json` has `build` script
- [ ] SSH key accessible at `~/.ssh/id_rsa`
- [ ] Remote host reachable (`ping root@domain`)

### Deployment Script Pattern (deploy.ps1)

```powershell
param([string]$RemoteHost = "root@66.226.72.199", [string]$RemotePath = "...", [switch]$Build = $false)

# 1. Copy .env.local from shared source (glucose pattern)
Copy-Item "../glucose/.env.local" "./.env.local" -Force

# 2. Build locally
if ($Build) { pnpm build }

# 3. Verify build output
if (-not (Test-Path "dist/index.html")) {
  Write-Error "Build failed: dist/index.html not found"
  exit 1
}

# 4. Create remote directory & clean
ssh ... "mkdir -p $RemotePath && rm -rf $RemotePath/*"

# 5. Copy dist/ via SCP (bash required on Windows)
bash -c "scp -r dist/* $RemoteHost:$RemotePath"

# 6. Write .htaccess via SSH heredoc (NO PowerShell BOM)
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /$PROJECT/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /$PROJECT/index.html [QSA,L]
</IfModule>
"@
$htaccessContent | ssh ... "cat > '$RemotePath/.htaccess'"

# 7. Verify .htaccess has no BOM and no EOF marker
ssh ... "head -c 3 '$RemotePath/.htaccess' | od -c | grep -q BOM && echo 'ERROR: BOM detected' || echo 'OK: No BOM'"

# 8. Set permissions
ssh ... "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath"

# 9. Health checks
ssh ... "apache2ctl configtest"  # Should return "Syntax OK"
ssh ... "curl -s -o /dev/null -w '%{http_code}' https://ai-tools.techbridge.edu.gh/$PROJECT/"  # Should be 200

Write-Host "✅ Deployment complete: $RemotePath"
```

### CRITICAL: .htaccess & PowerShell BOM Issue

**Problem:** PowerShell heredoc syntax adds UTF-8 BOM to file content  
**Symptom:** Apache 500 error, `.htaccess` not parsed  
**Solution:** Use PowerShell here-string piped to SSH (see code above)

**WRONG:**
```powershell
ssh $host "cat > .htaccess << 'EOF'
<IfModule>...
EOF"
```
Result: File contains literal `EOF` string + BOM.

**CORRECT:**
```powershell
$htaccessContent = @"
<IfModule>...</IfModule>
"@
$htaccessContent | ssh ... "cat > .htaccess"
```
Result: No BOM, clean file.

### SPA Routing Rules

All Vite + React apps need rewrite rules to route non-file/non-directory URLs to `index.html`:

```apache
RewriteBase /project/
RewriteCond %{REQUEST_FILENAME} -f [OR]     # Is file
RewriteCond %{REQUEST_FILENAME} -d          # Is directory
RewriteRule ^ - [L]                         # Serve as-is
RewriteRule ^ /project/index.html [QSA,L]   # Route to SPA entry
```

### HTML Head Pattern (index.html)

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="[Project description for SEO]" />
  <meta name="theme-color" content="#[brand-color]" />
  <title>[Project Name] — [Tagline]</title>
</head>
```

### Directory Naming

- ❌ Avoid special characters: `peace-&-one-love-vinyl`
  - Breaks shell path resolution
  - Issues with bash `cd` and npm paths
  
- ✅ Use dashes only: `peace-vinyl`
  - Works across all shells
  - Cleaner in URLs: `/peace/` not `/peace-&-one-love-vinyl/`

### Environment Variable Sharing

TUC projects share credentials via central `.env.local` files:

```
glucose/.env.local  ← Source of truth (Google OAuth, Gemini API)
peace-vinyl/        ← Copy at deploy time (deploy.ps1 does this)
markai/             ← Same credentials, same app
```

Benefits:
- Single point of update for org-wide credentials
- Consistent OAuth redirect URIs
- One Gemini API quota shared safely

### Deployment Verification

After SCP transfer, verify:

```bash
# Files transferred
ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/

# .htaccess parsed (no BOM, proper syntax)
apache2ctl configtest  # Should return OK

# Permissions correct
stat /var/www/vhosts/.../peace/

# HTTP status test
curl -s -o /dev/null -w "%{http_code}\n" https://ai-tools.techbridge.edu.gh/peace/
```

Expected: HTTP 200, files present, owned by `techbridge.edu.gh_md:psacln`, permissions 755/644.

### Common Issues & Fixes

| Issue | Symptom | Fix |
|---|---|---|
| UTF-8 BOM in .htaccess | Apache 500 error, blank page | Use here-string pipe method above |
| Wrong deploy path | Files in wrong location, 404 | Verify with `ssh root@host 'ls /var/www/.../actual-path/'` |
| Missing .env vars | "VITE_GOOGLE_CLIENT_ID undefined" | Ensure .env.local exists before build |
| Dist/ empty after build | Health check fails immediately | Run `pnpm build` locally, check vite.config.ts |
| Vite build hangs indefinitely | Powershell block with `vite build` on Windows | Change `vite build` script to `node node_modules/vite/bin/vite.js build` |
| .htaccess syntax error | Apache refuses to start | Verify with `apache2ctl configtest` |
| SSH timeout | "Connection refused" | Check SSH key, verify host reachable |

---

## PATTERN 9: SECURE OAUTH 2.0 (AUTHORIZATION CODE FLOW)

### Why Not Implicit Flow?

**NEVER use response_type='token'** in production. Implicit flow exposes access tokens in the browser URL:
- Appear in browser history
- Get logged in access logs
- Vulnerable to XSS attacks
- Violate OAuth 2.0 security best practices

**Always use response_type='code'** with a backend token exchange.

### OAuth 2.0 Setup Checklist (Do This BEFORE Coding)

- [ ] **Google Cloud Project Created**
  - Project name: [your-app]
  - Enable APIs: Google+ API, Oauth 2.0

- [ ] **OAuth 2.0 Credentials Configured**
  - Application Type: Web Application
  - Client ID generated: `xxxxx.apps.googleusercontent.com`
  - Client Secret generated: `GOCSPX-xxxxx` (KEEP SECRET)
  - Authorised JavaScript origins: `https://ai-tools.techbridge.edu.gh`, `http://localhost:3000`
  - Authorised redirect URIs: `https://ai-tools.techbridge.edu.gh/[app]/callback` (exact match required)

- [ ] **Frontend Environment Variables Set**
  - `VITE_GOOGLE_CLIENT_ID` = your Client ID
  - `VITE_GOOGLE_REDIRECT_URI` = exact redirect path

- [ ] **Backend Environment Variables Set**
  - `GOOGLE_CLIENT_ID` = your Client ID
  - `GOOGLE_CLIENT_SECRET` = your Client Secret (server-side only)

- [ ] **Plesk WAF Rule 210580 Exempted** (if applicable)
  - Modsecurity rule 210580 blocks OAuth `scope` parameter
  - Add vhost directive: `SecRuleRemoveById 210580` in auth callback path
  - See Pattern 7-Extended for details

- [ ] **Frontend Code Has Proper Imports**
  - Check `LoginView.tsx`: imports `APP_PATH` from `appContext.ts`
  - Does NOT construct `undefined` in redirect URI
  - Vite transpiles `undefined` silently if not imported

- [ ] **Backend `dotenv.config()` Loaded**
  - `server.ts` top line: `import dotenv from "dotenv"; dotenv.config();`
  - Verify startup log shows: "Env variables injected"

### Architecture

```
Frontend (React) → Google OAuth → Authorization Code
     ↓
Frontend receives code + state → Backend Token Exchange
     ↓
Backend (Node.js) ↔ Google OAuth servers → id_token + access_token
     ↓
Backend extracts user info → Returns user object to frontend
     ↓
Frontend stores user in sessionStorage (NOT localStorage for auth)
```

### Implementation Checklist

**Frontend (React/AuthContext.tsx):**
- [ ] Generate random state, store in sessionStorage (CSRF protection)
- [ ] Request code via: `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&...state=...&prompt=select_account`
- [ ] On callback, extract code + state from URL params
- [ ] Validate state matches sessionStorage value
- [ ] POST code to `/api/auth/google/token` endpoint
- [ ] Receive user object, store in sessionStorage (NOT localStorage)
- [ ] Clear oauth_state from sessionStorage after successful exchange

**Backend (Node.js/Express):**
- [ ] POST `/api/auth/google/token` endpoint
- [ ] Extract code from request body
- [ ] Exchange code with Google: `POST https://oauth2.googleapis.com/token` with client_id, client_secret, code
- [ ] Decode id_token JWT (do NOT rely on access_token)
- [ ] Extract user info: id, email, name from JWT payload
- [ ] Return user object as JSON
- [ ] NEVER expose GOOGLE_CLIENT_SECRET in response (only client_id in frontend)

### Code Patterns

**Frontend:**
```typescript
const exchangeCodeForUser = async (code: string) => {
  const response = await fetch('/api/auth/google/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
  });
  const { user } = await response.json();
  setUser(user);
  sessionStorage.setItem('peace_user', JSON.stringify(user));
};
```

**Backend:**
```typescript
app.post('/api/auth/google/token', async (req, res) => {
  const { code } = req.body;
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.VITE_GOOGLE_REDIRECT_URI,
    }),
  });
  const tokens = await tokenResponse.json();
  const user = decodeJWT(tokens.id_token);
  res.json({ user: { id: user.sub, email: user.email, name: user.name } });
});
```

### Environment Variables

**Frontend (.env.local):**
```
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/peace/callback
```

**Backend (.env):**
```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx (NEVER commit or expose)
```

### Callback Path Convention (TUC Monorepo)

Apps are mid-migration between two callback path conventions. Check which your deployed bundle uses:

```bash
ssh root@host "grep -r 'callback' /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/[app]/assets/*.js | head -1"
```

- **Old style:** `/<app>/auth/google/callback` — peace, biochemai, willpro, glucose, groove-streamer
- **New flat style:** `/<app>/callback` — ai-lab

**Rule:** Before editing Google Cloud Console's Authorised redirect URIs list, verify which path your deployed app actually uses. Deleting a URI that any live app still uses will break that app immediately.

### Common Issues & Diagnostic Order

| Issue | Symptom | Diagnostic Order |
|---|---|---|
| `redirect_uri_mismatch` 400 | Access blocked page | 1. Decode `authError=` base64. 2. Byte-compare against Google Cloud Console. 3. Re-type entries (hidden chars?). |
| 403 Forbidden on callback path | Backend never reached | 1. Check Plesk WAF log. 2. Add `SecRuleRemoveById 210580` if 210580 triggered. |
| 404 Not Found on `/api/auth...`| Nginx proxy bypass | 1. Verify frontend `fetch()` uses app proxy prefix (e.g. `/glucose/api/`) instead of absolute `/api/`. |
| 500 error on token exchange | Backend can't reach Google | 1. Check `GOOGLE_CLIENT_SECRET` set. 2. Verify internet connectivity. |
| `dotenv` vars undefined | Env variables not loaded | 1. Check `server.ts` top: `import dotenv; dotenv.config();` 2. Restart server. |
| Undefined in redirect URI | URI shows `undefined/callback` | 1. Check `LoginView.tsx` imports `APP_PATH` from context. 2. Rebuild and deploy. |

### Multi-App SPA Callback Pattern (Sub-Apps on the Shared ai-tools Origin) — CEMENTED

**Context:** `ai-tools.techbridge.edu.gh` hosts many SPA sub-apps at `/<app>/`. A single shared Node backend (`localhost:3003`) handles OAuth token exchange and APIs under `/ai-lab/api/`. **Its GET callback hardcodes `res.redirect('/ai-lab/')`** — so it cannot be the callback for any other app (it would dump users on AI-Lab). Do **not** proxy a sub-app's callback to that backend.

**The standard flow for a new sub-app** (reference impl: `dictation-app/src/auth/`):

1. **`appContext.ts`** — `APP_NAME = '<app>'`, `APP_PATH = '/<app>/'`, add `'<app>': '/<app>/'` to `getAppDashboardPath`. Call `setOAuthAppContext('<app>')`.
2. **Auth request** (`AuthGate`/`LoginView`) — `redirect_uri = ${origin}${APP_PATH}callback` → flat per-app `/<app>/callback`.
3. **Google Cloud Console** — add `https://ai-tools.techbridge.edu.gh/<app>/callback` to the **shared client** (`537671076222-…`) Authorised redirect URIs. **Never remove** other apps' URIs.
4. **WAF** — the OAuth `scope` param (contains `https://…`) trips Comodo/ModSecurity **rule 210580** → 403 on the callback. Add `<app>` to the `LocationMatch` in
   `/var/www/vhosts/system/ai-tools.techbridge.edu.gh/conf/vhost_ssl.conf`:

   ```apache
   <LocationMatch "^/(<app>|ai-lab|…)/(callback|auth/google/callback)">
     SecRuleRemoveById 210580
   </LocationMatch>
   ```

   `apache2ctl configtest && systemctl reload apache2`. **Also add it via the Plesk panel** (Apache & nginx → Additional HTTPS directives) so it survives a domain reconfigure.
5. **Do NOT proxy `/<app>/callback`** in nginx — let the SPA serve it (`.htaccess` SPA routing to `index.html`).
6. **Client-side exchange** — the SPA `AuthContext` reads `code`+`state` from the URL, validates `state`, then `POST /ai-lab/api/auth/google/token { code, redirectUri }` (the shared backend's client-side endpoint). `redirectUri` **must equal** the auth-request + Console URI.
7. **On success** — store session (IndexedDB) and `window.history.replaceState({}, '', APP_PATH)` to strip `?code/&state` and land on `/<app>/`.

**The three redirect_uri's must be byte-identical:** auth request · token-exchange body · Google Console. **WAF 210580** is the `scope`-param 403. **Backend redirect hardcode** is why sub-apps never proxy their callback.

---

## PATTERN 10: STANDARDISED LOGIN FORMS (FormLoginView)

**Projects:** techbridge-ai-blueprint, biochemai, willpro, ai-email-drafter (OAuth-only exception)  
**File:** `src/components/FormLoginView.tsx` (shared template)  
**Purpose:** Consistent authentication UI across form-heavy TUC apps

### Overview

Four recent TUC projects implemented login pages with OAuth 2.0 authorization-code flow. Each had:
- Custom styling (colours, spacing, typography)
- Duplicate form logic (identical inputs, validation, error handling)
- Inconsistent spacing and visual hierarchy

**Solution:** Reusable `FormLoginView` component that accepts theme configuration and supports:
- Light theme (Blueprint, WillPro)
- Dark glassmorphic theme with SVG watermark (BiochemAI)
- Optional registration mode (Blueprint, BiochemAI) or login-only (WillPro)
- All forms use authorization-code OAuth flow
- Google button always positioned OUTSIDE the form (prevents form submission conflicts)

### Architecture

```
FormLoginView (configurable component)
├── appName, appSubtitle
├── primaryColorHex, buttonHoverClass
├── backgroundClass, cardBgClass
├── inputBorderClass, inputFocusRingClass
├── onGoogleLogin (callback)
├── onLocalLogin (identifier, password) → Promise
├── onRegister? (username, email, password) → Promise [optional]
├── supportRegister = true | false
└── watermarkSvg? (React node) [optional]
```

### Implementation Pattern

**Step 1: Copy FormLoginView to your app**
```powershell
Copy-Item "..\techbridge-ai-blueprint\src\components\FormLoginView.tsx" `
          "..\your-app\src\components\FormLoginViewBase.tsx"
```

**Step 2: Create your app-specific LoginView wrapper**
```typescript
// your-app/src/components/LoginView.tsx
import { FormLoginView } from './FormLoginViewBase';
import { useAuth } from '../contexts/AuthContext';

export const LoginView: React.FC = () => {
  const { login, register } = useAuth();

  const handleGoogleLogin = () => {
    // OAuth logic: build redirect URI, generate state, redirect to Google
  };

  return (
    <FormLoginView
      appName="Your App Name"
      appSubtitle="Your subtitle"
      primaryColor="text-blue-700"
      primaryColorHex="#2563eb"
      borderColorClass="border border-blue-200"
      inputBorderClass="border border-slate-300"
      inputFocusRingClass="focus:ring-4 focus:ring-blue-100"
      inputFocusBorderClass="focus:border-blue-600"
      buttonHoverClass="hover:bg-blue-700"
      backgroundClass="bg-gradient-to-br from-slate-50 to-slate-100"
      cardBgClass="bg-white"
      onGoogleLogin={handleGoogleLogin}
      onLocalLogin={async (id, pw) => {
        const result = await login(id, pw);
        if (!result.success) throw new Error(result.message);
      }}
      onRegister={async (un, em, pw) => {
        const result = await register(un, em, pw);
        if (!result.success) throw new Error(result.message);
      }}
      supportRegister={true}  // or false for login-only
    />
  );
};
```

**Step 3: Configure theme for your brand**

Light theme (Blueprint, WillPro):
```typescript
primaryColor="text-[#your-color]"
primaryColorHex="#your-hex"
backgroundClass="bg-gradient-to-br from-slate-50 to-slate-100"
cardBgClass="bg-white"
inputBorderClass="border border-gray-300"
```

Dark glassmorphic theme (BiochemAI):
```typescript
primaryColor="text-[#a78bfa]"
backgroundClass="bg-[#0a0f1e]"
cardBgClass="bg-[rgba(255,255,255,0.05)] backdrop-blur-lg"
inputBorderClass="border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)]"
textColorClass="text-white"
labelColorClass="text-[rgba(255,255,255,0.8)]"
subtitleColorClass="text-[rgba(255,255,255,0.6)]"
watermarkSvg={<YourSVGWatermark />}
```

### Standardised Layout & Spacing

All forms follow this structure:
```
Header (app name + subtitle)
  ↓
Card (max-width: 28rem / 448px)
  ├─ Title ("Welcome Back" / "Create Account")
  ├─ Subtitle
  ├─ Form
  │  ├─ [Login Mode]: Identifier input
  │  ├─ [Register Mode]: Username, Email inputs
  │  ├─ Password input
  │  ├─ [Register Mode]: Confirm Password input
  │  └─ Error message (if any)
  ├─ Submit button (w-full)
  ├─ Divider ("Or")
  └─ Google OAuth button [OUTSIDE FORM] ← Critical
  ├─ Mode toggle link ("Sign up" / "Sign in") [if supportRegister=true]
```

### Google Button Positioning (CRITICAL)

**WRONG:**
```tsx
<form>
  <input... />
  <button type="submit">Submit</button>
  <button onClick={googleLogin}>Google</button>  ← Inside form!
</form>
```
Problem: Clicking Google button submits form with empty fields first.

**CORRECT:**
```tsx
<form>
  <input... />
  <button type="submit">Submit</button>
</form>

<div className="my-6"><!-- Divider --></div>

<button type="button" onClick={googleLogin}>  ← type="button", OUTSIDE form
  Google
</button>
```

FormLoginView implements this correctly. Never move the Google button back inside the form.

### Testing Checklist

- [ ] Inputs have icons (User, Lock) left-aligned
- [ ] Labels are uppercase, bold, small (text-xs)
- [ ] Focus rings appear on input focus
- [ ] Password field shows/hides with eye icon
- [ ] Google button is outside form, has type="button"
- [ ] Error message appears below form (red text)
- [ ] Form disables on submit (disabled opacity)
- [ ] Mode toggle hides if supportRegister=false
- [ ] Watermark renders at low opacity (does not interfere)
- [ ] Light and dark variants maintain readability

---

## PATTERN 12: FORM SECURITY BEST PRACTICES (NEW)

**Extracted from:** Pattern 6 (Glucose Learnings)  
**Projects:** All form-heavy apps (20+)  
**Purpose:** Identity binding, read-only fields, secure defaults

### Identity-Bound Fields (Read-Only)

When a field's value is auto-populated from OAuth user data, make it read-only:

```typescript
// If Patient Name auto-populates from OAuth user.fullName:
<input
  value={patientName}
  readOnly
  className="cursor-default opacity-75"
/>
```

Prevents accidental or malicious edits to identity-tied fields.

### Default Values Across Reload

Preserve app defaults when user reloads:

```typescript
// Preserve defaults across reload
setDoctorName(profile.doctorName || 'Dr Yacoba Atiase');
```

### Form Submission Pattern

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Validate all required fields
  if (!patientName || !readings.length) {
    setError('Complete all required fields');
    return;
  }
  
  // 2. Disable form during submission
  setIsSubmitting(true);
  
  try {
    // 3. Submit data
    await submitForm({ patientName, readings, doctorName });
    
    // 4. Clear form and show success
    setReadings([]);
    setSuccess(true);
  } catch (err) {
    // 5. Show error, form remains filled (user can retry)
    setError(err.message);
  } finally {
    setIsSubmitting(false);
  }
};
```

### Field Validation Order

1. **Required fields** — Empty check
2. **Type validation** — Correct data type
3. **Length validation** — Within bounds
4. **Pattern validation** — Matches expected format (email, date, etc.)
5. **Cross-field validation** — Interactions between fields (e.g., start date before end date)

### Error Messages (User-Friendly)

- ❌ "ValidationError: email field regex failed"
- ✅ "Please enter a valid email address (example@domain.com)"

### Console Logging for Form State

```typescript
const logFormState = (label: string) => {
  console.log(`[FORM] ${label}:`, {
    patientName,
    readingCount: readings.length,
    isValid: validateForm(),
    isSubmitting,
    error: error || 'none',
  });
};
```

Always log before form submission, after data change, on error.

---

## PATTERN 13: PLAYWRIGHT TESTING STANDARDS (NEW)

**Projects:** All tested apps (50+)  
**Purpose:** Accessibility + E2E + health checks  

### Test File Structure

```
src/
├── components/
│   ├── LoginView.tsx
│   └── LoginView.test.tsx        ← Test next to component
├── pages/
│   ├── Dashboard.tsx
│   └── Dashboard.test.tsx
└── __tests__/
    ├── e2e/
    │   ├── auth.test.ts
    │   ├── workflow.test.ts
    │   └── accessibility.test.ts
    └── integration/
        ├── api.test.ts
        └── database.test.ts
```

### Accessibility Testing (a11y)

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, getViolations } from 'axe-playwright';

test('LoginView meets WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/login');
  await injectAxe(page);
  
  const violations = await getViolations(page);
  expect(violations).toEqual([]);
});

test('Form inputs have associated labels', async ({ page }) => {
  await page.goto('/login');
  
  const emailInput = page.locator('input[name="email"]');
  const emailLabel = page.locator('label[for="email"]');
  
  await expect(emailLabel).toBeVisible();
});
```

### E2E Testing (Happy Path)

```typescript
test('Complete login flow', async ({ page }) => {
  // 1. Navigate
  await page.goto('/login');
  await expect(page).toHaveTitle(/Welcome/);
  
  // 2. Fill form
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'Password123!');
  
  // 3. Submit
  await page.click('button[type="submit"]');
  
  // 4. Verify success state
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

### Error State Testing

```typescript
test('Show error on invalid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'wrong@example.com');
  await page.fill('input[name="password"]', 'WrongPassword');
  await page.click('button[type="submit"]');
  
  const errorMsg = page.locator('[role="alert"]');
  await expect(errorMsg).toContainText('Invalid credentials');
});
```

### Health Check Testing

```typescript
test('API health check', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
  
  const body = await response.json();
  expect(body).toHaveProperty('status', 'ok');
  expect(body).toHaveProperty('timestamp');
});
```

### Running Tests

```bash
# Run all tests
pnpm exec playwright test

# Run with UI mode (visual debugging)
pnpm exec playwright test --ui

# Run specific test file
pnpm exec playwright test src/__tests__/e2e/auth.test.ts

# Generate coverage report
pnpm exec playwright test --reporter=html
```

### package.json Scripts

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report"
  }
}
```

---

## PATTERN 14: ENVIRONMENT VARIABLE MANAGEMENT (NEW)

**Projects:** All projects using `.env`  
**Purpose:** Share credentials safely across projects

### The Problem

TUC projects need shared credentials (Google OAuth, Gemini API) but must not expose secrets.

### The Solution: Central .env.local

```
glucose/.env.local  ← Source of truth
├── VITE_GOOGLE_CLIENT_ID (shared across projects)
├── VITE_GOOGLE_REDIRECT_URI (per-project, same client ID)
└── VITE_GEMINI_API_KEY (shared across projects)
```

Other projects copy from glucose on deploy:

```powershell
# In deploy.ps1 of any project
Copy-Item "../glucose/.env.local" "./.env.local" -Force
```

### .env File Organization

**Frontend (.env.local — shared parts)**
```
# Shared: These are same across all TUC projects
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
VITE_GEMINI_API_KEY=AIzaSy...

# Per-project: These vary by app
VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/[app]/callback
VITE_APP_NAME=[app-name]
```

**Backend (.env — server-side only)**
```
# Server-side secrets NEVER exposed to frontend
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Shared reference (for verification only)
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

### Best Practices

1. **Never commit `.env` files** — Add to `.gitignore`
2. **Use `.env.example`** — Document required variables
3. **Server-side secrets only** — Frontend gets no `_SECRET` vars
4. **Per-environment files** — `.env.local` (dev), `.env.staging`, `.env.production`
5. **Validate at startup** — Check all required vars present

### Validation Script

```typescript
// server.ts
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'DATABASE_URL',
  'REDIS_URL',
];

const missing = requiredEnvVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  throw new Error(`Missing required env vars: ${missing.join(', ')}`);
}

console.log('✅ All required env variables present');
```

### Rotation Plan

When API keys expire:

1. **Generate new key** in Google Cloud / API provider
2. **Update glucose/.env.local** (source of truth)
3. **Run deploy scripts** for all dependent projects
4. **Verify all projects** still authenticate
5. **Document rotation date** in PATTERNS.md
6. **Archive old key** (for audit trail)

---

## PATTERN 15: REACT COMPONENT RESILIENCE (NEW)

**Projects:** ci-cd-dashboard, data-heavy apps  
**Purpose:** Prevent unhandled React UI crashes from asynchronous dependencies and malformed API responses.

### Safe Xterm.js Initialization

**The Problem:** `xterm-addon-fit` attempts to read DOM container dimensions immediately. If called precisely during React mount before the layout engine has sized the `div`, it throws `TypeError: Cannot read properties of undefined (reading 'dimensions')`, causing the entire React tree to unmount/freeze.

**The Solution:** Defer the `fit()` calculation to the end of the event loop with `setTimeout`, allowing layout computation to finish, and wrap in a `try/catch`.

```typescript
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
term.open(terminalRef.current);

// ❌ WRONG: Crashes UI if dimensions aren't ready
// fitAddon.fit();

// ✅ CORRECT: Defer until layout is complete
setTimeout(() => {
  try { fitAddon.fit(); } catch (e) {}
}, 50);
```

### Safe JSON Parsing from Reverse Proxies

**The Problem:** If an API endpoint fails, goes offline, or is misrouted, Nginx (or another proxy) will often return an HTML error page (e.g., `<!DOCTYPE HTML>... 404 Not Found`). Calling `await res.json()` directly throws an unhandled `SyntaxError`, breaking the UI.

**The Solution:** Fetch the response as `text` first, then safely parse.

```typescript
// ❌ WRONG: Crashes if proxy intercepts with an HTML 404/500 page
// const data = await (await fetch('/api/data')).json();

// ✅ CORRECT: Safe parsing
try {
  const res = await fetch('/api/data');
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    setData(data);
  } catch (parseErr) {
    console.error('Invalid JSON response:', text.substring(0, 100));
  }
} catch (netErr) {
  console.error('Network error', netErr);
}
```

---

## PATTERN 16: VITE CHUNK SPLITTING OPTIMIZATION (NEW)

**Projects:** tuc-ai-lab-catalog, ai-email-drafter, any Vite-based app  
**Purpose:** Eliminate the `Some chunks are larger than 500 kBs` build warning and improve caching/loading performance.

### The Monolithic Bundle Problem

**The Problem:** By default, Vite bundles your application code AND all dependencies (`node_modules`) into a single massive `index-[hash].js` file. This produces build warnings and forces users to re-download massive libraries (like React or Firebase) every time you change a single line of your own UI code.

**The Solution:** Use Rollup's `manualChunks` in `vite.config.ts` to separate vendor libraries into distinct, cacheable chunks.

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Check if the module is from node_modules
          if (id.includes('node_modules')) {
            // Group React core libraries
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // Group large icon libraries
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Group heavy SDKs (like Gemini, Firebase, etc.)
            if (id.includes('@google/genai')) {
              return 'vendor-google';
            }
            // Fallback for everything else
            return 'vendor-core'; 
          }
        }
      }
    }
  }
});
```

**Why this works:** Browsers can cache `vendor-react.js` and `vendor-core.js` for months. When you push an update to your app components, users only download a tiny `index-[newhash].js` file containing just your changes.

---

## CROSS-PATTERN REFERENCES

**Using OAuth?** → Start with Pattern 9, then Pattern 10 (login form)  
**Deploying to Plesk?** → Use Pattern 7-Extended (includes health checks)  
**Building a form?** → Use Pattern 10 (login forms) + Pattern 12 (form security)  
**Testing?** → Use Pattern 13 (Playwright standards)  
**Sharing credentials?** → Use Pattern 14 (environment variables)  
**Heavy Bundle?** → Use Pattern 16 (Vite chunk splitting)  

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 2026 | Original 11 patterns |
| **2.0** | **30 May 2026** | **Merged 7+11, added 12/13/14, cross-references, quick-start checklist** |

---

*Last updated: 30 May 2026 — Daniel Frempong Twum / TUC ICT*  
*Core session directives → see CLAUDE.md*
