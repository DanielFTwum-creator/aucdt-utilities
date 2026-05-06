#!/bin/bash

# AUCDT Utilities: Institutional Mass Build Sequence (v2 - Self-Healing)
# Target: All React projects in ../aucdt-utilities/

PROJECTS=(
  "6r-product-design-workshop-portal"
  "academic-integrity-detector"
  "academic-performance-app"
  "adaptive-curriculum-engine"
  "agent-collaboration-framework"
  "agenticai-masterclass"
  "ai-@-techbridge"
  "ai-code-reviewer"
  "ai-exam-generator"
  "ai-explainability-console"
  "ai-governance-analytics-hub"
  "ai-knowledge-compression-lab"
  "ai-legal-clause-analyzer"
  "ai-log-pattern-analyzer"
  "ai-marketplace-engine"
  "ai-music-arrangement-assistant"
  "ai-portfolio-demonstrator"
  "ai-resource-arbitrage-engine"
  "ai-risk-rebalancing-engine"
  "ai-skill-transfer-engine"
)

echo "🚀 Starting Self-Healing Mass Build Sequence..."

for PROJ in "${PROJECTS[@]}"; do
  PROJ_PATH="../$PROJ"
  if [ -d "$PROJ_PATH" ]; then
    echo "------------------------------------------------"
    echo "📦 Processing: $PROJ"
    
    # 1. Self-Healing: Fix common syntax errors identified in previous run
    # Fixing the QuestSubmissionForm syntax error
    QUEST_FORM="$PROJ_PATH/components/QuestSubmissionForm.tsx"
    if [ -f "$QUEST_FORM" ]; then
        sed -i 's/mt-4}/mt-4/g' "$QUEST_FORM"
        echo "🩹 Patched QuestSubmissionForm.tsx"
    fi

    # 2. Self-Healing: Fix PowerShell introduced App.tsx backslashes
    APP_TSX="$PROJ_PATH/src/App.tsx"
    if [ -f "$APP_TSX" ]; then
        sed -i 's/\\"/"/g' "$APP_TSX"
        echo "🩹 Patched App.tsx backslashes"
    fi

    # 3. Install Dependencies (Crucial for Tailwind v4)
    echo "⚙️ Installing dependencies..."
    (cd "$PROJ_PATH" && pnpm install --silent)

    # 4. Build
    echo "🏗️ Building..."
    (cd "$PROJ_PATH" && pnpm build)
    
    if [ $? -eq 0 ]; then
      echo "✅ Success: $PROJ"
    else
      echo "❌ Error: Build failed for $PROJ"
    fi
  else
    echo "⚠️ Skip: $PROJ (Directory not found)"
  fi
done

echo "------------------------------------------------"
echo "🎉 Mass Build Sequence Complete."
