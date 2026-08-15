import AdminLog from '../models/AdminLog.js';

export const recordAdminAction = async ({ adminUser, action, targetType = '', targetId = null, details = {} }) => {
  if (!adminUser || adminUser.role !== 'admin') return null;

  try {
    return await AdminLog.create({
      action,
      user_id: adminUser._id,
      target_type: targetType,
      target_id: targetId,
      details,
    });
  } catch (error) {
    console.error('Unable to record admin action:', error.message);
    return null;
  }
};
