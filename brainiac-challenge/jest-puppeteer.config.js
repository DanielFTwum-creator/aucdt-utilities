
module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false', // Run in headless mode unless specified
    slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : 0,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  server: {
    command: 'npx serve . -p 5000',
    port: 5000,
    launchTimeout: 30000,
    debug: true,
  },
};
