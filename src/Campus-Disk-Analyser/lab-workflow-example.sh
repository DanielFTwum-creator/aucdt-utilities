#!/bin/bash
# Lab-wide disk analysis workflow for Windows/macOS mixed environment

# Configuration
LAB_SHARE="/shared/disk-analyses"  # Adjust to your network share
DATE=$(date +%Y%m%d)
HOSTNAME=$(hostname)

echo "🔍 Lab Disk Analysis Workflow"
echo "==============================="

# Detect platform and run appropriate analysis
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS system
    echo "📱 Running macOS analysis on $HOSTNAME..."
    ./test-enhanced-disk-analyser.sh --json-export /Users > "${LAB_SHARE}/${HOSTNAME}-mac-${DATE}.json"
    echo "✅ Analysis saved: ${LAB_SHARE}/${HOSTNAME}-mac-${DATE}.json"
    
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows Git Bash
    echo "🖥️  Running Windows analysis on $HOSTNAME..."
    ./enhanced-disk-analyser.sh --json-export /c/Users > "${LAB_SHARE}/${HOSTNAME}-win-${DATE}.json"
    echo "✅ Analysis saved: ${LAB_SHARE}/${HOSTNAME}-win-${DATE}.json"
    
else
    echo "⚠️  Unsupported platform: $OSTYPE"
    exit 1
fi

echo ""
echo "🌐 Next steps:"
echo "1. Visit: https://64vrc4xoo7.space.minimax.io"
echo "2. Upload the generated JSON file"
echo "3. Explore PowerDesk-style visualization"
echo "4. Compare with other lab systems"
