import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  cuisine: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  totalTables: { type: Number, default: 20 },
  availableTables: { type: Number, default: 20 },
  priceForTwo: { type: String, required: true },
  phoneNumber: { type: String, required: true }, // For WhatsApp integration
  diet: { type: String, enum: ['Veg', 'Non-Veg', 'Both'], default: 'Both' }, // 'Veg', 'Non-Veg', 'Both'
});

export default mongoose.model('Restaurant', restaurantSchema);
