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
const creatorRoutes = require('./routes/creator.route');
const authRoutes = require('./routes/auth.route');
const feedbackRoutes = require('./routes/feedback.route');

// Gestion des erreurs MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

mongoose.connection.on('error', err => {
  console.error('Erreur MongoDB:', err);
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mongoStatus: mongoose.connection.readyState });
});

// Routes
app.use('/photos', photoRoutes);
app.use('/creators', creatorRoutes);
app.use('/auth', authRoutes);
app.use('/feedbacks', feedbackRoutes);

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    error: 'Erreur serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

const PORT = process.env.PORT || 3000;

// En mode Vercel, on exporte l'app
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // En mode développement, on démarre le serveur
  app.listen(PORT, () => console.log(`Server: ${PORT}`));
}