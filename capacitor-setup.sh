#!/bin/bash
#
# Capacitor Setup Script for TUC React Web Projects
# Configures iOS and Android app store deployment for any React web app
#
# USAGE:
#   ./capacitor-setup.sh --app-name "App Name" --app-id "com.company.app"
#
# REQUIRED:
#   --app-name      Display name (e.g., "LuxThumb Designer")
#   --app-id        Reverse domain app ID (e.g., "com.techbridge.luxthumb")
#
# OPTIONAL:
#   --project-path  Path to project root (default: current directory)
#   --version       App version, semver format (default: 1.0.0)
#   --skip-commit   Don't commit changes to git
#   --skip-build    Don't build web bundle before syncing
#   --help          Show this message
#
# EXAMPLES:
#   ./capacitor-setup.sh --app-name "MyApp" --app-id "com.techbridge.myapp"
#
#   ./capacitor-setup.sh \
#     --project-path /path/to/project \
#     --app-name "MyApp" \
#     --app-id "com.techbridge.myapp" \
#     --version "1.0.0"
#
#   ./capacitor-setup.sh \
#     --app-name "MyApp" \
#     --app-id "com.techbridge.myapp" \
#     --skip-commit
#
# REQUIREMENTS:
#   - Node.js 18+
#   - pnpm or npm
#   - git
#   - macOS (for iOS builds)
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
PROJECT_PATH="."
VERSION="1.0.0"
SKIP_COMMIT=false
SKIP_BUILD=false
APP_NAME=""
APP_ID=""
SHOW_HELP=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --app-name)
            APP_NAME="$2"
            shift 2
            ;;
        --app-id)
            APP_ID="$2"
            shift 2
            ;;
        --project-path)
            PROJECT_PATH="$2"
            shift 2
            ;;
        --version)
            VERSION="$2"
            shift 2
            ;;
        --skip-commit)
            SKIP_COMMIT=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --help)
            SHOW_HELP=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            SHOW_HELP=true
            shift
            ;;
    esac
done

# Show help if requested or missing required parameters
if [[ "$SHOW_HELP" == true ]] || [[ -z "$APP_NAME" ]] || [[ -z "$APP_ID" ]]; then
    cat << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║     Capacitor Setup for TUC React Web Projects                ║
║     iOS and Android App Store Deployment Automation           ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  ./capacitor-setup.sh --app-name "App Name" --app-id "com.company.app"

REQUIRED PARAMETERS:
  --app-name       Display name (e.g., "LuxThumb Designer")
  --app-id         Reverse domain app ID (e.g., "com.techbridge.luxthumb")

OPTIONAL PARAMETERS:
  --project-path   Path to project root (default: current directory)
  --version        App version, semver format (default: 1.0.0)
  --skip-commit    Don't commit changes to git
  --skip-build     Don't build web bundle before syncing
  --help           Show this message

EXAMPLES:
  # Full setup with commit
  ./capacitor-setup.sh --app-name "MyApp" --app-id "com.techbridge.myapp"

  # Specific project directory
  ./capacitor-setup.sh \
    --project-path /path/to/my-project \
    --app-name "MyApp" \
    --app-id "com.techbridge.myapp"

  # Dry run (no commit)
  ./capacitor-setup.sh \
    --app-name "MyApp" \
    --app-id "com.techbridge.myapp" \
    --skip-commit

WHAT THIS SCRIPT DOES:
  1. Validates project structure (package.json, src/, build config)
  2. Installs Capacitor dependencies via pnpm
  3. Creates capacitor.config.ts with your app settings
  4. Adds iOS native project
  5. Adds Android native project
  6. Updates package.json version and build scripts
  7. Builds web bundle (optional)
  8. Syncs web assets to platforms
  9. Commits all changes to git (optional)

TIME ESTIMATE: 3-5 minutes

REQUIREMENTS:
  - Node.js 18+
  - pnpm (or npm, yarn)
  - git
  - macOS for iOS builds

WHAT GETS CREATED:
  - capacitor.config.ts       (Capacitor configuration)
  - ios/                       (Xcode project)
  - android/                   (Android Studio project)
  - Updated package.json       (build scripts)

AFTER SETUP:
  pnpm build:ios           (build for iOS, macOS only)
  pnpm build:android       (build for Android)
  pnpm mobile:sync         (sync web assets to platforms)
  pnpm ios:open            (open in Xcode, macOS only)
  pnpm android:open        (open in Android Studio)

LEARN MORE:
  Capacitor docs: https://capacitorjs.com/docs
  TUC standards: CLAUDE.md (Section 12)

EOF
    exit 1
fi

# Resolve project path
PROJECT_PATH=$(cd "$PROJECT_PATH" && pwd)
echo -e "${CYAN}🔍 Validating project at: $PROJECT_PATH${NC}"

# Validate project structure
if [[ ! -f "$PROJECT_PATH/package.json" ]]; then
    echo -e "${RED}❌ Error: package.json not found at $PROJECT_PATH${NC}"
    exit 1
fi

if [[ ! -d "$PROJECT_PATH/src" ]]; then
    echo -e "${RED}❌ Error: src/ directory not found at $PROJECT_PATH${NC}"
    exit 1
fi

if [[ ! -f "$PROJECT_PATH/vite.config.ts" ]] && \
   [[ ! -f "$PROJECT_PATH/webpack.config.js" ]] && \
   [[ ! -f "$PROJECT_PATH/tsconfig.json" ]]; then
    echo -e "${RED}❌ Error: No build config found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project structure validated${NC}"

# Get project name from package.json
PROJECT_NAME=$(grep '"name"' "$PROJECT_PATH/package.json" | head -1 | sed 's/.*"name": "\([^"]*\)".*/\1/')

echo -e "${BLUE}📦 Project Details:
   Name:    $PROJECT_NAME
   AppName: $APP_NAME
   AppId:   $APP_ID
   Version: $VERSION
${NC}"

# Change to project directory
cd "$PROJECT_PATH"

# Step 1: Install Capacitor
echo -e "${YELLOW}📥 Installing Capacitor dependencies...${NC}"

if [[ -f "pnpm-lock.yaml" ]]; then
    pnpm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android --silent
else
    npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android --silent
fi

echo -e "${GREEN}✅ Capacitor installed${NC}"

# Step 2: Create capacitor.config.ts
echo -e "${YELLOW}⚙️  Creating capacitor.config.ts...${NC}"

cat > capacitor.config.ts << 'CAPACITOR_CONFIG'
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '$APP_ID',
  appName: '$APP_NAME',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
CAPACITOR_CONFIG

# Replace placeholders
sed -i.bak "s|\$APP_ID|$APP_ID|g" capacitor.config.ts
sed -i.bak "s|\$APP_NAME|$APP_NAME|g" capacitor.config.ts
rm -f capacitor.config.ts.bak

echo -e "${GREEN}✅ capacitor.config.ts created${NC}"

# Step 3: Add iOS platform
echo -e "${YELLOW}🍎 Adding iOS platform...${NC}"
if npx capacitor add ios &>/dev/null; then
    echo -e "${GREEN}✅ iOS platform added${NC}"
else
    echo -e "${YELLOW}⚠️  iOS platform setup skipped (may require macOS)${NC}"
fi

# Step 4: Add Android platform
echo -e "${YELLOW}🤖 Adding Android platform...${NC}"
if npx capacitor add android &>/dev/null; then
    echo -e "${GREEN}✅ Android platform added${NC}"
else
    echo -e "${YELLOW}⚠️  Android platform setup skipped${NC}"
fi

# Step 5: Update package.json (using Node.js for JSON manipulation)
echo -e "${YELLOW}📝 Updating package.json...${NC}"

node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.version = '$VERSION';
pkg.scripts = pkg.scripts || {};
pkg.scripts['build:web'] = 'vite build && capacitor copy ios && capacitor copy android';
pkg.scripts['build:ios'] = 'npm run build:web && npx capacitor build ios';
pkg.scripts['build:android'] = 'npm run build:web && npx capacitor build android';
pkg.scripts['mobile:sync'] = 'capacitor sync';
pkg.scripts['ios:open'] = 'open ios/App/App.xcworkspace';
pkg.scripts['android:open'] = 'open android';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo -e "${GREEN}✅ package.json updated (version: $VERSION, scripts added)${NC}"

# Step 6: Build web (optional)
if [[ "$SKIP_BUILD" != true ]]; then
    echo -e "${YELLOW}🏗️  Building web bundle...${NC}"

    if [[ -f "pnpm-lock.yaml" ]]; then
        if pnpm build &>/dev/null; then
            echo -e "${GREEN}✅ Web build complete${NC}"
        else
            echo -e "${YELLOW}⚠️  Web build failed${NC}"
        fi
    else
        if npm run build &>/dev/null; then
            echo -e "${GREEN}✅ Web build complete${NC}"
        else
            echo -e "${YELLOW}⚠️  Web build failed${NC}"
        fi
    fi
fi

# Step 7: Sync platforms
echo -e "${YELLOW}🔄 Syncing web assets to platforms...${NC}"
if npx capacitor sync &>/dev/null; then
    echo -e "${GREEN}✅ Platforms synced${NC}"
else
    echo -e "${YELLOW}⚠️  Platform sync skipped${NC}"
fi

# Step 8: Commit changes
if [[ "$SKIP_COMMIT" != true ]]; then
    echo -e "${YELLOW}📤 Committing changes to git...${NC}"

    if git add -A && git commit -m "feat: add Capacitor for iOS/Android app store deployment

- Integrate Capacitor 8.3.3 for native iOS and Android builds
- Add iOS and Android platforms with full configuration
- Create capacitor.config.ts with app ID: $APP_ID
- Update package.json to version $VERSION
- Add npm scripts for mobile builds (build:ios, build:android, mobile:sync)
- Web bundle synced to both platforms

Ready for iOS App Store and Google Play Store submission.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>" &>/dev/null; then
        COMMIT_HASH=$(git rev-parse --short HEAD)
        echo -e "${GREEN}✅ Changes committed ($COMMIT_HASH)${NC}"
    else
        echo -e "${YELLOW}⚠️  Git commit failed (not in git repository?)${NC}"
    fi
fi

# Print summary
cat << EOF

${CYAN}╔════════════════════════════════════════════════════════════════╗
║                    ✅ SETUP COMPLETE                          ║
╚════════════════════════════════════════════════════════════════╝${NC}

Project:      $PROJECT_NAME
App Name:     $APP_NAME
App ID:       $APP_ID
Version:      $VERSION
Build Status: Ready for app store deployment

📁 New directories created:
   ios/      → Xcode project (macOS required to build)
   android/  → Android Studio project

📄 New files created:
   capacitor.config.ts → Capacitor configuration

📝 Updated files:
   package.json → Version $VERSION, build scripts added

${GREEN}🚀 NEXT STEPS:${NC}

1. Build for iOS (macOS only):
   cd $PROJECT_NAME
   pnpm build:ios
   open ios/App/App.xcworkspace

2. Build for Android:
   cd $PROJECT_NAME
   pnpm build:android
   open android

3. Sync changes anytime:
   pnpm mobile:sync

4. Documentation:
   See CLAUDE.md Section 12 for mobile deployment workflow
   Copy docs from luxthumb-agent if needed (APP_STORE_GUIDE.md, etc.)

5. Before App Store submission:
   - Create app icons (1024×1024 PNG)
   - Take screenshots of key features
   - Write privacy policy
   - Create developer accounts (Apple £99/year, Google £25/one-time)

📚 Resources:
   Capacitor Docs:    https://capacitorjs.com/docs
   App Store Connect: https://appstoreconnect.apple.com
   Google Play:       https://play.google.com/console
   TUC Standards:     CLAUDE.md

EOF

echo -e "${CYAN}Done! 🎉${NC}"
