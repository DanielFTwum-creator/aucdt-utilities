bash

mkdir -p /mnt/user-data/outputs && cat > /mnt/user-data/outputs/CLAUDE.md << 'HEREDOC'
# BioChemAI — Claude Code Directives
# Techbridge University College · TUC AI Lab
# Generated via 6R + 5 Whys + Final Review analysis

---

## Project overview

BioChemAI is an adaptive AI teaching assistant for biochemistry education,
deployed at ai-tools.techbridge.edu.gh/biochemai/. It is part of the TUC AI Lab
catalog (95 tools). The stack is a web-based chat interface with voice, quiz,
docs, and test modes. The agent backend calls the Anthropic API.

Current state: dark navy UI, standalone (no SSO), browser-only session storage.
Target state: light-themed, TUC-branded, course-aware, SSO-integrated.

---

## Bash commands

- `npm run dev`        : Start local dev server
- `npm run build`      : Production build
- `npm run typecheck`  : Run TypeScript checks (run after every set of changes)
- `npm run test`       : Run full test suite
- `npm run test:watch` : Watch mode for TDD
- `npm run lint`       : ESLint check
- `npm run lint:fix`   : Auto-fix lint errors

Always run `npm run typecheck && npm run lint` before marking a task complete.

---

## Tech stack

- Framework  : React 18 + TypeScript (strict mode)
- Styling    : Tailwind CSS — use utility classes, no inline styles
- State      : Zustand (see src/stores/)
- API client : Anthropic SDK via server-side Next.js API routes only
               — never expose API keys client-side
- Auth       : TUC SSO (OAuth 2.0) — see src/lib/auth.ts
- DB         : PostgreSQL via Prisma — see prisma/schema.prisma
- Testing    : Vitest + React Testing Library

---

## Brand & design tokens

The TUC brand palette must be used consistently. Never use generic
purple/blue defaults from Tailwind without checking against these tokens:

  --tuc-navy    : #1a1f3c   (topbar, KPI strip, chat header)
  --tuc-crimson : #8b1a1a   (primary CTA buttons, active nav, accents)
  --tuc-gold    : #f5c518   (highlights, badges, hover states)
  --tuc-off     : #f7f5f0   (page background)
  --tuc-white   : #ffffff   (card backgrounds)
  --tuc-border  : #e2e0d8   (all dividers and card borders)

Typography:
  - Headings and CTAs: 'Barlow Condensed', font-weight 700, uppercase
  - Body: system sans-serif, font-weight 400/500 only — never 600 or 700
  - Min font size: 11px

Do NOT use a dark background for the page canvas. The UI must support
extended study sessions (light theme only).

---

## Code style

- ES modules (import/export) — never CommonJS require()
- Destructure imports: `import { useState, useEffect } from 'react'`
- Functional components with hooks only — no class components
- Strict TypeScript — no `any`, no `// @ts-ignore`
- File naming: PascalCase for components, camelCase for utilities
- One component per file
- Co-locate tests: `ComponentName.test.tsx` next to `ComponentName.tsx`
- Tailwind class order: layout → spacing → typography → color → interactive

---

## Architecture rules

### API calls
- All Anthropic API calls go through `src/lib/api/biochemai.ts`
- Never call the API directly from a React component
- Always include the learning level and course context in every API request
- System prompt lives in `src/prompts/biochemai.system.ts` — edit there only

### Session & auth
- Session persistence uses TUC SSO — NOT localStorage or sessionStorage
- Browser storage is legacy; remove any remaining references
- Auth state is in `src/stores/authStore.ts`
- Unauthenticated users see a read-only demo mode (3 free questions)

### Learning level
- Learning level is a GLOBAL persistent state (Zustand), not component-local
- It must be visible in the header at all times — never buried in the chat area
- Valid values: 'primary' | 'secondary' | 'undergraduate' | 'postgraduate'
- Every API call must include the current learning level

### Diagram rendering
- SVG/diagram responses render in a dedicated right-hand pane (split view)
- Chat text goes left (min 380px), diagram pane goes right (flex 1)
- Diagram pane has fullscreen toggle and download (PNG + SVG) buttons
- If no diagram in response, right pane collapses; chat takes full width

---

## UI/UX directives (from 6R analysis)

### P1 — Critical (implement first)

1. THEME: Replace all dark navy page backgrounds with var(--tuc-off).
   Cards use white. Navy is only for the topbar and KPI strip.

2. LEARNING LEVEL CONTROL: Move the learning level selector to the
   persistent header, immediately right of the BioChemAI logo.
   It must always be visible — never scroll out of view.

3. NAV ACTIVE STATE: The top nav (Chat / Voice / Quiz / Docs / Test)
   must show a clear active state. Use a bottom border in --tuc-crimson
   on the active tab. Icon-only buttons must have aria-label attributes.

4. THINKING INDICATOR: Replace "BioChemAI is thinking •••" with a
   streaming first-words preview. Show the first 5–8 tokens as they
   arrive so students know a response is forming.

### P2 — High priority

5. POST-RESPONSE CURIOSITY PROMPTS: After every answer, append 2–3
   "Explore further" chips (e.g. "What triggers this pathway?",
   "How does this differ at postgraduate level?"). Generate these
   from the topic + current learning level via a second lightweight
   API call. Store in `src/lib/api/followUpPrompts.ts`.

6. SPLIT-PANE DIAGRAM VIEW: Implement ResizablePanelGroup from
   react-resizable-panels. Left: chat thread. Right: diagram renderer.
   The pane only appears when the API response contains an SVG block.
   Add fullscreen (F key), download PNG, download SVG buttons.

7. CONVERSATION THREAD LAYOUT:
   - Student messages: right-aligned, background tinted --tuc-gold at 15% opacity
   - BioChemAI messages: left-aligned, white card, navy avatar with "BC" initials
   - Add copy-to-clipboard button on each BioChemAI response
   - Add thumbs up/down feedback on each response (log to analytics)

8. TOPIC CHIPS — ENHANCED: Each Popular Topics chip needs:
   - Subject colour coding: enzymes=teal, genetics=purple,
     metabolism=amber, structure=blue, replication=coral
   - Difficulty badge: Beginner / Intermediate / Advanced
   - Hide the chips row after the user's first message (save vertical space)

### P3 — Standard

9. KPI BAR REDESIGN: Replace dark KPI tiles with white metric cards.
   Replace static "10,000+" with a live counter from the analytics API.
   Replace "98% accuracy" with "Learning streak" and "Topics explored"
   — these are pedagogically meaningful; accuracy is a marketing metric.

10. SESSION HISTORY SIDEBAR: Add a collapsible left sidebar showing
    past sessions (title = first question asked, date, learning level).
    Sessions persist via TUC SSO, visible across devices.

11. VOICE MODE MODAL: Voice button opens a full modal (not inline).
    Modal contains: waveform visualiser, live transcript preview,
    push-to-talk vs continuous toggle, cancel button.
    Use the Web Speech API with a server-side Whisper fallback.

12. ECOSYSTEM LINK STRIP: At the bottom of every session, show a
    contextual "Other TUC AI Lab tools you might find useful" strip.
    Pull from the AI Lab catalog API filtered by 'Academic' category.
    Max 3 tools shown. Links to ai-tools.techbridge.edu.gh/ai-lab/.

---

## Testing requirements

- Every new component requires a .test.tsx file before implementation (TDD)
- Test coverage must stay above 80%
- Write tests for: API error states, loading states, empty states
- Accessibility tests: use jest-axe on every page-level component
- Run `npm run test` and confirm all pass before committing

---

## Git workflow

- Branch naming: `feature/description`, `fix/description`, `chore/description`
- Commit message format: `type(scope): description` (conventional commits)
- Never commit to main directly — always PR
- Never commit secrets, API keys, or .env files
- Run typecheck + lint before every commit

---

## File structure (reference)

src/
  components/
    CLAUDE.md          ← component conventions, prop patterns
    layout/            ← Header, Sidebar, SplitPane, StatusBar
    chat/              ← MessageThread, MessageBubble, TypingIndicator
    input/             ← ChatInput, VoiceModal, LearningLevelSelect
    topics/            ← TopicChips, TopicChip
    diagrams/          ← DiagramPane, DiagramToolbar
    kpi/               ← KpiBar, KpiCard, LearningStreak
  lib/
    CLAUDE.md          ← API patterns, auth requirements
    api/
      biochemai.ts     ← main Anthropic API wrapper
      followUpPrompts.ts ← curiosity prompt generator
      catalogTools.ts  ← TUC AI Lab catalog API
    auth.ts            ← TUC SSO integration
  prompts/
    biochemai.system.ts ← master system prompt (edit here only)
  stores/
    authStore.ts        ← TUC SSO auth state
    sessionStore.ts     ← current session + history
    uiStore.ts          ← learning level, pane states, theme
  pages/ (or app/)
    CLAUDE.md          ← routing conventions

---

## What NOT to do

- Do NOT use localStorage or sessionStorage for session data
- Do NOT call the Anthropic API from client-side components
- Do NOT use dark backgrounds on the page canvas
- Do NOT hardcode the learning level — always read from uiStore
- Do NOT skip typecheck before committing
- Do NOT @-import large documentation files into CLAUDE.md
- Do NOT add more than 5–8 MCP servers (context window cost)
- Do NOT use any, @ts-ignore, or eslint-disable without a comment
- Do NOT use class components or HOCs
- Do NOT skip accessibility attributes (aria-label, role, alt)

---

## Quick-start for a new feature

1. Create a new branch: `git checkout -b feature/your-feature`
2. Ask Claude to interview you with AskUserQuestion before writing any code
3. Write the spec to SPEC.md
4. Write tests first (TDD)
5. Implement against tests
6. Run: `npm run typecheck && npm run lint && npm run test`
7. Commit with conventional commit message
8. Open PR — do not merge without passing CI

---

## Links

- Live tool      : https://ai-tools.techbridge.edu.gh/biochemai/
- AI Lab catalog : https://ai-tools.techbridge.edu.gh/ai-lab/
- AI Blueprint   : https://ai-tools.techbridge.edu.gh/blueprint/
- TUC main site  : https://techbridge.edu.gh
- Anthropic docs : https://docs.anthropic.com
HEREDOC

echo "✓ CLAUDE.md written successfully"
wc -l /mnt/user-data/outputs/CLAUDE.md
Output

✓ CLAUDE.md written successfully
259 /mnt/user-data/outputs/CLAUDE.md
Done

