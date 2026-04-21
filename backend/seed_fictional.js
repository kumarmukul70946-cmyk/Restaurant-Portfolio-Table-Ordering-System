import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Restaurant from './models/Restaurant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernstack';

const vegRestaurants = [
  { name: "Green Leaf Eats", city: "Mumbai", cuisine: "Healthy / Wraps", description: "Located at 42 Wellness Avenue. Famous for the Avocado Quinoa Bowl. A perfect health spot.", priceForTwo: "₹500" },
  { name: "The Bombay Thali", city: "Mumbai", cuisine: "Indian Thali", description: "Located at 8 Heritage Street. Famous for the Grand Royal Thali.", priceForTwo: "₹800" },
  { name: "Pasta La Vista Veg", city: "Bangalore", cuisine: "Italian", description: "Located at 12 Serenity Lane. Famous for Truffle Mushroom Risotto.", priceForTwo: "₹1200" },
  { name: "Root & Shoots", city: "Delhi", cuisine: "Healthy / Salads", description: "Located at 19 Green Park. Famous for the Mediterranean Zen Salad.", priceForTwo: "₹700" },
  { name: "Sattvic Soul", city: "Chennai", cuisine: "South Indian", description: "Located at 3 Temple Road. Famous for Premium Ghee Roast Dosa.", priceForTwo: "₹400" },
  { name: "Pesto & Spice", city: "Pune", cuisine: "Italian / Indian Fusion", description: "Located at 44 Crossway. Famous for Paneer Tikka Pizza.", priceForTwo: "₹900" },
  { name: "Bowl of Greens", city: "Hyderabad", cuisine: "Healthy", description: "Located at 11 Freshway. Famous for the Detox Green Smoothie Bowl.", priceForTwo: "₹600" },
  { name: "Royal Rajasthan", city: "Jaipur", cuisine: "Indian", description: "Located at 5 Palace Road. Famous for authentic Dal Baati Churma.", priceForTwo: "₹1000" },
  { name: "The Basil Leaf", city: "Mumbai", cuisine: "Italian", description: "Located at 22 Olive Street. Famous for Hand-rolled Spinach Ravioli.", priceForTwo: "₹1500" },
  { name: "Sprout Cafe", city: "Bangalore", cuisine: "Healthy / Indian", description: "Located at 9 Nature Walk. Famous for the Millet Khichdi.", priceForTwo: "₹450" }
].map((r, index) => ({ ...r, diet: 'Veg', image: `https://loremflickr.com/800/600/vegetarian,food?lock=${index + 1}`, totalTables: 20, availableTables: 20, phoneNumber: "+911234567890" }));

const nonVegImages = [
  "1544025162-811cff3d10de", "1555939594-58d7cb561ad1", "1529193591-1cbfadddc361", 
  "1558030006-4554b2fc5d00", "1563805042-7684c8b9e4a3", "1600891964092-4316c288032e", 
  "1565557613264-7fd4cb05ebdd", "1532453288672-3a27e9be2533", "1514933651103-005eec06c04b", 
  "1555396273-367ea4eb4db5"
];

const nonVegRestaurants = [
  { name: "Smoke & Ember", city: "Delhi", cuisine: "BBQ / Grill", description: "Located at 55 Firehouse Lane. Famous for 12-Hour Smoked Brisket.", priceForTwo: "₹2500" },
  { name: "The Ocean Catch", city: "Goa", cuisine: "Seafood", description: "Located at 2 Beachfront. Famous for Butter Garlic Lobsters.", priceForTwo: "₹3000" },
  { name: "Flame & Spice", city: "Hyderabad", cuisine: "Multi-Cuisine", description: "Located at 99 Grill Road. Famous for the Flame-grilled Chicken Tikka.", priceForTwo: "₹1200" },
  { name: "Carnivore's Den", city: "Bangalore", cuisine: "Grill / Steakhouse", description: "Located at 10 Meatway. Famous for the Tomahawk Ribeye.", priceForTwo: "₹3500" },
  { name: "Deep Blue Seafood", city: "Mumbai", cuisine: "Seafood", description: "Located at 15 Marine Drive. Famous for the Spicy Crab Curry.", priceForTwo: "₹2000" },
  { name: "Rustic BBQ", city: "Pune", cuisine: "BBQ", description: "Located at 33 Charcoal Street. Famous for Sticky BBQ Ribs.", priceForTwo: "₹1800" },
  { name: "Global Platters", city: "Chennai", cuisine: "Multi-Cuisine", description: "Located at 88 Fusion Avenue. Famous for the Continental Meat Platter.", priceForTwo: "₹1600" },
  { name: "The Grill House", city: "Kolkata", cuisine: "Grill", description: "Located at 7 Park Street. Famous for Grilled Bhetki Fish.", priceForTwo: "₹1400" },
  { name: "Coastal Spices", city: "Kochi", cuisine: "Seafood / Multi-Cuisine", description: "Located at 14 Harbour Road. Famous for Kerala Prawn Fry.", priceForTwo: "₹1500" },
  { name: "Urban Kebab", city: "Lucknow", cuisine: "Multi-Cuisine", description: "Located at 21 Heritage Walk. Famous for Melt-in-mouth Galouti.", priceForTwo: "₹1000" }
].map((r, index) => ({ ...r, diet: 'Non-Veg', image: `https://images.unsplash.com/photo-${nonVegImages[index]}?w=800&q=80`, totalTables: 25, availableTables: 25, phoneNumber: "+911234567891" }));

const cafeRestaurants = [
  { name: "The Daily Brew", city: "Bangalore", cuisine: "Cafe / Quick Bites", description: "Located at 1 Espresso Lane. Famous for Caramel Macchiato & Croissants.", priceForTwo: "₹600" },
  { name: "Sweet Notions", city: "Mumbai", cuisine: "Dessert Parlor", description: "Located at 4 Sugar Street. Famous for Dark Chocolate Lava Cake.", priceForTwo: "₹800" },
  { name: "Urban Roasters", city: "Delhi", cuisine: "Cafe", description: "Located at 22 Bean Blvd. Famous for Pour-Over Artisanal Coffee.", priceForTwo: "₹700" },
  { name: "Midnight Cravings", city: "Pune", cuisine: "Quick Bites", description: "Located at 8 Nightway. Famous for Loaded Cheese Fries.", priceForTwo: "₹500" },
  { name: "Vanilla & Co.", city: "Chennai", cuisine: "Dessert Parlor", description: "Located at 11 Vanilla Road. Famous for French Macarons.", priceForTwo: "₹900" },
  { name: "The Sandwich Studio", city: "Hyderabad", cuisine: "Quick Bites", description: "Located at 5 Bread Alley. Famous for the Triple Decker Club.", priceForTwo: "₹450" },
  { name: "Mocha Magic", city: "Kolkata", cuisine: "Cafe", description: "Located at 99 Writer's Walk. Famous for the Classic Hazelnut Mocha.", priceForTwo: "₹550" },
  { name: "Waffle Wonderland", city: "Jaipur", cuisine: "Dessert Parlor", description: "Located at 7 Pink Street. Famous for Belgian Berry Waffles.", priceForTwo: "₹650" },
  { name: "Bite & Go", city: "Ahmedabad", cuisine: "Quick Bites", description: "Located at 10 Fast Lane. Famous for the Peri Peri Wrap.", priceForTwo: "₹400" },
  { name: "Artisan Bakes", city: "Chandigarh", cuisine: "Cafe / Bakery", description: "Located at 12 Sector Road. Famous for Cinnamon Swirl Buns.", priceForTwo: "₹750" }
].map((r, index) => ({ ...r, diet: 'Both', image: `https://loremflickr.com/800/600/cafe,dessert?lock=${index + 21}`, totalTables: 15, availableTables: 15, phoneNumber: "+911234567892" }));

async function seedFictional() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB.');
  
  await Restaurant.deleteMany({});
  
  const allRestaurants = [...vegRestaurants, ...nonVegRestaurants, ...cafeRestaurants];
  await Restaurant.insertMany(allRestaurants);
  
  console.log(`✅ successfully seeded ${allRestaurants.length} fictional restaurants mapped to existing schema!`);
  process.exit(0);
}

seedFictional().catch(console.error);
