# App Store Pre-Submission Readiness Audit
## Document Ref: TUC-MBL-RDY-2026-001
### Project: Techbridge AI Blueprint [TAB] — App Store Gates Verification
### Organisation: Techbridge University College (TUC), Oyibi, Ghana

---

This checklist establishes the final verification gating questions that must be certified by Daniel Twum, Head of ICT, before submitting the packaged Capacitor application builds to Apple App Store Connect or Google Play Console.

---

## 1. Store Compliance Verification Dashboard

| Security Gate Item | Status | Verified Component | Actions / Notes |
| :--- | :---: | :--- | :--- |
| **Privacy Policy Integration** | [ ] | `/public/privacy.html` | Deploy at public URL: `https://tab.techbridge.edu.gh/privacy.html`. |
| **Gated Demo Credentials** | [ ] | Test Passcode `TUC-ICT-2026` | Disclose in "App Review Information" box so reviewers can access administrative panels. |
| **W3C WCAG Accessibility** | [ ] | Standard 7:1 Contrast Colors | Verify High Contrast orange-on-black layout functions perfectly. |
| **Alpha Alpha-Channel Stripping** | [ ] | iOS launcher icon assets | Confirm the 1024x1024 master app icon is fully flattened without an alpha transparent layer. |
| **Volatile Audio Drivers** | [ ] | Low-Latency Web Audio API | Double check that audio initializes after a visible click interaction to prevent background sound blocking. |
| **Simulated Logs Purging** | [ ] | Hard LocalStorage Reset | Run "Reset Base Configurations" to clear administrative trial logs from the retail bundle. |

---

## 2. Estimated Submission & Approval Timeline

The following represents the typical operational timeline for deploying academic applications from Ghana:

```
Day 1: Compilation  --->  Day 2: Internal Test  --->  Day 3: Store Upload  --->  Day 4-6: Review Mode  --->  Day 7: Public Release
[Package Capacitor    [Audit ARIA elements      [Push builds to App      [Reviewers check        [TAB App goes live
 AAB & Xcode archives]  and verify volume dials] Store & Play Console]   credentials / privacy]   globally on both stores]
```

1. **Step 1: Production Compiles (1 Day)**: Generate APK / AAB and iOS Archives using the guides in `/docs/MOBILE_BUILD_GUIDE.md`.
2. **Step 2: Campus Internal Gating (1 Day)**: Distribute testing builds via TestFlight (iOS) and Google Play Internal Sharing.
3. **Step 3: Console Submission (1 Day)**: Upload graphics, descriptions, target lists, and bundle binaries.
4. **Step 4: Store Compliance Review Period (2 - 3 Days)**:
   - Google Play: Manual and automated reviews checking for age ratings and data policies.
   - Apple App Store Connect: Strict manual review assessing licensing rights forSteve Ferraris' curriculum and iPad responsive screen rendering.
5. **Step 5: Production Roll-Out (1 Day)**: Live release on Google Play and Apple App Store.

---

## 3. Immediate Post-Approval Operational Checklist

Once the application is live:
- Create promotional physical posters displaying QR-code download links around the TUC Oyibi campus.
- Confirm the public support contact box (`ict@techbridge.edu.gh`) is monitored daily for academic user inquiries.
- Setup a bi-weekly cron check on the host Plesk dashboard to audit reverse proxy health logs.
