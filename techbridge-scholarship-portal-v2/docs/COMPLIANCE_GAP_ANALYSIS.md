# AUCDT Utilities: Comprehensive Compliance Gap Analysis
**Date:** March 6, 2026
**Reference Standard:** Techbridge Scholarship Portal v2.0 (Blueprint)

## 1. Executive Summary
An audit of the `../aucdt-utilities` ecosystem reveals significant architectural and linguistic drift. While the projects are functional, they do not adhere to the "Notarial Luxury" standards or the strict technical constraints (React 19.2.4, relative pathing, UK English) established in the master refresh.

## 2. Compliance Scorecard (Sampled Projects)

| Project | React 19.2.4 | UK English | Relative Paths | Admin Isolation | UX (6R) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Scholarship Portal (v2.0)** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Academic Performance App** | ❌ (19.1.0) | ❌ (US) | ✅ (./) | ❌ (Inline) | ❌ (Indigo) |
| **Lecturer Assessment Portal** | ❌ (Legacy) | ❌ (US) | ❌ (/) | ❌ (None) | ❌ (Generic) |
| **Techbridge Dashboard** | ❌ (Legacy) | ❌ (US) | ❌ (/) | ❌ (None) | ❌ (Generic) |

## 3. Identified Gaps & Corrective Actions

### 3.1 Technical Gaps
- **Gap:** Inconsistent React versions (18.x - 19.1.x).
- **Action:** Forced migration to **React 19.2.4** with strict peer dependency resolution.
- **Gap:** Pathing fragility in deployment.
- **Action:** Update all `vite.config.ts` files to `base: './'`.

### 3.2 Linguistic Gaps
- **Gap:** Widespread use of US English (`Program`, `Color`, `Analyze`).
- **Action:** Execute global regex replacement for UK British equivalents (`Programme`, `Colour`, `Analyse`).

### 3.3 Security & Diagnostic Gaps
- **Gap:** Diagnostic tools (State Injectors, Audit Logs) are often visible to end-users or embedded in main components.
- **Action:** Implement the **Admin Isolation Pattern** (Hash-based `#/admin` routes with password gate).

### 3.4 UI/UX (6R) Gaps
- **Gap:** "Flat" UI design with generic color palettes.
- **Action:** Transition to the **"Warm Prestige"** palette:
  - Gold (#C8A84B)
  - Cream (#F2EBD9)
  - Ink (#0F0C07)
  - Fonts: `Playfair Display` & `Cormorant Garamond`.

## 4. Next Steps: Systematic Remediation
1. **Phase 1:** Apply environment fixes (React version + Relative paths).
2. **Phase 2:** Execute linguistic migration (UK English).
3. **Phase 3:** Structural refactor (Admin Isolation).
4. **Phase 4:** Aesthetic skinning (6R Methodology).

---
**STATUS: GAP ANALYSIS COMPLETE - REMEDIATION REQUIRED**
