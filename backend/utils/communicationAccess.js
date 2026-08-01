import Application from '../models/Application.js';
import Opportunity from '../models/Opportunity.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

const getActiveAdminThreadIds = async (userId) => {
  const threads = await Message.find({
    $or: [{ sender_id: userId }, { receiver_id: userId }],
  })
    .select('sender_id receiver_id')
    .lean();

  if (!threads.length) return [];

  const partnerIds = [
    ...new Set(
      threads.map(({ sender_id, receiver_id }) =>
        String(sender_id) === String(userId) ? String(receiver_id) : String(sender_id),
      ),
    ),
  ];

  const admins = await User.find({ _id: { $in: partnerIds }, role: 'admin' })
    .select('_id')
    .lean();

  return admins.map(({ _id }) => _id.toString());
};

export const getAllowedContactIds = async (user) => {
  if (user.role === 'admin') {
    const users = await User.find({ _id: { $ne: user._id } }).select('_id').lean();
    return users.map(({ _id }) => _id.toString());
  }

  const activeAdminIds = await getActiveAdminThreadIds(user._id);


  if (user.role === 'volunteer') {
    const applications = await Application.find({
      volunteer_id: user._id,
      status: 'accepted',
    }).select('opportunity_id').lean();
    const opportunityIds = applications.map(({ opportunity_id }) => opportunity_id);
    const opportunities = await Opportunity.find({ _id: { $in: opportunityIds } })
      .select('ngo_id')
      .lean();
    return [...new Set([
      ...activeAdminIds,
      ...opportunities.map(({ ngo_id }) => ngo_id.toString()),
    ])];
  }

  if (user.role === 'ngo') {
    const opportunities = await Opportunity.find({ ngo_id: user._id }).select('_id').lean();
    const opportunityIds = opportunities.map(({ _id }) => _id);
    const applications = await Application.find({
      opportunity_id: { $in: opportunityIds },
      status: 'accepted',
    }).select('volunteer_id').lean();
    return [...new Set([
      ...activeAdminIds,
      ...applications.map(({ volunteer_id }) => volunteer_id.toString()),
    ])];
  }

  return [];
};

export const getSupportAdmin = async () => {
  const admin = await User.findOne({ role: 'admin' }).select('_id name email role').lean();
  return admin || null;
};

export const canCommunicateWith = async (user, contactId) => {
  if (user._id.toString() === contactId.toString()) return false;

  const contact = await User.findById(contactId).select('role').lean();
  if (!contact) return false;

  // Admin communication remains available for platform support.
  if (user.role === 'admin' || contact.role === 'admin') return true;

  const allowedIds = await getAllowedContactIds(user);
  return allowedIds.includes(contactId.toString());
};