# VortexType — 6R UX Review Directives for Claude Code

**Document type:** UI/UX improvement directives
**Methodology:** 6R Review (Resting, Rhythm, Transition, Response, Streak/Reward, Resilience)
**Benchmark:** Mavis Beacon Teaches Typing — the long-standing reference for touch-typing UX
**Scope:** `src/components/ExerciseTab.tsx` (primary), `src/components/LessonsTab.tsx`, `src/types.ts`, `src/data.ts`
**Source:** Live review of `ai-tools.techbridge.edu.gh/typing-tutor/` (screenshot, 2026-06-14) + code in `ExerciseTab.tsx`

Each section below: **Current state** → **Mavis Beacon gap** → **Directive** (what Claude Code should implement).

---

## R1 — Resting (Home Row Posture)

**Current state:** Static label `ASDF / JKL;` in the 6R hub. No visual hand/finger diagram anywhere on screen.

**Mavis Beacon gap:** MB shows an animated pair of hands over the keyboard at all times, with the active finger highlighted before each keystroke. This is the single most recognisable element of the MB experience and the primary teaching aid for posture.

**Directives:**
1. Add a persistent on-screen hand diagram (SVG, 10 fingers, both hands) positioned below or beside the virtual keyboard in `ExerciseTab.tsx`.
2. Highlight the finger that should strike `nextTargetChar` (reuse the existing `getFingerGuidance()` output — it already returns `hand` and `finger`, just isn't rendered visually as hands).
3. On idle (`!isStarted`), show both hands resting on ASDF/JKL; as a static "ready position" cue.

---

## R2 — Rhythm (Metronome)

**Current state:** Dropdown selector (OFF / 40 / 60 / 80 / 100 / 120 BPM), shows "Not Synced" when off. Plays a tick sound and pulses a small dot when active.

**Mavis Beacon gap:** MB doesn't use a metronome — its rhythm cue comes from a steady, low-friction cadence built into lesson pacing rather than an explicit tempo control. The current implementation is fine conceptually but the indicator is too small/peripheral to be useful while typing.

**Directives:**
1. Keep the metronome (it's a genuine value-add over MB), but move the visual beat indicator (the pulsing dot) closer to the typing input field — currently it's in the header, far from where the user's eyes are during practice.
2. Default to "OFF" is correct (don't force rhythm training on users) — no change needed there.
3. Persist the user's last-selected BPM and tone across sessions (localStorage or `UserProgress`), since `handleReset` currently doesn't reset these — confirm this persistence is intentional and document it.

---

## R3 — Transition (Finger Trajectory)

**Current state:** Text-only readout: `Middle (D)` plus a "Trajectory Path" sentence describing the reach. The virtual keyboard below highlights the next key.

**Mavis Beacon gap:** MB pairs the keyboard highlight with the hand-diagram finger highlight (see R1) — the text description in VortexType is good supplementary detail but isn't how people actually parse "which finger do I move."

**Directives:**
1. This becomes redundant once R1's hand diagram is built — the same `getFingerGuidance()` call drives both. No new logic needed, just a second renderer (hands) consuming the existing data.
2. Shorten the "Trajectory Path" sentence on mobile widths — at `sm:hidden` it currently truncates with `title=` tooltip, which is unusable on touch devices. Replace with an icon + finger name only below `sm`.

---

## R4 — Response (Audio Feedback)

**Current state:** Synth Tick / Mecha-Clack / Silent dropdown. Correct keystrokes play a tone; errors play a buzz; success plays a two-note chime.

**Mavis Beacon gap:** MB's audio feedback is subtle and optional, used mainly for error correction sounds — not a constant per-keystroke tone. Continuous per-character ticking (current default `synth-tick`) can become fatiguing over a multi-minute lesson and is a known accessibility complaint pattern for typing apps.

**Directives:**
1. Re-evaluate the default `audioMode`. Recommend defaulting to `"none"` for correct keystrokes, keeping the error buzz (`playErrorBuzz`) and success chime (`playSuccessChime`) regardless of mode — these map to MB's actual behaviour (feedback on mistakes/completion, not on every correct key).
2. Add a visible (non-audio) feedback channel for users with sound off: a brief colour flash on the current character cell (`exerciseChar-{index}`) on error, since `muteAudio` currently removes *all* feedback for those users.

---

## R5 — Streak / Reward (Combo & Points)

**Current state:** Combo counter (`0x (Max: 0x)`) with colour escalation at 5x and 15x. Points formula: `accuracy*10 + wpm*2 + min(250, maxCombo*5)`.

**Mavis Beacon gap:** MB has no combo/streak mechanic — it uses certificates, accuracy/speed graphs over time, and lesson completion badges. The combo system here is a reasonable modernisation, but currently resets to `0x (Max: 0x)` on every practice change (`handleReset` runs on `currentPracticeIdx` change), so users never see a session-level or all-time max.

**Directives:**
1. Separate "current drill combo" (resets per practice, as now) from "session best combo" and "all-time best combo" — store the latter in `UserProgress` (which already has `bestAccuracy`/`bestSpeed` — add `bestCombo` following the same pattern).
2. Surface session/all-time bests somewhere visible (lesson map or a small badge in the 6R hub) so the streak mechanic has persistence value, matching MB's "your best" framing on its progress charts.

---

## R6 — Resilience (Calibration / Error Recovery)

**Current state:** On completing a drill with ≥1 typo, the user is auto-diverted into a "Calibration Mode" remediation drill built from the specific keys they got wrong (`wrongKeys`), shown with an amber alert banner.

**Mavis Beacon gap:** This is actually *more* sophisticated than MB, which simply re-runs the same lesson on failure. Keep this — it's a genuine differentiator. The gap is discoverability and framing.

**Directives:**
1. The amber "R6 Cognitive Calibration Alignment Active" banner uses internal-system language ("Cognitive Calibration Alignment") that won't mean anything to a student. Reword to plain language, e.g. "Quick fix-up: let's drill the keys you missed (D, K) before moving on."
2. Currently *any* typo (even 1 out of 50 chars at 98% accuracy) triggers full remediation. Add a threshold — e.g. only trigger calibration if accuracy on the completed drill fell below a configurable bar (suggest 90%, but confirm with stakeholder) — otherwise near-perfect runs get unnecessarily interrupted.
3. Calibration drills are generated as `repeats + comboSet + reversed` — verify this doesn't produce unreasonably long strings when `wrongKeys.length` is large (e.g. 5+ distinct wrong keys on a long passage); cap remediation string length.

---

## Cross-Cutting / General

1. **Color contrast in dark mode**: `text-zinc-650`, `dark:text-rose-450`, `bg-zinc-850` are not standard Tailwind shades (Tailwind's default scale stops at 50/100/.../900/950, with no `*50`/`*450`/`*650` steps) — these will silently fail to apply unless defined as custom values in `tailwind.config`. Audit and fix.
2. **Mobile keyboard guide**: the virtual keyboard (`keyboardRows`) scales down to `w-7 h-7` on small screens — verify legibility and tap-target size (44px minimum per existing `min-h-[44px]` convention used on buttons elsewhere in this file) isn't violated, since the virtual keyboard itself isn't tappable but sits close to the input.
3. **`usedPracticeIndices` stale closure risk**: inside the `setTimeout` in `handleInputChange`, `usedPracticeIndices` is read from the outer closure — if a user completes a drill faster than the 600ms timeout and triggers another change, this could read stale state. Verify with a quick test (rapid completion of two short drills back-to-back) before relying on the "no immediate repeat" guarantee.

---

## Suggested Implementation Order

1. R4 default audio change (smallest, highest immediate UX impact — 1 line)
2. R6 banner copy + accuracy threshold (copy change + small logic gate)
3. R1/R3 hand diagram (new SVG component, shared by both sections — largest task)
4. R5 best-combo persistence (extends `UserProgress` + `AdminTab`/lesson map display)
5. Cross-cutting Tailwind class audit (run in parallel, mechanical — good Haiku task)
