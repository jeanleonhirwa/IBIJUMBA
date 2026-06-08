const express = require('express');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = `SELECT c.*, u.UserName AS registeredByName
                 FROM Customer c JOIN Users u ON c.RegisteredBy = u.UserID`;
    let params = [];
    if (search) {
      query += ' WHERE c.FirstName LIKE ? OR c.LastName LIKE ? OR c.Email LIKE ? OR c.PhoneNumber LIKE ?';
      const s = `%${search}%`;
      params = [s, s, s, s];
    }
    query += ' ORDER BY c.CreatedAt DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Customer WHERE CustomerID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { FirstName, LastName, Email, PhoneNumber, Status } = req.body;
    if (!FirstName || !LastName || !Email || !PhoneNumber) {
      return res.status(400).json({ error: 'First name, last name, email and phone are required' });
    }
    await pool.query(
      'INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Status, RegisteredBy) VALUES (?, ?, ?, ?, ?, ?)',
      [FirstName, LastName, Email, PhoneNumber, Status || 'Active', req.session.userId]
    );
    res.status(201).json({ message: 'Customer created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { FirstName, LastName, Email, PhoneNumber, Status } = req.body;
    await pool.query(
      'UPDATE Customer SET FirstName=?, LastName=?, Email=?, PhoneNumber=?, Status=? WHERE CustomerID=?',
      [FirstName, LastName, Email, PhoneNumber, Status, req.params.id]
    );
    res.json({ message: 'Customer updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM Customer WHERE CustomerID = ?', [req.params.id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
