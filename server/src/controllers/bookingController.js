import Booking from '../models/Booking.js';
import Restaurant from '../models/Restaurant.js';
import Table from '../models/Table.js';

export const createBooking = async (req, res) => {
  try {
    const { restaurantId, userName, userPhone, userEmail, date, time, tablesBooked } = req.body;

    const booking = await Booking.create({
      restaurantId,
      userName,
      userPhone,
      userEmail,
      date,
      time,
      tablesBooked
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { userEmail: email } : {};
    
    const bookings = await Booking.find(filter)
      .populate('restaurantId', 'name city image')
      .sort({ createdAt: -1 });
      
    res.json(bookings); // Return array directly to match frontend expectation
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
