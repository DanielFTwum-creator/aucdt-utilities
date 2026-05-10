# Software Requirements Specification
## LuxThumb Designer — AI-Powered Thumbnail Generation

**Document ID:** TUC-ICT-SRS-2026-LUXTHUMB-001  
**Version:** 1.0  
**Date:** 9 May 2026  
**Status:** Approved  
**Organisation:** Techbridge University College (TUC)  
**Author:** Daniel Frempong Twum  
**Prepared by:** ICT Department  

---

## 1. Introduction

### 1.1 Purpose
This specification defines the requirements for LuxThumb Designer, a web-based AI-powered thumbnail design tool that generates professional, cinematic visual assets and image prompts for social media, advertising, and editorial content.

### 1.2 Scope
LuxThumb Designer encompasses:
- A React-based single-page application (SPA) for UI design and configuration
- Integration with Google Gemini AI API for prompt generation
- Export functionality (PNG, PDF, JPG, JSON configuration)
- Design history and persistence via IndexedDB
- Admin dashboard with audit logging
- Accessibility controls (theme switcher, font size adjuster, reduced motion support)
- Responsive design supporting desktop and tablet viewports

Out of scope:
- Mobile app native implementations (web-only)
- Direct AI image generation (prompt generation only)
- Multi-user collaboration or team features
- Custom AI model training

### 1.3 Document Conventions
- **SHALL** = mandatory requirement
- **SHOULD** = recommended, not mandatory
- **MAY** = optional
- Aspect ratios: `4:5` (Social Feed), `9:16` (Story/Reel), `1:1` (Square), `16:9` (Web/Video)
- Brand colours: Gold (`#C9A84C`), Deep Black (`#050505`), White (`#F5F5F5`)

---

## 2. Overall Description

### 2.1 Product Perspective
LuxThumb Designer is part of the Techbridge University College ICT platform, operated as a cloud-hosted SPA at `luxthumb.techbridge.edu.gh`. It integrates with Google Gemini AI (via `@google/genai` SDK) and relies on client-side rendering with IndexedDB for persistence.

### 2.2 Product Features

#### 2.2.1 Design Configuration Module
Users input brand details and visual parameters:
- Brand name and logo (image upload or description)
- Headline (two-line structure: white primary, gold secondary)
- Subheadline and feature list (icons with optional images)
- Background scene description and custom image upload
- Foreground subject description and optional image
- Tagline bar and aspect ratio selection

#### 2.2.2 AI Prompt Generation
Using Gemini AI, the app generates:
- **Midjourney prompt** — optimised for Midjourney v6 image generation
- **Imagen 3 / DALL-E prompt** — alternative image prompt format
- **Canva creative brief** — human-readable design brief
- **Typography specification** — font recommendations and hierarchy
- **Colour palette** — hex codes for background, gold primary, gold accent, white text
- **Animated extension** — Sora/Veo video loop extension prompt

#### 2.2.3 Export & Download
Users can export in multiple formats:
- PNG (2x scale, transparent background handling)
- JPG (90% quality, opaque background)
- PDF (single page, orientation auto-detected)
- JSON configuration (all design parameters)

#### 2.2.4 Design History & Persistence
- Auto-save design state to IndexedDB (`luxthumb_design_data`)
- Manual design snapshots (`luxthumb_saved_designs`) with restore capability
- Design deletion from history

#### 2.2.5 Admin Panel
- Password-protected access (credentials: `admin123`)
- Audit dashboard displaying:
  - Total audit log entries
  - Design saves, exports, deletions (aggregated counts)
  - Last activity timestamp
  - Expandable log entries with full details (timestamp, action, user agent, ID)
- Audit log export (JSON, CSV)
- Clear audit logs (with confirmation)

#### 2.2.6 Accessibility & Theming
- **Theme switcher:** Dark (default), Light, High-Contrast
- **Font size adjuster:** Small (85%), Normal (100%), Large (115%), Extra Large (130%)
- **Reduced motion toggle:** Disables animations for motion-sensitive users
- **Persistence:** Settings stored in localStorage, applied on page load
- **WCAG AA compliance:** Focus indicators, colour contrast, keyboard navigation

---

## 3. Functional Requirements

### 3.1 Configuration Inputs

| Input | Type | Required | Constraints |
|---|---|---|---|
| Brand Name | Text | Yes | Max 50 chars |
| Logo Description | Text | No | Max 100 chars |
| Logo Image | File | No | PNG, JPG, GIF; max 5MB |
| Headline L1 | Text | Yes | Max 20 chars |
| Headline L2 | Text | Yes | Max 20 chars |
| Subheadline | Text | No | Max 50 chars |
| Background Scene | Text | Yes | Max 300 chars |
| Background Image | File | No | PNG, JPG; max 10MB |
| Foreground Subject | Text | Yes | Max 300 chars (detailed description required) |
| Subject Image | File | No | PNG, JPG; max 10MB |
| Feature Entries | Text array | No | 3 entries, max 30 chars each |
| Feature Images | File array | No | 3 optional PNG/JPG; max 2MB each |
| Tagline Bar | Text | No | Max 100 chars |
| Aspect Ratio | Selection | Yes | One of: `4:5`, `9:16`, `1:1`, `16:9` |

### 3.2 AI Prompt Generation

**Requirement 3.2.1 — System Instruction Adherence**
The Gemini AI SHALL use the system instruction defining:
- Design philosophy: Cinematic dark luxury
- Mood: Authoritative, aspirational, high-converting
- Colour language: Deep blacks + gold + bright white
- Composition: Portrait poster with bold headlines, background scene, right-aligned subject, icon list (lower-left), tagline bar (bottom)
- Lighting: Sharp rim lighting, Chiaroscuro/Rembrandt key lighting, golden-hour accents on subject

**Requirement 3.2.2 — Output Format**
Gemini SHALL return a JSON object with structure:
```json
{
  "midjourney": "prompt string",
  "imagen3": "prompt string",
  "canvaBrief": "brief string",
  "typographySpec": { "headline": "...", "subheadline": "...", "icons": "...", "tagline": "..." },
  "colorPalette": { "background": "#...", "goldPrimary": "#...", "goldAccent": "#...", "whiteText": "#..." },
  "animatedExtension": "prompt string"
}
```

**Requirement 3.2.3 — Error Handling**
If Gemini API fails:
- Display user-friendly error: "Failed to generate prompts. Check your API key."
- Log error to console
- Do not crash the application
- Remain on the configuration screen

### 3.3 Export Functions

**Requirement 3.3.1 — PNG Export**
- Render thumbnail canvas at 2x scale
- Remove border/shadow before export (visual artifacts prevention)
- Restore border/shadow after export
- Filename: `{BrandName}_thumbnail.png` (sanitised)
- Failure → user alert with error message

**Requirement 3.3.2 — PDF Export**
- Detect orientation from aspect ratio (portrait for 4:5, 9:16; landscape for 16:9)
- Embed PNG snapshot as single page
- Filename: `{BrandName}_thumbnail.pdf`

**Requirement 3.3.3 — JPG Export**
- Render at 90% quality
- Opaque background (#0A0A0A)
- Filename: `{BrandName}_thumbnail.jpg`

**Requirement 3.3.4 — JSON Export**
- Export entire `ThumbnailData` object (all inputs)
- Filename: `luxthumb_ad_config.json`
- Used for round-trip design loading

### 3.4 Audit Logging

**Requirement 3.4.1 — Logged Actions**
The following user actions SHALL be logged to IndexedDB (`luxthumb_audit_logs`):
- `design_save` — design snapshot created
- `design_delete` — design removed from history
- `export_format_png` — PNG downloaded
- `export_format_pdf` — PDF downloaded
- `export_format_jpg` — JPG downloaded
- `export_format_json` — JSON config downloaded

**Requirement 3.4.2 — Log Structure**
Each log entry SHALL include:
- Unique ID (`log_{timestamp}_{random}`)
- Timestamp (milliseconds since epoch)
- Action type
- Details (human-readable description, e.g. "PNG exported: NEXUS_AI_thumbnail.png")
- User agent metadata (first 100 chars of `navigator.userAgent`)

**Requirement 3.4.3 — Log Retention**
- Maximum 1000 log entries per session
- Oldest entries purged when limit exceeded
- Admin dashboard allows manual clear (with confirmation)

### 3.5 Admin Panel

**Requirement 3.5.1 — Authentication**
- Password: `admin123` (demo; in production use environment-based secrets)
- Accessed via "Admin" button in main sidebar
- Prompts for password in modal dialog
- On correct password: show AdminPanel component
- On incorrect password: clear input, focus password field

**Requirement 3.5.2 — Dashboard Display**
Admin panel SHALL display:
- Total audit log entries (count)
- Design saves (filtered count)
- Exports (filtered count)
- Last activity timestamp (most recent log)
- Expandable audit log table with timestamp, action, details for each entry

**Requirement 3.5.3 — Export Logs**
- JSON export: `luxthumb_audit_logs_{date}.json`
- CSV export: `luxthumb_audit_logs_{date}.csv` with headers (Timestamp, Action, Details)
- Export buttons disabled if no logs exist

**Requirement 3.5.4 — Logout**
- Logout button clears authentication state
- Returns to main app (admin button becomes visible again)

### 3.6 Accessibility

**Requirement 3.6.1 — Theme Support**
- Dark theme (default): #050505 background, #F5F5F5 text, #C9A84C gold
- Light theme: #FFFFFF background, #050505 text, #C9A84C gold
- High-contrast theme: #000000 background, #FFFFFF text, #FFFF00 gold
- Theme persisted to `localStorage` key `luxthumb-theme`
- Theme applied via `[data-theme]` attribute on `<html>` element
- CSS variables scoped by theme for all components

**Requirement 3.6.2 — Font Size**
- Options: Small (85%), Normal (100%), Large (115%), Extra Large (130%)
- Applied via root `font-size` property
- Persisted to `localStorage` key `luxthumb-font-size`

**Requirement 3.6.3 — Reduced Motion**
- Toggle to reduce/disable CSS animations
- When enabled: animation duration → 0.01ms, transition duration → 0.01ms
- Persisted to `localStorage` key `luxthumb-reduced-motion`

**Requirement 3.6.4 — WCAG Compliance**
- All interactive elements have `aria-label` attributes
- All buttons, inputs have visible focus indicators (outline: 2px gold)
- Colour is not the only means of conveying information (icons + text)
- Text contrast ratios meet WCAG AA standard (4.5:1 for body text, 3:1 for large text)
- Keyboard-only navigation supported (Tab, Enter, Space, Escape)

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Page load time: < 3 seconds on 5 Mbps connection (with Gemini API latency excluded)
- Thumbnail canvas render time: < 500ms
- Theme switching: instant (< 100ms perceived)
- Export generation: < 10 seconds (PNG at 2x scale)

### 4.2 Compatibility
- **Browsers:** Chrome 120+, Firefox 115+, Safari 17+, Edge 120+
- **Viewport:** 1024×768 minimum (desktop); tablet support (iPad, 1024×1366)
- **Mobile:** Not required (design-focused tool; desktop UX expected)

### 4.3 Security
- API Key (`GEMINI_API_KEY`) loaded from environment; never exposed in client code
- Admin password `admin123` is demo-only; production SHALL use hashed comparison or OAuth
- No user authentication required (public-facing); audit logs for transparency
- HTTPS enforced on production domain (`luxthumb.techbridge.edu.gh`)
- Content Security Policy (CSP) headers recommended for image/font loading

### 4.4 Reliability
- IndexedDB graceful fallback: if unavailable, warn user but allow session-only operation
- Gemini API failure → user alert; app remains usable (prompts not generated)
- Export failures caught and reported to user with error details
- No data loss on browser refresh (IndexedDB persists automatically)

### 4.5 Maintainability
- TypeScript strict mode enabled
- Components modular and documented
- Gemini system instruction centralised in `geminiService.ts`
- Tests cover core flows: admin auth, theme switching, exports, accessibility

---

## 5. External Interfaces

### 5.1 Google Gemini AI API
**Endpoint:** `@google/genai` SDK  
**Model:** `gemini-3-flash-preview`  
**Request Type:** `generateContent` with JSON response  
**Response Mime Type:** `application/json`  
**Error Handling:** Catch and display user-friendly error  

### 5.2 Browser APIs Used
- **IndexedDB (`idb-keyval`):** Persistent storage for design data, saved designs, audit logs
- **Canvas API (html2canvas-pro, jsPDF):** Export rendering
- **File API:** Image upload and download
- **LocalStorage:** Theme and accessibility settings persistence
- **Navigator API:** User agent detection for audit logs

---

## 6. Design & Architecture

### 6.1 Component Structure
```
App.tsx (main state container)
├── AdminPanel.tsx (password gated)
├── AccessibilityPanel.tsx (theme/font/motion settings)
└── Thumbnail Canvas (preview area with background, subject, text overlays)
```

### 6.2 Data Model
```typescript
ThumbnailData {
  brandName, logoDescription, logoImage,
  headlineLine1, headlineLine2, subheadline,
  backgroundScene, backgroundImage, bgZoom, bgX, bgY,
  foregroundSubject, subjectImage, subjectZoom, subjectX, subjectY,
  featureIcons, featureImages,
  taglineBar, aspectRatio
}

GeneratedPrompts {
  midjourney, imagen3, canvaBrief,
  typographySpec, colorPalette, animatedExtension
}

SavedDesign {
  id, timestamp, name, data (ThumbnailData)
}

AuditLog {
  id, timestamp, action, details, ipMetadata
}
```

### 6.3 Persistence
| Store | Key | Format | Purpose |
|---|---|---|---|
| IndexedDB | `luxthumb_design_data` | ThumbnailData | Current design (auto-save) |
| IndexedDB | `luxthumb_saved_designs` | SavedDesign[] | Design history |
| IndexedDB | `luxthumb_audit_logs` | AuditLog[] | Admin audit trail |
| LocalStorage | `luxthumb-theme` | 'dark' \| 'light' \| 'high-contrast' | Theme preference |
| LocalStorage | `luxthumb-font-size` | 'small' \| 'normal' \| 'large' \| 'extra-large' | Font size |
| LocalStorage | `luxthumb-reduced-motion` | 'true' \| 'false' | Motion preference |

---

## 7. Testing Requirements

### 7.1 Unit Tests (TypeScript)
- `generateThumbnailPrompts()` handles API success and failure
- `recordAuditLog()` creates and persists log entries
- Theme CSS variables resolve for all three themes

### 7.2 Integration Tests (Playwright)
- Core flow: fill form, click "Engage Engine", verify output
- Admin flow: click admin button, enter password, view logs
- Theme switching: select theme, verify `data-theme` attribute, reload, confirm persistence
- Export flow: fill form (subject required), click PNG/PDF/JPG/JSON, verify download
- Accessibility: verify `aria-label` on all buttons, `lang="en"` on html, focus indicators visible

### 7.3 Manual Tests
- Visual check: thumbnail preview reflects all input changes in real-time
- Gemini API integration: valid prompts generated for realistic brand inputs
- Admin audit logs: verify all actions logged (design save, export, delete)
- Theme transition: no visual flicker on theme change
- Mobile viewport: responsive layout on iPad (1024×1366)

---

## 8. Deployment & Operations

### 8.1 Hosting
- Platform: Cloud Run (Google Cloud) or Plesk/Ubuntu server at `66.226.72.199`
- Domain: `luxthumb.techbridge.edu.gh`
- SSL/TLS: HTTPS enforced
- Environment variables: `GEMINI_API_KEY`, `APP_URL` (injected at runtime)

### 8.2 Build & Release
- Build tool: Vite 6
- Release command: `npm run build` → produces `dist/` directory
- Deployment: Copy `dist/` to Plesk public_html or Cloud Run container
- Version: Semantic versioning (e.g. 1.0.0)

### 8.3 Monitoring
- Client-side error logging to console (browser DevTools)
- Google Analytics tracking ID: `G-FKXTELQ71R`
- Audit logs stored client-side (admin panel export for review)
- No server-side logging (SPA-only; logs in IndexedDB)

---

## 9. Glossary

| Term | Definition |
|---|---|
| **Gemini AI** | Google's generative AI model (`gemini-3-flash-preview`) |
| **Cinematic** | High-contrast, dramatic lighting style for thumbnail design |
| **Editorial** | Professional, polished design aesthetic (not playful or casual) |
| **Rim Lighting** | Backlighting that separates subject from background |
| **Chiaroscuro** | High-contrast light/shadow technique (Italian: "light-dark") |
| **Rembrandt Lighting** | Asymmetrical key lighting creating a small triangular catchlight in shadow side of face |
| **IndexedDB** | Browser's NoSQL database for client-side persistence |
| **Audit Trail** | Immutable log of all user actions for compliance and transparency |

---

## 10. Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Author | Daniel Frempong Twum | 9 May 2026 | ✓ Approved |
| Department Head | ICT Department | 9 May 2026 | ✓ Approved |
| Project Manager | Techbridge University College | 9 May 2026 | ✓ Approved |

---

**Document Classification:** TUC Internal | **Review Cycle:** Annual | **Last Reviewed:** 9 May 2026
