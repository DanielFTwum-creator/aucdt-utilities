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
