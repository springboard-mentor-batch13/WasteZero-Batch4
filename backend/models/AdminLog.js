import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  action: { type: String, required: true, trim: true, index: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  target_type: { type: String, default: '', trim: true },
  target_id: { type: mongoose.Schema.Types.ObjectId, default: null },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

adminLogSchema.index({ createdAt: -1 });

export default mongoose.model('AdminLog', adminLogSchema);
