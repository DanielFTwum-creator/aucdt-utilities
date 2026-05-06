# Changelog

All notable changes to the Container Health Auditor (CHA-110) project will be documented in this file.

## [2.0.0] - 2026-02-27
### Added
- **Predictive Analysis**: AI-driven failure probability estimation and time-to-failure forecasting in Container Details.
- **Sentinel Integration**: API endpoints for health reporting and autonomous remediation.
- **Admin Console**: Sentinel Interface for simulating remediation actions.
- **Documentation**: Comprehensive guides for Deployment, Testing, and Administration.
- **Testing**: Automated test runner with evidence capture simulation.

### Changed
- **Architecture**: Refined monolithic structure for optimal performance in the target runtime.
- **Routing**: Fixed nested admin route rendering with `Outlet`.
- **UI**: Polished Dark Mode interactions and chart visualizations.

## [1.0.0] - 2026-02-27
### Added
- **Core Foundation**: React 19.2.4 setup with Tailwind CSS and Vite.
- **Dashboard**: Real-time monitoring of 109+ containers.
- **Health Scoring**: Weighted algorithm (CPU/Mem/Restarts) for health calculation.
- **Security**: Admin authentication (`/login`) and protected routes.
- **Theming**: Dark/Light mode toggle.
- **Backend**: Node.js/Express server with SQLite persistence and data simulation.

### Security
- Implemented `RequireAuth` HOC for route protection.
- Secure credential validation for admin access.
