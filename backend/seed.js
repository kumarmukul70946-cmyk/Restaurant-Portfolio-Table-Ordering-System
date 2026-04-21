import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from './models/Restaurant.js';
import process from 'process';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernstack';

const cities = ["Mumbai", "New Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur", "Goa", "Ahmedabad", "Lucknow", "Chandigarh"];
const cuisines = ["North Indian", "South Indian", "Mughlai", "Continental", "Pan-Asian", "Seafood", "Italian", "Modern Indian Fusion", "Gourmet Street Food", "Sichuan Chinese", "Lebanese", "Mediterranean"];
const imagery = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
  "https://images.unsplash.com/photo-1414235077428-338988692286",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c",
  "https://images.unsplash.com/photo-1525610553991-2bede1a236e2",
  "https://images.unsplash.com/photo-1600891964092-4316c288032e",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330",
  "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b"
];
const adjectives = ["Royal", "Imperial", "Golden", "Spiced", "Authentic", "Grand", "Urban", "Rustic", "Emerald", "Sapphire", "Velvet", "Crimson"];
const nouns = ["Spoon", "Plate", "Bistro", "Kitchen", "Spice", "Tandoor", "Valley", "Lounge", "Grill", "Court", "Palace", "Oasis"];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function runSeed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB. Clearing old restaurants...');
  await Restaurant.deleteMany({}); // Warning: wipes existing restaurants

  const restaurantsToInsert = [];

  // Fixed iconic restaurants
  restaurantsToInsert.push(
    { name: "Taj Mahal Palace Dining", city: "Mumbai", cuisine: "Indian fine dining", image: imagery[0], description: "Iconic seaside fine dining experience and luxurious ambience.", priceForTwo: "₹4500", totalTables: 50, availableTables: 50, phoneNumber: "+919876543210" },
    { name: "Bukhara", city: "New Delhi", cuisine: "North Indian / Tandoori", image: imagery[1], description: "World-renowned North Indian cuisine with an exquisite menu.", priceForTwo: "₹5500", totalTables: 30, availableTables: 30, phoneNumber: "+919876543211" },
    { name: "Karavalli", city: "Bangalore", cuisine: "Konkan / South Indian", image: imagery[2], description: "Traditional coastal food served in an elegant lush-green setup.", priceForTwo: "₹3500", totalTables: 25, availableTables: 25, phoneNumber: "+919876543212" },
    { name: "Peter Cat", city: "Kolkata", cuisine: "Continental / Chelo Kebab", image: imagery[3], description: "A legendary spot offering an Indo-Continental blend.", priceForTwo: "₹1500", totalTables: 20, availableTables: 20, phoneNumber: "+919876543213" },
    { name: "Indian Accent", city: "New Delhi", cuisine: "Modern Indian Fusion", image: imagery[4], description: "Award-winning progressive Indian cuisine by Chef Manish.", priceForTwo: "₹6000", totalTables: 40, availableTables: 40, phoneNumber: "+919876543214" }
  );

  // Generate 55 dynamic restaurants to reach total of 60
  for(let i=0; i<55; i++) {
    const rName = `${getRandomItem(adjectives)} ${getRandomItem(nouns)}`;
    const rCity = getRandomItem(cities);
    const tables = Math.floor(Math.random() * 30) + 15;
    restaurantsToInsert.push({
      name: rName + (Math.random() > 0.6 ? " " + rCity : ""),
      city: rCity,
      cuisine: getRandomItem(cuisines),
      image: getRandomItem(imagery),
      description: `Experience the finest ${getRandomItem(cuisines)} flavors in the heart of ${rCity}. An exclusive and breathtaking culinary journey.`,
      priceForTwo: `₹${(Math.floor(Math.random() * 30) + 15) * 100}`,
      totalTables: tables,
      availableTables: tables,
      phoneNumber: `+9199999${Math.floor(10000 + Math.random() * 90000)}` // Mock WhatsApp numbers
    });
  }

  await Restaurant.insertMany(restaurantsToInsert);
  console.log(`✅ successfully seeded ${restaurantsToInsert.length} luxury restaurants across India!`);
  process.exit(0);
}

runSeed();
