import Pickup from '../models/Pickup.js';
import User from '../models/User.js';
import { notifyUser } from '../utils/notify.js';
import { locationMatchScore } from '../utils/locationMatch.js';

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
    if (!['admin', 'ngo'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only NGOs and admins can schedule a pickup.' });
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
      // Volunteers only ever see jobs offered/assigned to them - they don't
      // request pickups themselves anymore.
      query = { assigned_to: req.user._id };
    } else if (req.user.role === 'ngo') {
      query = { requester_id: req.user._id };
    } // admin sees everything

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
    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. To assign a volunteer, use the offer endpoint instead.',
      });
    }

    const update = { status };
    if (status === 'scheduled') {
      update.assigned_to = null;
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

    if (['completed', 'cancelled'].includes(status) && pickup.assigned_to) {
      await notifyUser({
        userId: pickup.assigned_to._id,
        type: 'pickup_status',
        message: `The pickup in ${pickup.city} was marked ${status}.`,
        link: '/schedule-pickup',
      });
    }

    res.json({ success: true, message: 'Pickup status updated.', data: pickup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const offerPickup = async (req, res) => {
  try {
    if (!['admin', 'ngo'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only NGOs and admins can offer a pickup to a volunteer.' });
    }

    const { volunteerId } = req.body;
    if (!volunteerId) {
      return res.status(400).json({ message: 'Select a volunteer to offer this pickup to.' });
    }

    const volunteer = await User.findById(volunteerId).select('_id role name isAvailable');
    if (!volunteer || volunteer.role !== 'volunteer') {
      return res.status(400).json({ message: 'You can only offer a pickup to a volunteer.' });
    }
    if (!volunteer.isAvailable) {
      return res.status(400).json({ message: `${volunteer.name} is not available right now.` });
    }

    const pickup = await Pickup.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ['scheduled'] } },
      { status: 'offered', assigned_to: volunteer._id },
      { new: true, runValidators: true },
    )
      .populate('requester_id', 'name email role')
      .populate('assigned_to', 'name email role');

    if (!pickup) {
      return res.status(409).json({ message: 'This pickup already has an offer out, or is no longer available to assign.' });
    }

    await notifyUser({
      userId: volunteer._id,
      type: 'pickup_offer',
      message: `New pickup request in ${pickup.city} on ${new Date(pickup.pickupDate).toLocaleDateString()}. Accept or decline in Schedule Pickup.`,
      link: '/schedule-pickup',
    });

    res.json({ success: true, message: 'Offer sent to volunteer.', data: pickup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// The volunteer's Accept/Decline response to an offered pickup.
export const respondToOffer = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can respond to a pickup offer.' });
    }

    const { accept } = req.body;
    const pickup = await Pickup.findById(req.params.id)
      .populate('requester_id', 'name email role')
      .populate('assigned_to', 'name email role');

    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found.' });
    }
    if (pickup.status !== 'offered' || String(pickup.assigned_to?._id) !== String(req.user._id)) {
      return res.status(409).json({ message: 'This offer is no longer available to you.' });
    }

    if (accept) {
      pickup.status = 'assigned';
    } else {
      pickup.status = 'scheduled';
      pickup.assigned_to = null;
    }
    await pickup.save();

    if (pickup.requester_id) {
      await notifyUser({
        userId: pickup.requester_id._id,
        type: 'pickup_response',
        message: accept
          ? `${req.user.name} accepted the pickup in ${pickup.city}.`
          : `${req.user.name} declined the pickup in ${pickup.city}. Offer it to someone else.`,
        link: '/schedule-pickup',
      });
    }

    const updated = await Pickup.findById(pickup._id)
      .populate('requester_id', 'name email role')
      .populate('assigned_to', 'name email role');

    res.json({
      success: true,
      message: accept ? 'Pickup accepted.' : 'Pickup declined.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPickupCandidates = async (req, res) => {
  try {
    if (!['admin', 'ngo'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only NGOs and admins can view assignment candidates.' });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found.' });
    }

    const volunteers = await User.find({ role: 'volunteer', isAvailable: true })
      .select('name email location preferredWasteTypes');

    const ranked = volunteers.map((volunteer) => {
      const matchesWasteType = (volunteer.preferredWasteTypes || []).some((type) =>
        (pickup.wasteTypes || []).includes(type),
      );
      const cityScore = locationMatchScore(volunteer.location, pickup.city);
      const addressScore = locationMatchScore(volunteer.location, pickup.address);
      const locationScore = Math.max(cityScore, addressScore);

      return {
        _id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
        location: volunteer.location,
        locationMatchScore: locationScore,
        matchesWasteType,
      };
    });

    ranked.sort((a, b) => {
      if (a.matchesWasteType !== b.matchesWasteType) return a.matchesWasteType ? -1 : 1;
      if (b.locationMatchScore !== a.locationMatchScore) return b.locationMatchScore - a.locationMatchScore;
      return a.name.localeCompare(b.name);
    });

    res.json({ success: true, data: ranked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};