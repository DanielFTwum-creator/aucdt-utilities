# CREATION.md â€” BionicSkinsâ„¢
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/bionicskinsâ„¢/`
**Last verified:** 2026-04-25

---

## 1. What This App Is

BionicSkinsâ„¢ is a **medical technology company website** for a prosthetic skin/limb solutions brand. It is a multi-page marketing site with content management via Firebase Firestore. Admins can create/edit blog posts and amputee resources. Patients can submit referral forms and contact requests. All data flows through Firebase â€” there is no separate backend server.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** |
| Build | Vite | ^7 |
| Language | TypeScript | ~5.8 |
| Router | React Router DOM | ^7 |
| Styling | Tailwind CSS | ^4.2 |
| Icons | lucide-react | latest |
| Animation | motion (framer-motion v12 standalone) | latest |
| AI | `@google/genai` | latest |
| Database | Firebase Firestore | latest |
| Auth | Firebase Auth | latest |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine â†’ nginx:alpine | â€” |

---

## 3. Directory Structure

```
src/
â”œâ”€â”€ App.tsx               # React Router routes (no auth wrapper â€” admin page self-guards)
â”œâ”€â”€ main.tsx
â”œâ”€â”€ index.css
â”œâ”€â”€ lib/
â”‚   â””â”€â”€ firebase.ts       # initializeApp(config) â†’ export db, auth
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Header.tsx        # Top nav: logo + navigation links + mobile hamburger
â”‚   â”œâ”€â”€ Footer.tsx        # Contact info + social links + copyright
â”‚   â”œâ”€â”€ HeroSection.tsx   # Large image hero with CTA
â”‚   â”œâ”€â”€ ContentSection.tsx # Reusable text + image section
â”‚   â”œâ”€â”€ ValuesAccordion.tsx # Expandable values/FAQs
â”‚   â”œâ”€â”€ NewsSection.tsx   # Latest blog posts preview
â”‚   â”œâ”€â”€ BlogList.tsx      # All blog posts grid
â”‚   â”œâ”€â”€ BlogEditor.tsx    # Firestore-backed blog post editor (admin)
â”‚   â”œâ”€â”€ ResourceList.tsx  # Amputee resources list
â”‚   â”œâ”€â”€ ResourceEditor.tsx # Firestore-backed resource editor (admin)
â”‚   â””â”€â”€ ui/               # Shared UI primitives (Button, Card, Badge, etc.)
â””â”€â”€ pages/
    â”œâ”€â”€ Home.tsx              # Hero + company overview + blog preview
    â”œâ”€â”€ Technology.tsx        # Product/tech showcase
    â”œâ”€â”€ OurBlog.tsx           # Blog listing (BlogList component)
    â”œâ”€â”€ BecomeAPatient.tsx    # Patient intake form (saves to Firestore)
    â”œâ”€â”€ AmputeeResources.tsx  # Resource library (ResourceList)
    â”œâ”€â”€ ReferAPatient.tsx     # Clinician referral form (saves to Firestore)
    â”œâ”€â”€ ClinicalTrials.tsx    # Clinical trial information + sign-up form
    â”œâ”€â”€ ContactUs.tsx         # Contact form (saves to Firestore)
    â”œâ”€â”€ Policies.tsx          # Privacy policy and terms
    â””â”€â”€ AdminDashboard.tsx    # CMS: blog + resources + form submissions
```

---

## 4. Routes

```
/                   â†’ Home
/about              â†’ Home (same component, scrolls to about section)
/technology         â†’ Technology
/our-blog           â†’ OurBlog
/become-a-patient   â†’ BecomeAPatient
/amputee-resources  â†’ AmputeeResources
/refer-a-patient    â†’ ReferAPatient
/clinical-trials    â†’ ClinicalTrials
/contact-us         â†’ ContactUs
/policies           â†’ Policies
/admin              â†’ AdminDashboard (guarded: Firebase Auth sign-in required)
```

---

## 5. Firebase Configuration (firebase-applet-config.json)

```json
{
  "projectId": "...",
  "appId": "...",
  "apiKey": "...",
  "authDomain": "...",
  "firestoreDatabaseId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "measurementId": "..."
}
```

> Loaded in `src/lib/firebase.ts`. The `firestoreDatabaseId` field is used to target a non-default Firestore database:
> `getFirestore(app, config.firestoreDatabaseId)`

---

## 6. Firestore Collections

| Collection | Documents | Notes |
|---|---|---|
| `blog_posts` | id, title, content, author, publishedAt, tags[], imageUrl, published | Admin creates/edits; public reads |
| `amputee_resources` | id, title, description, category, fileUrl, createdAt | Admin manages |
| `patient_forms` | Submitted BecomeAPatient forms | Admin read-only |
| `referral_forms` | Submitted ReferAPatient forms | Admin read-only |
| `contact_submissions` | Submitted ContactUs forms | Admin read-only |
| `clinical_trial_signups` | ClinicalTrials sign-ups | Admin read-only |

---

## 7. Admin Dashboard (pages/AdminDashboard.tsx)

**Access:** Firebase Auth email/password sign-in. Admin credentials managed in Firebase Console.

Features:
- **Blog tab:** List posts + create/edit via `BlogEditor` modal. Calls Gemini to draft content.
- **Resources tab:** List/edit amputee resources via `ResourceEditor`.
- **Submissions tab:** View all form submissions (patient, referral, contact, trials).

**Admin Auth guard:** Check `firebase.auth().currentUser` on mount. If null â†’ redirect to `/admin` sign-in form.

---

## 8. Gemini AI Feature

Used in `BlogEditor.tsx`:
- "âœ¨ Draft with AI" button: sends post title/topic to Gemini â†’ returns full blog post draft
- User edits before saving to Firestore

---

## 9. Colour Tokens

```css
/* Medical / clinical aesthetic */
--color-primary:     #0a2342;   /* deep navy */
--color-accent:      #00b4d8;   /* medical teal/blue */
--color-accent-alt:  #90e0ef;   /* light teal highlight */
--color-bg:          #ffffff;
--color-bg-alt:      #f0f9ff;   /* very light blue tint */
--color-text:        #1a1a2e;
--color-text-muted:  #5f6b7c;
--color-border:      #bde0fe;
```

---

## 10. ARIA Requirements

- `Header`: `role="banner"`
- `Footer`: `role="contentinfo"`
- Main landmark: `<main id="main-content">`
- Skip link: `<a href="#main-content" className="sr-only focus:not-sr-only">`
- Navigation: `<nav aria-label="Main navigation">`
- All form inputs: `<label htmlFor>` with matching `id`
- All icon buttons: `aria-label`
- Blog post cards: `aria-label="Read post: {title}"`
- Form submission feedback: `role="alert"` on error, `role="status"` on success

---

## 11. Firestore Security Rules (firestore.rules)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blog posts: public read, admin write
    match /blog_posts/{doc} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null;
    }
    // Resources: public read, admin write
    match /amputee_resources/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Form submissions: write-only for public, read for admin
    match /{collection}/{doc} {
      allow create: if collection in ['patient_forms','referral_forms','contact_submissions','clinical_trial_signups'];
      allow read: if request.auth != null;
    }
  }
}
```

---

## 12. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build is error-free |
| AC-2 | Home page renders with Hero, blog preview, and values sections |
| AC-3 | OurBlog page loads posts from Firestore (or empty state) |
| AC-4 | BecomeAPatient form submits to `patient_forms` collection |
| AC-5 | Admin login via Firebase Auth grants access to dashboard |
| AC-6 | Admin can create/edit a blog post via BlogEditor |
| AC-7 | Gemini "Draft with AI" generates blog content |
| AC-8 | Firestore rules prevent unauthenticated writes to admin collections |
| AC-9 | Skip link, all form label associations, and icon button aria-labels are present |
