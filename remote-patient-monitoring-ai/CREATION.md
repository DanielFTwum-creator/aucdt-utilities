# CREATION.md â€” Remote Patient Monitoring AI
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/remote-patient-monitoring-ai/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Remote Patient Monitoring AI system tracks patient vital signs (heart rate, blood pressure, temperature, SpO2, glucose) from wearable devices and IoT sensors, analyzes them with AI-powered anomaly detection, alerts healthcare providers to concerning trends, and maintains a secure patient health record.

Built with **React 19.2.5**, **Node.js/Express**, **SQLite**, and **medical AI**.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | **19.2.5** |
| Build | Vite | ^6.2.0 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | ^4.1.14 |
| Charts | Recharts | ^3.7.0 |
| Backend | Express | ^4.21.2 |
| Database | better-sqlite3 | ^12.4.1 |
| AI | @google/genai | ^1.29.0 |
| Security | jsonwebtoken | ^9.0.3 |
| Tests | Vitest | ^3.0.0 |

---

## 3. Key Features

- **Real-time vital sign ingestion** â€” Accepts data from wearables/sensors
- **Anomaly detection** â€” Flags concerning vital sign combinations
- **Clinical decision support** â€” AI-generated observations for providers
- **Patient dashboard** â€” Personal health record with historical trends
- **Provider console** â€” Patient caseload with alert queue
- **Secure messaging** â€” Provider-patient communication
- **Audit logging** â€” HIPAA-compliant access logs
- **Data export** â€” PDF health summaries for records

---

## 4. Data Model

```ts
interface VitalSigns {
  id: string;
  patientId: string;
  timestamp: string;
  heartRate: number;             // bpm
  systolicBP: number;            // mmHg
  diastolicBP: number;
  temperature: number;           // Celsius
  spO2: number;                  // %
  glucose?: number;              // mg/dL
  source: string;                // "wearable", "manual", "sensor"
}

interface Alert {
  id: string;
  patientId: string;
  severity: 'critical' | 'high' | 'medium';
  type: string;                  // e.g., "Elevated BP", "Irregular HR"
  timestamp: string;
  acknowledged: boolean;
  providerNote?: string;
}

interface PatientRecord {
  id: string;
  name: string;
  dateOfBirth: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  emergencyContact: string;
  createdAt: string;
}
```

---

## 5. Backend Routes

```ts
POST   /api/vitals               // Ingest vital signs
GET    /api/patients/:id/vitals  // Get patient vital history
GET    /api/alerts               // List provider alerts
POST   /api/alerts/:id/acknowledge
GET    /api/records/:patientId   // Get patient record
POST   /api/messages             // Provider-patient messaging
```

---

## 6. Alert Logic

```ts
// Thresholds (configurable per patient)
const NORMAL_RANGES = {
  heartRate: { min: 60, max: 100 },
  systolicBP: { min: 90, max: 130 },
  diastolicBP: { min: 60, max: 80 },
  temperature: { min: 36.5, max: 37.5 },
  spO2: { min: 95, max: 100 }
};

// Composite alerts (e.g., elevated HR + temp + low SpO2 â†’ infection risk)
```

---

## 7. Privacy & Security

- **Authentication** â€” JWT-based access for patients/providers
- **HIPAA compliance** â€” Audit logs, data encryption at rest
- **Role-based access** â€” Patients see only their data; providers see assigned patients
- **Data retention** â€” Configurable archival after clinical utility period

---

## 8. Build & Run

```bash
pnpm install
pnpm run dev
pnpm test
```

---

## 9. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Accepts vital signs via secure API |
| AC-2 | Detects anomalies matching clinical thresholds |
| AC-3 | Generates alerts for concerning combinations |
| AC-4 | Patient dashboard shows vital trends |
| AC-5 | Provider console lists and filters alerts |
| AC-6 | Secure messaging between provider and patient |
| AC-7 | Audit logs track all data access |
| AC-8 | PDF export of patient summary |
| AC-9 | Unit tests pass with >70% coverage |
| AC-10 | HIPAA checklist items verified |
