-- ============================================================
-- Atelier Database — Full Schema
-- TM02 Sprint 2 
-- ============================================================

-- ── USERS (original) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── WARDROBE ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wardrobe (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  item_count INTEGER DEFAULT 0,
  wardrobe_status VARCHAR(50) DEFAULT 'active',
  last_updated TIMESTAMP DEFAULT NOW()
);

-- ── CLOTHING ITEM (includes description - TM02-15) ──────────
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

-- ── WASH TRACKER ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wash_tracker (
  id SERIAL PRIMARY KEY,
  clothing_item_id INTEGER REFERENCES clothing_item(id) ON DELETE CASCADE,
  current_wear_count INTEGER DEFAULT 0,
  wash_threshold INTEGER DEFAULT 3,
  wash_status VARCHAR(20) DEFAULT 'clean' CHECK (wash_status IN ('clean', 'dirty')),
  last_washed TIMESTAMP
);

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Sample users
INSERT INTO users (email, password_hash, name) VALUES
  ('caleb@atelier.app',   '$2b$12$xK...', 'Caleb'),
  ('gavin@atelier.app',   '$2b$12$mN...', 'Gavin'),
  ('kamare@atelier.app',  '$2b$12$pQ...', 'Kamare'),
  ('bradley@atelier.app', '$2b$12$rT...', 'Bradley')
ON CONFLICT (email) DO NOTHING;

-- Sample wardrobes (one per user)
INSERT INTO wardrobe (user_id, item_count, wardrobe_status) VALUES
  (1, 12, 'active'),
  (2, 7,  'active'),
  (3, 3,  'active'),
  (4, 1,  'active');

-- Sample clothing items
INSERT INTO clothing_item (wardrobe_id, item_name, category, color, size, status, wear_count, description) VALUES
  (1, 'Blue denim jacket', 'Tops',    'Blue',  'M', 'clean', 2, 'This is my blue Denim Jacket'),
  (1, 'White sneakers',    'Shoes',   'White', '10','worn',  4, 'Everyday casual sneakers'),
  (1, 'Black joggers',     'Bottoms', 'Black', 'M', 'dirty', 5, 'Gym and lounge pants'),
  (2, 'Grey hoodie',       'Tops',    'Grey',  'L', 'clean', 1, 'Comfortable everyday hoodie');

-- Sample wash tracker records
INSERT INTO wash_tracker (clothing_item_id, current_wear_count, wash_threshold, wash_status) VALUES
  (1, 2, 5, 'clean'),
  (2, 4, 5, 'clean'),
  (3, 5, 5, 'dirty'),
  (4, 1, 3, 'clean');

-- ============================================================
-- USEFUL QUERIES
-- ============================================================

-- Get all clean clothing items
SELECT ci.item_name, ci.category, ci.status, ci.wear_count, ci.description
FROM clothing_item ci
WHERE ci.status = 'clean'
ORDER BY ci.wear_count DESC;

-- Get all dirty items that need washing
SELECT ci.item_name, wt.current_wear_count, wt.wash_threshold, wt.wash_status
FROM wash_tracker wt
JOIN clothing_item ci ON ci.id = wt.clothing_item_id
WHERE wt.wash_status = 'dirty';

-- Get all users with their wardrobe info
SELECT u.name, u.email, w.item_count, w.wardrobe_status
FROM users u
JOIN wardrobe w ON u.id = w.user_id
ORDER BY w.item_count DESC;

-- Get item with description (TM02-15)
SELECT item_name, category, color, size, status, wear_count, description
FROM clothing_item
WHERE id = 1;