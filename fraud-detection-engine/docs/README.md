# Documentation Index — Fraud Detection Engine

**Version:** 3.0.0  
**Last Updated:** 2026-04-27  
**Status:** Phase 4 Complete

---

## 📚 Documentation Overview

All documentation for the Fraud Detection Engine is organized below by audience and purpose.

---

## For End Users

### [👤 User Guide](USER_GUIDE.md)
**Who should read this:** All users, analysts, administrators  
**What it covers:**
- How to navigate the Dashboard
- Understanding entity health scores
- Alert workflow and acknowledgement
- Theme & accessibility features
- Common tasks (monitoring, investigating, responding to alerts)
- Keyboard shortcuts and screen reader support
- Troubleshooting guide
- FAQ

**Start here if:** You want to understand how to **use the application effectively**.

---

## For Administrators

### [🔧 Administrator Guide](ADMIN_GUIDE.md)
**Who should read this:** System administrators, DevOps engineers  
**What it covers:**
- Accessing the admin console
- System diagnostics and monitoring
- Database monitoring and maintenance
- Performance analytics
- Audit logging
- Automated testing suite
- Sentinel AI integration

**Start here if:** You need to **configure, monitor, and maintain the system**.

---

## For Developers & Architects

### [🏗️ Architecture Guide](ARCHITECTURE.md)
**Who should read this:** Backend developers, architects, senior engineers  
**What it covers:**
- High-level system architecture diagram
- Component structure
- Technology stack details
- Sentinel integration design
- Security model
- Data flow patterns

**Start here if:** You need to understand the **system design and technical implementation**.

### [📋 Software Requirements Specification](SRS.md)
**Who should read this:** Project managers, architects, QA leads  
**What it covers:**
- Functional requirements (all 100+ FR items)
- Non-functional requirements
- Compliance matrix
- Technical constraints
- Operating environment specifications
- User classes and use cases

**Start here if:** You need the **authoritative specification** of what the system does.

---

## For Testing & Deployment

### [🧪 CI/CD & Testing Setup](CI-CD_TESTING_SETUP.md)
**Who should read this:** QA engineers, DevOps, CI/CD maintainers  
**What it covers:**
- Running unit tests locally (Vitest)
- Running E2E tests (Playwright)
- Test configuration details
- CI/CD pipeline overview
- Coverage thresholds and targets
- Best practices for writing tests
- Troubleshooting test failures

**Start here if:** You need to **test the application or set up CI/CD**.

### [📦 Deployment Guide](DEPLOYMENT_GUIDE.md)
**Who should read this:** DevOps engineers, deployment specialists  
**What it covers:**
- Docker container setup
- Environment configuration
- Database initialization
- Health checks and monitoring
- Scaling considerations
- Troubleshooting deployment issues

**Start here if:** You need to **deploy the application to production**.

---

## For Project Management

### [📄 IEEE SRS (Complete)](SRS.md)
The authoritative specification document covering all requirements, scope, constraints, and compliance.

### [🚀 Creation Document](../CREATION.md)
Quick reference with project purpose, stack, key decisions, and setup instructions.

### [📊 Gap Analysis](../GAP_ANALYSIS.md)
Detailed comparison of the SRS vs. actual implementation, showing what's implemented and what's pending.

### [📝 Changelog](../CHANGELOG.md)
Historical record of all changes, fixes, and enhancements by version.

---

## Quick Navigation

### By Role

**I'm a user. How do I...?**
→ See [User Guide](USER_GUIDE.md)
- How do I log in?
- How do I understand what the alerts mean?
- How do I check if the system is healthy?

**I'm an administrator. How do I...?**
→ See [Administrator Guide](ADMIN_GUIDE.md)
- Monitor system performance?
- Check database health?
- Run diagnostic tests?

**I'm a developer. How do I...?**
→ See [Architecture Guide](ARCHITECTURE.md) + [SRS](SRS.md)
- Understand the component structure?
- Add a new feature?
- Integrate with Sentinel?

**I'm deploying this. How do I...?**
→ See [Deployment Guide](DEPLOYMENT_GUIDE.md)
- Set up Docker?
- Configure environment variables?
- Initialize the database?

**I need to test this. How do I...?**
→ See [CI/CD & Testing Setup](CI-CD_TESTING_SETUP.md)
- Run unit tests?
- Run E2E tests?
- Set up the CI/CD pipeline?

### By Task

| Task | Document |
|------|----------|
| Navigate the app | [User Guide](USER_GUIDE.md) |
| Understand system design | [Architecture](ARCHITECTURE.md) |
| Know what's built vs. pending | [Gap Analysis](../GAP_ANALYSIS.md) |
| Set up deployment | [Deployment Guide](DEPLOYMENT_GUIDE.md) |
| Run tests | [CI/CD & Testing](CI-CD_TESTING_SETUP.md) |
| Monitor system | [Admin Guide](ADMIN_GUIDE.md) |
| Get exact requirements | [SRS](SRS.md) |
| Quick project overview | [Creation Doc](../CREATION.md) |

---

## Document Relationships

```
SRS (Authoritative Spec)
├─ Architecture (How it's built)
├─ User Guide (How to use it)
├─ Admin Guide (How to manage it)
├─ Deployment Guide (How to run it)
├─ Testing Guide (How to verify it)
└─ Gap Analysis (What's done vs. pending)

Creation Doc (Quick reference)
├─ Tech stack
├─ Setup instructions
├─ Key decisions
└─ FAQ
```

---

## Status & Phases

**Current Status:** Phase 4 Complete  
**Last Updated:** 2026-04-27

| Phase | Focus | Status |
|-------|-------|--------|
| Phase 1 | Core scaffold, SRS, bug fixes | ✅ Done |
| Phase 2 | Admin pages, accessibility, themes | ✅ Done |
| Phase 3 | Testing, audit logs, E2E suite | ✅ Done |
| Phase 4 | Final SRS, gap analysis, documentation | ✅ Done |
| Phase 5 | Test coverage to 70%, package release | 🔄 In Progress |

---

## Key Metrics

- **React Version:** 19.2.4 (locked)
- **Test Coverage Target:** > 70% (Phase 5)
- **Accessibility:** WCAG 2.1 AA (100% ARIA coverage)
- **Browser Support:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Deployment:** Docker (nginx:alpine)
- **Database:** SQLite (better-sqlite3)
- **Response Time Target:** < 100ms for API endpoints

---

## Files Structure

```
docs/
├── README.md                    # This file (documentation index)
├── USER_GUIDE.md               # For end users
├── ADMIN_GUIDE.md              # For administrators
├── ARCHITECTURE.md             # For architects & developers
├── SRS.md                       # Official specification (IEEE 29148)
├── DEPLOYMENT_GUIDE.md         # For DevOps/deployment
├── CI-CD_TESTING_SETUP.md      # For testing & CI/CD
├── TESTING_GUIDE.md            # Test procedures (if separate)
└── [Diagrams/]                 # SVG architecture diagrams

Root level:
├── CREATION.md                 # Quick project overview
├── CHANGELOG.md                # Version history
├── GAP_ANALYSIS.md             # SRS vs implementation
└── [Other project files]
```

---

## How to Update Documentation

### When Adding a Feature
1. Update the relevant section in [SRS.md](SRS.md)
2. Add implementation notes in [Architecture.md](ARCHITECTURE.md)
3. Document user-facing changes in [User Guide](USER_GUIDE.md)
4. If admin-related, update [Admin Guide](ADMIN_GUIDE.md)

### When Fixing a Bug
1. Update [CHANGELOG.md](../CHANGELOG.md)
2. If behavior changed, update [User Guide](USER_GUIDE.md) or [Admin Guide](ADMIN_GUIDE.md)

### When Deploying
1. Update [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) with any new steps
2. Update version in all documents
3. Add entry to [CHANGELOG.md](../CHANGELOG.md)

---

## Support & Contact

**Documentation Issues?**
- Check the FAQ sections in each document
- Contact: daniel.twum@techbridge.edu.gh

**Technical Issues?**
- Check the Troubleshooting sections (especially [User Guide](USER_GUIDE.md))
- Review the Admin diagnostics pages
- Check application logs ([Admin Guide](ADMIN_GUIDE.md))

**Want to Contribute?**
- Follow the format of existing documents
- Use UK British English spelling
- Keep sections concise and linked
- Add your name/date to the "Last Updated" field

---

## Additional Resources

- **IEEE 29148-2018:** Systems and Software Engineering Standards
- **WCAG 2.1:** Web Content Accessibility Guidelines
- **Playwright:** https://playwright.dev/
- **Vitest:** https://vitest.dev/
- **React 19:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/

---

*Techbridge University College — Fraud Detection Engine v3.0.0*  
*Managed by The Sentinel AI Orchestrator*  
*Questions? Contact: daniel.twum@techbridge.edu.gh*
