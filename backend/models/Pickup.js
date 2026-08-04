import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema(
  {
    requester_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    pickupDate: {
      type: Date,
      required: true,
      index: true,
    },
    timeSlot: {
      type: String,
      required: true,
      enum: ['08:00-11:00', '11:00-14:00', '14:00-17:00', '17:00-20:00'],
    },
    wasteTypes: [{
      type: String,
      enum: ['Plastic', 'Glass', 'Electronic Waste', 'Paper', 'Metal', 'Organic Waste', 'Other'],
    }],
    notes: {
      type: String,
      trim: true,
      maxlength: 600,
      default: '',
    },
    status: {
      type: String,
      enum: ['scheduled', 'assigned', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    // The NGO that accepted this pickup.
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
   
    rejectedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true },
);

const Pickup = mongoose.model('Pickup', pickupSchema);
export default Pickup;