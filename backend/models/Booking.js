import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  tablesBooked: { type: Number, required: true, min: 1 },
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Booking', bookingSchema);
