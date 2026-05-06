# DataTable Integration Guide

**Component:** Accessible Data Table for Chart Alternatives
**Purpose:** WCAG 2.1 AA Compliance - Provide accessible alternatives to visual charts
**Status:** ✅ Ready for Integration

---

## Overview

The DataTable component provides an accessible, sortable, and exportable table view as an alternative to chart visualizations. This ensures users who cannot see or interact with charts can still access the data.

---

## Components Created

### 1. **DataTable.jsx** - Core Table Component
- **Location:** `src/components/analytics/components/DataTable.jsx`
- **Features:**
  - Sortable columns (keyboard accessible)
  - ARIA labels and semantic HTML
  - CSV export functionality
  - Responsive design (stacks on mobile)
  - Screen reader optimized
  - Print-friendly

### 2. **ChartWithTable.jsx** - Chart/Table Toggle Wrapper
- **Location:** `src/components/analytics/components/ChartWithTable.jsx`
- **Features:**
  - Toggle between chart and table view
  - Keyboard navigation
  - Screen reader announcements
  - Maintains user preference
  - Smooth transitions

---

## Usage Examples

### Example 1: Year-over-Year Chart with Table

```javascript
import { ChartWithTable } from './components/ChartWithTable';
import { YearOverYearChart } from './charts/YearOverYearChart';
import { formatNumber, formatPercentage } from '../../../utils/formatters';

// In your component
<ChartWithTable
  chartComponent={<YearOverYearChart data={processedMetrics.yearlyData} />}
  tableData={processedMetrics.yearlyData}
  tableCaption="Year-over-Year Growth Analysis"
  tableColumns={[
    { key: 'year', label: 'Year', sortable: true },
    { key: 'signups', label: 'Signups', format: formatNumber, sortable: true },
    { key: 'applicants', label: 'Applicants', format: formatNumber, sortable: true },
    { key: 'accepted', label: 'Accepted', format: formatNumber, sortable: true },
    { key: 'registered', label: 'Registered', format: formatNumber, sortable: true },
    { key: 'acceptanceRate', label: 'Acceptance Rate', format: formatPercentage, sortable: true },
  ]}
  id="year-over-year"
/>
```

### Example 2: Standalone DataTable

```javascript
import { DataTable } from './components/DataTable';
import { formatNumber } from '../../../utils/formatters';

<DataTable
  data={monthlyData}
  caption="Monthly Performance Data"
  columns={[
    { key: 'month', label: 'Month', sortable: true },
    { key: 'signups', label: 'Signups', format: formatNumber, sortable: true },
    { key: 'applicants', label: 'Applicants', format: formatNumber, sortable: true },
  ]}
  onExportCSV={(data) => console.log('Exporting:', data)}
  maxHeight="500px"
  id="monthly-data"
/>
```

---

## Integration Steps

### Step 1: Import Components

Add to your chart files:

```javascript
import { ChartWithTable } from '../components/ChartWithTable';
import { formatNumber, formatPercentage } from '../../../utils/formatters';
```

### Step 2: Prepare Table Columns

Define columns for each chart:

#### YearOverYearChart Columns

```javascript
const yearOverYearColumns = [
  { key: 'year', label: 'Academic Year', sortable: true },
  {
    key: 'signups',
    label: 'Total Signups',
    format: formatNumber,
    sortable: true
  },
  {
    key: 'applicants',
    label: 'Total Applicants',
    format: formatNumber,
    sortable: true
  },
  {
    key: 'accepted',
    label: 'Students Accepted',
    format: formatNumber,
    sortable: true
  },
  {
    key: 'registered',
    label: 'Students Registered',
    format: formatNumber,
    sortable: true
  },
  {
    key: 'acceptanceRate',
    label: 'Acceptance Rate (%)',
    format: formatPercentage,
    sortable: true
  },
];
```

#### FunnelEfficiencyChart Columns

```javascript
const funnelColumns = [
  { key: 'month', label: 'Month', sortable: true },
  {
    key: 'signups',
    label: 'Signups',
    format: formatNumber,
    sortable: true
  },
  {
    key: 'applicants',
    label: 'Applicants',
    format: formatNumber,
    sortable: true
  },
  {
    key: 'accepted',
    label: 'Accepted',
    format: formatNumber,
    sortable: true
  },
  {
    key: 'registered',
    label: 'Registered',
    format: formatNumber,
    sortable: true
  },
];
```

#### QualityQuantityChart Columns

```javascript
const qualityQuantityColumns = [
  { key: 'month', label: 'Month', sortable: true },
  {
    key: 'applicants',
    label: 'Number of Applicants',
    format: formatNumber,
    sortable: true
  },
  {
    key: 'acceptanceRate',
    label: 'Acceptance Rate (%)',
    format: formatPercentage,
    sortable: true
  },
  {
    key: 'accepted',
    label: 'Total Accepted',
    format: formatNumber,
    sortable: true
  },
];
```

#### SeasonalPatternChart Columns

```javascript
const seasonalColumns = [
  { key: 'month', label: 'Month', sortable: true },
  {
    key: 'avgSignups',
    label: 'Avg Signups',
    format: (val) => formatNumber(Math.round(val)),
    sortable: true
  },
  {
    key: 'avgApplicants',
    label: 'Avg Applicants',
    format: (val) => formatNumber(Math.round(val)),
    sortable: true
  },
  {
    key: 'avgAccepted',
    label: 'Avg Accepted',
    format: (val) => formatNumber(Math.round(val)),
    sortable: true
  },
  {
    key: 'avgRejected',
    label: 'Avg Rejected',
    format: (val) => formatNumber(Math.round(val)),
    sortable: true
  },
];
```

#### PerformanceScorecardChart Columns

```javascript
const performanceColumns = [
  { key: 'month', label: 'Month', sortable: true },
  {
    key: 'Conversion',
    label: 'Conversion Rate (%)',
    format: (val) => val.toFixed(1),
    sortable: true
  },
  {
    key: 'Acceptance',
    label: 'Acceptance Rate (%)',
    format: (val) => val.toFixed(1),
    sortable: true
  },
  {
    key: 'Success',
    label: 'Success Rate (%)',
    format: (val) => val.toFixed(1),
    sortable: true
  },
  {
    key: 'Efficiency',
    label: 'Efficiency (%)',
    format: (val) => val.toFixed(1),
    sortable: true
  },
];
```

### Step 3: Update AdvancedAnalytics.jsx

Replace chart components with wrapped versions:

```javascript
import { ChartWithTable } from './components/ChartWithTable';

// ...in render

{/* Chart 1: Year-over-Year with Table */}
<ChartWithTable
  chartComponent={
    <YearOverYearChart data={processedMetrics.yearlyData} />
  }
  tableData={processedMetrics.yearlyData}
  tableCaption="Year-over-Year Growth Analysis"
  tableColumns={yearOverYearColumns}
  id="year-over-year"
/>

{/* Chart 2: Funnel with Table */}
<ChartWithTable
  chartComponent={
    <FunnelEfficiencyChart
      data={processedMetrics.funnelData}
      allTimeRegistrationRate={insights.allTimeStats.registrationRate}
    />
  }
  tableData={processedMetrics.funnelData}
  tableCaption="Conversion Funnel Efficiency (Last 12 Months)"
  tableColumns={funnelColumns}
  id="funnel-efficiency"
/>

{/* Repeat for remaining charts */}
```

---

## Column Configuration Reference

### Column Object Structure

```typescript
{
  key: string;        // Data property key
  label: string;      // Column header label
  sortable?: boolean; // Enable sorting (default: false)
  format?: (value: any) => string; // Formatting function
}
```

### Common Format Functions

```javascript
import { formatNumber, formatPercentage, formatMonth } from '../../../utils/formatters';

// Number formatting (1234 → "1,234")
{ key: 'signups', label: 'Signups', format: formatNumber }

// Percentage formatting (75.5 → "75.5%")
{ key: 'rate', label: 'Rate', format: formatPercentage }

// Month formatting ("2025-01" → "Jan 2025")
{ key: 'month', label: 'Month', format: formatMonth }

// Custom formatting
{
  key: 'average',
  label: 'Average',
  format: (val) => formatNumber(Math.round(val))
}

// Currency formatting
{
  key: 'cost',
  label: 'Cost',
  format: (val) => `$${formatNumber(val)}`
}
```

---

## Accessibility Features

### WCAG 2.1 AA Compliance

✅ **Keyboard Navigation**
- All sortable headers are keyboard accessible (Tab, Enter, Space)
- Scrollable table region has tabindex for keyboard scrolling
- Export button keyboard accessible

✅ **Screen Reader Support**
- Proper table semantics (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- `scope` attributes on headers
- `aria-sort` on sortable columns
- `aria-live` region announces sorting changes
- `sr-only` class for additional context

✅ **Focus Indicators**
- Visible focus outlines on all interactive elements
- 3px amber focus ring (WCAG AA compliant)
- Box shadow for additional depth

✅ **Semantic HTML**
- Proper heading hierarchy
- Landmark roles (`region`, `status`)
- Caption for table context

### Screen Reader Experience

When a user navigates with a screen reader:

1. **Table Caption:** "Year-over-Year Growth Analysis"
2. **Headers:** "Year, sortable, not sorted. Press Enter to sort."
3. **Cells:** "2024, 1,234 signups, 987 applicants..."
4. **Sorting:** "Sorted by Year, ascending"
5. **Export:** "Export Year-over-Year Growth Analysis to CSV"

---

## Responsive Design

### Desktop (>768px)
- Full table layout with all columns visible
- Sticky header on scroll
- Hover states on rows
- Sortable column headers

### Tablet (640px - 768px)
- Horizontal scrolling for wide tables
- Sticky header maintained
- All functionality preserved

### Mobile (<640px)
- **Card Layout:** Table stacks into card-style layout
- Each row becomes a card
- Labels appear inline with values
- Headers hidden
- Export button expands to full width

---

## Testing Checklist

### Functionality Testing

- [ ] Columns sort correctly (ascending/descending)
- [ ] Sort indicator shows current state
- [ ] Export CSV downloads correctly
- [ ] Data formats correctly (numbers, percentages, dates)
- [ ] Empty state displays when no data
- [ ] Table scrolls properly on overflow

### Accessibility Testing

- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Screen reader announces sort state
- [ ] Focus indicators visible
- [ ] ARIA labels present and correct
- [ ] Table semantics valid (use WAVE browser extension)
- [ ] Contrast ratios meet WCAG AA (use axe DevTools)

### Responsive Testing

- [ ] Desktop: Full table displays correctly
- [ ] Tablet: Scrolling works
- [ ] Mobile: Card layout displays correctly
- [ ] Print: Table prints properly (headers hidden)

### Browser Testing

- [ ] Chrome - All features work
- [ ] Firefox - All features work
- [ ] Safari - All features work
- [ ] Edge - All features work

---

## Performance Considerations

### Optimization Tips

1. **Large Datasets (>1000 rows)**
   ```javascript
   // Add pagination
   const [page, setPage] = useState(1);
   const rowsPerPage = 50;
   const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
   ```

2. **Memoize Formatted Values**
   ```javascript
   const formattedData = useMemo(() =>
     data.map(row => ({
       ...row,
       formattedSignups: formatNumber(row.signups)
     })),
     [data]
   );
   ```

3. **Virtual Scrolling (for 5000+ rows)**
   ```javascript
   // Consider react-window or react-virtualized
   import { FixedSizeList } from 'react-window';
   ```

---

## CSV Export Format

### Default Export Format

```csv
"Year","Total Signups","Total Applicants","Students Accepted","Students Registered","Acceptance Rate (%)"
"2024","1,234","987","456","389","46.2%"
"2023","1,156","892","423","356","47.4%"
```

### Custom Export Handler

```javascript
const handleCustomExport = (data) => {
  // Custom export logic
  const csv = generateCustomCSV(data);
  downloadFile(csv, 'custom-export.csv');
};

<DataTable
  data={data}
  columns={columns}
  onExportCSV={handleCustomExport}
/>
```

---

## Common Issues and Solutions

### Issue 1: Sort Not Working

**Problem:** Clicking headers doesn't sort
**Solution:** Ensure `sortable: true` in column config

```javascript
{ key: 'signups', label: 'Signups', sortable: true }  // ✅
{ key: 'signups', label: 'Signups' }  // ❌ Not sortable
```

### Issue 2: Numbers Sorting as Strings

**Problem:** "100" sorts before "20"
**Solution:** Ensure data values are numbers, not strings

```javascript
// ❌ Bad - string values
{ month: "2024-01", signups: "100" }

// ✅ Good - numeric values
{ month: "2024-01", signups: 100 }
```

### Issue 3: Mobile Layout Not Stacking

**Problem:** Table doesn't stack on mobile
**Solution:** Ensure `data-label` attribute is set

The component handles this automatically via the `data-label={column.label}` attribute.

### Issue 4: Export Includes Special Characters

**Problem:** CSV breaks with commas or quotes in data
**Solution:** Component automatically escapes special characters

---

## Future Enhancements

### Planned Features

- [ ] **Pagination** - For datasets >100 rows
- [ ] **Column Filtering** - Filter by value
- [ ] **Column Reordering** - Drag to reorder columns
- [ ] **Column Visibility** - Show/hide columns
- [ ] **Export to Excel** - XLSX format with formatting
- [ ] **Export to PDF** - Formatted table in PDF
- [ ] **Row Selection** - Select/export specific rows
- [ ] **Sticky First Column** - Keep first column visible on scroll

---

## Support

For issues or questions:
- Check the [Accessibility Documentation](./ACCESSIBILITY.md)
- Review [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- Contact IT Support: support@techbridge.edu.gh

---

**Last Updated:** 2026-02-13
**Status:** ✅ Production Ready
**WCAG Level:** AA Compliant
