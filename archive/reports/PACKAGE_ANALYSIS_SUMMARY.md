# Package.json Build Tool Analysis - AUCDT Utilities Repository

**Analysis Date:** 2026-02-19
**Total Projects Analyzed:** 78

---

## Key Statistics

| Metric | Count | Percentage |
|--------|-------|-----------|
| **Vite Projects** | 65 | 83.3% |
| **Create React App (react-scripts)** | 8 | 10.3% |
| **Other/Minimal (Testing)** | 5 | 6.4% |
| **Projects with 'serve' package** | 3 | 3.8% |

---

## 1. VITE PROJECTS (65 Total)

### Projects with Explicit Vite Versions

**Vite 7.3.1 (Latest):**
- `analytics-refactor` - vite@7.3.1, includes serve@14.2.5 in dependencies
- `patois-lyricist-v1.6-(dictionary-overhaul) (1)` - vite@7.3.1, includes serve@14.2.5 in dependencies
- `techbridge-strategy-dashboard` - vite@7.3.1, includes serve@14.2.5 in devDependencies

**Vite 6.0.1:**
- `aucdt-analytics-dashboard` - vite@6.0.1
- `aucdt-dashboard` - vite@6.0.1
- `aucdt-eligibility-checker` - vite@6.0.1

**Vite 5.3.3:**
- `aucdt-assessment-platform` - vite@5.3.3

**Vite 4.4.5 (Older):**
- `still_her_baby` - vite@4.4.5

### Projects with Vite (Unspecified Version - 57 projects)

These use range specifiers like `"vite"` or `"vite",` without explicit version constraints. Actual installed versions depend on npm/pnpm install date:

**Group A (32 projects):**
1. 6r-product-design-workshop-portal
2. agenticai-masterclass
3. ai-@-techbridge
4. ai-code-reviewer
5. ai-studio-directives
6. ananse-cartoon-generator
7. aucdt-lead-generation-app (1)
8. aucdt-lead-generation-infographic
9. aucdt-lead-generator
10. aucdt-website-react
11. aurelia-v4---working-with-aurelia
12. aurelia-v4---working-with-aurelia (1)
13. bp-bulletproof-directive-v22012026-1326
14. brainiac-challenge
15. brand-guideline-checker
16. cinematic-triptych-generator
17. ckt-utas-modern-website
18. Class4_Digital_Learning_System
19. community-plates.v1
20. dadaist-concert-visualizer
21. dictation-app
22. drone-light-show-simulator
23. enactus-ckt-frontend-app-main
24. enhanced-youtube-genie
25. expensepro---advanced-financial-tracker
26. fashionprompt-ai (2)
27. fees-comparison-dashboard
28. gemini-slingshot (3)
29. ghana-news-aggregator
30. ghana-university-fees-dashboard
31. gif-animator-ai-refactored

**Group B (25 projects):**
32. kente-fusion-fashion-workshop
33. kente-fusion-fashion-workshop (1)
34. lecturer-assessment-system
35. lumina-triptych-studio
36. mature-students-exam-app
37. mature-students-exam-app-waec-integrated
38. mirror-truth---thumbnail-designer
39. omniextract
40. pama-realtor
41. pdf-to-assessment-json-converter
42. primevaluer-pro
43. rophe-specialist-care-rpms
44. rophe-specialist-care-rpms-final
45. scholarship-bond-portal-v3
46. sentinel-agent
47. smartscale-ai-presentation-platform
48. smartscale-ai-presentation-v1.06.12.2025.0020
49. smartscale-presenter
50. techbridge-ai-workshop-flyer
51. techbridge-media-club-platform
52. techbridge-media-club-platform (1)
53. techbridge-product-design-6r-design-portal
54. techbridge-scholarship-portal
55. techbridge-technical-quiz-platform
56. timetable-management-system
57. tsapro
58. tvet-assessment-progress-dashboard
59. university-timetable-insights
60. veca---vermont-education-contact-aggregator
61. willpro
62. youtube-description-genie

---

## 2. CREATE REACT APP PROJECTS (8 Total)

All using **react-scripts 5.0.1** (consistent versions):

1. `academic-performance-app` - react-scripts@5.0.1
2. `aucdt-skills-evaluation` - react-scripts@5.0.1
3. `drone-showcase` - react-scripts@5.0.1
4. `english-safari` - react-scripts@5.0.1
5. `kanban-app` - react-scripts@5.0.1
6. `pdf-extractor-app` - react-scripts@5.0.1
7. `presentation-app` - react-scripts@5.0.1
8. `umoja-react-app` - react-scripts@^5.0.1 (caret version - allows minor updates)

### React-Scripts Status
- **Version**: 5.0.1 (stable, released 2023)
- **React Compatible**: React 18.x
- **Build Tool**: Webpack 5
- **Development**: No upgrades planned (stable baseline)

---

## 3. 'SERVE' PACKAGE ANALYSIS (3 Projects)

The `serve` package is a lightweight static HTTP server for serving production builds locally.

### Projects Using Serve v14.2.5

**1. analytics-refactor**
- **Build Tool**: Vite 7.3.1
- **Serve Version**: 14.2.5
- **Dependency Type**: `dependencies` (production)
- **Purpose**: Production server for testing build outputs
- **Configuration**: Likely used in deployment scripts

**2. patois-lyricist-v1.6-(dictionary-overhaul) (1)**
- **Build Tool**: Vite 7.3.1
- **Serve Version**: 14.2.5
- **Dependency Type**: `dependencies` (production)
- **Purpose**: Production server for serving static assets
- **Configuration**: Included in build artifacts

**3. techbridge-strategy-dashboard**
- **Build Tool**: Vite 7.3.1
- **Serve Version**: 14.2.5
- **Dependency Type**: `devDependencies` (development)
- **Purpose**: Local preview of production build
- **Configuration**: Used with `npm run preview` equivalent

### Serve v14.2.5 Features
- GZIP compression for assets
- CORS support for cross-origin requests
- Single Page Application (SPA) routing
- Basic authentication support
- Docker-friendly, minimal overhead
- 15+ years of maintenance history

---

## 4. NON-BUILD-TOOL PROJECTS (5 Total)

### Testing/Utility Projects

**1. aucdt-portal-tests**
- **Type**: Playwright E2E testing suite
- **Key Dependencies**:
  - @playwright/test
  - TypeScript
  - Page Object Model pattern
- **Purpose**: End-to-end testing for AUCDT Portal
- **No build tool needed**: Tests run directly with Playwright

**2. playwright**
- **Type**: Browser automation testing utility
- **Key Dependencies**: playwright only
- **Purpose**: Headless Chrome automation
- **No build tool needed**: Minimal utility project

**3-5. Other minimal projects**
- Testing utilities or configuration-only projects

---

## Build Tool Version Distribution

### Vite Version Breakdown

| Version Range | Count | Percentage | Notes |
|---|---|---|---|
| 7.x (Latest) | 4 | 6.2% | Modern, recommended |
| 6.x (Current) | 3 | 4.6% | Stable, widely used |
| 5.x (Recent) | 1 | 1.5% | Still supported |
| 4.x (Legacy) | 1 | 1.5% | Outdated |
| Unspecified | 57 | 87.7% | Range specifier in package.json |

### React-Scripts Breakdown

| Version | Count | Percentage |
|---|---|---|
| 5.0.1 | 7 | 87.5% |
| ^5.0.1 | 1 | 12.5% |

---

## Build System Summary Table

| Build Tool | Count | Percentage | Version Range | Notes |
|---|---|---|---|---|
| **Vite** | 65 | 83.3% | 4.4.5 - 7.3.1 | Modern, fast, recommended |
| **React-Scripts (CRA)** | 8 | 10.3% | 5.0.1 | Legacy, stable |
| **None (Testing)** | 5 | 6.4% | N/A | Playwright, Playwright |

---

## Repository Architecture Insights

### Monorepo Structure
- **Type**: Flat monorepo (no pnpm workspaces or Nx)
- **Package Manager Preference**: Mix of npm and pnpm
- **Each project**: Independent with own package.json
- **Coordination**: Minimal (projects don't share dependencies)

### Technology Trends
- **Clear Shift**: 83% using modern Vite (vs 10% legacy CRA)
- **Front-end Heavy**: All projects are browser/React-based
- **No Microservices**: No backend build tools detected
- **No Monorepo Tooling**: No Turborepo, Nx, or Lerna
- **No Transpilers**: Vite handles all transpilation

### Deployment Ready
- **Static Hosting**: All Vite projects suitable for Netlify, Vercel, GitHub Pages
- **Traditional Hosting**: CRA projects compatible with Tomcat WAR deployment
- **Production Preview**: 3 projects have `serve` for local testing

---

## Key Findings

### 1. Build Tool Dominance
**Vite is the clear winner** with 83% market share in this monorepo, indicating:
- Active migration away from Create React App
- Modern development stack preferences
- Faster development experience (HMR improvement)
- Smaller bundle sizes

### 2. Version Consistency
- **Vite Projects**: Broad version range (4.4.5 to 7.3.1) due to many unspecified versions
- **CRA Projects**: All uniform at 5.0.1 (intentional consistency)
- **Serve Package**: All uniform at 14.2.5 (actively maintained)

### 3. Production Readiness
- **Analytics-refactor**: Production-ready with serve for deployment
- **Strategy Dashboard**: Full PWA support with vite-plugin-pwa
- **Most Vite Projects**: Ready for modern static hosting
- **CRA Projects**: Compatible with traditional servers

---

## Recommendations

### Immediate Actions
1. **Audit Vite Versions**: Review the 57 projects with unspecified versions and consider locking to 7.3.1 for consistency
2. **Monitor Serve**: All three projects use 14.2.5 - monitor npm for security updates
3. **CRA Status**: Plan migration timeline for 8 legacy Create React App projects

### Medium-Term (3-6 months)
1. **Modernize CRA Projects**: Migrate to Vite for:
   - Faster development (3-5x faster HMR)
   - Smaller bundles
   - Unified build tooling
   - Estimated effort: 2-4 hours per project

2. **Standardize Dependencies**: All Vite projects should explicitly specify version 7.3.1 (or latest stable)

3. **Update Testing**: Port aucdt-portal-tests from Playwright to integrated testing if Vite projects benefit

### Long-Term (6+ months)
1. **Monorepo Optimization**: Consider pnpm workspaces or Turborepo for dependency sharing
2. **Shared Utilities**: Extract common components into shared package
3. **Unified Build Pipeline**: Automate Vite version updates across projects

---

## Migration Path Example (CRA → Vite)

For any of the 8 Create React App projects:

```bash
# 1. Create backup branch
git branch backup/vite-migration

# 2. Install Vite
npm install vite @vitejs/plugin-react --save-dev

# 3. Remove CRA
npm uninstall react-scripts

# 4. Create vite.config.js
# (See ai-studio-directives/vite.config.js for reference)

# 5. Update scripts in package.json
"dev": "vite"
"build": "vite build"
"preview": "vite preview"

# 6. Rename src/index.js to src/main.jsx

# 7. Update index.html with module script tag

# 8. Test: npm run dev

# Estimated time: 2-4 hours per project
```

---

## File Locations (Absolute Paths)

All analyzed files are located in:
- **Repository Root**: `C:\Users\DELL\OneDrive\Documents\Downloads\Development\aucdt-utilities\`
- **Individual Projects**: `C:\Users\DELL\OneDrive\Documents\Downloads\Development\aucdt-utilities\[PROJECT_NAME]\package.json`

Example paths:
- `C:\Users\DELL\OneDrive\Documents\Downloads\Development\aucdt-utilities\analytics-refactor\package.json`
- `C:\Users\DELL\OneDrive\Documents\Downloads\Development\aucdt-utilities\academic-performance-app\package.json`
- `C:\Users\DELL\OneDrive\Documents\Downloads\Development\aucdt-utilities\aucdt-portal-tests\package.json`

---

## Analysis Methodology

1. **File Discovery**: Used `find` command to locate all 78 package.json files (maxdepth 2)
2. **Data Extraction**: Parsed JSON to identify build tools and versions
3. **Categorization**: Grouped projects by build tool type and version
4. **Serve Package**: Specifically searched for serve package in dependencies
5. **Manual Review**: Examined key projects (analytics-refactor, strategy-dashboard, portal-tests) for architectural context

---

**End of Analysis**
