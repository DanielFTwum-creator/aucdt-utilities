# TUC ICT Administrator & System Operations Guide
## Document Ref: TUC-ADM-GDE-2026-001
### Organisation: Techbridge University College (TUC), Oyibi, Ghana
### Owner: Daniel Twum, Head of ICT

---

## 1. Introduction
This manual describes the administration, user authentication mechanisms, security policies, and debugging systems of the Techbridge AI Blueprint (TAB). It is designed to ensure seamless handover of development operations to the TUC ICT Directorate.

---

## 2. Admin Credentials and Passcode Architecture
To ensure high-performance client-side security without relying on slow external cloud database lookups, the TAB admin zone is protected via a localized secure passcode gate:

- **Primary Administrator**: Daniel Twum (Head of ICT)
- **Pre-set Passcode**: `TUC-ICT-2026`
- **Security Protocols**:
  - The passcode is verified via safe comparison check loops.
  - Consecutive failures trigger automatic screen timeouts of varying lengths (30s, 60s, 300s) to prevent dynamic brute-forcing scripts.
  - Access status is saved securely in the browser's session parameters.

---

## 3. Using the Interactive Sandbox Admin Hub
Once logged into the Admin Zone, the console exposes multiple crucial diagnostic tabs:

### 3.1 Live Health & Telemetry Controls
Shows real-time indicators modeling our Plesk / Nginx containers on-campus:
- Plesk Node state (Online)
- MariaDB engine latency (2ms)
- Audio system output states (Web Audio context worker states)
- Global volume dials.

### 3.2 Dynamic Theme Settings
Allows testing how visually impaired students interact with special themes:
- **Standard Soft Sand**: Intended for general daylight lessons.
- **Midnight Charcoal**: Tailored to prevent eye-strain during evening research.
- **High-Contrast Amber**: Meets strict WCAG accessibility guidelines, featuring bold high-luminance amber headings on absolute pitch-black backdrops with thick touch target zones.

### 3.3 Incident Logging & Audit Trail
Lists full logs generated under the naming format `TUC-INC-YYYY-NNN`. It tracks:
- User logins (Successful and Failed)
- Configuration adjustments (Theme updates, Mute triggers, Volume swaps)
- Device system attributes and connection IPs.

### 3.4 Interactive Playwright Test Runner Simulator
Enables administrators to click "Execute Full Testsuite" which programmatically initiates a simulated Playwright testing run. This runner prints terminal-level logs and generates a visual canvas-based screenshot capture representing the target state.
