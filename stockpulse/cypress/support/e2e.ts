import './commands';

// Suppress ResizeObserver loop errors from Recharts (harmless, not a test issue)
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver loop')) return false;
  if (err.message.includes('Script error')) return false;
  return true;
});
