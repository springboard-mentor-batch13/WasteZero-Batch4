import './config/env.js';

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';

connectDB();

const app = express();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many registration attempts. Please try again later.' },
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many OTP requests. Please try again later.' },
});

app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
}));
app.use(express.json());

app.get('/', (req, res) => res.send('WasteZero API running...'));

app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/otp', otpLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/opportunities', opportunityRoutes);

app.use((error, req, res, next) => {
  if (error.message?.includes('Only JPEG') || error.code === 'LIMIT_FILE_SIZE') {
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Image must be 5 MB or smaller.'
      : error.message;
    return res.status(400).json({ message });
  }

  next(error);
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
