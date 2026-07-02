import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const ROLES = ['volunteer', 'ngo', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ROLES, default: 'volunteer' },
    skills: [{ type: String }],
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    address: { type: String, default: '' },
    coordinates: { type: String, default: '' },
  },
  { timestamps: true },
);

// Hash the password before saving whenever it changed.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare a plaintext password against the stored hash.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
