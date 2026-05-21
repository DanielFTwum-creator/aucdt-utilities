# PATTERNS.md — TUC Reusable Engineering Patterns

> Pattern library for Daniel Frempong Twum / Techbridge University College (TUC).
> Reference this file when implementing the patterns below — do not read it every session.
> Core directives → see CLAUDE.md

---

## PATTERN INDEX

| # | Pattern | Projects |
|---|---|---|
| 1 | Standard User Journey (BioChemAI) | All TUC React apps |
| 2 | Frontend HTML Standards | All index.html files |
| 3 | Capacitor Mobile Deployment | LearnAI, BioChemAI, ThesisAI, LuxThumb |
| 4 | Google Gemini API Integration | Glucose, any vision/OCR task |
| 5 | Dual-Auth Logout | Any app with OAuth + local session |
| 6 | Glucose Project Learnings | General React + IndexedDB apps |
| 7 | Plesk Vite Deployment (Peace Vinyl Template) | All Plesk Vite + React apps |
| 8 | Safe Deployment (SSH Heredoc + Health Checks) | All deploy scripts |
| 9 | Secure OAuth 2.0 (Authorization Code Flow) | Peace Vinyl, TUC AI Lab, all OAuth apps |
| 10 | Standardised Login Forms (FormLoginView) | Blueprint, BiochemAI, WillPro, Email-Drafter |
| 11 | PowerShell Deployment Script Fixes | All Plesk/Apache apps |

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

## PATTERN 6: GLUCOSE PROJECT LEARNINGS (React + IndexedDB)

### Security: Login Screen Privacy

- ❌ Never pre-populate email/username from stored state
- ❌ Never show personalised greetings on the login screen (shoulder-surfing risk)
- ✅ Keep login screen generic: "Welcome Back" — no names, no hints about returning users
- ✅ Personalised greeting goes post-auth only: dashboard header ("Good to see you, [name]")
- ✅ Safe middle ground: avatar initial + dismissible "Not you?" prompt (no plaintext email)

### IndexedDB + React State Sync

- Always log state transitions to debug mismatches between UI count and DB count
- Use prefixed log labels: `[DB]`, `[APP]`, `[SCAN]`, `[MANUAL]`
- Track: before-save count → after-upsert → after-fetch → after-state-update
- Common issue: stale `rows` state lagging behind DB due to async `setState`

### Total Count Bug Pattern

```typescript
// ❌ Wrong — filtered data doesn't reflect total
const total = filteredRows.length;

// ✅ Correct — always count from unfiltered source
const total = rows.length;
```

The month selector filters the grid, but stats must always reflect the complete dataset.

### Duplicate Handling on Rescan

```typescript
const existingRow = rows.find(r => r.date === formattedDate);
if (existingRow) {
  // Update: merge with new data, preserve createdAt, update updatedAt
} else {
  // Create: assign new ID, set createdAt = now
}
// Log updates vs new creations separately
```

### Month Auto-Selection After Scan

- ✅ Auto-select the scanned month on **first import** (user sees new data immediately)
- ❌ Do NOT auto-select on **manual entry** for a different month (preserves user context)
- Different UX patterns for different flows — be explicit about intent

### Read-Only Auto-Populated Fields

```typescript
// If Patient Name auto-populates from OAuth user.fullName:
<input
  value={patientName}
  readOnly
  className="cursor-default"
/>
```

Prevents accidental edits to identity-tied fields.

### Default Values in Admin Panel

```typescript
// Preserve defaults across reload
setDoctorName(profile.doctorName || 'Dr Yacoba Atiase');
```

### Console Logging Strategy

```
[SCAN] Starting extraction...
[DB]   Fetching existing rows (before: 12)
[DB]   Upserted 3 new, updated 1 existing
[APP]  State updated (after: 15)
[APP]  Rendering grid with 15 rows
```

Always log: before state → action → after state.

---

---

## PATTERN 7: PLESK VITE DEPLOYMENT (Peace Vinyl Template)

**Projects:** peace-vinyl, any Vite + React app on Plesk  
**Platform:** Ubuntu + Plesk + Apache  
**Target:** ai-tools.techbridge.edu.gh/[project]/

### Deployment Script Pattern (deploy.ps1)

```powershell
param([string]$RemoteHost = "root@66.226.72.199", [string]$RemotePath = "...", [switch]$Build = $false)

# 1. Copy .env.local from shared source (glucose pattern)
Copy-Item "../glucose/.env.local" "./.env.local" -Force

# 2. Build locally
if ($Build) { pnpm build }

# 3. Create remote directory & clean
ssh ... "mkdir -p $RemotePath && rm -rf $RemotePath/*"

# 4. Copy dist/ via SCP (bash required on Windows)
bash -c "scp -r dist/* $RemoteHost:$RemotePath"

# 5. Write .htaccess via SSH heredoc (CRITICAL: avoids PowerShell BOM)
ssh ... "cat > $RemotePath/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /$PROJECT/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /$PROJECT/index.html [QSA,L]
</IfModule>
EOF"

# 6. Set permissions
ssh ... "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath"
```

### Critical: .htaccess & PowerShell BOM Issue

**Problem:** PowerShell heredoc syntax (`@"..."@`) adds UTF-8 BOM to file content  
**Symptom:** Apache 500 error, `.htaccess` not parsed  
**Solution:** Write `.htaccess` **directly on server** via SSH heredoc (`cat > file << 'EOF'`)

```powershell
# ❌ WRONG — adds BOM, Apache rejects file
@"<IfModule...>"@ | ssh ... "cat > $RemotePath/.htaccess"

# ✅ CORRECT — no BOM, Apache parses correctly
ssh ... "cat > $RemotePath/.htaccess << 'EOF'
<IfModule...>
EOF"
```

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

- ❌ Avoid special characters in project names: `peace-&-one-love-vinyl`
  - Breaks shell path resolution in scripts
  - Issues with bash `cd` and npm path handling
  
- ✅ Use dashes only: `peace-vinyl`
  - Works across all shells (bash, PowerShell, Windows)
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

---

## PATTERN 8: SAFE DEPLOYMENT (SSH Heredoc + Health Checks)

**Scope:** All Vite + React projects on Plesk/Ubuntu  
**File:** `deploy.template.ps1` + `deploy.config.template.json`  
**Platform:** Windows PowerShell calling SSH/bash

### The Problem Solved

**1. UTF-8 BOM Corruption**
- PowerShell `@"..."@` heredoc adds UTF-8 BOM to output
- `.htaccess` with BOM → Apache 500 error, silent rewrite engine failure
- Users see blank page or infinite redirects, no clear error

**2. Incomplete Deployments**
- No build verification — ships corrupted or empty dist/
- No health checks — assumes success without testing
- Silent SSH failures — script exits normally even if files didn't transfer
- .htaccess syntax never validated

**3. Missing Configuration**
- Hard-coded paths, no reusable pattern
- Each project reinvents the wheel with slightly different bugs
- No consistency in pre-flight or error handling

### The Solution

**deploy.template.ps1** — 6-step structured deployment:

```
Step 1: Load & validate configuration
Step 2: Pre-flight checks (.env files, package.json, build script)
Step 3: Build locally (optional, with error capture)
Step 4: Verify build output (index.html present, not empty)
Step 5: Deploy to remote (SSH + SCP + health checks)
Step 6: Health checks (file presence, .htaccess syntax, HTTP routing)
```

**Key Safeguards:**

1. **SSH Heredoc for .htaccess** (no BOM)
   ```powershell
   # ❌ Wrong
   $htaccess | ssh ... "cat > .htaccess"
   
   # ✅ Correct
   ssh ... "cat > .htaccess << 'EOF'
   ... content ...
   EOF"
   ```

2. **Pre-flight Checks** (fail fast, before deployment)
   - .env.local exists
   - Required env vars present (VITE_GOOGLE_CLIENT_ID, etc.)
   - package.json has build script
   - Output directory will exist post-build

3. **Build Verification** (empty dist/ is caught)
   - Check dist/ exists
   - Check dist/ is not empty
   - Check index.html present specifically
   - Report file count and size

4. **Health Checks** (post-deploy validation)
   - Verify index.html exists on remote
   - Test .htaccess syntax via `apache2ctl configtest`
   - Curl health check URL and verify HTTP 200
   - Wait 5 sec for server to settle

5. **Clear Error Messages** (no suppression with `2>/dev/null`)
   - Show actual SSH errors, not silence them
   - Fail early and loudly if remote mkdir fails
   - Report HTTP status code and timeouts clearly

### Configuration File Pattern

**deploy.config.json** (copy from template, customise per project):

```json
{
  "projectName": "peace-vinyl",
  "remoteHost": "root@techbridge.edu.gh",
  "deployPath": "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace",
  "buildTool": "pnpm",
  "outputDir": "dist",
  "requiredEnvVars": ["VITE_GOOGLE_CLIENT_ID"],
  "healthCheckUrl": "https://ai-tools.techbridge.edu.gh/peace/"
}
```

### Usage

1. Copy `deploy.template.ps1` to project root as `deploy.ps1`
2. Create `deploy.config.json` with project settings
3. Run: `.\deploy.ps1 -ConfigFile deploy.config.json -Build`

Optional flags:
- `-DryRun` — simulate deployment without SSH/SCP
- `-SkipHealthCheck` — skip remote validation (use only if health checks fail for infra reasons)

### Deployment Review Checklist (8 Items)

Before pushing any project deploy.ps1, verify:

- [ ] Configuration file matches actual remote paths (`ssh root@host 'ls /var/www/.../project/'`)
- [ ] Build tool is correct (pnpm, not npm)
- [ ] Output directory matches Vite config (`vite.config.ts` + actual build output)
- [ ] Required env vars are listed (check .env.local for API keys)
- [ ] .htaccess base path matches deploy path (e.g., `/peace/` for `/peace-vinyl/`)
- [ ] Health check URL is public and accessible (no auth walls)
- [ ] SSH host format is correct (`root@domain` or `user@ip`)
- [ ] Pre-flight checks catch missing files (run with invalid .env, verify failure)

### Common Issues & Fixes

| Issue | Symptom | Fix |
|---|---|---|
| UTF-8 BOM in .htaccess | Apache 500 error, blank page | Use SSH heredoc, not PowerShell `@"..."@` |
| Wrong deploy path | Files in wrong location, 404 | Verify with `ssh root@host 'ls /var/www/.../actual-path/'` |
| Missing .env vars | "VITE_GOOGLE_CLIENT_ID undefined" in browser | Ensure .env.local on local machine before build |
| Dist/ empty after build | Health check fails immediately | Run `pnpm build` locally, check vite.config.ts for outDir |
| .htaccess syntax error | Apache refuses to start | Test locally: `cd dist && apache2ctl -t` (if Apache on local machine) |
| SSH timeout | "Connection refused" or hangs | Check SSH key at `~/.ssh/id_rsa`, verify host reachable (`ping root@domain`) |

### References

- `deploy.template.ps1` — Template implementation (copy this to each project)
- `deploy.config.template.json` — Configuration template
- PATTERNS.md §7 — .htaccess & BOM issue deep dive
- `DEPLOY_GUIDE.md` — User-facing deployment instructions

---

## PATTERN 9: SECURE OAUTH 2.0 (AUTHORIZATION CODE FLOW)

### Why Not Implicit Flow?

**NEVER use response_type='token'** in production OAuth flows. The implicit flow exposes access tokens in the browser URL, which:
- Appear in browser history
- Get logged in access logs
- Are vulnerable to XSS attacks
- Violate OAuth 2.0 security best practices

**Always use response_type='code'** with a backend token exchange.

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
  const user = decodeJWT(tokens.id_token); // Extract from JWT
  res.json({ user: { id: user.sub, email: user.email, name: user.name } });
});
```

### Environment Variables

**Frontend (.env.local):**
```
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/peace/auth/google/callback
```

**Backend (.env):**
```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx (NEVER commit or expose)
```

### Common Issues

| Issue | Symptom | Fix |
|---|---|---|
| Gmail account selector not showing | Only one Google account option | Add `prompt=select_account` to OAuth URL |
| state mismatch error | OAuth callback rejected | Ensure state stored/validated in sessionStorage |
| 500 error on token exchange | Backend can't reach Google | Check GOOGLE_CLIENT_SECRET is set, verify internet |
| User object undefined | Login completes but app crashes | Check backend returns JSON, not HTML error |
| `redirect_uri_mismatch` Error 400 from Google | Access blocked page | Decode the `authError=` base64 from the Google error URL to see the exact `redirect_uri` Google received. Byte-compare against the Authorised redirect URIs list in Google Cloud Console. Re-type entries to rule out hidden characters. |
| Frontend builds an `undefined`-containing redirect URI | URI shows `/undefinedcallback` or similar | Check `LoginView.tsx` imports — Vite silently transpiles `undefined` identifiers. Must import `APP_PATH` (and any other URL builders) from `appContext.ts`. |
| 403 Forbidden on `/<app>/callback` after Google succeeds | Backend never reached | Comodo WAF rule **210580** flags `.profile` substring in OAuth `scope` query param. Add Plesk vhost directive (NOT `.htaccess`): `<LocationMatch "^/<app>/(callback\|auth/google/callback)"> SecRuleRemoveById 210580 </LocationMatch>` via Plesk → Apache & nginx Settings → Additional Apache directives (HTTPS field). |
| Backend log: "Could not determine client ID from request" | Token exchange fails | `server.ts` needs explicit `import dotenv from "dotenv"; dotenv.config();` at top. The runtime does not auto-load `.env`. |
| OAuth completes but app loops back to login | No frontend error visible | Two possibilities: (a) backend sets `httpOnly: true` cookie → frontend's `document.cookie` reader sees nothing → flip to `httpOnly: false`; (b) frontend calls `atob(cookie)` without `decodeURIComponent` first — Express URL-encodes cookie values automatically. |
| User IP timing out across all apps | Even working apps appear "down" | Plesk fail2ban `plesk-modsecurity` jail bans IPs after repeated WAF hits. `ssh root@... "fail2ban-client set plesk-modsecurity unbanip <IP>"`. |

### Callback Path Migration (ai-tools monorepo)

Apps in this monorepo are mid-migration between two callback path conventions. The Google OAuth client must have whichever path each deployed bundle actually sends.

- **Old style:** `/<app>/auth/google/callback` — peace, biochemai, willpro, glucose, groove-streamer
- **New flat style:** `/<app>/callback` — ai-lab

**Rule:** before editing the Authorised redirect URIs list in Google Cloud Console, ssh and grep each deployed bundle at `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/<app>/assets/*.js` for what URL the code actually sends. Deleting a URI that any live bundle still uses will break that app immediately.

**Diagnostic order when OAuth breaks:**
1. Frontend redirect_uri construction (check `LoginView.tsx` imports)
2. Google Cloud Console URI list (decode `authError=` blob; byte-compare)
3. WAF rule 210580 on the callback path (vhost log: `/var/www/vhosts/system/ai-tools.techbridge.edu.gh/logs/error_log`)
4. Backend `dotenv.config()` loaded (`server.log` shows "injected env" line on startup)
5. Cookie `httpOnly: false` + `decodeURIComponent` before `atob` in AuthContext

### References

- Peace Vinyl (`src/contexts/AuthContext.tsx`, `server.js`) — Old-style `/peace/auth/google/callback`
- TUC AI Lab (`src/contexts/AuthContext.tsx`, `server.ts`) — New-style `/ai-lab/callback`, full server-side token exchange with cookie handoff
- Plesk vhost config: `/var/www/vhosts/system/ai-tools.techbridge.edu.gh/conf/vhost_ssl.conf` (managed via Plesk UI)

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

### Example: Applied Projects

**Blueprint** (light theme with gradient bg):
- `primaryColorHex="#2563eb"` (blue)
- `backgroundClass="bg-gradient-to-br from-slate-50 to-slate-100"`
- Registration enabled
- No watermark

**BiochemAI** (dark glassmorphic):
- `primaryColorHex="#a78bfa"` (purple)
- `backgroundClass="bg-[#0a0f1e]"`
- `cardBgClass="bg-[rgba(255,255,255,0.05)] backdrop-blur-lg"`
- Registration enabled
- Molecular watermark SVG
- Custom text colors (white for light theme)

**WillPro** (minimal light):
- `primaryColorHex="#630f12"` (maroon)
- `backgroundClass="bg-gray-50"`
- Registration **disabled** (`supportRegister=false`)
- Uses Router navigation on login success

**Peace Vinyl** (OAuth-only exception):
- Does NOT use FormLoginView
- Full-screen video background
- Single "Sign in with Google" button
- No local authentication
- Documented as architectural exception in this standardisation

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

### References

- `techbridge-ai-blueprint/src/components/FormLoginView.tsx` — Reference implementation
- `techbridge-ai-blueprint/src/components/LoginView.tsx` — Configuration example (light theme)
- `biochemai/src/components/LoginView.tsx` — Configuration example (dark glassmorphic)
- `willpro/src/pages/FormLoginPage.tsx` — Configuration example (login-only, Router navigation)
- `LOGIN_STANDARDIZATION.md` — Audit of pre-standardisation implementations

---

## PATTERN 11: POWERSHELL DEPLOYMENT SCRIPT FIXES

### The .htaccess Corruption Problem

**Symptom:** After deployment, `.htaccess` contains literal string `HTACCESS_EOF` at the end and broken rewrite rules.

**Root Cause:** PowerShell's SSH heredoc syntax inside quoted strings doesn't work as expected. The closing delimiter gets included in the file.

### Solution: Use PowerShell Here-Strings with Piped SSH

**WRONG:**
```powershell
ssh $host "cat > .htaccess << 'EOF'
<IfModule>
  RewriteRule ^api/(.*)$ http://localhost:3000/api/\$1 [P,L]
</IfModule>
EOF"
```
Result: File contains literal `EOF` string + malformed rewrite rule `api/\` (no captured group).

**CORRECT:**
```powershell
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
</IfModule>
"@
$htaccessContent | ssh $host "cat > '$RemotePath/.htaccess'"
```

### Breakdown

1. **PowerShell here-string** (`@"..."@`) — Preserves newlines, allows variable interpolation with `$var`
2. **Pipe to ssh** — Avoids quoting issues, sends content via stdin
3. **No escaping in here-string** — `$1` works directly (no need for `\$1`)

### Full Deployment Pattern

```powershell
# 1. Define .htaccess as here-string (not heredoc in SSH)
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
</IfModule>
"@

# 2. Pipe to SSH
$htaccessContent | ssh $RemoteHost "cat > '$RemotePath/.htaccess'"

# 3. Verify
ssh $RemoteHost "cat '$RemotePath/.htaccess'"
```

### Verification After Deployment

Always check:
```bash
ssh root@host "cat /path/to/.htaccess | grep -c 'HTACCESS_EOF'"  # Should be 0
ssh root@host "cat /path/to/.htaccess | grep 'RewriteRule.*api'"  # Should show correct rule
curl -s https://app.url/ -I | grep "HTTP" # Should be 200, not 500
```

### Apply to All TUC Apps

Update these deploy.ps1 files:
- [ ] peace-vinyl/deploy.ps1
- [ ] tuc-ai-lab-catalog/deploy.ps1
- [ ] glucose/deploy.ps1 (if using .htaccess)
- [ ] Any future Plesk app

### References

- tuc-ai-lab-catalog/deploy.ps1 — Corrected implementation
- PATTERNS.md §7 — Plesk Vite Deployment pattern (includes earlier .htaccess fixes)

---

*Last updated: May 2026 — Daniel Frempong Twum / TUC ICT*  
*Core session directives → see CLAUDE.md*
