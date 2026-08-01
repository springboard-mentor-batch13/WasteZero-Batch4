import './config/env.js';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Message from './models/Message.js';

const run = async () => {
  await connectDB();

  const cleaned = await Message.updateMany(
    { demo_key: null },
    { $unset: { demo_key: '' } }
  );
  console.log(`Cleaned up ${cleaned.modifiedCount} message(s) with demo_key: null`);

  try {
    await Message.collection.dropIndex('demo_key_1');
    console.log('Dropped old demo_key_1 index');
  } catch (err) {
    console.log('No existing demo_key_1 index to drop (or already fine):', err.message);
  }

  // Recreate WITHOUT unique this time.
  await Message.collection.createIndex({ demo_key: 1 }, { sparse: true });
  console.log('Recreated demo_key_1 as a plain sparse (non-unique) index');

  await mongoose.disconnect();
  console.log('Done. Restart your backend now.');
};

run().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});