# Google-Style Infographic — Design Directive Template

A reusable spec sheet for illustrating any `[IDEA]` in the Google Media Lab 3-step infographic format.

---

## Visual Anatomy

| Element | Description |
|---|---|
| **Container** | Soft blue-gray rounded rect (rx 16–24px). Transparent or white background behind it. |
| **Title pill** | White pill with subtle shadow, centered and overlapping the container's top edge. Sentence-case label. |
| **Icon circles** | White circles, 64–80px diameter. Icon inside is blue-themed. Equal spacing between all circles. |
| **Labels** | 2–4 word phrases centered under each circle. 2 lines max. Muted text, 13px. |

---

## Design Tokens

### Color

| Token | Value | Usage |
|---|---|---|
| Container fill | `#C9D9F0` at 55% opacity | Outer rounded rect background |
| Icon circle fill | `#FFFFFF` | Default circle background |
| Accent / primary icon | `#4285F4` | Icon color on white circles |
| Filled circle (emphasis) | `#4285F4` bg + `#FFFFFF` icon | Highlight the most important step |
| Title pill background | `#FFFFFF` | Pill behind the title |
| Label text | `#3C3C3C`, weight 400 | Step labels below icons |
| Title text | `#1A1A1A`, weight 500 | Text inside the title pill |

### Spacing & Sizing

| Property | Value |
|---|---|
| Container border-radius | 16–24px |
| Container padding | 24–32px horizontal, 20–28px vertical |
| Icon circle diameter | 64–80px |
| Gap between icon columns | 40–60px (uniform) |
| Label max-width | ~120px per column |
| Title pill padding | 8px 20px |
| Title pill border-radius | 99px (full pill) |

### Typography

| Property | Value |
|---|---|
| Title pill font | Google Sans / sans-serif, 15px, weight 400 |
| Step labels | Google Sans, 13–14px, weight 400, center-aligned |
| Max label lines | 2 lines per step |
| Capitalization | Sentence case — never ALL CAPS or Title Case |

---

## Layout Rules

1. **Title pill is outside the container** — it sits above, overlapping the top edge. Never place it inside.
2. **Icons are evenly spaced** in a single horizontal row. For 3 items: equal thirds. For 2 items: quarter–half–quarter.
3. **One filled (solid blue) circle** marks the most important or central step. All others are white.
4. **cx position formula** for N steps in a 600px-wide container (x=40 to x=640):
   ```
   cx = 40 + 600 / (N + 1) × i    where i = 1 … N
   ```
   - 2 steps: cx = 210, 430
   - 3 steps: cx = 190, 340, 490
   - 4 steps: cx = 160, 280, 400, 520

---

## SVG Template

```svg
<svg width="100%" viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="pill-shadow" x="-10%" y="-30%" width="120%" height="160%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.10"/>
    </filter>
  </defs>

  <!-- Container -->
  <rect x="40" y="52" width="600" height="185" rx="20"
        fill="#C9D9F0" fill-opacity="0.55"/>

  <!-- Title pill (overlaps top edge of container) -->
  <rect x="210" y="32" width="260" height="38"
        rx="19" fill="white" filter="url(#pill-shadow)"/>
  <text x="340" y="56" text-anchor="middle"
        font-family="'Google Sans', sans-serif" font-size="15" fill="#1A1A1A">
    [TITLE]
  </text>

  <!-- Step 1 — white circle -->
  <circle cx="190" cy="132" r="36" fill="white"/>
  <text x="190" y="140" text-anchor="middle"
        font-size="28" fill="#4285F4">[ICON_1]</text>
  <text x="190" y="192" text-anchor="middle"
        font-family="'Google Sans', sans-serif" font-size="13" fill="#3C3C3C">
    [STEP_1_LABEL_LINE_1]
  </text>
  <text x="190" y="208" text-anchor="middle"
        font-family="'Google Sans', sans-serif" font-size="13" fill="#3C3C3C">
    [STEP_1_LABEL_LINE_2]
  </text>

  <!-- Step 2 — filled circle (emphasis) -->
  <circle cx="340" cy="132" r="36" fill="#4285F4"/>
  <text x="340" y="140" text-anchor="middle"
        font-size="28" fill="#FFFFFF">[ICON_2]</text>
  <text x="340" y="192" text-anchor="middle"
        font-family="'Google Sans', sans-serif" font-size="13" fill="#3C3C3C">
    [STEP_2_LABEL_LINE_1]
  </text>
  <text x="340" y="208" text-anchor="middle"
        font-family="'Google Sans', sans-serif" font-size="13" fill="#3C3C3C">
    [STEP_2_LABEL_LINE_2]
  </text>

  <!-- Step 3 — white circle -->
  <circle cx="490" cy="132" r="36" fill="white"/>
  <text x="490" y="140" text-anchor="middle"
        font-size="28" fill="#4285F4">[ICON_3]</text>
  <text x="490" y="192" text-anchor="middle"
        font-family="'Google Sans', sans-serif" font-size="13" fill="#3C3C3C">
    [STEP_3_LABEL_LINE_1]
  </text>
  <text x="490" y="208" text-anchor="middle"
        font-family="'Google Sans', sans-serif" font-size="13" fill="#3C3C3C">
    [STEP_3_LABEL_LINE_2]
  </text>
</svg>
```

---

## BiochemAI Integration

When rendering educational content, BiochemAI can embed infographics by including SVG blocks marked with `<!-- infographic -->` tags:

```
## How Enzyme Catalysis Works

<!-- infographic
title: "3 steps to enzyme action"
steps:
  - icon: "🎯" label: "Enzyme binds\nsubstrate"
  - icon: "⚡" label: "Catalyzes\nreaction" (emphasis)
  - icon: "✅" label: "Releases\nproduct"
-->

[markdown content follows...]
```

---

## Step-by-Step: Adapting to a New Concept

1. **Define your message** — Distill the concept into 2–4 steps.
2. **Pick icon metaphors** — Use symbolic emojis or Tabler icon names.
3. **Write the title pill** — Format: `"[N] [nouns] to [outcome]"` (sentence case).
4. **Calculate cx positions** using the formula above.
5. **Render as SVG** in markdown with `<!-- infographic -->` wrapper.

---

## Variations

| Variation | How to adapt |
|---|---|
| 2 steps | cx = 210, 470; increase circle radius to 40px |
| 4 steps | cx = 160, 280, 400, 520; reduce circle radius to 30px |
| Numbered badges | Replace icon with `<text>` showing step number |
| Dark mode | Swap `#C9D9F0` → CSS variable `var(--color-background-info)` |
| Interactive | Wrap in React component with click handlers per step |

---

**When to use infographics in BiochemAI responses:**
- Explaining multi-step biochemical pathways
- Comparing reaction mechanisms
- Breaking down molecular structures
- Illustrating enzyme function
- Describing cellular processes
- Showing drug interaction steps
