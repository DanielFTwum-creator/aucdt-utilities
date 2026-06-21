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
| 5 | Dual-Auth Logout | Public-facing apps with own OAuth + local session |
| 6 | Glucose Project Learnings | General React + IndexedDB apps |
| 7 | Full-Viewport Layout | All TUC React apps with focused-work views |
| 8 | Port Assignment & Conflict Prevention | All backend apps in aucdt-utilities |
| 9 | PM2 cwd + dotenv env-file contract | All backend apps in aucdt-utilities |
| — | WMS SSO + TOTP onboarding (staff apps) | → `tuc-wms/docs/SSO_ONBOARDING_PLAYBOOK.md` |

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

### Security: Backend Proxy Only (Non-Negotiable)

**Never instantiate the Gemini SDK or place a Gemini key in frontend code.** A
`VITE_`-prefixed env var is baked into the served bundle at build time; Google
scans public bundles and auto-revokes leaked keys within hours (June 2026
repo-wide key-leak audit). Frontends call a backend that holds the key — the
preferred consolidation point is the WMS Gemini proxy:

```typescript
// Frontend: no SDK, no key — POST to the WMS proxy with the user's WMS JWT
// (service-to-service relays use the X-Gemini-Proxy-Key header instead).
const res = await fetch('https://wms.techbridge.edu.gh/api/gemini/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
  body: JSON.stringify({ model: 'gemini-3.1-pro-preview', contents, config }),
});
```

### Implementation Pattern (server-side, where the key lives)

```typescript
import { GoogleGenAI, Type } from '@google/genai';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });  // server env only — never VITE_*

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
- SDK mismatch trap: the same key can return `API_KEY_INVALID` on `@google/genai`
  while working on `@google/generative-ai` — verify the SDK before blaming the key

### Proven In Production

Glucose project (deployed 2026-05-16): extracts 20+ handwritten glucose readings from a single photo page.

---

## PATTERN 5: DUAL-AUTH LOGOUT (OAuth + Local Session)

> **Scope note (June 2026):** the adopted auth standard for staff/internal apps is
> **WMS SSO + TOTP MFA** — see `tuc-wms/docs/SSO_ONBOARDING_PLAYBOOK.md` (tsapro and
> umat are live reference clients). This pattern still applies to public-facing apps
> that keep their own Google login + local admin session.

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

## PATTERN 7: FULL-VIEWPORT LAYOUT (Fleet Standard)

**Origin:** VortexType typing-tutor, June 2026.  
**Applies to:** Every TUC React app that has a focused-work view (exercise, canvas, editor, player, quiz).

### Context

A shared `<main className="max-w-7xl mx-auto py-8">` wrapper constrains all views to a centred column, wasting horizontal and vertical space on the focused-work screen.

### Implementation

Split the root render into two branches: **browsing** (centred column + footer) and **focused** (full-bleed, no footer).

```tsx
// App.tsx — top-level layout
return (
  <div className="min-h-screen flex flex-col bg-... text-...">

    <Navbar ... />   {/* always shrink-0 */}

    {focusedView ? (
      /* Full-bleed: no max-w, no footer, fills remaining height */
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-4">
        <FocusedView ... />
      </div>
    ) : (
      <>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* tab routing */}
        </main>
        <footer ...>...</footer>
      </>
    )}

  </div>
);
```

### Inside the Focused View Component

The root element must be `flex flex-col h-full` (not `space-y-*`). The panel that should expand gets `flex-1 min-h-0`:

```tsx
// FocusedView.tsx
return (
  <div className="flex flex-col h-full gap-3">

    {/* Fixed-height chrome: toolbar, progress bar, status */}
    <TopChrome />

    {/* Fixed-height input area */}
    <InputArea />

    {/* Expanding panel — fills all remaining height */}
    <div className="flex-1 min-h-0 flex flex-col rounded-2xl ...">
      {/* Content centred inside the expanded space */}
      <div className="flex-1 flex items-center justify-center">
        <MainContent />
      </div>
    </div>

  </div>
);
```

### Rules

| Rule | Why |
| --- | --- |
| Root div: `flex flex-col h-full` | Receives height from parent's `flex-1` |
| Expanding panel: `flex-1 min-h-0` | `min-h-0` prevents flex overflow on short screens |
| `space-y-*` not allowed on root | Breaks flex height distribution |
| Footer hidden in focused mode | No distractions during focused work |
| Navbar always `shrink-0` | Must not compress when content grows |

### Terminology

- **Responsive** — adapts layout to different screen *sizes* (breakpoints)  
- **Full-viewport / fluid** — fills the available *space* regardless of size  
- **Full-bleed** — no `max-w` constraint, edge-to-edge width  

These are independent. A full-viewport layout should also be responsive.

---

## PATTERN 8: PORT ASSIGNMENT & CONFLICT PREVENTION

**Origin:** Fleet deploy recovery, June 2026 — 3 port conflicts caused PM2 crashes (omniextract/deep-dub on 3009, dfs-website/impact-ventures on 3012, tuc-netscan/brand-guideline-checker on 3017).  
**Applies to:** Every app in `aucdt-utilities/` with a Node backend server.

### The Single Source of Truth

`aucdt-utilities/PORT-REGISTRY.md` is the authoritative port ledger. Before touching any port, read it. After assigning or changing a port, update it immediately — same commit as the deploy.ps1 change.

### Rules

1. **One port per app, permanently.** No two apps may share a port, even temporarily.
2. **Check the registry before assigning.** Never pick a port from memory.
3. **Increment from the next available.** Current next: **3027** (see PORT-REGISTRY.md).
4. **Update PORT-REGISTRY.md in the same commit** as the deploy.ps1 that introduces the port.

### Workflow: Adding a New App

```
1. Open PORT-REGISTRY.md — read "Next available" line
2. Add your app to the Assigned Ports table with that port
3. Increment "Next available" by 1
4. Set PORT in deploy.ps1 to match
5. Commit PORT-REGISTRY.md + deploy.ps1 together
```

### Workflow: Detecting Existing Conflicts

Run this from `aucdt-utilities/` to find duplicate port assignments across all deploy scripts:

```powershell
# PowerShell — find duplicate $PORT assignments
Get-ChildItem -Recurse -Filter deploy.ps1 |
  Select-String -Pattern '^\$PORT\s*=\s*(\d+)' |
  ForEach-Object { $_.Matches[0].Groups[1].Value } |
  Group-Object | Where-Object { $_.Count -gt 1 } |
  Select-Object Name, Count
```

```bash
# Bash equivalent (run on server or in WSL)
grep -rh '^\$PORT\s*=' */deploy.ps1 2>/dev/null | sort | uniq -d
```

### Resolving a Conflict

1. Decide which app keeps its port (prefer the one deployed first / with more restarts).
2. Assign the displaced app the next available port from PORT-REGISTRY.md.
3. Update the deploy.ps1 (replace_all for the old port number).
4. Kill the old PM2 process on the server; restart with the new PORT.
5. Update PORT-REGISTRY.md conflict history table.
6. Commit all three files together (deploy.ps1 + PORT-REGISTRY.md).

### Server-Side Port Audit

Before any fleet deploy, verify no port is in use by two live processes:

```bash
ss -tlnp | awk '{print $4}' | grep -oP ':\K\d+' | sort | uniq -d
```

If this returns anything, stop both processes and restart the displaced one on a new port before running the fleet.

### Integration with test-fleet-deploy.ps1

Port conflict checking is not yet automated in the compliance test. When adding it, the check should:
- Parse `$PORT = <n>` from every deploy.ps1
- Assert no value appears more than once
- Exempt apps in `$EXEMPT` (tuc-wms, which uses systemd not PM2)

Until automated, the manual PowerShell command above is the gate.

### Apps Without a Backend Port

Pure SPA frontends (no server.ts / server.js) do not consume a port. See the "Apps without a backend port" section in PORT-REGISTRY.md for the current list. When in doubt: if the app has a `server.ts` or `server.js` and a PM2 entry, it needs a port in the registry.

---

## PATTERN 9: PM2 CWD + DOTENV ENV-FILE CONTRACT

**Origin:** Fleet incident, June 2026 — glucose, english-safari, peace-vinyl, deep-dub all crashed with `GEMINI_API_KEY not set` or equivalent after an OOM event forced PM2 restarts. Root cause: PM2 started processes from `/root` instead of the app directory, so `dotenv.config()` read `/root/.env` (empty) instead of the app's `.env` or `.env.local`.

### The Rule: Three-Way Contract

Every backend app has a **three-way contract** that must be consistent:

```
server.ts/js     →  dotenv.config({ path: X })      # what the app reads
deploy.ps1 scp   →  copies .env.local → server as X  # what gets written
pm2 start        →  --cwd /path/to/app               # where X is resolved from
```

All three must agree. Breaking any one leg causes silent env loss on restart.

### Correct pm2 start pattern

```bash
# Always use --cwd. Never rely on `cd dir && pm2 start` — the cd only
# affects the shell, not the working directory PM2 records for the process.
pm2 start /full/path/to/server.ts \
  --name my-app \
  --interpreter "$NPXPATH" \
  --interpreter-args tsx \
  --cwd /full/path/to/app/ \      # ← required
  --max-memory-restart 1G
```

In the PowerShell deploy script, this goes inside the base64 heredoc or inline SSH string — the same place where nvm is sourced. Example from glucose/deploy.ps1:

```powershell
$pm2StartScript = @"
export NVM_DIR="`$HOME/.nvm"; [ -s "`$NVM_DIR/nvm.sh" ] && . "`$NVM_DIR/nvm.sh"; nvm use --lts >/dev/null 2>&1 || true
NPXPATH=`$(which npx)
if pm2 describe ${PM2_APP} > /dev/null 2>&1; then
  pm2 reload ${PM2_APP} --update-env
else
  pm2 start ${RemotePath}server.ts \
    --name ${PM2_APP} \
    --interpreter "`$NPXPATH" \
    --interpreter-args tsx \
    --cwd ${RemotePath} \
    --max-memory-restart 1G \
    --env PORT=${PORT} \
    --env NODE_ENV=production
fi
pm2 save --force > /dev/null 2>&1 || true
"@
```

### Correct env-file copy pattern

Match the deploy's scp destination to what the server reads:

```powershell
# If server.ts calls dotenv.config()             → copy as .env
if (Test-Path ".env.local") {
    scp ... ".env.local" "${RemoteHost}:${RemotePath}.env"
}

# If server.ts calls dotenv.config({ path: '.env.local' }) → copy as .env.local
if (Test-Path ".env.local") {
    scp ... ".env.local" "${RemoteHost}:${RemotePath}.env.local"
}
```

Check the server file first:
```bash
grep 'dotenv\.config' server.ts   # shows which path is used
```

### Compliance check

`test-fleet-deploy.ps1` enforces both rules automatically:
- **"pm2 start has --cwd"** — fails if a deploy.ps1 contains `pm2 start` but no `--cwd`
- **"env file not renamed"** — fails if scp copies `.env.local` → `.env` (the silent mismatch)

Run `.\test-fleet-deploy.ps1` before any fleet deploy to catch violations.

### Why `--env` flags alone are not enough

PM2's `--env` flag takes a named environment (e.g. `--env production`), not `KEY=VALUE` pairs. Shell-level vars (`PORT=3006 pm2 start ...`) ARE stored in PM2's process descriptor and survive restarts — but only if the process was originally started that way. After a `pm2 delete` + manual `pm2 start` (common during incident recovery), those stored vars are lost unless the operator repeats them. `--cwd` + a correct `.env` file on disk is the resilient pattern because it works even after a full `pm2 resurrect` from dump.

---

*Last updated: June 2026 — Daniel Frempong Twum / TUC ICT*  
*Core session directives → see CLAUDE.md*
