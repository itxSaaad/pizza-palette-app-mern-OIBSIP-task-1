const mongoose = require('mongoose');

let connectionPromise;

// Establish connection to the MongoDB database
const connectDb = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
        return conn.connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        // Serverless functions should return a controlled unavailable response
        // and allow later invocations to retry instead of terminating the process.
        console.error(`MongoDB connection failed: ${error.message}`.red.underline.bold);
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = connectDb;
