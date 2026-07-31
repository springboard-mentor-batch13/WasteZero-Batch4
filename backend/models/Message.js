import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000
    },

    readAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes
messageSchema.index({ sender_id: 1, receiver_id: 1, createdAt: -1 });
messageSchema.index({ receiver_id: 1, readAt: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;