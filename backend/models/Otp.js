import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Index for fast email lookup
otpSchema.index({ email: 1 });

// TTL index — MongoDB automatically deletes expired OTPs
// expireAfterSeconds: 0 means delete exactly at expiresAt time
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Otp', otpSchema);