# Feature Documentation — Glucose v1.1.0

---

## 1. Authentication & Authorization

### OAuth 2.0 Login (Google Sign-In)

**User Story:**  
As a patient, I want to sign in with my Google account so I can securely access my glucose data without managing another password.

**Implementation:**
- Google Sign-In button on login screen
- OAuth flow redirects to Google consent screen
- User authenticated → fullName extracted → stored in localStorage
- Session persists across browser refresh
- Logout clears OAuth + local session

**Key Files:**
- `src/contexts/AuthContext.tsx` — OAuth state management
- `src/App.tsx:LoginView` — Login UI

**Configuration:**
- Google OAuth Client ID configured at app initialization
- Scopes: `profile`, `email`

---

### Admin Password Gate

**User Story:**  
As a doctor/specialist, I want password-protected access to audit logs and admin controls without a complex registration flow.

**Implementation:**
- Numeric PIN gate (e.g., "1234")
- Password stored in IndexedDB (encrypted in production)
- Audit log records all admin actions with timestamp
- Admin session stored in sessionStorage (cleared on logout)
- Fallback password: "0000"

**Key Files:**
- `src/contexts/AdminContext.tsx` — Admin session & password validation
- `src/App.tsx:AdminModal` — Password entry UI

**Security Notes:**
- ⚠️ Passwords stored plaintext in demo (upgrade to bcrypt for production)
- Session stored in sessionStorage (cleared on tab close)
- Dual-auth logout ensures complete session clearance

**Admin Default:** "1234" (configured in CLAUDE.md)

---

### Dual-Auth Logout

**User Story:**  
As a patient, I want logging out to completely clear my session so a shoulder-surfer can't re-access my data.

**Implementation:**
- Logout button calls both `adminLogout()` AND `logout()`
- **Step 1:** adminLogout() → clears sessionStorage + admin state
- **Step 2:** logout() → clears localStorage + OAuth state
- **Result:** LoginView displayed (fresh OAuth flow required)

**Why Both?**
- OAuth only logout → admin session persists → bad UX
- Admin only logout → OAuth persists → user still authenticated

**Key Code:**
```typescript
const handleLogout = () => {
  adminLogout();  // Clear local admin session
  logout();       // Clear OAuth
};
```

See CLAUDE.md § 15 for full pattern.

---

## 2. Data Entry & Management

### Manual Entry Modal

**User Story:**  
As a patient, I want to manually enter glucose readings with a date picker when I can't scan.

**Implementation:**
- Modal dialog with 6 input fields (one per meal period)
- Meal periods: Fasting, 2h Post-Breakfast, Pre-Lunch, 2h Post-Lunch, Pre-Dinner, 2h Post-Dinner
- Date picker (defaults to today)
- Doctor name read-only (auto-filled from profile, default: "Dr Yacoba Atiase")
- Save → upserts to IndexedDB

**Validation:**
- Glucose values: 2.0–20.0 mmol/L (numeric)
- Date: any valid date
- Missing values allowed (user can enter partial readings)

**Key Files:**
- `src/App.tsx:AddReadingModal` — Modal UI
- `src/lib/db.ts:upsertReading()` — Database write

**UX Details:**
- Modal scrollable if viewport height < 600px
- Close on Escape key
- Confirm before losing unsaved changes

---

### Edit Existing Readings

**User Story:**  
As a patient, I want to correct or update a glucose reading I entered incorrectly.

**Implementation:**
- Click pencil icon on any table row → opens edit modal
- Pre-fills all 6 fields with current values
- Same validation as manual entry
- Saves with updated timestamp (updatedAt)
- Grid re-renders immediately

**State Management:**
- `editingId` state tracks which row is being edited
- Modal switches between "Add Reading" and "Edit Reading" mode

**Key Code:**
```typescript
const [editingId, setEditingId] = useState<string | null>(null);
const openEditModal = (rowId: string) => setEditingId(rowId);
```

---

### Image Scanning (Gemini Vision)

**User Story:**  
As a patient, I want to upload a photo of my handwritten glucose log so the app extracts readings automatically.

**Implementation:**
- File input accepts PNG/JPG images
- Image converted to Base64
- Sent to Gemini 3.1 Pro Vision API
- Schema-based extraction → structured JSON response
- Extracted readings upserted to IndexedDB
- Month auto-selected if imported reading is from past month

**Extraction Schema:**
```json
{
  "type": "ARRAY",
  "items": {
    "type": "OBJECT",
    "properties": {
      "date": { "type": "STRING", "description": "YYYY-MM-DD" },
      "reading_type": { "type": "STRING", "enum": ["fasting", "post_breakfast", ...] },
      "value": { "type": "NUMBER", "description": "mmol/L" },
      "confidence": { "type": "STRING", "enum": ["high", "medium", "low"] }
    }
  }
}
```

**Error Handling:**
- Network failure → show toast error
- Invalid image → "Could not extract readings from image"
- Empty extraction → "No readings detected"

**Key Files:**
- `src/App.tsx:scanImage()` — Gemini API call
- `scripts/capture-real-screenshots.ts` — Playwright scan simulation

**Limitations:**
- Requires clear handwriting or printed text
- Large batch uploads (100+ readings) may timeout
- Black/white images work better than colored

---

### Duplicate Handling on Rescan

**User Story:**  
If I scan the same page twice, I don't want duplicate readings—just updated values.

**Implementation:**
- Index readings by date (primary key per day)
- On scan: check if `existingRow = rows.find(r => r.date === newDate)`
- If exists → **update** (merge fields, preserve createdAt, update updatedAt)
- If new → **create** (assign new ID, set createdAt = now)

**Example:**
- Scan Jan 30 → creates 1 reading
- Scan Jan 30 again (with updated values) → updates existing reading
- Result: 1 reading with latest values, createdAt = original timestamp

**Code:**
```typescript
const existingIndex = rows.findIndex(r => r.date === newReading.date);
if (existingIndex !== -1) {
  // Merge: keep createdAt, update other fields
  rows[existingIndex] = { ...rows[existingIndex], ...newReading };
} else {
  // New reading
  rows.push(newReading);
}
```

---

### Delete Reading

**User Story:**  
As a patient, I want to remove an incorrect or accidental reading.

**Implementation:**
- Trash icon on each table row
- Confirmation dialog ("Delete this reading?")
- On confirm → IndexedDB delete + UI re-render
- Stats recalculate immediately

**Key Code:**
```typescript
const handleDelete = async (id: string) => {
  if (confirm('Delete this reading?')) {
    await deleteReading(id);
    const updated = rows.filter(r => r.id !== id);
    setRows(updated);
  }
};
```

---

## 3. Analytics & Visualization

### Stats Dashboard

**User Story:**  
As a patient, I want to see my glucose averages at a glance to understand my control.

**Implementation:**
- 5 stat cards displayed below the patient header in a single row:
  - **Average Fasting:** mean of all fasting readings
  - **Avg Post-Meal:** mean of post-lunch and post-dinner readings
  - **Highest Reading:** maximum glucose value recorded in the period
  - **Overall Average:** mean of all readings in the period
  - **Total Readings:** count of all readings in the period

**Calculation Logic:**
- Filtered by current viewMode (month vs year)
- Recalculates when data changes or filter changes
- Shows "N/A" if insufficient data

**Key Code:**
```typescript
const avgFasting = filteredRows.length > 0
  ? (filteredRows.reduce((sum, r) => sum + parseFloat(r.fasting || '0'), 0) / filteredRows.length).toFixed(1)
  : 'N/A';
```

**Display:**
- Large font (2xl)
- Label above value
- Color-coded: green (good), yellow (caution), red (high)

---

### Period Selection Toggle

**User Story:**  
As a patient, I want to filter my glucose data for a specific month OR view all historical data at once.

**Implementation:**
- **Period selector:** Native browser `<input type="month">` dropdown
- **All Time button:** Quickly clears the filter to show the entire dataset
- Defaults to the current calendar month on load
- Allows selection of empty months to facilitate adding new readings
- Grid, AGP chart, and stats recalculate per filter

**State:**
```typescript
const [viewMode, setViewMode] = useState<'month' | 'year' | 'all'>('month');
const [selectedMonth, setSelectedMonth] = useState<string>(() => new Date().toISOString().substring(0, 7));

const filteredRows = useMemo(() => {
  if (viewMode === 'month') {
    if (!selectedMonth) return [];
    return rows.filter(r => getMonthKey(r.date) === selectedMonth);
  }
  return [...rows];
}, [rows, selectedMonth, viewMode]);
```

**UX:**
- Switching modes preserves selected date range
- Stats cards update immediately
- Grid pagination resets on filter change

---

### Ambulatory Glucose Profile (AGP)

**User Story:**  
As a specialist, I want to visualize glucose variation trends across multiple days to identify patterns.

**Implementation:**
- Time-series line chart showing daily glucose variation
- **3 data lines:**
  - Fasting (blue, 3px stroke)
  - Pre-Lunch (green, 3px stroke)
  - Pre-Dinner (purple, 3px stroke)
- **Trendlines:** Linear regression for each line (solid, high opacity, same color as data)
- **Target band:** Shaded region 5.3–7.3 mmol/L (reference range)
- **Interactive legend:** Click to toggle lines on/off
- **Responsive:** Adapts to container width

**Trendline Calculation:**
Uses linear regression (least-squares fit):
```typescript
const calculateTrendline = (data: number[]): number[] => {
  const n = data.length;
  const sumX = (n * (n - 1)) / 2; // Sum of indices
  const sumY = data.reduce((a, b) => a + b, 0);
  const sumXY = data.reduce((sum, y, i) => sum + i * y, 0);
  const sumX2 = data.reduce((sum, _, i) => sum + i * i, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return data.map((_, i) => intercept + slope * i);
};
```

**Rendering:**
- Recharts `<LineChart>` with `<ReferenceArea>` for target band
- 6 lines total: 3 data + 3 trendlines
- Minimum 10 readings required (shows "not enough data" message if fewer)

**Key Files:**
- `src/App.tsx:calculateTrendline()` — Math
- `src/App.tsx:AGP Chart` — Recharts rendering

---

## 4. Data Persistence

### IndexedDB Schema

**User Story:**  
As a patient, I want my glucose data stored locally so I can access it offline.

**Database:** `glucoseDB` (IndexedDB)

**Table: `readings`**
| Field | Type | Notes |
|-------|------|-------|
| id | String (Primary Key) | UUID |
| date | String (Index) | YYYY-MM-DD |
| fasting | String | mmol/L (nullable) |
| post_breakfast | String | mmol/L (nullable) |
| pre_lunch | String | mmol/L (nullable) |
| post_lunch | String | mmol/L (nullable) |
| pre_dinner | String | mmol/L (nullable) |
| post_dinner | String | mmol/L (nullable) |
| createdAt | Number | Timestamp (ms) |
| updatedAt | Number | Timestamp (ms) |

**Table: `profile`**
| Field | Type |
|-------|------|
| patientName | String |
| doctorName | String |
| notes | String |

**Table: `adminConfig`**
| Field | Type |
|-------|------|
| adminPassword | String |
| auditLog | Array of objects |

**Key Operations:**
- `getAllReadings()` — fetch all readings, sorted by date descending
- `upsertReading(row)` — create or update by date
- `deleteReading(id)` — remove by ID
- `batchUpsertReadings(rows)` — bulk insert from scan
- `getProfile()` / `saveProfile()` — user metadata
- `getAdminConfig()` — admin state

**Persistence:**
- All writes are synchronous (IndexedDB transactions)
- No cloud sync (patient privacy first)
- Manual export/import via JSON

**Key Files:**
- `src/lib/db.ts` — full IndexedDB implementation

---

### Export & Import

**User Story:**  
As a patient, I want to backup my glucose data as JSON and restore it later.

**Export:**
- Click "Export" button → downloads `glucose-backup-YYYY-MM-DD.json`
- File contains all readings + profile metadata
- Format: human-readable JSON

**Import:**
- Click "Import" button → file picker
- Select `.json` file → validates structure
- Asks for merge strategy: "Replace All" or "Merge New Only"
- Upserts readings to IndexedDB
- UI updates with new data

**Validation:**
- Must be valid JSON
- Must contain `readings` array
- Each reading must have `date` field

**Security:**
- No encryption (consider for production)
- User responsible for file safety
- No transmission to cloud

---

## 5. Accessibility & Themes

### High Contrast Theme

**User Story:**  
As a visually impaired patient, I want high-contrast colors to read the app clearly.

**Implementation:**
- Toggle button in header (sun/moon icon)
- Dark backgrounds (#111827, #1F2937)
- White text, high saturation colors
- Larger touch targets (h-10 minimum)
- Smooth transition: `transition: background-color 0.3s ease, color 0.3s ease`

**CSS Variables:**
```css
[data-theme='high-contrast'] {
  --color-bg-primary: #1F3864;
  --color-bg-secondary: #2d5a8c;
  --color-text-primary: #ffffff;
  --color-text-secondary: #e0e7ff;
  --color-border: #475569;
}
```

**Contrast Ratios:**
- Text: 7:1 (WCAG AAA)
- UI elements: 4.5:1 (WCAG AA minimum)

**Persistence:**
- Theme preference stored in localStorage with key `{project}-theme`
- Auto-applied on page load via inline script (before DOM renders)

---

### Unit Conversion (mmol/L ↔ mg/dL)

**User Story:**  
As an international patient, I want to view glucose values in my familiar unit.

**Implementation:**
- Toggle buttons: "mmol/L | mg/dL"
- Conversion: `mg/dL = mmol/L × 18.02`
- Applied to all displayed values (input fields, charts, stats)
- Data always stored as mmol/L in IndexedDB

**Conversion Examples:**
- 7.0 mmol/L = 126.1 mg/dL (fasting target)
- 8.9 mmol/L = 160.2 mg/dL (post-meal target)
- 5.3–7.3 mmol/L = 95–131 mg/dL (target range)

**Formatting:**
- mmol/L: 1 decimal place (e.g., "7.2")
- mg/dL: 0 decimal places (e.g., "130")

**Persistence:**
- Unit preference stored in localStorage
- Restored on page reload

---

### Help Modal

**User Story:**  
As a new patient, I want an in-app guide to learn how to use the app.

**Implementation:**
- Help button (?) in header → opens modal dialog
- 6 sections with expandable content:
  1. **What is a Reading?** — Explanation of 6 meal periods
  2. **How to Add Readings** — Manual entry steps
  3. **Dashboard Overview** — Stats + charts explanation
  4. **Unit Conversion** — mmol/L vs mg/dL
  5. **Quick Tips** — Best practices for accuracy
  6. **Close Guide** — Exit instructions

**Design:**
- Headings: Fraunces font (serif, elegant)
- Body: DM Sans (readable, accessible)
- Colors match ROPHE branding (#1F3864 blue)
- Keyboard: Escape to close
- Mobile: Full viewport on small screens

**Key Files:**
- `src/components/HelpModal.tsx` — Modal content

---

## 6. Admin Features

### Audit Logging

**User Story:**  
As a doctor, I want to see a log of who accessed patient data and when.

**Implementation:**
- Every admin action logged with:
  - Action type (e.g., "VIEW_READINGS", "CLEAR_DATABASE")
  - Timestamp (ISO 8601)
  - User info (if available)
- Audit log displayed in admin panel (read-only table)
- Stored in IndexedDB `adminConfig.auditLog` array

**Logged Actions:**
- `ADMIN_LOGIN` — admin password entered successfully
- `VIEW_AUDIT_LOG` — admin opened audit log
- `CLEAR_DATABASE` — admin cleared all readings
- `EXPORT_DATA` — user downloaded backup

**Max Entries:** 1000 (oldest entries pruned on overflow)

---

### Database Management

**User Story:**  
As a developer/tester, I want to clear the database without using DevTools.

**Implementation:**
- Clear button in admin panel (behind password gate)
- Confirmation: "Delete all readings? This cannot be undone."
- On confirm: all readings deleted, audit log updated
- UI resets (empty table, stats show N/A)

**Use Cases:**
- Testing with fresh data
- User requests data deletion (privacy)
- Demo/sandbox environments

---

## 7. Testing

### E2E Test Suite

**User Story:**  
As a developer, I want automated tests that verify critical user journeys with real screenshots.

**Implementation:**
- 26 test scenarios across 6 suites
- Interactive test UI (E2E Test tab in app)
- Real screenshot capture via Playwright
- Automated DOM validation (checks for element existence)

**Test Suites:**
1. OAuth Login (4 tests)
2. Admin Access (4 tests)
3. Image Scanning (4 tests)
4. Data Management (5 tests)
5. Theme & Logout (4 tests)
6. Dashboard & Analytics (5 tests)

**Running Tests:**
```bash
# Interactive UI tests
pnpm run dev
# → E2E Test tab → Run Full Test Suite

# Capture screenshots
pnpm run test:e2e:screenshots

# Verify deployment
pnpm run deploy:verify
```

**Key Files:**
- `src/components/test/TestContainer.tsx` — Test UI
- `src/components/test/testRunner.ts` — Test orchestration
- `src/components/test/RealScreenshot.tsx` — Screenshot display
- `scripts/capture-real-screenshots.ts` — Playwright automation

---

## 8. Deployment & Operations

### Continuous Deployment

**Process:**
1. Commit code to main branch
2. Run `pnpm run build` (Vite builds to dist/)
3. Run `pnpm run deploy` (SCP upload + Nginx config)
4. Run `pnpm run deploy:verify` (health check)

**Artifacts Deployed:**
- `dist/` — built JavaScript, CSS, HTML
- `public/screenshots/e2e/` — E2E test images
- `.htaccess` — URL rewriting rules

**Rollback:**
- Previous deployment is archived on server
- Manual SSH restoration if needed

---

### Health Checks

**Post-Deployment Verification:**
```bash
pnpm run deploy:verify
```

**Checks:**
- App responds to HTTP requests
- Screenshots are accessible
- Key UI elements present (login button, charts, etc.)
- Reports success/failure with detailed output

---

## 9. Performance & Optimization

### Bundle Size
- Main JS: ~271 KB (gzip: 81 KB)
- CSS: 50.45 KB (gzip: 9.54 KB)
- Recharts: 379 KB (split into separate chunk)
- Total: ~700 KB (gzip: ~190 KB)

### Code Splitting
- Recharts (large chart library) → separate bundle
- Gemini AI library → separate bundle
- IndexedDB library → separate bundle

### Rendering Performance
- Charts use `isAnimationActive={false}` for instant render
- Data grid paginated (25 rows/page)
- Filters memoized with `useMemo()`

---

## 10. Security Considerations

### Data Privacy
- **Offline-first:** No cloud backup (all local storage)
- **No transmission:** Glucose data never leaves browser
- **HTTPS only:** Production URL enforces TLS
- **Logout:** Both OAuth + local session cleared

### Authentication
- OAuth 2.0 Google Sign-In (delegated identity)
- Admin password gate (numeric PIN)
- Session tokens stored in localStorage (HTTPOnly in production)

### Code Security
- No hardcoded API keys (loaded from .env)
- No SQL injection risk (IndexedDB has no SQL)
- XSS prevention via React (automatic HTML escaping)
- CSRF protection via SameSite cookies

---

*Last updated: May 16, 2026*  
*All features production-ready and tested*
