import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import { syncSeedToMongo } from './services/store.js';
import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// Health & Status check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Swiggy MERN API',
    mongoConnected: getDBStatus(),
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Swiggy MERN Stack API is running!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();
  // If mongo is connected, seed initial data if needed
  await syncSeedToMongo();

  app.listen(PORT, () => {
    console.log(`🚀 Swiggy API Server is running on http://localhost:${PORT}`);
  });
};

startServer();
