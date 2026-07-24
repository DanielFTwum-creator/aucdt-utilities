# TUC AI Lab Catalog — User Guide

**For students, staff, and visitors browsing TUC's AI tools**

---

## What is the AI Lab?

The TUC AI Lab Catalog is the central hub for finding and opening Techbridge University College's AI tools and web apps. Instead of remembering dozens of separate addresses, you open one page and launch whichever tool you need from there (`src/App.tsx:412`, index page title "TUC AI Lab Catalog").

## Opening it

Go to `https://ai-tools.techbridge.edu.gh/ai-lab/` (`tuc-ai-lab-catalog/CONSTRAINTS.md:16`, `index.html:24,44`).

## Signing in

Every page of the AI Lab sits behind a sign-in screen (`src/components/AppWithAuth.tsx:6-10`). You'll see two ways in:

- **Continue with Google** — the button that works reliably. It sends you to Google, then back through TUC's own relay to sign you in (`src/components/LoginView.tsx:9-32`, `server.ts:37-54`).
- **Username/email and password**, with a "Sign up" link to create an account — this form is present on the sign-in screen (`src/components/FormLoginView.tsx:181-241`). At the time of this review the requests it sends (`/api/auth/login`, `/api/auth/register`) don't have a matching handler in the app's server code, so this path is unlikely to complete a sign-in. **Use "Continue with Google."**

Once signed in, your session is remembered on that device, so you won't normally see the sign-in screen again.

To sign out, scroll to the bottom of the page and use **Sign out** in the footer bar (`src/App.tsx:486`).

## Finding your way around

At the top of the page:

- A search box (also repeated lower down under the hero banner).
- **AI Lab Tools** — the main tool browser (what this guide covers).
- **App Catalog** — a separate, more technical view listing every app in TUC's fleet along with build/standardisation status and links to its source code. It's aimed at ICT staff rather than day-to-day tool use; most people can ignore it (`src/App.tsx:309, 352-355`, `src/components/AppCatalog.tsx`).
- **Contact Lab** — a button for reaching the AI Lab team. As of this review it isn't wired up to an email or form yet, so clicking it currently does nothing (`src/App.tsx:310`).

Below that, a scrolling strip shows a handful of tools on a loop — click any of them to open its details (`src/App.tsx:320-349`).

## Browsing by category

Category tabs sit under the search box: **All, AI & ML, Academic, Creative, Dev Tools, Business, Admin, Games**. Each tab shows how many tools are in it. Click a tab to filter the list to that category (`src/App.tsx:64-72, 231, 376-403`).

## Searching

Type into either search box (they're the same search — typing in one updates the other). The search checks each tool's name, its description, and its internal slug for your text; it is a straightforward text match, not an AI-driven request parser, even though the box invites you to "describe what you need" (`src/App.tsx:257-266, 297-306, 360-373`).

## Featured Tools

When you land on the catalog with no search or category filter applied, a **Featured Tools** section appears above the main list, highlighting nine tools: BioChemAI, Dictation App, markAI, OmniExtract, PlayGrow, TechBridge AI Blueprint, Glucose, Math Island Typing, and Touch Typing Tutor (`src/App.tsx:410-420`). These are picked by hand rather than by any automatic ranking.

## Launching a tool

Click a tool's card to open a detail panel with a description and a **Launch App** button, or use the **Launch** button directly on the card in the grid. Either way, the tool opens in a new browser tab at its own address on `ai-tools.techbridge.edu.gh` (`src/App.tsx:513-561, 588-621, 656-664`).

If a tool in the catalog isn't yet live, its button reads **Coming Soon** and can't be clicked (`src/App.tsx:553-557, 615-618`). In practice, every tool currently listed in the browsable catalog is live, so you shouldn't see this.

When you have more results than fit on screen, use **Load more** at the bottom of the list to reveal more tools 24 at a time (`src/App.tsx:446-467`).

## Contacting the Lab

The **Contact Lab** button in the top bar is intended for this, but does not currently trigger any action (see above). Until that's wired up, reach TUC ICT directly at daniel.twum@techbridge.edu.gh.

---

*This document is generated from the code, not from memory.*
