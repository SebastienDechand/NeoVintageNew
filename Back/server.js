require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

const photoRoutes = require('./routes/photo.routes');
const creatorRoutes = require('./routes/creator.routes');
const authRoutes = require('./routes/auth.routes');
const feedbackRoutes = require('./routes/feedback.routes');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connecté à MongoDB');
  } catch (err) {
    console.error('Erreur de connexion MongoDB:', err.message);
    console.error('Stack:', err.stack);
    throw err;  
  }
};

app.get('/debug', (req, res) => {
  res.json({
    env: {
      node_env: process.env.NODE_ENV,
      mongodb_url_exists: !!process.env.MONGODB_URL,
      jwt_secret_exists: !!process.env.JWT_SECRET
    },
    mongo: {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host
    }
  });
});

connectDB().then(() => {
  app.use('/photos', photoRoutes);
  app.use('/creators', creatorRoutes);
  app.use('/auth', authRoutes);
  app.use('/feedbacks', feedbackRoutes);

  app.use((err, req, res, next) => {
    console.error('Erreur serveur:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
    
    res.status(500).json({
      error: 'Erreur serveur',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue',
      path: req.path
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({ 
      error: 'Route non trouvée',
      path: req.originalUrl
    });
  });

}).catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => console.log(`Server: ${PORT}`));
}