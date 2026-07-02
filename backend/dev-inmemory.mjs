// Dev convenience: run the API against a throwaway in-memory MongoDB.
// Lets the team demo Milestone 1 without setting up Atlas.
// Data resets on restart. Use `npm run dev` with a real MONGO_URI for persistence.
//
//   npm run dev:memory
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongo = await MongoMemoryServer.create();
process.env.MONGO_URI = mongo.getUri('wastezero');
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev_in_memory_secret';
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
process.env.PORT = process.env.PORT || '5000';

await import('./server.js');
console.log('  (using in-memory MongoDB — data resets on restart)');

process.on('SIGINT', async () => {
  await mongo.stop();
  process.exit(0);
});
