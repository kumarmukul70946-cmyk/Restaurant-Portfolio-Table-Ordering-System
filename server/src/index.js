import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();

// Connect to Database but don't let it crash the process in production
connectDB().catch(err => {
  console.error('Initial DB Connection failed:', err.message);
});

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: (origin, callback) => {
    // Allow all localhost origins in development
    if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      callback(null, true);
    } else if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
// app.use('/api', limiter);

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API running' }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
