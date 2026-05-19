#!/bin/bash
# Run both dev server and backend in parallel for local OAuth testing

echo "Starting Peace Vinyl with OAuth backend..."
echo ""

# Start Vite dev server in background
echo "Starting dev server on :3000..."
pnpm dev &
DEV_PID=$!

# Wait for dev server to be ready
sleep 3

# Build the dist folder for the backend to serve
echo "Building static assets for backend..."
pnpm build

# Start Express backend server
echo "Starting OAuth backend on :3000..."
node server.js &
BACKEND_PID=$!

# Handle cleanup
trap "kill $DEV_PID $BACKEND_PID 2>/dev/null" EXIT

echo ""
echo "✅ Both servers running!"
echo "   Dev server: http://localhost:3000"
echo "   OAuth backend: http://localhost:3000/api/auth/google/token"
echo ""
echo "Press Ctrl+C to stop both servers"

wait
