import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'test') {
      return null;
    }
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // Reuse active connection if readyState === 1 (Connected)
  if (cached.conn && cached.conn.connection && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is dead or closing, reset cached promise to establish fresh connection
  if (cached.conn && cached.conn.connection && cached.conn.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5s bounded timeout to prevent 30s hangs
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
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

export default dbConnect;
