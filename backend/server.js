import './config/env.js';

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import matchCommunicationRoutes from './routes/matchCommunicationRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import Message from './models/Message.js';

connectDB();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.NODE_ENV !== 'production'
    ? true
    : ['http://localhost:4200', 'http://127.0.0.1:4200'],
  methods: ['GET', 'POST'],
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
app.use('/api/pickups', pickupRoutes);

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { sender_id, receiver_id, content } = data;

      // Save the message to MongoDB
      const newMessage = new Message({ sender_id, receiver_id, content });
      await newMessage.save();

      // Emit to both receiver and sender rooms in real-time
      io.to(receiver_id).emit('receive_message', newMessage);
      io.to(sender_id).emit('receive_message', newMessage);
    } catch (error) {
      console.error('Error handling socket message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
