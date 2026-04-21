import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fake the dotenv path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import Restaurant from './models/Restaurant.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernstack';

const vegRestaurants = [
  { name: "MTR (Mavalli Tiffin Room)", city: "Bangalore", cuisine: "South Indian", description: "Iconic South Indian vegetarian thalis and filter coffee since 1924.", priceForTwo: "₹800" },
  { name: "Haldirams", city: "New Delhi", cuisine: "North Indian / Snacks", description: "Famous for pure vegetarian Indian snacks, sweets, and thalis.", priceForTwo: "₹600" },
  { name: "Saravana Bhavan", city: "Chennai", cuisine: "South Indian", description: "Global chain known for authentic South Indian vegetarian dosas and meals.", priceForTwo: "₹700" },
  { name: "Govinda's", city: "Mumbai", cuisine: "Sattvic Indian", description: "A temple restaurant offering divine sattvic vegetarian buffets.", priceForTwo: "₹1000" },
  { name: "Shree Thaker Bhojanalay", city: "Mumbai", cuisine: "Gujarati Thali", description: "Award-winning traditional Gujarati premium thali experience.", priceForTwo: "₹1200" },
  { name: "Bikanervala", city: "New Delhi", cuisine: "North Indian / Sweets", description: "Premier destination for vegetarian street food, chaats, and rich mithai.", priceForTwo: "₹600" },
  { name: "Rajdhani Thali", city: "Mumbai", cuisine: "Rajasthani / Gujarati", description: "Unlimited grand vegetarian thali offering royal Rajasthani hospitality.", priceForTwo: "₹1100" },
  { name: "Ram Ashraya", city: "Mumbai", cuisine: "South Indian", description: "Legendary Matunga spot for pure veg breakfast and filter coffee.", priceForTwo: "₹400" },
  { name: "Sankalp", city: "Ahmedabad", cuisine: "South Indian", description: "Guinness record holder for the longest dosa, pure veg excellence.", priceForTwo: "₹800" },
  { name: "Murugan Idli Shop", city: "Chennai", cuisine: "South Indian", description: "Softest idlis and signature podis in a pure vegetarian setting.", priceForTwo: "₹500" }
].map(r => ({ ...r, diet: 'Veg', image: "https://images.unsplash.com/photo-1610190176880-928cc7cc1423", totalTables: 25, availableTables: 25, phoneNumber: "+919876543214" }));

const nonVegRestaurants = [
  { name: "Karim's", city: "New Delhi", cuisine: "Mughlai", description: "Historic Mughlai cuisine straight from the imperial kitchens.", priceForTwo: "₹1500" },
  { name: "Bademiya", city: "Mumbai", cuisine: "Kebabs / North Indian", description: "Iconic late-night street food spot famous for chicken tikka rolls and kebabs.", priceForTwo: "₹900" },
  { name: "Paradise Biryani", city: "Hyderabad", cuisine: "Hyderabadi / Biryani", description: "World's favourite biryani destination offering legendary non-veg dishes.", priceForTwo: "₹1200" },
  { name: "Tunday Kababi", city: "Lucknow", cuisine: "Awadhi", description: "Melt-in-your-mouth galouti kebabs with exceptional Awadhi heritage.", priceForTwo: "₹800" },
  { name: "Peter Cat", city: "Kolkata", cuisine: "Continental / Chelo Kebab", description: "A legendary spot offering an Indo-Continental blend and legendary Chelo Kebabs.", priceForTwo: "₹1500" },
  { name: "Bade Miyan", city: "Mumbai", cuisine: "Mughlai / Tandoor", description: "Legendary seekh kebabs and baida rotis served fresh till late night.", priceForTwo: "₹1200" },
  { name: "Barbeque Nation", city: "Bangalore", cuisine: "BBQ / North Indian", description: "Pioneers of the live grill concept with unlimited non-veg appetizers.", priceForTwo: "₹2000" },
  { name: "Dindigul Thalappakatti", city: "Chennai", cuisine: "South Indian / Biryani", description: "Famous seeraga samba biryani packed with traditional non-veg spices.", priceForTwo: "₹1100" },
  { name: "Bawarchi", city: "Hyderabad", cuisine: "Hyderabadi", description: "Authentic Hyderabadi biryani and rich chicken curries.", priceForTwo: "₹1000" },
  { name: "Arsalan", city: "Kolkata", cuisine: "Mughlai / Biryani", description: "The definitive Kolkata style biryani with perfectly cooked meat and potato.", priceForTwo: "₹1300" }
].map(r => ({ ...r, diet: 'Non-Veg', image: "https://images.unsplash.com/photo-1544025162-811cff3d10de", totalTables: 30, availableTables: 30, phoneNumber: "+919876543215" }));

const mixupRestaurants = [
  { name: "Taj Mahal Palace Dining", city: "Mumbai", cuisine: "Indian fine dining", description: "Iconic seaside fine dining experience and luxurious ambience.", priceForTwo: "₹4000" },
  { name: "Bukhara", city: "New Delhi", cuisine: "North Indian / Tandoori", description: "World-renowned North Indian cuisine with an exquisite menu.", priceForTwo: "₹5000" },
  { name: "Karavalli", city: "Bangalore", cuisine: "Konkan / Coastal", description: "Traditional coastal food served in an elegant lush-green setup.", priceForTwo: "₹3000" },
  { name: "Indian Accent", city: "New Delhi", cuisine: "Modern Indian", description: "Inventive Indian cuisine by Chef Manish Mehrotra.", priceForTwo: "₹6000" },
  { name: "The Bombay Canteen", city: "Mumbai", cuisine: "Modern Indian", description: "Recreated local Indian dishes with modern flair and great cocktails.", priceForTwo: "₹2200" },
  { name: "Peshawri", city: "Mumbai", cuisine: "North West Frontier", description: "Award winning robust flavors of the North West Frontier.", priceForTwo: "₹4500" },
  { name: "Olive Bar & Kitchen", city: "New Delhi", cuisine: "Mediterranean / Mix", description: "A gorgeous Mediterranean hideaway with a diverse mixed menu.", priceForTwo: "₹3500" },
  { name: "Farzi Cafe", city: "New Delhi", cuisine: "Modern Indian", description: "Creating an illusion with its innovative Indian cuisine and progressive presentation.", priceForTwo: "₹2000" },
  { name: "Yauatcha", city: "Mumbai", cuisine: "Pan-Asian", description: "Michelin-starred dim sum teahouse offering extraordinary mixed Pan-Asian.", priceForTwo: "₹3000" },
  { name: "Royal China", city: "Mumbai", cuisine: "Authentic Chinese", description: "Finest Cantonese dining with superb dim sum and main courses for all diets.", priceForTwo: "₹2500" }
].map(r => ({ ...r, diet: 'Both', image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", totalTables: 40, availableTables: 40, phoneNumber: "+919876543216" }));

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to target DB: ' + MONGODB_URI);
    
    // Clear the existing restaurants entirely
    await Restaurant.deleteMany({});
    console.log('Cleared all existing restaurants.');
    
    // Insert all 30 restaurants
    const allRestaurants = [...vegRestaurants, ...nonVegRestaurants, ...mixupRestaurants];
    await Restaurant.insertMany(allRestaurants);
    
    console.log(`Successfully inserted ${allRestaurants.length} restaurants (10 Veg, 10 Non-Veg, 10 Mixup)`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
