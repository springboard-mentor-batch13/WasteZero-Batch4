const onlineUsers = new Map(); 

export const isOnline = (userId) => {
  const key = String(userId);
  return onlineUsers.has(key) && onlineUsers.get(key).size > 0;
};

export const markOnline = (userId, socketId) => {
  const key = String(userId);
  if (!onlineUsers.has(key)) onlineUsers.set(key, new Set());
  onlineUsers.get(key).add(socketId);
};

export const markOffline = (userId, socketId) => {
  const key = String(userId);
  const sockets = onlineUsers.get(key);
  if (!sockets) return false;
  sockets.delete(socketId);
  if (sockets.size === 0) {
    onlineUsers.delete(key);
    return true;
  }
  return false;
};

export const getOnlineUserIds = () => Array.from(onlineUsers.keys());