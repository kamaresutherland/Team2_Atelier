require('dotenv').config();
const { Pool } = require('pg');

// If DATABASE_URL is set (shared online database), use that.
// Otherwise, fall back to local Postgres settings so teammates who
// haven't switched over yet aren't broken.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER || process.env.USER,
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'atelier',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    });

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

module.exports = { pool };
