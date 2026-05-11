#!/bin/bash
# Capture all screenshots in batches

cd "$(dirname "$0")/.."

total=$(find . -maxdepth 2 -name "index.html" | wc -l)
captured=$(ls project-screenshots/*.png 2>/dev/null | wc -l)

echo "Total projects: $total"
echo "Already captured: $captured"
echo "Remaining: $((total - captured))"
echo ""

# Capture in batches of 50
for batch in {2..5}; do
  echo "Starting batch $batch..."
  node scripts/batch-screenshots.js
  sleep 2
done

echo ""
echo "=== Screenshot Capture Complete ==="
ls project-screenshots/*.png | wc -l
