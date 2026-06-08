const express = require('express');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = `SELECT p.*, u.UserName AS createdByName
                 FROM Promotion p JOIN Users u ON p.CreatedBy = u.UserID`;
    let params = [];
    if (search) {
      query += ' WHERE p.Title LIKE ? OR p.Discount_Type LIKE ?';
      const s = `%${search}%`;
      params = [s, s];
    }
    query += ' ORDER BY p.CreatedAt DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Promotion WHERE PromotionID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Promotion not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status } = req.body;
    if (!Title || !Discount_Type || !Discount_Value || !Start_Date || !End_Date) {
      return res.status(400).json({ error: 'Title, discount type, discount value, start and end dates required' });
    }
    await pool.query(
      'INSERT INTO Promotion (Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status || 'Active', req.session.userId]
    );
    res.status(201).json({ message: 'Promotion created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status } = req.body;
    await pool.query(
      'UPDATE Promotion SET Title=?, Description=?, Discount_Type=?, Discount_Value=?, Start_Date=?, End_Date=?, Status=? WHERE PromotionID=?',
      [Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, req.params.id]
    );
    res.json({ message: 'Promotion updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM Promotion WHERE PromotionID = ?', [req.params.id]);
    res.json({ message: 'Promotion deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
