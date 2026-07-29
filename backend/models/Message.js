import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      default: null,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    read_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

messageSchema.index({ sender_id: 1, recipient_id: 1, createdAt: -1 });
messageSchema.index({ recipient_id: 1, read_at: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
