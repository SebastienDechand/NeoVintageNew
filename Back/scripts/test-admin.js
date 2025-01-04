require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const Admin = require(path.join(__dirname, '../models/admin.model'));

async function testAdmin() {
  try {
    console.log('Tentative de connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connecté à MongoDB');

    console.log('Recherche de l\'admin...');
    const admin = await Admin.findOne({ email: 'neovintage.friperie@gmail.com' });
    
    if (admin) {
      console.log('Admin trouvé !');
      console.log({
        email: admin.email,
        firstname: admin.firstname,
        lastname: admin.lastname,
        role: admin.role,
        createdAt: admin.createdAt
      });
    } else {
      console.log('Aucun admin trouvé. Création d\'un nouvel admin...');
      
      const newAdmin = new Admin({
        email: 'neovintage.friperie@gmail.com',
        password: 'Z9a81sd2.',
        firstname: 'Emmanuelle',
        lastname: 'Violay',
        role: 'admin'
      });

      await newAdmin.save();
      console.log('Nouvel admin créé avec succès !');
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
    process.exit(0);
  }
}

testAdmin();