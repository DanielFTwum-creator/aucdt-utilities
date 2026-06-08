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

*Last updated: May 2026 — Daniel Frempong Twum / TUC ICT*  
*Core session directives → see CLAUDE.md*
