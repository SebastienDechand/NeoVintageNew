const Photo = require('../models/photo.model');

exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updatePhotos = async (req, res) => {
  try {
    await Photo.deleteMany({});
    await Photo.insertMany(req.body);
    res.json({ message: 'Photos mises à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};