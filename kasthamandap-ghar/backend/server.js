// server.js - PostgreSQL with Sequelize
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();

// CORS Configuration - Works with both local and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Connection
const connectDB = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✓ PostgreSQL Connected Successfully');
    
    // Sync database - creates tables if they don't exist
    // Use {alter: true} for development to auto-update schema
    // Set {force: true} only for testing to drop/recreate tables
    await db.sequelize.sync({ alter: true });
    console.log('✓ Database synchronized');
  } catch (error) {
    console.error('✗ PostgreSQL Connection Error:', error);
    process.exit(1);
  }
};

// Connect to PostgreSQL
await connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT} in ${NODE_ENV} mode`);
});
