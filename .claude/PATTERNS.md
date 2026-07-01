# PATTERNS.md — MOVED

> This copy was stale and has been retired.
>
> The authoritative pattern library is the monorepo-root file:
> **`aucdt-utilities/PATTERNS.md`** (20 patterns, kept current).
>
> Do not add patterns here. Edit the root file instead.

## Why this stub exists

An older 6-pattern copy previously lived at this path. It had drifted from the
root library and, critically, its Gemini integration example instantiated the
SDK with a client-side `VITE_GEMINI_API_KEY`. That is the exact key-leak
anti-pattern the root `PATTERNS.md` (Patterns 4 and 11) and `CLAUDE.md` §12 now
forbid: keys live only in WMS, never in a browser bundle.

The full previous content remains in git history if it is ever needed.
