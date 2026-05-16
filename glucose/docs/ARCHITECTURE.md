# Technical Architecture — Glucose v1.1.0

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  App.tsx (Main Shell)                                │  │
│  │  - LoginView / Dashboard state machine               │  │
│  │  - Data grid + charts rendering                      │  │
│  │  - Modal management (edit, admin, help)              │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                    ↓                     ↓         │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ AuthContext  │  │ AdminContext     │  │ Components   │  │
│  │ (OAuth)      │  │ (Password Gate)  │  │ (Test, Help) │  │
│  └──────────────┘  └──────────────────┘  └──────────────┘  │
│         ↓                    ↓                     ↓         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ IndexedDB (glucoseDB)                                │ │
│  │ - readings table                                    │ │
│  │ - profile table                                     │ │
│  │ - adminConfig table                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         ↓                              ↓
    ┌─────────────────┐          ┌────────────────┐
    │ Google OAuth    │          │ Gemini Vision  │
    │ API            │          │ API (OCR)      │
    └─────────────────┘          └────────────────┘
```

---

## Component Hierarchy

### App.tsx (Main Application)

**Responsibilities:**
- Root component (wrapped by AuthProvider + AdminProvider)
- State management (rows, profile, viewMode, unit, theme, modals)
- Conditional rendering (LoginView vs Dashboard)
- Event handlers (add, edit, delete, scan, import, export)

**Key State:**
```typescript
// Data
const [rows, setRows] = useState<Row[]>([]);
const [profile, setProfile] = useState<ProfileData>({});

// UI State
const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
const [selectedMonth, setSelectedMonth] = useState(currentMonth);
const [selectedYear, setSelectedYear] = useState(currentYear);
const [unit, setUnit] = useState<'mmol/L' | 'mg/dL'>('mmol/L');
const [isHighContrast, setIsHighContrast] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);
const [showTrendlines, setShowTrendlines] = useState(true);
const [showHelp, setShowHelp] = useState(false);

// Loading states
const [isScanning, setIsScanning] = useState(false);
```

**Lifecycle:**
```
useEffect() {
  - Load auth state from localStorage
  - Load readings from IndexedDB
  - Load profile settings
  - Set theme from localStorage
}
```

---

### Context Providers

#### AuthContext.tsx

**Purpose:** OAuth 2.0 session management

**State:**
```typescript
interface AuthContextType {
  user: { id: string; email: string; fullName: string } | null;
  isAuthenticated: boolean;
  logout: () => void;
}
```

**Flow:**
1. User clicks "Sign in with Google"
2. Google consent screen
3. OAuth redirect with code
4. Token exchange + user profile fetch
5. Store `{ id, email, fullName }` in localStorage with key `glucose_user`
6. App reads from localStorage on mount

**Logout:**
- Clears localStorage entry `glucose_user`
- Returns to LoginView
- **Must be paired with `adminLogout()`** for complete session clear

---

#### AdminContext.tsx

**Purpose:** Admin password gate + audit logging

**State:**
```typescript
interface AdminContextType {
  isAdmin: boolean;
  adminPassword: string;
  auditLog: AuditEntry[];
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;
  logAction: (action: string) => void;
}

interface AuditEntry {
  timestamp: string;  // ISO 8601
  action: string;     // e.g., "ADMIN_LOGIN"
  user?: string;
  details?: string;
}
```

**Flow:**
1. User clicks "Admin" button
2. Modal prompts for password
3. Compare input to `adminConfig.adminPassword` in IndexedDB
4. If match → store in sessionStorage, set `isAdmin = true`
5. Admin panel becomes visible
6. All admin actions logged to `auditLog`
7. On logout → clear sessionStorage, set `isAdmin = false`

**Audit Log Limits:**
- Max 1000 entries
- Oldest entries pruned when exceeded
- Never cleared except on admin action

---

### Components

#### TestContainer.tsx

**Purpose:** E2E test UI

**Props:** None (uses internal state)

**Behavior:**
- Renders "Run Full Test Suite" button initially
- On click → calls `runTestSuite()`
- Streams test progress to state
- Displays test results with status (running/pass/fail)
- Shows RealScreenshot for each test

---

#### RealScreenshot.tsx

**Purpose:** Display captured PNG images for E2E tests

**Props:**
```typescript
interface RealScreenshotProps {
  state: ScreenshotState;  // Maps to screenshot filename
}

type ScreenshotState =
  | { type: 'oauth', step: 'login-view' | ... }
  | { type: 'admin', step: 'admin-modal' | ... }
  | { type: 'dashboard', step: 'stats-overview' | ... }
  | ...
```

**Rendering:**
- Maps state to screenshot filename (e.g., `oauth-login-view`)
- Constructs path: `/screenshots/e2e/{name}.png`
- Renders `<img>` tag with browser chrome mockup
- On error → shows "Screenshot not yet captured" fallback

---

#### HelpModal.tsx

**Purpose:** User guide modal

**Props:**
```typescript
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Content:** 6 expandable sections with instructions

---

## State Management Pattern

### Data Flow (Unidirectional)

```
[User Action] → [Event Handler] → [IndexedDB Write] → [Local State Update] → [Re-render]
```

**Example: Add Reading**
```typescript
const handleAddReading = async (data: ReadingInput) => {
  // 1. Write to IndexedDB
  const newRow = await upsertReading(data);
  
  // 2. Update local state
  setRows([...rows, newRow]);
  
  // 3. Component re-renders with new data
};
```

### Memoization

```typescript
// Filter data based on viewMode (recalculates when viewMode/rows change)
const filteredRows = useMemo(() => {
  return viewMode === 'month'
    ? rows.filter(r => isInMonth(r.date, selectedMonth, selectedYear))
    : rows.filter(r => isInYear(r.date, selectedYear));
}, [rows, viewMode, selectedMonth, selectedYear]);

// Calculate stats from filtered data
const avgFasting = useMemo(() => {
  return filteredRows.length > 0
    ? average(filteredRows.map(r => parseFloat(r.fasting || '0')))
    : null;
}, [filteredRows]);
```

---

## Database Schema

### IndexedDB (glucoseDB v1.0)

#### readings

| Field | Type | Constraints | Index |
|-------|------|-------------|-------|
| id | String | Primary Key (UUID) | ✓ |
| date | String | Format: YYYY-MM-DD | ✓ |
| fasting | String | mmol/L (nullable) | - |
| post_breakfast | String | mmol/L (nullable) | - |
| pre_lunch | String | mmol/L (nullable) | - |
| post_lunch | String | mmol/L (nullable) | - |
| pre_dinner | String | mmol/L (nullable) | - |
| post_dinner | String | mmol/L (nullable) | - |
| createdAt | Number | Timestamp (ms) | - |
| updatedAt | Number | Timestamp (ms) | - |

**Example:**
```json
{
  "id": "uuid-123",
  "date": "2026-05-16",
  "fasting": "7.2",
  "post_breakfast": "8.1",
  "pre_lunch": "6.8",
  "post_lunch": "7.5",
  "pre_dinner": "7.0",
  "post_dinner": "8.2",
  "createdAt": 1715837400000,
  "updatedAt": 1715837400000
}
```

#### profile

| Field | Type |
|-------|------|
| patientName | String |
| doctorName | String |
| notes | String |

#### adminConfig

| Field | Type |
|-------|------|
| adminPassword | String |
| auditLog | Array<AuditEntry> |

---

## API Integration

### Gemini Vision API

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContentStream`

**Authentication:** API Key (from `.env.local`)

**Request Format:**
```json
{
  "contents": {
    "parts": [
      {
        "text": "Extract glucose readings from this handwritten log image..."
      },
      {
        "inlineData": {
          "data": "base64encodedimage...",
          "mimeType": "image/png"
        }
      }
    ]
  },
  "config": {
    "temperature": 0,
    "responseMimeType": "application/json",
    "responseSchema": {
      "type": "ARRAY",
      "items": { ... }
    }
  }
}
```

**Response Format:**
```json
[
  {
    "date": "2026-05-16",
    "reading_type": "fasting",
    "value": 7.2,
    "confidence": "high"
  },
  ...
]
```

**Error Handling:**
- Network error → show toast "Network error, try again"
- Invalid image → "Could not extract readings from image"
- Empty extraction → "No readings detected in image"
- Rate limit → exponential backoff retry

---

## Build & Deployment Pipeline

### Development

```bash
pnpm run dev
# Starts Vite dev server on localhost:3010
# Hot module replacement enabled
# Tailwind CSS compiled in-memory
```

### Production Build

```bash
pnpm run build
# Vite builds to dist/ folder:
# - JavaScript bundles (main + lazy splits)
# - CSS bundles (Tailwind minified)
# - Index.html (references assets)
# - Public assets copied (screenshots, logo)
# - Source maps generated (development)
```

**Output Structure:**
```
dist/
├── index.html              # Single-page app entry
├── assets/
│   ├── index-*.js          # Main bundle (~271 KB)
│   ├── index-*.css         # Tailwind CSS (~50 KB)
│   ├── recharts-*.js       # Chart library (~379 KB)
│   ├── idb-*.js            # IndexedDB helpers (~3 KB)
│   └── genai-*.js          # Gemini API wrapper (empty)
├── auth/
│   └── index.html          # OAuth callback handler
└── screenshots/e2e/        # E2E test images
```

### Deployment

```bash
pnpm run deploy
# 1. SSH to remote server
# 2. Create /var/www/.../glucose/ directory
# 3. SCP dist/* to remote
# 4. Create .htaccess with SPA routing rules
# 5. Set file permissions (755 dirs, 644 files)
```

**Remote Path:** `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/`

**URL Routing** (in .htaccess):
```
/glucose/                    → index.html
/glucose/rophe-logo.jpg     → rophe-logo.jpg (pass-through)
/glucose/screenshots/e2e/*  → screenshots/* (pass-through)
/glucose/assets/*           → assets/* (pass-through)
/glucose/any-other-path     → index.html (React Router handles)
```

---

## Performance Optimization

### Code Splitting

**Chunks:**
- `index.js` — Main app code (~271 KB gzip)
- `recharts.js` — Chart library (~379 KB)
- `idb.js` — IndexedDB helpers (~3 KB)

**Why:** Recharts is large but used only for charts; separate chunk allows caching independently.

### CSS Optimization

- **Tailwind JIT:** Only used classes compiled
- **PurgeCSS:** Unused styles removed in production
- **Minification:** Final CSS ~50 KB (gzip ~9.5 KB)

### Rendering Optimization

- Charts: `isAnimationActive={false}` (instant render)
- Data grid: Paginated (25 rows/page)
- Filters: Memoized with `useMemo()`
- No unnecessary re-renders (proper React best practices)

### Bundle Size

| Asset | Size | Gzip | Purpose |
|-------|------|------|---------|
| index.js | 271 KB | 81 KB | App logic |
| recharts.js | 379 KB | 112 KB | Charts |
| index.css | 50 KB | 9.5 KB | Styles |
| idb.js | 3 KB | 1.2 KB | Database |
| **Total** | **703 KB** | **203 KB** | - |

---

## Error Handling

### Try-Catch Blocks

**Scan Image Flow:**
```typescript
try {
  const readings = await scanImage(file);
  await batchUpsertReadings(readings);
  setRows([...rows, ...readings]);
} catch (error) {
  if (error.message.includes('INVALID_API_KEY')) {
    showError('API key not configured');
  } else if (error.message.includes('NETWORK')) {
    showError('Network error, try again');
  } else {
    showError('Could not extract readings from image');
  }
}
```

### User-Facing Messages

- ✅ Success toast: "Reading added" (green, 3 sec auto-close)
- ⚠️ Warning: "Could not extract readings" (yellow)
- ❌ Error: "Network error, try again" (red, manual close)

---

## Testing Architecture

### E2E Test Runner

**Flow:**
```
runTestSuite()
├── For each suite:
│   ├── Set status = 'running'
│   ├── For each test:
│   │   ├── Set test status = 'running'
│   │   ├── Validate DOM (checkElement, checkTextExists)
│   │   ├── Set test status = 'pass' or 'fail'
│   │   ├── Stream to UI via callback
│   └── Set suite status = 'pass' or 'fail'
└── Return final results
```

### Screenshot Capture

**Tool:** Playwright (headless Chromium)

**Flow:**
```
capture-real-screenshots.ts
├── Launch browser
├── Navigate to http://localhost:3010
├── Pre-authenticate with test user (localStorage injection)
├── For each test scenario:
│   ├── Navigate/interact with UI
│   ├── Wait for element (5 sec timeout)
│   ├── Capture screenshot
│   ├── Save to public/screenshots/e2e/{name}.png
├── Generate manifest.json
└── Report results
```

---

## Security Architecture

### Authentication Flow

```
User → Google OAuth → Token → localStorage → React State
       ↓
    Session persists across refresh
    ↓
    Logout → clear localStorage → redirect to LoginView
```

### Admin Password Flow

```
Password Input → Compare to IndexedDB → sessionStorage (if match)
                                      → Audit log entry
                                      ↓
                                   Set isAdmin=true
                                   ↓
                                   Logout → clear sessionStorage
```

### Data Privacy

- **No cloud sync** — All data stored locally
- **No transmission** — Glucose data never leaves browser
- **IndexedDB:** Local disk storage (protected by browser sandbox)
- **Export:** User-initiated JSON download (unencrypted)

---

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |

**Requires:**
- ES2020 JavaScript (async/await, optional chaining)
- IndexedDB API
- Fetch API
- LocalStorage

---

## Known Limitations

1. **Single-Browser Sync:** Data not synced across browsers (local-only)
2. **No Offline Reads:** Must have network to fetch Gemini API (scan feature)
3. **Gemini API Dependency:** App full features require API access
4. **Mobile Portrait:** Not optimized for portrait mode on phones
5. **Large Datasets:** Charts may lag with 10,000+ readings

---

*Last updated: May 16, 2026*  
*Architecture follows React best practices and TUC standards*
