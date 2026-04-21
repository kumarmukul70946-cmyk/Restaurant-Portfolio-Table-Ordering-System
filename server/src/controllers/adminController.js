import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const token = generateToken(admin._id);
    res.json({
      success: true,
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

import Restaurant from '../models/Restaurant.js';
import Table from '../models/Table.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    const totalRestaurants = await Restaurant.countDocuments();
    const tables = await Table.find();
    const totalTables = tables.length;
    const availableTables = tables.filter(t => t.status === 'available').length;
    // Assuming bookings exist or we just return 0 if no Order model
    const totalBookings = 0; 

    res.json({
      metrics: {
        totalRestaurants,
        totalTables,
        availableTables,
        totalBookings
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
