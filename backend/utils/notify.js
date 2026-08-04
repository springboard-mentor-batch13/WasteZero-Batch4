import Notification from '../models/Notification.js';
import { isOnline } from './presence.js';
import User from '../models/User.js';

let ioInstance = null;
export const setNotifyIO = (io) => {
  ioInstance = io;
};

export const notifyUser = async ({ userId, type, message, link = '' }) => {
  const notification = await Notification.create({ user_id: userId, type, message, link });

  if (ioInstance) {
    ioInstance.to(String(userId)).emit('notification', notification);
  }

  return { notification, wasOnline: isOnline(userId) };
};

export const notifyAdmins = async ({ type, message, link = '', excludeUserId = null }) => {
  const query = { role: 'admin' };
  if (excludeUserId) query._id = { $ne: excludeUserId };

  const admins = await User.find(query).select('_id').lean();
  return Promise.all(
    admins.map(({ _id }) => notifyUser({ userId: _id, type, message, link })),
  );
};
