const express = require('express');
const cors = require('cors');
const { router: authRouter } = require('./auth');
const itemsRouter = require('./items');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // raised limit in case base64 images are sent

app.use('/auth', authRouter);
app.use('/items', itemsRouter);

app.get('/', (req, res) => res.send('Atelier API is running'));

app.post('/api/clothing-items/:id/worn', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE clothing_item 
       SET wear_count = wear_count + 1, 
           status = 'worn' 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
