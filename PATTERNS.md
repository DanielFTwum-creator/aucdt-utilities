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
| 10 | pnpm native binary permissions | All apps with esbuild / better-sqlite3 / protobufjs |
| 11 | WMS Gemini Key Proxy | All fleet apps that call Gemini AI |
| 12 | NVM sourcing before server-side pnpm install | All deploy.ps1 backend install steps |
| 13 | tsx in dependencies + PM2 wrapper for Node v26 | All apps with server.ts running in production |
| 14 | node_modules binary permissions after deploy chmod | All deploy.ps1 scripts with chmod sweeps |
| 15 | SPA asset/HTML sync — the `text/html` MIME trap | All Vite SPA deploys (Apache/nginx) |
| 16 | PM2 Fleet-Wide Log Timestamps | All PM2-managed apps |
| 17 | Fleet Node/PM2 Server-Side Deploy | All Node/PM2 apps with server.ts |
| 18 | pnpm 11 `allowBuilds` Config | All apps with esbuild / Tailwind 4 / native modules |
| 19 | TUC Full-Screen Overlay | Any full-screen gate, overlay, or loading screen |
| 20 | PowerShell Heredoc Bash Variable Escaping | Any deploy.ps1 with a bash for-loop over variable names |
| 21 | BOM Propagation into Extracted .env Values | Any deploy that copies keys from WMS .env via grep |
| 22 | `const` Temporal Dead Zone in Server Diagnostics | Any server.ts with startup console.log blocks |
| 23 | PM2 Hard Restart After Env / server.ts Change | Any deploy that changes env vars or edits a tsx-run server.ts |
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

### AI Studio export catch (brand before first deploy)

Apps exported from Google AI Studio ship a stub `index.html`:

```html
<title>My Google AI Studio App</title>
```

with no SEO, no favicon (so the browser requests `/favicon.ico` and logs a
404), no `theme-color`, and `lang="en"`. fail2ban-ai went live on 8 Jul 2026
still titled "My Google AI Studio App". Fold this into every import's
standardisation pass, before first deploy:

```
☐ <title> branded: "<App> | Techbridge University College"
☐ lang="en-GB"
☐ description + author + publisher meta
☐ robots: "noindex, nofollow" for SSO-gated staff tools; "index, follow" for public
☐ theme-color + msapplication-TileColor
☐ favicon present — inline an SVG data: URI to avoid the /favicon.ico 404
☐ module entry <script> retained (Pattern 24 bundle guard)
```

Inline-SVG favicon (no external file, no 404) is preferred for these imports;
see `fail2ban-ai/index.html` for a working example.

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

---

## PATTERN 10: PNPM NATIVE BINARY PERMISSIONS

**Origin:** Fleet incident, June 2026 — `tb-student-reg` crashed with `EACCES: spawn esbuild` after a fresh `pnpm install`. Root cause: pnpm's content-addressable store does not guarantee execute permissions on native binaries after install. A subsequent `chmod` or `pnpm approve-builds` is required.

### The Rule

After any `pnpm install` on the server that involves native packages (esbuild, better-sqlite3, protobufjs, @google/genai, sharp, etc.), run:

```bash
pnpm approve-builds
# or, non-interactively after you know which packages need it:
chmod +x node_modules/.pnpm/esbuild@*/node_modules/esbuild/bin/esbuild 2>/dev/null || true
find node_modules/.pnpm -name 'esbuild' -path '*/bin/esbuild' -exec chmod +x {} \; 2>/dev/null || true
```

### Add to deploy scripts

Every deploy.ps1 `Step 6: backend files` section that runs `pnpm install --prod` should follow with a permission fix:

```bash
cd $RemotePath && pnpm install --prod 2>&1 | tail -5
# Fix native binary permissions — pnpm store does not guarantee +x
find node_modules/.pnpm -type f -name 'esbuild' -exec chmod +x {} \; 2>/dev/null || true
find node_modules/.pnpm -name '*.node' -exec chmod +x {} \; 2>/dev/null || true
```

### Packages that commonly need this

- `esbuild` (used by Vite, tsx, tsup)
- `better-sqlite3` (.node binary)
- `protobufjs` (postinstall script)
- `@google/genai` (preinstall script)
- `sharp` (.node binary)

### Why this happens

pnpm uses a global content-addressable store (`~/.local/share/pnpm/store/`). Files in the store are hardlinked into `node_modules/.pnpm`. If the store entry was created without execute bits (e.g. downloaded as a tarball and extracted without preserving permissions), every project that hardlinks from it inherits the broken permissions. `pnpm approve-builds` re-runs the postinstall script which rebuilds the binary with correct permissions.

---

### Why `--env` flags alone are not enough

PM2's `--env` flag takes a named environment (e.g. `--env production`), not `KEY=VALUE` pairs. Shell-level vars (`PORT=3006 pm2 start ...`) ARE stored in PM2's process descriptor and survive restarts — but only if the process was originally started that way. After a `pm2 delete` + manual `pm2 start` (common during incident recovery), those stored vars are lost unless the operator repeats them. `--cwd` + a correct `.env` file on disk is the resilient pattern because it works even after a full `pm2 resurrect` from dump.

---

## PATTERN 11: WMS GEMINI KEY PROXY

**Origin:** Fleet architecture decision, June 2026 — Gemini API key custody must live in exactly one place: `wms.techbridge.edu.gh`. Apps must never store or hard-code the key; they fetch it at runtime from the WMS proxy.

**Reference implementation:** `dmcdai-digital-media-communication-design/server.js`

> **Fleet standard (2 Jul 2026, Daniel):** no app holds the Gemini key at all — not in the
> bundle, not in the app's `.env`, not fetched at runtime. Only WMS holds it. Apps present
> their `GEMINI_PROXY_KEY` service credential and use the **`POST /api/gemini/generate`
> relay** (the app never receives the key). The key-fetch mode documented below is
> transitional only; migrate remaining `/key`-mode apps (dmcdai, english-safari, glucose,
> bridge-radio) and biochemai (direct key) as they are touched.

### The Rule (transitional key-fetch mode — do not use for new work)

Every fleet app still on key-fetch mode must:
1. Fetch the key from WMS at runtime (not at startup)
2. Cache the key in memory with a 6-hour TTL
3. Invalidate the cache on `API_KEY_INVALID` errors so the next request re-fetches
4. Fall back to a local `GEMINI_API_KEY` env var for development only
5. Never call `process.exit(1)` if the key is unavailable — return HTTP 503 instead

### Standard Implementation (TypeScript)

```typescript
const WMS_KEY_URL = 'https://wms.techbridge.edu.gh/api/gemini/key';
const KEY_TTL_MS  = 6 * 60 * 60 * 1000; // 6 hours
let cachedGeminiKey: string | null = null;
let keyFetchedAt = 0;

function invalidateGeminiKey() { cachedGeminiKey = null; keyFetchedAt = 0; }

async function getGeminiKey(): Promise<string> {
  if (cachedGeminiKey && Date.now() - keyFetchedAt < KEY_TTL_MS) return cachedGeminiKey;
  const proxyKey = process.env.GEMINI_PROXY_KEY;
  if (!proxyKey) {
    // Local dev fallback only — production must set GEMINI_PROXY_KEY via WMS.
    const local = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (local) return local;
    throw new Error('GEMINI_PROXY_KEY is not set (and no local key fallback).');
  }
  const r = await fetch(WMS_KEY_URL, { headers: { 'X-Gemini-Proxy-Key': proxyKey } });
  if (!r.ok) throw new Error(`WMS key fetch failed: ${r.status} ${await r.text()}`);
  cachedGeminiKey = (await r.json()).apiKey;
  keyFetchedAt = Date.now();
  return cachedGeminiKey!;
}

if (!process.env.GEMINI_PROXY_KEY) {
  console.warn('[APP] WARNING: GEMINI_PROXY_KEY not set — AI routes will use local fallback or fail');
}
```

### In Route Handlers

```typescript
// Per-request key fetch — never at startup
const geminiKey = await getGeminiKey().catch((err: any) => {
  console.error('[APP] Key fetch failed:', err.message);
  return null;
});
if (!geminiKey) return res.status(503).json({ error: 'AI service temporarily unavailable' });
const ai = new GoogleGenAI({ apiKey: geminiKey });
// ... use ai ...

// In the catch block:
if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('INVALID_ARGUMENT')) {
  invalidateGeminiKey();
}
```

### Environment Variables

| Var | Where set | Purpose |
|---|---|---|
| `GEMINI_PROXY_KEY` | PM2 shell-level var + `.env.local` | Authenticates with WMS proxy |
| `GEMINI_API_KEY` | `.env.local` (dev only) | Local fallback when WMS unavailable |

### Status (verified 2026-06-27)

**The WMS relay is LIVE and activated.** `/opt/tuc-wms/.env` on the server has both
`GEMINI_API_KEY` (central key) and `GEMINI_PROXY_KEY` (64-char service credential) set;
`GET https://wms.techbridge.edu.gh/api/gemini/health` returns `{"ready":true}` and a
`POST /api/gemini/generate` round-trip succeeds. Apps that present the matching
`GEMINI_PROXY_KEY` can use the relay now (no client-side key needed).

- **Central key custody:** the single Gemini key lives ONLY in `/opt/tuc-wms/.env`.
  Rotate fleet-wide by editing `GEMINI_API_KEY` there + `systemctl restart tuc-wms`.
- **Two consumption modes:** `GET /api/gemini/key` (app fetches + caches the key, then
  calls Gemini itself — transitional, being phased out) or `POST /api/gemini/generate`
  (WMS relays the call; the app never receives the key — **the fleet standard**).

Migrated: `english-safari`, `glucose`, `bridge-radio`  
Reference: `dmcdai` (JS, `/key`) · OmniExtract (`/generate` relay)  
Old pattern (do not copy): `biochemai` — direct key, fatal startup check

---

## PATTERN 12: NVM SOURCING BEFORE SERVER-SIDE PNPM INSTALL

**Origin:** Fleet incident, June 2026 — `glucose` deploy failed with `ERR_UNKNOWN_BUILTIN_MODULE: No such built-in module: node:sqlite`. Root cause: pnpm 11.5.3 requires Node.js ≥ v22.13, but the bare SSH `pnpm install` command runs under the system Node (v20) because NVM is not sourced.

### The Rule

Every deploy.ps1 `pnpm install --prod` step that runs on the server via SSH **must** source NVM first.

### Correct Pattern (PowerShell deploy.ps1)

```powershell
# Step 6: Deploy backend files and install deps
& $SCP @SSH_OPTS server.ts package.json pnpm-lock.yaml "${RemoteHost}:${RemotePath}" | Out-Null
if (Test-Path '.env.local') {
    & $SCP @SSH_OPTS '.env.local' "${RemoteHost}:${RemotePath}.env.local" | Out-Null
}
# IMPORTANT: single-quote $nvmPrefix to prevent PowerShell from interpolating $HOME/$NVM_DIR
$nvmPrefix = 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use --lts >/dev/null 2>&1 || true'
& $SSH @SSH_OPTS $RemoteHost "$nvmPrefix; cd ${RemotePath} && pnpm install --prod --silent"
```

### Why Single-Quotes for `$nvmPrefix`

PowerShell double-quoted strings expand `$HOME` and `$NVM_DIR` as PowerShell variables (empty on the local machine). Single-quoting the NVM prefix preserves them as literal bash variables. The outer double-quoted string then expands only `${RemotePath}` (a PowerShell var), which is correct.

### Node Version

Use `nvm use 26` (not `--lts`) to match the server's system default Node v26. All deploy scripts were updated to Node v26 on 2026-06-21.

### Fixed (June 2026)

All 13 affected apps now use `$nvmPrefix` with `nvm use 26`:  
`english-safari`, `dmcdai`, `markai`, `groove-streamer`, `deliberate-magic-reader`, `orbit-walk-reminder`, `peace-vinyl`, `techbridge-student-population-register`, `techbridge-ai-blueprint`, `techbridge-poster-studio`, `tuc-ai-lab-catalog`, `tuc-netscan-100`, `aucdt-msee-aptitude-test`

### Already Correct (use heredoc with NVM at top)

`biochemai`, `omniextract` — their entire build runs in a bash script that sources NVM at the top.  
`glucose`, `deep-dub-vibes-player`, `willpro`, `ai-email-drafter` — use the `$nvmPrefix` or inline `$step6Script` pattern.

---

## PATTERN 13: TSX IN DEPENDENCIES + PM2 WRAPPER SCRIPT FOR NODE v26

**Origin:** Fleet recovery, June 2026 — subagent deploy wiped `data/glucose.db` and ran `pnpm install --prod`, which stripped `tsx` (a devDependency). Both `glucose` and `tuc-ai-lab` went into crash loops with `pid: N/A`. The system `node` was v20 but Node v26.3.1 was available under `~/.nvm/`.

### The Two Rules

**Rule A — tsx must be in `dependencies`, not `devDependencies`, for any app whose `server.ts` runs in production.**

`pnpm install --prod` (run by all deploy.ps1 scripts) strips devDependencies. If `tsx` is a devDependency, the server can never start after a fresh deploy.

Affected apps (already fixed): `glucose`  
Check all other apps: `grep -r '"tsx"' */package.json` — move to `dependencies` wherever the app has a `server.ts`.

**Rule B — Use Node v26 for all AI/cutting-edge apps. Use the wrapper script pattern when PM2 cannot set NODE_ENV or the node binary correctly.**

Server has three Node versions:
- `/usr/bin/node` → v20.20.2 (system default — do not use for new apps)
- `/root/.nvm/versions/node/v24.17.0/bin/node` → v24 LTS
- `/root/.nvm/versions/node/v26.3.1/bin/node` → v26 (preferred for AI apps per Daniel)

### Wrapper Script Pattern (for apps needing NODE_ENV or non-default node)

Create `/usr/local/bin/start-<appname>.sh`:

```bash
#!/bin/bash
export NODE_ENV=production        # required for apps that gate vite import on this
cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/<appname>
exec /root/.nvm/versions/node/v26.3.1/bin/node \
  --import /path/to/app/node_modules/tsx/dist/esm/index.mjs \
  /path/to/app/server.ts
```

```bash
chmod +x /usr/local/bin/start-<appname>.sh
pm2 start /usr/local/bin/start-<appname>.sh --name <appname> --cwd /path/to/app
pm2 save
```

Benefits over `--interpreter-args tsx`:
- NODE_ENV is guaranteed set (PM2's `--env` flag selects named profiles, not individual vars)
- The correct node binary is used regardless of system PATH
- `cd` ensures dotenv resolves `.env.local` from the right directory (belt-and-suspenders alongside `--cwd`)

### Recovery Commands (when glucose or ai-lab crash with pid: N/A)

```bash
# 1. Check if tsx is present
ls /path/to/app/node_modules/.bin/tsx || echo "tsx missing — need to install"

# 2. Install without --prod (strips tsx from devDependencies)
cd /path/to/app
# If packageManager field enforces pnpm 11+ and system node is v20, bypass it:
node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('package.json')); delete p.packageManager; fs.writeFileSync('package.json',JSON.stringify(p,null,2));" && \
COREPACK_ENABLE_STRICT=0 /usr/bin/pnpm install && \
git checkout package.json   # restore original

# 3. Restore glucose DB from backup
cp /var/backups/glucose/glucose-YYYY-MM-DD.db /path/to/glucose/data/glucose.db

# 4. Restart via wrapper
pm2 restart glucose
```

### Fixed apps (June 2026)
- `glucose` — tsx moved to dependencies; wrapper at `/usr/local/bin/start-glucose.sh`
- `tuc-ai-lab` — wrapper at `/usr/local/bin/start-ai-lab.sh`; uses tsx from `tuc-ai-lab-catalog/node_modules`

---

## PATTERN 14: node_modules BINARY PERMISSIONS AFTER DEPLOY CHMOD

**Problem:** `deploy.ps1` applies `find ${DEPLOY_PATH} -type f -exec chmod 644 {} \;` to normalise file permissions after copy. This strips the execute bit (`+x`) from native binaries inside `node_modules`, in particular:

- `node_modules/@esbuild/linux-x64/bin/esbuild` — used by tsx at startup
- `node_modules/.bin/*` symlink targets
- Any other compiled native add-on

**Symptom:** App starts but crashes immediately with:

```text
Error: EACCES: permission denied, spawn .../esbuild
TransformError: The service is no longer running
```

PM2 shows 50+ restarts in under a minute. Health endpoint never responds.

**Fix A (deploy.ps1 — permanent):** Exclude `node_modules` from the chmod find:

```bash
# Bad — strips execute from node_modules binaries:
find ${DEPLOY_PATH} -type f -exec chmod 644 {} \;

# Good — exclude node_modules:
find ${DEPLOY_PATH} -not -path '${DEPLOY_PATH}/node_modules/*' -type f -exec chmod 644 {} \;
```

**Fix B (server — emergency recovery):**

```bash
DEPLOY=/var/www/vhosts/.../myapp
find $DEPLOY/node_modules -type f \( -name 'esbuild' -o -name '*.node' \) -exec chmod +x {} \;
find $DEPLOY/node_modules/.bin -exec chmod +x {} \; 2>/dev/null || true
pm2 restart myapp
```

**Rule:** Always exclude `node_modules` from blanket `chmod 644` sweeps in deploy scripts. `chown -R` is safe; `chmod -R 644` on the full deploy path is not.

---

## PATTERN 15: SPA ASSET/HTML SYNC — THE `text/html` MIME TRAP

**Applies to:** every Vite SPA deployed behind Apache or nginx (tuc-rms, and all
React apps that ship a hashed `dist/`).

**Symptom (browser console):**

```text
Failed to load module script: Expected a JavaScript-or-Wasm module script but
the server responded with a MIME type of "text/html". Strict MIME type checking
is enforced for module scripts per HTML spec.
```

The page loads blank or half-rendered. A `<script type="module">` request for a
hashed bundle (e.g. `/assets/index-DBGOXJ4r.js`) returns **HTTP 200 with
`Content-Type: text/html`** instead of `application/javascript`.

**Root cause — NOT caching.** The deployed `index.html` references an asset hash
that is **not present in the live docroot's `assets/`**. The SPA fallback rewrite
(`RewriteRule ^ /index.html [L]` on Apache, `try_files $uri /index.html` on nginx)
then serves `index.html` in place of the missing `.js` — so the browser receives
HTML where it expected a module. `index.html` and `assets/` are **out of sync on
the server itself**. Hard-refreshing does nothing; a stale service-worker or
browser cache is a red herring (confirm with `curl`, below).

Three ways the server gets into this state:

1. **Broken SPA-fallback condition (the Plesk one — caused the tuc-rms outage).**
   The fallback's "skip real files" guard never matches, so *every* request —
   including existing `.js`/`.css`/`.svg` — is rewritten to `index.html`. Tell-tale
   sign: **every** path returns the same byte-for-byte `index.html` (a missing
   route AND a real asset AND `/favicon.svg` all return identical bytes). Root
   cause: the rewrite uses `%{REQUEST_FILENAME}` in **server / VirtualHost
   context** (e.g. Plesk's `conf/vhost_ssl.conf`), where it is *not yet mapped to
   the filesystem path* — so `!-f` is always true. **Fix:** use
   `%{DOCUMENT_ROOT}%{REQUEST_URI}` instead. See the Plesk note below.
2. **Partial deploy** — a new `index.html` lands but the matching `assets/` bundles
   don't (e.g. `scp -r dist/*` silently skips a subdir; a transfer is interrupted).
3. **Wrong docroot** — the vhost serves a folder that isn't the one the deploy
   script wrote to (two doc roots: a stale `index.html` references a hash whose
   bundle only exists in the other folder).

**Plesk-specific notes (learned the hard way on `rms.techbridge.edu.gh`):**

- Plesk runs **nginx → Apache (`:7081`)**; nginx just reverse-proxies, so Apache +
  rewrite rules are authoritative. Custom rules belong in
  `/var/www/vhosts/system/<domain>/conf/vhost_ssl.conf` (NOT `httpd.conf`, which is
  auto-generated). Changes there survive `plesk sbin httpdmng --reconfigure-domain <domain>`.
- The correct vhost-level SPA block:
  ```apache
  RewriteEngine On
  RewriteCond %{REQUEST_URI} !^/api/                    # let API proxy through
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} !-f        # NOT %{REQUEST_FILENAME}
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} !-d
  RewriteRule ^ /index.html [L]
  ```
  Note `!^/api/` with the **leading slash** — in server context the matched path
  keeps its slash, so a `(?!api/)` lookahead silently fails to exclude the API and
  swallows `/api/*` into `index.html` (breaks login/data calls).
- **Reverse-proxy IPv4/IPv6 mismatch:** a Node backend that listens on `localhost`
  often binds `[::1]` (IPv6) **only**. An Apache `ProxyPass http://127.0.0.1:5000`
  (IPv4) then can't connect and `/api/*` returns the SPA `index.html`. Check with
  `ss -ltnp | grep :5000`; point `ProxyPass`/`ProxyPassReverse` at `http://[::1]:5000`
  (or bind the backend to `127.0.0.1`).

**Diagnose in 3 curls** (`<host>` = the live origin):

```bash
# 1. What hash does the LIVE index.html reference?
curl -s https://<host>/index.html | grep -oE '/assets/[A-Za-z0-9_-]+\.js'
# 2. Does that exact bundle exist? MUST be application/javascript, not text/html:
curl -s -D - https://<host>/assets/<that-hash>.js -o /dev/null | grep -i content-type
# 3. text/html  → file missing → asset/HTML mismatch confirmed.
```

**Fix (immediate):** redeploy `dist/` **atomically** — write `index.html` and
`assets/` to the exact vhost docroot in one operation, never separately:

```bash
rsync -a --delete dist/. <user>@<host>:<EXACT_VHOST_DOCROOT>/
# verify docroot first:  apachectl -S   (or Plesk → Hosting Settings → Document root)
```

**Fix (permanent — add a post-deploy guard to `deploy.ps1`).** After the copy,
assert every hash the deployed HTML references actually serves as JS on the live
URL; fail the deploy loudly if not:

```bash
ASSETS=$(curl -s "https://$HOST/index.html" | grep -oE '/assets/[A-Za-z0-9_-]+\.(js|css)')
for a in $ASSETS; do
  ct=$(curl -s -D - "https://$HOST$a" -o /dev/null | tr -d '\r' | awk -F': ' 'tolower($1)=="content-type"{print $2}')
  case "$a:$ct" in
    *.js:*javascript*|*.css:*css*) : ;;
    *) echo "[DEPLOY-FAIL] $a served as '$ct' — index.html/assets out of sync"; exit 3 ;;
  esac
done
```

**Rules:**

- Deploy `dist/` as a unit (`rsync -a --delete dist/.`); never copy `index.html`
  and `assets/` in separate steps.
- Confirm the deploy target **is** the vhost docroot (`apachectl -S` / Plesk).
- Keep `index.html` at `Cache-Control: no-cache, must-revalidate` and hashed
  assets `immutable` — already correct in the tuc-rms `.htaccess` generator.
- A `text/html` MIME error on a `.js` means *missing file → SPA fallback*, almost
  never a MIME-mapping problem. Check existence first.

---

## PATTERN 16: PM2 FLEET-WIDE LOG TIMESTAMPS

**Origin:** TUC NetScan deploy, June 2026 — PM2 log output had no timestamps, making crash-loop diagnosis impossible (no way to tell if restarts were seconds or minutes apart).  
**Applies to:** Every PM2-managed app on the fleet.

### The Problem

By default PM2 logs look like:

```
67|tuc-net | [TUC NetScan] FATAL: Port 3017 is already in use.
67|tuc-net | [TUC NetScan] FATAL: Port 3017 is already in use.
```

No timestamp, no way to tell if these are 100ms apart or 10 minutes apart.

### Fleet-Wide Fix (one-off, run once per server)

```bash
pm2 set pm2:log_date_format 'YYYY-MM-DD HH:mm:ss' && pm2 reload all --update-env && pm2 save --force
```

`pm2 reload` does a graceful restart (SIGINT → wait → new process) so there is no hard cutover. After this, all new log lines carry a timestamp:

```
67|tuc-net | 2026-06-30 11:02:53: [TUC NetScan] Unified full-stack server running on port 3027
```

Old log entries (before the reload) have no timestamp — that is expected.

### Per-Process Fix (new apps and deploy.ps1)

Add `--log-date-format` to the `pm2 start` command in every deploy.ps1 so timestamps survive a `pm2 delete` + fresh start:

```bash
pm2 start server.ts \
  --name my-app \
  --interpreter ./node_modules/.bin/tsx \
  --cwd /path/to/app \
  --log-date-format 'YYYY-MM-DD HH:mm:ss'
```

In PowerShell deploy.ps1 (inside the SSH string):

```powershell
$pm2Result = & $SSH @SSH_OPTS $RemoteHost "... pm2 start server.ts --name ${PM2_APP} --interpreter ./node_modules/.bin/tsx --cwd ${RemotePath} --log-date-format 'YYYY-MM-DD HH:mm:ss'; ..."
```

### Verification — Single App

```bash
pm2 logs <app-name> --lines 5 --nostream
```

The last line of output should carry a `YYYY-MM-DD HH:mm:ss:` prefix.

### Verification — Full Fleet (Required After Any pm2 resurrect)

The global `pm2:log_date_format` setting does NOT automatically apply to processes resurrected from `dump.pm2`. After any reboot or `pm2 resurrect`, run this to find every app missing timestamps:

```bash
pm2 jlist | python3 -c "
import json, sys, os, re
apps = json.load(sys.stdin)
for app in apps:
    name = app['name']
    if app.get('pm2_env', {}).get('status') != 'online':
        continue
    log = app.get('pm2_env', {}).get('pm_out_log_path', '')
    if not log or not os.path.exists(log):
        print(f'? {name} (no log file)')
        continue
    try:
        with open(log, 'rb') as f:
            f.seek(0, 2)
            f.seek(max(0, f.tell() - 3000))
            content = f.read().decode('utf-8', errors='ignore')
        has_ts = bool(re.search(r'\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}', content))
        print(f\"{'OK' if has_ts else 'MISSING'} {name}\")
    except Exception as e:
        print(f'ERR {name} ({e})')
"
```

For every app that prints `MISSING`, apply the timestamp restart sequentially:

```bash
for app in <space-separated list of MISSING apps>; do
  echo "Restarting $app..."
  pm2 restart "$app" --update-env --log-date-format 'YYYY-MM-DD HH:mm:ss'
done && pm2 save --force
```

Never use `pm2 reload all` for this — it spawns all processes simultaneously and will OOM a memory-constrained server. Sequential `pm2 restart` in a loop is safe.

### Critical Finding (30 June 2026)

`pm2 set pm2:log_date_format` sets a default for NEW processes only. It does not retroactively update the saved config of existing processes in `dump.pm2`. After `pm2 resurrect`, every process comes back with whatever timestamp config was in the dump at save time — which is often none. The fleet-audit script above is the only reliable way to verify coverage.

---

---

## PATTERN 17: FLEET NODE/PM2 SERVER-SIDE DEPLOY

**Origin:** enhanced-youtube-genie deploy, 30 June 2026 — weeks of ERR_PNPM_IGNORED_BUILDS
failures resolved by reading how ai-lab and patois already handled it.
**Applies to:** Every `deploy.ps1` that does a server-side build + PM2 start.

### The Problem

pnpm 11 blocks lifecycle scripts (postinstall) for native modules like `esbuild`
and `@tailwindcss/oxide` unless explicitly approved. This causes
`ERR_PNPM_IGNORED_BUILDS` during `pnpm install` on the server.

### The Fleet Solution: pnpm with npm Fallback

Do not fight pnpm's approval mechanism. Use pnpm with a silent npm fallback.
npm runs all lifecycle scripts without requiring approval.

```bash
# Step 3: Full install for build (in /tmp clone)
pnpm install --no-frozen-lockfile --silent 2>/dev/null || npm install --silent

# Step 5: Prod install in deploy directory
pnpm install --prod --silent 2>/dev/null || npm install --omit=dev --silent
```

If pnpm fails for any reason (ERR_PNPM_IGNORED_BUILDS, lockfile mismatch, etc.),
npm takes over silently. The build continues cleanly.

### PM2 Start — Use `npx tsx`

Do not hardcode the tsx binary path. Use `npx` as the interpreter with `tsx` as
the args — npx resolves tsx from local node_modules without path assumptions.

```bash
# Start (first deploy)
pm2 start server.ts \
  --name "$PM2_APP" \
  --interpreter npx \
  --interpreter-args tsx \
  --cwd "$DEPLOY"

# Reload (subsequent deploys — graceful, no downtime)
pm2 reload "$PM2_APP" --update-env
```

Full step 7 idiom:
```bash
pm2 describe "$PM2_APP" >/dev/null 2>&1 \
  && pm2 reload "$PM2_APP" --update-env \
  || pm2 start server.ts --name "$PM2_APP" --interpreter npx --interpreter-args tsx --cwd "$DEPLOY"
pm2 save >/dev/null 2>&1 || true
```

### tsx Must Be in `dependencies` (Not `devDependencies`)

`pnpm install --prod` only installs `dependencies`. If `tsx` is in `devDependencies`,
it will be missing in the deploy directory and PM2 will fall back to plain `node`,
which cannot run TypeScript.

```json
"dependencies": {
  "tsx": "^4.19.2"
}
```

### Reference Implementations

| App | Status |
|---|---|
| tuc-ai-lab-catalog | Reference — this pattern originated here |
| patois-lyricist-v2.0.0 | Uses same pnpm-or-npm fallback |
| enhanced-youtube-genie | Aligned to this pattern 30 June 2026 |

---

## PATTERN 18: PNPM 11 `allowBuilds` CONFIG

**Origin:** enhanced-youtube-genie deploy, 30 June 2026 — multiple failed attempts
using the old pnpm 10 syntax.
**Applies to:** Any project deploying on this server (pnpm 11.9.0 / Node v26.3.1).

### Breaking Change in pnpm 11

`onlyBuiltDependencies`, `neverBuiltDependencies`, and `ignoredBuiltDependencies`
were **removed** in pnpm 11 and replaced by a single `allowBuilds` key-value map.

| pnpm 10 (removed) | pnpm 11 (correct) |
|---|---|
| `onlyBuiltDependencies: [esbuild]` | `allowBuilds: { esbuild: true }` |
| `neverBuiltDependencies: [core-js]` | `allowBuilds: { core-js: false }` |
| `ignoredBuiltDependencies: [esbuild]` | `allowBuilds: { esbuild: false }` |

The pnpm 10 format is silently ignored in pnpm 11 — no error, no warning.

### Correct `pnpm-workspace.yaml` for Vite + Tailwind 4 Projects

```yaml
allowBuilds:
  esbuild: true
  "@tailwindcss/oxide": true
```

### Config File Location

Settings live in `pnpm-workspace.yaml` (not `pnpm.yaml`, not `.npmrc`, not the
`pnpm` field in `package.json` — all of those were the pnpm 10 locations).

### Practical Note

In practice, the fleet uses Pattern 17's npm fallback and this config is a
belt-and-suspenders measure. If pnpm install succeeds (because `allowBuilds`
is correct), the build is reproducible and lockfile-stable. If pnpm fails, npm
picks it up. Both are acceptable outcomes.

### Server Context

| Item | Value |
|---|---|
| pnpm version on server | 11.9.0 |
| Node version on server | v26.3.1 (NVM, path: `/root/.nvm/versions/node/v26.3.1/`) |
| pnpm binary | `/root/.nvm/versions/node/v26.3.1/bin/pnpm` |
| System node (do not use) | v20.20.2 at `/usr/bin/node` |

NVM must be sourced before any pnpm command in server-side scripts (Pattern 12).

---

---

## PATTERN 19: TUC FULL-SCREEN OVERLAY

**Origin:** enhanced-youtube-genie login screen, 30 June 2026.
**Applies to:** Any full-screen gate, overlay, loading screen, or login wall in a TUC React app.

### Root Cause

Every TUC app has a splash screen in `index.html`:

```css
/* in <style id="tuc-splash-styles"> */
body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
```

This persists in the DOM until React hydrates. The `#root` div becomes a flex child and shrinks to fit its content. `min-height: 100vh; width: 100%` on a component inside `#root` does not produce a full-viewport element — `width: 100%` resolves to the flex child's shrunk content width, not the viewport width.

**Symptom:** A login screen or overlay renders as a narrow centred column with black bars on both sides.

### Fix: Always Use `position: fixed` for Full-Screen Overlays

```tsx
// CORRECT — bypasses the flex body entirely
<div
  style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // ...
  }}
>

// WRONG — collapses to flex-child width inside the splash-screen body
<div
  style={{
    minHeight: '100vh',
    width: '100%',
    // ...
  }}
>
```

`position: fixed` takes the element out of the normal flow and positions it relative to the viewport, not the flex parent. The layout of `body` or `#root` has no effect on it.

### When This Applies

Any component that must cover the full viewport:

- Auth gates (`AuthGate.tsx`)
- Loading screens / skeletons
- Full-screen modals or lightboxes
- Onboarding overlays

### Note on Scrollable Content

If the overlay itself needs to scroll, set `overflow-y: auto` on the inner container, not the fixed outer wrapper. The outer wrapper should stay `overflow: hidden` to prevent the body from scrolling behind it.

---

## PATTERN 20: POWERSHELL HEREDOC BASH VARIABLE ESCAPING

**Origin:** enhanced-youtube-genie deploy.ps1, 1 July 2026.
**Applies to:** Any `deploy.ps1` that embeds a bash script via a PowerShell `@"..."@` heredoc.

### Root Cause

Inside a PowerShell `@"..."@` double-quoted heredoc, PowerShell expands variables before the string is sent to the server. A bash `for` loop that uses `${VAR}` in its body:

```bash
for VAR in KEY_ONE KEY_TWO; do
  V=$(grep "^${VAR}=" file | cut -d= -f2-)
done
```

...looks safe in bash but is broken inside a PowerShell heredoc. PowerShell sees `${VAR}` and expands it as a PowerShell variable. Since `$VAR` is not defined in PowerShell, it expands to an empty string, and the grep pattern becomes `^=` — matching nothing.

The symptom is silent: the loop runs, the grep finds nothing, and any fallback `WARN:` message fires even though the source file has the correct values.

### Wrong (inside PowerShell heredoc)

```powershell
$script = @"
for VAR in VITE_GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET; do
  V=`$(grep "^\${VAR}=" /tmp/.env 2>/dev/null | cut -d= -f2-)
  ...
done
"@
```

`\${VAR}` — the `\$` is not a PowerShell escape (backtick is). PowerShell expands `${VAR}` as an empty PS variable. The grep pattern breaks.

### Correct — drop the loop, hardcode variable names

```powershell
$script = @"
CID=`$(grep "^VITE_GOOGLE_CLIENT_ID=" /tmp/.env 2>/dev/null | cut -d= -f2- | tr -d '\r')
CSEC=`$(grep "^GOOGLE_CLIENT_SECRET=" /tmp/.env 2>/dev/null | cut -d= -f2- | tr -d '\r')
"@
```

No bash loop variables — nothing for PowerShell to expand. The only `$` signs are prefixed with a backtick (`` ` ``), which is the PowerShell escape for a literal `$`.

### General Rule

Inside a PowerShell `@"..."@` heredoc:

| You want bash to see | Write in heredoc |
|---|---|
| `$VAR` (bash variable) | `` `$VAR `` |
| `${VAR}` (bash variable) | `` `${ ``VAR`}` — or better, avoid bash loop vars entirely |
| `$(command)` (bash subshell) | `` `$(command) `` |
| Literal `$` in a string | `` `$ `` |

When a bash script in a heredoc uses a loop variable (`for VAR in ...`), replace the loop with hardcoded names to eliminate the escaping problem entirely.

### The nginx-config variant (near-miss, 8 Jul 2026)

The netscan `deploy.ps1` Step 8 wrote an nginx proxy block through a `@"..."@`
heredoc containing `proxy_set_header Host \$host;`. `\$` is not a PowerShell
escape, so PowerShell expanded its built-in `$Host` object — the literal string
`System.Management.Automation.Internal.Host.InternalHost` landed in the config —
and `$remote_addr` / `$proxy_add_x_forwarded_for` / `$scheme` (undefined in
PowerShell) blanked to nothing, producing `proxy_set_header X-Real-IP ;`. That is
"invalid number of arguments" and it takes `nginx -t` down. The running nginx
kept serving on its last-good in-memory config, so it looked fine — until the
next reload or reboot, which is precisely the TUC-INC-2026-010 failure mode.

Two fixes, both applied:
1. **Never build nginx config in a double-quoted PowerShell heredoc.** Use a
   SINGLE-quoted here-string `@'...'@` (PowerShell expands nothing) wrapping a
   bash quoted heredoc `<< 'EOF'` (bash expands nothing), so the nginx `$vars`
   pass through literally.
2. **Apply through `nginx-safe-apply` (Pattern 26), never a raw `nginx -s
   reload`.** Validation then catches a bad write before it can take effect, and
   the deploy aborts if the gate binary is absent.

Also seen here: an append-based "dedup" that only stripped some lines left
orphaned `location /api/ {` blocks to accumulate across deploys. For a
single-purpose vhost file, overwrite the whole file each deploy instead of
appending.

### Bonus: CRLF in Windows .env Files

Windows-created `.env.local` files have CRLF line endings. When uploaded via SCP and read with `grep | cut` on Linux, the extracted value includes a trailing `\r`. Always strip it:

```bash
VALUE=$(grep "^KEY=" /tmp/.env | cut -d= -f2- | tr -d '\r')
```

### pm2 restart with env changes

Plain `pm2 restart <app>` may not pick up new environment variables. Always use:

```bash
pm2 restart <app> --update-env
```

---

## PATTERN 21: BOM PROPAGATION INTO EXTRACTED .env VALUES

**Origin:** enhanced-youtube-genie deploy, 1 July 2026.
**Applies to:** Any deploy script that copies keys from WMS `.env` via `grep`.

### Two Forms of BOM Corruption

**Form A — file-header BOM (well-known).** WMS `.env` starts with a UTF-8 BOM (`\xEF\xBB\xBF`). A blind `cp` or `cat` of the whole file carries the BOM into the destination. Strip with `sed 's/^\xEF\xBB\xBF//'` on the output file. Pattern 20 already covers this for CRLF; same approach applies here.

**Form B — value-embedded BOM (the trap).** If the key being grepped is on the **first line** of the BOM-headed source file, `grep '^KEY='` returns `\xEF\xBB\xBFvalue` — the BOM is inside the value string itself. A file-level BOM strip on the destination `.env` does not help because the BOM is mid-file, inside a value.

**Form C — UTF-16 LE file encoding.** A `.env` file created or edited on Windows and SCP'd to the server may be UTF-16 LE instead of UTF-8. `grep` and `sed` treat it as binary. `sed -i` on a UTF-16 file can silently wipe the content (treats the whole file as one "line"). `dotenv` (Node.js) cannot parse UTF-16.

### Symptoms

| Symptom | Likely form |
|---|---|
| `grep: file: binary file matches` | Form B or C — BOM in value or UTF-16 file |
| `GEMINI_PROXY_KEY` set but WMS returns 401 | Form B — BOM prefix in the key value |
| After `sed -i` to delete one key, `.env` becomes empty | Form C — UTF-16 file, `sed` wiped it |
| `file .env` → `Unicode text, UTF-16, little-endian text` | Form C |

### Fix

**Extraction (Form B):** strip BOM from the extracted value, not just the destination file:

```bash
K=$(grep '^GEMINI_PROXY_KEY=' /opt/tuc-wms/.env | head -1 | cut -d= -f2- | tr -d '\r\000' | LC_ALL=C sed 's/\xef\xbb\xbf//g')
```

**Destination file (Form C):** never trust the existing `.env` encoding. Wipe and rebuild from scratch on every deploy:

```bash
# Step 6 — start with an empty, clean file
> "$DEPLOY/.env"
# then write all keys via printf
```

This replaces the old `touch + BOM strip` approach, which failed against UTF-16 files.

**Always overwrite, never conditional.** The `if ! grep -q '^KEY='` pattern preserves a corrupt value across deploys. Use `sed -i '/^KEY=/d'` + re-write instead.

### Rule for All deploy.ps1 Scripts that Copy from WMS

```bash
# Extract with full BOM + CR + null stripping on the VALUE
K=$(grep '^GEMINI_PROXY_KEY=' /opt/tuc-wms/.env | head -1 | cut -d= -f2- | tr -d '\r\000' | LC_ALL=C sed 's/\xef\xbb\xbf//g')
# Always delete old line before writing
sed -i '/^GEMINI_PROXY_KEY=/d' "$DEPLOY/.env"
[ -n "$K" ] && printf 'GEMINI_PROXY_KEY=%s\n' "$K" >> "$DEPLOY/.env" && echo "wrote (len=${#K})"
```

---

## PATTERN 22: `const` TEMPORAL DEAD ZONE IN SERVER STARTUP DIAGNOSTICS

**Origin:** enhanced-youtube-genie server.ts crash, 1 July 2026.
**Applies to:** Any `server.ts` that has a startup `console.log` diagnostic block.

### Root Cause

In a Node.js ES module (`"type": "module"` in `package.json`), `const` declarations are hoisted but **not initialised** until the declaration line is executed. Accessing a `const` before its declaration throws:

```
ReferenceError: Cannot access 'GEMINI_PROXY_KEY' before initialization
```

This is the **temporal dead zone (TDZ)**. Unlike `var`, a `const` cannot be read before its declaration — even if you intend to use it only in a log.

### How It Happens

A diagnostic log is added above an existing `const` declaration — a common pattern when adding visibility to a variable that is already defined "somewhere below":

```typescript
// WRONG — log added above the declaration
console.log(`GEMINI_PROXY_KEY: ${GEMINI_PROXY_KEY ? 'set' : 'MISSING'}`); // TDZ crash

const WMS_GEMINI_URL  = process.env.WMS_GEMINI_URL  || '...';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';
```

### Fix

Declare all variables **before** the diagnostic block:

```typescript
// CORRECT — declarations first
const WMS_GEMINI_URL  = process.env.WMS_GEMINI_URL  || '...';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';

// Diagnostics after all consts are initialised
console.log(`GEMINI_PROXY_KEY: ${GEMINI_PROXY_KEY ? `set (len=${GEMINI_PROXY_KEY.length})` : 'MISSING'}`);
```

### Rule

When adding a new variable to the startup diagnostic block in any `server.ts`, always check that its `const` declaration appears **above** the `console.log` line. If the declaration is further down the file, move it up.

---

## PATTERN 23: PM2 HARD RESTART AFTER ENV / server.ts CHANGE

**Origin:** WMS-only key-custody migration, 2 July 2026 — english-safari deploy.
**Applies to:** Every deploy that changes environment variables OR edits a `server.ts`
run by PM2 through the `tsx` interpreter.

### Root Cause

`pm2 reload` and `pm2 restart --update-env` are NOT reliable after a deploy that changes
either the environment or the code:

1. **Stale env in the process descriptor.** PM2 stores the env captured at the original
   `pm2 start`. `--update-env` re-reads the *shell* environment, not the app's `.env` /
   `.env.local`, and it does **not evict** a previously-stored variable. A `GEMINI_PROXY_KEY`
   baked in months ago keeps being sent even after `/opt/tuc-wms/.env` and the app's `.env`
   are corrected.
2. **Stale transpiled code.** Under `--interpreter npx --interpreter-args tsx`, a `pm2 reload`
   can keep executing the OLD `server.ts` — the new file is on disk but the running process
   never re-transpiles it.

### The Tell-Tale Symptoms

| Symptom | Meaning |
|---|---|
| WMS relay returns **401** (not 503) after you fixed the key | stale non-empty key in PM2 env |
| `pm2 env <id>` key ≠ `/opt/tuc-wms/.env` key | stale env confirmed |
| A `curl` to WMS with the on-disk key returns 200, but the app still 401s | process env, not the file, is wrong |
| Startup banner in `pm2 logs` shows the OLD message after deploy | stale code confirmed |
| A newly added route 404s though the code is on disk | stale code confirmed |

### The Rule

After any deploy that changes env vars or edits `server.ts`, do a **hard** restart —
`pm2 delete` then a fresh `pm2 start` — never rely on `reload`/`restart --update-env`:

```bash
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1
NPXPATH=$(which npx)
pm2 delete "$PM2_APP" >/dev/null 2>&1
cd "$DEPLOY" && NODE_ENV=production PORT="$PORT" pm2 start "$DEPLOY/server.ts" \
  --name "$PM2_APP" --interpreter "$NPXPATH" --interpreter-args tsx --cwd "$DEPLOY" \
  --max-memory-restart 1G
pm2 save --force
```

### Verify — assert the new build is actually running

Grep the startup banner for a string unique to the new build. Give each `server.ts` a
distinctive `app.listen` banner (e.g. change it when you change behaviour) so this check has
something to anchor on:

```bash
pm2 logs "$PM2_APP" --lines 20 --nostream 2>&1 | grep -i 'relay + SPA listening' \
  || echo "[DEPLOY-FAIL] new banner not found — PM2 is running stale code"
```

### Note

A plain `pm2 reload` is still fine for a pure frontend-asset redeploy where neither the env
nor `server.ts` changed. The hard restart is required only when env or backend code moved.
Sequential per-app restarts only — never `pm2 reload all` on the RAM-constrained box (it
spawns everything at once and OOMs; see Pattern 16).

### Corollary: never register a hard interpreter path (8 Jul 2026)

deliberate-magic-reader sat "online" with pid N/A for two days after the 6 Jul reboot,
with an empty error log. Its PM2 entry had been registered with
`--interpreter <app>/node_modules/.bin/tsx` (a hard path). A pnpm reinstall relinked
`.bin` after registration, the symlink vanished, and every resurrect spawned nothing —
too early to log anything, so PM2 kept reporting "online". Always register with
`--interpreter npx --interpreter-args tsx`, which resolves tsx by name at each spawn.
Detection: `pm2 ls` shows pid N/A with 0 restarts, and the port answers `000`.

---

*Last updated: 2 July 2026 — Daniel Frempong Twum / TUC ICT*  
*Core session directives → see CLAUDE.md*


---

## PATTERN 24: BUILT-SPA BUNDLE GUARD (NO-JS BLACK SCREEN)

### Root Cause

A Vite SPA whose source `index.html` loses its module entry tag
(`<script type="module" src="/index.tsx"></script>`) still builds without
any error. `vite build` emits a dist/index.html that ships no application
JavaScript at all: the page loads, the console is clean, `#root` stays
empty, and a dark default theme paints the viewport black. Old working
`dist/` folders on the server mask the defect until the first clean
rebuild ships it (dmcdai went black this way on 4 Jul 2026; markai,
willpro and techbridge-ai-blueprint carried the same latent defect).

### The Rule

Never ship a `dist/` whose index.html references no JS bundle. Every
deploy script must verify, between build and rsync/scp:

```bash
if ! grep -Eq '<script[^>]+(src="[^"]*\.js"|type="module")' dist/index.html; then
  echo '[FATAL] dist/index.html ships no JS bundle. Aborting deploy.'; exit 1
fi
```

All fleet `deploy.ps1` scripts carry this guard in both build paths as of
4 Jul 2026 (bash server-side builds and the local-dist copy branch).
Standalone checkers: `scripts/verify-dist.sh` and `scripts/Verify-Dist.ps1`.

### Verify

```
bash scripts/verify-dist.sh <app-dir>     # [OK] ... references a JS bundle
```

A page that builds but ships no `<script type="module">` or `assets/*.js`
reference must fail the deploy, never reach the web root.


---

## PATTERN 25: GOLD-STANDARD DEPLOY PIPELINE (dmcdai REFERENCE)

### Why

The dmcdai rollout of 4 Jul 2026 exercised every failure mode the fleet has
hit: a build that shipped no JS, assets served as text/html behind the nginx
sub-path, API routes missing their prefixed twins, a stale-build check that
cried wolf, and a deploy that ran one commit behind the fix it was meant to
ship. Its deploy script now carries the counter-measure for each, verified
live. New apps copy `dmcdai-digital-media-communication-design/deploy.ps1`;
existing scripts converge on it when next touched.

### The Stages

```
1. Approval gate            Approve-App.ps1 before anything ships
2. Git state print          commit hash + branch logged; confirm the fix you
                            think you are shipping is actually in the log
3. Server-side build        sparse clone (depth 1) + pnpm install + pnpm build
                            with CI=true; builds from main, never local state
4. Bundle guard             Pattern 24: abort unless dist/index.html
                            references a JS bundle
5. rsync dist               --delete with backend exclusions (.env,
                            server.*, package.json, lockfiles, ecosystem)
6. .htaccess + permissions  SPA rewrite with existing-file passthrough
7. Backend + env            ship server file; inject env file-to-file only,
                            secrets never on a command line or in output
8. Hard restart             Pattern 23: pm2 delete + fresh start (never
                            reload/restart --update-env)
9. Boot-banner poll         grep pm2 logs for the app's boot banner every 3s
                            up to 30s; single-shot checks false-alarm on tsx
10. Health checks           index present, port listening, GET /api/health
                            returns { ok, service, custody } — custody proves
                            which key mode the running build uses
```

### Companion app-side rules (what the pipeline assumes)

- index.html carries its module entry tag (Pattern 24 catches the miss).
- One middleware normalises the nginx sub-path prefix for ALL /api routes;
  per-route dual registration has missed routes twice, do not use it.
- express.static mounted at both the bare root and the sub-path; backend
  files in the docroot answer 404 over HTTP.
- The boot banner and the /api/health custody field exist so stages 9-10
  have something real to assert.

### Verify

A green run ends with: bundle guard passed, 'OK new build running' from the
banner poll, and a health JSON whose custody field matches the intended key
mode ('wms-relay' for Pattern 11 apps).

---

## PATTERN 26: NGINX CONFIG CHANGE GATE (WHOLE-DOMAIN OUTAGE GUARD)

### Why

Incident TUC-INC-2026-010 (6 Jul 2026): an AI-assisted session generating an
nginx config for NetScan was cut off mid-write when its credits ran out,
leaving a half-written file on the server. The running nginx was unaffected,
so nothing looked wrong. When the server rebooted the next morning, nginx
read the broken file, refused to start, and entered a restart loop. Because
one nginx fronts every vhost, techbridge.edu.gh and all subdomains were down
for roughly four hours.

Two properties of nginx make this class of failure nasty:

1. **Configs are landmines, not tripwires.** nginx only reads config at
   start or reload. A broken file can sit on disk for days looking harmless,
   then take the whole domain down at the next reboot.
2. **Blast radius is total.** One invalid file for one tool fails validation
   for the entire config tree. Every site behind that nginx goes down
   together.

### The Rules

1. **Never edit a live nginx config in place.** Write the candidate to a
   separate file first, then install it through the gate below.
2. **Validate before it can take effect.** `nginx -t` must pass after the
   file is installed and before any reload. On failure, restore the previous
   file immediately.
3. **Reload, never restart.** `systemctl reload nginx` keeps the old config
   serving if the new one is bad. `systemctl restart nginx` takes the site
   down and gambles on the new config being valid. Restart only when a
   reload provably cannot apply the change (new listen ports, module
   changes).
4. **Config writes are atomic units of work.** An infra-config change is
   never left half-done at the end of a session, credit limit or not. If a
   session doing nginx work is interrupted for any reason, the first action
   on resume (or by a human) is `nginx -t`.
5. **Catch latent breakage daily.** A cron `nginx -t` catches a landmine
   before the next reboot does:

   ```
   0 7 * * * nginx -t >/dev/null 2>&1 || echo "nginx -t FAILED on $(hostname) - config invalid, next reboot will take the site down" | mail -s "URGENT: nginx config invalid" daniel.twum@techbridge.edu.gh
   ```

6. **Plesk boxes:** put per-vhost custom directives in
   `/var/www/vhosts/system/<domain>/conf/vhost_nginx.conf` and let Plesk
   include them. Never hand-edit files Plesk regenerates.

### The Gate Script

`scripts/nginx-safe-apply.sh` (deploy to `/usr/local/sbin/nginx-safe-apply`
on the server). Backs up the target, installs the candidate, runs
`nginx -t`, reloads on success, restores the backup and leaves nginx
untouched on failure. Exits non-zero on rollback so calling scripts abort.

```
nginx-safe-apply /var/www/vhosts/system/techbridge.edu.gh/conf/vhost_nginx.conf /root/candidate.conf
```

### Verify

A green apply ends with `[OK] ... applied and nginx reloaded` and
`systemctl is-active nginx` returning `active`. A failed apply ends with
`[ROLLBACK]` plus a non-zero exit, and every vhost still serves.

---

## PATTERN 27: LOCKFILES MUST RESOLVE UNDER THE SERVER'S minimumReleaseAge POLICY

### Why

The deploy server's pnpm (11.9.0) enforces a `minimumReleaseAge` supply-chain
policy: it rejects any package published within a rolling cutoff (~24h) as a
guard against just-published malicious releases. On 8 Jul 2026 a fail2ban-ai
`-Build` failed with `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` because the
lockfile had been regenerated in a sandbox with no such policy, which resolved
three transitive deps (`@types/node`, `@types/express-serve-static-core`,
`electron-to-chromium`) to versions published hours earlier. The server refused
them.

### The Trap

- A sandbox / dev machine without the policy resolves to the **latest** version
  of everything. The server then rejects the too-new entries.
- `pnpm install --no-frozen-lockfile` does **not** fix it: when the lockfile
  already matches `package.json`, pnpm skips resolution ("Lockfile is up to
  date, resolution step is skipped") and goes straight to the policy check,
  which fails. It only re-resolves when the lockfile is actually removed.

### The Rule

1. **Never regenerate a lockfile off-server.** Adding a dependency, or any
   change that rewrites `pnpm-lock.yaml`, must be resolved on the deploy server
   (or any environment with the same `minimumReleaseAge` policy), so pnpm steers
   resolution to versions old enough to pass.
2. To regenerate under the policy: on the server clone, force a fresh
   resolution and copy the result back into the repo:
   ```bash
   cd <clone>/<app> && rm -f pnpm-lock.yaml && pnpm install   # picks pre-cutoff versions
   ```
   ```powershell
   scp root@techbridge.edu.gh:<clone>/<app>/pnpm-lock.yaml <repo>\<app>\pnpm-lock.yaml
   ```
   Then commit the policy-clean lockfile. `--frozen-lockfile` passes on the next
   deploy.
3. **Do not relax or disable the policy** to make a build pass — it is a
   security control (CLAUDE.md §12). Fix the lockfile, not the guard.

### Detection

`ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` in a `-Build`, naming each package and
its publish time versus the cutoff. A fresh resolution that picks a version with
"(newer available)" beside it is the policy working as intended, not a problem.

---

## PATTERN 28: MATCH THE NGINX BLOCK TO THE APP'S ARCHETYPE (STATIC-SPA vs SELF-SERVING NODE)

### Why

10 Jul 2026, found by a random regression sweep: `ai-tools.techbridge.edu.gh/stockpulse/`
returned `{"error":"Route not found"}` on every page load. The static SPA and a correct
`.htaccess` were sitting in the docroot, unused, because two nginx blocks added during the
1 Jul port-fix sweep proxied the whole sub-path to the API-only backend:

```
location /stockpulse/ { proxy_pass http://localhost:3020/stockpulse/; }   # kills the SPA
location /stockpulse/api/ { proxy_pass http://localhost:3020/stockpulse/api/; }  # wrong path too
```

The self-serving-Node template (`location /app/ → proxy_pass backend`) was applied to an app
that isn't one. stockpulse is a **static SPA + separate API backend**, designed to run on its
Apache `.htaccess` (static files served directly; only `/api/` proxied, with the `/stockpulse`
prefix stripped). Proxying everything to an API-only Express server 404s every non-`/api/` route.

### The two fleet archetypes

| Archetype | Serves the SPA | Correct nginx |
|---|---|---|
| **Self-serving Node** (aitopia, fail2ban-ai, brand-guideline-checker) | the Node server (`express.static` + SPA fallback) | `location /app/ { proxy_pass http://127.0.0.1:PORT; }` — one block, everything to Node |
| **Static SPA + API** (stockpulse) | Apache/Plesk static from the docroot; `.htaccess` proxies `/api/` and does the SPA fallback | **no nginx location at all** — let nginx fall through to Apache so `.htaccess` runs |

### The Rules

1. **Before adding an nginx `location /app/` block, check whether the app serves its own SPA.**
   If the docroot holds `index.html` + `assets/` + an `.htaccess` with a `RewriteRule ^api/`,
   it is static-SPA+API — do **not** add a catch-all proxy; it shadows Apache and breaks the SPA.
2. **A self-serve proxy_pass must go to a server that serves the SPA.** An API-only backend
   (routes only under `/api`, 404s everything else) is never a valid target for `location /app/`.
3. **Watch the proxy path.** `proxy_pass http://localhost:PORT/app/api/` forwards the `/app`
   prefix; if the backend mounts routes at `/api` (not `/app/api`), it 404s. Strip the prefix
   (`proxy_pass .../api/`) or rely on the `.htaccess` which already rewrites `^api/(.*)$ → /api/$1`.

### The fix (reversible, pattern-based)

Remove the mismatched blocks so nginx falls back to Apache + `.htaccess`:

```bash
CONF=/var/www/vhosts/system/<domain>/conf/vhost_nginx.conf
cp -p "$CONF" "${CONF}.bak-$(date +%Y%m%d-%H%M%S)"
awk '
/^[[:space:]]*location \/<app>\// { inblk=1 }
inblk { if (/\{/) d++; if (/\}/) { d--; if (d<=0){inblk=0; d=0}; next } next }
{ print }
' "$CONF" > "${CONF}.new"
cp "${CONF}.new" "$CONF" && nginx -t && systemctl reload nginx || cp -p "${CONF}.bak-"* "$CONF"
```

### Verify

`curl -w "%{http_code} %{content_type}"` the app root and `index.html` → `200 text/html`
(SPA served, not the backend's JSON 404), and a real API route (`/app/api/health`) →
`200 application/json`. Note: the nginx `-n` line numbers from `nginx -T` are offsets in the
whole assembled dump, **not** positions in `vhost_nginx.conf` — always `grep -n 'location /<app>'`
the file itself before deleting by line, or delete by pattern as above.

---

## PATTERN 29: A SUB-PATH SPA WITH NESTED ROUTES NEEDS AN ABSOLUTE VITE BASE

### Why

11 Jul 2026, found by a browser smoke of the Lyricist deploy: the app root
`/patois/` loaded fine, but the OAuth return URL `/patois/auth/callback?mfa_ticket=...`
died with `Failed to load module script: Expected a JavaScript-or-Wasm module but the
server responded with a MIME type of "text/html"` for every bundle, plus a manifest
syntax error. Sign-in could never complete because the SPA never booted on the one
route the SSO flow always lands on.

The root cause is subtle and passes every curl check. `vite.config.ts` had
`base: './'`, so the built `index.html` referenced assets **relative**:
`src="./assets/index-*.js"`. The browser resolves that against the *current* URL:

- on `/patois/` → `/patois/assets/index-*.js` ✅
- on `/patois/auth/callback` (one level deeper) → `/patois/auth/assets/index-*.js` ❌

The deeper path has no such file, so express.static misses and the SPA fallback
returns `index.html` (text/html) with a 200 — which is exactly why the earlier
`curl -w "%{http_code}"` on the callback said `200` and looked healthy. Status 200
on the *document* says nothing about whether its nested-route assets resolve; only a
real browser (or a curl of the asset URL the browser would compute) exposes it.

### The rule

An SPA served under a fixed sub-path that has **any** client route deeper than the
base (an OAuth callback, `/app/settings/x`, etc.) must build with an **absolute**
base equal to that sub-path, not a relative one:

```ts
// vite.config.ts — app served at https://host/patois/
base: '/patois/',   // NOT './'
```

Absolute base pins every bundle to `/patois/assets/...` regardless of how deep the
current route is. Relative base (`./`) only works for a flat app served at its base
and breaks the moment a route goes deeper.

Vite rewrites the module/style tags it manages, but it does **not** rewrite
hand-authored `<link>` refs in `index.html` (`rel="manifest"`, `apple-touch-icon`,
`icon`). Make those absolute by hand too, or they 404-to-fallback on deep routes the
same way (the manifest syntax error above):

```html
<link rel="manifest" href="/patois/manifest.json" />   <!-- not ./manifest.json -->
```

Relative base is the right choice only for `file://`-served builds (Capacitor/mobile);
a web app behind a sub-path is the opposite case. If a project later adds a mobile
build, override base per-mode rather than reverting the web default to `./`.

### Verify

Don't trust a `%{http_code}` on the document. Curl the asset URL the browser computes
from the **deep** route, and confirm it is JS, not the HTML fallback:

```bash
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" \
  "https://ai-tools.techbridge.edu.gh/patois/assets/$(curl -s https://ai-tools.techbridge.edu.gh/patois/ | grep -oE 'assets/index-[^\"]+\.js' | head -1)"
# expect: 200 text/javascript   (NOT 200 text/html)
```
Then load `/patois/auth/callback` in a real browser with DevTools open — zero red
module-load errors in the console is the true pass.

---

## PATTERN 30: TOTP ENROLMENT — SHOW THE BASE32 KEY, NOT THE RAW `secret`

### Why

11 Jul 2026, found when the Head of ICT hit patois's WMS MFA enrolment as a genuine
first-timer. The `WmsMfaModal` enrol screen showed a "Setup key" of
`r4YvB2QqTbsZ/ccWuFIuAxxXw5s=` and no QR. Microsoft/Google Authenticator both
rejected that key, and there was nothing to scan — enrolment was a dead end.

`GET /api/auth/mfa/enroll/begin` returns two fields:

```json
{ "secret": "r4YvB2QqTbsZ/ccWuFIuAxxXw5s=",              // base64 — a server round-trip token
  "otpauthUri": "otpauth://totp/TUC-WMS:me@...?secret=V6DC6B3EFJG3WGP5Y4LLQUROAMOFPQ43&..." }
```

The value a human types into an authenticator is the **base32** `secret=` param inside
`otpauthUri` (chars `A–Z2–7` only). The top-level `secret` is **base64** (`+ / =`,
lowercase) — it is only the token the client sends back at `enroll/confirm`, never
something a user enters. Surfacing `secret` under a "Setup key" label guarantees a
failed manual entry. patois's modal did exactly that; markai masked the same bug
because its QR (which encodes `otpauthUri`) was the primary path and nobody read the
"can't scan" line.

### The rule

For any TOTP enrolment UI:

1. **Render a QR of `otpauthUri`, generated client-side** (`qrcode` ^1.5.4, bundled —
   already in markai and patois). The TOTP secret must never be sent to an external
   QR service — that leaks a credential (SEC §12). Scanning is the 99% path.
2. **Manual fallback shows the base32 key parsed from `otpauthUri`**, not the raw
   `secret`:
   ```ts
   const manualKey = new URLSearchParams(otpauthUri.split('?')[1]).get('secret');
   ```
3. Keep the raw `secret` in state only to POST back at `enroll/confirm`; never label
   it "Setup key" or show it for entry.

### Gotcha: single-use ticket

`mfa_ticket` is single-use and short-lived. Retrying enrolment on an old tab reuses a
consumed ticket → `enroll/begin` and `auth/refresh` return `401`. Enrol from one fresh
sign-in, start to finish; those 401s are stale-ticket noise, not a broken endpoint.

### Verify

First-time enrol from a fresh sign-in: a QR renders, a real authenticator scan +
6-digit code completes `enroll/confirm`, and the next sign-in shows the *verify* step.
The manual key, if typed instead of scanned, must also succeed (proves it's base32).
