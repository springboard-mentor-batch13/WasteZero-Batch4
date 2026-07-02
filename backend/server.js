import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

// ---- Middleware ----
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:4200', credentials: true }));
app.use(express.json());

// ---- Health check ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'wastezero-api' });
});

// ---- API routes (Milestone 1) ----
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Milestone 2-4 will mount: /api/opportunities, /api/applications, /api/messages, /api/admin

// ---- Error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
