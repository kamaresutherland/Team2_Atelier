const express = require('express');
const { pool } = require('./db');
const { requireAuth } = require('./auth');

const router = express.Router();

// GET /items/stats
// Returns a summary of the logged in user's closet.
router.get('/stats', requireAuth, async (req, res) => {
  try {
    // The join to wardrobe makes sure we only count the logged in user's items.
    const statusResult = await pool.query(
      `SELECT ci.status, COUNT(*)::int AS count
       FROM clothing_item ci
       JOIN wardrobe w ON ci.wardrobe_id = w.id
       WHERE w.user_id = $1
       GROUP BY ci.status`,
      [req.userId]
    );

    const categoryResult = await pool.query(
      `SELECT COALESCE(NULLIF(TRIM(ci.category), ''), 'Other') AS category, COUNT(*)::int AS count
       FROM clothing_item ci
       JOIN wardrobe w ON ci.wardrobe_id = w.id
       WHERE w.user_id = $1
       GROUP BY 1
       ORDER BY count DESC, category ASC`,
      [req.userId]
    );

    const mostWornResult = await pool.query(
      `SELECT ci.id, ci.item_name, ci.wear_count
       FROM clothing_item ci
       JOIN wardrobe w ON ci.wardrobe_id = w.id
       WHERE w.user_id = $1 AND ci.wear_count > 0
       ORDER BY ci.wear_count DESC, ci.id ASC
       LIMIT 3`,
      [req.userId]
    );

    const byStatus = { clean: 0, worn: 0, dirty: 0 };
    for (const row of statusResult.rows) {
      if (row.status in byStatus) byStatus[row.status] = row.count;
    }

    const byCategory = {};
    for (const row of categoryResult.rows) {
      byCategory[row.category] = row.count;
    }

    res.json({
      total: byStatus.clean + byStatus.worn + byStatus.dirty,
      by_status: byStatus,
      by_category: byCategory,
      most_worn: mostWornResult.rows,
    });
  } catch (err) {
    console.error('Closet stats error:', err.message);
    res.status(500).json({ error: 'Something went wrong getting closet stats' });
  }
});

module.exports = router;
