import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    type: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    // Added for "mark all as read"
    readAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Helpful indexes
notificationSchema.index({ user_id: 1, createdAt: -1 });
notificationSchema.index({ user_id: 1, readAt: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;