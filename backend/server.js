const express = require('express');
const cors = require('cors');
const { router: authRouter } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.get('/', (req, res) => res.send('Atelier API is running'));
const { pool } = require('./db');

app.post('/api/clothing-items/:id/image', async (req, res) => {
  const { id } = req.params;
  const { image_url } = req.body;
  try {
    await pool.query(
      'UPDATE clothing_item SET image_url = $1 WHERE id = $2',
      [image_url, id]
    );
    res.json({ success: true, message: 'Image saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// --- Setup ---
// 1. npm install express cors pg bcrypt jsonwebtoken
// 2. Update backend/db.js with your Postgres credentials
// 3. Run once: node -e "require('./db').initDb()"
// 4. Start server: node server.js
