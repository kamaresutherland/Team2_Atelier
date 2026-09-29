// Quick sanity check that your DATABASE_URL (or local config) actually connects.
//   node test-connection.js

const { pool } = require('./db');

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Connected successfully. Server time:', result.rows[0].now);
  } catch (err) {
    console.error('✗ Connection failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testConnection();
