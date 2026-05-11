const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const db = new DatabaseSync(path.join(__dirname, 'data/stockpulse.db'));
const users = db.prepare("SELECT id, email, name, tier FROM users WHERE email LIKE '%daniel%' OR email LIKE '%twum%'").all();
console.log('Your accounts:', users);
