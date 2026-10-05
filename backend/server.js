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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
