const bcrypt = require('bcryptjs');

const password = 'Admin@123';
const hash = '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO';

bcrypt.compare(password, hash).then(match => {
  console.log('Password matches hash:', match);
  if (!match) {
    console.log('\nGenerating new hash for Admin@123...');
    return bcrypt.hash(password, 10).then(newHash => {
      console.log('New hash:', newHash);
    });
  }
}).catch(err => console.error(err));
