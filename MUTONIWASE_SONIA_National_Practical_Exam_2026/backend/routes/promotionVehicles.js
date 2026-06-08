const express = require('express');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT pv.*, pr.Title AS promotionTitle, v.Brand, v.Model, v.Plate_Number
       FROM Promotion_Vehicle pv
       JOIN Promotion pr ON pv.PromotionID = pr.PromotionID
       JOIN Vehicle v ON pv.Plate_Number = v.Plate_Number
       ORDER BY pv.PromotionID, pv.Plate_Number`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { PromotionID, Plate_Number, Performance } = req.body;
    if (!PromotionID || !Plate_Number) {
      return res.status(400).json({ error: 'PromotionID and Plate_Number required' });
    }
    await pool.query(
      'INSERT INTO Promotion_Vehicle (PromotionID, Plate_Number, Performance) VALUES (?, ?, ?)',
      [PromotionID, Plate_Number, Performance || 'Medium']
    );
    res.status(201).json({ message: 'Vehicle linked to promotion successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const { PromotionID, Plate_Number, Performance } = req.body;
    await pool.query(
      'UPDATE Promotion_Vehicle SET Performance=? WHERE PromotionID=? AND Plate_Number=?',
      [Performance, PromotionID, Plate_Number]
    );
    res.json({ message: 'Performance updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/', requireAuth, async (req, res) => {
  try {
    const { PromotionID, Plate_Number } = req.body;
    await pool.query(
      'DELETE FROM Promotion_Vehicle WHERE PromotionID=? AND Plate_Number=?',
      [PromotionID, Plate_Number]
    );
    res.json({ message: 'Link removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
