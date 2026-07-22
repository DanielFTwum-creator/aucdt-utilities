// Load .env BEFORE the pool is created. server.ts imports this module before it
// calls dotenv.config(), and ES imports run first, so without this the pool is built
// with empty env and mysql2 falls back to root/'' (ER_ACCESS_DENIED root@localhost).
import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'tuc_sickbay',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
