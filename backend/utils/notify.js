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

export const notifyUsers = async ({ userIds, type, message, link = '' }) => {
  const uniqueUserIds = [...new Set(userIds.map(String))];
  if (!uniqueUserIds.length) return [];

  const notifications = await Notification.insertMany(
    uniqueUserIds.map((userId) => ({ user_id: userId, type, message, link })),
  );

  if (ioInstance) {
    notifications.forEach((notification) => {
      ioInstance.to(String(notification.user_id)).emit('notification', notification);
    });
  }

  return notifications;
};

export const notifyAdmins = async ({ type, message, link = '', excludeUserId = null }) => {
  const query = { role: 'admin' };
  if (excludeUserId) query._id = { $ne: excludeUserId };

  const admins = await User.find(query).select('_id').lean();
  return notifyUsers({ userIds: admins.map(({ _id }) => _id), type, message, link });
};
