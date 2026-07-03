import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import User from './models/User.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security policies
app.use(helmet({
  crossOriginResourcePolicy: false // Required to access uploaded static images from frontend
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200, // Limit each IP to 200 requests per window
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());

// Setup uploads path serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Mount Routes
app.use('/api', apiRoutes);

// Base route test
app.get('/', (req, res) => {
  res.send('HarvestIQ API is running successfully.');
});

// Create default admin user on start if not exists
const seedAdminUser = async () => {
  try {
    const adminEmail = 'admin@harvestiq.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        mobile: '9999999999',
        password: 'admin123', // Encrypted inside Mongoose model pre-save hook
        role: 'admin',
      });
      console.log('--- DEFAULT ADMIN USER SEEDED ---');
      console.log(`Email: ${adminEmail}`);
      console.log('Password: admin123');
      console.log('---------------------------------');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

// Start seeding verification
seedAdminUser();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
