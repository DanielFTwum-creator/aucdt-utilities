const { getQuote } = require('./src/services/market.ts');

(async () => {
  try {
    const quote = await getQuote('SOXL');
    console.log('Success:', quote);
  } catch (e) {
    console.error('Error fetching quote:', e);
  }
})();
