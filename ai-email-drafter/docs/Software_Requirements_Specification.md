# Software Requirements Specification
## Gmail Email Sender Application

**Version 2.0 (Final)**  
**Date:** October 30, 2025  
**Prepared by:** Development Team  
**Status:** Final Release

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete and precise description of the requirements for the Gmail Email Sender Application version 2.0. This document serves as the primary reference for the system's capabilities, constraints, and intended behavior throughout the development lifecycle.

### 1.2 Scope

The Gmail Email Sender Application (GESA) is a standalone web application that enables users to compose, format, and send emails directly from their Gmail accounts through an intuitive, dedicated interface, with AI-powered draft generation via the Gemini API.

**What the software product will do:**
- Authenticate users securely through Gmail OAuth 2.0 protocol.
- Provide a dedicated interface for email composition with rich formatting options.
- Utilize the Gemini API to generate professional email drafts from user notes.
- Support multiple recipient types (TO, CC, BCC) with validation.
- Enable image file attachment management.
- Provide a secure, password-protected Admin Panel for configuration.
- Maintain comprehensive audit logs for administrative actions.
- Offer user-selectable themes (Light, Dark, High-Contrast) for improved usability.
- Ensure full accessibility compliance (WCAG 2.1 AA) for keyboard and screen reader users.
- Include a built-in, simulated Playwright self-testing framework for quality assurance.

**What the software product will NOT do:**
- Receive or download incoming emails (inbox functionality).
- Provide full email client features (folders, labels, filters).
- Sync with Gmail's web interface beyond sending operations.
- Support email protocols other than those used by the Gemini API for sending.

---
<!-- Sections 1.3 to 2.6 are omitted for brevity but are assumed to be the same as the initial SRS -->
---

## 3. Specific Requirements

This section contains all the detailed requirements for the Gmail Email Sender Application, including features added in all project phases.

<!-- Sections 3.1.1 through 3.1.12 are omitted for brevity but are assumed to be the same as the initial SRS -->

#### 3.1.13 Admin Panel & Security (FR-ADMIN)

**FR-ADMIN-001**: Secure Admin Panel Access  
**Priority**: Critical  
**Description**: The system shall provide a secure, password-protected administration panel for managing application settings. Access shall be restricted to authorized administrators.  
**Authentication**: A single, configurable password shared among administrators.
**Access**: Via a specific menu item or keyboard shortcut (e.g., `Ctrl+Alt+A`).

**FR-ADMIN-002**: Password Management  
**Priority**: Critical  
**Description**: The system shall allow administrators to set and change the admin panel password securely. The initial setup will require password creation. Passwords must be securely hashed and stored.

**FR-ADMIN-003**: Theme Management Control  
**Priority**: Medium  
**Description**: The admin panel shall allow administrators to enable/disable user-selectable themes (Light, Dark, High-Contrast) and enforce a default theme for all users.

#### 3.1.14 Audit Logging (FR-AUDIT)

**FR-AUDIT-001**: Log Admin Actions  
**Priority**: High  
**Description**: The system shall automatically log all critical administrative actions to an audit trail for security and accountability purposes.
**Logged Actions**: Successful/failed admin logins, password changes, theme configuration changes, log exports.

**FR-AUDIT-002**: View and Export Logs  
**Priority**: Medium  
**Description**: The admin panel shall provide a user interface to view, search, and filter audit logs. Administrators must be able to export the logs in a standard format (e.g., CSV).

#### 3.1.15 Self-Testing Framework (FR-TEST)

**FR-TEST-001**: Interactive Test Tab  
**Priority**: Medium  
**Description**: The application shall include a "Playwright Self-Test" tab in the frontend, allowing users or administrators to initiate a suite of automated end-to-end tests.

**FR-TEST-002**: Real-Time Test Results  
**Priority**: Medium  
**Description**: The self-test tab shall display test results in real-time, indicating which tests are pending, running, passed, or failed. For failed tests, the system shall display an error message and a simulated screenshot of the UI at the time of failure.

---

## 4. External Interface Requirements

### 4.1 User Interfaces

<!-- Other UI sections omitted for brevity -->

**UI-011**: Color Scheme and Theming  
**Description**: The application will support multiple user-selectable and admin-configurable themes.

**Light Theme (Default)**:
- Background: `#FFFFFF` / `bg-gray-100`
- Text: `#000000` / `text-gray-900`
- Accent: `#4285F4` (Google Blue)

**Dark Theme**:
- Background: `#1E1E1E` / `bg-gray-900`
- Text: `#FFFFFF` / `text-gray-100`
- Accent: `#8AB4F8` (Light Blue)

**High-Contrast Accessibility Mode**:
- Background: High-contrast black or white.
- Text: High-contrast white or black.
- Focus indicators will be highly visible (e.g., thick yellow or blue outlines).

**UI-012**: Accessibility Features  
**Description**: The application shall be fully compliant with WCAG 2.1 Level AA standards.
- **Screen Reader Support**: All interactive elements will have proper ARIA labels, roles, and states (e.g., `aria-label`, `role="button"`). Dynamic content updates will be announced.
- **Keyboard Navigation**: Full keyboard operability. All functionality can be reached and activated using `Tab`, `Shift+Tab`, `Enter`, and `Space`. Logical focus order is maintained.
- **Focus Indicators**: All focused elements will have a clear and visible focus outline.

<!-- Other sections omitted for brevity -->

---

## 9. Appendices

### Appendix B: Analysis Models

#### B.2 System Architecture Diagram

This diagram illustrates the high-level system architecture, showing the interaction between the user, the frontend application, the Gemini API, and the local file system.

<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="14">
    <style>
        .box { fill: #f0f4f8; stroke: #4a5568; stroke-width: 1.5; rx: 8; ry: 8; }
        .actor { fill: #e2e8f0; stroke: #2d3748; stroke-width: 1.5; }
        .api { fill: #dbeafe; stroke: #1e40af; stroke-width: 1.5; rx: 8; ry: 8; }
        .storage { fill: #e0f2f1; stroke: #00796b; stroke-width: 1.5; rx: 8; ry: 8; }
        .arrow { stroke: #2d3748; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
        .label { fill: #1a202c; text-anchor: middle; }
        .desc { font-size: 11px; fill: #4a5568; text-anchor: middle; }
    </style>
    <defs>
        <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2d3748" />
        </marker>
    </defs>
    
    <title>System Architecture Diagram</title>

    <!-- Actor -->
    <rect x="20" y="160" width="100" height="60" class="actor" />
    <text x="70" y="195" class="label">User</text>

    <!-- Main App -->
    <rect x="180" y="100" width="240" height="180" class="box" />
    <text x="300" y="130" class="label" font-weight="bold">AI Email Drafter</text>
    <text x="300" y="150" class="desc">(React Frontend App in Browser)</text>
    <text x="300" y="190" class="label">UI Composition</text>
    <text x="300" y="210" class="label">State Management</text>
    <text x="300" y="230" class="label">API Service Layer</text>

    <!-- Gemini API -->
    <rect x="480" y="40" width="100" height="60" class="api" />
    <text x="530" y="75" class="label">Gemini API</text>

    <!-- Local Storage -->
    <rect x="480" y="280" width="100" height="60" class="storage" />
    <text x="530" y="315" class="label">Local File System</text>

    <!-- Arrows -->
    <path class="arrow" d="M 120 190 h 60" />
    <text x="150" y="185" class="desc">Interacts</text>

    <path class="arrow" d="M 420 170 q 30 -50 60 -100" />
    <text x="470" y="125" class="desc">API Request (Prompt, Images)</text>
    <path class="arrow" d="M 480 80 q -30 50 -60 100" />
    <text x="450" y="155" class="desc">API Response (Generated Draft)</text>
    
    <path class="arrow" d="M 420 230 q 30 30 60 50" />
    <text x="480" y="255" class="desc">Reads Image for Attachment</text>

</svg>

#### B.3 Database Architecture Diagram

This diagram outlines the local database schema used for storing application data such as accounts, drafts, contacts, and templates.

<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
    <style>
        .table { fill: #fffff0; stroke: #a0522d; stroke-width: 1.5; }
        .header { fill: #f5deb3; font-weight: bold; text-anchor: middle; }
        .col { text-anchor: start; }
        .pk { font-weight: bold; }
        .fk { font-style: italic; }
        .relation { stroke: #666; stroke-width: 1.5; fill: none; marker-end: url(#crow); marker-start: url(#one); }
        .label { fill: #333; text-anchor: middle; font-size: 10px; }
    </style>
    <defs>
        <marker id="crow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 L 2 5 Z" fill="#666" />
            <path d="M 0 5 L 10 5" stroke="#666" stroke-width="1"/>
        </marker>
        <marker id="one" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
            <path d="M 0 0 L 0 10" stroke="#666" stroke-width="2"/>
        </marker>
    </defs>

    <title>Database Architecture Diagram</title>

    <!-- Accounts Table -->
    <g id="accounts">
        <rect class="table" x="250" y="20" width="200" height="120" rx="5"/>
        <rect class="header" x="250" y="20" width="200" height="25"/>
        <text x="350" y="38">accounts</text>
        <text class="col pk" x="260" y="60">account_id (PK)</text>
        <text class="col" x="260" y="75">email_address</text>
        <text class="col" x="260" y="90">display_name</text>
        <text class="col" x="260" y="105">token_encrypted</text>
        <text class="col" x="260" y="120">is_default</text>
    </g>

    <!-- Drafts Table -->
    <g id="drafts">
        <rect class="table" x="20" y="200" width="200" height="140" rx="5"/>
        <rect class="header" x="20" y="200" width="200" height="25"/>
        <text x="120" y="218">drafts</text>
        <text class="col pk" x="30" y="240">draft_id (PK)</text>
        <text class="col fk" x="30" y="255">account_id (FK)</text>
        <text class="col" x="30" y="270">subject</text>
        <text class="col" x="30" y="285">body_html</text>
        <text class="col" x="30" y="300">recipients_to</text>
        <text class="col" x="30" y="315">attachments_json</text>
    </g>

    <!-- Sent History Table -->
    <g id="sent_history">
        <rect class="table" x="250" y="200" width="200" height="140" rx="5"/>
        <rect class="header" x="250" y="200" width="200" height="25"/>
        <text x="350" y="218">sent_history</text>
        <text class="col pk" x="260" y="240">message_id (PK)</text>
        <text class="col fk" x="260" y="255">account_id (FK)</text>
        <text class="col" x="260" y="270">subject</text>
        <text class="col" x="260" y="285">sent_at</text>
        <text class="col" x="260" y="300">status</text>
        <text class="col" x="260" y="315">error_message</text>
    </g>

    <!-- Contacts Table -->
    <g id="contacts">
        <rect class="table" x="480" y="200" width="200" height="120" rx="5"/>
        <rect class="header" x="480" y="200" width="200" height="25"/>
        <text x="580" y="218">contacts</text>
        <text class="col pk" x="490" y="240">contact_id (PK)</text>
        <text class="col" x="490" y="255">email</text>
        <text class="col" x="490" y="270">display_name</text>
        <text class="col" x="490" y="285">frequency_count</text>
        <text class="col" x="490" y="300">last_used</text>
    </g>
    
    <!-- Templates Table -->
    <g id="templates">
        <rect class="table" x="150" y="420" width="200" height="120" rx="5"/>
        <rect class="header" x="150" y="420" width="200" height="25"/>
        <text x="250" y="438">templates</text>
        <text class="col pk" x="160" y="460">template_id (PK)</text>
        <text class="col" x="160" y="475">template_name</text>
        <text class="col" x="160" y="490">subject</text>
        <text class="col" x="160" y="505">body_html</text>
        <text class="col" x="160" y="520">category</text>
    </g>

    <!-- Relationships -->
    <path class="relation" d="M 300 140 v 60" />
    <text class="label" x="280" y="180">has many</text>
    <path class="relation" d="M 350 140 v 60" />
    <text class="label" x="370" y="180">has many</text>
    <path class="relation" d="M 400 140 v 60" />
    <text class="label" x="420" y="180">has many</text>

</svg>

---
<!-- Remaining appendices omitted for brevity -->