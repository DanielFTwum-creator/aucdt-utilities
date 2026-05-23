# PRE-SUBMISSION QA READINESS CHECKLIST
## Document ID: TUC-INC-2026-007
### App Deployment Standard Checklist

Before shipping to Apple App Store or Google Play Store, the QA engineer must verify and check the list below:

---

## 1. Core Functions Deployment Checklist

- [ ] **Lessons Sequence Navigation Check:** Level 1 to 10 are loaded, interactive panels function, and completion of lessons correctly bumps the user's level and logs the event.
- [ ] **Precision Key Typing Module:** Active character highlights correctly, mistakes trigger red markers, space behaves as separator, and final WPM/accuracy match math specifications.
- [ ] **Speed Practice Session:** Text selection loading remains stable, and complete submissions output statistical blocks correctly.
- [ ] **Type Rally Game Modes:** Difficulty toggles (Easy, Medium, Hard) correctly adjust points weights, timers decrement, word completion increments scores, and Game-Over states trigger gracefully.
- [ ] **Security Administrator Lock:** Password gating allows proper entry of Head of ICT only, database / logs panel renders correctly, logs load active entries, and log cleanup clears historical entries.

## 2. Platform Packaging Sync Checklist

- [ ] **Capacitor Configuration Setup:** Bundle Identifier matches `com.techbridge.typingtutor` and target web static resource points to `dist`.
- [ ] **Node Script Configuration Check:** `package.json` contains full sync and open commands:
  - `build` -> compiler hooks.
  - `mobile:sync` -> compiles and mirrors files to native wrappers.
- [ ] **Multi-Theme Storage Presets:** Light, Dark, and High-Contrast settings preserve selection through view redirections and active reloads.
- [ ] **Device Aspect Adaptive Scale Touch Targets:** Menu triggers have heights exceeding 44px, spacing prevents overlapping, and typing boxes don't overflow on small screens.

---

## 3. Timeline Forecast & Actions

### Sprint Milestone Steps
1. **Week 1: Local Alpha Testing:** Distribute build internally at Techbridge College to 20 test students. Analyze accuracy, typing speed ranges, and log consistency.
2. **Week 2: Beta Distribution:** Provision Apple TestFlight and Android Internal Closed Testing track. Push to 100 students of Daniel Twum.
3. **Week 3: Production Submission:** Upload app assets, metadata sheets, configure public policy references, submit app bundles, and await Store verification approvals (typically 2-4 business days).
