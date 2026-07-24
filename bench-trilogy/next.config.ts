import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output: a self-contained Node server (.next/standalone) run under
  // PM2 behind an nginx subdomain vhost, matching the fleet Node deploy pattern
  // and dev.techbridge.edu.gh.
  output: "standalone",
  // Pin the app as its own workspace root, independent of the monorepo root.
  turbopack: {
    root: __dirname,
  },
  // Standalone file tracing is rooted at the app, not the monorepo, so the
  // server bundle stays lean.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
