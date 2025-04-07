require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

// Connect to Database
connectDB();

const app = express();
// const port = process.env.PORT || 3000; // This was unused, PORT (uppercase) is used below

// Middleware to parse JSON bodies
app.use(express.json());

// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);
// Request Logging Middleware
app.use(requestLogger);

// Define Routes (Placeholders for now)
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/properties', require('./routes/properties'));

app.get('/', (req, res) => {
  res.send('Hello World from Backend!');
});

// Global Error Handling Middleware (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  )
);

// Handle unhandled promise rejections (optional but good practice)
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
