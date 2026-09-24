require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Routes =====
const petRoutes = require('./routes/petRoutes');
const authRoutes = require('./routes/auth');
const adoptionRoutes = require('./routes/adoptionRoutes');
const postRoutes = require('./routes/postRoutes');
const donationRoutes = require('./routes/donationRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Use routes
app.use('/api/pets', petRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Test Route 
app.get('/', (req, res) => {
  res.send('🐾 PetConnect API is alive!');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exitCode = 1;
  }
};

startServer();

// Export app for testing
module.exports = app;
