import './config/env.js';

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import matchCommunicationRoutes from './routes/matchCommunicationRoutes.js';
import Message from './models/Message.js';
import User from './models/User.js';
import Pickup from './models/Pickup.js';
import Application from './models/Application.js';
import { canCommunicateWith } from './utils/communicationAccess.js';
import notificationRoutes from './routes/notificationRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import { encryptMessage, decryptMessage } from "./utils/encryption.js";



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
app.use('/api/pickups', pickupRoutes);

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
const onlineUsers = new Map(); 

const isOnline = (userId) => onlineUsers.has(userId) && onlineUsers.get(userId).size > 0;

const markOnline = (userId, socketId) => {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
};

const markOffline = (userId, socketId) => {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return false;
  sockets.delete(socketId);
  if (sockets.size === 0) {
    onlineUsers.delete(userId);
    return true; // fully offline now
  }
  return false;
};

// Socket.IO Connection Handling
io.on('connection', async (socket) => {
  const userId = String(socket.user.id || socket.user._id);
  console.log(`Authenticated user connected: ${socket.id} (User ID: ${userId})`);

  socket.join(userId);
  const wasOffline = !isOnline(userId);
  markOnline(userId, socket.id);

  if (wasOffline) {
    socket.broadcast.emit('user_status', { userId, status: 'online' });

    try {
      const pending = await Message.find({ receiver_id: userId, status: 'sent' });
      if (pending.length) {
        await Message.updateMany(
          { receiver_id: userId, status: 'sent' },
          { $set: { status: 'delivered' } }
        );
        const bySender = new Map();
        pending.forEach((msg) => {
          const sId = String(msg.sender_id);
          if (!bySender.has(sId)) bySender.set(sId, []);
          bySender.get(sId).push(String(msg._id));
        });
        bySender.forEach((messageIds, senderId) => {
          io.to(senderId).emit('message_delivered', { messageIds });
        });
      }
    } catch (err) {
      console.error('Error reconciling delivered messages:', err);
    }
  }

  socket.emit('online_users', { userIds: Array.from(onlineUsers.keys()) });

  socket.on('join_room', (requestedUserId) => {
    if (String(requestedUserId) === userId) {
      socket.join(userId);
    }
  });

  const resolveMessageContext = async (rawContext, senderId) => {
    if (!rawContext || !rawContext.type || rawContext.type === 'general') {
      return { kind: 'general', refId: null, label: '' };
    }

    const label = String(rawContext.label || '').slice(0, 200);

    if (rawContext.type === 'pickup' && rawContext.refId) {
      const pickup = await Pickup.findOne({
        _id: rawContext.refId,
        requester_id: senderId,
      }).select('_id');
      if (pickup) return { kind: 'pickup', refId: pickup._id, label };
    }

    if (rawContext.type === 'opportunity' && rawContext.refId) {
      const application = await Application.findOne({
        _id: rawContext.refId,
        $or: [{ volunteer_id: senderId }, { ngo_id: senderId }],
      }).select('_id');
      if (application) return { kind: 'opportunity', refId: application._id, label };
    }

    return { kind: 'general', refId: null, label: '' };
  };

  socket.on('send_message', async (data) => {
    try {
      const { receiver_id, content, context: rawContext } = data || {};
      const sender_id = userId;

      // Validation
      if (!receiver_id) {
        return socket.emit('message_error', { message: 'Receiver ID is required.' });
      }

      if (!content || !content.trim()) {
        return socket.emit('message_error', { message: 'Message cannot be empty.' });
      }

      if (String(receiver_id) === sender_id) {
        return socket.emit('message_error', { message: 'You cannot message yourself.' });
      }

      const senderUser = await User.findById(sender_id).select('role');
      if (!senderUser) {
        return socket.emit('message_error', { message: 'Your account could not be verified.' });
      }

      const allowed = await canCommunicateWith(senderUser, receiver_id);
      if (!allowed) {
        return socket.emit('message_error', {
          message: 'You can only message this contact once a volunteer application has been accepted.'
        });
      }

      const status = isOnline(String(receiver_id)) ? 'delivered' : 'sent';
      const context = await resolveMessageContext(rawContext, sender_id);

const encryptedContent = encryptMessage(content.trim());

const newMessage = new Message({
  sender_id,
  receiver_id,
  content: encryptedContent,
  status,
  context,
});

      await newMessage.save();

      const messageToSend = {
  ...newMessage.toObject(),
  content: decryptMessage(newMessage.content),
};

io.to(String(receiver_id)).emit('receive_message', messageToSend);
io.to(sender_id).emit('receive_message', messageToSend);

    } catch (error) {
      console.error('Error handling socket message:', error);
      socket.emit('message_error', { message: 'Failed to send message.' });
    }
  });

  socket.on('mark_messages_read', async (data) => {
    try {
      const { senderId } = data || {};
      if (!senderId) return;

      const readAt = new Date();
      const unread = await Message.find({
        sender_id: senderId,
        receiver_id: userId,
        readAt: null,
      }).select('_id');

      if (!unread.length) return;

      const messageIds = unread.map((m) => String(m._id));

      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $set: { readAt, status: 'read' } }
      );

      io.to(String(senderId)).emit('messages_read', { messageIds, readAt });
      io.to(userId).emit('messages_read', { messageIds, readAt });
    } catch (error) {
      console.error('Error marking messages read:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    const fullyOffline = markOffline(userId, socket.id);
    if (fullyOffline) {
      socket.broadcast.emit('user_status', {
        userId,
        status: 'offline',
        lastSeen: new Date(),
      });
    }
  });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));