# PlayGrow — Smart Fun for Bright Minds

PlayGrow is an AI-for-Good educational game platform for young learners. Children explore a World Map of seven learning zones and play 21 fully interactive mini-games that make artificial intelligence tangible through direct, playful experience. Every game pairs core curriculum skills — literacy, numeracy, movement, emotional intelligence, and creativity — with accessible explanations of real AI applications, delivered through the persistent Airi robot companion.

## Quick Start

```bash
cd playgrow-smart-fun-for-bright-minds
pnpm install
pnpm run dev   # http://localhost:5173
```

## Game Inventory

All 21 games are fully implemented. None require a backend or API key during normal play.

| Game (Component) | Zone | Route ID | Mechanic | AI-for-Good Angle |
|---|---|---|---|---|
| **PuzzleBuilder** | Brainy Town | `puzzle` | Drag-and-drop 4-piece jigsaw; 5 puzzles | Computer vision — teaching AI to recognise objects |
| **PatternPath** (Train the Robot) | Brainy Town | `pattern` | Simon-says colour sequence; 5 levels, 5 colours, 3 lives | Sequence learning and pattern recognition in AI |
| **FindMatch** (Sort It Out) | Brainy Town | `match` | Memory card flip; 6 pairs from pool of 24; AI-for-good facts per match | How AI is used for good in everyday life |
| **PaintWorld** | Art Meadow | `paint` | Free canvas; 14-colour palette, 3 brush sizes, eraser; 8 rotating AI challenges | AI-generated art and creative tools |
| **BuildItBlocks** | Art Meadow | `build` | Drag 8 geometric shape types onto canvas; 6 challenges; undo/clear/done | Spatial reasoning in AI and robotics |
| **StoryMaker** | Art Meadow | `story` | Pick WHO/DID/WHERE from 30×30×30 world-literature pool; copy/export | How AI learns language from millions of stories |
| **ReadWithMe** | Talky Treehouse | `read` | 5 passages; word-by-word highlight; tap word to advance; 1 comprehension question per passage | AI text-to-speech and reading assistance tools |
| **RhymeRace** | Talky Treehouse | `rhyme` | 16-pair pool; 8 random rounds; speed bonus under 3 seconds | AI phonics and speech recognition |
| **WordFinder** | Talky Treehouse | `word` | 6 emoji scenes; tap correct item; 3 tries = 1 star | Vision-language AI models |
| **DanceTime** | Move Forest | `dance` | Simon-says for 8 dance moves; 5 levels, 3 lives | AI motion capture and movement recognition |
| **AnimalMoves** | Move Forest | `animal` | 14-animal pool; 10 rounds; biomechanics description + 4 options | AI biomechanics and animal behaviour research |
| **CatchBalance** | Move Forest | `catch` | 3 rounds × 20 s; tap falling fruit; spawn rate increases per round | AI in sports coaching and reaction-time analysis |
| **EmotionFaces** | Heart Valley | `emotion` | 12-scenario pool; 10 rounds; 4 emotion options; 3-in-a-row bonus | AI emotion recognition and affective computing |
| **FriendFinder** | Heart Valley | `friend` | 10-scenario pool; 8 rounds; KIND/NEUTRAL/UNKIND options; growing heart bar | AI prosocial behaviour modelling |
| **CalmCorner** | Heart Valley | `calm` | 4 breathing exercises; animated breath pacer; mood check after each; summary screen | AI stress detection and mental health tools |
| **NatureQuest** | Explore Park | `nature` | 12-creature pool; 8 rounds; 3 clues revealed one at a time; fewer clues = more stars | AI biodiversity monitoring and species identification |
| **TreasureHunt** | Explore Park | `treasure` | 5 hunts × 3 chained riddle clues; wrong = Airi hint + retry | AI navigation and rescue robotics |
| **SoundExplorer** | Explore Park | `sound` | 12-sound pool; 10 rounds; written sound descriptions; 4 options | AI wildlife audio monitoring and recognition |
| **GoodNightStorytime** (Story Detective) | Dream Garden | `storytime` | 5 bedtime stories × 3 comprehension questions; tap correct paragraph; hints on wrong | AI language models and reading comprehension |
| **GratitudeMoments** (Teach Airi to Feel) | Dream Garden | `gratitude` | 8 emotion-labelling scenarios; intensity picker; gratitude jar journal (localStorage) | AI sentiment analysis and emotional AI |
| **MusicClouds** (Compose for Airi) | Dream Garden | `music` | 7-row × 8-beat sequencer; Web Audio API playback; 3 challenges + free compose mode | AI music therapy and generative music |

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4.x + scoped `.playgrow-shell` design tokens |
| Deployment | Docker — node:24-alpine builder → nginx:alpine |
| Package manager | pnpm |

No backend. Fully client-side SPA. No API keys required for any of the 21 games.

## Themes

Light, Dark, and High-Contrast via the theme switcher (top-right of World Map and zone screens). Theme preference persists in `localStorage`.

## Airi Companion

A persistent animated mascot fixed at the bottom-left of every game screen. Airi has 6 mood states and displays contextual messages and AI-for-good facts that react to game events, fading in and out smoothly on message change.

## Admin Access

Tap the 🔒 lock icon (top-left of World Map) → enter password → Admin Dashboard.

Features: System Controls (mock admin actions with full audit log), and a built-in self-test runner that simulates user journeys with a live log and screenshot viewer.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Docker build, environment variables, and troubleshooting.
