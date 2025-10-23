const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Normalize CLIENT_URL so users can supply either 'example.com' or 'https://example.com'
const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const normalizeOrigin = (u) => {
  if (!u) return u;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return `https://${u}`;
};
const clientOrigin = normalizeOrigin(rawClientUrl);

// Allowlist common dev origins plus the configured client origin
const allowedOrigins = new Set([
  clientOrigin,
  'http://localhost:5173',
  'http://localhost:3000',
]);

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser (e.g., server-to-server) requests with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);

    // Fallback: allow matching by hostname (helps when protocol is omitted or different)
    try {
      const originHost = new URL(origin).hostname;
      let clientHost = '';
      try {
        clientHost = new URL(clientOrigin).hostname;
      } catch (e) {
        // If clientOrigin isn't a full URL for some reason, strip protocol
        clientHost = clientOrigin.replace(/^https?:\/\//, '');
      }

      if (originHost === clientHost) return callback(null, true);
      // Allow localhost for dev tools and previews
      if (originHost === 'localhost' || originHost === '127.0.0.1') return callback(null, true);
    } catch (e) {
      // fall through to error
    }

    // For debugging, include the offending origin in the error
    return callback(new Error('CORS policy: origin not allowed - ' + origin));
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Use centralized DB connect utility (improves reuse and better error handling)
const connectDB = require('./config/db');

// Connect to MongoDB (non-blocking). The connect utility logs success or exits on failure.
connectDB().then(() => {
  console.log('✅ MongoDB connection established (or previously connected)');
}).catch(err => {
  // connectDB already logs the error; we continue to start the server but the app
  // handlers check mongoose.connection.readyState and return 503 where appropriate.
  console.warn('⚠️  Continuing startup despite DB connection failure. Some features will be limited.');
});

// Routes
// Mount routes under both /api/* and /* to be tolerant of different client configs
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/favorites', '/favorites'], favoriteRoutes);

// Serve frontend in production (single-deploy)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(clientDist));

  // SPA fallback: for any GET request that is not for the API and doesn't look like a file,
  // return index.html so the client-side router can handle the route.
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api')) return next();
    // If request has a file extension (e.g., .js, .css, .png), skip
    if (path.extname(req.path)) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Health check endpoint
// Health check handler (mounted under /api/health and /health for compatibility)
const healthHandler = (req, res) => {
  const dbState = mongoose.connection.readyState; // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbConnected = dbState === 1;
  res.json({ status: 'OK', message: 'Pokedex API is running!', dbConnected });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
