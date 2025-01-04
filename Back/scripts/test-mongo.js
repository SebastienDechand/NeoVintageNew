require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connexion MongoDB établie'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));
