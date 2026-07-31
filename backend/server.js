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
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import { canCommunicateWith } from './utils/communicationAccess.js';

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
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new Error('User no longer exists'));
    socket.data.user = user;
    next();
  } catch {
    next(new Error('Invalid authentication token'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (userId) => {
    const authenticatedUserId = socket.data.user._id.toString();
    if (userId === authenticatedUserId) {
      socket.join(authenticatedUserId);
      console.log(`User joined room: ${authenticatedUserId}`);
    }
  });

  socket.on('send_message', async (data) => {
    try {
      const { receiver_id } = data;
      const content = String(data.content || '').trim();
      const sender_id = socket.data.user._id;

      if (!content || content.length > 2000) {
        return socket.emit('message_error', { message: 'Message must be between 1 and 2000 characters.' });
      }

      if (!(await canCommunicateWith(socket.data.user, receiver_id))) {
        return socket.emit('message_error', {
          message: 'Chat becomes available after the volunteer application is accepted.',
        });
      }

      // Save the message to MongoDB
      const receiverIsOnline = Boolean(io.sockets.adapter.rooms.get(receiver_id)?.size);
      const newMessage = new Message({
        sender_id,
        receiver_id,
        content,
        status: receiverIsOnline ? 'delivered' : 'sent',
      });
      await newMessage.save();

      // Emit to both receiver and sender rooms in real-time
      io.to(receiver_id).emit('receive_message', newMessage);
      io.to(sender_id).emit('receive_message', newMessage);
    } catch (error) {
      console.error('Error handling socket message:', error);
    }
  });

  socket.on('mark_messages_read', async ({ senderId }) => {
    try {
      if (!(await canCommunicateWith(socket.data.user, senderId))) return;

      const readAt = new Date();
      const unreadMessages = await Message.find({
        sender_id: senderId,
        receiver_id: socket.data.user._id,
        status: { $ne: 'read' },
      }).select('_id');

      if (!unreadMessages.length) return;

      const messageIds = unreadMessages.map(({ _id }) => _id);
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $set: { status: 'read', read_at: readAt } },
      );

      io.to(senderId).emit('messages_read', {
        messageIds: messageIds.map((id) => id.toString()),
        readAt,
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
