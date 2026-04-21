import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import process from 'process';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Restaurant from './models/Restaurant.js';
import Booking from './models/Booking.js';
import User from './models/User.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfood';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allows all origins for local dev
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernstack';
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully');
    await seedRestaurants();
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

async function seedRestaurants() {
  const count = await Restaurant.countDocuments();
  if (count === 0) {
    const defaultRestaurants = [
      { name: "Taj Mahal Palace Dining", city: "Mumbai", cuisine: "Indian fine dining", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", description: "Iconic seaside fine dining experience and luxurious ambience.", priceForTwo: "₹4000", totalTables: 50, availableTables: 50, phoneNumber: "+919876543210" },
      { name: "Bukhara", city: "New Delhi", cuisine: "North Indian / Tandoori", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b", description: "World-renowned North Indian cuisine with an exquisite menu.", priceForTwo: "₹5000", totalTables: 30, availableTables: 30, phoneNumber: "+919876543211" },
      { name: "Karavalli", city: "Bangalore", cuisine: "Konkan / South Indian Coastal", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9", description: "Traditional coastal food served in an elegant lush-green setup.", priceForTwo: "₹3000", totalTables: 25, availableTables: 25, phoneNumber: "+919876543212" },
      { name: "Peter Cat", city: "Kolkata", cuisine: "Continental / Chelo Kebab", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5", description: "A legendary spot offering an Indo-Continental blend.", priceForTwo: "₹1500", totalTables: 20, availableTables: 20, phoneNumber: "+919876543213" },
    ];
    await Restaurant.insertMany(defaultRestaurants);
    console.log('🍽️ DB seeded with Indian Restaurants.');
  }
}

// AUTHENTICATION ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || 'user' });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ userId: user._id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// USER DASHBOARD ROUTE (Fetch bookings by email/phone matching logged in user)
app.get('/api/user/bookings', async (req, res) => {
  try {
    const email = req.query.email; // simple query pass for demo
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    // For realism, we'll try to find bookings matching user names or email. 
    // Wait, Booking schema doesn't have email. We'll search by userName matching the user's name for this simple prototype!
    const user = await User.findOne({ email });
    if(!user) return res.status(404).json({ error: 'User not found' });

    const bookings = await Booking.find({ userName: user.name }).populate('restaurantId').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESTAURANT ROUTES
app.get('/api/restaurants', async (req, res) => {
  try {
    const places = await Restaurant.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const dest = await Restaurant.findById(req.params.id);
    if (!dest) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(dest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BOOKING ROUTES
app.post('/api/bookings', async (req, res) => {
  try {
    const { restaurantId, userName, userPhone, date, time, tablesBooked } = req.body;
    
    // Check tables availability
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    if (restaurant.availableTables < tablesBooked) {
      return res.status(400).json({ error: 'Not enough tables available.' });
    }

    const booking = new Booking({ restaurantId, userName, userPhone, date, time, tablesBooked });
    await booking.save();

    // Deduct available tables
    restaurant.availableTables -= tablesBooked;
    await restaurant.save();

    res.status(201).json({ message: 'Booking confirmed!', booking, restaurantWhatsapp: restaurant.phoneNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN DASHBOARD ROUTE
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const restaurantsCount = await Restaurant.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    const bookings = await Booking.find().populate('restaurantId').sort({ createdAt: -1 }).limit(10);
    
    const restaurants = await Restaurant.find();
    let totalTables = 0; let availableTables = 0;
    restaurants.forEach(r => {
      totalTables += r.totalTables;
      availableTables += r.availableTables;
    });

    res.json({
      metrics: {
        totalRestaurants: restaurantsCount,
        totalBookings: bookingsCount,
        totalTables,
        availableTables
      },
      recentBookings: bookings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN ADD RESTAURANT ROUTE
app.post('/api/admin/restaurant', async (req, res) => {
  try {
    const { name, city, cuisine, image, description, priceForTwo, phoneNumber, diet, totalTables } = req.body;
    
    const newRestaurant = new Restaurant({
      name,
      city,
      cuisine,
      image,
      description,
      priceForTwo,
      phoneNumber,
      diet,
      totalTables: totalTables || 20,
      availableTables: totalTables || 20
    });
    
    await newRestaurant.save();
    res.status(201).json({ message: 'Restaurant added successfully!', restaurant: newRestaurant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REAL-TIME CHAT (Socket.io)
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  // Listen for chat messages from the user
  socket.on('send_message', (data) => {
    console.log(`💬 Message from ${socket.id}: ${data.text}`);
    let responseText = data.lang === 'hi' 
      ? "संपर्क करने के लिए धन्यवाद! हमारी टीम जल्द ही आपसे संपर्क करेगी।" 
      : "Thanks for reaching out! Our team will get back to you shortly. In the meantime, you can explore our premium destinations on the home page.";
      
    const textLower = data.text.toLowerCase();

    // Comprehensive Keyword based smart replies for luxury dining
    if (textLower.includes('book') || textLower.includes('table') || textLower.includes('work') || textLower.includes('make a reservation') || textLower.includes('बुक')) {
      responseText = data.lang === 'hi'
        ? "टेबल बुक करना बहुत आसान है! किसी भी रेस्टोरेंट कार्ड पर 'Make a Reservation' पर क्लिक करें। अपना विवरण भरें और WhatsApp के माध्यम से तुरंत पुष्टि प्राप्त करें।"
        : "Booking with Zaika is seamless! Click 'Make a Reservation' on any restaurant card. Enter your guest details (Name, WhatsApp number, Date, Time, and Table Count), and confirm. You will receive an automated WhatsApp message to secure it.";
    } else if (textLower.includes('menu') || textLower.includes('service') || textLower.includes('offer') || textLower.includes('सेवा')) {
      responseText = data.lang === 'hi'
        ? "हम पूरे भारत में बेहतरीन लक्जरी डाइनिंग अनुभव प्रदान करते हैं। आप 'Veg' या 'Non-Veg' फिल्टर कर सकते हैं और कीमत के अनुसार रेस्टोरेंट चुन सकते हैं।"
        : "At Zaika, we curate the finest luxury dining experiences across India. You can easily filter through our catalog to find 'Pure Veg' or 'Non-Veg' specific venues, and sort them strictly by your budget.";
    } else if (textLower.includes('veg') || textLower.includes('vegetarian') || textLower.includes('diet') || textLower.includes('शाकाहारी')) {
      responseText = data.lang === 'hi'
        ? "हाँ! हमारे पास कई प्रसिद्ध शुद्ध शाकाहारी रेस्टोरेंट हैं (जैसे MTR और Haldiram's)। आप ऊपर दिए गए मेनू से तुरंत फ़िल्टर कर सकते हैं।"
        : "Yes! You can instantly filter all destinations using our top menu. We feature renowned exclusively vegetarian restaurants (like MTR and Haldiram's) as well as venues that serve both.";
    } else if (textLower.includes('cancel') || textLower.includes('refund') || textLower.includes('what if') || textLower.includes('रद्द') || textLower.includes('कैंसिल')) {
      responseText = data.lang === 'hi'
        ? "यदि आप अपनी बुकिंग 4 घंटे पहले रद्द करते हैं, तो पूरा रिफंड हमारे WhatsApp सपोर्ट के माध्यम से आपके मूल भुगतान विधि में वापस कर दिया जाएगा।"
        : "Cancellations can be handled seamlessly. If you cancel your reservation up to 4 hours in advance, a full refund will be processed directly to your original payment method via our WhatsApp support.";
    } else if (textLower.includes('dress code') || textLower.includes('wear') || textLower.includes('attire') || textLower.includes('कपड़े') || textLower.includes('ड्रेस')) {
      responseText = data.lang === 'hi'
        ? "चूँकि हम लक्जरी रेस्टोरेंट के साथ काम करते हैं, हम स्मार्ट-कैज़ुअल या फॉर्मल ड्रेस कोड की सलाह देते हैं।"
        : "As we partner with luxury fine-dining establishments, we strongly recommend a smart-casual or formal dress code. Specific venues may restrict entry for open-toed shoes or sportswear.";
    } else if (textLower.includes('pay') || textLower.includes('payment') || textLower.includes('cost') || textLower.includes('पेमेंट') || textLower.includes('भुगतान')) {
      responseText = data.lang === 'hi'
        ? "हम WhatsApp के माध्यम से आधुनिक चेकआउट संचालित करते हैं! बुकिंग करते ही, सिस्टम आपको सुरक्षित भुगतान लिंक भेजेगा।"
        : "We operate a modernized checkout via WhatsApp! Once you request a table booking, our automated WhatsApp System sends you a secure click-to-pay link exactly to the number you provided.";
    } else if (textLower.includes('contact') || textLower.includes('location') || textLower.includes('address') || textLower.includes('emergency') || textLower.includes('संपर्क') || textLower.includes('लोकेशन')) {
      responseText = data.lang === 'hi'
        ? "हमारा ज़ायका मुख्यालय 15, कॉर्पोरेट रोड, वडोदरा, गुजरात में है। सहायता के लिए +91 98765 43210 पर कॉल करें या rs2114446@gmail.com पर ईमेल करें।"
        : "Zaika Concierge Headquarters is at 15, Corporate Road, Vadodara, Gujarat. For emergency modifications to live bookings, call 24/7 support at +91 98765 43210 or email rs2114446@gmail.com.";
    } else if (textLower.includes('hi') || textLower.includes('hello') || textLower.includes('नमस्ते') || textLower.includes('हेलो')) {
      responseText = data.lang === 'hi'
        ? "नमस्ते! ज़ायका में आपका स्वागत है। आज मैं आपकी लक्जरी डाइनिंग योजना में कैसे मदद कर सकता हूँ?"
        : "Hello there! Welcome to Zaika. How can I assist you with your luxury dining plans today?";
    }

    // Immediately echo back the auto-reply for the demo
    setTimeout(() => {
      socket.emit('receive_message', {
        sender: 'Zaika Assistant',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 800);
  });

  socket.on('disconnect', () => {
    console.log(`🚪 Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server with Socket.io is running on http://localhost:${PORT}`);
});
