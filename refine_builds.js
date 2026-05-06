const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync('.', { withFileTypes: true });

dirs.forEach(dir => {
  if (!dir.isDirectory()) return;
  const viteConfigPath = path.join(dir.name, 'vite.config.ts');
  if (fs.existsSync(viteConfigPath)) {
    let content = fs.readFileSync(viteConfigPath, 'utf-8');
    
    // Skip if manualChunks already configured or if it's a complicated function
    if (content.includes('manualChunks') || content.includes('chunkSizeWarningLimit')) {
      return;
    }

    console.log(`Optimizing ${viteConfigPath}...`);

    // Add chunkSizeWarningLimit and simple manualChunks
    const buildConfig = `
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },`;

    // Try to find the closing brace of the defineConfig or return object
    if (content.includes('build: {')) {
        // Build already exists, just add the properties
        return; 
    }

    if (content.includes('return {')) {
        content = content.replace('return {', `return {${buildConfig}`);
    } else if (content.includes('export default defineConfig({')) {
        content = content.replace('export default defineConfig({', `export default defineConfig({${buildConfig}`);
    }

    fs.writeFileSync(viteConfigPath, content);
  }
});
