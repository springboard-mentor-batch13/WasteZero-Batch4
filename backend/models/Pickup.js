import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    waste_type: {
      type: String,
      enum: ['plastic', 'paper', 'organic', 'e-waste', 'glass', 'metal', 'mixed', 'other'],
      required: true,
    },
    quantity_kg: {
      type: Number,
      required: true,
      min: 0.1,
      max: 10000,
    },
    pickup_date: {
      type: Date,
      required: true,
    },
    time_slot: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true },
);

pickupSchema.index({ user_id: 1, createdAt: -1 });
pickupSchema.index({ status: 1, pickup_date: 1 });

const Pickup = mongoose.model('Pickup', pickupSchema);
export default Pickup;
