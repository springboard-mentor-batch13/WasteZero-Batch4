import Notification from '../models/Notification.js';
import Pickup from '../models/Pickup.js';
import User from '../models/User.js';

const populatePickup = (query) =>
  query
    .populate('user_id', 'name email location')
    .populate('assigned_to', 'name email role');

const createPickup = async (req, res) => {
  try {
    const { waste_type, quantity_kg, pickup_date, time_slot, address, notes } = req.body;
    const requestedDate = new Date(pickup_date);
    requestedDate.setHours(23, 59, 59, 999);

    if (Number.isNaN(requestedDate.getTime()) || requestedDate < new Date()) {
      return res.status(400).json({ message: 'Pickup date must be today or later' });
    }

    const pickup = await Pickup.create({
      user_id: req.user._id,
      waste_type,
      quantity_kg,
      pickup_date,
      time_slot,
      address,
      notes: notes || '',
    });

    const coordinators = await User.find({ role: { $in: ['ngo', 'admin'] } }).select('_id');
    if (coordinators.length) {
      await Notification.insertMany(
        coordinators.map((coordinator) => ({
          user_id: coordinator._id,
          type: 'system',
          title: 'New pickup request',
          message: `${req.user.name} scheduled a ${waste_type} pickup.`,
          link: '/pickups',
        })),
      );
      coordinators.forEach((coordinator) => {
        req.app.get('io')?.to(`user:${coordinator._id}`).emit('notification:new');
      });
    }

    const result = await populatePickup(Pickup.findById(pickup._id));
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPickups = async (req, res) => {
  try {
    const query = req.user.role === 'volunteer' ? { user_id: req.user._id } : {};
    if (req.query.status && req.query.status !== 'all') query.status = req.query.status;

    const pickups = await populatePickup(
      Pickup.find(query).sort({ pickup_date: 1, createdAt: -1 }),
    );
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePickupStatus = async (req, res) => {
  try {
    const allowedStatuses = ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid pickup status' });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });

    pickup.status = req.body.status;
    if (['confirmed', 'in-progress'].includes(req.body.status)) {
      pickup.assigned_to = req.user._id;
    }
    if (['scheduled', 'cancelled'].includes(req.body.status)) {
      pickup.assigned_to = null;
    }
    await pickup.save();

    await Notification.create({
      user_id: pickup.user_id,
      type: 'system',
      title: `Pickup ${pickup.status}`,
      message: `Your ${pickup.waste_type} pickup is now ${pickup.status}.`,
      link: '/pickups',
    });
    req.app.get('io')?.to(`user:${pickup.user_id}`).emit('notification:new');

    const result = await populatePickup(Pickup.findById(pickup._id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelPickup = async (req, res) => {
  try {
    const pickup = await Pickup.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
    if (!['scheduled', 'confirmed'].includes(pickup.status)) {
      return res.status(400).json({ message: 'This pickup can no longer be cancelled' });
    }

    pickup.status = 'cancelled';
    pickup.assigned_to = null;
    await pickup.save();

    const result = await populatePickup(Pickup.findById(pickup._id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { cancelPickup, createPickup, getPickups, updatePickupStatus };
