import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', default: null },
    number: { type: String, required: true, unique: true, trim: true },
    capacity: { type: Number, default: 4, min: 1 },
    section: { type: String, trim: true, default: 'Main Hall' },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'cleaning'],
      default: 'available',
    },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

// tableSchema.index({ number: 1 });
tableSchema.index({ restaurantId: 1 });
tableSchema.index({ section: 1 });
tableSchema.index({ status: 1 });

export default mongoose.model('Table', tableSchema);
