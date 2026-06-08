const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const customerRoutes = require('./routes/customers');
const promotionRoutes = require('./routes/promotions');
const promotionVehicleRoutes = require('./routes/promotionVehicles');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'PMS_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/promotion-vehicles', promotionVehicleRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'PMS API is running' });
});

app.listen(PORT, () => {
  console.log(`PMS Backend running on port ${PORT}`);
});
