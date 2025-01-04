require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/admin.model');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connecté à MongoDB');

    await Admin.deleteOne({ email: 'neovintage.friperie@gmail.com' });

    const admin = new Admin({
      email: 'neovintage.friperie@gmail.com',
      password: 'Z9a81sd2.',
      firstname: 'Emmanuelle',
      lastname: 'Violay',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin créé avec succès !');
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();