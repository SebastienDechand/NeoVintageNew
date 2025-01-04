require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/admin.model');

async function resetAdmin() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL);

    console.log('Suppression des admins existants...');
    await Admin.deleteMany({});

    console.log('Création du nouvel admin...');
    const admin = new Admin({
      email: 'neovintage.friperie@gmail.com',
      password: 'Z9a81sd2.',  
      firstname: 'Emmanuelle',
      lastname: 'Violay',
      role: 'admin'
    });

    await admin.save();
    
    const newAdmin = await Admin.findOne({ email: 'neovintage.friperie@gmail.com' });
    console.log('Admin créé avec succès:', {
      email: newAdmin.email,
      firstname: newAdmin.firstname,
      lastname: newAdmin.lastname,
      role: newAdmin.role
    });

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

resetAdmin();