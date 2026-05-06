# WORKLIST - GAP CLOSURE ACTION ITEMS
## Prioritized Task List for SRS Compliance

**Generated:** February 13, 2026
**Total Estimated Effort:** 57 hours
**Projects:** analytics-refactor (48h), rophe-specialist-care-rpms (9h)

---

## 🔴 CRITICAL PRIORITY - Week 1 (40 hours)

### Project: analytics-refactor

**Goal:** Complete Phase 2 (Accessibility) + Phase 3 (Enhanced Functionality)
**Timeline:** 5 business days (8 hours/day)
**Deliverables:** WCAG 2.1 AA compliant dashboard with export functionality

---

### PHASE 2: ACCESSIBILITY & WCAG 2.1 AA COMPLIANCE (15 hours)

#### Task 2.1: Keyboard Navigation Implementation (4 hours)

**File:** `src/components/analytics/AdvancedAnalytics.jsx`

**Subtasks:**
- [ ] Add global keyboard shortcut handler using `useEffect`
  - `Ctrl+P`: Trigger window.print()
  - `Ctrl+E`: Open export modal
  - `Escape`: Close modals/fullscreen
- [ ] Create `<a>` skip link at top of component
  - Href: `#main-content`
  - Class: `sr-only focus:not-sr-only`
  - Position: absolute, z-50
  - Style: Focus visible with indigo background
- [ ] Add visible focus indicators to all buttons
  - Class: `focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`
- [ ] Implement modal focus trap
  - Use `useRef` to track first/last focusable elements
  - Tab cycles within modal
  - Escape closes modal
- [ ] Test Tab key navigation through entire dashboard
- [ ] Document keyboard shortcuts in UI (add "Press ? for shortcuts" hint)

**Acceptance Criteria:**
- All interactive elements reachable via keyboard
- No keyboard traps
- Visible focus indicators on all elements
- Skip links functional

**Testing:**
```bash
# Manual test
1. Navigate to dashboard with Tab key only (no mouse)
2. Press Ctrl+P (should open print dialog)
3. Press Ctrl+E (should open export if implemented)
4. Tab through all charts, buttons, filters
5. Verify focus ring visible on all elements
```

---

#### Task 2.2: ARIA Labels & Semantic HTML (3 hours)

**Files:**
- `src/components/analytics/charts/*.jsx` (all 5 chart components)
- `src/components/analytics/components/DashboardHeader.jsx`

**Subtasks:**
- [ ] Wrap each chart in `<section role="region">`
- [ ] Add unique `id` to each chart heading (e.g., `chart-heading-1`)
- [ ] Add `aria-labelledby` linking section to heading
- [ ] Create screen-reader-only descriptions for each chart
  - Use `<p id="chart-description-1" className="sr-only">`
  - Describe: chart type, data range, metrics shown, key insights
- [ ] Add `aria-describedby` linking section to description
- [ ] Create live region for dynamic updates
  - `<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">`
  - Update when data loads: "Data loaded successfully with {count} records"
  - Update on errors: "Error: {message}"
  - Update on loading: "Loading data..."
- [ ] Add `aria-label` to all buttons without visible text
- [ ] Use semantic HTML elements: `<nav>`, `<main>`, `<section>`, `<article>`
- [ ] Ensure proper heading hierarchy (h1 → h2 → h3, no skips)

**Acceptance Criteria:**
- Screen readers announce chart purpose before content
- Dynamic state changes announced
- All interactive elements have accessible names
- Heading hierarchy logical

**Testing:**
```bash
# Using NVDA (Windows) or VoiceOver (Mac)
1. Navigate to dashboard with screen reader active
2. Tab through sections - verify announcements
3. Change data filter - verify live region updates
4. Check heading navigation (H key in NVDA)
```

---

#### Task 2.3: Color Contrast & Visual Accessibility (2 hours)

**Files:**
- `src/components/analytics/components/GlobalStyles.jsx`
- `src/components/analytics/charts/*.jsx`

**Subtasks:**
- [ ] Update color palette to WCAG AA (4.5:1 for text, 3:1 for UI)
  - Text colors:
    - Primary: `#1f2937` (gray-800, 12.63:1)
    - Secondary: `#4b5563` (gray-600, 7.48:1)
    - Muted: `#6b7280` (gray-500, 5.74:1)
  - Chart colors (meet 3:1):
    - Blue: `#2563eb` (blue-600)
    - Purple: `#7c3aed` (purple-600)
    - Green: `#059669` (green-600)
    - Amber: `#d97706` (amber-600)
    - Red: `#dc2626` (red-600)
- [ ] Add focus ring colors: `#2563eb` (4.61:1 contrast)
- [ ] Test with Chrome DevTools Lighthouse accessibility audit
- [ ] Test with axe DevTools browser extension
- [ ] Test with high contrast mode (Windows)
- [ ] Test at 200% zoom (layout should not break)

**Acceptance Criteria:**
- All text meets 4.5:1 contrast ratio
- All UI elements meet 3:1 contrast ratio
- Focus indicators clearly visible
- Layout functional at 200% zoom
- Zero WCAG violations in axe audit

**Testing:**
```bash
# Chrome DevTools
1. F12 → Lighthouse tab
2. Select "Accessibility" category
3. Generate report
4. Fix all color contrast issues

# Manual high contrast test
1. Windows: Settings → Ease of Access → High Contrast
2. Enable high contrast
3. Verify all UI elements visible
```

---

#### Task 2.4: Alternative Data Access (4 hours)

**New File:** `src/components/analytics/components/DataTable.jsx`

**Subtasks:**
- [ ] Create DataTable component with sortable columns
  ```jsx
  interface DataTableProps {
    data: Array<Record<string, any>>;
    caption: string;
    columns: Array<{
      key: string;
      label: string;
      format?: (value: any) => string;
    }>;
  }
  ```
- [ ] Implement `useMemo` for sorting performance
- [ ] Add sort state with `useState`
- [ ] Click column header to sort (asc/desc toggle)
- [ ] Add `aria-sort` attribute to columns
- [ ] Use semantic `<table>`, `<caption>`, `<thead>`, `<tbody>`
- [ ] Add `scope="col"` to header cells
- [ ] Add hover styles for rows
- [ ] Make table responsive (horizontal scroll on mobile)
- [ ] Add "View as Table" / "View as Chart" toggle to each chart
  ```jsx
  <button
    onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}
    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
    aria-label={`Switch to ${viewMode === 'chart' ? 'table' : 'chart'} view`}
  >
    {viewMode === 'chart' ? '📊 View as Table' : '📈 View as Chart'}
  </button>
  ```
- [ ] Update all 5 chart components to support table view
- [ ] Add CSV export functionality (for screen reader users)
  ```javascript
  const exportCSV = (data) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics-${Date.now()}.csv`;
    link.click();
  };
  ```

**Acceptance Criteria:**
- All charts have table alternative
- Tables sortable by clicking headers
- CSV export generates valid files
- Table responsive on mobile

**Testing:**
```bash
# Manual test
1. Click "View as Table" on each chart
2. Verify data matches chart
3. Click column headers to sort
4. Export CSV and open in Excel
5. Test with screen reader
```

---

#### Task 2.5: Screen Reader Testing & Documentation (2 hours)

**New File:** `docs/ACCESSIBILITY.md`

**Subtasks:**
- [ ] Test with NVDA screen reader (Windows)
  - Download from nvaccess.org
  - Navigate entire dashboard
  - Verify all content announced
  - Document any issues
- [ ] Test with JAWS screen reader (if available)
- [ ] Test with VoiceOver (Mac)
  - Cmd+F5 to enable
  - Navigate with VO keys
  - Verify table announcements
- [ ] Create accessibility statement document
  ```markdown
  # Accessibility Statement

  ## Conformance Status
  WCAG 2.1 Level AA compliant

  ## Features
  - Keyboard navigation
  - Screen reader support
  - High contrast themes
  - Alternative data views

  ## Known Limitations
  (list any remaining issues)

  ## Contact
  Report accessibility issues to: [email]
  ```
- [ ] Document keyboard shortcuts in component
- [ ] Add accessibility section to README.md
- [ ] Create screen reader user guide

**Acceptance Criteria:**
- All content accessible with NVDA/JAWS/VoiceOver
- Accessibility statement published
- Keyboard shortcuts documented
- User guide created

---

### PHASE 3: ENHANCED FUNCTIONALITY (15 hours)

#### Task 3.1: Date Range Filtering (4 hours)

**Install Dependencies:**
```bash
npm install react-datepicker date-fns
```

**New File:** `src/components/analytics/components/DateRangeFilter.jsx`

**Subtasks:**
- [ ] Create DateRangeFilter component
  ```jsx
  interface DateRangeFilterProps {
    value: { start: Date | null; end: Date | null };
    onChange: (range: { start: Date | null; end: Date | null }) => void;
  }
  ```
- [ ] Import react-datepicker CSS: `import 'react-datepicker/dist/react-datepicker.css'`
- [ ] Add two DatePicker components (start and end)
  - `selectsStart` and `selectsEnd` props
  - `maxDate={new Date()}` (no future dates)
  - Format: "MMM dd, yyyy"
- [ ] Add preset buttons:
  - Last 30 days
  - Last 90 days
  - Year to Date
  - All Time (clear filter)
- [ ] Add "Clear" button to reset both dates
- [ ] Integrate into DashboardHeader component
- [ ] Update `useAnalyticsData` hook to filter by date range
  ```javascript
  const filteredData = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return data;
    return data.filter(record => {
      const recordDate = new Date(record.MONTH);
      return recordDate >= dateRange.start && recordDate <= dateRange.end;
    });
  }, [data, dateRange]);
  ```
- [ ] Persist filter to localStorage
  ```javascript
  useEffect(() => {
    localStorage.setItem('analytics-date-range', JSON.stringify(dateRange));
  }, [dateRange]);
  ```
- [ ] Add loading indicator when filter changes
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**
- Date range filtering functional
- Preset buttons work
- Filter persists on refresh
- Loading indicator shows during filter

**Testing:**
```bash
# Manual test
1. Select "Last 30 days" - verify charts update
2. Select custom date range
3. Refresh page - verify filter persists
4. Clear filter - verify all data shown
```

---

#### Task 3.2: Metric Selector (3 hours)

**New File:** `src/components/analytics/components/MetricSelector.jsx`

**Subtasks:**
- [ ] Create MetricSelector component
  ```jsx
  interface MetricSelectorProps {
    selected: string[]; // ['signups', 'applicants', 'accepted', 'registered']
    onChange: (selected: string[]) => void;
  }
  ```
- [ ] Define metrics:
  ```javascript
  const metrics = [
    { id: 'signups', label: 'Signups', icon: '👥' },
    { id: 'applicants', label: 'Applicants', icon: '📝' },
    { id: 'accepted', label: 'Accepted', icon: '✅' },
    { id: 'registered', label: 'Registered', icon: '🎓' },
  ];
  ```
- [ ] Add "All Metrics" toggle button
  ```jsx
  <button
    onClick={() => onChange(['all'])}
    className={selected.includes('all') ? 'bg-indigo-600 text-white' : 'bg-gray-100'}
  >
    All Metrics
  </button>
  ```
- [ ] Add individual metric toggle buttons
  - Click to toggle metric on/off
  - Deselecting "All" when individual selected
  - Minimum 1 metric must be selected
- [ ] Integrate into DashboardHeader
- [ ] Update chart components to filter metrics
  ```javascript
  const filteredKeys = selectedMetrics.includes('all')
    ? ['signups', 'applicants', 'accepted', 'registered']
    : selectedMetrics;
  ```
- [ ] Persist selection to localStorage
- [ ] Add visual active/inactive states
  - Active: indigo background, white text
  - Inactive: gray background, dark text

**Acceptance Criteria:**
- Metric selection toggles work
- Charts update to show only selected metrics
- Selection persists on refresh
- Minimum 1 metric always selected

**Testing:**
```bash
# Manual test
1. Click "Signups" only - verify charts show signups
2. Add "Applicants" - verify both shown
3. Click "All Metrics" - verify all 4 shown
4. Refresh page - verify selection persists
```

---

#### Task 3.3: Export Functionality (6 hours)

**Install Dependencies:**
```bash
npm install html2canvas jspdf xlsx
```

**New File:** `src/hooks/useChartExport.js`

**Subtasks:**
- [ ] Create useChartExport custom hook
  ```javascript
  export const useChartExport = () => {
    const [exporting, setExporting] = useState(false);

    const exportToPNG = async (elementId, filename) => { /*...*/ };
    const exportToPDF = async (elementId, filename) => { /*...*/ };
    const exportToCSV = (data, filename) => { /*...*/ };
    const exportToExcel = (data, filename) => { /*...*/ };

    return { exportToPNG, exportToPDF, exportToCSV, exportToExcel, exporting };
  };
  ```
- [ ] Implement PNG export (html2canvas)
  ```javascript
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2 // High DPI
  });
  const link = document.createElement('a');
  link.download = `${filename}-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  ```
- [ ] Implement PDF export (jsPDF)
  ```javascript
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(`${filename}-${Date.now()}.pdf`);
  ```
- [ ] Implement CSV export
  ```javascript
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${Date.now()}.csv`;
  link.click();
  ```
- [ ] Implement Excel export (XLSX)
  ```javascript
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}-${Date.now()}.xlsx`);
  ```
- [ ] Add export dropdown to DashboardHeader
  ```jsx
  <div className="relative group">
    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
      💾 Export
    </button>
    <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg hidden group-hover:block">
      <button onClick={() => exportToPDF('dashboard', 'analytics-dashboard')}>
        Export as PDF
      </button>
      <button onClick={() => exportToCSV(data, 'analytics-data')}>
        Export as CSV
      </button>
      <button onClick={() => exportToExcel(data, 'analytics-data')}>
        Export as Excel
      </button>
    </div>
  </div>
  ```
- [ ] Add individual chart export buttons (PNG)
  ```jsx
  <button onClick={() => exportToPNG(`chart-${chartId}`, `${chartName}`)}>
    📸 Export Chart
  </button>
  ```
- [ ] Add loading spinner during export
  ```jsx
  {exporting && <div className="spinner">Exporting...</div>}
  ```
- [ ] Add error handling with user-friendly messages
  ```javascript
  try {
    await exportToPDF(...);
  } catch (error) {
    console.error('PDF export failed:', error);
    alert('Export failed. Please try again.');
  }
  ```

**Acceptance Criteria:**
- PDF export generates full dashboard
- CSV export includes all filtered data
- Excel export has formatted columns
- PNG export captures individual charts
- Loading indicators show during export
- Errors handled gracefully

**Testing:**
```bash
# Manual test
1. Click "Export" → "Export as PDF"
2. Verify PDF opens with full dashboard
3. Click "Export as CSV"
4. Open CSV in Excel, verify data
5. Click "Export as Excel"
6. Verify Excel formatting
7. Click "Export Chart" on individual chart
8. Verify PNG downloads
```

---

#### Task 3.4: Chart Fullscreen Mode (2 hours)

**Files:** All chart components in `src/components/analytics/charts/*.jsx`

**Subtasks:**
- [ ] Add fullscreen state to each chart component
  ```javascript
  const [isFullscreen, setIsFullscreen] = useState(false);
  ```
- [ ] Add fullscreen toggle button
  ```jsx
  <button
    onClick={() => setIsFullscreen(!isFullscreen)}
    className="absolute top-4 right-4"
    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
  >
    {isFullscreen ? '↙️ Exit' : '↗️ Fullscreen'}
  </button>
  ```
- [ ] Apply fullscreen styles conditionally
  ```jsx
  <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white p-8' : ''}`}>
    {/* Chart content */}
  </div>
  ```
- [ ] Add Escape key handler to exit fullscreen
  ```javascript
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);
  ```
- [ ] Adjust chart height in fullscreen (increase from 400px to 80vh)
  ```jsx
  <ResponsiveContainer width="100%" height={isFullscreen ? '80vh' : 400}>
  ```
- [ ] Add semi-transparent overlay background
  ```css
  .fullscreen-overlay {
    background: rgba(0, 0, 0, 0.05);
  }
  ```
- [ ] Ensure chart re-renders at fullscreen dimensions

**Acceptance Criteria:**
- Fullscreen mode functional on all charts
- Escape key exits fullscreen
- Chart dimensions adjust properly
- Toggle button visible and accessible

**Testing:**
```bash
# Manual test
1. Click fullscreen icon on any chart
2. Verify chart fills screen
3. Press Escape - verify exits fullscreen
4. Click "Exit" button - verify exits
5. Test on all 5 charts
```

---

## 🟡 MEDIUM PRIORITY - Week 2 (18 hours)

### Project: analytics-refactor (continued)

#### PHASE 4: TESTING & DOCUMENTATION (18 hours)

##### Task 4.1: Unit Tests with Jest (6 hours)

**Install Dependencies:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest
```

**New Files:**
- `src/components/analytics/utils/__tests__/analyticsCalculations.test.js` (exists, enhance)
- `src/components/analytics/utils/__tests__/dataValidation.test.js` (new)
- `src/components/analytics/hooks/__tests__/useAnalyticsData.test.js` (new)
- `src/components/analytics/components/__tests__/StateComponents.test.js` (new)

**Subtasks:**
- [ ] Configure Jest in package.json
  ```json
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/index.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
  ```
- [ ] Write tests for `analyticsCalculations.js` (100% coverage)
  - Test `processRawData()` - verify acceptance rate calculation
  - Test `calculateYearlyData()` - verify aggregation
  - Test `calculateTrends()` - verify trend analysis
  - Test `calculateAllTimeStats()` - verify totals
  - Test edge cases (empty data, invalid data, null values)
- [ ] Write tests for `dataValidation.js` (100% coverage)
  - Test `validateDataIntegrity()` - valid data returns true
  - Test missing required fields detection
  - Test invalid month format detection
  - Test numeric field validation
  - Test negative value handling
- [ ] Write tests for `useAnalyticsData` hook
  - Mock API fetch
  - Test loading state
  - Test error state
  - Test successful data load
  - Test memoization (performance)
- [ ] Write tests for state components
  - Test LoadingState renders skeleton
  - Test ErrorState renders retry button
  - Test EmptyState renders message
- [ ] Run tests and achieve >70% coverage
  ```bash
  npm run test:coverage
  ```
- [ ] Add test scripts to package.json
  ```json
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --watchAll=false"
  }
  ```

**Acceptance Criteria:**
- >70% code coverage achieved
- All critical paths tested
- Edge cases handled
- Tests pass in CI environment

**Testing:**
```bash
npm run test:coverage
# Verify coverage report shows >70%
```

---

##### Task 4.2: E2E Tests with Playwright (4 hours)

**Install Dependencies:**
```bash
npm install --save-dev playwright
```

**New File:** `e2e/dashboard.test.js`

**Subtasks:**
- [ ] Create E2E test suite
  ```javascript
  const playwright = require('playwright');

  describe('Analytics Dashboard E2E', () => {
    let browser, page;

    beforeAll(async () => {
      browser = await playwright.launch({ headless: true });
      page = await browser.newPage();
      await page.goto('http://localhost:3000/analytics');
    });

    afterAll(async () => {
      await browser.close();
    });
  });
  ```
- [ ] Test 1: Dashboard loads without errors
  ```javascript
  test('Dashboard loads without errors', async () => {
    await page.waitForSelector('h1');
    const title = await page.$eval('h1', el => el.textContent);
    expect(title).toBe('Advanced Analytics Suite');
  });
  ```
- [ ] Test 2: All charts render
  ```javascript
  test('All charts are rendered', async () => {
    const charts = await page.$$('[role="region"]');
    expect(charts.length).toBeGreaterThanOrEqual(5);
  });
  ```
- [ ] Test 3: Loading state appears/disappears
- [ ] Test 4: Date filter works
- [ ] Test 5: Metric selector works
- [ ] Test 6: Export functionality
- [ ] Test 7: Chart fullscreen mode
- [ ] Test 8: Theme switching
- [ ] Test 9: Keyboard navigation (Tab key)
- [ ] Test 10: Screen reader announcements (aria-live)
- [ ] Add screenshot capture for visual regression
  ```javascript
  await page.screenshot({ path: `e2e/screenshots/${testName}.png`, fullPage: true });
  ```
- [ ] Add E2E test script to package.json
  ```json
  "scripts": {
    "test:e2e": "node e2e/dashboard.test.js"
  }
  ```

**Acceptance Criteria:**
- 10 E2E tests passing
- Critical user flows covered
- Screenshots captured for regression
- Tests run in CI pipeline

**Testing:**
```bash
npm run test:e2e
# Verify all 10 tests pass
```

---

##### Task 4.3: Self-Testing Module (4 hours)

**New File:** `src/components/admin/TestPanel.jsx`

**Subtasks:**
- [ ] Create TestPanel component (accessible from Admin Panel)
  ```jsx
  export const TestPanel = ({ currentData, onClose }) => {
    const [testResults, setTestResults] = useState(null);
    const [running, setRunning] = useState(false);

    const runAllTests = async () => { /*...*/ };
  };
  ```
- [ ] Test 1: Data integrity validation
  ```javascript
  const validation = validateDataIntegrity(currentData);
  results.tests.push({
    name: 'Data Integrity',
    passed: validation.valid,
    details: validation.errors,
    recordCount: validation.recordCount
  });
  ```
- [ ] Test 2: Calculation accuracy
  ```javascript
  const calcTest = testCalculations(currentData);
  // Compare calculated values against expected
  ```
- [ ] Test 3: Render performance
  ```javascript
  const start = performance.now();
  await new Promise(resolve => setTimeout(resolve, 0));
  const end = performance.now();
  const renderTime = (end - start).toFixed(2);
  results.tests.push({
    name: 'Render Performance',
    passed: renderTime < 100,
    details: `Render time: ${renderTime}ms`
  });
  ```
- [ ] Test 4: Accessibility compliance (axe-core integration)
  ```javascript
  // Optional: integrate @axe-core/react
  const a11yTest = await testAccessibility();
  results.tests.push({
    name: 'Accessibility',
    passed: a11yTest.violations === 0,
    details: `${a11yTest.violations} violations found`
  });
  ```
- [ ] Display test results with pass/fail indicators
  ```jsx
  {testResults.tests.map((test, idx) => (
    <div className={test.passed ? 'bg-green-50' : 'bg-red-50'}>
      <h3>{test.passed ? '✅' : '❌'} {test.name}</h3>
      <p>{test.details}</p>
    </div>
  ))}
  ```
- [ ] Add "Run All Tests" button
- [ ] Add "Export Results" button (JSON)
- [ ] Add admin-only access (password protection)
- [ ] Add duration tracking per test
- [ ] Style with Tailwind CSS modal

**Acceptance Criteria:**
- All 4 test categories functional
- Pass/fail clearly indicated
- Export results to JSON
- Admin password required

**Testing:**
```bash
# Manual test
1. Navigate to Admin Panel
2. Enter admin password
3. Click "Self-Test" tab
4. Click "Run All Tests"
5. Verify results display
6. Export results JSON
```

---

##### Task 4.4: Documentation (4 hours)

**New Files:**
- `docs/README.md`
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/ADMIN_GUIDE.md`
- `docs/DEPLOYMENT.md`
- `docs/TESTING_GUIDE.md`
- `docs/TROUBLESHOOTING.md`
- `docs/CHANGELOG.md`

**Subtasks:**
- [ ] Write README.md (quick start guide)
  ```markdown
  # Advanced Analytics Dashboard

  ## Features
  - 5 deep-dive visualizations
  - WCAG 2.1 AA accessible
  - Export to PDF/CSV/Excel/PNG
  - Date range filtering
  - Metric selection

  ## Installation
  npm install
  npm start

  ## Usage
  Navigate to /analytics

  ## Testing
  npm test
  npm run test:e2e
  ```
- [ ] Write ARCHITECTURE.md (system design, data flow)
  ```markdown
  # Architecture

  ## Component Hierarchy
  - AdvancedAnalytics (root)
    - DashboardHeader (filters)
    - AllTimeStatsBanner (summary)
    - Charts (5 visualizations)

  ## Data Flow
  1. useAnalyticsData hook fetches data
  2. analyticsCalculations processes data
  3. dataValidation verifies integrity
  4. Charts render processed data

  ## State Management
  - React hooks (useState, useMemo, useEffect)
  - No Redux (lightweight)
  ```
- [ ] Write API.md (API endpoints, responses)
  ```markdown
  # API Documentation

  ## GET /analytics/v1/monthly
  Returns monthly admissions data

  Response:
  {
    "MONTH": "2025-01",
    "SIGNUPS": "40",
    "APPLICANTS": "24",
    ...
  }
  ```
- [ ] Write ADMIN_GUIDE.md (admin features, configuration)
  ```markdown
  # Administrator Guide

  ## Access Admin Panel
  Password: [set during deployment]

  ## Features
  - View audit logs
  - Export system data
  - Run self-tests
  - Configure thresholds
  ```
- [ ] Write DEPLOYMENT.md (production deployment steps)
  ```markdown
  # Deployment Guide

  ## Build for Production
  npm run build

  ## Deploy to Tomcat
  1. Copy dist/ to WEB-INF/
  2. Create WAR file
  3. SCP to server

  ## Environment Variables
  REACT_APP_API_URL=https://api.example.com
  ```
- [ ] Write TESTING_GUIDE.md (testing procedures)
  ```markdown
  # Testing Guide

  ## Unit Tests
  npm test

  ## E2E Tests
  npm run test:e2e

  ## Manual Testing
  1. Load dashboard
  2. Test filters
  3. Test exports
  4. Test accessibility
  ```
- [ ] Write TROUBLESHOOTING.md (common issues, solutions)
  ```markdown
  # Troubleshooting

  ## Issue: Charts not rendering
  Solution: Check data validation errors in console

  ## Issue: Export fails
  Solution: Verify html2canvas and jsPDF installed
  ```
- [ ] Write CHANGELOG.md (version history)
  ```markdown
  # Changelog

  ## Version 3.0.0 (2026-02-XX)
  - Added Phase 2 (Accessibility)
  - Added Phase 3 (Export)
  - Added Phase 4 (Testing)
  - WCAG 2.1 AA compliant
  ```

**Acceptance Criteria:**
- All 8 documentation files created
- Clear, concise language
- Code examples included
- Screenshots where helpful

---

## 🟡 MEDIUM PRIORITY - Week 2 (9 hours)

### Project: rophe-specialist-care-rpms

#### Task 5.1: Feature B - Prescription Modal UI (4 hours)

**New File:** `src/components/PrescriptionModal.tsx`

**Subtasks:**
- [ ] Create PrescriptionModal component
  ```typescript
  interface PrescriptionModalProps {
    patient: Patient;
    onClose: () => void;
    onPrescribe: (prescription: Prescription) => void;
  }
  ```
- [ ] Add medication search autocomplete
  ```typescript
  const [searchQuery, setSearchQuery] = useState('');
  const filteredMeds = searchMedicationsByName(searchQuery);
  ```
- [ ] Add form inputs:
  - Medication (autocomplete dropdown)
  - Dosage (text input)
  - Frequency (dropdown: Once daily, Twice daily, etc.)
  - Duration (number + unit dropdown)
  - Instructions (textarea)
- [ ] Display real-time interaction warnings
  ```typescript
  const interactions = checkDrugInteractions(selectedMed, patient.currentMedications);
  ```
  ```jsx
  {interactions.map(warning => (
    <div className={`alert alert-${warning.severity.toLowerCase()}`}>
      ⚠️ {warning.severity}: {warning.message}
    </div>
  ))}
  ```
- [ ] Display allergy conflict alerts
  ```typescript
  const allergyConflicts = checkAllergyConflicts(selectedMed, patient.allergies);
  ```
  ```jsx
  {allergyConflicts.map(conflict => (
    <div className="alert alert-danger">
      🚨 ALLERGY ALERT: {conflict.message}
    </div>
  ))}
  ```
- [ ] Add prescription confirmation flow
  - Review screen with all details
  - Acknowledge warnings checkbox (if any)
  - "Confirm Prescription" button
- [ ] Integrate into PatientRegistry.tsx
  - Add "Prescribe Medication" button
  - Open PrescriptionModal on click
- [ ] Display current medications list
  ```jsx
  <h3>Current Medications</h3>
  <ul>
    {patient.currentMedications?.map(med => (
      <li key={med.id}>{med.name} - {med.dosage}</li>
    ))}
  </ul>
  ```
- [ ] Display prescription history table
  ```jsx
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Medication</th>
        <th>Dosage</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {patient.prescriptions?.map(rx => (
        <tr key={rx.id}>
          <td>{rx.prescribedDate}</td>
          <td>{rx.medication}</td>
          <td>{rx.dosage}</td>
          <td>{rx.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
  ```
- [ ] Add "Discontinue" button for active prescriptions

**Acceptance Criteria:**
- Modal opens on "Prescribe" button
- Autocomplete searches medication database
- Warnings display in real-time
- Prescription saved to patient record
- History table shows all prescriptions
- Discontinue functionality works

**Testing:**
```bash
# Manual test
1. Open patient record
2. Click "Prescribe Medication"
3. Search for "Ibuprofen"
4. Select medication
5. Enter dosage, frequency, duration
6. Verify interaction warnings (if patient on Warfarin)
7. Acknowledge warnings
8. Confirm prescription
9. Verify appears in prescription history
10. Click "Discontinue" on active prescription
```

---

#### Task 5.2: Feature C - Differential Diagnosis Visualization (2 hours)

**Install Dependencies:** (Already in package.json)
```bash
npm install recharts
```

**File:** `src/components/ClinicalAssistance.tsx` (enhance existing)

**Subtasks:**
- [ ] Import Recharts components
  ```typescript
  import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
  ```
- [ ] Create confidence bar chart
  ```jsx
  const chartData = diagnoses.map(d => ({
    name: d.icdCode,
    confidence: d.confidence,
    description: d.description
  }));

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, 100]} />
      <Tooltip />
      <Bar dataKey="confidence" fill="#4F46E5" />
    </BarChart>
  </ResponsiveContainer>
  ```
- [ ] Create diagnosis comparison table
  ```jsx
  <table className="min-w-full">
    <thead>
      <tr>
        <th>ICD-10 Code</th>
        <th>Description</th>
        <th>Confidence</th>
        <th>Reasoning</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {diagnoses.map((dx, idx) => (
        <tr key={idx}>
          <td>{dx.icdCode}</td>
          <td>{dx.description}</td>
          <td>{dx.confidence}%</td>
          <td>{dx.clinicalReasoning}</td>
          <td>
            <button onClick={() => addToRecord(dx)}>
              Add to Record
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  ```
- [ ] Add "Add to Patient Record" functionality
  ```typescript
  const addToRecord = (diagnosis: Diagnosis) => {
    const updatedHistory = [
      ...patient.medicalHistory,
      `${diagnosis.icdCode}: ${diagnosis.description} (Confidence: ${diagnosis.confidence}%)`
    ];
    updatePatient({ ...patient, medicalHistory: updatedHistory });
  };
  ```
- [ ] Add visual probability distribution
  ```jsx
  <div className="flex gap-1 h-8">
    {diagnoses.map((dx, idx) => (
      <div
        key={idx}
        style={{ width: `${dx.confidence}%` }}
        className="bg-indigo-500 hover:bg-indigo-600"
        title={`${dx.icdCode}: ${dx.confidence}%`}
      />
    ))}
  </div>
  ```
- [ ] Add export diagnosis summary to PDF (optional)
  ```typescript
  import jsPDF from 'jspdf';

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Differential Diagnosis Report', 10, 10);
    diagnoses.forEach((dx, idx) => {
      doc.text(`${dx.icdCode}: ${dx.description} (${dx.confidence}%)`, 10, 20 + idx * 10);
    });
    doc.save('diagnosis-report.pdf');
  };
  ```

**Acceptance Criteria:**
- Bar chart displays confidence scores
- Comparison table shows all diagnoses
- "Add to Record" button functional
- Visual distribution renders
- PDF export generates (optional)

**Testing:**
```bash
# Manual test
1. Enter symptoms: "Fever, headache, muscle aches"
2. Click "Get AI Suggestions"
3. Verify bar chart renders with confidence scores
4. Verify comparison table shows all diagnoses
5. Click "Add to Record" on top diagnosis
6. Verify added to patient medical history
7. Click "Export PDF" (if implemented)
```

---

#### Task 5.3: Feature D - Clinical Decision Support Alerts (3 hours)

**New Files:**
- `src/services/clinicalGuidelinesService.ts`
- `src/components/ClinicalAlertsPanel.tsx`

**Subtasks:**
- [ ] Create clinicalGuidelinesService.ts
  ```typescript
  export interface ClinicalReminder {
    id: string;
    patientId: string;
    type: 'Preventive Care' | 'Chronic Disease' | 'Medication' | 'Screening';
    title: string;
    message: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate?: string;
    dismissed: boolean;
  }

  export const generateReminders = (patient: Patient): ClinicalReminder[] => {
    const reminders: ClinicalReminder[] = [];

    // Age-based screening
    if (patient.gender === 'Female' && calculateAge(patient.dob) >= 40) {
      reminders.push({
        id: generateId(),
        patientId: patient.id,
        type: 'Preventive Care',
        title: 'Mammogram Due',
        message: `Patient is ${calculateAge(patient.dob)} years old. Recommend annual mammogram.`,
        priority: 'High',
        dismissed: false
      });
    }

    // Chronic disease monitoring
    if (patient.medicalHistory.some(h => h.toLowerCase().includes('diabetes'))) {
      reminders.push({
        id: generateId(),
        patientId: patient.id,
        type: 'Chronic Disease',
        title: 'HbA1c Test Due',
        message: 'Diabetic patient - recommend HbA1c test every 3 months.',
        priority: 'High',
        dismissed: false
      });
    }

    // Hypertension monitoring
    if (patient.medicalHistory.some(h => h.toLowerCase().includes('hypertension'))) {
      reminders.push({
        id: generateId(),
        patientId: patient.id,
        type: 'Chronic Disease',
        title: 'Blood Pressure Check',
        message: 'Hypertensive patient - monitor BP monthly.',
        priority: 'Medium',
        dismissed: false
      });
    }

    return reminders;
  };
  ```
- [ ] Add guidelines for:
  - Mammogram (females 40+, every 1-2 years)
  - Colonoscopy (50+, every 10 years)
  - Prostate screening (males 50+, annually)
  - Diabetes HbA1c (every 3 months)
  - Hypertension BP checks (monthly)
  - Vaccinations (flu annually, pneumonia 65+)
- [ ] Create ClinicalAlertsPanel.tsx component
  ```tsx
  export const ClinicalAlertsPanel: React.FC<{
    patient: Patient;
    onDismiss: (reminderId: string, reason: string) => void;
  }> = ({ patient, onDismiss }) => {
    const reminders = generateReminders(patient);

    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h3 className="font-bold text-yellow-800">Clinical Reminders</h3>
        {reminders.filter(r => !r.dismissed).map(reminder => (
          <div key={reminder.id} className="mt-2 p-2 bg-white rounded">
            <div className="flex justify-between">
              <div>
                <span className={`badge badge-${reminder.priority.toLowerCase()}`}>
                  {reminder.priority}
                </span>
                <strong>{reminder.title}</strong>
              </div>
              <button onClick={() => dismissReminder(reminder.id)}>
                ✕
              </button>
            </div>
            <p className="text-sm">{reminder.message}</p>
            {reminder.dueDate && (
              <p className="text-xs text-gray-500">Due: {reminder.dueDate}</p>
            )}
          </div>
        ))}
      </div>
    );
  };
  ```
- [ ] Integrate into Dashboard.tsx
  ```tsx
  <ClinicalAlertsPanel
    patient={selectedPatient}
    onDismiss={handleDismissReminder}
  />
  ```
- [ ] Add filter by priority (High, Medium, Low)
  ```tsx
  const [priorityFilter, setPriorityFilter] = useState<string[]>(['High', 'Medium', 'Low']);

  const filteredReminders = reminders.filter(r =>
    !r.dismissed && priorityFilter.includes(r.priority)
  );
  ```
- [ ] Add dismissal tracking with reason
  ```typescript
  const handleDismissReminder = (reminderId: string) => {
    const reason = prompt('Reason for dismissing:');
    if (reason) {
      addAuditLog({
        event: 'REMINDER_DISMISSED',
        details: `Reminder ${reminderId} dismissed. Reason: ${reason}`
      });
      // Update reminder dismissed status
    }
  };
  ```
- [ ] Add overdue detection (red highlight)
  ```tsx
  const isOverdue = reminder.dueDate && new Date(reminder.dueDate) < new Date();

  <div className={isOverdue ? 'bg-red-100 border-red-400' : 'bg-white'}>
  ```

**Acceptance Criteria:**
- Reminders generate based on patient age/conditions
- Priority filtering works
- Dismissal tracking with audit logging
- Overdue reminders highlighted red
- Panel integrates into Dashboard

**Testing:**
```bash
# Manual test
1. Open patient aged 52, female
2. Verify "Mammogram Due" reminder appears
3. Add "Diabetes" to medical history
4. Verify "HbA1c Test Due" reminder appears
5. Click priority filter "High" only
6. Verify only high-priority shown
7. Click ✕ to dismiss reminder
8. Enter dismissal reason
9. Verify reminder disappears
10. Check audit log for dismissal entry
```

---

## COMPLETION CHECKLIST

### analytics-refactor
- [ ] Phase 2 (Accessibility) - 15 hours
  - [ ] Task 2.1: Keyboard navigation (4h)
  - [ ] Task 2.2: ARIA labels (3h)
  - [ ] Task 2.3: Color contrast (2h)
  - [ ] Task 2.4: Alternative data access (4h)
  - [ ] Task 2.5: Screen reader testing (2h)
- [ ] Phase 3 (Enhanced Functionality) - 15 hours
  - [ ] Task 3.1: Date range filtering (4h)
  - [ ] Task 3.2: Metric selector (3h)
  - [ ] Task 3.3: Export functionality (6h)
  - [ ] Task 3.4: Chart fullscreen (2h)
- [ ] Phase 4 (Testing & Documentation) - 18 hours
  - [ ] Task 4.1: Unit tests (6h)
  - [ ] Task 4.2: E2E tests (4h)
  - [ ] Task 4.3: Self-testing module (4h)
  - [ ] Task 4.4: Documentation (4h)

### rophe-specialist-care-rpms
- [ ] Feature B - Prescription Modal (4 hours)
  - [ ] Task 5.1: UI components (4h)
- [ ] Feature C - Diagnosis Visualization (2 hours)
  - [ ] Task 5.2: Charts and tables (2h)
- [ ] Feature D - Clinical Alerts (3 hours)
  - [ ] Task 5.3: Guidelines service and panel (3h)

---

## TIMELINE

**Week 1 (40 hours):**
- Days 1-2: analytics-refactor Phase 2 (Accessibility) - 15 hours
- Days 3-4: analytics-refactor Phase 3 (Features) - 15 hours
- Day 5: Buffer for testing/fixes - 10 hours

**Week 2 (17 hours):**
- Days 1-3: analytics-refactor Phase 4 (Testing & Docs) - 18 hours
- Day 4: rophe-specialist-care-rpms Features B+C+D - 9 hours

**Buffer:** 10 hours built-in for unexpected issues

---

## DEPENDENCIES & PREREQUISITES

**Before Starting:**
- [ ] Node.js 18+ installed
- [ ] npm/pnpm package manager
- [ ] Git repository access
- [ ] Development environment configured
- [ ] NVDA screen reader installed (Windows) for Task 2.5
- [ ] Admin credentials for testing admin features

**Required Installations:**
- [ ] react-datepicker + date-fns (Task 3.1)
- [ ] html2canvas + jspdf + xlsx (Task 3.3)
- [ ] @testing-library/react + jest (Task 4.1)
- [ ] playwright (Task 4.2)

---

## SUCCESS CRITERIA

**analytics-refactor Complete When:**
- ✅ All 60 requirements implemented (Phases 1-4)
- ✅ WCAG 2.1 AA compliant (axe audit passes)
- ✅ >70% test coverage
- ✅ 10+ E2E tests passing
- ✅ All 8 documentation files created
- ✅ Export functionality works (PNG, PDF, CSV, Excel)
- ✅ Date filtering and metric selection functional
- ✅ Self-testing module operational

**rophe-specialist-care-rpms Complete When:**
- ✅ Prescription Modal UI functional
- ✅ Diagnosis visualization charts render
- ✅ Clinical alerts panel integrated
- ✅ All interaction warnings display
- ✅ Allergy conflicts detected
- ✅ Features B, C, D 100% implemented

---

**Worklist Last Updated:** February 13, 2026
**Estimated Total Completion:** 57 hours (2 weeks)
**Next Review:** After Week 1 completion (Phase 2+3)
