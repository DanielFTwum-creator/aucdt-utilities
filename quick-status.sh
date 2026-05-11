#!/bin/bash
# Quick status check for verification

echo "=================================="
echo "Verification Progress"
echo "=================================="
echo ""

# Count processed apps
PROCESSED=$(grep -c "^\[1m\[" full-verification-post-fix.log 2>/dev/null || echo "0")
echo "Apps processed: $PROCESSED / 240"

# Calculate percentage
if [ "$PROCESSED" -gt 0 ]; then
    PERCENT=$((PROCESSED * 100 / 240))
    echo "Progress: ${PERCENT}%"
fi

echo ""
echo "Recent apps:"
tail -30 full-verification-post-fix.log | grep "^\[1m\[" | tail -5

echo ""
echo "Latest output:"
tail -10 full-verification-post-fix.log

echo ""
echo "=================================="
echo "Run: ./quick-status.sh to refresh"
echo "=================================="
