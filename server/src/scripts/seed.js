import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Table from '../models/Table.js';
import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';
import { DEFAULT_RESTAURANTS } from '../utils/defaultRestaurants.js';
import { createDefaultTablesForRestaurant } from '../utils/defaultTables.js';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_ordering');

  await Admin.deleteMany({});
  await Restaurant.deleteMany({});
  await Table.deleteMany({});
  await MenuItem.deleteMany({});

  const admin = await Admin.create({
    email: 'admin@restaurant.com',
    password: 'admin123',
    name: 'Admin',
  });

  const restaurants = await Restaurant.insertMany(DEFAULT_RESTAURANTS);
  const tables = await Table.insertMany(
    restaurants.flatMap((restaurant) => createDefaultTablesForRestaurant(restaurant))
  );

  const sampleItems = [
    {
      name: 'Soup of the day',
      description: 'Chef\'s daily soup',
      price: 120,
      category: 'starters',
      image: { url: '/menu-art/soup-of-the-day.svg' },
    },
    {
      name: 'Bruschetta',
      description: 'Toasted bread with tomato and basil',
      price: 150,
      category: 'starters',
      image: { url: '/menu-art/bruschetta.svg' },
    },
    {
      name: 'Grilled Chicken',
      description: 'Herb-marinated chicken with sides',
      price: 280,
      category: 'mains',
      image: { url: '/menu-art/grilled-chicken.svg' },
    },
    {
      name: 'Vegetable Pasta',
      description: 'Penne in tomato basil sauce',
      price: 220,
      category: 'mains',
      image: { url: '/menu-art/vegetable-pasta.svg' },
    },
    {
      name: 'Chocolate Brownie',
      description: 'Warm brownie with ice cream',
      price: 140,
      category: 'desserts',
      image: { url: '/menu-art/chocolate-brownie.svg' },
    },
    {
      name: 'Fresh Lime Soda',
      description: 'House lime soda',
      price: 60,
      category: 'drinks',
      image: { url: '/menu-art/fresh-lime-soda.svg' },
    },
    {
      name: 'French Fries',
      description: 'Crispy golden fries',
      price: 100,
      category: 'sides',
      image: { url: '/menu-art/french-fries.svg' },
    },
  ];

  await MenuItem.insertMany(sampleItems);

  console.log('Seed complete.');
  console.log('Admin:', admin.email, '| Password: admin123');
  console.log('Restaurants:', restaurants.length);
  console.log('Tables:', tables.length);
  console.log('Menu items:', sampleItems.length);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
