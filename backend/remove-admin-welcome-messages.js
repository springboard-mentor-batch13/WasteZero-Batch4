import './config/env.js';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Message from './models/Message.js';

const run = async () => {
  await connectDB();

  const result = await Message.deleteMany({
    demo_key: { $regex: '^admin-(volunteer|ngo)-welcome-' },
  });
  console.log(`Removed ${result.deletedCount} old admin welcome message(s).`);

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});