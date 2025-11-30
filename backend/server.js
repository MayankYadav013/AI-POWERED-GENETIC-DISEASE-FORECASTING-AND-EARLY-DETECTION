const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
const defaultOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim());
const corsOptions = process.env.CLIENT_URL === '*'
  ? { origin: '*' }
  : { origin: defaultOrigins, credentials: true };

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'backend', timestamp: Date.now() }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/predict', require('./routes/predict'));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ msg: err.message || 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));