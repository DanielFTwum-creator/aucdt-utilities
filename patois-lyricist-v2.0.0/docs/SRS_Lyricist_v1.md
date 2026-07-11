# Software Requirements Specification — Lyricist v1

| Field | Value |
|---|---|
| **Document ID** | TUC-ICT-SRS-2026-017 |
| **Product** | Lyricist (evolution of Patois Lyricist v2.0.0) |
| **Author** | Daniel Frempong Twum / TUC ICT |
| **Date** | 2026-07-11 |
| **Status** | Draft — awaiting sign-off |
| **Standard** | IEEE 29148 (light) |

---

## 1. Purpose & rationale

Patois Lyricist currently generates **only Jamaican Reggae/Dancehall** — the engine is a single hardcoded "Reggae Teacha" system prompt. Under the fleet's guiding principle (**#ai-for-good**), a tool that celebrates one diaspora idiom is narrow. **Lyricist v1** generalises it into a songwriting studio that centres **Ghanaian and African musical heritage** (Highlife, Hiplife, Afrobeats, Gospel, Amapiano) alongside Patois and global styles — serving TUC's students and community directly, and honouring the lineage of deep-melanated artists rather than impersonating them.

## 2. Scope

**In v1:** a Genre selector, a Language selector, and Genre-scoped artist-lineage Personas, composed into the generation prompt by a new **data-driven genre-pack engine**. The rename of the product face to **Lyricist**.

**Explicitly out of v1:** melody/audio generation, per-language grammar validation, user-saved custom personas, and changing the `/patois/` URL slug (kept to avoid infra churn).

## 3. Current state (baseline)

- `services/geminiService.ts` (472 lines) holds the entire engine inline: `BANNED_PHRASES`, `REGIONAL_PLACES/ITEMS`, `METAPHOR_DOMAINS`, `RHYTHM_RULES`, `STAGE_DIRECTION_RULES`, `HOOK_RULES`, `PROVERB_POOL`, 10 Dancehall personas, the **6R protocol**, a **self-audit** block, and a **two-pass critique** — all Jamaica-specific.
- No `constants.ts`. Shared scaffolding and genre content are entangled.
- UI (`App.tsx`) exposes `djPersona`, rhyme scheme, and song structure — but genre/language are fixed.

## 4. Proposed architecture

Separate the **genre-agnostic engine** from **per-culture content packs**.

### 4.1 Data model (new `constants/` module)

```ts
interface Persona {         // archetype + lineage (never "impersonate")
  id: string;
  label: string;            // e.g. "The Storyteller"
  lineage: string;          // e.g. "in the Highlife tradition of Daddy Lumba"
  direction: string;        // vocal/method-acting guidance
}

interface GenrePack {
  id: string;               // 'reggae' | 'highlife' | ...
  label: string;
  producerFraming: string;  // "You are a ___ producer scripting ___"
  regionalPlaces: string[]; regionalItems: string[];
  lexicon: string;          // slang/idioms specific to the culture
  rhythmRules: string; hookRules: string; stageRules: string;
  proverbs: string[];       // culturally relevant (e.g. Akan for Highlife)
  bannedPhrases: string[];  // per-genre anti-cliché firewall
  personas: Persona[];
}

interface LanguagePack {    // drives diction/code-switching
  id: string;               // 'en' | 'tw' | 'ga' | 'ee' | 'pcm'
  label: string;            // English · Twi · Ga · Ewe · Pidgin
  dictionGuidance: string;
}
```

### 4.2 Composition

`buildSystemInstruction(genrePack, languagePack, persona, memory)` composes:
**shared scaffolding** (6R protocol, brevity mandate, self-audit, structure, rhyme, memory/anti-repeat) **+ genre pack** (framing, regional reality, lexicon, rhythm/hook, proverbs, banned list) **+ language pack** (diction) **+ selected persona**. The two-pass critique stays shared.

This makes **adding a genre a data-only change** (a new `GenrePack` object) — no engine edits.

## 5. v1 catalog

### 5.1 Genres (8)
Highlife · Hiplife · Afrobeats · Ghanaian Gospel · Amapiano · Reggae/Dancehall (Patois, ported) · Hip-Hop · Pop/Soul

### 5.2 Languages (5)
English · Twi · Ga · Ewe · Pidgin

### 5.3 Persona roster (archetype — lineage framing)

| Genre | Personas (label — in the tradition of) |
|---|---|
| Highlife | The Originator — E.T. Mensah · The Sweet Balladeer — Daddy Lumba · The Elder — Amakye Dede · The Simigwa Man — Gyedu-Blay Ambolley |
| Hiplife | The Grandpapa — Reggie Rockstone · The Moralist — Obrafour · The Rapperholic — Sarkodie · The Diasporan Poet — M.anifest |
| Afrobeats | The Pioneer — Fela Kuti · The Griot — Burna Boy · The Melodist — Wizkid · The Queen Mother — Angélique Kidjo |
| Ghanaian Gospel | The Praise Leaders — Tagoe Sisters · The Worshipper — Cwesi Oteng · The Anthemist — Diana Hamilton |
| Amapiano | The Log-Drum Architect — Kabza De Small · The Curator — DJ Maphorisa · The Bacardi Rapper — Focalistic · The Yanos Vocalist — Sha Sha |
| Reggae/Dancehall | The Prophet — Bob Marley · The Fire Chanter — Burning Spear · The Deejay Don — Buju Banton · The New Roots — Chronixx |
| Hip-Hop | The Wordsmith — Nas · The Conscious Soul — Lauryn Hill · The Storyteller-Laureate — Kendrick Lamar |
| Pop/Soul | The Quiet Storm — Sade · The Genius — Stevie Wonder · The Entertainer — Michael Jackson |

*(Amapiano roster curated per "best practice preferred"; all editable.)*

## 6. UI changes (`App.tsx`, `index.html`)

- Add **Genre** and **Language** dropdowns; make the existing persona dropdown **genre-scoped** (repopulates from the selected `GenrePack.personas`).
- Rename the product face to **Lyricist** (title, header, splash). Plumbing identifiers (folder, PM2 `patois-lyricist`, URL `/patois/`, WMS `app=patois`) unchanged.

## 7. Preserved (no change)

WMS SSO, self-serving-Node serving, port 3017, the deploy pipeline; rhyme-scheme, song-structure, two-pass critique, memory/anti-repeat, export, themes, accessibility.

## 8. Phasing (recommended)

- **v1.0** — the data-driven engine + language toggle + UI + rename + **4 flagship packs authored to depth**: Reggae/Patois (ported), Highlife, Afrobeats, Ghanaian Gospel. Build, smoke-test each, deploy.
- **v1.1** — add Hiplife, Amapiano, Hip-Hop, Pop as **data-only** `GenrePack` additions (no engine change), each smoke-tested.

Rationale: ships a working, Ghana-forward Lyricist fast, proves the architecture, and keeps each cultural pack carefully authored rather than eight shallow ones at once.

## 9. Success criteria

- Selecting any live genre × language × persona produces on-idiom lyrics that pass the shared self-audit and anti-cliché firewall.
- Reggae/Patois output is unchanged in quality from today (regression check).
- `tsc && vite build` clean; each live genre smoke-tested before deploy.
- No infra change; deploy via `.\deploy.ps1 -Build`.

---
*Per CLAUDE.md workflow: SRS (this doc) → engine + flagship packs → tests/docs → gap analysis. UK English, IEEE 29148.*
