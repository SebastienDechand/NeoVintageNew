//server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const photoRoutes = require('./routes/photo.routes');
const creatorRoutes = require('./routes/creator.routes');
const authRoutes = require('./routes/auth.routes');
const feedbackRoutes = require('./routes/feedback.routes');

// Route de debug (à supprimer en production)
app.get('/debug', async (req, res) => {
  try {
    res.json({
      env: {
        node_env: process.env.NODE_ENV,
        mongodb_url_exists: !!process.env.MONGODB_URL,
        jwt_secret_exists: !!process.env.JWT_SECRET
      },
      mongo: {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('MongoDB connecté avec succès');
    
    // Initialize routes after DB connection
    app.use('/photos', photoRoutes);
    app.use('/creators', creatorRoutes);
    app.use('/auth', authRoutes);
    app.use('/feedbacks', feedbackRoutes);
  })
  .catch(err => {
    console.error('Erreur connexion MongoDB:', err);
    process.exit(1);
  });

// Error handler
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', {
    message: err.message,
    stack: err.stack,
    path: req.path
  });
  
  res.status(500).json({
    error: 'Erreur serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Vercel ou dev server
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server: ${PORT}`));
}