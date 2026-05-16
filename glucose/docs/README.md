# Glucose — Blood Glucose Monitoring Application

**Version:** 1.1.0  
**Last Updated:** May 2026  
**Institution:** Techbridge University College (TUC)  
**Status:** Production ✅

---

## Overview

**Glucose** (ROPHE Sugar Logger) is a comprehensive blood glucose monitoring application designed for diabetes patients and healthcare specialists. It combines AI-powered image scanning (Gemini Vision), manual data entry, and advanced analytics to help patients track and visualize glucose readings with clinical accuracy.

**Key Differentiators:**
- Real-time AI extraction from handwritten glucose logs via Gemini API
- Month/Year view toggle for flexible time-based analysis
- Ambulatory Glucose Profile (AGP) charting with trendlines
- Admin audit logging with password-protected access
- Offline-first IndexedDB persistence
- Dual-auth system (OAuth 2.0 + local session)
- High-contrast accessibility theme
- Unit conversion (mmol/L ↔ mg/dL)

**Live URL:** https://ai-tools.techbridge.edu.gh/glucose

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS + Vite |
| **State Management** | React Context API (Auth, Admin) |
| **Database** | IndexedDB (offline-first) |
| **AI/ML** | Gemini 3.1 Pro Vision API (image OCR) |
| **Charts** | Recharts (responsive time-series) |
| **Deployment** | Plesk/Ubuntu + Nginx + SCP |

### Directory Structure

```
glucose/
├── src/
│   ├── App.tsx                          # Main application shell
│   ├── contexts/
│   │   ├── AuthContext.tsx              # OAuth & user session
│   │   └── AdminContext.tsx             # Admin password & audit log
│   ├── components/
│   │   ├── test/
│   │   │   ├── TestContainer.tsx        # E2E test UI
│   │   │   ├── RealScreenshot.tsx       # Screenshot display
│   │   │   └── testRunner.ts            # Test orchestration
│   │   └── HelpModal.tsx                # User guide
│   ├── lib/
│   │   └── db.ts                        # IndexedDB schema & queries
│   └── index.css                        # Tailwind + theme variables
├── public/
│   ├── rophe-logo.jpg                   # Header branding
│   └── screenshots/e2e/                 # Captured E2E test images
├── scripts/
│   ├── capture-real-screenshots.ts      # Playwright screenshot capture
│   └── verify-deployment.ts             # Post-deploy health check
├── docs/
│   ├── README.md                        # This file
│   ├── FEATURES.md                      # Feature documentation
│   ├── E2E_TESTING.md                   # Testing guide
│   ├── DEPLOYMENT.md                    # Deployment procedures
│   ├── ARCHITECTURE.md                  # Technical deep-dive
│   └── API.md                           # Gemini API integration
├── vite.config.ts                       # Build configuration
├── tailwind.config.ts                   # Styling configuration
└── package.json                         # Dependencies & scripts
```

---

## Core Features

### 1. OAuth Authentication
- Google Sign-In integration
- Patient name auto-population from Google profile
- Session persistence in localStorage
- Fresh login view after logout

### 2. Data Entry
- **Manual Entry:** 6 glucose readings per day (Fasting, Post-Breakfast, Pre-Lunch, Post-Lunch, Pre-Dinner, Post-Dinner)
- **Image Scanning:** Upload handwritten glucose log → Gemini Vision extracts readings
- **Edit/Update:** Modify existing readings with timestamp tracking
- **Date Picker:** Flexible date selection for historical entry

### 3. Data Persistence
- **IndexedDB:** Offline-first storage of all glucose readings
- **Schema:** `readings` table with date, 6 glucose values, metadata
- **Auto-sync:** Data stored locally, no cloud backup (patient privacy)
- **Export/Import:** JSON backup/restore workflow

### 4. Analytics & Visualization

#### Stats Dashboard
- **Average Fasting:** Mean of all fasting readings
- **Average Post-Meal:** Mean of lunch/dinner post-meal readings
- **Total Readings:** Count of all logged readings
- **Dynamic:** Updates in real-time as data changes

#### Month/Year Selector
- Toggle between monthly and annual views
- Filter data by selected period
- Stats recalculate per filter

#### Ambulatory Glucose Profile (AGP)
- Time-series line chart showing daily glucose variation
- 3 data lines: Fasting (blue), Pre-Lunch (green), Pre-Dinner (purple)
- Linear regression trendlines (solid, high-contrast)
- Target range shading (5.3–7.3 mmol/L reference band)
- Interactive legend

### 5. Admin Panel
- **Password Gate:** Numeric PIN access (stored in IndexedDB)
- **Audit Log:** Timestamped records of admin actions
- **Features:** View logs, clear database (for testing)
- **Security:** Admin session stored in sessionStorage (cleared on logout)

### 6. Accessibility
- **High Contrast Theme:** Darker backgrounds, higher color saturation
- **Unit Conversion:** Toggle mmol/L ↔ mg/dL display
- **Keyboard Navigation:** Full keyboard support
- **Screen Reader:** Semantic HTML, ARIA labels

### 7. Help & Guidance
- Comprehensive user guide modal (6 sections)
- Color-coded range explanation
- Quick tips for accurate entry
- Printable report layout

---

## Key Learnings & Patterns

### Avatar Initials
- Uses first + last letter of name (e.g., "Daniel Twum" → "DT")
- **Title Skipping:** Filters out Dr, Prof, Mr, Mrs, Ms prefixes
  - "Dr Yacoba Atiase" → "YA" (not "DA")

### Trendline Visualization
- Solid lines (no dashing) for clarity
- 3px stroke width with 0.9 opacity
- High contrast against data lines

### Glucose Reading Ranges
- **Fasting Target:** < 7.0 mmol/L
- **Post-Meal Target:** < 8.9 mmol/L
- **Safe Range (AGP):** 5.3–7.3 mmol/L (shaded green)

### Data Duplication on Rescan
- If same document scanned twice → **update existing** (not create new)
- Comparison by date (primary key)
- Preserves createdAt, updates updatedAt

### Dual-Auth Logout
- **Must clear both** OAuth (localStorage) + Admin (sessionStorage)
- Single logout clears OAuth only → user remains authenticated → bad UX
- See CLAUDE.md section 15 for pattern details

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm package manager
- Gemini API key (`.env.local`)
- A modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Installation

```bash
# Clone repository
cd glucose

# Install dependencies
pnpm install

# Create environment file
cat > .env.local <<EOF
VITE_GEMINI_API_KEY=your-gemini-api-key-here
EOF

# Start development server
pnpm run dev

# Open browser
# http://localhost:3010 (or next available port if 3010 is in use)
```

### Build for Production

```bash
# Build dist folder
pnpm run build

# Deploy to production
pnpm run deploy

# Verify deployment is live
pnpm run deploy:verify
```

---

## API Integration

### Gemini Vision API

**Model:** `gemini-3.1-pro-preview`  
**Purpose:** Extract glucose readings from handwritten/printed documents

**Input:** Base64 image + JSON schema  
**Output:** Array of glucose readings with extraction confidence

**Key Settings:**
- `temperature: 0` (deterministic extraction)
- `responseMimeType: 'application/json'` (structured output)
- Streaming response for real-time updates

**Example Flow:**
1. User uploads image → convert to Base64
2. Send to Gemini with extraction schema
3. Receive structured JSON array of readings
4. Upsert to IndexedDB by date
5. Update UI charts in real-time

See `docs/API.md` for implementation details.

---

## Testing

### Unit/Integration Tests
- Component rendering tests
- IndexedDB persistence tests
- Theme switching tests
- Chart data calculation tests

### E2E Tests
- 26 end-to-end test scenarios (6 suites)
- Real screenshot capture via Playwright
- Interactive test UI in the app (E2E Test tab)
- Automated verification script

**Run Tests:**
```bash
# Interactive UI tests
pnpm run dev
# Navigate to E2E Test tab → Run Full Test Suite

# Capture real screenshots
pnpm run test:e2e:screenshots

# Verify deployment
pnpm run deploy:verify
```

See `docs/E2E_TESTING.md` for comprehensive testing guide.

---

## Deployment

### Production Deployment

**Infrastructure:** Plesk/Ubuntu/Nginx on `techbridge.edu.gh`

**Process:**
1. Commit code to main branch
2. Run `pnpm run deploy` (builds + uploads via SCP)
3. Run `pnpm run deploy:verify` (health check)
4. Monitor at https://ai-tools.techbridge.edu.gh/glucose

**Files Deployed:**
- `dist/` (built app assets)
- `public/screenshots/e2e/` (E2E test images)
- `.htaccess` (URL rewriting for SPA routing)

See `docs/DEPLOYMENT.md` for troubleshooting and advanced options.

---

## Configuration

### Environment Variables

```bash
VITE_GEMINI_API_KEY     # Google Gemini API key (required for image scanning)
```

### Theme & Branding

**Colors:** Defined as CSS variables in `src/index.css`
- `--color-primary`: #2E75B6 (TUC blue)
- `--color-bg-primary`, `--color-bg-secondary`
- `--color-text-primary`, `--color-text-secondary`

**Themes:**
- Default (Gold Luxury): Warm backgrounds, blue accents
- Dark: High-contrast dark theme
- High Contrast: Maximum visibility for accessibility

**Logo:** `public/rophe-logo.jpg` (displayed in header)

---

## Known Limitations

1. **No Cloud Backup:** Data stored locally only (privacy-first design)
2. **Mobile View:** Optimized for tablets; mobile portrait not fully tested
3. **Offline Sync:** No sync when coming online (manual re-upload if lost data)
4. **AGP Chart:** Requires minimum 10 readings to render trendlines
5. **Image Scanning:** Requires clear handwriting (Gemini may struggle with unclear scans)

---

## Future Roadmap

- [ ] Cloud backup with end-to-end encryption
- [ ] Mobile app via Capacitor (iOS/Android)
- [ ] Real-time wearable device sync (Dexcom, FreeStyle Libre)
- [ ] Doctor-patient sharing (with consent)
- [ ] Medication logging & interaction alerts
- [ ] Predictive glucose modeling (time-series ML)
- [ ] Offline mobile progressive web app

---

## Support & Troubleshooting

### App Won't Load
- Clear browser cache: Cmd+Shift+Delete (or Ctrl+Shift+Delete on Windows)
- Check IndexedDB: DevTools → Storage → IndexedDB → Clear
- Verify API key in `.env.local` is correct

### Scanned Readings Not Appearing
- Ensure dev server is running
- Check browser console for Gemini API errors
- Verify image clarity (blurry/handwritten images may fail)
- Check network tab for API response

### Charts Not Rendering
- Need minimum 10 readings to display trendlines
- Try adding more manual entries if dataset is sparse
- Clear browser cache and refresh

### Deployment Issues
See `docs/DEPLOYMENT.md` for comprehensive troubleshooting.

---

## Contributing

Internal TUC development. Changes follow:
- IEEE SRS specification
- Code review via git commits
- E2E test coverage required
- Documentation updated in lockstep with code

---

## License

**Proprietary** — Techbridge University College / TUC ICT Department

---

## Contact

**Project Lead:** Daniel Frempong Twum  
**Email:** daniel.twum@techbridge.edu.gh  
**Institution:** Techbridge University College, Oyibi, Greater Accra, Ghana

---

*Last updated: May 16, 2026*  
*Version 1.1.0 — Production Ready*
