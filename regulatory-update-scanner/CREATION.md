# CREATION.md â€” Regulatory Update Scanner
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/regulatory-update-scanner/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Regulatory Update Scanner monitors government and institutional regulatory feeds, parses policy changes, extracts compliance requirements, and alerts organizations to requirements that affect their operations. It integrates with legal/compliance workflows and provides impact assessments.

Built with **React 19.2.5**, **Node.js/Express**, **SQLite**, and **AI-powered document analysis**.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | **19.2.5** |
| Build | Vite | ^6.2.0 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | ^4.1.14 |
| Backend | Express | ^4.21.2 |
| Database | better-sqlite3 | ^12.4.1 |
| AI | @google/genai | ^1.29.0 |
| HTTP | axios | ^1.13.6 |
| Tests | Vitest | ^3.0.0 |

---

## 3. Key Features

- **Feed monitoring** â€” Crawl gov/institutional regulatory sources
- **Document parsing** â€” Extract policy text, effective dates, requirements
- **Relevance scoring** â€” ML-based filtering for organization-specific impact
- **Compliance extraction** â€” AI-powered requirement identification
- **Impact assessment** â€” Analyze implications for operations
- **Alert routing** â€” Notify compliance teams with triage
- **Audit trail** â€” Immutable record of all updates and responses

---

## 4. Data Model

```ts
interface RegulatoryUpdate {
  id: string;
  source: string;                // e.g., "SEC", "EU Parliament", "TUC Board"
  title: string;
  content: string;
  effectiveDate: string;
  publishedDate: string;
  category: string;              // e.g., "Financial", "Data Privacy", "Education"
  relevanceScore: number;        // 0-1
}

interface ComplianceRequirement {
  id: string;
  updateId: string;
  requirement: string;
  deadline?: string;
  impactArea: string;            // "Operations", "HR", "Finance", "IT"
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}
```

---

## 5. Backend Routes

```ts
GET    /api/updates              // List regulatory updates
POST   /api/updates/scan         // Trigger scan of sources
GET    /api/requirements/:updateId
GET    /api/compliance/status    // Organization compliance dashboard
POST   /api/compliance/acknowledge
```

---

## 6. Admin Features

- Regulatory source management
- Compliance requirement tracking
- Response deadline calendar
- Audit log of compliance actions

---

## 7. Build & Run

```bash
pnpm install
pnpm run dev
pnpm test
```

---

## 8. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Fetches updates from configured sources |
| AC-2 | Parses documents and extracts requirements |
| AC-3 | Scores relevance with configurable thresholds |
| AC-4 | Sends alerts to compliance team |
| AC-5 | Tracks acknowledgment and response |
| AC-6 | Admin dashboard shows compliance status |
| AC-7 | Unit tests pass with >70% coverage |
