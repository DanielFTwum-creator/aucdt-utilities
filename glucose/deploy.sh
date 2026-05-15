#!/bin/bash
set -e

echo "📦 Building rophe-sugar-logger..."
pnpm build

echo ""
echo "✅ Build complete!"
echo ""
echo "📁 Distribution files are ready in ./dist/"
echo ""
echo "🚀 Deploy options:"
echo "  1. Static hosting (Vercel, Netlify, GitHub Pages):"
echo "     Upload the contents of ./dist/ to your static host"
echo ""
echo "  2. Docker:"
echo "     docker build -t rophe-sugar-logger ."
echo "     docker run -p 3000:80 rophe-sugar-logger"
echo ""
echo "  3. Manual server:"
echo "     npx serve -s dist"
echo ""
echo "ℹ️  Set GEMINI_API_KEY environment variable before running:"
echo "    export GEMINI_API_KEY=your_key_here"
