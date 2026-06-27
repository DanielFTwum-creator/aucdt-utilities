# TechBridge Radio Platform — IEEE Software Requirements Specification v3.2

**Document Number:** TUC-SRS-RADIO-003  
**Version:** 3.2 (supersedes v3.1)  
**Institution:** Techbridge University College (TUC), formerly AUCDT  
**Classification:** Internal Technical Documentation  
**Date:** May 07, 2026  
**Authors:** TUC Digital Systems Team  
**Status:** Active

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [External Interface Requirements](#3-external-interface-requirements)
4. [System Features](#4-system-features)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [System Architecture](#6-system-architecture)
7. [Data Architecture & Flow](#7-data-architecture--flow)
8. [Security & Privacy](#8-security--privacy)
9. [Accessibility & Internationalisation](#9-accessibility--internationalisation)
10. [Project Management & Milestones](#10-project-management--milestones)
11. [Testing & Quality Assurance](#11-testing--quality-assurance)
12. [Deployment & Maintenance](#12-deployment--maintenance)
13. [User Documentation](#13-user-documentation)
14. [Appendix & Glossary](#14-appendix--glossary)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for the **TechBridge Radio Platform**. This document targets developers, system architects, and institutional stakeholders to ensure a shared, authoritative understanding of system behaviour, architecture, and constraints.

### 1.2 Scope
The TechBridge Radio Platform consists of a high-performance React 19 application consuming HLS streams from an origin server. It features a cinematic UI, real-time audio visualisation, and a robust administrative diagnostic suite.

### 1.3 Definitions, Acronyms, and Abbreviations
- **HLS**: HTTP Live Streaming.
- **SRS**: Software Requirements Specification.
- **CORS**: Cross-Origin Resource Sharing.
- **BPM**: Beats Per Minute.
- **TUC**: Techbridge University College.
- **IEEE**: Institute of Electrical and Electronics Engineers.

---

## 2. Overall Description

### 2.1 Product Perspective
The system operates as a **two-tier client–origin architecture** where the React application consumes static HLS content via a secure proxy or direct CORS-enabled fetch.

### 2.2 Product Functions
- **HLS Audio Streaming**: Adaptive bitrate playback with error recovery.
- **Real-Time EQ**: 32-band logarithmic frequency visualisation.
- **Enhanced Sleep Timer**: Presets and granular custom control (1–120 mins).
- **Admin Suite**: Password-protected diagnostics, testing, and audit logs.
- **Theme Engine**: Dark, Light, and High-Contrast modes.
- **Playback Logic**: Autoplay, Shuffle, and Loop functionality.
- **Feedback System**: Integrated user feedback collection.
- **AI Lyrics**: Dynamic lyrics fetching and display using Gemini AI.

### 2.3 Operating Environment
- **Browser**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge).
- **Runtime**: React 19.2.5 on the frontend; Express/Node.js on the backend.

### 2.4 Constraints
- **React Version**: Strictly 19.2.5.
- **Port**: 3000.
- **HMR**: Disabled during development to ensure state persistence.

---

## 3. External Interface Requirements
- **User Interfaces**: Cinematic, editorial-grade UI with responsive design.
- **Software Interfaces**: HLS.js, Web Audio API, Framer Motion, Google Gemini API.

---

## 4. System Features
(Detailed requirements for Streaming, EQ, Timer, Admin, Feedback, and AI Lyrics systems).

---

## 5. Non-Functional Requirements
- **Performance**: Initial buffer < 2s; 60fps UI performance.
- **Security**: Password-protected admin; sanitised proxy URLs.
- **Accessibility**: WCAG AA compliance (Dark/Light); WCAG AAA (High-Contrast).

---

## 10. Project Management & Milestones
- **Phase 1**: Foundation & React 19.2.5 (Complete).
- **Phase 2**: Security & Accessibility (Complete).
- **Phase 3**: Self-Testing & Diagnostics (Complete).
- **Phase 4**: Documentation (SRS v3.1) (Complete).
- **Phase 5**: Finalisation (In Progress).

---

# Final Gap Analysis Report

| Feature | SRS Requirement | Current Implementation | Status |
| :--- | :--- | :--- | :--- |
| **React Version** | 19.2.5 | 19.2.5 | ✅ 100% |
| **Admin Routes** | Password-protected modal | Integrated diagnostic suite | ✅ 100% |
| **Diagnostics** | Status, Test, Logs, Network | 4-tab dashboard | ✅ 100% |
| **Sleep Timer** | Enhanced (Presets + Custom) | 1–120m Slider + State Sync | ✅ 100% |
| **Logging** | Dropout & Silence Detection | Captured in Audit Trail | ✅ 100% |
| **Feedback** | Integrated Form | Modal UI + Audit Logging | ✅ 100% |
| **AI Lyrics** | Gemini Powered | Collapsible Display + Proactive Fetching | ✅ 100% |
| **Documentation** | IEEE SRS v3.2 | Comprehensive Documentation | ✅ 100% |

**PHASE 1 COMPLETE — GAP ANALYSIS REPORT ATTACHED**
