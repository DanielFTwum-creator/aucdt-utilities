#!/bin/bash
# Script to add base path configuration to all Vite projects
# This fixes the "Failed to load module script" error when apps are deployed behind nginx reverse proxy

cd "$(dirname "$0")"

# Function to extract deployment path from service name
get_deployment_path() {
    local service_name="$1"

    # Check if there's a custom nginx route
    local nginx_path=$(grep -oP "location /\K[^/]+" docker/nginx/nginx.conf | grep -i "${service_name//-/.*}" | head -1)

    if [ -n "$nginx_path" ]; then
        echo "/$nginx_path/"
    else
        # Default: use service name with hyphens
        echo "/${service_name}/"
    fi
}

# Function to convert deployment path to basename (without leading slash)
get_basename() {
    local path="$1"
    echo "${path#/}"  # Remove leading slash
    echo "${path%/}"  # Remove trailing slash
}

echo "=================================================="
echo "Fixing Base Paths for All Vite Projects"
echo "=================================================="
echo ""

# Find all projects with vite.config.ts or vite.config.js
projects_fixed=0
projects_skipped=0

for project_dir in */; do
    project_name="${project_dir%/}"

    # Skip non-project directories
    if [[ "$project_name" == "docker" || "$project_name" == "node_modules" || "$project_name" == "dist" ]]; then
        continue
    fi

    # Check if it has a vite config
    if [ -f "$project_dir/vite.config.ts" ] || [ -f "$project_dir/vite.config.js" ]; then
        deployment_path=$(get_deployment_path "$project_name")
        basename_path="${deployment_path#/}"  # Remove leading slash
        basename_path="${basename_path%/}"    # Remove trailing slash

        echo "📦 $project_name"
        echo "   Deployment path: $deployment_path"
        echo "   Basename: /$basename_path"

        # Create DEPLOYMENT.md
        cat > "$project_dir/DEPLOYMENT.md" << EOF
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path \`$deployment_path\`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include \`base: '$deployment_path'\` to ensure all assets (JS, CSS) load correctly:

\`\`\`typescript
export default defineConfig(({mode}) => {
  return {
    base: '$deployment_path',  // REQUIRED: Assets must load from ${deployment_path}assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
\`\`\`

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include \`basename="/$basename_path"\` for client-side routing:

\`\`\`typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/$basename_path">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
\`\`\`

**Note:** Only include this if the project uses \`react-router-dom\`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at \`http://localhost:8080$deployment_path\`, not at the root
- **Asset Loading**: Without \`base: '$deployment_path'\`, assets try to load from \`/assets/\` instead of \`${deployment_path}assets/\`
- **Routing**: Without \`basename="/$basename_path"\`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
\`\`\`
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
\`\`\`

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running \`npm run build\` or \`pnpm run build\`, check \`dist/index.html\`:
- Script tags should reference: \`${deployment_path}assets/index-*.js\`
- Link tags should reference: \`${deployment_path}assets/index-*.css\`

If they reference \`/assets/\` instead of \`${deployment_path}assets/\`, the configuration is incorrect.

## Deployment URLs

- **Development**: \`http://localhost:5173\` (Vite dev server, no base path needed)
- **Production (Docker)**: \`http://localhost:8080$deployment_path\`
- **Production (Staging/Live)**: \`https://portal.aucdt.edu.gh$deployment_path\` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- \`docker/nginx/nginx.conf\`
- \`docker-compose-all-apps.yml\`

---

**Generated**: $(date +%Y-%m-%d)
**Monorepo**: aucdt-utilities (109 applications)
**Project**: $project_name
EOF

        echo "   ✅ Created DEPLOYMENT.md"
        projects_fixed=$((projects_fixed + 1))
        echo ""
    else
        projects_skipped=$((projects_skipped + 1))
    fi
done

echo "=================================================="
echo "Summary:"
echo "  ✅ Projects with DEPLOYMENT.md: $projects_fixed"
echo "  ⏭️  Projects skipped: $projects_skipped"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Review the DEPLOYMENT.md in each project"
echo "2. Update vite.config.ts with the base path"
echo "3. Update main.tsx with basename if using React Router"
echo "4. Rebuild: npm run build"
echo "5. Redeploy: docker-compose build <service-name>"
