#!/bin/bash

echo "🧪 MP4 Export Test Suite"
echo "========================"
echo ""

# Kill any existing processes
killall -9 node tsx 2>/dev/null
sleep 3

# Start fresh
cd "$(dirname "$0")"

# Run tests with proper configuration
npx playwright test mp4-export \
  --reporter=html,line \
  --workers=1 \
  --timeout=300000

# Show test results
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ All tests passed!"
  echo "📊 View detailed report: npx playwright show-report"
else
  echo ""
  echo "❌ Some tests failed"
  echo "📊 View detailed report: npx playwright show-report"
fi
