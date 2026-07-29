import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const getContacts = async (req, res) => {
  try {
    const contacts = await User.find({
      _id: { $ne: req.user._id },
      role: req.user.role === 'volunteer' ? { $in: ['ngo', 'admin'] } : 'volunteer',
    })
      .select('name email role location')
      .sort({ name: 1 });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const otherUser = await User.findById(req.params.userId).select('name email role location');
    if (!otherUser) return res.status(404).json({ message: 'Contact not found' });

    const messages = await Message.find({
      $or: [
        { sender_id: req.user._id, recipient_id: otherUser._id },
        { sender_id: otherUser._id, recipient_id: req.user._id },
      ],
    })
      .populate('sender_id', 'name email role')
      .populate('recipient_id', 'name email role')
      .populate('opportunity_id', 'title')
      .sort({ createdAt: 1 })
      .limit(250);

    await Message.updateMany(
      { sender_id: otherUser._id, recipient_id: req.user._id, read_at: null },
      { $set: { read_at: new Date() } },
    );

    res.json({ contact: otherUser, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const content = req.body.content?.trim();
    if (!content) return res.status(400).json({ message: 'Message cannot be empty' });

    const recipient = await User.findById(req.params.userId).select('name');
    if (!recipient) return res.status(404).json({ message: 'Contact not found' });
    if (recipient._id.equals(req.user._id)) {
      return res.status(400).json({ message: 'You cannot message yourself' });
    }

    const message = await Message.create({
      sender_id: req.user._id,
      recipient_id: recipient._id,
      opportunity_id: req.body.opportunity_id || null,
      content,
    });

    await message.populate('sender_id', 'name email role');
    await message.populate('recipient_id', 'name email role');

    await Notification.create({
      user_id: recipient._id,
      type: 'message',
      title: `New message from ${req.user.name}`,
      message: content.length > 100 ? `${content.slice(0, 97)}...` : content,
      link: `/messages?contact=${req.user._id}`,
    });

    req.app.get('io')?.to(`user:${recipient._id}`).emit('message:new', message);
    req.app.get('io')?.to(`user:${recipient._id}`).emit('notification:new');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createMessage, getContacts, getConversation };
