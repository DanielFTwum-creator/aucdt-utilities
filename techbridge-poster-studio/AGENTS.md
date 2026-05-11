# Techbridge Ad Poster Generator — 6R Aesthetic Enhancement Directive

**Version:** 1.0  
**Scope:** All five layout formats — Landscape 4:3, Square 1:1, Portrait 3:4, Cinema 16:9, Story 9:16  
**Reference design:** Retina Master 2.0 / Live Production Preview (aistudio.google.com)

---

## Design System Tokens

| Token | Value | Role |
|---|---|---|
| `--color-background` | `#FAF7F0` | Warm parchment body background |
| `--color-crimson` | `#8C1A2E` | Action zones: strip, CTA button, headline accent |
| `--color-gold` | `#C49A22` | Achievement zones: stats values, eyebrow border, separators |
| `--color-espresso` | `#1A0A06` | Stats bar background |
| `--color-espresso-deep` | `#0F0402` | Story/cinema stats bar (higher contrast) |
| `--color-text-primary` | `#2A1A1A` | Headline roman |
| `--color-text-muted` | `#555555` | Body copy, institution name |
| `--margin-inner` | `24px` | Hard boundary — no element baseline or edge breaches this |
| `--margin-inner-story` | `20px sides / 28px top-bottom` | Story-specific margin |

### Two-colour rule (R6 system constraint)

- **Crimson** (`#8C1A2E`) → urgency strip, CTA button fill, headline italic accent.
- **Gold** (`#C49A22`) → stats bar values, eyebrow border rule, strip separator glyph (`✦`), stat column dividers.

---

## Global Directives

1. **Urgency Strip:** Mixed-case condensed grotesque (Barlow Condensed 500w), letter-spacing −0.04em. Separator `✦` (U+2736) in gold.
2. **CTA Button:** Outline variant on parchment with fill-sweep hover (220ms ease-out). Exception: Story format uses solid fill.
3. **Logo Container:** Rounded-square at rx 18%, 1px crimson border.
4. **Eyebrow:** 2px left border in gold. Tight 10px-22px gap to headline.
5. **Stats Bar:** Values in gold (`#C49A22`) on espresso. Descriptor labels tracked at 0.1em. Vertical dividers 0.5px.
6. **Typography:** Headline stack line-height 0.95. URL in JetBrains Mono Light 300. Institution lockup tracking 0.18em.

---

## Hero Entrance Animation Directive (Sequential Sequence)

To ensure high-production value for video exports and initial load:

| Sequence | Element | Animation | Duration | Delay |
|---|---|---|---|---|
| 0 | Urgency Strip | `animate-slide-down` | 400ms | 0ms |
| 1 | Eyebrow Group | `animate-in-left` | 350ms | 180ms |
| 2 | Headline L1 | `animate-in` (Up) | 420ms | 280ms |
| 3 | Headline L2 | `animate-in` (Up) | 420ms | 380ms |
| 4 | Headline L3 | `animate-in` (Up) | 420ms | 480ms |
| 5 | Identity Group | `animate-in-right` | 380ms | 500ms |
| 6 | CTA Button | `animate-in` (Up) | 380ms | 600ms |
| 7 | Stats Bar | `animate-slide-up` | 440ms | 700ms |

---

## Export Specifications

- **PNG:** High-resolution capture using `html-to-image`.
- **MP4:** 5-second export at 30fps using `VideoEncoder` API and `mp4-muxer`.
- **Motion:** Marquee speed set to 18s linear for urgency.
- **Watermark:** Faint geometric watermark at 4% opacity in espresso allowed for Portrait texture.
