const express = require('express');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/customer-promotions', requireAuth, async (req, res) => {
  try {
    const query = `
      SELECT
        CONCAT(c.FirstName, ' ', c.LastName) AS CustomerName,
        v.Brand,
        v.Model,
        p.Title AS PromotionTitle,
        CONCAT(p.Discount_Value, CASE
          WHEN p.Discount_Type = 'percentage' THEN '%'
          WHEN p.Discount_Type IN ('FLAT_RATE', 'CASHBACK', 'amount') THEN ' RWF'
          WHEN p.Discount_Type = 'free' THEN ' (Free)'
          WHEN p.Discount_Type = 'BUY_ONE_GET_ONE' THEN ' (BOGO)'
          WHEN p.Discount_Type = 'Bundle' THEN ' (Bundle)'
          ELSE ''
        END) AS DiscountValue,
        pv.Performance
      FROM Customer c
      CROSS JOIN Vehicle v
      JOIN Promotion_Vehicle pv ON v.Plate_Number = pv.Plate_Number
      JOIN Promotion p ON pv.PromotionID = p.PromotionID
      WHERE c.Status = 'Active' AND p.Status = 'Active'
      ORDER BY c.LastName, v.Brand, p.Title
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
