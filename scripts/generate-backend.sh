#!/bin/bash
# Generate backend infrastructure for projects

PROJECT_DIR="$1"
PROJECT_NAME="$2"

if [ -z "$PROJECT_DIR" ] || [ -z "$PROJECT_NAME" ]; then
    echo "Usage: ./generate-backend.sh <project-dir> <project-name>"
    echo "Example: ./generate-backend.sh fees-comparison-dashboard 'Fees Comparison'"
    exit 1
fi

cd "$(dirname "$0")/.."

if [ ! -d "$PROJECT_DIR" ]; then
    echo "Error: Project directory '$PROJECT_DIR' not found"
    exit 1
fi

echo "=== Generating Backend for $PROJECT_NAME ==="
echo ""

# Create directory structure
mkdir -p "$PROJECT_DIR/backend/src"/{routes,controllers,models,middleware,utils,config}

# Copy package.json template
sed "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" templates/backend-express-typescript/package.json > "$PROJECT_DIR/backend/package.json"

# Copy tsconfig.json
cp templates/backend-express-typescript/tsconfig.json "$PROJECT_DIR/backend/tsconfig.json"

# Copy server template
cp templates/backend-express-typescript/src/server.ts "$PROJECT_DIR/backend/src/server.ts"

# Create .env.example
cat > "$PROJECT_DIR/backend/.env.example" << EOF
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/${PROJECT_DIR//-/_}_db

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Create gitignore
cat > "$PROJECT_DIR/backend/.gitignore" << EOF
node_modules/
dist/
.env
*.log
.DS_Store
EOF

# Create README
cat > "$PROJECT_DIR/backend/README.md" << EOF
# $PROJECT_NAME - Backend API

## Quick Start

\`\`\`bash
pnpm install
cp .env.example .env
# Configure .env
pnpm dev
\`\`\`

## API Endpoints

(To be documented)

## Database Schema

(To be defined in src/config/database.sql)
EOF

echo "✓ Backend structure created for $PROJECT_NAME"
echo "✓ Location: $PROJECT_DIR/backend/"
echo ""
echo "Next steps:"
echo "1. Define database schema in src/config/database.sql"
echo "2. Create routes in src/routes/"
echo "3. Implement controllers in src/controllers/"
echo "4. Run: cd $PROJECT_DIR/backend && pnpm install"
echo "5. Configure .env file"
echo "6. Run: pnpm dev"
