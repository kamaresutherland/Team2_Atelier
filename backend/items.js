const express = require('express');
const { pool } = require('./db');
const { requireAuth } = require('./auth');

const router = express.Router();

// Every user needs a wardrobe row before they can have clothing items.
// This finds their existing wardrobe, or creates one if it's their first item.
async function getOrCreateWardrobe(userId) {
  const existing = await pool.query(
    'SELECT id FROM wardrobe WHERE user_id = $1',
    [userId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  const created = await pool.query(
    'INSERT INTO wardrobe (user_id) VALUES ($1) RETURNING id',
    [userId]
  );
  return created.rows[0].id;
}

// POST /items/add
// Adds a clothing item with a picture and description to the user's closet.
router.post('/add', requireAuth, async (req, res) => {
  const { itemName, category, color, size, description, imageUrl } = req.body;

  if (!itemName || !imageUrl) {
    return res.status(400).json({ error: 'Item name and image are required' });
  }

  try {
    const wardrobeId = await getOrCreateWardrobe(req.userId);

    const result = await pool.query(
      `INSERT INTO clothing_item
        (wardrobe_id, item_name, category, color, size, description, image_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'clean')
       RETURNING *`,
      [wardrobeId, itemName, category || null, color || null, size || null, description || null, imageUrl]
    );

    // Keep the wardrobe's item_count in sync
    await pool.query(
      'UPDATE wardrobe SET item_count = item_count + 1, last_updated = NOW() WHERE id = $1',
      [wardrobeId]
    );

    res.status(201).json({ item: result.rows[0] });
  } catch (err) {
    console.error('Add item error:', err);
    res.status(500).json({ error: 'Something went wrong adding the item' });
  }
});

// GET /items
// Returns all clothing items for the logged-in user's closet.
router.get('/', requireAuth, async (req, res) => {
  try {
    const wardrobeId = await getOrCreateWardrobe(req.userId);

    const result = await pool.query(
      `SELECT id, item_name, category, color, size, status, wear_count, image_url, description, date_added
       FROM clothing_item
       WHERE wardrobe_id = $1
       ORDER BY date_added DESC`,
      [wardrobeId]
    );

    res.json({ items: result.rows });
  } catch (err) {
    console.error('Fetch items error:', err);
    res.status(500).json({ error: 'Something went wrong fetching the closet' });
  }
});

module.exports = router;
