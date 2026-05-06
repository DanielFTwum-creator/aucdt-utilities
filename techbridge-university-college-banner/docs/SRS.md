# IEEE Software Requirements Specification (SRS)
## Techbridge University College Banner Utility
**Version:** 3.0.0
**Status:** Foundation Phase
**Institution:** Techbridge University College (TUC)
**Date:** 2026-04-21
**Standard:** IEEE 29148-2018

---

### 1. Introduction
#### 1.1 Purpose
This document specifies the requirements for the Techbridge University College Banner Utility, a specialized component designed for institutional branding and programme broadcasting.

#### 1.2 Scope
The Banner Utility is a static React-based component used for high-visibility display of TUC's academic offerings. It conforms to the TUC Shared Branding Standards.

---

### 2. Overall Description
#### 2.1 Product Perspective
The banner is a standalone utility within the `aucdt-utilities` monorepo.

#### 2.2 Design Constraints
- **React version:** 19.2.4
- **Branding:** TUC Gold (`#C8A84B`), Ink (`#0F0C07`), Cream (`#F2EBD9`)
- **Typography:** Bebas Neue / Inter

---

### 3. Functional Requirements
- **FR-01**: Display primary institutional branding.
- **FR-02**: List core academic programmes.
- **FR-03**: Provide contact and admission details.
- **FR-04**: Support an `# /admin` route for content diagnostics.

---

### 4. Non-Functional Requirements
- **Performance**: Instant render via Vite.
- **Accessibility**: 100% ARIA label coverage.
- **Compliance**: Strict adherence to TUC branding palette.
