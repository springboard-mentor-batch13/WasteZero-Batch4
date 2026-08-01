import './config/env.js';

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'; // 1. Added JWT import
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import matchCommunicationRoutes from './routes/matchCommunicationRoutes.js';
import Message from './models/Message.js';
import notificationRoutes from './routes/notificationRoutes.js';

connectDB();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.NODE_ENV !== 'production'
    ? true
    : ['http://localhost:4200', 'http://127.0.0.1:4200'],
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};

// Initialize Socket.IO
const io = new Server(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => res.send('WasteZero API running...'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/communication', matchCommunicationRoutes);
app.use('/api/notifications', notificationRoutes);

// 2. Socket.IO JWT Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user data to socket
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid or expired token'));
  }
});

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log(`Authenticated user connected: ${socket.id} (User ID: ${socket.user.id || socket.user._id})`);

  socket.on('join_room', (userId) => {
    // Authed user joins their own room or room passed
    const roomId = userId || socket.user.id || socket.user._id;
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

socket.on('send_message', async (data) => {
  try {
    const { receiver_id, content } = data;
    const sender_id = socket.user.id || socket.user._id;

    // Validation
    if (!receiver_id) {
      return socket.emit('error_message', {
        message: 'Receiver ID is required.'
      });
    }

    if (!content || !content.trim()) {
      return socket.emit('error_message', {
        message: 'Message cannot be empty.'
      });
    }

    const newMessage = new Message({
      sender_id,
      receiver_id,
      content: content.trim(),
    });

    await newMessage.save();

    io.to(receiver_id).emit('receive_message', newMessage);
    io.to(sender_id).emit('receive_message', newMessage);

  } catch (error) {
    console.error('Error handling socket message:', error);

    socket.emit('error_message', {
      message: 'Failed to send message.'
    });
  }
});

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
