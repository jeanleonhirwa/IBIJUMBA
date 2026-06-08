const express = require('express');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = `SELECT v.*, u.UserName AS registeredByName
                 FROM Vehicle v JOIN Users u ON v.RegisteredBy = u.UserID`;
    let params = [];
    if (search) {
      query += ' WHERE v.Plate_Number LIKE ? OR v.Brand LIKE ? OR v.Model LIKE ? OR v.Vehicle_Type LIKE ?';
      const s = `%${search}%`;
      params = [s, s, s, s];
    }
    query += ' ORDER BY v.CreatedAt DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Vehicle WHERE Plate_Number = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status } = req.body;
    if (!Plate_Number || !Brand || !Model || !Year || !Vehicle_Type || !Purchase_Price) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    await pool.query(
      'INSERT INTO Vehicle (Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, RegisteredBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status || 'Available', req.session.userId]
    );
    res.status(201).json({ message: 'Vehicle created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { Brand, Model, Year, Vehicle_Type, Purchase_Price, Status } = req.body;
    await pool.query(
      'UPDATE Vehicle SET Brand=?, Model=?, Year=?, Vehicle_Type=?, Purchase_Price=?, Status=? WHERE Plate_Number=?',
      [Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, req.params.id]
    );
    res.json({ message: 'Vehicle updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM Vehicle WHERE Plate_Number = ?', [req.params.id]);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
