# Software Requirements Specification (SRS)
## Project: Animator Agent Desktop
## Version: 3.0.0 (Production Hardened)
## Date: 2026-05-08

---

## 1. Introduction
### 1.1 Purpose
This document specifies the software requirements for the Animator Agent Desktop v3.0.0. It is intended for developers, project managers, and institutional auditors at Techbridge University College (TUC).

### 1.2 Scope
The Animator Agent Desktop is a high-fidelity animation studio designed for creating AI-driven agent videos. It features a multi-track timeline editor, centralized state management with undo/redo, and institutional-grade security features.

### 1.3 Definitions, Acronyms, and Abbreviations
- **TUC**: Techbridge University College
- **SRS**: Software Requirements Specification
- **ARIA**: Accessible Rich Internet Applications
- **E2E**: End-to-End Testing

## 2. Overall Description
### 2.1 Product Perspective
Animator Agent Desktop is a standalone web-based desktop application built with React 19 and Vite. It is part of the TUC "THE AGENT Book" project portfolio.

### 2.2 Product Functions
- **Timeline Editing**: Frame-accurate manipulation of animation tracks.
- **AI Agent Integration**: Natural language interface using Gemini 2.0 for generating animation instructions.
- **Undo/Redo System**: 50-step history for all project modifications.
- **Persistence**: Automatic project saving via local storage with History Stack.
- **Admin Hardening**: Secure diagnostic dashboard with audit logging.
- **Theming**: Support for Dark, Light, and High-Contrast modes.

### 2.3 Design and Implementation Constraints
- Must use **React 19.2.5**.
- Must use **HashRouter** for robust subdirectory deployment (e.g., `/animator`).
- Must adhere to **TUC Branding** (Ink, Gold, Cream).
- Must maintain **100% ARIA coverage**.

## 3. System Features
### 3.1 Centralized State Management
- **Requirement**: All UI components must consume state from a unified `AnimatorContext`.
- **Validation**: Verified by component refactoring.

### 3.2 AI Animation Assistant
- **Engine**: Google Gemini 2.0 Flash (`@google/generative-ai`).
- **Function**: Translates natural language into track-specific keyframe modifications.

### 3.3 Audit Logging
- **Requirement**: All administrative actions must be recorded in a persistent audit trail.
- **Validation**: Audit log viewer available in `#/admin/audit`.

## 4. External Interface Requirements
### 4.1 User Interfaces
- **Header**: Project metadata, playback controls, profile management.
- **Preview Panel**: High-performance character rendering (ClaudiaScene).
- **Timeline**: Multi-track scrubber with keyframe toggles.
- **Agent Panel**: Interactive prompt input with real-time processing feedback.

## 5. Non-Functional Requirements
### 5.1 Security
- Password-protected admin section (`#/admin`) with 5-attempt lockout.

### 5.2 Accessibility
- 100% WCAG 2.1 Level AA compliance and global keyboard shortcuts.

## 6. Architecture & Data Flow
### 6.1 System Architecture
![System Architecture](c:\Development\github\aucdt-utilities\animator-agent-desktop\docs\Architecture.svg)

### 6.2 Data Flow
![Data Flow](c:\Development\github\aucdt-utilities\animator-agent-desktop\docs\DataFlow.svg)

---
*End of SRS v3.0.0*
