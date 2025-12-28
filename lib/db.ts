import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Don't throw during build - check at runtime instead

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Increased to 10 seconds
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      retryWrites: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    }).catch((error) => {
      // Reset promise on error so we can retry
      cached.promise = null;
      
      // Provide helpful error message for IP whitelist issues
      if (error?.message?.includes('IP') || error?.message?.includes('whitelist')) {
        const enhancedError = new Error(
          error.message + '\n\n' +
          '🔧 FIX: Add 0.0.0.0/0 to MongoDB Atlas IP Whitelist:\n' +
          '1. Go to MongoDB Atlas → Network Access\n' +
          '2. Click "ADD IP ADDRESS"\n' +
          '3. Click "ALLOW ACCESS FROM ANYWHERE" (or enter 0.0.0.0/0)\n' +
          '4. Wait 1-2 minutes for changes to apply\n' +
          'See FIX_MONGODB_ATLAS_IP.md for detailed instructions.'
        );
        throw enhancedError;
      }
      
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;



