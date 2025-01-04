const Creator = require('../models/creator.model');

exports.getCreators = async (req, res) => {
  try {
    const creators = await Creator.find();
    res.json(creators);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateCreators = async (req, res) => {
  try {
    await Creator.deleteMany({});
    await Creator.insertMany(req.body);
    res.json({ message: 'Creators mis à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};