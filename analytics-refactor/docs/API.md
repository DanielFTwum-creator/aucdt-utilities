# API Reference

## Custom Hooks

### `useAnalyticsData(filters?)`

Primary data hook. Fetches, validates, and memoises all dashboard data.

```js
import { useAnalyticsData } from '../hooks/useAnalyticsData';

const { data, loading, error, processedMetrics, retry } = useAnalyticsData(filters);
```

**Parameters**

| Param | Type | Default | Description |
|---|---|---|---|
| `filters.dateRange` | `{ start: string, end: string }` | all time | ISO date range filter |
| `filters.selectedMetrics` | `string[]` | `['all']` | Metric keys or `['all']` |

**Returns**

| Field | Type | Description |
|---|---|---|
| `data` | `DataRow[] \| null` | Raw validated rows |
| `loading` | `boolean` | True while fetching |
| `error` | `Error \| null` | Fetch or validation error |
| `processedMetrics` | `ProcessedMetrics` | Aggregated, memoised results |
| `retry` | `() => void` | Trigger re-fetch |

---

## Utility Functions

### `analyticsCalculations.js`

All functions are pure (no side effects).

```js
import {
  processRawData,
  calculateYearlyData,
  calculateTrends,
  calculateFunnelData,
  calculateAllTimeStats,
} from '../utils/analyticsCalculations';
```

#### `processRawData(rows)`
Normalises raw JSON rows. Converts string numbers to floats, computes `acceptanceRate`, `registrationRate`.

#### `calculateYearlyData(rows)`
Groups by year. Returns `{ year, signups, applicants, accepted, rejected, waitlisted, registered }[]`.

#### `calculateTrends(yearlyData)`
Computes year-over-year percentage changes for each metric.

#### `calculateFunnelData(rows)`
Returns funnel stages `[signups → applicants → accepted → registered]` with conversion rates.

#### `calculateAllTimeStats(rows)`
Returns aggregate totals and overall rates across all years.

---

### `dataValidation.js`

```js
import { validateDataIntegrity } from '../utils/dataValidation';

const result = validateDataIntegrity(rawData);
// result.valid: boolean
// result.errors: string[]
// result.warnings: string[]
```

**Required fields per row:** `MONTH` (YYYY-MM), `SIGNUPS`, `APPLICANTS`, `ACCEPTED`, `REJECTED`, `WAITLISTED`, `REGISTERED` (all numeric strings).

---

## Data Format

### Input (JSON)

```json
[
  {
    "MONTH": "2024-01",
    "SIGNUPS": "120",
    "APPLICANTS": "95",
    "ACCEPTED": "48",
    "REJECTED": "32",
    "WAITLISTED": "15",
    "REGISTERED": "42"
  }
]
```

### Processed Row

```ts
{
  month: string;          // "2024-01"
  year: number;           // 2024
  signups: number;
  applicants: number;
  accepted: number;
  rejected: number;
  waitlisted: number;
  registered: number;
  acceptanceRate: number; // accepted / applicants * 100
  registrationRate: number; // registered / accepted * 100
}
```

---

## Environment Variables

```bash
# .env (Vite — prefix with VITE_)
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=analytics2024
VITE_DATA_URL=/data/analytics.json
```

Access in code: `import.meta.env.VITE_ADMIN_USERNAME`
