import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    demo_key: { type: String },
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
    },

    // WhatsApp-style delivery state: sent -> delivered -> read
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent'
    },

    context: {
      kind: {
        type: String,
        enum: ['pickup', 'opportunity', 'general'],
        default: 'general',
      },
      refId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      label: {
        type: String,
        default: '',
        maxlength: 200,
      },
    },
  },
  {
    timestamps: true
  }
);

// Indexes
messageSchema.index({ sender_id: 1, receiver_id: 1, createdAt: -1 });
messageSchema.index({ receiver_id: 1, readAt: 1 });
messageSchema.index({ demo_key: 1 }, { sparse: true });

messageSchema.virtual('timestamp').get(function () {
  return this.createdAt;
});
messageSchema.set('toJSON', { virtuals: true });
messageSchema.set('toObject', { virtuals: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;