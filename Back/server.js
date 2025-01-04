require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

const photoRoutes = require('./routes/photo.routes');
const creatorRoutes = require('./routes/creator.route');
const authRoutes = require('./routes/auth.route');
const feedbackRoutes = require('./routes/feedback.route');

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

mongoose.connection.on('error', err => {
  console.error('Erreur MongoDB:', err);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', mongoStatus: mongoose.connection.readyState });
});

app.use('/photos', photoRoutes);
app.use('/creators', creatorRoutes);
app.use('/auth', authRoutes);
app.use('/feedbacks', feedbackRoutes);

app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    error: 'Erreur serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => console.log(`Server: ${PORT}`));
}