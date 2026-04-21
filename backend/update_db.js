import mongoose from 'mongoose';
import Restaurant from './models/Restaurant.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernstack';

async function updateDb() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  // Update existing restaurants
  await Restaurant.updateMany({}, { $set: { diet: 'Non-Veg' } });
  
  // Update Taj Mahal to 'Both'
  await Restaurant.updateOne({ name: /Taj Mahal/i }, { $set: { diet: 'Both' } });

  // Add a Veg restaurant
  const vegExists = await Restaurant.findOne({ name: 'MTR (Mavalli Tiffin Room)' });
  if (!vegExists) {
    await Restaurant.create({
      name: "MTR (Mavalli Tiffin Room)",
      city: "Bangalore",
      cuisine: "South Indian Vegetarian",
      image: "https://images.unsplash.com/photo-1610190176880-928cc7cc1423",
      description: "Iconic South Indian vegetarian thalis and filter coffee since 1924.",
      priceForTwo: "₹800",
      totalTables: 40,
      availableTables: 40,
      phoneNumber: "+919876543214",
      diet: 'Veg'
    });
    console.log('Added MTR Veg Restaurant.');
  }

  // Add another Veg restaurant
  const vegExists2 = await Restaurant.findOne({ name: 'Haldirams' });
  if (!vegExists2) {
    await Restaurant.create({
      name: "Haldirams",
      city: "New Delhi",
      cuisine: "North Indian / Snacks",
      image: "https://images.unsplash.com/photo-1599487405948-4cb98e4af414",
      description: "Famous for pure vegetarian Indian snacks, sweets, and thalis.",
      priceForTwo: "₹600",
      totalTables: 60,
      availableTables: 60,
      phoneNumber: "+919876543215",
      diet: 'Veg'
    });
    console.log('Added Haldirams Veg Restaurant.');
  }

  console.log('Update Complete.');
  process.exit(0);
}

updateDb();
