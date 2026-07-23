import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the app as its own workspace root: bench-trilogy deploys standalone
  // (its own Pipelines), independent of the aucdt-utilities monorepo root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
