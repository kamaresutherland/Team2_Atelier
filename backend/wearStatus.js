const express = require('express');
const { pool } = require('./db');
const { requireAuth } = require('./auth');

const router = express.Router();

const ALLOWED_STATUSES = ['clean', 'worn', 'dirty'];

// PATCH /items/:id/status  -  body: { "status": "clean" | "worn" | "dirty" }
// Marking an item as worn also adds 1 to its wear count.
router.patch('/:id/status', requireAuth, async (req, res) => {
  const itemId = Number.parseInt(req.params.id, 10);
  const { status } = req.body;

  if (!Number.isInteger(itemId)) {
    return res.status(400).json({ error: 'Invalid item id' });
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Status must be clean, worn or dirty' });
  }

  try {
    // The join to wardrobe makes sure the item belongs to the logged in user.
    const result = await pool.query(
      `UPDATE clothing_item ci
       SET status = $1::varchar,
           wear_count = CASE WHEN $1::varchar = 'worn' THEN ci.wear_count + 1 ELSE ci.wear_count END
       FROM wardrobe w
       WHERE ci.id = $2 AND ci.wardrobe_id = w.id AND w.user_id = $3
       RETURNING ci.id, ci.item_name, ci.status, ci.wear_count`,
      [status, itemId, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ item: result.rows[0] });
  } catch (err) {
    console.error('Update status error:', err.message);
    res.status(500).json({ error: 'Something went wrong updating the item' });
  }
});

// POST /items/:id/wash  -  marks an item as washed: clean, wear count back to 0
router.post('/:id/wash', requireAuth, async (req, res) => {
  const itemId = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(itemId)) {
    return res.status(400).json({ error: 'Invalid item id' });
  }

  try {
    const result = await pool.query(
      `UPDATE clothing_item ci
       SET status = 'clean', wear_count = 0
       FROM wardrobe w
       WHERE ci.id = $1 AND ci.wardrobe_id = w.id AND w.user_id = $2
       RETURNING ci.id, ci.item_name, ci.status, ci.wear_count`,
      [itemId, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ item: result.rows[0] });
  } catch (err) {
    console.error('Wash item error:', err.message);
    res.status(500).json({ error: 'Something went wrong washing the item' });
  }
});

module.exports = router;
