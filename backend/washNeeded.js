const express = require('express');
const { pool } = require('./db');
const { requireAuth } = require('./auth');

const router = express.Router();

// An item needs washing when it is dirty or has been worn this many times.
// Change this one number to change the rule everywhere.
const WASH_LIMIT = 3;

// GET /items/needs-washing
// Returns only the logged in user's items that are dirty or worn WASH_LIMIT or more times.
router.get('/needs-washing', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ci.id, ci.item_name, ci.status, ci.wear_count
       FROM clothing_item ci
       JOIN wardrobe w ON ci.wardrobe_id = w.id
       WHERE w.user_id = $1
         AND (ci.status = 'dirty' OR ci.wear_count >= $2)
       ORDER BY ci.item_name`,
      [req.userId, WASH_LIMIT]
    );

    res.json({ limit: WASH_LIMIT, items: result.rows });
  } catch (err) {
    console.error('Needs washing error:', err.message);
    res.status(500).json({ error: 'Something went wrong loading items that need washing' });
  }
});

module.exports = router;
