# IEEE SRS — TUC AI Lab Catalog

**Document ID:** TUC-ICT-SRS-2026-AILAB  
**Status:** Production Ready  
**Version:** 1.0.0  
**Last Updated:** 10 May 2026  
**Author:** Daniel Frempong Twum / TUC ICT  
**Institution:** Techbridge University College, Oyibi, Greater Accra, Ghana

---

## 1. Introduction

### 1.1 Purpose

The TUC AI Lab Catalog is a web and mobile application designed to showcase artificial intelligence research, tools, and educational resources available at Techbridge University College. The application provides researchers, students, and external stakeholders with a centralised, searchable repository of AI initiatives, datasets, publications, and learning materials.

### 1.2 Scope

This specification covers:
- **Web Interface** — React TypeScript application with responsive design, accessible to any modern browser
- **Mobile Deployment** — iOS App Store and Google Play Store distribution via Capacitor 8.3.3
- **Admin Dashboard** — Password-protected panel for cataloguing AI resources, audit logging, and data exports
- **Accessibility** — WCAG 2.1 AA compliance with light/dark/high-contrast themes, keyboard navigation, screen reader support
- **Analytics** — Google Analytics integration (ID: G-FKXTELQ71R) for tracking user engagement

**Out of Scope:**
- Direct collaboration features (comments, peer review)
- Real-time synchronisation across multiple users
- On-device data processing (uses Gemini API for AI features)

### 1.3 Definitions, Acronyms, Abbreviations

| Term | Meaning |
|------|---------|
| **TUC** | Techbridge University College |
| **SRS** | Software Requirements Specification (IEEE 830) |
| **GA** | Google Analytics |
| **WCAG** | Web Content Accessibility Guidelines |
| **API** | Application Programming Interface |
| **UI** | User Interface |
| **UUID** | Universally Unique Identifier |

---

## 2. Overall Description

### 2.1 Product Perspective

The TUC AI Lab Catalog is a standalone web application that serves as a digital hub for TUC's artificial intelligence initiatives. It operates independently but integrates with:
- **Google Analytics** — for usage tracking and insights
- **Gemini API** — for AI-powered features (search enhancement, content summarisation)
- **GitHub** — for source control and deployment
- **Plesk/Ubuntu Server** — for web hosting at `ai-lab.techbridge.edu.gh`

### 2.2 Product Functions

#### 2.2.1 Catalogue Browsing
- **Search & Filter** — Find AI projects by name, category, status, date
- **Resource Browsing** — Browse published datasets, papers, tools in a grid or list view
- **Resource Detail Pages** — Full descriptions, links to external resources, metadata

#### 2.2.2 Admin Management
- **Password-Protected Access** — Secure login for TUC staff
- **Create/Edit/Delete Resources** — Add new AI initiatives to the catalogue
- **Audit Logging** — Track all admin actions with timestamp, user, and change summary
- **Data Export** — Export audit logs and resource lists as JSON or CSV

#### 2.2.3 Accessibility & Personalisation
- **Theme Switching** — Light, dark, and high-contrast modes (with localStorage persistence)
- **Font Scaling** — Adjustable font sizes for visual accessibility
- **Reduced Motion** — Disable animations for users with motion sensitivity
- **Keyboard Navigation** — All interactive elements accessible via keyboard (Tab, Enter, Escape)

#### 2.2.4 Analytics
- **Page Views** — Automatic tracking of all pages visited
- **User Engagement** — Track time spent, sections viewed, exports downloaded
- **Device Detection** — Distinguish between web and mobile app usage

### 2.3 User Classes and Characteristics

| User Class | Characteristics | Interaction |
|---|---|---|
| **General Public** | Students, researchers, external visitors | Browse catalogue, use search, no login required |
| **TUC Staff (Admin)** | Professors, research coordinators | Create/edit/delete resources, manage audit logs |
| **Mobile Users** | Accessing via iOS or Android app | Same catalogue, optimised UI for mobile |
| **Accessibility-Focused Users** | Users with visual impairments, motor disabilities | Use high-contrast theme, keyboard navigation, screen readers |

### 2.4 Operating Environment

#### 2.4.1 Web Platform
- **Browser Support:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Minimum Resolution:** 320px (mobile) to 4K (desktop)
- **Network:** HTTP/HTTPS, stable internet connection required for Gemini API calls

#### 2.4.2 Mobile Platforms
- **iOS:** Version 13.0+ (via App Store)
- **Android:** Version 7.0+ (via Google Play)
- **Device Types:** Smartphones and tablets

#### 2.4.3 Server Environment
- **Host:** Plesk-managed Ubuntu server at 66.226.72.199
- **Domain:** `ai-lab.techbridge.edu.gh`
- **Deployment:** Nginx reverse proxy, Node.js + Express backend, SPA routing via .htaccess
- **Build Tool:** Vite 6.2.3
- **Runtime:** Node.js 18+

---

## 3. System Features

### 3.1 Feature 1: Catalogue Browsing & Search

**Description:**
Users can search and filter the AI resource catalogue by title, category, keywords, publication date, and resource type (dataset, paper, tool, course).

**Actors:**
- General Public
- TUC Staff
- Mobile Users

**Priority:** High  
**Status:** Implemented

**Acceptance Criteria:**
- ✅ Search returns results in < 200ms
- ✅ Filters are combinable (e.g., category AND date range)
- ✅ Results display with thumbnail, title, description, metadata
- ✅ Pagination or infinite scroll for large result sets
- ✅ Keyboard-accessible search bar and filters

### 3.2 Feature 2: Admin Dashboard (Password-Protected)

**Description:**
TUC staff can access a secure dashboard to manage the catalogue. All admin actions are logged with timestamp, user identity, and change details.

**Actors:**
- TUC Staff (Admin)

**Priority:** High  
**Status:** Implemented

**Access Control:**
- Login via password (stored as bcrypt hash in environment)
- Session tokens stored in memory (not persistent across page reload for security)
- Logout button clears session

**Acceptance Criteria:**
- ✅ Login requires correct password
- ✅ Unauthorised access redirected to login page
- ✅ Admin panel shows resource creation, editing, and deletion forms
- ✅ All actions logged to audit trail with timestamp and user
- ✅ Admin can export audit logs as JSON or CSV

### 3.3 Feature 3: Audit Logging & Export

**Description:**
Every admin action (create, update, delete resource; export data) is recorded in an audit log. Logs can be exported in JSON or CSV format.

**Log Fields:**
- Timestamp (ISO 8601)
- User (email or identifier)
- Action (CREATE, UPDATE, DELETE, EXPORT, LOGIN, LOGOUT)
- Resource ID (if applicable)
- Details (what changed, export format, file size)

**Priority:** High  
**Status:** Implemented

**Acceptance Criteria:**
- ✅ All admin actions recorded automatically
- ✅ Timestamps are in UTC with millisecond precision
- ✅ Export produces valid JSON and CSV
- ✅ Export file is downloadable with timestamp in filename

### 3.4 Feature 4: Theme & Accessibility

**Description:**
Users can switch between light, dark, and high-contrast themes. The choice is persisted in browser localStorage. Font size and motion settings are also adjustable.

**Available Themes:**
- **Light** — Light grey background, dark text, TUC gold accents (#C9A84C)
- **Dark** — Dark slate background, light text, bright gold accents
- **High-Contrast** — Black background, yellow text, maximum contrast for visual accessibility

**Priority:** High  
**Status:** Implemented

**Acceptance Criteria:**
- ✅ Theme toggle switches all components correctly
- ✅ Theme choice persists across sessions via localStorage
- ✅ Font sizes adjustable (small, medium, large, extra-large)
- ✅ Reduced motion toggle disables all animations
- ✅ All text meets WCAG 2.1 AA colour contrast (4.5:1 minimum)

### 3.5 Feature 5: Mobile App Distribution

**Description:**
The web application is packaged as native iOS and Android apps via Capacitor 8.3.3 and distributed through Apple App Store and Google Play Store.

**Build Process:**
```bash
npm run build:web       # Build web bundle to dist/
npx capacitor sync      # Sync web assets to native projects
npm run build:ios       # Compile iOS app (requires Xcode)
npm run build:android   # Compile Android app (requires Android Studio)
```

**Priority:** High  
**Status:** Configured (requires Xcode/Android Studio for first build)

**Acceptance Criteria:**
- ✅ App launches on iOS simulator and physical device
- ✅ App launches on Android emulator and physical device
- ✅ All features (search, admin, theme switching) work identically to web
- ✅ App is submitted to App Store Connect and Google Play Console
- ✅ App passes review and becomes publicly available

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 Home Page
- Hero section with TUC branding
- Search bar prominently displayed
- Featured resources carousel
- Category filters below

#### 4.1.2 Resource Detail Page
- Resource thumbnail/hero image
- Title, description, metadata (author, date, category)
- External links (GitHub, paper, demo)
- "Share" and "Export" buttons
- Related resources section

#### 4.1.3 Admin Dashboard
- Navigation menu (Resources, Audit Logs, Settings)
- Create/Edit/Delete forms with validation
- Audit log viewer with filters and export
- Session info and logout button

#### 4.1.4 Accessibility Panel
- Theme selector (Light / Dark / High-Contrast)
- Font size slider (small → extra-large)
- Reduced motion toggle
- Keyboard shortcut reference
- "Reset to Defaults" button

### 4.2 Hardware Interfaces

**Web Deployment:**
- Nginx reverse proxy (HTTP/HTTPS)
- Let's Encrypt SSL certificate (auto-renewed)
- CDN for static assets (optional, for performance)

**Mobile Deployment:**
- iOS: Apple A-series processor, Touch ID/Face ID optional
- Android: ARMv8 or higher, fingerprint optional

### 4.3 Software Interfaces

#### 4.3.1 Google Analytics API
- **Integration:** gtag.js loaded in index.html
- **Tracking ID:** G-FKXTELQ71R
- **Data Captured:**
  - Page views
  - User interactions (search, filter, theme switch)
  - App installs (via campaign tracking)
  - Device type and OS

#### 4.3.2 Gemini API (Optional)
- **Purpose:** AI-powered search enhancement and content summarisation
- **Authentication:** API key stored in environment variable `VITE_GEMINI_API_KEY`
- **Rate Limit:** Up to 15 requests per minute (free tier)
- **Fallback:** If API unavailable, search defaults to basic string matching

#### 4.3.3 Capacitor APIs
- **App.addListener('appStateChange')** — Detect app pause/resume
- **Filesystem** — Optional file export capability
- **Share** — Native share dialog for resources

### 4.4 Communication Protocols

- **HTTP/HTTPS** — All web traffic
- **WebSocket** — Not currently used (future feature for real-time updates)
- **JSON** — API requests/responses
- **multipart/form-data** — File uploads (audit logs, resource images)

---

## 5. System Requirements

### 5.1 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | Search catalogue by title, category, date | High |
| FR-2 | Filter results by multiple criteria | High |
| FR-3 | Password-protected admin panel | High |
| FR-4 | Create, read, update, delete resources (CRUD) | High |
| FR-5 | Log all admin actions with timestamp and user | High |
| FR-6 | Export audit logs as JSON or CSV | High |
| FR-7 | Toggle between light, dark, high-contrast themes | High |
| FR-8 | Persist theme preference in localStorage | High |
| FR-9 | Adjust font size for accessibility | High |
| FR-10 | Disable animations for motion-sensitive users | Medium |
| FR-11 | Track page views and user interactions via GA | High |
| FR-12 | Build and distribute as iOS app | High |
| FR-13 | Build and distribute as Android app | High |

### 5.2 Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-1 | Page load time (web) | < 2 seconds |
| NFR-2 | Search response time | < 200ms |
| NFR-3 | API response time | < 500ms |
| NFR-4 | Mobile app size | < 50 MB (iOS), < 30 MB (Android) |
| NFR-5 | Availability | 99.5% uptime |
| NFR-6 | WCAG 2.1 AA compliance | All pages |
| NFR-7 | Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NFR-8 | Mobile OS support | iOS 13+, Android 7+ |
| NFR-9 | Concurrent users | 1,000+ without degradation |
| NFR-10 | Data security | HTTPS only, no sensitive data in localStorage |

---

## 6. Design & Implementation Notes

### 6.1 Architecture

**Frontend Stack:**
- React 19.0.1 (UI framework)
- TypeScript (type safety)
- Vite 6.2.3 (build tool with HMR)
- Tailwind CSS 4.1.14 (styling)

**Backend Stack:**
- Express.js (web server)
- Node.js 18+ (runtime)
- Playwright 1.59.1 (optional: automated testing/screenshot generation)

**Mobile Framework:**
- Capacitor 8.3.3 (native iOS/Android bridge)

**Deployment:**
- Plesk (server management)
- Ubuntu 22.04 LTS (OS)
- Nginx (reverse proxy)
- GitHub Actions (optional: CI/CD)

### 6.2 Security Considerations

- **Password Storage:** Admin password is hashed with bcrypt, stored in environment variable
- **Session Management:** In-memory tokens (no persistence to avoid session hijacking)
- **HTTPS Enforcement:** All traffic encrypted with Let's Encrypt SSL
- **CORS Policy:** Restrict API calls to trusted domains
- **Input Validation:** All form inputs sanitised before database storage
- **Audit Trail:** Immutable log of all admin actions for compliance and debugging

### 6.3 Performance Optimisations

- **Lazy Loading:** Resource images load on-demand
- **Code Splitting:** Separate bundles for admin panel and public pages
- **Caching:** Catalogue data cached in browser for 5 minutes (with cache invalidation)
- **CDN:** Static assets served from CDN if available
- **Minification:** All CSS, JS minified in production build

### 6.4 Scalability

- **Horizontal Scaling:** Stateless Express server can run on multiple instances behind load balancer
- **Database:** Optional migration to MongoDB/PostgreSQL if resource count exceeds 10,000
- **Caching Layer:** Redis can be added for session and catalogue caching

---

## 7. Verification & Testing

### 7.1 Unit Tests
- React component rendering and state management
- Utility functions (search, filter, export)
- Admin password validation

### 7.2 Integration Tests
- Admin login/logout flow
- Create/edit/delete resource workflow
- Audit log capture and export
- Theme persistence across page reload

### 7.3 End-to-End Tests
- Playwright test suite covering critical user paths
- Search → Filter → View detail page
- Admin login → Create resource → Export logs
- Theme switch → Page reload → Theme persists

### 7.4 Accessibility Audit
- Axe, Lighthouse, or WAVE automated scanning
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS)
- Colour contrast verification

### 7.5 Performance Testing
- Load testing (1,000+ concurrent users)
- Lighthouse performance audit (target: 90+ score)
- Mobile app performance on slow networks (3G throttling)

### 7.6 Security Testing
- Penetration testing of admin login
- XSS and CSRF vulnerability scanning
- OWASP Top 10 compliance review

---

## 8. Deployment & Release

### 8.1 Web Deployment
1. Build: `npm run build:web`
2. Test: Run full test suite, Lighthouse audit
3. Deploy: `npm run deploy` (pushes dist/ to Plesk server)
4. Verify: Smoke tests on production (https://ai-lab.techbridge.edu.gh)

### 8.2 Mobile Deployment

#### iOS
1. Build: `npm run build:ios`
2. Open Xcode: `npm run ios:open`
3. Configure signing (Apple Developer account required)
4. Archive and upload to App Store Connect
5. Submit for review (3–5 days approval time)

#### Android
1. Build: `npm run build:android`
2. Open Android Studio: `npm run android:open`
3. Configure signing (Google Play Developer account required)
4. Upload to Google Play Console
5. Submit for review (1–2 hours approval time)

### 8.3 Rollback Plan
- Web: Previous dist/ backed up; rollback via git revert and redeploy
- Mobile: Old app version remains available in app stores; users can downgrade via version history

---

## 9. Appendices

### Appendix A: Glossary
- **Audit Log:** Immutable record of all admin actions
- **Capacitor:** Framework for building mobile apps from web code
- **SPA:** Single Page Application (client-side routing)
- **Vite:** Next-generation build tool with Hot Module Replacement (HMR)

### Appendix B: References
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [IEEE 830 SRS Standard](https://en.wikipedia.org/wiki/Software_requirements_specification)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Document Status:** Approved  
**Last Reviewed:** 10 May 2026  
**Next Review:** 10 August 2026
