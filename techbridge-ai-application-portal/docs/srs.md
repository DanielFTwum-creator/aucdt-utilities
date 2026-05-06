# Software Requirements Specification: Techbridge AI Application Portal

**Version 5.0 (Final)**

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for the AUCDT AI Application Portal. It is intended for project stakeholders, developers, and designers to provide a complete understanding of the system.

### 1.2 Scope
The application is a client-side, web-based portal that serves as a centralized directory for 70+ AI-powered tools. It enables users to discover, search, and filter applications. It also includes a secure administrative section for system management, enhanced audit logging, and a self-testing framework.

### 1.3 Definitions
- **Techbridge**: Techbridge University College
- **SPA**: Single-Page Application
- **SRS**: Software Requirements Specification
- **ARIA**: Accessible Rich Internet Applications
- **SVG**: Scalable Vector Graphics

### 1.4 Overview
This SRS details the product perspective, functions, user characteristics, and specific requirements, covering functional, UI, performance, security, and accessibility aspects.

## 2. Overall Description

### 2.1 Product Perspective
The product is a standalone SPA built with React, TypeScript, and Tailwind CSS. It operates entirely on the client-side, using the browser's Local Storage for state persistence (theme preference, audit logs).

### 2.2 Product Functions
- Display a responsive, paginated grid of AI application cards.
- Provide real-time, text-based search functionality with interactive suggestions.
- Provide one-click category-based filtering.
- Provide user-selectable themes (Light, Dark, High-Contrast).
- Offer a secure, password-protected administrative dashboard via a modal login.
- Log key administrative and user actions for auditing purposes.
- Provide an integrated self-testing framework with screenshot capture for diagnostics.

### 2.3 User Characteristics
- **General Users**: Students, faculty, and researchers of Techbridge with standard web browsing proficiency.
- **Administrators**: Technical staff responsible for maintaining and verifying the application's integrity.

### 2.4 Constraints
- The application is entirely client-side; it has no backend server.
- The admin password and application list are statically defined in the source code.
- Requires a modern web browser with JavaScript and Local Storage enabled.

### 2.5 Assumptions
- Users have continuous internet connectivity for the initial load and for accessing external application URLs and images.

## 3. Specific Requirements

### 3.1 Functional Requirements (General User)
- **FR-1: Search & Suggestions**: 
    - `FR-1.1`: The system must provide a case-insensitive, real-time search input that filters applications by title and description.
    - `FR-1.2`: As a user types (minimum 2 characters), a dropdown shall appear with up to 5 relevant suggestions.
    - `FR-1.3`: A loading indicator shall be displayed within the dropdown while suggestions are being computed.
    - `FR-1.4`: Clicking a suggestion shall populate the search input with the selected term.
- **FR-2: Category Filters**: The system must provide filter buttons for each application category and an "All Apps" option, displaying an item count for each.
- **FR-3: Application Grid**: The system shall display the filtered applications in a responsive grid. A "No applications found" message must be shown if filters yield no results.
- **FR-4: Pagination**: 
    - `FR-4.1`: The application grid shall be paginated, displaying a maximum of 12 applications per page.
    - `FR-4.2`: Navigation controls ("Previous", "Next", and a "Page X of Y" indicator) shall be present to browse pages.
    - `FR-4.3`: When a search or category filter is applied or changed, the view must automatically reset to the first page of the results.
- **FR-5: Application Card**: Each card shall display an image preview, category icon, title, badge, and a truncated description.
- **FR-6: Card Interactivity**: On hover, a card shall animate, its full description shall become visible, and a tooltip with details shall appear.
- **FR-7: Image Loading & Fallback**:
    - `FR-7.1`: While a pre-defined `imageUrl` is loading, a shimmering skeleton loader shall be displayed.
    - `FR-7.2`: If a pre-defined image URL fails to load or is not provided, the system shall display a locally generated SVG placeholder, themed to the application's category.
- **FR-8: Theming**: Users shall be able to select and apply one of three themes: Light, Dark, or High-Contrast. The preference must be saved to Local Storage.

### 3.2 Functional Requirements (Administrator)
- **FR-9: Admin Access**: An "Admin" link in the header shall open a modal login dialog.
- **FR-10: Secure Authentication**: Access to the admin dashboard shall be granted only upon entering the correct, pre-configured password.
- **FR-11: Enhanced Audit Logging**: The system shall automatically record the following events to Local Storage with a timestamp:
    - `FR-11.1`: Admin access attempts, successful/failed logins, and logouts.
    - `FR-11.2`: Initiation and completion of the self-test suite.
    - `FR-11.3`: User theme changes.
    - `FR-11.4`: User search queries (debounced to avoid excessive logging).
    - `FR-11.5`: User category filter selections.
- **FR-12: Audit Log Viewer**: The admin dashboard shall display all audit logs in a reverse chronological list.
- **FR-13: Self-Testing Framework**: The admin dashboard shall provide an interface to run an automated, in-browser test suite. A loading spinner shall be displayed during execution.
- **FR-14: Test Diagnostics**: For any failed test, the system must display an error message and a full-page screenshot of the application state.

### 3.3 User Interface & Accessibility Requirements
- **UI-1: Responsiveness**: The UI must be fully responsive across all standard device viewports.
- **A11Y-1: Keyboard Navigation**: All interactive elements must be navigable and operable using only a keyboard.
- **A11Y-2: Skip Link**: A "Skip to Main Content" link must be the first focusable element.
- **A11Y-3: ARIA**: The system shall use appropriate ARIA attributes for dynamic regions, modals, and controls.
- **A11Y-4: High Contrast**: The High-Contrast theme must ensure text-to-background contrast ratios meet WCAG standards.

## 4. System Architecture

The application is a client-side Single-Page Application (SPA). All logic, data, and rendering occur within the user's web browser. Local Storage is used for persistence of user preferences and administrative data.

<svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif" font-size="14px">
    <title>Techbridge AI Portal System Architecture</title>
    <style>
        .box { fill: #f0f4f8; stroke: #4a5568; stroke-width: 1.5; rx: 8; }
        .box-title { font-weight: bold; font-size: 16px; fill: #2d3748; }
        .component { fill: #ffffff; stroke: #cbd5e0; stroke-width: 1; rx: 4; }
        .component-text { fill: #4a5568; }
        .arrow { stroke: #718096; stroke-width: 2; marker-end: url(#arrowhead); }
        .arrow-label { fill: #718096; font-size: 12px; font-style: italic; }
        .user-icon { font-size: 48px; }
    </style>
    <defs>
        <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#718096" />
        </marker>
    </defs>
    <g transform="translate(50, 200)">
        <text text-anchor="middle" y="-10" class="box-title">User</text>
        <text text-anchor="middle" y="30" class="user-icon">👤</text>
    </g>
    <rect x="200" y="80" width="200" height="340" class="box"/>
    <text x="300" y="110" text-anchor="middle" class="box-title">Web Browser</text>
    <rect x="220" y="140" width="160" height="260" class="component"/>
    <text x="300" y="165" text-anchor="middle" class="component-text" font-weight="bold">React SPA</text>
    <line x1="230" y1="175" x2="370" y2="175" stroke="#cbd5e0"/>
    <text x="230" y="200" class="component-text">• App.tsx (State)</text>
    <text x="230" y="225" class="component-text">• Header</text>
    <text x="230" y="250" class="component-text">• SearchBar</text>
    <text x="230" y="275" class="component-text">• CategoryFilters</text>
    <text x="230" y="300" class="component-text">• AppGrid</text>
    <text x="230" y="325" class="component-text">• AdminDashboard</text>
    <text x="230" y="350" class="component-text">• selfTests.ts</text>
    <text x="230" y="375" class="component-text">• ...other components</text>
    <g transform="translate(520, 190)">
      <rect x="0" y="0" width="220" height="120" class="box"/>
      <text x="110" y="30" text-anchor="middle" class="box-title">Browser Local Storage</text>
      <path d="M 20 50 H 200 M 20 85 H 200" stroke="#cbd5e0" />
      <text x="30" y="70" class="component-text">🔑 techbridge_theme</text>
      <text x="30" y="105" class="component-text">🔑 techbridge_auditLog</text>
    </g>
    <path class="arrow" d="M 120 225 H 200" />
    <text x="135" y="215" class="arrow-label">Interacts</text>
    <path class="arrow" d="M 400 250 C 450 250, 470 250, 520 250" />
    <text x="410" y="240" class="arrow-label">Reads/Writes</text>
</svg>

## 5. Data Architecture

The application utilizes the browser's key-value `localStorage` store as its database for persisting non-critical data. All other application data (the list of AI tools) is static and compiled into the application at build time.

<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif" font-size="14px">
    <title>Techbridge AI Portal Data Architecture (Local Storage)</title>
    <style>
        .title { font-weight: bold; font-size: 20px; fill: #2d3748; }
        .table { fill: #ffffff; stroke: #4a5568; stroke-width: 1.5; }
        .table-header { fill: #edf2f7; stroke: #4a5568; font-weight: bold; }
        .table-text { fill: #4a5568; }
        .col-type { fill: #718096; font-style: italic; }
        .note { font-size: 11px; fill: #718096; }
    </style>
    <text x="400" y="40" text-anchor="middle" class="title">Local Storage Data Architecture (Key-Value Store)</text>
    <g transform="translate(50, 100)">
        <rect class="table" x="0" y="0" width="300" height="120" rx="5"/>
        <rect class="table-header" x="0" y="0" width="300" height="40" rx="5"/>
        <text class="table-text" x="150" y="25" text-anchor="middle" font-weight="bold">techbridge_theme</text>
        <line x1="1" y1="80" x2="299" y2="80" stroke="#cbd5e0"/>
        <text class="table-text" x="15" y="65">key</text>
        <text class="col-type" x="290" y="65" text-anchor="end">string</text>
        <text class="table-text" x="15" y="105" font-style="italic">Example: 'dark'</text>
    </g>
    <g transform="translate(450, 100)">
        <rect class="table" x="0" y="0" width="300" height="200" rx="5"/>
        <rect class="table-header" x="0" y="0" width="300" height="40" rx="5"/>
        <text class="table-text" x="150" y="25" text-anchor="middle" font-weight="bold">techbridge_auditLog</text>
        <text class="table-text" x="150" y="55" text-anchor="middle">(Stored as a JSON string)</text>
        <line x1="1" y1="80" x2="299" y2="80" stroke="#cbd5e0"/>
        <text class="table-text" x="15" y="105">timestamp</text>
        <text class="col-type" x="290" y="105" text-anchor="end">ISOString</text>
        <line x1="1" y1="120" x2="299" y2="120" stroke="#cbd5e0"/>
        <text class="table-text" x="15" y="145">action</text>
        <text class="col-type" x="290" y="145" text-anchor="end">string</text>
        <line x1="1" y1="160" x2="299" y2="160" stroke="#cbd5e0"/>
        <text class="note" x="150" y="180" text-anchor="middle">Stores admin and user interaction events</text>
    </g>
</svg>