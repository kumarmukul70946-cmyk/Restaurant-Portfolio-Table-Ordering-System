# 🍽️ Zaika - Premium Dining Experience

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black.svg)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue.svg)](https://tailwindcss.com/)

**Zaika** is a modern, full-stack MERN web application designed to curate and manage luxury dining experiences and restaurant reservations across India. It features beautiful glassmorphic UI elements, robust backend management, secure user authentication, and a real-time smart bilingual chatbot.

![Zaika UI Preview](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Key Features

### For Guests
*   **Explore Destinations:** Seamlessly browse exactly 30 uniquely curated fine-dining restaurants, cafes, and grill-houses.
*   **Smart Filtering & Sorting:** Instantly filter directories between strictly **Veg**, **Non-Veg**, and **All** categories, or sort by Price strictly from Low-to-High.
*   **Make Secure Reservations:** View exact table limits and instantly reserve tables.
*   **Bilingual Smart Assistant:** Contains an embedded, real-time Socket.io chatbot that instantly responds to reservation status or dining questions in both English and Hindi.
*   **My Bookings Dashboard:** Manage all of your reservations in an elegant overview.

### For Administrators
*   **Role-Based Access Control:** Secure JWT authentication to protect the backend.
*   **Live Metrics:** Track total reservations, entire venue limits, and overall registered capacity.
*   **Dynamic Restaurant Generator:** Easily and securely add new restaurants directly from the Admin Panel via a comprehensive input form.

---

## 🛠️ Tech Stack & Architecture

### **Frontend** (Client-side)
*   **React 19** + **Vite** for blazing fast HMR and optimized production builds.
*   **Tailwind CSS (v3)** for beautiful, dark-themed utility-first styling and glassmorphism UI.
*   **React Router DOM** for protected route navigation.
*   **Socket.io Client** for real-time WebSocket communication.

### **Backend** (Server-side)
*   **Node.js** & **Express** REST API.
*   **MongoDB** & **Mongoose** for data schemas and structured persistence.
*   **JSON-Web-Token (JWT)** & **Bcryptjs** for safely hashed passwords and secure sessions.
*   **Socket.io Server** driving the intelligent automated chat systems.

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have Node.js installed on your machine and MongoDB running locally on port `27017` (or provide a remote URI).

### 2. Installation
Clone the repository, then install both frontend and backend dependencies.

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd backend
npm install
```

### 3. Environment Variables
Create a `.env` file inside the `/backend` folder with the following keys:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mernstack
JWT_SECRET=supersecretfood
```

### 4. Running the Application

You need to run both the Vite frontend server and Node.js backend server simultaneously.

**Start the Backend API (Port 5000):**
```bash
cd backend
npm run dev
```

**Start the Frontend Client (Port 5173):**
```bash
# In the root directory
npm run dev
```

---

## 🛡️ Authentication & Administration

By default, any new user registered through the UI receives standard `"user"` permissions. 

To gain access to the **Admin Dashboard**, you must manually assign an account to have the `"admin"` role exactly within your MongoDB database, or sign in using a pre-seeded admin credential:
*   **Admin Email:** `admin@zaika.com`
*   **Password:** `admin`

Once authenticated using an administrator profile, the **"Admin Panel"** button will unlock directly in the navigation bar.

---

## 🏛️ Database Seeding

A powerful, pre-configured seed script exists to wipe the local database clean and populate the application with exactly 30 extremely realistic (Unsplash photo-backed) fictional restaurants categorized seamlessly into `Veg`, `Non-Veg`, and `Cafes`.

To reset and inject these 30 perfect placements:
```bash
cd backend
node seed_fictional.js
```

---

> **Designed and strictly optimized for the modern luxury dining experience.**

---

## 📋 The 30 Fictional Restaurant Database

To test out sorting and category filters perfectly, the database is populated with the following 30 uniquely generated restaurant mockups mapping strictly to `Veg`, `Non-Veg`, and `Both` (Cafes).

### 🥦 Pure Vegetarian
| ID | Name | Category (Diet) | Description | Price Range |
|---|---|---|---|---|
| 1 | Green Leaf Eats | Veg | Located at 42 Wellness Avenue. Famous for the Avocado Quinoa Bowl. | ₹500 |
| 2 | The Bombay Thali | Veg | Located at 8 Heritage Street. Famous for the Grand Royal Thali. | ₹800 |
| 3 | Pasta La Vista Veg | Veg | Located at 12 Serenity Lane. Famous for Truffle Mushroom Risotto. | ₹1200 |
| 4 | Root & Shoots | Veg | Located at 19 Green Park. Famous for the Mediterranean Zen Salad. | ₹700 |
| 5 | Sattvic Soul | Veg | Located at 3 Temple Road. Famous for Premium Ghee Roast Dosa. | ₹400 |
| 6 | Pesto & Spice | Veg | Located at 44 Crossway. Famous for Paneer Tikka Pizza. | ₹900 |
| 7 | Bowl of Greens | Veg | Located at 11 Freshway. Famous for the Detox Green Smoothie Bowl. | ₹600 |
| 8 | Royal Rajasthan | Veg | Located at 5 Palace Road. Famous for authentic Dal Baati Churma. | ₹1000 |
| 9 | The Basil Leaf | Veg | Located at 22 Olive Street. Famous for Hand-rolled Spinach Ravioli. | ₹1500 |
| 10| Sprout Cafe | Veg | Located at 9 Nature Walk. Famous for the Millet Khichdi. | ₹450 |

### 🥩 Non-Vegetarian / Grills & Seafood
| ID | Name | Category (Diet) | Description | Price Range |
|---|---|---|---|---|
| 11| Smoke & Ember | Non-Veg | Located at 55 Firehouse Lane. Famous for 12-Hour Smoked Brisket. | ₹2500 |
| 12| The Ocean Catch | Non-Veg | Located at 2 Beachfront. Famous for Butter Garlic Lobsters. | ₹3000 |
| 13| Flame & Spice | Non-Veg | Located at 99 Grill Road. Famous for the Flame-grilled Chicken Tikka. | ₹1200 |
| 14| Carnivore's Den | Non-Veg | Located at 10 Meatway. Famous for the Tomahawk Ribeye. | ₹3500 |
| 15| Deep Blue Seafood | Non-Veg | Located at 15 Marine Drive. Famous for the Spicy Crab Curry. | ₹2000 |
| 16| Rustic BBQ | Non-Veg | Located at 33 Charcoal Street. Famous for Sticky BBQ Ribs. | ₹1800 |
| 17| Global Platters | Non-Veg | Located at 88 Fusion Avenue. Famous for the Continental Meat Platter. | ₹1600 |
| 18| The Grill House | Non-Veg | Located at 7 Park Street. Famous for Grilled Bhetki Fish. | ₹1400 |
| 19| Coastal Spices | Non-Veg | Located at 14 Harbour Road. Famous for Kerala Prawn Fry. | ₹1500 |
| 20| Urban Kebab | Non-Veg | Located at 21 Heritage Walk. Famous for Melt-in-mouth Galouti. | ₹1000 |

### ☕ Cafes & Mixup
| ID | Name | Category (Diet) | Description | Price Range |
|---|---|---|---|---|
| 21| The Daily Brew | Both | Located at 1 Espresso Lane. Famous for Caramel Macchiato & Croissants. | ₹600 |
| 22| Sweet Notions | Both | Located at 4 Sugar Street. Famous for Dark Chocolate Lava Cake. | ₹800 |
| 23| Urban Roasters | Both | Located at 22 Bean Blvd. Famous for Pour-Over Artisanal Coffee. | ₹700 |
| 24| Midnight Cravings | Both | Located at 8 Nightway. Famous for Loaded Cheese Fries. | ₹500 |
| 25| Vanilla & Co. | Both | Located at 11 Vanilla Road. Famous for French Macarons. | ₹900 |
| 26| The Sandwich Studio | Both | Located at 5 Bread Alley. Famous for the Triple Decker Club. | ₹450 |
| 27| Mocha Magic | Both | Located at 99 Writer's Walk. Famous for the Classic Hazelnut Mocha. | ₹550 |
| 28| Waffle Wonderland | Both | Located at 7 Pink Street. Famous for Belgian Berry Waffles. | ₹650 |
| 29| Bite & Go | Both | Located at 10 Fast Lane. Famous for the Peri Peri Wrap. | ₹400 |
| 30| Artisan Bakes | Both | Located at 12 Sector Road. Famous for Cinnamon Swirl Buns. | ₹750 |
