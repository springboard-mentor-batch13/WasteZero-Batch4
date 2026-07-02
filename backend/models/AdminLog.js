import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  action: { type: String, required: true, trim: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

const AdminLog = mongoose.model('AdminLog', adminLogSchema);
export default AdminLog;
