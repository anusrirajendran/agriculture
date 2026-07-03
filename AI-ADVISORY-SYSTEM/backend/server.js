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

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security
app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: true,
  credentials: true
}));

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});

app.use('/api', limiter);

// Body Parser
app.use(express.json());

// Uploads
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api', apiRoutes);

// ==========================
// SERVE REACT FRONTEND
// ==========================

const frontendPath = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ==========================
// Seed Admin
// ==========================

const seedAdminUser = async () => {
  try {
    const adminEmail = 'admin@harvestiq.com';

    const adminExists = await User.findOne({
      email: adminEmail
    });

    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        mobile: '9999999999',
        password: 'admin123',
        role: 'admin'
      });

      console.log('Default admin created');
    }
  } catch (err) {
    console.log(err.message);
  }
};

seedAdminUser();

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
