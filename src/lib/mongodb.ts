import mongoose from 'mongoose';

// MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global variable to maintain a cached connection across hot reloads
 * in development and to prevent connecting to the database multiple times
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using Mongoose
 * @returns {Promise<Mongoose>} Mongoose connection
 */
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,  // Increase connection pool size
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI!, opts)
        .then((mongoose) => {
          console.log('Connected to MongoDB successfully');
          
          // Add connection event handlers
          mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
          });
          
          mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected, attempting to reconnect...');
            cached.conn = null;
            cached.promise = null;
          });
          
          return mongoose;
        })
        .catch((error) => {
          console.error('Error connecting to MongoDB:', error);
          
          // Clear the promise to allow retry on next request
          cached.promise = null;
          
          // Log specific error messages for common MongoDB connection issues
          if (error.name === 'MongoServerSelectionError') {
            console.error('Could not connect to MongoDB server. Please check your network connection and MongoDB URI.');
          } else if (error.name === 'MongoParseError') {
            console.error('MongoDB connection string is invalid. Please check the URI format.');
          } else if (error.message.includes('Authentication failed')) {
            console.error('MongoDB authentication failed. Please check your username and password.');
          }
          
          throw error;
        });
    } catch (initError) {
      console.error('Failed to initialize MongoDB connection:', initError);
      cached.promise = null;
      throw initError;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (awaitError) {
    // If there's an error during the await, clear the cache to allow retry
    cached.conn = null;
    cached.promise = null;
    console.error('Failed to await MongoDB connection:', awaitError);
    throw awaitError;
  }
  
  return cached.conn;
}

export default connectToDatabase; 