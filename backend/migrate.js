// Run this once against your database (online or local) to create all tables:
//   node migrate.js
//
// Safe to run multiple times — every statement uses IF NOT EXISTS.

const { pool } = require('./db');

async function migrate() {
  try {
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
    console.log('✓ users table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS clothing_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        color VARCHAR(100),
        image_url TEXT,
        status VARCHAR(50) DEFAULT 'clean', -- clean, worn, needs_wash
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ clothing_items table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS wash_tracker (
        id SERIAL PRIMARY KEY,
        clothing_item_id INTEGER NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
        washed_at TIMESTAMP DEFAULT NOW(),
        notes TEXT
      );
    `);
    console.log('✓ wash_tracker table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS outfits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ outfits table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS outfit_items (
        outfit_id INTEGER NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
        clothing_item_id INTEGER NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
        PRIMARY KEY (outfit_id, clothing_item_id)
      );
    `);
    console.log('✓ outfit_items table ready');

    console.log('\nAll tables created successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
