# Admin Guide — PlayGrow Smart Fun for Bright Minds

**Application:** PlayGrow — Smart Fun for Bright Minds
**Institution:** Techbridge University College (TUC)
**Date:** 2026-06-17

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_playgrow-smart-fun-for-bright-minds_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Game Coverage

PlayGrow currently ships 21 fully implemented games across 7 learning zones:

| Zone | Games |
|---|---|
| Brainy Town | PuzzleBuilder, PatternPath (Train the Robot), FindMatch (Sort It Out) |
| Art Meadow | PaintWorld, BuildItBlocks, StoryMaker |
| Talky Treehouse | ReadWithMe, RhymeRace, WordFinder |
| Move Forest | DanceTime, AnimalMoves, CatchBalance |
| Heart Valley | EmotionFaces, FriendFinder, CalmCorner |
| Explore Park | NatureQuest, TreasureHunt, SoundExplorer |
| Dream Garden | GoodNightStorytime, GratitudeMoments, MusicClouds |

All 21 games are fully playable with no backend dependency. No API key, database connection, or network call is required during gameplay. The self-test runner can be used to verify all game routes load and respond correctly after any deployment.

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Updated 2026-06-17 — TUC ICT*
