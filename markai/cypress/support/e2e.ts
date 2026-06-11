import '@cypress/code-coverage/support';
import './commands';

// The app polyfills window.storage onto localStorage; nothing extra needed here.
// Fail fast on uncaught app exceptions except the known benign ResizeObserver noise.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver loop')) return false;
  return true;
});
