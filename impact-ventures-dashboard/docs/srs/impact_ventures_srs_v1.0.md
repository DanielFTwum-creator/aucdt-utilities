# Software Requirements Specification
## Impact Ventures Dashboard
**Version:** 1.0.0  
**Date:** April 24, 2026  
**Institution:** Techbridge University College (TUC)  
**Status:** As-Built

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the Impact Ventures Dashboard, a multivariate risk/reward analytics engine for evaluating AI venture portfolios against commercial liquidity and societal impact vectors.

### 1.2 Scope
The system provides: portfolio visualisation via scatter matrix, venture registry with multi-filter search, AI-generated strategic briefs (Gemini), side-by-side venture comparison, and a password-protected admin dashboard with audit logging.

### 1.3 Definitions
- **Tier**: Classification bracket (T1â€“T4) based on combined M+G scores
- **M-Score**: Monetisation / ROI capacity index (1â€“5)
- **G-Score**: Societal good / AI-for-Good index (1â€“5)
- **Brief**: AI-synthesised 4-point strategic analysis per venture

---

## 2. Overall Description

### 2.1 Product Perspective
Single-page React application. Static deployment via Nginx. Gemini API integration for AI brief generation.

### 2.2 User Classes
- **Portfolio Analyst**: Views matrix, filters registry, generates briefs
- **Administrator**: Accesses `#/admin` for audit logs and runtime diagnostics

---

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| FR-001 | Display scatter matrix (M vs G axes) with tier colour coding |
| FR-002 | Render venture registry with rank, tier, category, M/G scores |
| FR-003 | Full-text search across venture name and rationale |
| FR-004 | Filter by tier (ALL, T1â€“T4), category, M-range, G-range |
| FR-005 | Click venture card to open detail modal |
| FR-006 | Generate AI strategic brief per venture via Gemini API |
| FR-007 | Select up to 4 ventures for side-by-side comparison matrix |
| FR-008 | Password-protected `#/admin` hash route |
| FR-009 | Audit log persisted to localStorage (max 200 entries) |
| FR-010 | Admin diagnostics: localStorage test, portfolio count, API key check |
| FR-011 | Session persistence via sessionStorage for admin auth |
| FR-012 | ARIA labels, roles, and skip-to-content link on all interactive elements |
| FR-013 | Strategic observations sidebar with synthetic intelligence summaries |

---

## 4. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-001 | React 19.2.5 (pinned, no caret) |
| NFR-002 | Zero broken links (`href="#"` prohibited) |
| NFR-003 | 100% ARIA coverage on interactive elements |
| NFR-004 | Build output < 2MB gzipped |
| NFR-005 | Docker multi-stage: `node:24-alpine` builder + `nginx:alpine` runtime |
| NFR-006 | WCAG 2.1 AA compliance |

---

## 5. Architecture

- **Frontend:** React 19.2.5, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts
- **AI:** Google Gemini API (`gemini-3-flash-preview`) for brief generation
- **State:** React hooks (useState, useMemo, useEffect, useCallback)
- **Persistence:** localStorage (audit logs), sessionStorage (admin session)
- **Routing:** Hash-based (`#/admin` for admin route)

---

## 6. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0.0 | 2026-04-24 | TUC Dev Team | Initial as-built specification |
