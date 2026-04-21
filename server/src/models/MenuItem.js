import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['starters', 'mains', 'desserts', 'drinks', 'sides'],
      lowercase: true,
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    available: { type: Boolean, default: true },
    specialOfTheDay: { type: Boolean, default: false },
    specialDate: { type: Date, default: null },
  },
  { timestamps: true }
);

menuItemSchema.index({ category: 1 });
menuItemSchema.index({ available: 1 });
menuItemSchema.index({ specialOfTheDay: 1, specialDate: 1 });

export default mongoose.model('MenuItem', menuItemSchema);
