import Pickup from '../models/Pickup.js';

const VALID_WASTE_TYPES = new Set([
  'Plastic',
  'Glass',
  'Electronic Waste',
  'Paper',
  'Metal',
  'Organic Waste',
  'Other',
]);

export const createPickup = async (req, res) => {
  try {
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
    const canManageAll = ['admin', 'ngo'].includes(req.user.role);
    const query = canManageAll ? {} : { requester_id: req.user._id };

    const pickups = await Pickup.find(query)
      .populate('requester_id', 'name email role')
      .populate('assigned_to', 'name email role')
      .sort({ pickupDate: -1, createdAt: -1 });

    res.json({ success: true, data: pickups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePickupStatus = async (req, res) => {
  try {
    if (!['admin', 'ngo'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only NGOs and admins can update pickup status.' });
    }

    const { status } = req.body;
    if (!['scheduled', 'assigned', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid pickup status.' });
    }

    const update = { status };
    if (status === 'assigned' && req.user.role === 'ngo') {
      update.assigned_to = req.user._id;
    }

    const pickup = await Pickup.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    })
      .populate('requester_id', 'name email role')
      .populate('assigned_to', 'name email role');

    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found.' });
    }

    res.json({ success: true, message: 'Pickup status updated.', data: pickup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
