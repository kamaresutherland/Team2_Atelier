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

// GET /items/summary
// Gives the home page a quick overview of the logged in user's closet:
// total items, counts by status and category, and the most worn item.
router.get('/summary', requireAuth, async (req, res) => {
  try {
    const wardrobeId = await getOrCreateWardrobe(req.userId);

    const [statusResult, categoryResult, mostWornResult] = await Promise.all([
      pool.query(
        `SELECT status, COUNT(*)::int AS count
         FROM clothing_item
         WHERE wardrobe_id = $1
         GROUP BY status`,
        [wardrobeId]
      ),
      pool.query(
        `SELECT COALESCE(NULLIF(category, ''), 'Other') AS category, COUNT(*)::int AS count
         FROM clothing_item
         WHERE wardrobe_id = $1
         GROUP BY 1
         ORDER BY 2 DESC`,
        [wardrobeId]
      ),
      pool.query(
        `SELECT id, item_name, wear_count
         FROM clothing_item
         WHERE wardrobe_id = $1 AND wear_count > 0
         ORDER BY wear_count DESC, item_name
         LIMIT 1`,
        [wardrobeId]
      ),
    ]);

    // Every status starts at zero so an empty closet still gets numbers back.
    const byStatus = { clean: 0, worn: 0, dirty: 0 };
    statusResult.rows.forEach((row) => {
      byStatus[row.status] = row.count;
    });

    const byCategory = {};
    categoryResult.rows.forEach((row) => {
      byCategory[row.category] = row.count;
    });

    const totalItems = statusResult.rows.reduce((sum, row) => sum + row.count, 0);

    res.json({
      totalItems,
      byStatus,
      byCategory,
      mostWorn: mostWornResult.rows[0] || null,
    });
  } catch (err) {
    console.error('Closet summary error:', err);
    res.status(500).json({ error: 'Something went wrong loading the closet summary' });
  }
});

// DELETE /items/:id
// Deletes one of the logged in user's clothing items, along with its wash tracker
// records, and keeps the wardrobe's item_count in sync.
router.delete('/:id', requireAuth, async (req, res) => {
  const itemId = Number(req.params.id);
  if (!Number.isInteger(itemId)) {
    return res.status(400).json({ error: 'Invalid item id' });
  }

  let client;
  try {
    const wardrobeId = await getOrCreateWardrobe(req.userId);
    client = await pool.connect();
    await client.query('BEGIN');

    // Only finds the item if it's in the logged in user's wardrobe,
    // so nobody can delete someone else's clothes.
    const owned = await client.query(
      'SELECT id FROM clothing_item WHERE id = $1 AND wardrobe_id = $2',
      [itemId, wardrobeId]
    );

    if (owned.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Item not found' });
    }

    // Clear out the wash tracker records first so nothing points to the deleted item.
    await client.query('DELETE FROM wash_tracker WHERE clothing_item_id = $1', [itemId]);
    await client.query('DELETE FROM clothing_item WHERE id = $1', [itemId]);

    // Keep the wardrobe's item_count in sync without letting it go below zero.
    await client.query(
      'UPDATE wardrobe SET item_count = GREATEST(item_count - 1, 0), last_updated = NOW() WHERE id = $1',
      [wardrobeId]
    );

    await client.query('COMMIT');
    res.json({ success: true, deletedId: itemId });
  } catch (err) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('Delete item error:', err);
    res.status(500).json({ error: 'Something went wrong deleting the item' });
  } finally {
    if (client) client.release();
  }
});

module.exports = router;