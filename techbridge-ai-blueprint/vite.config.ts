import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { execSync } from 'child_process';

let commitHash = 'unknown';
let branchName = 'unknown';

try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
  branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
} catch (e) {
  // Fallback if git is not available
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    define: {
      '__GIT_COMMIT__': JSON.stringify(commitHash),
      '__GIT_BRANCH__': JSON.stringify(branchName),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
