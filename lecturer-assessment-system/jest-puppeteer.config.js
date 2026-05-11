module.exports = {
  launch: {
    headless: 'new', // Use the new headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  server: {
    command: 'npm run build && npm run preview',
    port: 4173, // Default port for vite preview
    launchTimeout: 30000,
    debug: true,
  },
};