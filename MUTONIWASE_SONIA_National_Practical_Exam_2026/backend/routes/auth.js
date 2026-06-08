const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const [rows] = await pool.query('SELECT * FROM Users WHERE UserName = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.userId = user.UserID;
    req.session.userName = user.UserName;
    req.session.role = user.Role;
    res.json({ message: 'Login successful', user: { id: user.UserID, username: user.UserName, role: user.Role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ user: { id: req.session.userId, username: req.session.userName, role: req.session.role } });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

module.exports = router;
