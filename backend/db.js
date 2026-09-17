const { Pool } = require('pg');

// Update these with your actual Postgres credentials (or use env vars)
const pool = new Pool({
  user: process.env.DB_USER || process.env.USER,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'atelier',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Run once to set up the users table:
//   node -e "require('./db').initDb()"
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      reset_token VARCHAR(255),
      reset_token_expires TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('users table ready');
}

// Run this if you already have a users table from before and just need the new columns:
//   node -e "require('./db').addResetColumns()"
async function addResetColumns() {
  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;
  `);
  console.log('reset_token columns ready');
}

module.exports = { pool, initDb, addResetColumns };
