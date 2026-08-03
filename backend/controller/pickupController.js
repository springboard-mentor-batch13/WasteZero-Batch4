import Pickup from '../models/Pickup.js';
import { notifyUser } from '../utils/notify.js';

const VALID_WASTE_TYPES = new Set([
  'Plastic',
  'Glass',
  'Electronic Waste',
  'Paper',
  'Metal',
  'Organic Waste',
  'Other',
]);

// Only volunteers create pickups - like a user dropping waste into a
// recycle bin, the volunteer is the one who initiates the request.
export const createPickup = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can schedule a pickup.' });
    }

    const { address, city, pickupDate, timeSlot, wasteTypes, notes } = req.body;

    if (!address?.trim() || !city?.trim() || !pickupDate || !timeSlot) {
      return res.status(400).json({
        message: 'Address, city, pickup date, and time slot are required.',
      });
    }

    const requestedDate = new Date(pickupDate);
    if (Number.isNaN(requestedDate.getTime())) {
      return res.status(400).json({ message: 'Please provide a valid pickup date.' });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (requestedDate < startOfToday) {
      return res.status(400).json({ message: 'Pickup date cannot be in the past.' });
    }

    const selectedWasteTypes = Array.isArray(wasteTypes)
      ? [...new Set(wasteTypes.filter((type) => VALID_WASTE_TYPES.has(type)))]
      : [];

    if (!selectedWasteTypes.length) {
      return res.status(400).json({ message: 'Select at least one waste type.' });
    }

    const pickup = await Pickup.create({
      requester_id: req.user._id,
      address: address.trim(),
      city: city.trim(),
      pickupDate: requestedDate,
      timeSlot,
      wasteTypes: selectedWasteTypes,
      notes: notes?.trim() || '',
    });

    const populatedPickup = await Pickup.findById(pickup._id)
      .populate('requester_id', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Pickup scheduled successfully.',
      data: populatedPickup,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getPickups = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'volunteer') {
      // Volunteers see only the pickups they created.
      query = { requester_id: req.user._id };
    } else if (req.user.role === 'ngo') {
      // NGOs see the pool of unclaimed pickups they haven't rejected yet,
      // plus whichever pickups they've personally accepted.
      query = {
        $or: [
          { status: 'scheduled', rejectedBy: { $ne: req.user._id } },
          { assigned_to: req.user._id },
        ],
      };
    }
    // admin: no filter - sees everything, read-only.

    const pickups = await Pickup.find(query)
      .populate('requester_id', 'name email role')
      .populate('assigned_to', 'name email role')
      .sort({ pickupDate: -1, createdAt: -1 });

    res.json({ success: true, data: pickups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NGO accepts an unclaimed pickup.
export const acceptPickup = async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can accept a pickup.' });
    }

    const pickup = await Pickup.findOneAndUpdate(
      { _id: req.params.id, status: 'scheduled' },
      { status: 'assigned', assigned_to: req.user._id },
      { new: true, runValidators: true },
    )
      .populate('requester_id', 'name email role')
      .populate('assigned_to', 'name email role');

    if (!pickup) {
      return res.status(409).json({ message: 'This pickup is no longer available to accept.' });
    }

    if (pickup.requester_id) {
      await notifyUser({
        userId: pickup.requester_id._id,
        type: 'pickup_response',
        message: `${req.user.name} accepted your pickup in ${pickup.city}.`,
        link: '/schedule-pickup',
      });
    }

    res.json({ success: true, message: 'Pickup accepted.', data: pickup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NGO rejects a pickup - it stays in the pool for other NGOs, it's just
// removed from this NGO's queue.
export const rejectPickup = async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can reject a pickup.' });
    }

    const pickup = await Pickup.findOneAndUpdate(
      { _id: req.params.id, status: 'scheduled' },
      { $addToSet: { rejectedBy: req.user._id } },
      { new: true, runValidators: true },
    )
      .populate('requester_id', 'name email role')
      .populate('assigned_to', 'name email role');

    if (!pickup) {
      return res.status(409).json({ message: 'This pickup is no longer available to reject.' });
    }

    res.json({ success: true, message: 'Pickup declined.', data: pickup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// The accepting NGO marks a pickup completed/cancelled, or the volunteer
// cancels their own pickup before it's been accepted. Admin is read-only.
export const updatePickupStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Use accept/reject to respond to a pickup instead.',
      });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found.' });
    }

    const isOwnPickup = String(pickup.requester_id) === String(req.user._id);
    const isAssignedNgo = pickup.assigned_to && String(pickup.assigned_to) === String(req.user._id);

    if (status === 'cancelled') {
      // A volunteer can cancel their own pickup any time; the NGO handling
      // it can also cancel once they've accepted it.
      if (!(req.user.role === 'volunteer' && isOwnPickup) && !(req.user.role === 'ngo' && isAssignedNgo)) {
        return res.status(403).json({ message: 'You are not authorized to cancel this pickup.' });
      }
    } else if (status === 'completed') {
      // Only the NGO that accepted the pickup can mark it complete.
      if (!(req.user.role === 'ngo' && isAssignedNgo)) {
        return res.status(403).json({ message: 'Only the accepting NGO can mark this pickup completed.' });
      }
    }

    pickup.status = status;
    await pickup.save();

    const updated = await Pickup.findById(pickup._id)
      .populate('requester_id', 'name email role')
      .populate('assigned_to', 'name email role');

    if (['completed', 'cancelled'].includes(status) && updated.requester_id) {
      await notifyUser({
        userId: updated.requester_id._id,
        type: 'pickup_status',
        message: `Your pickup in ${updated.city} was marked ${status}.`,
        link: '/schedule-pickup',
      });
    }

    res.json({ success: true, message: 'Pickup status updated.', data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
