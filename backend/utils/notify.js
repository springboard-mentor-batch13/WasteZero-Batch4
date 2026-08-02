import Notification from '../models/Notification.js';
import { isOnline } from './presence.js';

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