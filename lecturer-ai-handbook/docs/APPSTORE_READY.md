# APP STORE READY — PRE-SUBMISSION STATUS SHEET
## DOCUMENT REF: TUC-PRE-SUB-2026
### INSTITUTION: Techbridge University College (TUC), Oyibi, Ghana

---

## 1. PRE-SUBMISSION COMPLETION CHECKLIST

| ID | Checklist Task / Objective | Platform | Responsible Party | Status |
| :--- | :--- | :--- | :--- | :--- |
| **01** | Connect and register `com.techbridge.lecturerai` App ID | Apple Developer Portal | TUC ICT Directorate | [ ] PENDING |
| **02** | Secure Let's Encrypt SSL Certifications for public routes | Plesk Ingress Server | TUC ICT Directorate | [x] COMPLETE ✅ |
| **03** | Compile `capacitor.config.ts` configuration files | Project Workspace | Lead Mobile Engineer | [x] COMPLETE ✅ |
| **04** | Verify GDPR, CCPA, and GDPA (Act 843) compliant `privacy.html` | `/public/privacy.html` | TUC Legal Council | [x] COMPLETE ✅ |
| **05** | Add Capacitor iOS and Android packages to compilation | `package.json` | Lead Mobile Engineer | [x] COMPLETE ✅ |
| **06** | Synthesize launcher icons, adaptive layers, and splashes | `/assets/` | ICT Design Team | [ ] PENDING |
| **07** | Generate Apple App Store Connect application metadata record | App Store Connect | TUC ICT Directorate | [ ] PENDING |
| **08** | Generate Google Play Console store presence listing | Play Console | TUC ICT Directorate | [ ] PENDING |
| **09** | Confirm 100% linter and production compiler outputs | Node.js Environment | Lead Developer | [x] COMPLETE ✅ |

---

## 2. TIMELINE ESTIMATE & MILESTONES

| Milestone Target | Estimated Duration | Target Date | Risk Level | Mitigation Plan |
| :--- | :--- | :--- | :--- | :--- |
| **M1: Assets & Icons Creation** | 1 - 2 Business Days | 14 July 2026 | Low | Standard template layout using corporate TUC navy/gold colors |
| **M2: Developer Accounts Prep** | 2 - 3 Business Days | 17 July 2026 | Medium | Ensure D-U-N-S verification is complete to avoid delay |
| **M3: Native IDE Sync & Compile** | 1 Business Day | 18 July 2026 | Low | Test locally in Xcode and Android Studio simulators |
| **M4: Store Metadata Uploads** | 1 Business Day | 19 July 2026 | Low | Map predefined descriptions and upload compiled packages |
| **M5: Store Review Verdict** | 2 - 5 Business Days | 24 July 2026 | High | Provide valid test credentials to bypass login gateways |
| **M6: Production Release** | Instant rollout | 25 July 2026 | Low | Announce to faculty in upcoming workshop |

---

## 3. IMMEDIATE NEXT STEPS
To move forward with app store publishing, Daniel Twum and the TUC team should:
1.  **Host the Privacy Policy**: Deploy `/public/privacy.html` to `https://techbridge.edu.gh/lecturer-ai/privacy.html`.
2.  **Generate the Assets**: Design the 1024x1024 px master logos and run `npx capacitor-assets generate`.
3.  **Perform Device Testing**: Follow the simulator testing sequences outlined in our deployment manuals.
