import mongoose from 'mongoose';
import { config } from './index';

const IN_MEMORY_DB_NAME = 'property-investment';

let mongoServer: any = null;

export const connectDatabase = async (): Promise<void> => {
  // Try real MongoDB first
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return;
  } catch (error) {
    console.warn('MongoDB Atlas connection failed, starting in-memory MongoDB...');
  }

  // Fallback to in-memory MongoDB
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create({
      instance: { dbName: IN_MEMORY_DB_NAME },
    });
    const uri = mongoServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`In-memory MongoDB Connected: ${conn.connection.host}/${IN_MEMORY_DB_NAME}`);

    // Auto-seed after connection
    try {
      const { seedData } = await import('./seed');
      await seedData();
      console.log('In-memory database seeded automatically');
    } catch (seedError) {
      console.warn('Auto-seeding failed (data may already exist):', (seedError as Error).message);
    }
  } catch (memError) {
    console.error('Failed to start in-memory MongoDB:', memError);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};
