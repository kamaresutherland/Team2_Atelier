const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { pool } = require('./db');

const router = express.Router();
const SALT_ROUNDS = 10;

// The JWT secret must come from .env. If it is missing, stop the server
// instead of falling back to a guessable default that anyone could use
// to forge login tokens.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    'JWT_SECRET is missing or too short. Add a random value (32+ characters) to backend/.env'
  );
}

// Used so a login for an email that does not exist takes about as long
// as a wrong password, which keeps people from probing for valid emails.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', SALT_ROUNDS);

// Limit repeated login/signup attempts from the same address.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
});

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// POST /auth/signup
router.post('/signup', authLimiter, async (req, res) => {
  const { email, password, name } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const cleanEmail = normalizeEmail(email);

    const existing = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = $1',
      [cleanEmail]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [cleanEmail, passwordHash, name || null]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '7d',
    });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: 'Something went wrong creating your account' });
  }
});

// POST /auth/login
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = $1',
      [normalizeEmail(email)]
    );
    const user = result.rows[0];

    // Always run one bcrypt compare, even if the user was not found.
    const passwordMatches = await bcrypt.compare(
      password,
      user ? user.password_hash : DUMMY_HASH
    );

    // Same message for "no such email" and "wrong password".
    if (!user || !passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '7d',
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Something went wrong logging in' });
  }
});

// Middleware to protect other routes (closet, outfits, etc.)
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { router, requireAuth };
