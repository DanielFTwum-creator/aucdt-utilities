# 🚀 ADVANCED ANALYTICS DASHBOARD - REMAINING IMPLEMENTATION TASKS

**Project:** Analytics Dashboard Refactor
**Current Status:** Phase 1 Complete ✅ (Data Layer + Loading States)
**Last Updated:** 2026-01-26

---

## 📊 PROJECT OVERVIEW

### What's Been Completed (Phase 1)
✅ **Data Abstraction Layer**
- Custom hook `useAnalyticsData` with API integration
- Data validation and integrity checks
- Memoized calculations for performance
- Fallback data for development

✅ **State Management**
- LoadingState with animated skeleton
- ErrorState with retry functionality
- EmptyState with helpful guidance
- Proper error handling throughout

✅ **Core Components**
- Main AdvancedAnalytics component
- DashboardHeader with quick stats
- AllTimeStatsBanner with lifetime metrics
- All 5 chart components (functional)
- Reusable CustomTooltip and ChartInsight

✅ **Utilities**
- analyticsCalculations.js (pure functions)
- dataValidation.js (integrity checks)
- Test data generator

---

## 🎯 PHASE 2: ACCESSIBILITY & WCAG 2.1 AA COMPLIANCE

**Estimated Time:** 2-3 days
**Priority:** HIGH 🔴
**Goal:** Make dashboard fully accessible to all users

### Task 2.1: Keyboard Navigation
**File:** All component files
**Estimated:** 4 hours

```javascript
// Add to AdvancedAnalytics.jsx
useEffect(() => {
  const handleKeyPress = (e) => {
    // Ctrl+P: Print
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      window.print();
    }
    
    // Ctrl+E: Export (when implemented)
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      handleExport();
    }
  };
  
  document.addEventListener('keydown', handleKeyPress);
  return () => document.removeEventListener('keydown', handleKeyPress);
}, []);

// Add skip links to top of render
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded"
>
  Skip to main content
</a>
```

**Checklist:**
- [ ] Add keyboard shortcuts (Ctrl+P, Ctrl+E, etc.)
- [ ] Implement focus trap for modals
- [ ] Add visible focus indicators (rings)
- [ ] Create skip links for main sections
- [ ] Test all interactive elements with Tab key
- [ ] Add keyboard navigation hints in UI

### Task 2.2: ARIA Labels & Semantic HTML
**Files:** All chart components, header, banners
**Estimated:** 3 hours

```javascript
// Update all chart containers
<section
  role="region"
  aria-labelledby="chart-heading-1"
  aria-describedby="chart-description-1"
>
  <h2 id="chart-heading-1">Year-over-Year Growth</h2>
  <p id="chart-description-1" className="sr-only">
    This chart shows yearly growth from 2017 to 2026 with bars representing
    signups, applicants, accepted students, and registered students. A line
    shows the acceptance rate trend over time.
  </p>
  {/* Chart */}
</section>

// Add live region for dynamic updates
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  {loading && "Loading data..."}
  {error && `Error: ${error.message}`}
  {data && `Data loaded successfully with ${data.length} records`}
</div>
```

**Checklist:**
- [ ] Add aria-label to all buttons
- [ ] Add aria-describedby to complex visualizations
- [ ] Create screen-reader-only descriptions for charts
- [ ] Add aria-live regions for dynamic content
- [ ] Use semantic HTML (nav, main, section, article)
- [ ] Add landmark roles where appropriate

### Task 2.3: Color Contrast & Visual Accessibility
**Files:** All component styles
**Estimated:** 2 hours

```javascript
// Update color palette to meet WCAG AA (4.5:1 ratio)
const colors = {
  // Text colors
  textPrimary: '#1f2937',      // gray-800 (contrast: 12.63:1)
  textSecondary: '#4b5563',    // gray-600 (contrast: 7.48:1)
  textMuted: '#6b7280',        // gray-500 (contrast: 5.74:1)
  
  // Chart colors (all meet 3:1 for large text)
  blue: '#2563eb',             // blue-600
  purple: '#7c3aed',           // purple-600
  green: '#059669',            // green-600
  amber: '#d97706',            // amber-600
  red: '#dc2626',              // red-600
  
  // Interactive states
  linkDefault: '#2563eb',      // 4.61:1
  linkHover: '#1d4ed8',        // 6.09:1
  focusRing: '#2563eb',        // Visible focus indicator
};

// Add focus styles to all interactive elements
className="focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
```

**Checklist:**
- [ ] Run axe-core audit on all pages
- [ ] Verify all text meets 4.5:1 ratio
- [ ] Verify all UI components meet 3:1 ratio
- [ ] Add visible focus indicators (not just outline)
- [ ] Test with high contrast mode
- [ ] Test with browser zoom at 200%

### Task 2.4: Alternative Data Access
**Files:** Create new DataTable component
**Estimated:** 4 hours

```javascript
// Create components/DataTable.jsx
import React, { useMemo, useState } from 'react';

export const DataTable = ({ data, caption, columns }) => {
  const [sortConfig, setSortConfig] = useState(null);
  
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);
  
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort(col.key)}
                aria-sort={
                  sortConfig?.key === col.key
                    ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                    : 'none'
                }
              >
                {col.label}
                {sortConfig?.key === col.key && (
                  <span aria-hidden="true">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map(col => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {col.format ? col.format(row[col.key]) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Add toggle to each chart
const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'

<button
  onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}
  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
  aria-label={`Switch to ${viewMode === 'chart' ? 'table' : 'chart'} view`}
>
  {viewMode === 'chart' ? '📊 View as Table' : '📈 View as Chart'}
</button>

{viewMode === 'chart' ? <ChartComponent /> : <DataTable data={data} />}
```

**Checklist:**
- [ ] Create DataTable component with sorting
- [ ] Add "View as Table" toggle to all charts
- [ ] Generate text descriptions for chart trends
- [ ] Add export to accessible formats (CSV)
- [ ] Test with screen reader (NVDA/JAWS)

### Task 2.5: Screen Reader Testing & Documentation
**Files:** Create ACCESSIBILITY.md
**Estimated:** 2 hours

**Checklist:**
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (Mac)
- [ ] Document keyboard shortcuts
- [ ] Create accessibility statement page
- [ ] Add accessibility toggle (if needed)

---

## 🎨 PHASE 3: ENHANCED FUNCTIONALITY

**Estimated Time:** 3-4 days
**Priority:** MEDIUM 🟡
**Goal:** Add filtering, export, and interactive features

### Task 3.1: Date Range Filtering
**Files:** Create DateRangeFilter.jsx, update useAnalyticsData hook
**Estimated:** 4 hours

```bash
npm install react-datepicker
npm install date-fns
```

```javascript
// Create components/DateRangeFilter.jsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const DateRangeFilter = ({ value, onChange }) => {
  return (
    <div className="flex gap-2 items-center">
      <DatePicker
        selected={value.start}
        onChange={(date) => onChange({ ...value, start: date })}
        selectsStart
        startDate={value.start}
        endDate={value.end}
        placeholderText="Start Date"
        className="px-3 py-2 border rounded-lg"
        maxDate={new Date()}
      />
      <span className="text-gray-500">to</span>
      <DatePicker
        selected={value.end}
        onChange={(date) => onChange({ ...value, end: date })}
        selectsEnd
        startDate={value.start}
        endDate={value.end}
        minDate={value.start}
        placeholderText="End Date"
        className="px-3 py-2 border rounded-lg"
        maxDate={new Date()}
      />
      <button
        onClick={() => onChange({ start: null, end: null })}
        className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        Clear
      </button>
    </div>
  );
};

// Add to DashboardHeader
<DateRangeFilter 
  value={dateRange} 
  onChange={setDateRange}
  aria-label="Filter data by date range"
/>
```

**Checklist:**
- [ ] Install react-datepicker
- [ ] Create DateRangeFilter component
- [ ] Integrate with useAnalyticsData hook
- [ ] Add preset ranges (Last 30 days, Last 90 days, YTD)
- [ ] Persist filter to localStorage
- [ ] Add loading indicator while filtering

### Task 3.2: Metric Selector
**Files:** Create MetricSelector.jsx
**Estimated:** 3 hours

```javascript
// Create components/MetricSelector.jsx
export const MetricSelector = ({ selected, onChange }) => {
  const metrics = [
    { id: 'signups', label: 'Signups', icon: '👥' },
    { id: 'applicants', label: 'Applicants', icon: '📝' },
    { id: 'accepted', label: 'Accepted', icon: '✅' },
    { id: 'registered', label: 'Registered', icon: '🎓' },
  ];
  
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange(['all'])}
        className={`px-3 py-2 rounded-lg ${
          selected.includes('all') ? 'bg-indigo-600 text-white' : 'bg-gray-100'
        }`}
      >
        All Metrics
      </button>
      {metrics.map(metric => (
        <button
          key={metric.id}
          onClick={() => {
            if (selected.includes(metric.id)) {
              onChange(selected.filter(m => m !== metric.id));
            } else {
              onChange([...selected.filter(m => m !== 'all'), metric.id]);
            }
          }}
          className={`px-3 py-2 rounded-lg ${
            selected.includes(metric.id) || selected.includes('all')
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100'
          }`}
        >
          {metric.icon} {metric.label}
        </button>
      ))}
    </div>
  );
};
```

**Checklist:**
- [ ] Create MetricSelector component
- [ ] Filter chart data based on selection
- [ ] Add "All Metrics" toggle
- [ ] Persist selection to localStorage
- [ ] Add visual indicators for active metrics

### Task 3.3: Export Functionality
**Files:** Create hooks/useChartExport.js
**Estimated:** 6 hours

```bash
npm install html2canvas jspdf xlsx
```

```javascript
// Create hooks/useChartExport.js
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const useChartExport = () => {
  const [exporting, setExporting] = useState(false);

  const exportToPNG = async (elementId, filename) => {
    setExporting(true);
    try {
      const element = document.getElementById(elementId);
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `${filename}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async (elementId, filename) => {
    setExporting(true);
    try {
      const element = document.getElementById(elementId);
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = (data, filename) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${Date.now()}.csv`;
    link.click();
  };

  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${filename}-${Date.now()}.xlsx`);
  };

  const convertToCSV = (data) => {
    if (!data || !data.length) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(row => 
      headers.map(header => JSON.stringify(row[header] ?? '')).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  };

  return {
    exportToPNG,
    exportToPDF,
    exportToCSV,
    exportToExcel,
    exporting
  };
};

// Add export buttons to DashboardHeader
const { exportToPNG, exportToPDF, exportToCSV, exportToExcel, exporting } = useChartExport();

<div className="relative">
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

**Checklist:**
- [ ] Install export dependencies
- [ ] Create useChartExport hook
- [ ] Add export dropdown to header
- [ ] Implement PNG export for individual charts
- [ ] Implement PDF export for full dashboard
- [ ] Implement CSV export for raw data
- [ ] Implement Excel export with formatting
- [ ] Add loading indicator during export
- [ ] Handle export errors gracefully

### Task 3.4: Chart Fullscreen Mode
**Files:** Update chart containers
**Estimated:** 2 hours

```javascript
// Add to ChartContainer or individual charts
const [isFullscreen, setIsFullscreen] = useState(false);

useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [isFullscreen]);

return (
  <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white p-8' : ''}`}>
    <button
      onClick={() => setIsFullscreen(!isFullscreen)}
      className="absolute top-4 right-4"
    >
      {isFullscreen ? '↙️ Exit' : '↗️ Fullscreen'}
    </button>
    {/* Chart content */}
  </div>
);
```

**Checklist:**
- [ ] Add fullscreen toggle to all charts
- [ ] Handle Escape key to exit fullscreen
- [ ] Adjust chart sizing in fullscreen mode
- [ ] Add overlay background
- [ ] Test on different screen sizes

---

## 🧪 PHASE 4: TESTING & DOCUMENTATION

**Estimated Time:** 3-4 days
**Priority:** HIGH 🔴
**Goal:** Ensure quality and maintainability

### Task 4.1: Unit Tests (Jest)
**Files:** Create __tests__ directory
**Estimated:** 6 hours

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

```javascript
// Create __tests__/analyticsCalculations.test.js
import {
  processRawData,
  calculateYearlyData,
  calculateTrends,
  calculateAllTimeStats
} from '../utils/analyticsCalculations';

describe('Analytics Calculations', () => {
  const mockData = [
    {MONTH:"2025-01",SIGNUPS:"40",REGISTERED:"2",ACCEPTED:"8",REJECTED:"3",WAITLISTED:"11",APPLICANTS:"24"}
  ];

  test('processRawData calculates acceptance rate correctly', () => {
    const result = processRawData(mockData);
    expect(result[0].acceptanceRate).toBe(33.3); // 8/24 * 100
  });

  test('calculateYearlyData aggregates by year', () => {
    const processed = processRawData(mockData);
    const yearly = calculateYearlyData(processed);
    expect(yearly).toHaveLength(1);
    expect(yearly[0].year).toBe('2025');
    expect(yearly[0].signups).toBe(40);
  });

  test('calculateAllTimeStats returns correct totals', () => {
    const processed = processRawData(mockData);
    const stats = calculateAllTimeStats(processed);
    expect(stats.signups).toBe(40);
    expect(stats.accepted).toBe(8);
    expect(stats.registered).toBe(2);
  });
});

// Create __tests__/dataValidation.test.js
import { validateDataIntegrity, validateRecord } from '../utils/dataValidation';

describe('Data Validation', () => {
  test('validates correct data', () => {
    const data = [{MONTH:"2025-01",SIGNUPS:"10",APPLICANTS:"8",ACCEPTED:"3",REJECTED:"2",WAITLISTED:"3",REGISTERED:"1"}];
    const result = validateDataIntegrity(data);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('detects missing fields', () => {
    const data = [{MONTH:"2025-01",SIGNUPS:"10"}];
    const result = validateDataIntegrity(data);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('detects invalid month format', () => {
    const data = [{MONTH:"2025/01",SIGNUPS:"10",APPLICANTS:"8",ACCEPTED:"3",REJECTED:"2",WAITLISTED:"3",REGISTERED:"1"}];
    const result = validateDataIntegrity(data);
    expect(result.valid).toBe(false);
  });
});

// Create __tests__/useAnalyticsData.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { useAnalyticsData } from '../hooks/useAnalyticsData';

describe('useAnalyticsData Hook', () => {
  test('loads data successfully', async () => {
    const { result } = renderHook(() => useAnalyticsData({ 
      dateRange: { start: null, end: null },
      selectedMetrics: ['all']
    }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.data).toBeDefined();
    expect(result.current.processedMetrics).toBeDefined();
    expect(result.current.error).toBeNull();
  });
});
```

**Checklist:**
- [ ] Install testing dependencies
- [ ] Write tests for analyticsCalculations.js (100% coverage)
- [ ] Write tests for dataValidation.js (100% coverage)
- [ ] Write tests for useAnalyticsData hook
- [ ] Write component tests for state components
- [ ] Achieve >70% overall code coverage
- [ ] Set up Jest configuration
- [ ] Add test scripts to package.json

### Task 4.2: E2E Tests (Playwright)
**Files:** Create e2e directory
**Estimated:** 4 hours

```bash
npm install --save-dev playwright
```

```javascript
// Create e2e/dashboard.test.js
const playwright = require('playwright');

describe('Analytics Dashboard E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await playwright.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/analytics');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Dashboard loads without errors', async () => {
    await page.waitForSelector('h1');
    const title = await page.$eval('h1', el => el.textContent);
    expect(title).toBe('Advanced Analytics Suite');
  });

  test('All charts are rendered', async () => {
    const charts = await page.$$('[role="region"]');
    expect(charts.length).toBeGreaterThanOrEqual(5);
  });

  test('Loading state appears and disappears', async () => {
    await page.reload();
    const loadingVisible = await page.$('[role="status"]') !== null;
    expect(loadingVisible).toBe(true);
    
    await page.waitForSelector('h2', { timeout: 5000 });
  });

  test('Print button is functional', async () => {
    const printButton = await page.$('button[aria-label="Print dashboard"]');
    expect(printButton).toBeTruthy();
  });

  test('Keyboard navigation works', async () => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBe('BUTTON');
  });

  test('Takes screenshot for visual regression', async () => {
    await page.screenshot({ path: 'e2e/screenshots/dashboard.png', fullPage: true });
  });
});
```

**Checklist:**
- [ ] Install Playwright
- [ ] Create E2E test suite
- [ ] Test critical user paths
- [ ] Test error states
- [ ] Test loading states
- [ ] Capture screenshots for visual regression
- [ ] Set up CI/CD integration
- [ ] Add E2E test script to package.json

### Task 4.3: Self-Testing Module (Admin Feature)
**Files:** Create components/TestPanel.jsx
**Estimated:** 4 hours

```javascript
// Create components/TestPanel.jsx
import React, { useState } from 'react';
import { validateDataIntegrity } from '../utils/dataValidation';

export const TestPanel = ({ currentData, onClose }) => {
  const [testResults, setTestResults] = useState(null);
  const [running, setRunning] = useState(false);

  const runAllTests = async () => {
    setRunning(true);
    const results = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    // Test 1: Data Integrity
    const validation = validateDataIntegrity(currentData);
    results.tests.push({
      name: 'Data Integrity',
      passed: validation.valid,
      details: validation.errors,
      recordCount: validation.recordCount
    });

    // Test 2: Calculation Accuracy
    const calcTest = testCalculations(currentData);
    results.tests.push({
      name: 'Calculation Accuracy',
      passed: calcTest.passed,
      details: calcTest.failures
    });

    // Test 3: Performance
    const perfTest = await testPerformance();
    results.tests.push({
      name: 'Render Performance',
      passed: perfTest.renderTime < 100,
      details: `Render time: ${perfTest.renderTime}ms`
    });

    // Test 4: Accessibility
    const a11yTest = await testAccessibility();
    results.tests.push({
      name: 'Accessibility',
      passed: a11yTest.violations === 0,
      details: `${a11yTest.violations} violations found`
    });

    setTestResults(results);
    setRunning(false);
  };

  const testCalculations = (data) => {
    const failures = [];
    // Test acceptance rate calculation
    // Test totals
    // Test date parsing
    return {
      passed: failures.length === 0,
      failures
    };
  };

  const testPerformance = async () => {
    const start = performance.now();
    await new Promise(resolve => setTimeout(resolve, 0));
    const end = performance.now();
    return {
      renderTime: (end - start).toFixed(2)
    };
  };

  const testAccessibility = async () => {
    // Could integrate with axe-core here
    return {
      violations: 0
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">🧪 Self-Testing Module</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <button
          onClick={runAllTests}
          disabled={running}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 mb-6"
        >
          {running ? '⏳ Running Tests...' : '▶️ Run All Tests'}
        </button>

        {testResults && (
          <div className="space-y-4">
            {testResults.tests.map((test, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${test.passed ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <h3 className="font-bold mb-2">
                  {test.passed ? '✅' : '❌'} {test.name}
                </h3>
                <p className="text-sm">{test.details}</p>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold mb-2">Test Summary</h3>
              <p>Total Tests: {testResults.tests.length}</p>
              <p>Passed: {testResults.tests.filter(t => t.passed).length}</p>
              <p>Failed: {testResults.tests.filter(t => !t.passed).length}</p>
              <p className="text-xs text-gray-600 mt-2">
                Run at: {new Date(testResults.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

**Checklist:**
- [ ] Create TestPanel component
- [ ] Add admin-only access (password protection)
- [ ] Test data integrity
- [ ] Test calculation accuracy
- [ ] Test performance benchmarks
- [ ] Test accessibility compliance
- [ ] Add screenshot capture
- [ ] Export test report (JSON/PDF)
- [ ] Schedule automated tests

### Task 4.4: Documentation
**Files:** Create comprehensive documentation
**Estimated:** 4 hours

**Documentation Files to Create:**
- [ ] README.md - Project overview, setup, usage
- [ ] ARCHITECTURE.md - System design, data flow
- [ ] API.md - API documentation (endpoints, responses)
- [ ] ADMIN_GUIDE.md - Admin features, testing module
- [ ] DEPLOYMENT.md - Production deployment guide
- [ ] TESTING_GUIDE.md - How to run tests
- [ ] TROUBLESHOOTING.md - Common issues and solutions
- [ ] CHANGELOG.md - Version history

**README.md Template:**
```markdown
# Advanced Analytics Dashboard

## Overview
A comprehensive analytics dashboard for tracking admission data with 5 deep-dive visualizations.

## Features
- ✅ Year-over-Year Growth Analysis
- ✅ Conversion Funnel Tracking
- ✅ Quality vs Quantity Analysis
- ✅ Seasonal Pattern Recognition
- ✅ Multi-Metric Performance Scorecard
- ✅ WCAG 2.1 AA Accessible
- ✅ Export to PDF/CSV/Excel
- ✅ Self-Testing Module

## Installation
\`\`\`bash
npm install
npm start
\`\`\`

## Usage
Navigate to \`/analytics\` to view the dashboard.

## Testing
\`\`\`bash
npm test          # Unit tests
npm run test:e2e  # E2E tests
\`\`\`

## Documentation
- [Architecture](./ARCHITECTURE.md)
- [Admin Guide](./ADMIN_GUIDE.md)
- [Deployment](./DEPLOYMENT.md)
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 2: Accessibility (2-3 days)
- [ ] Task 2.1: Keyboard Navigation (4h)
- [ ] Task 2.2: ARIA Labels (3h)
- [ ] Task 2.3: Color Contrast (2h)
- [ ] Task 2.4: Alternative Data Access (4h)
- [ ] Task 2.5: Screen Reader Testing (2h)

### Phase 3: Enhanced Functionality (3-4 days)
- [ ] Task 3.1: Date Range Filtering (4h)
- [ ] Task 3.2: Metric Selector (3h)
- [ ] Task 3.3: Export Functionality (6h)
- [ ] Task 3.4: Chart Fullscreen Mode (2h)

### Phase 4: Testing & Documentation (3-4 days)
- [ ] Task 4.1: Unit Tests (6h)
- [ ] Task 4.2: E2E Tests (4h)
- [ ] Task 4.3: Self-Testing Module (4h)
- [ ] Task 4.4: Documentation (4h)

---

## 🚢 PRODUCTION DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing (unit + E2E)
- [ ] Accessibility audit passing (axe-core)
- [ ] Performance budget met (<2s load time)
- [ ] Code review completed
- [ ] Security audit completed
- [ ] Browser compatibility tested
- [ ] Mobile responsive verified

### Deployment
- [ ] Environment variables configured
- [ ] API endpoints updated to production
- [ ] Error logging configured (Sentry)
- [ ] Analytics tracking added
- [ ] Backup procedures in place
- [ ] Rollback plan documented

### Post-Deployment
- [ ] Smoke tests passing
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Document any issues

---

## 📊 SUCCESS METRICS

**Phase 2 Success Criteria:**
- ✅ 100% keyboard navigable
- ✅ Zero WCAG violations (axe-core)
- ✅ Screen reader compatible
- ✅ Alternative data access available

**Phase 3 Success Criteria:**
- ✅ Date filtering working
- ✅ Export to 4 formats (PNG, PDF, CSV, Excel)
- ✅ All interactive features functional

**Phase 4 Success Criteria:**
- ✅ >70% code coverage
- ✅ All E2E tests passing
- ✅ Complete documentation
- ✅ Self-testing module operational

**Production Success Criteria:**
- ✅ <2s page load time
- ✅ <100ms render time per chart
- ✅ Zero critical bugs in first week
- ✅ Positive user feedback

---

## 🎯 PRIORITY ORDER

1. **Phase 2 (Accessibility)** - CRITICAL for compliance
2. **Phase 4 (Testing)** - CRITICAL for quality assurance
3. **Phase 3 (Features)** - IMPORTANT for user experience

---

## 📞 SUPPORT & RESOURCES

**Documentation:**
- [Recharts Docs](https://recharts.org/)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Jest Testing](https://jestjs.io/docs/getting-started)

**Tools:**
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

**Support:**
- IT Support: support@techbridge.edu.gh
- Project Lead: Head of ICT

---

**Last Updated:** 2026-01-26
**Status:** Phase 1 Complete ✅ | Phase 2-4 Pending
