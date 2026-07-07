#!/usr/bin/env bash
# nginx-safe-apply: install an nginx config file only if the result validates.
# Pattern 26 (PATTERNS.md) / incident TUC-INC-2026-010.
#
# Usage: nginx-safe-apply <target-conf-path> <candidate-file>
#
# Backs up the target, installs the candidate, runs nginx -t. On success,
# reloads nginx (reload keeps the old config serving if anything goes wrong;
# never restart here). On failure, restores the previous file and exits
# non-zero so calling scripts abort.
set -euo pipefail

usage="usage: nginx-safe-apply <target-conf-path> <candidate-file>"
TARGET="${1:?$usage}"
CANDIDATE="${2:?$usage}"

if [ ! -f "$CANDIDATE" ]; then
  echo "[FATAL] candidate file not found: $CANDIDATE" >&2
  exit 2
fi

STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP=""
if [ -f "$TARGET" ]; then
  BACKUP="${TARGET}.bak-${STAMP}"
  cp -p "$TARGET" "$BACKUP"
fi

install -m 644 "$CANDIDATE" "$TARGET"

if nginx -t; then
  systemctl reload nginx
  if systemctl is-active --quiet nginx; then
    echo "[OK] $TARGET applied and nginx reloaded"
    if [ -n "$BACKUP" ]; then
      echo "[OK] previous version kept at $BACKUP"
    fi
    exit 0
  fi
  echo "[FATAL] nginx is not active after reload" >&2
fi

# Validation or reload failed: put the previous state back.
if [ -n "$BACKUP" ]; then
  cp -p "$BACKUP" "$TARGET"
  echo "[ROLLBACK] restored $TARGET from $BACKUP" >&2
else
  rm -f "$TARGET"
  echo "[ROLLBACK] removed $TARGET (no previous version existed)" >&2
fi

# Confirm the restored tree is valid so we never leave a landmine behind.
if nginx -t; then
  systemctl reload nginx || true
  echo "[ROLLBACK] restored config validates; nginx untouched by the bad candidate" >&2
else
  echo "[FATAL] restored config ALSO fails nginx -t; fix by hand before any restart" >&2
fi

echo "[FATAL] candidate config rejected: $CANDIDATE" >&2
exit 1
