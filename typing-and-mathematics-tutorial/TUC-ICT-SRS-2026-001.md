# IEEE Software Requirements Specification (SRS)
## Document Reference: TUC-ICT-SRS-2026-001

### Project Title: Typing and Math Tutorial (TabQuest Adventures)
**Target Audience**: 9-Year-Old Students struggling with mathematics  
**Design Methodology**: 6R Gamification Framework  
**Revision**: 1.1.0  
**Date**: May 22, 2026  
**Status**: APPROVED / FINAL BASELINE  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the definitive requirements baseline for **Typing and Math Tutorial (TabQuest Adventures)**. This gamified, therapeutic desktop-first educational web application is engineered specifically for 9-year-olds (Grades 3-4) who experience high math anxiety or struggle with standard mathematical worksheets. 
By translating abstract arithmetic operations into kinesthetic finger movements on a standard keyboard, the application simultaneously builds touch typing proficiency and computational confidence.

### 1.2 Scope & the 6R Methodology
TabQuest is implemented as a premium Client-Side Single Page Application (SPA) powered by React, Vite, Tailwind CSS, and Framer Motion. To ensure maximum retention and psychological comfort, the interface is designed around the **6R Gamification Methodology**:
1. **Rules (Structural Governance)**: Simple, well-defined operational mechanics requiring direct equation representation typing to resolve.
2. **Rewards (Reinforcement Engine)**: Stars, virtual gold coins, and high-contrast badge collectibles.
3. **Roadmap (Progression Pathing)**: Visual island coordinates map showing a linear path of unlockable math stepping stones.
4. **Roles (Custom Companionship)**: Purchaseable premium avatars/companion licenses that dynamically alter coaching speeches, dialogue tips, and supportive feedback.
5. **Real-time Feedback (Sensory Loop)**: Active on-screen keyboard key glowing indicators, crimson warning states, and custom synthesizer waveforms (Sine, Square, Triangle, Sawtooth, Mute).
6. **Repetition (Strengthening Mechanics)**: Visual tracking dashboards with historic WPM and Accuracy performance charts to encourage self-directed replaying.

### 1.3 Definitions, Acronyms, and Abbreviations
- **TUC**: Techbridge University College.
- **TAB**: Techbridge AI Blueprint.
- **WPM**: Words Per Minute (custom-calibrated for mathematical equation terms).
- **Home Row**: The standard resting typing keys (ASDF JKL;).
- **Synth**: Browser Web Audio synthesized wave generators mimicking nostalgic arcade soundchips.

---

## 2. System Architecture & 6R Implementations

### 2.1 Rules (Structural Boundaries)
Students cannot simply guess arithmetic answers. They are governed by strict input constraints:
- Input capture intercepts all keyboard actions.
- The equation must be typed exactly from left-to-right (including numbers, operators like `+`, `-`, `*`, `/`, and `=`).
- Correct keystrokes forward the cursor; mistakes trigger immediate warning borders.
- Maintaining consecutive correct hits triggers a combusting streak counter which doubles coin distribution scores.

### 2.2 Rewards (Interactive Store Loop)
Completing level drills rewards the learner:
- Each completed stepping stone yields **3 Stars** and base gold coins.
- Gold coins can be brought into the interactive **Sticker Shop** tab inside the backpack.
- High-contrast stickers are collected inside the backpack, serving as permanent visual achievements.

### 2.3 Roadmap (Strategic Island Map)
The map screen displays an archipelago representing standard levels:
- Stepping stones are linked continuously to show clear development.
- Higher stones (addition, subtraction, fractions, cosmic blitz) stay locked until the prerequisite total stars count is gained.
- Hover states and tactile bouncing indicators guide kids to their active stepping stones.

### 2.4 Roles (Persona Companions)
The chosen companion updates the mascot speech module and dialogue tips. Standard and premium companions are mapped:
- 🐱 **Coach Tabby**: Standard gentle tutor comforting beginners.
- 🦊 **Aero the Solar Fox**: Fast-paced speed booster instructing mechanical postures.
- 🦄 **Glimmer the Unicorn (Premium Shop Unlock - 20 Coins)**: Rainbow magical motivator soothing anxiety.
- 🦖 **Rexy the Dino (Premium Shop Unlock - 25 Coins)**: Prehistoric enthusiastic stomper boosting momentum.
- 👽 **Zog the Alien (Premium Shop Unlock - 30 Coins)**: Planetary scientist teaching math vectors.

### 2.5 Real-time Sensory Feedback
To satisfy children with diverse auditory thresholds and sensory processing profiles:
- An **on-screen interactive visual keyboard** guides finger placement, lighting up target coordinates in neon green.
- A **real-time audio synthesizer mode selector** is housed permanently in the top navigation bar. Children can toggle between Smooth Sine waves, Tactile Triangles, Retro Squares, Sawtooth Lasers, or complete Mute.

### 2.6 Repetition & Reinforcement
A custom analytics card tracks typing metrics relative to chronological drill codes:
- A local database persisted via browser `localStorage` records speed trajectories (WPM) and calculation correctness (Accuracy %).
- Visual performance bar charts stimulate children to repeat completed stepping stones to beat high scores.

---

## 3. Specific Interface & Functional Requirements

### 3.1 Mathematical Zones Requirements
- **Zone 1: Counting Castle (Stone 1)**: Single item counting. Home row row digits 1-5.
- **Zone 2: Addition Arcade (Stone 2)**: Double-color adding ten-frames. Captures `+` and `=` characters.
- **Zone 3: Subtraction Submarine (Stone 3)**: Pop bubbles representing subtraction terms. Captures `-` and `=`.
- **Zone 4: Multiplication Meadows (Stone 4)**: Equal groups arrays. Captures `*` and `=`.
- **Zone 5: Fraction Forge (Stone 5)**: Shaded pizza pie fractions. Captures fraction divides `/`.
- **Zone 6: Cosmic Math-Blitz (Stone 6)**: Unified speed arpeggios. High velocity.

---

## 4. System Attributes & Verification Criteria
- **Accessibility**: High-contrast slate backgrounds (slate-950) paired with legible text colors ensuring AAA readability score standards.
- **Synthesizer Performance**: Zero-overhead Web Audio Context osc engines ensuring instant tactile clicks with no audio lag.
- **Storage**: Client-isolated cookie-less secure browser JSON storage.
- **Baseline Integrity**: The application must compile perfectly with zero linting warnings using `npm run lint`.
