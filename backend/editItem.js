const express = require('express');
const { pool } = require('./db');
const { requireAuth } = require('./auth');

const router = express.Router();

// The details a user can change, and the longest value each one may have.
const EDITABLE_FIELDS = {
  item_name: 100,
  category: 50,
  color: 50,
  size: 20,
  description: 1000,
};

// Checks the request body and returns only the fields that were sent.
// Sending an empty value (or null) clears category, color, size or description.
function buildChanges(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Send the changes as a JSON object' };
  }

  const changes = {};
  for (const [field, maxLength] of Object.entries(EDITABLE_FIELDS)) {
    if (!(field in body)) continue;

    const value = body[field];
    if (value !== null && typeof value !== 'string') {
      return { error: `${field} must be text` };
    }

    const cleaned = value === null ? '' : value.trim();
    if (field === 'item_name' && cleaned === '') {
      return { error: 'Name cannot be empty' };
    }
    if (cleaned.length > maxLength) {
      return { error: `${field} must be ${maxLength} characters or fewer` };
    }
    changes[field] = cleaned === '' ? null : cleaned;
  }

  if (Object.keys(changes).length === 0) {
    return { error: 'Send at least one of: item_name, category, color, size, description' };
  }
  return { changes };
}

// PATCH /items/:id/details
// body example: { "category": "Tops", "color": "Navy" }
// Only the fields that are sent are changed.
router.patch('/:id/details', requireAuth, async (req, res) => {
  const itemId = Number(req.params.id);
  if (!Number.isInteger(itemId)) {
    return res.status(400).json({ error: 'Invalid item id' });
  }

  const { changes, error } = buildChanges(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  // Column names come from the fixed list above, and the values are passed as parameters.
  const fields = Object.keys(changes);
  const values = fields.map((field) => changes[field]);
  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
  values.push(itemId, req.userId);

  try {
    // The join to wardrobe makes sure the item belongs to the logged in user.
    const result = await pool.query(
      `UPDATE clothing_item ci
       SET ${setClause}
       FROM wardrobe w
       WHERE ci.id = $${fields.length + 1}
         AND ci.wardrobe_id = w.id
         AND w.user_id = $${fields.length + 2}
       RETURNING ci.id, ci.item_name, ci.category, ci.color, ci.size,
                 ci.description, ci.status, ci.wear_count`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ item: result.rows[0] });
  } catch (err) {
    console.error('Edit item error:', err.message);
    res.status(500).json({ error: 'Something went wrong updating the item' });
  }
});

module.exports = router;
