// Import required packages
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// Import Configs and Middlewares
const { connectDb, getConnectionStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddlewares');
const { validateEnv } = require('./utils/envValidator');

// Import Routes
const adminUserRoutes = require('./routes/adminUserRoutes');
const userRoutes = require('./routes/userRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Configure DotEnv
dotenv.config();

// Validate Environment Variables
try {
  validateEnv();
} catch (error) {
  console.error('❌ Environment validation failed:'.red.bold);
  console.error(error.message.red);
  process.exit(1);
}

// Create Express App
const app = express();

// Connect to Database
connectDb();

// Configure Middlewares

// Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.razorpay.com"],
      frameSrc: ["'self'", "https://api.razorpay.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

if (process.env.NODE_ENV === 'development') {
  // Use morgan for logging during development
  app.use(morgan('dev'));
}

// Enable Cross-Origin Resource Sharing with whitelist
// Use FRONTEND_URL as the primary origin, with ALLOWED_ORIGINS for additional origins
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const additionalOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

// Combine frontend URL with additional origins, remove duplicates
const allowedOrigins = [...new Set([frontendUrl, ...additionalOrigins])];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV === 'production') {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Parse incoming JSON data
app.use(express.json());

// Parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize());

// Health check endpoints
app.get('/health', (req, res) => {
  const dbStatus = getConnectionStatus();
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    environment: process.env.NODE_ENV
  });
});

app.get('/ready', (req, res) => {
  const dbStatus = getConnectionStatus();
  
  if (dbStatus.status === 'connected') {
    res.status(200).json({
      status: 'READY',
      message: 'Application is ready to accept requests'
    });
  } else {
    res.status(503).json({
      status: 'NOT_READY',
      message: 'Database connection not ready',
      database: dbStatus
    });
  }
});

// Basic route for the root URL
app.get('/', (req, res) => {
  res.send(
    `<section style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <h1 style="color: #4CAF50;">Hello, Code Wizard!</h1>
      <h3 style="color: #FF9800;">Got a moment?</h3>
      <p style="font-size: 1.2em;">Your API is not just running; it's sprinting like Usain Bolt!</p>
      <div style="margin-top: 20px;">
        <p style="font-size: 1.5em; font-weight: bold;">Everything is Awesome!</p>
        <p style="font-size: 1.2em;">💻✨🚀</p>
      </div>
      <footer style="margin-top: 30px; font-size: 0.8em; color: #9E9E9E;">
        <p>Need more magic? Explore the code and unleash your creativity!</p>
        <p>Happy coding, developer! 🎉</p>
      </footer>
    </section>`
  );
});

// Configure API routes
app.use('/api/admin', adminUserRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stocks', inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);

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
