require('dotenv').config();
const mongoose = require('mongoose');
const { Photo, Creator } = require('../models/');
const Admin = require('../models/admin.model');
const photos = require('../data/photos.json');
const creators = require('../data/creators.json');
const adminData = require('../data/admin.json');

async function initDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (!existingAdmin) {
      const admin = new Admin(adminData);
      await admin.save();
      console.log('Admin créé avec succès');
    }

    await Photo.deleteMany({});
    await Creator.deleteMany({});
    
    await Photo.insertMany(photos);
    await Creator.insertMany(creators);
    
    console.log('Base de données initialisée');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  } finally {
    process.exit(0);
  }
}

initDb();