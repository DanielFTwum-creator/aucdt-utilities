# CREATION.md â€” Real-Time Economic Signal Analyzer
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/real-time-economic-signal-analyzer/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Real-Time Economic Signal Analyzer is a **full-stack autonomous operations and management platform** (App ID 229) that monitors, analyzes, and forecasts economic indicators in real-time. It integrates Google Generative AI for signal analysis, real-time data feeds, and interactive dashboards for financial decision-makers.

The app features a **React 19.2.5 frontend** with Recharts visualizations, a **Node.js/Express backend** using SQLite/better-sqlite3 for persistence, and autonomous signal processing via AI-driven insights.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Frontend Runtime | React | **19.2.5** |
| Frontend Build | Vite | ^6.2.0 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | ^4.1.14 |
| Charts | Recharts | ^3.7.0 |
| Icons | Lucide React | ^0.546.0 |
| Motion | Framer Motion | ^12.34.3 |
| Backend Runtime | Node.js | 24.x (Docker) |
| Backend Framework | Express | ^4.21.2 |
| Backend Build | Vite | ^6.2.0 |
| Database | better-sqlite3 | ^12.4.1 |
| AI Integration | @google/genai | ^1.29.0 |
| HTTP Client | axios | ^1.13.6 |
| State Management | Zustand | ^5.0.11 |
| Routing | React Router DOM | ^7.13.1 |
| Env Vars | dotenv | ^17.2.3 |
| Unit Tests | Vitest | ^3.0.0 |
| E2E Tests | Vitest E2E | ^3.0.0 |
| Container | node:24-alpine | â€” |

---

## 3. Directory Structure (verbatim)

```
real-time-economic-signal-analyzer/
â”œâ”€â”€ index.html
â”œâ”€â”€ package.json                 # name: real-time-economic-signal-analyzer, version: 2.0.0
â”œâ”€â”€ vite.config.ts
â”œâ”€â”€ vitest.config.ts
â”œâ”€â”€ vitest.e2e.config.ts
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ tailwind.config.js
â”œâ”€â”€ postcss.config.js
â”œâ”€â”€ Dockerfile                   # multi-stage node:24-alpine â†’ node:24-alpine
â”œâ”€â”€ .env.example
â”œâ”€â”€ .gitignore
â”œâ”€â”€ server.ts                    # Express entry point
â”œâ”€â”€ CREATION.md
â”œâ”€â”€ public/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ index.tsx
â”‚   â”œâ”€â”€ App.tsx
â”‚   â”œâ”€â”€ server.ts
â”‚   â”œâ”€â”€ types.ts
â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ Dashboard.tsx
â”‚   â”‚   â”œâ”€â”€ SignalAnalysis.tsx
â”‚   â”‚   â”œâ”€â”€ Forecasting.tsx
â”‚   â”‚   â””â”€â”€ Admin.tsx
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ RealTimeChart.tsx
â”‚   â”‚   â”œâ”€â”€ SignalIndicator.tsx
â”‚   â”‚   â”œâ”€â”€ AIInsights.tsx
â”‚   â”‚   â”œâ”€â”€ DataImport.tsx
â”‚   â”‚   â””â”€â”€ LoadingState.tsx
â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ useEconomicSignals.ts
â”‚   â”‚   â”œâ”€â”€ useAIAnalysis.ts
â”‚   â”‚   â””â”€â”€ useRealtimeUpdates.ts
â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”œâ”€â”€ api.ts
â”‚   â”‚   â”œâ”€â”€ economicDataService.ts
â”‚   â”‚   â”œâ”€â”€ aiService.ts
â”‚   â”‚   â”œâ”€â”€ database.ts
â”‚   â”‚   â””â”€â”€ signalProcessor.ts
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”œâ”€â”€ calculations.ts
â”‚   â”‚   â”œâ”€â”€ formatters.ts
â”‚   â”‚   â””â”€â”€ validators.ts
â”‚   â””â”€â”€ styles/
â”‚       â”œâ”€â”€ index.css
â”‚       â””â”€â”€ globals.css
â”œâ”€â”€ db/                          # SQLite database files
â””â”€â”€ __tests__/
    â”œâ”€â”€ api.test.ts
    â”œâ”€â”€ signals.test.ts
    â””â”€â”€ ai.test.ts
```

---

## 4. Data Model (canonical record shape)

```ts
interface EconomicSignal {
  id: string;                    // UUID
  timestamp: string;             // ISO 8601
  indicator: string;             // e.g., "GDP", "Inflation", "Unemployment"
  value: number;                 // numeric value
  unit: string;                  // e.g., "%", "USD", "basis points"
  source: string;                // data source name
  confidence: number;            // 0-1 confidence score
}

interface SignalAnalysis {
  signalId: string;
  timestamp: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number;              // 0-1
  aiInsight: string;             // AI-generated analysis
  forecast: ForecastData[];
}

interface ForecastData {
  date: string;                  // ISO 8601
  predicted: number;
  confidence: number;            // 0-1
  scenario: 'optimistic' | 'base' | 'pessimistic';
}
```

---

## 5. Backend Routes (`server.ts`)

```ts
POST   /api/signals              // Insert new economic signal
GET    /api/signals              // Fetch signals (with filters: indicator, dateRange)
GET    /api/signals/:id          // Get single signal
DELETE /api/signals/:id          // Archive signal

POST   /api/analysis             // Trigger AI analysis
GET    /api/analysis/:signalId   // Get analysis result
GET    /api/analysis             // List recent analyses

POST   /api/forecast             // Generate forecast
GET    /api/forecast/:id         // Get forecast details

GET    /api/health               // Health check
POST   /api/import               // Bulk import signals (CSV/JSON)
```

---

## 6. Database Schema

```sql
CREATE TABLE signals (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  indicator TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT,
  source TEXT,
  confidence REAL DEFAULT 0.8,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analyses (
  id TEXT PRIMARY KEY,
  signal_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  trend TEXT CHECK(trend IN ('bullish', 'bearish', 'neutral')),
  strength REAL,
  ai_insight TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (signal_id) REFERENCES signals(id)
);

CREATE TABLE forecasts (
  id TEXT PRIMARY KEY,
  signal_id TEXT NOT NULL,
  forecast_date TEXT NOT NULL,
  predicted_value REAL,
  confidence REAL,
  scenario TEXT CHECK(scenario IN ('optimistic', 'base', 'pessimistic')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (signal_id) REFERENCES signals(id)
);

CREATE INDEX idx_signals_timestamp ON signals(timestamp);
CREATE INDEX idx_signals_indicator ON signals(indicator);
CREATE INDEX idx_analyses_signal_id ON analyses(signal_id);
```

---

## 7. AI Integration (`src/services/aiService.ts`)

Uses Google Generative AI SDK (`@google/genai`) to:
1. Analyze economic signal trends
2. Generate human-readable insights
3. Predict future values based on historical patterns
4. Assess confidence levels

```ts
export class AIService {
  private client: GoogleGenerativeAI;

  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
  }

  async analyzeSignal(signal: EconomicSignal, history: EconomicSignal[]): Promise<SignalAnalysis> {
    const prompt = `
      Analyze this economic signal:
      Current: ${signal.value} ${signal.unit} (${signal.indicator})
      Source: ${signal.source}
      Recent history: ${history.map(h => `${h.value} on ${h.timestamp}`).join(', ')}
      
      Provide: trend (bullish/bearish/neutral), strength (0-1), insight (1-2 sentences)
    `;
    
    const response = await this.client.generateContent(prompt);
    return this.parseResponse(response);
  }

  async generateForecast(signalId: string, horizon: number): Promise<ForecastData[]> {
    // Similar pattern: prompt â†’ generate â†’ parse
  }
}
```

---

## 8. Real-Time Data Processing (`src/services/signalProcessor.ts`)

```ts
export class SignalProcessor {
  // Process incoming signals
  async processSignal(raw: any): Promise<EconomicSignal> {
    const signal: EconomicSignal = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      indicator: raw.indicator,
      value: parseFloat(raw.value),
      unit: raw.unit || '%',
      source: raw.source,
      confidence: raw.confidence || 0.8
    };
    
    // Validate, persist, broadcast
    await this.validate(signal);
    await this.persist(signal);
    this.broadcast(signal);
    
    return signal;
  }

  // Detect anomalies
  detectAnomalies(signals: EconomicSignal[]): EconomicSignal[] {
    return signals.filter(s => {
      const zscore = calculateZScore(s.value, signals);
      return Math.abs(zscore) > 2.5; // 3-sigma rule
    });
  }
}
```

---

## 9. Frontend State & Hooks

**useEconomicSignals** â€” Fetch and filter signals with real-time updates.
**useAIAnalysis** â€” Trigger and cache AI analyses.
**useRealtimeUpdates** â€” WebSocket or polling for live signal feeds.

---

## 10. Admin Panel (Password-Protected `#/admin`)

- Real-time signal monitoring
- Bulk data import (CSV/JSON)
- AI analysis queue and results
- Forecast accuracy tracking
- System diagnostics

---

## 11. Build & Run

```bash
pnpm install
pnpm run dev              # Start both frontend (Vite) + backend (Express)
pnpm run build            # Vite build + backend TS compile
pnpm test                 # Vitest unit tests
pnpm test:e2e             # E2E tests
```

---

## 12. Environment Variables

```bash
GOOGLE_GENAI_API_KEY=<your-key>
DATABASE_PATH=./db/signals.db
PORT=3000
API_URL=http://localhost:3000
NODE_ENV=development
```

---

## 13. Docker

Multi-stage build: `node:24-alpine` (pnpm install + build + run server).

---

## 14. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | App builds with zero TypeScript errors |
| AC-2 | Backend serves `/api/health` returning 200 |
| AC-3 | Frontend displays real-time signals dashboard |
| AC-4 | AI analysis endpoint produces valid JSON with trend + insight |
| AC-5 | Forecast generation produces valid ForecastData array |
| AC-6 | Database persists and retrieves signals correctly |
| AC-7 | Admin panel accessible via password gate |
| AC-8 | Bulk import parses CSV/JSON and validates schema |
| AC-9 | All charts render with live data |
| AC-10 | Unit tests pass with >70% coverage |
