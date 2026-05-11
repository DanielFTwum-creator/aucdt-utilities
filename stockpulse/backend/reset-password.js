const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const db = new DatabaseSync(path.join(__dirname, 'data/stockpulse.db'));
['SOXL', 'SOXS'].forEach(ticker => {
  db.prepare('INSERT OR IGNORE INTO watchlists (user_id, ticker) VALUES (?, ?)').run(2, ticker);
});
console.log('SOXL and SOXS added to your watchlist.');
