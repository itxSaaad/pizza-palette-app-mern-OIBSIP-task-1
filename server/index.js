// Import required packages
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

// Import Configs and Middlewares
const connectDb = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddlewares');

// Import Routes

// Configure DotEnv
dotenv.config();

// Create Express App
const app = express();

// Connect to Database
connectDb();

// Configure Middlewares
if (process.env.NODE_ENV === 'development') {
  // Use morgan for logging during development
  app.use(morgan('dev'));
}

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON data
app.use(express.json());

// Basic route for the root URL
app.get('/', (req, res) => {
  res.send(
    "Hey, Champ! Guess what? Your API's playing hide and seek, but it's winning every time. It's Working Perfect! 😄🕵️‍♂️🚀"
  );
});

// Configure API routes

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Configure Port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
