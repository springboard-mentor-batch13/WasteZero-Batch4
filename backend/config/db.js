import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from '../models/User.js';
import seedDemoMessages from './seedDemoMessages.js';

const createAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || 'diship083@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'dishi123';
  const adminName = process.env.ADMIN_NAME || 'WasteZero Admin';

  if (!adminEmail) return;

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    const hasBcryptPassword = /^\$2[aby]\$\d{2}\$/.test(existingAdmin.password || '');

    if (!hasBcryptPassword) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.updateOne(
        { _id: existingAdmin._id },
        { $set: { password: hashedPassword } },
      );
      console.log(`Admin user password repaired and hashed: ${adminEmail}`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }
    return;
  }

  await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    location: '',
    skills: [],
    bio: '',
  });

  console.log(`Admin user created: ${adminEmail}`);
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await createAdminUser();
        await seedDemoMessages();
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
