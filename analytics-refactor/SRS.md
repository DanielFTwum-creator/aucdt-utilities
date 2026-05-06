# Software Requirements Specification (SRS)
## Project: Advanced Analytics Dashboard (v3.0.0)
## Version: 3.0.0 - Institutional Edition
**Project Type:** Analytics Dashboard
**Status:** Approved

---

## 1. Introduction

### 1.1 Purpose
The Advanced Analytics Dashboard (analytics-refactor) is a premium **React 19.2.4** application designed to provide TECHBRIDGE University College with real-time, high-fidelity data visualization and analytical insights into student admissions, performance, and demographic trends.

### 1.2 Scope
The dashboard replaces legacy reporting tools with a modern, accessible, and AI-enhanced analytical suite featuring:
- 6-Phase Phased Refresh architecture
- 6R Methodology UI/UX Design
- Password-protected Admin Panel with Diagnostics
- Multi-format Export (PDF, CSV, Excel, PNG)
- Real-time Trend Analysis using Gemini 3.0 Flash

#### System Architecture
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
  <defs>
    <style>
      .bg { fill: #0a0a20; }
      .box { fill: rgba(79,70,229,0.05); stroke: #4F46E5; stroke-width: 2; rx: 8; }
      .text-title { fill: #ffffff; font-family: 'Inter', sans-serif; font-size: 20px; font-weight: bold; text-anchor: middle; }
      .text-sub { fill: #818cf8; font-family: 'Inter', sans-serif; font-size: 12px; letter-spacing: 2px; text-anchor: middle; }
      .line { stroke: #4F46E5; stroke-width: 2; stroke-dasharray: 4; fill: none; }
      .arrow { fill: #4F46E5; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" class="arrow" />
    </marker>
  </defs>
  <rect width="1000" height="600" class="bg" />
  <text x="400" y="40" fill="#818cf8" font-family="Inter" font-size="24" font-weight="bold" text-anchor="middle" letter-spacing="4">ADVANCED ANALYTICS DASHBOARD</text>
  <text x="400" y="60" fill="#ffffff" opacity="0.6" font-family="Inter" font-size="10" text-anchor="middle" letter-spacing="2">SYSTEM ARCHITECTURE • REACT 19.2.4</text>
  <rect x="50" y="100" width="200" height="300" class="box" />
  <text x="150" y="130" class="text-title">Presentation</text>
  <text x="150" y="150" class="text-sub">REACT 19.2.4 SPA</text>
  <rect x="70" y="180" width="160" height="40" fill="rgba(255,255,255,0.1)" rx="4" />
  <text x="150" y="205" fill="#fff" font-family="Inter" font-size="12" text-anchor="middle">AdvancedAnalytics UI</text>
  <rect x="70" y="240" width="160" height="40" fill="rgba(255,255,255,0.1)" rx="4" />
  <text x="150" y="265" fill="#fff" font-family="Inter" font-size="12" text-anchor="middle">Recharts Engine</text>
  <rect x="70" y="300" width="160" height="40" fill="rgba(255,255,255,0.1)" rx="4" />
  <text x="150" y="325" fill="#fff" font-family="Inter" font-size="12" text-anchor="middle">Admin diagnostics</text>
  <rect x="300" y="100" width="200" height="300" class="box" />
  <text x="400" y="130" class="text-title">Logic Layer</text>
  <text x="400" y="150" class="text-sub">HOOKS &amp; UTILS</text>
  <rect x="320" y="180" width="160" height="40" fill="rgba(79,70,229,0.2)" rx="4" />
  <text x="400" y="205" fill="#818cf8" font-family="Inter" font-size="12" text-anchor="middle" font-weight="bold">useAnalyticsData</text>
  <rect x="320" y="240" width="160" height="40" fill="rgba(79,70,229,0.2)" rx="4" />
  <text x="400" y="265" fill="#818cf8" font-family="Inter" font-size="12" text-anchor="middle" font-weight="bold">analyticsCalculations</text>
  <rect x="320" y="300" width="160" height="40" fill="rgba(79,70,229,0.2)" rx="4" />
  <text x="400" y="325" fill="#818cf8" font-family="Inter" font-size="12" text-anchor="middle" font-weight="bold">LocalStorage Cache</text>
  <rect x="550" y="100" width="200" height="300" class="box" />
  <text x="650" y="130" class="text-title">Backend Layer</text>
  <text x="650" y="150" class="text-sub">API &amp; DATA</text>
  <rect x="570" y="180" width="160" height="40" fill="#ffffff" rx="4" />
  <text x="650" y="205" fill="#000" font-family="Inter" font-size="12" text-anchor="middle" font-weight="bold">AUCDT REST API</text>
  <rect x="570" y="240" width="160" height="40" fill="#ffffff" rx="4" />
  <text x="650" y="265" fill="#000" font-family="Inter" font-size="12" text-anchor="middle" font-weight="bold">Google Gemini AI</text>
  <path d="M 250 200 L 310 200" class="line" marker-end="url(#arrowhead)" />
  <path d="M 500 200 L 560 200" class="line" marker-end="url(#arrowhead)" />
  <path d="M 250 260 L 310 260" class="line" marker-end="url(#arrowhead)" />
  <path d="M 500 260 L 560 260" class="line" marker-end="url(#arrowhead)" />
  <path d="M 250 320 L 310 320" class="line" marker-end="url(#arrowhead)" />
  <path d="M 310 320 L 250 320" class="line" marker-end="url(#arrowhead)" />
</svg>

#### Data Architecture
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
  <defs>
    <style>
      .bg { fill: #ffffff; }
      .db { fill: #F8FAFC; stroke: #4F46E5; stroke-width: 2; rx: 8; }
      .text-title { fill: #1e1b4b; font-family: Inter, serif; font-size: 20px; font-weight: bold; text-anchor: middle; }
      .text-field { fill: #475569; font-family: monospace; font-size: 11px; }
      .line { stroke: #4F46E5; stroke-width: 2; fill: none; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#4F46E5" />
    </marker>
  </defs>
  <rect width="1000" height="600" class="bg" />
  <text x="400" y="40" fill="#1e1b4b" font-family="Inter" font-size="24" font-weight="bold" text-anchor="middle" letter-spacing="2">DATA ARCHITECTURE &amp; ANALYTICAL FLOW</text>
  <text x="400" y="60" fill="#64748b" font-family="Inter" font-size="10" text-anchor="middle" letter-spacing="2">ADVANCED ANALYTICS DASHBOARD v3.0.0</text>
  <rect x="50" y="100" width="220" height="350" class="db" />
  <rect x="50" y="100" width="220" height="40" fill="#4F46E5" rx="8" />
  <rect x="50" y="120" width="220" height="20" fill="#4F46E5" />
  <text x="160" y="125" fill="#fff" font-family="Inter" font-size="14" font-weight="bold" text-anchor="middle">Raw Data (JSON)</text>
  <text x="70" y="170" class="text-field" font-weight="bold">record:</text>
  <text x="90" y="190" class="text-field">MONTH: YYYY-MM</text>
  <text x="90" y="210" class="text-field">SIGNUPS: number</text>
  <text x="90" y="230" class="text-field">APPLICANTS: number</text>
  <text x="90" y="250" class="text-field">ACCEPTED: number</text>
  <text x="90" y="270" class="text-field">REGISTERED: number</text>
  <text x="70" y="310" class="text-field" font-weight="bold">validation:</text>
  <text x="90" y="330" class="text-field">validateDataIntegrity()</text>
  <text x="90" y="350" class="text-field">checkNumericFields()</text>
  <rect x="350" y="220" width="100" height="40" fill="#1e1b4b" rx="20" />
  <text x="400" y="245" fill="#fff" font-family="Inter" font-size="10" text-anchor="middle" letter-spacing="1">PROCESS</text>
  <rect x="530" y="120" width="240" height="310" class="db" />
  <rect x="530" y="120" width="240" height="40" fill="#1e1b4b" rx="8" />
  <rect x="530" y="140" width="240" height="20" fill="#1e1b4b" />
  <text x="650" y="145" fill="#818cf8" font-family="Inter" font-size="14" font-weight="bold" text-anchor="middle">Processed Metrics</text>
  <text x="550" y="190" class="text-field" font-weight="bold">yearlyData:</text>
  <text x="570" y="210" class="text-field">{ year, signups, rate, ... }</text>
  <text x="550" y="240" class="text-field" font-weight="bold">funnelData:</text>
  <text x="570" y="260" class="text-field">{ signups, appRate, ... }</text>
  <text x="550" y="290" class="text-field" font-weight="bold">trends:</text>
  <text x="570" y="310" class="text-field">{ growth, conversionTrend }</text>
  <text x="550" y="340" class="text-field" font-weight="bold">allTimeStats:</text>
  <text x="570" y="360" class="text-field">{ totalSignups, avgRate, ... }</text>
  <path d="M 270 240 L 340 240" class="line" marker-end="url(#arrowhead)" />
  <path d="M 450 240 L 520 240" class="line" marker-end="url(#arrowhead)" />
</svg>

---

## 2. Functional Requirements

### 2.1 Data Visualization (6R Refined)
- **FR-01**: Render interactive visualizations (Line, Bar, Radar, Area, and Pie charts) using Recharts.
- **FR-02**: **Progressive Disclosure**: Primary KPIs (Total Signups, Applicants, Accepted, Registered) are displayed as hero stats; detailed charts load on demand.
- **FR-03**: **Analytical Precision**: All chart elements must be clickable to trigger drill-down views or detailed data tables.
- **FR-04**: **Dynamic Filtering**: Centralized Date Range and Metric Selection filters with real-time state persistence.

### 2.2 Security & Admin Control
- **FR-05**: **Institutional Access**: Secure Admin Panel (`#/admin`) protected by a dual-validation access code.
- **FR-06**: **Refresh Monitoring**: Dedicated "Refresh Status" dashboard in the Admin Panel to track the 5-phase project evolution.
- **FR-07**: **Diagnostics Isolation**: All system diagnostics, E2E simulations, and data import tools are restricted to the Admin route.
- **FR-08**: **Audit Logging**: Comprehensive tracking of all administrative actions, data exports, and simulation runs.

### 2.3 Universal Access & Export
- **FR-09**: **WCAG 2.1 AA Compliance**: 100% ARIA coverage, focus traps for modals, and full keyboard navigation (Tab/Enter).
- **FR-10**: **Tri-Theme System**: Support for Light (Day), Dark (Night), and High-Contrast (Accessibility) themes.
- **FR-11**: **Multi-Format Export**: Support for full-dashboard PDF/Excel export and individual chart PNG/CSV export.

### 2.4 AI-Powered Insight
- **FR-12**: (AI) Use **Gemini-3-Flash-Preview** to analyze seasonal trends and generate predictive enrollment scores.
- **FR-13**: (AI) Automated detection of data anomalies (e.g., sudden drop in registration conversion).

---

## 3. Non-Functional Requirements

- **NFR-01**: **Performance**: Initial load time < 2 seconds; chart re-renders < 300ms.
- **NFR-02**: **React Version**: STRICT ADHERENCE to **React 19.2.4**.
- **NFR-03**: **Zero Broken Links**: All buttons, links, and toggles must be fully functional or removed.
- **NFR-04**: **PWA Support**: Offline capability for viewing cached report data.
- **NFR-05**: **6R Design**: Adherence to the 6R Methodology (Reduce, Reuse, Recycle, Rethink, Refine, Reimagine).

---

## 4. Technology Stack

- **Frontend:** React 19.2.4 (TypeScript/Vite)
- **Styling:** Tailwind CSS v4 / Material UI
- **Charts:** Recharts 3.x
- **Testing:** Vitest / Playwright
- **AI:** Google Generative AI (Gemini)
- **Export:** html2canvas / jsPDF / SheetJS (XLSX)
