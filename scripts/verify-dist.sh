#!/usr/bin/env bash
# Pattern 24 — built-SPA bundle guard.
# A Vite SPA whose index.html lost its module entry tag still "builds
# successfully" but ships a page with no JS at all (live black screen,
# dmcdai, 4 Jul 2026). Run after every build, before shipping dist/.
# Usage: bash scripts/verify-dist.sh <app-dir-or-dist-dir>
set -u
TARGET="${1:?usage: verify-dist.sh <app-dir-or-dist-dir>}"
INDEX="$TARGET/dist/index.html"
[ -f "$INDEX" ] || INDEX="$TARGET/index.html"
if [ ! -f "$INDEX" ]; then
  echo "[FATAL] no dist/index.html under $TARGET — build first"; exit 1
fi
if grep -Eq '<script[^>]+(src="[^"]*\.js"|type="module")' "$INDEX"; then
  echo "[OK] $INDEX references a JS bundle"
else
  echo "[FATAL] $INDEX ships no JS bundle (missing module entry in the source index.html)"; exit 1
fi
