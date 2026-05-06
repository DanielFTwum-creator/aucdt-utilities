# CREATION.md — Real-Time Error Classifier
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/real-time-error-classifier/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Real-Time Error Classifier is an **AI-powered anomaly detection and error classification system** that ingests application logs, system events, and error streams in real-time, classifies them by severity and type, and triggers autonomous remediation workflows. It uses machine learning and heuristic rules to distinguish between transient faults, systemic issues, and security threats.

Built with **React 19.2.4 frontend**, **Node.js/Express backend**, and **SQLite persistence**.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | **19.2.4** |
| Build | Vite | ^6.2.0 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | ^4.1.14 |
| Charts | Recharts | ^3.7.0 |
| Icons | Lucide React | ^0.546.0 |
| Backend | Node.js | 24.x |
| Framework | Express | ^4.21.2 |
| Database | better-sqlite3 | ^12.4.1 |
| AI | @google/genai | ^1.29.0 |
| State | Zustand | ^5.0.11 |
| Tests | Vitest | ^3.0.0 |

---

## 3. Key Features

- **Real-time log ingestion** — Accepts syslog, JSON logs, application error streams
- **Classification engine** — Categorizes errors into ~15 predefined classes
- **ML-based severity prediction** — Assigns severity (critical, high, medium, low)
- **Pattern recognition** — Detects recurring error signatures
- **Remediation suggestions** — AI-driven fixes or escalation paths
- **Alert routing** — Sends notifications to ops teams via webhooks
- **Audit logging** — Immutable record of all classifications

---

## 4. Data Model

```ts
interface LogEntry {
  id: string;
  timestamp: string;
  source: string;                // application/service name
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  message: string;
  stackTrace?: string;
  context?: Record<string, any>;
}

interface Classification {
  id: string;
  logEntryId: string;
  errorClass: string;            // e.g., "NullPointerException", "NetworkTimeout", "OutOfMemory"
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;            // 0-1
  aiInsight: string;
  suggestedActions: string[];
  timestamp: string;
}
```

---

## 5. Backend Routes

```ts
POST   /api/logs                 // Ingest log entries
GET    /api/logs                 // Query logs with filters
POST   /api/classify             // Classify pending logs
GET    /api/classifications      // List classifications
GET    /api/patterns             // Detect recurring patterns
POST   /api/remediate            // Trigger remediation workflow
GET    /api/health               // Health check
```

---

## 6. Admin Features

- Pattern analysis dashboard
- Classification accuracy metrics
- Remediation workflow status
- AI training data management
- Manual classification overrides

---

## 7. Build & Run

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm test
```

---

## 8. Docker

Multi-stage build: `node:24-alpine`.

---

## 9. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Accepts log entries via POST /api/logs |
| AC-2 | Classifies logs into predefined error classes |
| AC-3 | Assigns severity with >80% accuracy on test set |
| AC-4 | Detects recurring patterns across log stream |
| AC-5 | Generates remediation suggestions via AI |
| AC-6 | Frontend displays real-time classification dashboard |
| AC-7 | Admin panel shows pattern analysis |
| AC-8 | Audit logs immutable and queryable |
| AC-9 | Unit tests pass with >70% coverage |
| AC-10 | Webhook alerts fire correctly |
