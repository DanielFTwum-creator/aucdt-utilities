# UMaT Tracker

A web application for tracking curriculum implementation recommendations from the University of Mines and Technology (UMaT) for Techbridge University College (TUC).

**Live:** https://ai-tools.techbridge.edu.gh/umat/

## Overview

The UMaT Tracker manages **37 curriculum recommendations** across three TUC programmes:
- **General** — Cross-programme items
- **BSc Electrical & Electronic Engineering (EEE)**
- **BSc Information & Communication Technology (ICT)**

### Features

- 📋 **Implementation Progress** — Track status of all 37 recommendations
- 👤 **Owner Assignment** — Assign items to staff members
- 📊 **Decision Tracking** — Accept, Accept+Note, Superseded, Partial
- 🔍 **Compliance Audit Trail** — Reverse-chronological log of all changes
- 👥 **Staff Workload** — View distribution of items by owner
- 💾 **Auto-Save** — Browser localStorage persists all changes
- 📥 **CSV Export** — Download data for reporting

## Development

### Prerequisites

- Node.js 18+
- pnpm 10+

### Setup

```bash
cd umat
pnpm install
```

### Running Locally

```bash
pnpm dev
```

App will be available at `http://localhost:5173/umat/`

### Building for Production

```bash
pnpm build
```

Output is in `dist/` directory.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions.

### Quick Deploy

```bash
# From umat directory
./deploy.sh root@66.226.72.199 /var/www/vhosts/ai-tools.techbridge.edu.gh/umat
```

Or on Windows:
```powershell
.\deploy.ps1
```

## Data Storage

⚠️ **Important:** The app uses browser localStorage for data persistence. 

- Data is stored locally in each user's browser
- To preserve data, export CSV regularly
- A backend API can be added later for server-side persistence

### Exporting Data

1. Open the tracker
2. Click **"Export CSV ↓"** button in the top-right
3. File will download as `umat-tuc-tracker.csv`

## Architecture

```
UMaTTracker.jsx
├── Top Bar (KPI metrics & export)
├── Implementation Progress Section
│   ├── Filter controls (programme, status)
│   └── Progress table (inline editable)
├── Compliance Audit Trail Section
│   ├── Date range filters
│   └── Reverse-chronological log
└── Staff Workload Section
    └── Owner-grouped workload cards
```

### Component Hierarchy

- **`UMaTTracker.jsx`** — Main app component
  - `Badge` — Decision type badges
  - `StatusDot` — Status indicator
  - `KpiChip` — KPI metric buttons
  - `ChangelogEntry` — Audit log entry
  - `WorkloadCard` — Staff workload card

### State Management

- React hooks (`useState`, `useEffect`, `useMemo`)
- Local state for filters, expanded rows, date ranges
- localStorage for persistent data

## Technology Stack

- **React 18** — UI framework
- **Vite** — Build tool
- **JavaScript** — No TypeScript (optional to add)

## Troubleshooting

### Changes not saving
Check browser console and localStorage availability. Clear cache and reload.

### Styles not loading
Ensure CSS imports are working. Check browser DevTools Network tab.

### Export CSV not working
Check browser permissions for downloads. Try a different browser.

## Future Enhancements

- [ ] Backend API for server-side persistence
- [ ] User authentication
- [ ] Email notifications for task updates
- [ ] Integration with email/Slack
- [ ] Historical data snapshots
- [ ] Advanced filtering (date range, tags)
- [ ] Bulk operations

## Support

**Contact:** daniel.twum@techbridge.edu.gh

---

**Last Updated:** April 2026  
**Status:** Active
