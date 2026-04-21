import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    code: { type: String, required: true, trim: true, uppercase: true, unique: true },
    location: { type: String, trim: true, default: '' },
    tagline: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    cuisineTags: [{ type: String, trim: true }],
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
    diet: { type: String, enum: ['Veg', 'Non-Veg', 'Both'], default: 'Both' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// restaurantSchema.index({ code: 1 });
restaurantSchema.index({ isActive: 1, sortOrder: 1, name: 1 });

export default mongoose.model('Restaurant', restaurantSchema);
