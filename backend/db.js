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

// Run once to set up all tables:
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

  // ── Caleb: Wardrobe, ClothingItem, WashTracker tables ──────────────

  await pool.query(`
    CREATE TABLE IF NOT EXISTS wardrobe (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      item_count INTEGER DEFAULT 0,
      wardrobe_status VARCHAR(50) DEFAULT 'active',
      last_updated TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('wardrobe table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clothing_item (
      id SERIAL PRIMARY KEY,
      wardrobe_id INTEGER REFERENCES wardrobe(id) ON DELETE CASCADE,
      item_name VARCHAR(100) NOT NULL,
      category VARCHAR(50),
      color VARCHAR(50),
      size VARCHAR(20),
      status VARCHAR(20) DEFAULT 'clean' CHECK (status IN ('clean', 'worn', 'dirty')),
      wear_count INTEGER DEFAULT 0,
      image_url TEXT,
      description TEXT,
      date_added TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('clothing_item table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS wash_tracker (
      id SERIAL PRIMARY KEY,
      clothing_item_id INTEGER REFERENCES clothing_item(id) ON DELETE CASCADE,
      current_wear_count INTEGER DEFAULT 0,
      wash_threshold INTEGER DEFAULT 3,
      wash_status VARCHAR(20) DEFAULT 'clean' CHECK (wash_status IN ('clean', 'dirty')),
      last_washed TIMESTAMP
    );
  `);
  console.log('wash_tracker table ready');
}

module.exports = { pool, initDb };