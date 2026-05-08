# Verb Explorer Toolkit — Pre-Launch Checklist

**Target Launch Date:** Q3 2026  
**Version:** 1.0.0  
**Platforms:** iOS (App Store) + Android (Google Play Store)

---

## ✅ Phase 1: Development (COMPLETE)

- [x] React + TypeScript app built
- [x] Capacitor configured for iOS/Android
- [x] All 4 steps functional (Choose → Research → Create Card → Present)
- [x] Print functionality working
- [x] Timer feature implemented
- [x] Responsive design (mobile-first)
- [x] Local storage working
- [x] No external API calls (except optional future Gemini integration)

---

## 📋 Phase 2: Metadata & Assets (IN PROGRESS)

### App Branding
- [x] App name finalized: "Verb Explorer"
- [x] Bundle ID created: `com.techbridge.verbexplorer`
- [x] Version set: `1.0.0`
- [x] App icon created: `public/app-icon.svg`
- [ ] High-resolution app icon (1024×1024 PNG for stores)
- [ ] App description written (50 chars short + full description)
- [ ] Keywords identified for App Store/Play Store

### Screenshots & Marketing
- [ ] iPhone 6.7" screenshot 1 — Verb selection screen
- [ ] iPhone 6.7" screenshot 2 — Research input screen
- [ ] iPhone 6.7" screenshot 3 — Manila card profile
- [ ] iPhone 6.7" screenshot 4 — Presentation timer
- [ ] iPhone 6.7" screenshot 5 — Completed card print
- [ ] Android 6.7" versions (same content, different aspect ratio)
- [ ] Feature highlight graphic (1200×500 for Play Store)
- [ ] Promotional banner (1024×500 for App Store)

### Documentation
- [x] Privacy Policy created (`PRIVACY_POLICY.md`)
- [x] Deployment Guide created (`DEPLOYMENT_GUIDE.md`)
- [x] Web App Manifest created (`public/manifest.webmanifest`)
- [ ] Terms of Service (if needed)
- [ ] Support email established (privacy@techbridge.edu.gh)

---

## 🧪 Phase 3: Testing (PENDING)

### Functionality Testing
- [ ] All 4 steps tested on iOS device (iPhone 12 minimum)
- [ ] All 4 steps tested on Android device (Android 8.0 minimum)
- [ ] Text input validation (no crashes on long text)
- [ ] Print functionality tested (Safari print dialog)
- [ ] Timer accuracy verified (countdown is correct)
- [ ] Data persistence verified (data survives app restart)
- [ ] Data deletion verified (uninstall deletes all data)
- [ ] Offline functionality verified (no internet required)

### UI/UX Testing
- [ ] Responsive layout on small screens (iPhone SE)
- [ ] Responsive layout on large screens (iPad)
- [ ] Touch targets are 44×44 minimum (iOS) / 48×48 (Android)
- [ ] Text is readable (minimum 16sp font size)
- [ ] Color contrast passes WCAG AA standard
- [ ] Keyboard navigation works (iOS/Android accessibility)
- [ ] Screen reader compatibility (VoiceOver / TalkBack)

### Performance Testing
- [ ] App launch time < 2 seconds
- [ ] Memory usage stable (no leaks detected)
- [ ] Battery consumption acceptable
- [ ] Storage requirement < 50MB
- [ ] Works on 2G/3G connectivity (app is local-only, so no internet needed)

### Security Testing
- [ ] No hardcoded credentials in app
- [ ] No sensitive data in debug logs
- [ ] HTTPS used for any future API calls
- [ ] App permissions requested appropriately
- [ ] Keystore file (.keystore) NOT in git repository
- [ ] Environment variables used for secrets

---

## 📱 Phase 4: Platform Preparation

### iOS (App Store)
- [ ] Xcode project set up and builds successfully
- [ ] Provisioning profile created in Apple Developer account
- [ ] App ID registered: `com.techbridge.verbexplorer`
- [ ] Test on TestFlight (beta testing)
- [ ] Screenshots uploaded (6.7-inch minimum)
- [ ] Privacy policy URL provided
- [ ] App Review Information filled in
- [ ] Contact email: daniel.twum@techbridge.edu.gh

### Android (Google Play Store)
- [ ] Android Studio project set up and builds successfully
- [ ] Keystore file generated (stored securely, NOT in git)
- [ ] Release APK/AAB signed correctly
- [ ] App ID registered: `com.techbridge.verbexplorer`
- [ ] Screenshots uploaded (1080×1920 minimum)
- [ ] Privacy policy URL provided
- [ ] Content rating completed (ESRB / IARC)
- [ ] Contact email: daniel.twum@techbridge.edu.gh

---

## 🎯 Phase 5: Pre-Submission Review

### Code Quality
- [ ] No TypeScript errors (`npm run lint`)
- [ ] No console errors or warnings
- [ ] No unused variables or imports
- [ ] Code follows project standards
- [ ] Comments are clear and concise

### Documentation
- [ ] README.md updated with current info
- [ ] DEPLOYMENT_GUIDE.md reviewed and tested
- [ ] PRIVACY_POLICY.md matches app behavior
- [ ] Inline code comments added for complex logic

### Legal
- [ ] Privacy Policy reviewed by legal (if required)
- [ ] Terms of Service reviewed (if required)
- [ ] COPPA compliance verified (kids app)
- [ ] GDPR compliance verified (if targeting EU)

---

## 🚀 Phase 6: Submission (NOT YET)

### Pre-Submission (24 hours before)
- [ ] Final build created (`npm run build`)
- [ ] Final sync to native projects (`npm run cap:sync`)
- [ ] Final test on physical devices
- [ ] Screenshots double-checked
- [ ] Description and metadata proofread

### iOS Submission
- [ ] Archive created in Xcode
- [ ] Uploaded to App Store Connect
- [ ] Metadata verified in App Store Connect
- [ ] Submission initiated
- [ ] Review status monitored (24-48 hours)
- [ ] Respond to any rejection feedback immediately

### Android Submission
- [ ] APK/AAB uploaded to Google Play Console
- [ ] Store listing completed
- [ ] Metadata verified in Play Console
- [ ] Submission to Production track
- [ ] Review status monitored (2-4 hours)
- [ ] Respond to any rejection feedback immediately

---

## 📊 Phase 7: Post-Launch (AFTER APPROVAL)

### Monitoring
- [ ] Monitor crash reports daily (first week)
- [ ] Monitor crash reports weekly (after first week)
- [ ] Read and respond to user reviews
- [ ] Track download numbers
- [ ] Track user retention metrics
- [ ] Gather feedback from teachers/parents

### Updates
- [ ] Plan v1.0.1 bug fixes (if any issues found)
- [ ] Plan v1.1.0 features (AI verb discovery, etc.)
- [ ] Establish update schedule (quarterly minimum)

### Marketing
- [ ] Announce launch on TUC website
- [ ] Share with Class 4 teachers
- [ ] Create promotional materials
- [ ] Gather testimonials from early users

---

## 🔗 Key Resources

| Document | Status | Link |
|----------|--------|------|
| Privacy Policy | ✅ Complete | `PRIVACY_POLICY.md` |
| Deployment Guide | ✅ Complete | `DEPLOYMENT_GUIDE.md` |
| App Manifest | ✅ Complete | `public/manifest.webmanifest` |
| .gitignore | ✅ Complete | `.gitignore` |
| Capacitor Config | ✅ Complete | `capacitor.config.ts` |

---

## 👥 Responsible Parties

| Task | Owner | Email |
|------|-------|-------|
| Overall Project | Daniel Twum | daniel.twum@techbridge.edu.gh |
| iOS Deployment | Daniel Twum | daniel.twum@techbridge.edu.gh |
| Android Deployment | Daniel Twum | daniel.twum@techbridge.edu.gh |
| Privacy/Legal | TUC Legal | ict@techbridge.edu.gh |
| Marketing | TUC Marketing | marketing@techbridge.edu.gh |

---

## 📅 Timeline

| Phase | Target Date | Status |
|-------|-------------|--------|
| Development | 2026-05-08 | ✅ Complete |
| Testing | 2026-05-15 | ⏳ Pending |
| Screenshots | 2026-05-20 | ⏳ Pending |
| Beta (TestFlight/Internal) | 2026-05-25 | ⏳ Pending |
| Final Review | 2026-06-01 | ⏳ Pending |
| **App Store Submission** | **2026-06-05** | ⏳ Pending |
| **Play Store Submission** | **2026-06-05** | ⏳ Pending |
| **Live on Stores** | **2026-06-15** | ⏳ Pending |

---

## ⚠️ Known Limitations (v1.0.0)

- No cloud sync (all data local to device)
- No user accounts or login
- No multiplayer/sharing features
- No AI verb discovery (planned for v1.1)
- No offline lesson content (app itself is offline, just no built-in lessons)
- Print feature requires local printer

---

## 🎓 Notes for Teachers

When this app launches:
1. Distribute via App Store (iOS) or Play Store (Android)
2. Students install and work independently
3. Each student's data is private to their device
4. Print the Manila card profile for classroom display
5. No internet required — works fully offline
6. One-time install, no recurring fees

---

*Last Updated: 2026-05-08*  
*Prepared by: Techbridge ICT Department*
