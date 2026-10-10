const mongoose = require('mongoose');

// Singleton pattern for MongoDB connection
let cachedConnection = null;
let connectionPromise = null;

// Establish connection to the MongoDB database
const connectDb = async () => {
  // Return cached connection if exists (for serverless functions)
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  if (connectionPromise) return connectionPromise;

  connectionPromise = mongoose.connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE) || 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  try {
    const conn = await connectionPromise;

    cachedConnection = conn;

    // Connection successful; log the host information
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected'.yellow);
      cachedConnection = null;
      connectionPromise = null;
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`.red);
      cachedConnection = null;
      connectionPromise = null;
    });

    return conn;
  } catch (error) {
    // Connection failed; log the error
    console.error(`Error: ${error.message}`.red.underline.bold);
    cachedConnection = null;
    connectionPromise = null;

    throw error;
  }
};

// Get MongoDB connection status
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return {
    status: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState
  };
};

module.exports = { connectDb, getConnectionStatus };
