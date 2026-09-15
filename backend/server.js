const express = require('express');
const cors = require('cors');
const { router: authRouter } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.get('/', (req, res) => res.send('Atelier API is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// --- Setup ---
// 1. npm install express cors pg bcrypt jsonwebtoken
// 2. Update backend/db.js with your Postgres credentials
// 3. Run once: node -e "require('./db').initDb()"
// 4. Start server: node server.js
