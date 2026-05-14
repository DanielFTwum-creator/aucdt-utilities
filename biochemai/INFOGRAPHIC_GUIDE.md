# BiochemAI Infographic Integration Guide

Google-style infographics are now integrated into BiochemAI responses. Use this guide to enhance educational content with visual step-by-step illustrations.

---

## Quick Start

Include an infographic in your response by adding a comment block with this structure:

```markdown
## Topic Heading

Some introductory text.

<!-- infographic
title: "3 steps to understand X"
steps:
  - icon: "🎯" label: "First step\nexplanation"
  - icon: "⚡" label: "Second step\nhere" (emphasis)
  - icon: "✅" label: "Final step\nresult"
-->

Detailed explanation continues after the infographic...
```

---

## Syntax

### Comment Block
```
<!-- infographic
[infographic definition]
-->
```

### Title
```
title: "[sentence-case title, max 40 chars]"
```

### Steps
```
steps:
  - icon: "[emoji]" label: "[line 1]\n[line 2]"
  - icon: "[emoji]" label: "[line 1]\n[line 2]" (emphasis)
  - icon: "[emoji]" label: "[line 1]\n[line 2]"
```

**Notes:**
- Use `\n` to break label into two lines
- Add `(emphasis)` to mark ONE step as filled blue circle (the most important)
- Use emoji or Unicode symbols for icons

---

## When to Use

Infographics work well for:

| Use Case | Example |
|---|---|
| Pathway steps | "3 stages of glycolysis" |
| Reaction mechanism | "2 steps to enzyme binding" |
| Comparison | "DNA replication vs transcription" |
| Process flow | "4 phases of meiosis" |
| Molecular change | "Protein folding cascade" |

---

## Icon Recommendations

| Concept | Emoji | Alternative |
|---|---|---|
| Input / Start | 🎯 | 📍 🔍 |
| Process / Action | ⚡ | 🔄 ⚙️ |
| Output / Result | ✅ | 🎁 💡 |
| Bond formation | 🔗 | ⛓️ 🔀 |
| Breakage | ✂️ | 💥 ⚔️ |
| Movement | ➡️ | 🚀 ↗️ |
| Molecule | 🧬 | 🧪 ⚛️ |
| Cell | 🫀 | 🧫 🫧 |
| Question | ❓ | 🤔 |
| Checkmark | ✓ | 👍 ✨ |

---

## Examples

### 3-Step DNA Replication

```markdown
## DNA Replication Process

DNA replication occurs in three main phases:

<!-- infographic
title: "3 stages of DNA replication"
steps:
  - icon: "🔓" label: "Helicase\nunwinds"
  - icon: "➕" label: "Polymerase\nadds bases" (emphasis)
  - icon: "✅" label: "Ligase\nseals"
-->

Each stage is essential...
```

### 2-Step Enzyme Catalysis

```markdown
## Enzyme Mechanism

<!-- infographic
title: "2 steps to enzyme action"
steps:
  - icon: "🎯" label: "ES complex\nforms"
  - icon: "⚡" label: "Product\nreleased" (emphasis)
-->

The enzyme-substrate complex is the key...
```

### 4-Step Photosynthesis

```markdown
## Light-Dependent Reactions

<!-- infographic
title: "4 steps of photosynthesis"
steps:
  - icon: "☀️" label: "Light\nabsorption"
  - icon: "💧" label: "Water\nsplit"
  - icon: "⚡" label: "ATP & NADPH\nproduction" (emphasis)
  - icon: "✅" label: "Electron\ntransport"
-->

The light reactions occur in the thylakoid...
```

---

## Rendering Rules

1. **Infographics render before the content** — The SVG appears inline, responsive to viewport.
2. **Title pill overlaps the container** — Design follows Google Media Lab standard.
3. **One step is emphasized** — Filled blue circle with white icon, marks the central/most important step.
4. **Labels are centered** — 2 lines max, sentence case.
5. **Responsive sizing** — Infographic scales with container width.

---

## CSS Customization (Dark Mode)

For dark theme support, the component uses standard color values. To customize:

```css
/* In index.html or your CSS */
:root {
  --color-background-info: #C9D9F0;
  --color-text-secondary: #3C3C3C;
  --color-text-primary: #1A1A1A;
}

html[data-theme='ocean'] {
  --color-background-info: #1e3a5f;
  --color-text-secondary: #a0c4ff;
  --color-text-primary: #e0e0e0;
}
```

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Infographic not rendering | Check syntax: `<!-- infographic` not `<!--infographic` |
| Icons displaying incorrectly | Use common emoji; some complex Unicode may not render |
| Label overflow | Keep labels under 20 chars per line; use `\n` for breaks |
| Title too long | Limit to 40 characters, use abbreviations if needed |

---

## Advanced: Custom Icons

For Tabler icons instead of emoji, replace in the React component:

```tsx
// In GoogleInfographic.tsx
<text x={cx} y="145" textAnchor="middle" fontSize="28">
  {step.icon === "check" ? <IconCheck size={28} /> : step.icon}
</text>
```

Import Tabler icon component and use icon names as identifiers.

---

## Best Practices

✅ **Do:**
- Use 2–4 steps max
- Keep labels under 10 words total
- Emphasize the central/most important step
- Use meaningful emoji that relate to the process
- Place infographics after introductory text

❌ **Don't:**
- Mix emoji styles (use either all emoji or all Tabler icons)
- Use ALL CAPS in labels
- Emphasize more than one step
- Place infographics before explaining context
- Use unclear or unrelated icons

---

## Integration with Gemini Responses

When BiochemAI's Gemini service returns educational content, instructors can manually add infographic directives to structured responses:

```markdown
## Protein Structure

The protein folds through several mechanisms...

<!-- infographic
title: "4 levels of protein structure"
steps:
  - icon: "🧬" label: "Primary:\namino acids"
  - icon: "🔀" label: "Secondary:\nα-helices" (emphasis)
  - icon: "🎯" label: "Tertiary:\nfolds"
  - icon: "🔗" label: "Quaternary:\nsubunits"
-->
```

This bridges Gemini's text-based responses with visual scaffolding.
