# IEEE 29148 Software Requirements Specification (SRS)
## SickBay Management System (`sickbay`)

**Document Identifier:** `TUC-ICT-SRS-2026-004`  
**Revision:** 2.0.0  
**Date:** 21 July 2026  
**Status:** Approved & As-Built  
**Author:** Daniel Frempong Twum, Head of ICT & Special Advisor to the Founder  
**Institution:** Techbridge University College (TUC), Oyibi, Greater Accra, Ghana  

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the **SickBay Management System (`sickbay`)**, an integrated campus healthcare encounter management platform operating at Techbridge University College.

### 1.2 System Scope
`sickbay` provides campus health officers with digital patient intake, triage registration, vitals analytics, pharmacy inventory monitoring, referral tracking, and ward sanitisation logging.

```
+-----------------------------------------------------------------------+
|                 SICKBAY MANAGEMENT SYSTEM (SYSTEM SCOPE)             |
|                                                                       |
|  +--------------------+  +--------------------+  +-----------------+  |
|  | Patient Intake     |  | Clinical Vitals    |  | Pharmacy        |  |
|  | & Triage Roster    |  | Trend Analytics    |  | Inventory       |  |
|  +--------------------+  +--------------------+  +-----------------+  |
|  +--------------------+  +--------------------+  +-----------------+  |
|  | Hospital           |  | Daily Ward Bed &   |  | PDF Medical     |  |
|  | Referrals          |  | Hygiene Checks     |  | Summary Export  |  |
|  +--------------------+  +--------------------+  +-----------------+  |
+-----------------------------------------------------------------------+
```

---

## 2. Overall Description

### 2.1 Product Perspective
The system operates as a client-side single-page application (SPA) backed by a lightweight Node.js Express server running on port `3046` under Plesk Ubuntu infrastructure (`ai-tools.techbridge.edu.gh/sickbay/`).

### 2.2 System Architecture
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="100%" height="350">
  <!-- Embedded Architecture Diagram -->
  <rect width="900" height="600" fill="#f8fafc" rx="12"/>
  <text x="40" y="40" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0f172a">SickBay System Architecture Architecture</text>
  <rect x="40" y="80" width="220" height="120" fill="#ffffff" stroke="#0f172a" stroke-width="2" rx="8"/>
  <text x="60" y="110" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">React 19 SPA Client</text>
  <text x="60" y="135" font-family="sans-serif" font-size="11" fill="#475569">• Bento Grid Dashboard</text>
  <text x="60" y="155" font-family="sans-serif" font-size="11" fill="#475569">• Recharts Trend Engine</text>
  <text x="60" y="175" font-family="sans-serif" font-size="11" fill="#475569">• jsPDF Medical Summary</text>
  
  <rect x="340" y="80" width="220" height="120" fill="#eff6ff" stroke="#1d4ed8" stroke-width="2" rx="8"/>
  <text x="360" y="110" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1d4ed8">Nginx Reverse Proxy</text>
  <text x="360" y="135" font-family="sans-serif" font-size="11" fill="#1e40af">• TLS Termination</text>
  <text x="360" y="155" font-family="sans-serif" font-size="11" fill="#1e40af">• Location /sickbay/</text>
  <text x="360" y="175" font-family="sans-serif" font-size="11" fill="#1e40af">• Sub-path strip rule</text>

  <rect x="640" y="80" width="220" height="120" fill="#ecfdf5" stroke="#047857" stroke-width="2" rx="8"/>
  <text x="660" y="110" font-family="sans-serif" font-size="14" font-weight="bold" fill="#047857">Express Backend (3046)</text>
  <text x="660" y="135" font-family="sans-serif" font-size="11" fill="#065f46">• tsx Runtime (server.ts)</text>
  <text x="660" y="155" font-family="sans-serif" font-size="11" fill="#065f46">• Dual Route Registration</text>
  <text x="660" y="175" font-family="sans-serif" font-size="11" fill="#065f46">• Health API (/api/health)</text>

  <line x1="260" y1="140" x2="340" y2="140" stroke="#0f172a" stroke-width="2"/>
  <line x1="560" y1="140" x2="640" y2="140" stroke="#0f172a" stroke-width="2"/>
</svg>
```

---

## 3. Specific Requirements

### 3.1 Functional Requirements
- **FR-01 (Triage Registration):** System shall capture patient encounter records with vitals (temperature, blood pressure, pulse rate), presenting symptoms, and disposition.
- **FR-02 (Vitals Analytics):** System shall render interactive historical vitals trends comparing patient parameters against normal health ranges.
- **FR-03 (Inventory Management):** System shall monitor pharmaceutical stock, batch numbers, and reorder warnings.
- **FR-04 (Referral Tracking):** System shall track student and staff referrals to external specialist hospitals.
- **FR-05 (PDF Export):** System shall generate printable medical encounter summaries in PDF format.

### 3.2 Security & Compliance
- **SR-01 (WMS Relay Custody):** All Google OAuth operations shall relay through WMS without holding client secrets server-side (Pattern 35).
- **SR-02 (Audit Logging):** All clinical intake, inventory modification, and auth events shall generate timestamped immutable audit logs.
