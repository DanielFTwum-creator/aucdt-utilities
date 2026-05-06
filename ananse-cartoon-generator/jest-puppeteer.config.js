import 'dotenv/config';

module.exports = {
  server: {
    command: 'npm start',
    port: 5173,
    launchTimeout: 30000,
    debug: true,
  },
  launch: {
    headless: process.env.HEADLESS !== 'false', // Run in headless mode unless HEADLESS=false is set
    slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : 0,
    devtools: process.env.DEVTOOLS === 'true',
  },
  browserContext: 'default',
};
